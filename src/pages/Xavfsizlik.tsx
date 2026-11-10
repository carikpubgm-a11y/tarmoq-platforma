import { Link } from 'react-router-dom'
import { Activity, BadgeCheck, HardDrive, KeyRound, Lock, RefreshCw, ScrollText, Smartphone, Zap } from 'lucide-react'
import {
  PageHeader, Goal, Block, Grid, Card, Callout, Pill, Term, Mono, CheckList, StepList, LifeExample, Takeaway, MiniTask,
} from '../components/ui'

/* ------------------------------ Qatlamli himoya (vizual) ------------------------------ */
const LAYERS = [
  { name: 'Inson', what: 'ehtiyotkor foydalanuvchi', fill: '#F5F3FF', text: '#2E1065' },
  { name: 'Chegara', what: 'firewall — tarmoq qorovuli', fill: '#EDE9FE', text: '#2E1065' },
  { name: 'Tarmoq', what: 'boʻlaklarga ajratish', fill: '#DDD6FE', text: '#2E1065' },
  { name: 'Qurilma', what: 'yangilanish va antivirus', fill: '#C4B5FD', text: '#2E1065' },
  { name: 'Hisob', what: 'kuchli parol va MFA', fill: '#A78BFA', text: '#1E1B4B' },
  { name: 'Maʼlumot', what: 'zaxira nusxa', fill: '#6D28D9', text: '#FFFFFF' },
]

function DefenseLayers() {
  const last = LAYERS.length - 1
  return (
    <figure className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-6">
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          <svg viewBox="0 0 800 400" className="h-auto w-full" role="img"
            aria-label="Qatlamli himoya: tashqaridan ichkariga olti qatlam — inson, chegara, tarmoq, qurilma, hisob va maʼlumot">
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
        Hujumchi maʼlumotga yetishi uchun <strong className="font-semibold text-navy-950">hamma qatlamdan</strong> oʻtishi kerak. Bittasi ishlamasa, qolganlari ushlab turadi.
      </figcaption>
    </figure>
  )
}

/* ------------------------------ 3-2-1 qoidasi (vizual) ------------------------------ */
function Rule321() {
  const items: [string, string][] = [['3', 'ta nusxa'], ['2', 'xil joyda'], ['1', 'nusxa boshqa binoda']]
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
        lead={<>Xavfsizlik — faqat antivirus degani emas. U uchta narsani saqlash: maʼlumot <strong>sir</strong> qolsin, <strong>buzilmasin</strong> va kerak boʻlganda <strong>ishlasin</strong>. 🔐</>} />

      <Goal items={[
        'Xavfsizlikning uch ustunini misol bilan tushuntirasiz',
        'Hisobni kuchli parol va MFA bilan himoyalay olasiz',
        'Zaxira nusxaning 3-2-1 qoidasini aytib bera olasiz',
      ]} />

      <Block title="Uch ustun" tone="violet"
        sub={<>Har qanday himoya chorasi shu uchtadan kamida bittasiga ishlaydi.</>}>
        <Grid cols={3}>
          <Card tone="violet" icon={Lock} title="Maxfiylik" tag={<Pill tone="violet">sir qolsin</Pill>}>
            <p>Maʼlumotni faqat ruxsatli odam koʻradi. 🤫</p>
            <div className="mt-3">
              <CheckList kind="dot" items={['Parol va huquqlar', 'Shifrlash (HTTPS, Wi-Fi paroli)']} />
            </div>
          </Card>
          <Card tone="blue" icon={BadgeCheck} title="Yaxlitlik" tag={<Pill tone="blue">buzilmasin</Pill>}>
            <p>Maʼlumot yoʻlda oʻzgarmagan.</p>
            <div className="mt-3">
              <CheckList kind="dot" items={['Oʻzgarishlar jurnali', 'Elektron imzo']} />
            </div>
          </Card>
          <Card tone="amber" icon={Zap} title="Foydalanuvchanlik" tag={<Pill tone="amber">ishlasin</Pill>}>
            <p>Maʼlumot kerak boʻlganda joyida turadi.</p>
            <div className="mt-3">
              <CheckList kind="dot" items={['Zaxira nusxalar', 'Zaxira quvvat manbai (UPS)']} />
            </div>
          </Card>
        </Grid>
      </Block>

      <Block title="Himoya — bitta devor emas, bir necha qatlam" tone="violet"
        sub={<>Maktabga kirish uchun ham darvoza, navbatchi va sinf eshigi bor. Tarmoqda ham shunday.</>}>
        <DefenseLayers />
        <Callout kind="info" title="100% xavfsiz tizim yoʻq" className="mt-4">
          Shuning uchun maqsad — xavfni <strong>kamaytirish</strong> va hujumni <strong>tez sezish</strong>. «Bizda hech narsa boʻlmaydi» degan gap xavfsizlik emas.
        </Callout>
      </Block>

      <Block title="Hisobni qanday himoya qilamiz?" tone="violet"
        sub={<>Tarmoqdagi eng zaif joy — koʻpincha qurilma emas, <strong>hisob</strong>.</>}>
        <Grid cols={3}>
          <Card icon={KeyRound} title="1. Kuchli parol">
            <p><Term en="password">Parol</Term>da eng muhimi — <strong>uzunlik</strong>. Uch-toʻrt soʻzdan iborat ibora <Mono>P@ss1!</Mono> dan kuchliroq. 💪</p>
            <p>Har bir xizmatga alohida parol. Eslab qolish qiyin boʻlsa — parol menejeri.</p>
          </Card>
          <Card tone="blue" icon={Smartphone} title="2. Ikkinchi kalit (MFA)">
            <p>Parol oʻgʻirlansa ham hisob ochilmaydi, chunki ikkinchi dalil soʻraladi:</p>
            <div className="mt-3">
              <CheckList kind="dot" items={[
                <><strong>Bilaman</strong> — parol</>,
                <><strong>Menda bor</strong> — telefon</>,
                <><strong>Oʻzimman</strong> — barmoq izi</>,
              ]} />
            </div>
            <p className="mt-3">SMS kodi — eng zaif turi. Autentifikator ilova ishonchliroq.</p>
          </Card>
          <Card tone="violet" icon={ScrollText} title="3. Huquq va jurnal">
            <p>Har kimga faqat <strong>ishi uchun kerak boʻlgan</strong> huquq beriladi. Oʻquvchiga oʻqituvchining papkasi kerak emas.</p>
            <p>Har bir kirish jurnalga yoziladi — hodisa boʻlsa, nima boʻlganini bilib olamiz.</p>
          </Card>
        </Grid>

        <Callout kind="note" title="Ikki qisqa qoida" className="mt-4">
          <p><strong>Uchta savol:</strong> kim siz? → nimaga ruxsatlisiz? → nima qildingiz? (bu AAA modeli deyiladi).</p>
          <p><strong>Parolni tez-tez almashtirish kerak emas.</strong> U odamni oddiyroq parol tanlashga majbur qiladi. Faqat shubha tugʻilsa almashtiriladi.</p>
        </Callout>
      </Block>

      <Block title="Zaxira nusxa, yangilanish va kuzatuv" tone="violet"
        sub={<>Bu uchlik hujum boʻlmasa ham kerak: kompyuter buzilishi yoki adashib oʻchirish ham xuddi shunday zarar.</>}>
        <Grid cols={3}>
          <Card icon={HardDrive} title="Zaxira: 3-2-1 qoidasi">
            <p>Uy ishini ikkita daftarga koʻchirib yozganday. 📚</p>
            <div className="mt-3"><Rule321 /></div>
            <p className="mt-3">Bitta nusxa <strong>tarmoqdan uzilgan</strong> holda turishi kerak.</p>
          </Card>
          <Card tone="amber" icon={RefreshCw} title="Yangilanish">
            <CheckList kind="dot" items={[
              'Avtomatik yangilashni yoqish',
              'Yangilashdan oldin zaxira olish',
              'Juda eski qurilmani almashtirish',
            ]} />
          </Card>
          <Card tone="blue" icon={Activity} title="Kuzatuv">
            <CheckList kind="dot" items={[
              'Jurnallarni bir joyda yigʻish',
              'Gʻalati holatda ogohlantirish',
              'Vaqti-vaqti bilan koʻrib chiqish',
            ]} />
          </Card>
        </Grid>
        <Callout kind="danger" title="Tekshirilmagan zaxira — zaxira emas" className="mt-4">
          Nusxa olinadi, lekin undan hech qachon tiklab koʻrilmagan boʻlsa, uning ishlashiga ishonch yoʻq. Tiklashni oldindan sinab koʻrish shart.
        </Callout>
      </Block>

      <Block title="Hodisa yuz berganda: 6 qadam" tone="violet"
        sub={<>Tartib oldindan yozib qoʻyiladi — vahima paytida oʻylab topilmaydi.</>}>
        <StepList tone="violet" items={[
          { n: '1', title: 'Tayyorgarlik', text: <>Reja va masʼul shaxslar oldindan belgilanadi.</> },
          { n: '2', title: 'Aniqlash', text: <>Jurnallardan gʻalati holat payqaladi. Tez sezilsa — zarar kam.</> },
          { n: '3', title: 'Ajratish', text: <>Zararlangan kompyuter tarmoqdan uziladi, tarqalish toʻxtaydi.</> },
          { n: '4', title: 'Tozalash', text: <>Zararli dastur oʻchiriladi, parollar almashtiriladi.</> },
          { n: '5', title: 'Tiklash', text: <>Maʼlumot zaxiradan tiklanadi va tekshiriladi.</> },
          { n: '6', title: 'Xulosa', text: <>Nega shunday boʻldi va nima oʻzgaradi? Bu qadam tashlanmaydi.</> },
        ]} />
        <p className="prose-uz mt-4 text-[1rem] text-slate-600">
          Qanday tahdidlar bunga olib keladi — keyingi boʻlimda: <Link to="/tahdidlar">Tahdidlar va himoyalanish</Link>.
        </p>
      </Block>

      <LifeExample>
        <p>Kollej hisobchisi «soliq idorasidan» kelgan xatdagi faylni ochdi. Fayl ichida ransomware bor edi — u hujjatlarni shifrlab qoʻydi. 😟</p>
        <p>Tashkilotni uch qatlam qutqardi:</p>
        <div className="mt-3">
          <CheckList kind="check" items={[
            'buxgalteriya alohida boʻlakda edi — virus sinflarga oʻtmadi;',
            'hisobchida administrator huquqi yoʻq edi — server zarar koʻrmadi;',
            'haftalik oflayn zaxira bor edi — ish bir kunda tiklandi.',
          ]} />
        </div>
      </LifeExample>

      <Takeaway items={[
        <>Xavfsizlik — maʼlumot <strong>sir</strong> qolsin, <strong>buzilmasin</strong> va <strong>ishlasin</strong>.</>,
        <>Himoya bir necha qatlamdan iborat. 100% xavfsiz tizim yoʻq.</>,
        <>Hisobni <strong>uzun parol</strong> va <strong>MFA</strong> himoya qiladi; har kimga faqat kerakli huquq beriladi.</>,
        <><strong>3-2-1</strong>: 3 nusxa, 2 xil joyda, 1 tasi boshqa binoda. Tekshirilmagan zaxira — zaxira emas.</>,
      ]} />

      <MiniTask questions={[
        {
          q: 'Elektr uzilib, maktab serveri yarim kun ishlamadi. Maʼlumot yoʻqolmadi va oʻgʻirlanmadi. Qaysi ustun buzildi? ⚡',
          options: ['Maxfiylik', 'Yaxlitlik', 'Foydalanuvchanlik', 'Hech biri'],
          correct: 2,
          explain: 'Maʼlumot kerak boʻlganda ishlamadi. Chorasi: zaxira quvvat manbai (UPS) va zaxira nusxalar.',
        },
        {
          q: 'Oʻqituvchining paroli oʻgʻirlandi, lekin hujumchi elektron jurnalga kira olmadi. Nima ishladi?',
          options: [
            'MFA — paroldan tashqari ikkinchi dalil soʻraldi',
            'Parolda katta harf borligi',
            'Parol har oy almashtirilgani',
            'Kompyuterdagi antivirus',
          ],
          correct: 0,
          explain: 'MFA yoqilgan boʻlsa, parolning oʻzi yetmaydi: telefondagi ikkinchi kalit ham kerak.',
        },
        {
          q: 'Zaxira nusxa oʻsha serverning ikkinchi diskida turadi va undan hech qachon tiklab koʻrilmagan. Kamchilik nimada? 💾',
          options: [
            'Nusxa juda tez-tez olinmoqda',
            'Nusxa asl maʼlumot bilan bir joyda va sinalmagan',
            'Nusxa kunduzi olinishi kerak',
            'Nusxa shifrlanmagan',
          ],
          correct: 1,
          explain: '3-2-1 qoidasi buzilgan: server ishdan chiqsa, asl maʼlumot ham, nusxa ham birga yoʻqoladi.',
        },
      ]} />
    </>
  )
}
