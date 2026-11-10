import { Lock, Puzzle, Wifi } from 'lucide-react'
import {
  PageHeader, Goal, Block, Grid, Card, Callout, Mono, DataTable, LifeExample, Takeaway, MiniTask,
} from '../components/ui'

/* Qamrov halqalari: PAN ⊂ LAN ⊂ MAN ⊂ WAN. */
const RINGS = [
  { key: 'WAN', full: 'Wide Area Network', scope: 'viloyat, mamlakat, qitʼa', example: 'internet, bank filiallari tarmogʻi', r: 190, fill: '#DBEAFE', stroke: '#3B82F6' },
  { key: 'MAN', full: 'Metropolitan Area Network', scope: 'shahar miqyosi', example: 'shahar videokuzatuv tarmogʻi', r: 142, fill: '#EDE9FE', stroke: '#8B5CF6' },
  { key: 'LAN', full: 'Local Area Network', scope: 'xona, bino', example: 'maktab kompyuter xonasi, ofis tarmogʻi', r: 94, fill: '#CCFBF1', stroke: '#14B8A6' },
  { key: 'PAN', full: 'Personal Area Network', scope: '1–10 metr', example: 'telefon va simsiz quloqchin', r: 46, fill: '#FEF3C7', stroke: '#F59E0B' },
]

function CoverageDiagram() {
  const c = 200
  return (
    <figure className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
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
      <figcaption className="mt-5 border-t border-slate-100 pt-3 text-sm leading-relaxed text-slate-600">
        Har bir kattaroq tarmoq kichiklarini oʻz ichiga oladi: telefoningiz (PAN) maktab tarmogʻiga (LAN), u shahar tarmogʻiga (MAN), u esa internetga (WAN) ulanadi.
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
        lead={<>Tarmoqlar asosan <strong>hududiy qamrovi</strong> boʻyicha ajratiladi. Bu tasnif faqat masofani emas, balki tarmoqning <em>egasi va maqsadini</em> ham koʻrsatadi: uni kim quradi, kim boshqaradi va u kimga xizmat qiladi.</>}
      />

      <Goal
        items={[
          'PAN, LAN, MAN va WAN tarmoqlarini qamrovi, egasi va misoli boʻyicha farqlash',
          '«Internet», «Wi-Fi» va «tarmoq turi» tushunchalarini chalkashtirmaslik',
          'WLAN, VLAN va VPN nima uchun kerakligini va nimadan himoya qilmasligini tushuntirish',
        ]}
      />

      <Block tone="blue" title="Qamrov boʻyicha toʻrt tur" sub="Eng kichigidan eng kattasiga: shaxsiy, lokal, shahar va hududiy (global) tarmoq.">
        <CoverageDiagram />
        <div className="mt-4">
          <DataTable
            head={['Turi', 'Qamrov', 'Odatdagi tezlik', 'Kim boshqaradi', 'Misol']}
            rows={[
              [<Abbr name="PAN" full="Personal Area Network" />, '~1–10 metr', 'Oʻrtacha (bir necha Mbit/s)', 'Shaxsning oʻzi', 'Bluetooth quloqchin, simsiz sichqoncha, telefon va aqlli soat'],
              [<Abbr name="LAN" full="Local Area Network" />, 'Xona, bino, ~1 km gacha', 'Yuqori (1 Gbit/s va undan ortiq)', 'Tashkilot', 'Maktab kompyuter xonasi, ofis tarmogʻi'],
              [<Abbr name="MAN" full="Metropolitan Area Network" />, 'Shahar miqyosi', 'Yuqori (magistral kanallar)', 'Operator yoki shahar hokimiyati', 'Shahar videokuzatuv tarmogʻi, idoralararo aloqa'],
              [<Abbr name="WAN" full="Wide Area Network" />, 'Viloyat, mamlakat, qitʼa', 'Oʻzgaruvchan — kanalga bogʻliq', 'Bir yoki bir necha operator hamkorlikda', 'Internet, bank filiallari tarmogʻi'],
            ]}
          />
        </div>

        <Callout kind="info" title="Koʻp uchraydigan chalkashlik" className="mt-4">
          <p><strong>Internet — WAN turining bitta namunasi, uning nomi emas.</strong> Internet — eng katta WAN, lekin har qanday WAN internet emas: masalan, bankning filiallararo yopiq tarmogʻi ham WAN.</p>
          <p><em>Wi-Fi</em> esa tarmoq turi emas, balki lokal tarmoqqa ulanish <em>usuli</em> — simsiz texnologiya. «Wi-Fi tarmogʻi» iborasi kundalik tilda qulay, ammo texnik jihatdan <Mono>WLAN</Mono> deyish toʻgʻriroq.</p>
        </Callout>
      </Block>

      <Block
        tone="blue"
        title="Uch yaqin atama: WLAN, VLAN, VPN"
        sub="Nomlari oʻxshash, vazifalari esa butunlay boshqa. Eslab qolish uchun: W — wireless (simsiz), V — virtual (mantiqiy)."
      >
        <Grid cols={3}>
          <Card tone="teal" icon={Wifi} title="WLAN">
            Lokal tarmoqning simsiz koʻrinishi — IEEE 802.11 standartlari asosida ishlaydi. Maktabdagi Wi-Fi hududi shu turga kiradi.
          </Card>
          <Card tone="violet" icon={Puzzle} title="VLAN">
            Bitta jismoniy switch ichida mantiqiy jihatdan ajratilgan tarmoqlar. Segmentatsiyani kuchaytiradi, ammo oʻzi barcha tahdidlardan himoya qilmaydi: VLAN segmentlari orasidagi trafik uchun router yoki 3-qatlamli switch va tegishli firewall qoidalari kerak.
          </Card>
          <Card tone="amber" icon={Lock} title="VPN">
            Ochiq tarmoq ustida autentifikatsiya va shifrlashga asoslangan himoyalangan tunnel. VPN aloqa yoʻlini himoyalaydi, lekin ulangan qurilmani avtomatik ravishda barcha tahdidlardan xavfsiz qilmaydi.
          </Card>
        </Grid>
      </Block>

      <LifeExample>
        Bitta maktab misolida: oʻqituvchining telefoni va simsiz quloqchini — <strong>PAN</strong>. Informatika xonasidagi 15 ta kompyuter va printer — <strong>LAN</strong>, shu binodagi Wi-Fi hududi — <strong>WLAN</strong>. Shahardagi maktablarni taʼlim boshqarmasi bilan bogʻlovchi optik tarmoq — <strong>MAN</strong>. Elektron jurnal serveri boshqa shaharda joylashgan va unga internet orqali ulaniladi — bu <strong>WAN</strong>. Oʻquvchilar va buxgalteriya kompyuterlari bitta switchda <strong>VLAN</strong> bilan ajratilgan, direktor esa uydan maktab fayl serveriga <strong>VPN</strong> orqali kiradi.
      </LifeExample>

      <Takeaway
        items={[
          'PAN → LAN → MAN → WAN: qamrov kengaygan sari tarmoq egasi ham oʻzgaradi — shaxs, tashkilot, operator.',
          'Internet — eng katta WAN, lekin har qanday WAN internet emas.',
          'Wi-Fi — tarmoq turi emas, lokal tarmoqqa simsiz ulanish texnologiyasi; texnik nomi — WLAN.',
          'VLAN tarmoqni mantiqan boʻladi, VPN aloqa yoʻlini shifrlaydi — ikkalasi ham oʻz-oʻzidan toʻliq himoya bermaydi.',
        ]}
      />

      <MiniTask
        questions={[
          {
            q: 'Maktabning uch qavatli binosidagi barcha kompyuterlar, printerlar va Wi-Fi nuqtalari bitta tarmoqqa ulangan va uni maktabning oʻzi boshqaradi. Bu qaysi tur?',
            options: ['PAN', 'LAN', 'MAN', 'WAN'],
            correct: 1,
            explain: 'Bitta bino va bitta tashkilot boshqaruvi — lokal tarmoq (LAN) belgisi. Wi-Fi qismi uning simsiz koʻrinishi, yaʼni WLAN.',
          },
          {
            q: 'Bank Toshkentdagi bosh ofisini Samarqand va Buxorodagi filiallari bilan operatordan ijaraga olingan kanallar orqali bogʻladi. Bu tarmoqdan internetga chiqilmaydi. Qaysi fikr toʻgʻri?',
            options: [
              'Bu LAN, chunki tarmoq bitta tashkilotga tegishli',
              'Bu internet, chunki u shaharlarni bogʻlaydi',
              'Bu WAN, lekin internet emas',
              'Bu MAN, chunki shaharlar haqida gap ketyapti',
            ],
            correct: 2,
            explain: 'Shaharlararo qamrov — WAN. Lekin har qanday WAN internet emas: bu tashkilotning yopiq hududiy tarmogʻi. MAN esa bitta shahar miqyosi bilan cheklanadi.',
          },
          {
            q: 'Direktor bitta switchga ulangan oʻquvchilar va buxgalteriya kompyuterlarini yangi qurilma sotib olmasdan bir-biridan ajratmoqchi. Qaysi texnologiya mos keladi?',
            options: ['VLAN', 'VPN', 'WLAN', 'PAN'],
            correct: 0,
            explain: 'VLAN bitta jismoniy switchni mantiqan alohida tarmoqlarga boʻladi (buning uchun switch boshqariladigan boʻlishi kerak). VPN esa masofadan xavfsiz ulanish uchun, WLAN — simsiz lokal tarmoq.',
          },
        ]}
      />
    </>
  )
}
