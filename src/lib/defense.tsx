import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useStored } from './storage'

interface DefenseState {
  /** Himoya rejimi yoqilganmi */
  on: boolean
  start: () => void
  stop: () => void
}
const Ctx = createContext<DefenseState>({ on: false, start: () => {}, stop: () => {} })

/** Himoya rejimi: yirik matn, yon panelsiz, pastda slayd boshqaruvi, klaviatura strelkalari. */
export function DefenseProvider({ children }: { children: ReactNode }) {
  const [on, setOn] = useStored<boolean>('defense', false)
  useEffect(() => {
    document.documentElement.classList.toggle('defense', on)
  }, [on])
  const value = useMemo(() => ({ on, start: () => setOn(true), stop: () => setOn(false) }), [on, setOn])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export const useDefense = () => useContext(Ctx)

export function toggleFullscreen() {
  try {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen()
  } catch {
    /* brauzer ruxsat bermasa — jim oʻtamiz */
  }
}
