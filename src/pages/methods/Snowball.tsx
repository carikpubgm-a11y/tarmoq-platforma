import { useMemo, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, CircleCheck, RotateCcw, Sparkles, User, Users, UsersRound, Megaphone, Wand2 } from 'lucide-react'
import { Block, Btn, Callout, PageHeader, Takeaway, cx } from '../../components/ui'
import { saveResult, useStored } from '../../lib/storage'
import { MethodInfo, Stepper, StageTimer, type MethodMeta } from './MethodInfo'

const QUESTION = 'Kompyuter tarmogʻida xavfsizlikni taʼminlash uchun eng muhim uchta chora qaysi?'

const META: MethodMeta = {
  goal: <>Har bir talabaning fikri eshitiladi va guruh qarori bosqichma-bosqich «qor uyumi» kabi yiriklashadi: <strong>1 → 2 → 4 kishi → butun auditoriya</strong>. Jim oʻtiradigan talaba ham ishtirok etadi.</>,
  how: ['Talaba savolga yakka oʻzi javob yozadi', 'Juftlikda ikki roʻyxat birlashtirilib, eng yaxshi uchta fikr tanlanadi', 'Ikki juftlik qoʻshilib, toʻrt kishilik guruh umumiy yechimni kelishadi', 'Guruh vakili yakuniy xulosani taqdim etadi'],
  teacher: ['Savolni aniq qoʻyadi va vaqtni boshqaradi', 'Bosqichdan bosqichga oʻtishni eʼlon qiladi', 'Guruh xulosalarini umumlashtiradi, toʻldiradi'],
  student: ['Avval mustaqil fikrlaydi', 'Sherigini tinglaydi, fikrini asoslaydi', 'Guruh bilan kelishib, ustuvorlikni belgilaydi'],
  example: <>«Xavfsizlik uchun eng muhim uchta chora» savoliga bir talaba «antivirus» deydi, sherigi «MFA» deb eʼtiroz bildiradi. Bahs jarayonida ikkalasi ham choralar <em>qatlam-qatlam</em> ishlashini tushunadi.</>,
  outcome: <>Talaba xavfsizlik choralarini nomlay oladi, ularni muhimligiga koʻra tartiblaydi va tanlovini asoslaydi; muloqot va kelishish koʻnikmasi rivojlanadi.</>,
  criteria: ['Yakka bosqichda uchta fikr yozilgan', 'Juftlik va guruhda tanlov amalga oshirilgan', 'Yakuniy uchlik kamida uchta turli himoya yoʻnalishini qamraydi', 'Guruh xulosasi yozma asoslangan'],
}

/* Ekspert yoʻnalishlari: yakuniy javob shu kalit soʻzlar boʻyicha solishtiriladi */
const EXPERT = [
  { name: 'Firewall va segmentatsiya', keys: ['firewall', 'fayrvol', 'vlan', 'segment', 'ekran', 'filtr'], why: 'Trafikni chegarada nazorat qiladi va muammoni bitta boʻlim ichida ushlab qoladi.' },
  { name: 'Kuchli autentifikatsiya (parol, MFA)', keys: ['parol', 'mfa', 'faktor', 'autentifikatsiya', '2fa', 'bosqichli'], why: 'Eng zaif boʻgʻin — hisob. MFA parol oʻgʻirlansa ham himoya qiladi.' },
  { name: 'Muntazam yangilash', keys: ['yangila', 'update', 'patch', 'yamoq'], why: 'Yangilanishlar maʼlum zaifliklarni yopadi.' },
  { name: 'Zaxira nusxa', keys: ['zaxira', 'backup', 'nusxa', '3-2-1', 'rezerv'], why: 'Ransomware va nosozlikdan keyin tiklanishning yagona kafolati.' },
  { name: 'Foydalanuvchilarni oʻqitish', keys: ['oʻqit', "o'qit", 'savodxon', 'fishing', 'trening', 'xabardor', 'ogoh'], why: 'Koʻp hujumlar texnikani emas, insonni nishonga oladi.' },
  { name: 'Shifrlash (HTTPS, WPA3, VPN)', keys: ['shifr', 'vpn', 'https', 'wpa'], why: 'Trafik ushlab olinsa ham oʻqib boʻlmaydi.' },
  { name: 'Monitoring va jurnal', keys: ['monitoring', 'jurnal', 'log', 'kuzat', 'nazorat'], why: 'Hodisani tez aniqlash zararni kamaytiradi.' },
  { name: 'Antivirus', keys: ['antivirus', 'virusdan'], why: 'Foydali, lekin oʻzi yetarli emas — bitta qatlam, xolos.' },
]

interface State { solo: string[]; partner: string[]; pair: string[]; other: string[]; group: string[]; conclusion: string }
const S0: State = { solo: ['', '', ''], partner: ['', '', ''], pair: [], other: ['', '', ''], group: [], conclusion: '' }
const SAMPLE: State = {
  solo: ['Antivirus oʻrnatish', 'Kuchli parol qoʻyish', 'Firewall sozlash'],
  partner: ['Ikki bosqichli tekshiruv (MFA)', 'Firewall sozlash', 'Maʼlumotlarni zaxiralash'],
  pair: ['Firewall sozlash', 'Ikki bosqichli tekshiruv (MFA)', 'Maʼlumotlarni zaxiralash'],
  other: ['Dasturlarni muntazam yangilash', 'Firewall va VLAN segmentatsiyasi', 'Xodimlarni fishingdan ogohlantirish'],
  group: ['Firewall va VLAN segmentatsiyasi', 'Ikki bosqichli tekshiruv (MFA)', 'Maʼlumotlarni zaxiralash'],
  conclusion: 'Biz uchta turli qatlamni tanladik: firewall va segmentatsiya tarmoqni tashqi hujumdan toʻsadi, MFA hisoblarni parol oʻgʻirlangan taqdirda ham himoya qiladi, zaxira nusxa esa hujum muvaffaqiyatli boʻlsa ham maʼlumotni tiklash imkonini beradi. Antivirus va yangilash ham kerak, lekin ular shu uchlikni toʻldiradi.',
}
const STEPS = ['Yakka oʻzi', 'Juftlikda', 'Toʻrt kishilik guruh', 'Taqdimot']
const norm = (x: string) => x.trim().toLowerCase().replace(/\s+/g, ' ')
const uniq = (list: string[]) => { const seen = new Set<string>(); return list.map(x => x.trim()).filter(x => x && !seen.has(norm(x)) && seen.add(norm(x))) }

function Three({ label, values, onChange, hint }: { label: string; values: string[]; onChange: (v: string[]) => void; hint: string }) {
  return (
    <fieldset>
      <legend className="label">{label}</legend>
      <div className="grid gap-2">
        {values.map((v, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 flex-none place-items-center rounded-xl bg-amber-500 font-mono text-sm font-bold text-navy-950">{i + 1}</span>
            <input className="field" value={v} placeholder={hint} aria-label={`${label}: ${i + 1}-chora`} onChange={e => onChange(values.map((x, k) => (k === i ? e.target.value : x)))} />
          </div>
        ))}
      </div>
    </fieldset>
  )
}

function Chooser({ pool, chosen, onChange }: { pool: string[]; chosen: string[]; onChange: (v: string[]) => void }) {
  const valid = chosen.filter(c => pool.some(p => norm(p) === norm(c)))
  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Fikrlar roʻyxati">
        {pool.map(p => {
          const on = valid.some(c => norm(c) === norm(p))
          return (
            <button key={p} type="button" aria-pressed={on} disabled={!on && valid.length >= 3}
              onClick={() => onChange(on ? valid.filter(c => norm(c) !== norm(p)) : [...valid, p])}
              className={cx('rounded-xl border px-3.5 py-2 text-left text-[0.95rem] font-medium transition disabled:opacity-40', on ? 'border-amber-500 bg-amber-500 text-navy-950 shadow-sm' : 'border-slate-300 bg-white text-slate-700 hover:border-amber-500')}>
              {on && '✓ '}{p}
            </button>
          )
        })}
        {!pool.length && <p className="text-slate-500">Avval yuqoridagi maydonlarni toʻldiring.</p>}
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-600" role="status" aria-live="polite">Tanlandi: {valid.length} / 3</p>
    </div>
  )
}

export default function Snowball() {
  const [s, setS, reset] = useStored<State>('snowball', S0)
  const [step, setStep] = useState(0)
  const [shown, setShown] = useState(false)

  const pairPool = useMemo(() => uniq([...s.solo, ...s.partner]), [s.solo, s.partner])
  const groupPool = useMemo(() => uniq([...s.pair, ...s.other]), [s.pair, s.other])
  const pair = s.pair.filter(c => pairPool.some(p => norm(p) === norm(c)))
  const group = s.group.filter(c => groupPool.some(p => norm(p) === norm(c)))
  const done = [s.solo.every(x => x.trim()), pair.length === 3, group.length === 3, s.conclusion.trim().split(/\s+/).filter(Boolean).length >= 15]
  const covered = EXPERT.filter(e => group.some(g => e.keys.some(k => norm(g).includes(k))))
  const stages = done.filter(Boolean).length

  function finish() {
    setShown(true)
    saveResult('snowball', { score: stages, max: 4, label: 'Snowball', detail: `${stages} / 4 bosqich, ${covered.length} ta himoya yoʻnalishi` })
  }
  const rank = (i: number, d: -1 | 1) => { const g = [...group]; const j = i + d; if (j < 0 || j >= g.length) return;[g[i], g[j]] = [g[j], g[i]]; setS(p => ({ ...p, group: g })) }

  return (
    <>
      <PageHeader no="12.2" tone="amber" eyebrow="Pedagogik metod" title="Snowball (qor uyumi) metodi"
        lead="Fikr yakka talabadan boshlanib, juftlik va guruh orqali yiriklashadi — xuddi dumalagan qor uyumi kabi." />
      <MethodInfo m={META} />

      <Block title="Mashgʻulot" tone="amber" sub="Auditoriyada bitta qurilmada birga toʻldiring: har bosqichda yangi fikrlar qoʻshiladi, soʻng eng muhimlari saralanadi.">
        <Callout kind="warn" title="Savol" className="mb-5"><p className="text-[1.08rem] font-semibold text-navy-950">«{QUESTION}»</p></Callout>

        {/* qor uyumi koʻrinishi */}
        <div className="mb-5 flex items-end justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:gap-6" aria-hidden="true">
          {[{ I: User, n: '1 kishi', k: s.solo.filter(x => x.trim()).length, sz: 52 }, { I: Users, n: '2 kishi', k: pairPool.length, sz: 68 }, { I: UsersRound, n: '4 kishi', k: groupPool.length, sz: 86 }, { I: Megaphone, n: 'Auditoriya', k: group.length, sz: 104 }].map((b, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={cx('grid place-items-center rounded-full border-2 transition-all', i === step ? 'border-amber-500 bg-amber-100 text-amber-800' : done[i] ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-400')} style={{ width: b.sz, height: b.sz }}>
                <b.I size={b.sz * 0.4} />
              </div>
              <span className="text-xs font-bold text-slate-600">{b.n}</span>
              <span className="font-mono text-xs text-slate-500">{b.k} fikr</span>
            </div>
          ))}
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <StageTimer seconds={[120, 180, 240, 120][step]} label="Bosqich taymeri" />
          <Btn size="sm" icon={Wand2} onClick={() => { setS(SAMPLE); setShown(false) }}>Namuna bilan toʻldirish</Btn>
          <Btn size="sm" variant="danger" icon={RotateCcw} onClick={() => { reset(); setStep(0); setShown(false) }}>Tozalash</Btn>
        </div>
        <Stepper steps={STEPS} current={step} onPick={setStep} done={done} />

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
          {step === 0 && (
            <div>
              <h3 className="text-lg font-bold">1. Mustaqil fikrlang (2 daqiqa)</h3>
              <p className="mb-4 mt-1 text-slate-600">Hech kim bilan maslahatlashmasdan, oʻzingiz eng muhim deb bilgan uchta chorani yozing.</p>
              <Three label="Mening uchta choram" values={s.solo} hint="Masalan: kuchli parol qoʻyish" onChange={v => setS(p => ({ ...p, solo: v }))} />
            </div>
          )}
          {step === 1 && (
            <div>
              <h3 className="text-lg font-bold">2. Juftlikda birlashtiring (3 daqiqa)</h3>
              <p className="mb-4 mt-1 text-slate-600">Sherigingizning uchta chorasini kiriting. Soʻng umumiy roʻyxatdan <strong>birgalikda eng muhim uchtasini</strong> tanlang.</p>
              <Three label="Sherigimning uchta chorasi" values={s.partner} hint="Sherigingiz aytgan chora" onChange={v => setS(p => ({ ...p, partner: v }))} />
              <p className="label mt-5">Birlashgan roʻyxat ({pairPool.length} ta fikr; takrorlanganlari bittaga birlashtirildi)</p>
              <Chooser pool={pairPool} chosen={s.pair} onChange={v => setS(p => ({ ...p, pair: v }))} />
            </div>
          )}
          {step === 2 && (
            <div>
              <h3 className="text-lg font-bold">3. Toʻrt kishilik guruhda kelishing (4 daqiqa)</h3>
              <p className="mb-4 mt-1 text-slate-600">Ikkinchi juftlik tanlagan uchta chorani kiriting. Guruh bilan bahslashib, <strong>yakuniy uchlikni</strong> belgilang.</p>
              <div className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900"><strong>Bizning juftlik tanlovi:</strong> {pair.length ? pair.join(' · ') : '— avval 2-bosqichda uchta fikrni tanlang'}</div>
              <Three label="Ikkinchi juftlikning uchta chorasi" values={s.other} hint="Qoʻshni juftlik tanlagan chora" onChange={v => setS(p => ({ ...p, other: v }))} />
              <p className="label mt-5">Guruhning umumiy roʻyxati ({groupPool.length} ta fikr)</p>
              <Chooser pool={groupPool} chosen={s.group} onChange={v => setS(p => ({ ...p, group: v }))} />
            </div>
          )}
          {step === 3 && (
            <div>
              <h3 className="text-lg font-bold">4. Yakuniy xulosani taqdim eting (2 daqiqa)</h3>
              <p className="mb-4 mt-1 text-slate-600">Uchta chorani muhimligi boʻyicha tartiblang va nega aynan shularni tanlaganingizni yozing.</p>
              {group.length ? (
                <ol className="mb-5 space-y-2">
                  {group.map((g, i) => (
                    <li key={g} className="flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5">
                      <span className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-navy-950 font-mono text-sm font-bold text-white">{i + 1}</span>
                      <span className="flex-1 font-semibold text-navy-950">{g}</span>
                      <button type="button" disabled={i === 0} onClick={() => rank(i, -1)} aria-label={`«${g}» ni yuqoriga koʻtarish`} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-300 bg-white disabled:opacity-30"><ArrowUp size={16} /></button>
                      <button type="button" disabled={i === group.length - 1} onClick={() => rank(i, 1)} aria-label={`«${g}» ni pastga tushirish`} className="grid h-9 w-9 place-items-center rounded-lg border border-slate-300 bg-white disabled:opacity-30"><ArrowDown size={16} /></button>
                    </li>
                  ))}
                </ol>
              ) : <p className="mb-5 rounded-xl bg-slate-50 p-3 text-slate-600">Avval 3-bosqichda yakuniy uchlikni tanlang.</p>}
              <label className="block"><span className="label">Guruh xulosasi (kamida 15 soʻz)</span>
                <textarea className="field min-h-[9rem]" value={s.conclusion} placeholder="Biz ... ni tanladik, chunki ..." onChange={e => setS(p => ({ ...p, conclusion: e.target.value }))} /></label>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
            <Btn icon={ArrowLeft} disabled={step === 0} onClick={() => setStep(step - 1)}>Oldingi bosqich</Btn>
            {step < 3
              ? <Btn variant="primary" onClick={() => setStep(step + 1)}>Keyingi bosqich <ArrowRight size={17} /></Btn>
              : <Btn variant="primary" icon={Sparkles} onClick={finish}>Natijani koʻrish</Btn>}
            {!done[step] && <span className="text-sm text-slate-500">{['Uchta maydonni ham toʻldiring.', 'Umumiy roʻyxatdan uchta fikrni tanlang.', 'Yakuniy uchlikni tanlang.', 'Xulosani yozing.'][step]}</span>}
          </div>
        </div>

        {shown && (
          <div className="anim-in mt-5 rounded-2xl border border-amber-300 bg-white p-5 shadow-lift sm:p-6" role="status" aria-live="polite">
            <h3 className="text-xl font-bold">Guruh natijasi</h3>
            <p className="mt-1 text-slate-600">Bajarilgan bosqichlar: <strong>{stages} / 4</strong>. Yakuniy uchlik <strong>{covered.length}</strong> ta himoya yoʻnalishini qamraydi{covered.length >= 3 ? ' — choralar bir-birini toʻldiradi (himoya chuqurligi).' : ' — uchta turli yoʻnalishni tanlasangiz, himoya qatlamli boʻladi.'}</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <div className="label">Guruhning yakuniy uchligi</div>
                {group.length ? <ol className="space-y-1.5">{group.map((g, i) => <li key={g} className="flex gap-2.5"><span className="font-mono font-bold text-amber-700">{i + 1}.</span><span className="font-semibold text-navy-950">{g}</span></li>)}</ol> : <p className="text-slate-500">Hali tanlanmagan.</p>}
                {s.conclusion.trim() && <blockquote className="mt-3 border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-[0.95rem] italic text-slate-700">{s.conclusion}</blockquote>}
              </div>
              <div>
                <div className="label">Mutaxassislar tavsiya etadigan yoʻnalishlar bilan solishtirish</div>
                <ul className="space-y-2">
                  {EXPERT.map(e => {
                    const on = covered.includes(e)
                    return (
                      <li key={e.name} className="flex gap-2.5">
                        <CircleCheck size={19} className={cx('mt-0.5 flex-none', on ? 'text-emerald-600' : 'text-slate-300')} />
                        <span><span className={cx('block text-[0.95rem] font-semibold', on ? 'text-navy-950' : 'text-slate-500')}>{e.name}{on && ' — guruh tanlagan'}</span><span className="block text-sm text-slate-500">{e.why}</span></span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
            <Callout kind="note" title="Muhokama uchun" className="mt-4">Yagona «toʻgʻri uchlik» yoʻq. Muhimi — guruh tanlovini asoslay olishi va choralar <strong>turli qatlamlarni</strong> (tarmoq, hisob, maʼlumot, inson) qamrashi.</Callout>
          </div>
        )}
      </Block>

      <Takeaway items={[
        'Snowball — pedagogik metod; uni qogʻozda ham, Padlet kabi vositada ham oʻtkazish mumkin.',
        'Har bir bosqichda fikrlar soni koʻpayadi, soʻng saralanadi — talaba ustuvorlikni belgilashni oʻrganadi.',
        'Xavfsizlikda bitta «eng yaxshi» chora yoʻq: choralar qatlam boʻlib ishlaydi.',
      ]} />
    </>
  )
}
