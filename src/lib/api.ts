/* ==========================================================================
   Server bilan aloqa. Server oʻchiq boʻlsa ham platforma ishlashda davom etadi:
   u holda natijalar faqat shu brauzerda (localStorage) saqlanadi.
   ========================================================================== */
export interface Natija { vazifa: string; ball: number; maks: number; izoh?: string; urinish: number; vaqt: number }
export interface Oquvchi {
  id: string; ism: string; familiya: string; toliqIsm: string; sinf: string
  baho: number | null; izoh: string; created: number
  jamiBall: number; bajarilgan: number; natijalar: Natija[]
}

export class ApiXato extends Error {}

let serverBor: boolean | null = null
/** Server bor-yoʻqligi (null — hali tekshirilmagan). */
export const serverHolati = () => serverBor

async function soʻrov<T>(yoʻl: string, body?: unknown, usul: 'GET' | 'POST' = body ? 'POST' : 'GET'): Promise<T> {
  let r: Response
  try {
    r = await fetch(yoʻl, {
      method: usul,
      headers: body ? { 'content-type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(8000),
    })
  } catch {
    serverBor = false
    throw new ApiXato('Serverga ulanib boʻlmadi. Oʻqituvchidan soʻrang: server ishga tushirilganmi?')
  }
  serverBor = true
  let data: unknown = null
  try { data = await r.json() } catch { /* boʻsh javob */ }
  if (!r.ok) throw new ApiXato((data as { xato?: string } | null)?.xato || 'Serverda xato yuz berdi.')
  return data as T
}

export const api = {
  holat: () => soʻrov<{ ok: boolean; oquvchilar: number; natijalar: number }>('/api/holat'),
  kirish: (ism: string, familiya: string, sinf: string) => soʻrov<{ oquvchi: Oquvchi }>('/api/oquvchi', { ism, familiya, sinf }),
  natija: (oquvchiId: string, vazifa: string, ball: number, maks: number, izoh?: string) =>
    soʻrov<{ natija: Natija; jamiBall: number }>('/api/natija', { oquvchiId, vazifa, ball, maks, izoh }),
  reyting: (sinf?: string) =>
    soʻrov<{ reyting: Oquvchi[]; sinflar: string[] }>('/api/reyting' + (sinf ? '?sinf=' + encodeURIComponent(sinf) : '')),
  oqituvchi: (pin: string) => soʻrov<{ oquvchilar: Oquvchi[]; sinflar: string[] }>('/api/oqituvchi', { pin }),
  baho: (pin: string, oquvchiId: string, baho: number | null, izoh: string) =>
    soʻrov<{ oquvchi: Oquvchi }>('/api/baho', { pin, oquvchiId, baho, izoh }),
  ochirish: (pin: string, nima: { oquvchiId?: string; sinf?: string; hammasi?: boolean }) =>
    soʻrov<{ ok: boolean; qolgan: number }>('/api/ochirish', { pin, ...nima }),
  pinAlmashtirish: (pin: string, yangi: string) => soʻrov<{ ok: boolean }>('/api/pin', { pin, yangi }),
}

/** Vazifa kodlari → oʻquvchiga koʻrinadigan nom va sahifa manzili. */
export const VAZIFALAR: Record<string, { nom: string; yoʻl: string; emoji: string }> = {
  boglanish: { nom: 'Tarmoq asoslari', yoʻl: '/bosqich/boglanish', emoji: '🔗' },
  mosini: { nom: 'Mosini top', yoʻl: '/bosqich/qurilmalar', emoji: '🔌' },
  yigish: { nom: 'Tarmoqni yigʻ', yoʻl: '/bosqich/qurish', emoji: '🔧' },
  oqim: { nom: 'Maʼlumot oqimi', yoʻl: '/bosqich/oqim', emoji: '📨' },
  parol: { nom: 'Xavfsiz parol', yoʻl: '/bosqich/parol', emoji: '🔑' },
  firewall: { nom: 'Firewall himoyasi', yoʻl: '/bosqich/himoya', emoji: '🛡️' },
  bilimdon: { nom: 'Tezkor bilimdon', yoʻl: '/bosqich/bilimdon', emoji: '🏆' },
  lab: { nom: 'Tarmoq konstruktori', yoʻl: '/laboratoriya', emoji: '🏗️' },
  snowball: { nom: 'Sinf fikri', yoʻl: '/fikr', emoji: '💭' },
}
export const VAZIFA_KODLARI = Object.keys(VAZIFALAR)
