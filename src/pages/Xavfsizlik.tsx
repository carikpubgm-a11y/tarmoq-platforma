import { Link } from 'react-router-dom'
import { Activity, BadgeCheck, HardDrive, KeyRound, Lock, RefreshCw, Scale, ScrollText, Smartphone, Users, Zap } from 'lucide-react'
import {
  PageHeader, Goal, Block, Grid, Card, Callout, Pill, Term, Mono, CheckList, KV, StepList, LifeExample, Takeaway, MiniTask,
} from '../components/ui'

/* ------------------------------ Qatlamli himoya (vizual) ------------------------------ */
const LAYERS = [
  { name: 'Inson', what: 'oʻqitilgan foydalanuvchi', fill: '#F5F3FF', text: '#2E1065' },
  { name: 'Chegara', what: 'firewall', fill: '#EDE9FE', text: '#2E1065' },
  { name: 'Tarmoq', what: 'segmentatsiya (VLAN)', fill: '#DDD6FE', text: '#2E1065' },
  { name: 'Qurilma', what: 'yangilanish va antivirus', fill: '#C4B5FD', text: '#2E1065' },
  { name: 'Hisob', what: 'parol, MFA, eng kam huquq', fill: '#A78BFA', text: '#1E1B4B' },
  { name: 'Maʼlumot', what: 'shifrlash va zaxira nusxa', fill: '#6D28D9', text: '#FFFFFF' },
]

function DefenseLayers() {
  const last = LAYERS.length - 1
  return (
    <figure className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-6">
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          <svg viewBox="0 0 800 400" className="h-auto w-full" role="img"
            aria-label="Qatlamli himoya sxemasi: tashqaridan ichkariga olti qatlam — inson, chegara, tarmoq, qurilma, hisob va maʼlumot">
            <defs>
              <marker id="dl-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 z" fill="#E11D48" />
              </marker>
            </defs>
            {LAYERS.map((l, k) => {
              const x = 84 + 24 * k
              const y = 10 + 40 * k
              const w = 706 - 48 * k
              const h = 380 - 56 * k
              return (
                <g key={l.name}>
                  <rect x={x} y={y} width={w} height={h} rx={16} fill={l.fill} stroke="#7C3AED" strokeOpacity={0.45} strokeWidth={1.4} />
                  {k < last ? (
                    <text x={x + 18} y={y + 26} fontSize={14.5} fill={l.text}>
                      <tspan fontWeight={700}>{k + 1}. {l.name}:</tspan> {l.what}
                    </text>
                  ) : (
                    <>
                      <text x={x + w / 2} y={y + h / 2 - 4} fontSize={17} fontWeight={800} fill={l.text} textAnchor="middle">{k + 1}. {l.name}</text>
                      <text x={x + w / 2} y={y + h / 2 + 20} fontSize={14.5} fill={l.text} textAnchor="middle">{l.what}</text>
                    </>
                  )}
                </g>
              )
            })}
            {/* Hujum yoʻli: har bir qatlamdan oʻtishi kerak */}
            <line x1={6} y1={260} x2={194} y2={260} stroke="#E11D48" strokeWidth={2.4} strokeDasharray="7 6" markerEnd="url(#dl-arrow)" />
            <text x={6} y={246} fontSize={14} fontWeight={700} fill="#BE123C">Hujum</text>
          </svg>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-[0.95rem] text-slate-600">
        Hujumchi maʼlumotga yetishi uchun <strong className="font-semibold text-navy-950">barcha qatlamlardan</strong> oʻtishi kerak. Bittasi ishlamay qolsa, qolganlari ushlab turadi.
      </figcaption>
    </figure>
  )
}

/* ------------------------------ 3-2-1 qoidasi (vizual) ------------------------------ */
function Rule321() {
  const items: [string, string][] = [['3', 'ta nusxa'], ['2', 'xil turdagi saqlagich'], ['1', 'nusxa boshqa joyda']]
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map(([n, t]) => (
        <div key={n} className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-3 text-center">
          <div className="font-display text-3xl font-extrabold text-navy-950">{n}</div>
          <div className="mt-1 text-[0.82rem] leading-snug text-slate-600">{t}</div>
        </div>
      ))}
    </div>
  )
}

export default function Xavfsizlik() {
  return (
    <>
      <PageHeader no="09" tone="violet" eyebrow="Xavfsizlik" title="Tarmoq xavfsizligi"
        lead={<>Tarmoq xavfsizligi «virusdan himoya» degani emas. U uchta maqsadni saqlash haqida: <strong>maxfiylik</strong>, <strong>yaxlitlik</strong> va <strong>foydalanuvchanlik</strong>.</>} />

      <Goal items={[
        'Xavfsizlikning uch ustunini (maxfiylik, yaxlitlik, foydalanuvchanlik) misollar bilan tushuntirish',
        'Qatlamli himoya, AAA modeli va eng kam huquq qoidasini vaziyatga qoʻllash',
        'Hisobni uzun parol, MFA va huquqlarni cheklash orqali himoyalash',
        '3-2-1 zaxira qoidasi va hodisaga javob berishning olti qadamini bilish',
      ]} />

      <Block title="Xavfsizlik uchta ustunga tayanadi" tone="violet"
        sub={<>Har qanday himoya chorasi shu uch maqsaddan kamida bittasiga xizmat qiladi. Inglizcha bosh harflari boʻyicha bu uchlik <strong>CIA</strong> deb ataladi.</>}>
        <Grid cols={3}>
          <Card tone="violet" icon={Lock} title="Maxfiylik" tag={<Pill tone="violet">CONFIDENTIALITY</Pill>}>
            <p>Maʼlumotni faqat ruxsat etilgan kishi koʻradi.</p>
            <div className="mt-3">
              <CheckList kind="dot" items={['Shifrlash (HTTPS, WPA2/WPA3)', 'Foydalanuvchi huquqlari', 'Fayl va diskni shifrlash']} />
            </div>
          </Card>
          <Card tone="blue" icon={BadgeCheck} title="Yaxlitlik" tag={<Pill tone="blue">INTEGRITY</Pill>}>
            <p>Maʼlumot yoʻlda oʻzgarmagan va buzilmagan.</p>
            <div className="mt-3">
              <CheckList kind="dot" items={['Nazorat yigʻindisi (hash)', 'Elektron imzo', 'Oʻzgarishlar jurnali']} />
            </div>
          </Card>
          <Card tone="amber" icon={Zap} title="Foydalanuvchanlik" tag={<Pill tone="amber">AVAILABILITY</Pill>}>
            <p>Maʼlumot kerak boʻlganda mavjud va ishlaydi.</p>
            <div className="mt-3">
              <CheckList kind="dot" items={['Zaxira nusxalar', 'UPS (uzluksiz quvvat manbai)', 'Zaxira (redundant) aloqa kanallari']} />
            </div>
          </Card>
        </Grid>
      </Block>

      <Block title="Qatlamli himoya" tone="violet"
        sub={<><Term en="defense in depth">Himoya chuqurligi</Term> — himoya bitta devor emas, bir necha qatlamdan iborat boʻlishi kerak. Parol, firewall, segmentatsiya, yangilanish, zaxira, oʻqitilgan foydalanuvchi — har biri alohida qatlam.</>}>
        <DefenseLayers />
        <Callout kind="info" title="100% xavfsiz tizim yoʻq" className="mt-4">
          <p>Shu sababli vazifa — xavfni <strong>kamaytirish</strong> va hujum sodir boʻlganda uni <strong>tez aniqlash</strong>.</p>
          <p>«Bizda hech narsa boʻlmaydi» degan gap — xavfsizlik emas, ehtiyotsizlik.</p>
        </Callout>
      </Block>

      <Block title="AAA modeli va eng kam huquq qoidasi" tone="violet"
        sub={<>Tarmoqqa kirgan har bir foydalanuvchi uchun uchta savolga javob berilishi kerak: kim, nimaga haqli va nima qildi.</>}>
        <Grid cols={2}>
          <Card icon={Users} title="AAA modeli">
            <KV items={[
              [<Term en="Authentication">Autentifikatsiya</Term>, 'Kim siz? — shaxsni tasdiqlash'],
              [<Term en="Authorization">Avtorizatsiya</Term>, 'Nima qilishga haqqingiz bor? — huquqlarni belgilash'],
              [<Term en="Accounting">Hisobga olish</Term>, 'Nima qildingiz? — harakatlar jurnali'],
            ]} />
            <p className="mt-3">Bu uchlik maktab tarmogʻida ham ishlaydi: oʻqituvchi va oʻquvchi bir xil tarmoqqa kiradi, lekin <strong>huquqlari</strong> har xil.</p>
          </Card>
          <Card tone="violet" icon={Scale} title="Eng kam huquq qoidasi">
            <p>Foydalanuvchiga ishini bajarish uchun <strong>zarur boʻlgan minimal huquq</strong> beriladi — undan ortiq emas.</p>
            <p>Amalda: oʻquvchiga oʻqituvchining papkasi kerak emas; hisobchiga server xonasiga kirish kerak emas.</p>
            <p>Bu qoida buzilsa, bitta parolning qoʻlga tushishi butun tashkilotni ochib qoʻyadi.</p>
          </Card>
        </Grid>
      </Block>

      <Block title="Autentifikatsiya: parol, MFA va huquqlar" tone="violet"
        sub={<>Tarmoqdagi eng zaif boʻgʻin — odatda qurilma emas, <strong>hisob</strong>. Hisobni himoya qilish uch bosqichda quriladi.</>}>
        <Grid cols={3}>
          <Card icon={KeyRound} title="1. Kuchli parol">
            <p>Zamonaviy tavsiya: <strong>uzunlik</strong> murakkablikdan muhimroq. Uch-toʻrt tasodifiy soʻzdan iborat ibora (passphrase) <Mono>P@ss1!</Mono> kabi qisqa «murakkab» paroldan ancha kuchli.</p>
            <p><strong>Amalda:</strong> har bir xizmatga alohida parol. Eslab qolish qiyin boʻlsa — parol menejeri ishlatiladi.</p>
          </Card>
          <Card tone="blue" icon={Smartphone} title="2. Koʻp faktorli autentifikatsiya (MFA)">
            <p>Parol oʻgʻirlansa ham hisob ochilmaydi. Uch turdagi dalil mavjud:</p>
            <div className="mt-3">
              <CheckList kind="dot" items={[
                <><strong>Bilaman</strong> — parol, PIN</>,
                <><strong>Menda bor</strong> — telefon, apparat kalit</>,
                <><strong>Oʻzimman</strong> — barmoq izi, yuz</>,
              ]} />
            </div>
            <p className="mt-3">SMS orqali keladigan kod — MFA ning eng zaif turi: SIM-kartani qayta rasmiylashtirib, raqamni egallash mumkin. Autentifikator ilova yoki apparat kalit ishonchliroq.</p>
          </Card>
          <Card tone="violet" icon={ScrollText} title="3. Huquqlar va jurnal">
            <p>Kim nima qilishga haqli — oldindan belgilanadi (eng kam huquq qoidasi). Har bir kirish va harakat jurnalga yoziladi.</p>
            <p>Jurnal nima uchun kerak? Hodisa yuz berganda <strong>nima boʻlganini</strong> aniqlash uchun. Jurnalsiz tashkilot faqat «buzilganini» biladi, «qanday va qachon» ekanini esa bilmaydi.</p>
          </Card>
        </Grid>
      </Block>

      <Block title="Parol siyosatiga zamonaviy qarash" tone="violet"
        sub={<>Uzoq vaqt «parolni har 30–90 kunda majburiy almashtirish» va «har xil turdagi belgilarni talab qilish» standart hisoblangan. Zamonaviy tavsiyalar (masalan, <Mono>NIST SP 800-63B</Mono>) buni qayta koʻrib chiqdi.</>}>
        <Grid cols={2}>
          <Card tone="rose" title="Eskirgan yondashuv">
            <CheckList kind="cross" items={[
              'Parolni majburiy tez-tez almashtirish',
              <>Murakkablik talablari (<Mono>A1!b2@</Mono>)</>,
              'Xavfsizlik savollari («onangizning ismi»)',
            ]} />
          </Card>
          <Card tone="green" title="Zamonaviy yondashuv">
            <CheckList kind="check" items={[
              'Uzunlikni ragʻbatlantirish',
              'Sizib chiqqani maʼlum boʻlgan parollarni bloklash',
              <>Almashtirishni faqat <strong>shubha</strong> tugʻilganda talab qilish</>,
              'MFA ni asosiy himoya deb bilish',
            ]} />
          </Card>
        </Grid>
        <Callout kind="note" title="Sababi oddiy" className="mt-4">
          Tez-tez almashtirish odamni <strong>oddiyroq</strong> parol tanlashga va uni qogʻozga yozib qoʻyishga majbur qiladi. Natija kutilganning teskarisi boʻladi.
        </Callout>
      </Block>

      <Block title="Zaxira, yangilanish va monitoring" tone="violet"
        sub={<>Bu uchlik — hujum boʻlmasa ham ishlashda davom etish kafolati. Nosozlik, adashib oʻchirish va ransomware — barchasiga javob bir xil.</>}>
        <Grid cols={3}>
          <Card icon={HardDrive} title="Zaxira: 3-2-1 qoidasi">
            <Rule321 />
            <p className="mt-3">Ransomware tarmoqqa ulangan zaxirani ham shifrlaydi — shuning uchun <strong>oflayn</strong> yoki oʻzgartirib boʻlmaydigan nusxa shart.</p>
          </Card>
          <Card tone="amber" icon={RefreshCw} title="Yangilanish boshqaruvi">
            <CheckList kind="dot" items={[
              'Avtomatik yangilashni yoqish',
              'Jadval boʻyicha: muntazam, kutilmagan paytda emas',
              'Yangilashdan oldin zaxira nusxa olish',
              'Qoʻllab-quvvatlanmaydigan uskunani almashtirish',
            ]} />
          </Card>
          <Card tone="blue" icon={Activity} title="Monitoring">
            <CheckList kind="dot" items={[
              'Jurnallarni markazlashgan holda yigʻish',
              'Gʻayritabiiy holat haqida ogohlantirish',
              'Jurnalni uzoq muddat saqlash',
              'Muntazam koʻrib chiqish',
            ]} />
          </Card>
        </Grid>
        <Callout kind="danger" title="Eng qimmat yolgʻon tasalli" className="mt-4">
          <p>«Bizda zaxira bor» deyish yetarli emas. <strong>Tekshirilmagan zaxira — zaxira emas.</strong></p>
          <p>Nusxa olinadi, lekin undan hech qachon tiklab koʻrilmaganmi? Koʻp tashkilotlar zaxira fayli ochilmasligini yoki kerakli maʼlumot unda yoʻqligini aynan hodisa paytida bilib qoladi. Shuning uchun <strong>tiklashni sinab koʻrish</strong> jadvalga kiritilishi shart.</p>
        </Callout>
      </Block>

      <Block title="Hodisa yuz berganda: olti qadam" tone="violet"
        sub={<>Hodisaga javob berish tartibi oldindan yoziladi va mashq qilinadi — vahima paytida toʻgʻri qaror topish qiyin.</>}>
        <StepList tone="violet" items={[
          { n: '1', title: 'Tayyorgarlik', text: <>Reja, masʼul shaxslar va aloqa kanallari oldindan belgilanadi. Hodisa paytida oʻylab topilmaydi.</> },
          { n: '2', title: 'Aniqlash', text: <>Monitoring va jurnallar orqali gʻayritabiiy holat payqaladi. Bu qadam qanchalik tez boʻlsa, zarar shunchalik kam.</> },
          { n: '3', title: 'Cheklash', text: <>Zararlangan qurilma tarmoqdan ajratiladi. Maqsad — sababni hali aniqlamasdan turib, tarqalishni toʻxtatish.</> },
          { n: '4', title: 'Bartaraf etish', text: <>Sabab yoʻq qilinadi: zararli dastur olib tashlanadi, zaiflik yopiladi, parollar almashtiriladi.</> },
          { n: '5', title: 'Tiklash', text: <>Tizim zaxiradan tiklanadi va ishlashi tekshiriladi. Shoshilmaslik kerak — qayta zararlanish xavfi bor.</> },
          { n: '6', title: 'Xulosa', text: <>Nima boʻldi, nega boʻldi, nima oʻzgaradi? Bu qadam tashlab ketilsa, xuddi shu hodisa takrorlanadi.</> },
        ]} />
        <p className="prose-uz mt-4 text-[0.97rem] text-slate-600">
          Qaysi tahdidlar bunday hodisalarga olib kelishi keyingi boʻlimda koʻrib chiqiladi: <Link to="/tahdidlar">Tahdidlar va himoyalanish usullari</Link>.
        </p>
      </Block>

      <LifeExample>
        <p>Kollej hisobchisi «soliq idorasidan» kelgan xatdagi faylni ochdi — ransomware uning kompyuteridagi va tarmoq papkasidagi hujjatlarni shifrladi. Tashkilotni bitta chora emas, uch qatlam qutqardi:</p>
        <div className="mt-3">
          <CheckList kind="check" items={[
            <>buxgalteriya alohida VLAN da edi — zararli dastur oʻquv sinflariga oʻtmadi;</>,
            <>hisobchida administrator huquqi yoʻq edi — server sozlamalari va boshqa boʻlimlar papkalari zarar koʻrmadi;</>,
            <>haftalik oflayn zaxira bor edi va undan tiklash avval sinab koʻrilgan — ish bir kunda tiklandi.</>,
          ]} />
        </div>
      </LifeExample>

      <Takeaway items={[
        <>Xavfsizlik — <strong>maxfiylik, yaxlitlik va foydalanuvchanlikni</strong> birga saqlash.</>,
        <>Himoya qatlamlardan iborat. 100% xavfsiz tizim yoʻq — maqsad xavfni kamaytirish va hodisani tez aniqlash.</>,
        <>Hisobni uzun, takrorlanmaydigan parol, <strong>MFA</strong> va eng kam huquq himoya qiladi; har bir harakat jurnalga yoziladi.</>,
        <>3-2-1 qoidasi, oflayn nusxa va tiklashni sinash: <strong>tekshirilmagan zaxira — zaxira emas</strong>. Hodisaga javob rejasi oldindan tayyorlanadi.</>,
      ]} />

      <MiniTask questions={[
        {
          q: 'Elektr uzilishi sabab maktab serveri yarim kun ishlamadi. Maʼlumotlar yoʻqolmadi, ularni hech kim oʻgʻirlamadi yoki oʻzgartirmadi. Qaysi ustun buzildi?',
          options: ['Maxfiylik', 'Yaxlitlik', 'Foydalanuvchanlik', 'Hech biri buzilmadi'],
          correct: 2,
          explain: 'Maʼlumot kerak boʻlgan paytda mavjud boʻlmadi — bu foydalanuvchanlikning buzilishi. Chorasi: UPS, zaxira kanal va zaxira nusxalar.',
        },
        {
          q: 'Oʻqituvchining paroli fishing xati orqali oʻgʻirlandi, lekin hujumchi elektron jurnalga kira olmadi. Qaysi chora ishladi?',
          options: [
            'Koʻp faktorli autentifikatsiya (MFA): paroldan tashqari ikkinchi dalil talab qilindi',
            'Parol har 30 kunda almashtirilgani',
            'Parolda katta harf va belgi borligi',
            'Kompyuterdagi antivirus',
          ],
          correct: 0,
          explain: 'MFA yoqilgan hisobga kirish uchun parolning oʻzi yetmaydi: telefon yoki apparat kalitdagi ikkinchi dalil ham kerak. Parolning murakkabligi oʻgʻirlangan parolni himoya qilmaydi.',
        },
        {
          q: 'Tashkilot har kecha zaxira nusxa oladi, lekin nusxa oʻsha serverning ikkinchi diskida turadi va undan hech qachon tiklab koʻrilmagan. Asosiy kamchilik nimada?',
          options: [
            'Nusxa juda tez-tez olinmoqda',
            'Zaxira nusxa shifrlanmagan',
            'Nusxa kechasi emas, kunduzi olinishi kerak',
            'Nusxa asl maʼlumot bilan bir joyda va sinalmagan: boshqa joydagi (oflayn) nusxa hamda tiklash sinovi yoʻq',
          ],
          correct: 3,
          explain: '3-2-1 qoidasi buzilgan: server ishdan chiqsa yoki ransomware tushsa, asl maʼlumot ham, nusxa ham birga yoʻqoladi. Tekshirilmagan zaxira esa zaxira hisoblanmaydi.',
        },
      ]} />
    </>
  )
}
