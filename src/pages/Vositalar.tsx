import { Link } from 'react-router-dom'
import {
  ArrowRight, Compass, ExternalLink, Gamepad2, GraduationCap, Network, Puzzle, StickyNote, Workflow, Wrench,
  type LucideIcon,
} from 'lucide-react'
import {
  Block, Callout, Card, DataTable, Goal, Grid, LifeExample, MiniTask, PageHeader, Pill, StepList, Takeaway, TONE, cx,
  type Tone,
} from '../components/ui'

/* ------------------------------ Maʼlumot ------------------------------ */
interface Tool {
  id: string
  name: string
  kind: string
  tone: Tone
  icon: LucideIcon
  url: string
  /** Kirish shartlari — qisqa belgilar */
  needs: string[]
  why: string
  inTopic: string
  student: string[]
  teacher: string
  stage: string
  supports: string
  /** Platformadagi muqobili */
  local: { to: string; label: string; note: string }
}

const TOOLS: Tool[] = [
  {
    id: 'packet-tracer',
    name: 'Cisco Packet Tracer',
    kind: 'Tarmoq simulyatori',
    tone: 'blue',
    icon: Network,
    url: 'https://www.netacad.com/cisco-packet-tracer',
    needs: ['Kompyuterga oʻrnatiladi', 'Cisco Networking Academy hisobi kerak'],
    why: 'Tarmoqni virtual muhitda loyihalash va sinab koʻrish vositasi. Haqiqiy switch, router va kabellar boʻlmasa ham, tarmoqni ekranda yigʻish, sozlash va paketning yoʻlini qadam-baqadam kuzatish mumkin.',
    inTopic: 'Topologiya, qurilmalar va IP manzillash mavzularini amalda mustahkamlaydi: oʻquvchi «10 ta kompyuter va 1 ta printer» tarmogʻini yigʻadi, manzil beradi va aloqani tekshiradi. Simulyatsiya rejimida paket switch va routerdan qanday oʻtishi koʻrinadi.',
    student: [
      'Qurilmalarni ish maydoniga joylaydi va kabel bilan ulaydi.',
      'Har bir qurilmaga IP-manzil va tarmoq maskasini beradi.',
      'Ping yuborib aloqani tekshiradi; xato chiqsa, sababini topib tuzatadi.',
    ],
    teacher: 'Dasturni dars oldidan barcha kompyuterlarga oʻrnatib, hisobga kirib qoʻying. Yarim tayyor sxema faylini tarqatsangiz, vaqt tejaladi: oʻquvchi noldan emas, aniq vazifadan boshlaydi.',
    stage: 'Koʻrgazma va amaliyot',
    supports: 'Namoyish, amaliy topshiriq',
    local: { to: '/laboratoriya', label: 'Tarmoq konstruktori', note: 'qurilma qoʻshish, kabel ulash, IP sozlash va paket yuborish' },
  },
  {
    id: 'padlet',
    name: 'Padlet',
    kind: 'Umumiy onlayn doska',
    tone: 'rose',
    icon: StickyNote,
    url: 'https://padlet.com',
    needs: ['Brauzerda ishlaydi', 'Oʻquvchiga havola yoki QR-kod yetarli'],
    why: 'Guruh boʻlib fikr almashish vositasi. Ishtirokchilar bitta umumiy doskaga matn, rasm yoki havola koʻrinishidagi yozuvlarni joylaydi va bir-birining fikrini real vaqtda koʻradi.',
    inTopic: 'Snowball metodini qoʻllab-quvvatlaydi: «Tarmoq xavfsizligi uchun eng muhim uchta chora qaysi?» savoliga avval har bir oʻquvchi, soʻng juftlik va toʻrtlik oʻz javobini doskaga yozadi. Fikrlar yoʻqolmaydi va yakunda butun guruh bilan solishtiriladi.',
    student: [
      'Havola yoki QR-kod orqali doskaga kiradi.',
      'Oʻz fikrini alohida yozuv qilib joylaydi.',
      'Boshqalarning yozuvlarini oʻqiydi, oʻxshashlarini birlashtiradi va izoh qoldiradi.',
    ],
    teacher: 'Doskani dars oldidan yarating va ustunlarni tayyorlab qoʻying: «Yakka», «Juftlik», «Guruh». Bepul tarifda doskalar soni cheklangan, shuning uchun eskilarini arxivlab boring.',
    stage: 'Kirish, guruh ishi, refleksiya',
    supports: 'Snowball, muammoli taʼlim',
    local: { to: '/metodika/snowball', label: 'Snowball mashgʻuloti', note: 'fikrlarni 1 → 2 → 4 bosqichida yigʻish va ekspert roʻyxati bilan solishtirish' },
  },
  {
    id: 'kahoot',
    name: 'Kahoot!',
    kind: 'Oʻyin shaklidagi viktorina',
    tone: 'violet',
    icon: Gamepad2,
    url: 'https://kahoot.com',
    needs: ['Brauzerda ishlaydi', 'Har bir oʻquvchida qurilma va internet boʻlishi kerak'],
    why: 'Bilimni interaktiv tekshirish vositasi. Oʻqituvchi savollarni katta ekranda koʻrsatadi, oʻquvchilar oʻz qurilmasidan javob beradi; natija va reyting darhol chiqadi.',
    inTopic: 'Yangi mavzudan keyin tezkor mustahkamlash uchun qoʻllanadi: «Switch qaysi qatlamda ishlaydi?», «169.254.x.x manzili nimani bildiradi?» kabi savollar. Har bir savoldan keyin javoblar taqsimoti koʻrinadi — qaysi tushuncha qiyin boʻlgani darhol ayon boʻladi.',
    student: [
      'Oʻyin PIN-kodi orqali telefon yoki kompyuterdan qoʻshiladi.',
      'Ekrandagi savolga vaqt tugaguncha javob beradi.',
      'Har bir savoldan keyin toʻgʻri javobni va oʻz oʻrnini koʻradi.',
    ],
    teacher: 'Tezlik uchun beriladigan ball chuqur oʻylashga xalaqit berishi mumkin. Har bir savoldan keyin toʻxtab, «nega aynan shu javob?» deb soʻrang. Bu vosita formativ baholash uchun — yakuniy bahoni unga asoslamang.',
    stage: 'Mustahkamlash va test',
    supports: 'Formativ baholash, suhbat',
    local: { to: '/test', label: 'Test markazi', note: '18 ta vaziyatli savol, har bir javobdan keyin izoh va mavzular kesimidagi natija' },
  },
  {
    id: 'learningapps',
    name: 'LearningApps',
    kind: 'Qisqa interaktiv mashqlar',
    tone: 'green',
    icon: Puzzle,
    url: 'https://learningapps.org',
    needs: ['Brauzerda ishlaydi', 'Mashq havola orqali tarqatiladi'],
    why: 'Moslashtirish, juftlash, tartiblash, krossvord kabi kichik mashqlarni tayyor andozalar asosida yaratish vositasi. Mashq bir necha daqiqada tuziladi va havola orqali tarqatiladi.',
    inTopic: 'Atama va tushunchalarni mustahkamlaydi: qurilmani vazifasi bilan juftlash (switch — MAC-manzil, router — IP-manzil), tahdidni himoya chorasi bilan moslashtirish (fishing — MFA, ransomware — oflayn zaxira), DHCP jarayonining toʻrt qadamini toʻgʻri tartibga qoʻyish.',
    student: [
      'Havola orqali mashqni ochadi.',
      'Juftliklarni topadi yoki elementlarni toʻgʻri tartibga qoʻyadi.',
      'Natijani tekshiradi va xatosini shu zahoti tuzatadi.',
    ],
    teacher: 'Bitta mashq — bitta tushuncha: 6–8 juftlikdan oshirmang. Kuchli oʻquvchilarga mashqni oʻzlari tuzishni topshiring — savol tuzish javob berishdan koʻra chuqurroq oʻrgatadi.',
    stage: 'Yangi mavzuni mustahkamlash',
    supports: 'Mustaqil ish, juftlikda tekshirish',
    local: { to: '/qurilmalar', label: 'Boʻlim oxiridagi interaktiv topshiriqlar', note: 'har bir nazariy boʻlim «oʻzingizni tekshiring» topshirigʻi bilan tugaydi' },
  },
  {
    id: 'diagrams',
    name: 'diagrams.net',
    kind: 'Sxema muharriri',
    tone: 'amber',
    icon: Workflow,
    url: 'https://www.drawio.com',
    needs: ['Brauzerda ishlaydi', 'Roʻyxatdan oʻtish shart emas'],
    why: 'Tarmoq sxemalari va diagrammalarni chizish vositasi (draw.io nomi bilan ham tanilgan). Tayyor shakllar kutubxonasida tarmoq qurilmalarining belgilari bor; sxema rasm yoki PDF koʻrinishida saqlanadi.',
    inTopic: 'Loyihalash bosqichida ishlatiladi: oʻquvchi maktab tarmogʻining mantiqiy sxemasini chizadi, qurilmalarni belgilaydi, IP-reja va segment chegaralarini yozib qoʻyadi. Bunday sxema «ishlamaydi» — u hujjat, lekin loyihani himoya qilish uchun aynan shunday hujjat kerak.',
    student: [
      'Shakllar kutubxonasidan tarmoq qurilmalari belgilarini tanlaydi.',
      'Qurilmalarni chiziqlar bilan ulab, nomi va IP-manzilini yozadi.',
      'Sxemani rasm yoki PDF qilib saqlaydi va hisobotiga qoʻshadi.',
    ],
    teacher: 'Avval qogʻozda qoralama chizdiring, keyin dasturga oʻtkazing — aks holda vaqt shakllarni bezashga ketadi. Baholashda chiroyni emas, sxemaning toʻgʻriligini va shartli belgilar izohini tekshiring.',
    stage: 'Loyihalash va hisobot',
    supports: 'Loyiha metodi, amaliy topshiriq',
    local: { to: '/laboratoriya', label: 'Tarmoq konstruktori', note: 'sxema chiziladi va shu joyning oʻzida ishlashi tekshiriladi' },
  },
]

const LINK = 'font-semibold text-blue-700 underline decoration-blue-300 underline-offset-2 hover:decoration-blue-600'

function host(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
}
function scrollToTool(id: string) {
  document.getElementById('vosita-' + id)?.scrollIntoView({ block: 'start' })
}

/* ------------------------------ Vosita kartasi ------------------------------ */
function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const t = TONE[tool.tone]
  const Icon = tool.icon
  return (
    <article id={'vosita-' + tool.id} className={cx('relative scroll-mt-24 overflow-hidden rounded-2xl border bg-white shadow-card', t.border)}>
      <span className={cx('absolute inset-x-0 top-0 h-1', t.bar)} />

      <header className="flex flex-wrap items-start gap-4 p-5 sm:p-6">
        <span className={cx('grid h-14 w-14 flex-none place-items-center rounded-2xl', t.soft, t.text)} aria-hidden="true"><Icon size={28} /></span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-bold text-slate-400">{String(index + 1).padStart(2, '0')}</span>
            <Pill tone={tool.tone}>{tool.kind}</Pill>
          </div>
          <h3 className="mt-1.5 text-2xl font-extrabold leading-tight">{tool.name}</h3>
          <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
            {tool.needs.map(n => <li key={n} className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-slate-300" />{n}</li>)}
          </ul>
        </div>
        <a href={tool.url} target="_blank" rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-navy-950 px-4 py-3 text-[0.95rem] font-semibold text-white transition hover:bg-navy-800 sm:w-auto">
          Rasmiy sayt: {host(tool.url).split('/')[0]}
          <ExternalLink size={16} aria-hidden="true" />
          <span className="sr-only">(yangi oynada ochiladi)</span>
        </a>
      </header>

      <div className="grid gap-x-8 gap-y-6 border-t border-slate-100 px-5 py-5 sm:px-6 md:grid-cols-2">
        <section>
          <h4 className={cx('text-xs font-bold uppercase tracking-[0.12em]', t.text)}>Nima uchun ishlatiladi?</h4>
          <p className="mt-2 text-[0.97rem] leading-relaxed text-slate-600">{tool.why}</p>
        </section>
        <section>
          <h4 className={cx('text-xs font-bold uppercase tracking-[0.12em]', t.text)}>Ushbu mavzuda qanday qoʻllanadi?</h4>
          <p className="mt-2 text-[0.97rem] leading-relaxed text-slate-600">{tool.inTopic}</p>
        </section>
        <section>
          <h4 className={cx('text-xs font-bold uppercase tracking-[0.12em]', t.text)}>Oʻquvchi nima bajaradi?</h4>
          <ol className="mt-2 space-y-2 text-[0.97rem] leading-relaxed text-slate-600">
            {tool.student.map((s, i) => (
              <li key={i} className="flex gap-2.5">
                <span className={cx('mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-md font-mono text-xs font-bold', t.chip)}>{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </section>
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-amber-900"><GraduationCap size={16} />Oʻqituvchi uchun tavsiya</h4>
          <p className="mt-2 text-[0.97rem] leading-relaxed text-slate-700">{tool.teacher}</p>
        </section>
      </div>

      <footer className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-100 bg-slate-50 px-5 py-3.5 text-[0.95rem] text-slate-600 sm:px-6">
        <span className="font-semibold text-navy-950">Platformadagi muqobili:</span>
        <Link to={tool.local.to} className={cx(LINK, 'inline-flex items-center gap-1')}>{tool.local.label}<ArrowRight size={15} /></Link>
        <span className="text-slate-500">— {tool.local.note}</span>
      </footer>
    </article>
  )
}

/* ==========================================================================
   Sahifa
   ========================================================================== */
export default function Vositalar() {
  return (
    <>
      <PageHeader
        no="12.6"
        tone="amber"
        eyebrow="Metodika"
        title="Raqamli taʼlim vositalari"
        lead={<>Metod darsni <strong>qanday</strong> oʻtishni belgilaydi, vosita esa uni <strong>nima yordamida</strong> amalga oshirishni. Quyida mavzuni oʻqitishda ishlatiladigan beshta raqamli vosita va ularning dars jarayonidagi oʻrni.</>}
      />

      <Goal
        items={[
          'Pedagogik metod bilan raqamli vositaning farqini tushuntira olish.',
          'Beshta vositaning har biri qaysi vazifa uchun mosligini aniqlash.',
          'Har bir vositani darsning aniq bosqichiga va platformadagi muqobiliga bogʻlash.',
        ]}
      />

      <Block tone="amber" title="Metod va vosita — bir narsa emas" sub="Bu ikki tushuncha koʻpincha aralashtiriladi. Dars rejasida avval metod, keyin vosita tanlanadi.">
        <Grid cols={2}>
          <Card tone="violet" icon={Compass} title="Metod — «qanday oʻqitamiz?»" tag={<Pill tone="violet">pedagogik metod</Pill>}>
            <p>Darsdagi faoliyat tartibi: kim nima qiladi, qaysi ketma-ketlikda va nima uchun. Metod kompyutersiz ham ishlaydi.</p>
            <p>
              Bu platformada:{' '}
              <Link to="/metodika/muammoli">muammoli taʼlim</Link>, <Link to="/metodika/snowball">Snowball</Link>,{' '}
              <Link to="/metodika/jurnal">Double-Entry Journal</Link>, <Link to="/metodika/namoyish">namoyish</Link>,{' '}
              <Link to="/metodika/amaliy">amaliy topshiriq</Link>.
            </p>
          </Card>
          <Card tone="amber" icon={Wrench} title="Vosita — «nima yordamida?»" tag={<Pill tone="amber">raqamli vosita</Pill>}>
            <p>Metodni amalga oshirishni yengillashtiradigan dastur yoki onlayn xizmat. Vosita dars maqsadini oʻzi belgilamaydi va metodning oʻrnini bosmaydi.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {TOOLS.map(tool => (
                <button key={tool.id} type="button" onClick={() => scrollToTool(tool.id)}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-navy-950 transition hover:border-amber-500 hover:bg-amber-50">
                  {tool.name}
                </button>
              ))}
            </div>
          </Card>
        </Grid>
        <Callout kind="note" title="Farqni aniq ayting" className="mt-4">
          <p><strong>Snowball</strong> va <strong>muammoli taʼlim</strong> — pedagogik <strong>metodlar</strong>: ular fikr qanday tartibda yigʻilishini va bilim qanday yoʻl bilan kashf etilishini belgilaydi.</p>
          <p><strong>Padlet</strong> va <strong>Kahoot!</strong> — raqamli <strong>vositalar</strong>: Padlet Snowball bosqichlaridagi fikrlarni bitta doskada yigʻishga, Kahoot! esa bilimni tezkor tekshirishga yordam beradi. Padlet ochilgani bilan dars Snowball boʻlib qolmaydi; Snowball metodini esa oddiy doska va qogʻoz bilan ham oʻtkazish mumkin.</p>
        </Callout>
      </Block>

      <Block tone="amber" title="Beshta vosita" sub="Har bir karta bir xil savollarga javob beradi: nima uchun ishlatiladi, ushbu mavzuda qanday qoʻllanadi, oʻquvchi nima bajaradi va oʻqituvchi nimaga eʼtibor berishi kerak.">
        <div className="space-y-5">
          {TOOLS.map((tool, i) => <ToolCard key={tool.id} tool={tool} index={i} />)}
        </div>
      </Block>

      <Block tone="amber" title="Vosita, dars bosqichi va platformadagi muqobili" sub="Har bir tashqi vositaning vazifasini platformaning oʻz boʻlimi ham bajara oladi.">
        <DataTable
          head={['Vosita', 'Dars bosqichi', 'Qaysi metodni qoʻllab-quvvatlaydi', 'Platformadagi muqobili']}
          rows={TOOLS.map(tool => [
            <button key="n" type="button" onClick={() => scrollToTool(tool.id)} className="text-left font-semibold text-navy-950 underline decoration-slate-300 underline-offset-2 hover:decoration-navy-950">{tool.name}</button>,
            tool.stage,
            tool.supports,
            <Link key="l" to={tool.local.to} className={cx(LINK, 'inline-flex items-center gap-1')}>{tool.local.label}<ArrowRight size={15} /></Link>,
          ])}
        />
        <Callout kind="success" title="Tashqi xizmat ishlamasa ham dars toʻxtamaydi" className="mt-4">
          Yuqoridagi vositalar internet, roʻyxatdan oʻtish yoki oʻrnatishni talab qilishi mumkin. Platformaning oʻz funksiyalari — tarmoq konstruktori, firewall laboratoriyasi, Snowball mashgʻuloti va test markazi — bu xizmatlarga bogʻliq emas: ular mavjud boʻlmasa ham toʻliq ishlayveradi. Tashqi vositalar — qoʻshimcha imkoniyat, majburiy shart emas.
        </Callout>
      </Block>

      <Block tone="amber" title="Vositani qanday tanlash kerak?">
        <StepList
          tone="amber"
          items={[
            { title: 'Avval maqsad, keyin metod, oxirida vosita', text: '«Kahoot! oʻtkazamiz» — bu dars maqsadi emas. Maqsad: «oʻquvchi switch va router farqini tushuntira oladi». Vosita shu maqsadga xizmat qilsagina tanlanadi.' },
            { title: 'Bitta darsda bir-ikki vosita yetarli', text: 'Har bir yangi vosita kirish, sozlash va tushuntirish uchun vaqt oladi. Vositalar koʻpaysa, diqqat mavzudan texnikaga oʻtib ketadi.' },
            { title: 'Zaxira rejangiz boʻlsin', text: 'Internet uzilishi yoki sayt ochilmasligi mumkin. Har bir vosita uchun oflayn variantni oldindan oʻylab qoʻying: qogʻoz stikerlar, doska yoki platformaning oʻz boʻlimi.' },
            { title: 'Oʻquvchining maʼlumotini asrang', text: 'Roʻyxatdan oʻtishni talab qiladigan xizmatlarda oʻquvchilardan ortiqcha shaxsiy maʼlumot soʻralmasin. Imkoni boʻlsa, havola orqali kiriladigan rejimdan foydalaning.' },
          ]}
        />
      </Block>

      <LifeExample>
        <p>Informatika oʻqituvchisi Snowball metodi uchun Padlet doskasini tayyorlab qoʻygan edi, lekin dars boshida maktabda internet uzilib qoldi. U sarosimaga tushmadi: oʻquvchilarga stiker tarqatdi, fikrlar oddiy doskaga yopishtirildi — «1 → 2 → 4» tartibi oʻzgarmadi.</p>
        <p>Keyingi darsda internet tiklangach, xuddi shu ish Padlet doskasida bajarildi. <strong>Metod oʻsha-oʻsha qoldi, faqat vosita almashdi.</strong> Shuning uchun dars rejasida avval metod, keyin vosita yoziladi.</p>
      </LifeExample>

      <Takeaway
        items={[
          <>Snowball va muammoli taʼlim — <strong>metodlar</strong>; Padlet va Kahoot! — ularni qoʻllab-quvvatlaydigan <strong>vositalar</strong>.</>,
          <>Cisco Packet Tracer tarmoqni <strong>simulyatsiya qiladi</strong>, diagrams.net esa faqat <strong>chizadi</strong> — vazifasi boshqa-boshqa.</>,
          <>Kahoot! va LearningApps — formativ baholash va mustahkamlash uchun; yakuniy baho ularga asoslanmaydi.</>,
          <>Har bir tashqi vositaning platformada muqobili bor — internet boʻlmasa ham dars davom etadi.</>,
        ]}
      />

      <MiniTask
        intro="Vaziyatga mos vositani tanlang — izoh darhol chiqadi."
        questions={[
          {
            q: 'Snowball metodining yakuniy bosqichida oʻqituvchi toʻrt kishilik guruhlarning fikrlarini bitta umumiy doskada yigʻib, butun auditoriyaga koʻrsatmoqchi. Qaysi vosita eng mos?',
            options: ['Kahoot!', 'Padlet', 'Cisco Packet Tracer', 'diagrams.net'],
            correct: 1,
            explain: 'Padlet — umumiy onlayn doska: har bir guruh oʻz yozuvini joylaydi va hamma bir-birining fikrini koʻradi. Eʼtibor bering: Snowball — metod, Padlet esa uni qoʻllab-quvvatlaydigan vosita. Kahoot! bilimni tekshiradi, Packet Tracer va diagrams.net esa tarmoq sxemasi bilan ishlaydi.',
          },
          {
            q: 'Oʻquvchilar switch, router va kompyuterlarni ulab, paket manzilga yetib borishini virtual muhitda sinab koʻrishi kerak. Qaysi vosita kerak?',
            options: ['LearningApps', 'diagrams.net', 'Cisco Packet Tracer', 'Padlet'],
            correct: 2,
            explain: 'Cisco Packet Tracer — tarmoq simulyatori: unda qurilmalar sozlanadi va paketning yoʻli kuzatiladi. diagrams.net muharririda ham sxema chizish mumkin, lekin bunday sxema «ishlamaydi» — unda paket yuborib boʻlmaydi. Platformada xuddi shu vazifani tarmoq konstruktori bajaradi.',
          },
        ]}
      />
    </>
  )
}
