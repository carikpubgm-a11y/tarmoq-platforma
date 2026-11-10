import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Check, LayoutGrid, Maximize, Menu, NotebookText, Presentation, Printer, X, LogOut, Clock, Mic, MonitorPlay,
  Trophy, UserRound, Users, EllipsisVertical, Map, Award, Lock, BookOpen,
} from 'lucide-react'
import { SECTIONS, COURSE, findSection, neighbours, type SectionDef } from '../data/sections'
import { SAYOHAT } from '../data/sayohat'
import { useDefense, toggleFullscreen } from '../lib/defense'
import { useStored } from '../lib/storage'
import { useOquvchi } from '../lib/student'
import IsmSorov from './IsmSorov'
import { VAZIFALAR } from '../lib/api'
import { type Result, type ResultKey } from '../lib/storage'
import { TONE, cx } from './ui'

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3 rounded-xl px-2 py-1.5 text-white">
      <svg width="34" height="34" viewBox="0 0 32 32" aria-hidden="true" className="flex-none">
        <rect width="32" height="32" rx="9" fill="#132446" />
        <path d="M16 10v6M16 16l-7 6M16 16l7 6" stroke="#9AAED3" strokeWidth="1.8" />
        <circle cx="16" cy="8" r="3.2" fill="#2DD4BF" /><circle cx="8" cy="23" r="3.2" fill="#60A5FA" /><circle cx="24" cy="23" r="3.2" fill="#FBBF24" />
      </svg>
      <span className="leading-tight">
        <span className="block font-display text-[0.95rem] font-extrabold tracking-tight">Tarmoq platformasi</span>
        <span className="block text-[0.7rem] font-medium text-navy-300">Loyihalash va xavfsizlikni oʻqitish</span>
      </span>
    </Link>
  )
}

function SideNav({ visited, bajarilgan, onNavigate }: { visited: string[]; bajarilgan: Set<string>; onNavigate?: () => void }) {
  const tugadi = (s: typeof SAYOHAT[number]) => s.gameKey ? bajarilgan.has(s.gameKey) : visited.includes(s.path)
  return (
    <nav aria-label="Sayohat bosqichlari" className="px-3 pb-6">
      <NavLink to="/" end onClick={onNavigate}
        className={({ isActive }) => cx('mb-2 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[0.92rem] font-bold transition',
          isActive ? 'bg-white/10 text-white' : 'text-navy-200 hover:bg-white/5 hover:text-white')}>
        <span className="grid h-7 w-7 flex-none place-items-center rounded-lg bg-brand-600 text-white"><Map size={15} /></span>
        Sayohat xaritasi
      </NavLink>
      <div className="px-3 pb-1.5 pt-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-navy-400">7 bosqich</div>
      <ul className="space-y-0.5">
        {SAYOHAT.map((s, i) => {
          const ok = tugadi(s)
          const ochiq = i === 0 || tugadi(SAYOHAT[i - 1]) || ok
          return (
            <li key={s.path}>
              <NavLink to={s.path} onClick={e => { if (!ochiq) e.preventDefault(); else onNavigate?.() }}
                className={({ isActive }) => cx('group flex items-center gap-2.5 rounded-xl py-2 pl-3 pr-2.5 text-[0.88rem] font-medium transition',
                  !ochiq ? 'cursor-not-allowed text-navy-500' : isActive ? 'bg-white/10 text-white shadow-inner' : 'text-navy-200 hover:bg-white/5 hover:text-white')}>
                {({ isActive }) => (
                  <>
                    <span className={cx('grid h-7 w-7 flex-none place-items-center rounded-lg text-sm', ok ? 'bg-emerald-500 text-white' : isActive ? TONE[s.tone].solid : 'bg-navy-800 text-navy-300 group-hover:text-white')}>
                      {ok ? <Check size={14} strokeWidth={3} /> : ochiq ? s.n : <Lock size={12} />}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{s.title}</span>
                    {s.gameKey && ochiq && !ok && <span className="flex-none text-xs">🎮</span>}
                  </>
                )}
              </NavLink>
            </li>
          )
        })}
      </ul>
      <div className="mt-4 border-t border-navy-800 pt-3">
        <NavLink to="/reyting" onClick={onNavigate}
          className={({ isActive }) => cx('flex items-center gap-2.5 rounded-xl px-3 py-2 text-[0.88rem] font-medium transition', isActive ? 'bg-white/10 text-white' : 'text-navy-200 hover:bg-white/5 hover:text-white')}>
          <span className="grid h-7 w-7 flex-none place-items-center rounded-lg bg-amber-500 text-navy-900"><Trophy size={15} /></span> Reyting
        </NavLink>
        <NavLink to="/sertifikat" onClick={onNavigate}
          className={({ isActive }) => cx('flex items-center gap-2.5 rounded-xl px-3 py-2 text-[0.88rem] font-medium transition', isActive ? 'bg-white/10 text-white' : 'text-navy-200 hover:bg-white/5 hover:text-white')}>
          <span className="grid h-7 w-7 flex-none place-items-center rounded-lg bg-violet-500 text-white"><Award size={15} /></span> Sertifikat
        </NavLink>
      </div>
    </nav>
  )
}

function PrevNext({ prev, next }: { prev?: SectionDef; next?: SectionDef }) {
  return (
    <nav aria-label="Boʻlimlar orasida oʻtish" className="no-print defense-hide mt-14 grid gap-3 border-t border-slate-200 pt-8 sm:grid-cols-2">
      {prev ? (
        <Link to={prev.path} className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-card transition hover:border-teal-400">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500"><ArrowLeft size={14} /> Oldingi boʻlim</span>
          <span className="mt-1 block font-display font-bold text-navy-950 group-hover:text-teal-700">{prev.no}. {prev.short}</span>
        </Link>
      ) : <span />}
      {next && (
        <Link to={next.path} className="group rounded-2xl border border-slate-200 bg-white p-4 text-right shadow-card transition hover:border-teal-400">
          <span className="flex items-center justify-end gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">Keyingi boʻlim <ArrowRight size={14} /></span>
          <span className="mt-1 block font-display font-bold text-navy-950 group-hover:text-teal-700">{next.no}. {next.short}</span>
        </Link>
      )}
    </nav>
  )
}

/** Himoya rejimida oʻng tomondan chiqadigan ssenariy paneli — faqat taqdimotchi uchun. */
export function ScriptNote({ s }: { s: SectionDef }) {
  return (
    <div className="space-y-4 text-[0.95rem] leading-relaxed">
      <div className="flex items-center gap-2 font-mono text-xs font-bold text-teal-300"><Clock size={14} /> Tavsiya etilgan vaqt: {s.script.time}</div>
      <div><div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy-300"><Mic size={14} /> Nima tushuntiriladi</div><p className="text-navy-100">{s.script.say}</p></div>
      <div><div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy-300"><Presentation size={14} /> Metod</div><p className="text-navy-100">{s.script.method}</p></div>
      <div><div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy-300"><MonitorPlay size={14} /> Nima namoyish qilinadi</div><p className="text-navy-100">{s.script.demo}</p></div>
    </div>
  )
}

export default function Layout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const defense = useDefense()
  const section = findSection(pathname)
  const { index, prev, next } = neighbours(pathname)
  const [visited, setVisited] = useStored<string[]>('visited', [])
  const { oquvchi, chiqish } = useOquvchi()
  const [mahalliyNat] = useStored<Partial<Record<ResultKey, Result>>>('results', {})
  const bajarilgan = new Set<string>(oquvchi?.natijalar?.length ? oquvchi.natijalar.map(n => n.vazifa) : Object.keys(mahalliyNat))
  const [ustoz, setUstoz] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [grid, setGrid] = useState(false)
  const [notes, setNotes] = useState(false)
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    setDrawer(false); setGrid(false); setUstoz(false)
    if (section) setVisited(v => (v.includes(section.path) ? v : [...v, section.path]))
    document.title = (section ? section.title + ' — ' : '') + 'Tarmoq platformasi'
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  /* Himoya rejimi: ← → (PageUp / PageDown) boʻlimlar orasida, G — boʻlimlar, N — ssenariy, F — toʻliq ekran */
  useEffect(() => {
    if (!defense.on) return
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return
      const t = e.target as HTMLElement | null
      if (t && (t.closest('input, textarea, select, [contenteditable="true"], [role="tablist"], [data-keys="off"]'))) return
      if (document.querySelector('[data-stage="max"]')) return
      if (e.key === 'Escape') { setGrid(false); setNotes(false); return }
      if (grid) return
      if ((e.key === 'ArrowRight' || e.key === 'PageDown') && next) { e.preventDefault(); navigate(next.path) }
      else if ((e.key === 'ArrowLeft' || e.key === 'PageUp') && prev) { e.preventDefault(); navigate(prev.path) }
      else if (e.key === 'g' || e.key === 'G') setGrid(true)
      else if (e.key === 'n' || e.key === 'N') setNotes(n => !n)
      else if (e.key === 'f' || e.key === 'F') toggleFullscreen()
      else if (e.key === 'Home') navigate('/himoya')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [defense.on, next, prev, grid, navigate])

  const bosqichTugadi = SAYOHAT.filter(x => x.gameKey ? bajarilgan.has(x.gameKey) : visited.includes(x.path)).length

  return (
    <div className="min-h-screen">
      <a href="#mazmun" onClick={e => { e.preventDefault(); mainRef.current?.focus() }} className="no-print fixed left-3 top-3 z-[90] -translate-y-20 rounded-lg bg-teal-500 px-4 py-2 font-bold text-navy-950 focus:translate-y-0">Asosiy mazmunga oʻtish</a>

      {/* ---------- Yon panel (kompyuter) ---------- */}
      <aside className="no-print defense-hide fixed inset-y-0 left-0 z-40 hidden w-72 flex-col overflow-y-auto bg-navy-950 lg:flex">
        <div className="sticky top-0 z-10 bg-navy-950 px-3 pb-3 pt-4"><Brand /></div>
        <SideNav visited={visited} bajarilgan={bajarilgan} />
        <div className="mt-auto space-y-2 border-t border-navy-800 p-4">
          <div className="flex items-center justify-between text-xs text-navy-300"><span>Sayohat</span><span className="font-mono font-bold text-teal-300">{bosqichTugadi} / {SAYOHAT.length}</span></div>
          <div className="h-1.5 overflow-hidden rounded-full bg-navy-800"><div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-cyan-400 transition-all" style={{ width: (bosqichTugadi / SAYOHAT.length) * 100 + '%' }} /></div>
        </div>
      </aside>

      {/* ---------- Mobil menyu ---------- */}
      {drawer && (
        <div className="no-print fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label="Boʻlimlar menyusi">
          <button type="button" aria-label="Menyuni yopish" className="absolute inset-0 bg-navy-950/70" onClick={() => setDrawer(false)} />
          <div className="relative flex h-full w-[19rem] max-w-[86vw] flex-col overflow-y-auto bg-navy-950 shadow-2xl">
            <div className="flex items-center justify-between px-3 pb-3 pt-4">
              <Brand />
              <button type="button" onClick={() => setDrawer(false)} aria-label="Yopish" className="rounded-lg p-2 text-navy-200 hover:bg-white/10"><X size={22} /></button>
            </div>
            <SideNav visited={visited} bajarilgan={bajarilgan} onNavigate={() => setDrawer(false)} />
          </div>
        </div>
      )}

      {/* ---------- Yuqori panel ---------- */}
      <header className="no-print defense-hide sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur lg:ml-72">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2.5 sm:px-8">
          <button type="button" onClick={() => setDrawer(true)} aria-label="Boʻlimlar menyusini ochish" aria-expanded={drawer}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-navy-950 lg:hidden"><Menu size={18} /> Boʻlimlar</button>
          <div className="mr-auto hidden min-w-0 lg:block">
            <div className="truncate text-xs font-medium text-slate-500">{COURSE.subject}</div>
            <div className="truncate text-sm font-semibold text-navy-950">{section ? section.no + ' · ' + section.title : 'Tarmoq platformasi'}</div>
          </div>
          <span className="mr-auto lg:hidden" />

          {/* Oʻquvchi: ism, ball va chiqish */}
          {oquvchi ? (
            <>
              <Link to="/reyting" title="Sinf reytingi" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 px-3.5 py-2 font-display text-sm font-extrabold text-navy-900 transition hover:brightness-105">
                <Trophy size={17} />{oquvchi.jamiBall}<span className="hidden sm:inline">ball</span>
              </Link>
              <div className="flex items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white py-1 pl-1 pr-2">
                <span className="grid h-8 w-8 flex-none place-items-center rounded-xl bg-brand-600 font-display text-sm font-extrabold text-white">
                  {(oquvchi.ism[0] || '?').toUpperCase()}
                </span>
                <span className="hidden min-w-0 sm:block">
                  <span className="block max-w-[9rem] truncate text-sm font-extrabold leading-tight text-navy-900">{oquvchi.ism}</span>
                  <span className="block text-[0.7rem] font-semibold leading-tight text-slate-500">{oquvchi.sinf}</span>
                </span>
                <button type="button" onClick={() => { chiqish(); navigate('/kirish-oquvchi') }} aria-label="Hisobdan chiqish" title="Chiqish"
                  className="grid h-8 w-8 place-items-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"><LogOut size={16} /></button>
              </div>
            </>
          ) : (
            <Link to="/kirish-oquvchi" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-b from-brand-500 to-brand-600 px-4 py-2.5 text-sm font-extrabold text-white btn-pop">
              <UserRound size={17} /> Kirish
            </Link>
          )}

          {/* Oʻqituvchi uchun — kichik menyu */}
          <div className="relative">
            <button type="button" onClick={() => setUstoz(u => !u)} aria-expanded={ustoz} aria-label="Oʻqituvchi menyusi"
              className="grid h-10 w-10 place-items-center rounded-2xl border-2 border-slate-200 bg-white text-slate-500 transition hover:border-brand-400 hover:text-brand-700"><EllipsisVertical size={18} /></button>
            {ustoz && (
              <>
                <button type="button" aria-label="Menyuni yopish" className="fixed inset-0 z-10 cursor-default" onClick={() => setUstoz(false)} />
                <div className="anim-in absolute right-0 z-20 mt-2 w-60 overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-1.5 shadow-lift">
                  <div className="px-3 py-1.5 text-[0.7rem] font-extrabold uppercase tracking-wider text-slate-400">Oʻqituvchi uchun</div>
                  {[
                    { to: '/oqituvchi', I: Users, t: 'Natijalar va baholar' },
                    { to: '/himoya', I: Presentation, t: 'Himoya rejimi' },
                    { to: '/ssenariy', I: NotebookText, t: 'Taqdimot ssenariysi' },
                  ].map(x => (
                    <Link key={x.to} to={x.to} onClick={() => setUstoz(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-navy-900 hover:bg-brand-50">
                      <x.I size={17} className="text-brand-600" />{x.t}
                    </Link>
                  ))}
                  <button type="button" onClick={() => { setUstoz(false); window.print() }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-navy-900 hover:bg-brand-50">
                    <Printer size={17} className="text-brand-600" />Chop etish / PDF
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ---------- Mazmun ---------- */}
      <div className={defense.on ? '' : 'lg:pl-72'}>
      <main id="mazmun" ref={mainRef} tabIndex={-1}
        className={cx('mx-auto px-4 pt-8 outline-none sm:px-8', defense.on ? 'max-w-6xl pb-36' : 'max-w-5xl pb-16')}>
        {Object.values(VAZIFALAR).some(v => v.yoʻl === (pathname.replace(/\/+$/, '') || '/')) && <IsmSorov />}
        <Outlet />
        <PrevNext prev={prev} next={next} />
        <footer className="no-print defense-hide mt-10 flex flex-wrap justify-between gap-3 text-sm text-slate-500">
          <span>{COURSE.title}</span>
          <span className="font-mono text-xs">2026 · {COURSE.subject}</span>
        </footer>
      </main>
      </div>

      {/* ---------- Himoya rejimi: pastki boshqaruv paneli ---------- */}
      {defense.on && (
        <div className="defense-bar fixed inset-x-0 bottom-0 z-50 border-t border-navy-700 bg-navy-950/95 text-white backdrop-blur">
          <div className="h-1 bg-navy-800"><div className="h-full bg-teal-400 transition-all" style={{ width: ((index + 1) / SECTIONS.length) * 100 + '%' }} /></div>
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-6">
            <button type="button" onClick={() => setGrid(true)} className="inline-flex items-center gap-2 rounded-xl border border-navy-600 bg-navy-900 px-3 py-2.5 font-semibold hover:border-teal-400" aria-label="Barcha boʻlimlar (G)">
              <LayoutGrid size={20} /><span className="hidden md:inline">Boʻlimlar</span>
            </button>
            <button type="button" disabled={!prev} onClick={() => prev && navigate(prev.path)} className="inline-flex items-center gap-2 rounded-xl border border-navy-600 bg-navy-900 px-4 py-2.5 font-semibold hover:border-teal-400 disabled:opacity-40" aria-label="Oldingi boʻlim (chap strelka)">
              <ArrowLeft size={20} /><span className="hidden sm:inline">Oldingi</span>
            </button>
            <div className="min-w-0 flex-1 text-center" role="status" aria-live="polite">
              <div className="font-mono text-xs font-bold text-teal-300">{index >= 0 ? index + 1 : '–'} / {SECTIONS.length}</div>
              <div className="truncate font-display text-sm font-bold sm:text-base">{section?.title ?? 'Qoʻshimcha sahifa'}</div>
            </div>
            <button type="button" disabled={!next} onClick={() => next && navigate(next.path)} className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 font-bold text-navy-950 hover:bg-teal-400 disabled:opacity-40" aria-label="Keyingi boʻlim (oʻng strelka)">
              <span className="hidden sm:inline">Keyingi</span><ArrowRight size={20} />
            </button>
            <button type="button" onClick={() => setNotes(n => !n)} aria-pressed={notes} className={cx('inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 font-semibold', notes ? 'border-amber-400 bg-amber-400 text-navy-950' : 'border-navy-600 bg-navy-900 hover:border-teal-400')} aria-label="Oʻqituvchi ssenariysi (N)">
              <NotebookText size={20} /><span className="hidden lg:inline">Ssenariy</span>
            </button>
            <button type="button" onClick={toggleFullscreen} className="hidden items-center gap-2 rounded-xl border border-navy-600 bg-navy-900 px-3 py-2.5 font-semibold hover:border-teal-400 sm:inline-flex" aria-label="Toʻliq ekran (F)">
              <Maximize size={20} />
            </button>
            <button type="button" onClick={() => { defense.stop(); setNotes(false); if (document.fullscreenElement) void document.exitFullscreen() }} className="inline-flex items-center gap-2 rounded-xl border border-navy-600 bg-navy-900 px-3 py-2.5 font-semibold text-rose-200 hover:border-rose-400" aria-label="Himoya rejimidan chiqish">
              <LogOut size={20} /><span className="hidden lg:inline">Chiqish</span>
            </button>
          </div>
        </div>
      )}

      {/* ---------- Himoya rejimi: boʻlimlar toʻri ---------- */}
      {defense.on && grid && (
        <div className="fixed inset-0 z-[85] overflow-y-auto bg-navy-950/95 p-4 text-white sm:p-10" role="dialog" aria-modal="true" aria-label="Barcha boʻlimlar">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-2xl font-extrabold !text-white">Boʻlimni tanlang</h2>
              <button type="button" onClick={() => setGrid(false)} className="inline-flex items-center gap-2 rounded-xl border border-navy-600 px-4 py-2 font-semibold hover:border-teal-400"><X size={20} /> Yopish</button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {SECTIONS.map(s => (
                <Link key={s.path} to={s.path} onClick={() => setGrid(false)}
                  className={cx('flex items-center gap-3 rounded-2xl border p-4 transition hover:border-teal-400 hover:bg-navy-800', s.path === section?.path ? 'border-teal-400 bg-navy-800' : 'border-navy-700 bg-navy-900')}>
                  <span className={cx('grid h-11 w-11 flex-none place-items-center rounded-xl', TONE[s.tone].solid)}><s.icon size={22} /></span>
                  <span className="min-w-0"><span className="block font-mono text-xs text-teal-300">{s.no}</span><span className="block font-display font-bold leading-snug">{s.short}</span></span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------- Himoya rejimi: ssenariy paneli ---------- */}
      {defense.on && notes && section && (
        <aside className="no-print fixed bottom-24 right-3 z-[60] w-[24rem] max-w-[calc(100vw-1.5rem)] rounded-2xl border border-amber-400/60 bg-navy-900 p-5 text-white shadow-2xl" aria-label="Oʻqituvchi ssenariysi">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-base font-extrabold !text-amber-300">Ssenariy · {section.no}</h2>
            <button type="button" onClick={() => setNotes(false)} aria-label="Ssenariyni yopish" className="rounded-lg p-1.5 hover:bg-white/10"><X size={18} /></button>
          </div>
          <ScriptNote s={section} />
        </aside>
      )}
    </div>
  )
}
