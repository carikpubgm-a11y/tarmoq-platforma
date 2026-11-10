import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, BrickWall, Cable, Cloud, Hash, MessageCircleQuestion, Mic, Monitor, Network, Printer, RotateCcw, Router, Send, ShieldCheck, ShieldX, type LucideIcon } from 'lucide-react'
import { Block, Btn, PageHeader, Stage, Takeaway, cx } from '../../components/ui'
import { saveResult } from '../../lib/storage'
import { MethodInfo, Stepper, type MethodMeta } from './MethodInfo'

const META: MethodMeta = {
  goal: <>Mavhum jarayonni <strong>koʻz oldida</strong> sodir qilish: oʻqituvchi ekranda tarmoqni bosqichma-bosqich quradi, har qadamda toʻxtab savol beradi. Oʻquvchi «qanday» va «nima uchun»ni bir vaqtda koʻradi.</>,
  how: ['Oʻqituvchi qurilmani tanlab, vazifasini koʻrsatadi', 'Qurilmalarni ketma-ket ulaydi', 'IP manzillarni sozlaydi', 'Paket yuborib, yoʻlini kuzatadi', 'Firewall orqali xavfsizlikni tekshiradi'],
  teacher: ['Har qadamdan oldin «nima boʻladi deb oʻylaysiz?» deb soʻraydi', 'Qadamni bajaradi va qisqa izohlaydi', 'Bitta narsani ataylab notoʻgʻri qilib, xatoni birga topadi'],
  student: ['Bashorat qiladi, soʻng natija bilan solishtiradi', 'Kuzatganini daftarga qayd etadi', 'Xuddi shu ketma-ketlikni laboratoriyada mustaqil takrorlaydi'],
  example: <>Oʻqituvchi kompyuterlarni switchga ulab boʻlgach soʻraydi: «Endi Internet ishlaydimi?» Oʻquvchilar «ha» deydi. Paket yuboriladi — yoʻq, chunki router hali ulanmagan. Shu lahza qoidadan koʻra yaxshiroq esda qoladi.</>,
  outcome: <>Oʻquvchi tarmoqni qurish ketma-ketligini (qurilma → ulash → IP → tekshirish → himoya) aytib bera oladi va har bir qadamning sababini tushuntiradi.</>,
  criteria: ['Namoyishning besh qadami toʻliq koʻrsatilgan', 'Har qadamda auditoriyaga savol berilgan', 'Oʻquvchilar ketma-ketlikni mustaqil takrorlay oladi'],
}

type NodeId = 'net' | 'rtr' | 'fw' | 'sw' | 'pc1' | 'pc2' | 'pc3' | 'prn'
const NODES: Record<NodeId, { x: number; y: number; label: string; icon: LucideIcon; color: string; role: string }> = {
  net: { x: 450, y: 46, label: 'Internet', icon: Cloud, color: '#93C5FD', role: 'Tashqi tarmoq. Unga faqat router orqali chiqiladi.' },
  rtr: { x: 450, y: 128, label: 'Router', icon: Router, color: '#60A5FA', role: 'Lokal tarmoqni Internet bilan bogʻlaydi. Kompyuterlar uchun shlyuz (gateway). 3-qatlamda, IP manzil boʻyicha ishlaydi.' },
  fw: { x: 450, y: 210, label: 'Firewall', icon: BrickWall, color: '#FB923C', role: 'Trafikni qoidalar boʻyicha oʻtkazadi yoki toʻxtatadi. Tarmoq chegarasida turadi.' },
  sw: { x: 450, y: 292, label: 'Switch', icon: Network, color: '#2DD4BF', role: 'Kompyuterlarni lokal tarmoqqa birlashtiradi. 2-qatlamda, MAC manzil boʻyicha ishlaydi; IP ga qaramaydi.' },
  pc1: { x: 170, y: 384, label: 'PC1', icon: Monitor, color: '#93C5FD', role: 'Oxirgi qurilma — foydalanuvchining ish joyi. Unga IP manzil, maska va shlyuz kerak.' },
  pc2: { x: 356, y: 384, label: 'PC2', icon: Monitor, color: '#93C5FD', role: 'Oxirgi qurilma. PC1 bilan bitta switchga ulangani uchun ular bir xil tarmoqda.' },
  pc3: { x: 544, y: 384, label: 'PC3', icon: Monitor, color: '#93C5FD', role: 'Oxirgi qurilma. Manzilni DHCP orqali avtomatik oladi.' },
  prn: { x: 730, y: 384, label: 'Printer', icon: Printer, color: '#FCD34D', role: 'Umumiy resurs: bitta printer hamma uchun. Manzili oʻzgarmasligi uchun statik IP beriladi.' },
}
const LINKS: { a: NodeId; b: NodeId; note: string }[] = [
  { a: 'pc1', b: 'sw', note: 'PC1 switchga alohida kabel bilan ulandi.' },
  { a: 'pc2', b: 'sw', note: 'PC2 ulandi. Endi PC1 va PC2 bir-birini «koʻra» oladi — bu allaqachon lokal tarmoq.' },
  { a: 'pc3', b: 'sw', note: 'PC3 ulandi. Har bir kompyuter markazga alohida kabel bilan — bu yulduz topologiyasi.' },
  { a: 'prn', b: 'sw', note: 'Printer ham switchga ulandi: endi u barcha kompyuterlar uchun umumiy.' },
  { a: 'sw', b: 'fw', note: 'Switch firewallga ulandi: tashqariga ketadigan barcha trafik tekshiruvdan oʻtadi.' },
  { a: 'fw', b: 'rtr', note: 'Firewall routerga ulandi. Router — lokal tarmoqning chiqish eshigi.' },
  { a: 'rtr', b: 'net', note: 'Router provayder liniyasiga ulandi. Endi lokal tarmoqdan Internetga yoʻl bor.' },
]
const IPS: { id: NodeId; ip: string; note: string }[] = [
  { id: 'rtr', ip: '192.168.1.1', note: 'Routerga 192.168.1.1 berildi — bu manzil barcha kompyuterlar uchun shlyuz boʻladi.' },
  { id: 'pc1', ip: '192.168.1.10', note: 'PC1 manzilni DHCP dan avtomatik oldi: 192.168.1.10, maska 255.255.255.0, shlyuz 192.168.1.1.' },
  { id: 'pc2', ip: '192.168.1.11', note: 'PC2 navbatdagi boʻsh manzilni oldi: 192.168.1.11.' },
  { id: 'pc3', ip: '192.168.1.12', note: 'PC3 ham DHCP orqali sozlandi: 192.168.1.12.' },
  { id: 'prn', ip: '192.168.1.50', note: 'Printerga statik manzil yozildi: 192.168.1.50. U oʻzgarmaydi, shuning uchun kompyuterlar printerni doim topadi.' },
]
const SENDS: { key: string; label: string; path: NodeId[]; ok: boolean; note: string }[] = [
  { key: 'pc', label: 'PC1 → PC2', path: ['pc1', 'sw', 'pc2'], ok: true, note: 'Ikkalasi bir xil tarmoqda. Switch ramkani MAC-jadval boʻyicha toʻgʻridan-toʻgʻri PC2 portiga yubordi — router ishtirok etmadi.' },
  { key: 'prn', label: 'PC1 → Printer', path: ['pc1', 'sw', 'prn'], ok: true, note: 'Chop etish topshirigʻi printerning statik manziliga yetib bordi. Bitta printer — butun xona uchun.' },
  { key: 'net', label: 'PC1 → Internet', path: ['pc1', 'sw', 'fw', 'rtr', 'net'], ok: true, note: 'Manzil boshqa tarmoqda — PC1 paketni shlyuzga yubordi. Firewall ruxsat berdi, router uni Internetga yoʻnaltirdi (NAT bilan).' },
]
const FW: { key: string; label: string; path: NodeId[]; ok: boolean; note: string }[] = [
  { key: 'https', label: 'Ichkaridan HTTPS soʻrovi', path: ['pc1', 'sw', 'fw', 'rtr', 'net'], ok: true, note: 'RUXSAT: «LAN dan Internetga 443-port» qoidasiga mos keldi. Paket oʻtdi.' },
  { key: 'ssh', label: 'Tashqaridan SSH urinishi', path: ['net', 'rtr', 'fw'], ok: false, note: 'TAQIQ: Internetdan ichki tarmoqqa kiruvchi ulanish uchun ruxsat qoidasi yoʻq — standart taqiq ishladi. Paket firewallda toʻxtadi.' },
]

const STEPS = [
  { title: 'Qurilmalar', lead: 'Avval sahnadagi qurilmalar bilan tanishamiz. Qurilmani bosing — vazifasi chiqadi.', ask: 'Bu qurilmalardan qaysi biri kompyuterlarni bir-biriga ulaydi, qaysi biri Internetga olib chiqadi?', say: 'Hali hech narsa ulanmagan. Har bir qurilma bitta ishni bajaradi: switch — ichkarida, router — tarmoqlar orasida, firewall — chegarada.' },
  { title: 'Ulash', lead: 'Qurilmalarni ketma-ket ulaymiz: avval lokal tarmoq, keyin tashqi dunyo.', ask: 'Avval nimani nimaga ulaymiz? Nega kompyuterlarni toʻgʻridan-toʻgʻri routerga ulamaymiz?', say: 'Tartib muhim: kompyuterlar → switch, soʻng switch → firewall → router → Internet. Switchda portlar koʻp, routerda esa kam.' },
  { title: 'IP sozlash', lead: 'Kabel ulangani yetarli emas — har bir qurilmaga manzil kerak.', ask: 'Kompyuter tarmoqda qanday topiladi? Printerga nega alohida usulda manzil beramiz?', say: 'Kompyuterlar manzilni DHCP dan avtomatik oladi. Printer va routerga esa oʻzgarmaydigan (statik) manzil beriladi.' },
  { title: 'Paket uzatish', lead: 'Tarmoq tayyor. Endi paket yuborib, uning yoʻlini kuzatamiz.', ask: 'PC1 dan PC2 ga yuborilgan paket router orqali oʻtadimi?', say: 'Bir xil tarmoq ichida paket faqat switch orqali oʻtadi. Internetga esa shlyuz — router orqali chiqadi.' },
  { title: 'Firewall', lead: 'Oxirida xavfsizlikni tekshiramiz: ruxsat etilgan va bloklangan trafik.', ask: 'Tashqaridan kimdir ichki kompyuterga ulanmoqchi boʻlsa, nima sodir boʻlishi kerak?', say: 'Firewall ichkaridan chiqayotgan veb-soʻrovni oʻtkazadi, tashqaridan kelayotgan ruxsatsiz ulanishni esa toʻxtatadi.' },
]

export default function Namoyish() {
  const [step, setStep] = useState(0)
  const [picked, setPicked] = useState<NodeId | null>(null)
  const [seen, setSeen] = useState<NodeId[]>([])
  const [linkN, setLinkN] = useState(0)
  const [ipN, setIpN] = useState(0)
  const [sent, setSent] = useState<string[]>([])
  const [anim, setAnim] = useState<{ path: NodeId[]; i: number; ok: boolean; note: string } | null>(null)
  const [speech, setSpeech] = useState(false)

  const links = step === 0 ? 0 : step === 1 ? linkN : LINKS.length
  const ips = step < 2 ? 0 : step === 2 ? ipN : IPS.length
  const done = [seen.length >= 3, linkN === LINKS.length, ipN === IPS.length, SENDS.some(x => sent.includes(x.key)), FW.every(x => sent.includes(x.key))]
  const score = done.filter(Boolean).length
  const animDone = !!anim && anim.i >= anim.path.length - 1

  useEffect(() => {
    if (!anim || animDone) return
    const t = setTimeout(() => setAnim(a => (a ? { ...a, i: a.i + 1 } : a)), 600)
    return () => clearTimeout(t)
  }, [anim, animDone])
  useEffect(() => { if (score > 0) saveResult('namoyish', { score, max: 5, label: 'Namoyish', detail: `${score} / 5 qadam koʻrsatildi` }) }, [score])
  useEffect(() => { setAnim(null); setSpeech(false); setPicked(null) }, [step])

  function fire(x: { key: string; path: NodeId[]; ok: boolean; note: string }) {
    setAnim({ path: x.path, i: 0, ok: x.ok, note: x.note })
    setSent(s => (s.includes(x.key) ? s : [...s, x.key]))
  }
  function restart() { setStep(0); setPicked(null); setSeen([]); setLinkN(0); setIpN(0); setSent([]); setAnim(null) }

  const hot = new Set<string>()
  if (anim) for (let k = 0; k < anim.i; k++) hot.add(anim.path[k] + anim.path[k + 1]).add(anim.path[k + 1] + anim.path[k])
  const at = anim ? NODES[anim.path[Math.min(anim.i, anim.path.length - 1)]] : null
  const note = step === 0 ? (picked ? NODES[picked].role : 'Qurilmani bosing — uning vazifasi shu yerda chiqadi.')
    : step === 1 ? (linkN ? LINKS[linkN - 1].note : '«Keyingi kabelni ulash» tugmasini bosing.')
    : step === 2 ? (ipN ? IPS[ipN - 1].note : '«Keyingi manzilni berish» tugmasini bosing.')
    : anim ? (animDone ? anim.note : 'Paket yoʻlda…') : 'Yuborish uchun quyidagi tugmalardan birini bosing.'

  return (
    <>
      <PageHeader no="12.4" tone="amber" eyebrow="Pedagogik metod" title="Namoyish metodi"
        lead="Oʻqituvchi tarmoqni ekranda besh qadamda quradi: har qadamda savol, harakat va qisqa izoh." />
      <MethodInfo m={META} />

      <Block title="Namoyish: tarmoqni birga quramiz" tone="amber" sub="Qadamlarni ketma-ket oʻting. Har qadamda avval savolni auditoriyaga bering, keyin tugmani bosing.">
        <Stepper steps={STEPS.map(s => s.title)} current={step} onPick={setStep} done={done} />

        <Stage title={`${step + 1}-qadam: ${STEPS[step].title}`} badge={`${score} / 5 qadam`}
          actions={<button type="button" onClick={restart} className="no-print inline-flex items-center gap-1.5 rounded-lg border border-navy-600 bg-navy-900 px-2.5 py-1.5 text-xs font-semibold text-rose-200 hover:border-rose-400"><RotateCcw size={14} /> Qayta boshlash</button>}>
          <p className="mb-3 text-[1.02rem] text-navy-100">{STEPS[step].lead}</p>
          <p className="mb-4 flex gap-2.5 rounded-xl border border-dashed border-teal-400/50 bg-teal-400/10 p-3 text-[0.98rem] text-white">
            <MessageCircleQuestion size={20} className="mt-0.5 flex-none text-teal-300" /><span><strong>Savol auditoriyaga:</strong> {STEPS[step].ask}</span>
          </p>

          <div className="overflow-x-auto rounded-xl border border-navy-700 bg-[#081229]">
            <svg viewBox="0 0 900 450" className="block h-auto w-full min-w-[640px]" role="group" aria-label="Namoyish sxemasi: Internet, router, firewall, switch, uchta kompyuter va printer">
              {LINKS.slice(0, links).map((l, i) => {
                const a = NODES[l.a], b = NODES[l.b]
                const on = hot.has(l.a + l.b)
                return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={on ? (anim?.ok ? '#2DD4BF' : '#FB7185') : '#6682B5'} strokeWidth={on ? 4 : 2.5} strokeLinecap="round" className={step === 1 && i === links - 1 ? 'anim-in' : undefined} />
              })}
              {(Object.keys(NODES) as NodeId[]).map(id => {
                const n = NODES[id], I = n.icon
                const on = picked === id
                const ip = IPS.slice(0, ips).find(x => x.id === id)?.ip
                const blocked = !!anim && animDone && !anim.ok && anim.path[anim.path.length - 1] === id
                const clickable = step === 0
                return (
                  <g key={id} {...(clickable ? { tabIndex: 0, role: 'button', 'aria-pressed': on, 'aria-label': `${n.label}: ${n.role}`, style: { cursor: 'pointer' } as const,
                    onClick: () => { setPicked(id); setSeen(s => (s.includes(id) ? s : [...s, id])) },
                    onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPicked(id); setSeen(s => (s.includes(id) ? s : [...s, id])) } } } : {})}>
                    <circle cx={n.x} cy={n.y} r="28" fill={blocked ? 'rgba(251,113,133,.18)' : 'rgba(148,170,210,.13)'} stroke={blocked ? '#FB7185' : on ? '#FBBF24' : n.color} strokeWidth={on || blocked ? 3.5 : 2} />
                    <I x={n.x - 13} y={n.y - 13} width={26} height={26} color={n.color} strokeWidth={1.8} aria-hidden="true" />
                    <text x={n.y < 320 ? n.x + 40 : n.x} y={n.y < 320 ? n.y + 1 : n.y + 46} textAnchor={n.y < 320 ? 'start' : 'middle'} fontSize="14.5" fontWeight="700" fill="#E4EAF5">{n.label}</text>
                    {ip && <text x={n.y < 320 ? n.x + 40 : n.x} y={n.y < 320 ? n.y + 18 : n.y + 62} textAnchor={n.y < 320 ? 'start' : 'middle'} fontSize="11.5" fontFamily="'JetBrains Mono Variable', ui-monospace, monospace" fill="#5EEAD4" className="anim-in">{ip}</text>}
                  </g>
                )
              })}
              {anim && at && (
                <g style={{ transform: `translate(${at.x - 44}px, ${at.y - 4}px)`, transition: 'transform .56s cubic-bezier(.4,0,.2,1)' }} pointerEvents="none">
                  <circle r="11" fill={animDone ? (anim.ok ? '#34D399' : '#FB7185') : '#FBBF24'} stroke="#081229" strokeWidth="3" />
                  <text y="4.5" textAnchor="middle" fontSize="12" fontWeight="800" fill="#081229">{animDone ? (anim.ok ? '✓' : '✕') : '✉'}</text>
                </g>
              )}
            </svg>
          </div>

          <p className={cx('mt-3 min-h-[3.2rem] rounded-xl border-l-4 px-4 py-3 text-[0.98rem] leading-relaxed', anim && animDone && !anim.ok ? 'border-rose-400 bg-rose-500/10 text-rose-100' : 'border-teal-400 bg-navy-900 text-navy-100')} role="status" aria-live="polite">{note}</p>

          <div className="no-print mt-4 flex flex-wrap items-center gap-2">
            {step === 1 && <Btn variant="primary" icon={Cable} disabled={linkN >= LINKS.length} onClick={() => setLinkN(n => n + 1)}>{linkN >= LINKS.length ? 'Barcha kabellar ulandi' : `Keyingi kabelni ulash (${linkN} / ${LINKS.length})`}</Btn>}
            {step === 2 && <Btn variant="primary" icon={Hash} disabled={ipN >= IPS.length} onClick={() => setIpN(n => n + 1)}>{ipN >= IPS.length ? 'Barcha manzillar berildi' : `Keyingi manzilni berish (${ipN} / ${IPS.length})`}</Btn>}
            {step === 3 && SENDS.map(x => <Btn key={x.key} variant={sent.includes(x.key) ? 'dark' : 'primary'} icon={Send} disabled={!!anim && !animDone} onClick={() => fire(x)}>{x.label}</Btn>)}
            {step === 4 && FW.map(x => <Btn key={x.key} variant={sent.includes(x.key) ? 'dark' : 'primary'} icon={x.ok ? ShieldCheck : ShieldX} disabled={!!anim && !animDone} onClick={() => fire(x)}>{x.label}</Btn>)}
            <Btn variant="dark" icon={Mic} aria-expanded={speech} onClick={() => setSpeech(v => !v)}>{speech ? 'Izohni yashirish' : 'Oʻqituvchi nima deydi?'}</Btn>
            <span className="ml-auto flex gap-2">
              <Btn variant="dark" icon={ArrowLeft} disabled={step === 0} onClick={() => setStep(step - 1)}>Oldingi</Btn>
              <Btn variant="dark" disabled={step === STEPS.length - 1} onClick={() => setStep(step + 1)}>Keyingi qadam <ArrowRight size={17} /></Btn>
            </span>
          </div>
          {speech && <p className="anim-in mt-3 rounded-xl border border-amber-400/50 bg-amber-400/10 p-3.5 text-[0.98rem] text-amber-100"><strong className="!text-amber-300">Oʻqituvchi: </strong>«{STEPS[step].say}»</p>}
        </Stage>
      </Block>

      <Takeaway items={[
        'Namoyish — shunchaki koʻrsatish emas: har qadamdan oldin savol, keyin harakat, soʻng izoh.',
        'Ketma-ketlik: qurilma → ulash → IP → tekshirish → himoya.',
        'Namoyishdan keyin oʻquvchi xuddi shu ishni laboratoriyada mustaqil bajaradi.',
      ]} />
    </>
  )
}
