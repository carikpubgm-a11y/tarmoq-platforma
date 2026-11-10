import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, BookOpen, ChartColumn, CircleCheck, CircleX, ClipboardCheck, Eye, EyeOff, Filter, Flag,
  Keyboard, Play, RotateCcw, SearchCheck, Square, Trash2, Trophy,
} from 'lucide-react'
import { Block, Btn, Callout, Card, DataTable, Goal, Grid, PageHeader, Pill, Takeaway, TONE, cx } from '../components/ui'
import { QUIZ, TOPICS, VERDICTS, verdictFor, type QuizQuestion, type QuizTopic } from '../data/quiz'
import { saveResult, useResults, useStored, type Result, type ResultKey } from '../lib/storage'

/* ------------------------------ Yordamchi ------------------------------ */
type TopicFilter = QuizTopic | 'all'
interface Session {
  phase: 'setup' | 'run' | 'result'
  filter: TopicFilter
  idx: number
  answers: (number | null)[]
}
const EMPTY: Session = { phase: 'setup', filter: 'all', idx: 0, answers: [] }
const LETTERS = 'ABCD'
const TEST_ID = 'test-markazi'

function questionsFor(filter: TopicFilter): QuizQuestion[] {
  return filter === 'all' ? QUIZ : QUIZ.filter(q => q.topic === filter)
}
function percentOf(score: number, max: number) {
  return max > 0 ? Math.round((score / max) * 100) : 0
}
/** Saqlangan holat savollar roʻyxatiga mos kelmasa, test boshidan boshlanadi. */
function sanitize(s: Session): Session {
  if (!s || typeof s !== 'object') return EMPTY
  const filterOk = s.filter === 'all' || TOPICS.some(t => t.topic === s.filter)
  if (!filterOk) return EMPTY
  const fresh: Session = { ...EMPTY, filter: s.filter }
  if (s.phase !== 'run' && s.phase !== 'result') return fresh
  const n = questionsFor(s.filter).length
  if (!Array.isArray(s.answers) || s.answers.length !== n) return fresh
  if (typeof s.idx !== 'number' || s.idx < 0 || s.idx >= n) return fresh
  if (s.phase === 'result' && s.answers.some(a => a === null)) return fresh
  return s
}
function scrollToTest() {
  requestAnimationFrame(() => document.getElementById(TEST_ID)?.scrollIntoView({ block: 'start' }))
}
function formatDate(at: number) {
  const d = new Date(at)
  if (Number.isNaN(d.getTime())) return '—'
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}, ${p(d.getHours())}:${p(d.getMinutes())}`
}

/* ==========================================================================
   Sahifa
   ========================================================================== */
export default function Test() {
  const [stored, setSession] = useStored<Session>('test-session', EMPTY)
  const session = sanitize(stored)
  const questions = questionsFor(session.filter)
  const total = questions.length
  const score = session.answers.reduce<number>((n, a, i) => n + (a !== null && a === questions[i]?.correct ? 1 : 0), 0)

  const start = (filter: TopicFilter) => {
    setSession({ phase: 'run', filter, idx: 0, answers: questionsFor(filter).map(() => null) })
    scrollToTest()
  }
  const pick = (option: number) => {
    if (session.phase !== 'run' || session.answers[session.idx] !== null) return
    setSession({ ...session, answers: session.answers.map((a, i) => (i === session.idx ? option : a)) })
  }
  const next = () => {
    if (session.phase !== 'run' || session.answers[session.idx] === null) return
    if (session.idx < total - 1) {
      setSession({ ...session, idx: session.idx + 1 })
    } else {
      // Faqat toʻliq (filtrsiz) test natijasi «Yakuniy test» sifatida saqlanadi.
      if (session.filter === 'all') {
        saveResult('test', { score, max: total, label: 'Yakuniy test', detail: percentOf(score, total) + '%' })
      }
      setSession({ ...session, phase: 'result' })
    }
    scrollToTest()
  }
  const toSetup = () => {
    setSession({ ...EMPTY, filter: session.filter })
    scrollToTest()
  }

  return (
    <>
      <PageHeader
        no="14"
        tone="green"
        eyebrow="Amaliyot va baholash"
        title="Bilimni baholash va testlar"
        lead={<>Bu savollar taʼrifni soʻramaydi — <strong>vaziyatni tahlil qilishni</strong> talab qiladi. Har bir javobdan keyin izoh chiqadi, yakunda esa qaysi mavzuni takrorlash kerakligi koʻrsatiladi.</>}
      />

      <Goal
        items={[
          '18 ta vaziyatli savol orqali yetti mavzu boʻyicha bilimni tekshirish.',
          'Har bir xatoning sababini izoh orqali tushunish va tegishli boʻlimga qaytish.',
          'Test hamda amaliy ishlar natijalarini bitta jadvalda koʻrish.',
        ]}
      />

      <Block
        id={TEST_ID}
        tone="green"
        title="Test markazi"
        sub="Har bir savolda faqat bitta toʻgʻri javob bor. Xato javob tanlansa ham toʻgʻri javob koʻrsatiladi — maqsad jazolash emas, tushuntirish."
      >
        {session.phase === 'setup' && (
          <Setup filter={session.filter} onFilter={f => setSession({ ...EMPTY, filter: f })} onStart={() => start(session.filter)} />
        )}
        {session.phase === 'run' && (
          <Run
            question={questions[session.idx]}
            index={session.idx}
            total={total}
            score={score}
            answered={session.answers.filter(a => a !== null).length}
            picked={session.answers[session.idx]}
            filter={session.filter}
            onPick={pick}
            onNext={next}
            onStop={toSetup}
          />
        )}
        {session.phase === 'result' && (
          <ResultView
            questions={questions}
            answers={session.answers}
            score={score}
            filter={session.filter}
            onRestart={() => start(session.filter)}
            onSetup={toSetup}
          />
        )}
      </Block>

      <ActivityResults onGoTest={scrollToTest} />

      <Block
        tone="green"
        title="Baholash: ikki turi"
        sub="Platformada ikkala tur ham ishlatiladi: biri oʻrganish jarayonini yoʻnaltiradi, ikkinchisi natijani oʻlchaydi."
      >
        <Grid cols={2}>
          <Card tone="teal" icon={SearchCheck} title="Formativ baholash" tag={<Pill tone="teal">dars davomida</Pill>}>
            <p>Savol-javob, kuzatish, kichik topshiriq. Maqsad — <strong>yoʻnaltirish</strong>: oʻquvchi xatosini shu zahoti koʻradi va tuzatadi.</p>
            <p><strong>Platformada:</strong> har bir boʻlim oxiridagi interaktiv topshiriq, laboratoriyadagi darhol chiqadigan izohlar, test savolidan keyingi tushuntirish.</p>
          </Card>
          <Card tone="violet" icon={Flag} title="Summativ baholash" tag={<Pill tone="violet">dars oxirida</Pill>}>
            <p>Test, loyiha himoyasi. Maqsad — <strong>natijani oʻlchash</strong>: mavzu qay darajada oʻzlashtirilganini aniqlash.</p>
            <p><strong>Platformada:</strong> yakuniy test bali, amaliy topshiriqning mezonlar boʻyicha bali va yuqoridagi natijalar jadvali.</p>
          </Card>
        </Grid>
        <Callout kind="warn" title="Eng koʻp uchraydigan metodik xato" className="mt-4">
          Faqat summativ baholash bilan cheklanish. Oʻquvchi xato qilib, uni tuzatish imkonini olmasa, baho oʻrganishga yordam bermaydi. Shuning uchun bu testda har bir javobdan keyin izoh beriladi va testni istalgancha qayta ishlash mumkin.
        </Callout>
      </Block>

      <Takeaway
        items={[
          <>Yaxshi test savoli taʼrifni emas, <strong>vaziyatni tahlil qilishni</strong> soʻraydi.</>,
          <>Izohsiz baho — shunchaki raqam; <strong>izoh bilan</strong> berilgan baho oʻrganish vositasiga aylanadi.</>,
          <>Formativ baholash yoʻnaltiradi, summativ baholash oʻlchaydi — darsda ikkalasi ham kerak.</>,
        ]}
      />
    </>
  )
}

/* ==========================================================================
   1-bosqich: mavzuni tanlash
   ========================================================================== */
function Setup({ filter, onFilter, onStart }: { filter: TopicFilter; onFilter: (f: TopicFilter) => void; onStart: () => void }) {
  const count = questionsFor(filter).length
  const chips: { value: TopicFilter; label: string; n: number }[] = [
    { value: 'all', label: 'Hammasi', n: QUIZ.length },
    ...TOPICS.map(t => ({ value: t.topic as TopicFilter, label: t.topic as string, n: QUIZ.filter(q => q.topic === t.topic).length })),
  ]
  return (
    <div className="anim-in rounded-2xl border border-emerald-200 bg-white p-5 shadow-card sm:p-7">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Filter size={22} /></span>
        <div>
          <h3 className="text-lg font-bold">Mavzuni tanlang</h3>
          <p className="text-[0.95rem] text-slate-600">Toʻliq test — «Hammasi». Bitta mavzuni tanlasangiz, faqat shu mavzu savollari chiqadi.</p>
        </div>
      </div>

      <div role="group" aria-label="Mavzu boʻyicha filtr" className="mt-5 flex flex-wrap gap-2.5">
        {chips.map(c => {
          const on = filter === c.value
          return (
            <button key={c.value} type="button" aria-pressed={on} onClick={() => onFilter(c.value)}
              className={cx('inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[0.95rem] font-semibold transition',
                on ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm' : 'border-slate-300 bg-white text-navy-950 hover:border-emerald-500 hover:bg-emerald-50')}>
              {c.label}
              <span className={cx('rounded-full px-2 py-0.5 font-mono text-xs font-bold', on ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600')}>{c.n}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-slate-100 pt-5">
        <p className="mr-auto text-[0.97rem] text-slate-600" role="status" aria-live="polite">
          Tanlandi: <strong className="text-navy-950">{filter === 'all' ? 'barcha mavzular' : '«' + filter + '»'}</strong> — <strong className="text-navy-950">{count} ta savol</strong>.{' '}
          {filter === 'all'
            ? 'Natija «Yakuniy test» sifatida saqlanadi.'
            : 'Bu mashq rejimi: natija yakuniy baho sifatida saqlanmaydi.'}
        </p>
        <Btn variant="primary" size="lg" icon={Play} onClick={onStart}>Testni boshlash</Btn>
      </div>

      <div className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {VERDICTS.map(v => (
          <div key={v.key} className={cx('rounded-xl border px-3.5 py-3', TONE[v.tone].border, TONE[v.tone].soft)}>
            <div className={cx('font-mono text-sm font-bold', TONE[v.tone].text)}>{v.range}</div>
            <div className="mt-0.5 text-[0.92rem] font-semibold text-navy-950">{v.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ==========================================================================
   2-bosqich: savollar (bittadan)
   ========================================================================== */
function Run({ question, index, total, score, answered, picked, filter, onPick, onNext, onStop }: {
  question: QuizQuestion; index: number; total: number; score: number; answered: number; picked: number | null
  filter: TopicFilter; onPick: (i: number) => void; onNext: () => void; onStop: () => void
}) {
  const nextRef = useRef<HTMLButtonElement>(null)
  const focusNext = useRef(false)
  const isLast = index === total - 1
  const done = picked !== null
  const right = done && picked === question.correct

  const choose = (i: number) => {
    if (done) return
    focusNext.current = true
    onPick(i)
  }

  /* Javob tanlangach, fokus «Keyingi savol» tugmasiga oʻtadi — Enter bilan davom etish mumkin. */
  useEffect(() => {
    if (done && focusNext.current) {
      focusNext.current = false
      nextRef.current?.focus({ preventScroll: true })
    }
  }, [done, index])

  /* Klaviatura: 1–4 yoki A–D — javob tanlash. */
  useEffect(() => {
    if (done) return
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return
      const t = e.target as HTMLElement | null
      if (t && t.closest('input, textarea, select, [contenteditable="true"]')) return
      const k = e.key.toLowerCase()
      if (k.length !== 1) return
      const i = '1234'.includes(k) ? '1234'.indexOf(k) : 'abcd'.indexOf(k)
      if (i < 0) return
      e.preventDefault()
      focusNext.current = true
      onPick(i)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [done, onPick])

  return (
    <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-card sm:p-7">
      {/* Holat qatori */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="font-mono text-base font-bold text-navy-950" role="status" aria-live="polite">Savol {index + 1} / {total}</span>
        <Pill tone="green">{question.topic}</Pill>
        {filter !== 'all' && <Pill tone="slate">mashq rejimi</Pill>}
        <span className="ml-auto rounded-full bg-emerald-100 px-3 py-1 font-mono text-sm font-bold text-emerald-800" role="status" aria-live="polite">
          Toʻgʻri: {score} / {answered}
        </span>
      </div>
      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label="Test jarayoni" aria-valuemin={0} aria-valuemax={total} aria-valuenow={answered}>
        <div className="h-full rounded-full bg-emerald-500 transition-all duration-300" style={{ width: (answered / total) * 100 + '%' }} />
      </div>

      {/* Savol */}
      <div key={question.id} className="anim-in mt-6">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">{question.focus}</p>
        <h3 className="mt-2 text-xl font-bold leading-snug sm:text-[1.45rem]">{question.q}</h3>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {question.options.map((o, oi) => {
            const isCorrect = oi === question.correct
            const state = !done ? 'idle' : isCorrect ? 'correct' : picked === oi ? 'wrong' : 'dim'
            return (
              <button key={oi} type="button" disabled={done} onClick={() => choose(oi)}
                aria-label={`${LETTERS[oi]} varianti: ${o}${state === 'correct' ? ' — toʻgʻri javob' : state === 'wrong' ? ' — notoʻgʻri' : ''}`}
                className={cx('flex min-h-[4rem] items-start gap-3.5 rounded-2xl border-2 px-4 py-4 text-left text-base leading-snug transition sm:text-[1.05rem]',
                  state === 'idle' && 'border-slate-200 bg-white text-navy-950 hover:border-emerald-500 hover:bg-emerald-50 active:translate-y-px',
                  state === 'correct' && 'border-emerald-500 bg-emerald-50 text-emerald-950',
                  state === 'wrong' && 'border-rose-500 bg-rose-50 text-rose-950',
                  state === 'dim' && 'border-slate-200 bg-slate-50 text-slate-400')}>
                <span className={cx('grid h-8 w-8 flex-none place-items-center rounded-lg font-mono text-sm font-bold',
                  state === 'correct' ? 'bg-emerald-600 text-white' : state === 'wrong' ? 'bg-rose-600 text-white' : state === 'dim' ? 'bg-slate-300 text-white' : 'bg-navy-950 text-white')}>
                  {LETTERS[oi]}
                </span>
                <span className="min-w-0 flex-1 pt-0.5">{o}</span>
                {state === 'correct' && <CircleCheck size={22} className="mt-0.5 flex-none text-emerald-600" aria-hidden="true" />}
                {state === 'wrong' && <CircleX size={22} className="mt-0.5 flex-none text-rose-600" aria-hidden="true" />}
              </button>
            )
          })}
        </div>

        {done && (
          <div role="status" aria-live="polite"
            className={cx('anim-in mt-5 rounded-2xl border-l-4 px-4 py-4 text-[0.98rem] leading-relaxed sm:px-5',
              right ? 'border-emerald-500 bg-emerald-50 text-emerald-950' : 'border-amber-500 bg-amber-50 text-amber-950')}>
            <p className="font-bold">
              {right ? 'Toʻgʻri javob.' : `Notoʻgʻri. Toʻgʻri javob — ${LETTERS[question.correct]}: ${question.options[question.correct]}.`}
            </p>
            <p className="mt-1.5">{question.explain}</p>
          </div>
        )}
      </div>

      {/* Boshqaruv */}
      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
        <Btn variant="ghost" icon={Square} onClick={onStop}>Testni toʻxtatish</Btn>
        <span className="hidden items-center gap-1.5 text-sm text-slate-500 lg:inline-flex"><Keyboard size={16} />1–4 yoki A–D — javob, Enter — davom etish</span>
        <button ref={nextRef} type="button" disabled={!done} onClick={onNext}
          className="ml-auto inline-flex select-none items-center justify-center gap-2.5 rounded-2xl bg-teal-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-teal-700 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45">
          {isLast ? 'Natijani koʻrish' : 'Keyingi savol'}
          <ArrowRight size={20} />
        </button>
      </div>
      {!done && <p className="mt-3 text-right text-sm text-slate-500">Davom etish uchun avval javob variantini tanlang.</p>}
    </div>
  )
}

/* ==========================================================================
   3-bosqich: natija
   ========================================================================== */
function ResultView({ questions, answers, score, filter, onRestart, onSetup }: {
  questions: QuizQuestion[]; answers: (number | null)[]; score: number; filter: TopicFilter; onRestart: () => void; onSetup: () => void
}) {
  const [review, setReview] = useState(false)
  const total = questions.length
  const percent = percentOf(score, total)
  const verdict = verdictFor(percent)
  const tone = TONE[verdict.tone]
  const wrong = questions.map((q, i) => ({ q, a: answers[i] })).filter(x => x.a !== x.q.correct)
  const byTopic = TOPICS.map(t => {
    const idx = questions.map((q, i) => (q.topic === t.topic ? i : -1)).filter(i => i >= 0)
    const ok = idx.filter(i => answers[i] === questions[i].correct).length
    return { ...t, total: idx.length, ok }
  }).filter(t => t.total > 0)
  const weak = byTopic.filter(t => t.ok < t.total)
  const R = 52
  const C = 2 * Math.PI * R

  return (
    <div className="anim-in space-y-5">
      {/* Umumiy natija */}
      <div className={cx('rounded-2xl border bg-white p-5 shadow-card sm:p-7', tone.border)}>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
          <div className="relative h-36 w-36 flex-none">
            <svg viewBox="0 0 120 120" className={cx('h-full w-full -rotate-90', tone.text)} aria-hidden="true">
              <circle cx="60" cy="60" r={R} fill="none" strokeWidth="10" className="stroke-slate-100" />
              <circle cx="60" cy="60" r={R} fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(C * percent) / 100} ${C}`} />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <div className="font-display text-3xl font-extrabold text-navy-950">{percent}%</div>
                <div className="font-mono text-sm font-bold text-slate-500">{score} / {total}</div>
              </div>
            </div>
          </div>
          <div className="min-w-0 flex-1 text-center sm:text-left" role="status" aria-live="polite">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <Pill tone={verdict.tone}><Trophy size={14} />{verdict.label}</Pill>
              <Pill tone="slate">{filter === 'all' ? 'Yakuniy test' : 'Mashq: ' + filter}</Pill>
            </div>
            <h3 className="mt-3 text-2xl font-extrabold sm:text-[1.7rem]">Natija: {score} / {total} — {percent}%</h3>
            <p className="mt-1.5 text-[1.02rem] leading-relaxed text-slate-600">{verdict.text}</p>
            <p className="mt-1.5 text-sm text-slate-500">
              {filter === 'all'
                ? 'Natija «Yakuniy test» sifatida saqlandi va quyidagi jadvalda koʻrinadi.'
                : 'Bu mashq rejimi edi — yakuniy baho uchun testni «Hammasi» rejimida ishlang.'}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
          <Btn variant="primary" size="lg" icon={RotateCcw} onClick={onRestart}>Testni qayta ishlash</Btn>
          {wrong.length > 0 && (
            <Btn size="lg" icon={review ? EyeOff : Eye} aria-expanded={review} onClick={() => setReview(r => !r)}>
              {review ? 'Xatolarni yashirish' : `Xatolarni koʻrib chiqish (${wrong.length})`}
            </Btn>
          )}
          <Btn variant="ghost" size="lg" icon={Filter} onClick={onSetup}>Mavzuni oʻzgartirish</Btn>
        </div>
      </div>

      {/* Xatolar tahlili */}
      {review && wrong.length > 0 && (
        <div className="anim-in rounded-2xl border border-rose-200 bg-white p-5 shadow-card sm:p-7">
          <h3 className="flex items-center gap-2 text-lg font-bold"><CircleX size={20} className="text-rose-600" />Xatolar tahlili</h3>
          <ol className="mt-4 space-y-5">
            {wrong.map(({ q, a }) => (
              <li key={q.id} className="border-t border-slate-100 pt-4 first:border-t-0 first:pt-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-bold text-slate-500">Savol {questions.indexOf(q) + 1}</span>
                  <Pill tone="slate">{q.topic}</Pill>
                </div>
                <p className="mt-2 font-display text-[1.05rem] font-bold leading-snug text-navy-950">{q.q}</p>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  <p className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-[0.95rem] text-rose-950">
                    <span className="block text-xs font-bold uppercase tracking-wider text-rose-700">Sizning javobingiz</span>
                    {a === null ? '—' : <><strong>{LETTERS[a]}.</strong> {q.options[a]}</>}
                  </p>
                  <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-[0.95rem] text-emerald-950">
                    <span className="block text-xs font-bold uppercase tracking-wider text-emerald-700">Toʻgʻri javob</span>
                    <strong>{LETTERS[q.correct]}.</strong> {q.options[q.correct]}
                  </p>
                </div>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-slate-600"><strong className="text-navy-950">Izoh. </strong>{q.explain}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Mavzular kesimida */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
          <h3 className="flex items-center gap-2 text-lg font-bold"><ChartColumn size={20} className="text-emerald-600" />Mavzular kesimida</h3>
          <ul className="mt-4 space-y-3.5">
            {byTopic.map(t => {
              const p = percentOf(t.ok, t.total)
              const bar = t.ok === t.total ? 'bg-emerald-500' : t.ok === 0 ? 'bg-rose-500' : 'bg-amber-500'
              return (
                <li key={t.topic}>
                  <div className="flex items-baseline justify-between gap-3 text-[0.95rem]">
                    <span className="font-semibold text-navy-950">{t.topic}</span>
                    <span className="font-mono text-sm font-bold text-slate-600">{t.ok} / {t.total}</span>
                  </div>
                  <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-100" role="img" aria-label={`${t.topic}: ${t.total} tadan ${t.ok} tasi toʻgʻri`}>
                    <div className={cx('h-full rounded-full', bar)} style={{ width: Math.max(p, 4) + '%' }} />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Tavsiyalar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
          <h3 className="flex items-center gap-2 text-lg font-bold"><BookOpen size={20} className="text-emerald-600" />Tavsiyalar</h3>
          {weak.length === 0 ? (
            <p className="mt-4 flex gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[0.97rem] text-emerald-950">
              <CircleCheck size={20} className="mt-0.5 flex-none text-emerald-600" />
              <span>Barcha savollarga toʻgʻri javob berildi. Bilimni amalda sinash uchun <Link to="/laboratoriya" className="font-semibold underline underline-offset-2">tarmoq konstruktoriga</Link> oʻting.</span>
            </p>
          ) : (
            <>
              <p className="mt-2 text-[0.95rem] text-slate-600">Xato qilingan mavzular boʻyicha quyidagi boʻlimlarni takrorlang:</p>
              <ul className="mt-3 space-y-2.5">
                {weak.map(t => (
                  <li key={t.topic}>
                    <Link to={t.route} className="group flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 transition hover:border-emerald-500 hover:bg-emerald-50">
                      <span className="grid h-9 min-w-9 flex-none place-items-center rounded-lg bg-amber-100 px-2 font-mono text-sm font-bold text-amber-900">−{t.total - t.ok}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-navy-950">{t.section}</span>
                        <span className="block text-sm text-slate-500">«{t.topic}» mavzusida {t.total - t.ok} ta xato</span>
                      </span>
                      <ArrowRight size={18} className="flex-none text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-emerald-600" />
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ==========================================================================
   Amaliy ishlar natijalari
   ========================================================================== */
const ACTIVITIES: { key: ResultKey; label: string; to: string; kind: string }[] = [
  { key: 'lab', label: 'Tarmoq konstruktori', to: '/laboratoriya', kind: 'Laboratoriya' },
  { key: 'firewall', label: 'Firewall laboratoriyasi', to: '/laboratoriya/firewall', kind: 'Laboratoriya' },
  { key: 'muammoli', label: 'Muammoli taʼlim', to: '/metodika/muammoli', kind: 'Metod' },
  { key: 'snowball', label: 'Snowball', to: '/metodika/snowball', kind: 'Metod' },
  { key: 'jurnal', label: 'Double-Entry Journal', to: '/metodika/jurnal', kind: 'Metod' },
  { key: 'namoyish', label: 'Namoyish', to: '/metodika/namoyish', kind: 'Metod' },
  { key: 'amaliy', label: 'Amaliy topshiriq (10 kompyuter + printer)', to: '/metodika/amaliy', kind: 'Metod' },
  { key: 'test', label: 'Yakuniy test', to: '/test', kind: 'Test' },
]

function validResult(r: Result | undefined): r is Result {
  return !!r && typeof r.score === 'number' && typeof r.max === 'number' && r.max > 0
}

function ActivityResults({ onGoTest }: { onGoTest: () => void }) {
  const [stored, , resetResults] = useResults()
  const results = stored && typeof stored === 'object' ? stored : {}
  const [confirm, setConfirm] = useState(false)
  const rows = ACTIVITIES.map(a => {
    const r = results[a.key]
    return { ...a, result: validResult(r) ? r : null }
  })
  const done = rows.filter(r => r.result)
  const overall = done.length ? Math.round(done.reduce((s, r) => s + (r.result!.score / r.result!.max) * 100, 0) / done.length) : 0
  const verdict = verdictFor(overall)

  return (
    <Block
      tone="green"
      title="Amaliy ishlar natijalari"
      sub="Laboratoriya, metodlar va test natijalari shu brauzerda saqlanadi. Har bir ishni qayta bajarsangiz, jadvaldagi natija yangilanadi."
    >
      <div className="mb-4 grid gap-3 sm:grid-cols-3" role="status" aria-live="polite">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Bajarilgan ishlar</div>
          <div className="mt-1 font-display text-3xl font-extrabold text-navy-950">{done.length} <span className="text-lg font-bold text-slate-400">/ {ACTIVITIES.length}</span></div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Umumiy natija</div>
          <div className="mt-1 font-display text-3xl font-extrabold text-navy-950">{done.length ? overall + '%' : '—'}</div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: overall + '%' }} /></div>
        </div>
        <div className={cx('rounded-2xl border p-4 shadow-card', done.length ? cx(TONE[verdict.tone].border, TONE[verdict.tone].soft) : 'border-slate-200 bg-white')}>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Daraja</div>
          <div className={cx('mt-1 font-display text-xl font-extrabold leading-tight', done.length ? TONE[verdict.tone].text : 'text-slate-400')}>
            {done.length ? verdict.label : 'Hali baholanmagan'}
          </div>
          <div className="mt-1 text-sm text-slate-500">Bajarilgan ishlar foizlarining oʻrtachasi</div>
        </div>
      </div>

      <DataTable
        head={['Faoliyat', 'Natija', 'Foiz', 'Oxirgi urinish', 'Havola']}
        rows={rows.map(r => {
          const p = r.result ? percentOf(r.result.score, r.result.max) : 0
          return [
            <div key="a">
              <div className="font-semibold text-navy-950">{r.label}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">{r.kind}</div>
            </div>,
            r.result
              ? <div key="b"><strong className="font-mono text-navy-950">{r.result.score} / {r.result.max}</strong>{r.result.detail && <div className="text-xs text-slate-500">{r.result.detail}</div>}</div>
              : <Pill key="b" tone="slate">hali bajarilmagan</Pill>,
            r.result
              ? (
                <div key="c" className="flex min-w-[7rem] items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100"><div className={cx('h-full rounded-full', TONE[verdictFor(p).tone].bar)} style={{ width: p + '%' }} /></div>
                  <span className="w-10 text-right font-mono text-sm font-bold text-slate-700">{p}%</span>
                </div>
              )
              : <span key="c" className="text-slate-400">—</span>,
            <span key="d" className="whitespace-nowrap font-mono text-sm text-slate-500">{r.result ? formatDate(r.result.at) : '—'}</span>,
            r.key === 'test'
              ? <button key="e" type="button" onClick={onGoTest} className="inline-flex items-center gap-1 whitespace-nowrap font-semibold text-blue-700 underline decoration-blue-300 underline-offset-2 hover:decoration-blue-600">Testga oʻtish <ArrowRight size={15} /></button>
              : <Link key="e" to={r.to} className="inline-flex items-center gap-1 whitespace-nowrap font-semibold text-blue-700 underline decoration-blue-300 underline-offset-2 hover:decoration-blue-600">{r.result ? 'Qayta bajarish' : 'Bajarish'} <ArrowRight size={15} /></Link>,
          ]
        })}
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <p className="mr-auto flex items-center gap-2 text-sm text-slate-500"><ClipboardCheck size={16} />Natijalar faqat shu qurilmada saqlanadi va serverga yuborilmaydi.</p>
        {done.length > 0 && !confirm && <Btn size="sm" variant="ghost" icon={Trash2} onClick={() => setConfirm(true)}>Natijalarni tozalash</Btn>}
        {confirm && (
          <span className="flex flex-wrap items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900" role="alert">
            Barcha natijalar oʻchirilsinmi?
            <Btn size="sm" variant="danger" onClick={() => { resetResults(); setConfirm(false) }}>Ha, oʻchirish</Btn>
            <Btn size="sm" variant="ghost" onClick={() => setConfirm(false)}>Bekor qilish</Btn>
          </span>
        )}
      </div>
    </Block>
  )
}
