import { useMemo, useState } from 'react'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { cx } from '../ui'
import { Feedback, GameShell } from './GameShell'

/* ==========================================================================
   Oʻyin 3: «Xavfsiz parol» — har bir parolni «kuchli» yoki «kuchsiz»ga ajrat.
   ========================================================================== */
interface P { parol: string; kuchli: boolean; izoh: string }
const PAROLLAR: P[] = [
  { parol: '123456', kuchli: false, izoh: 'Eng koʻp ishlatiladigan parol — bir soniyada topiladi.' },
  { parol: 'olma-7-kuchli-daryo', kuchli: true, izoh: 'Uzun va bir nechta tasodifiy soʻzdan iborat — juda kuchli.' },
  { parol: 'parol', kuchli: false, izoh: '«Parol» soʻzining oʻzi — eng birinchi sinab koʻriladi.' },
  { parol: 'Qq7!mZ2$vL9x', kuchli: true, izoh: 'Uzun, harf, raqam va belgi aralash — topish deyarli imkonsiz.' },
  { parol: 'sardor2010', kuchli: false, izoh: 'Ism va tugʻilgan yil — oson taxmin qilinadi.' },
  { parol: 'Toshkent-kabutar-27', kuchli: true, izoh: 'Uzun ibora + raqam — eslab qolish oson, buzish qiyin.' },
  { parol: 'qwerty', kuchli: false, izoh: 'Klaviaturadagi ketma-ket harflar — zaif.' },
  { parol: 'password123', kuchli: false, izoh: 'Taniqli soʻz + oddiy raqam — himoyasiz.' },
]

export default function XavfsizParol() {
  const [seed, setSeed] = useState(0)
  const royxat = useMemo(() => [...PAROLLAR].sort(() => Math.random() - 0.5), [seed])
  const [i, setI] = useState(0)
  const [ball, setBall] = useState(0)
  const [javob, setJavob] = useState<null | boolean>(null)

  const cur = royxat[i]
  const done = i >= royxat.length

  function tanla(kuchliDeb: boolean) {
    if (javob !== null) return
    const togri = kuchliDeb === cur.kuchli
    setJavob(togri)
    if (togri) setBall(b => b + 1)
  }
  function keyingi() { setJavob(null); setI(x => x + 1) }

  return (
    <GameShell title="Xavfsiz parol" emoji="🔑" saveKey="parol" saveLabel="Xavfsiz parol oʻyini" score={ball} max={royxat.length} done={done}
      onRestart={() => { setSeed(s => s + 1); setI(0); setBall(0); setJavob(null) }}
      intro={<>Har bir parolni koʻring va u <strong>kuchli</strong>mi yoki <strong>kuchsiz</strong>mi — oʻzingiz hal qiling.</>}>
      {!done && (
        <div className="mx-auto max-w-xl text-center">
          <div className="mb-2 text-sm font-bold text-slate-400">Parol {i + 1} / {royxat.length}</div>
          <div className="rounded-3xl border-2 border-slate-200 bg-slate-50 px-6 py-8">
            <code className="break-all font-mono text-2xl font-extrabold text-navy-900 sm:text-3xl">{cur.parol}</code>
          </div>
          {javob === null ? (
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button type="button" onClick={() => tanla(false)}
                className="flex items-center justify-center gap-2 rounded-2xl border-2 border-rose-200 bg-white px-4 py-4 font-display text-lg font-extrabold text-rose-700 transition hover:-translate-y-0.5 hover:border-rose-400 hover:bg-rose-50 btn-pop">
                <ShieldAlert size={22} /> Kuchsiz
              </button>
              <button type="button" onClick={() => tanla(true)}
                className="flex items-center justify-center gap-2 rounded-2xl border-2 border-emerald-200 bg-white px-4 py-4 font-display text-lg font-extrabold text-emerald-700 transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-50 btn-pop">
                <ShieldCheck size={22} /> Kuchli
              </button>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              <Feedback togri={javob}>
                Bu parol <strong>{cur.kuchli ? 'kuchli' : 'kuchsiz'}</strong>. {cur.izoh}
              </Feedback>
              <button type="button" onClick={keyingi}
                className="w-full rounded-2xl bg-gradient-to-b from-brand-500 to-brand-600 px-5 py-3.5 font-display text-lg font-extrabold text-white btn-pop">
                {i + 1 < royxat.length ? 'Keyingi parol →' : 'Natijani koʻrish 🏁'}
              </button>
            </div>
          )}
        </div>
      )}
    </GameShell>
  )
}
