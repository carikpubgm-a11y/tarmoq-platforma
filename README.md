# Tarmoq platformasi — maktab darsi uchun

**«Kompyuter tarmoqlarini loyihalash va tarmoq xavfsizligini oʻqitish»** — 8–9-sinf oʻquvchilari uchun interaktiv taʼlim platformasi. «Matematika va informatikani oʻqitish metodikasi» fanidan mustaqil taʼlim loyihasi.

Oʻquvchilar **ism va familiyasi** bilan kiradi, darslarni oʻqiydi, oʻz tarmogʻini quradi, test yechadi. Har bir vazifa uchun **ball** oladi, sinf **reytingi** shakllanadi, oxirida esa **ism-familiyasi yozilgan sertifikat** chiqadi. Oʻqituvchi alohida panelda hamma natijani koʻradi va baho qoʻyadi.

Texnologiya: **Vite + React + TypeScript + Tailwind** (sayt) va **Node.js** (kichik server). Tashqi xizmat, API kalit yoki toʻlov kerak emas — natijalar serverning yonidagi `data/maktab.json` faylida saqlanadi.

---

## Tez ishga tushirish (dars uchun)

```bash
npm install
```

```bash
npm run dars
```

Shu bitta buyruq saytni yigʻadi va serverni ishga tushiradi. Terminalda ikkita manzil chiqadi:

- `http://localhost:3000` — shu kompyuter uchun
- `http://192.168.x.x:3000` — **sinfdagi bolalar shu manzilni** telefon yoki kompyuterida ochadi (bitta Wi-Fi tarmogʻida boʻlishi kerak)

Oʻqituvchi paneli: saytda yuqori oʻngdagi **⋮ → Natijalar va baholar**, yoki toʻgʻridan-toʻgʻri `/#/oqituvchi`.
Boshlangʻich PIN — **2026** (panelning oʻzida oʻzgartiriladi).

---

## Kimga nima koʻrinadi

| Kim | Nima qiladi |
|---|---|
| **Oʻquvchi** | Ism-familiya va sinfni yozib kiradi → darslar, laboratoriya, test → ball va reyting → sertifikat |
| **Oʻqituvchi** | ⋮ menyu → natijalar jadvali, har bir vazifa boʻyicha foiz, baho qoʻyish (2–5), izoh, CSV yuklash, reyting, natijalarni tozalash |
| **Himoya kuni** | ⋮ → «Himoya rejimi»: yirik matn, ← → strelkalar bilan slayd kabi oʻtish, **N** — faqat sizga koʻrinadigan taqdimot ssenariysi |

---

## Buyruqlar

| Buyruq | Nima qiladi |
|---|---|
| `npm run dars` | Yigʻadi va serverni ishga tushiradi — **dars uchun shu yetarli** |
| `npm run dev` | Dasturchi rejimi (sayt 5173-portda, server alohida `npm start` bilan 3000-portda) |
| `npm run build` | Faqat yigʻadi → `dist/` |
| `npm start` | Faqat serverni ishga tushiradi (avval `npm run build` qilingan boʻlsin) |
| `npm run build:offline` | Bitta HTML fayl → `dist-offline/index.html` |

**Portni oʻzgartirish:** `PORT=8080 npm start`
**PIN kodni boshidan belgilash:** `OQITUVCHI_PIN=1234 npm start`

---

## Natijalar qayerda?

`data/maktab.json` — serverning yonidagi oddiy fayl. Unda oʻquvchilar roʻyxati, har bir vazifa natijasi va oʻqituvchi qoʻygan baholar bor. Zaxira nusxa olish uchun shu faylni koʻchirib qoʻysangiz kifoya; oʻchirsangiz — hammasi tozalanadi.

Ball qanday hisoblanadi: har bir vazifa uchun **foiz** (masalan 14/18 = 78 ball). Jami ball — barcha vazifalar foizining yigʻindisi, shuning uchun koʻp vazifa bajargan oʻquvchi yuqoriroq turadi. Vazifa qayta bajarilsa, **eng yaxshi natija** saqlanadi.

---

## Internet boʻlmasa

Platforma internetsiz ham toʻliq ishlaydi — shriftlar va rasmlar ichiga yigʻilgan, tashqi xizmatga soʻrov yuborilmaydi. Sinf Wi-Fi'si orqali bolalar oʻqituvchining kompyuteridagi serverga ulanadi.

Agar server umuman ishga tushmasa, bola vazifalarni baribir bajara oladi: natijalar oʻz brauzerida saqlanib turadi va server qaytganda avtomatik yuboriladi. Faqat reyting va sertifikatdagi umumiy natija server bilan toʻliq boʻladi.

**Butunlay zaxira variant:** `npm run build:offline` → `dist-offline/index.html` — bitta fayl, fleshkada olib borib ikki marta bosib ochiladi (bu holda reyting boʻlmaydi, faqat shaxsiy natija).

---

## Internetga qoʻyish

Sayt + server bitta Node dasturi, shuning uchun **Node ishlatadigan** bepul hosting kerak (Render, Railway, Fly, Glitch). Sozlamalar:

- Build: `npm install && npm run build`
- Start: `npm start`
- Port: dastur `PORT` muhit oʻzgaruvchisini oʻzi oʻqiydi

> Eslatma: bepul hostinglarda disk vaqtinchalik boʻlishi mumkin — server qayta ishga tushsa, `data/maktab.json` tozalanib ketishi mumkin. Bitta dars uchun bu muammo emas; muhim natijalarni darsdan keyin **CSV** qilib yuklab oling (oʻqituvchi panelida tugma bor).

Faqat saytning oʻzini (serversiz, reytingsiz) qoʻymoqchi boʻlsangiz, Vercel/Netlify'ga `dist/` papkasini joylash ham mumkin.

---

## Loyiha tuzilishi

| Qism | Yoʻl |
|---|---|
| Kichik server (ism va natijalar jadvali) | `server.js`, maʼlumot: `data/maktab.json` |
| Server bilan aloqa va oʻquvchi sessiyasi | `src/lib/api.ts`, `src/lib/student.tsx` |
| Dizayn tizimi (rang, animatsiya, komponentlar) | `src/components/ui.tsx`, `src/index.css`, `tailwind.config.js` |
| Boʻlimlar roʻyxati va oʻqituvchi ssenariysi | `src/data/sections.ts` |
| Darslar | `src/pages/*.tsx` |
| Tarmoq konstruktori va firewall laboratoriyasi | `src/lab/`, mantiq: `src/lib/net.ts` |
| Pedagogik metodlar | `src/pages/methods/` |
| Test | `src/data/quiz.ts`, `src/pages/Test.tsx` |
| Kirish, reyting, sertifikat, oʻqituvchi paneli | `src/pages/OquvchiKirish.tsx`, `Reyting.tsx`, `Sertifikat.tsx`, `Oqituvchi.tsx` |

---

## Himoya kuni — eslatma

1. Darsdan oldin: `npm run dars`, soʻng oʻqituvchi panelida **«Hammasini oʻchirish»** bilan sinov natijalarini tozalang.
2. Bolalarga terminalda chiqqan `http://192.168.x.x:3000` manzilini yozib bering.
3. Himoya rejimi: ⋮ → «Himoya rejimi». Klaviatura: **← →** boʻlimlar, **G** boʻlimlar roʻyxati, **N** ssenariy, **F** toʻliq ekran.
4. Har bir simulyatorda **«Katta ekran»** tugmasi bor.
