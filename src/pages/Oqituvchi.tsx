import { useCallback, useEffect, useRef, useState } from 'react'
import { Download, KeyRound, LogIn, MessageSquare, Printer, RefreshCw, Save, Trash2, TriangleAlert, Users } from 'lucide-react'
import { Btn, Callout, Pill, Progress, cx } from '../components/ui'
import { api, ApiXato, VAZIFALAR, VAZIFA_KODLARI, type Oquvchi } from '../lib/api'
import { useStored } from '../lib/storage'

const MEDAL = ['🥇', '🥈', '🥉']
const foiz = (o: Oquvchi) => (o.bajarilgan ? Math.round(o.jamiBall / o.bajarilgan) : 0)

/** Oʻqituvchi paneli: natijalar, baholash va reyting. PIN bilan ochiladi. */
export default function Oqituvchi() {
  const [pin, setPin] = useStored('oqituvchiPin', '')
  const [kiritilgan, setKiritilgan] = useState(pin)
  const [kirdi, setKirdi] = useState(false)
  const [xato, setXato] = useState('')
  const [yuklanmoqda, setYuklanmoqda] = useState(false)
  const [oquvchilar, setOquvchilar] = useState<Oquvchi[]>([])
  const [sinflar, setSinflar] = useState<string[]>([])
  const [sinf, setSinf] = useState('')
  const [tahrir, setTahrir] = useState<Record<string, { baho: string; izoh: string }>>({})
  const [xabar, setXabar] = useState('')
  const pinRef = useRef(pin)
  pinRef.current = pin

  const yukla = useCallback(async (p = pinRef.current) => {
    if (!p) return
    setYuklanmoqda(true)
    try {
      const d = await api.oqituvchi(p)
      setOquvchilar(d.oquvchilar); setSinflar(d.sinflar); setKirdi(true); setXato('')
    } catch (e) {
      setXato(e instanceof ApiXato ? e.message : 'Xato yuz berdi.')
      if (e instanceof ApiXato && e.message.includes('PIN')) setKirdi(false)
    } finally { setYuklanmoqda(false) }
  }, [])

  useEffect(() => { if (pin) void yukla(pin) }, []) // eslint-disable-line react-hooks/exhaustive-deps
  /* Dars davomida natijalar oʻzi yangilanib turadi */
  useEffect(() => {
    if (!kirdi) return
    const t = setInterval(() => void yukla(), 10000)
    return () => clearInterval(t)
  }, [kirdi, yukla])

  const royxat = oquvchilar.filter(o => !sinf || o.sinf === sinf)

  async function baholash(o: Oquvchi) {
    const t = tahrir[o.id] ?? { baho: o.baho?.toString() ?? '', izoh: o.izoh ?? '' }
    try {
      await api.baho(pin, o.id, t.baho === '' ? null : Number(t.baho), t.izoh)
      setXabar(`${o.toliqIsm} uchun baho saqlandi.`)
      setTahrir(x => { const y = { ...x }; delete y[o.id]; return y })
      void yukla()
    } catch (e) { setXato(e instanceof ApiXato ? e.message : 'Saqlanmadi.') }
  }
  async function ochir(nima: { oquvchiId?: string; sinf?: string; hammasi?: boolean }, savol: string) {
    if (!window.confirm(savol)) return
    try { await api.ochirish(pin, nima); setXabar('Oʻchirildi.'); void yukla() }
    catch (e) { setXato(e instanceof ApiXato ? e.message : 'Oʻchirilmadi.') }
  }
  function csv() {
    const head = ['Oʻrin', 'Familiya Ism', 'Sinf', ...VAZIFA_KODLARI.map(k => VAZIFALAR[k].nom), 'Jami ball', 'Oʻrtacha %', 'Baho', 'Izoh']
    const rows = royxat.map((o, i) => [i + 1, o.toliqIsm, o.sinf,
      ...VAZIFA_KODLARI.map(k => { const n = o.natijalar.find(x => x.vazifa === k); return n ? `${n.ball}/${n.maks}` : '' }),
      o.jamiBall, foiz(o) + '%', o.baho ?? '', (o.izoh || '').replace(/[\r\n;]+/g, ' ')])
    const text = [head, ...rows].map(r => r.join(';')).join('\n')
    const url = URL.createObjectURL(new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url; a.download = `natijalar-${sinf || 'hamma'}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  /* ---------------- PIN darvozasi ---------------- */
  if (!kirdi) {
    return (
      <div className="mx-auto max-w-md py-10">
        <form onSubmit={e => { e.preventDefault(); setPin(kiritilgan); void yukla(kiritilgan) }}
          className="overflow-hidden rounded-4xl border-2 border-brand-200 bg-white shadow-lift">
          <div className="bg-gradient-to-r from-navy-900 to-brand-800 px-6 py-6 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/15 text-white"><KeyRound size={26} /></span>
            <h1 className="mt-4 font-display text-2xl font-extrabold !text-white">Oʻqituvchi paneli</h1>
            <p className="mt-1 text-sm text-brand-200">Oʻquvchilar natijasi, baho va reyting</p>
          </div>
          <div className="space-y-4 p-6">
            <label className="block">
              <span className="label">PIN kod</span>
              <input className="field text-center font-mono text-2xl tracking-[0.5em]" value={kiritilgan} type="password" inputMode="numeric"
                autoFocus maxLength={8} placeholder="••••" onChange={e => setKiritilgan(e.target.value.replace(/\D/g, ''))} />
            </label>
            {xato && <p className="flex items-start gap-2 rounded-2xl border-2 border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-800" role="alert"><TriangleAlert size={18} className="mt-0.5 flex-none" />{xato}</p>}
            <Btn type="submit" variant="primary" size="lg" icon={LogIn} className="w-full" disabled={!kiritilgan || yuklanmoqda}>{yuklanmoqda ? 'Tekshirilmoqda…' : 'Kirish'}</Btn>
            <p className="text-center text-sm text-slate-500">Boshlangʻich PIN: <strong className="font-mono">2026</strong>. Uni pastdan oʻzgartirish mumkin.</p>
          </div>
        </form>
      </div>
    )
  }

  /* ---------------- Panel ---------------- */
  return (
    <>
      <header className="anim-in mb-7">
        <span className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-4 py-2 text-sm font-extrabold text-white"><Users size={17} /> Faqat oʻqituvchi uchun</span>
        <h1 className="mt-4 text-[2rem] font-extrabold sm:text-[2.6rem]">Oʻquvchilar natijalari</h1>
        <p className="mt-2 text-[1.05rem] text-slate-600">Natijalar har 10 soniyada oʻzi yangilanadi. Bahoni shu yerda qoʻyasiz.</p>
      </header>

      <div className="no-print mb-5 flex flex-wrap items-center gap-2.5">
        <button type="button" onClick={() => setSinf('')} aria-pressed={!sinf}
          className={cx('rounded-2xl border-2 px-4 py-2.5 font-extrabold transition', !sinf ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-200 bg-white hover:border-brand-400')}>
          Hamma sinf <span className="ml-1 opacity-70">{oquvchilar.length}</span>
        </button>
        {sinflar.map(s => (
          <button key={s} type="button" onClick={() => setSinf(s)} aria-pressed={sinf === s}
            className={cx('rounded-2xl border-2 px-4 py-2.5 font-extrabold transition', sinf === s ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-200 bg-white hover:border-brand-400')}>
            {s} <span className="ml-1 opacity-70">{oquvchilar.filter(o => o.sinf === s).length}</span>
          </button>
        ))}
        <span className="ml-auto flex flex-wrap gap-2">
          <Btn size="sm" icon={RefreshCw} onClick={() => void yukla()} disabled={yuklanmoqda}>Yangilash</Btn>
          <Btn size="sm" icon={Download} onClick={csv} disabled={!royxat.length}>Excel (CSV)</Btn>
          <Btn size="sm" icon={Printer} onClick={() => window.print()} disabled={!royxat.length}>Chop etish</Btn>
        </span>
      </div>

      {xabar && <Callout kind="success" className="no-print mb-4">{xabar}</Callout>}
      {xato && <Callout kind="danger" className="no-print mb-4">{xato}</Callout>}

      {!royxat.length ? (
        <Callout kind="info" title="Hali hech kim kirmagan">
          Oʻquvchilar <strong>ism va familiyasi</strong> bilan kirgach, natijalari shu yerda paydo boʻladi.
          Ular saytni shu kompyuterning manzili orqali ochadi (server oynasida koʻrsatilgan).
        </Callout>
      ) : (
        <>
          {/* ---------- Reyting ---------- */}
          <div className="mb-7 grid gap-3 sm:grid-cols-3">
            {royxat.slice(0, 3).map((o, i) => (
              <div key={o.id} className={cx('flex items-center gap-4 rounded-4xl border-2 bg-white p-5 shadow-card',
                i === 0 ? 'border-amber-300' : i === 1 ? 'border-slate-300' : 'border-orange-200')}>
                <span className="text-4xl">{MEDAL[i]}</span>
                <div className="min-w-0">
                  <div className="truncate font-display text-lg font-extrabold text-navy-900">{o.toliqIsm}</div>
                  <div className="text-sm text-slate-500">{o.sinf} · {o.bajarilgan} vazifa</div>
                  <div className="font-display text-xl font-extrabold text-brand-700">{o.jamiBall} ball</div>
                </div>
              </div>
            ))}
          </div>

          {/* ---------- Jadval ---------- */}
          <div className="overflow-x-auto rounded-3xl border-2 border-slate-200 bg-white shadow-card">
            <table className="w-full min-w-[60rem] border-collapse text-left text-[0.95rem]">
              <thead>
                <tr className="bg-gradient-to-r from-navy-900 to-brand-800 text-white">
                  <th className="px-3 py-3 text-xs font-extrabold uppercase">#</th>
                  <th className="px-3 py-3 text-xs font-extrabold uppercase">Familiya Ism</th>
                  <th className="px-3 py-3 text-xs font-extrabold uppercase">Sinf</th>
                  {VAZIFA_KODLARI.map(k => <th key={k} className="px-2 py-3 text-center text-xs font-extrabold" title={VAZIFALAR[k].nom}>{VAZIFALAR[k].emoji}</th>)}
                  <th className="px-3 py-3 text-xs font-extrabold uppercase">Jami</th>
                  <th className="px-3 py-3 text-xs font-extrabold uppercase">Baho</th>
                  <th className="px-3 py-3 text-xs font-extrabold uppercase">Izoh</th>
                  <th className="no-print px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {royxat.map((o, i) => {
                  const t = tahrir[o.id] ?? { baho: o.baho?.toString() ?? '', izoh: o.izoh ?? '' }
                  const ozgardi = !!tahrir[o.id]
                  return (
                    <tr key={o.id} className="border-t-2 border-slate-100 even:bg-slate-50/60">
                      <td className="px-3 py-2.5 font-display font-extrabold text-slate-500">{i < 3 ? MEDAL[i] : i + 1}</td>
                      <td className="px-3 py-2.5 font-bold text-navy-900">{o.toliqIsm}</td>
                      <td className="px-3 py-2.5 text-slate-600">{o.sinf}</td>
                      {VAZIFA_KODLARI.map(k => {
                        const n = o.natijalar.find(x => x.vazifa === k)
                        const p = n ? Math.round((n.ball / n.maks) * 100) : null
                        return (
                          <td key={k} className="px-2 py-2.5 text-center">
                            {p === null ? <span className="text-slate-300">—</span>
                              : <span className={cx('inline-block rounded-lg px-2 py-0.5 font-mono text-xs font-extrabold',
                                  p >= 86 ? 'bg-emerald-100 text-emerald-800' : p >= 56 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800')}>{p}%</span>}
                          </td>
                        )
                      })}
                      <td className="px-3 py-2.5">
                        <div className="font-display font-extrabold text-brand-700">{o.jamiBall}</div>
                        <Progress className="mt-1 !h-1.5 w-20" value={foiz(o)} />
                      </td>
                      <td className="px-3 py-2.5">
                        <select className="field !w-20 !py-1.5 !text-center !text-base font-extrabold" value={t.baho} aria-label={`${o.toliqIsm} uchun baho`}
                          onChange={e => setTahrir(x => ({ ...x, [o.id]: { ...t, baho: e.target.value } }))}>
                          <option value="">—</option><option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option>
                        </select>
                      </td>
                      <td className="px-3 py-2.5">
                        <input className="field !py-1.5 !text-sm" value={t.izoh} placeholder="izoh…" maxLength={120} aria-label={`${o.toliqIsm} uchun izoh`}
                          onChange={e => setTahrir(x => ({ ...x, [o.id]: { ...t, izoh: e.target.value } }))} />
                      </td>
                      <td className="no-print px-3 py-2.5">
                        <div className="flex gap-1.5">
                          <button type="button" onClick={() => void baholash(o)} disabled={!ozgardi} aria-label={`${o.toliqIsm} bahosini saqlash`}
                            className={cx('grid h-9 w-9 place-items-center rounded-xl border-2 transition', ozgardi ? 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'border-slate-200 text-slate-300')}><Save size={16} /></button>
                          <button type="button" onClick={() => void ochir({ oquvchiId: o.id }, `${o.toliqIsm} va uning natijalari oʻchirilsinmi?`)} aria-label={`${o.toliqIsm} ni oʻchirish`}
                            className="grid h-9 w-9 place-items-center rounded-xl border-2 border-slate-200 text-rose-600 transition hover:border-rose-300 hover:bg-rose-50"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="no-print mt-2.5 text-sm text-slate-500">Bahoni tanlagandan soʻng yashil <Save size={13} className="inline" /> tugmasini bosing. Ustun belgilari: {VAZIFA_KODLARI.map(k => `${VAZIFALAR[k].emoji} ${VAZIFALAR[k].nom}`).join(' · ')}.</p>

          {/* ---------- Snowball: oʻquvchilar fikri ---------- */}
          {(() => {
            const fikrli = (o: Oquvchi) => o.natijalar.find(n => n.vazifa === 'snowball' && n.izoh)?.izoh
            const bilan = royxat.filter(o => fikrli(o))
            const siz = royxat.filter(o => !fikrli(o))
            return (
              <section className="mt-8 overflow-hidden rounded-4xl border-2 border-amber-200 bg-white shadow-card">
                <div className="flex flex-wrap items-center gap-3 bg-gradient-to-r from-amber-400 to-orange-400 px-5 py-3.5 sm:px-6">
                  <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-white/30 text-navy-900"><MessageSquare size={20} /></span>
                  <h2 className="mr-auto font-display text-base font-extrabold !text-navy-900 sm:text-lg">«Sinf fikri» (Snowball) javoblari</h2>
                  <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-extrabold text-emerald-800">Qatnashdi: {bilan.length} / {royxat.length}</span>
                </div>
                <div className="p-5 sm:p-6">
                  {!bilan.length ? (
                    <p className="text-slate-500">Hali hech kim fikr yozmagan. Oʻquvchilar bosh sahifadagi <strong>«💭 Sinf fikri»</strong> boʻlimida yozadi.</p>
                  ) : (
                    <ul className="space-y-2.5">
                      {bilan.map(o => (
                        <li key={o.id} className="rounded-2xl border-2 border-slate-200 p-3.5">
                          <div className="font-display text-sm font-extrabold text-navy-900">{o.toliqIsm} <span className="font-medium text-slate-400">· {o.sinf}</span></div>
                          <p className="mt-0.5 text-[0.97rem] leading-relaxed text-slate-700">{fikrli(o)}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                  {siz.length > 0 && (
                    <p className="mt-4 rounded-2xl bg-slate-50 p-3.5 text-sm text-slate-600">
                      <strong className="text-slate-700">Hali yozmaganlar ({siz.length}):</strong> {siz.map(o => o.toliqIsm).join(', ')}
                    </p>
                  )}
                </div>
              </section>
            )
          })()}
        </>
      )}

      {/* ---------- Sozlamalar ---------- */}
      <section className="no-print mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-4xl border-2 border-slate-200 bg-white p-5 shadow-card">
          <h2 className="font-display text-lg font-extrabold">PIN kodni oʻzgartirish</h2>
          <form className="mt-3 flex flex-wrap gap-2" onSubmit={async e => {
            e.preventDefault()
            const inp = (e.currentTarget.elements.namedItem('yangi') as HTMLInputElement)
            try { await api.pinAlmashtirish(pin, inp.value); setPin(inp.value); inp.value = ''; setXabar('PIN yangilandi.') }
            catch (err) { setXato(err instanceof ApiXato ? err.message : 'PIN oʻzgarmadi.') }
          }}>
            <input name="yangi" className="field max-w-[12rem] font-mono" inputMode="numeric" maxLength={8} placeholder="Yangi PIN (4–8 raqam)" aria-label="Yangi PIN" />
            <Btn type="submit" icon={KeyRound}>Saqlash</Btn>
          </form>
        </div>
        <div className="rounded-4xl border-2 border-rose-200 bg-white p-5 shadow-card">
          <h2 className="font-display text-lg font-extrabold text-rose-800">Natijalarni tozalash</h2>
          <p className="mt-1 text-sm text-slate-600">Yangi dars boshlanishidan oldin.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {sinf && <Btn variant="danger" icon={Trash2} onClick={() => void ochir({ sinf }, `${sinf} sinfining barcha natijalari oʻchirilsinmi?`)}>Faqat {sinf}</Btn>}
            <Btn variant="danger" icon={Trash2} onClick={() => void ochir({ hammasi: true }, 'BARCHA oʻquvchilar va natijalar oʻchirilsinmi? Buni qaytarib boʻlmaydi.')}>Hammasini oʻchirish</Btn>
          </div>
        </div>
      </section>

      <p className="no-print mt-6 text-sm text-slate-400">
        <Pill tone="slate">Eslatma</Pill> PIN — oddiy himoya: u maxfiy maʼlumotni emas, tasodifiy ochilishni toʻsadi. Natijalar serverdagi <code className="font-mono">data/maktab.json</code> faylida saqlanadi.
      </p>
    </>
  )
}
