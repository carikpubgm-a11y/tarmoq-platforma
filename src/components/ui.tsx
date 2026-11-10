/* ==========================================================================
   UI kutubxonasi — maktab oʻquvchilari uchun: yirik matn, yorqin rang,
   katta tugma va jonli animatsiyalar. Barcha sahifalar shu komponentlardan
   yigʻiladi, shuning uchun bu yerdagi oʻzgarish butun saytga tarqaydi.
   ========================================================================== */
import { useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import {
  Check, ChevronDown, CircleCheck, CircleX, Info, Lightbulb, Maximize2, Minimize2, PartyPopper, RotateCcw,
  Target, TriangleAlert, ShieldAlert, Sparkles, ListChecks, Star, type LucideIcon,
} from 'lucide-react'

export type Tone = 'blue' | 'teal' | 'violet' | 'amber' | 'green' | 'rose' | 'slate'

/** Tailwind sinflari toʻliq yozilgan — dinamik yigʻilmaydi (purge uchun). */
export const TONE: Record<Tone, { text: string; soft: string; border: string; solid: string; bar: string; ring: string; chip: string; grad: string }> = {
  blue: { text: 'text-blue-700', soft: 'bg-blue-100', border: 'border-blue-200', solid: 'bg-blue-600 text-white', bar: 'bg-blue-500', ring: 'ring-blue-200', chip: 'bg-blue-100 text-blue-800', grad: 'from-blue-500 to-sky-400' },
  teal: { text: 'text-cyan-700', soft: 'bg-cyan-100', border: 'border-cyan-200', solid: 'bg-cyan-600 text-white', bar: 'bg-cyan-500', ring: 'ring-cyan-200', chip: 'bg-cyan-100 text-cyan-800', grad: 'from-cyan-500 to-teal-400' },
  violet: { text: 'text-violet-700', soft: 'bg-violet-100', border: 'border-violet-200', solid: 'bg-violet-600 text-white', bar: 'bg-violet-500', ring: 'ring-violet-200', chip: 'bg-violet-100 text-violet-800', grad: 'from-violet-500 to-fuchsia-400' },
  amber: { text: 'text-amber-700', soft: 'bg-amber-100', border: 'border-amber-200', solid: 'bg-amber-500 text-navy-900', bar: 'bg-amber-400', ring: 'ring-amber-200', chip: 'bg-amber-100 text-amber-900', grad: 'from-amber-400 to-orange-400' },
  green: { text: 'text-emerald-700', soft: 'bg-emerald-100', border: 'border-emerald-200', solid: 'bg-emerald-600 text-white', bar: 'bg-emerald-500', ring: 'ring-emerald-200', chip: 'bg-emerald-100 text-emerald-800', grad: 'from-emerald-500 to-lime-400' },
  rose: { text: 'text-rose-700', soft: 'bg-rose-100', border: 'border-rose-200', solid: 'bg-rose-600 text-white', bar: 'bg-rose-500', ring: 'ring-rose-200', chip: 'bg-rose-100 text-rose-800', grad: 'from-rose-500 to-pink-400' },
  slate: { text: 'text-slate-700', soft: 'bg-slate-100', border: 'border-slate-200', solid: 'bg-slate-700 text-white', bar: 'bg-slate-400', ring: 'ring-slate-200', chip: 'bg-slate-200 text-slate-800', grad: 'from-slate-500 to-slate-400' },
}

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(' ')
}

/* ------------------------------ Bayram (konfetti) ------------------------------ */
const RANG = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#F43F5E', '#3B82F6', '#EC4899']
/** Toʻgʻri javob berilganda otiladigan kichik bayram. Kutubxona kerak emas. */
export function Konfetti({ on }: { on: boolean }) {
  const [parts, setParts] = useState<{ id: number; x: number; r: number; d: number; c: string }[]>([])
  const seq = useRef(0)
  useEffect(() => {
    if (!on) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const made = Array.from({ length: 26 }, () => ({
      id: seq.current++, x: Math.round(Math.random() * 100), r: Math.round(Math.random() * 360),
      d: 0.5 + Math.random() * 0.7, c: RANG[Math.floor(Math.random() * RANG.length)],
    }))
    setParts(made)
    const t = setTimeout(() => setParts([]), 1600)
    return () => clearTimeout(t)
  }, [on])
  if (!parts.length) return null
  return (
    <div className="pointer-events-none absolute inset-x-0 -top-2 h-36 overflow-hidden" aria-hidden="true">
      {parts.map(p => (
        <span key={p.id} className="absolute block h-2.5 w-2.5 rounded-[2px]"
          style={{ left: p.x + '%', backgroundColor: p.c, animation: `fall ${p.d + 0.5}s cubic-bezier(.3,.7,.5,1) forwards`, transform: `rotate(${p.r}deg)` }} />
      ))}
      <style>{`@keyframes fall { 0% { transform: translateY(-14px) rotate(0); opacity: 1 } 100% { transform: translateY(140px) rotate(400deg); opacity: 0 } }`}</style>
    </div>
  )
}

/* ------------------------------ Sahifa sarlavhasi ------------------------------ */
export function PageHeader({ no, tone = 'blue', eyebrow, title, lead, children }: {
  no?: string; tone?: Tone; eyebrow: string; title: string; lead?: ReactNode; children?: ReactNode
}) {
  const t = TONE[tone]
  return (
    <header className="anim-in mb-8">
      <div className="flex flex-wrap items-center gap-3">
        {no && <span className={cx('grid h-11 min-w-11 place-items-center rounded-2xl px-2.5 font-display text-lg font-extrabold shadow-card', t.solid)}>{no}</span>}
        <span className={cx('rounded-full px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[0.12em]', t.chip)}>{eyebrow}</span>
      </div>
      <h1 className="text-balance mt-4 text-[2.1rem] font-extrabold leading-[1.1] sm:text-[2.7rem]">{title}</h1>
      {lead && <p className="prose-uz mt-4 max-w-3xl text-[1.12rem] leading-relaxed text-slate-600">{lead}</p>}
      {children}
    </header>
  )
}

/** «Bu darsda nimani oʻrganamiz» bloki — har bir boʻlim boshida. */
export function Goal({ children, items, title = 'Bu darsda nimani oʻrganamiz?' }: { children?: ReactNode; items?: string[]; title?: string }) {
  return (
    <section aria-label={title} className="anim-in mb-10 overflow-hidden rounded-4xl border-2 border-emerald-200 bg-white shadow-card">
      <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-lime-400 px-5 py-3.5 sm:px-6">
        <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-white/25 text-white"><Target size={20} /></span>
        <h2 className="font-display text-base font-extrabold !text-white sm:text-lg">{title}</h2>
      </div>
      <div className="prose-uz p-5 sm:p-6">
        {children && <div className="text-[1.05rem] leading-relaxed text-slate-700">{children}</div>}
        {items && (
          <ul className="grid gap-2.5 text-[1.05rem] text-slate-700 sm:grid-cols-2">
            {items.map((s, i) => (
              <li key={i} className="flex gap-2.5"><span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-lg bg-emerald-100 text-emerald-700"><Check size={15} strokeWidth={3} /></span><span>{s}</span></li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

/** Sahifa ichidagi mantiqiy qism. */
export function Block({ title, sub, children, id, tone = 'violet' }: { title: string; sub?: ReactNode; children: ReactNode; id?: string; tone?: Tone }) {
  return (
    <section id={id} className="mb-12 scroll-mt-24">
      <div className="mb-5">
        <h2 className="flex items-center gap-3 text-[1.6rem] font-extrabold sm:text-[1.9rem]">
          <span className={cx('h-7 w-2 flex-none rounded-full bg-gradient-to-b', TONE[tone].grad)} />
          <span className="text-balance">{title}</span>
        </h2>
        {sub && <p className="prose-uz mt-2 max-w-3xl pl-5 text-[1.05rem] text-slate-600">{sub}</p>}
      </div>
      {children}
    </section>
  )
}

export function Grid({ cols = 2, children, className }: { cols?: 1 | 2 | 3 | 4; children: ReactNode; className?: string }) {
  const c = { 1: 'grid-cols-1', 2: 'grid-cols-1 md:grid-cols-2', 3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3', 4: 'grid-cols-2 lg:grid-cols-4' }[cols]
  return <div className={cx('grid gap-4', c, className)}>{children}</div>
}

export function Card({ tone, icon: Icon, emoji, title, tag, children, className }: {
  tone?: Tone; icon?: LucideIcon; emoji?: string; title?: ReactNode; tag?: ReactNode; children?: ReactNode; className?: string
}) {
  const t = tone ? TONE[tone] : null
  return (
    <article className={cx('group relative overflow-hidden rounded-4xl border-2 bg-white p-5 shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-lift sm:p-6', t ? t.border : 'border-slate-200', className)}>
      {t && <span className={cx('absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r', t.grad)} />}
      {(Icon || emoji) && (
        <span className={cx('mb-4 grid h-14 w-14 place-items-center rounded-2xl text-2xl transition group-hover:scale-110', t ? cx(t.soft, t.text) : 'bg-slate-100 text-slate-700')} aria-hidden="true">
          {Icon ? <Icon size={26} /> : emoji}
        </span>
      )}
      {tag && <div className="mb-2">{tag}</div>}
      {title && <h3 className="text-balance text-[1.15rem] font-extrabold leading-snug">{title}</h3>}
      {children && <div className={cx('prose-uz text-[1rem] leading-relaxed text-slate-600', title ? 'mt-2' : '')}>{children}</div>}
    </article>
  )
}

const CALLOUT: Record<string, { icon: LucideIcon; cls: string; head: string; dot: string }> = {
  info: { icon: Info, cls: 'border-blue-200 bg-blue-50', head: 'text-blue-800', dot: 'bg-blue-500' },
  note: { icon: Lightbulb, cls: 'border-violet-200 bg-violet-50', head: 'text-violet-800', dot: 'bg-violet-500' },
  warn: { icon: TriangleAlert, cls: 'border-amber-300 bg-amber-50', head: 'text-amber-900', dot: 'bg-amber-500' },
  danger: { icon: ShieldAlert, cls: 'border-rose-200 bg-rose-50', head: 'text-rose-800', dot: 'bg-rose-500' },
  success: { icon: CircleCheck, cls: 'border-emerald-200 bg-emerald-50', head: 'text-emerald-800', dot: 'bg-emerald-500' },
}
export function Callout({ kind = 'info', title, children, className }: { kind?: 'info' | 'note' | 'warn' | 'danger' | 'success'; title?: string; children: ReactNode; className?: string }) {
  const c = CALLOUT[kind]
  return (
    <aside className={cx('flex gap-4 rounded-3xl border-2 p-4 sm:p-5', c.cls, className)}>
      <span className={cx('grid h-10 w-10 flex-none place-items-center rounded-2xl text-white', c.dot)}><c.icon size={21} /></span>
      <div className="prose-uz min-w-0 self-center text-[1rem] leading-relaxed text-slate-700">
        {title && <div className={cx('mb-1 text-xs font-extrabold uppercase tracking-[0.1em]', c.head)}>{title}</div>}
        {children}
      </div>
    </aside>
  )
}

export function Pill({ tone = 'slate', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={cx('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold', TONE[tone].chip, className)}>{children}</span>
}

/** Atama: oʻzbekcha nomi va qavsda inglizchasi. */
export function Term({ children, en }: { children: ReactNode; en: string }) {
  return <span><strong>{children}</strong> <span className="font-mono text-[0.85em] text-slate-500">({en})</span></span>
}

export function Mono({ children }: { children: ReactNode }) {
  return <code className="rounded-lg bg-brand-50 px-2 py-0.5 font-mono text-[0.88em] font-semibold text-brand-800">{children}</code>
}

export function CodeBlock({ children }: { children: ReactNode }) {
  return <pre className="overflow-x-auto rounded-2xl bg-navy-950 p-4 font-mono text-[0.85rem] leading-relaxed text-navy-100">{children}</pre>
}

export function DataTable({ head, rows, dense }: { head: ReactNode[]; rows: ReactNode[][]; dense?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-3xl border-2 border-slate-200 bg-white shadow-card">
      <table className="w-full min-w-[34rem] border-collapse text-left text-[1rem]">
        <thead>
          <tr className="bg-gradient-to-r from-brand-600 to-violet-500 text-white">
            {head.map((h, i) => <th key={i} scope="col" className="px-4 py-3.5 text-xs font-extrabold uppercase tracking-wider">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t-2 border-slate-100 align-top transition-colors even:bg-brand-50/40 hover:bg-brand-50">
              {r.map((c, j) => <td key={j} className={cx('px-4 text-slate-700', dense ? 'py-2.5' : 'py-3.5')}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function CheckList({ items, kind = 'check' }: { items: ReactNode[]; kind?: 'check' | 'cross' | 'dot' }) {
  return (
    <ul className="space-y-2.5">
      {items.map((s, i) => (
        <li key={i} className="flex gap-3">
          {kind === 'check' && <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-lg bg-emerald-100 text-emerald-700"><Check size={15} strokeWidth={3} /></span>}
          {kind === 'cross' && <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-lg bg-rose-100 text-rose-600"><CircleX size={15} strokeWidth={3} /></span>}
          {kind === 'dot' && <span className="mt-[11px] h-2 w-2 flex-none rounded-full bg-brand-500" />}
          <span>{s}</span>
        </li>
      ))}
    </ul>
  )
}

export function KV({ items }: { items: [ReactNode, ReactNode][] }) {
  return (
    <dl className="divide-y-2 divide-slate-100">
      {items.map(([k, v], i) => (
        <div key={i} className="grid grid-cols-[minmax(7rem,30%)_1fr] gap-3 py-3">
          <dt className="font-bold text-navy-900">{k}</dt>
          <dd className="text-slate-600">{v}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Raqamlangan bosqichlar roʻyxati. */
export function StepList({ items, tone = 'teal' }: { items: { title: string; text: ReactNode; result?: string; n?: string }[]; tone?: Tone }) {
  return (
    <ol className="space-y-3">
      {items.map((s, i) => (
        <li key={i} className="flex gap-4 rounded-3xl border-2 border-slate-200 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lift sm:p-5">
          <span className={cx('grid h-12 w-12 flex-none place-items-center rounded-2xl bg-gradient-to-br font-display text-lg font-extrabold text-white', TONE[tone].grad)}>{s.n ?? i + 1}</span>
          <div className="prose-uz min-w-0 self-center">
            <h3 className="text-[1.1rem] font-extrabold">{s.title}</h3>
            <div className="mt-1 text-[1rem] leading-relaxed text-slate-600">{s.text}</div>
            {s.result && <div className="mt-2 inline-block rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-600">{s.result}</div>}
          </div>
        </li>
      ))}
    </ol>
  )
}

export function Accordion({ items, defaultOpen = 0 }: { items: { title: string; tag?: string; content: ReactNode }[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen)
  const base = useId()
  return (
    <div className="space-y-3">
      {items.map((it, i) => {
        const on = open === i
        return (
          <div key={i} className={cx('overflow-hidden rounded-3xl border-2 bg-white shadow-card transition', on ? 'border-brand-400' : 'border-slate-200 hover:border-brand-200')}>
            <button type="button" id={base + 'h' + i} aria-expanded={on} aria-controls={base + 'p' + i} onClick={() => setOpen(on ? null : i)}
              className="flex w-full items-center gap-3 px-4 py-4 text-left sm:px-5">
              {it.tag && <span className={cx('flex-none rounded-xl px-2.5 py-1.5 font-mono text-[0.72rem] font-extrabold', on ? 'bg-brand-600 text-white' : 'bg-brand-100 text-brand-700')}>{it.tag}</span>}
              <span className="flex-1 font-display text-[1.1rem] font-extrabold text-navy-900">{it.title}</span>
              <span className={cx('grid h-9 w-9 flex-none place-items-center rounded-xl transition-transform', on ? 'rotate-180 bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-500')}><ChevronDown size={20} /></span>
            </button>
            {on && (
              <div id={base + 'p' + i} role="region" aria-labelledby={base + 'h' + i} className="prose-uz anim-in border-t-2 border-slate-100 px-4 py-4 text-[1rem] leading-relaxed text-slate-600 sm:px-5">
                {it.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/** «Hayotdan misol» bloki. */
export function LifeExample({ title = 'Hayotdan misol', children }: { title?: string; children: ReactNode }) {
  return (
    <section className="mb-10 overflow-hidden rounded-4xl border-2 border-amber-200 bg-white shadow-card">
      <div className="flex items-center gap-3 bg-gradient-to-r from-amber-400 to-orange-400 px-5 py-3.5 sm:px-6">
        <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-white/30 text-navy-900"><Sparkles size={20} /></span>
        <h2 className="font-display text-base font-extrabold !text-navy-900 sm:text-lg">{title}</h2>
      </div>
      <div className="prose-uz p-5 text-[1.05rem] leading-relaxed text-slate-700 sm:p-6">{children}</div>
    </section>
  )
}

/** «Esda qoladigan asosiy fikr» bloki. */
export function Takeaway({ items, title = 'Esda qoling' }: { items: ReactNode[]; title?: string }) {
  return (
    <section className="stage-dark mb-10 overflow-hidden rounded-4xl bg-gradient-to-br from-navy-900 via-brand-900 to-navy-950 p-5 text-navy-100 shadow-lift sm:p-7">
      <h2 className="flex items-center gap-2.5 font-display text-base font-extrabold !text-cyan-300 sm:text-lg"><ListChecks size={22} />{title}</h2>
      <ul className="mt-4 space-y-3 text-[1.05rem] leading-relaxed">
        {items.map((s, i) => (
          <li key={i} className="flex gap-3"><span className="mt-0.5 grid h-7 w-7 flex-none place-items-center rounded-xl bg-cyan-400 font-display text-sm font-extrabold text-navy-950">{i + 1}</span><span className="self-center">{s}</span></li>
        ))}
      </ul>
    </section>
  )
}

/* ------------------------------ Tugma ------------------------------ */
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'dark'; size?: 'sm' | 'md' | 'lg'; icon?: LucideIcon }
export function Btn({ variant = 'secondary', size = 'md', icon: Icon, children, className, type = 'button', ...rest }: BtnProps) {
  const v = {
    primary: 'bg-gradient-to-b from-brand-500 to-brand-600 text-white hover:from-brand-400 hover:to-brand-500 btn-pop',
    secondary: 'bg-white text-navy-900 border-2 border-slate-200 hover:border-brand-400 hover:bg-brand-50',
    ghost: 'text-slate-600 hover:bg-slate-100',
    danger: 'bg-white text-rose-700 border-2 border-rose-200 hover:bg-rose-50 hover:border-rose-400',
    dark: 'bg-navy-800 text-white border-2 border-navy-600 hover:bg-navy-700 hover:border-cyan-400',
  }[variant]
  const s = { sm: 'px-3.5 py-2 text-sm gap-1.5 rounded-xl', md: 'px-5 py-2.5 text-[1rem] gap-2 rounded-2xl', lg: 'px-7 py-4 text-[1.1rem] gap-2.5 rounded-2xl' }[size]
  return (
    <button type={type} className={cx('inline-flex select-none items-center justify-center font-extrabold transition active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45 disabled:active:translate-y-0', v, s, className)} {...rest}>
      {Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />}
      {children}
    </button>
  )
}

/* ------------------------------ Simulyatsiya sahnasi ------------------------------ */
/** Toʻq fonli interaktiv panel — «ekran» kabi. «Katta ekran» tugmasi uni butun ekranga yoyadi. */
export function Stage({ title, badge, children, hint, actions, className }: {
  title: string; badge?: ReactNode; children: ReactNode; hint?: ReactNode; actions?: ReactNode; className?: string
}) {
  const [max, setMax] = useState(false)
  useEffect(() => {
    if (!max) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMax(false) }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [max])
  return (
    <div data-stage={max ? 'max' : 'inline'} className={cx('stage-dark bg-gradient-to-br from-navy-900 via-navy-950 to-brand-900 text-navy-100', max ? 'fixed inset-0 z-[70] overflow-auto p-4 sm:p-8' : 'rounded-4xl border-2 border-navy-700 p-4 shadow-lift sm:p-6', className)}>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="h-3 w-3 flex-none animate-pulse-soft rounded-full bg-cyan-400" />
        <h3 className="mr-auto font-display text-[1.05rem] font-extrabold !text-white sm:text-xl">{title}</h3>
        {badge && <span className="rounded-full border-2 border-navy-600 bg-navy-900 px-3.5 py-1.5 font-mono text-sm font-bold text-cyan-300" role="status" aria-live="polite">{badge}</span>}
        {actions}
        <button type="button" onClick={() => setMax(m => !m)} className="no-print inline-flex items-center gap-1.5 rounded-xl border-2 border-navy-600 bg-navy-900 px-3 py-2 text-sm font-bold text-navy-100 transition hover:border-cyan-400 hover:text-white">
          {max ? <Minimize2 size={16} /> : <Maximize2 size={16} />}{max ? 'Kichraytirish' : 'Katta ekran'}
        </button>
      </div>
      {children}
      {hint && <p className="mt-4 border-t-2 border-navy-800 pt-3 text-[0.95rem] leading-relaxed text-navy-300">{hint}</p>}
    </div>
  )
}

/* ------------------------------ Kichik interaktiv topshiriq ------------------------------ */
export interface MiniQ { q: string; options: string[]; correct: number; explain: string }

/** Boʻlim oxiridagi «oʻzingni sinab koʻr» topshirigʻi. Toʻgʻri javobda — bayram. */
export function MiniTask({ title = 'Oʻzingni sinab koʻr', intro, questions }: { title?: string; intro?: string; questions: MiniQ[] }) {
  const [picked, setPicked] = useState<(number | null)[]>(() => questions.map(() => null))
  const [party, setParty] = useState(-1)
  const done = picked.filter(p => p !== null).length
  const right = picked.filter((p, i) => p === questions[i].correct).length
  const all = done === questions.length

  function javob(qi: number, oi: number) {
    setPicked(a => a.map((v, k) => (k === qi ? oi : v)))
    if (oi === questions[qi].correct) { setParty(qi); setTimeout(() => setParty(-1), 1700) }
  }

  return (
    <section className="relative mb-10 overflow-hidden rounded-4xl border-2 border-violet-200 bg-white shadow-card" aria-label={title}>
      <div className="flex flex-wrap items-center gap-3 bg-gradient-to-r from-violet-500 to-fuchsia-400 px-5 py-3.5 sm:px-6">
        <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-white/25 text-white"><ListChecks size={20} /></span>
        <h2 className="mr-auto font-display text-base font-extrabold !text-white sm:text-lg">{title}</h2>
        <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-1 font-display text-base font-extrabold text-violet-700" role="status" aria-live="polite">
          <Star size={16} className={right ? 'fill-amber-400 text-amber-400' : 'text-violet-300'} />{right} / {questions.length}
        </span>
        {done > 0 && <Btn size="sm" variant="secondary" icon={RotateCcw} onClick={() => setPicked(questions.map(() => null))}>Qaytadan</Btn>}
      </div>

      <div className="p-5 sm:p-6">
        {intro && <p className="mb-4 text-[1.02rem] text-slate-600">{intro}</p>}
        <div className="space-y-7">
          {questions.map((item, qi) => {
            const p = picked[qi]
            return (
              <div key={qi} className="relative">
                {party === qi && <Konfetti on />}
                <p className="text-balance font-display text-[1.15rem] font-extrabold text-navy-900">
                  {questions.length > 1 && <span className="mr-2 inline-grid h-7 w-7 place-items-center rounded-lg bg-violet-100 font-mono text-sm text-violet-700">{qi + 1}</span>}
                  {item.q}
                </p>
                <div className="mt-3.5 grid gap-2.5 sm:grid-cols-2">
                  {item.options.map((o, oi) => {
                    const isC = oi === item.correct
                    const state = p === null ? 'idle' : isC ? 'correct' : p === oi ? 'wrong' : 'dim'
                    return (
                      <button key={oi} type="button" disabled={p !== null} onClick={() => javob(qi, oi)}
                        className={cx('flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left text-[1.02rem] font-semibold transition',
                          state === 'idle' && 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-violet-400 hover:bg-violet-50 hover:shadow-card',
                          state === 'correct' && 'animate-pop border-emerald-400 bg-emerald-50 text-emerald-900',
                          state === 'wrong' && 'animate-wiggle border-rose-400 bg-rose-50 text-rose-900',
                          state === 'dim' && 'border-slate-100 bg-slate-50 text-slate-400')}>
                        <span className={cx('grid h-9 w-9 flex-none place-items-center rounded-xl font-display text-sm font-extrabold',
                          state === 'correct' ? 'bg-emerald-500 text-white' : state === 'wrong' ? 'bg-rose-500 text-white' : state === 'dim' ? 'bg-slate-200 text-slate-400' : 'bg-navy-900 text-white')}>
                          {state === 'correct' ? <Check size={18} strokeWidth={3} /> : state === 'wrong' ? <CircleX size={18} /> : 'ABCD'[oi]}
                        </span>
                        <span>{o}</span>
                      </button>
                    )
                  })}
                </div>
                {p !== null && (
                  <p className={cx('anim-in mt-3.5 flex gap-3 rounded-2xl border-2 px-4 py-3.5 text-[1rem] leading-relaxed',
                    p === item.correct ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-amber-200 bg-amber-50 text-amber-900')}>
                    <span className="flex-none text-xl">{p === item.correct ? '🎉' : '💡'}</span>
                    <span><strong>{p === item.correct ? 'Barakalla! ' : 'Hechqisi yoʻq. '}</strong>{item.explain}</span>
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {all && (
          <div className={cx('anim-in mt-6 flex items-center gap-4 rounded-3xl border-2 p-5', right === questions.length ? 'border-emerald-300 bg-emerald-50' : 'border-violet-200 bg-violet-50')}>
            <span className="text-4xl">{right === questions.length ? '🏆' : right >= questions.length / 2 ? '👍' : '📚'}</span>
            <p className="font-display text-[1.05rem] font-extrabold text-navy-900">
              {right === questions.length ? 'Hammasi toʻgʻri! Zoʻr ish!' : right >= questions.length / 2 ? `${questions.length} tadan ${right} tasi toʻgʻri — yaxshi!` : 'Izohlarni oʻqib, yana bir urinib koʻring.'}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

/* ------------------------------ Kichik yordamchilar ------------------------------ */
/** Ball koʻrsatkichi (oʻyin uslubida). */
export function Ball({ ball, maks, label }: { ball: number; maks?: number; label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-4 py-1.5 font-display text-base font-extrabold text-navy-900 shadow-card">
      <PartyPopper size={17} />{ball}{maks ? ` / ${maks}` : ''}{label ? ' ' + label : ''}
    </span>
  )
}

/** Rangli progress chizigʻi. */
export function Progress({ value, max = 100, tone = 'green', className }: { value: number; max?: number; tone?: Tone; className?: string }) {
  const pct = Math.max(0, Math.min(100, (value / (max || 1)) * 100))
  return (
    <div className={cx('h-3 overflow-hidden rounded-full bg-slate-200', className)} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <div className={cx('h-full rounded-full bg-gradient-to-r transition-all duration-700', TONE[tone].grad)} style={{ width: pct + '%' }} />
    </div>
  )
}
