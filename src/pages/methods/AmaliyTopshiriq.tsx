import { useState } from 'react'
import { ClipboardCheck, RotateCcw } from 'lucide-react'
import { Block, Btn, Callout, PageHeader, Takeaway, cx } from '../../components/ui'
import NetworkLab from '../../lab/NetworkLab'
import { EMPTY, LAN_SOLUTION } from '../../lab/presets'
import { gradeLan, type Criterion, type LabState } from '../../lib/net'
import { saveResult, useStored } from '../../lib/storage'
import { MethodInfo, StageTimer, type MethodMeta } from './MethodInfo'

const META: MethodMeta = {
  goal: <>Bilimni <strong>harakatga</strong> aylantirish: oʻquvchi aniq topshiriqni boshidan oxirigacha mustaqil bajaradi va natijasi oldindan maʼlum mezonlar boʻyicha baholanadi.</>,
  how: ['Topshiriq va baholash mezonlari eʼlon qilinadi', 'Oʻquvchi qurilmalarni tanlab, topologiya tuzadi', 'Ulanishlarni bajaradi va IP manzillarni belgilaydi', 'Xavfsizlik choralarini koʻrsatib, loyihasini izohlaydi'],
  teacher: ['Topshiriqni va mezonlarni oldindan tushuntiradi', 'Ish paytida yordam beradi, lekin oʻrniga bajarmaydi', 'Natijani mezon boʻyicha muhokama qiladi'],
  student: ['Topshiriqni mustaqil yoki juftlikda bajaradi', 'Xatosini diagnostika orqali oʻzi topadi', 'Tanlovini yozma asoslaydi'],
  example: <>Kafedra xonasi uchun 10 ta kompyuter va 1 ta printerli tarmoq. Oʻquvchi switch tanlaydi, hammasini yulduz shaklida ulaydi, manzillarni bitta tarmoqdan beradi va chegaraga firewall qoʻyadi.</>,
  outcome: <>Oʻquvchi kichik lokal tarmoqni mustaqil loyihalaydi, sozlaydi, tekshiradi va himoya qiladi — «qoʻllash» va «yaratish» darajasi.</>,
  criteria: ['Topologiyani toʻgʻri tanlash — 18 ball', 'Qurilmalarni toʻgʻri tanlash — 17 ball', 'IP manzillash — 18 ball', 'Ulanishlar — 17 ball', 'Xavfsizlik — 15 ball', 'Loyihani izohlash — 15 ball'],
}

const MEASURES = ['Router va Wi-Fi uchun kuchli, takrorlanmaydigan parol', 'Standart (zavod) parollarini oʻzgartirish', 'Printerni alohida VLAN ga ajratish', 'Qurilma dasturlarini muntazam yangilash', 'Muhim fayllarni zaxiralash', 'Mehmonlar uchun alohida Wi-Fi tarmogʻi']

export default function AmaliyTopshiriq() {
  const [lab, setLab] = useStored<LabState>('amaliy-lab', EMPTY)
  const [extra, setExtra, resetExtra] = useStored<{ measures: string[]; explain: string }>('amaliy-extra', { measures: [], explain: '' })
  const [result, setResult] = useState<Criterion[] | null>(null)
  const total = result?.reduce((a, c) => a + c.score, 0) ?? 0

  function evaluate() {
    const r = gradeLan(lab, extra.measures, extra.explain)
    setResult(r)
    const t = r.reduce((a, c) => a + c.score, 0)
    saveResult('amaliy', { score: t, max: 100, label: 'Amaliy topshiriq', detail: t + ' / 100 ball' })
  }

  return (
    <>
      <PageHeader no="12.5" tone="amber" eyebrow="Pedagogik metod" title="Amaliy topshiriq metodi"
        lead="Oʻquvchi tarmoqni oʻzi quradi — natija olti mezon boʻyicha avtomatik baholanadi." />
      <MethodInfo m={META} />

      <Block title="Topshiriq" tone="amber">
        <Callout kind="warn" title="Bajariladigan ish" className="mb-5">
          <p className="text-[1.08rem] font-semibold text-navy-950">«10 ta kompyuter va 1 ta printer uchun kichik lokal tarmoq yarating».</p>
          <p className="mt-2">Qurilmalarni tanlang, topologiya tuzing, ulanishlarni bajaring, IP manzillarni belgilang va xavfsizlik choralarini koʻrsating. Tarmoq Internetga ham chiqishi kerak.</p>
        </Callout>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <StageTimer seconds={600} label="Topshiriq taymeri" />
          <span className="text-sm text-slate-600">Maslahat: «⚡ Avto IP» tugmasi vaqtni tejaydi. Oʻqituvchi «Yana» tugmasi ostidagi «Tayyor namuna» roʻyxatidan namunaviy yechimni yuklashi mumkin.</span>
        </div>

        <NetworkLab value={lab} onChange={s => { setLab(s); setResult(null) }} title="Ish maydoni: 10 kompyuter + 1 printer"
          presetKeys={[]} extraPresets={[{ label: 'Namunaviy yechim (oʻqituvchi uchun)', state: LAN_SOLUTION }]} />

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <fieldset className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <legend className="px-1 font-display font-bold text-navy-950">Qoʻshimcha xavfsizlik choralari</legend>
            <p className="mb-3 text-sm text-slate-600">Sxemadagi firewalldan tashqari yana qaysi choralarni qoʻllaysiz? (kamida uchta)</p>
            <div className="grid gap-2">
              {MEASURES.map(m => {
                const on = extra.measures.includes(m)
                return (
                  <label key={m} className={cx('flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-2.5 text-[0.95rem] transition', on ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:border-amber-400')}>
                    <input type="checkbox" className="mt-1 h-4 w-4 accent-amber-500" checked={on} onChange={() => { setExtra(e => ({ ...e, measures: on ? e.measures.filter(x => x !== m) : [...e.measures, m] })); setResult(null) }} />
                    <span>{m}</span>
                  </label>
                )
              })}
            </div>
          </fieldset>
          <label className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <span className="font-display font-bold text-navy-950">Loyihani izohlang</span>
            <span className="mb-3 mt-1 block text-sm text-slate-600">Nega shu topologiya va shu qurilmalar? IP manzillar qanday berildi? (kamida 25 soʻz)</span>
            <textarea className="field min-h-[13rem]" value={extra.explain} placeholder="Yulduz topologiyasini tanladim, chunki..." onChange={e => { setExtra(x => ({ ...x, explain: e.target.value })); setResult(null) }} />
            <span className="mt-1.5 block text-sm text-slate-500" aria-live="polite">{extra.explain.trim().split(/\s+/).filter(Boolean).length} soʻz</span>
          </label>
        </div>

        <div className="no-print mt-5 flex flex-wrap gap-3">
          <Btn variant="primary" size="lg" icon={ClipboardCheck} onClick={evaluate}>Loyihani baholash</Btn>
          <Btn variant="danger" size="lg" icon={RotateCcw} onClick={() => { if (window.confirm('Sxema, choralar va izoh oʻchiriladi. Davom etasizmi?')) { setLab(EMPTY); resetExtra(); setResult(null) } }}>Hammasini tozalash</Btn>
        </div>

        {result && (
          <div className="anim-in mt-5 rounded-2xl border border-amber-300 bg-white p-5 shadow-lift sm:p-6" role="status" aria-live="polite">
            <div className="flex flex-wrap items-center gap-4">
              <div className="grid h-20 w-20 flex-none place-items-center rounded-2xl bg-navy-950 font-display text-2xl font-extrabold text-white">{total}</div>
              <div>
                <h3 className="text-xl font-bold">Natija: {total} / 100 ball</h3>
                <p className="text-slate-600">{total >= 86 ? 'Aʼlo — tarmoq toʻliq, ishlaydi va himoyalangan.' : total >= 71 ? 'Yaxshi — quyidagi izohlar boʻyicha bir-ikki joyni toʻgʻrilang.' : total >= 56 ? 'Qoniqarli — diagnostika xatolarini tuzatib, qayta baholang.' : 'Loyiha hali tugallanmagan. Mezonlar boʻyicha izohlarni oʻqing va davom eting.'}</p>
              </div>
            </div>
            <ul className="mt-5 grid gap-4 md:grid-cols-2">
              {result.map((c, i) => (
                <li key={i} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3"><span className="font-display font-bold text-navy-950">{i + 1}. {c.title}</span><span className="font-mono text-sm font-bold text-slate-700">{c.score} / {c.max}</span></div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className={cx('h-full rounded-full', c.score / c.max >= 0.8 ? 'bg-emerald-500' : c.score / c.max >= 0.5 ? 'bg-amber-500' : 'bg-rose-500')} style={{ width: (c.score / c.max) * 100 + '%' }} /></div>
                  <ul className="mt-2.5 space-y-1 text-[0.92rem] text-slate-600">{c.notes.map((n, k) => <li key={k}>— {n}</li>)}</ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Block>

      <Takeaway items={[
        'Mezonlar oldindan maʼlum boʻlsa, baholash adolatli va tushunarli boʻladi.',
        'Amaliy topshiriqda xato — oʻrganishning bir qismi: diagnostika uni topishga yordam beradi.',
        'Tarmoq «ishlayapti» degani yetarli emas — tanlov asoslangan boʻlishi kerak.',
      ]} />
    </>
  )
}
