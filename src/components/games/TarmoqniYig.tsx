import { useState } from 'react'
import { Cloud, Monitor, Network, Printer, Router } from 'lucide-react'
import { cx } from '../ui'
import { Feedback, GameShell } from './GameShell'

/* ==========================================================================
   Oʻyin 2: «Tarmoqni yigʻ» — sodda ulash oʻyini.
   Bola ikkita qurilmani bosib sim tortadi. Toʻgʻri ulansa — yashil.
   Hamma kerakli ulanish tayyor boʻlsa, tarmoq «yonadi».
   Murakkab emas: faqat toʻgʻri juftlarni topish.
   ========================================================================== */
type Id = 'net' | 'router' | 'switch' | 'pc1' | 'pc2' | 'pc3' | 'printer'
interface Node { id: Id; x: number; y: number; label: string; icon: typeof Monitor; color: string }
const NODES: Node[] = [
  { id: 'net', x: 300, y: 50, label: 'Internet', icon: Cloud, color: '#60A5FA' },
  { id: 'router', x: 300, y: 150, label: 'Router', icon: Router, color: '#3B82F6' },
  { id: 'switch', x: 300, y: 260, label: 'Switch', icon: Network, color: '#14B8A6' },
  { id: 'pc1', x: 90, y: 380, label: 'PC1', icon: Monitor, color: '#8B5CF6' },
  { id: 'pc2', x: 230, y: 380, label: 'PC2', icon: Monitor, color: '#8B5CF6' },
  { id: 'pc3', x: 370, y: 380, label: 'PC3', icon: Monitor, color: '#8B5CF6' },
  { id: 'printer', x: 510, y: 380, label: 'Printer', icon: Printer, color: '#F59E0B' },
]
// Kerakli ulanishlar (yulduz tarmoq: hamma switchga, switch routerga, router internetga)
const KERAK: [Id, Id][] = [
  ['pc1', 'switch'], ['pc2', 'switch'], ['pc3', 'switch'], ['printer', 'switch'],
  ['switch', 'router'], ['router', 'net'],
]
const bir = (a: Id, b: Id, c: Id, d: Id) => (a === c && b === d) || (a === d && b === c)
const kerakmi = (a: Id, b: Id) => KERAK.some(([x, y]) => bir(a, b, x, y))

export default function TarmoqniYig() {
  const [simlar, setSimlar] = useState<[Id, Id][]>([])
  const [tanlangan, setTanlangan] = useState<Id | null>(null)
  const [xabar, setXabar] = useState<{ togri: boolean; text: string } | null>(null)

  const byId = (id: Id) => NODES.find(n => n.id === id)!
  const bor = (a: Id, b: Id) => simlar.some(([x, y]) => bir(a, b, x, y))
  const topilgan = KERAK.filter(([a, b]) => bor(a, b)).length
  const done = topilgan === KERAK.length

  function bosildi(id: Id) {
    if (done) return
    if (!tanlangan) { setTanlangan(id); setXabar(null); return }
    if (tanlangan === id) { setTanlangan(null); return }
    const a = tanlangan, b = id
    if (bor(a, b)) { setXabar({ togri: false, text: 'Bu ikkisi allaqachon ulangan.' }); setTanlangan(null); return }
    if (kerakmi(a, b)) {
      setSimlar(s => [...s, [a, b]])
      setXabar({ togri: true, text: `${byId(a).label} va ${byId(b).label} ulandi!` })
    } else {
      setXabar({ togri: false, text: `${byId(a).label}ni toʻgʻridan-toʻgʻri ${byId(b).label}ga ulab boʻlmaydi. Kompyuterlar avval switchga ulanadi.` })
    }
    setTanlangan(null)
  }

  return (
    <GameShell title="Tarmoqni yigʻ" emoji="🔧" saveKey="yigish" saveLabel="Tarmoqni yigʻ oʻyini" score={topilgan} max={KERAK.length} done={done}
      onRestart={() => { setSimlar([]); setTanlangan(null); setXabar(null) }}
      intro={<>Ikkita qurilmani bosib <strong>sim tortish</strong>. Avval kompyuterlarni <strong>switch</strong>ga, switchni <strong>router</strong>ga, routerni <strong>internet</strong>ga ulang.</>}>
      <div className="overflow-x-auto rounded-3xl border-2 border-navy-700 bg-gradient-to-br from-navy-900 to-brand-900 p-2">
        <svg viewBox="0 0 600 440" className="mx-auto block h-auto w-full min-w-[420px] max-w-xl touch-none select-none" role="group" aria-label="Tarmoqni yigʻish maydoni">
          {/* simlar */}
          {simlar.map(([a, b], i) => {
            const p = byId(a), q = byId(b)
            return <line key={i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#34D399" strokeWidth="5" strokeLinecap="round" className="anim-in" />
          })}
          {/* kerakli, hali ulanmaganlarni xira koʻrsatamiz (yoʻl-yoʻriq) */}
          {KERAK.filter(([a, b]) => !bor(a, b)).map(([a, b], i) => {
            const p = byId(a), q = byId(b)
            return <line key={'h' + i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#41609A" strokeWidth="2.5" strokeDasharray="4 8" opacity="0.5" />
          })}
          {/* tugunlar */}
          {NODES.map(n => {
            const on = tanlangan === n.id
            const ulangan = simlar.some(([a, b]) => a === n.id || b === n.id)
            return (
              <g key={n.id} role="button" tabIndex={0} style={{ cursor: 'pointer' }} aria-label={n.label}
                onClick={() => bosildi(n.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); bosildi(n.id) } }}>
                {on && <circle cx={n.x} cy={n.y} r="38" fill="none" stroke="#FBBF24" strokeWidth="2" strokeDasharray="4 5" className="anim-dash" />}
                <circle cx={n.x} cy={n.y} r="30" fill={on ? 'rgba(251,191,36,.2)' : ulangan ? 'rgba(52,211,153,.18)' : 'rgba(148,170,210,.14)'}
                  stroke={on ? '#FBBF24' : ulangan ? '#34D399' : n.color} strokeWidth={on ? 3 : 2.5} />
                <n.icon x={n.x - 14} y={n.y - 14} width={28} height={28} color={n.color} strokeWidth={1.8} aria-hidden="true" />
                <text x={n.x} y={n.y + 48} textAnchor="middle" fontSize="15" fontWeight="800" fill="#E8EAFD">{n.label}</text>
              </g>
            )
          })}
          {done && <text x="300" y="220" textAnchor="middle" fontSize="40">✨</text>}
        </svg>
      </div>
      {done
        ? <p className="mt-4 text-center font-display text-lg font-extrabold text-emerald-600">🎉 Tarmoq tayyor va ishlayapti!</p>
        : <>
            <p className="mt-3 text-center text-sm font-semibold text-slate-500">{tanlangan ? `«${byId(tanlangan).label}» tanlandi — endi uni ulaydigan qurilmani bosing` : 'Boshlash uchun bitta qurilmani bosing. Xira chiziqlar — kerakli ulanishlar.'}</p>
            {xabar && <div className="mt-3"><Feedback togri={xabar.togri}>{xabar.text}</Feedback></div>}
          </>}
    </GameShell>
  )
}
