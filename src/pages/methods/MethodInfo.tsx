import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronDown, ClipboardCheck, GraduationCap, Lightbulb, Pause, Play, RotateCcw, Target, Timer as TimerIcon, Trophy, UserRound, Workflow } from 'lucide-react'
import { CheckList, cx } from '../../components/ui'

export interface MethodMeta {
  goal: ReactNode
  how: string[]
  teacher: string[]
  student: string[]
  example: ReactNode
  outcome: ReactNode
  criteria: string[]
}

/** Metod pasporti. Oʻquvchiga qisqa «qanday ishlaydi» koʻrinadi,
    toʻliq metodik tavsif esa oʻqituvchi uchun yigʻib qoʻyilgan. */
export function MethodInfo({ m }: { m: MethodMeta }) {
  const [ochiq, setOchiq] = useState(false)
  const Box = ({ icon: I, title, children, wide }: { icon: typeof Target; title: string; children: ReactNode; wide?: boolean }) => (
    <section className={cx('rounded-3xl border-2 border-slate-200 bg-white p-5 shadow-card', wide && 'md:col-span-2')}>
      <h3 className="mb-2.5 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-amber-700"><I size={17} />{title}</h3>
      <div className="prose-uz text-[0.98rem] leading-relaxed text-slate-700">{children}</div>
    </section>
  )
  return (
    <div className="mb-10">
      {/* Oʻquvchi uchun — qisqa qadamlar */}
      <section className="overflow-hidden rounded-4xl border-2 border-amber-200 bg-white shadow-card">
        <div className="flex items-center gap-3 bg-gradient-to-r from-amber-400 to-orange-400 px-5 py-3.5">
          <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-white/30 text-navy-900"><Workflow size={20} /></span>
          <h2 className="font-display text-base font-extrabold !text-navy-900 sm:text-lg">Qanday ishlaymiz?</h2>
        </div>
        <ol className="grid gap-3 p-5 sm:grid-cols-2">
          {m.how.map((h, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid h-9 w-9 flex-none place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 font-display text-sm font-extrabold text-navy-900">{i + 1}</span>
              <span className="self-center text-[1rem] text-slate-700">{h}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Oʻqituvchi uchun — yigʻib qoʻyilgan */}
      <button type="button" onClick={() => setOchiq(o => !o)} aria-expanded={ochiq}
        className="no-print mt-3 inline-flex items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-600 transition hover:border-amber-400 hover:text-amber-700">
        <GraduationCap size={17} />{ochiq ? 'Metodik tavsifni yopish' : 'Oʻqituvchi uchun metodik tavsif'}
        <ChevronDown size={16} className={cx('transition-transform', ochiq && 'rotate-180')} />
      </button>

      {ochiq && (
        <div className="anim-in mt-4 grid gap-4 md:grid-cols-2">
          <Box icon={Target} title="Metodning maqsadi" wide>{m.goal}</Box>
          <Box icon={GraduationCap} title="Oʻqituvchining vazifasi"><CheckList kind="dot" items={m.teacher} /></Box>
          <Box icon={UserRound} title="Oʻquvchining vazifasi"><CheckList kind="dot" items={m.student} /></Box>
          <Box icon={Lightbulb} title="Mavzu boʻyicha real misol">{m.example}</Box>
          <Box icon={Trophy} title="Kutiladigan taʼlimiy natija">{m.outcome}</Box>
          <Box icon={ClipboardCheck} title="Baholash mezoni" wide><CheckList items={m.criteria} /></Box>
        </div>
      )}
    </div>
  )
}

/** Mashgʻulot bosqichi uchun sodda taymer (boshlash / toʻxtatish / qaytadan). */
export function StageTimer({ seconds, label = 'Taymer' }: { seconds: number; label?: string }) {
  const [left, setLeft] = useState(seconds)
  const [on, setOn] = useState(false)
  const ref = useRef<number | null>(null)
  useEffect(() => { setLeft(seconds); setOn(false) }, [seconds])
  useEffect(() => {
    if (!on) return
    ref.current = window.setInterval(() => setLeft(l => { if (l <= 1) { setOn(false); return 0 } return l - 1 }), 1000)
    return () => { if (ref.current) window.clearInterval(ref.current) }
  }, [on])
  const mm = String(Math.floor(left / 60)), ss = String(left % 60).padStart(2, '0')
  return (
    <div className="no-print inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 shadow-sm" role="timer" aria-label={label}>
      <TimerIcon size={17} className={left === 0 ? 'text-rose-600' : 'text-amber-600'} />
      <span className={cx('min-w-[3.2rem] font-mono text-base font-bold tabular-nums', left === 0 ? 'text-rose-600' : 'text-navy-950')}>{mm}:{ss}</span>
      <button type="button" onClick={() => { if (left === 0) setLeft(seconds); setOn(o => !o) }} aria-label={on ? 'Taymerni toʻxtatish' : 'Taymerni boshlash'} className="rounded-lg p-1.5 text-slate-700 hover:bg-slate-100">{on ? <Pause size={16} /> : <Play size={16} />}</button>
      <button type="button" onClick={() => { setOn(false); setLeft(seconds) }} aria-label="Taymerni qaytadan boshlash" className="rounded-lg p-1.5 text-slate-700 hover:bg-slate-100"><RotateCcw size={16} /></button>
    </div>
  )
}

/** Bosqichlar yoʻlagi (stepper). */
export function Stepper({ steps, current, onPick, done }: { steps: string[]; current: number; onPick: (i: number) => void; done?: boolean[] }) {
  return (
    <ol className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:auto-cols-fr lg:grid-flow-col lg:grid-cols-none" aria-label="Bosqichlar">
      {steps.map((s, i) => (
        <li key={i}>
          <button type="button" onClick={() => onPick(i)} aria-current={i === current ? 'step' : undefined}
            className={cx('flex h-full w-full flex-col gap-1 rounded-xl border px-2.5 py-2 text-left transition sm:px-3',
              i === current ? 'border-amber-500 bg-amber-50 shadow-sm' : done?.[i] ? 'border-emerald-300 bg-emerald-50 hover:border-emerald-500' : 'border-slate-200 bg-white hover:border-amber-400')}>
            <span className={cx('font-mono text-[0.7rem] font-bold', i === current ? 'text-amber-700' : done?.[i] ? 'text-emerald-700' : 'text-slate-400')}>{done?.[i] && i !== current ? '✓ ' : ''}{i + 1}-BOSQICH</span>
            <span className="text-[0.82rem] font-semibold leading-tight text-navy-950 sm:text-sm">{s}</span>
          </button>
        </li>
      ))}
    </ol>
  )
}
