# Yakuniy sifat nazorati hisoboti

Sana: 2026-11-10 · Sinov usuli: headless Chrome (CDP) orqali **real bosishlar va klaviatura** bilan avtomatik sinov + production build tekshiruvi. Barcha sinovlar **internetsiz (offline) rejimda**, yigʻilgan `dist-offline/index.html` fayli ustida oʻtkazildi.

## 1. Mazmun yaxlitligi — ✅
- Asl `informatika.html` dagi barcha boʻlimlar koʻchirildi: dolzarblik, maqsadlar, asoslar (4 qatlam), turlari, topologiyalar, qurilmalar, 7 bosqich, maktab tarmogʻi, paket oqimi, IP/DHCP/DNS, xavfsizlik ustunlari, tahdidlar, firewall, autentifikatsiya, zaxira/monitoring, amaliy topshiriqlar (A/B/C), 8 ta test savoli, metodika, Snowball, Double-Entry Journal, xulosa, 13 manba.
- Asl fayl oʻzgartirilmadi; alohida tuzatilgan nusxasi ham saqlanib qoldi (`informatika.html`, zaxira: `informatika.asl-nusxa.html`).
- Texnik aniqlik uchun kiritilgan tuzatishlar (masalan, «cherv» → «tarmoq qurti», hub — 1-qatlam, APIPA izohi) agent hisobotlarida qayd etilgan.

## 2. Pedagogik sifat — ✅
- Har bir nazariy sahifada: **Mavzu maqsadi → nazariya → vizual misol → hayotiy misol → asosiy xulosa → interaktiv topshiriq** (sinovda 15 sahifaning barchasida bloklar topildi).
- Har bir metod sahifasida yetti qismli pasport: maqsadi, qanday ishlashi, oʻqituvchi va talaba vazifasi, real misol, kutiladigan natija, baholash mezoni.
- Baholash: test (18 savol, izohli), muammoli taʼlim (100 ball, 6 mezon), amaliy topshiriq (100 ball, 6 mezon), laboratoriya topshiriqlari (6 ta, avtomatik) — hammasi «Amaliy ishlar natijalari» jadvalida jamlanadi.

## 3. Interaktivlik (real sinov natijalari) — ✅
| Sinov | Natija |
|---|---|
| 24 marshrut (sahifa) ochildi | 24/24, konsolda 0 xato, 0 exception |
| Tarmoq konstruktori: 9 qurilma qoʻshish, sichqoncha bilan kabel ulash, surish (drag), nomlash, oʻchirish | ishlaydi |
| Avto IP, qoʻlda IP/maska/shlyuz, xato xabarlari (format, tarmoq manzili, ziddiyat, notoʻgʻri shlyuz) | ishlaydi, har xatoga «qanday tuzatiladi» izohi chiqadi |
| Ping: bitta tarmoq, router orqali, uzilgan kabel, shlyuzsiz, IP ziddiyati, firewall bloki | 6 ssenariy ham toʻgʻri natija berdi |
| 6 andoza (yulduz, shina, halqa, toʻr, ofis, ikki tarmoq) + topologiyani avtomatik aniqlash | ishlaydi; shina oʻrtasi uzilganda tarmoq boʻlinadi, toʻrda uzilish taʼsir qilmaydi |
| Firewall laboratoriyasi: qoida qoʻshish/oʻchirish/tartiblash, default deny, 8 sinov paketi, 4 vazifa, jurnal | ishlaydi; qoida tartibi natijani oʻzgartirishi sinovda tasdiqlandi |
| Muammoli taʼlim: 6 bosqich, baholash (boʻsh=0, qoʻlda=55, namuna=100 ball) | ishlaydi |
| Snowball: 1→2→4 bosqich, fikr tanlash (3 tadan ortiq tanlanmaydi), tartiblash, ekspert bilan solishtirish | ishlaydi |
| Jurnal: yozish/taqqoslash, qator qoʻshish/oʻchirish, namunaviy izohlar | ishlaydi |
| Namoyish: 5 qadam, kabel/IP animatsiyasi, paket, firewall, «Oʻqituvchi nima deydi?» | ishlaydi |
| Amaliy topshiriq: namunaviy yechim 79→100 ball, kabel olib tashlansa 78 ball | mezonlar real holatga sezgir |
| Test: 18 savol toʻliq oʻtildi, natija 10/18 (56%), mavzu kesimi, tavsiya havolalari, xatolarni koʻrish (8), qayta ishlash | ishlaydi |
| Qayta boshlash / tozalash tugmalari (lab, firewall, metodlar, test) | ishlaydi |
| Javoblar localStorage'da saqlanishi va sahifa yangilanganda qolishi | tasdiqlandi |

## 4. Himoyaga tayyorlik — ✅
- `#/himoya` sahifasi: salomlashuv matni, mavzu, fan, oʻquv maqsadi, 7 banddan iborat reja, «Mashgʻulotni boshlash» tugmasi, taqdimotchi maydonlari.
- Himoya rejimi sinovda: shrift 16px→18.9px, yon panel yashirinadi, pastki slayd-panel chiqadi, **← →** (2→3→2-boʻlim), **G** (22 boʻlimli toʻr), **N** (ssenariy paneli), **Esc**, «Chiqish» — hammasi ishladi; matn maydonida yozayotganda strelkalar sahifani almashtirmasligi tekshirildi.
- Oʻqituvchi ssenariysi (`#/ssenariy`): har boʻlim uchun vaqt, nima tushuntirish, metod, nima namoyish qilish; «qisqa himoya» filtri bilan.

## 5. Texnik sinov — ✅
- `npx tsc --noEmit` — 0 xato; `npm run build` — muvaffaqiyatli (JS 765 KB / gzip 227 KB).
- Desktop (1440px) va mobil (375px): 24 sahifada gorizontal chiqib ketish **0 px**; mobil menyu ochilishi/yopilishi sinaldi.
- Konsol: butun sinov davomida 0 ta xato, 0 ta warning, 0 ta exception.
- Oflayn: tarmoq butunlay oʻchirilgan holda barcha funksiyalar ishladi; tashqi soʻrovlar yoʻq (shriftlar ichiga yigʻilgan).
- Chop etish: `@media print` — navigatsiya yashirinadi, oq fon; jurnal va ssenariyda «Chop etish» tugmasi bor.
- Tashqi havolalar (5 vosita sayti) HTTP 200 qaytarishi tekshirildi.

## 6. Kamchiliklar / bilib qoʻyish kerak boʻlgan joylar
- Laboratoriya sinflarda soddalashtirilgan oʻquv modeli: VLAN raqamlari, NAT jadvali va stateful firewall modellashtirilmagan (sahifalarda bu ochiq aytilgan).
- 1440px dan tor oynada laboratoriya sxemasi gorizontal aylantiriladi (mobil uchun ataylab shunday); himoyada «Katta ekran» tugmasi tavsiya etiladi.
- Tor ekranlarda (<1280px) olti bosqichli stepper 2–3 qatorga oʻraladi — bu xato emas, joy tejash.
- Real brauzerda qoʻl bilan yakuniy bir marta koʻrib chiqish foydali (avtomatik sinov piksel aniqligini toʻliq kafolatlamaydi).

**Xulosa:** barcha eʼlon qilingan funksiyalar real sinovdan oʻtdi; ishlamaydigan yoki «bezak uchun» tugma yoʻq. Loyiha himoyaga tayyor.
