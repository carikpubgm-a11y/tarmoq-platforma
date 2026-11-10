import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BookOpen, Keyboard, Maximize, NotebookText, PlayCircle, Target } from 'lucide-react'
import { COURSE } from '../data/sections'
import { toggleFullscreen, useDefense } from '../lib/defense'
import { useStored } from '../lib/storage'

const PLAN: [string, string, string][] = [
  ['1', 'Kurs maqsadi va dolzarbligi', '1 daq'],
  ['2', 'Nazariya: tarmoq, turlari, topologiya, qurilmalar', '5 daq'],
  ['3', 'Loyihalash bosqichlari va IP manzillash', '3 daq'],
  ['4', 'Tarmoq xavfsizligi va tahdidlar', '3 daq'],
  ['5', 'Interaktiv laboratoriya: tarmoq va firewall', '4 daq'],
  ['6', 'Oʻqitish metodikasi: beshta metod amalda', '8 daq'],
  ['7', 'Test, baholash va xulosa', '3 daq'],
]

export default function Himoya() {
  const navigate = useNavigate()
  const defense = useDefense()
  const [who, setWho] = useStored<{ author: string; group: string; teacher: string }>('presenter', { author: '', group: '', teacher: '' })

  const begin = () => { defense.start(); navigate('/kurs') }
  useEffect(() => {
    document.title = 'Himoya — ' + COURSE.title
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && t.closest('input, textarea')) return
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); defense.start(); navigate('/kurs') }
      else if (e.key === 'f' || e.key === 'F') toggleFullscreen()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [defense, navigate])

  const field = 'w-full rounded-lg border border-navy-700 bg-navy-900/70 px-3 py-2 text-white placeholder:text-navy-400 focus:border-teal-400 focus:outline-none'
  return (
    <div className="stage-dark relative min-h-screen overflow-hidden bg-navy-950 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" style={{ backgroundImage: 'radial-gradient(circle at 15% 20%, rgba(45,212,191,.25), transparent 40%), radial-gradient(circle at 85% 80%, rgba(96,165,250,.22), transparent 42%)' }} />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-10">
        <div className="no-print flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-navy-200 hover:bg-white/10 hover:text-white"><ArrowLeft size={17} /> Platformaga qaytish</Link>
          <div className="flex gap-2">
            <button type="button" onClick={toggleFullscreen} className="inline-flex items-center gap-2 rounded-xl border border-navy-600 px-3 py-2 text-sm font-semibold text-navy-100 hover:border-teal-400"><Maximize size={17} /> Toʻliq ekran</button>
          </div>
        </div>

        <div className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[1.25fr_1fr]">
          <div className="anim-in">
            <p className="font-display text-2xl font-bold text-teal-300 sm:text-3xl">Assalomu alaykum.</p>
            <p className="mt-5 text-lg text-navy-200 sm:text-xl">Bugungi mustaqil taʼlim mavzusi:</p>
            <h1 className="mt-2 text-[2.2rem] font-extrabold leading-[1.08] !text-white sm:text-[3.4rem]">{COURSE.title}</h1>
            <p className="mt-6 inline-flex items-center gap-2.5 rounded-xl border border-navy-600 bg-navy-900/70 px-4 py-2.5 text-base text-navy-100"><BookOpen size={19} className="text-teal-300" /><span><span className="text-navy-300">Fan:</span> <strong>{COURSE.subject}</strong></span></p>

            <div className="mt-6 flex gap-3.5 rounded-2xl border border-teal-400/30 bg-teal-400/10 p-5">
              <Target size={24} className="mt-0.5 flex-none text-teal-300" />
              <div><div className="text-xs font-bold uppercase tracking-[0.14em] text-teal-300">Oʻquv maqsadi</div><p className="mt-1.5 text-[1.05rem] leading-relaxed text-navy-50">{COURSE.goal}</p></div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button type="button" onClick={begin} className="inline-flex items-center gap-3 rounded-2xl bg-teal-400 px-8 py-4 font-display text-xl font-extrabold text-navy-950 shadow-lift transition hover:bg-teal-300 active:translate-y-px">
                <PlayCircle size={26} /> Mashgʻulotni boshlash <ArrowRight size={22} />
              </button>
              <span className="no-print inline-flex items-center gap-2 text-sm text-navy-300"><Keyboard size={17} /> ← → boʻlimlar · G roʻyxat · N ssenariy · F toʻliq ekran</span>
            </div>
          </div>

          <div className="anim-in space-y-5">
            <section className="rounded-2xl border border-navy-700 bg-navy-900/70 p-5 backdrop-blur sm:p-6" aria-label="Mashgʻulot rejasi">
              <h2 className="text-xs font-bold uppercase tracking-[0.14em] !text-teal-300">Mashgʻulot rejasi</h2>
              <ol className="mt-4 space-y-2.5">
                {PLAN.map(([n, t, m]) => (
                  <li key={n} className="flex items-center gap-3.5">
                    <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-navy-700 font-mono text-sm font-bold text-teal-300">{n}</span>
                    <span className="flex-1 text-[1.02rem] text-white">{t}</span>
                    <span className="font-mono text-sm text-navy-300">{m}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 border-t border-navy-700 pt-3 text-sm text-navy-300">Jami: taxminan 27 daqiqa. Qisqa himoya uchun ssenariydagi «asosiy bekatlar» yetarli.</p>
            </section>

            <section className="rounded-2xl border border-navy-700 bg-navy-900/70 p-5 backdrop-blur" aria-label="Taqdimotchi maʼlumotlari">
              <h2 className="text-xs font-bold uppercase tracking-[0.14em] !text-teal-300">Taqdimotchi</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="sm:col-span-2"><span className="mb-1 block text-xs text-navy-300">Bajardi (F.I.Sh.)</span><input className={field} value={who.author} placeholder="Ism va familiyangizni yozing" onChange={e => setWho(w => ({ ...w, author: e.target.value }))} /></label>
                <label><span className="mb-1 block text-xs text-navy-300">Guruh</span><input className={field} value={who.group} placeholder="Masalan: 301-guruh" onChange={e => setWho(w => ({ ...w, group: e.target.value }))} /></label>
                <label><span className="mb-1 block text-xs text-navy-300">Qabul qildi</span><input className={field} value={who.teacher} placeholder="Oʻqituvchi F.I.Sh." onChange={e => setWho(w => ({ ...w, teacher: e.target.value }))} /></label>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
