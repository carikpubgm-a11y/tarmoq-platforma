import { Link } from 'react-router-dom'
import { ArrowRight, Award, Check, Lock, LogIn, MessageSquare, Play, Rocket, Trophy } from 'lucide-react'
import { COURSE, METODLAR } from '../data/sections'
import { SAYOHAT, ochilganNishonlar } from '../data/sayohat'
import { useStored, type Result, type ResultKey } from '../lib/storage'
import { useOquvchi } from '../lib/student'
import { TONE, cx } from '../components/ui'

export default function Home() {
  const { oquvchi } = useOquvchi()
  const [visited] = useStored<string[]>('visited', [])
  const [mahalliy] = useStored<Partial<Record<ResultKey, Result>>>('results', {})

  const bajarilgan = new Set<string>(oquvchi?.natijalar?.length ? oquvchi.natijalar.map(n => n.vazifa) : Object.keys(mahalliy))
  const ball = oquvchi?.jamiBall ?? 0
  // bosqich tugadimi (yashil belgi): oʻyinli bosqich → natija bor; boshqalari → koʻrilgan
  const tugadi = (s: typeof SAYOHAT[number]) => s.gameKey ? bajarilgan.has(s.gameKey) : visited.includes(s.path)
  // bosqichga «yetib borilganmi» (qulf uchun): koʻrilgan yoki oʻyin bajarilgan
  const yetilgan = (s: typeof SAYOHAT[number]) => visited.includes(s.path) || (!!s.gameKey && bajarilgan.has(s.gameKey))
  const engUzoq = SAYOHAT.reduce((m, s, i) => (yetilgan(s) ? i : m), -1)
  const ochiqmi = (i: number) => i <= engUzoq + 1
  const tugaganSoni = SAYOHAT.filter(tugadi).length
  const keyingi = SAYOHAT.find(s => !tugadi(s)) ?? SAYOHAT[0]
  const nishonlar = ochilganNishonlar(bajarilgan, ball)
  const soat = new Date().getHours()
  const salom = soat < 11 ? 'Xayrli tong' : soat < 17 ? 'Xayrli kun' : 'Xayrli kech'

  return (
    <>
      {/* ---------- Xush kelibsiz ---------- */}
      <section className="anim-in relative mb-8 overflow-hidden rounded-4xl bg-gradient-to-br from-brand-600 via-violet-600 to-cyan-500 px-6 py-9 text-white shadow-lift sm:px-10 sm:py-12">
        <span className="pointer-events-none absolute right-6 top-6 animate-float text-6xl opacity-80" aria-hidden="true">🌐</span>
        <span className="pointer-events-none absolute -bottom-10 right-28 h-40 w-40 rounded-full bg-white/10" aria-hidden="true" />
        <div className="relative max-w-2xl">
          <p className="font-display text-lg font-bold text-white/90">{oquvchi ? `${salom}, ${oquvchi.ism}! 👋` : 'Informatika darsi'}</p>
          <h1 className="text-balance mt-2 text-[2.1rem] font-extrabold leading-[1.1] !text-white sm:text-[3rem]">
            Tarmoq olamiga xush kelibsiz!
          </h1>
          <p className="mt-4 text-[1.12rem] leading-relaxed text-white/90">
            7 bosqichli sarguzasht seni kutyapti. Oʻqisan, oʻynaysan, oʻz tarmogʻingni quryasan va <strong>tarmoq ustasi</strong> boʻlasan!
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link to={keyingi.path} className="btn-pop inline-flex items-center gap-2.5 rounded-2xl bg-white px-7 py-4 font-display text-lg font-extrabold text-brand-700 transition hover:bg-brand-50">
              <Rocket size={22} /> {tugaganSoni ? 'Sarguzashtni davom ettirish' : 'Sarguzashtni boshlash'}
            </Link>
            {!oquvchi && (
              <Link to="/kirish-oquvchi" className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/40 px-5 py-4 font-extrabold text-white transition hover:bg-white/10">
                <LogIn size={20} /> Ism bilan kirish
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ---------- Progress ---------- */}
      <section className="mb-8 flex flex-wrap items-center gap-4 rounded-4xl border-2 border-slate-200 bg-white p-5 shadow-card sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 text-navy-900"><Trophy size={26} /></span>
          <div><div className="font-display text-3xl font-extrabold text-navy-900">{ball}</div><div className="text-sm font-bold text-slate-500">ball</div></div>
        </div>
        <div className="min-w-[12rem] flex-1">
          <div className="mb-1.5 flex items-baseline justify-between">
            <span className="font-display font-extrabold text-navy-900">Sayohat: {tugaganSoni} / {SAYOHAT.length} bosqich</span>
            <span className="text-sm font-bold text-slate-500">{Math.round((tugaganSoni / SAYOHAT.length) * 100)}%</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-500 via-violet-500 to-cyan-400 transition-all duration-700" style={{ width: (tugaganSoni / SAYOHAT.length) * 100 + '%' }} />
          </div>
        </div>
      </section>

      {/* ---------- Sayohat xaritasi (7 bosqich) ---------- */}
      <section className="mb-10">
        <h2 className="mb-1 text-[1.6rem] font-extrabold sm:text-[1.9rem]">Sayohat xaritasi 🗺️</h2>
        <p className="mb-5 text-[1.05rem] text-slate-600">Har bir bosqichni tugatib, keyingisini oching.</p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {SAYOHAT.map((s, i) => {
            const ok = tugadi(s)
            const ochiq = ochiqmi(i)
            const t = TONE[s.tone]
            const Inner = (
              <>
                <div className="flex items-start justify-between">
                  <span className={cx('grid h-14 w-14 place-items-center rounded-2xl text-3xl transition group-hover:scale-110', ochiq ? cx('bg-gradient-to-br text-white', t.grad) : 'bg-slate-100')}>
                    {ochiq ? s.emoji : <Lock size={24} className="text-slate-400" />}
                  </span>
                  {ok ? <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-emerald-600"><Check size={19} strokeWidth={3} /></span>
                    : ochiq ? <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-100 text-brand-600"><Play size={17} /></span> : null}
                </div>
                <div className={cx('mt-3 font-mono text-xs font-extrabold', ochiq ? t.text : 'text-slate-400')}>{s.n}-BOSQICH</div>
                <div className="font-display text-[1.15rem] font-extrabold leading-snug text-navy-900">{s.title}</div>
                <div className="mt-1 text-[0.95rem] text-slate-500">{s.short}</div>
                {s.gameKey && <span className="mt-3 inline-block rounded-full bg-violet-100 px-2.5 py-1 text-xs font-extrabold text-violet-700">🎮 Oʻyin</span>}
              </>
            )
            return ochiq
              ? <Link key={s.path} to={s.path} className={cx('group rounded-4xl border-2 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-lift', ok ? 'border-emerald-200' : t.border)}>{Inner}</Link>
              : <div key={s.path} className="group cursor-not-allowed rounded-4xl border-2 border-slate-200 bg-slate-50/70 p-5" title="Avvalgi bosqichni tugating">{Inner}</div>
          })}
        </div>
      </section>

      {/* ---------- Nishonlar ---------- */}
      <section className="mb-10">
        <h2 className="mb-1 text-[1.6rem] font-extrabold sm:text-[1.9rem]">Nishonlarim 🎖️</h2>
        <p className="mb-5 text-[1.05rem] text-slate-600">Bosqichlarni tugatib, nishonlar toʻpla.</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {nishonlar.map(n => (
            <div key={n.id} className={cx('rounded-3xl border-2 p-4 text-center transition', n.ochildi ? 'animate-pop border-amber-300 bg-gradient-to-b from-amber-50 to-white shadow-card' : 'border-slate-200 bg-slate-50')}>
              <div className={cx('text-4xl', n.ochildi ? '' : 'opacity-25 grayscale')}>{n.emoji}</div>
              <div className={cx('mt-2 font-display text-sm font-extrabold leading-tight', n.ochildi ? 'text-navy-900' : 'text-slate-400')}>{n.nom}</div>
              <div className="mt-0.5 text-[0.72rem] leading-tight text-slate-500">{n.ochildi ? n.izoh : 'hali yopiq'}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Oʻqitish metodlari ---------- */}
      <section className="mb-10">
        <h2 className="mb-1 text-[1.6rem] font-extrabold sm:text-[1.9rem]">Oʻqitish metodlari 🧩</h2>
        <p className="mb-5 text-[1.05rem] text-slate-600">Darsda qoʻllaniladigan interaktiv metodlar — oʻzing ham sinab koʻr.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {METODLAR.map(m => {
            const t = TONE[m.tone]
            return (
              <Link key={m.path} to={m.path} className="group flex items-center gap-4 rounded-4xl border-2 border-amber-200 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-lift">
                <span className={cx('grid h-14 w-14 flex-none place-items-center rounded-2xl bg-gradient-to-br text-white transition group-hover:scale-110', t.grad)}><m.icon size={26} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[1.1rem] font-extrabold leading-snug text-navy-900">{m.short}</span>
                  <span className="block text-[0.95rem] text-slate-500">{m.title}</span>
                </span>
                <ArrowRight className="flex-none text-amber-500 transition group-hover:translate-x-1" />
              </Link>
            )
          })}
        </div>
      </section>

      {/* ---------- Sinf fikri (Snowball) ---------- */}
      <Link to="/fikr" className="group mb-4 flex items-center gap-5 overflow-hidden rounded-4xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lift">
        <span className="grid h-16 w-16 flex-none place-items-center rounded-3xl bg-gradient-to-br from-amber-400 to-orange-400 text-navy-900 transition group-hover:scale-110">
          {bajarilgan.has('snowball') ? <Check size={30} strokeWidth={3} /> : <MessageSquare size={28} />}
        </span>
        <span className="flex-1"><span className="block font-display text-xl font-extrabold text-navy-900">💭 Sinf fikri</span>
          <span className="block text-slate-600">{bajarilgan.has('snowball') ? 'Fikringni yozding! Sinfning javoblarini koʻr.' : 'Fikringni yoz — oʻqituvchi va butun sinf koʻradi.'}</span></span>
        <ArrowRight className="text-amber-500 transition group-hover:translate-x-1" />
      </Link>

      {/* ---------- Sertifikat ---------- */}
      <Link to="/sertifikat" className="group flex items-center gap-5 overflow-hidden rounded-4xl border-2 border-violet-200 bg-gradient-to-r from-violet-50 to-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-lift">
        <span className="grid h-16 w-16 flex-none place-items-center rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-400 text-white transition group-hover:scale-110">
          {bajarilgan.has('bilimdon') ? <Award size={30} /> : <Lock size={26} />}
        </span>
        <span className="flex-1"><span className="block font-display text-xl font-extrabold text-navy-900">Sertifikat</span>
          <span className="block text-slate-600">{bajarilgan.has('bilimdon') ? 'Tayyor! Ism-familiyang bilan ol.' : 'Yakuniy oʻyin (7-bosqich)dan keyin ochiladi.'}</span></span>
        <ArrowRight className="text-violet-500 transition group-hover:translate-x-1" />
      </Link>

      <p className="mt-8 text-center text-sm text-slate-400">{COURSE.subject}</p>
    </>
  )
}
