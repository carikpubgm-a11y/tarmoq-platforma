import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  Monitor, Laptop, Printer, Server, Network, Router, Wifi, BrickWall, MousePointer2, Cable, Wand2, LayoutDashboard, RotateCcw,
  Send, Trash2, Unplug, PlugZap, CircleCheck, CircleX, TriangleAlert, Info, Plus, type LucideIcon,
} from 'lucide-react'
import { Btn, Stage, cx } from '../components/ui'
import {
  KIND, KIND_ORDER, TOPO_FACTS, arrange, autoAddress, components, detectTopology, diagnose, fieldError, nextName, ping, uid,
  type Device, type DeviceKind, type LabState, type PingResult,
} from '../lib/net'
import { EMPTY, PRESETS, type PresetKey } from './presets'

const W = 960, H = 540, R = 30
const ICON: Record<DeviceKind, LucideIcon> = { pc: Monitor, laptop: Laptop, printer: Printer, server: Server, switch: Network, router: Router, ap: Wifi, firewall: BrickWall }
const COLOR: Record<DeviceKind, string> = { pc: '#93C5FD', laptop: '#93C5FD', printer: '#FCD34D', server: '#C4B5FD', switch: '#2DD4BF', router: '#60A5FA', ap: '#A78BFA', firewall: '#FB923C' }

interface Props {
  value: LabState
  onChange: (s: LabState) => void
  title?: string
  presetKeys?: PresetKey[]
  /** Qoʻshimcha andozalar (masalan, namunaviy yechim) */
  extraPresets?: { label: string; state: LabState }[]
  onPing?: (r: PingResult) => void
  onCut?: () => void
  hint?: ReactNode
}

function Field({ label, value, onChange, error, placeholder }: { label: string; value: string; onChange: (v: string) => void; error?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-navy-300">{label}</span>
      <input className={cx('field-dark font-mono', error && '!border-rose-400')} value={value} placeholder={placeholder} inputMode="decimal" autoComplete="off" spellCheck={false}
        onChange={e => onChange(e.target.value)} aria-invalid={!!error} />
      {error && <span className="mt-1 block text-xs leading-snug text-rose-300">{error}</span>}
    </label>
  )
}

export default function NetworkLab({ value: s, onChange, title = 'Tarmoq konstruktori', presetKeys = ['star', 'bus', 'ring', 'mesh', 'office', 'twoNets'], extraPresets = [], onPing, onCut, hint }: Props) {
  const [mode, setMode] = useState<'select' | 'connect'>('select')
  const [sel, setSel] = useState<{ t: 'device' | 'link'; id: string } | null>(null)
  const [pending, setPending] = useState<string | null>(null)
  const [src, setSrc] = useState('')
  const [dst, setDst] = useState('')
  const [run, setRun] = useState<{ res: PingResult; step: number } | null>(null)
  const [tab, setTab] = useState<'ping' | 'topo' | 'check'>('ping')
  const [msg, setMsg] = useState('Qurilma qoʻshing yoki tayyor andozani yuklang.')
  const svgRef = useRef<SVGSVGElement>(null)
  const drag = useRef<{ id: string; dx: number; dy: number; moved: boolean } | null>(null)
  const reported = useRef<PingResult | null>(null)

  const byId = useMemo(() => new Map(s.devices.map(d => [d.id, d])), [s.devices])
  const topo = useMemo(() => detectTopology(s), [s])
  const findings = useMemo(() => diagnose(s), [s])
  const comps = useMemo(() => components(s), [s])
  const mainComp = useMemo(() => new Set(comps[0] ?? []), [comps])
  const l3 = s.devices.filter(d => KIND[d.kind].l3)
  const selDev = sel?.t === 'device' ? byId.get(sel.id) : undefined
  const selLink = sel?.t === 'link' ? s.links.find(l => l.id === sel.id) : undefined
  const errors = findings.filter(f => f.level === 'error').length

  const commit = (next: LabState) => { onChange(next); setRun(null) }

  /* ---- paket animatsiyasi ---- */
  const done = !!run && run.step >= run.res.path.length - 1
  useEffect(() => {
    if (!run || done) return
    const t = setTimeout(() => setRun(r => (r ? { ...r, step: r.step + 1 } : r)), 620)
    return () => clearTimeout(t)
  }, [run, done])
  useEffect(() => {
    if (run && done && reported.current !== run.res) { reported.current = run.res; onPing?.(run.res) }
  }, [run, done, onPing])

  /* ---- tanlov eskirib qolmasin ---- */
  useEffect(() => {
    if (sel?.t === 'device' && !byId.has(sel.id)) setSel(null)
    if (sel?.t === 'link' && !s.links.some(l => l.id === sel.id)) setSel(null)
    if (src && !byId.has(src)) setSrc('')
    if (dst && !byId.has(dst)) setDst('')
    if (pending && !byId.has(pending)) setPending(null)
  }, [s, byId]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ---- amallar ---- */
  function addDevice(kind: DeviceKind) {
    const rows = kind === 'router' || kind === 'firewall' ? [80, 190, 300, 410] : kind === 'switch' || kind === 'ap' ? [230, 120, 340, 450] : [430, 330, 480, 230, 130]
    let spot = { x: W / 2, y: rows[0] }
    outer: for (const y of rows) for (let k = 0; k < 9; k++) {
      const x = W / 2 + (k % 2 ? -1 : 1) * Math.ceil(k / 2) * 100
      if (x < 60 || x > W - 60) continue
      if (!s.devices.some(d => Math.hypot(d.x - x, d.y - y) < 86)) { spot = { x, y }; break outer }
    }
    const d: Device = { id: uid('d'), kind, name: nextName(s, kind), ...spot }
    commit({ ...s, devices: [...s.devices, d] })
    setSel({ t: 'device', id: d.id })
    setMsg(`${d.name} qoʻshildi. Uni surib joylashtiring, soʻng «Kabel ulash» rejimida boshqa qurilmaga ulang.`)
  }
  function addLink(a: string, b: string) {
    if (a === b) return
    if (s.links.some(l => (l.a === a && l.b === b) || (l.a === b && l.b === a))) { setMsg('Bu ikki qurilma allaqachon ulangan.'); return }
    commit({ ...s, links: [...s.links, { id: uid('l'), a, b }] })
    setMsg(`${byId.get(a)!.name} ↔ ${byId.get(b)!.name} ulandi. Yana kabel tortish uchun keyingi qurilmani bosing.`)
  }
  function patch(id: string, p: Partial<Device>) {
    commit({ ...s, devices: s.devices.map(d => (d.id === id ? { ...d, ...p } : d)) })
  }
  function removeDevice(id: string) {
    commit({ devices: s.devices.filter(d => d.id !== id), links: s.links.filter(l => l.a !== id && l.b !== id) })
    setSel(null); setMsg('Qurilma va unga ulangan kabellar oʻchirildi.')
  }
  function toggleLink(id: string) {
    const l = s.links.find(x => x.id === id)!
    commit({ ...s, links: s.links.map(x => (x.id === id ? { ...x, down: !x.down } : x)) })
    if (!l.down) onCut?.()
    setMsg(l.down ? 'Kabel tiklandi.' : 'Kabel uzildi — qaysi qurilmalar aloqasiz qolganiga qarang va paketni qayta yuboring.')
  }
  function removeLink(id: string) { commit({ ...s, links: s.links.filter(l => l.id !== id) }); setSel(null); setMsg('Kabel olib tashlandi.') }
  function load(state: LabState, label: string) {
    if (s.devices.length && !window.confirm('Joriy sxema almashtiriladi. Davom etasizmi?')) return
    commit(JSON.parse(JSON.stringify(state)) as LabState)
    setSel(null); setPending(null); setSrc(''); setDst(''); setMode('select')
    setMsg(`«${label}» andozasi yuklandi.`)
  }
  function reset() {
    if (s.devices.length && !window.confirm('Barcha qurilma va kabellar oʻchiriladi. Qayta boshlaysizmi?')) return
    commit(EMPTY); setSel(null); setPending(null); setSrc(''); setDst(''); setMode('select')
    setMsg('Ish maydoni tozalandi. Qaytadan boshlang.')
  }
  function send() {
    if (!src || !dst) { setMsg('Avval manba va qabul qiluvchi qurilmani tanlang.'); return }
    reported.current = null
    setRun({ res: ping(s, src, dst), step: 0 })
    setTab('ping')
  }

  /* ---- sichqoncha / sensor bilan surish ---- */
  function svgPoint(e: { clientX: number; clientY: number }) {
    const svg = svgRef.current!
    const pt = svg.createSVGPoint()
    pt.x = e.clientX; pt.y = e.clientY
    const m = svg.getScreenCTM()
    return m ? pt.matrixTransform(m.inverse()) : { x: 0, y: 0 }
  }
  function activate(id: string) {
    if (mode === 'connect') {
      if (!pending) { setPending(id); setMsg(`${byId.get(id)!.name} tanlandi. Endi ulanadigan ikkinchi qurilmani bosing.`) }
      else if (pending === id) { setPending(null); setMsg('Tanlov bekor qilindi.') }
      else { addLink(pending, id); setPending(null) }
    } else {
      setSel({ t: 'device', id })
    }
  }
  function onNodeDown(e: React.PointerEvent, d: Device) {
    e.stopPropagation()
    const p = svgPoint(e)
    drag.current = { id: d.id, dx: p.x - d.x, dy: p.y - d.y, moved: false }
    try { (e.currentTarget as Element).setPointerCapture(e.pointerId) } catch { /* sintetik hodisalarda pointer boʻlmasligi mumkin */ }
  }
  function onNodeMove(e: React.PointerEvent) {
    const g = drag.current
    if (!g || mode === 'connect') return
    const p = svgPoint(e)
    const x = Math.max(R + 8, Math.min(W - R - 8, p.x - g.dx)), y = Math.max(R + 8, Math.min(H - 52, p.y - g.dy))
    const cur = byId.get(g.id)
    if (!cur) return
    if (!g.moved && Math.hypot(cur.x - x, cur.y - y) < 4) return
    g.moved = true
    onChange({ ...s, devices: s.devices.map(d => (d.id === g.id ? { ...d, x: Math.round(x), y: Math.round(y) } : d)) })
  }
  function onNodeUp(e: React.PointerEvent, d: Device) {
    const g = drag.current
    drag.current = null
    try { (e.currentTarget as Element).releasePointerCapture(e.pointerId) } catch { /* ignore */ }
    if (g && !g.moved) activate(d.id)
  }
  function onNodeKey(e: React.KeyboardEvent, d: Device) {
    const step = e.shiftKey ? 30 : 10
    const move = (dx: number, dy: number) => { e.preventDefault(); patch(d.id, { x: Math.max(R + 8, Math.min(W - R - 8, d.x + dx)), y: Math.max(R + 8, Math.min(H - 52, d.y + dy)) }) }
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(d.id) }
    else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); removeDevice(d.id) }
    else if (e.key === 'ArrowLeft') move(-step, 0)
    else if (e.key === 'ArrowRight') move(step, 0)
    else if (e.key === 'ArrowUp') move(0, -step)
    else if (e.key === 'ArrowDown') move(0, step)
  }

  /* ---- chizish uchun hisob-kitoblar ---- */
  const pathNow = run ? run.res.path.slice(0, run.step + 1) : []
  const hotLinks = new Set<string>()
  for (let i = 0; i + 1 < pathNow.length; i++) {
    const l = s.links.find(x => (x.a === pathNow[i] && x.b === pathNow[i + 1]) || (x.b === pathNow[i] && x.a === pathNow[i + 1]))
    if (l) hotLinks.add(l.id)
  }
  const pktAt = run ? byId.get(run.res.path[Math.min(run.step, run.res.path.length - 1)]) : undefined
  const facts = topo.key === 'star' || topo.key === 'bus' || topo.key === 'ring' || topo.key === 'mesh' ? TOPO_FACTS[topo.key] : null

  return (
    <Stage title={title} badge={`${s.devices.length} qurilma · ${s.links.length} kabel · ${topo.name}`}
      hint={hint ?? <>Bu — oʻquv simulyatsiyasi: haqiqiy tarmoq boshqarilmaydi. Loyiha shu brauzerda avtomatik saqlanadi.</>}>
      {/* ---- qurilmalar palitrasi ---- */}
      <div className="no-print mb-3 flex flex-wrap gap-2" role="group" aria-label="Qurilma qoʻshish">
        {KIND_ORDER.map(k => {
          const I = ICON[k]
          return (
            <button key={k} type="button" onClick={() => addDevice(k)} title={KIND[k].desc}
              className="inline-flex items-center gap-2 rounded-xl border border-navy-600 bg-navy-900 px-3 py-2 text-sm font-semibold text-white transition hover:border-teal-400 hover:bg-navy-800">
              <I size={17} style={{ color: COLOR[k] }} /><span>{KIND[k].label}</span><Plus size={14} className="text-navy-300" />
            </button>
          )
        })}
      </div>

      {/* ---- rejim va amallar ---- */}
      <div className="no-print mb-3 flex flex-wrap items-center gap-2">
        <div className="inline-flex overflow-hidden rounded-xl border border-navy-600" role="group" aria-label="Ish rejimi">
          <button type="button" aria-pressed={mode === 'select'} onClick={() => { setMode('select'); setPending(null); setMsg('Tanlash rejimi: qurilmani bosib tanlang, surib joyini oʻzgartiring.') }}
            className={cx('inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold', mode === 'select' ? 'bg-teal-500 text-navy-950' : 'bg-navy-900 text-white hover:bg-navy-800')}><MousePointer2 size={16} /> Tanlash va surish</button>
          <button type="button" aria-pressed={mode === 'connect'} onClick={() => { setMode('connect'); setPending(null); setMsg('Kabel ulash rejimi: avval birinchi, keyin ikkinchi qurilmani bosing.') }}
            className={cx('inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold', mode === 'connect' ? 'bg-teal-500 text-navy-950' : 'bg-navy-900 text-white hover:bg-navy-800')}><Cable size={16} /> Kabel ulash</button>
        </div>
        <Btn variant="dark" size="sm" icon={Wand2} disabled={!s.devices.some(d => KIND[d.kind].l3)} onClick={() => { commit(autoAddress(s)); setMsg('IP manzillar avtomatik berildi: router — 192.168.1.1, qolganlar — 192.168.1.10 dan boshlab (DHCP kabi).') }}>Avto IP</Btn>
        <Btn variant="dark" size="sm" icon={LayoutDashboard} disabled={!s.devices.length} onClick={() => { commit(arrange(s)); setMsg('Qurilmalar tartibga solindi.') }}>Tartibga solish</Btn>
        <label className="inline-flex items-center gap-2 text-sm text-navy-300">
          <span className="sr-only sm:not-sr-only">Andoza:</span>
          <select className="field-dark !w-auto !py-1.5" value="" aria-label="Tayyor andozani yuklash"
            onChange={e => {
              const v = e.target.value
              if (v.startsWith('x')) { const p = extraPresets[Number(v.slice(1))]; if (p) load(p.state, p.label) }
              else if (v) load(PRESETS[v as PresetKey].state, PRESETS[v as PresetKey].label)
            }}>
            <option value="">Tayyor andoza…</option>
            {presetKeys.map(k => <option key={k} value={k}>{PRESETS[k].label}</option>)}
            {extraPresets.map((p, i) => <option key={i} value={'x' + i}>{p.label}</option>)}
          </select>
        </label>
        <Btn variant="dark" size="sm" icon={RotateCcw} className="ml-auto !text-rose-200" onClick={reset}>Qayta boshlash</Btn>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_19rem]">
        {/* ---- ish maydoni ---- */}
        <div>
          <div className="overflow-x-auto rounded-xl border border-navy-700 bg-[#081229]">
            <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full min-w-[720px] touch-none select-none" data-keys="off"
              role="group" aria-label="Tarmoq sxemasi ish maydoni" onPointerDown={() => { if (mode === 'select') setSel(null) }}>
              <defs>
                <pattern id="labgrid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="rgba(102,130,181,.13)" strokeWidth="1" /></pattern>
              </defs>
              <rect width={W} height={H} fill="url(#labgrid)" />
              {!s.devices.length && (
                <text x={W / 2} y={H / 2} textAnchor="middle" fill="#6682B5" fontSize="18" fontWeight="600">Yuqoridagi tugmalar bilan qurilma qoʻshing yoki «Tayyor andoza»ni tanlang</text>
              )}

              {/* kabellar */}
              {s.links.map(l => {
                const a = byId.get(l.a), b = byId.get(l.b)
                if (!a || !b) return null
                const wifi = (a.kind === 'ap' && KIND[b.kind].host) || (b.kind === 'ap' && KIND[a.kind].host)
                const hot = hotLinks.has(l.id), on = sel?.t === 'link' && sel.id === l.id
                const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
                return (
                  <g key={l.id}>
                    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} strokeLinecap="round"
                      stroke={l.down ? '#FB7185' : hot ? '#2DD4BF' : on ? '#FBBF24' : wifi ? '#A78BFA' : '#6682B5'}
                      strokeWidth={hot || on ? 4 : 2.5} strokeDasharray={l.down ? '4 9' : wifi ? '7 6' : undefined} className={hot && !done ? 'anim-dash' : undefined} />
                    {l.down && <text x={mx} y={my + 6} textAnchor="middle" fontSize="18" fontWeight="800" fill="#FB7185">✕</text>}
                    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="transparent" strokeWidth="18" style={{ cursor: 'pointer' }} tabIndex={0} role="button"
                      aria-label={`${a.name} va ${b.name} orasidagi kabel${l.down ? ' (uzilgan)' : ''}`}
                      onPointerDown={e => { e.stopPropagation(); setSel({ t: 'link', id: l.id }) }}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel({ t: 'link', id: l.id }) } else if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); removeLink(l.id) } }} />
                  </g>
                )
              })}

              {/* qurilmalar */}
              {s.devices.map(d => {
                const I = ICON[d.kind]
                const on = sel?.t === 'device' && sel.id === d.id
                const isPend = pending === d.id
                const lost = comps.length > 1 && !mainComp.has(d.id)
                const failHere = !!run && done && !run.res.ok && run.res.path[run.res.path.length - 1] === d.id
                const stroke = failHere ? '#FB7185' : isPend ? '#FBBF24' : on ? '#2DD4BF' : lost ? '#FB7185' : COLOR[d.kind]
                return (
                  <g key={d.id} tabIndex={0} role="button" style={{ cursor: mode === 'connect' ? 'crosshair' : 'grab' }}
                    aria-label={`${d.name}, ${KIND[d.kind].label}${d.ip ? ', IP ' + d.ip : ''}${lost ? ', aloqasiz' : ''}`} aria-pressed={on}
                    onPointerDown={e => onNodeDown(e, d)} onPointerMove={onNodeMove} onPointerUp={e => onNodeUp(e, d)} onKeyDown={e => onNodeKey(e, d)}>
                    {(on || isPend) && <circle cx={d.x} cy={d.y} r={R + 8} fill="none" stroke={stroke} strokeWidth="1.5" strokeDasharray="4 5" className="anim-dash" />}
                    <circle cx={d.x} cy={d.y} r={R} fill={lost ? 'rgba(251,113,133,.14)' : 'rgba(148,170,210,.13)'} stroke={stroke} strokeWidth={on || isPend || failHere ? 3 : 2} />
                    <I x={d.x - 13} y={d.y - 13} width={26} height={26} color={lost ? '#FB7185' : COLOR[d.kind]} strokeWidth={1.8} aria-hidden="true" />
                    <text x={d.x} y={d.y + R + 17} textAnchor="middle" fontSize="13.5" fontWeight="700" fill="#E4EAF5">{d.name}</text>
                    {KIND[d.kind].l3 && <text x={d.x} y={d.y + R + 32} textAnchor="middle" fontSize="10.5" fontFamily="'JetBrains Mono Variable', ui-monospace, monospace" fill={d.ip ? (fieldError('ip', d.ip, d) ? '#FB7185' : '#5EEAD4') : '#6682B5'}>{d.ip || 'IP yoʻq'}</text>}
                  </g>
                )
              })}

              {/* paket */}
              {run && pktAt && (
                <g style={{ transform: `translate(${pktAt.x}px, ${pktAt.y - R - 14}px)`, transition: 'transform .58s cubic-bezier(.4,0,.2,1)' }} pointerEvents="none">
                  <circle r="11" fill={done ? (run.res.ok ? '#34D399' : '#FB7185') : '#FBBF24'} stroke="#081229" strokeWidth="3" />
                  <text y="4.5" textAnchor="middle" fontSize="12" fontWeight="800" fill="#081229">{done ? (run.res.ok ? '✓' : '✕') : '✉'}</text>
                </g>
              )}
            </svg>
          </div>
          <p className="mt-2 min-h-[1.5rem] text-sm text-teal-200" role="status" aria-live="polite">{msg}</p>
        </div>

        {/* ---- sozlamalar paneli ---- */}
        <aside className="rounded-xl border border-navy-700 bg-navy-900 p-4" aria-label="Tanlangan element sozlamalari">
          {selDev ? (
            <div className="space-y-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-teal-300">{KIND[selDev.kind].label} · {KIND[selDev.kind].layer}</div>
                <p className="mt-1 text-sm leading-snug text-navy-200">{KIND[selDev.kind].desc}</p>
              </div>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-navy-300">Nomi</span>
                <input className="field-dark" value={selDev.name} maxLength={14} onChange={e => patch(selDev.id, { name: e.target.value })} />
              </label>
              {KIND[selDev.kind].l3 ? (
                <>
                  <Field label={selDev.kind === 'router' ? '1-interfeys: IP manzil' : 'IP manzil'} value={selDev.ip ?? ''} placeholder="192.168.1.10" onChange={v => patch(selDev.id, { ip: v })} error={fieldError('ip', selDev.ip, selDev)} />
                  <Field label="Subnet maska" value={selDev.mask ?? ''} placeholder="255.255.255.0" onChange={v => patch(selDev.id, { mask: v })} error={fieldError('mask', selDev.mask)} />
                  {selDev.kind === 'router' ? (
                    <>
                      <Field label="2-interfeys: IP manzil (ixtiyoriy)" value={selDev.ip2 ?? ''} placeholder="192.168.2.1" onChange={v => patch(selDev.id, { ip2: v })} error={fieldError('ip', selDev.ip2)} />
                      <Field label="2-interfeys: maska" value={selDev.mask2 ?? ''} placeholder="255.255.255.0" onChange={v => patch(selDev.id, { mask2: v })} error={fieldError('mask', selDev.mask2)} />
                    </>
                  ) : (
                    <Field label="Shlyuz (gateway)" value={selDev.gateway ?? ''} placeholder="192.168.1.1" onChange={v => patch(selDev.id, { gateway: v })} error={fieldError('gateway', selDev.gateway, selDev)} />
                  )}
                </>
              ) : selDev.kind === 'firewall' ? (
                <label className="flex items-start gap-2.5 rounded-lg border border-navy-700 p-3 text-sm text-navy-100">
                  <input type="checkbox" className="mt-0.5 h-4 w-4 accent-teal-500" checked={!!selDev.blockPing} onChange={e => patch(selDev.id, { blockPing: e.target.checked })} />
                  <span>Ping (ICMP) paketlarini bloklash<span className="mt-0.5 block text-xs text-navy-300">Yoqilsa, shu firewall orqali oʻtadigan sinov paketi toʻxtatiladi.</span></span>
                </label>
              ) : (
                <p className="rounded-lg border border-navy-700 p-3 text-sm leading-snug text-navy-200">Bu 2-qatlam qurilmasi — ishlashi uchun IP manzil shart emas. Unga faqat kabel ulang.</p>
              )}
              <div className="flex flex-wrap gap-2 pt-1">
                <Btn variant="dark" size="sm" icon={Cable} onClick={() => { setMode('connect'); setPending(selDev.id); setMsg(`${selDev.name} dan kabel tortilmoqda — ikkinchi qurilmani bosing.`) }}>Kabel tortish</Btn>
                <Btn variant="dark" size="sm" icon={Trash2} className="!text-rose-200" onClick={() => removeDevice(selDev.id)}>Oʻchirish</Btn>
              </div>
              {s.links.some(l => l.a === selDev.id || l.b === selDev.id) && (
                <div>
                  <div className="mb-1.5 text-xs font-semibold text-navy-300">Ulangan kabellar</div>
                  <ul className="space-y-1.5">
                    {s.links.filter(l => l.a === selDev.id || l.b === selDev.id).map(l => {
                      const o = byId.get(l.a === selDev.id ? l.b : l.a)
                      return (
                        <li key={l.id} className="flex items-center gap-2 text-sm">
                          <span className={cx('flex-1 truncate', l.down ? 'text-rose-300 line-through' : 'text-navy-100')}>↔ {o?.name}</span>
                          <button type="button" onClick={() => toggleLink(l.id)} className="rounded-md border border-navy-600 px-2 py-1 text-xs font-semibold text-navy-100 hover:border-teal-400">{l.down ? 'Tiklash' : 'Uzish'}</button>
                          <button type="button" onClick={() => removeLink(l.id)} aria-label={`${o?.name} bilan kabelni olib tashlash`} className="rounded-md border border-navy-600 p-1 text-rose-200 hover:border-rose-400"><Trash2 size={13} /></button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
          ) : selLink ? (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-teal-300">Kabel</div>
              <p className="font-display text-base font-bold text-white">{byId.get(selLink.a)?.name} ↔ {byId.get(selLink.b)?.name}</p>
              <p className="text-sm text-navy-200">Holati: {selLink.down ? <span className="font-semibold text-rose-300">uzilgan</span> : <span className="font-semibold text-emerald-300">ishlayapti</span>}. Kabelni uzib, topologiya nosozlikka qanchalik chidamli ekanini sinab koʻring.</p>
              <div className="flex flex-wrap gap-2">
                <Btn variant="dark" size="sm" icon={selLink.down ? PlugZap : Unplug} onClick={() => toggleLink(selLink.id)}>{selLink.down ? 'Tiklash' : 'Kabelni uzish'}</Btn>
                <Btn variant="dark" size="sm" icon={Trash2} className="!text-rose-200" onClick={() => removeLink(selLink.id)}>Olib tashlash</Btn>
              </div>
            </div>
          ) : (
            <div className="text-sm leading-relaxed text-navy-200">
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-teal-300">Qanday ishlatiladi</div>
              <ol className="list-decimal space-y-1.5 pl-4">
                <li>Yuqoridan qurilma qoʻshing va surib joylashtiring.</li>
                <li>«Kabel ulash» rejimida ikkita qurilmani ketma-ket bosing.</li>
                <li>Qurilmani tanlab IP, maska va shlyuzni kiriting (yoki «Avto IP»).</li>
                <li>Pastda manba va qabul qiluvchini tanlab, paket yuboring.</li>
                <li>Kabelni bosib «Uzish» — nosozlikni sinang.</li>
              </ol>
              <p className="mt-3 text-xs text-navy-300">Klaviatura: Tab — qurilmalar orasida, strelkalar — surish, Enter — tanlash, Delete — oʻchirish.</p>
            </div>
          )}
        </aside>
      </div>

      {/* ---- pastki panel: paket / topologiya / diagnostika ---- */}
      <div className="mt-4 rounded-xl border border-navy-700 bg-navy-900">
        <div className="flex flex-wrap gap-1 border-b border-navy-700 p-1.5" role="tablist" aria-label="Laboratoriya vositalari">
          {([['ping', 'Paket yuborish'], ['topo', 'Topologiya'], ['check', `Diagnostika${errors ? ' · ' + errors + ' xato' : ''}`]] as const).map(([k, label]) => (
            <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
              className={cx('rounded-lg px-3.5 py-2 text-sm font-semibold', tab === k ? 'bg-teal-500 text-navy-950' : k === 'check' && errors ? 'text-rose-200 hover:bg-navy-800' : 'text-navy-100 hover:bg-navy-800')}>{label}</button>
          ))}
        </div>

        {tab === 'ping' && (
          <div className="p-4" role="tabpanel">
            <div className="flex flex-wrap items-end gap-3">
              <label className="min-w-[10rem] flex-1"><span className="mb-1 block text-xs font-semibold text-navy-300">1. Manba (kimdan)</span>
                <select className="field-dark" value={src} onChange={e => { setSrc(e.target.value); setRun(null) }}>
                  <option value="">Tanlang…</option>
                  {l3.map(d => <option key={d.id} value={d.id}>{d.name}{d.ip ? ' — ' + d.ip : ''}</option>)}
                </select></label>
              <label className="min-w-[10rem] flex-1"><span className="mb-1 block text-xs font-semibold text-navy-300">2. Qabul qiluvchi (kimga)</span>
                <select className="field-dark" value={dst} onChange={e => { setDst(e.target.value); setRun(null) }}>
                  <option value="">Tanlang…</option>
                  {l3.filter(d => d.id !== src).map(d => <option key={d.id} value={d.id}>{d.name}{d.ip ? ' — ' + d.ip : ''}</option>)}
                </select></label>
              <Btn variant="primary" icon={Send} disabled={!src || !dst || (!!run && !done)} onClick={send}>3. Paket yuborish</Btn>
            </div>
            <div className="mt-4" role="status" aria-live="polite">
              {!run && <p className="text-sm text-navy-300">{l3.length < 2 ? 'Paket yuborish uchun kamida ikkita IP manzilli qurilma (kompyuter, server, printer) kerak.' : 'Manba va qabul qiluvchini tanlab, «Paket yuborish» tugmasini bosing — paket sxemada harakatlanadi.'}</p>}
              {run && !done && <p className="text-sm font-semibold text-amber-300">Paket yoʻlda: {pktAt?.name}…</p>}
              {run && done && (
                <div className="anim-in">
                  <div className={cx('flex items-start gap-3 rounded-xl border p-3.5', run.res.ok ? 'border-emerald-400/50 bg-emerald-500/10' : 'border-rose-400/50 bg-rose-500/10')}>
                    {run.res.ok ? <CircleCheck className="mt-0.5 flex-none text-emerald-300" size={22} /> : <CircleX className="mt-0.5 flex-none text-rose-300" size={22} />}
                    <div>
                      <div className={cx('font-display font-bold', run.res.ok ? 'text-emerald-200' : 'text-rose-200')}>{run.res.ok ? 'Aloqa bor — paket yetib bordi' : 'Aloqa yoʻq — paket yetib bormadi'}</div>
                      <p className="mt-0.5 text-sm text-navy-100">{run.res.reason}</p>
                      {run.res.fix && <p className="mt-1.5 text-sm text-amber-200"><strong className="!text-amber-300">Qanday tuzatiladi: </strong>{run.res.fix}</p>}
                    </div>
                  </div>
                  <ol className="mt-3 space-y-1.5 text-sm">
                    {run.res.hops.map((h, i) => (
                      <li key={i} className="flex gap-2.5">
                        <span className={cx('mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full font-mono text-[0.68rem] font-bold', h.state === 'fail' ? 'bg-rose-400 text-navy-950' : h.state === 'ok' ? 'bg-emerald-400 text-navy-950' : 'bg-navy-700 text-navy-100')}>{i + 1}</span>
                        <span className={h.state === 'fail' ? 'text-rose-200' : 'text-navy-100'}>{h.text}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'topo' && (
          <div className="p-4" role="tabpanel">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-lg bg-teal-500 px-3 py-1.5 font-display text-sm font-extrabold text-navy-950" role="status" aria-live="polite">{topo.name}</span>
              <span className="text-sm text-navy-200">{comps.length > 1 ? `Tarmoq ${comps.length} qismga boʻlingan` : s.devices.length > 1 ? 'Barcha qurilmalar bogʻlangan' : ''}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-navy-100">{topo.note}</p>
            {facts && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/5 p-3"><div className="mb-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300">Afzalliklari</div><ul className="space-y-1 text-sm text-navy-100">{facts.pros.map(p => <li key={p}>+ {p}</li>)}</ul></div>
                <div className="rounded-lg border border-rose-400/30 bg-rose-500/5 p-3"><div className="mb-1.5 text-xs font-bold uppercase tracking-wider text-rose-300">Kamchiliklari</div><ul className="space-y-1 text-sm text-navy-100">{facts.cons.map(p => <li key={p}>− {p}</li>)}</ul></div>
              </div>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-navy-300">Taqqoslash uchun yuklang:</span>
              {(['star', 'bus', 'ring', 'mesh'] as PresetKey[]).map(k => <Btn key={k} variant="dark" size="sm" onClick={() => load(PRESETS[k].state, PRESETS[k].label)}>{PRESETS[k].label}</Btn>)}
            </div>
            <p className="mt-3 text-xs text-navy-300">Sinov: sxemadagi kabelni bosing → «Kabelni uzish». Yulduzda bitta qurilma, shinada tarmoqning yarmi aloqasiz qoladi, toʻrda esa hech narsa oʻzgarmaydi.</p>
          </div>
        )}

        {tab === 'check' && (
          <ul className="space-y-2 p-4" role="tabpanel" aria-live="polite">
            {findings.map((f, i) => {
              const I = f.level === 'error' ? CircleX : f.level === 'warn' ? TriangleAlert : f.level === 'ok' ? CircleCheck : Info
              const c = f.level === 'error' ? 'text-rose-300' : f.level === 'warn' ? 'text-amber-300' : f.level === 'ok' ? 'text-emerald-300' : 'text-sky-300'
              return (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <I size={18} className={cx('mt-0.5 flex-none', c)} />
                  <span className="flex-1 text-navy-100">{f.text}</span>
                  {f.device && byId.has(f.device) && <button type="button" onClick={() => { setSel({ t: 'device', id: f.device! }); setMode('select') }} className="flex-none rounded-md border border-navy-600 px-2 py-0.5 text-xs font-semibold text-navy-100 hover:border-teal-400">Koʻrsatish</button>}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </Stage>
  )
}
