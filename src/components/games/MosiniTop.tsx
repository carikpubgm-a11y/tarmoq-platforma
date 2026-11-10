import { useMemo, useState } from 'react'
import { cx } from '../ui'
import { GameShell } from './GameShell'

/* ==========================================================================
   Oʻyin 1: «Mosini top» — qurilmani vazifasiga ulash.
   Bola chapdan qurilmani, oʻngdan vazifasini bosadi; toʻgʻri boʻlsa yashil.
   ========================================================================== */
interface Juft { id: string; emoji: string; qurilma: string; vazifa: string }
const JUFTLAR: Juft[] = [
  { id: 'switch', emoji: '🔀', qurilma: 'Switch', vazifa: 'Bitta xonadagi kompyuterlarni oʻzaro ulaydi' },
  { id: 'router', emoji: '🌐', qurilma: 'Router', vazifa: 'Tarmoqni Internetga chiqaradi' },
  { id: 'server', emoji: '🖥️', qurilma: 'Server', vazifa: 'Fayl va xizmatlarni hammaga beradi' },
  { id: 'printer', emoji: '🖨️', qurilma: 'Printer', vazifa: 'Hamma birga foydalanadigan chop etuvchi' },
  { id: 'ap', emoji: '📶', qurilma: 'Wi-Fi nuqtasi', vazifa: 'Telefon va noutbukni simsiz ulaydi' },
  { id: 'firewall', emoji: '🛡️', qurilma: 'Firewall', vazifa: 'Xavfli trafikni toʻxtatadi' },
]

function aralash<T>(a: T[]): T[] { return [...a].sort(() => Math.random() - 0.5) }

export default function MosiniTop() {
  const [seed, setSeed] = useState(0)
  const chap = useMemo(() => aralash(JUFTLAR), [seed])
  const ong = useMemo(() => aralash(JUFTLAR), [seed])
  const [tanlangan, setTanlangan] = useState<string | null>(null)
  const [juft, setJuft] = useState<Record<string, boolean>>({}) // id → toʻgʻri topildimi
  const [xato, setXato] = useState<string | null>(null)

  const topilgan = Object.keys(juft).length
  const done = topilgan === JUFTLAR.length

  function vazifaBosildi(id: string) {
    if (!tanlangan || juft[id]) return
    if (tanlangan === id) { setJuft(j => ({ ...j, [id]: true })); setTanlangan(null); setXato(null) }
    else { setXato(tanlangan + '→' + id); setTimeout(() => setXato(null), 650); setTanlangan(null) }
  }

  return (
    <GameShell title="Mosini top" emoji="🔌" saveKey="mosini" saveLabel="Mosini top oʻyini" score={topilgan} max={JUFTLAR.length} done={done}
      onRestart={() => { setSeed(s => s + 1); setJuft({}); setTanlangan(null); setXato(null) }}
      intro={<>Chapdan <strong>qurilmani</strong> bosing, soʻng oʻngdan uning <strong>vazifasini</strong> toping. Toʻgʻri juft yashil boʻladi.</>}>
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Qurilmalar */}
        <div className="space-y-2.5">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Qurilma</div>
          {chap.map(d => {
            const ok = juft[d.id], on = tanlangan === d.id
            return (
              <button key={d.id} type="button" disabled={ok} onClick={() => { if (!ok) { setTanlangan(d.id); setXato(null) } }}
                className={cx('flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left font-bold transition',
                  ok ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : on ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-200' : 'border-slate-200 bg-white hover:border-brand-400 hover:bg-brand-50')}>
                <span className="text-2xl">{d.emoji}</span><span className="flex-1">{d.qurilma}</span>{ok && <span className="text-emerald-500">✓</span>}
              </button>
            )
          })}
        </div>
        {/* Vazifalar */}
        <div className="space-y-2.5">
          <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Vazifasi</div>
          {ong.map(d => {
            const ok = juft[d.id]
            const yomon = xato?.endsWith('→' + d.id)
            return (
              <button key={d.id} type="button" disabled={ok} onClick={() => vazifaBosildi(d.id)}
                className={cx('flex w-full items-center gap-2 rounded-2xl border-2 px-4 py-3 text-left text-[0.97rem] transition',
                  ok ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : yomon ? 'animate-wiggle border-rose-400 bg-rose-50' : tanlangan ? 'border-slate-200 bg-white hover:border-brand-400 hover:bg-brand-50' : 'border-slate-200 bg-slate-50 text-slate-500')}>
                {ok && <span className="text-xl">{d.emoji}</span>}<span className="flex-1">{d.vazifa}</span>
              </button>
            )
          })}
        </div>
      </div>
      {tanlangan && !done && <p className="mt-4 text-center text-sm font-semibold text-brand-700">Endi oʻng tomondan shu qurilmaning vazifasini toping 👉</p>}
    </GameShell>
  )
}
