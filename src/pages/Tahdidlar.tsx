import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Ban, BrickWall, Bug, Ear, Factory, Fish, FlaskConical, LockOpen, PackageX, ShieldCheck, Split, Usb, UserRoundX, VenetianMask,
  type LucideIcon,
} from 'lucide-react'
import {
  PageHeader, Goal, Block, Grid, Card, Callout, Pill, Term, Mono, CheckList, LifeExample, Takeaway, MiniTask,
} from '../components/ui'
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
        <div className="prose-uz mt-3 text-[0.97rem] leading-relaxed text-slate-600">{t.body}</div>
      </div>
      <div className="grid place-items-center border-t border-slate-100 bg-slate-50 px-3 py-1.5 lg:border-l lg:border-t-0 lg:py-0" aria-hidden="true">
        <ArrowRight size={22} className="rotate-90 text-slate-400 lg:rotate-0" />
      </div>
      <div className="border-t border-emerald-200 bg-emerald-50/70 p-5 sm:p-6 lg:border-l lg:border-t-0">
        <div className="mb-3 flex items-center gap-2">
          <ShieldCheck size={20} className="flex-none text-emerald-700" aria-hidden="true" />
          <Pill tone="green">Chora</Pill>
        </div>
        <div className="prose-uz text-[0.97rem] leading-relaxed text-slate-700">
          <CheckList kind="check" items={t.cure} />
        </div>
      </div>
    </article>
  )
}

const THREATS: Threat[] = [
  {
    icon: Bug,
    title: 'Zararli dasturlar (malware)',
    body: (
      <CheckList kind="dot" items={[
        <><strong>Virus</strong> — faylga yopishib tarqaladi.</>,
        <><Term en="worm">Tarmoq qurti</Term> — tarmoq boʻylab oʻzi tarqaladi, foydalanuvchi aralashuvini kutmaydi.</>,
        <><strong>Troyan</strong> — foydali dastur niqobida keladi.</>,
        <><strong>Ransomware</strong> — fayllarni shifrlab, pul talab qiladi.</>,
      ]} />
    ),
    cure: [
      'Yangilab turiladigan antivirus',
      'Ishonchsiz fayl va ilovalarni ochmaslik',
      <><strong>Oflayn zaxira</strong>: ransomware tarmoqqa ulangan zaxirani ham shifrlaydi</>,
    ],
  },
  {
    icon: Fish,
    title: 'Fishing',
    body: <p>Soxta xat, sayt yoki xabar orqali parol va karta maʼlumotlarini <strong>oʻzingizdan</strong> soʻrab olish. Manzil bir harf bilan farq qiladi; xat shoshiltiradi, qoʻrqitadi yoki «mukofot» vaʼda qiladi.</p>,
    cure: [
      'Havolani bosishdan oldin manzilni tekshirish',
      <>Koʻp faktorli autentifikatsiya (<Link to="/xavfsizlik">MFA</Link>) — parol oʻgʻirlansa ham hisobni himoya qiladi</>,
    ],
  },
  {
    icon: VenetianMask,
    title: 'Ijtimoiy muhandislik',
    body: <p>Texnik zaiflik emas — <strong>inson</strong> nishonga olinadi: «Men direktorning yordamchisiman, parolni ayting», «IT boʻlimidanmiz, tekshiruv oʻtkazyapmiz».</p>,
    cure: [
      'Parolni hech kimga, hech qachon aytmaslik',
      'Shaxsni tasdiqlashning belgilangan tartibi',
      'Telefon orqali kelgan soʻrovni rasmiy kanal orqali qayta tekshirish',
    ],
  },
  {
    icon: Ear,
    title: 'Oʻrtadagi odam (MITM)',
    body: <p>Trafik ikki tomon oʻrtasida ushlab olinadi va oʻqiladi yoki oʻzgartiriladi. Ochiq (shifrlanmagan) Wi-Fi tarmogʻida bu ayniqsa oson.</p>,
    cure: [
      <>Faqat <Mono>HTTPS</Mono> saytlardan foydalanish</>,
      'Ochiq Wi-Fi tarmogʻida VPN ishlatish',
      'Wi-Fi uchun WPA3 shifrlash',
      'Sertifikat ogohlantirishlarini eʼtiborsiz qoldirmaslik',
    ],
  },
  {
    icon: LockOpen,
    title: 'Zaif va takroriy parollar',
    body: <p><Mono>123456</Mono>, <Mono>parol2024</Mono>, tugʻilgan sana. Bundan ham xavflisi — bitta parolni hamma joyda ishlatish: bitta sayt buzilsa, barcha hisoblar ochiladi.</p>,
    cure: [
      'Uzun parol — bir necha soʻzli ibora (passphrase)',
      'Har bir xizmatga alohida parol',
      'Parol menejeri',
      <><Link to="/xavfsizlik">MFA</Link> ni yoqish</>,
    ],
  },
  {
    icon: PackageX,
    title: 'Yangilanmagan dasturiy taʼminot',
    body: <p>Yangilanishlar koʻpincha <strong>allaqachon maʼlum boʻlgan zaifliklarni</strong> yopadi. Yangilanmagan qurilma — hujumchi uchun ochiq turgan eshik.</p>,
    cure: [
      'Avtomatik yangilashni yoqish',
      'Yangilanish jadvali',
      'Ishlab chiqaruvchi qoʻllab-quvvatlashi tugagan qurilmani almashtirish',
    ],
  },
]

export default function Tahdidlar() {
  return (
    <>
      <PageHeader no="10" tone="violet" eyebrow="Xavfsizlik" title="Tahdidlar va himoyalanish usullari"
        lead={<>Tahdidlarni bilish — himoyaning birinchi qadami. Bu boʻlimda har bir tahdid <strong>oʻziga qarshi aniq chora</strong> bilan birga beriladi, soʻng firewall trafikni qanday saralashini tajribada koʻramiz.</>} />

      <Goal items={[
        'Oltita keng tarqalgan tahdidni belgilariga qarab tanish',
        'Har bir tahdidga mos himoya chorasini tanlash',
        'Firewall qoidalari qanday tartibda tekshirilishini va standart taqiq nima ekanini tushuntirish',
        'Firewall nimani toʻxtata olmasligini bilish',
      ]} />

      <Block title="Nimadan himoyalanamiz: tahdid → chora" tone="violet"
        sub={<>Chap tomonda — tahdid va uning belgilari, oʻng tomonda — unga qarshi ishlaydigan choralar.</>}>
        <div className="space-y-4">
          {THREATS.map((t, i) => <ThreatPair key={t.title} no={i + 1} t={t} />)}
        </div>
      </Block>

      <Block title="Koʻpincha eʼtibordan chetda qoladigan yana uch xavf" tone="violet">
        <Grid cols={3}>
          <Card tone="rose" icon={Usb} title="Begona USB va qurilmalar">
            <p>Topib olingan fleshka «tekin sovgʻa» emas — u zararli dastur tashuvchisi boʻlishi mumkin.</p>
            <p><strong>Chora:</strong> notanish tashuvchi va qurilmalarni tarmoqqa hamda kompyuterga ulamaslik.</p>
          </Card>
          <Card tone="rose" icon={Factory} title="Ishlatilmayotgan xizmatlar va standart parollar">
            <p>Kamera va routerlarda zavod paroli oʻzgartirilmasa, ular tarmoqqa ochiq eshik boʻladi.</p>
            <p><strong>Chora:</strong> zavod parolini darhol almashtirish, keraksiz xizmatlarni oʻchirib qoʻyish.</p>
          </Card>
          <Card tone="rose" icon={UserRoundX} title="Ichki xavf">
            <p>Zarar yomon niyatsiz ham yetkazilishi mumkin: ehtiyotsiz xodim maʼlumotni notoʻgʻri joyga qoʻyadi.</p>
            <p><strong>Chora:</strong> eng kam huquq qoidasi va harakatlar jurnali (logging).</p>
          </Card>
        </Grid>
      </Block>

      <Block title="Firewall va segmentatsiya" tone="violet"
        sub={<><strong>Firewall</strong> — trafikni oldindan belgilangan qoidalar boʻyicha oʻtkazadigan yoki toʻxtatadigan chegara qurilmasi. <strong>Segmentatsiya</strong> — tarmoqni alohida boʻlaklarga ajratish. Quyidagi simulyatorda ikkalasi birga ishlaydi.</>}>
        <TrafficFilter />

        <Grid cols={2} className="mt-6">
          <Card icon={Split} title="Segmentatsiya nima beradi?">
            <CheckList kind="check" items={[
              <>Bitta boʻlimdagi virus boshqalarga <strong>tarqalmaydi</strong></>,
              <>Maʼmuriy maʼlumotlar oʻquv tarmogʻidan <strong>koʻrinmaydi</strong></>,
              <>Mehmon Wi-Fi tarmogʻi izolyatsiya qilinadi</>,
              <>Ortiqcha trafik butun tarmoqni <strong>boʻgʻib qoʻymaydi</strong></>,
            ]} />
          </Card>
          <Card tone="amber" icon={Ban} title="Standart qoida (default deny)">
            <p>Yaxshi sozlangan firewallda oxirgi qoida shunday boʻladi: <strong>ruxsat berilmagan hamma narsa taqiqlanadi</strong>.</p>
            <p>Aksi — <Mono>default allow</Mono> — xavfli: yangi xizmat paydo boʻlganda u oʻz-oʻzidan ochiq qoladi. Maktab tarmogʻida ham, bulut xizmatida ham qoida bir xil.</p>
          </Card>
        </Grid>

        <Callout kind="info" title="Firewall nima qila olmaydi" className="mt-4">
          <p>Firewall <strong>ruxsat etilgan kanal ichidagi</strong> hujumni toʻxtatmaydi. Masalan, fishing havolasi oddiy <Mono>HTTPS</Mono> saytga olib boradi — bu trafik qoidalarga toʻliq mos, shuning uchun oʻtadi.</p>
          <p>Shu sababli firewall <Link to="/xavfsizlik">autentifikatsiya</Link>, yangilanish va foydalanuvchi savodxonligi bilan <strong>birgalikda</strong> ishlaydi.</p>
        </Callout>

        <div className="mt-4 flex flex-wrap items-center gap-4 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-card sm:p-6">
          <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-emerald-600 text-white" aria-hidden="true"><FlaskConical size={22} /></span>
          <div className="min-w-0 flex-1 basis-64">
            <h3 className="text-lg font-bold">Qoidalarni oʻzingiz yozib koʻring</h3>
            <p className="mt-1 text-[0.97rem] leading-relaxed text-slate-600">Firewall laboratoriyasida qoidalarni qoʻshish, oʻchirish va tartibini almashtirish mumkin — natija qanday oʻzgarishini darhol koʻrasiz.</p>
          </div>
          <Link to="/laboratoriya/firewall"
            className="inline-flex flex-none items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-[0.95rem] font-semibold text-white shadow-sm transition hover:bg-teal-700 active:translate-y-px">
            <BrickWall size={17} aria-hidden="true" />
            Firewall laboratoriyasini ochish
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </Block>

      <LifeExample>
        <p>Universitet oʻqituvchilariga «Stipendiya roʻyxati yangilandi — tizimga kirib tasdiqlang» degan xat keldi. Havoladagi sayt asl portalga juda oʻxshardi, faqat manzilda bitta harf oʻrnida raqam turardi: «portal» emas, «porta1». Ikki oʻqituvchi parolini kiritib qoʻydi.</p>
        <p>Sayt oddiy HTTPS orqali ochilgani uchun firewall uni toʻxtatmadi. Ammo hisoblarda MFA yoqilgan edi: hujumchi parolni bilsa ham tizimga kira olmadi. IT boʻlimi jurnalda notanish manzildan qilingan urinishlarni koʻrib, oʻsha kuniyoq parollarni almashtirdi.</p>
      </LifeExample>

      <Takeaway items={[
        <>Har bir tahdidning aniq chorasi bor: zararli dastur → yangilanish va oflayn zaxira; fishing → manzilni tekshirish va MFA; zaif parol → uzun, takrorlanmaydigan parol.</>,
        <>Koʻp hujumlar texnikani emas, <strong>insonni</strong> nishonga oladi — foydalanuvchi savodxonligi ham himoya qatlami.</>,
        <>Firewall qoidalari yuqoridan pastga tekshiriladi va <strong>birinchi mos kelgani</strong> qoʻllanadi; aniqroq qoida umumiy qoidadan oldin turadi, oxirida — standart taqiq.</>,
        <>Firewall ruxsat etilgan kanal ichidagi hujumni toʻxtatmaydi — u autentifikatsiya, yangilanish va segmentatsiya bilan birga ishlaydi.</>,
      ]} />

      <MiniTask questions={[
        {
          q: 'Kafedraga qoʻngʻiroq qilishdi: «IT boʻlimidanmiz, hisobingizda nosozlik bor, tekshirish uchun parolingizni ayting». Bu qaysi tahdid va toʻgʻri harakat qanday?',
          options: [
            'MITM hujumi — VPN ni yoqib, parolni aytish kerak',
            'Ijtimoiy muhandislik — parolni aytmaslik va soʻrovni rasmiy kanal orqali qayta tekshirish kerak',
            'Zararli dastur — antivirusni ishga tushirish yetarli',
            'Bu tahdid emas — IT boʻlimiga parolni aytish mumkin',
          ],
          correct: 1,
          explain: 'Bu yerda texnika emas, inson nishonga olingan. Haqiqiy IT boʻlimi parolni hech qachon soʻramaydi; soʻrovni oʻzingiz bilgan rasmiy raqam yoki kanal orqali tekshiring.',
        },
        {
          q: 'Firewallda avval «RUXSAT: VLAN 10 → server, port 445», undan keyin «TAQIQ: 192.168.10.26 → server, port 445» qoidasi turibdi. Karantindagi 192.168.10.26 kompyuterining paketi bilan nima boʻladi?',
          options: [
            'Bloklanadi — taqiq qoidasi har doim ustun turadi',
            'Bloklanadi — uni standart taqiq toʻxtatadi',
            'Firewall xato beradi — qoidalar bir-biriga zid',
            'Oʻtkaziladi — birinchi mos kelgan qoida umumiy ruxsat boʻladi',
          ],
          correct: 3,
          explain: 'Qoidalar yuqoridan pastga oʻqiladi va birinchi mos kelgani qoʻllanadi. Shuning uchun aniqroq qoida (bitta kompyuterga taqiq) umumiy ruxsatdan oldin turishi shart — simulyatordagi R1B va R1 kabi.',
        },
        {
          q: 'Ransomware maktab fayl serverini va unga doimiy ulab qoʻyilgan zaxira diskini shifrladi. Qaysi chora maʼlumotni saqlab qolgan boʻlar edi?',
          options: [
            'Tarmoqdan uzib saqlanadigan (oflayn) zaxira nusxa',
            'Firewallda 443-portni yopish',
            'Wi-Fi parolini murakkabroq qilish',
            'Serverga ikkinchi monitor ulash',
          ],
          correct: 0,
          explain: 'Ransomware tarmoqqa ulangan zaxirani ham shifrlaydi. Faqat oflayn yoki oʻzgartirib boʻlmaydigan nusxa undan omon qoladi — 3-2-1 qoidasining «1 nusxa boshqa joyda» sharti shuning uchun kerak.',
        },
      ]} />
    </>
  )
}
