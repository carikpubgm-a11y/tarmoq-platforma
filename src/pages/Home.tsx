import { Link } from 'react-router-dom'
import { ArrowRight, FlaskConical, ListChecks, Presentation, PlayCircle, GraduationCap, Check } from 'lucide-react'
import { COURSE, GROUPS, SECTIONS } from '../data/sections'
import { useStored } from '../lib/storage'
import { TONE, cx } from '../components/ui'

function NetArt() {
  const pts = [[80, 60], [230, 30], [370, 90], [300, 200], [140, 190], [440, 210], [500, 60]] as const
  const edges = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [1, 3], [2, 6], [3, 5], [5, 6]] as const
  return (
    <svg viewBox="0 0 560 250" preserveAspectRatio="xMaxYMid slice" className="pointer-events-none absolute right-0 top-0 hidden h-full w-[38%] opacity-45 xl:block" aria-hidden="true">
      {edges.map(([a, b], i) => <line key={i} x1={pts[a][0]} y1={pts[a][1]} x2={pts[b][0]} y2={pts[b][1]} stroke="#2B477C" strokeWidth="1.5" className={i % 3 === 0 ? 'anim-dash' : undefined} />)}
      {pts.map(([x, y], i) => <g key={i}><circle cx={x} cy={y} r="13" fill="#0C1A35" stroke={['#2DD4BF', '#60A5FA', '#A78BFA', '#FBBF24', '#34D399', '#60A5FA', '#2DD4BF'][i]} strokeWidth="2" /><circle cx={x} cy={y} r="4" fill={['#2DD4BF', '#60A5FA', '#A78BFA', '#FBBF24', '#34D399', '#60A5FA', '#2DD4BF'][i]} /></g>)}
    </svg>
  )
}

export default function Home() {
  const [visited] = useStored<string[]>('visited', [])
  const main = SECTIONS.filter(s => !s.child)
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="stage-dark relative mb-10 overflow-hidden rounded-3xl bg-navy-950 px-6 py-10 text-white shadow-lift sm:px-10 sm:py-14">
        <NetArt />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-navy-600 bg-navy-900 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-teal-300"><GraduationCap size={15} /> {COURSE.subject}</span>
          <h1 className="mt-6 text-[2.1rem] font-extrabold leading-[1.1] !text-white sm:text-[3.1rem]">
            Kompyuter tarmoqlarini loyihalash va tarmoq xavfsizligini <span className="bg-gradient-to-r from-teal-300 to-blue-300 bg-clip-text text-transparent">oʻqitish</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-navy-100">Mustaqil taʼlim loyihasi: nazariya, interaktiv laboratoriya, beshta pedagogik metod va baholash — bitta platformada. Maqsad — taʼrifni yodlash emas, tanlangan yechim <strong>nima uchun</strong> ishlashini asoslay olish.</p>
          <div className="no-print mt-8 flex flex-wrap gap-3">
            <Link to="/kurs" className="inline-flex items-center gap-2.5 rounded-2xl bg-teal-500 px-6 py-3.5 font-bold text-navy-950 transition hover:bg-teal-400"><PlayCircle size={20} /> Kursni boshlash</Link>
            <Link to="/himoya" className="inline-flex items-center gap-2.5 rounded-2xl border border-navy-500 bg-navy-900 px-6 py-3.5 font-bold text-white transition hover:border-teal-400"><Presentation size={20} /> Himoya rejimi</Link>
            <Link to="/laboratoriya" className="inline-flex items-center gap-2.5 rounded-2xl px-4 py-3.5 font-semibold text-navy-100 transition hover:text-white"><FlaskConical size={20} /> Laboratoriyaga oʻtish</Link>
          </div>
        </div>
        <dl className="relative mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[['15', 'mustaqil boʻlim'], ['8', 'turdagi qurilma laboratoriyada'], ['5', 'ishlaydigan pedagogik metod'], ['18', 'vaziyatli test savoli']].map(([n, l]) => (
            <div key={l} className="flex flex-col-reverse justify-end rounded-2xl border border-navy-700 bg-navy-900/80 p-4 backdrop-blur">
              <dt className="mt-1 text-sm leading-snug text-navy-200">{l}</dt>
              <dd className="font-display text-3xl font-extrabold text-teal-300">{n}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------- Maqsad ---------- */}
      <section className="mb-12 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-6 shadow-card md:col-span-2">
          <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-teal-700">Oʻquv maqsadi</h2>
          <p className="mt-2 text-[1.08rem] leading-relaxed text-slate-700">{COURSE.goal}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">Sizning yoʻlingiz</h2>
          <p className="mt-2 font-display text-3xl font-extrabold text-navy-950">{SECTIONS.filter(s => visited.includes(s.path)).length} <span className="text-lg font-semibold text-slate-400">/ {SECTIONS.length} sahifa</span></p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: (SECTIONS.filter(s => visited.includes(s.path)).length / SECTIONS.length) * 100 + '%' }} /></div>
          <p className="mt-3 text-sm text-slate-500">Koʻrilgan sahifalar shu brauzerda eslab qolinadi.</p>
        </div>
      </section>

      {/* ---------- Kurs tuzilmasi ---------- */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold sm:text-[1.7rem]">Kurs tuzilmasi</h2>
        <p className="mt-1.5 max-w-3xl text-slate-600">Har bir boʻlim mustaqil ochiladi. Tartib bilan oʻtish tavsiya etiladi, lekin kerakli sahifaga toʻgʻridan-toʻgʻri kirishingiz mumkin.</p>
        <div className="mt-6 space-y-7">
          {GROUPS.map(g => (
            <div key={g}>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{g}</h3>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {SECTIONS.filter(s => s.group === g && s.path !== '/').map(s => (
                  <Link key={s.path} to={s.path} className={cx('group flex items-center gap-3.5 rounded-2xl border bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift', TONE[s.tone].border)}>
                    <span className={cx('grid h-11 w-11 flex-none place-items-center rounded-xl', TONE[s.tone].soft, TONE[s.tone].text)}><s.icon size={22} /></span>
                    <span className="min-w-0 flex-1">
                      <span className={cx('block font-mono text-xs font-bold', TONE[s.tone].text)}>{s.no}</span>
                      <span className="block font-display font-bold leading-snug text-navy-950">{s.short}</span>
                    </span>
                    {visited.includes(s.path) ? <Check size={18} className="flex-none text-teal-600" aria-label="koʻrilgan" /> : <ArrowRight size={18} className="flex-none text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600" />}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Asosiy imkoniyatlar ---------- */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold sm:text-[1.7rem]">Platformada nima ishlaydi?</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            { to: '/laboratoriya', I: FlaskConical, tone: 'green' as const, t: 'Interaktiv laboratoriya', d: 'Qurilma qoʻshing, kabel ulang, IP sozlang, paket yuboring. Xato konfiguratsiyaning sababi izohlanadi. Alohida firewall tajribasi.' },
            { to: '/metodika', I: Presentation, tone: 'amber' as const, t: 'Besh pedagogik metod', d: 'Muammoli taʼlim, Snowball, Double-Entry Journal, namoyish va amaliy topshiriq — taʼrif emas, bajariladigan mashgʻulot.' },
            { to: '/test', I: ListChecks, tone: 'blue' as const, t: 'Test va baholash markazi', d: '18 ta vaziyatli savol, mavzular boʻyicha tahlil va amaliy ishlar ballari bitta jadvalda.' },
            { to: '/himoya', I: Presentation, tone: 'violet' as const, t: 'Himoya rejimi', d: 'Yirik matn, slaydga oʻxshash oʻtish, klaviatura strelkalari va faqat taqdimotchi koʻradigan ssenariy.' },
          ].map(c => (
            <Link key={c.to} to={c.to} className={cx('group rounded-2xl border bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-lift', TONE[c.tone].border)}>
              <span className={cx('grid h-12 w-12 place-items-center rounded-xl', TONE[c.tone].solid)}><c.I size={24} /></span>
              <h3 className="mt-4 text-xl font-bold">{c.t}</h3>
              <p className="mt-1.5 text-slate-600">{c.d}</p>
              <span className={cx('mt-3 inline-flex items-center gap-1.5 text-sm font-bold', TONE[c.tone].text)}>Ochish <ArrowRight size={16} className="transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Qanday foydalaniladi ---------- */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="text-xl font-bold">Platformadan qanday foydalaniladi</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[['Oʻqing', 'Har boʻlim maqsad, qisqa nazariya va hayotiy misoldan boshlanadi.'], ['Sinang', 'Diagramma va simulyatorlarda oʻzingiz bosib koʻring.'], ['Bajaring', 'Laboratoriya va metod mashgʻulotlarini toʻliq oʻting.'], ['Tekshiring', 'Boʻlim oxiridagi topshiriq va yakuniy test bilan bilimingizni baholang.']].map(([t, d], i) => (
            <li key={t} className="flex gap-3">
              <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-navy-950 font-mono text-sm font-bold text-teal-300">{i + 1}</span>
              <span><span className="block font-display font-bold text-navy-950">{t}</span><span className="block text-sm text-slate-600">{d}</span></span>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-sm text-slate-500">Asosiy boʻlimlar soni: {main.length}. Qoʻshimcha sahifalar: laboratoriyaning firewall tajribasi, beshta metod mashgʻuloti va raqamli vositalar sharhi.</p>
      </section>
    </>
  )
}
