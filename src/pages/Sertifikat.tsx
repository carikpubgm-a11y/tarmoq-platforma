import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Award, Lock, Printer, Star } from 'lucide-react'
import { Btn, Callout, Progress, cx } from '../components/ui'
import { VAZIFALAR } from '../lib/api'
import { COURSE } from '../data/sections'
import { useOquvchi } from '../lib/student'
import { useStored } from '../lib/storage'
import type { Result, ResultKey } from '../lib/storage'

const OY = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']
const sana = (d = new Date()) => `${d.getDate()}-${OY[d.getMonth()]}, ${d.getFullYear()}-yil`

function daraja(foiz: number) {
  if (foiz >= 86) return { nom: 'Aʼlo', rang: 'from-amber-400 to-orange-400', emoji: '🥇' }
  if (foiz >= 71) return { nom: 'Yaxshi', rang: 'from-cyan-400 to-blue-400', emoji: '🥈' }
  if (foiz >= 56) return { nom: 'Qoniqarli', rang: 'from-emerald-400 to-lime-400', emoji: '🥉' }
  return { nom: 'Ishtirokchi', rang: 'from-violet-400 to-fuchsia-400', emoji: '🎖️' }
}

export default function Sertifikat() {
  const { oquvchi, yangilash } = useOquvchi()
  const [mahalliy] = useStored<Partial<Record<ResultKey, Result>>>('results', {})
  useEffect(() => { void yangilash() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Natijalar: serverdan, boʻlmasa shu brauzerdan
  const natijalar = oquvchi?.natijalar?.length
    ? oquvchi.natijalar.map(n => ({ kod: n.vazifa, ball: n.ball, maks: n.maks }))
    : Object.entries(mahalliy).map(([kod, r]) => ({ kod, ball: r!.score, maks: r!.max }))

  const test = natijalar.find(n => n.kod === 'test')
  const jamiFoiz = natijalar.length
    ? Math.round(natijalar.reduce((a, n) => a + (n.maks ? (n.ball / n.maks) * 100 : 0), 0) / natijalar.length)
    : 0
  const ochiq = !!test
  const d = daraja(jamiFoiz)
  const ism = oquvchi?.toliqIsm || [oquvchi?.familiya, oquvchi?.ism].filter(Boolean).join(' ') || ''

  if (!oquvchi) {
    return (
      <div className="py-16 text-center">
        <span className="text-6xl">🎓</span>
        <h1 className="mt-5 text-3xl font-extrabold">Sertifikat olish uchun avval kiring</h1>
        <p className="mt-3 text-slate-600">Sertifikatda ismingiz va familiyangiz yoziladi.</p>
        <Link to="/kirish-oquvchi" className="mt-7 inline-block rounded-2xl bg-brand-600 px-7 py-4 font-extrabold text-white hover:bg-brand-700">Ism va familiya bilan kirish</Link>
      </div>
    )
  }

  return (
    <>
      <header className="no-print anim-in mb-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-extrabold text-amber-800"><Award size={18} /> Yakuniy hujjat</span>
        <h1 className="mt-4 text-[2.1rem] font-extrabold leading-tight sm:text-[2.7rem]">Sertifikatingiz</h1>
        <p className="mt-3 max-w-2xl text-[1.1rem] text-slate-600">
          {ochiq
            ? 'Tabriklaymiz! Yakuniy testni yakunladingiz. Sertifikatni chop eting yoki PDF sifatida saqlang.'
            : 'Sertifikat yakuniy testni yakunlaganingizdan soʻng ochiladi.'}
        </p>
      </header>

      {!ochiq && (
        <div className="no-print mb-8 space-y-4">
          <Callout kind="warn" title="Sertifikat hali yopiq">
            Uni ochish uchun <Link to="/test">yakuniy testni</Link> toʻliq yeching. Boshqa vazifalarni ham bajarsangiz, darajangiz yuqoriroq boʻladi.
          </Callout>
          <div className="rounded-4xl border-2 border-slate-200 bg-white p-6 shadow-card">
            <h2 className="font-display text-lg font-extrabold">Bajarilgan vazifalar: {natijalar.length} / {Object.keys(VAZIFALAR).length}</h2>
            <Progress className="mt-3" value={natijalar.length} max={Object.keys(VAZIFALAR).length} />
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {Object.entries(VAZIFALAR).map(([kod, v]) => {
                const n = natijalar.find(x => x.kod === kod)
                return (
                  <li key={kod} className={cx('flex items-center gap-3 rounded-2xl border-2 px-4 py-3', n ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200')}>
                    <span className="text-xl">{v.emoji}</span>
                    <Link to={v.yoʻl} className="flex-1 font-bold text-navy-900 hover:text-brand-700">{v.nom}</Link>
                    <span className={cx('font-mono text-sm font-extrabold', n ? 'text-emerald-700' : 'text-slate-400')}>
                      {n ? Math.round((n.ball / n.maks) * 100) + '%' : <Lock size={15} />}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}

      {/* ---------- SERTIFIKAT ---------- */}
      <div className={cx('relative', !ochiq && 'no-print pointer-events-none select-none opacity-40 blur-[2px]')}>
        <article className="relative overflow-hidden rounded-4xl bg-white p-2 shadow-lift print:rounded-none print:shadow-none" aria-label="Sertifikat">
          <div className={cx('absolute inset-0 bg-gradient-to-br', d.rang)} />
          <div className="relative rounded-[1.7rem] border-4 border-double border-amber-300/70 bg-white px-6 py-10 text-center sm:px-12 sm:py-14 print:rounded-none">
            <div className="pointer-events-none absolute inset-0 opacity-[0.045]" aria-hidden="true"
              style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #7C3AED 0 2px, transparent 2px), radial-gradient(circle at 80% 70%, #06B6D4 0 2px, transparent 2px)', backgroundSize: '44px 44px' }} />

            <div className="relative">
              <span className={cx('mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br text-4xl shadow-lift', d.rang)}>{d.emoji}</span>
              <p className="mt-6 font-display text-sm font-extrabold uppercase tracking-[0.42em] text-amber-700">Sertifikat</p>
              <div className="mx-auto mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-amber-400 to-orange-400" />

              <p className="mt-8 text-[1.05rem] text-slate-500">Ushbu sertifikat</p>
              <p className="text-balance mt-2 font-display text-[2rem] font-extrabold leading-tight text-navy-900 sm:text-[2.8rem]">{ism}</p>
              <p className="mt-1.5 text-[1.05rem] font-semibold text-slate-500">{oquvchi.sinf} oʻquvchisiga berildi</p>

              <p className="mx-auto mt-7 max-w-2xl text-[1.05rem] leading-relaxed text-slate-600">
                U <strong className="font-extrabold text-navy-900">«{COURSE.title}»</strong> mavzusi boʻyicha
                nazariy darslarni oʻzlashtirdi, interaktiv laboratoriyada oʻz tarmogʻini qurdi va yakuniy testni yakunladi.
              </p>

              <div className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
                {[['Daraja', d.nom], ['Natija', jamiFoiz + '%'], ['Bajarilgan vazifa', `${natijalar.length} / ${Object.keys(VAZIFALAR).length}`]].map(([k, v]) => (
                  <div key={k} className="rounded-2xl border-2 border-slate-200 bg-slate-50 px-3 py-3 print:bg-white">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{k}</div>
                    <div className="font-display text-xl font-extrabold text-navy-900">{v}</div>
                  </div>
                ))}
              </div>

              <div className="mt-9 flex items-center justify-center gap-1.5 text-amber-400" aria-hidden="true">
                {[0, 1, 2, 3, 4].map(i => <Star key={i} size={18} className={i < Math.round(jamiFoiz / 20) ? 'fill-amber-400' : 'opacity-25'} />)}
              </div>

              <div className="mt-9 grid gap-8 border-t-2 border-slate-100 pt-7 sm:grid-cols-2">
                <div>
                  <div className="mx-auto h-px w-44 bg-slate-300" />
                  <p className="mt-2 text-sm font-semibold text-slate-500">Oʻqituvchi imzosi</p>
                </div>
                <div>
                  <p className="font-display text-base font-extrabold text-navy-900">{sana()}</p>
                  <p className="mt-1 text-sm text-slate-500">{COURSE.subject}</p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

      {ochiq && (
        <div className="no-print mt-7 flex flex-wrap gap-3">
          <Btn variant="primary" size="lg" icon={Printer} onClick={() => window.print()}>Chop etish / PDF saqlash</Btn>
          <Link to="/reyting" className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-6 py-4 font-extrabold text-navy-900 hover:border-brand-400 hover:bg-brand-50">
            🏆 Reytingni koʻrish
          </Link>
        </div>
      )}
    </>
  )
}
