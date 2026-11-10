/* ==========================================================================
   Yakuniy test savollari — 18 ta vaziyatli savol, 7 ta mavzu.
   Har bir savolda toʻrtta variant, bitta toʻgʻri javob va izoh bor.
   `correct` — toʻgʻri variantning indeksi (0 = A, 1 = B, 2 = C, 3 = D).
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
    focus: 'Tarmoqning mohiyati: protokol',
    q: 'Ikki kompyuter soz kabel bilan bir-biriga ulangan, signal yetib boryapti. Shunga qaramay ular maʼlumot almasha olmayapti: har biri maʼlumotni oʻzicha tartibda yuboradi va boshqasinikini tushunmaydi. Birinchi navbatda nima yetishmayapti?',
    options: [
      'Yuqoriroq tezlikdagi kabel',
      'Umumiy protokol — kelishilgan qoidalar toʻplami',
      'Oraga qoʻyiladigan qoʻshimcha switch',
      'Kattaroq hajmli operativ xotira',
    ],
    correct: 1,
    explain:
      'Tarmoqni tarmoq qiladigan narsa — qurilmalar yoki kabellar soni emas, balki ularning kelishilgan qoidalar asosida «gaplasha olishi». Kimga, qaysi navbatda va qaysi «tilda» yuborish kelishilmasa, eng tez kabel ham yordam bermaydi. Bu qoidalar toʻplami protokol deb ataladi; eng keng tarqalgan protokollar oilasi — TCP/IP.',
  },
  {
    id: 2,
    topic: 'Asoslar',
    focus: 'Paket va uning tuzilishi',
    q: 'Oʻquvchi 5 MB hajmli rasmni sinfdagi fayl serveriga yubordi. Bu rasm tarmoq boʻylab qanday koʻrinishda uzatiladi?',
    options: [
      'Bitta yaxlit fayl sifatida, uzluksiz oqimda',
      'Faqat fayl nomi yuboriladi, rasmning oʻzi kompyuterda qoladi',
      'Avval siqiladi, soʻng bitta katta paket boʻlib yuboriladi',
      'Koʻplab kichik paketlarga boʻlinadi; har birida manzillar yozilgan sarlavha va maʼlumot boʻlagi boʻladi',
    ],
    correct: 3,
    explain:
      'Katta fayl minglab kichik paketlarga boʻlinadi. Har bir paketning sarlavhasi (header) yuboruvchi va qabul qiluvchi manzilini, yuki (payload) esa maʼlumotning bir boʻlagini saqlaydi. Qabul qiluvchi paketlarni toʻgʻri tartibda qayta yigʻadi; yoʻqolgan paketni TCP qayta yuboradi. «Paket butun fayl boʻlib boradi» — keng tarqalgan xato tushuncha.',
  },

  /* ------------------------------ Tarmoq turlari ------------------------------ */
  {
    id: 3,
    topic: 'Tarmoq turlari',
    focus: 'Qamrov boʻyicha tasnif',
    q: 'Bankning Toshkent, Samarqand va Buxorodagi filiallari aloqa operatori kanallari orqali yagona ichki tarmoqqa birlashtirilgan. Bu tarmoq internetdan alohida ishlaydi. Qamrovi boʻyicha u qaysi turga kiradi?',
    options: [
      'LAN — mahalliy tarmoq',
      'MAN — shahar tarmogʻi',
      'WAN — keng hududli tarmoq',
      'PAN — shaxsiy tarmoq',
    ],
    correct: 2,
    explain:
      'Bir necha shahar, viloyat yoki mamlakatni qamragan tarmoq — WAN. LAN bitta xona yoki bino bilan, MAN bitta shahar bilan chegaralanadi, PAN esa bir kishining atrofidagi qurilmalarni bogʻlaydi. Bu misol yana bir narsani koʻrsatadi: har qanday WAN internet emas — internet eng katta WAN, lekin yagonasi emas.',
  },
  {
    id: 4,
    topic: 'Tarmoq turlari',
    focus: 'Keng tarqalgan chalkashlik',
    q: 'Oʻqituvchi darsda «Maktabimizda ikki xil tarmoq turi bor: LAN va Wi-Fi» dedi. Bu gapni texnik jihatdan qanday tuzatish kerak?',
    options: [
      'Wi-Fi — tarmoq turi emas, mahalliy tarmoqqa simsiz ulanish texnologiyasi; simsiz mahalliy tarmoq WLAN deb ataladi',
      'Wi-Fi — bu WAN, chunki u orqali internetga chiqiladi',
      'Wi-Fi — bu PAN, chunki signali uzoqqa yetmaydi',
      'Tuzatish shart emas: Wi-Fi qamrov boʻyicha alohida tarmoq turi hisoblanadi',
    ],
    correct: 0,
    explain:
      'Tarmoq turlari (PAN, LAN, MAN, WAN) qamrovi boʻyicha ajratiladi. Wi-Fi esa tur emas, IEEE 802.11 standartiga asoslangan simsiz ulanish texnologiyasi. Kabel orqali ulangan kompyuter ham, Wi-Fi orqali ulangan noutbuk ham bitta mahalliy tarmoqda boʻlishi mumkin. Simsiz mahalliy tarmoqning toʻgʻri nomi — WLAN.',
  },

  /* ------------------------------ Topologiya ------------------------------ */
  {
    id: 5,
    topic: 'Topologiya',
    focus: 'Topologiya va nosozlikka chidamlilik',
    q: 'Kompyuter xonasi yulduz topologiyasida qurilgan: barcha qurilmalar bitta markaziy switchga ulangan. Shu switch ishdan chiqsa nima boʻladi?',
    options: [
      'Faqat bitta qurilma aloqasiz qoladi',
      'Butun tarmoq ishlamaydi',
      'Tarmoq sekinlashadi, lekin ishlaydi',
      'Hech narsa oʻzgarmaydi',
    ],
    correct: 1,
    explain:
      'Yulduz topologiyasida barcha aloqa markaziy qurilma orqali oʻtadi. Shuning uchun bitta qurilmaning kabeli uzilsa, faqat oʻsha qurilma zarar koʻradi, lekin markazning oʻzi ishdan chiqsa — butun tarmoq toʻxtaydi.',
  },
  {
    id: 6,
    topic: 'Topologiya',
    focus: 'Talabga koʻra topologiya tanlash',
    q: 'Maʼlumot markazi uchun topologiya tanlanmoqda. Asosiy talab: istalgan bitta kabel yoki bitta qurilma ishdan chiqsa ham, qolgan tugunlar orasidagi aloqa toʻxtamasin. Narx ikkinchi darajali. Qaysi topologiya bu talabga eng mos?',
    options: [
      'Shina — hamma bitta umumiy kabelda',
      'Yulduz — hamma bitta markaziy switchda',
      'Halqa — signal bitta yoʻnalishda aylanadi',
      'Toʻr (mesh) — tugunlar orasida bir nechta muqobil yoʻl',
    ],
    correct: 3,
    explain:
      'Toʻr topologiyasida har bir tugun bir nechta qoʻshnisi bilan bogʻlangan, shuning uchun bitta kanal yoki tugun ishdan chiqsa, trafik muqobil yoʻldan oʻtadi. Buning narxi — koʻp kabel, koʻp port va murakkab sozlash. Shinada magistral kabel, yulduzda markaziy switch yagona nosozlik nuqtasi boʻladi; bir yoʻnalishli halqani esa istalgan bitta uzilish toʻxtatadi.',
  },

  /* ------------------------------ Qurilmalar ------------------------------ */
  {
    id: 7,
    topic: 'Qurilmalar',
    focus: 'Bitta tarmoq ichida koʻp qurilmani ulash',
    q: 'Maktabda bitta xonada 30 ta kompyuter bor. Ularning hammasi bir-birini koʻrishi va bitta printerdan foydalanishi kerak. Qaysi qurilma eng mos?',
    options: ['Router', 'Switch', 'Modem', 'Access point'],
    correct: 1,
    explain:
      'Bu yerda faqat bitta tarmoq bor — turli tarmoqlarni bogʻlash kerak emas. Shuning uchun router emas, switch kerak: u bitta tarmoq ichidagi qurilmalarni MAC-manzil boʻyicha bogʻlaydi. Router bu vazifa uchun ortiqcha xarajat boʻlardi.',
  },
  {
    id: 8,
    topic: 'Qurilmalar',
    focus: 'Qurilmalarning ishlash qatlami',
    q: 'Oʻquv xonasi 192.168.10.0/24, maʼmuriyat esa 192.168.20.0/24 tarmogʻida joylashgan. Bu ikki xil IP-tarmoq orasida trafikni qaysi qurilma yoʻnaltiradi?',
    options: ['Oddiy (2-qatlamli) switch', 'Hub', 'Router', 'Access point'],
    correct: 2,
    explain:
      'Router 3-qatlamda (IP) ishlaydi va turli tarmoqlarni bogʻlaydi. Oddiy switch 2-qatlamda MAC-manzil boʻyicha bitta tarmoq ichida ishlaydi, hub 1-qatlamda signalni barcha portlarga takrorlaydi, access point esa faqat simsiz ulanishni taʼminlaydi.',
  },
  {
    id: 9,
    topic: 'Qurilmalar',
    focus: 'Uskunani tanlash',
    q: 'Provayder binoga optik kabel olib keldi. Uni maktab tarmogʻiga ulash uchun birinchi navbatda nima kerak?',
    options: ['Modem / ONT', 'Switch', 'Access point', 'Qoʻshimcha router'],
    correct: 0,
    explain:
      'Optik signalni Ethernet signaliga aylantirish kerak — bu ishni modem (optik liniyada — ONT) bajaradi. Switch va router Ethernet signali bilan ishlaydi, shuning uchun avval signalni aylantirish zarur.',
  },

  /* ------------------------------ IP va xizmatlar ------------------------------ */
  {
    id: 10,
    topic: 'IP va xizmatlar',
    focus: 'Diagnostika: APIPA manzili',
    q: 'Oʻqituvchi «internet ishlamayapti» dedi. Kompyuter tarmoqqa ulangan (kabel joyida, indikator yonib turibdi), lekin IP-manzili 169.254.x.x koʻrinishida. Eng ehtimoliy sabab nima?',
    options: [
      'DNS server ishlamayapti',
      'DHCP serverdan manzil olinmadi',
      'Firewall trafikni bloklayapti',
      'Brauzer sozlamasi buzilgan',
    ],
    correct: 1,
    explain:
      '169.254.0.0/16 — bu APIPA diapazoni. Qurilma DHCP serverdan manzil ololmaganida oʻzicha shu diapazondan manzil tanlaydi. Demak, muammo DHCP xizmatida yoki unga yetib borishda — DNS yoki brauzerda emas.',
  },
  {
    id: 11,
    topic: 'IP va xizmatlar',
    focus: 'Tarmoq maskasi va manzillar soni',
    q: 'Kompyuter xonasi uchun 192.168.10.0/24 tarmogʻi ajratildi. Bu tarmoqda eng koʻpi bilan nechta qurilmaga manzil berish mumkin?',
    options: ['256 ta', '255 ta', '254 ta', '24 ta'],
    correct: 2,
    explain:
      '/24 maskada manzilning oxirgi 8 biti qurilmalar uchun qoladi: 2⁸ = 256 ta manzil. Ulardan ikkitasi qurilmaga berilmaydi: 192.168.10.0 — tarmoqning oʻz manzili, 192.168.10.255 — keng eshittirish (broadcast) manzili. Qoladi 254 ta: 192.168.10.1 dan 192.168.10.254 gacha.',
  },
  {
    id: 12,
    topic: 'IP va xizmatlar',
    focus: 'Diagnostika: nom va manzil',
    q: 'Kompyuterda «ping 8.8.8.8» buyrugʻi muvaffaqiyatli ishlayapti, lekin brauzer birorta saytni nomi boʻyicha ocha olmayapti — «server nomi topilmadi» degan xato chiqadi. Eng ehtimoliy sabab nima?',
    options: [
      'Tarmoq kabeli uzilgan',
      'DHCP server manzil bermagan',
      'Standart shlyuz (gateway) notoʻgʻri koʻrsatilgan',
      'DNS xizmati ishlamayapti yoki DNS server manzili notoʻgʻri',
    ],
    correct: 3,
    explain:
      '8.8.8.8 manziliga ping oʻtayotgani kabel, IP-manzil va shlyuz joyida ekanini, yaʼni internetga yoʻl borligini koʻrsatadi. Ishlamayotgani — sayt nomini IP-manzilga aylantirish, bu esa DNS xizmatining vazifasi. Shuning uchun avval kompyuterda koʻrsatilgan DNS server manzilini va DNS xizmatining oʻzini tekshirish kerak.',
  },

  /* ------------------------------ Xavfsizlik ------------------------------ */
  {
    id: 13,
    topic: 'Xavfsizlik',
    focus: 'Segmentatsiya',
    q: 'Oʻquvchilar oʻqituvchining kompyuteriga hech qanday yoʻl bilan kira olmasligi, lekin fayl serveriga ulana olishi kerak. Eng toʻgʻri yechim qaysi?',
    options: [
      'Tarmoqni VLAN segmentlariga boʻlib, ular orasiga firewall qoidalarini qoʻyish',
      'Oʻqituvchi parolini hech kimga aytmasligi',
      'Barcha kompyuterlarga antivirus oʻrnatish',
      'Wi-Fi parolini murakkablashtirish',
    ],
    correct: 0,
    explain:
      'Parolni sir saqlash zarur, lekin u tarmoq darajasidagi toʻsiq emas. Segmentatsiya va firewall qoidasi esa texnik toʻsiq yaratadi: oʻquvchilar segmentidan maʼmuriyat segmentiga yoʻl umuman ochilmaydi, fayl serveriga esa faqat kerakli xizmat uchun ruxsat beriladi. Antivirus tarmoq ichidagi ruxsatsiz kirishni toʻxtatmaydi.',
  },
  {
    id: 14,
    topic: 'Xavfsizlik',
    focus: 'Autentifikatsiya',
    q: 'Xodim fishing sahifasiga parolini kiritib qoʻydi — parol endi hujumchining qoʻlida. Qaysi chora oldindan yoqilgan boʻlsa, begona kishi baribir hisobga kira olmas edi?',
    options: [
      'Yanada murakkab parol',
      'Parolni har 30 kunda almashtirish qoidasi',
      'Koʻp faktorli autentifikatsiya (MFA)',
      'Boshqa brauzerdan foydalanish',
    ],
    correct: 2,
    explain:
      'Parol allaqachon hujumchiga maʼlum — uning murakkabligi endi yordam bermaydi. MFA esa ikkinchi dalilni (telefondagi kod, ilova tasdigʻi yoki xavfsizlik kaliti) talab qiladi, shuning uchun parolning oʻzi hisobga kirish uchun yetarli boʻlmaydi. Shu bilan birga, oshkor boʻlgan parolni darhol almashtirish ham shart.',
  },
  {
    id: 15,
    topic: 'Xavfsizlik',
    focus: 'Xavfsizlikning uch ustuni',
    q: 'Maktab serveriga DDoS hujumi uyushtirildi: elektron jurnal uch soat davomida ochilmadi. Maʼlumotlar oʻgʻirlanmadi ham, oʻzgartirilmadi ham. Axborot xavfsizligining qaysi xususiyati buzildi?',
    options: [
      'Maxfiylik (confidentiality)',
      'Yaxlitlik (integrity)',
      'Foydalanuvchanlik (availability)',
      'Hech biri — maʼlumot oʻgʻirlanmagan',
    ],
    correct: 2,
    explain:
      'Xavfsizlik uch ustunga tayanadi: maxfiylik (maʼlumotni faqat ruxsat etilgan kishi koʻradi), yaxlitlik (maʼlumot oʻzgarmagan va buzilmagan) va foydalanuvchanlik (maʼlumot kerak paytda mavjud va ishlaydi). DDoS hujumi aynan uchinchisini buzadi: xizmat ishlamay qoladi. «Hech narsa oʻgʻirlanmadi» degani «xavfsizlik buzilmadi» degani emas.',
  },

  /* ------------------------------ Tahdidlar va firewall ------------------------------ */
  {
    id: 16,
    topic: 'Tahdidlar va firewall',
    focus: 'Ransomware va zaxira strategiyasi',
    q: 'Maktab barcha zaxira nusxalarini serverga doimiy ulangan tarmoq diskida saqlaydi. Nega bu xavfli?',
    options: [
      'Tarmoq tezligini pasaytiradi',
      'Juda koʻp joy egallaydi',
      'Boshqa foydalanuvchilar undan foydalana olmaydi',
      'Ransomware zaxira nusxasini ham shifrlab qoʻyishi mumkin',
    ],
    correct: 3,
    explain:
      'Ransomware tarmoqdagi barcha ulangan saqlagichlarni qidirib topadi va shifrlaydi — zaxira ham asl nusxa bilan birga yoʻqoladi. Shuning uchun 3-2-1 qoidasida (3 ta nusxa, 2 xil tashuvchi, 1 tasi boshqa joyda) kamida bitta nusxa oflayn yoki oʻzgartirib boʻlmaydigan boʻlishi talab qilinadi.',
  },
  {
    id: 17,
    topic: 'Tahdidlar va firewall',
    focus: 'Firewall: standart taqiq (default deny)',
    q: 'Firewallda ikkita ruxsat qoidasi bor: 1) oʻquv xonasi → fayl serveri, TCP 445; 2) oʻquv xonasi → internet, TCP 80 va 443. Roʻyxat oxirida standart qoida turadi: «qolgan hammasi taqiqlanadi». Oʻquvchi kompyuteridan maʼmuriyat kompyuteriga SSH (TCP 22) orqali ulanishga urinildi. Nima boʻladi?',
    options: [
      'Bloklanadi: ulanish hech bir ruxsat qoidasiga mos kelmaydi, shuning uchun standart taqiq ishlaydi',
      'Oʻtadi: SSH ulanishini taqiqlovchi alohida qoida yozilmagan',
      'Oʻtadi: 1-qoida oʻquv xonasidan chiqadigan trafikka ruxsat bergan',
      'Firewall ulanishni toʻxtatib turadi va administratordan ruxsat soʻraydi',
    ],
    correct: 0,
    explain:
      'Firewall qoidalarni yuqoridan pastga qarab oʻqiydi va birinchi mos kelganini qoʻllaydi. Bu ulanish 1-qoidaga ham, 2-qoidaga ham mos emas (manzil va port boshqa), shuning uchun oxirgi standart qoida — default deny — ishlaydi. «Aniq ruxsat berilmagan hamma narsa taqiqlangan» tamoyili har bir xavfli portni alohida sanab chiqishdan ancha ishonchli.',
  },
  {
    id: 18,
    topic: 'Tahdidlar va firewall',
    focus: 'Fishingni tanib olish',
    q: 'Hisobchiga «bank xavfsizlik xizmati» nomidan xat keldi: «Hisobingiz 24 soat ichida bloklanadi. Quyidagi havola orqali kirib, parolingizni tasdiqlang». Havoladagi manzil bankning rasmiy saytiga oʻxshaydi, lekin bir harfi boshqacha. Eng toʻgʻri harakat qaysi?',
    options: [
      'Havola orqali kirib, darhol yangi murakkab parol oʻrnatish',
      'Havolani bosmaslik, bankka rasmiy sayt yoki telefon orqali murojaat qilib tekshirish va xat haqida masʼul xodimga xabar berish',
      'Xatga javob yozib, joʻnatuvchidan shaxsini tasdiqlashni soʻrash',
      'Xatni hamkasblarga yuborib, ular ham parolini tasdiqlab olishini aytish',
    ],
    correct: 1,
    explain:
      'Shoshiltirish, tahdid va rasmiy manzilga oʻxshatilgan soxta havola — fishingning asosiy belgilari. Havola soxta sahifaga olib boradi va u yerda kiritilgan parol hujumchiga tushadi. Toʻgʻri yoʻl — xatdagi havoladan emas, oldindan maʼlum boʻlgan rasmiy kanaldan tekshirish va hodisa haqida xabar berish. Bunday xatni antivirus ham, firewall ham har doim toʻxtata olmaydi — oxirgi himoya qatlami foydalanuvchining oʻzi.',
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
  { key: 'alo', label: 'Aʼlo', text: 'Mavzu toʻliq oʻzlashtirilgan.', tone: 'green', range: '86–100%' },
  { key: 'yaxshi', label: 'Yaxshi', text: 'Asosiy tushunchalar oʻzlashtirilgan, ayrim joylarni takrorlash foydali.', tone: 'blue', range: '71–85%' },
  { key: 'qoniqarli', label: 'Qoniqarli', text: 'Asoslar bor, lekin xato qilingan mavzularga qaytish kerak.', tone: 'amber', range: '56–70%' },
  { key: 'qayta', label: 'Qayta oʻrganish tavsiya etiladi', text: 'Mavzuni boʻlimlar boʻyicha qaytadan koʻrib chiqing va testni yana ishlang.', tone: 'rose', range: '0–55%' },
]

/** Foiz (0–100, yaxlitlangan) boʻyicha baho darajasi. */
export function verdictFor(percent: number): Verdict {
  if (percent >= 86) return VERDICTS[0]
  if (percent >= 71) return VERDICTS[1]
  if (percent >= 56) return VERDICTS[2]
  return VERDICTS[3]
}
