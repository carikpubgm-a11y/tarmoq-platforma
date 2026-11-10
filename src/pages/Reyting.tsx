import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Award, RefreshCw, Trophy, Users } from 'lucide-react'
import { Btn, Callout, Progress, cx } from '../components/ui'
import { api, VAZIFALAR, VAZIFA_KODLARI, type Oquvchi } from '../lib/api'
import { useOquvchi } from '../lib/student'

const MEDAL = ['🥇', '🥈', '🥉']

/** Oʻquvchilar koʻradigan reyting — kim koʻp ball toʻplagan. */
export default function Reyting() {
  const { oquvchi, yangilash } = useOquvchi()
  const [royxat, setRoyxat] = useState<Oquvchi[]>([])
  const [sinflar, setSinflar] = useState<string[]>([])
  const [sinf, setSinf] = useState(oquvchi?.sinf ?? '')
  const [holat, setHolat] = useState<'yuklanmoqda' | 'tayyor' | 'xato'>('yuklanmoqda')

  const yukla = useCallback(async (s: string) => {
    try {
      const d = await api.reyting(s || undefined)
      setRoyxat(d.reyting); setSinflar(d.sinflar); setHolat('tayyor')
    } catch { setHolat('xato') }
  }, [])
  useEffect(() => { void yukla(sinf); void yangilash() }, [sinf]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { const t = setInterval(() => void yukla(sinf), 12000); return () => clearInterval(t) }, [sinf, yukla])

  const meniOrnim = royxat.findIndex(o => o.id === oquvchi?.id)
  const eng = royxat[0]?.jamiBall || 1

  return (
    <>
      <header className="anim-in mb-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-extrabold text-amber-800"><Trophy size={18} /> Sinf reytingi</span>
        <h1 className="mt-4 text-[2.1rem] font-extrabold leading-tight sm:text-[2.7rem]">Kim oldinda?</h1>
        <p className="mt-3 max-w-2xl text-[1.1rem] text-slate-600">
          Har bir bajarilgan vazifa uchun ball olasiz. Vazifani qayta bajarsangiz, <strong className="font-bold text-navy-900">eng yaxshi natijangiz</strong> saqlanadi.
        </p>
      </header>

      {holat === 'xato' && (
        <Callout kind="warn" title="Server topilmadi">
          Reyting faqat oʻqituvchining serveri ishlab turganda koʻrinadi. Hozircha vazifalaringiz shu qurilmada saqlanmoqda va server qaytganda oʻzi yuboriladi.
        </Callout>
      )}

      {holat === 'tayyor' && (
        <>
          <div className="no-print mb-5 flex flex-wrap items-center gap-2.5">
            <button type="button" onClick={() => setSinf('')} aria-pressed={!sinf}
              className={cx('rounded-2xl border-2 px-4 py-2.5 font-extrabold transition', !sinf ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-200 bg-white hover:border-brand-400')}>Hamma sinf</button>
            {sinflar.map(s => (
              <button key={s} type="button" onClick={() => setSinf(s)} aria-pressed={sinf === s}
                className={cx('rounded-2xl border-2 px-4 py-2.5 font-extrabold transition', sinf === s ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-200 bg-white hover:border-brand-400')}>{s}</button>
            ))}
            <Btn size="sm" icon={RefreshCw} className="ml-auto" onClick={() => void yukla(sinf)}>Yangilash</Btn>
          </div>

          {!royxat.length ? (
            <Callout kind="info" title="Reyting hali boʻsh">Birinchi boʻlib vazifa bajargan oʻquvchi shu yerda paydo boʻladi. <Link to="/">Darslarga oʻtish</Link></Callout>
          ) : (
            <>
              {/* ---------- Soʻrilar ---------- */}
              <div className="mb-6 grid items-end gap-3 sm:grid-cols-3">
                {[1, 0, 2].map(i => {
                  const o = royxat[i]
                  if (!o) return <div key={i} className="hidden sm:block" />
                  const men = o.id === oquvchi?.id
                  return (
                    <div key={o.id} className={cx('animate-bounce-in overflow-hidden rounded-4xl border-2 bg-white text-center shadow-card',
                      i === 0 ? 'border-amber-300 sm:order-2' : i === 1 ? 'border-slate-300 sm:order-1' : 'border-orange-200 sm:order-3',
                      men && 'ring-4 ring-brand-300')}>
                      <div className={cx('bg-gradient-to-b py-4', i === 0 ? 'from-amber-300 to-amber-100' : i === 1 ? 'from-slate-200 to-slate-100' : 'from-orange-200 to-orange-100')}>
                        <div className={i === 0 ? 'text-6xl' : 'text-5xl'}>{MEDAL[i]}</div>
                      </div>
                      <div className="p-4">
                        <div className="truncate font-display text-lg font-extrabold text-navy-900">{o.toliqIsm}</div>
                        <div className="text-sm text-slate-500">{o.sinf}</div>
                        <div className="mt-2 font-display text-3xl font-extrabold text-brand-700">{o.jamiBall}</div>
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">ball</div>
                        {men && <div className="mt-2 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-extrabold text-brand-700">Bu — siz!</div>}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* ---------- Toʻliq roʻyxat ---------- */}
              <ol className="space-y-2.5">
                {royxat.map((o, i) => {
                  const men = o.id === oquvchi?.id
                  return (
                    <li key={o.id} className={cx('flex flex-wrap items-center gap-3 rounded-3xl border-2 bg-white p-3.5 shadow-card transition sm:p-4',
                      men ? 'border-brand-400 ring-2 ring-brand-200' : 'border-slate-200')}>
                      <span className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-slate-100 font-display text-lg font-extrabold text-slate-600">
                        {i < 3 ? MEDAL[i] : i + 1}
                      </span>
                      <span className="min-w-[8rem] flex-1">
                        <span className="block font-display text-[1.05rem] font-extrabold text-navy-900">{o.toliqIsm}{men && <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-700">siz</span>}</span>
                        <span className="block text-sm text-slate-500">{o.sinf} · {o.bajarilgan} ta vazifa bajarildi</span>
                      </span>
                      <span className="hidden gap-1 sm:flex" aria-hidden="true">
                        {VAZIFA_KODLARI.map(k => {
                          const n = o.natijalar.find(x => x.vazifa === k)
                          return <span key={k} title={VAZIFALAR[k].nom} className={cx('grid h-8 w-8 place-items-center rounded-lg text-sm', n ? 'bg-emerald-100' : 'bg-slate-100 opacity-40 grayscale')}>{VAZIFALAR[k].emoji}</span>
                        })}
                      </span>
                      <span className="w-full sm:w-40">
                        <span className="flex items-baseline justify-between"><span className="font-display text-xl font-extrabold text-brand-700">{o.jamiBall}</span><span className="text-xs font-bold text-slate-400">ball</span></span>
                        <Progress className="mt-1 !h-2" value={o.jamiBall} max={eng} tone={i === 0 ? 'amber' : 'violet'} />
                      </span>
                      {o.baho != null && <span className="grid h-11 w-11 flex-none place-items-center rounded-2xl bg-emerald-100 font-display text-xl font-extrabold text-emerald-700" title="Oʻqituvchi bahosi">{o.baho}</span>}
                    </li>
                  )
                })}
              </ol>

              {oquvchi && meniOrnim >= 0 && (
                <div className="mt-6 flex flex-wrap items-center gap-4 rounded-4xl border-2 border-brand-200 bg-white p-5 shadow-card">
                  <span className="text-4xl">{meniOrnim === 0 ? '🏆' : meniOrnim < 3 ? '🎉' : '💪'}</span>
                  <p className="flex-1 font-display text-[1.05rem] font-extrabold text-navy-900">
                    Siz {royxat.length} oʻquvchi ichida <span className="text-brand-700">{meniOrnim + 1}-oʻrindasiz</span>.
                    {meniOrnim > 0 && ` Birinchi oʻringa yetish uchun yana ${royxat[0].jamiBall - royxat[meniOrnim].jamiBall} ball kerak.`}
                  </p>
                  <Link to="/sertifikat" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-b from-amber-400 to-orange-400 px-5 py-3 font-extrabold text-navy-900 btn-pop"><Award size={19} /> Sertifikat</Link>
                </div>
              )}
            </>
          )}
        </>
      )}

      {!oquvchi && (
        <Callout kind="note" title="Reytingga qoʻshilish" className="mt-6">
          <Link to="/kirish-oquvchi">Ism va familiyangiz bilan kiring</Link> — shundan keyin bajargan vazifalaringiz shu roʻyxatda koʻrinadi.
        </Callout>
      )}

      <p className="mt-8 flex items-center gap-2 text-sm text-slate-400"><Users size={15} /> Reyting har 12 soniyada oʻzi yangilanadi.</p>
    </>
  )
}
