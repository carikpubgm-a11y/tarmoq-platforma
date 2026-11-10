import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowRight, Monitor, Network, RotateCcw, Router, Server, type LucideIcon } from 'lucide-react'
import { Btn, Stage, cx } from '../components/ui'

/* Paket safari: kompyuter 192.168.10.25 → switch → router 192.168.10.1 → fayl serveri 192.168.40.5.
   Ichki yoʻnaltirishda IP manzillar saqlanadi, MAC manzillar esa har uchastkada qayta yoziladi. */

const C = {
  fill: 'rgba(148,170,210,.14)',
  stroke: '#6682B5',
  accent: '#2DD4BF',
  amber: '#FBBF24',
  text: '#E4EAF5',
  sub: '#9AAED3',
  link: '#6682B5',
}
const Y = 156
const R = 30
const TOTAL = 5

type NodeId = 'pc' | 'sw' | 'rtr' | 'srv'
const NODES: { id: NodeId; x: number; label: string; sub: string; icon: LucideIcon }[] = [
  { id: 'pc', x: 95, label: 'Kompyuter', sub: '192.168.10.25', icon: Monitor },
  { id: 'sw', x: 320, label: 'Switch', sub: 'MAC boʻyicha', icon: Network },
  { id: 'rtr', x: 545, label: 'Router', sub: 'IP boʻyicha', icon: Router },
  { id: 'srv', x: 800, label: 'Fayl serveri', sub: '192.168.40.5', icon: Server },
]
const X: Record<NodeId, number> = { pc: 95, sw: 320, rtr: 545, srv: 800 }

const MAC = {
  pc: '02:00:00:00:10:25',
  gw: '02:00:00:00:10:01',
  out: '02:00:00:00:40:01',
  srv: '02:00:00:00:40:05',
}

const STEPS: { at: NodeId; title: string; text: ReactNode }[] = [
  {
    at: 'pc', title: 'Manzil aniqlanadi',
    text: <>Kompyuter (192.168.10.25) fayl serveriga (192.168.40.5) maʼlumot yubormoqchi. Nishon <span className="font-semibold text-amber-300">boshqa tarmoqda</span>, shuning uchun paket toʻgʻridan-toʻgʻri emas, <strong>shlyuzga</strong> — router interfeysi 192.168.10.1 ga yuboriladi.</>,
  },
  {
    at: 'pc', title: 'Ramka yasaladi',
    text: <>Manba MAC — kompyuter, nishon MAC — <strong>shlyuz (router)</strong>; kompyuter uni ARP soʻrovi orqali bilib oladi. IP manzillar oʻzgarmaydi: manba 192.168.10.25, nishon 192.168.40.5.</>,
  },
  {
    at: 'sw', title: 'Switch ishlaydi',
    text: <>Switch ramkani <strong>MAC jadval</strong> boʻyicha kerakli portga yoʻnaltiradi. IP manzilga <span className="font-semibold text-rose-300">qaramaydi</span> va ramkani oʻzgartirmaydi — shuning uchun u «bitta tarmoq ichida» ishlaydi deyiladi.</>,
  },
  {
    at: 'rtr', title: 'Router qabul qiladi',
    text: <>Router IP sarlavhani oʻqiydi, TTL ni bittaga kamaytiradi va paketni qaysi interfeysdan chiqarishni hal qiladi. Soʻng <strong>yangi ramka</strong> yasaydi: manba MAC — router, nishon MAC — server. IP manzillar saqlanadi. Agar paket Internetga chiqayotgan boʻlganida, chegaradagi qurilma NAT yordamida manba manzilini umumiy IP ga almashtirar edi.</>,
  },
  {
    at: 'srv', title: 'Paket serverga yetdi',
    text: <>Javob teskari yoʻl bilan qaytadi — har uchastkada MAC manzillar yana qayta yoziladi, IP manzillar esa faqat oʻrin almashadi. Bu ichki yoʻnalishda NAT qatnashmadi. <span className="font-semibold text-teal-300">Sikl tugadi.</span></>,
  },
]

/** Hozirgi uchastkadagi ramka sarlavhasi (MAC manzillar va TTL). */
function frameAt(i: number) {
  if (i < 2) return null
  if (i < 4) return { src: 'Kompyuter', srcMac: MAC.pc, dst: 'Router (shlyuz)', dstMac: MAC.gw, ttl: 64 }
  return { src: 'Router', srcMac: MAC.out, dst: 'Fayl serveri', dstMac: MAC.srv, ttl: 63 }
}

export default function PacketFlow() {
  const [i, setI] = useState(0)
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [i])

  const at: NodeId = i === 0 ? 'pc' : STEPS[i - 1].at
  const frame = frameAt(i)
  const rewritten = i === 4

  return (
    <Stage
      title="Paket oqimi simulyatori"
      badge={`${i} / ${TOTAL} qadam`}
      hint={<>Soddalashtirilgan model. Haqiqatda ARP jadval, TTL, fragmentatsiya va boshqa mexanizmlar ham qatnashadi. MAC manzillar — namoyish uchun shartli qiymatlar.</>}
    >
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          <svg viewBox="0 0 940 300" className="h-auto w-full" role="img"
            aria-label="Paketning kompyuterdan switch va router orqali boshqa tarmoqdagi fayl serveriga harakati">
            {/* Ikki tarmoq hududi */}
            <rect x={20} y={36} width={475} height={236} rx={18} fill="rgba(45,212,191,.05)" stroke="rgba(45,212,191,.45)" strokeWidth={1.4} strokeDasharray="7 7" />
            <text x={38} y={62} fill={C.accent} fontSize={13.5} fontWeight={700}>Oʻquv tarmogʻi · 192.168.10.0/24</text>
            <rect x={595} y={36} width={325} height={236} rx={18} fill="rgba(251,191,36,.05)" stroke="rgba(251,191,36,.5)" strokeWidth={1.4} strokeDasharray="7 7" />
            <text x={902} y={62} fill={C.amber} fontSize={13.5} fontWeight={700} textAnchor="end">Serverlar tarmogʻi · 192.168.40.0/24</text>
            <text x={545} y={24} fill={C.sub} fontSize={12.5} textAnchor="middle">tarmoqlar chegarasi</text>
            {/* Routerning ikki interfeysi — har biri oʻz tarmogʻida */}
            <text x={486} y={Y - 11} fill={C.accent} fontSize={12.5} textAnchor="end" className="font-mono">192.168.10.1</text>
            <text x={604} y={Y - 11} fill={C.amber} fontSize={12.5} textAnchor="start" className="font-mono">192.168.40.1</text>

            {/* Aloqa liniyalari */}
            {NODES.slice(0, -1).map((n, k) => {
              const next = NODES[k + 1]
              return <line key={n.id} x1={n.x + R} y1={Y} x2={next.x - R} y2={Y} stroke={C.link} strokeWidth={2.2} />
            })}

            {/* Qurilmalar */}
            {NODES.map(n => {
              const active = i > 0 && n.id === at
              const Icon = n.icon
              return (
                <g key={n.id}>
                  <circle cx={n.x} cy={Y} r={R} fill={active ? 'rgba(45,212,191,.18)' : C.fill}
                    stroke={active ? C.accent : C.stroke} strokeWidth={active ? 2.6 : 2} style={{ transition: 'stroke .3s, fill .3s' }} />
                  <Icon x={n.x - 13} y={Y - 13} size={26} color={C.text} strokeWidth={1.8} aria-hidden="true" />
                  <text x={n.x} y={Y + 52} fill={C.text} fontSize={15} fontWeight={600} textAnchor="middle">{n.label}</text>
                  <text x={n.x} y={Y + 72} fill={C.sub} fontSize={12.5} textAnchor="middle" className="font-mono">{n.sub}</text>
                </g>
              )
            })}

            {/* Paket */}
            <g style={{ transform: `translate(${X[at]}px, ${Y - 50}px)`, transition: 'transform .85s cubic-bezier(.4,0,.2,1)' }}>
              <circle r={15} fill={C.accent} opacity={0.22} />
              <circle r={9} fill={C.accent} stroke="#071023" strokeWidth={2} />
            </g>
          </svg>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Btn variant="primary" icon={ArrowRight} disabled={i >= TOTAL} onClick={() => setI(v => Math.min(TOTAL, v + 1))}>Keyingi qadam</Btn>
        <Btn variant="dark" icon={RotateCcw} disabled={i === 0} onClick={() => setI(0)}>Boshidan</Btn>
      </div>

      {/* Sarlavhalar: nima oʻzgaradi, nima oʻzgarmaydi */}
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className={cx('rounded-xl border bg-navy-900 p-3.5 transition-colors', rewritten ? 'border-amber-400' : 'border-navy-700')}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-navy-300">Ramka sarlavhasi · MAC</span>
            <span className={cx('rounded-full px-2 py-0.5 text-[0.7rem] font-bold', rewritten ? 'bg-amber-400 text-navy-950' : 'bg-navy-800 text-amber-300')}>
              {rewritten ? 'router qayta yozdi' : 'har uchastkada qayta yoziladi'}
            </span>
          </div>
          {frame ? (
            <dl className="mt-2.5 space-y-1.5 font-mono text-[0.82rem]">
              <div className="flex flex-wrap gap-x-2"><dt className="w-14 text-navy-300">manba</dt><dd className="text-white">{frame.srcMac} <span className="text-navy-300">· {frame.src}</span></dd></div>
              <div className="flex flex-wrap gap-x-2"><dt className="w-14 text-navy-300">nishon</dt><dd className="text-white">{frame.dstMac} <span className="text-navy-300">· {frame.dst}</span></dd></div>
            </dl>
          ) : (
            <p className="mt-2.5 text-[0.88rem] text-navy-300">Ramka hali yasalmagan.</p>
          )}
        </div>
        <div className="rounded-xl border border-navy-700 bg-navy-900 p-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-navy-300">Paket sarlavhasi · IP</span>
            <span className="rounded-full bg-navy-800 px-2 py-0.5 text-[0.7rem] font-bold text-teal-300">yoʻl davomida oʻzgarmaydi</span>
          </div>
          {i > 0 ? (
            <dl className="mt-2.5 space-y-1.5 font-mono text-[0.82rem]">
              <div className="flex flex-wrap gap-x-2"><dt className="w-14 text-navy-300">manba</dt><dd className="text-white">192.168.10.25</dd></div>
              <div className="flex flex-wrap gap-x-2"><dt className="w-14 text-navy-300">nishon</dt><dd className="text-white">192.168.40.5</dd></div>
              {frame && <div className="flex flex-wrap gap-x-2"><dt className="w-14 text-navy-300">TTL</dt><dd className={frame.ttl === 63 ? 'text-amber-300' : 'text-white'}>{frame.ttl}</dd></div>}
            </dl>
          ) : (
            <p className="mt-2.5 text-[0.88rem] text-navy-300">Paket hali yuborilmagan.</p>
          )}
        </div>
      </div>

      <div ref={logRef} role="status" aria-live="polite"
        className="mt-3 max-h-[28rem] overflow-y-auto rounded-xl border border-navy-700 bg-navy-900 px-4 py-3 text-[0.94rem] leading-relaxed">
        {i === 0 ? (
          <p className="text-navy-100">Tayyor. <strong>«Keyingi qadam»</strong> tugmasini bosing.</p>
        ) : (
          <ol className="space-y-2.5">
            {STEPS.slice(0, i).map((s, k) => (
              <li key={k} className={cx('flex gap-3', k === i - 1 ? 'anim-in text-navy-100' : 'text-navy-300')}>
                <span className={cx('mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-md font-mono text-xs font-bold', k === i - 1 ? 'bg-teal-500 text-navy-950' : 'bg-navy-800 text-navy-300')}>{k + 1}</span>
                <span><strong>{s.title}.</strong> {s.text}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </Stage>
  )
}
