import { Lock, Puzzle, Wifi } from 'lucide-react'
import {
  PageHeader, Goal, Block, Grid, Card, Callout, Mono, DataTable, LifeExample, Takeaway, MiniTask,
} from '../components/ui'

/* Qamrov halqalari: PAN ⊂ LAN ⊂ MAN ⊂ WAN. */
const RINGS = [
  { key: 'WAN', full: 'Wide Area Network', scope: 'mamlakat, dunyo', example: 'internet', r: 190, fill: '#DBEAFE', stroke: '#3B82F6' },
  { key: 'MAN', full: 'Metropolitan Area Network', scope: 'bitta shahar', example: 'shahar kameralari tarmogʻi', r: 142, fill: '#EDE9FE', stroke: '#8B5CF6' },
  { key: 'LAN', full: 'Local Area Network', scope: 'xona yoki bino', example: 'maktab kompyuter xonasi', r: 94, fill: '#CCFBF1', stroke: '#14B8A6' },
  { key: 'PAN', full: 'Personal Area Network', scope: '1–10 metr', example: 'telefon va simsiz quloqchin', r: 46, fill: '#FEF3C7', stroke: '#F59E0B' },
]

function CoverageDiagram() {
  const c = 200
  return (
    <figure className="rounded-3xl border-2 border-slate-200 bg-white p-5 shadow-card sm:p-6">
      <div className="grid items-center gap-6 md:grid-cols-[minmax(0,24rem)_1fr]">
        <svg viewBox="0 0 400 400" className="mx-auto h-auto w-full max-w-[24rem]" role="img"
          aria-label="Ichma-ich toʻrtta doira: eng ichkarida PAN, uni LAN, soʻng MAN va eng tashqarida WAN oʻrab turadi">
          {RINGS.map(ring => (
            <circle key={ring.key} cx={c} cy={c} r={ring.r} fill={ring.fill} stroke={ring.stroke} strokeWidth={2} />
          ))}
          {RINGS.map(ring => {
            const y = ring.key === 'PAN' ? c - 2 : c - ring.r + 23
            return (
              <g key={ring.key} textAnchor="middle">
                <text x={c} y={y} fontSize={18} fontWeight={800} fill="#0C1A35">{ring.key}</text>
                <text x={c} y={y + 15} fontSize={12.5} fill="#1D335F">{ring.scope}</text>
              </g>
            )
          })}
        </svg>
        <ul className="space-y-3">
          {RINGS.slice().reverse().map(ring => (
            <li key={ring.key} className="flex gap-3">
              <span className="mt-1 h-4 w-4 flex-none rounded-full border-2" style={{ background: ring.fill, borderColor: ring.stroke }} aria-hidden="true" />
              <div className="min-w-0">
                <div className="font-display font-bold text-navy-950">{ring.key} <span className="font-mono text-xs font-normal text-slate-500">{ring.full}</span></div>
                <div className="text-[0.95rem] text-slate-600">{ring.scope} — {ring.example}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="mt-5 border-t-2 border-slate-100 pt-3 text-[0.95rem] leading-relaxed text-slate-600">
        Kattasi kichigini oʻz ichiga oladi: telefoningiz (PAN) maktab tarmogʻiga (LAN), u shahar tarmogʻiga (MAN), u esa internetga (WAN) ulanadi.
      </figcaption>
    </figure>
  )
}

function Abbr({ name, full }: { name: string; full: string }) {
  return (
    <>
      <strong className="text-base">{name}</strong>
      <div className="font-mono text-xs text-slate-500">{full}</div>
    </>
  )
}

export default function Turlari() {
  return (
    <>
      <PageHeader
        no="04"
        tone="blue"
        eyebrow="Tasniflash"
        title="Tarmoq turlari"
        lead={<>Tarmoqlar <strong>qancha hududni qamrab olishi</strong> boʻyicha ajratiladi. Qamrov kattalashgani sari tarmoq egasi ham oʻzgaradi.</>}
      />

      <Goal
        items={[
          'PAN, LAN, MAN va WAN ni misol bilan farqlayman',
          '«Internet» va «Wi-Fi» soʻzlarini toʻgʻri ishlataman',
          'WLAN, VLAN va VPN nima uchun kerakligini aytaman',
        ]}
      />

      <Block tone="blue" title="Kichikdan kattagacha — toʻrt tur">
        <CoverageDiagram />
        <div className="mt-4">
          <DataTable
            head={['Turi', 'Qamrovi', 'Kim boshqaradi', 'Misol']}
            rows={[
              [<Abbr name="PAN" full="Personal Area Network" />, '1–10 metr', 'Oʻzingiz', '📱 Telefon va simsiz quloqchin'],
              [<Abbr name="LAN" full="Local Area Network" />, 'Xona yoki bino', 'Maktab, ofis', '🏫 Kompyuter xonasi'],
              [<Abbr name="MAN" full="Metropolitan Area Network" />, 'Bitta shahar', 'Operator yoki hokimiyat', '🏙️ Shahar kameralari tarmogʻi'],
              [<Abbr name="WAN" full="Wide Area Network" />, 'Mamlakat, dunyo', 'Bir necha operator', '🌍 Internet, bank filiallari'],
            ]}
          />
        </div>

        <Callout kind="info" title="Ikki koʻp uchraydigan xato" className="mt-4">
          <p><strong>1.</strong> Internet — WAN ning eng katta namunasi, lekin har qanday WAN internet emas. Bankning yopiq filial tarmogʻi ham WAN.</p>
          <p><strong>2.</strong> Wi-Fi — tarmoq turi emas, ulanish usuli. Toʻgʻri nomi — <Mono>WLAN</Mono>.</p>
        </Callout>
      </Block>

      <Block tone="blue" title="Uch oʻxshash soʻz: WLAN, VLAN, VPN" sub="Eslab qolish uchun: W — simsiz, V — virtual, yaʼni koʻrinmas.">
        <Grid cols={3}>
          <Card tone="teal" icon={Wifi} title="📶 WLAN — simsiz LAN">
            Lokal tarmoqning simsiz koʻrinishi. Maktabdagi Wi-Fi hududi — shu.
          </Card>
          <Card tone="violet" icon={Puzzle} title="🧩 VLAN — koʻrinmas devor">
            Bitta switch ichida tarmoqni guruhlarga boʻladi. Yangi qurilma sotib olish shart emas.
          </Card>
          <Card tone="amber" icon={Lock} title="🔒 VPN — himoyalangan tunnel">
            Internet ustida shifrlangan yoʻl ochadi. Uydan maktab serveriga xavfsiz kirish uchun.
          </Card>
        </Grid>
        <Callout kind="warn" title="Diqqat" className="mt-4">
          VLAN ham, VPN ham oʻz-oʻzidan hamma xavfdan qutqarmaydi. Parol va qoidalar ham kerak.
        </Callout>
      </Block>

      <LifeExample>
        Bitta maktabda hammasi bor: oʻqituvchining telefoni va quloqchini — <strong>PAN</strong>, informatika xonasidagi 15 kompyuter — <strong>LAN</strong>, binodagi Wi-Fi — <strong>WLAN</strong>. Shahar maktablarini bogʻlovchi optik kabel — <strong>MAN</strong>, boshqa shahardagi elektron jurnal serveriga ulanish — <strong>WAN</strong>. Oʻquvchilar va buxgalteriya bitta switchda <strong>VLAN</strong> bilan ajratilgan, direktor esa uydan <strong>VPN</strong> orqali kiradi.
      </LifeExample>

      <Takeaway
        items={[
          'PAN → LAN → MAN → WAN: qamrov kengaysa, egasi ham oʻzgaradi.',
          'Internet — eng katta WAN, lekin har qanday WAN internet emas.',
          'Wi-Fi — ulanish usuli; tarmoqning nomi — WLAN.',
          'VLAN tarmoqni boʻladi, VPN yoʻlni shifrlaydi.',
        ]}
      />

      <MiniTask
        questions={[
          {
            q: 'Maktab binosidagi barcha kompyuter, printer va Wi-Fi bitta tarmoqda, uni maktab oʻzi boshqaradi. Bu qaysi tur?',
            options: ['PAN', 'LAN', 'MAN', 'WAN'],
            correct: 1,
            explain: 'Bitta bino va bitta tashkilot — LAN belgisi. Uning simsiz qismi esa WLAN.',
          },
          {
            q: 'Bank Toshkent, Samarqand va Buxoro filiallarini ijara kanallar bilan bogʻladi. Internetga chiqilmaydi. Bu nima?',
            options: [
              'LAN — bitta tashkilotga tegishli',
              'Internet — shaharlarni bogʻlaydi',
              'WAN, lekin internet emas',
              'MAN — shaharlar haqida gap ketyapti',
            ],
            correct: 2,
            explain: 'Shaharlararo qamrov — WAN. Lekin bu yopiq tarmoq, internet emas. MAN esa bitta shahar bilan cheklanadi.',
          },
          {
            q: 'Direktor bitta switchdagi oʻquvchi va buxgalteriya kompyuterlarini yangi qurilma olmasdan ajratmoqchi. Nima mos?',
            options: ['VLAN', 'VPN', 'WLAN', 'PAN'],
            correct: 0,
            explain: 'VLAN bitta switch ichida koʻrinmas devor qoʻyadi. VPN — masofadan xavfsiz ulanish, WLAN — simsiz tarmoq.',
          },
        ]}
      />
    </>
  )
}
