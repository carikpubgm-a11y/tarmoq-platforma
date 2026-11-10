import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { BrickWall, Cable, Cloud, Laptop, Monitor, Network, Printer, Router, Server, Wifi, type LucideIcon } from 'lucide-react'
import { Stage, cx } from '../components/ui'

/* Qurilma eksploreri: sxemadagi tugun yoki kartani bosganda
   qurilmaning vazifasi, ishlash qatlami va eng koʻp chalkashtiriladigan jihati ochiladi. */

const C = {
  bg: '#071023',
  fill: 'rgba(148,170,210,.14)',
  stroke: '#6682B5',
  accent: '#2DD4BF',
  amber: '#FBBF24',
  text: '#E4EAF5',
  sub: '#9AAED3',
}
const R = 26

interface Device {
  k: string
  name: string
  icon: LucideIcon
  /** Qisqa belgi: turi yoki ishlash qatlami */
  layer: string
  role: string
  body: ReactNode
  x: number
  y: number
  /** Sxemada yozuv joyi (standart — pastda) */
  side?: boolean
}

const DEV: Device[] = [
  {
    k: 'pc', name: 'Kompyuter', icon: Monitor, layer: 'oxirgi qurilma', x: 735, y: 122, side: true,
    role: 'Maʼlumot manbasi va qabul qiluvchisi',
    body: (
      <>
        <p>Tarmoqning maqsadi — oxirgi qurilmalarga xizmat qilish. Kompyuter, noutbuk, telefon, printer, kamera — bularning barchasi <strong>oxirgi qurilma</strong> (end device) hisoblanadi: maʼlumot ulardan chiqadi va ularga keladi.</p>
        <p>Har biriga tarmoqda <strong>manzil</strong> kerak. Manzil qoʻlda yoziladi yoki <Link to="/ip">DHCP</Link> orqali avtomatik beriladi.</p>
      </>
    ),
  },
  {
    k: 'laptop', name: 'Noutbuk', icon: Laptop, layer: 'oxirgi qurilma · simsiz', x: 850, y: 276,
    role: 'Koʻchma oxirgi qurilma',
    body: (
      <>
        <p>Noutbuk ham <strong>oxirgi qurilma</strong>, lekin u tarmoqqa odatda kabel bilan emas, Wi-Fi orqali — <strong>access point</strong> yordamida ulanadi. Shu sababli u binoning signal yetadigan istalgan joyida ishlay oladi.</p>
        <p><strong>Muhim:</strong> simsiz signal havoda tarqaladi, shuning uchun tarmoq WPA2 yoki WPA3 shifrlash va kuchli parol bilan himoyalanishi shart. Barqaror tezlik zarur boʻlganda (masalan, onlayn imtihonda) noutbukni kabel orqali ulash afzal.</p>
      </>
    ),
  },
  {
    k: 'server', name: 'Server', icon: Server, layer: 'xizmat koʻrsatuvchi', x: 735, y: 45, side: true,
    role: 'Umumiy xizmatlarni taqdim etadi',
    body: (
      <>
        <p>Server — <em>alohida qurilma turi emas, balki rol</em>. U fayl saqlash, veb-sayt, pochta, DNS yoki DHCP xizmatini koʻrsatadi.</p>
        <p>Maktab tarmogʻida odatda bitta fayl serveri boʻladi — oʻquv materiallari, hujjatlar va zaxira nusxalar shunda saqlanadi.</p>
      </>
    ),
  },
  {
    k: 'switch', name: 'Switch', icon: Network, layer: 'OSI 2-qatlam · MAC', x: 587, y: 150,
    role: 'Bitta tarmoq ichida ramkalarni uzatadi',
    body: (
      <>
        <p>Switch <strong>MAC-manzil</strong> boʻyicha ishlaydi va faqat <em>bitta</em> tarmoq ichida ramkalarni (frame) kerakli portga uzatadi. U qaysi MAC-manzil qaysi portda ekanini oʻzi oʻrganib, jadval tuzadi.</p>
        <p><strong>Muhim:</strong> oddiy (2-qatlamli) switch IP-manzilga qaramaydi va turli IP-tarmoqlarni bogʻlay olmaydi — bu routerning vazifasi.</p>
      </>
    ),
  },
  {
    k: 'router', name: 'Router', icon: Router, layer: 'OSI 3-qatlam · IP', x: 452, y: 150,
    role: 'Turli tarmoqlar orasida yoʻnaltiradi',
    body: (
      <>
        <p>Router <strong>IP-manzil</strong> boʻyicha ishlaydi va <em>turli</em> tarmoqlarni bogʻlaydi. U yoʻnaltirish jadvaliga (routing table) qarab, paketni manzilga olib boradigan eng maʼqul yoʻlni tanlaydi.</p>
        <p>Koʻpincha <strong>NAT</strong> ham shu yerda bajariladi — ichki (xususiy) manzillar bitta tashqi manzilga almashtiriladi.</p>
      </>
    ),
  },
  {
    k: 'ap', name: 'Access point', icon: Wifi, layer: 'simsiz ulanish nuqtasi', x: 735, y: 276,
    role: 'Simsiz mijozlarni simli tarmoqqa ulaydi',
    body: (
      <>
        <p>Access point simsiz qurilmalarni (telefon, noutbuk) <strong>simli tarmoqqa</strong> ulaydi. U yoʻnaltirish bilan shugʻullanmaydi.</p>
        <p><strong>Chalkashlik:</strong> uydagi «Wi-Fi router» — bu bitta qutiga joylashtirilgan router + switch + access point + firewall. Shuning uchun ularni koʻpincha bitta narsa deb oʻylashadi.</p>
      </>
    ),
  },
  {
    k: 'modem', name: 'Modem / ONT', icon: Cable, layer: 'operator liniyasi', x: 192, y: 150,
    role: 'Operator signalini Ethernet signaliga aylantiradi',
    body: (
      <>
        <p>Modem provayder liniyasidagi signalni (telefon liniyasi, koaksial kabel yoki optik tola) <strong>Ethernet</strong> signaliga aylantiradi. Optik liniyalarda bu qurilma <span className="font-mono text-teal-300">ONT</span> deb ataladi.</p>
        <p><strong>Chalkashlik:</strong> modem va router bir xil narsa emas. Modem signalni aylantiradi, router esa paketlarni yoʻnaltiradi.</p>
      </>
    ),
  },
  {
    k: 'fw', name: 'Firewall', icon: BrickWall, layer: 'chegara himoyasi', x: 322, y: 150,
    role: 'Trafikni qoidalar boʻyicha filtrlaydi',
    body: (
      <>
        <p>Firewall tarmoq chegarasida ham, ayrim qurilmalarning oʻzida ham joylashishi mumkin. U trafikni <strong>qoidalar</strong> boʻyicha tekshiradi: manba, nishon, port va protokol.</p>
        <p>Qoidalar odatda «birinchi mos kelgani qoʻllanadi» tartibida ishlaydi, oxirida esa <em>standart taqiq</em> turadi. Buni <Link to="/laboratoriya/firewall">firewall laboratoriyasida</Link> sinab koʻring.</p>
      </>
    ),
  },
  {
    k: 'printer', name: 'Printer', icon: Printer, layer: 'umumiy resurs', x: 735, y: 199, side: true,
    role: 'Tarmoq orqali boʻlishiladigan qurilma',
    body: (
      <>
        <p>Umumiy resursning eng oddiy misoli. Bitta printer butun sinfga xizmat qiladi — tarmoqning asosiy gʻoyasi aynan shu.</p>
        <p>Printerga odatda <strong>statik manzil</strong> beriladi. Aks holda DHCP unga boshqa manzil berib qoʻyishi va kompyuterlar printerni «yoʻqotib qoʻyishi» mumkin.</p>
      </>
    ),
  },
]

const NET = { x: 62, y: 150 }

/** Sxemadagi aloqalar: [boshi, oxiri, simsiz]. «net» — Internet (tanlanmaydigan tugun). */
const LINKS: [string, string, boolean?][] = [
  ['net', 'modem'], ['modem', 'fw'], ['fw', 'router'], ['router', 'switch'],
  ['switch', 'server'], ['switch', 'pc'], ['switch', 'printer'], ['switch', 'ap'],
  ['ap', 'laptop', true],
]

const POS: Record<string, { x: number; y: number }> = {
  net: NET,
  ...Object.fromEntries(DEV.map(d => [d.k, { x: d.x, y: d.y }])),
}

export default function DeviceExplorer() {
  const uid = useId()
  const [cur, setCur] = useState('switch')
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const d = DEV.find(x => x.k === cur) ?? DEV[0]
  const DIcon = d.icon

  function onTabKey(e: KeyboardEvent<HTMLButtonElement>, idx: number) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return
    e.preventDefault()
    const last = DEV.length - 1
    const next = e.key === 'Home' ? 0 : e.key === 'End' ? last : (idx + (e.key === 'ArrowRight' ? 1 : -1) + DEV.length) % DEV.length
    setCur(DEV[next].k)
    tabRefs.current[next]?.focus()
  }

  return (
    <Stage
      title="Qurilma eksploreri"
      badge={`${DEV.length} qurilma · ${d.name}`}
      hint={<>Maktab tarmogʻini loyihalashda shu qurilmalarning deyarli barchasi kerak boʻladi. Muhim savol: <strong>qaysi biri qaysi vazifani bajaradi?</strong> Sxemadagi qurilmani yoki pastdagi kartani bosing.</>}
    >
      <div className="mx-auto max-w-[70rem]">
        <div className="overflow-x-auto rounded-xl border border-navy-800 bg-navy-900/40">
          <div className="min-w-[640px]">
            <svg viewBox="0 0 900 344" className="h-auto w-full" role="group" aria-label="Qurilmalarning tarmoqdagi oʻrni: internetdan oxirgi qurilmalargacha">
              <g aria-hidden="true">
                <text x={127} y={98} fill={C.sub} fontSize={13} textAnchor="middle">tashqi tarmoq</text>
                <text x={322} y={98} fill={C.sub} fontSize={13} textAnchor="middle">chegara</text>
                <text x={519} y={98} fill={C.sub} fontSize={13} textAnchor="middle">ichki (lokal) tarmoq</text>
                <text x={792} y={264} fill={C.amber} fontSize={12.5} textAnchor="middle">Wi-Fi</text>
              </g>

              {/* Aloqalar */}
              {LINKS.map(([a, b, wireless]) => {
                const on = a === cur || b === cur
                return (
                  <line key={a + b} x1={POS[a].x} y1={POS[a].y} x2={POS[b].x} y2={POS[b].y}
                    stroke={on ? C.accent : wireless ? C.amber : C.stroke}
                    strokeWidth={on ? 3.2 : 2.2} strokeLinecap="round"
                    strokeDasharray={wireless ? '3 8' : undefined} aria-hidden="true" />
                )
              })}

              {/* Internet — tanlanmaydi */}
              <g aria-hidden="true">
                <circle cx={NET.x} cy={NET.y} r={R} fill={C.bg} />
                <circle cx={NET.x} cy={NET.y} r={R} fill="none" stroke={C.stroke} strokeWidth={1.6} strokeDasharray="4 6" />
                <Cloud x={NET.x - 12} y={NET.y - 12} size={24} color={C.sub} strokeWidth={1.8} />
                <text x={NET.x} y={NET.y + R + 20} fill={C.sub} fontSize={14} fontWeight={600} textAnchor="middle">Internet</text>
              </g>

              {/* Qurilmalar */}
              {DEV.map(x => {
                const on = x.k === cur
                const Icon = x.icon
                return (
                  <g key={x.k} role="button" tabIndex={0} aria-pressed={on} aria-label={`${x.name}: ${x.role}`}
                    onClick={() => setCur(x.k)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCur(x.k) } }}
                    className="group cursor-pointer" style={{ outline: 'none' }}>
                    <circle cx={x.x} cy={x.y} r={R + 8} fill="none" stroke={C.text} strokeWidth={2} strokeDasharray="4 5"
                      opacity={0} className="group-focus-visible:opacity-100" />
                    <circle cx={x.x} cy={x.y} r={R} fill={C.bg} />
                    <circle cx={x.x} cy={x.y} r={R}
                      fill={on ? 'rgba(45,212,191,.2)' : C.fill}
                      stroke={on ? C.accent : C.stroke} strokeWidth={on ? 2.8 : 1.8}
                      className="transition-colors group-hover:stroke-[#2DD4BF]" />
                    <Icon x={x.x - 12} y={x.y - 12} size={24} color={on ? C.accent : C.text} strokeWidth={1.8} aria-hidden="true" />
                    {x.side
                      ? <text x={x.x + R + 11} y={x.y + 5} fill={on ? C.accent : C.text} fontSize={14} fontWeight={600}>{x.name}</text>
                      : <text x={x.x} y={x.y + R + 20} fill={on ? C.accent : C.text} fontSize={14} fontWeight={600} textAnchor="middle">{x.name}</text>}
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div role="tablist" aria-label="Qurilmani tanlash" className="grid grid-cols-2 content-start gap-2 sm:grid-cols-3">
            {DEV.map((x, i) => {
              const on = x.k === cur
              const Icon = x.icon
              return (
                <button key={x.k} ref={el => { tabRefs.current[i] = el }} type="button" role="tab"
                  id={`${uid}tab-${x.k}`} aria-selected={on} aria-controls={`${uid}panel`} tabIndex={on ? 0 : -1}
                  onClick={() => setCur(x.k)} onKeyDown={e => onTabKey(e, i)}
                  className={cx('flex flex-col items-start rounded-xl border px-3 py-3 text-left transition',
                    on ? 'border-teal-400 bg-teal-500/15' : 'border-navy-700 bg-navy-900 hover:border-teal-400')}>
                  <Icon size={20} className={on ? 'text-teal-300' : 'text-navy-300'} aria-hidden="true" />
                  <span className="mt-1.5 block text-[0.95rem] font-bold leading-tight text-white">{x.name}</span>
                  <span className="mt-0.5 block font-mono text-[0.7rem] leading-snug text-navy-300">{x.layer}</span>
                </button>
              )
            })}
          </div>

          <div role="tabpanel" id={`${uid}panel`} aria-labelledby={`${uid}tab-${d.k}`} aria-live="polite"
            className="rounded-xl border border-navy-700 bg-navy-900/70 p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-teal-500 text-navy-950"><DIcon size={22} aria-hidden="true" /></span>
              <div className="min-w-0">
                <h4 className="text-lg font-bold leading-tight !text-white">{d.name}</h4>
                <p className="mt-0.5 font-mono text-xs text-teal-300">{d.layer}</p>
              </div>
            </div>
            <p className="mt-3 text-[0.95rem] font-semibold text-amber-300">{d.role}</p>
            <div className="mt-2 space-y-3 text-[0.96rem] leading-relaxed text-navy-100">{d.body}</div>
          </div>
        </div>
      </div>
    </Stage>
  )
}
