import { Network, Router, Hammer, Send, KeyRound, ShieldCheck, Trophy, type LucideIcon } from 'lucide-react'
import type { Tone } from '../components/ui'
import type { ResultKey } from '../lib/storage'

/* ==========================================================================
   «Tarmoq olamiga sayohat» — oʻquvchi koʻradigan 7 bosqich.
   Har bosqichda: qisqa tushuntirish + interaktiv oʻyin yoki simulyator.
   Dars oxirida test yoʻq — oʻrniga oʻynab oʻrganadi.
   ========================================================================== */
export interface Bosqich {
  n: number
  path: string
  emoji: string
  icon: LucideIcon
  tone: Tone
  title: string          // sarguzasht nomi
  savol: string          // kirish savoli
  short: string          // qisqa taʼrif (karta uchun)
  /** Shu bosqich tugadi deb hisoblanadigan natija kaliti (oʻyin bajarilsa) */
  gameKey?: ResultKey
}

export const SAYOHAT: Bosqich[] = [
  { n: 1, path: '/bosqich/boglanish', emoji: '🔗', icon: Network, tone: 'blue',
    title: 'Kompyuterlar qanday bogʻlanadi?', savol: 'Ikki kompyuter bir-biriga qanday maʼlumot yuboradi?',
    short: 'Tarmoq nima va u nega kerak — eng boshidan.' },
  { n: 2, path: '/bosqich/qurilmalar', emoji: '🔌', icon: Router, tone: 'teal',
    title: 'Tarmoq qurilmalarini top!', savol: 'Router, switch, server — qaysi biri nima qiladi?',
    short: 'Qurilmalarni vazifasiga qarab moslashtiramiz.', gameKey: 'mosini' },
  { n: 3, path: '/bosqich/qurish', emoji: '🔧', icon: Hammer, tone: 'green',
    title: 'Oʻz tarmogʻingni yarat!', savol: 'Kompyuterlarni qanday qilib birga ishlataman?',
    short: 'Qurilmalarni ulab, ishlaydigan tarmoq yigʻamiz.', gameKey: 'yigish' },
  { n: 4, path: '/bosqich/oqim', emoji: '📨', icon: Send, tone: 'violet',
    title: 'Maʼlumot qanday yuradi?', savol: 'Xabar bir kompyuterdan ikkinchisiga qanday yetib boradi?',
    short: 'Paketning yoʻlini oʻz koʻzimiz bilan kuzatamiz.' },
  { n: 5, path: '/bosqich/parol', emoji: '🔑', icon: KeyRound, tone: 'amber',
    title: 'Internet himoyachisi boʻl!', savol: 'Qaysi parol kuchli, qaysi biri xavfli?',
    short: 'Kuchli va kuchsiz parollarni ajratamiz.', gameKey: 'parol' },
  { n: 6, path: '/bosqich/himoya', emoji: '🛡️', icon: ShieldCheck, tone: 'rose',
    title: 'Tahdidlardan himoyalan!', savol: 'Firewall qanday qilib xavfli trafikni toʻxtatadi?',
    short: 'Tarmoqni tahdidlardan qoʻriqlaymiz.' },
  { n: 7, path: '/bosqich/bilimdon', emoji: '🏆', icon: Trophy, tone: 'blue',
    title: 'Tezkor bilimdon', savol: 'Hamma narsani oʻrgandingmi? Sinab koʻramiz!',
    short: '10 ta savol — bilimingni sinab koʻr.', gameKey: 'bilimdon' },
]

/* ------------------------------ Nishonlar ------------------------------ */
export interface Nishon {
  id: string
  emoji: string
  nom: string
  izoh: string
  /** results obyektidan nishon ochilganini aniqlaydi */
  ochilgan: (bajarilgan: Set<string>, ball: number) => boolean
}
export const NISHONLAR: Nishon[] = [
  { id: 'birinchi', emoji: '🏅', nom: 'Birinchi qadam', izoh: 'Birinchi bosqichni tugatding',
    ochilgan: b => b.has('mosini') || b.has('yigish') || b.has('parol') || b.has('bilimdon') || b.has('lab') || b.has('firewall') },
  { id: 'bilimdon', emoji: '🌐', nom: 'Tarmoq bilimdoni', izoh: 'Qurilmalarni toʻgʻri tanibsan',
    ochilgan: b => b.has('mosini') },
  { id: 'quruvchi', emoji: '🔧', nom: 'Tarmoq quruvchi', izoh: 'Oʻz tarmogʻingni yaratding',
    ochilgan: b => b.has('yigish') || b.has('lab') },
  { id: 'himoyachi', emoji: '🛡️', nom: 'Xavfsizlik himoyachisi', izoh: 'Xavfsizlik mashqlarini bajarding',
    ochilgan: b => b.has('parol') || b.has('firewall') },
  { id: 'tezkor', emoji: '⚡', nom: 'Tezkor bilimdon', izoh: 'Yakuniy oʻyinni tugatding',
    ochilgan: b => b.has('bilimdon') },
  { id: 'usta', emoji: '🏆', nom: 'Tarmoq ustasi', izoh: 'Barcha bosqichlarni tugatding',
    ochilgan: b => ['mosini', 'yigish', 'parol', 'bilimdon'].every(k => b.has(k)) },
]

export function ochilganNishonlar(bajarilgan: Set<string>, ball: number) {
  return NISHONLAR.map(n => ({ ...n, ochildi: n.ochilgan(bajarilgan, ball) }))
}
