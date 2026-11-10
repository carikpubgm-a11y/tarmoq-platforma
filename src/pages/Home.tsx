import { Link } from 'react-router-dom'
import { ArrowRight, Award, Check, Lock, LogIn, Play, Sparkles, Trophy } from 'lucide-react'
import { COURSE, GROUPS, SECTIONS } from '../data/sections'
import { useStored, type Result, type ResultKey } from '../lib/storage'
import { useOquvchi } from '../lib/student'
import { VAZIFALAR } from '../lib/api'
import { Progress, TONE, cx } from '../components/ui'

const DARSLAR = SECTIONS.filter(s => !s.child && s.path !== '/' && !['/reyting', '/sertifikat'].includes(s.path))

export default function Home() {
  const { oquvchi, aloqa } = useOquvchi()
  const [visited] = useStored<string[]>('visited', [])
  const [mahalliy] = useStored<Partial<Record<ResultKey, Result>>>('results', {})

  const bajarilgan = oquvchi?.natijalar?.length
    ? new Set(oquvchi.natijalar.map(n => n.vazifa))
    : new Set(Object.keys(mahalliy))
  const korilgan = DARSLAR.filter(s => visited.includes(s.path)).length
  const keyingi = DARSLAR.find(s => !visited.includes(s.path)) ?? DARSLAR[0]
  const ball = oquvchi?.jamiBall ?? 0
  const soat = new Date().getHours()
  const salom = soat < 11 ? 'Xayrli tong' : soat < 17 ? 'Xayrli kun' : 'Xayrli kech'

  return (
    <>
      {/* ---------- Salomlashuv ---------- */}
      <section className="anim-in relative mb-8 overflow-hidden rounded-4xl bg-gradient-to-br from-brand-600 via-violet-600 to-cyan-500 px-6 py-8 text-white shadow-lift sm:px-10 sm:py-11">
        <span className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 animate-float rounded-full bg-white/10" aria-hidden="true" />
        <span className="pointer-events-none absolute -bottom-16 right-24 h-40 w-40 rounded-full bg-white/10" aria-hidden="true" />
        <div className="relative">
          {oquvchi ? (
            <>
              <p className="font-display text-lg font-bold text-white/90">{salom}, {oquvchi.ism}! 👋</p>
              <h1 className="text-balance mt-2 text-[2rem] font-extrabold leading-[1.12] !text-white sm:text-[2.8rem]">
                Bugun kompyuter tarmoqlarini oʻrganamiz
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-2xl bg-white/20 px-4 py-2.5 font-display text-lg font-extrabold backdrop-blur"><Trophy size={20} /> {ball} ball</span>
                <span className="inline-flex items-center gap-2 rounded-2xl bg-white/20 px-4 py-2.5 font-display text-lg font-extrabold backdrop-blur">✅ {bajarilgan.size} / {Object.keys(VAZIFALAR).length} vazifa</span>
                <span className="inline-flex items-center gap-2 rounded-2xl bg-white/20 px-4 py-2.5 font-display text-lg font-extrabold backdrop-blur">📘 {korilgan} / {DARSLAR.length} dars</span>
              </div>
            </>
          ) : (
            <>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-extrabold backdrop-blur"><Sparkles size={17} /> Informatika</span>
              <h1 className="text-balance mt-4 text-[2rem] font-extrabold leading-[1.12] !text-white sm:text-[2.9rem]">
                Kompyuter tarmoqlari va ularning xavfsizligi
              </h1>
              <p className="mt-4 max-w-2xl text-[1.1rem] leading-relaxed text-white/90">
                Darslarni oʻqing, oʻz tarmogʻingizni quring, testni yeching — va ism-familiyangiz yozilgan sertifikat oling.
              </p>
              <Link to="/kirish-oquvchi" className="btn-pop mt-7 inline-flex items-center gap-2.5 rounded-2xl bg-white px-7 py-4 font-display text-lg font-extrabold text-brand-700 transition hover:bg-brand-50">
                <LogIn size={22} /> Ism va familiya bilan kirish
              </Link>
            </>
          )}
        </div>
      </section>

      {/* ---------- Keyingi qadam ---------- */}
      {keyingi && (
        <Link to={keyingi.path} className="group anim-in mb-10 flex flex-wrap items-center gap-5 rounded-4xl border-2 border-emerald-200 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-lift sm:p-6">
          <span className="grid h-16 w-16 flex-none place-items-center rounded-3xl bg-gradient-to-br from-emerald-500 to-lime-400 text-white"><Play size={30} className="ml-1" /></span>
          <span className="min-w-[12rem] flex-1">
            <span className="block text-xs font-extrabold uppercase tracking-[0.12em] text-emerald-700">{korilgan ? 'Davom eting' : 'Shu yerdan boshlang'}</span>
            <span className="block font-display text-[1.4rem] font-extrabold text-navy-900">{keyingi.title}</span>
          </span>
          <span className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-emerald-100 text-emerald-700 transition group-hover:translate-x-1"><ArrowRight size={24} /></span>
        </Link>
      )}

      {/* ---------- Vazifalar va ball ---------- */}
      <section className="mb-10">
        <h2 className="mb-1 text-[1.6rem] font-extrabold sm:text-[1.9rem]">Vazifalar va ballar</h2>
        <p className="mb-5 text-[1.05rem] text-slate-600">Har bir vazifa uchun ball olasiz. Qayta bajarsangiz — eng yaxshi natijangiz saqlanadi.</p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Object.entries(VAZIFALAR).map(([kod, v]) => {
            const n = oquvchi?.natijalar?.find(x => x.vazifa === kod)
            const m = mahalliy[kod as ResultKey]
            const foiz = n ? Math.round((n.ball / n.maks) * 100) : m ? Math.round((m.score / m.max) * 100) : null
            return (
              <Link key={kod} to={v.yoʻl} className={cx('group rounded-3xl border-2 bg-white p-4 shadow-card transition hover:-translate-y-1 hover:shadow-lift',
                foiz === null ? 'border-slate-200' : foiz >= 86 ? 'border-emerald-300' : foiz >= 56 ? 'border-amber-300' : 'border-rose-300')}>
                <div className="flex items-start justify-between">
                  <span className="text-3xl transition group-hover:scale-110">{v.emoji}</span>
                  {foiz === null
                    ? <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-extrabold text-slate-400">boshlanmagan</span>
                    : <span className={cx('rounded-full px-2.5 py-1 font-display text-sm font-extrabold', foiz >= 86 ? 'bg-emerald-100 text-emerald-700' : foiz >= 56 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-700')}>{foiz}%</span>}
                </div>
                <div className="mt-3 font-display text-[1.05rem] font-extrabold leading-snug text-navy-900">{v.nom}</div>
                <Progress className="mt-2.5 !h-2" value={foiz ?? 0} tone={foiz === null ? 'slate' : foiz >= 86 ? 'green' : foiz >= 56 ? 'amber' : 'rose'} />
              </Link>
            )
          })}
        </div>
      </section>

      {/* ---------- Darslar ---------- */}
      <section className="mb-10">
        <h2 className="mb-1 text-[1.6rem] font-extrabold sm:text-[1.9rem]">Darslar</h2>
        <p className="mb-5 text-[1.05rem] text-slate-600">Tartib bilan oʻqish qulay, lekin istalgan darsni ochishingiz mumkin.</p>
        <div className="space-y-7">
          {GROUPS.map(g => {
            const list = SECTIONS.filter(s => s.group === g && s.path !== '/')
            if (!list.length) return null
            return (
              <div key={g}>
                <h3 className="mb-3 inline-block rounded-full bg-slate-200/70 px-3.5 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-slate-600">{g}</h3>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {list.map(s => {
                    const ok = visited.includes(s.path)
                    return (
                      <Link key={s.path} to={s.path} className={cx('group flex items-center gap-3.5 rounded-3xl border-2 bg-white p-4 shadow-card transition hover:-translate-y-1 hover:shadow-lift', TONE[s.tone].border)}>
                        <span className={cx('grid h-12 w-12 flex-none place-items-center rounded-2xl bg-gradient-to-br text-white transition group-hover:scale-110', TONE[s.tone].grad)}><s.icon size={23} /></span>
                        <span className="min-w-0 flex-1">
                          <span className={cx('block font-mono text-xs font-extrabold', TONE[s.tone].text)}>{s.no}</span>
                          <span className="block font-display font-extrabold leading-snug text-navy-900">{s.short}</span>
                        </span>
                        {ok
                          ? <span className="grid h-8 w-8 flex-none place-items-center rounded-xl bg-emerald-100 text-emerald-700"><Check size={17} strokeWidth={3} /></span>
                          : <ArrowRight size={19} className="flex-none text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600" />}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ---------- Reyting va sertifikat ---------- */}
      <section className="grid gap-4 md:grid-cols-2">
        <Link to="/reyting" className="group flex items-center gap-5 overflow-hidden rounded-4xl border-2 border-amber-200 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lift">
          <span className="text-5xl transition group-hover:scale-110">🏆</span>
          <span><span className="block font-display text-xl font-extrabold text-navy-900">Sinf reytingi</span><span className="block text-slate-600">Kim eng koʻp ball toʻplagan? Oʻz oʻrningizni koʻring.</span></span>
        </Link>
        <Link to="/sertifikat" className="group flex items-center gap-5 overflow-hidden rounded-4xl border-2 border-violet-200 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lift">
          <span className="grid h-14 w-14 flex-none place-items-center rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-400 text-white transition group-hover:scale-110">
            {bajarilgan.has('test') ? <Award size={28} /> : <Lock size={26} />}
          </span>
          <span><span className="block font-display text-xl font-extrabold text-navy-900">Sertifikat</span>
            <span className="block text-slate-600">{bajarilgan.has('test') ? 'Tayyor! Ism-familiyangiz bilan oling.' : 'Yakuniy testdan keyin ochiladi.'}</span></span>
        </Link>
      </section>

      {!oquvchi && aloqa === 'bor' && (
        <p className="mt-8 rounded-3xl border-2 border-brand-200 bg-brand-50 p-5 text-center text-[1.05rem] font-semibold text-brand-900">
          Ballaringiz va sertifikat saqlanishi uchun <Link to="/kirish-oquvchi" className="underline decoration-2">ism-familiyangiz bilan kiring</Link>.
        </p>
      )}
      <p className="mt-8 text-center text-sm text-slate-400">{COURSE.subject}</p>
    </>
  )
}
