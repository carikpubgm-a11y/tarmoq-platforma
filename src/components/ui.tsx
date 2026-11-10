/* ==========================================================================
   UI kutubxonasi — barcha sahifalar shu komponentlardan yigʻiladi.
   Har bir nazariy sahifa tartibi:
     <PageHeader/> → <Goal/> → <Block/>lar (nazariya + vizual misol)
     → <LifeExample/> → <Takeaway/> → <MiniTask/>
   ========================================================================== */
import { useEffect, useId, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import {
  Check, ChevronDown, CircleCheck, CircleX, Info, Lightbulb, Maximize2, Minimize2, RotateCcw,
  Target, TriangleAlert, ShieldAlert, Sparkles, ListChecks, type LucideIcon,
} from 'lucide-react'

export type Tone = 'blue' | 'teal' | 'violet' | 'amber' | 'green' | 'rose' | 'slate'

/** Tailwind sinflari toʻliq yozilgan — dinamik yigʻilmaydi (purge uchun). */
export const TONE: Record<Tone, { text: string; soft: string; border: string; solid: string; bar: string; ring: string; chip: string }> = {
  blue: { text: 'text-blue-700', soft: 'bg-blue-50', border: 'border-blue-200', solid: 'bg-blue-600 text-white', bar: 'bg-blue-500', ring: 'ring-blue-200', chip: 'bg-blue-100 text-blue-800' },
  teal: { text: 'text-teal-700', soft: 'bg-teal-50', border: 'border-teal-200', solid: 'bg-teal-600 text-white', bar: 'bg-teal-500', ring: 'ring-teal-200', chip: 'bg-teal-100 text-teal-800' },
  violet: { text: 'text-violet-700', soft: 'bg-violet-50', border: 'border-violet-200', solid: 'bg-violet-600 text-white', bar: 'bg-violet-500', ring: 'ring-violet-200', chip: 'bg-violet-100 text-violet-800' },
  amber: { text: 'text-amber-700', soft: 'bg-amber-50', border: 'border-amber-200', solid: 'bg-amber-500 text-navy-950', bar: 'bg-amber-500', ring: 'ring-amber-200', chip: 'bg-amber-100 text-amber-900' },
  green: { text: 'text-emerald-700', soft: 'bg-emerald-50', border: 'border-emerald-200', solid: 'bg-emerald-600 text-white', bar: 'bg-emerald-500', ring: 'ring-emerald-200', chip: 'bg-emerald-100 text-emerald-800' },
  rose: { text: 'text-rose-700', soft: 'bg-rose-50', border: 'border-rose-200', solid: 'bg-rose-600 text-white', bar: 'bg-rose-500', ring: 'ring-rose-200', chip: 'bg-rose-100 text-rose-800' },
  slate: { text: 'text-slate-700', soft: 'bg-slate-100', border: 'border-slate-200', solid: 'bg-slate-700 text-white', bar: 'bg-slate-400', ring: 'ring-slate-200', chip: 'bg-slate-200 text-slate-800' },
}

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(' ')
}

/* ------------------------------ Sahifa sarlavhasi ------------------------------ */
export function PageHeader({ no, tone = 'blue', eyebrow, title, lead, children }: {
  no?: string; tone?: Tone; eyebrow: string; title: string; lead?: ReactNode; children?: ReactNode
}) {
  const t = TONE[tone]
  return (
    <header className="anim-in mb-8">
      <div className="flex flex-wrap items-center gap-3">
        {no && <span className={cx('grid h-9 min-w-9 place-items-center rounded-xl px-2 font-mono text-sm font-bold', t.solid)}>{no}</span>}
        <span className={cx('text-xs font-bold uppercase tracking-[0.14em]', t.text)}>{eyebrow}</span>
      </div>
      <h1 className="mt-4 text-[2rem] font-extrabold leading-[1.12] sm:text-[2.6rem]">{title}</h1>
      {lead && <p className="prose-uz mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">{lead}</p>}
      {children}
    </header>
  )
}

/** «Mavzu maqsadi» bloki — har bir boʻlim boshida. */
export function Goal({ children, items }: { children?: ReactNode; items?: string[] }) {
  return (
    <section aria-label="Mavzu maqsadi" className="anim-in mb-10 flex gap-4 rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-5 shadow-card sm:p-6">
      <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-teal-600 text-white"><Target size={22} /></span>
      <div className="prose-uz min-w-0">
        <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-teal-700">Mavzu maqsadi</h2>
        {children && <div className="mt-1.5 text-[1.02rem] leading-relaxed text-slate-700">{children}</div>}
        {items && (
          <ul className="mt-2 space-y-1.5 text-[1.02rem] text-slate-700">
            {items.map((s, i) => <li key={i} className="flex gap-2"><Check size={18} className="mt-1 flex-none text-teal-600" /><span>{s}</span></li>)}
          </ul>
        )}
      </div>
    </section>
  )
}

/** Sahifa ichidagi mantiqiy qism (h2 bilan). */
export function Block({ title, sub, children, id, tone = 'slate' }: { title: string; sub?: ReactNode; children: ReactNode; id?: string; tone?: Tone }) {
  return (
    <section id={id} className="mb-12 scroll-mt-24">
      <div className="mb-5 flex items-start gap-3">
        <span className={cx('mt-2 h-6 w-1.5 flex-none rounded-full', TONE[tone].bar)} />
        <div>
          <h2 className="text-2xl font-bold sm:text-[1.7rem]">{title}</h2>
          {sub && <p className="prose-uz mt-1.5 max-w-3xl text-slate-600">{sub}</p>}
        </div>
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
    <article className={cx('relative overflow-hidden rounded-2xl border bg-white p-5 shadow-card sm:p-6', t ? t.border : 'border-slate-200', className)}>
      {t && <span className={cx('absolute inset-x-0 top-0 h-1', t.bar)} />}
      {(Icon || emoji) && (
        <span className={cx('mb-4 grid h-11 w-11 place-items-center rounded-xl text-xl', t ? cx(t.soft, t.text) : 'bg-slate-100 text-slate-700')} aria-hidden="true">
          {Icon ? <Icon size={22} /> : emoji}
        </span>
      )}
      {tag && <div className="mb-2">{tag}</div>}
      {title && <h3 className="text-lg font-bold leading-snug">{title}</h3>}
      {children && <div className={cx('prose-uz text-[0.97rem] leading-relaxed text-slate-600', title ? 'mt-2' : '')}>{children}</div>}
    </article>
  )
}

const CALLOUT: Record<string, { icon: LucideIcon; cls: string; head: string }> = {
  info: { icon: Info, cls: 'border-blue-200 bg-blue-50', head: 'text-blue-800' },
  note: { icon: Lightbulb, cls: 'border-violet-200 bg-violet-50', head: 'text-violet-800' },
  warn: { icon: TriangleAlert, cls: 'border-amber-200 bg-amber-50', head: 'text-amber-900' },
  danger: { icon: ShieldAlert, cls: 'border-rose-200 bg-rose-50', head: 'text-rose-800' },
  success: { icon: CircleCheck, cls: 'border-emerald-200 bg-emerald-50', head: 'text-emerald-800' },
}
export function Callout({ kind = 'info', title, children, className }: { kind?: 'info' | 'note' | 'warn' | 'danger' | 'success'; title?: string; children: ReactNode; className?: string }) {
  const c = CALLOUT[kind]
  return (
    <aside className={cx('flex gap-3.5 rounded-2xl border p-4 sm:p-5', c.cls, className)}>
      <c.icon size={22} className={cx('mt-0.5 flex-none', c.head)} />
      <div className="prose-uz min-w-0 text-[0.97rem] leading-relaxed text-slate-700">
        {title && <div className={cx('mb-1 text-xs font-bold uppercase tracking-[0.12em]', c.head)}>{title}</div>}
        {children}
      </div>
    </aside>
  )
}

export function Pill({ tone = 'slate', children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={cx('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold', TONE[tone].chip, className)}>{children}</span>
}

/** Atama: oʻzbekcha nomi va qavsda inglizchasi. */
export function Term({ children, en }: { children: ReactNode; en: string }) {
  return <span><strong>{children}</strong> <span className="font-mono text-[0.85em] text-slate-500">({en})</span></span>
}

export function Mono({ children }: { children: ReactNode }) {
  return <code className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[0.88em] text-navy-900">{children}</code>
}

export function CodeBlock({ children }: { children: ReactNode }) {
  return <pre className="overflow-x-auto rounded-xl bg-navy-950 p-4 font-mono text-[0.85rem] leading-relaxed text-navy-100">{children}</pre>
}

export function DataTable({ head, rows, dense }: { head: ReactNode[]; rows: ReactNode[][]; dense?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-card">
      <table className="w-full min-w-[34rem] border-collapse text-left text-[0.95rem]">
        <thead>
          <tr className="bg-navy-950 text-navy-100">
            {head.map((h, i) => <th key={i} scope="col" className="px-4 py-3 text-xs font-bold uppercase tracking-wider">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-slate-100 align-top even:bg-slate-50/60">
              {r.map((c, j) => <td key={j} className={cx('px-4 text-slate-700', dense ? 'py-2' : 'py-3')}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function CheckList({ items, kind = 'check' }: { items: ReactNode[]; kind?: 'check' | 'cross' | 'dot' }) {
  return (
    <ul className="space-y-2">
      {items.map((s, i) => (
        <li key={i} className="flex gap-2.5">
          {kind === 'check' && <CircleCheck size={18} className="mt-[3px] flex-none text-emerald-600" />}
          {kind === 'cross' && <CircleX size={18} className="mt-[3px] flex-none text-rose-500" />}
          {kind === 'dot' && <span className="mt-[10px] h-1.5 w-1.5 flex-none rounded-full bg-teal-500" />}
          <span>{s}</span>
        </li>
      ))}
    </ul>
  )
}

export function KV({ items }: { items: [ReactNode, ReactNode][] }) {
  return (
    <dl className="divide-y divide-slate-100">
      {items.map(([k, v], i) => (
        <div key={i} className="grid grid-cols-[minmax(7rem,30%)_1fr] gap-3 py-2.5">
          <dt className="font-semibold text-navy-950">{k}</dt>
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
        <li key={i} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-5">
          <span className={cx('grid h-10 w-10 flex-none place-items-center rounded-xl font-mono text-sm font-bold', TONE[tone].solid)}>{s.n ?? String(i + 1).padStart(2, '0')}</span>
          <div className="prose-uz min-w-0">
            <h3 className="text-[1.05rem] font-bold">{s.title}</h3>
            <div className="mt-1 text-[0.96rem] leading-relaxed text-slate-600">{s.text}</div>
            {s.result && <div className="mt-2 font-mono text-xs text-slate-500">{s.result}</div>}
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
    <div className="space-y-2.5">
      {items.map((it, i) => {
        const on = open === i
        return (
          <div key={i} className={cx('overflow-hidden rounded-2xl border bg-white shadow-card transition-colors', on ? 'border-teal-300' : 'border-slate-200')}>
            <button type="button" id={base + 'h' + i} aria-expanded={on} aria-controls={base + 'p' + i} onClick={() => setOpen(on ? null : i)}
              className="flex w-full items-center gap-3 px-4 py-4 text-left sm:px-5">
              {it.tag && <span className="flex-none rounded-lg bg-navy-950 px-2 py-1 font-mono text-[0.7rem] font-bold text-teal-300">{it.tag}</span>}
              <span className="flex-1 font-display text-[1.05rem] font-bold text-navy-950">{it.title}</span>
              <ChevronDown size={20} className={cx('flex-none text-slate-500 transition-transform', on && 'rotate-180')} />
            </button>
            {on && (
              <div id={base + 'p' + i} role="region" aria-labelledby={base + 'h' + i} className="prose-uz anim-in border-t border-slate-100 px-4 py-4 text-[0.97rem] leading-relaxed text-slate-600 sm:px-5">
                {it.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/** «Hayotiy misol» bloki. */
export function LifeExample({ title = 'Hayotiy misol', children }: { title?: string; children: ReactNode }) {
  return (
    <section className="mb-10 flex gap-4 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 shadow-card sm:p-6">
      <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-amber-500 text-navy-950"><Sparkles size={22} /></span>
      <div className="prose-uz min-w-0">
        <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-amber-800">{title}</h2>
        <div className="mt-1.5 text-[1.02rem] leading-relaxed text-slate-700">{children}</div>
      </div>
    </section>
  )
}

/** «Asosiy xulosa» bloki. */
export function Takeaway({ items, title = 'Asosiy xulosa' }: { items: ReactNode[]; title?: string }) {
  return (
    <section className="stage-dark mb-10 rounded-2xl bg-navy-950 p-5 text-navy-100 shadow-lift sm:p-7">
      <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] !text-teal-300"><ListChecks size={18} />{title}</h2>
      <ul className="mt-4 space-y-2.5 text-[1.02rem] leading-relaxed">
        {items.map((s, i) => (
          <li key={i} className="flex gap-3"><span className="mt-[3px] grid h-5 w-5 flex-none place-items-center rounded-full bg-teal-500 text-[0.7rem] font-bold text-navy-950">{i + 1}</span><span>{s}</span></li>
        ))}
      </ul>
    </section>
  )
}

/* ------------------------------ Tugma ------------------------------ */
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'dark'; size?: 'sm' | 'md' | 'lg'; icon?: LucideIcon }
export function Btn({ variant = 'secondary', size = 'md', icon: Icon, children, className, type = 'button', ...rest }: BtnProps) {
  const v = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm',
    secondary: 'bg-white text-navy-950 border border-slate-300 hover:border-teal-500 hover:bg-teal-50',
    ghost: 'text-slate-700 hover:bg-slate-100',
    danger: 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50',
    dark: 'bg-navy-800 text-white border border-navy-600 hover:bg-navy-700 hover:border-teal-400',
  }[variant]
  const s = { sm: 'px-3 py-1.5 text-sm gap-1.5 rounded-lg', md: 'px-4 py-2.5 text-[0.95rem] gap-2 rounded-xl', lg: 'px-6 py-3.5 text-base gap-2.5 rounded-2xl' }[size]
  return (
    <button type={type} className={cx('inline-flex select-none items-center justify-center font-semibold transition active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45', v, s, className)} {...rest}>
      {Icon && <Icon size={size === 'sm' ? 15 : size === 'lg' ? 20 : 17} />}
      {children}
    </button>
  )
}

/* ------------------------------ Simulyatsiya sahnasi ------------------------------ */
/** Toʻq fonli interaktiv panel. «Katta ekran» tugmasi uni butun ekranga yoyadi (himoya uchun). */
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
    <div data-stage={max ? 'max' : 'inline'} className={cx('stage-dark bg-navy-950 text-navy-100', max ? 'fixed inset-0 z-[70] overflow-auto p-4 sm:p-8' : 'rounded-2xl border border-navy-800 p-4 shadow-lift sm:p-6', className)}>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="h-2.5 w-2.5 flex-none rounded-full bg-teal-400" style={{ animation: 'pulse-dot 2s infinite' }} />
        <h3 className="mr-auto font-display text-base font-bold !text-white sm:text-lg">{title}</h3>
        {badge && <span className="rounded-full border border-navy-600 bg-navy-900 px-3 py-1 font-mono text-xs text-teal-300" role="status" aria-live="polite">{badge}</span>}
        {actions}
        <button type="button" onClick={() => setMax(m => !m)} className="no-print inline-flex items-center gap-1.5 rounded-lg border border-navy-600 bg-navy-900 px-2.5 py-1.5 text-xs font-semibold text-navy-100 hover:border-teal-400">
          {max ? <Minimize2 size={14} /> : <Maximize2 size={14} />}{max ? 'Kichraytirish' : 'Katta ekran'}
        </button>
      </div>
      {children}
      {hint && <p className="mt-4 border-t border-navy-800 pt-3 text-sm leading-relaxed text-navy-300">{hint}</p>}
    </div>
  )
}

/* ------------------------------ Kichik interaktiv topshiriq ------------------------------ */
export interface MiniQ { q: string; options: string[]; correct: number; explain: string }

/** Boʻlim oxiridagi «oʻzingizni tekshiring» topshirigʻi: javob tanlanadi, izoh chiqadi. */
export function MiniTask({ title = 'Interaktiv topshiriq', intro, questions }: { title?: string; intro?: string; questions: MiniQ[] }) {
  const [picked, setPicked] = useState<(number | null)[]>(() => questions.map(() => null))
  const done = picked.filter(p => p !== null).length
  const right = picked.filter((p, i) => p === questions[i].correct).length
  return (
    <section className="mb-10 rounded-2xl border border-violet-200 bg-white p-5 shadow-card sm:p-7" aria-label={title}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-violet-600 text-white"><ListChecks size={22} /></span>
        <div className="mr-auto">
          <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-violet-700">{title}</h2>
          <p className="text-[0.97rem] text-slate-600">{intro ?? 'Javobni tanlang — izoh darhol chiqadi.'}</p>
        </div>
        <span className="rounded-full bg-violet-100 px-3 py-1 font-mono text-sm font-bold text-violet-800" role="status" aria-live="polite">{right} / {questions.length}</span>
        {done > 0 && <Btn size="sm" variant="ghost" icon={RotateCcw} onClick={() => setPicked(questions.map(() => null))}>Qaytadan</Btn>}
      </div>
      <div className="mt-5 space-y-6">
        {questions.map((item, qi) => {
          const p = picked[qi]
          return (
            <div key={qi}>
              <p className="font-display text-[1.05rem] font-bold text-navy-950">{questions.length > 1 && <span className="mr-2 font-mono text-sm text-violet-600">{qi + 1}.</span>}{item.q}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {item.options.map((o, oi) => {
                  const isC = oi === item.correct
                  const state = p === null ? 'idle' : isC ? 'correct' : p === oi ? 'wrong' : 'dim'
                  return (
                    <button key={oi} type="button" disabled={p !== null} onClick={() => setPicked(a => a.map((v, k) => (k === qi ? oi : v)))}
                      className={cx('flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-[0.97rem] transition',
                        state === 'idle' && 'border-slate-300 bg-white hover:border-violet-500 hover:bg-violet-50',
                        state === 'correct' && 'border-emerald-400 bg-emerald-50 text-emerald-900',
                        state === 'wrong' && 'border-rose-400 bg-rose-50 text-rose-900',
                        state === 'dim' && 'border-slate-200 bg-slate-50 text-slate-400')}>
                      <span className="mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-md bg-navy-950 font-mono text-xs font-bold text-white">{'ABCD'[oi]}</span>
                      <span>{o}</span>
                    </button>
                  )
                })}
              </div>
              {p !== null && (
                <p className={cx('anim-in mt-3 rounded-xl border-l-4 px-4 py-3 text-[0.95rem] leading-relaxed', p === item.correct ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-amber-500 bg-amber-50 text-amber-900')}>
                  <strong>{p === item.correct ? 'Toʻgʻri. ' : 'Notoʻgʻri. '}</strong>{item.explain}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
