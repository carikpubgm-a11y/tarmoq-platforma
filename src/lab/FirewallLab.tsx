import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, ChevronDown, CircleCheck, Globe, MonitorSmartphone, Send, Square, Trash2, Wand2, BrickWall } from 'lucide-react'
import { Btn, Stage, cx } from '../components/ui'
import { saveResult, useStored } from '../lib/storage'

type Zone = 'lan' | 'wan'
type Svc = 'http' | 'https' | 'dns' | 'ssh' | 'ftp' | 'telnet' | 'rdp' | 'smtp' | 'unknown'
interface Rule { id: string; action: 'allow' | 'deny'; svc: Svc | 'any'; from: Zone | 'any'; to: Zone | 'any' }
interface Packet { id: string; from: Zone; to: Zone; svc: Svc; why: string; expect?: 'allow' | 'deny' }
interface Config { rules: Rule[]; defaultAllow: boolean }

const SVC: Record<Svc, { label: string; port: number; proto: string }> = {
  http: { label: 'HTTP', port: 80, proto: 'TCP' }, https: { label: 'HTTPS', port: 443, proto: 'TCP' }, dns: { label: 'DNS', port: 53, proto: 'UDP' },
  ssh: { label: 'SSH', port: 22, proto: 'TCP' }, ftp: { label: 'FTP', port: 21, proto: 'TCP' }, telnet: { label: 'Telnet', port: 23, proto: 'TCP' },
  rdp: { label: 'RDP', port: 3389, proto: 'TCP' }, smtp: { label: 'SMTP', port: 25, proto: 'TCP' }, unknown: { label: 'Nomaʼlum', port: 6667, proto: 'TCP' },
}
const ZONE: Record<Zone | 'any', string> = { lan: 'Ichki tarmoq (LAN)', wan: 'Internet', any: 'Istalgan' }

const PACKETS: Packet[] = [
  { id: 'p1', from: 'lan', to: 'wan', svc: 'http', why: 'Oʻquvchi oddiy saytni ochmoqda', expect: 'allow' },
  { id: 'p2', from: 'lan', to: 'wan', svc: 'https', why: 'Oʻquvchi elektron jurnalga kirmoqda', expect: 'allow' },
  { id: 'p3', from: 'lan', to: 'wan', svc: 'dns', why: 'Kompyuter sayt nomini manzilga aylantirmoqda', expect: 'allow' },
  { id: 'p4', from: 'wan', to: 'lan', svc: 'ssh', why: 'Internetdan serverimizga kirish urinishi', expect: 'deny' },
  { id: 'p5', from: 'lan', to: 'wan', svc: 'unknown', why: 'Nomaʼlum dastur tashqariga ulanmoqda', expect: 'deny' },
  { id: 'p6', from: 'wan', to: 'lan', svc: 'rdp', why: 'Internetdan ish stolimizga ulanish urinishi', expect: 'deny' },
  { id: 'p7', from: 'wan', to: 'lan', svc: 'telnet', why: 'Eski, himoyasiz protokol bilan kirish urinishi', expect: 'deny' },
  { id: 'p8', from: 'lan', to: 'wan', svc: 'smtp', why: 'Virus yuqqan kompyuter spam tarqatmoqda', expect: 'deny' },
]

const START: Config = { rules: [], defaultAllow: true }
const SOLUTION: Config = {
  defaultAllow: false,
  rules: [
    { id: 's1', action: 'deny', svc: 'ssh', from: 'wan', to: 'lan' },
    { id: 's2', action: 'allow', svc: 'http', from: 'lan', to: 'wan' },
    { id: 's3', action: 'allow', svc: 'https', from: 'lan', to: 'wan' },
    { id: 's4', action: 'allow', svc: 'dns', from: 'lan', to: 'wan' },
  ],
}

/** «Nima qilaman?» — ishni boshlash uchun toʻrt qadam. */
const STEPS: { e: string; t: string; d: string }[] = [
  { e: '➕', t: 'Qoida qoʻshing', d: 'Boʻsh qoida paydo boʻladi.' },
  { e: '✅', t: 'Ruxsat yoki taqiq', d: 'Nimaga, qayerdan, qayerga — tanlang.' },
  { e: '📨', t: 'Xabarlarni yuboring', d: 'Qaysi biri oʻtdi, qaysi biri toʻxtadi?' },
  { e: '✔️', t: 'Toʻrt vazifani bajaring', d: 'Oʻngdagi roʻyxat oʻzi belgilanadi.' },
]

function evaluate(c: Config, p: { from: Zone; to: Zone; svc: Svc }): { allow: boolean; rule: number } {
  for (let i = 0; i < c.rules.length; i++) {
    const r = c.rules[i]
    if ((r.svc === 'any' || r.svc === p.svc) && (r.from === 'any' || r.from === p.from) && (r.to === 'any' || r.to === p.to)) return { allow: r.action === 'allow', rule: i }
  }
  return { allow: c.defaultAllow, rule: -1 }
}

interface LogEntry { key: number; text: string; why: string; allow: boolean; rule: number }
let logSeq = 0

export default function FirewallLab() {
  const [cfg, setCfg] = useStored<Config>('fwlab', START)
  const [log, setLog] = useState<LogEntry[]>([])
  const [anim, setAnim] = useState<{ from: Zone; allow: boolean; phase: 0 | 1 | 2; label: string } | null>(null)
  const [hit, setHit] = useState<number | null>(null)
  const [custom, setCustom] = useState<{ from: Zone; svc: Svc }>({ from: 'lan', svc: 'ftp' })
  const [queue, setQueue] = useState<Packet[]>([])
  const [showMore, setShowMore] = useState(false)
  const touched = useRef(false)

  const set = (next: Config) => { touched.current = true; setCfg(next); setHit(null) }
  const updateRule = (id: string, p: Partial<Rule>) => set({ ...cfg, rules: cfg.rules.map(r => (r.id === id ? { ...r, ...p } : r)) })
  const move = (i: number, d: -1 | 1) => { const rules = [...cfg.rules]; const j = i + d; if (j < 0 || j >= rules.length) return;[rules[i], rules[j]] = [rules[j], rules[i]]; set({ ...cfg, rules }) }

  /* ---- vazifalar: qoidalar toʻplami boʻyicha jonli tekshiriladi ---- */
  const goals = useMemo(() => {
    const ok = (id: string) => { const p = PACKETS.find(x => x.id === id)!; return evaluate(cfg, p).allow === (p.expect === 'allow') }
    return [
      { title: 'Saytlar ochiladi', hint: 'HTTP va HTTPS ga LAN dan Internetga ruxsat bering.', done: ok('p1') && ok('p2') },
      { title: 'Tashqaridan kirish yopiq', hint: 'Internetdan LAN ga SSH ni taqiqlang.', done: ok('p4') },
      { title: 'Keraksiz narsa oʻtmaydi', hint: 'Standart qoidani «taqiq» qilib qoʻying.', done: ok('p5') && ok('p6') && ok('p7') && ok('p8') && !cfg.defaultAllow },
      { title: 'Sayt nomlari ishlaydi', hint: 'DNS ga LAN dan Internetga ruxsat bering.', done: ok('p3') },
    ]
  }, [cfg])
  const score = goals.filter(g => g.done).length
  useEffect(() => {
    if (touched.current) saveResult('firewall', { score, max: goals.length, label: 'Firewall laboratoriyasi', detail: `${score} / ${goals.length} vazifa` })
  }, [score, goals.length])

  /* ---- paket yuborish ---- */
  function fire(p: { from: Zone; to: Zone; svc: Svc; why: string }) {
    const res = evaluate(cfg, p)
    const s = SVC[p.svc]
    setHit(res.rule)
    setAnim({ from: p.from, allow: res.allow, phase: 0, label: s.label })
    setLog(l => [{ key: ++logSeq, allow: res.allow, rule: res.rule, why: p.why, text: `${s.proto} ${ZONE[p.from]} → ${ZONE[p.to]} : ${s.port} (${s.label})` }, ...l].slice(0, 30))
  }
  useEffect(() => {
    if (!anim) return
    if (anim.phase === 0) { const t = setTimeout(() => setAnim(a => (a ? { ...a, phase: 1 } : a)), 40); return () => clearTimeout(t) }
    if (anim.phase === 1) { const t = setTimeout(() => setAnim(a => (a ? { ...a, phase: 2 } : a)), 620); return () => clearTimeout(t) }
  }, [anim])
  useEffect(() => {
    if (!queue.length) return
    const t = setTimeout(() => { fire(queue[0]); setQueue(q => q.slice(1)) }, log.length && queue.length < PACKETS.length ? 1250 : 60)
    return () => clearTimeout(t)
  }, [queue]) // eslint-disable-line react-hooks/exhaustive-deps

  const x = anim ? (anim.phase === 0 ? (anim.from === 'lan' ? 130 : 830) : anim.phase === 1 ? 480 : anim.allow ? (anim.from === 'lan' ? 830 : 130) : 480) : 0
  const sel = 'field-dark !py-1.5 !text-[0.85rem]'
  const tag = 'text-[0.78rem] font-bold text-navy-300'

  return (
    <Stage title="Firewall laboratoriyasi" badge={`${score} / ${goals.length} vazifa`}
      hint={<>Bu — oʻyin-simulyator: haqiqiy sozlamalar oʻzgarmaydi. Qoidalar yuqoridan pastga oʻqiladi, <strong>birinchi mos kelgani</strong> ishlaydi.</>}>
      {/* ---- «Nima qilaman?» ---- */}
      <ol className="no-print mb-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4" aria-label="Nima qilaman?">
        {STEPS.map((st, i) => (
          <li key={st.t} className="flex items-start gap-2.5 rounded-2xl border-2 border-navy-700 bg-navy-900/70 p-3">
            <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-teal-500 font-display text-base font-extrabold text-navy-950">{i + 1}</span>
            <span className="min-w-0">
              <span className="block text-[0.98rem] font-extrabold text-white">{st.e} {st.t}</span>
              <span className="block text-[0.85rem] leading-snug text-navy-300">{st.d}</span>
            </span>
          </li>
        ))}
      </ol>

      {/* ---- sahna ---- */}
      <div className="overflow-x-auto rounded-xl border border-navy-700 bg-[#081229]">
        <svg viewBox="0 0 960 170" className="block h-auto w-full min-w-[620px]" role="img" aria-label="Ichki tarmoq, firewall va Internet oʻrtasidagi trafik">
          <rect x="30" y="30" width="200" height="110" rx="16" fill="rgba(45,212,191,.08)" stroke="#2DD4BF" strokeWidth="1.5" />
          <MonitorSmartphone x={60} y={62} width={34} height={34} color="#2DD4BF" strokeWidth={1.6} />
          <text x="104" y="78" fontSize="15" fontWeight="700" fill="#E4EAF5">Ichki tarmoq</text>
          <text x="104" y="98" fontSize="12" fill="#9AAED3">LAN — bizning sinfimiz</text>
          <rect x="730" y="30" width="200" height="110" rx="16" fill="rgba(96,165,250,.08)" stroke="#60A5FA" strokeWidth="1.5" />
          <Globe x={760} y={62} width={34} height={34} color="#60A5FA" strokeWidth={1.6} />
          <text x="804" y="78" fontSize="15" fontWeight="700" fill="#E4EAF5">Internet</text>
          <text x="804" y="98" fontSize="12" fill="#9AAED3">tashqi dunyo</text>
          <line x1="230" y1="85" x2="730" y2="85" stroke="#41609A" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" />
          <rect x="425" y="20" width="110" height="130" rx="16" fill="rgba(251,146,60,.1)" stroke={anim && anim.phase === 2 ? (anim.allow ? '#34D399' : '#FB7185') : '#FB923C'} strokeWidth="2.5" />
          <BrickWall x={461} y={44} width={38} height={38} color="#FB923C" strokeWidth={1.6} />
          <text x="480" y="108" textAnchor="middle" fontSize="14" fontWeight="700" fill="#E4EAF5">Firewall</text>
          <text x="480" y="128" textAnchor="middle" fontSize="11.5" fill="#9AAED3">{cfg.rules.length} qoida</text>
          {anim && (
            <g style={{ transform: `translate(${x}px, 85px)`, transition: anim.phase === 0 ? 'none' : 'transform .58s cubic-bezier(.4,0,.2,1)' }}>
              <rect x="-34" y="-15" width="68" height="30" rx="15" fill={anim.phase === 2 ? (anim.allow ? '#34D399' : '#FB7185') : '#FBBF24'} stroke="#081229" strokeWidth="3" />
              <text y="5" textAnchor="middle" fontSize="12.5" fontWeight="800" fill="#081229">{anim.phase === 2 && !anim.allow ? '✕ ' : ''}{anim.label}</text>
            </g>
          )}
        </svg>
      </div>

      {/* ---- asosiy tugmalar ---- */}
      <div className="no-print mt-4 flex flex-wrap items-center gap-2.5">
        <Btn variant="primary" size="lg"
          onClick={() => set({ ...cfg, rules: [...cfg.rules, { id: 'r' + Date.now().toString(36), action: 'allow', svc: 'http', from: 'lan', to: 'wan' }] })}>➕ Qoida qoʻshish</Btn>
        <Btn variant="dark" size="lg" disabled={queue.length > 0} onClick={() => setQueue(PACKETS)}>📨 Xabarlarni yuborish</Btn>
        <Btn variant="dark" size="lg" className="!text-rose-200" onClick={() => { set(START); setLog([]); setAnim(null); setQueue([]) }}>🔄 Boshidan</Btn>
        <button type="button" onClick={() => setShowMore(v => !v)} aria-expanded={showMore}
          className="ml-auto inline-flex items-center gap-1.5 rounded-2xl border-2 border-navy-700 px-3.5 py-3 text-sm font-bold text-navy-200 transition hover:border-teal-400 hover:text-white">
          Yana <ChevronDown size={16} className={cx('transition-transform', showMore && 'rotate-180')} />
        </button>
      </div>

      {showMore && (
        <div className="no-print anim-in mt-2.5 flex flex-wrap items-end gap-2.5 rounded-2xl border-2 border-navy-700 bg-navy-900/60 p-3">
          <Btn variant="dark" size="sm" icon={Wand2} onClick={() => set(JSON.parse(JSON.stringify(SOLUTION)) as Config)}>Tayyor yechimni koʻrish</Btn>
          <Btn variant="dark" size="sm" icon={Trash2} disabled={!log.length} onClick={() => { setLog([]); setAnim(null); setHit(null); setQueue([]) }}>Jurnalni tozalash</Btn>
          <label><span className={cx('mb-1 block', tag)}>Oʻz xabaringiz: qayerdan</span>
            <select className={cx(sel, '!w-auto')} value={custom.from} onChange={e => setCustom(c => ({ ...c, from: e.target.value as Zone }))}><option value="lan">LAN dan Internetga</option><option value="wan">Internetdan LAN ga</option></select></label>
          <label><span className={cx('mb-1 block', tag)}>Nimaga</span>
            <select className={cx(sel, '!w-auto')} value={custom.svc} onChange={e => setCustom(c => ({ ...c, svc: e.target.value as Svc }))}>{(Object.keys(SVC) as Svc[]).map(k => <option key={k} value={k}>{SVC[k].label} ({SVC[k].port})</option>)}</select></label>
          <Btn variant="dark" size="sm" icon={Send} onClick={() => fire({ from: custom.from, to: custom.from === 'lan' ? 'wan' : 'lan', svc: custom.svc, why: 'Oʻzingiz tuzgan xabar' })}>Yuborish</Btn>
        </div>
      )}

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        {/* ---- qoidalar ---- */}
        <div className="rounded-xl border border-navy-700 bg-navy-900 p-4">
          <h4 className="mb-3 font-display text-[0.95rem] font-extrabold !text-white">Mening qoidalarim</h4>
          {!cfg.rules.length && <p className="mb-3 rounded-lg border-2 border-dashed border-navy-600 p-3 text-sm text-navy-200">Hozircha qoida yoʻq — hamma xabar oʻtib ketadi. «➕ Qoida qoʻshish»ni bosing.</p>}
          <ol className="space-y-2">
            {cfg.rules.map((r, i) => (
              <li key={r.id} className={cx('rounded-lg border-2 p-2.5 transition-colors', hit === i ? (r.action === 'allow' ? 'border-emerald-400 bg-emerald-500/10' : 'border-rose-400 bg-rose-500/10') : 'border-navy-700 bg-navy-950/40')}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="grid h-7 w-7 flex-none place-items-center rounded-md bg-navy-700 font-mono text-xs font-bold text-white">{i + 1}</span>
                  <select className={cx(sel, '!w-auto font-extrabold', r.action === 'allow' ? '!text-emerald-300' : '!text-rose-300')} value={r.action} aria-label={`${i + 1}-qoida: ruxsat yoki taqiq`} onChange={e => updateRule(r.id, { action: e.target.value as Rule['action'] })}>
                    <option value="allow">✅ Ruxsat</option><option value="deny">⛔ Taqiq</option>
                  </select>
                  <span className={tag}>nimaga</span>
                  <select className={cx(sel, '!w-auto')} value={r.svc} aria-label={`${i + 1}-qoida: nimaga`} onChange={e => updateRule(r.id, { svc: e.target.value as Rule['svc'] })}>
                    <option value="any">hamma narsaga</option>
                    {(Object.keys(SVC) as Svc[]).map(k => <option key={k} value={k}>{SVC[k].label} ({SVC[k].port})</option>)}
                  </select>
                  <span className={tag}>qayerdan</span>
                  <select className={cx(sel, '!w-auto')} value={r.from} aria-label={`${i + 1}-qoida: qayerdan`} onChange={e => updateRule(r.id, { from: e.target.value as Rule['from'] })}>
                    <option value="lan">LAN dan</option><option value="wan">Internetdan</option><option value="any">istalgan joydan</option>
                  </select>
                  <span className={tag}>qayerga</span>
                  <select className={cx(sel, '!w-auto')} value={r.to} aria-label={`${i + 1}-qoida: qayerga`} onChange={e => updateRule(r.id, { to: e.target.value as Rule['to'] })}>
                    <option value="wan">Internetga</option><option value="lan">LAN ga</option><option value="any">istalgan joyga</option>
                  </select>
                  <span className="ml-auto flex gap-1">
                    <button type="button" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`${i + 1}-qoidani yuqoriga koʻtarish`} className="rounded-md border border-navy-600 p-1.5 text-navy-100 hover:border-teal-400 disabled:opacity-30"><ArrowUp size={14} /></button>
                    <button type="button" disabled={i === cfg.rules.length - 1} onClick={() => move(i, 1)} aria-label={`${i + 1}-qoidani pastga tushirish`} className="rounded-md border border-navy-600 p-1.5 text-navy-100 hover:border-teal-400 disabled:opacity-30"><ArrowDown size={14} /></button>
                    <button type="button" onClick={() => set({ ...cfg, rules: cfg.rules.filter(x => x.id !== r.id) })} aria-label={`${i + 1}-qoidani oʻchirish`} className="rounded-md border border-navy-600 p-1.5 text-rose-200 hover:border-rose-400"><Trash2 size={14} /></button>
                  </span>
                </div>
              </li>
            ))}
          </ol>
          <div className={cx('mt-3 flex flex-wrap items-center gap-3 rounded-lg border-2 p-3', hit === -1 ? (cfg.defaultAllow ? 'border-emerald-400 bg-emerald-500/10' : 'border-rose-400 bg-rose-500/10') : 'border-navy-700')}>
            <span className="rounded-md bg-navy-700 px-2 py-1 font-mono text-xs font-bold text-white">STD</span>
            <span className="mr-auto text-sm text-navy-100">Qolgan hammasi (hech bir qoidaga tushmagan xabar)</span>
            <div className="inline-flex overflow-hidden rounded-lg border border-navy-600" role="group" aria-label="Standart qoida">
              <button type="button" aria-pressed={!cfg.defaultAllow} onClick={() => set({ ...cfg, defaultAllow: false })} className={cx('px-3 py-1.5 text-xs font-bold', !cfg.defaultAllow ? 'bg-rose-400 text-navy-950' : 'bg-navy-900 text-navy-100')}>⛔ Taqiq</button>
              <button type="button" aria-pressed={cfg.defaultAllow} onClick={() => set({ ...cfg, defaultAllow: true })} className={cx('px-3 py-1.5 text-xs font-bold', cfg.defaultAllow ? 'bg-emerald-400 text-navy-950' : 'bg-navy-900 text-navy-100')}>✅ Ruxsat</button>
            </div>
          </div>
        </div>

        {/* ---- vazifalar roʻyxati ---- */}
        <div className="rounded-xl border border-navy-700 bg-navy-900 p-4">
          <h4 className="mb-3 font-display text-[0.95rem] font-extrabold !text-white">Toʻrt vazifa — belgilab chiqing</h4>
          <ul className="space-y-2.5" role="status" aria-live="polite">
            {goals.map((g, i) => (
              <li key={i} className={cx('flex gap-2.5 rounded-lg border-2 p-2.5', g.done ? 'border-emerald-400/60 bg-emerald-500/10' : 'border-navy-700')}>
                {g.done
                  ? <CircleCheck size={22} className="mt-0.5 flex-none text-emerald-300" />
                  : <Square size={22} className="mt-0.5 flex-none text-navy-400" />}
                <span><span className={cx('block text-[0.98rem] font-extrabold', g.done ? 'text-emerald-200' : 'text-white')}>{g.title}</span><span className="block text-[0.85rem] leading-snug text-navy-300">{g.hint}</span></span>
              </li>
            ))}
          </ul>
          {score === goals.length && <p className="anim-in mt-3 rounded-lg bg-emerald-500/15 p-3 text-sm font-bold text-emerald-200">🎉 Hammasi bajarildi! Endi 1-qoidani pastga tushirib koʻring — nima buziladi?</p>}
        </div>
      </div>

      {/* ---- sinov xabarlari ---- */}
      <div className="mt-4 rounded-xl border border-navy-700 bg-navy-900 p-4">
        <h4 className="mb-3 font-display text-[0.95rem] font-extrabold !text-white">Sinov xabarlari — bittalab yuborib koʻring</h4>
        <div className="grid gap-2 md:grid-cols-2">
          {PACKETS.map(p => {
            const r = evaluate(cfg, p)
            return (
              <div key={p.id} className="flex items-center gap-2 overflow-hidden rounded-lg border border-navy-700 bg-navy-950/40 p-2.5">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-mono text-xs font-bold text-teal-200">{SVC[p.svc].label} : {SVC[p.svc].port} · {p.from === 'lan' ? 'LAN → Internet' : 'Internet → LAN'}</div>
                  <div className="truncate text-xs text-navy-300" title={p.why}>{p.why}</div>
                </div>
                <span className={cx('flex-none rounded-md px-1.5 py-0.5 text-[0.68rem] font-bold', r.allow === (p.expect === 'allow') ? 'bg-emerald-500/20 text-emerald-200' : 'bg-amber-500/20 text-amber-200')} title="Hozirgi qoidalar bilan natija toʻgʻri chiqadimi">
                  {r.allow === (p.expect === 'allow') ? 'toʻgʻri' : 'xavfli'}
                </span>
                <button type="button" onClick={() => fire(p)} aria-label={`${SVC[p.svc].label} xabarini yuborish`} className="grid h-9 w-9 flex-none place-items-center rounded-lg border border-navy-600 bg-navy-800 text-white hover:border-teal-400"><Send size={15} /></button>
              </div>
            )
          })}
        </div>

        <div className="mt-3 max-h-64 space-y-1.5 overflow-y-auto" role="log" aria-live="polite" aria-label="Firewall jurnali">
          {!log.length && <p className="text-sm text-navy-300">Jurnal boʻsh. Xabar yuboring — qaysi qoida ishlaganini shu yerda koʻrasiz.</p>}
          {log.map(e => (
            <div key={e.key} className={cx('anim-in grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border-l-4 bg-navy-950/50 px-3 py-2', e.allow ? 'border-emerald-400' : 'border-rose-400')}>
              <span className={cx('font-mono text-xs font-bold', e.allow ? 'text-emerald-300' : 'text-rose-300')}>{e.allow ? '✓ OʻTDI' : '✕ TOʻXTADI'}</span>
              <span className="min-w-0"><span className="block truncate font-mono text-xs text-navy-100">{e.text}</span><span className="block truncate text-xs text-navy-300">{e.why}</span></span>
              <span className="rounded-md bg-navy-700 px-2 py-0.5 font-mono text-xs font-bold text-white">{e.rule >= 0 ? e.rule + 1 + '-qoida' : 'STD'}</span>
            </div>
          ))}
        </div>
      </div>
    </Stage>
  )
}
