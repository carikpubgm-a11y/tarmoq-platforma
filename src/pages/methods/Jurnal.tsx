import { useState } from 'react'
import { Columns2, Eye, EyeOff, PencilLine, Plus, Printer, RotateCcw, Trash2, Wand2 } from 'lucide-react'
import { Block, Btn, Callout, PageHeader, Takeaway, cx } from '../../components/ui'
import { saveResult, useStored } from '../../lib/storage'
import { MethodInfo, type MethodMeta } from './MethodInfo'

const META: MethodMeta = {
  goal: <>Talaba yangi bilimni <strong>avvalgi tasavvuri bilan yonma-yon</strong> qoʻyadi. Ikki ustun orasidagi farq — oʻrganishning oʻzi: nima toʻgʻrilandi, nima chuqurlashdi, nima butunlay yangi.</>,
  how: ['Dars boshida chap ustun toʻldiriladi: «Men bilgan maʼlumot»', 'Mavzu oʻrganiladi (nazariya, laboratoriya)', 'Dars oxirida oʻng ustun toʻldiriladi: «Yangi oʻrgangan maʼlumot»', 'Ikki ustun taqqoslanadi va xulosa yoziladi'],
  teacher: ['Tushunchalar roʻyxatini tayyorlaydi', 'Chap ustunni baholamaydi — u faqat boshlangʻich nuqta', 'Taqqoslash bosqichida xato tasavvurlarni muhokama qiladi'],
  student: ['Avvalgi bilimini halol yozadi', 'Yangi bilimni oʻz soʻzi bilan ifodalaydi', 'Fikri qanday oʻzgarganini izohlaydi'],
  example: <>Chap ustun: «Firewall — bu antivirus». Oʻng ustun: «Firewall trafikni qoidalar boʻyicha filtrlaydi; fayl ichidagi virusni tekshirmaydi». Farq yaqqol koʻrinadi va esda qoladi.</>,
  outcome: <>Talaba tushunchani oʻz soʻzi bilan izohlaydi, xato tasavvurini oʻzi topadi va refleksiya qiladi (metakognitiv koʻnikma).</>,
  criteria: ['Har bir tushuncha uchun ikkala ustun toʻldirilgan', 'Oʻng ustun koʻchirma emas — oʻz soʻzi bilan yozilgan', 'Yangi bilim avvalgisidan mazmunan boyroq', 'Yakuniy refleksiya yozilgan'],
}

interface Row { id: string; term: string; before: string; after: string }
interface State { rows: Row[]; reflection: string }
const row = (term: string): Row => ({ id: term.toLowerCase() + Math.random().toString(36).slice(2, 6), term, before: '', after: '' })
const S0: State = { rows: ['Firewall', 'VLAN', 'DHCP', 'VPN'].map(t => ({ id: t.toLowerCase(), term: t, before: '', after: '' })), reflection: '' }

const REF: Record<string, string> = {
  firewall: 'Firewall — tarmoqqa kiruvchi va chiquvchi trafikni qoidalar boʻyicha tekshiruvchi filtr. Xavfli ulanishlarni bloklaydi, lekin ruxsat etilgan kanal ichidagi hujumni (masalan, fishing) toʻxtatmaydi.',
  vlan: 'VLAN — bitta switch ichida tarmoqni mantiqiy qismlarga boʻlish usuli. Boʻlimlar bir-birining trafigini koʻrmaydi; VLAN lar orasida aloqa uchun router va firewall qoidalari kerak.',
  dhcp: 'DHCP — qurilmalarga IP manzil, maska, shlyuz va DNS ni avtomatik beruvchi xizmat (Discover → Offer → Request → Acknowledge). Qoʻlda sozlash va manzil ziddiyatining oldini oladi.',
  vpn: 'VPN — ochiq tarmoq ustida autentifikatsiya va shifrlashga asoslangan himoyalangan tunnel. Aloqa yoʻlini himoyalaydi, ammo qurilmani barcha tahdidlardan xavfsiz qilmaydi.',
}
const SAMPLE: State = {
  rows: [
    { id: 'firewall', term: 'Firewall', before: 'Firewall — bu antivirusga oʻxshagan dastur, viruslarni ushlaydi.', after: 'Firewall viruslarni emas, trafikni tekshiradi: qoidalar yuqoridan pastga oʻqiladi, birinchi mos kelgani ishlaydi, oxirida standart taqiq turadi. Fishingni toʻxtata olmaydi.' },
    { id: 'vlan', term: 'VLAN', before: 'Eshitganman, lekin nima ekanini bilmayman.', after: 'VLAN bitta switchni bir nechta mantiqiy tarmoqqa boʻladi. Talabalar va maʼmuriyat bitta qurilmaga ulansa ham bir-birini koʻrmaydi; ular orasida router kerak.' },
    { id: 'dhcp', term: 'DHCP', before: 'Wi-Fi ga ulanganda internet oʻzi ishlab ketadi.', after: 'Aslida DHCP serveri manzil, maska, shlyuz va DNS ni toʻrt qadamda beradi. Manzil ololmagan kompyuter 169.254.x.x manzilini oladi — bu diagnostika belgisi.' },
    { id: 'vpn', term: 'VPN', before: 'Bloklangan saytlarni ochish uchun ishlatiladi.', after: 'VPN ning asosiy vazifasi — ochiq tarmoqda shifrlangan tunnel qurish. Masofadan ishlaganda universitet tarmogʻiga xavfsiz ulanish uchun kerak.' },
  ],
  reflection: 'Eng koʻp oʻzgargani — firewall haqidagi fikrim: uni antivirus deb oʻylar edim. Endi ular turli qatlamlar ekanini va bir-birini almashtirmasligini tushundim.',
}
const words = (t: string) => t.trim().split(/\s+/).filter(Boolean).length

export default function Jurnal() {
  const [s, setS, reset] = useStored<State>('jurnal', S0)
  const [view, setView] = useState<'write' | 'compare'>('write')
  const [refs, setRefs] = useState(false)
  const [newTerm, setNewTerm] = useState('')
  const upd = (id: string, p: Partial<Row>) => setS(st => ({ ...st, rows: st.rows.map(r => (r.id === id ? { ...r, ...p } : r)) }))
  const complete = s.rows.filter(r => r.before.trim() && r.after.trim()).length

  function compare() {
    setView('compare')
    saveResult('jurnal', { score: complete, max: s.rows.length, label: 'Double-Entry Journal', detail: `${complete} / ${s.rows.length} tushuncha toʻliq` })
  }

  return (
    <>
      <PageHeader no="12.3" tone="amber" eyebrow="Pedagogik metod" title="Double-Entry Journal metodi"
        lead="Ikki ustunli jurnal: chapda — avval bilganim, oʻngda — bugun oʻrganganim. Oʻrtadagi farq oʻrganishni koʻrinadigan qiladi." />
      <MethodInfo m={META} />

      <Block title="Mashgʻulot: ikki ustunli jurnal" tone="amber" sub="Chap ustunni dars boshida, oʻng ustunni dars oxirida toʻldiring. Yozuvlar avtomatik saqlanadi.">
        <div className="no-print mb-4 flex flex-wrap items-center gap-2">
          <div className="inline-flex overflow-hidden rounded-xl border border-slate-300" role="group" aria-label="Koʻrinish">
            <button type="button" aria-pressed={view === 'write'} onClick={() => setView('write')} className={cx('inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold', view === 'write' ? 'bg-navy-950 text-white' : 'bg-white text-slate-700 hover:bg-slate-50')}><PencilLine size={16} /> Yozish</button>
            <button type="button" aria-pressed={view === 'compare'} onClick={compare} className={cx('inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold', view === 'compare' ? 'bg-navy-950 text-white' : 'bg-white text-slate-700 hover:bg-slate-50')}><Columns2 size={16} /> Taqqoslash</button>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 font-mono text-sm font-bold text-amber-900" role="status" aria-live="polite">{complete} / {s.rows.length} toʻliq</span>
          <Btn size="sm" icon={refs ? EyeOff : Eye} onClick={() => setRefs(r => !r)}>{refs ? 'Namunaviy izohlarni yashirish' : 'Namunaviy izohlarni koʻrsatish'}</Btn>
          <Btn size="sm" icon={Wand2} onClick={() => setS(SAMPLE)}>Namuna bilan toʻldirish</Btn>
          <Btn size="sm" icon={Printer} onClick={() => window.print()}>Chop etish</Btn>
          <Btn size="sm" variant="danger" icon={RotateCcw} onClick={() => { reset(); setView('write') }}>Tozalash</Btn>
        </div>

        {view === 'write' ? (
          <div className="space-y-4">
            <div className="hidden grid-cols-[9rem_1fr_1fr_2.5rem] gap-3 px-1 text-xs font-bold uppercase tracking-wider text-slate-500 md:grid">
              <span>Tushuncha</span><span>Men bilgan maʼlumot</span><span>Yangi oʻrgangan maʼlumot</span><span />
            </div>
            {s.rows.map(r => (
              <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
                <div className="grid gap-3 md:grid-cols-[9rem_1fr_1fr_2.5rem]">
                  <div className="font-display text-lg font-bold text-navy-950">{r.term}</div>
                  <label><span className="label md:sr-only">Men bilgan maʼlumot</span>
                    <textarea className="field min-h-[6.5rem] !border-blue-200 !bg-blue-50/50" value={r.before} placeholder="Darsdan oldin bu haqda nima bilardim?" onChange={e => upd(r.id, { before: e.target.value })} /></label>
                  <label><span className="label md:sr-only">Yangi oʻrgangan maʼlumot</span>
                    <textarea className="field min-h-[6.5rem] !border-emerald-200 !bg-emerald-50/50" value={r.after} placeholder="Bugun nimani yangi bildim yoki toʻgʻriladim?" onChange={e => upd(r.id, { after: e.target.value })} /></label>
                  <button type="button" onClick={() => setS(st => ({ ...st, rows: st.rows.filter(x => x.id !== r.id) }))} disabled={s.rows.length <= 1} aria-label={`«${r.term}» qatorini oʻchirish`}
                    className="no-print grid h-10 w-10 place-items-center self-start rounded-xl border border-slate-200 text-rose-600 hover:bg-rose-50 disabled:opacity-30"><Trash2 size={17} /></button>
                </div>
                {refs && REF[r.id] && <p className="anim-in mt-3 rounded-xl border-l-4 border-violet-400 bg-violet-50 px-4 py-3 text-[0.94rem] text-slate-700"><strong>Namunaviy izoh: </strong>{REF[r.id]}</p>}
              </div>
            ))}
            <form className="no-print flex flex-wrap gap-2" onSubmit={e => { e.preventDefault(); const t = newTerm.trim(); if (!t) return; setS(st => ({ ...st, rows: [...st.rows, row(t)] })); setNewTerm('') }}>
              <input className="field max-w-xs" value={newTerm} placeholder="Yangi tushuncha (masalan, NAT)" aria-label="Yangi tushuncha nomi" maxLength={24} onChange={e => setNewTerm(e.target.value)} />
              <Btn type="submit" icon={Plus} disabled={!newTerm.trim()}>Qator qoʻshish</Btn>
            </form>
          </div>
        ) : (
          <div className="anim-in space-y-4">
            {s.rows.map(r => {
              const b = words(r.before), a = words(r.after)
              const status = !r.before.trim() && !r.after.trim() ? 'boʻsh' : !r.after.trim() ? 'yangi bilim yozilmagan' : !r.before.trim() ? 'boshlangʻich bilim yozilmagan' : a > b ? 'bilim kengaygan' : 'qisqa — toʻldiring'
              const good = status === 'bilim kengaygan'
              return (
                <article key={r.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
                  <header className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-5 py-3">
                    <h3 className="mr-auto text-lg font-bold">{r.term}</h3>
                    <span className={cx('rounded-full px-3 py-1 text-xs font-bold', good ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600')}>{status}</span>
                    <span className="font-mono text-xs text-slate-500">{b} → {a} soʻz</span>
                  </header>
                  <div className="grid md:grid-cols-2">
                    <div className="border-b border-slate-100 bg-blue-50/50 p-5 md:border-b-0 md:border-r">
                      <div className="mb-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">Men bilgan maʼlumot</div>
                      <p className="whitespace-pre-wrap text-slate-700">{r.before.trim() || <span className="italic text-slate-400">yozilmagan</span>}</p>
                    </div>
                    <div className="bg-emerald-50/50 p-5">
                      <div className="mb-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">Yangi oʻrgangan maʼlumot</div>
                      <p className="whitespace-pre-wrap text-slate-700">{r.after.trim() || <span className="italic text-slate-400">yozilmagan</span>}</p>
                    </div>
                  </div>
                  {refs && REF[r.id] && <p className="border-t border-slate-100 bg-violet-50 px-5 py-3 text-[0.94rem] text-slate-700"><strong>Namunaviy izoh: </strong>{REF[r.id]}</p>}
                </article>
              )
            })}
            <label className="block rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <span className="mb-2 block font-display font-bold text-navy-950">Refleksiya: qaysi tushuncha haqidagi fikringiz eng koʻp oʻzgardi va nega?</span>
              <textarea className="field min-h-[6rem]" value={s.reflection} placeholder="Masalan: firewallni antivirus deb oʻylardim, endi esa..." onChange={e => setS(st => ({ ...st, reflection: e.target.value }))} />
            </label>
            <Callout kind={complete === s.rows.length ? 'success' : 'info'} title="Xulosa">
              {complete === s.rows.length
                ? <>Barcha {s.rows.length} ta tushuncha uchun ikkala ustun toʻldirilgan. Oʻqituvchi taqqoslash natijalarini auditoriya bilan muhokama qiladi: qaysi boshlangʻich tasavvurlar xato edi?</>
                : <>{s.rows.length - complete} ta tushunchada ustunlardan biri boʻsh. «Yozish» koʻrinishiga qaytib toʻldiring.</>}
            </Callout>
          </div>
        )}
      </Block>

      <Takeaway items={[
        'Chap ustun baholanmaydi — u oʻrganishning boshlangʻich nuqtasini koʻrsatadi.',
        'Oʻng ustun oʻz soʻzi bilan yozilsagina tushunish yuz bergan boʻladi.',
        'Taqqoslash bosqichi xato tasavvurlarni («firewall = antivirus») ochib beradi.',
      ]} />
    </>
  )
}
