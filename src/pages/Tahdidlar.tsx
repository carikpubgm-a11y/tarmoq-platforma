import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Ban, BrickWall, Bug, Ear, Factory, Fish, FlaskConical, LockOpen, PackageX, ShieldCheck, Split, Usb, UserRoundX, VenetianMask,
  type LucideIcon,
} from 'lucide-react'
import {
  PageHeader, Goal, Block, Grid, Card, Callout, Pill, Term, Mono, CheckList, LifeExample, Takeaway, } from '../components/ui'
import TrafficFilter from '../sims/TrafficFilter'

/* ------------------------------ «Tahdid → Chora» juftligi ------------------------------ */
interface Threat { icon: LucideIcon; title: string; body: ReactNode; cure: ReactNode[] }

function ThreatPair({ no, t }: { no: number; t: Threat }) {
  return (
    <article className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card lg:grid-cols-[minmax(0,1.15fr)_auto_minmax(0,1fr)]">
      <div className="relative p-5 sm:p-6">
        <span className="absolute inset-y-0 left-0 w-1 bg-rose-500" aria-hidden="true" />
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-rose-50 text-rose-700" aria-hidden="true"><t.icon size={22} /></span>
          <div>
            <Pill tone="rose">Tahdid {no}</Pill>
            <h3 className="mt-1 text-lg font-bold leading-snug">{t.title}</h3>
          </div>
        </div>
        <div className="prose-uz mt-3 text-[1rem] leading-relaxed text-slate-600">{t.body}</div>
      </div>
      <div className="grid place-items-center border-t border-slate-100 bg-slate-50 px-3 py-1.5 lg:border-l lg:border-t-0 lg:py-0" aria-hidden="true">
        <ArrowRight size={22} className="rotate-90 text-slate-400 lg:rotate-0" />
      </div>
      <div className="border-t border-emerald-200 bg-emerald-50/70 p-5 sm:p-6 lg:border-l lg:border-t-0">
        <div className="mb-3 flex items-center gap-2">
          <ShieldCheck size={20} className="flex-none text-emerald-700" aria-hidden="true" />
          <Pill tone="green">Chora</Pill>
        </div>
        <div className="prose-uz text-[1rem] leading-relaxed text-slate-700">
          <CheckList kind="check" items={t.cure} />
        </div>
      </div>
    </article>
  )
}

const THREATS: Threat[] = [
  {
    icon: Bug,
    title: 'Zararli dasturlar 🦠',
    body: (
      <CheckList kind="dot" items={[
        <><strong>Virus</strong> — faylga yopishib tarqaladi.</>,
        <><strong>Tarmoq qurti</strong> — oʻzi tarqaladi, hech kimni kutmaydi.</>,
        <><strong>Troyan</strong> — foydali dastur niqobida keladi.</>,
        <><strong>Ransomware</strong> — fayllarni qulflab, pul talab qiladi.</>,
      ]} />
    ),
    cure: ['Yangilanadigan antivirus', 'Notanish fayl va ilovani ochmaslik', <><strong>Oflayn zaxira nusxa</strong></>],
  },
  {
    icon: Fish,
    title: 'Fishing — soxta xat 🎣',
    body: <p>Soxta xat yoki sayt parolingizni <strong>oʻzingizdan</strong> soʻrab oladi. Manzil bir harf bilan farq qiladi: «portal» emas, «porta1».</p>,
    cure: [
      'Havolani bosishdan oldin manzilni oʻqish',
      <><Link to="/xavfsizlik">MFA</Link> ni yoqish — parol oʻgʻirlansa ham hisob ochilmaydi</>,
    ],
  },
  {
    icon: VenetianMask,
    title: 'Odamni aldash',
    body: <p>Bu yerda texnika emas, <strong>odam</strong> aldanadi: «Men direktorning yordamchisiman, parolni ayting».</p>,
    cure: ['Parolni hech kimga aytmaslik', 'Soʻrovni rasmiy raqam orqali qayta tekshirish'],
  },
  {
    icon: Ear,
    title: 'Oʻrtadagi odam',
    body: <p>Begona odam ikki tomon orasidagi xabarni ushlab oladi va oʻqiydi. Parolsiz, ochiq Wi-Fi da bu juda oson. 📡</p>,
    cure: [<>Faqat <Mono>HTTPS</Mono> saytlar</>, 'Ochiq Wi-Fi da muhim parol kiritmaslik', 'Wi-Fi ga kuchli parol qoʻyish'],
  },
  {
    icon: LockOpen,
    title: 'Zaif va takroriy parollar',
    body: <p><Mono>123456</Mono>, tugʻilgan sana. Bundan ham xavflisi — <strong>bitta parolni hamma joyda</strong> ishlatish: bitta sayt buzilsa, hammasi ochiladi.</p>,
    cure: ['Uzun parol — bir necha soʻzli ibora', 'Har bir xizmatga alohida parol', 'Parol menejeri'],
  },
  {
    icon: PackageX,
    title: 'Yangilanmagan dasturlar',
    body: <p>Yangilanish allaqachon maʼlum boʻlgan teshiklarni yopadi. Yangilanmagan qurilma — ochiq turgan eshik. 🚪</p>,
    cure: ['Avtomatik yangilashni yoqish', 'Qoʻllab-quvvatlanmaydigan qurilmani almashtirish'],
  },
]

export default function Tahdidlar() {
  return (
    <>
      <PageHeader no="10" tone="violet" eyebrow="Xavfsizlik" title="Tahdidlar va himoyalanish"
        lead={<>Tahdidni bilish — himoyaning birinchi qadami. Har bir tahdid yonida <strong>unga qarshi aniq chora</strong> turadi. 🛡️</>} />

      <Goal items={[
        'Oltita asosiy tahdidni belgilaridan tanib olasiz',
        'Har bir tahdidga mos chorani tanlaysiz',
        'Firewall qoidalari qanday tartibda ishlashini tushuntirasiz',
      ]} />

      <Block title="Tahdid → chora" tone="violet"
        sub={<>Chapda — tahdid, oʻngda — unga qarshi ishlaydigan chora.</>}>
        <div className="space-y-4">
          {THREATS.map((t, i) => <ThreatPair key={t.title} no={i + 1} t={t} />)}
        </div>
      </Block>

      <Block title="Yana uch xavf — koʻpincha esdan chiqadi" tone="violet">
        <Grid cols={3}>
          <Card tone="rose" icon={Usb} title="Topib olingan fleshka">
            <p>Tekin sovgʻa emas — ichida zararli dastur boʻlishi mumkin.</p>
            <p><strong>Chora:</strong> notanish fleshkani ulamaslik.</p>
          </Card>
          <Card tone="rose" icon={Factory} title="Zavod paroli">
            <p>Kamera va routerda <Mono>admin / admin</Mono> qolib ketsa, tarmoq ochiq turadi.</p>
            <p><strong>Chora:</strong> parolni darhol almashtirish.</p>
          </Card>
          <Card tone="rose" icon={UserRoundX} title="Ichki xavf">
            <p>Zarar yomon niyatsiz ham boʻladi: xodim maʼlumotni notoʻgʻri joyga qoʻyadi.</p>
            <p><strong>Chora:</strong> faqat kerakli huquq va jurnal.</p>
          </Card>
        </Grid>
      </Block>

      <Block title="Firewall va tarmoqni boʻlaklash" tone="violet"
        sub={<><Term en="firewall">Firewall</Term> — maktab turniketi kabi: kimni oʻtkazish, kimni oʻtkazmaslik oldindan yozib qoʻyilgan. 🚧</>}>
        <TrafficFilter />

        <Grid cols={2} className="mt-6">
          <Card icon={Split} title="Boʻlaklash nima beradi?">
            <CheckList kind="check" items={[
              <>Bir xonadagi virus boshqasiga <strong>oʻtmaydi</strong></>,
              <>Maʼmuriyat fayllari oʻquv tarmogʻidan <strong>koʻrinmaydi</strong></>,
              <>Mehmon Wi-Fi tarmogʻi alohida turadi</>,
            ]} />
          </Card>
          <Card tone="amber" icon={Ban} title="Oxirgi qoida: hammasi taqiq">
            <p>Yaxshi sozlangan firewallda oxirgi qoida shunday: <strong>ruxsat berilmagan hamma narsa taqiqlanadi</strong>.</p>
            <p>Aks holda yangi xizmat paydo boʻlishi bilan oʻz-oʻzidan ochiq qolib ketadi.</p>
          </Card>
        </Grid>

        <Callout kind="info" title="Firewall nimani toʻxtatmaydi" className="mt-4">
          Fishing havolasi oddiy <Mono>HTTPS</Mono> saytga olib boradi — bu trafik qoidalarga mos, shuning uchun oʻtadi. Demak firewall yolgʻiz ishlamaydi: unga parol, yangilanish va oʻquvchining ehtiyotkorligi qoʻshiladi.
        </Callout>

        <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-card sm:p-6">
          <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-emerald-600 text-white" aria-hidden="true"><FlaskConical size={22} /></span>
          <div className="min-w-0 flex-1 basis-64">
            <h3 className="text-lg font-bold">Qoidalarni oʻzingiz yozib koʻring</h3>
            <p className="mt-1 text-[1rem] leading-relaxed text-slate-600">Laboratoriyada qoida qoʻshish, oʻchirish va tartibini almashtirish mumkin.</p>
          </div>
          <Link to="/laboratoriya/firewall"
            className="inline-flex flex-none items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-[0.95rem] font-semibold text-white shadow-sm transition hover:bg-teal-700 active:translate-y-px">
            <BrickWall size={17} aria-hidden="true" />
            Firewall laboratoriyasi
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </Block>

      <LifeExample>
        <p>Oʻqituvchilarga xat keldi: «Roʻyxat yangilandi — tizimga kirib tasdiqlang». Havoladagi sayt asl portalga juda oʻxshardi, faqat manzilda «portal» emas, «porta1» yozilgan edi. Ikki oʻqituvchi parolini kiritdi. 😟</p>
        <p>Sayt oddiy HTTPS orqali ochilgani uchun firewall uni toʻxtatmadi. Ammo hisoblarda MFA yoqilgan edi — hujumchi parolni bilsa ham kira olmadi. ✅</p>
      </LifeExample>

      <Takeaway items={[
        <>Har bir tahdidning aniq chorasi bor: zararli dastur → yangilanish va oflayn zaxira; fishing → manzilni oʻqish va MFA.</>,
        <>Koʻp hujum texnikani emas, <strong>odamni</strong> nishonga oladi.</>,
        <>Firewall qoidalari yuqoridan pastga oʻqiladi va <strong>birinchi mos kelgani</strong> ishlaydi. Aniq qoida umumiy qoidadan yuqorida turadi.</>,
        <>Firewall yolgʻiz yetmaydi — u parol, yangilanish va boʻlaklash bilan birga ishlaydi.</>,
      ]} />


    </>
  )
}
