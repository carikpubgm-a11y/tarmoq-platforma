import { useId } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CircleCheck, Eraser, ExternalLink, FlaskConical, ListChecks, Save } from 'lucide-react'
import { Block, Btn, Callout, Goal, PageHeader, Pill, StepList, Takeaway, TONE, cx, type Tone } from '../components/ui'
import { useStored } from '../lib/storage'

/* ------------------------------ Yetti asosiy fikr ------------------------------ */
const IDEAS: { title: string; text: string; tone: Tone; to: string; section: string }[] = [
  { title: 'Tarmoq — kelishuv natijasi', text: 'Qurilmalar soni emas, protokol (kelishilgan qoidalar) tarmoqni tarmoq qiladi.', tone: 'blue', to: '/kirish', section: 'Tarmoqqa kirish' },
  { title: 'Switch — ichkarida, router — orasida', text: 'Switch MAC-manzil boʻyicha bitta tarmoq ichida, router IP-manzil boʻyicha tarmoqlar orasida ishlaydi.', tone: 'teal', to: '/qurilmalar', section: 'Qurilmalar' },
  { title: 'Topologiya nosozlikka chidamlilikni belgilaydi', text: 'Yulduzda bitta kabel uzilsa, faqat bitta qurilma aloqasiz qoladi. Shinada esa bitta uzilish butun tarmoqni boʻlib qoʻyadi.', tone: 'teal', to: '/topologiyalar', section: 'Topologiyalar' },
  { title: 'Xavfsizlik — qatlamlar, bitta devor emas', text: 'Firewall, segmentatsiya, MFA, yangilanish, zaxira va oʻqitilgan odam — har biri alohida himoya qatlami.', tone: 'violet', to: '/xavfsizlik', section: 'Xavfsizlik' },
  { title: '100% xavfsizlik yoʻq', text: 'Maqsad — xavfni kamaytirish va hodisani tez aniqlash.', tone: 'violet', to: '/xavfsizlik', section: 'Xavfsizlik' },
  { title: 'Tekshirilmagan zaxira — zaxira emas', text: 'Nusxa olishning oʻzi yetarli emas: undan tiklashni muntazam sinab koʻrish shart.', tone: 'violet', to: '/xavfsizlik', section: 'Xavfsizlik' },
  { title: 'Oʻqitishda sabab soʻralsin', text: '«Nega switch, nega router emas?» — aynan shu savol yodlashni tushunishga aylantiradi.', tone: 'amber', to: '/metodika/jurnal', section: 'Oʻqitish metodlari' },
]

/* ------------------------------ Manbalar ------------------------------ */
interface Source { name: string; url: string; text: string }
const SOURCES: { title: string; tone: Tone; items: Source[] }[] = [
  {
    title: 'Tarmoq texnologiyalari va standartlar',
    tone: 'blue',
    items: [
      { name: 'Cisco Networking Academy', url: 'https://www.netacad.com', text: 'Tarmoq asoslari boʻyicha rasmiy oʻquv platformasi va kurs materiallari' },
      { name: 'Cloudflare Learning Center', url: 'https://www.cloudflare.com/learning/', text: 'Tarmoq, DNS, DDoS va xavfsizlik tushunchalarining tushunarli izohlari' },
      { name: 'RFC 1918', url: 'https://www.rfc-editor.org/rfc/rfc1918', text: 'Xususiy (private) IP-manzil diapazonlari — IETF standarti' },
      { name: 'RFC 2131', url: 'https://www.rfc-editor.org/rfc/rfc2131', text: 'DHCP protokoli — dinamik manzillash standarti' },
      { name: 'RFC 1035', url: 'https://www.rfc-editor.org/rfc/rfc1035', text: 'DNS — domen nomlari tizimi standarti' },
      { name: 'IEEE 802.3 (Ethernet)', url: 'https://www.ieee802.org/3/', text: 'Simli Ethernet standartlari ishchi guruhi' },
      { name: 'IEEE 802.11 (Wi-Fi)', url: 'https://www.ieee802.org/11/', text: 'Simsiz mahalliy tarmoq standartlari ishchi guruhi' },
    ],
  },
  {
    title: 'Xavfsizlik boʻyicha rasmiy tavsiyalar',
    tone: 'violet',
    items: [
      { name: 'NIST Cybersecurity Framework', url: 'https://www.nist.gov/cyberframework', text: 'Kiberxavfsizlik boʻyicha xalqaro tan olingan asosiy tizim (AQSH Standartlar va texnologiyalar milliy instituti)' },
      { name: 'NIST SP 800-63B', url: 'https://csrc.nist.gov/pubs/sp/800/63/b/upd2/final', text: 'Raqamli identifikatsiya — parol va autentifikatsiya boʻyicha zamonaviy tavsiyalar' },
      { name: 'NIST SP 800-53 Rev. 5', url: 'https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final', text: 'Axborot tizimlari uchun xavfsizlik va maxfiylik nazorati katalogi' },
      { name: 'CISA Cyber Essentials', url: 'https://www.cisa.gov/cyber-essentials', text: 'Kichik va oʻrta tashkilotlar uchun amaliy xavfsizlik choralari toʻplami' },
      { name: 'ENISA Threat Landscape', url: 'https://www.enisa.europa.eu/topics/cyber-threats/threat-landscape', text: 'Yevropa Ittifoqi kiberxavfsizlik agentligining tahdidlar sharhi' },
    ],
  },
  {
    title: 'Oʻqitish metodikasi',
    tone: 'amber',
    items: [
      { name: 'UNESCO — Raqamli taʼlim', url: 'https://www.unesco.org/en/digital-education', text: 'Raqamli taʼlim va oʻqituvchilar kompetensiyasi boʻyicha xalqaro materiallar' },
    ],
  },
  {
    title: 'Raqamli vositalar',
    tone: 'green',
    items: [
      { name: 'Cisco Packet Tracer', url: 'https://www.netacad.com/cisco-packet-tracer', text: 'Tarmoqni virtual loyihalash va simulyatsiya qilish dasturi' },
      { name: 'Padlet', url: 'https://padlet.com', text: 'Guruh boʻlib fikr almashish uchun umumiy onlayn doska' },
      { name: 'Kahoot!', url: 'https://kahoot.com', text: 'Bilimni oʻyin shaklida interaktiv tekshirish platformasi' },
      { name: 'LearningApps', url: 'https://learningapps.org', text: 'Moslashtirish, juftlash va boshqa qisqa interaktiv mashqlar' },
      { name: 'diagrams.net (draw.io)', url: 'https://www.drawio.com', text: 'Tarmoq sxemalari va diagrammalarni chizish muharriri' },
    ],
  },
]

/** Har bir guruhdan oldingi manbalar soni — umumiy tartib raqami uchun. */
const OFFSETS = SOURCES.map((_, gi) => SOURCES.slice(0, gi).reduce((n, g) => n + g.items.length, 0))

function host(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]
}

/* ------------------------------ 3-2-1 refleksiya ------------------------------ */
const EMPTY_321 = ['', '', '', '', '', '']
const GROUPS_321: { n: number; title: string; hint: string; tone: Tone; fields: { i: number; label: string; placeholder: string }[] }[] = [
  {
    n: 3, title: 'ta fakt', hint: 'Bugun bilib olgan uchta narsangiz', tone: 'teal',
    fields: [
      { i: 0, label: '1-fakt', placeholder: 'Masalan: switch MAC-manzil boʻyicha ishlaydi' },
      { i: 1, label: '2-fakt', placeholder: 'Masalan: /24 tarmoqda 254 ta qurilmaga manzil beriladi' },
      { i: 2, label: '3-fakt', placeholder: 'Masalan: firewall roʻyxati oxirida standart taqiq turadi' },
    ],
  },
  {
    n: 2, title: 'ta savol', hint: 'Hali javobsiz qolgan ikkita savol', tone: 'violet',
    fields: [
      { i: 3, label: '1-savol', placeholder: 'Masalan: VLAN segmentlari orasida trafik qanday oʻtadi?' },
      { i: 4, label: '2-savol', placeholder: 'Masalan: uy tarmogʻini qanday himoyalash kerak?' },
    ],
  },
  {
    n: 1, title: 'ta xulosa', hint: 'Bir jumlada: bugun eng muhim narsa nima edi?', tone: 'amber',
    fields: [{ i: 5, label: 'Xulosa', placeholder: 'Bugun eng muhim narsa — …' }],
  },
]

function Reflection() {
  const [raw, setValues, reset] = useStored<string[]>('xulosa-321', EMPTY_321)
  const uid = useId()
  const values = Array.isArray(raw) && raw.length === 6 ? raw.map(v => (typeof v === 'string' ? v : '')) : EMPTY_321
  const filled = values.filter(v => v.trim().length > 0).length
  const complete = filled === 6
  const update = (i: number, v: string) => setValues(values.map((x, k) => (k === i ? v : x)))

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-7">
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-slate-700 text-white"><ListChecks size={22} /></span>
        <div className="mr-auto min-w-0">
          <h3 className="text-lg font-bold">Oʻz refleksiyangizni yozing</h3>
          <p className="text-[0.95rem] text-slate-600">Olti maydon — yozganlaringiz shu brauzerda saqlanadi.</p>
        </div>
        <span className={cx('rounded-full px-3 py-1 font-mono text-sm font-bold', complete ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-800')} role="status" aria-live="polite" aria-label={`6 maydondan ${filled} tasi toʻldirildi`}>
          {filled} / 6
        </span>
        <Btn size="sm" variant="danger" icon={Eraser} disabled={filled === 0} onClick={reset}>Tozalash</Btn>
      </div>
      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label="Refleksiya toʻldirilishi" aria-valuemin={0} aria-valuemax={6} aria-valuenow={filled}>
        <div className={cx('h-full rounded-full transition-all duration-300', complete ? 'bg-emerald-500' : 'bg-teal-500')} style={{ width: (filled / 6) * 100 + '%' }} />
      </div>

      <div className="mt-6 space-y-6">
        {GROUPS_321.map(g => {
          const t = TONE[g.tone]
          return (
            <div key={g.n} role="group" aria-label={`${g.n} ${g.title}`} className="grid gap-4 sm:grid-cols-[7.5rem_1fr]">
              <div className={cx('flex items-center gap-3 rounded-2xl border p-3 sm:flex-col sm:items-start sm:justify-center sm:gap-1 sm:p-4', t.border, t.soft)} aria-hidden="true">
                <span className={cx('font-display text-5xl font-extrabold leading-none', t.text)}>{g.n}</span>
                <span className="text-sm font-bold text-navy-950">{g.title}</span>
              </div>
              <div className="min-w-0">
                <p className="mb-3 text-[0.95rem] text-slate-600">{g.hint}</p>
                <div className="space-y-3">
                  {g.fields.map(f => (
                    <div key={f.i}>
                      <label className="label" htmlFor={uid + f.i}>{f.label}</label>
                      {f.i === 5
                        ? <textarea id={uid + f.i} className="field min-h-[5.5rem] resize-y leading-relaxed" rows={3} value={values[f.i]} placeholder={f.placeholder} onChange={e => update(f.i, e.target.value)} />
                        : <input id={uid + f.i} type="text" className="field" value={values[f.i]} placeholder={f.placeholder} onChange={e => update(f.i, e.target.value)} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <p className={cx('mt-6 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-[0.97rem] leading-relaxed',
        complete ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-slate-50 text-slate-600')} role="status" aria-live="polite">
        {complete ? <CircleCheck size={20} className="mt-0.5 flex-none text-emerald-600" /> : <Save size={20} className="mt-0.5 flex-none text-slate-400" />}
        <span>
          {complete
            ? 'Refleksiya yakunlandi: uchta fakt, ikkita savol va bitta xulosa yozildi. Savollaringizni keyingi mashgʻulotda muhokama qiling.'
            : filled === 0
              ? 'Hali hech narsa yozilmagan. Uchta faktdan boshlang — eng oson qismi shu.'
              : `Yana ${6 - filled} ta maydon qoldi. Yozganlaringiz avtomatik saqlanmoqda.`}
        </span>
      </p>
    </div>
  )
}

/* ==========================================================================
   Sahifa
   ========================================================================== */
export default function Xulosa() {
  return (
    <>
      <PageHeader
        no="15"
        tone="slate"
        eyebrow="Yakun"
        title="Xulosa va foydalanilgan manbalar"
        lead={<>Agar mashgʻulotdan keyin oʻquvchi faqat quyidagi <strong>yetti fikrni</strong> eslab qolsa — maqsadga erishilgan hisoblanadi.</>}
      />

      <Goal
        items={[
          'Mavzuning yettita asosiy gʻoyasini qisqa va aniq ifodalash.',
          'Oʻrganilganlarni 3-2-1 usulida oʻz soʻzlari bilan umumlashtirish.',
          'Chuqurroq oʻrganish uchun rasmiy manbalarni bilish.',
        ]}
      />

      <Block tone="slate" title="Esda qolishi kerak boʻlgan 7 fikr" sub="Har bir fikr yonida uni batafsil ochib beradigan boʻlimga havola bor.">
        <ol className="grid gap-4 md:grid-cols-2">
          {IDEAS.map((idea, i) => {
            const t = TONE[idea.tone]
            return (
              <li key={i} className={cx('relative flex gap-4 overflow-hidden rounded-2xl border bg-white p-5 shadow-card sm:p-6', t.border, i === IDEAS.length - 1 && 'md:col-span-2')}>
                <span className={cx('absolute inset-x-0 top-0 h-1', t.bar)} />
                <span className={cx('grid h-11 w-11 flex-none place-items-center rounded-xl font-mono text-lg font-bold', t.solid)}>{i + 1}</span>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold leading-snug">{idea.title}</h3>
                  <p className="mt-1.5 text-[0.97rem] leading-relaxed text-slate-600">{idea.text}</p>
                  <Link to={idea.to} className="mt-2.5 inline-flex items-center gap-1 text-sm font-semibold text-blue-700 underline decoration-blue-300 underline-offset-2 hover:decoration-blue-600">
                    {idea.section} <ArrowRight size={14} />
                  </Link>
                </div>
              </li>
            )
          })}
        </ol>
      </Block>

      <Block tone="slate" title="Oʻqituvchi uchun 5 amaliy maslahat">
        <StepList
          tone="slate"
          items={[
            { title: 'Muammodan boshlang', text: <>Har bir yangi tushunchani <em>muammo</em> bilan boshlang, taʼrif bilan emas.</> },
            { title: 'Avval bashorat, keyin namoyish', text: 'Animatsiyani koʻrsatishdan oldin «nima boʻladi deb oʻylaysiz?» deb soʻrang.' },
            { title: 'Javobni emas, asosni baholang', text: <>Topshiriqda javobning oʻzini emas, uning <em>asosini</em> baholang.</> },
            { title: 'Xatoni jazolamang', text: 'Xato javob uchun jazolamang — izoh bilan tuzatish imkonini bering.' },
            { title: 'Mahalliy sharoitga bogʻlang', text: 'Mavzuni mahalliy sharoitga bogʻlang: oʻz maktabingiz tarmogʻini misol qiling.' },
          ]}
        />
      </Block>

      <Block tone="slate" title="Refleksiya: 3-2-1" sub="Mashgʻulot yakunida har bir ishtirokchi uchta fakt, ikkita savol va bitta xulosa yozadi. Bu usul nimani tushunganingizni va nima ochiq qolganini koʻrsatadi.">
        <Reflection />
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/sertifikat" className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-[0.95rem] font-semibold text-white shadow-sm transition hover:bg-teal-700">
            <ListChecks size={17} /> Sertifikatni koʻrish
          </Link>
          <Link to="/laboratoriya" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-[0.95rem] font-semibold text-navy-950 transition hover:border-teal-500 hover:bg-teal-50">
            <FlaskConical size={17} /> Laboratoriyaga qaytish
          </Link>
        </div>
      </Block>

      <Block tone="slate" title="Foydalanilgan manbalar" sub="Quyida keltirilgan manbalar — tashkilotlarning rasmiy resurslari. Chuqurroq oʻrganish uchun bevosita shu manbalarga murojaat qilish tavsiya etiladi. Havolalar yangi oynada ochiladi.">
        <div className="space-y-8">
          {SOURCES.map((group, gi) => (
            <section key={group.title} aria-label={group.title}>
              <div className="mb-3 flex flex-wrap items-center gap-2.5">
                <h3 className="text-lg font-bold">{group.title}</h3>
                <Pill tone={group.tone}>{group.items.length} ta manba</Pill>
              </div>
              <ul className="grid gap-2.5 md:grid-cols-2">
                {group.items.map((src, si) => {
                  const no = OFFSETS[gi] + si + 1
                  return (
                    <li key={src.url}>
                      <a href={src.url} target="_blank" rel="noopener noreferrer"
                        className="group flex h-full items-start gap-3.5 rounded-2xl border border-slate-200 bg-white p-4 shadow-card transition hover:border-teal-400 hover:bg-teal-50/40">
                        <span className={cx('grid h-9 min-w-9 flex-none place-items-center rounded-lg px-1.5 font-mono text-sm font-bold', TONE[group.tone].chip)}>{String(no).padStart(2, '0')}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-[1.02rem] font-bold leading-snug text-navy-950">{src.name}</span>
                          <span className="mt-0.5 block text-[0.92rem] leading-snug text-slate-600">{src.text}</span>
                          <span className="mt-1.5 block break-all font-mono text-xs text-blue-700 underline decoration-blue-300 underline-offset-2">{host(src.url)}</span>
                        </span>
                        <ExternalLink size={17} className="mt-1 flex-none text-slate-400 transition group-hover:text-teal-600" aria-hidden="true" />
                        <span className="sr-only">(yangi oynada ochiladi)</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>

        <Callout kind="warn" title="Milliy manbalar haqida izoh" className="mt-6">
          Oʻzbekiston Respublikasining «Informatika va axborot texnologiyalari» fani boʻyicha <strong>amaldagi oʻquv dasturi va davlat taʼlim standarti</strong> darsni rejalashtirishda asosiy hujjat hisoblanadi. Ushbu platformada milliy hujjatning aniq havolasi keltirilmagan, chunki u davriy yangilanadi — <em>joriy versiyasini tegishli rasmiy manbadan tekshiring</em>. Mavzu mazmuni esa xalqaro standartlar va rasmiy texnik hujjatlarga asoslangan.
        </Callout>
      </Block>

      <Takeaway
        title="Yakuniy xulosa"
        items={[
          <>Tarmoq kabel tortishdan emas, <strong>talabni aniqlashdan</strong> boshlanadi: avval reja, keyin qurilma.</>,
          <>Xavfsizlik — bir martalik sozlama emas, <strong>qatlamli va doimiy jarayon</strong>; maqsad — xavfni kamaytirish va hodisani tez aniqlash.</>,
          <>Oʻqitishda eng kuchli savol — <strong>«nega?»</strong>: u yodlashni tushunishga aylantiradi.</>,
        ]}
      />
    </>
  )
}
