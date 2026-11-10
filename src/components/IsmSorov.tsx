import { useState, type FormEvent } from 'react'
import { Rocket, TriangleAlert, UserRound } from 'lucide-react'
import { Btn, cx } from './ui'
import { useOquvchi } from '../lib/student'
import { useStored } from '../lib/storage'

const SINFLAR = ['8-A', '8-B', '8-V', '9-A', '9-B', '9-V']

/** Ball beriladigan sahifalarda chiqadi: bola ismini shu yerda yozib, ishini davom ettiradi.
    Natijasi reytingga tushadi; shu paytgacha bajargan ishi ham avtomatik yuboriladi. */
export default function IsmSorov() {
  const { oquvchi, kirish, kutilyapti, xato } = useOquvchi()
  const [oxirgi, setOxirgi] = useStored('oxirgiKirish', { ism: '', familiya: '', sinf: '' })
  const [ism, setIsm] = useState(oxirgi.ism)
  const [familiya, setFamiliya] = useState(oxirgi.familiya)
  const [sinf, setSinf] = useState(oxirgi.sinf || SINFLAR[3])
  const [tegildi, setTegildi] = useState(false)

  if (oquvchi) return null
  const ok = ism.trim().length >= 2 && familiya.trim().length >= 2

  async function yubor(e: FormEvent) {
    e.preventDefault()
    setTegildi(true)
    if (!ok) return
    setOxirgi({ ism: ism.trim(), familiya: familiya.trim(), sinf })
    await kirish(ism, familiya, sinf)
  }

  return (
    <form onSubmit={yubor} className="no-print anim-in mb-8 overflow-hidden rounded-4xl border-2 border-brand-300 bg-white shadow-card">
      <div className="flex items-center gap-3 bg-gradient-to-r from-brand-600 to-violet-500 px-5 py-3.5">
        <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-white/25 text-white"><UserRound size={20} /></span>
        <div>
          <h2 className="font-display text-base font-extrabold !text-white sm:text-lg">Avval ismingizni yozing</h2>
          <p className="text-sm text-brand-100">Shunda bu vazifadagi ballingiz sinf reytingiga tushadi.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3 p-5">
        <label className="min-w-[9rem] flex-1">
          <span className="label">Ism</span>
          <input className={cx('field', tegildi && ism.trim().length < 2 && '!border-rose-400')} value={ism} maxLength={40}
            placeholder="Masalan: Sardor" autoComplete="given-name" onChange={e => setIsm(e.target.value)} />
        </label>
        <label className="min-w-[9rem] flex-1">
          <span className="label">Familiya</span>
          <input className={cx('field', tegildi && familiya.trim().length < 2 && '!border-rose-400')} value={familiya} maxLength={40}
            placeholder="Masalan: Asadullayev" autoComplete="family-name" onChange={e => setFamiliya(e.target.value)} />
        </label>
        <label className="min-w-[7rem]">
          <span className="label">Sinf</span>
          <select className="field !py-[0.78rem]" value={SINFLAR.includes(sinf) ? sinf : 'boshqa'} onChange={e => setSinf(e.target.value === 'boshqa' ? '' : e.target.value)}>
            {SINFLAR.map(s => <option key={s} value={s}>{s}</option>)}
            <option value="boshqa">Boshqa…</option>
          </select>
        </label>
        {!SINFLAR.includes(sinf) && (
          <label className="min-w-[8rem] flex-1">
            <span className="label">Sinfingiz</span>
            <input className="field" value={sinf} maxLength={20} placeholder="Masalan: 7-A" onChange={e => setSinf(e.target.value)} />
          </label>
        )}
        <Btn type="submit" variant="primary" size="lg" icon={Rocket} disabled={kutilyapti}>
          {kutilyapti ? 'Kirilmoqda…' : 'Boshlash'}
        </Btn>
      </div>

      {(tegildi && !ok) && <p className="px-5 pb-4 text-sm font-semibold text-rose-600">Ism va familiyangizni toʻliq yozing.</p>}
      {xato && (
        <p className="mx-5 mb-5 flex items-start gap-2.5 rounded-2xl border-2 border-amber-200 bg-amber-50 p-3.5 text-sm font-semibold text-amber-900" role="alert">
          <TriangleAlert size={18} className="mt-0.5 flex-none" />{xato} Ismsiz ham ishlashingiz mumkin — natijangiz shu qurilmada saqlanadi.
        </p>
      )}
    </form>
  )
}
