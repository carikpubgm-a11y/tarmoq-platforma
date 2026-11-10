import { useMemo, useState } from 'react'
import { cx } from '../ui'
import { Feedback, GameShell } from './GameShell'

/* ==========================================================================
   Oʻyin 4: «Tezkor bilimdon» — 10 ta sodda savol, oʻyin uslubida.
   ========================================================================== */
interface Q { q: string; variant: string[]; togri: number; izoh: string }
const SAVOLLAR: Q[] = [
  { q: 'Bitta xonadagi kompyuterlarni oʻzaro ulaydigan qurilma qaysi?', variant: ['Router', 'Switch', 'Printer'], togri: 1, izoh: 'Switch bitta tarmoq ichidagi kompyuterlarni ulaydi.' },
  { q: 'Tarmoqni Internetga qaysi qurilma chiqaradi?', variant: ['Switch', 'Router', 'Server'], togri: 1, izoh: 'Router ichki tarmoqni tashqi dunyo — Internet bilan bogʻlaydi.' },
  { q: 'Qaysi parol eng kuchli?', variant: ['12345', 'olma-7-daryo-kuch', 'parol'], togri: 1, izoh: 'Uzun va bir nechta soʻzdan iborat parol eng kuchli.' },
  { q: 'Wi-Fi — bu...', variant: ['Tarmoq turi', 'Simsiz ulanish usuli', 'Dastur'], togri: 1, izoh: 'Wi-Fi — simsiz ulanish texnologiyasi.' },
  { q: 'Har bir kompyuterga tarmoqda nima beriladi?', variant: ['IP manzil', 'Ism', 'Rang'], togri: 0, izoh: 'IP manzil — kompyuterning tarmoqdagi manzili.' },
  { q: 'Xavfli trafikni qaysi qurilma toʻxtatadi?', variant: ['Printer', 'Firewall', 'Switch'], togri: 1, izoh: 'Firewall — tarmoqning qoʻriqchisi, xavfli ulanishni bloklaydi.' },
  { q: 'Fayl va xizmatlarni hammaga beradigan kompyuter qanday ataladi?', variant: ['Server', 'Modem', 'Hub'], togri: 0, izoh: 'Server umumiy xizmatlarni (fayl, pochta) taqdim etadi.' },
  { q: 'Katta fayl tarmoqda qanday yuboriladi?', variant: ['Butunligicha', 'Kichik paketlarga boʻlinib', 'Rasm shaklida'], togri: 1, izoh: 'Fayl koʻplab kichik paketlarga boʻlinib yuboriladi.' },
  { q: 'Notanish odam «parolingni ayt» desa nima qilasiz?', variant: ['Aytaman', 'Aytmayman', 'Yarmini aytaman'], togri: 1, izoh: 'Parolni hech kimga, hech qachon aytmaslik kerak.' },
  { q: 'Maʼlumotni yoʻqotmaslik uchun nima qilinadi?', variant: ['Zaxira nusxa olinadi', 'Oʻchiriladi', 'Hech narsa'], togri: 0, izoh: 'Zaxira nusxa (backup) maʼlumotni yoʻqotishdan saqlaydi.' },
]

export default function Bilimdon() {
  const [seed, setSeed] = useState(0)
  const savollar = useMemo(() => [...SAVOLLAR].sort(() => Math.random() - 0.5), [seed])
  const [i, setI] = useState(0)
  const [ball, setBall] = useState(0)
  const [tanlov, setTanlov] = useState<number | null>(null)

  const cur = savollar[i]
  const done = i >= savollar.length

  function tanla(oi: number) {
    if (tanlov !== null) return
    setTanlov(oi)
    if (oi === cur.togri) setBall(b => b + 1)
  }

  return (
    <GameShell title="Tezkor bilimdon" emoji="🏆" saveKey="bilimdon" saveLabel="Tezkor bilimdon" score={ball} max={savollar.length} done={done}
      onRestart={() => { setSeed(s => s + 1); setI(0); setBall(0); setTanlov(null) }}
      intro={<>10 ta savol. Har biriga javob bering — darhol izoh chiqadi. Qani koʻramiz, nechta toʻgʻri topasiz!</>}>
      {!done && (
        <div className="mx-auto max-w-2xl">
          <div className="mb-3 flex items-center justify-between">
            <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-extrabold text-brand-700">Savol {i + 1} / {savollar.length}</span>
            <span className="text-sm font-bold text-slate-500">⭐ {ball} ball</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-400 transition-all duration-500" style={{ width: ((i) / savollar.length) * 100 + '%' }} />
          </div>
          <p className="mt-5 text-balance font-display text-[1.3rem] font-extrabold leading-snug text-navy-900">{cur.q}</p>
          <div className="mt-4 space-y-2.5">
            {cur.variant.map((v, oi) => {
              const isC = oi === cur.togri
              const st = tanlov === null ? 'idle' : isC ? 'correct' : tanlov === oi ? 'wrong' : 'dim'
              return (
                <button key={oi} type="button" disabled={tanlov !== null} onClick={() => tanla(oi)}
                  className={cx('flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-4 text-left text-[1.05rem] font-bold transition',
                    st === 'idle' && 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-brand-400 hover:bg-brand-50',
                    st === 'correct' && 'animate-pop border-emerald-400 bg-emerald-50 text-emerald-900',
                    st === 'wrong' && 'animate-wiggle border-rose-400 bg-rose-50 text-rose-900',
                    st === 'dim' && 'border-slate-100 bg-slate-50 text-slate-400')}>
                  <span className={cx('grid h-9 w-9 flex-none place-items-center rounded-xl font-display font-extrabold',
                    st === 'correct' ? 'bg-emerald-500 text-white' : st === 'wrong' ? 'bg-rose-500 text-white' : 'bg-navy-900 text-white')}>
                    {st === 'correct' ? '✓' : st === 'wrong' ? '✕' : 'ABC'[oi]}
                  </span>
                  {v}
                </button>
              )
            })}
          </div>
          {tanlov !== null && (
            <div className="mt-4 space-y-3">
              <Feedback togri={tanlov === cur.togri}>{cur.izoh}</Feedback>
              <button type="button" onClick={() => { setTanlov(null); setI(x => x + 1) }}
                className="w-full rounded-2xl bg-gradient-to-b from-brand-500 to-brand-600 px-5 py-3.5 font-display text-lg font-extrabold text-white btn-pop">
                {i + 1 < savollar.length ? 'Keyingi savol →' : 'Natijani koʻrish 🏁'}
              </button>
            </div>
          )}
        </div>
      )}
    </GameShell>
  )
}
