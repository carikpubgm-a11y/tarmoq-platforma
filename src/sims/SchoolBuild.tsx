import { useState, type ReactNode } from 'react'
import { ArrowRight, BrickWall, Cable, Check, Cloud, Network, RotateCcw, Router, type LucideIcon } from 'lucide-react'
import { Btn, Stage, cx } from '../components/ui'

/* Maktab tarmogʻini 6 qadamda qurish:
   Internet → modem → firewall → router → asosiy switch → 4 ta VLAN segmenti. */

const C = {
  fill: 'rgba(148,170,210,.14)',
  stroke: '#6682B5',
  accent: '#2DD4BF',
  text: '#E4EAF5',
  sub: '#9AAED3',
  link: '#6682B5',
  bg: '#071023',
}
const R = 30
const TOTAL = 6
const TOP_Y = 76
const SW = { x: 650, y: 206 }
const GROUP_Y = 304

interface NodeDef { id: string; x: number; y: number; label: string; icon: LucideIcon; step: number; side?: boolean }

const NODES: NodeDef[] = [
  { id: 'net', x: 110, y: TOP_Y, label: 'Internet', icon: Cloud, step: 1 },
  { id: 'mod', x: 290, y: TOP_Y, label: 'Modem', icon: Cable, step: 2 },
  { id: 'fw', x: 470, y: TOP_Y, label: 'Firewall', icon: BrickWall, step: 3 },
  { id: 'rtr', x: 650, y: TOP_Y, label: 'Router', icon: Router, step: 4 },
  { id: 'sw', x: SW.x, y: SW.y, label: 'Asosiy switch', icon: Network, step: 5, side: true },
]

const LINKS: { d: string; step: number }[] = [
  { d: `M${110 + R} ${TOP_Y} L${290 - R} ${TOP_Y}`, step: 2 },
  { d: `M${290 + R} ${TOP_Y} L${470 - R} ${TOP_Y}`, step: 3 },
  { d: `M${470 + R} ${TOP_Y} L${650 - R} ${TOP_Y}`, step: 4 },
  { d: `M650 ${TOP_Y + R} L650 ${SW.y - R}`, step: 5 },
]

const GROUPS = [
  { x: 125, label: 'Kompyuter xonasi', sub: '20 kompyuter + printer', vlan: 'VLAN 10', color: '#2DD4BF' },
  { x: 355, label: 'Oʻqituvchi / direktor', sub: '5 kompyuter', vlan: 'VLAN 20', color: '#FBBF24' },
  { x: 585, label: 'Wi-Fi hududi', sub: '2 access point, kutubxona', vlan: 'VLAN 30', color: '#60A5FA' },
  { x: 815, label: 'Server xonasi', sub: 'Fayl serveri, kamera', vlan: 'VLAN 40', color: '#A78BFA' },
]

const STEP_NAMES = ['Internet', 'Modem', 'Firewall', 'Router', 'Asosiy switch', 'VLAN segmentlari']

const LOG: ReactNode[] = [
  <>Tayyor. <strong>«Keyingi qadam»</strong> tugmasini bosing — tarmoq qurilishi boshlanadi.</>,
  <><strong>Provayder liniyasi</strong> binoga kirdi (optik kabel). Bu — tashqi dunyoga chiqish nuqtasi; qolgan uskunaning joyi shu nuqtaga qarab belgilanadi.</>,
  <><strong>Modem</strong> (optik liniyada — ONT) provayder signalini Ethernet signaliga aylantiradi. Endi keyingi qurilma oddiy tarmoq kabeli bilan ishlay oladi.</>,
  <><strong>Firewall</strong> oʻrnatildi. U xavfsizlik siyosatini tarmoq <em>chegarasida</em> qoʻllaydi. Bu sxemada u routerdan oldin koʻrsatilgan; amalda ikkalasi koʻpincha bitta qurilmada birlashadi.</>,
  <><strong>Router</strong> qoʻshildi. U ichki tarmoqni tashqi tarmoqdan ajratadi va manzil tarjimasini (NAT) bajaradi.</>,
  <><strong>Asosiy switch</strong> ulandi. Magistral tayyor — barcha boʻlimlar shu qurilmaga keladi.</>,
  <>Boʻlimlar <strong>VLAN</strong> segmentlariga ajratildi. Oʻquv tarmogʻi, maʼmuriyat, Wi-Fi va server xonasi bir-biridan mantiqiy izolyatsiya qilindi — bitta boʻlimdagi muammo boshqalarga oʻtmaydi.</>,
]

export default function SchoolBuild() {
  const [step, setStep] = useState(0)
  const done = step >= TOTAL

  return (
    <Stage
      title="Maktab tarmogʻi: loyiha qurilishi"
      badge={`${step} / ${TOTAL} qadam`}
      hint={<>Tarmoq pastdan yuqoriga emas, <strong>provayderdan boshlab</strong> quriladi. Xira konturlar — hali oʻrnatilmagan qurilmalar (loyiha), yorqinlari — qurib boʻlingan qism.</>}
    >
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          <svg viewBox="0 0 940 424" className="h-auto w-full" role="img"
            aria-label={`Maktab tarmogʻi sxemasi, ${step} / ${TOTAL} qadam qurilgan`}>
            {/* Aloqa liniyalari */}
            {LINKS.map((l, i) => {
              const built = l.step <= step
              return (
                <path key={i} d={l.d} fill="none"
                  stroke={built ? (l.step === step ? C.accent : C.link) : C.link}
                  strokeWidth={built ? 2.4 : 1.4}
                  strokeDasharray={built ? undefined : '4 7'}
                  opacity={built ? 1 : 0.42}
                  className={built && l.step === step ? 'anim-dash' : undefined} />
              )
            })}
            {GROUPS.map((g, i) => (
              <path key={i} d={`M${SW.x} ${SW.y + R} C${SW.x} ${SW.y + 72} ${g.x} ${GROUP_Y - 44} ${g.x} ${GROUP_Y}`} fill="none"
                stroke={done ? g.color : C.link} strokeWidth={done ? 2.2 : 1.4}
                strokeDasharray={done ? undefined : '4 7'} opacity={done ? 0.85 : 0.34} />
            ))}

            {/* Qurilmalar */}
            {NODES.map(n => {
              const built = n.step <= step
              const fresh = n.step === step
              const Icon = n.icon
              return (
                <g key={n.id + (built ? '-on' : '-off')} className={fresh ? 'anim-in' : undefined} opacity={built ? 1 : 0.45}>
                  <circle cx={n.x} cy={n.y} r={R}
                    fill={built ? (n.side ? 'rgba(45,212,191,.16)' : C.fill) : 'none'}
                    stroke={built && (fresh || n.side) ? C.accent : C.stroke}
                    strokeWidth={built ? (n.side ? 2.6 : 2) : 1.4}
                    strokeDasharray={built ? undefined : '4 6'} />
                  <Icon x={n.x - 13} y={n.y - 13} size={26} color={C.text} strokeWidth={1.8} aria-hidden="true" />
                  {n.side
                    ? <text x={n.x + R + 14} y={n.y + 5} fill={C.text} fontSize={15} fontWeight={600}>{n.label}</text>
                    : <text x={n.x} y={n.y - R - 12} fill={C.text} fontSize={15} fontWeight={600} textAnchor="middle">{n.label}</text>}
                  {built && (
                    <g>
                      <circle cx={n.x + 23} cy={n.y - 21} r={10} fill={C.bg} stroke={C.accent} strokeWidth={1.4} />
                      <text x={n.x + 23} y={n.y - 17} fill={C.accent} fontSize={11} fontWeight={700} textAnchor="middle" className="font-mono">{n.step}</text>
                    </g>
                  )}
                </g>
              )
            })}

            {/* VLAN segmentlari */}
            {GROUPS.map((g, i) => (
              <g key={i + (done ? '-on' : '-off')} className={done ? 'anim-in' : undefined} opacity={done ? 1 : 0.42}>
                <rect x={g.x - 100} y={GROUP_Y} width={200} height={104} rx={14}
                  fill={done ? 'rgba(148,170,210,.10)' : 'none'}
                  stroke={done ? g.color : C.stroke} strokeWidth={done ? 2 : 1.4}
                  strokeDasharray={done ? undefined : '4 6'} />
                {done && (
                  <>
                    <text x={g.x} y={GROUP_Y + 30} fill={C.text} fontSize={14.5} fontWeight={700} textAnchor="middle">{g.label}</text>
                    <text x={g.x} y={GROUP_Y + 53} fill={C.sub} fontSize={13} textAnchor="middle">{g.sub}</text>
                    <text x={g.x} y={GROUP_Y + 82} fill={g.color} fontSize={14} fontWeight={700} textAnchor="middle" className="font-mono">{g.vlan}</text>
                  </>
                )}
              </g>
            ))}
          </svg>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Btn variant="primary" icon={ArrowRight} disabled={done} onClick={() => setStep(s => Math.min(TOTAL, s + 1))}>Keyingi qadam</Btn>
        <Btn variant="dark" icon={RotateCcw} disabled={step === 0} onClick={() => setStep(0)}>Boshidan</Btn>
      </div>

      <ol className="mt-4 flex flex-wrap gap-1.5" aria-label="Qurilish qadamlari">
        {STEP_NAMES.map((name, i) => {
          const n = i + 1
          const state = n < step ? 'done' : n === step ? 'now' : 'todo'
          return (
            <li key={name} aria-current={state === 'now' ? 'step' : undefined}
              className={cx('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold',
                state === 'done' && 'border-teal-500/40 bg-teal-500/10 text-teal-300',
                state === 'now' && 'border-teal-400 bg-teal-500 text-navy-950',
                state === 'todo' && 'border-navy-700 bg-navy-900 text-navy-300')}>
              {state === 'done' ? <Check size={13} /> : <span className="font-mono">{n}</span>}
              {name}
            </li>
          )
        })}
      </ol>

      <div role="status" aria-live="polite"
        className="mt-3 min-h-[4.5rem] rounded-xl border border-navy-700 bg-navy-900 px-4 py-3 text-[0.95rem] leading-relaxed text-navy-100">
        {step > 0 && <span className="mr-2 font-mono text-xs font-bold text-teal-300">{step}-qadam</span>}
        {LOG[step]}
        {done && <span className="ml-1 font-semibold text-teal-300">Tarmoq tayyor.</span>}
      </div>
    </Stage>
  )
}
