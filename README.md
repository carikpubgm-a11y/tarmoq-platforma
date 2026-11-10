# Tarmoq platformasi

**«Kompyuter tarmoqlarini loyihalash va tarmoq xavfsizligini oʻqitish»** — «Matematika va informatikani oʻqitish metodikasi» fanidan mustaqil taʼlim loyihasi uchun interaktiv taʼlim platformasi.

Texnologiyalar: **Vite + React 19 + TypeScript + Tailwind CSS**. Backend yoʻq — barcha maʼlumotlar brauzerning oʻzida (localStorage) saqlanadi, roʻyxatdan oʻtish talab qilinmaydi, tashqi xizmatlarga soʻrov yuborilmaydi (shriftlar ham loyiha ichiga yigʻilgan).

## Tuzilma

| Qism | Yoʻl |
|---|---|
| 15 boʻlimli navigatsiya, boʻlimlar roʻyxati | `src/data/sections.ts` |
| Nazariy sahifalar (har birida: maqsad → nazariya → vizual → hayotiy misol → xulosa → topshiriq) | `src/pages/*.tsx` |
| Tarmoq konstruktori (qurilma, kabel, IP, ping, diagnostika) | `src/lab/NetworkLab.tsx`, mantiq: `src/lib/net.ts` |
| Firewall laboratoriyasi (qoidalar, vazifalar, jurnal) | `src/lab/FirewallLab.tsx` |
| 5 pedagogik metod (muammoli, Snowball, jurnal, namoyish, amaliy) | `src/pages/methods/` |
| Test markazi (18 savol, mavzu kesimi, tavsiyalar) | `src/data/quiz.ts`, `src/pages/Test.tsx` |
| Himoya rejimi va oʻqituvchi ssenariysi | `src/pages/Himoya.tsx`, `src/pages/Ssenariy.tsx`, `src/lib/defense.tsx` |

## Ishga tushirish

```bash
npm install        # bir marta
npm run dev        # http://localhost:5173
```

## Production build

```bash
npm run build      # dist/ — Vercel/statik hosting uchun
npm run preview    # buildni lokal koʻrish
```

### Oflayn (bitta fayl) varianti

```bash
npm run build:offline
```

Natija: `dist-offline/index.html` — **bitta HTML fayl (~1 MB)**. Uni fleshkaga koʻchirib, internetsiz kompyuterda ikki marta bosib ochish mumkin — himoya kuni uchun zaxira variant. Barcha funksiyalar (laboratoriya, metodlar, test) oflayn ishlaydi; faqat «Raqamli vositalar» va «Manbalar»dagi tashqi havolalar ochilmaydi.

## Vercel'ga joylashtirish

**1-usul — GitHub orqali (tavsiya etiladi):**
1. Loyihani GitHub'ga yuklang:
   ```bash
   cd tarmoq-platforma
   git init && git add -A && git commit -m "Tarmoq platformasi"
   # GitHub'da yangi repository yarating, soʻng:
   git remote add origin https://github.com/SIZNING-LOGIN/tarmoq-platforma.git
   git push -u origin main
   ```
2. [vercel.com](https://vercel.com) → **Add New → Project** → repositoryni tanlang.
3. Vercel `vercel.json` dagi sozlamalarni oʻzi oʻqiydi (framework: Vite, build: `npm run build`, chiqish: `dist`). **Deploy** tugmasini bosing.
4. Bir daqiqada `https://tarmoq-platforma-….vercel.app` koʻrinishidagi ommaviy URL tayyor boʻladi. Keyingi har bir `git push` avtomatik qayta joylaydi.

**2-usul — CLI orqali (GitHubsiz):**
```bash
npx vercel login
npx vercel --prod
```

Environment variables kerak emas (hech qanday API kalit ishlatilmaydi). Marshrutlar `#/` (hash) asosida ishlagani uchun qoʻshimcha rewrite sozlash ham shart emas.

## Himoya kuni — eslatma

- Bosh sahifa → **Himoya rejimi** (yoki toʻgʻridan-toʻgʻri `#/himoya`).
- Klaviatura: **← →** boʻlimlar, **G** boʻlimlar toʻri, **N** oʻqituvchi ssenariysi, **F** toʻliq ekran.
- Har bir simulyatorda **«Katta ekran»** tugmasi bor.
- Mashq natijalarini oldindan tozalash: Test markazi → «Natijalarni tozalash», laboratoriya/metodlardagi «Tozalash» tugmalari.
