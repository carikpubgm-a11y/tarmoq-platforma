import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Block, Callout, Card, CheckList, DataTable, Goal, Grid, KV, LifeExample, MiniTask, PageHeader, Pill, Takeaway, TONE, cx } from '../components/ui'
import { SECTIONS } from '../data/sections'

const METHODS = SECTIONS.filter(s => s.path.startsWith('/metodika/'))
const WHEN: Record<string, { when: string; time: string }> = {
  '/metodika/muammoli': { when: 'Yangi mavzuga kirishda: «20 kompyuterli tarmoqni qanday loyihalaysiz?»', time: '10–15 daqiqa' },
  '/metodika/snowball': { when: 'Mustahkamlashda: xavfsizlik choralarini saralash va asoslash', time: '10–12 daqiqa' },
  '/metodika/jurnal': { when: 'Dars boshida va oxirida: bilimdagi oʻzgarishni koʻrsatish', time: '2 × 4 daqiqa' },
  '/metodika/namoyish': { when: 'Yangi mavzuni tushuntirishda: tarmoqni ekranda bosqichma-bosqich qurish', time: '8–10 daqiqa' },
  '/metodika/amaliy': { when: 'Koʻnikma hosil qilishda: 10 kompyuter va 1 printerli tarmoq', time: '15–20 daqiqa' },
}

export default function Metodika() {
  return (
    <>
      <PageHeader no="12" tone="amber" eyebrow="Oʻqitish metodikasi" title="Darsni qanday tashkil qilish kerak?"
        lead={<>Texnik mazmun tayyor. Endi asosiy savol — uni talabaga <strong>qanday yetkazish</strong>. Bu boʻlimda dars rejasi va platformaning oʻzida bajariladigan besh metod jamlangan.</>} />
      <Goal items={[
        '45 daqiqalik darsni bosqichlarga boʻlib rejalashtirish',
        'Har bir bosqichga mos interaktiv metodni tanlash va amalda qoʻllash',
        'Formativ va summativ baholashni farqlab, ikkalasidan foydalanish',
        'Talabalarning keng tarqalgan xato tasavvurlarini oldindan bartaraf etish',
      ]} />

      <Block title="45 daqiqalik dars rejasi" tone="amber" sub="Har bir bosqich platformaning muayyan boʻlimiga tayanadi.">
        <DataTable head={['Vaqt', 'Bosqich', 'Oʻqituvchi nima qiladi', 'Talaba nima qiladi', 'Platformada']} rows={[
          [<span className="font-mono">0–5</span>, <strong>Kirish</strong>, 'Muammoli savol beradi: «20 kompyuter bir-birini qanday koʻradi?»', 'Taxmin qiladi, bahslashadi; jurnalning chap ustunini toʻldiradi', <Link to="/metodika/jurnal">Double-Entry Journal</Link>],
          [<span className="font-mono">5–15</span>, <strong>Yangi mavzu</strong>, 'Tushunchalarni tushuntiradi: asoslar, turlari, qurilmalar', 'Tinglaydi, yozadi, savol beradi', <Link to="/kirish">Nazariy boʻlimlar</Link>],
          [<span className="font-mono">15–25</span>, <strong>Namoyish</strong>, 'Topologiya va paket oqimini ekranda koʻrsatadi', 'Kuzatadi, «nima boʻladi?» deb bashorat qiladi', <Link to="/metodika/namoyish">Namoyish metodi</Link>],
          [<span className="font-mono">25–38</span>, <strong>Amaliyot</strong>, 'Guruhlarga topshiriq beradi, yordam koʻrsatadi', 'Tarmoqni quradi, sozlaydi, himoya qiladi', <Link to="/metodika/amaliy">Amaliy topshiriq</Link>],
          [<span className="font-mono">38–43</span>, <strong>Test</strong>, 'Vaziyatli testni oʻtkazadi', 'Mustaqil javob beradi, izohni oʻqiydi', <Link to="/test">Test markazi</Link>],
          [<span className="font-mono">43–45</span>, <strong>Refleksiya</strong>, '«Bugun nimani tushundingiz?» deb soʻraydi', 'Jurnalning oʻng ustunini toʻldiradi, xulosa yozadi', <Link to="/xulosa">3-2-1 refleksiya</Link>],
        ]} />
        <Callout kind="note" title="80 daqiqalik universitet juftligi uchun" className="mt-4">
          Amaliyot bosqichi kengaytiriladi: <Link to="/metodika/muammoli">muammoli taʼlim</Link> (15 daqiqa) va <Link to="/metodika/snowball">Snowball</Link> (12 daqiqa) qoʻshiladi, laboratoriyada esa <Link to="/laboratoriya/firewall">firewall tajribasi</Link> bajariladi.
        </Callout>
      </Block>

      <Block title="Platformada bajariladigan besh metod" tone="amber" sub="Har biri alohida sahifada: metod pasporti (maqsad, bosqichlar, rollar, mezon) va ishlaydigan mashgʻulot.">
        <div className="grid gap-4 md:grid-cols-2">
          {METHODS.map(m => (
            <Link key={m.path} to={m.path} className="group flex gap-4 rounded-2xl border border-amber-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-amber-500 hover:shadow-lift">
              <span className={cx('grid h-12 w-12 flex-none place-items-center rounded-xl', TONE.amber.solid)}><m.icon size={24} /></span>
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-xs font-bold text-amber-700">{m.no}</span>
                <span className="block font-display text-lg font-bold text-navy-950">{m.title}</span>
                <span className="mt-1 block text-[0.94rem] text-slate-600">{WHEN[m.path].when}</span>
                <span className="mt-2 inline-flex items-center gap-2"><Pill tone="amber">{WHEN[m.path].time}</Pill><span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-700">Mashgʻulotni ochish <ArrowRight size={15} className="transition group-hover:translate-x-1" /></span></span>
              </span>
            </Link>
          ))}
          <Link to="/vositalar" className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition hover:border-amber-500">
            <span className="min-w-0 flex-1">
              <span className="block font-mono text-xs font-bold text-slate-500">12.6</span>
              <span className="block font-display text-lg font-bold text-navy-950">Raqamli taʼlim vositalari</span>
              <span className="mt-1 block text-[0.94rem] text-slate-600">Packet Tracer, Padlet, Kahoot!, LearningApps, diagrams.net — metodlarni qoʻllab-quvvatlovchi vositalar.</span>
            </span>
            <ArrowRight className="mt-1 text-slate-400 transition group-hover:translate-x-1 group-hover:text-amber-600" />
          </Link>
        </div>
      </Block>

      <Block title="Yana qanday metodlar mos keladi?" tone="blue" sub="Mavzu mazmuniga qarab quyidagi usullar ham samarali.">
        <Grid cols={3}>
          <Card tone="blue" title="Koʻrgazmalilik"><p>Animatsiya va sxema orqali koʻrsatish — ayniqsa paket oqimi va topologiyalar uchun. Mavhum narsa koʻrinadigan boʻladi.</p></Card>
          <Card tone="teal" title="Loyiha metodi"><p>Guruh tarmoq loyihasini tuzadi va himoya qiladi. Vaqt talab qiladi, lekin eng chuqur natija beradi.</p></Card>
          <Card tone="violet" title="Keys-stadi"><p>Real vaziyat: «Internet ishlamayapti, sababini toping». Diagnostika koʻnikmasini beradi — universitet uchun juda mos.</p></Card>
          <Card tone="amber" title="Suhbat (dialog)"><p>Savol-javob orqali bilimni aniqlash. Har bir javobdan keyin «nega?» deb soʻrash — formativ baholashning asosi.</p></Card>
          <Card tone="green" title="Juftlikda tekshirish"><p>Talabalar bir-birining sxemasini tekshiradi. Tushuntirish — eng yaxshi oʻrganish usuli; katta auditoriyada vaqtni tejaydi.</p></Card>
          <Card tone="rose" title="Xato tahlili"><p>Ataylab notoʻgʻri sozlangan tarmoq beriladi: talaba xatoni topadi va sababini aytadi.</p></Card>
        </Grid>
      </Block>

      <Block title="Baholash va refleksiya" tone="green">
        <Grid cols={2}>
          <Card tone="green" title="Baholashning ikki turi">
            <KV items={[
              ['Formativ', <>Dars davomida — savol-javob, kuzatish, kichik topshiriq. Maqsad: <em>yoʻnaltirish</em>.</>],
              ['Summativ', <>Dars oxirida — test, loyiha himoyasi. Maqsad: <em>natijani oʻlchash</em>.</>],
            ]} />
            <p className="mt-3 text-sm">Faqat summativ baholash — eng koʻp uchraydigan metodik xato: talaba xato qilib, uni tuzatish imkonini olmasa, baho oʻrganishga yordam bermaydi.</p>
          </Card>
          <Card tone="amber" title="Refleksiya usullari">
            <CheckList kind="dot" items={[
              <><strong>3-2-1:</strong> 3 ta fakt, 2 ta savol, 1 ta xulosa</>,
              <><strong>Bildim / bilmoqchiman / oʻrgandim</strong> jadvali</>,
              <><strong>Bir jumla:</strong> «Bugun eng muhim narsa — …»</>,
              <><strong>Xato tahlili:</strong> qaysi javob nima uchun xato edi?</>,
            ]} />
          </Card>
        </Grid>
      </Block>

      <Block title="Koʻp uchraydigan xato tasavvurlar" tone="rose" sub="Ularni oldindan aytib qoʻyish darsni ancha samarali qiladi.">
        <DataTable head={['Xato tasavvur', 'Aslida', 'Qanday tuzatiladi']} rows={[
          ['«Switch tarmoqlarni bogʻlaydi»', 'Switch bitta tarmoq ichida ishlaydi; tarmoqlarni router bogʻlaydi', <>Laboratoriyada <Link to="/laboratoriya">«Ikki tarmoq + router»</Link> andozasini koʻrsatish</>],
          ['«Wi-Fi — tarmoq turi»', 'Wi-Fi — ulanish texnologiyasi; turi — WLAN', 'Kabel va Wi-Fi bitta LAN ekanini koʻrsatish'],
          ['«Internet va WAN — bir narsa»', 'Internet — eng katta WAN, lekin yagona WAN emas', 'Bank filiallari tarmogʻi misoli'],
          ['«Antivirus yetarli»', 'Himoya qatlamli boʻlishi kerak', 'Fishing misoli: antivirus uni toʻxtatmaydi'],
          ['«Paket butun fayl boʻlib boradi»', 'Fayl koʻplab paketlarga boʻlinadi', 'Rasmni boʻlaklarga boʻlib koʻrsatish'],
          ['«Firewall — bu antivirus»', 'Firewall trafikni filtrlaydi, fayl ichini tekshirmaydi', <Link to="/metodika/jurnal">Double-Entry Journal</Link>],
        ]} />
      </Block>

      <LifeExample>
        Talaba «router — tarmoqlarni bogʻlaydigan qurilma» deb yodlab olgan, lekin «nega switch buni qila olmaydi?» degan savolga javob bera olmaydi. Oʻqituvchi taʼrifni takrorlamaydi — laboratoriyada ikki xil tarmoqni bitta switchga ulab, paket yuborishni soʻraydi. «Aloqa yoʻq» natijasi va uning izohi taʼrifdan koʻra koʻproq oʻrgatadi.
      </LifeExample>

      <Takeaway items={[
        'Har bir yangi tushuncha taʼrif bilan emas, muammo bilan boshlanadi.',
        'Metod mavzuga xizmat qiladi: namoyish — tushuntirishda, amaliy topshiriq — koʻnikmada, Snowball — mustahkamlashda.',
        'Baholashda javob emas, asos baholanadi: «Nega switch, nega router emas?»',
      ]} />

      <MiniTask questions={[
        { q: 'Oʻqituvchi dars oxirida test oʻtkazdi va baho qoʻydi, lekin dars davomida hech kimdan savol soʻramadi. Bu qanday metodik xato?',
          options: ['Summativ baholash yoʻq', 'Formativ baholash yoʻq — talaba xatosini tuzatish imkonini olmadi', 'Test savollari juda oson', 'Refleksiya ortiqcha oʻtkazildi'], correct: 1,
          explain: 'Dars oxiridagi test — summativ baholash. Dars davomida yoʻnaltiruvchi (formativ) baholash boʻlmasa, talaba xatosini vaqtida tuzata olmaydi.' },
        { q: 'Talabalar xavfsizlik choralarini bilishadi, lekin qaysi biri muhimroq ekanini asoslay olmaydi. Qaysi metod eng mos?',
          options: ['Maʼruza oʻqish', 'Snowball: yakka → juftlik → guruhda saralash va asoslash', 'Taʼriflarni yozdirish', 'Uyga vazifa berish'], correct: 1,
          explain: 'Snowball har bir bosqichda fikrlarni solishtirish va tanlashni talab qiladi — talaba ustuvorlikni asoslashga majbur boʻladi.' },
      ]} />
    </>
  )
}
