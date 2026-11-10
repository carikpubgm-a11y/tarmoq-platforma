import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Award, Download, Lock, Printer } from 'lucide-react'
import { Btn, Callout, Progress, cx } from '../components/ui'
import { VAZIFALAR } from '../lib/api'
import { COURSE } from '../data/sections'
import { useOquvchi } from '../lib/student'
import { useStored } from '../lib/storage'
import type { Result, ResultKey } from '../lib/storage'

const OY = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']
const sana = (d = new Date()) => `${d.getDate()}-${OY[d.getMonth()]}, ${d.getFullYear()}-yil`

function daraja(foiz: number) {
  if (foiz >= 86) return { nom: 'AʼLO', ribbon: '#D4A017', seal1: '#FDE68A', seal2: '#D4A017', emoji: '🥇' }
  if (foiz >= 71) return { nom: 'YAXSHI', ribbon: '#3B82F6', seal1: '#BFDBFE', seal2: '#2563EB', emoji: '🥈' }
  if (foiz >= 56) return { nom: 'QONIQARLI', ribbon: '#10B981', seal1: '#A7F3D0', seal2: '#059669', emoji: '🥉' }
  return { nom: 'ISHTIROKCHI', ribbon: '#8B5CF6', seal1: '#DDD6FE', seal2: '#7C3AED', emoji: '🎖️' }
}

/** Oʻquvchi id'sidan oddiy tekshiruv kodi (sertifikat raqami). */
function kod(id: string) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return 'TX-' + (h % 100000).toString().padStart(5, '0') + '-' + id.slice(-3).toUpperCase()
}

/* Burchak naqshi (guilloché uslubida) */
function Burchak({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 90" className={cx('absolute h-16 w-16 text-amber-500/70 sm:h-20 sm:w-20', className)} fill="none" aria-hidden="true">
      <path d="M6 84V34C6 18 18 6 34 6h50" stroke="currentColor" strokeWidth="2" />
      <path d="M14 84V36C14 24 24 14 36 14h48" stroke="currentColor" strokeWidth="1" opacity=".6" />
      <circle cx="20" cy="20" r="4" fill="currentColor" />
      <path d="M20 20c10-2 18-10 20-20M20 20c-2 10 0 0 0 0" stroke="currentColor" strokeWidth="1.2" opacity=".5" />
    </svg>
  )
}

/* Oltin muhr (lenta bilan) */
function Muhr({ d }: { d: ReturnType<typeof daraja> }) {
  return (
    <div className="relative mx-auto h-28 w-28 sm:h-32 sm:w-32">
      {/* lentalar */}
      <svg viewBox="0 0 120 150" className="absolute left-1/2 top-12 -z-0 h-28 w-28 -translate-x-1/2" aria-hidden="true">
        <path d="M44 70 L30 145 L52 128 L60 150 L68 128 L90 145 L76 70Z" fill={d.ribbon} />
        <path d="M44 70 L37 108 L60 96 L60 70Z" fill="#000" opacity=".15" />
      </svg>
      {/* muhr doirasi */}
      <svg viewBox="0 0 120 120" className="relative z-10 h-full w-full drop-shadow-lg" aria-hidden="true">
        <circle cx="60" cy="60" r="56" fill={d.seal2} />
        <circle cx="60" cy="60" r="52" fill={`url(#g${d.ribbon})`} />
        <defs>
          <radialGradient id={`g${d.ribbon}`} cx="40%" cy="35%" r="75%">
            <stop offset="0%" stopColor={d.seal1} /><stop offset="100%" stopColor={d.seal2} />
          </radialGradient>
        </defs>
        {/* tishli chekka */}
        {Array.from({ length: 40 }).map((_, i) => {
          const a = (i / 40) * Math.PI * 2
          return <circle key={i} cx={60 + Math.cos(a) * 56} cy={60 + Math.sin(a) * 56} r="2.4" fill={d.seal2} />
        })}
        <circle cx="60" cy="60" r="44" fill="none" stroke="#fff" strokeWidth="1.5" opacity=".8" />
      </svg>
      <span className="absolute inset-0 z-20 grid place-items-center pb-1 text-4xl sm:text-5xl">{d.emoji}</span>
      <span className="absolute inset-x-0 top-[38%] z-20 text-center font-display text-[0.6rem] font-extrabold tracking-widest text-white/90">{d.nom}</span>
    </div>
  )
}

export default function Sertifikat() {
  const { oquvchi, yangilash } = useOquvchi()
  const [mahalliy] = useStored<Partial<Record<ResultKey, Result>>>('results', {})
  useEffect(() => { void yangilash() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const natijalar = oquvchi?.natijalar?.length
    ? oquvchi.natijalar.map(n => ({ kod: n.vazifa, ball: n.ball, maks: n.maks }))
    : Object.entries(mahalliy).map(([k, r]) => ({ kod: k, ball: r!.score, maks: r!.max }))

  const yakun = natijalar.find(n => n.kod === 'test' || n.kod === 'bilimdon')
  const jamiFoiz = natijalar.length
    ? Math.round(natijalar.reduce((a, n) => a + (n.maks ? (n.ball / n.maks) * 100 : 0), 0) / natijalar.length)
    : 0
  const ochiq = !!yakun
  const d = daraja(jamiFoiz)
  const ism = oquvchi?.toliqIsm || [oquvchi?.familiya, oquvchi?.ism].filter(Boolean).join(' ') || ''

  if (!oquvchi) {
    return (
      <div className="py-16 text-center">
        <span className="text-6xl">🎓</span>
        <h1 className="mt-5 text-3xl font-extrabold">Sertifikat olish uchun avval kiring</h1>
        <p className="mt-3 text-slate-600">Sertifikatda ismingiz va familiyangiz yoziladi.</p>
        <Link to="/kirish-oquvchi" className="mt-7 inline-block rounded-2xl bg-brand-600 px-7 py-4 font-extrabold text-white hover:bg-brand-700">Ism va familiya bilan kirish</Link>
      </div>
    )
  }

  return (
    <>
      {/* Chop etishda sertifikat butun A4 (yotiq) boʻlib chiqadi */}
      <style>{`@media print { @page { size: A4 landscape; margin: 0 } body { background: #fff !important } .sert-wrap { position: fixed; inset: 0; margin: 0 !important; padding: 0 !important } }`}</style>

      <header className="no-print anim-in mb-8">
        <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-extrabold text-amber-800"><Award size={18} /> Yakuniy hujjat</span>
        <h1 className="mt-4 text-[2.1rem] font-extrabold leading-tight sm:text-[2.7rem]">Sertifikatingiz</h1>
        <p className="mt-3 max-w-2xl text-[1.1rem] text-slate-600">
          {ochiq
            ? 'Tabriklaymiz! Sarguzashtni yakunladingiz. Sertifikatni chop eting yoki PDF sifatida saqlang.'
            : 'Sertifikat 7-bosqich (Tezkor bilimdon)ni yakunlaganingizdan soʻng ochiladi.'}
        </p>
      </header>

      {!ochiq && (
        <div className="no-print mb-8 space-y-4">
          <Callout kind="warn" title="Sertifikat hali yopiq">
            Uni ochish uchun <Link to="/bosqich/bilimdon">7-bosqich (Tezkor bilimdon)</Link> oʻyinini tugating. Koʻproq oʻyin oʻynasangiz — darajang yuqoriroq boʻladi.
          </Callout>
          <div className="rounded-4xl border-2 border-slate-200 bg-white p-6 shadow-card">
            <h2 className="font-display text-lg font-extrabold">Bajarilgan vazifalar: {natijalar.length} / {Object.keys(VAZIFALAR).length}</h2>
            <Progress className="mt-3" value={natijalar.length} max={Object.keys(VAZIFALAR).length} />
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {Object.entries(VAZIFALAR).map(([k, v]) => {
                const n = natijalar.find(x => x.kod === k)
                return (
                  <li key={k} className={cx('flex items-center gap-3 rounded-2xl border-2 px-4 py-3', n ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200')}>
                    <span className="text-xl">{v.emoji}</span>
                    <Link to={v.yoʻl} className="flex-1 font-bold text-navy-900 hover:text-brand-700">{v.nom}</Link>
                    <span className={cx('font-mono text-sm font-extrabold', n ? 'text-emerald-700' : 'text-slate-400')}>
                      {n ? Math.round((n.ball / n.maks) * 100) + '%' : <Lock size={15} />}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}

      {/* ====================== SERTIFIKAT ====================== */}
      <div className={cx('sert-wrap', !ochiq && 'no-print pointer-events-none select-none opacity-40 blur-[2px]')}>
        <article aria-label="Sertifikat"
          className="relative mx-auto w-full max-w-[1000px] overflow-hidden rounded-3xl bg-gradient-to-br from-amber-200 via-amber-100 to-amber-200 p-[6px] shadow-lift sm:min-h-[650px] print:h-screen print:max-w-none print:rounded-none print:shadow-none">
          {/* ichki qogʻoz */}
          <div className="relative h-full w-full rounded-[1.35rem] bg-[#FFFDF7] print:rounded-none"
            style={{ backgroundImage: 'radial-gradient(circle at 15% 15%, rgba(212,160,23,.05) 0 1.5px, transparent 1.5px), radial-gradient(circle at 85% 85%, rgba(124,58,237,.04) 0 1.5px, transparent 1.5px)', backgroundSize: '26px 26px' }}>
            {/* ikki qavatli ramka */}
            <div className="absolute inset-3 rounded-[1rem] border-[3px] border-amber-500/80 sm:inset-5" />
            <div className="absolute inset-[18px] rounded-[0.8rem] border border-amber-400/50 sm:inset-7" />
            {/* burchak naqshlari */}
            <Burchak className="left-4 top-4 sm:left-6 sm:top-6" />
            <Burchak className="right-4 top-4 rotate-90 sm:right-6 sm:top-6" />
            <Burchak className="bottom-4 right-4 rotate-180 sm:bottom-6 sm:right-6" />
            <Burchak className="bottom-4 left-4 -rotate-90 sm:bottom-6 sm:left-6" />

            {/* mazmun */}
            <div className="relative flex h-full flex-col items-center justify-center px-6 py-6 text-center sm:px-16 sm:py-8">
              {/* logo + muassasa */}
              <div className="flex items-center gap-2 text-amber-700">
                <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 9v7M16 16l-7 6M16 16l7 6" stroke="currentColor" strokeWidth="1.8" fill="none" /><circle cx="16" cy="7" r="3" fill="currentColor" /><circle cx="8" cy="23" r="3" fill="currentColor" /><circle cx="24" cy="23" r="3" fill="currentColor" /></svg>
                <span className="font-display text-xs font-extrabold uppercase tracking-[0.2em] sm:text-sm">Tarmoq olami · Informatika</span>
              </div>

              <h2 className="mt-3 font-display text-2xl font-black uppercase tracking-[0.12em] text-navy-900 sm:mt-4 sm:text-[2.4rem]">Sertifikat</h2>
              <p className="mt-0.5 text-[0.7rem] font-bold uppercase tracking-[0.3em] text-amber-700 sm:text-xs">Yutuqlar uchun · Certificate of Achievement</p>

              <p className="mt-4 text-sm text-slate-500 sm:mt-5 sm:text-base">Ushbu sertifikat</p>
              {/* ism */}
              <p className="text-balance mt-1 font-display text-[1.7rem] font-black leading-tight text-navy-950 sm:text-[3.2rem]" style={{ fontFamily: '"Plus Jakarta Sans Variable", serif' }}>{ism}</p>
              <svg viewBox="0 0 300 12" className="mt-1 h-3 w-56 text-amber-500 sm:w-72" fill="none" aria-hidden="true"><path d="M2 6c40-6 60-6 100 0s60 6 100 0 56-6 96 0" stroke="currentColor" strokeWidth="2" /><circle cx="150" cy="6" r="3" fill="currentColor" /></svg>
              <p className="mt-1.5 text-sm font-semibold text-slate-500 sm:text-base">{oquvchi.sinf} oʻquvchisiga beriladi</p>

              <p className="mx-auto mt-3 max-w-xl text-[0.82rem] leading-relaxed text-slate-600 sm:mt-4 sm:text-[0.98rem]">
                U <strong className="font-bold text-navy-900">«{COURSE.title}»</strong> mavzusini oʻzlashtirdi:
                tarmoq qurilmalarini oʻrgandi, oʻz tarmogʻini qurdi va yakuniy bilim sinovidan oʻtdi.
              </p>

              {/* muhr + natija */}
              <div className="mt-3 flex items-center justify-center gap-6 sm:mt-4 sm:gap-10">
                <div className="text-center">
                  <div className="font-display text-2xl font-black text-navy-950 sm:text-4xl">{jamiFoiz}%</div>
                  <div className="text-[0.6rem] font-bold uppercase tracking-widest text-slate-400 sm:text-xs">Natija</div>
                </div>
                <Muhr d={d} />
                <div className="text-center">
                  <div className="font-display text-2xl font-black text-navy-950 sm:text-4xl">{natijalar.length}<span className="text-base text-slate-400 sm:text-xl">/{Object.keys(VAZIFALAR).length}</span></div>
                  <div className="text-[0.6rem] font-bold uppercase tracking-widest text-slate-400 sm:text-xs">Vazifa</div>
                </div>
              </div>

              {/* imzolar */}
              <div className="mt-auto grid w-full max-w-2xl grid-cols-2 gap-8 pt-4 sm:gap-16 sm:pt-6">
                <div>
                  <div className="mx-auto h-8 w-full border-b-2 border-slate-300" />
                  <p className="mt-1 text-[0.68rem] font-bold uppercase tracking-wider text-slate-500 sm:text-xs">Oʻqituvchi imzosi</p>
                </div>
                <div>
                  <div className="mx-auto flex h-8 w-full items-end justify-center border-b-2 border-slate-300 pb-1 font-display text-sm font-extrabold text-navy-900 sm:text-base">{sana()}</div>
                  <p className="mt-1 text-[0.68rem] font-bold uppercase tracking-wider text-slate-500 sm:text-xs">Sana</p>
                </div>
              </div>

              {/* sertifikat raqami */}
              <p className="mt-3 font-mono text-[0.6rem] tracking-wider text-slate-400 sm:text-[0.7rem]">Sertifikat №: {kod(oquvchi.id)} · {COURSE.subject}</p>
            </div>
          </div>
        </article>
      </div>

      {ochiq && (
        <div className="no-print mt-7 flex flex-wrap gap-3">
          <Btn variant="primary" size="lg" icon={Printer} onClick={() => window.print()}>Chop etish / PDF saqlash</Btn>
          <Link to="/reyting" className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-6 py-4 font-extrabold text-navy-900 hover:border-brand-400 hover:bg-brand-50">
            🏆 Reytingni koʻrish
          </Link>
          <span className="inline-flex items-center gap-2 self-center text-sm text-slate-500"><Download size={15} /> Chop etishda «PDF saqlash»ni tanlang</span>
        </div>
      )}
    </>
  )
}
