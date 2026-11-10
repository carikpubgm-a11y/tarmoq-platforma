import {
  House, GraduationCap, Network, Globe, Share2, Router, DraftingCompass, Hash, ShieldCheck, Bug, FlaskConical,
  BrickWall, Presentation, CircleHelp, Snowflake, BookOpenText, MonitorPlay, Wrench, AppWindow, ClipboardList,
  ListChecks, Flag, type LucideIcon,
} from 'lucide-react'
import type { Tone } from '../components/ui'

export interface SectionDef {
  path: string
  no: string
  title: string
  short: string
  group: string
  tone: Tone
  icon: LucideIcon
  child?: boolean
  /** Oʻqituvchi (himoyachi) uchun taqdimot ssenariysi */
  script: { time: string; say: string; method: string; demo: string; key?: boolean }
}

/** Boʻlimlar tartibi — navigatsiya, «oldingi / keyingi» va himoya rejimi shu roʻyxat boʻyicha yuradi. */
export const SECTIONS: SectionDef[] = [
  { path: '/', no: '01', title: 'Bosh sahifa', short: 'Bosh sahifa', group: 'Kirish', tone: 'blue', icon: House,
    script: { time: '0:30', key: true, say: 'Mavzu va fan nomini ayting. Platforma oddiy sayt emas — unda nazariya, laboratoriya, metodlar va baholash bitta joyda ekanini taʼkidlang.', method: 'Kirish soʻzi', demo: 'Kurs tuzilmasi kartalarini koʻrsating: 15 boʻlim, laboratoriya, 5 metod, test.' } },
  { path: '/kurs', no: '02', title: 'Kurs haqida va oʻquv maqsadlari', short: 'Kurs va maqsadlar', group: 'Kirish', tone: 'blue', icon: GraduationCap,
    script: { time: '1:00', key: true, say: 'Uch turdagi maqsadni (taʼlimiy, tarbiyaviy, rivojlantiruvchi) va kutilayotgan natijalar jadvalini qisqa tushuntiring. Asosiy gʻoya: yodlashdan tushunishga oʻtish.', method: 'Maqsadni eʼlon qilish', demo: 'Kutilayotgan natijalar jadvali — har bir natija qaysi mashq bilan tekshirilishini koʻrsating.' } },
  { path: '/kirish', no: '03', title: 'Kompyuter tarmoqlariga kirish', short: 'Tarmoqqa kirish', group: 'Nazariya', tone: 'blue', icon: Network,
    script: { time: '1:30', say: 'Tarmoq taʼrifi: qurilmalar soni emas, kelishilgan qoidalar (protokol). «Sinfdagi suhbat» oʻxshatishidan foydalaning.', method: 'Muammoli savol + suhbat', demo: 'Toʻrt qatlamli tushuntirishni birma-bir oching; oxiridagi topshiriqni auditoriyadan soʻrang.' } },
  { path: '/turlari', no: '04', title: 'Tarmoq turlari', short: 'Tarmoq turlari', group: 'Nazariya', tone: 'blue', icon: Globe,
    script: { time: '1:00', say: 'PAN, LAN, MAN, WAN — qamrov boʻyicha. Keng tarqalgan chalkashlik: Wi-Fi tarmoq turi emas, Internet esa WAN ning bir koʻrinishi.', method: 'Taqqoslash jadvali', demo: 'Jadvalni koʻrsating, WLAN / VLAN / VPN kartalarini izohlang.' } },
  { path: '/topologiyalar', no: '05', title: 'Tarmoq topologiyalari', short: 'Topologiyalar', group: 'Nazariya', tone: 'teal', icon: Share2,
    script: { time: '2:00', key: true, say: 'Topologiya nosozlikka chidamlilikni belgilaydi. Avval «bitta kabel uzilsa nima boʻladi?» deb soʻrang, keyin koʻrsating.', method: 'Koʻrgazmalilik + bashorat qilish', demo: 'Yulduz, shina, halqa, toʻr — har birida «Aloqani uzish» tugmasini bosing va natijani taqqoslang.' } },
  { path: '/qurilmalar', no: '06', title: 'Tarmoq qurilmalari', short: 'Qurilmalar', group: 'Nazariya', tone: 'teal', icon: Router,
    script: { time: '1:30', say: 'Switch (MAC, bitta tarmoq ichida) va router (IP, tarmoqlar orasida) farqi — mavzuning oʻzagi. Uchta keng tarqalgan xatoni ayting.', method: 'Namoyish', demo: 'Qurilma kartalarini bosing: switch → router → access point → firewall.' } },
  { path: '/loyihalash', no: '07', title: 'Tarmoqni loyihalash bosqichlari', short: 'Loyihalash', group: 'Nazariya', tone: 'teal', icon: DraftingCompass,
    script: { time: '1:30', key: true, say: 'Tarmoq kabel tortishdan emas, talablarni aniqlashdan boshlanadi. 7 bosqich va har birining yozma natijasi.', method: 'Loyiha metodi', demo: 'Maktab tarmogʻini «Keyingi qadam» bilan 6 qadamda qurib koʻrsating.' } },
  { path: '/ip', no: '08', title: 'IP manzillash va tarmoq xizmatlari', short: 'IP va xizmatlar', group: 'Nazariya', tone: 'teal', icon: Hash,
    script: { time: '1:30', say: 'IPv4 tuzilishi, /24 maska, xususiy manzillar, DHCP (4 qadam) va DNS. Nega printerga statik manzil berilishini ayting.', method: 'Tushuntirish + animatsiya', demo: 'Paket safari simulyatorini 5 qadamda oʻtkazing: MAC har uchastkada qayta yoziladi, IP saqlanadi.' } },
  { path: '/xavfsizlik', no: '09', title: 'Tarmoq xavfsizligi', short: 'Xavfsizlik', group: 'Xavfsizlik', tone: 'violet', icon: ShieldCheck,
    script: { time: '1:30', say: 'Uch ustun: maxfiylik, yaxlitlik, foydalanuvchanlik. Himoya — qatlamlar. 100% xavfsizlik yoʻq, maqsad — xavfni kamaytirish.', method: 'Suhbat', demo: 'CIA kartalari, MFA, 3-2-1 zaxira qoidasi va hodisaga javob berishning 6 qadami.' } },
  { path: '/tahdidlar', no: '10', title: 'Tahdidlar va himoyalanish usullari', short: 'Tahdidlar', group: 'Xavfsizlik', tone: 'violet', icon: Bug,
    script: { time: '1:30', say: 'Har bir tahdid chorasi bilan birga beriladi: fishing → MFA, ransomware → oflayn zaxira. Firewall nima qila olmasligini ham ayting.', method: 'Keys-stadi', demo: 'Trafik filtri simulyatorida 8 paketni birma-bir yuboring va qaysi qoida ishlaganini koʻrsating.' } },
  { path: '/laboratoriya', no: '11', title: 'Interaktiv laboratoriya: tarmoq konstruktori', short: 'Tarmoq konstruktori', group: 'Laboratoriya', tone: 'green', icon: FlaskConical,
    script: { time: '3:00', key: true, say: 'Bu — loyihaning asosiy qismi. Talaba tarmoqni oʻzi quradi: qurilma qoʻshadi, kabel ulaydi, IP sozlaydi va aloqani tekshiradi.', method: 'Amaliy ish (learning by doing)', demo: 'Tayyor «Yulduz» andozasini yuklang → paket yuboring → bitta kabelni uzing → qayta yuboring. Soʻng IP manzilni ataylab buzib, xato izohini koʻrsating.' } },
  { path: '/laboratoriya/firewall', no: '11.1', title: 'Firewall laboratoriyasi', short: 'Firewall laboratoriyasi', group: 'Laboratoriya', tone: 'green', icon: BrickWall, child: true,
    script: { time: '1:30', key: true, say: 'Qoidalar yuqoridan pastga oʻqiladi, birinchi mos kelgani ishlaydi; oxirida — standart taqiq.', method: 'Tajriba', demo: 'Uchta vazifani bajaring: HTTP ga ruxsat, SSH ni bloklash, nomaʼlum trafikni bloklash. Qoida tartibini almashtirib, natija oʻzgarishini koʻrsating.' } },
  { path: '/metodika', no: '12', title: 'Oʻqitish metodikasi', short: 'Oʻqitish metodikasi', group: 'Metodika', tone: 'amber', icon: Presentation,
    script: { time: '1:00', key: true, say: 'Texnik mazmun tayyor — endi uni qanday oʻqitish. 45 daqiqalik dars rejasi va besh metod: har biri platformaning oʻzida bajariladi.', method: 'Metodik sharh', demo: 'Dars rejasi jadvali va metodlar xaritasi.' } },
  { path: '/metodika/muammoli', no: '12.1', title: 'Muammoli taʼlim metodi', short: 'Muammoli taʼlim', group: 'Metodika', tone: 'amber', icon: CircleHelp, child: true,
    script: { time: '2:00', key: true, say: 'Avval muammo, keyin bilim. Talaba 20 kompyuterli tarmoqni oʻzi loyihalaydi, platforma mezon boʻyicha tekshiradi.', method: 'Muammoli taʼlim', demo: 'Olti qadamni auditoriya bilan birga toʻldiring va «Yechimni baholash» tugmasini bosing.' } },
  { path: '/metodika/snowball', no: '12.2', title: 'Snowball (qor uyumi) metodi', short: 'Snowball', group: 'Metodika', tone: 'amber', icon: Snowflake, child: true,
    script: { time: '2:00', key: true, say: 'Fikr 1 → 2 → 4 kishilik guruhda yiriklashadi. Savol: xavfsizlik uchun eng muhim uchta chora.', method: 'Snowball', demo: 'Bir talabadan 3 ta chora soʻrang, juftlik va guruh bosqichida birlashtiring, yakuniy uchlikni ekspert roʻyxati bilan solishtiring.' } },
  { path: '/metodika/jurnal', no: '12.3', title: 'Double-Entry Journal metodi', short: 'Double-Entry Journal', group: 'Metodika', tone: 'amber', icon: BookOpenText, child: true,
    script: { time: '1:30', say: 'Chap ustun — avval bilgani, oʻng ustun — yangi oʻrgangani. Refleksiya vositasi.', method: 'Double-Entry Journal', demo: 'Bitta tushunchani (masalan, Firewall) auditoriya bilan toʻldiring va «Taqqoslash» koʻrinishini oching.' } },
  { path: '/metodika/namoyish', no: '12.4', title: 'Namoyish metodi', short: 'Namoyish', group: 'Metodika', tone: 'amber', icon: MonitorPlay, child: true,
    script: { time: '2:00', say: 'Oʻqituvchi ekranda bosqichma-bosqich koʻrsatadi, har qadamda savol beradi.', method: 'Namoyish', demo: 'Olti qadam: qurilma → ulash → IP → paket → firewall. Har qadamda «Oʻqituvchi nima deydi?» izohini oching.' } },
  { path: '/metodika/amaliy', no: '12.5', title: 'Amaliy topshiriq metodi', short: 'Amaliy topshiriq', group: 'Metodika', tone: 'amber', icon: Wrench, child: true,
    script: { time: '3:00', key: true, say: '10 ta kompyuter va 1 ta printer uchun lokal tarmoq. Olti mezon boʻyicha avtomatik baholanadi.', method: 'Amaliy topshiriq', demo: 'Vaqt tejash uchun «Namunaviy yechim»ni yuklang, soʻng bitta kabelni olib tashlab, ball qanday oʻzgarishini koʻrsating.' } },
  { path: '/vositalar', no: '12.6', title: 'Raqamli taʼlim vositalari', short: 'Raqamli vositalar', group: 'Metodika', tone: 'amber', icon: AppWindow, child: true,
    script: { time: '1:00', say: 'Metod va vositani farqlang: Snowball — metod, Padlet — uni qoʻllab-quvvatlovchi vosita.', method: 'Sharh', demo: 'Besh vosita kartasi: Packet Tracer, Padlet, Kahoot!, LearningApps, diagrams.net.' } },
  { path: '/amaliyot', no: '13', title: 'Amaliy mashgʻulotlar', short: 'Amaliy mashgʻulotlar', group: 'Amaliyot va baholash', tone: 'green', icon: ClipboardList,
    script: { time: '1:30', say: 'Uch darajali topshiriq (A, B, C): bitta sinfda ham, universitet seminarida ham qoʻllanadi. Baholanadigani — javob emas, asos.', method: 'Tabaqalashtirilgan topshiriq, guruh ishi', demo: 'B topshiriqqa javob yozing, mezon bilan oʻz-oʻzini baholashni koʻrsating.' } },
  { path: '/test', no: '14', title: 'Bilimni baholash va testlar', short: 'Test markazi', group: 'Amaliyot va baholash', tone: 'green', icon: ListChecks,
    script: { time: '2:00', key: true, say: 'Savollar taʼrifni emas, vaziyatni tahlil qilishni soʻraydi. Har javobdan keyin izoh chiqadi.', method: 'Formativ va summativ baholash', demo: 'Mavzu boʻyicha 3–4 savolni auditoriya bilan yeching; natijalar sahifasi va amaliy ishlar ballarini koʻrsating.' } },
  { path: '/xulosa', no: '15', title: 'Xulosa va foydalanilgan manbalar', short: 'Xulosa va manbalar', group: 'Yakun', tone: 'slate', icon: Flag,
    script: { time: '1:00', key: true, say: 'Yetti asosiy fikr. Yakuniy gap: «Nega switch, nega router emas?» degan savol yodlashni tushunishga aylantiradi.', method: 'Refleksiya (3-2-1)', demo: 'Manbalar roʻyxati — rasmiy standartlar va tashkilotlar.' } },
]

export const GROUPS = Array.from(new Set(SECTIONS.map(s => s.group)))

export function findSection(pathname: string): SectionDef | undefined {
  const p = pathname.replace(/\/+$/, '') || '/'
  return SECTIONS.find(s => s.path === p)
}
export function neighbours(pathname: string) {
  const i = SECTIONS.findIndex(s => s.path === (pathname.replace(/\/+$/, '') || '/'))
  return { index: i, prev: i > 0 ? SECTIONS[i - 1] : undefined, next: i >= 0 && i < SECTIONS.length - 1 ? SECTIONS[i + 1] : undefined }
}

export const COURSE = {
  title: 'Kompyuter tarmoqlarini loyihalash va tarmoq xavfsizligini oʻqitish',
  subject: 'Matematika va informatikani oʻqitish metodikasi',
  goal: 'Talabalarda kompyuter tarmogʻini loyihalash, qurilmalarni asosli tanlash va tarmoqni himoyalash koʻnikmasini shakllantirish hamda bu mavzuni zamonaviy interaktiv metodlar bilan oʻqitishni amalda koʻrsatish.',
}
