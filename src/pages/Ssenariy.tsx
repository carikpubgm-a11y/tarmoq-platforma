import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Mic, MonitorPlay, Presentation, Printer, Star } from 'lucide-react'
import { Btn, Callout, CheckList, PageHeader, TONE, cx } from '../components/ui'
import { SECTIONS } from '../data/sections'

const secs = (t: string) => { const [m, s] = t.split(':').map(Number); return m * 60 + s }
const fmt = (n: number) => `${Math.floor(n / 60)} daq${n % 60 ? ' ' + (n % 60) + ' s' : ''}`

/** Oʻqituvchi (himoyachi) uchun taqdimot ssenariysi — oddiy oʻquvchi interfeysidan alohida sahifa. */
export default function Ssenariy() {
  const [onlyKey, setOnlyKey] = useState(false)
  const list = SECTIONS.filter(s => !onlyKey || s.script.key)
  const total = list.reduce((a, s) => a + secs(s.script.time), 0)

  return (
    <>
      <PageHeader tone="amber" eyebrow="Faqat taqdimotchi uchun" title="Taqdimot ssenariysi"
        lead="Har bir boʻlimda nimani tushuntirish, qaysi metodni qachon bajarish va qaysi amaliyotni koʻrsatish — bitta jadvalda. Himoya rejimida shu matn «Ssenariy» tugmasi (N) orqali joriy boʻlim uchun ochiladi." />

      <div className="no-print mb-6 flex flex-wrap items-center gap-3">
        <div className="inline-flex overflow-hidden rounded-xl border border-slate-300" role="group" aria-label="Ssenariy hajmi">
          <button type="button" aria-pressed={!onlyKey} onClick={() => setOnlyKey(false)} className={cx('px-4 py-2.5 text-sm font-semibold', !onlyKey ? 'bg-navy-950 text-white' : 'bg-white text-slate-700')}>Toʻliq mashgʻulot</button>
          <button type="button" aria-pressed={onlyKey} onClick={() => setOnlyKey(true)} className={cx('inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold', onlyKey ? 'bg-navy-950 text-white' : 'bg-white text-slate-700')}><Star size={15} /> Qisqa himoya (asosiy bekatlar)</button>
        </div>
        <span className="inline-flex items-center gap-2 rounded-xl bg-amber-100 px-3.5 py-2 font-mono text-sm font-bold text-amber-900" role="status" aria-live="polite"><Clock size={16} /> {list.length} sahifa · {fmt(total)}</span>
        <Btn icon={Printer} onClick={() => window.print()}>Chop etish</Btn>
        <Link to="/himoya" className="inline-flex items-center gap-2 rounded-xl bg-navy-950 px-4 py-2.5 text-[0.95rem] font-semibold text-white hover:bg-navy-800"><Presentation size={17} /> Himoyani boshlash</Link>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <Callout kind="note" title="Himoyadan oldin">
          <CheckList kind="dot" items={[
            'Brauzerni toʻliq ekranga oʻtkazing (F tugmasi).',
            'Laboratoriyada «Yulduz» andozasi yuklanganini tekshiring.',
            'Internet boʻlmasa ham platforma ishlaydi — faqat tashqi havolalar ochilmaydi.',
            '«Bosh sahifa → Himoya rejimi» orqali boshlang.',
          ]} />
        </Callout>
        <Callout kind="warn" title="Boshqaruv">
          <CheckList kind="dot" items={[
            <><strong>← →</strong> yoki PageUp / PageDown — oldingi va keyingi boʻlim</>,
            <><strong>G</strong> — barcha boʻlimlar toʻri, <strong>N</strong> — ssenariy, <strong>F</strong> — toʻliq ekran</>,
            'Har bir simulyatorda «Katta ekran» tugmasi bor (Esc — qaytish).',
            'Matn maydoniga yozayotganda strelkalar sahifani almashtirmaydi.',
          ]} />
        </Callout>
      </div>

      <ol className="space-y-3">
        {list.map(s => (
          <li key={s.path} className={cx('rounded-2xl border bg-white p-5 shadow-card', s.script.key ? 'border-amber-300' : 'border-slate-200')}>
            <div className="flex flex-wrap items-center gap-3">
              <span className={cx('grid h-10 min-w-10 place-items-center rounded-xl px-2 font-mono text-sm font-bold', TONE[s.tone].solid)}>{s.no}</span>
              <Link to={s.path} className="mr-auto font-display text-lg font-bold text-navy-950 underline-offset-4 hover:underline">{s.title}</Link>
              {s.script.key && <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-900"><Star size={13} /> asosiy bekat</span>}
              <span className="inline-flex items-center gap-1.5 font-mono text-sm font-bold text-slate-600"><Clock size={15} /> {s.script.time}</span>
            </div>
            <dl className="mt-4 grid gap-4 md:grid-cols-3">
              <div><dt className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500"><Mic size={14} /> Nima tushuntiriladi</dt><dd className="text-[0.95rem] leading-relaxed text-slate-700">{s.script.say}</dd></div>
              <div><dt className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500"><Presentation size={14} /> Metod</dt><dd className="text-[0.95rem] leading-relaxed text-slate-700">{s.script.method}</dd></div>
              <div><dt className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500"><MonitorPlay size={14} /> Nima namoyish qilinadi</dt><dd className="text-[0.95rem] leading-relaxed text-slate-700">{s.script.demo}</dd></div>
            </dl>
          </li>
        ))}
      </ol>

      <Callout kind="success" title="Yakuniy gap uchun tayanch" className="mt-8">
        «Bu loyihada men mavzuni faqat aytib bermadim: tarmoqni loyihaladim, simulyatsiyada sinadim, beshta metodni amalda qoʻlladim va bilimni baholash tizimini koʻrsatdim. Oʻqitishda eng muhim savol — <strong>“nega?”</strong>».
      </Callout>
    </>
  )
}
