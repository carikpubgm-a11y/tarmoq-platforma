/* ==========================================================================
   Maktab tarmoq platformasi — kichik server.
   Hech qanday tashqi kutubxona va xizmat kerak emas: Node.js ning oʻzi yetarli.
   Oʻquvchilar roʻyxati va natijalar shu serverning yonidagi
   data/maktab.json faylida saqlanadi.

   Ishga tushirish:  node server.js     (yoki: npm start)
   Port:             PORT muhit oʻzgaruvchisi, boʻlmasa 3000
   ========================================================================== */
import { createServer } from 'node:http'
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises'
import { createReadStream } from 'node:fs'
import { extname, join, normalize, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { networkInterfaces } from 'node:os'

const ROOT = dirname(fileURLToPath(import.meta.url))
const DIST = join(ROOT, 'dist')
const DATA_DIR = join(ROOT, 'data')
const DATA_FILE = join(DATA_DIR, 'maktab.json')
const PORT = Number(process.env.PORT) || 3000
const PIN_DEFAULT = process.env.OQITUVCHI_PIN || '2026'

/* ------------------------------ Maʼlumot bazasi (JSON fayl) ------------------------------ */
/** { pin, oquvchilar: [{id, ism, sinf, baho, izoh, created}], natijalar: [{oquvchiId, vazifa, ball, maks, izoh, urinish, vaqt}] } */
let db = { pin: PIN_DEFAULT, oquvchilar: [], natijalar: [] }
let saving = null, dirty = false

async function load() {
  try {
    const raw = await readFile(DATA_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    db = { pin: parsed.pin || PIN_DEFAULT, oquvchilar: parsed.oquvchilar || [], natijalar: parsed.natijalar || [] }
    console.log(`  Baza yuklandi: ${db.oquvchilar.length} oʻquvchi, ${db.natijalar.length} natija`)
  } catch {
    console.log('  Yangi baza yaratildi (data/maktab.json)')
  }
}
/** Yozishni birlashtiradi — koʻp soʻrov kelganda fayl bir marta yoziladi. */
async function save() {
  dirty = true
  if (saving) return saving
  saving = (async () => {
    while (dirty) {
      dirty = false
      await mkdir(DATA_DIR, { recursive: true })
      await writeFile(DATA_FILE, JSON.stringify(db, null, 2), 'utf8')
    }
    saving = null
  })()
  return saving
}

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
const norm = s => String(s || '').trim().replace(/\s+/g, ' ')
const key = s => norm(s).toLocaleLowerCase('uz')

/* ------------------------------ API ------------------------------ */
function jami(oquvchiId) {
  return db.natijalar.filter(n => n.oquvchiId === oquvchiId)
    .reduce((a, n) => a + (n.maks > 0 ? Math.round((n.ball / n.maks) * 100) : 0), 0)
}
function oquvchiHolati(o) {
  const nat = db.natijalar.filter(n => n.oquvchiId === o.id)
  return { ...o, familiya: o.familiya || '', toliqIsm: `${o.familiya || ''} ${o.ism}`.trim(), jamiBall: jami(o.id), bajarilgan: nat.length, natijalar: nat }
}

const API = {
  /** Oʻquvchi kirishi: shu ism-familiya va sinf avval boʻlsa — oʻsha hisob qaytadi. */
  'POST /api/oquvchi': body => {
    const ism = norm(body.ism), familiya = norm(body.familiya), sinf = norm(body.sinf) || 'Sinf koʻrsatilmagan'
    if (ism.length < 2) return [400, { xato: 'Ismingizni toʻliq yozing (kamida 2 harf).' }]
    if (familiya.length < 2) return [400, { xato: 'Familiyangizni toʻliq yozing (kamida 2 harf).' }]
    if (ism.length > 40 || familiya.length > 40) return [400, { xato: 'Ism yoki familiya juda uzun.' }]
    let o = db.oquvchilar.find(x => key(x.ism) === key(ism) && key(x.familiya) === key(familiya) && key(x.sinf) === key(sinf))
    if (!o) {
      o = { id: uid(), ism, familiya, sinf, baho: null, izoh: '', created: Date.now() }
      db.oquvchilar.push(o)
      save()
    }
    return [200, { oquvchi: oquvchiHolati(o) }]
  },

  /** Vazifa natijasi. Eng yaxshi urinish saqlanadi. */
  'POST /api/natija': body => {
    const { oquvchiId, vazifa } = body
    const ball = Number(body.ball) || 0, maks = Number(body.maks) || 0
    const o = db.oquvchilar.find(x => x.id === oquvchiId)
    if (!o) return [404, { xato: 'Oʻquvchi topilmadi. Qaytadan kiring.' }]
    if (!vazifa || maks <= 0) return [400, { xato: 'Vazifa maʼlumoti notoʻgʻri.' }]
    let n = db.natijalar.find(x => x.oquvchiId === oquvchiId && x.vazifa === vazifa)
    if (!n) {
      n = { oquvchiId, vazifa, ball, maks, izoh: norm(body.izoh), urinish: 1, vaqt: Date.now() }
      db.natijalar.push(n)
    } else {
      n.urinish += 1
      n.vaqt = Date.now()
      // eng yaxshi natija saqlanadi
      if (ball / maks >= n.ball / n.maks) { n.ball = ball; n.maks = maks; n.izoh = norm(body.izoh) }
    }
    save()
    return [200, { natija: n, jamiBall: jami(oquvchiId) }]
  },

  /** Reyting — oʻquvchilar uchun ham, oʻqituvchi uchun ham. */
  'GET /api/reyting': (_b, url) => {
    const sinf = url.searchParams.get('sinf')
    const list = db.oquvchilar
      .filter(o => !sinf || key(o.sinf) === key(sinf))
      .map(oquvchiHolati)
      .sort((a, b) => b.jamiBall - a.jamiBall || a.created - b.created)
    return [200, { reyting: list, sinflar: [...new Set(db.oquvchilar.map(o => o.sinf))].sort() }]
  },

  /** Oʻqituvchi paneli (PIN talab qilinadi). */
  'POST /api/oqituvchi': body => {
    if (String(body.pin) !== String(db.pin)) return [403, { xato: 'PIN kod notoʻgʻri.' }]
    return [200, {
      oquvchilar: db.oquvchilar.map(oquvchiHolati).sort((a, b) => b.jamiBall - a.jamiBall),
      sinflar: [...new Set(db.oquvchilar.map(o => o.sinf))].sort(),
    }]
  },

  /** Oʻqituvchi baho qoʻyadi. */
  'POST /api/baho': body => {
    if (String(body.pin) !== String(db.pin)) return [403, { xato: 'PIN kod notoʻgʻri.' }]
    const o = db.oquvchilar.find(x => x.id === body.oquvchiId)
    if (!o) return [404, { xato: 'Oʻquvchi topilmadi.' }]
    o.baho = body.baho === null || body.baho === '' ? null : Number(body.baho)
    o.izoh = norm(body.izoh)
    save()
    return [200, { oquvchi: oquvchiHolati(o) }]
  },

  /** Oʻquvchini yoki butun sinfni oʻchirish. */
  'POST /api/ochirish': body => {
    if (String(body.pin) !== String(db.pin)) return [403, { xato: 'PIN kod notoʻgʻri.' }]
    if (body.oquvchiId) {
      db.oquvchilar = db.oquvchilar.filter(o => o.id !== body.oquvchiId)
      db.natijalar = db.natijalar.filter(n => n.oquvchiId !== body.oquvchiId)
    } else if (body.sinf) {
      const ids = db.oquvchilar.filter(o => key(o.sinf) === key(body.sinf)).map(o => o.id)
      db.oquvchilar = db.oquvchilar.filter(o => !ids.includes(o.id))
      db.natijalar = db.natijalar.filter(n => !ids.includes(n.oquvchiId))
    } else if (body.hammasi === true) {
      db.oquvchilar = []; db.natijalar = []
    } else return [400, { xato: 'Nima oʻchirilishi koʻrsatilmagan.' }]
    save()
    return [200, { ok: true, qolgan: db.oquvchilar.length }]
  },

  /** PIN kodni almashtirish. */
  'POST /api/pin': body => {
    if (String(body.pin) !== String(db.pin)) return [403, { xato: 'Joriy PIN notoʻgʻri.' }]
    const yangi = norm(body.yangi)
    if (!/^\d{4,8}$/.test(yangi)) return [400, { xato: 'Yangi PIN 4–8 ta raqamdan iborat boʻlsin.' }]
    db.pin = yangi
    save()
    return [200, { ok: true }]
  },

  'GET /api/holat': () => [200, { ok: true, oquvchilar: db.oquvchilar.length, natijalar: db.natijalar.length }],
}

/* ------------------------------ Statik fayllar ------------------------------ */
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
}
async function serveStatic(req, res, pathname) {
  // Yoʻl ichidan chiqib ketishning oldini olamiz
  const safe = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '')
  let file = join(DIST, safe)
  if (!file.startsWith(DIST)) { res.writeHead(403).end('Taqiqlangan'); return }
  try {
    const s = await stat(file)
    if (s.isDirectory()) file = join(file, 'index.html')
  } catch {
    file = join(DIST, 'index.html') // SPA: qolgan hamma yoʻl index.html ga
  }
  try {
    await stat(file)
  } catch {
    res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' })
    res.end('<h1>Sayt hali yigʻilmagan</h1><p>Avval <code>npm run build</code> buyrugʻini bajaring.</p>')
    return
  }
  res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream', 'cache-control': extname(file) === '.html' ? 'no-cache' : 'public, max-age=3600' })
  createReadStream(file).pipe(res)
}

/* ------------------------------ Server ------------------------------ */
const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
  res.setHeader('access-control-allow-origin', '*')
  res.setHeader('access-control-allow-headers', 'content-type')
  res.setHeader('access-control-allow-methods', 'GET, POST, OPTIONS')
  if (req.method === 'OPTIONS') return res.writeHead(204).end()

  if (url.pathname.startsWith('/api/')) {
    const handler = API[`${req.method} ${url.pathname}`]
    if (!handler) return res.writeHead(404, { 'content-type': 'application/json' }).end(JSON.stringify({ xato: 'Bunday API yoʻq' }))
    let body = {}
    if (req.method === 'POST') {
      try {
        const chunks = []
        let size = 0
        for await (const c of req) { size += c.length; if (size > 1e6) throw new Error('katta'); chunks.push(c) }
        body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {}
      } catch {
        return res.writeHead(400, { 'content-type': 'application/json' }).end(JSON.stringify({ xato: 'Maʼlumot notoʻgʻri yuborildi' }))
      }
    }
    try {
      const [code, data] = handler(body, url)
      res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' }).end(JSON.stringify(data))
    } catch (e) {
      console.error('API xatosi:', e)
      res.writeHead(500, { 'content-type': 'application/json' }).end(JSON.stringify({ xato: 'Serverda xato' }))
    }
    return
  }
  await serveStatic(req, res, url.pathname)
})

await load()
server.listen(PORT, () => {
  const ips = Object.values(networkInterfaces()).flat().filter(i => i && i.family === 'IPv4' && !i.internal).map(i => i.address)
  console.log('\n  ┌─────────────────────────────────────────────┐')
  console.log('  │  Maktab tarmoq platformasi ishga tushdi     │')
  console.log('  └─────────────────────────────────────────────┘\n')
  console.log(`  Shu kompyuterda:  http://localhost:${PORT}`)
  ips.forEach(ip => console.log(`  Sinfdagi bolalar: http://${ip}:${PORT}`))
  console.log(`\n  Oʻqituvchi paneli: /#/oqituvchi   (PIN: ${db.pin})`)
  console.log(`  Natijalar fayli:   data/maktab.json\n`)
})
