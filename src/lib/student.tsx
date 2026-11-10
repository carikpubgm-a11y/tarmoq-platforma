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
    const o = oquvchiRef.current
    if (!o || !navbatRef.current.length) return
    const qolgan: Navbat[] = []
    let oxirgi: Oquvchi | null = null
    for (const n of navbatRef.current) {
      try {
        await api.natija(o.id, n.vazifa, n.ball, n.maks, n.izoh)
        oxirgi = o
      } catch (e) {
        if (e instanceof ApiXato && e.message.includes('topilmadi')) continue // oʻquvchi oʻchirilgan
        qolgan.push(n)
      }
    }
    setNavbat(qolgan); saveStored('navbat', qolgan)
    setAloqa(qolgan.length ? 'yoq' : 'bor')
    if (oxirgi && !qolgan.length) {
      try {
        const { reyting } = await api.reyting()
        const yangi = reyting.find(x => x.id === o.id)
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
      const { oquvchi: o } = await api.kirish(ism, familiya, sinf)
      setOquvchi(o); saveStored('oquvchi', o); setAloqa('bor')
      // avvalgi natijalar bor boʻlsa — ularni ham yuboramiz
      const eski = loadStored<Partial<Record<ResultKey, Result>>>('results', {})
      const q: Navbat[] = Object.entries(eski).map(([vazifa, r]) => ({ vazifa, ball: r!.score, maks: r!.max, izoh: r!.detail }))
      if (q.length) { setNavbat(q); saveStored('navbat', q) }
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
