import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BookOpen, Check, PartyPopper } from 'lucide-react'
import { Callout, Card, Grid, Pill, TONE, cx } from '../components/ui'
import { SAYOHAT } from '../data/sayohat'
import { useOquvchi } from '../lib/student'
import { useStored, type Result, type ResultKey } from '../lib/storage'
import MosiniTop from '../components/games/MosiniTop'
import TarmoqniYig from '../components/games/TarmoqniYig'
import XavfsizParol from '../components/games/XavfsizParol'
import Bilimdon from '../components/games/Bilimdon'
import PacketFlow from '../sims/PacketFlow'
import FirewallLab from '../lab/FirewallLab'
import EslabQol from '../components/EslabQol'

/* Har bosqichning qisqa mazmuni — koʻp matn emas, 2–3 jumla + vizual. */
function Mazmun({ path }: { path: string }) {
  switch (path) {
    case '/bosqich/boglanish':
      return (
        <>
          <p>Bitta kompyuter — yolgʻiz orol. Unga ikkinchisini qoʻshsak, ular bir-biriga <strong>maʼlumot yubora oladi</strong>. Shu bogʻlanish — <strong>tarmoq</strong>.</p>
          <Grid cols={3} className="mt-5">
            <Card tone="blue" emoji="💬" title="Til kerak">Ular bir xil qoida — <strong>protokol</strong> boʻyicha «gaplashadi».</Card>
            <Card tone="teal" emoji="📬" title="Manzil kerak">Har kimning oʻz <strong>manzili</strong> bor, xuddi uy manzili kabi.</Card>
            <Card tone="violet" emoji="🔗" title="Yoʻl kerak">Ularni <strong>sim</strong> yoki <strong>Wi-Fi</strong> bogʻlaydi.</Card>
          </Grid>
          <Callout kind="note" title="Hayotdan" className="mt-5">Sinfda 30 bola bir vaqtda qichqirsa — hech kim eshitmaydi. Gaplashish uchun navbat va umumiy til kerak. Tarmoqda ham xuddi shunday.</Callout>
          <BatafsilLink to="/kirish" />
        </>
      )
    case '/bosqich/qurilmalar':
      return (
        <>
          <p>Tarmoqda har bir qurilma oʻz ishini qiladi. Birlari ulaydi, birlari yoʻnaltiradi, birlari himoya qiladi.</p>
          <Grid cols={3} className="mt-5">
            <Card tone="teal" emoji="🔀" title="Switch">Bitta xonadagi kompyuterlarni ulaydi.</Card>
            <Card tone="blue" emoji="🌐" title="Router">Tarmoqni Internetga chiqaradi.</Card>
            <Card tone="amber" emoji="🖥️" title="Server">Fayl va xizmatni hammaga beradi.</Card>
          </Grid>
          <p className="mt-5 text-slate-600">Endi oʻyinda shu qurilmalarni vazifasiga ulab koʻr 👇</p>
          <BatafsilLink to="/qurilmalar" />
        </>
      )
    case '/bosqich/qurish':
      return (
        <>
          <p>Qurilmalarni bilib oldik — endi ularni <strong>birga ulaymiz</strong>. Kompyuterlar switchga, switch routerga, router internetga ulanadi. Buni <strong>yulduz tarmoq</strong> deyiladi.</p>
          <Callout kind="info" title="Qoida" className="mt-5">Kompyuterlar bir-biriga toʻgʻridan-toʻgʻri emas, <strong>switch orqali</strong> ulanadi. Shunda bitta sim uzilsa, faqat bitta kompyuter uziladi.</Callout>
          <BatafsilLink to="/laboratoriya" matn="Toʻliq tarmoq konstruktorini ochish" />
        </>
      )
    case '/bosqich/oqim':
      return (
        <>
          <p>Xabar bir kompyuterdan ikkinchisiga qanday yetib boradi? U <strong>kichik paketlarga</strong> boʻlinadi va switch, router orqali yoʻl bosadi.</p>
          <Callout kind="note" title="Hayotdan" className="mt-5">Katta kitobni bitta konvertga sigʻdirib boʻlmaydi — uni sahifalarga boʻlib, bir nechta konvertda yuborasiz. Tarmoqda ham fayl shunday boʻlinadi.</Callout>
          <p className="mt-5 text-slate-600">Quyida «Keyingi qadam» tugmasi bilan paketning yoʻlini kuzatib boring 👇</p>
          <BatafsilLink to="/ip" />
        </>
      )
    case '/bosqich/parol':
      return (
        <>
          <p>Tarmoqdagi eng zaif joy — koʻpincha <strong>parol</strong>. Kuchli parol — uzun va taxmin qilib boʻlmaydigan. Qani, qaysi parol kuchli ekanini ajratib koʻr!</p>
          <Grid cols={2} className="mt-5">
            <Card tone="rose" emoji="⚠️" title="Kuchsiz">123456, parol, ismingiz, tugʻilgan yil.</Card>
            <Card tone="green" emoji="✅" title="Kuchli">Uzun ibora: <code className="font-mono">olma-7-daryo-kuch</code></Card>
          </Grid>
          <BatafsilLink to="/xavfsizlik" />
        </>
      )
    case '/bosqich/himoya':
      return (
        <>
          <p>Tarmoqni <strong>firewall</strong> qoʻriqlaydi — xuddi maktab eshigidagi navbatchi kabi. U yaxshi trafikni oʻtkazadi, xavflisini toʻxtatadi.</p>
          <Callout kind="info" title="Sinab koʻr" className="mt-5">Quyida oʻzing qoida yoz: HTTPSga ruxsat, xavfli ulanishga taqiq. Soʻng paketlarni yuborib natijani koʻr.</Callout>
          <BatafsilLink to="/tahdidlar" matn="Tahdidlar haqida koʻproq" />
        </>
      )
    case '/bosqich/bilimdon':
      return <p>Sayohat deyarli tugadi! Endi oʻrganganingni sinab koʻramiz. 10 ta savol — qani, nechta toʻgʻri topasan? 🏆</p>
    default:
      return null
  }
}

function BatafsilLink({ to, matn = 'Bu mavzuni batafsil oʻrganish' }: { to: string; matn?: string }) {
  return (
    <Link to={to} className="no-print mt-5 inline-flex items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:border-brand-400 hover:text-brand-700">
      <BookOpen size={16} /> {matn} <ArrowRight size={14} />
    </Link>
  )
}

/** Bosqichdagi interaktiv qism (oʻyin yoki simulyator). */
function Interaktiv({ path }: { path: string }) {
  switch (path) {
    case '/bosqich/boglanish': return (
      <EslabQol saveKey="boglanish" intro="Tarmoq ishlashi uchun uchta narsa kerak edi. Har birini bosib, eslab qol 👇"
        items={[
          { emoji: '💬', label: 'Umumiy til', izoh: 'protokol — bir xil qoida' },
          { emoji: '📬', label: 'Manzil', izoh: 'har kimning oʻz manzili' },
          { emoji: '🔗', label: 'Yoʻl', izoh: 'sim yoki Wi-Fi' },
        ]} />
    )
    case '/bosqich/qurilmalar': return <MosiniTop />
    case '/bosqich/qurish': return <TarmoqniYig />
    case '/bosqich/oqim': return <div className="rounded-4xl"><PacketFlow saveKey="oqim" /></div>
    case '/bosqich/parol': return <XavfsizParol />
    case '/bosqich/himoya': return <div className="rounded-4xl"><FirewallLab /></div>
    case '/bosqich/bilimdon': return <Bilimdon />
    default: return null
  }
}

export default function Bosqich() {
  const { slug } = useParams()
  const nav = useNavigate()
  const { oquvchi } = useOquvchi()
  const [, setVisited] = useStored<string[]>('visited', [])
  const [mahalliy] = useStored<Partial<Record<ResultKey, Result>>>('results', {})
  const path = '/bosqich/' + slug
  const idx = SAYOHAT.findIndex(s => s.path === path)
  const s = SAYOHAT[idx]
  // Bosqichga kirgan zahoti «koʻrilgan» boʻladi — shunda keyingi bosqich qulfdan chiqadi
  useEffect(() => {
    window.scrollTo(0, 0)
    if (idx >= 0) setVisited(v => (v.includes(path) ? v : [...v, path]))
  }, [path, idx]) // eslint-disable-line react-hooks/exhaustive-deps
  if (!s) return <div className="py-16 text-center text-slate-500">Bunday bosqich yoʻq. <Link to="/" className="text-brand-700 underline">Sayohatga qaytish</Link></div>

  const oldingi = SAYOHAT[idx - 1], keyingi = SAYOHAT[idx + 1]
  const t = TONE[s.tone]
  const bajarilgan = s.gameKey && (!!oquvchi?.natijalar?.some(n => n.vazifa === s.gameKey) || !!mahalliy[s.gameKey])
  const bolliOyin = !!s.gameKey

  return (
    <>
      {/* Bosqich sarlavhasi */}
      <header className={cx('anim-in mb-7 overflow-hidden rounded-4xl bg-gradient-to-br text-white shadow-lift', t.grad)}>
        <div className="flex items-center gap-4 px-6 py-6 sm:px-8 sm:py-8">
          <span className="grid h-16 w-16 flex-none place-items-center rounded-3xl bg-white/20 text-4xl backdrop-blur">{s.emoji}</span>
          <div>
            <span className="rounded-full bg-white/25 px-3 py-1 text-xs font-extrabold uppercase tracking-wider backdrop-blur">{s.n}-bosqich · 7 tadan</span>
            <h1 className="text-balance mt-2 text-[1.8rem] font-extrabold leading-tight !text-white sm:text-[2.4rem]">{s.title}</h1>
          </div>
        </div>
        <div className="bg-black/10 px-6 py-3.5 text-[1.05rem] font-semibold sm:px-8">🤔 {s.savol}</div>
      </header>

      {/* Qisqa mazmun */}
      <div className="prose-uz anim-in mb-8 rounded-4xl border-2 border-slate-200 bg-white p-5 text-[1.08rem] leading-relaxed text-slate-700 shadow-card sm:p-7">
        <Mazmun path={path} />
      </div>

      {/* Interaktiv / oʻyin */}
      <div className="mb-8">
        <Interaktiv path={path} />
      </div>

      {/* Oldingi / Keyingi bosqich */}
      <nav className="no-print mt-10 flex flex-wrap items-center justify-between gap-3 border-t-2 border-slate-100 pt-7">
        {oldingi
          ? <Link to={oldingi.path} className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-5 py-3 font-extrabold text-navy-900 hover:border-brand-400"><ArrowLeft size={18} /> {oldingi.n}-bosqich</Link>
          : <Link to="/" className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-5 py-3 font-extrabold text-navy-900 hover:border-brand-400"><ArrowLeft size={18} /> Sayohat</Link>}
        {keyingi
          ? <button type="button" onClick={() => nav(keyingi.path)}
              className={cx('inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 font-display text-lg font-extrabold text-white btn-pop bg-gradient-to-b', TONE[keyingi.tone].grad)}>
              {bolliOyin && !bajarilgan ? 'Keyingi bosqich' : 'Davom etish'}: {keyingi.n}-bosqich <ArrowRight size={20} />
            </button>
          : <Link to="/sertifikat" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-b from-amber-400 to-orange-400 px-6 py-3.5 font-display text-lg font-extrabold text-navy-900 btn-pop">
              <PartyPopper size={20} /> Sertifikatni olish
            </Link>}
      </nav>
    </>
  )
}
