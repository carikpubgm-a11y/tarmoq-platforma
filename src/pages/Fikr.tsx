import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, MessageSquare, RefreshCw, Send, Users } from 'lucide-react'
import { Btn, Callout, PageHeader, cx } from '../components/ui'
import { api, type Oquvchi } from '../lib/api'
import { saveResult, useStored, type Result, type ResultKey } from '../lib/storage'
import { useOquvchi } from '../lib/student'

const SAVOL = 'Kompyuter tarmogʻida xavfsizlikni taʼminlash uchun eng muhim 3 ta chora qaysi? Oʻz fikringni yoz.'

/** «Sinf fikri» (Snowball) — har bir oʻquvchi oʻz fikrini yozadi, oʻqituvchi hammasini koʻradi. */
export default function Fikr() {
  const { oquvchi, yangilash } = useOquvchi()
  const [mahalliy] = useStored<Partial<Record<ResultKey, Result>>>('results', {})
  const avvalgi = oquvchi?.natijalar?.find(n => n.vazifa === 'snowball')?.izoh || mahalliy.snowball?.detail || ''
  const [matn, setMatn] = useState(avvalgi)
  const [yuborildi, setYuborildi] = useState(!!avvalgi)
  const [royxat, setRoyxat] = useState<Oquvchi[]>([])

  useEffect(() => { setMatn(avvalgi); if (avvalgi) setYuborildi(true) }, [avvalgi])

  const sinfFikrlari = useCallback(async () => {
    try {
      const { reyting } = await api.reyting(oquvchi?.sinf)
      setRoyxat(reyting)
    } catch { /* server oʻchiq */ }
  }, [oquvchi?.sinf])
  useEffect(() => { void sinfFikrlari(); void yangilash() }, [sinfFikrlari]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { const t = setInterval(() => void sinfFikrlari(), 12000); return () => clearInterval(t) }, [sinfFikrlari])

  function yubor() {
    const t = matn.trim()
    if (t.length < 3) return
    saveResult('snowball', { score: 1, max: 1, label: 'Sinf fikri (Snowball)', detail: t })
    setYuborildi(true)
    setTimeout(() => void sinfFikrlari(), 1500)
  }

  const fikrBerganlar = royxat.filter(o => o.natijalar?.some(n => n.vazifa === 'snowball' && n.izoh))
  const jami = royxat.length

  return (
    <>
      <PageHeader no="❄️" tone="amber" eyebrow="Birgalikda fikrlaymiz · Snowball" title="Sinf fikri"
        lead={<>Avval har kim <strong>oʻzi</strong> fikr yozadi. Soʻng oʻqituvchi barcha javoblarni ekranga chiqarib, sinf bilan birga eng yaxshi uchtasini tanlaydi.</>} />

      <div className="mb-8 overflow-hidden rounded-4xl border-2 border-amber-200 bg-white shadow-card">
        <div className="flex items-center gap-3 bg-gradient-to-r from-amber-400 to-orange-400 px-5 py-3.5 sm:px-6">
          <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-white/30 text-navy-900"><MessageSquare size={20} /></span>
          <h2 className="font-display text-base font-extrabold !text-navy-900 sm:text-lg">Savol</h2>
        </div>
        <div className="p-5 sm:p-6">
          <p className="text-[1.08rem] font-semibold text-navy-900">{SAVOL}</p>

          {yuborildi ? (
            <div className="anim-in mt-4">
              <Callout kind="success" title="Fikringiz yuborildi">
                Rahmat! Javobingiz oʻqituvchiga koʻrindi. Xohlasangiz, pastdan oʻzgartirib qayta yuborishingiz mumkin.
              </Callout>
              <textarea className="field mt-4 min-h-[7rem]" value={matn} maxLength={400} onChange={e => setMatn(e.target.value)} aria-label="Fikringiz" />
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Btn variant="primary" icon={Send} disabled={matn.trim().length < 3} onClick={yubor}>Yangilab yuborish</Btn>
                <span className="text-sm text-slate-500">{matn.trim().split(/\s+/).filter(Boolean).length} soʻz</span>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <textarea className="field min-h-[8rem]" value={matn} maxLength={400}
                placeholder="Masalan: 1) Kuchli parol  2) Firewall  3) Maʼlumotni zaxiralash — chunki..." onChange={e => setMatn(e.target.value)} aria-label="Fikringiz" />
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Btn variant="primary" size="lg" icon={Send} disabled={matn.trim().length < 3} onClick={yubor}>Fikrimni yuborish</Btn>
                {!oquvchi && <span className="text-sm font-semibold text-amber-700">Fikringiz reytingga tushishi uchun avval ismingizni yozing.</span>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sinf javoblari */}
      <div className="rounded-4xl border-2 border-slate-200 bg-white p-5 shadow-card sm:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <h2 className="mr-auto flex items-center gap-2 font-display text-lg font-extrabold text-navy-900"><Users size={20} className="text-brand-600" /> Sinf fikrlari</h2>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-extrabold text-emerald-800" role="status" aria-live="polite">{fikrBerganlar.length} / {jami || '—'} qatnashdi</span>
          <Btn size="sm" icon={RefreshCw} onClick={() => void sinfFikrlari()}>Yangilash</Btn>
        </div>
        {!fikrBerganlar.length ? (
          <p className="text-slate-500">Hali hech kim fikr yozmagan. Birinchi boʻlib siz yozing!</p>
        ) : (
          <ul className="space-y-2.5">
            {fikrBerganlar.map(o => {
              const fikr = o.natijalar.find(n => n.vazifa === 'snowball')?.izoh
              const men = o.id === oquvchi?.id
              return (
                <li key={o.id} className={cx('flex gap-3 rounded-2xl border-2 p-3.5', men ? 'border-brand-300 bg-brand-50' : 'border-slate-200')}>
                  <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-brand-600 font-display text-sm font-extrabold text-white">{(o.ism[0] || '?').toUpperCase()}</span>
                  <div className="min-w-0">
                    <div className="font-display text-sm font-extrabold text-navy-900">{o.toliqIsm}{men && <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-xs text-brand-700">siz</span>}</div>
                    <p className="text-[0.97rem] leading-relaxed text-slate-700">{fikr}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
        {jami > fikrBerganlar.length && (
          <p className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <CheckCircle2 size={15} className="text-slate-400" /> Hali yozmaganlar: {jami - fikrBerganlar.length} ta oʻquvchi.
          </p>
        )}
      </div>

      <p className="mt-6 text-sm text-slate-500">Oʻqituvchi barcha javoblarni <Link to="/oqituvchi" className="font-semibold text-brand-700 underline">panelda</Link> koʻradi — kim qatnashgani ham koʻrinadi.</p>
    </>
  )
}
