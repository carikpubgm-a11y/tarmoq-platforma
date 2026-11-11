import { useState } from 'react'
import { Check, Sparkles } from 'lucide-react'
import { Konfetti, cx } from './ui'
import { saveResult, type ResultKey } from '../lib/storage'

/** Yengil «mustahkamlash»: oʻquvchi asosiy narsalarni belgilaydi (test emas — xato yoʻq).
    Hammasini belgilagach — ball reytingga qoʻshiladi. */
export default function EslabQol({ saveKey, intro, items }: {
  saveKey: ResultKey
  intro: string
  items: { emoji: string; label: string; izoh: string }[]
}) {
  const [tanlangan, setTanlangan] = useState<number[]>([])
  const [party, setParty] = useState(false)
  const done = tanlangan.length === items.length

  function tap(i: number) {
    if (tanlangan.includes(i)) return
    const next = [...tanlangan, i]
    setTanlangan(next)
    if (next.length === items.length) {
      saveResult(saveKey, { score: items.length, max: items.length, label: 'Tarmoq asoslari', detail: 'mustahkamlandi' })
      setParty(true)
      setTimeout(() => setParty(false), 1800)
    }
  }

  return (
    <section className="relative overflow-hidden rounded-4xl border-2 border-brand-200 bg-white shadow-lift">
      {party && <Konfetti on />}
      <div className="flex flex-wrap items-center gap-3 bg-gradient-to-r from-brand-600 to-violet-500 px-5 py-4 sm:px-6">
        <span className="text-3xl">🧠</span>
        <h2 className="mr-auto font-display text-lg font-extrabold !text-white sm:text-xl">Mustahkamlab ol</h2>
        <span className="rounded-full bg-white/90 px-3.5 py-1.5 font-display text-base font-extrabold text-brand-700" role="status" aria-live="polite">
          {tanlangan.length} / {items.length}
        </span>
      </div>
      <div className="p-5 sm:p-6">
        <p className="mb-5 flex gap-3 rounded-2xl border-2 border-brand-100 bg-brand-50 p-4 text-[1.02rem] text-slate-700">
          <span className="flex-none text-xl">🎯</span><span>{intro}</span>
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {items.map((it, i) => {
            const on = tanlangan.includes(i)
            return (
              <button key={i} type="button" onClick={() => tap(i)} disabled={on}
                className={cx('relative rounded-3xl border-2 p-4 text-left transition',
                  on ? 'animate-pop border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-brand-400 hover:bg-brand-50 hover:shadow-card')}>
                <span className="mb-2 flex items-center justify-between">
                  <span className="text-3xl" aria-hidden="true">{it.emoji}</span>
                  {on && <span className="grid h-7 w-7 place-items-center rounded-xl bg-emerald-500 text-white"><Check size={16} strokeWidth={3} /></span>}
                </span>
                <span className="block font-display text-[1.05rem] font-extrabold text-navy-900">{it.label}</span>
                <span className="block text-[0.92rem] text-slate-500">{it.izoh}</span>
              </button>
            )
          })}
        </div>
        {done && (
          <div className="anim-in mt-6 flex flex-wrap items-center gap-4 rounded-3xl border-2 border-emerald-300 bg-emerald-50 p-5">
            <span className="text-5xl">🏆</span>
            <div className="flex-1">
              <p className="font-display text-xl font-extrabold text-navy-900">Barakalla! Hammasini belgilading.</p>
              <p className="flex items-center gap-1.5 text-slate-600"><Sparkles size={15} className="text-amber-500" /> Balling reytingga qoʻshildi.</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
