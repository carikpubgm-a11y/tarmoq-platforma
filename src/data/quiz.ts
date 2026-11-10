/* ==========================================================================
   Yakuniy test savollari — 18 ta vaziyatli savol, 7 ta mavzu.
   Savollar 8–9-sinf oʻquvchisi uchun sodda tilda yozilgan.
   Har bir savolda toʻrtta variant, bitta toʻgʻri javob va qisqa izoh bor.
   `correct` — toʻgʻri variantning indeksi (0 = A, 1 = B, 2 = C, 3 = D).
   Variantlar tartibi oʻzgartirilmaydi — `correct` shunga bogʻliq.
   ========================================================================== */

export type QuizTopic =
  | 'Asoslar'
  | 'Tarmoq turlari'
  | 'Topologiya'
  | 'Qurilmalar'
  | 'IP va xizmatlar'
  | 'Xavfsizlik'
  | 'Tahdidlar va firewall'

export interface TopicInfo {
  topic: QuizTopic
  /** Xato qilinganda takrorlash uchun tavsiya etiladigan boʻlim */
  route: string
  section: string
}

export const TOPICS: TopicInfo[] = [
  { topic: 'Asoslar', route: '/kirish', section: 'Kompyuter tarmoqlariga kirish' },
  { topic: 'Tarmoq turlari', route: '/turlari', section: 'Tarmoq turlari' },
  { topic: 'Topologiya', route: '/topologiyalar', section: 'Tarmoq topologiyalari' },
  { topic: 'Qurilmalar', route: '/qurilmalar', section: 'Tarmoq qurilmalari' },
  { topic: 'IP va xizmatlar', route: '/ip', section: 'IP manzillash va tarmoq xizmatlari' },
  { topic: 'Xavfsizlik', route: '/xavfsizlik', section: 'Tarmoq xavfsizligi' },
  { topic: 'Tahdidlar va firewall', route: '/tahdidlar', section: 'Tahdidlar va himoyalanish usullari' },
]

export interface QuizQuestion {
  id: number
  topic: QuizTopic
  /** Savol nimani tekshirishi — savol ustida kichik yozuv bilan chiqadi */
  focus: string
  q: string
  options: [string, string, string, string]
  correct: 0 | 1 | 2 | 3
  explain: string
}

export const QUIZ: QuizQuestion[] = [
  /* ------------------------------ Asoslar ------------------------------ */
  {
    id: 1,
    topic: 'Asoslar',
    focus: 'Protokol — kelishilgan qoidalar',
    q: 'Ikki kompyuter soz sim bilan ulangan, signal yetib boryapti. Lekin ular bir-birini tushunmayapti: har biri maʼlumotni oʻzicha yuboradi. Nima yetishmayapti?',
    options: [
      'Tezroq sim',
      'Umumiy protokol — kelishilgan qoidalar',
      'Qoʻshimcha switch',
      'Koʻproq operativ xotira',
    ],
    correct: 1,
    explain:
      'Qurilmalar bir-birini tushunishi uchun umumiy qoidalar — protokol kerak. Qoida kelishilmasa, eng tez sim ham yordam bermaydi.',
  },
  {
    id: 2,
    topic: 'Asoslar',
    focus: 'Maʼlumot paketlarga boʻlinadi',
    q: 'Oʻquvchi 5 MB rasmni sinf serveriga yubordi. Rasm tarmoq boʻylab qanday ketadi?',
    options: [
      'Bitta yaxlit fayl boʻlib, uzluksiz',
      'Faqat fayl nomi ketadi, rasm kompyuterda qoladi',
      'Avval siqiladi, keyin bitta katta paket boʻlib ketadi',
      'Koʻp kichik paketlarga boʻlinadi; har birida manzil va maʼlumot boʻlagi boʻladi',
    ],
    correct: 3,
    explain:
      'Katta fayl kichik paketlarga boʻlinadi: har bir paketda manzil yozilgan sarlavha va maʼlumotning bir boʻlagi boʻladi. Qabul qiluvchi ularni toʻgʻri tartibda qayta yigʻadi.',
  },

  /* ------------------------------ Tarmoq turlari ------------------------------ */
  {
    id: 3,
    topic: 'Tarmoq turlari',
    focus: 'Qamrov boʻyicha tur',
    q: 'Bankning Toshkent, Samarqand va Buxorodagi filiallari yagona ichki tarmoqqa birlashtirilgan. Bu qanday tarmoq?',
    options: [
      'LAN — mahalliy tarmoq',
      'MAN — shahar tarmogʻi',
      'WAN — keng hududli tarmoq',
      'PAN — shaxsiy tarmoq',
    ],
    correct: 2,
    explain:
      'Bir necha shaharni qamragan tarmoq — WAN. LAN bitta bino, MAN bitta shahar, PAN esa bir kishining atrofi bilan chegaralanadi.',
  },
  {
    id: 4,
    topic: 'Tarmoq turlari',
    focus: 'Wi-Fi — tur emas, texnologiya',
    q: 'Kimdir «Maktabda ikki xil tarmoq turi bor: LAN va Wi-Fi» dedi. Bu gapni qanday tuzatish kerak?',
    options: [
      'Wi-Fi — tarmoq turi emas, mahalliy tarmoqqa simsiz ulanish usuli; simsiz LAN — WLAN deyiladi',
      'Wi-Fi — bu WAN, chunki u orqali internetga chiqiladi',
      'Wi-Fi — bu PAN, chunki signali uzoqqa yetmaydi',
      'Tuzatish shart emas: Wi-Fi alohida tarmoq turi',
    ],
    correct: 0,
    explain:
      'Tarmoq turlari (PAN, LAN, MAN, WAN) qamrovi boʻyicha ajratiladi, Wi-Fi esa ulanish usuli. Sim bilan ham, Wi-Fi bilan ham ulangan qurilmalar bitta mahalliy tarmoqda boʻlishi mumkin.',
  },

  /* ------------------------------ Topologiya ------------------------------ */
  {
    id: 5,
    topic: 'Topologiya',
    focus: 'Markaz ishdan chiqsa',
    q: 'Kompyuter xonasi yulduz shaklida: hamma qurilma bitta markaziy switchga ulangan. Shu switch buzilsa nima boʻladi?',
    options: [
      'Faqat bitta qurilma aloqasiz qoladi',
      'Butun tarmoq ishlamaydi',
      'Tarmoq sekinlashadi, lekin ishlaydi',
      'Hech narsa oʻzgarmaydi',
    ],
    correct: 1,
    explain:
      'Yulduzda hamma aloqa markaz orqali oʻtadi. Bitta sim uzilsa faqat bitta qurilma zarar koʻradi, lekin markaz buzilsa — butun tarmoq toʻxtaydi.',
  },
  {
    id: 6,
    topic: 'Topologiya',
    focus: 'Eng chidamli shakl',
    q: 'Maʼlumot markazi uchun shakl tanlanmoqda. Talab: istalgan bitta sim yoki qurilma buzilsa ham aloqa toʻxtamasin. Narx muhim emas. Qaysi shakl mos?',
    options: [
      'Shina — hamma bitta umumiy simda',
      'Yulduz — hamma bitta switchda',
      'Halqa — signal bir yoʻnalishda aylanadi',
      'Toʻr (mesh) — qurilmalar orasida bir nechta yoʻl bor',
    ],
    correct: 3,
    explain:
      'Toʻrda har bir qurilmaga bir nechta yoʻl boradi, shuning uchun bitta uzilish aloqani toʻxtatmaydi. Buning evaziga koʻp sim va koʻp port kerak boʻladi.',
  },

  /* ------------------------------ Qurilmalar ------------------------------ */
  {
    id: 7,
    topic: 'Qurilmalar',
    focus: 'Bitta tarmoqni birlashtirish',
    q: 'Bitta xonada 30 ta kompyuter bor. Hammasi bir-birini koʻrishi va bitta printerdan foydalanishi kerak. Qaysi qurilma kerak?',
    options: ['Router', 'Switch', 'Modem', 'Access point'],
    correct: 1,
    explain:
      'Bu yerda bitta tarmoq bor, shuning uchun switch yetarli: u bitta tarmoq ichidagi qurilmalarni birlashtiradi. Router esa turli tarmoqlarni bogʻlash uchun kerak.',
  },
  {
    id: 8,
    topic: 'Qurilmalar',
    focus: 'Ikki tarmoqni bogʻlash',
    q: 'Oʻquv xonasi 192.168.10.0/24, maʼmuriyat 192.168.20.0/24 tarmogʻida. Bu ikki tarmoq orasida xabarni qaysi qurilma oʻtkazadi?',
    options: ['Oddiy switch', 'Hub', 'Router', 'Access point'],
    correct: 2,
    explain:
      'Turli IP-tarmoqlarni faqat router bogʻlaydi. Switch bitta tarmoq ichida ishlaydi, hub signalni hamma portga takrorlaydi, access point esa simsiz ulanish beradi.',
  },
  {
    id: 9,
    topic: 'Qurilmalar',
    focus: 'Internet simini ulash',
    q: 'Provayder binoga optik kabel tortdi. Uni maktab tarmogʻiga ulash uchun birinchi nima kerak?',
    options: ['Modem / ONT', 'Switch', 'Access point', 'Qoʻshimcha router'],
    correct: 0,
    explain:
      'Optik signalni kompyuter tushunadigan Ethernet signaliga aylantirish kerak — buni modem (optik liniyada ONT) bajaradi. Switch va router faqat Ethernet bilan ishlaydi.',
  },

  /* ------------------------------ IP va xizmatlar ------------------------------ */
  {
    id: 10,
    topic: 'IP va xizmatlar',
    focus: 'DHCP manzil bermasa',
    q: 'Kompyuter tarmoqqa ulangan, lekin internet yoʻq. IP manzili 169.254.x.x koʻrinishida. Sabab nima?',
    options: [
      'DNS server ishlamayapti',
      'DHCP serverdan manzil olinmadi',
      'Firewall bloklayapti',
      'Brauzer sozlamasi buzilgan',
    ],
    correct: 1,
    explain:
      '169.254.x.x — kompyuter DHCP serverdan manzil ololmaganda oʻziga beradigan manzil. Demak, muammo DHCP xizmatida yoki unga yetib borishda.',
  },
  {
    id: 11,
    topic: 'IP va xizmatlar',
    focus: 'Tarmoqda nechta manzil bor',
    q: 'Xonaga 192.168.10.0/24 tarmogʻi berildi. Eng koʻpi bilan nechta qurilmaga manzil beriladi?',
    options: ['256 ta', '255 ta', '254 ta', '24 ta'],
    correct: 2,
    explain:
      '/24 tarmoqda jami 256 ta manzil bor, lekin ikkitasi band: 192.168.10.0 — tarmoqning oʻzi, 192.168.10.255 — broadcast. Qurilmalarga 254 ta manzil qoladi.',
  },
  {
    id: 12,
    topic: 'IP va xizmatlar',
    focus: 'Sayt nomi ochilmasa',
    q: '«ping 8.8.8.8» ishlayapti, lekin brauzer saytlarni nomi boʻyicha ocha olmayapti. Sabab nima?',
    options: [
      'Sim uzilgan',
      'DHCP manzil bermagan',
      'Shlyuz notoʻgʻri koʻrsatilgan',
      'DNS ishlamayapti yoki DNS server manzili notoʻgʻri',
    ],
    correct: 3,
    explain:
      'Ping oʻtayotgani sim, IP manzil va shlyuz joyida ekanini koʻrsatadi. Ishlamayotgani — sayt nomini IP manzilga aylantirish, bu esa DNS ishi.',
  },

  /* ------------------------------ Xavfsizlik ------------------------------ */
  {
    id: 13,
    topic: 'Xavfsizlik',
    focus: 'Tarmoqni boʻlib himoyalash',
    q: 'Oʻquvchilar oʻqituvchining kompyuteriga kira olmasligi, lekin fayl serveriga ulana olishi kerak. Eng toʻgʻri yechim qaysi?',
    options: [
      'Tarmoqni VLAN boʻlaklariga ajratib, oraga firewall qoidalarini qoʻyish',
      'Oʻqituvchi parolini hech kimga aytmasligi',
      'Hamma kompyuterga antivirus oʻrnatish',
      'Wi-Fi parolini murakkablashtirish',
    ],
    correct: 0,
    explain:
      'Tarmoqni boʻlaklarga ajratib qoida yozish haqiqiy toʻsiq yaratadi: kerakmas yoʻl umuman ochilmaydi. Parol va antivirus esa tarmoq ichidagi ruxsatsiz kirishni toʻxtatmaydi.',
  },
  {
    id: 14,
    topic: 'Xavfsizlik',
    focus: 'Parol oshkor boʻlganda',
    q: 'Xodim soxta sahifaga parolini kiritib qoʻydi. Qaysi chora oldin yoqilgan boʻlsa, begona kishi baribir hisobga kira olmaydi?',
    options: [
      'Yanada murakkab parol',
      'Parolni har 30 kunda almashtirish',
      'Koʻp faktorli autentifikatsiya (MFA)',
      'Boshqa brauzerdan foydalanish',
    ],
    correct: 2,
    explain:
      'Parol allaqachon oʻgʻirlangan, uning murakkabligi yordam bermaydi. MFA esa ikkinchi tasdiqni — telefondagi kodni — soʻraydi, shuning uchun parolning oʻzi yetarli boʻlmaydi.',
  },
  {
    id: 15,
    topic: 'Xavfsizlik',
    focus: 'Xavfsizlikning uch ustuni',
    q: 'Maktab serveriga hujum boʻldi: elektron jurnal uch soat ochilmadi. Maʼlumot oʻgʻirlanmadi ham, oʻzgartirilmadi ham. Nima buzildi?',
    options: [
      'Maxfiylik',
      'Yaxlitlik',
      'Foydalanuvchanlik',
      'Hech narsa — maʼlumot oʻgʻirlanmagan',
    ],
    correct: 2,
    explain:
      'Xavfsizlik uch ustunga tayanadi: maxfiylik, yaxlitlik va foydalanuvchanlik. Xizmat kerak paytda ishlamasa — aynan foydalanuvchanlik buziladi.',
  },

  /* ------------------------------ Tahdidlar va firewall ------------------------------ */
  {
    id: 16,
    topic: 'Tahdidlar va firewall',
    focus: 'Zaxira nusxa qayerda turishi kerak',
    q: 'Maktab hamma zaxira nusxani serverga doim ulangan tarmoq diskida saqlaydi. Nega bu xavfli?',
    options: [
      'Tarmoq tezligini pasaytiradi',
      'Koʻp joy egallaydi',
      'Boshqalar undan foydalana olmaydi',
      'Shifrlovchi virus zaxira nusxani ham shifrlab qoʻyadi',
    ],
    correct: 3,
    explain:
      'Shifrlovchi virus tarmoqdagi ulangan hamma diskni topib shifrlaydi — zaxira ham asl nusxa bilan birga yoʻqoladi. Shuning uchun kamida bitta nusxa tarmoqdan uzilgan holda saqlanadi.',
  },
  {
    id: 17,
    topic: 'Tahdidlar va firewall',
    focus: '«Qolgan hammasi — taqiq»',
    q: 'Firewallda ikki ruxsat bor: oʻquv xonasidan fayl serveriga va oʻquv xonasidan saytlarga. Oxirida «qolgan hammasi taqiqlanadi» turadi. Oʻquvchi kompyuteridan maʼmuriyat kompyuteriga SSH bilan ulanmoqchi. Nima boʻladi?',
    options: [
      'Bloklanadi: hech bir ruxsat qoidasiga mos kelmaydi, oxirgi qoida ishlaydi',
      'Oʻtadi: SSH ni taqiqlovchi alohida qoida yozilmagan',
      'Oʻtadi: 1-qoida oʻquv xonasidan chiqishga ruxsat bergan',
      'Firewall administratordan ruxsat soʻraydi',
    ],
    correct: 0,
    explain:
      'Bu ulanish birinchi ikki qoidaga tushmaydi, shuning uchun oxirgi qoida — «qolgan hammasi taqiq» — ishlaydi. Shu tamoyil har bir xavfli portni alohida sanab chiqishdan ishonchliroq.',
  },
  {
    id: 18,
    topic: 'Tahdidlar va firewall',
    focus: 'Soxta xatni tanib olish',
    q: '«Bank xavfsizlik xizmati» nomidan xat keldi: «Hisobingiz 24 soatda bloklanadi, havoladan kirib parolni tasdiqlang». Havola bank saytiga oʻxshaydi, lekin bir harfi boshqacha. Nima qilish kerak?',
    options: [
      'Havoladan kirib, yangi murakkab parol oʻrnatish',
      'Havolani bosmaslik, bankka rasmiy sayt yoki telefon orqali murojaat qilish va xabar berish',
      'Xatga javob yozib, joʻnatuvchidan oʻzini tanishtirishni soʻrash',
      'Xatni hamkasblarga yuborib, ular ham parolini tasdiqlashini aytish',
    ],
    correct: 1,
    explain:
      'Shoshiltirish, qoʻrqitish va bir harfi oʻzgargan havola — soxta xatning asosiy belgilari. Toʻgʻri yoʻl: havolani bosmay, rasmiy kanal orqali tekshirish va hodisa haqida xabar berish.',
  },
]

/* ------------------------------ Baholash shkalasi ------------------------------ */
export interface Verdict {
  key: 'alo' | 'yaxshi' | 'qoniqarli' | 'qayta'
  label: string
  text: string
  /** UI kutubxonasidagi rang nomi */
  tone: 'green' | 'blue' | 'amber' | 'rose'
  range: string
}

export const VERDICTS: Verdict[] = [
  { key: 'alo', label: 'Aʼlo', text: 'Zoʻr! Mavzuni juda yaxshi oʻzlashtirgansiz.', tone: 'green', range: '86–100%' },
  { key: 'yaxshi', label: 'Yaxshi', text: 'Yaxshi natija! Bir-ikki joyni takrorlasangiz, aʼlo boʻladi.', tone: 'blue', range: '71–85%' },
  { key: 'qoniqarli', label: 'Qoniqarli', text: 'Asoslar bor. Xato qilgan mavzularni koʻrib chiqsangiz, natija koʻtariladi.', tone: 'amber', range: '56–70%' },
  { key: 'qayta', label: 'Yana bir urinib koʻramiz', text: 'Hechqisi yoʻq — boʻlimlarni qayta koʻrib chiqing va testni yana ishlang.', tone: 'rose', range: '0–55%' },
]

/** Foiz (0–100, yaxlitlangan) boʻyicha baho darajasi. */
export function verdictFor(percent: number): Verdict {
  if (percent >= 86) return VERDICTS[0]
  if (percent >= 71) return VERDICTS[1]
  if (percent >= 56) return VERDICTS[2]
  return VERDICTS[3]
}
