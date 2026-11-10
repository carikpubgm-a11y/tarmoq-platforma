# Loyiha hisoboti

**Mavzu:** Kompyuter tarmoqlarini loyihalash va tarmoq xavfsizligini oʻqitish
**Fan:** Matematika va informatikani oʻqitish metodikasi
**Foydalanuvchilar:** 8–9-sinf oʻquvchilari · **Sana:** 2026-11-10

---

## 1. Loyiha nima qiladi

Oʻquvchi **ism va familiyasi** bilan kiradi (parol kerak emas), darslarni oʻqiydi, oʻz tarmogʻini quradi va testni yechadi. Har bir vazifa uchun **ball** oladi; sinf **reytingi** avtomatik shakllanadi. Oʻqituvchi alohida panelda hamma natijani koʻradi, **baho qoʻyadi** va eng ilgʻor oʻquvchini aniqlaydi. Yakunda oʻquvchi **ism-familiyasi va mavzu nomi yozilgan sertifikat** oladi.

| Qism | Nima beradi |
|---|---|
| 17 ta boʻlim | Nazariya → laboratoriya → metodlar → test → reyting → sertifikat |
| Tarmoq konstruktori | Qurilma qoʻshish, sim ulash, IP sozlash, xabar yuborish, xatoni topish |
| Firewall laboratoriyasi | Qoida yozish, trafikni oʻtkazish yoki toʻxtatish |
| 5 pedagogik metod | Muammoli taʼlim, Snowball, Double-Entry Journal, namoyish, amaliy topshiriq |
| Test markazi | 18 vaziyatli savol, mavzu kesimida tahlil |
| Oʻqituvchi paneli | Natijalar jadvali, baho (2–5), izoh, CSV, reyting, tozalash |
| Himoya rejimi | Yirik matn, ← → navigatsiya, faqat oʻqituvchi koʻradigan ssenariy |

---

## 2. Texnik yechim

- **Sayt:** Vite + React + TypeScript + Tailwind CSS
- **Server:** Node.js (`server.js`) — **tashqi kutubxonasiz**, saytni ham tarqatadi, API ham beradi
- **Maʼlumot:** `data/maktab.json` — serverning yonidagi oddiy fayl
- **Tashqi xizmat yoʻq:** bulut bazasi, API kalit, toʻlov va roʻyxatdan oʻtish talab qilinmaydi
- **Oflayn:** shriftlar loyihaga yigʻilgan, internetga soʻrov yuborilmaydi. Sinf Wi-Fi'si orqali bolalar oʻqituvchining kompyuteriga ulanadi
- **Server oʻchsa:** oʻquvchi vazifani baribir bajaradi — natija brauzerda saqlanadi va server qaytganda avtomatik yuboriladi

### Ball qanday hisoblanadi
Har bir vazifa uchun foiz (14/18 = 78 ball). Jami ball — barcha vazifalar foizining yigʻindisi, shuning uchun koʻproq vazifa bajargan oʻquvchi yuqoriroq turadi. Vazifa qayta bajarilsa — **eng yaxshi natija** saqlanadi.

---

## 3. Dizayn: nima oʻzgardi

Oldingi versiya bitta toʻq rangda va universitet darajasida edi. 8–9-sinf uchun qayta ishlandi:

| Oldin | Hozir |
|---|---|
| Bitta toʻq koʻk rang | Yorqin, rang-barang: har bir boʻlimga oʻz rangi (binafsha, firuza, yashil, sariq, pushti) |
| Yassi, kichik kartalar | Katta yumaloq kartalar, rangli yuqori chiziq, sichqoncha tegsa koʻtariladi |
| Kichik matn (16px) | Yirik matn (17px, himoya rejimida 20px) |
| Animatsiya deyarli yoʻq | Paydo boʻlish, sakrash, silkinish, **toʻgʻri javobda konfetti** |
| Uzun universitet matni | Qisqa jumlalar, maktab hayotidan qiyoslar, jadval va rasm |
| Metodik tavsif hamma joyda | Oʻquvchiga qisqa qadamlar; metodik tavsif oʻqituvchi tugmasi ortida |

---

## 4. Sifat nazorati

Sinov usuli: **headless Chrome orqali real bosishlar** va server API'sini bevosita sinash.

### Server (API)
| Sinov | Natija |
|---|---|
| Ism-familiya bilan kirish | ✅ ishlaydi |
| Familiyasiz / qisqa ism | ✅ tushunarli xato xabari |
| Takroriy kirish | ✅ bir xil hisob qaytadi (dublikat yaratilmaydi) |
| Eng yaxshi natija saqlanishi | ✅ 14/18 dan keyin 9/18 yuborilsa, 14/18 qoladi |
| Reyting tartibi | ✅ ball boʻyicha toʻgʻri |
| PIN himoyasi (baho, oʻchirish, panel) | ✅ notoʻgʻri PIN rad etiladi |
| Baho qoʻyish va saqlanishi | ✅ ishlaydi |
| PIN almashtirish | ✅ qisqa PIN rad etiladi, yangisi ishlaydi |
| Nomaʼlum oʻquvchi / boʻsh vazifa | ✅ xato qaytaradi, server yiqilmaydi |
| Fayl saqlanishi | ✅ `data/maktab.json` yangilanadi |

### Brauzerda (toʻliq yoʻl)
| Sinov | Natija |
|---|---|
| Oʻquvchi kirishi → bosh sahifa | ✅ ism, sinf va ball yuqorida koʻrinadi |
| Vazifa bajarish → serverga yuborilishi | ✅ avtomatik, 1–2 soniyada |
| Ballning avtomatik yangilanishi | ✅ har 20 soniyada va sahifa ochilganda |
| Reyting sahifasi | ✅ soʻril, medallar, «Bu — siz!» belgisi |
| Sertifikat | ✅ ism-familiya va mavzu bilan, chop etiladi |
| Oʻqituvchi paneli (PIN 2026) | ✅ jadval, baho, CSV, tozalash |
| Himoya rejimi (← → G N F) | ✅ ishlaydi |
| Mobil (375px) | ✅ gorizontal chiqib ketish yoʻq |
| TypeScript | ✅ 0 xato |
| Brauzer konsoli | ✅ 0 xato |

---

## 5. Bilib qoʻyish kerak boʻlgan joylar

- **PIN — oddiy himoya.** U maxfiy maʼlumotni emas, tasodifiy ochilishni toʻsadi. Natijalar (ism va ball) maxfiy maʼlumot emas.
- **Laboratoriya — oʻquv modeli.** Haqiqiy tarmoq boshqarilmaydi; VLAN raqamlari, NAT jadvali va murakkab firewall holatlari soddalashtirilgan. Buni sahifalarning oʻzi ham aytadi.
- **Bepul hostingda disk vaqtinchalik** boʻlishi mumkin — server qayta ishga tushsa, natijalar tozalanishi mumkin. Shuning uchun darsdan keyin **CSV** qilib yuklab olish tavsiya etiladi.
- **Bitta Wi-Fi shart.** Bolalar oʻqituvchining kompyuteriga ulanishi uchun bitta tarmoqda boʻlishi kerak.

---

## 6. Himoya kuni tartibi

1. `npm run dars` — sayt yigʻiladi va server ishga tushadi.
2. Oʻqituvchi panelida **«Hammasini oʻchirish»** — sinov natijalarini tozalash.
3. Bolalarga terminalda chiqqan `http://192.168.x.x:3000` manzilini berish.
4. Bolalar ism-familiyasi bilan kiradi va vazifalarni bajaradi.
5. Oʻqituvchi panelida natijalar jonli koʻrinadi → baho qoʻyiladi → reytingdan eng ilgʻor oʻquvchi aniqlanadi.
6. Oʻquvchilar sertifikatini chop etadi.
