import { useId, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, ClipboardCheck, Eraser, Eye, EyeOff, FlaskConical, PencilRuler, Save, ScanSearch, ShieldCheck, User, Users, Wrench,
  type LucideIcon,
} from 'lucide-react'
import { Block, Btn, Callout, Card, CheckList, Goal, Grid, LifeExample, Mono, PageHeader, Pill, Takeaway, TONE, cx, type Tone } from '../components/ui'
import { useResults, useStored } from '../lib/storage'

/* ------------------------------ Topshiriqlar ------------------------------ */
type TaskId = 'a' | 'b' | 'c'

interface Task {
  id: TaskId
  level: string
  tone: Tone
  icon: LucideIcon
  title: string
  situation: ReactNode
  todo: ReactNode[]
  assessed: ReactNode
  placeholder: string
  criterion: ReactNode
  /** Oʻz-oʻzini baholash mezonlari — har bir topshiriqda toʻrtta */
  rubric: [string, string, string, string]
}

const LINK = 'font-semibold text-blue-700 underline decoration-blue-300 underline-offset-2 hover:decoration-blue-600'

function MiniTable({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="mt-2 overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[26rem] border-collapse text-left text-[0.9rem]">
        <thead>
          <tr className="bg-slate-100 text-slate-700">{head.map(h => <th key={h} scope="col" className="px-3 py-2 text-xs font-bold uppercase tracking-wider">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-slate-100 align-top">{r.map((c, j) => <td key={j} className="px-3 py-2 text-slate-700">{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const TASKS: Task[] = [
  {
    id: 'a',
    level: 'Boshlangʻich',
    tone: 'green',
    icon: ScanSearch,
    title: 'Sxemani oʻqish',
    situation: <>Sinfda 6 ta kompyuter va 1 ta printer bor. Hammasi bitta switchga ulangan.</>,
    todo: [
      <>Sxemani qogʻozga chizing yoki <Link to="/laboratoriya" className={LINK}>tarmoq konstruktorida</Link> yigʻing.</>,
      'Har bir qurilmaning vazifasini yozing.',
      'Bitta kabel uzilsa, kim ishlamaydi?',
    ],
    assessed: 'toʻgʻri chizma va nosozlik haqidagi javob.',
    placeholder: 'Qurilmalar vazifasi va kabel uzilganda nima boʻlishini yozing…',
    criterion: (
      <>
        <p><strong>Javob mezoni.</strong> Markaziy switch yoki uning quvvat manbai ishdan chiqsa, barcha qurilmalar aloqasiz qoladi; bitta chekka kabel uzilsa, faqat shu kabelga ulangan qurilma taʼsirlanadi.</p>
        <CheckList kind="dot" items={[
          <><strong>Sxema:</strong> yulduz topologiyasi — markazda switch, undan 7 ta alohida kabel chiqadi (6 ta kompyuter va 1 ta printer). Switchda kamida 8 ta port boʻlishi kerak.</>,
          <><strong>Vazifalar:</strong> switch maʼlumotni MAC-manzil boʻyicha faqat kerakli portga uzatadi; kompyuter — foydalanuvchining ish joyi; printer — hamma foydalanadigan umumiy resurs.</>,
          <><strong>Nozik jihat:</strong> printer kabeli uzilsa, kompyuterlar oʻzaro ishlayveradi, lekin hech kim chop eta olmaydi.</>,
        ]} />
      </>
    ),
    rubric: [
      'Sxemada switch markazda, 6 ta kompyuter va printer unga alohida kabel bilan ulangan (yulduz topologiyasi).',
      'Har bir qurilmaning vazifasi yozilgan: switch, kompyuter, printer.',
      'Bitta chekka kabel uzilsa, faqat oʻsha qurilma aloqasiz qolishi koʻrsatilgan.',
      'Markaziy switch ishdan chiqsa, butun tarmoq toʻxtashi aytilgan.',
    ],
  },
  {
    id: 'b',
    level: 'Oʻrta',
    tone: 'amber',
    icon: PencilRuler,
    title: 'Tarmoqni loyihalash',
    situation: <>Maktabda 20 ta kompyuter (oʻquv xonasi), 3 ta oʻqituvchi kompyuteri (maʼmuriyat xonasi) va Wi-Fi hududi kerak.</>,
    todo: [
      'Qanday qurilmalar kerak va nechta?',
      'Ular qayerga joylashadi?',
      'IP-reja jadvalini tuzing.',
      'Nega shu qurilmalarni tanladingiz?',
    ],
    assessed: <>loyihalashning <Link to="/loyihalash" className={LINK}>7 bosqichiga</Link> rioya qilingani.</>,
    placeholder: 'Qurilmalar roʻyxati, joylashuvi, IP-reja va tanlov sababini yozing…',
    criterion: (
      <>
        <p><strong>Javob mezoni.</strong> Chegarada modem/ONT, firewall yoki u bilan birlashgan router, segmentlarni (VLAN) boshqaradigan switch, access pointlar va izchil IP-reja tanlanadi; har bir tanlov sababi bilan asoslanadi.</p>
        <p className="mt-3"><strong>Namunaviy yechim</strong> (yagona toʻgʻri javob emas):</p>
        <CheckList kind="dot" items={[
          <><strong>Qurilmalar:</strong> 1 ta modem/ONT, 1 ta router (firewall bilan), oʻquv xonasida 24 portli boshqariladigan switch, maʼmuriyat xonasida 8 portli switch, Wi-Fi hududida 1–2 ta access point.</>,
          <><strong>Joylashuv:</strong> modem, router va asosiy switch — qulflanadigan shkafda; access point — shiftda, hudud markazida.</>,
          <><strong>Asos:</strong> bitta xona ichida switch yetarli; segmentlar orasida va internetga chiqishda router kerak; Wi-Fi alohida segmentda boʻlgani uchun mehmon qurilmasi oʻquv tarmogʻiga aralashmaydi.</>,
        ]} />
        <MiniTable
          head={['Segment', 'VLAN', 'Tarmoq', 'Manzillar']}
          rows={[
            ['Oʻquv xonasi', '10', <Mono key="m">192.168.10.0/24</Mono>, 'shlyuz .1 · printer .10 (statik) · DHCP .100–.200'],
            ['Maʼmuriyat', '20', <Mono key="m">192.168.20.0/24</Mono>, 'shlyuz .1 · DHCP .100–.150'],
            ['Wi-Fi hududi', '30', <Mono key="m">192.168.30.0/24</Mono>, 'shlyuz .1 · DHCP .50–.250'],
          ]}
        />
      </>
    ),
    rubric: [
      'Qurilmalar roʻyxati toʻliq va soni koʻrsatilgan: modem/ONT, router (firewall), switch, access point.',
      'Har bir qurilmaning joyi koʻrsatilgan; switch portlari barcha kompyuterlarga yetadi va zaxira port qoladi.',
      'IP-reja jadvali tuzilgan: har bir segment uchun tarmoq manzili, shlyuz, DHCP diapazoni va statik manzillar.',
      'Har bir tanlov sababi bilan asoslangan — «nega switch, nega router emas?» savoliga javob bor.',
    ],
  },
  {
    id: 'c',
    level: 'Yuqori',
    tone: 'rose',
    icon: ShieldCheck,
    title: 'Xavfsizlikni taʼminlash',
    situation: <>Oʻsha maktab tarmogʻi. Talab: oʻquvchilar fayl serveriga ulana olsin, lekin maʼmuriyat kompyuterlariga <em>hech qanday</em> yoʻl bilan kira olmasin. Mehmonlar uchun Wi-Fi ham kerak.</>,
    todo: [
      'VLAN rejasini tuzing.',
      'Firewall qoidalarini yozing (ruxsat / blok).',
      'Mehmonlar uchun Wi-Fi tarmogʻini qanday izolyatsiya qilasiz?',
      'Zaiflik qolgan joyni koʻrsating va tushuntiring.',
    ],
    assessed: <>yechimning asoslangani va <em>qolgan xavfning</em> tan olingani.</>,
    placeholder: 'VLAN rejasi, firewall qoidalari va qolgan zaif joyni yozing…',
    criterion: (
      <>
        <p><strong>Javob mezoni.</strong> Oʻquvchilar segmentidan (VLAN 10) serverlar segmentidagi (VLAN 40) faqat kerakli xizmatlarga ruxsat beriladi, maʼmuriyat segmentiga (VLAN 20) kirish bloklanadi, mehmonlar Wi-Fi tarmogʻi alohida segmentda (VLAN 30) izolyatsiya qilinadi va roʻyxat oxirida standart taqiq (default deny) saqlanadi.</p>
        <p className="mt-3"><strong>Namunaviy qoidalar</strong> — yuqoridan pastga oʻqiladi, birinchi mos kelgani ishlaydi:</p>
        <MiniTable
          head={['№', 'Qayerdan', 'Qayerga', 'Xizmat', 'Qaror']}
          rows={[
            ['1', 'VLAN 10', 'fayl serveri (VLAN 40)', 'TCP 445', <strong key="d" className="text-emerald-700">ruxsat</strong>],
            ['2', 'VLAN 10', 'VLAN 20', 'istalgan', <strong key="d" className="text-rose-700">blok</strong>],
            ['3', 'VLAN 30', 'ichki segmentlar (10, 20, 40)', 'istalgan', <strong key="d" className="text-rose-700">blok</strong>],
            ['4', 'VLAN 30', 'internet', 'veb va DNS', <strong key="d" className="text-emerald-700">ruxsat</strong>],
            ['5', 'istalgan', 'istalgan', 'istalgan', <strong key="d" className="text-rose-700">blok (default deny)</strong>],
          ]}
        />
        <p className="mt-3"><strong>Qolgan xavf</strong> (misollar): fayl serveriga ikkala segment ham ulanadi — server zararlansa, u segmentlar orasidagi «koʻprik»ka aylanishi mumkin; oʻqituvchining paroli oshkor boʻlsa yoki oʻquvchi maʼmuriyat kompyuteriga jismonan oʻtirsa, firewall yordam bermaydi; zararlangan fleshka segmentatsiyani chetlab oʻtadi.</p>
      </>
    ),
    rubric: [
      'VLAN rejasi tuzilgan: oʻquvchilar, maʼmuriyat, mehmonlar va serverlar alohida segmentlarda.',
      'Firewall qoidalari aniq yozilgan: oʻquvchilar → fayl serveri (faqat kerakli xizmat) — ruxsat; oʻquvchilar → maʼmuriyat — blok.',
      'Mehmonlar Wi-Fi tarmogʻi alohida segmentda, ichki tarmoqlarga yoʻl yopiq; roʻyxat oxirida standart taqiq (default deny) bor.',
      'Kamida bitta qolgan zaiflik koʻrsatilgan va nima uchun xavfli ekani tushuntirilgan.',
    ],
  },
]

/* ------------------------------ Holat ------------------------------ */
const NO_CHECKS = [false, false, false, false]

function useTask(id: TaskId) {
  const [rawText, setText, resetText] = useStored<string>('amaliyot-' + id, '')
  const [rawChecks, setChecks, resetChecks] = useStored<boolean[]>('amaliyot-' + id + '-mezon', NO_CHECKS)
  const text = typeof rawText === 'string' ? rawText : ''
  const checks = Array.isArray(rawChecks) && rawChecks.length === 4 ? rawChecks.map(Boolean) : NO_CHECKS
  return {
    text,
    checks,
    score: checks.filter(Boolean).length,
    setText: (v: string) => setText(v),
    toggle: (i: number) => setChecks(checks.map((c, k) => (k === i ? !c : c))),
    reset: () => { resetText(); resetChecks() },
  }
}
type TaskState = ReturnType<typeof useTask>

function wordCount(s: string) {
  return s.trim().split(/\s+/).filter(Boolean).length
}
function feedback(score: number, hasText: boolean): { text: string; cls: string } {
  if (score === 4) return { text: 'Aʼlo: javob barcha mezonlarga mos. Endi yechimni laboratoriyada sinab koʻring.', cls: 'border-emerald-200 bg-emerald-50 text-emerald-900' }
  if (score === 3) return { text: 'Yaxshi: bitta mezon yetishmayapti — belgilanmagan bandni javobingizga qoʻshing.', cls: 'border-blue-200 bg-blue-50 text-blue-900' }
  if (score >= 1) return { text: 'Javobni toʻldirish kerak: belgilanmagan mezonlarga qayting va javobni kengaytiring.', cls: 'border-amber-200 bg-amber-50 text-amber-900' }
  if (!hasText) return { text: 'Avval javobingizni yozing, soʻng uni mezon bilan solishtirib, bajarilgan bandlarni belgilang.', cls: 'border-slate-200 bg-slate-50 text-slate-600' }
  return { text: 'Javobingizni mezonlar bilan solishtiring va unda bor bandlarni belgilang.', cls: 'border-slate-200 bg-slate-50 text-slate-600' }
}

/* ------------------------------ Topshiriq kartasi ------------------------------ */
function TaskCard({ task, state }: { task: Task; state: TaskState }) {
  const [shown, setShown] = useState(false)
  const uid = useId()
  const t = TONE[task.tone]
  const hasText = state.text.trim().length > 0
  const fb = feedback(state.score, hasText)
  const Icon = task.icon

  return (
    <article className={cx('relative overflow-hidden rounded-2xl border bg-white shadow-card', t.border)}>
      <span className={cx('absolute inset-x-0 top-0 h-1', t.bar)} />

      <div className="grid lg:grid-cols-2">
        {/* Shart */}
        <div className="min-w-0 p-5 sm:p-6 lg:border-r lg:border-slate-100">
          <div className="flex items-center gap-3.5">
            <span className={cx('grid h-12 w-12 flex-none place-items-center rounded-2xl font-display text-2xl font-extrabold', t.solid)}>{task.id.toUpperCase()}</span>
            <div className="min-w-0">
              <Pill tone={task.tone}><Icon size={14} />{task.level} daraja</Pill>
              <h3 className="mt-1 text-xl font-extrabold leading-tight">{task.id.toUpperCase()} — {task.title}</h3>
            </div>
          </div>

          <p className="mt-5 text-[0.98rem] leading-relaxed text-slate-700"><strong className="text-navy-950">Vaziyat: </strong>{task.situation}</p>

          <p className="mt-4 font-semibold text-navy-950">Topshiriq:</p>
          <ol className="mt-2 space-y-2 text-[0.98rem] leading-relaxed text-slate-700">
            {task.todo.map((s, i) => (
              <li key={i} className="flex gap-2.5">
                <span className={cx('mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-md font-mono text-xs font-bold', t.chip)}>{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>

          <p className="mt-4 rounded-xl bg-slate-50 px-3.5 py-2.5 text-[0.93rem] leading-relaxed text-slate-600"><strong className="text-navy-950">Baholanadi: </strong>{task.assessed}</p>
        </div>

        {/* Javob */}
        <div className="min-w-0 border-t border-slate-100 bg-slate-50/60 p-5 sm:p-6 lg:border-t-0">
          <label className="label" htmlFor={uid + 'answer'}>Javobingiz</label>
          <textarea id={uid + 'answer'} className="field min-h-[11rem] resize-y leading-relaxed" rows={7} value={state.text}
            placeholder={task.placeholder} onChange={e => state.setText(e.target.value)} />
          <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500" role="status" aria-live="polite">
            <Save size={15} className={hasText ? 'text-emerald-600' : 'text-slate-400'} />
            {hasText ? `${wordCount(state.text)} ta soʻz — shu brauzerda avtomatik saqlandi.` : 'Javob shu brauzerda avtomatik saqlanadi.'}
          </p>

          <Btn className="mt-4 w-full sm:w-auto" icon={shown ? EyeOff : Eye} aria-expanded={shown} aria-controls={uid + 'criterion'} onClick={() => setShown(s => !s)}>
            {shown ? 'Javob mezonini yashirish' : 'Javob mezonini koʻrsatish'}
          </Btn>
          {!shown && !hasText && <p className="mt-2 text-sm text-slate-500">Maslahat: mezonni ochishdan oldin oʻz javobingizni yozib koʻring.</p>}
        </div>
      </div>

      {shown && (
        <div id={uid + 'criterion'} role="status" aria-live="polite" className="prose-uz anim-in border-t border-teal-200 bg-teal-50/70 px-5 py-5 text-[0.96rem] leading-relaxed text-slate-700 sm:px-6">
          {task.criterion}
        </div>
      )}

      {/* Oʻz-oʻzini baholash */}
      <div className="border-t border-slate-100 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <ClipboardCheck size={20} className={t.text} />
          <h4 className="mr-auto text-base font-bold">Oʻz-oʻzini baholash</h4>
          <span className={cx('rounded-full px-3 py-1 font-mono text-sm font-bold', t.chip)} role="status" aria-live="polite" aria-label={`${task.id.toUpperCase()} topshiriq: 4 mezondan ${state.score} tasi bajarildi`}>{state.score} / 4</span>
        </div>
        <p className="mt-1 text-sm text-slate-500">Javobingizda bor bandlarni halol belgilang — bu baho siz uchun.</p>
        <div className="mt-3 grid gap-2.5 md:grid-cols-2">
          {task.rubric.map((r, i) => {
            const on = state.checks[i]
            return (
              <label key={i} className={cx('flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-[0.95rem] leading-snug transition',
                on ? 'border-emerald-300 bg-emerald-50 text-emerald-950' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400')}>
                <input type="checkbox" className="mt-0.5 h-5 w-5 flex-none accent-emerald-600" checked={on} onChange={() => state.toggle(i)} />
                <span>{r}</span>
              </label>
            )
          })}
        </div>
        <p className={cx('mt-3 rounded-xl border px-4 py-2.5 text-[0.95rem] leading-relaxed', fb.cls)} role="status" aria-live="polite">
          <strong>{state.score} / 4. </strong>{fb.text}
        </p>
      </div>
    </article>
  )
}

/* ==========================================================================
   Sahifa
   ========================================================================== */
const ROLES: { name: string; duty: string }[] = [
  { name: 'Loyihachi', duty: 'qurilmalarni tanlaydi va IP-rejani tuzadi' },
  { name: 'Chizuvchi', duty: 'tarmoq sxemasini chizadi yoki konstruktorda yigʻadi' },
  { name: 'Himoyachi', duty: 'yechimni 3 daqiqada taqdim etadi va savollarga javob beradi' },
  { name: 'Tanqidchi', duty: 'oʻz guruhi yechimidagi zaif joyni topadi' },
]

export default function Amaliyot() {
  const a = useTask('a')
  const b = useTask('b')
  const c = useTask('c')
  const states: Record<TaskId, TaskState> = { a, b, c }
  const [epoch, setEpoch] = useState(0)
  const [confirm, setConfirm] = useState(false)
  const [results] = useResults()

  const all = [a, b, c]
  const written = all.filter(s => s.text.trim().length > 0).length
  const total = all.reduce((n, s) => n + s.score, 0)
  const dirty = written > 0 || total > 0
  const main = results && typeof results === 'object' ? results.amaliy : undefined

  const clearAll = () => {
    all.forEach(s => s.reset())
    setEpoch(e => e + 1)
    setConfirm(false)
  }

  return (
    <>
      <PageHeader
        no="13"
        tone="green"
        eyebrow="Amaliyot va baholash"
        title="Amaliy mashgʻulotlar"
        lead={<>Nazariyadan keyin oʻquvchi <strong>oʻzi qurishi</strong> kerak. Quyida uch daraja uchun topshiriqlar — bitta sinfda ham, universitet seminarida ham qoʻllanadi.</>}
      />

      <Goal
        items={[
          'Nazariy bilimni uch darajali vaziyatli topshiriqlarda qoʻllash: sxemani oʻqish, tarmoqni loyihalash, xavfsizlikni taʼminlash.',
          'Oʻz javobini mezon bilan solishtirib, oʻz-oʻzini baholash.',
          'Har bir qarorni asoslash: «nega aynan shu qurilma, nega aynan shu qoida?»',
        ]}
      />

      {/* Asosiy amaliy topshiriqqa yoʻl */}
      <section aria-label="Asosiy amaliy topshiriq" className="stage-dark mb-12 overflow-hidden rounded-2xl bg-navy-950 p-5 text-navy-100 shadow-lift sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <span className="grid h-16 w-16 flex-none place-items-center rounded-2xl bg-teal-500 text-navy-950"><Wrench size={32} /></span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-300">Asosiy amaliy topshiriq</p>
            <h2 className="mt-1.5 text-2xl font-extrabold leading-tight !text-white sm:text-[1.8rem]">10 ta kompyuter va 1 ta printer uchun lokal tarmoq</h2>
            <p className="mt-2 max-w-2xl text-[1.02rem] leading-relaxed text-navy-200">
              Tarmoqni oʻzingiz yigʻasiz: qurilma tanlaysiz, kabel ulaysiz, IP-manzil berasiz va aloqani tekshirasiz. Platforma yechimni mezonlar boʻyicha avtomatik baholaydi.
            </p>
            {main && typeof main.score === 'number' && typeof main.max === 'number' && (
              <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-navy-600 bg-navy-900 px-3 py-1 font-mono text-sm text-teal-300" role="status">
                Oxirgi natijangiz: {main.score} / {main.max}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link to="/metodika/amaliy" className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-teal-500 px-6 py-3.5 text-base font-bold !text-navy-950 !no-underline transition hover:bg-teal-400">
              Topshiriqni boshlash <ArrowRight size={20} />
            </Link>
            <Link to="/laboratoriya" className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-navy-600 bg-navy-800 px-6 py-3.5 text-base font-semibold !text-white !no-underline transition hover:border-teal-400">
              <FlaskConical size={20} /> Erkin tarmoq konstruktori
            </Link>
          </div>
        </div>
      </section>

      <Block
        tone="green"
        title="Uch darajali topshiriqlar"
        sub="Javobingizni yozing — u shu brauzerda avtomatik saqlanadi. Soʻng javob mezoni bilan solishtiring va toʻrtta mezon boʻyicha oʻzingizni baholang."
      >
        <div className="space-y-6">
          {TASKS.map(task => <TaskCard key={task.id + ':' + epoch} task={task} state={states[task.id]} />)}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:px-5">
          <p className="mr-auto text-[0.97rem] text-slate-600" role="status" aria-live="polite">
            Yozilgan javoblar: <strong className="font-mono text-navy-950">{written} / 3</strong>
            <span className="mx-2 text-slate-300">·</span>
            Oʻz-oʻzini baholash: <strong className="font-mono text-navy-950">{total} / 12</strong>
          </p>
          {!confirm && <Btn variant="danger" icon={Eraser} disabled={!dirty} onClick={() => setConfirm(true)}>Javoblarni tozalash</Btn>}
          {confirm && (
            <span className="flex flex-wrap items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900" role="alert">
              Uchala javob va belgilar oʻchirilsinmi?
              <Btn size="sm" variant="danger" onClick={clearAll}>Ha, tozalash</Btn>
              <Btn size="sm" variant="ghost" onClick={() => setConfirm(false)}>Bekor qilish</Btn>
            </span>
          )}
        </div>
      </Block>

      <Block tone="green" title="Mashgʻulotni qanday tashkil qilish" sub="Xuddi shu topshiriqlar guruhda ham, yakka tartibda ham bajariladi.">
        <Grid cols={2}>
          <Card tone="blue" icon={Users} title="Guruh ishi">
            <CheckList items={[
              '3–4 kishidan iborat guruhlar tuziladi.',
              'Har bir guruh yechimini taqdim etadi (3 daqiqa).',
              <>Boshqa guruh <strong>savol beradi</strong> — bu ham baholashning bir qismi.</>,
            ]} />
            <p className="mt-4 font-semibold text-navy-950">Rollar:</p>
            <ul className="mt-2 grid gap-2 sm:grid-cols-2">
              {ROLES.map(r => (
                <li key={r.name} className="rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-[0.92rem] leading-snug">
                  <strong className="block">{r.name}</strong>
                  {r.duty}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[0.93rem]">«Tanqidchi» roli muhim: u oʻz guruhining yechimidagi <em>zaif joyni</em> topishi kerak. Bu — refleksiyaning eng samarali shakli.</p>
          </Card>
          <Card tone="violet" icon={User} title="Individual ishlash varianti">
            <p>Vaqt cheklangan boʻlsa yoki sinf katta boʻlsa:</p>
            <div className="mt-3">
              <CheckList items={[
                <>Har bir oʻquvchi <strong>bitta</strong> qurilmani tanlaydi.</>,
                'Uning vazifasini va «agar ishlamasa, nima boʻladi?» degan savolga javobni yozadi.',
                'Soʻng juftlikda daftar almashib, bir-birini tekshiradi.',
              ]} />
            </div>
            <p className="mt-4 text-[0.93rem]">Bu usul kam vaqt oladi, lekin «nosozlik taʼsiri» haqidagi tushunchani baribir shakllantiradi.</p>
          </Card>
        </Grid>

        <Callout kind="warn" title="Oʻqituvchi uchun muhim eslatma" className="mt-4">
          Topshiriqning maqsadi — «toʻgʻri javob»ni topish emas, <strong>qarorni asoslash</strong>. Bir nechta yechim toʻgʻri boʻlishi mumkin. Shuning uchun baholashda javobning <em>sababini</em> soʻrang: «Nega switch, nega router emas?» — aynan shu savol oʻquvchining tushunganini koʻrsatadi.
        </Callout>
      </Block>

      <LifeExample>
        <p>Yangi ochilgan oʻquv markazida tarmoqni «bitta Wi-Fi router hammasiga yetadi» deb qurishdi. Ikki haftadan keyin 25 ta kompyuter ulangach, aloqa sekinlashdi, printer esa har kuni «yoʻqolib qoladigan» boʻldi — unga har safar yangi manzil berilayotgan edi.</p>
        <p>Administrator B topshiriqdagi kabi reja tuzdi: kompyuterlar uchun switch, printerga statik manzil, mehmonlar uchun alohida Wi-Fi segmenti. <strong>Loyihasiz qurilgan tarmoq baribir qayta quriladi — faqat qimmatroqqa tushadi.</strong></p>
      </LifeExample>

      <Takeaway
        items={[
          <>Uch daraja bir-biriga tayanadi: <strong>A</strong> — sxemani oʻqish, <strong>B</strong> — loyihalash, <strong>C</strong> — himoyalash.</>,
          <>Baholanadigani — «toʻgʻri javob» emas, <strong>qarorning asosi</strong>; bir nechta yechim toʻgʻri boʻlishi mumkin.</>,
          <>Yaxshi yechim <strong>qolgan xavfni</strong> ham tan oladi — 100% xavfsiz tarmoq boʻlmaydi.</>,
          <>Mezon bilan oʻz-oʻzini baholash oʻquvchiga xatosini oʻzi topishni oʻrgatadi.</>,
        ]}
      />
    </>
  )
}
