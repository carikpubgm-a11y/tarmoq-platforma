import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { Cctv, Monitor, Network, Printer, RotateCcw, Server, Unplug, Wifi, type LucideIcon } from 'lucide-react'
import { Btn, CheckList, Stage, cx } from '../components/ui'

/* Topologiya koʻrgazmasi: yulduz / shina / halqa / toʻr.
   «Aloqani uzish» oldindan belgilangan bitta kanalni uzadi; qaysi tugunlar
   manba tugundan yetib boʻlmaydigan boʻlsa — qizil rangda koʻrsatiladi. */

const C = {
  bg: '#071023',
  fill: 'rgba(148,170,210,.14)',
  stroke: '#6682B5',
  accent: '#2DD4BF',
  danger: '#FB7185',
  amber: '#FBBF24',
  text: '#E4EAF5',
  sub: '#9AAED3',
}

type TopoKey = 'star' | 'bus' | 'ring' | 'mesh'
type LabelPos = 'below' | 'above' | 'left' | 'right'

interface TNode { id: string; x: number; y: number; label: string; icon: LucideIcon; info: string; core?: boolean; pos?: LabelPos }
/** seg — chiziq tugun markazlaridan emas, berilgan kesma boʻylab chiziladi (shina magistrali). dir — bir yoʻnalishli kanal. */
interface TLink { a: string; b: string; seg?: [number, number, number, number]; dir?: boolean }
interface Topo {
  tab: string
  title: string
  /** Aloqa shu tugundan boshlab tekshiriladi. */
  source: string
  nodes: TNode[]
  links: TLink[]
  bus?: boolean
  breakIdx: number
  breakMsg: string
  why: string
  pros: string[]
  cons: string[]
}

const PC = { label: 'Kompyuter', icon: Monitor }
const SRV = { label: 'Server', icon: Server }
const PRN = { label: 'Printer', icon: Printer }
const CAM = { label: 'Kamera', icon: Cctv }
const AP = { label: 'Wi-Fi AP', icon: Wifi }

/** Beshta tugunni aylana boʻylab teng joylashtiradi (birinchisi — tepada). */
function ringPos(radius: number, cx0: number, cy0: number) {
  return Array.from({ length: 5 }, (_, i) => {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2
    return { x: Math.round(cx0 + Math.cos(a) * radius), y: Math.round(cy0 + Math.sin(a) * radius) }
  })
}
const RP = ringPos(148, 450, 205)
const RING_POS: LabelPos[] = ['above', 'right', 'below', 'below', 'left']

const TOPO: Record<TopoKey, Topo> = {
  star: {
    tab: 'Yulduz',
    title: 'Yulduz (star)',
    source: 'sw',
    nodes: [
      { id: 'sw', x: 450, y: 200, label: 'Switch', icon: Network, core: true,
        info: 'Markaziy qurilma. Barcha aloqa shu yerdan oʻtadi — eng muhim nuqta.' },
      { id: 'n1', x: 450, y: 58, ...PC, pos: 'above', info: 'Switchga oʻz kabeli bilan ulangan.' },
      { id: 'n2', x: 752, y: 132, ...PRN, info: 'Butun sinf uchun bitta printer.' },
      { id: 'n3', x: 690, y: 330, ...SRV, info: 'Fayllar shu yerda saqlanadi.' },
      { id: 'n4', x: 210, y: 330, ...CAM, info: 'Kabeli uzilsa, faqat oʻzi aloqasiz qoladi.' },
      { id: 'n5', x: 148, y: 132, ...AP, info: 'Telefon va noutbuklarni simsiz ulaydi.' },
    ],
    links: [
      { a: 'sw', b: 'n1' }, { a: 'sw', b: 'n2' }, { a: 'sw', b: 'n3' }, { a: 'sw', b: 'n4' }, { a: 'sw', b: 'n5' },
    ],
    breakIdx: 1,
    breakMsg: 'Printer kabeli uzildi. Faqat printer aloqasiz qoldi, qolganlari ishlayveradi.',
    why: 'Har qurilmaning oʻz kabeli bor. Lekin markaziy switch buzilsa, butun tarmoq toʻxtaydi.',
    pros: [
      'Bitta kabel uzilsa, faqat bitta qurilma uziladi',
      'Nosozlikni topish oson',
      'Yangi qurilma qoʻshish oson',
      'Bugun eng koʻp ishlatiladigan shakl',
    ],
    cons: [
      'Markaziy switch buzilsa — hamma toʻxtaydi',
      'Kabel koʻp sarflanadi',
    ],
  },
  bus: {
    tab: 'Shina',
    title: 'Shina (bus)',
    source: 'n1',
    bus: true,
    nodes: [
      { id: 'n1', x: 130, y: 300, ...PC, info: 'Kabel band boʻlsa, navbat kutadi.' },
      { id: 'n2', x: 300, y: 300, ...SRV, info: 'Hamma bitta uzun kabelni boʻlishadi.' },
      { id: 'n3', x: 460, y: 300, ...PRN, info: 'Ikkisi birga gapirsa, maʼlumot toʻqnashadi va qayta yuboriladi.' },
      { id: 'n4', x: 620, y: 300, ...CAM, info: 'Kabel uzilsa, narigi tomon bilan aloqa yoʻqoladi.' },
      { id: 'n5', x: 790, y: 300, ...AP, info: 'Bu shakl bugun ishlatilmaydi — faqat tarixda qolgan.' },
    ],
    links: [
      { a: 'n1', b: 'n2', seg: [130, 160, 300, 160] },
      { a: 'n2', b: 'n3', seg: [300, 160, 460, 160] },
      { a: 'n3', b: 'n4', seg: [460, 160, 620, 160] },
      { a: 'n4', b: 'n5', seg: [620, 160, 790, 160] },
    ],
    breakIdx: 1,
    breakMsg: 'Umumiy kabel oʻrtada uzildi. Tarmoq ikkiga boʻlindi: chapdagilar oʻngdagilar bilan gaplasha olmaydi.',
    why: 'Hamma bitta kabelga tayanadi. Shu kabel uzilsa, tarmoq boʻlinib ketadi.',
    pros: [
      'Kabel kam ketadi',
      'Oʻrnatish arzon va oddiy',
    ],
    cons: [
      'Bitta uzilish tarmoqni boʻladi',
      'Kabel band boʻlsa, hamma kutadi',
      'Qurilma koʻpaysa, tarmoq sekinlashadi',
      'Nosozlik joyini topish qiyin',
    ],
  },
  ring: {
    tab: 'Halqa',
    title: 'Halqa (ring)',
    source: 'n1',
    nodes: [
      { id: 'n1', ...RP[0], ...PC, info: 'Maʼlumot doira boʻylab bitta yoʻnalishda yuradi.' },
      { id: 'n2', ...RP[1], ...SRV, info: 'Har qurilma ikki qoʻshnisiga ulangan.' },
      { id: 'n3', ...RP[2], ...PRN, info: 'Navbatini kutadi: navbat belgisi doira boʻylab aylanadi.' },
      { id: 'n4', ...RP[3], ...CAM, info: 'Halqa uzilsa, signal bu yergacha yetib kelmaydi.' },
      { id: 'n5', ...RP[4], ...AP, info: 'Ikki qatorli halqada zaxira yoʻl boʻladi.' },
    ].map((n, i) => ({ ...n, pos: RING_POS[i] })),
    links: [
      { a: 'n1', b: 'n2', dir: true }, { a: 'n2', b: 'n3', dir: true }, { a: 'n3', b: 'n4', dir: true },
      { a: 'n4', b: 'n5', dir: true }, { a: 'n5', b: 'n1', dir: true },
    ],
    breakIdx: 1,
    breakMsg: 'Halqa uzildi. Signal undan keyingi qurilmalarga (Printer, Kamera, Wi-Fi AP) yetib bormaydi.',
    why: 'Signal faqat bitta yoʻnalishda yuradi. Yoʻl uzilsa, aylanib qaytishning imkoni yoʻq.',
    pros: [
      'Hamma navbat bilan gapiradi — toʻqnashuv yoʻq',
      'Tezlik barqaror',
    ],
    cons: [
      'Bitta uzilish butun halqani toʻxtatadi',
      'Bitta qurilma buzilsa ham hamma toʻxtaydi',
      'Yangi qurilma qoʻshish uchun tarmoqni uzish kerak',
    ],
  },
  mesh: {
    tab: 'Toʻr',
    title: 'Toʻr (mesh)',
    source: 'n1',
    nodes: [
      { id: 'n1', ...RP[0], ...PC, info: 'Har qurilma qolganlarining hammasiga ulangan.' },
      { id: 'n2', ...RP[1], ...SRV, info: 'Ikki qurilma orasida bir necha yoʻl bor.' },
      { id: 'n3', ...RP[2], ...PRN, info: 'Bitta yoʻl uzilsa, maʼlumot boshqasidan ketadi.' },
      { id: 'n4', ...RP[3], ...CAM, info: 'Eng ishonchli, lekin eng qimmat: 5 qurilma uchun 10 ta kabel.' },
      { id: 'n5', ...RP[4], ...AP, info: 'Amalda faqat eng muhim qurilmalar shunday ulanadi.' },
    ].map((n, i) => ({ ...n, pos: RING_POS[i] })),
    links: [
      { a: 'n1', b: 'n2' }, { a: 'n1', b: 'n3' }, { a: 'n1', b: 'n4' }, { a: 'n1', b: 'n5' },
      { a: 'n2', b: 'n3' }, { a: 'n2', b: 'n4' }, { a: 'n2', b: 'n5' },
      { a: 'n3', b: 'n4' }, { a: 'n3', b: 'n5' }, { a: 'n4', b: 'n5' },
    ],
    breakIdx: 0,
    breakMsg: 'Kompyuter va Server orasidagi kabel uzildi — hech kim aloqasiz qolmadi!',
    why: 'Har juftlik orasida bir necha yoʻl bor. Harakatlanayotgan yorqin chiziq — yangi yoʻl (Printer orqali).',
    pros: [
      'Uzilishga eng chidamli',
      'Muqobil yoʻl doim bor',
      'Serverlar va magistrallar uchun ideal',
    ],
    cons: [
      'Juda koʻp kabel kerak',
      'Eng qimmat yechim',
      'Kichik tarmoq uchun ortiqcha',
    ],
  },
}

const ORDER: TopoKey[] = ['star', 'bus', 'ring', 'mesh']

/** Manba tugundan (uzilgan kanalni hisobga olib) yetib boriladigan tugunlar. */
function reach(start: string, links: TLink[], cut: number): Set<string> {
  const adj = new Map<string, string[]>()
  const add = (a: string, b: string) => { adj.set(a, [...(adj.get(a) ?? []), b]) }
  links.forEach((l, i) => {
    if (i === cut) return
    add(l.a, l.b)
    if (!l.dir) add(l.b, l.a)
  })
  const seen = new Set<string>([start])
  const stack = [start]
  while (stack.length) {
    const c = stack.pop() as string
    for (const n of adj.get(c) ?? []) {
      if (!seen.has(n)) { seen.add(n); stack.push(n) }
    }
  }
  return seen
}

/** Uzilgan kanal oʻrniga eng qisqa muqobil yoʻl (kanal indekslari); yoʻl boʻlmasa — boʻsh roʻyxat. */
function findPath(links: TLink[], cut: number, from: string, to: string): number[] {
  const adj = new Map<string, [string, number][]>()
  const add = (a: string, b: string, i: number) => { adj.set(a, [...(adj.get(a) ?? []), [b, i]]) }
  links.forEach((l, i) => {
    if (i === cut) return
    add(l.a, l.b, i)
    if (!l.dir) add(l.b, l.a, i)
  })
  const prev = new Map<string, [string, number] | null>([[from, null]])
  const queue = [from]
  while (queue.length) {
    const c = queue.shift() as string
    if (c === to) break
    for (const [n, i] of adj.get(c) ?? []) {
      if (!prev.has(n)) { prev.set(n, [c, i]); queue.push(n) }
    }
  }
  if (!prev.has(to)) return []
  const out: number[] = []
  let n = to
  for (let p = prev.get(n); p; p = prev.get(n)) { out.push(p[1]); n = p[0] }
  return out
}

function labelAt(n: TNode, r: number): { x: number; y: number; anchor: 'start' | 'middle' | 'end' } {
  switch (n.pos) {
    case 'above': return { x: n.x, y: n.y - r - 12, anchor: 'middle' }
    case 'left': return { x: n.x - r - 11, y: n.y + 5, anchor: 'end' }
    case 'right': return { x: n.x + r + 11, y: n.y + 5, anchor: 'start' }
    default: return { x: n.x, y: n.y + r + 21, anchor: 'middle' }
  }
}

/** Yoʻnalish koʻrsatkichi (uchburchak) — markazi (x, y), burchagi ang. */
function arrow(x: number, y: number, ang: number, size = 9) {
  const p = (dx: number, dy: number) =>
    `${(x + dx * Math.cos(ang) - dy * Math.sin(ang)).toFixed(1)},${(y + dx * Math.sin(ang) + dy * Math.cos(ang)).toFixed(1)}`
  return [p(size, 0), p(-size * 0.7, size * 0.7), p(-size * 0.7, -size * 0.7)].join(' ')
}

const LEGEND: { color: string; label: string; dashed?: boolean }[] = [
  { color: C.stroke, label: 'ishlayotgan kabel' },
  { color: C.danger, label: 'uzilgan — aloqasiz', dashed: true },
  { color: C.accent, label: 'yangi yoʻl' },
  { color: C.amber, label: 'tanlangan qurilma' },
]

export default function TopologyExplorer() {
  const uid = useId()
  const [cur, setCur] = useState<TopoKey>('star')
  const [broken, setBroken] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const t = TOPO[cur]
  const cut = broken ? t.breakIdx : -1
  const byId: Record<string, TNode> = Object.fromEntries(t.nodes.map(n => [n.id, n]))
  const live = reach(t.source, t.links, cut)
  const alt = broken ? findPath(t.links, cut, t.links[cut].a, t.links[cut].b) : []
  const lost = t.nodes.filter(n => !live.has(n.id)).length
  const sel = selected ? byId[selected] : undefined

  function pickTopo(k: TopoKey) {
    setCur(k)
    setBroken(false)
    setSelected(null)
  }
  function onTabKey(e: KeyboardEvent<HTMLButtonElement>, idx: number) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return
    e.preventDefault()
    const last = ORDER.length - 1
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? last : (idx + (e.key === 'ArrowRight' ? 1 : -1) + ORDER.length) % ORDER.length
    pickTopo(ORDER[next])
    tabRefs.current[next]?.focus()
  }

  const badge = !broken
    ? 'Tarmoq butun'
    : lost === 0
      ? 'Hamma aloqada'
      : t.bus
        ? `Tarmoq boʻlindi: ${live.size} + ${lost}`
        : `${lost} ta qurilma aloqasiz`

  return (
    <Stage
      title="Topologiya koʻrgazmasi"
      badge={badge}
      hint={<><strong>Aloqani uzish</strong> — bitta kabelni uzadi; aloqasiz qolganlar qizil boʻladi. <strong>Tiklash</strong> — hammasini joyiga qaytaradi. Qurilmani bosib, vazifasini koʻring.</>}
    >
      <div className="mx-auto max-w-[70rem]">
        <div role="tablist" aria-label="Topologiya turini tanlash" className="mb-4 flex flex-wrap gap-2">
          {ORDER.map((k, i) => {
            const on = k === cur
            return (
              <button key={k} ref={el => { tabRefs.current[i] = el }} type="button" role="tab"
                id={`${uid}tab-${k}`} aria-selected={on} aria-controls={`${uid}panel`} tabIndex={on ? 0 : -1}
                onClick={() => pickTopo(k)} onKeyDown={e => onTabKey(e, i)}
                className={cx('rounded-xl border px-4 py-2 text-[0.95rem] font-semibold transition',
                  on ? 'border-teal-400 bg-teal-500 text-navy-950' : 'border-navy-600 bg-navy-900 text-navy-100 hover:border-teal-400')}>
                {TOPO[k].tab}
              </button>
            )
          })}
        </div>

        <div role="tabpanel" id={`${uid}panel`} aria-labelledby={`${uid}tab-${cur}`}>
          <div className="overflow-x-auto rounded-xl border border-navy-800 bg-navy-900/40">
            <div className="min-w-[640px]">
              <svg viewBox="0 0 900 400" className="h-auto w-full" role="group" aria-label={`${t.title} sxemasi`}>
                {/* Shina: magistral uchlari, terminatorlar va tarmoqchalar */}
                {t.bus && (
                  <g aria-hidden="true">
                    <line x1={80} y1={160} x2={130} y2={160} stroke={C.stroke} strokeWidth={5} strokeLinecap="round" opacity={live.has('n1') ? 1 : 0.35} />
                    <line x1={790} y1={160} x2={840} y2={160} stroke={C.stroke} strokeWidth={5} strokeLinecap="round" opacity={live.has('n5') ? 1 : 0.35} />
                    <rect x={70} y={149} width={14} height={22} rx={3} fill={C.sub} />
                    <rect x={836} y={149} width={14} height={22} rx={3} fill={C.sub} />
                    <text x={77} y={136} fill={C.sub} fontSize={12} textAnchor="middle">terminator</text>
                    <text x={843} y={136} fill={C.sub} fontSize={12} textAnchor="middle">terminator</text>
                    <text x={450} y={136} fill={C.sub} fontSize={13} textAnchor="middle">umumiy kabel</text>
                    {t.nodes.map(n => (
                      <line key={n.id} x1={n.x} y1={160} x2={n.x} y2={n.y - 27} stroke={C.stroke} strokeWidth={2} opacity={live.has(n.id) ? 1 : 0.35} />
                    ))}
                  </g>
                )}

                {/* Aloqa kanallari */}
                {t.links.map((l, i) => {
                  const a = byId[l.a]
                  const b = byId[l.b]
                  const [x1, y1, x2, y2] = l.seg ?? [a.x, a.y, b.x, b.y]
                  const isCut = i === cut
                  const isAlt = alt.includes(i)
                  const isDim = !isCut && !isAlt && !live.has(l.a) && !live.has(l.b)
                  const color = isCut ? C.danger : isAlt ? C.accent : C.stroke
                  const mx = (x1 + x2) / 2
                  const my = (y1 + y2) / 2
                  return (
                    <g key={`${cur}-${i}`} opacity={isDim ? 0.35 : 1} aria-hidden="true">
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeLinecap="round"
                        strokeWidth={t.bus ? 5 : isAlt ? 3.6 : 2.4}
                        strokeDasharray={isCut ? '9 9' : undefined}
                        className={isAlt ? 'anim-dash' : undefined} />
                      {l.dir && !isCut && <polygon points={arrow(mx, my, Math.atan2(y2 - y1, x2 - x1))} fill={color} />}
                      {isCut && (
                        <>
                          <circle cx={mx} cy={my} r={13} fill={C.bg} stroke={C.danger} strokeWidth={2} />
                          <path d={`M${mx - 5} ${my - 5} L${mx + 5} ${my + 5} M${mx + 5} ${my - 5} L${mx - 5} ${my + 5}`}
                            stroke={C.danger} strokeWidth={2.6} strokeLinecap="round" />
                        </>
                      )}
                    </g>
                  )
                })}

                {/* Tugunlar */}
                {t.nodes.map(n => {
                  const r = n.core ? 34 : 27
                  const dead = !live.has(n.id)
                  const on = selected === n.id
                  const Icon = n.icon
                  const lp = labelAt(n, r)
                  const half = n.core ? 15 : 12
                  return (
                    <g key={`${cur}-${n.id}`} role="button" tabIndex={0} aria-pressed={on}
                      aria-label={`${n.label}${broken ? (dead ? ' — aloqasiz' : ' — aloqada') : ''}. ${n.info}`}
                      onClick={() => setSelected(n.id)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(n.id) } }}
                      className="group cursor-pointer" style={{ outline: 'none' }}>
                      <circle cx={n.x} cy={n.y} r={r + 9} fill="none" stroke={C.text} strokeWidth={2} strokeDasharray="4 5"
                        opacity={0} className="group-focus-visible:opacity-100" />
                      {on && <circle cx={n.x} cy={n.y} r={r + 5} fill="none" stroke={C.amber} strokeWidth={2.6} />}
                      <circle cx={n.x} cy={n.y} r={r} fill={C.bg} />
                      <circle cx={n.x} cy={n.y} r={r}
                        fill={dead ? 'rgba(251,113,133,.18)' : n.core ? 'rgba(45,212,191,.16)' : C.fill}
                        stroke={dead ? C.danger : n.core ? C.accent : C.stroke}
                        strokeWidth={dead || n.core ? 2.5 : 1.8}
                        className={dead ? undefined : 'transition-colors group-hover:stroke-[#2DD4BF]'} />
                      <Icon x={n.x - half} y={n.y - half} size={half * 2} color={dead ? C.danger : C.text} strokeWidth={1.8} aria-hidden="true" />
                      <text x={lp.x} y={lp.y} textAnchor={lp.anchor} fontSize={15} fontWeight={600} fill={dead ? C.danger : C.text}>{n.label}</text>
                      {dead && (
                        <g aria-hidden="true">
                          <circle cx={n.x + r * 0.72} cy={n.y - r * 0.72} r={9} fill={C.danger} />
                          <path d={`M${n.x + r * 0.72 - 3.5} ${n.y - r * 0.72 - 3.5} l7 7 m0 -7 l-7 7`} stroke={C.bg} strokeWidth={2.2} strokeLinecap="round" />
                        </g>
                      )}
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>

          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-navy-300" aria-label="Shartli belgilar">
            {LEGEND.map(l => (
              <li key={l.label} className="inline-flex items-center gap-2">
                <span className="inline-block w-6 border-t-[3px]" style={{ borderColor: l.color, borderTopStyle: l.dashed ? 'dashed' : 'solid' }} />
                {l.label}
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Btn variant="primary" icon={Unplug} disabled={broken} onClick={() => setBroken(true)}>Aloqani uzish</Btn>
            <Btn variant="dark" icon={RotateCcw} disabled={!broken && selected === null}
              onClick={() => { setBroken(false); setSelected(null) }}>Tiklash</Btn>
          </div>

          <div role="status" aria-live="polite"
            className={cx('mt-3 rounded-xl border px-4 py-3 text-[0.95rem] leading-relaxed',
              !broken && 'border-navy-700 bg-navy-900 text-navy-100',
              broken && lost > 0 && 'border-rose-400/50 bg-rose-500/10 text-rose-100',
              broken && lost === 0 && 'border-teal-400/50 bg-teal-500/10 text-teal-100')}>
            {broken ? (
              <>
                <p><strong>{t.breakMsg}</strong></p>
                <p className="mt-1.5 text-sm opacity-90">Nega shunday? {t.why}</p>
              </>
            ) : (
              <p>{t.title} tanlandi. Tarmoq butun — hamma aloqada.</p>
            )}
          </div>

          <div aria-live="polite" className="mt-3 rounded-xl border border-navy-700 bg-navy-900/70 px-4 py-3">
            {sel ? (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-base font-bold !text-white">{sel.label}</h4>
                  <span className="rounded-full border border-navy-600 px-2.5 py-0.5 text-xs font-semibold text-teal-300">
                    {sel.core ? 'Markaziy qurilma' : 'Tarmoq tuguni'}
                  </span>
                  {broken && (
                    <span className={cx('rounded-full px-2.5 py-0.5 text-xs font-bold', live.has(sel.id) ? 'bg-teal-500/20 text-teal-200' : 'bg-rose-500/20 text-rose-200')}>
                      {live.has(sel.id) ? 'aloqada' : 'aloqasiz'}
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-navy-100">{sel.info}</p>
              </>
            ) : (
              <>
                <h4 className="text-base font-bold !text-white">{t.title}</h4>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-navy-100">
                  Qurilmani bosib, vazifasini koʻring. Soʻng <strong>«Aloqani uzish»</strong> tugmasini bosib, nima boʻlishini kuzatib turing.
                </p>
              </>
            )}
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-navy-700 bg-navy-900/70 p-4">
              <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] !text-teal-300">👍 Afzalliklari</h4>
              <div className="text-[0.95rem] leading-relaxed text-navy-100"><CheckList items={t.pros} /></div>
            </div>
            <div className="rounded-xl border border-navy-700 bg-navy-900/70 p-4">
              <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] !text-rose-300">👎 Kamchiliklari</h4>
              <div className="text-[0.95rem] leading-relaxed text-navy-100"><CheckList kind="cross" items={t.cons} /></div>
            </div>
          </div>
        </div>
      </div>
    </Stage>
  )
}
