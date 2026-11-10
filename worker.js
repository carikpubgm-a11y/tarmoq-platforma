/* ==========================================================================
   Cloudflare Workers uchun server.
   Internetdagi sayt shu fayl orqali ishlaydi: statik sahifalarni tarqatadi
   va /api/* soʻrovlarini Durable Object ichidagi SQLite bazaga yoʻnaltiradi.

   Nega Durable Object? Cloudflare Workers'da oddiy fayl tizimi yoʻq, shuning
   uchun natijalarni data/maktab.json ga yozib boʻlmaydi. Durable Object — bitta
   sinf uchun yagona, izchil baza (bepul tarifda ham ishlaydi).

   Maktab ichidagi lokal server uchun esa server.js ishlatiladi (internetsiz).
   ========================================================================== */

const PIN_DEFAULT = '2026'
const norm = s => String(s ?? '').trim().replace(/\s+/g, ' ')
const key = s => norm(s).toLocaleLowerCase('uz')
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
    'access-control-allow-headers': 'content-type',
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'cache-control': 'no-store',
  },
})

/* ========================================================================
   Durable Object — sinf bazasi (SQLite)
   ======================================================================== */
export class Maktab {
  constructor(ctx, env) {
    this.ctx = ctx
    this.env = env
    this.sql = ctx.storage.sql
    this.sql.exec(`
      CREATE TABLE IF NOT EXISTS oquvchilar (
        id TEXT PRIMARY KEY, ism TEXT NOT NULL, familiya TEXT NOT NULL DEFAULT '',
        sinf TEXT NOT NULL DEFAULT '', baho INTEGER, izoh TEXT NOT NULL DEFAULT '',
        created INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS natijalar (
        oquvchiId TEXT NOT NULL, vazifa TEXT NOT NULL,
        ball INTEGER NOT NULL, maks INTEGER NOT NULL,
        izoh TEXT NOT NULL DEFAULT '', urinish INTEGER NOT NULL DEFAULT 1,
        vaqt INTEGER NOT NULL, PRIMARY KEY (oquvchiId, vazifa)
      );
      CREATE TABLE IF NOT EXISTS sozlama (kalit TEXT PRIMARY KEY, qiymat TEXT NOT NULL);
    `)
  }

  /* ---------------- yordamchilar ---------------- */
  get pin() {
    const r = this.sql.exec('SELECT qiymat FROM sozlama WHERE kalit = ?', 'pin').toArray()
    return r.length ? r[0].qiymat : (this.env.OQITUVCHI_PIN || PIN_DEFAULT)
  }
  natijalarOf(id) {
    return this.sql.exec('SELECT * FROM natijalar WHERE oquvchiId = ? ORDER BY vaqt', id).toArray()
  }
  holat(o) {
    const nat = this.natijalarOf(o.id)
    const jamiBall = nat.reduce((a, n) => a + (n.maks > 0 ? Math.round((n.ball / n.maks) * 100) : 0), 0)
    return {
      ...o, familiya: o.familiya || '',
      toliqIsm: `${o.familiya || ''} ${o.ism}`.trim(),
      jamiBall, bajarilgan: nat.length, natijalar: nat,
    }
  }
  hammaOquvchi() {
    return this.sql.exec('SELECT * FROM oquvchilar').toArray().map(o => this.holat(o))
  }
  sinflar() {
    return this.sql.exec('SELECT DISTINCT sinf FROM oquvchilar ORDER BY sinf').toArray().map(r => r.sinf)
  }
  tekshir(p) { return String(p ?? '') === String(this.pin) }

  /* ---------------- soʻrovlar ---------------- */
  async fetch(request) {
    const url = new URL(request.url)
    let body = {}
    if (request.method === 'POST') {
      try { body = await request.json() } catch { body = {} }
    }

    switch (`${request.method} ${url.pathname}`) {
      case 'GET /api/holat': {
        const n = this.sql.exec('SELECT COUNT(*) AS c FROM oquvchilar').toArray()[0].c
        const m = this.sql.exec('SELECT COUNT(*) AS c FROM natijalar').toArray()[0].c
        return json({ ok: true, oquvchilar: n, natijalar: m })
      }

      case 'POST /api/oquvchi': {
        const ism = norm(body.ism), familiya = norm(body.familiya)
        const sinf = norm(body.sinf) || 'Sinf koʻrsatilmagan'
        if (ism.length < 2) return json({ xato: 'Ismingizni toʻliq yozing (kamida 2 harf).' }, 400)
        if (familiya.length < 2) return json({ xato: 'Familiyangizni toʻliq yozing (kamida 2 harf).' }, 400)
        if (ism.length > 40 || familiya.length > 40) return json({ xato: 'Ism yoki familiya juda uzun.' }, 400)
        let o = this.sql.exec('SELECT * FROM oquvchilar').toArray()
          .find(x => key(x.ism) === key(ism) && key(x.familiya) === key(familiya) && key(x.sinf) === key(sinf))
        if (!o) {
          o = { id: uid(), ism, familiya, sinf, baho: null, izoh: '', created: Date.now() }
          this.sql.exec('INSERT INTO oquvchilar (id, ism, familiya, sinf, baho, izoh, created) VALUES (?, ?, ?, ?, ?, ?, ?)',
            o.id, o.ism, o.familiya, o.sinf, null, '', o.created)
        }
        return json({ oquvchi: this.holat(o) })
      }

      case 'POST /api/natija': {
        const { oquvchiId, vazifa } = body
        const ball = Number(body.ball) || 0, maks = Number(body.maks) || 0
        const o = this.sql.exec('SELECT * FROM oquvchilar WHERE id = ?', oquvchiId ?? '').toArray()[0]
        if (!o) return json({ xato: 'Oʻquvchi topilmadi. Qaytadan kiring.' }, 404)
        if (!vazifa || maks <= 0) return json({ xato: 'Vazifa maʼlumoti notoʻgʻri.' }, 400)
        const bor = this.sql.exec('SELECT * FROM natijalar WHERE oquvchiId = ? AND vazifa = ?', oquvchiId, vazifa).toArray()[0]
        if (!bor) {
          this.sql.exec('INSERT INTO natijalar (oquvchiId, vazifa, ball, maks, izoh, urinish, vaqt) VALUES (?, ?, ?, ?, ?, 1, ?)',
            oquvchiId, vazifa, ball, maks, norm(body.izoh), Date.now())
        } else {
          // eng yaxshi natija saqlanadi
          const yaxshi = ball / maks >= bor.ball / bor.maks
          this.sql.exec('UPDATE natijalar SET ball = ?, maks = ?, izoh = ?, urinish = ?, vaqt = ? WHERE oquvchiId = ? AND vazifa = ?',
            yaxshi ? ball : bor.ball, yaxshi ? maks : bor.maks, yaxshi ? norm(body.izoh) : bor.izoh,
            bor.urinish + 1, Date.now(), oquvchiId, vazifa)
        }
        const yangi = this.holat(o)
        return json({ natija: yangi.natijalar.find(n => n.vazifa === vazifa), jamiBall: yangi.jamiBall })
      }

      case 'GET /api/reyting': {
        const sinf = url.searchParams.get('sinf')
        const reyting = this.hammaOquvchi()
          .filter(o => !sinf || key(o.sinf) === key(sinf))
          .sort((a, b) => b.jamiBall - a.jamiBall || a.created - b.created)
        return json({ reyting, sinflar: this.sinflar() })
      }

      case 'POST /api/oqituvchi': {
        if (!this.tekshir(body.pin)) return json({ xato: 'PIN kod notoʻgʻri.' }, 403)
        return json({
          oquvchilar: this.hammaOquvchi().sort((a, b) => b.jamiBall - a.jamiBall),
          sinflar: this.sinflar(),
        })
      }

      case 'POST /api/baho': {
        if (!this.tekshir(body.pin)) return json({ xato: 'PIN kod notoʻgʻri.' }, 403)
        const o = this.sql.exec('SELECT * FROM oquvchilar WHERE id = ?', body.oquvchiId ?? '').toArray()[0]
        if (!o) return json({ xato: 'Oʻquvchi topilmadi.' }, 404)
        const baho = body.baho === null || body.baho === '' ? null : Number(body.baho)
        this.sql.exec('UPDATE oquvchilar SET baho = ?, izoh = ? WHERE id = ?', baho, norm(body.izoh), o.id)
        return json({ oquvchi: this.holat({ ...o, baho, izoh: norm(body.izoh) }) })
      }

      case 'POST /api/ochirish': {
        if (!this.tekshir(body.pin)) return json({ xato: 'PIN kod notoʻgʻri.' }, 403)
        if (body.oquvchiId) {
          this.sql.exec('DELETE FROM natijalar WHERE oquvchiId = ?', body.oquvchiId)
          this.sql.exec('DELETE FROM oquvchilar WHERE id = ?', body.oquvchiId)
        } else if (body.sinf) {
          const ids = this.sql.exec('SELECT id, sinf FROM oquvchilar').toArray()
            .filter(o => key(o.sinf) === key(body.sinf)).map(o => o.id)
          for (const id of ids) {
            this.sql.exec('DELETE FROM natijalar WHERE oquvchiId = ?', id)
            this.sql.exec('DELETE FROM oquvchilar WHERE id = ?', id)
          }
        } else if (body.hammasi === true) {
          this.sql.exec('DELETE FROM natijalar')
          this.sql.exec('DELETE FROM oquvchilar')
        } else return json({ xato: 'Nima oʻchirilishi koʻrsatilmagan.' }, 400)
        const qolgan = this.sql.exec('SELECT COUNT(*) AS c FROM oquvchilar').toArray()[0].c
        return json({ ok: true, qolgan })
      }

      case 'POST /api/pin': {
        if (!this.tekshir(body.pin)) return json({ xato: 'Joriy PIN notoʻgʻri.' }, 403)
        const yangi = norm(body.yangi)
        if (!/^\d{4,8}$/.test(yangi)) return json({ xato: 'Yangi PIN 4–8 ta raqamdan iborat boʻlsin.' }, 400)
        this.sql.exec('INSERT INTO sozlama (kalit, qiymat) VALUES (?, ?) ON CONFLICT(kalit) DO UPDATE SET qiymat = excluded.qiymat', 'pin', yangi)
        return json({ ok: true })
      }

      default:
        return json({ xato: 'Bunday API yoʻq' }, 404)
    }
  }
}

/* ========================================================================
   Worker — /api/* ni Durable Object'ga, qolganini statik saytga yuboradi
   ======================================================================== */
export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname.startsWith('/api/')) {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 204,
          headers: {
            'access-control-allow-origin': '*',
            'access-control-allow-headers': 'content-type',
            'access-control-allow-methods': 'GET, POST, OPTIONS',
          },
        })
      }
      try {
        // Butun maktab uchun bitta baza — shuning uchun nom ham bitta
        const stub = env.MAKTAB.get(env.MAKTAB.idFromName('maktab'))
        return await stub.fetch(request)
      } catch (e) {
        return json({ xato: 'Serverda xato: ' + (e && e.message ? e.message : String(e)) }, 500)
      }
    }

    return env.ASSETS.fetch(request)
  },
}
