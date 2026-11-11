/* ==========================================================================
   Oʻquvchi sessiyasi. Bola ismi va sinfi bilan kiradi; har bir vazifa natijasi
   avtomatik serverga yuboriladi. Server oʻchiq boʻlsa — brauzerda saqlanadi
   va server qaytganda oʻzi yuboriladi.
   ========================================================================== */
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { api, ApiXato, type Oquvchi } from './api'
import { loadStored, saveStored, setResultSyncer, type Result, type ResultKey } from './storage'

interface Ctx {
  oquvchi: Oquvchi | null
  kutilyapti: boolean
  xato: string
  /** Server bilan aloqa: 'bor' | 'yoʻq' | 'tekshirilmoqda' */
  aloqa: 'bor' | 'yoq' | 'tekshirilmoqda'
  kutilayotgan: number
  kirish: (ism: string, familiya: string, sinf: string) => Promise<boolean>
  chiqish: () => void
  yangilash: () => Promise<void>
}
const C = createContext<Ctx>({
  oquvchi: null, kutilyapti: false, xato: '', aloqa: 'tekshirilmoqda', kutilayotgan: 0,
  kirish: async () => false, chiqish: () => {}, yangilash: async () => {},
})
export const useOquvchi = () => useContext(C)

interface Navbat { vazifa: string; ball: number; maks: number; izoh?: string }

/* Chiqishda yoki boshqa oʻquvchi kirganda — bu brauzerdagi oldingi oʻquvchining
   progressini tozalaymiz (ball, koʻrilgan boʻlimlar, oʻyin/metod qoralamalari).
   Faqat oʻqituvchi PIN, himoya rejimi va kirish formasi xotirasi saqlanadi. */
const SAQLANADI = new Set(['oqituvchiPin', 'defense', 'oxirgiKirish'])
function tozalaProgress() {
  // subscriberlar (bosh sahifa, yon panel) darhol yangilansin
  saveStored('results', {})
  saveStored('visited', [])
  saveStored('navbat', [])
  try {
    for (const k of Object.keys(localStorage)) {
      if (!k.startsWith('tarmoq-platforma:')) continue
      const nom = k.slice('tarmoq-platforma:'.length)
      if (nom === 'oquvchi' || SAQLANADI.has(nom) || ['results', 'visited', 'navbat'].includes(nom)) continue
      localStorage.removeItem(k)   // oʻyin/metod qoralamalari
    }
  } catch {
    /* localStorage yopiq boʻlsa ham ishlashda davom etamiz */
  }
}

export function OquvchiProvider({ children }: { children: ReactNode }) {
  const [oquvchi, setOquvchi] = useState<Oquvchi | null>(() => loadStored<Oquvchi | null>('oquvchi', null))
  const [kutilyapti, setKutilyapti] = useState(false)
  const [xato, setXato] = useState('')
  const [aloqa, setAloqa] = useState<'bor' | 'yoq' | 'tekshirilmoqda'>('tekshirilmoqda')
  const [navbat, setNavbat] = useState<Navbat[]>(() => loadStored<Navbat[]>('navbat', []))
  const oquvchiRef = useRef(oquvchi)
  oquvchiRef.current = oquvchi
  const navbatRef = useRef(navbat)
  navbatRef.current = navbat
  const yangilashRef = useRef<() => Promise<void>>(async () => {})

  /* Server bor-yoʻqligini tekshiramiz */
  useEffect(() => {
    let tirik = true
    api.holat().then(() => tirik && setAloqa('bor')).catch(() => tirik && setAloqa('yoq'))
    return () => { tirik = false }
  }, [])

  /* Navbatdagi natijalarni serverga yuborish */
  const navbatniYuborish = useCallback(async () => {
    let o = oquvchiRef.current
    if (!o || !navbatRef.current.length) return
    const qolgan: Navbat[] = []
    let oxirgiId: string | null = null
    let qaytaRoyxatdan = false
    for (const n of navbatRef.current) {
      try {
        await api.natija(o.id, n.vazifa, n.ball, n.maks, n.izoh)
        oxirgiId = o.id
      } catch (e) {
        const ochirilgan = e instanceof ApiXato && e.message.includes('topilmadi')
        // Server'da oʻquvchi yoʻq (maʼlumot tozalangan) — bir marta qayta roʻyxatdan
        // oʻtkazamiz, aks holda ballar jimgina yoʻqoladi.
        if (ochirilgan && !qaytaRoyxatdan) {
          qaytaRoyxatdan = true
          try {
            const { oquvchi: yangi } = await api.kirish(o.ism, o.familiya, o.sinf)
            o = yangi; oquvchiRef.current = yangi
            setOquvchi(yangi); saveStored('oquvchi', yangi)
            await api.natija(yangi.id, n.vazifa, n.ball, n.maks, n.izoh)
            oxirgiId = yangi.id
            continue
          } catch { qolgan.push(n); continue }
        }
        if (ochirilgan) { qolgan.push(n); continue }
        qolgan.push(n)
      }
    }
    setNavbat(qolgan); saveStored('navbat', qolgan)
    setAloqa(qolgan.length ? 'yoq' : 'bor')
    if (oxirgiId && !qolgan.length) {
      try {
        const { reyting } = await api.reyting()
        const yangi = reyting.find(x => x.id === oxirgiId)
        if (yangi) { setOquvchi(yangi); saveStored('oquvchi', yangi) }
      } catch { /* keyinroq */ }
    }
  }, [])

  /* Natija paydo boʻlganda navbatga qoʻshamiz (sahifalarni oʻzgartirmasdan) */
  useEffect(() => {
    setResultSyncer((kod: ResultKey, r: Result) => {
      if (!oquvchiRef.current) return
      setNavbat(prev => {
        const q = [...prev.filter(n => n.vazifa !== kod), { vazifa: kod, ball: r.score, maks: r.max, izoh: r.detail }]
        saveStored('navbat', q)
        return q
      })
    })
    return () => setResultSyncer(null)
  }, [])

  /* Navbat boʻshaguncha, har 4 soniyada urinib koʻramiz */
  useEffect(() => {
    if (!oquvchi || !navbat.length) return
    void navbatniYuborish()
    const t = setInterval(() => void navbatniYuborish(), 4000)
    return () => clearInterval(t)
  }, [oquvchi, navbat.length, navbatniYuborish])

  /* Ball va natijalar fonda yangilanib turadi (oʻqituvchi baho qoʻysa ham koʻrinadi) */
  useEffect(() => {
    if (!oquvchi?.id) return
    const t = setInterval(() => void yangilashRef.current(), 20000)
    const koringanda = () => { if (document.visibilityState === 'visible') void yangilashRef.current() }
    document.addEventListener('visibilitychange', koringanda)
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', koringanda) }
  }, [oquvchi?.id])

  const kirish = useCallback(async (ism: string, familiya: string, sinf: string) => {
    setKutilyapti(true); setXato('')
    try {
      const avvalgi = oquvchiRef.current
      // Mahalliy natijalarni tozalashdan OLDIN oʻqib olamiz (anonim oʻyin yoʻqolmasin).
      const eski = loadStored<Partial<Record<ResultKey, Result>>>('results', {})
      const { oquvchi: o } = await api.kirish(ism, familiya, sinf)
      const boshqaOquvchi = !!avvalgi && avvalgi.id !== o.id

      // Faqat BOSHQA oʻquvchi kirsa — bu kompyuterdagi oldingi progressni tozalaymiz.
      if (boshqaOquvchi) tozalaProgress()

      setOquvchi(o); saveStored('oquvchi', o); setAloqa('bor')

      // Anonim oʻynagandan keyin birinchi marta kirsa — natijalarni shu oʻquvchiga biriktiramiz.
      if (!avvalgi) {
        const q: Navbat[] = Object.entries(eski).map(([vazifa, r]) => ({ vazifa, ball: r!.score, maks: r!.max, izoh: r!.detail }))
        if (q.length) { setNavbat(q); saveStored('navbat', q) }
      } else if (boshqaOquvchi) {
        setNavbat([]); saveStored('navbat', [])
      }
      return true
    } catch (e) {
      setXato(e instanceof ApiXato ? e.message : 'Kirishda xato yuz berdi.')
      if (e instanceof ApiXato && e.message.includes('ulanib')) setAloqa('yoq')
      return false
    } finally { setKutilyapti(false) }
  }, [])

  const chiqish = useCallback(() => {
    setOquvchi(null); saveStored('oquvchi', null)
    setNavbat([]); saveStored('navbat', [])
    tozalaProgress()   // keyingi oʻquvchi toza boshlashi uchun
  }, [])

  const yangilash = useCallback(async () => {
    const o = oquvchiRef.current
    if (!o) return
    try {
      const { reyting } = await api.reyting()
      const yangi = reyting.find(x => x.id === o.id)
      if (yangi) { setOquvchi(yangi); saveStored('oquvchi', yangi) }
      setAloqa('bor')
    } catch { setAloqa('yoq') }
  }, [])

  yangilashRef.current = yangilash

  return (
    <C.Provider value={{ oquvchi, kutilyapti, xato, aloqa, kutilayotgan: navbat.length, kirish, chiqish, yangilash }}>
      {children}
    </C.Provider>
  )
}
