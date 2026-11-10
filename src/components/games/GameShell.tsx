import { useEffect, useState, type ReactNode } from 'react'
import { PartyPopper, RotateCcw, Star } from 'lucide-react'
import { Btn, Konfetti, cx } from '../ui'
import { saveResult, type ResultKey } from '../../lib/storage'

/** Barcha oʻyinlar uchun umumiy qobiq: koʻrsatma, ball, qayta boshlash, gʻalaba ekrani. */
export function GameShell({ title, emoji, intro, children, score, max, onRestart, saveKey, saveLabel, done }: {
  title: string; emoji: string; intro: ReactNode; children: ReactNode
  score: number; max: number; onRestart: () => void
  saveKey?: ResultKey; saveLabel?: string; done: boolean
}) {
  const [party, setParty] = useState(false)
  useEffect(() => {
    if (done && saveKey) saveResult(saveKey, { score, max, label: saveLabel || title, detail: `${score} / ${max}` })
    if (done) { setParty(true); const t = setTimeout(() => setParty(false), 1800); return () => clearTimeout(t) }
  }, [done]) // eslint-disable-line react-hooks/exhaustive-deps

  const foiz = max ? Math.round((score / max) * 100) : 0
  return (
    <section className="relative overflow-hidden rounded-4xl border-2 border-brand-200 bg-white shadow-lift">
      {party && <Konfetti on />}
      <div className="flex flex-wrap items-center gap-3 bg-gradient-to-r from-brand-600 to-violet-500 px-5 py-4 sm:px-6">
        <span className="text-3xl">{emoji}</span>
        <h2 className="mr-auto font-display text-lg font-extrabold !text-white sm:text-xl">{title}</h2>
        <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1.5 font-display text-base font-extrabold text-brand-700" role="status" aria-live="polite">
          <Star size={17} className={score ? 'fill-amber-400 text-amber-400' : 'text-brand-300'} />{score} / {max}
        </span>
        <Btn size="sm" variant="secondary" icon={RotateCcw} onClick={onRestart}>Boshidan</Btn>
      </div>
      <div className="p-5 sm:p-6">
        <p className="mb-5 flex gap-3 rounded-2xl border-2 border-brand-100 bg-brand-50 p-4 text-[1.02rem] text-slate-700">
          <span className="flex-none text-xl">🎯</span><span>{intro}</span>
        </p>
        {children}
        {done && (
          <div className={cx('anim-in mt-6 flex flex-wrap items-center gap-4 rounded-3xl border-2 p-5',
            foiz >= 80 ? 'border-emerald-300 bg-emerald-50' : 'border-amber-300 bg-amber-50')}>
            <span className="text-5xl">{foiz >= 80 ? '🏆' : foiz >= 50 ? '👍' : '💪'}</span>
            <div className="flex-1">
              <p className="font-display text-xl font-extrabold text-navy-900">
                {foiz >= 80 ? 'Zoʻr natija!' : foiz >= 50 ? 'Yaxshi!' : 'Yana urinib koʻr!'}
              </p>
              <p className="text-slate-600">{max} tadan {score} tasi toʻgʻri — {foiz}%. {saveKey && 'Ballaring reytingga qoʻshildi.'}</p>
            </div>
            <Btn variant="primary" icon={PartyPopper} onClick={onRestart}>Qaytadan oʻynash</Btn>
          </div>
        )}
      </div>
    </section>
  )
}

/** Toʻgʻri/notoʻgʻri javobdan keyin chiqadigan qisqa izoh. */
export function Feedback({ togri, children }: { togri: boolean; children: ReactNode }) {
  return (
    <p className={cx('anim-in flex items-start gap-2.5 rounded-2xl border-2 px-4 py-3 text-[0.98rem] leading-relaxed',
      togri ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-amber-200 bg-amber-50 text-amber-900')}>
      <span className="flex-none text-lg">{togri ? '🎉' : '💡'}</span>
      <span><strong>{togri ? 'Barakalla! ' : 'Eʼtibor ber. '}</strong>{children}</span>
    </p>
  )
}
