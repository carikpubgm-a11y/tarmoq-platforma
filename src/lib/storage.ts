import { useCallback, useEffect, useRef, useState } from 'react'

const PREFIX = 'tarmoq-platforma:'

export function loadStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

export function saveStored<T>(key: string, value: T) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
    window.dispatchEvent(new CustomEvent('tp-storage', { detail: key }))
  } catch {
    /* localStorage yopiq boʻlsa ham sahifa ishlashda davom etadi */
  }
}

/** useState kabi ishlaydi, lekin qiymat shu brauzerda (localStorage) saqlanadi. */
export function useStored<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void, () => void] {
  const initialRef = useRef(initial)
  const [value, setValue] = useState<T>(() => loadStored(key, initial))

  useEffect(() => {
    setValue(loadStored(key, initialRef.current))
  }, [key])

  useEffect(() => {
    const onChange = (e: Event) => {
      if ((e as CustomEvent).detail === key) setValue(loadStored(key, initialRef.current))
    }
    window.addEventListener('tp-storage', onChange)
    return () => window.removeEventListener('tp-storage', onChange)
  }, [key])

  const set = useCallback(
    (v: T | ((prev: T) => T)) => {
      setValue(prev => {
        const next = typeof v === 'function' ? (v as (p: T) => T)(prev) : v
        try {
          localStorage.setItem(PREFIX + key, JSON.stringify(next))
        } catch {
          /* ignore */
        }
        return next
      })
    },
    [key],
  )
  const reset = useCallback(() => {
    try {
      localStorage.removeItem(PREFIX + key)
    } catch {
      /* ignore */
    }
    setValue(initialRef.current)
  }, [key])

  return [value, set, reset]
}

/* ---------- Baholash natijalari (test, laboratoriya, metodlar) ---------- */
export interface Result {
  score: number
  max: number
  label: string
  detail?: string
  at: number
}
export type ResultKey =
  | 'test' | 'lab' | 'firewall'
  | 'mosini' | 'yigish' | 'parol' | 'bilimdon'          // oʻyinlar
  | 'muammoli' | 'snowball' | 'jurnal' | 'namoyish' | 'amaliy'  // metodlar

/** Oʻquvchi sessiyasi shu yerga ulanadi — natija serverga ham yuboriladi. */
let syncer: ((key: ResultKey, r: Result) => void) | null = null
export function setResultSyncer(fn: ((key: ResultKey, r: Result) => void) | null) {
  syncer = fn
}

export function saveResult(key: ResultKey, r: Omit<Result, 'at'>) {
  const all = loadStored<Partial<Record<ResultKey, Result>>>('results', {})
  const full: Result = { ...r, at: Date.now() }
  all[key] = full
  saveStored('results', all)
  try { syncer?.(key, full) } catch { /* server bilan aloqa natijani buzmasin */ }
}
export function useResults() {
  return useStored<Partial<Record<ResultKey, Result>>>('results', {})
}
