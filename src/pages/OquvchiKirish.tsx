import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, LogIn, Rocket, TriangleAlert, Wifi, WifiOff } from 'lucide-react'
import { Btn, cx } from '../components/ui'
import { COURSE } from '../data/sections'
import { useOquvchi } from '../lib/student'
import { useStored } from '../lib/storage'

const SINFLAR = ['8-A', '8-B', '8-V', '9-A', '9-B', '9-V']

/** Bola ismi va familiyasi bilan kiradigan sahifa. Parol yoʻq — faqat ism. */
export default function OquvchiKirish() {
  const { oquvchi, kirish, kutilyapti, xato, aloqa } = useOquvchi()
  const nav = useNavigate()
  const [oxirgi, setOxirgi] = useStored('oxirgiKirish', { ism: '', familiya: '', sinf: '' })
  const [ism, setIsm] = useState(oxirgi.ism)
  const [familiya, setFamiliya] = useState(oxirgi.familiya)
  const [sinf, setSinf] = useState(oxirgi.sinf || SINFLAR[3])
  const [tegildi, setTegildi] = useState(false)

  useEffect(() => { if (oquvchi) nav('/', { replace: true }) }, [oquvchi, nav])

  const ismOk = ism.trim().length >= 2, famOk = familiya.trim().length >= 2
  async function yubor(e: FormEvent) {
    e.preventDefault()
    setTegildi(true)
    if (!ismOk || !famOk) return
    setOxirgi({ ism: ism.trim(), familiya: familiya.trim(), sinf })
    if (await kirish(ism, familiya, sinf)) nav('/')
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 py-10 sm:px-8">
      <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_1fr]">
        {/* ---------- Chap tomon: salomlashuv ---------- */}
        <div className="anim-in">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-2 text-sm font-extrabold text-brand-700">
            <GraduationCap size={18} /> Informatika darsi
          </span>
          <h1 className="text-balance mt-5 text-[2.2rem] font-extrabold leading-[1.1] sm:text-[3rem]">
            Salom! Bugun <span className="bg-gradient-to-r from-brand-600 to-cyan-500 bg-clip-text text-transparent">kompyuter tarmoqlari</span>ni oʻrganamiz
          </h1>
          <p className="mt-5 max-w-xl text-[1.12rem] leading-relaxed text-slate-600">
            Darslarni oʻqiysiz, oʻz tarmogʻingizni quryapsiz va testlarni yechasiz. Har bir vazifa uchun <strong className="font-bold text-navy-900">ball</strong> olasiz,
            eng koʻp ball toʻplagan oʻquvchi reytingda birinchi boʻladi. Oxirida — <strong className="font-bold text-navy-900">sertifikat</strong>.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {[['📚', 'Oʻqiymiz', 'Sodda darslar'], ['🔧', 'Quramiz', 'Oʻz tarmogʻing'], ['🏆', 'Yutamiz', 'Ball va sertifikat']].map(([e, t, d]) => (
              <div key={t} className="rounded-3xl border-2 border-slate-200 bg-white p-4 shadow-card">
                <div className="text-3xl">{e}</div>
                <div className="mt-2 font-display font-extrabold text-navy-900">{t}</div>
                <div className="text-sm text-slate-500">{d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- Oʻng tomon: kirish ---------- */}
        <form onSubmit={yubor} className="anim-in overflow-hidden rounded-4xl border-2 border-brand-200 bg-white shadow-lift">
          <div className="bg-gradient-to-r from-brand-600 to-violet-500 px-6 py-5">
            <h2 className="flex items-center gap-2.5 font-display text-xl font-extrabold !text-white"><LogIn size={22} /> Ismingizni yozing</h2>
            <p className="mt-1 text-sm text-brand-100">Parol kerak emas — faqat ism, familiya va sinf.</p>
          </div>
          <div className="space-y-4 p-6">
            <label className="block">
              <span className="label">Ismingiz</span>
              <input className={cx('field text-[1.1rem]', tegildi && !ismOk && '!border-rose-400')} value={ism} autoFocus autoComplete="given-name" maxLength={40}
                placeholder="Masalan: Sardor" onChange={e => setIsm(e.target.value)} aria-invalid={tegildi && !ismOk} />
              {tegildi && !ismOk && <span className="mt-1 block text-sm font-semibold text-rose-600">Ismingizni yozing.</span>}
            </label>
            <label className="block">
              <span className="label">Familiyangiz</span>
              <input className={cx('field text-[1.1rem]', tegildi && !famOk && '!border-rose-400')} value={familiya} autoComplete="family-name" maxLength={40}
                placeholder="Masalan: Asadullayev" onChange={e => setFamiliya(e.target.value)} aria-invalid={tegildi && !famOk} />
              {tegildi && !famOk && <span className="mt-1 block text-sm font-semibold text-rose-600">Familiyangizni yozing.</span>}
            </label>
            <div>
              <span className="label">Sinfingiz</span>
              <div className="flex flex-wrap gap-2">
                {SINFLAR.map(s => (
                  <button key={s} type="button" onClick={() => setSinf(s)} aria-pressed={sinf === s}
                    className={cx('rounded-2xl border-2 px-4 py-2.5 font-display text-[1rem] font-extrabold transition',
                      sinf === s ? 'border-brand-600 bg-brand-600 text-white shadow-card' : 'border-slate-200 bg-white text-navy-900 hover:border-brand-400 hover:bg-brand-50')}>
                    {s}
                  </button>
                ))}
              </div>
              <input className="field mt-2.5" value={SINFLAR.includes(sinf) ? '' : sinf} placeholder="Yoki sinfingizni oʻzingiz yozing"
                aria-label="Boshqa sinf" maxLength={20} onChange={e => setSinf(e.target.value)} />
            </div>

            {xato && (
              <p className="flex items-start gap-2.5 rounded-2xl border-2 border-rose-200 bg-rose-50 p-3.5 text-[0.98rem] font-semibold text-rose-800" role="alert">
                <TriangleAlert size={20} className="mt-0.5 flex-none" />{xato}
              </p>
            )}

            <Btn type="submit" variant="primary" size="lg" icon={Rocket} className="w-full" disabled={kutilyapti}>
              {kutilyapti ? 'Kirilmoqda…' : 'Darsni boshlash'}
            </Btn>

            <p className={cx('flex items-center justify-center gap-2 text-sm font-semibold', aloqa === 'bor' ? 'text-emerald-600' : aloqa === 'yoq' ? 'text-amber-600' : 'text-slate-400')}>
              {aloqa === 'yoq' ? <WifiOff size={16} /> : <Wifi size={16} />}
              {aloqa === 'bor' ? 'Server bilan aloqa bor' : aloqa === 'yoq' ? 'Server topilmadi — oʻqituvchiga ayting' : 'Aloqa tekshirilmoqda…'}
            </p>
          </div>
        </form>
      </div>

      <p className="mt-10 text-center text-sm text-slate-400">{COURSE.subject}</p>
    </div>
  )
}
