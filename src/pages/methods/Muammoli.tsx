import { useState } from 'react'
import { ArrowLeft, ArrowRight, ClipboardCheck, Minus, Plus, RotateCcw, Wand2 } from 'lucide-react'
import { Block, Btn, Callout, PageHeader, Takeaway, cx } from '../../components/ui'
import { saveResult, useStored } from '../../lib/storage'
import { MethodInfo, Stepper, StageTimer, type MethodMeta } from './MethodInfo'

const META: MethodMeta = {
  goal: <>Tayyor bilim berilmaydi — avval <strong>muammo</strong> qoʻyiladi. Talaba uni tahlil qilib, yechimni oʻzi loyihalaydi va asoslaydi. Shu tariqa bilim yodlanmaydi, balki «kashf qilinadi».</>,
  how: ['Muammoli vaziyat eʼlon qilinadi', 'Talaba shartni tahlil qilib, kichik muammolarga ajratadi', 'Qurilma, topologiya va himoya choralarini tanlaydi', 'Yechimini izohlaydi; platforma mezon boʻyicha tekshiradi'],
  teacher: ['Muammoni aniq va hayotiy shaklda qoʻyadi', 'Tayyor javob bermaydi — yoʻnaltiruvchi savol beradi', 'Yechimlarni mezon asosida muhokama qiladi'],
  student: ['Shartdagi maʼlumot va cheklovlarni ajratadi', 'Bir nechta variantni solishtiradi', 'Tanlovini «nima uchun» bilan asoslaydi'],
  example: <>Universitet kafedrasiga 20 ta kompyuter, 2 ta printer va 1 ta server uchun xavfsiz va barqaror tarmoq kerak. «Bitta 24 portli switch yetadimi?» degan savolning oʻzi talabani portlarni sanashga majbur qiladi.</>,
  outcome: <>Talaba tarmoq loyihasini talabdan boshlab tuzadi, qurilmani vazifasiga qarab tanlaydi va qarorini yozma asoslaydi (Blum taksonomiyasida — tahlil va baholash darajasi).</>,
  criteria: ['Shartdagi maʼlumotlar toʻgʻri ajratilgan', 'Asosiy kichik muammolar aniqlangan', 'Qurilmalar soni va turi asosli', 'Topologiya vaziyatga mos', 'IP rejasi va himoya choralari toʻliq', 'Yechim izohlangan'],
}

const FACTS = [
  { id: 'pc', t: '20 ta kompyuter ulanishi kerak', ok: true }, { id: 'pr', t: '2 ta printer umumiy foydalaniladi', ok: true }, { id: 'srv', t: '1 ta server bor', ok: true },
  { id: 'sec', t: 'Tarmoq xavfsiz boʻlishi shart', ok: true }, { id: 'stab', t: 'Tarmoq barqaror ishlashi shart', ok: true },
  { id: 'money', t: 'Byudjet cheklanmagan', ok: false }, { id: 'wifi', t: 'Barcha kompyuterlar Wi-Fi orqali ulanadi', ok: false },
]
const PROBLEMS = [
  { id: 'ports', t: '23 ta qurilmani ulash uchun yetarli port topish', ok: true }, { id: 'addr', t: 'IP manzillarni tartibli taqsimlash', ok: true },
  { id: 'srv', t: 'Serverni ruxsatsiz kirishdan himoyalash', ok: true }, { id: 'edge', t: 'Internet chegarasida trafikni nazorat qilish', ok: true },
  { id: 'spof', t: 'Bitta nosozlik butun tarmoqni toʻxtatib qoʻymasligi', ok: true }, { id: 'data', t: 'Maʼlumot yoʻqolishining oldini olish (zaxira)', ok: true },
  { id: 'color', t: 'Kompyuterlar korpusi rangini tanlash', ok: false }, { id: 'isp', t: 'Har bir kompyuterga alohida Internet tarifi ulash', ok: false },
]
const DEVICES = [
  { id: 'switch', t: '24 portli boshqariladigan switch' }, { id: 'router', t: 'Router' }, { id: 'firewall', t: 'Firewall' }, { id: 'ap', t: 'Access point (Wi-Fi)' },
  { id: 'hub', t: 'Hub (konsentrator)' }, { id: 'ups', t: 'UPS (uzluksiz quvvat manbai)' }, { id: 'nas', t: 'Zaxira saqlagich (NAS yoki tashqi disk)' },
]
const TOPOS = [
  { id: 'xstar', t: 'Kengaytirilgan yulduz — ikkita switch oʻzaro ulangan' }, { id: 'star', t: 'Yulduz — bitta markaziy switch' },
  { id: 'bus', t: 'Shina — hammasi bitta magistral kabelda' }, { id: 'ring', t: 'Halqa — har biri ikki qoʻshnisiga ulangan' }, { id: 'mesh', t: 'Toʻliq toʻr — har bir qurilma har biri bilan' },
]
const IPPLANS = [
  { id: 'mixed', t: 'Kompyuterlar — DHCP, server va printerlar — statik manzil' }, { id: 'dhcp', t: 'Hamma qurilma — faqat DHCP' }, { id: 'static', t: 'Hamma qurilmaga manzil qoʻlda yoziladi' },
]
const MEASURES = [
  { id: 'fw', t: 'Chegarada firewall, standart qoida — taqiq', ok: true }, { id: 'vlan', t: 'Serverni alohida segmentga (VLAN) ajratish', ok: true },
  { id: 'mfa', t: 'Kuchli parol va ikki bosqichli tekshiruv (MFA)', ok: true }, { id: 'upd', t: 'Qurilma va dasturlarni muntazam yangilash', ok: true },
  { id: 'bak', t: 'Server maʼlumotlarini 3-2-1 qoidasi boʻyicha zaxiralash', ok: true }, { id: 'least', t: 'Har kimga faqat zarur huquqni berish', ok: true },
  { id: 'share', t: 'Administrator parolini barcha xodimlarga tarqatish', ok: false }, { id: 'av', t: 'Faqat antivirus oʻrnatish — boshqa chora shart emas', ok: false },
]

interface State { facts: string[]; problems: string[]; own: string; devices: Record<string, number>; topo: string; ip: string; measures: string[]; explain: string }
const S0: State = { facts: [], problems: [], own: '', devices: {}, topo: '', ip: '', measures: [], explain: '' }
const SAMPLE: State = {
  facts: ['pc', 'pr', 'srv', 'sec', 'stab'], problems: ['ports', 'addr', 'srv', 'edge', 'spof', 'data'], own: 'Kelajakda kompyuterlar soni oshishi mumkin — zaxira portlar kerak.',
  devices: { switch: 2, router: 1, firewall: 1, ups: 1, nas: 1 }, topo: 'xstar', ip: 'mixed', measures: ['fw', 'vlan', 'mfa', 'upd', 'bak', 'least'],
  explain: 'Jami 23 ta qurilma bor, shuning uchun bitta 24 portli switch yetmaydi: router uchun ham port kerak va kengayishga joy qolmaydi. Ikkita switch olib, ularni oʻzaro ulaymiz — kengaytirilgan yulduz hosil boʻladi. Kompyuterlarga manzilni DHCP beradi, server va printerlar statik manzil oladi. Chegaraga firewall qoʻyamiz, serverni alohida VLAN ga ajratamiz, UPS va 3-2-1 zaxira barqarorlikni taʼminlaydi.',
}
const STEPS = ['Muammoni oʻrganish', 'Muammolarni aniqlash', 'Qurilmalarni tanlash', 'Topologiya', 'IP va xavfsizlik', 'Yechimni izohlash']

interface Crit { title: string; score: number; max: number; notes: string[] }
function grade(s: State): Crit[] {
  const out: Crit[] = []
  const pick = (list: { id: string; ok: boolean }[], chosen: string[]) => ({ right: list.filter(x => x.ok && chosen.includes(x.id)).length, total: list.filter(x => x.ok).length, wrong: list.filter(x => !x.ok && chosen.includes(x.id)).length })
  const f = pick(FACTS, s.facts)
  out.push({ title: 'Muammoni oʻrganish', max: 10, score: Math.max(0, Math.round((f.right / f.total) * 10) - f.wrong * 3),
    notes: [`Shartdagi ${f.total} ta maʼlumotdan ${f.right} tasi belgilandi.`, ...(f.wrong ? ['Shartda yoʻq taxmin belgilangan: byudjet va Wi-Fi haqida hech narsa aytilmagan.'] : [])] })
  const p = pick(PROBLEMS, s.problems)
  out.push({ title: 'Muammolarni aniqlash', max: 15, score: Math.max(0, Math.round((p.right / p.total) * 13) - p.wrong * 3 + (s.own.trim().length > 15 ? 2 : 0)),
    notes: [`${p.total} ta asosiy muammodan ${p.right} tasi topildi.`, ...(p.wrong ? ['Loyihaga aloqasi yoʻq band belgilangan.'] : []), s.own.trim().length > 15 ? 'Oʻz kuzatuvingiz qoʻshilgan — yaxshi.' : 'Oʻz kuzatuvingizni ham yozing (masalan, kelajakdagi kengayish).'] })

  const d = (k: string) => s.devices[k] ?? 0
  let dv = 0; const dn: string[] = []
  if (d('switch') >= 2) { dv += 9; dn.push(`Switch: ${d('switch')} ta (${d('switch') * 24} port) — 23 qurilma, router va kengayish uchun yetarli.`) }
  else if (d('switch') === 1) { dv += 5; dn.push('Bitta 24 portli switch: 23 qurilma + router = 24 port. Sigʻadi, lekin bitta ham boʻsh port qolmaydi va switch — yagona nosozlik nuqtasi.') }
  else dn.push('Switch tanlanmagan: 23 ta qurilmani nima birlashtiradi?')
  if (d('router') >= 1) { dv += 4; dn.push('Router bor — Internetga chiqish va tarmoqlar orasida yoʻnaltirish.') } else dn.push('Router yoʻq: Internetga chiqish va segmentlar orasida yoʻnaltirish imkonsiz.')
  if (d('firewall') >= 1) { dv += 4; dn.push('Firewall bor — «xavfsiz» talabi uchun asosiy qurilma.') } else dn.push('Firewall yoʻq: shartdagi «xavfsiz» talabi qanday bajariladi?')
  if (d('ups') >= 1) { dv += 2; dn.push('UPS — «barqaror» talabiga javob.') } else dn.push('UPS yoʻq: elektr uzilsa server va switch oʻchadi.')
  if (d('nas') >= 1) { dv += 1; dn.push('Zaxira saqlagich bor.') }
  if (d('hub') >= 1) { dv -= 3; dn.push('Hub — eskirgan qurilma: barcha portga takrorlaydi, toʻqnashuv va xavfsizlik muammosi tugʻdiradi. Oʻrniga switch ishlatiladi.') }
  out.push({ title: 'Qurilmalarni tanlash', max: 20, score: Math.max(0, dv), notes: dn })

  const tp: Record<string, [number, string]> = {
    xstar: [15, 'Kengaytirilgan yulduz — eng mos: portlar yetarli, kengaytirish oson, nosozlik bitta qurilma bilan cheklanadi.'],
    star: [11, 'Yulduz toʻgʻri yoʻnalish, lekin bitta markaz 23 qurilmani zoʻrgʻa sigʻdiradi va u ishdan chiqsa hammasi toʻxtaydi.'],
    mesh: [5, 'Toʻliq toʻr 23 qurilma uchun 253 ta kabel talab qiladi — amalda imkonsiz va keraksiz qimmat.'],
    ring: [4, 'Halqa lokal tarmoqda deyarli qoʻllanmaydi: qurilma qoʻshish butun halqani toʻxtatadi.'],
    bus: [2, 'Shina eskirgan: bitta uzilish tarmoqni boʻladi, toʻqnashuvlar koʻp — «barqaror» talabiga zid.'],
  }
  out.push({ title: 'Topologiya', max: 15, score: tp[s.topo]?.[0] ?? 0, notes: [tp[s.topo]?.[1] ?? 'Topologiya tanlanmagan.'] })

  const m = pick(MEASURES, s.measures)
  const ipS: Record<string, [number, string]> = {
    mixed: [8, 'Toʻgʻri: kompyuterlar DHCP dan oladi, server va printerlar manzili oʻzgarmasligi uchun statik.'],
    dhcp: [4, 'DHCP qulay, lekin server va printer manzili oʻzgarib qolsa, ularga ulanish uziladi — statik manzil yoki band qilish kerak.'],
    static: [3, '23 ta qurilmaga qoʻlda yozish mumkin, ammo xato va ziddiyat ehtimoli yuqori, kengaytirish qiyin.'],
  }
  out.push({ title: 'IP rejasi va xavfsizlik', max: 25, score: Math.max(0, (ipS[s.ip]?.[0] ?? 0) + Math.round((m.right / m.total) * 17) - m.wrong * 5),
    notes: [ipS[s.ip]?.[1] ?? 'IP berish usuli tanlanmagan.', `${m.total} ta toʻgʻri choradan ${m.right} tasi tanlandi.`, ...(m.wrong ? ['Xavfli yoki yetarli boʻlmagan «chora» belgilangan — uni olib tashlang.'] : [])] })

  const words = s.explain.trim().split(/\s+/).filter(Boolean).length
  const low = s.explain.toLowerCase()
  const keys = ['switch', 'router', 'firewall', 'vlan', 'dhcp', 'statik', 'zaxira', 'ups', 'port', 'yulduz'].filter(k => low.includes(k))
  out.push({ title: 'Yechimni izohlash', max: 15, score: Math.min(15, (words >= 40 ? 9 : words >= 20 ? 6 : words >= 8 ? 3 : 0) + Math.min(keys.length, 4) * 1.5),
    notes: [words ? `Izoh uzunligi: ${words} soʻz${words < 40 ? ' — kamida 40 soʻz bilan toʻliqroq asoslang.' : '.'}` : 'Izoh yozilmagan.', keys.length ? `Tayanch tushunchalar: ${keys.join(', ')}.` : 'Izohda qurilma va choralar nomiga tayaning.', 'Izohning mantiqiyligini yakuniy tarzda oʻqituvchi baholaydi.'] })
  return out.map(c => ({ ...c, score: Math.round(c.score) }))
}

function Check({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button type="button" role="checkbox" aria-checked={on} onClick={onClick}
      className={cx('flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-[0.97rem] transition', on ? 'border-amber-500 bg-amber-50 text-navy-950' : 'border-slate-200 bg-white text-slate-700 hover:border-amber-400')}>
      <span className={cx('mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-md border-2 text-xs font-bold', on ? 'border-amber-500 bg-amber-500 text-navy-950' : 'border-slate-300')}>{on ? '✓' : ''}</span>
      <span>{label}</span>
    </button>
  )
}

export default function Muammoli() {
  const [s, setS, reset] = useStored<State>('muammoli', S0)
  const [step, setStep] = useState(0)
  const [result, setResult] = useState<Crit[] | null>(null)
  const toggle = (key: 'facts' | 'problems' | 'measures', id: string) => { setS(p => ({ ...p, [key]: p[key].includes(id) ? p[key].filter(x => x !== id) : [...p[key], id] })); setResult(null) }
  const done = [s.facts.length > 0, s.problems.length > 0, Object.values(s.devices).some(n => n > 0), !!s.topo, !!s.ip && s.measures.length > 0, s.explain.trim().length > 0]
  const total = result?.reduce((a, c) => a + c.score, 0) ?? 0

  function evaluate() {
    const r = grade(s)
    setResult(r)
    const t = r.reduce((a, c) => a + c.score, 0)
    saveResult('muammoli', { score: t, max: 100, label: 'Muammoli taʼlim', detail: t + ' / 100 ball' })
  }

  return (
    <>
      <PageHeader no="12.1" tone="amber" eyebrow="Pedagogik metod" title="Muammoli taʼlim metodi"
        lead="Bilim tayyor holda berilmaydi: talaba real vaziyatni tahlil qiladi, yechim taklif etadi va uni himoya qiladi." />
      <MethodInfo m={META} />

      <Block title="Mashgʻulot: muammoni yeching" tone="amber" sub="Olti bosqichni ketma-ket bajaring. Javoblar shu brauzerda saqlanadi.">
        <Callout kind="warn" title="Muammoli vaziyat" className="mb-5">
          <p className="text-[1.05rem] font-semibold text-navy-950">«Universitetda 20 ta kompyuter, 2 ta printer va 1 ta serverdan iborat tarmoq yaratish kerak. Tarmoq xavfsiz va barqaror boʻlishi lozim. Qanday loyihalaysiz?»</p>
        </Callout>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <StageTimer seconds={180} label="Bosqich taymeri" />
          <Btn size="sm" icon={Wand2} onClick={() => { setS(SAMPLE); setResult(null) }}>Namunaviy yechim bilan toʻldirish</Btn>
          <Btn size="sm" variant="danger" icon={RotateCcw} onClick={() => { reset(); setResult(null); setStep(0) }}>Tozalash</Btn>
        </div>
        <Stepper steps={STEPS} current={step} onPick={setStep} done={done} />

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
          {step === 0 && (
            <div>
              <h3 className="text-lg font-bold">1. Shartda aynan nima berilgan?</h3>
              <p className="mb-4 mt-1 text-slate-600">Faqat vaziyat matnida <strong>aytilgan</strong> maʼlumotlarni belgilang. Taxminni faktdan ajrating.</p>
              <div className="grid gap-2 md:grid-cols-2">{FACTS.map(x => <Check key={x.id} on={s.facts.includes(x.id)} label={x.t} onClick={() => toggle('facts', x.id)} />)}</div>
            </div>
          )}
          {step === 1 && (
            <div>
              <h3 className="text-lg font-bold">2. Qanday kichik muammolarni hal qilish kerak?</h3>
              <p className="mb-4 mt-1 text-slate-600">Katta vazifani boʻlaklarga ajrating. Loyihaga aloqasi yoʻq bandlar ham bor.</p>
              <div className="grid gap-2 md:grid-cols-2">{PROBLEMS.map(x => <Check key={x.id} on={s.problems.includes(x.id)} label={x.t} onClick={() => toggle('problems', x.id)} />)}</div>
              <label className="mt-4 block"><span className="label">Oʻzingiz payqagan yana bir muammo</span>
                <input className="field" value={s.own} placeholder="Masalan: kelajakda kompyuterlar soni oshsa nima boʻladi?" onChange={e => { setS(p => ({ ...p, own: e.target.value })); setResult(null) }} /></label>
            </div>
          )}
          {step === 2 && (
            <div>
              <h3 className="text-lg font-bold">3. Qaysi qurilmalar va nechtadan kerak?</h3>
              <p className="mb-4 mt-1 text-slate-600">Portlarni sanang: 20 kompyuter + 2 printer + 1 server = <strong>23 ta</strong> qurilma, ustiga routerga ulanish.</p>
              <div className="grid gap-2 md:grid-cols-2">
                {DEVICES.map(x => {
                  const n = s.devices[x.id] ?? 0
                  const set = (v: number) => { setS(p => ({ ...p, devices: { ...p.devices, [x.id]: Math.max(0, Math.min(9, v)) } })); setResult(null) }
                  return (
                    <div key={x.id} className={cx('flex items-center gap-3 rounded-xl border px-4 py-2.5', n ? 'border-amber-500 bg-amber-50' : 'border-slate-200 bg-white')}>
                      <span className="flex-1 text-[0.97rem] text-navy-950">{x.t}</span>
                      <button type="button" onClick={() => set(n - 1)} disabled={!n} aria-label={`${x.t}: kamaytirish`} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-300 bg-white disabled:opacity-40"><Minus size={16} /></button>
                      <span className="w-6 text-center font-mono text-lg font-bold" aria-live="polite">{n}</span>
                      <button type="button" onClick={() => set(n + 1)} aria-label={`${x.t}: koʻpaytirish`} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-300 bg-white"><Plus size={16} /></button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <h3 className="text-lg font-bold">4. Qaysi topologiyani tanlaysiz?</h3>
              <p className="mb-4 mt-1 text-slate-600">«Barqaror» talabini eslang: bitta kabel yoki qurilma ishdan chiqsa nima boʻladi?</p>
              <div className="grid gap-2" role="radiogroup" aria-label="Topologiya">
                {TOPOS.map(x => (
                  <button key={x.id} type="button" role="radio" aria-checked={s.topo === x.id} onClick={() => { setS(p => ({ ...p, topo: x.id })); setResult(null) }}
                    className={cx('flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-[0.97rem] transition', s.topo === x.id ? 'border-amber-500 bg-amber-50 text-navy-950' : 'border-slate-200 bg-white hover:border-amber-400')}>
                    <span className={cx('grid h-5 w-5 flex-none place-items-center rounded-full border-2', s.topo === x.id ? 'border-amber-500' : 'border-slate-300')}>{s.topo === x.id && <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />}</span>{x.t}
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 4 && (
            <div>
              <h3 className="text-lg font-bold">5. IP manzillar va xavfsizlik</h3>
              <p className="mb-3 mt-1 font-semibold text-navy-950">Manzillar qanday beriladi?</p>
              <div className="grid gap-2" role="radiogroup" aria-label="IP berish usuli">
                {IPPLANS.map(x => (
                  <button key={x.id} type="button" role="radio" aria-checked={s.ip === x.id} onClick={() => { setS(p => ({ ...p, ip: x.id })); setResult(null) }}
                    className={cx('flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-[0.97rem] transition', s.ip === x.id ? 'border-amber-500 bg-amber-50 text-navy-950' : 'border-slate-200 bg-white hover:border-amber-400')}>
                    <span className={cx('grid h-5 w-5 flex-none place-items-center rounded-full border-2', s.ip === x.id ? 'border-amber-500' : 'border-slate-300')}>{s.ip === x.id && <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />}</span>{x.t}
                  </button>
                ))}
              </div>
              <p className="mb-3 mt-5 font-semibold text-navy-950">Qaysi himoya choralarini qoʻllaysiz?</p>
              <div className="grid gap-2 md:grid-cols-2">{MEASURES.map(x => <Check key={x.id} on={s.measures.includes(x.id)} label={x.t} onClick={() => toggle('measures', x.id)} />)}</div>
            </div>
          )}
          {step === 5 && (
            <div>
              <h3 className="text-lg font-bold">6. Yechimingizni izohlang</h3>
              <p className="mb-3 mt-1 text-slate-600">Nega aynan shu qurilmalar va shu topologiya? Kamida 40 soʻz bilan asoslang.</p>
              <textarea className="field min-h-[11rem]" value={s.explain} placeholder="Masalan: jami 23 ta qurilma bor, shuning uchun..." onChange={e => { setS(p => ({ ...p, explain: e.target.value })); setResult(null) }} />
              <p className="mt-1.5 text-sm text-slate-500" aria-live="polite">{s.explain.trim().split(/\s+/).filter(Boolean).length} soʻz</p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
            <Btn icon={ArrowLeft} disabled={step === 0} onClick={() => setStep(step - 1)}>Oldingi bosqich</Btn>
            {step < STEPS.length - 1
              ? <Btn variant="primary" onClick={() => setStep(step + 1)}>Keyingi bosqich <ArrowRight size={17} /></Btn>
              : <Btn variant="primary" icon={ClipboardCheck} onClick={evaluate}>Yechimni baholash</Btn>}
            {step < STEPS.length - 1 && <Btn variant="ghost" icon={ClipboardCheck} className="ml-auto" onClick={evaluate}>Hozir baholash</Btn>}
          </div>
        </div>

        {result && (
          <div className="anim-in mt-5 rounded-2xl border border-amber-300 bg-white p-5 shadow-lift sm:p-6" role="status" aria-live="polite">
            <div className="flex flex-wrap items-center gap-4">
              <div className="grid h-20 w-20 flex-none place-items-center rounded-2xl bg-navy-950 font-display text-2xl font-extrabold text-white">{total}</div>
              <div>
                <h3 className="text-xl font-bold">Natija: {total} / 100 ball</h3>
                <p className="text-slate-600">{total >= 86 ? 'Aʼlo — yechim toʻliq va asosli.' : total >= 71 ? 'Yaxshi — bir-ikki joyni kuchaytirish kerak.' : total >= 56 ? 'Qoniqarli — izohlarni oʻqib, yechimni qayta koʻrib chiqing.' : 'Yechim hali toʻliq emas — quyidagi tavsiyalar boʻyicha toʻldiring.'}</p>
              </div>
            </div>
            <ul className="mt-5 space-y-4">
              {result.map((c, i) => (
                <li key={i}>
                  <div className="flex items-center justify-between gap-3"><span className="font-display font-bold text-navy-950">{c.title}</span><span className="font-mono text-sm font-bold text-slate-700">{c.score} / {c.max}</span></div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100"><div className={cx('h-full rounded-full', c.score / c.max >= 0.8 ? 'bg-emerald-500' : c.score / c.max >= 0.5 ? 'bg-amber-500' : 'bg-rose-500')} style={{ width: (c.score / c.max) * 100 + '%' }} /></div>
                  <ul className="mt-2 space-y-1 text-[0.93rem] text-slate-600">{c.notes.map((n, k) => <li key={k}>— {n}</li>)}</ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Block>

      <Takeaway items={[
        'Muammoli taʼlimda oʻqituvchi javob bermaydi — savol beradi.',
        'Yaxshi muammo bir nechta toʻgʻri yechimga ega: baholanadigani — asos.',
        'Mezonlar oldindan maʼlum boʻlsa, talaba oʻz yechimini oʻzi tekshira oladi.',
      ]} />
    </>
  )
}
