import { Fragment, useId, useState } from 'react'
import { ArrowRight, Globe, House, Network, Router, Search } from 'lucide-react'
import {
  PageHeader, Goal, Block, Grid, Card, Callout, Pill, Term, Mono, DataTable, CheckList, StepList,
  LifeExample, Takeaway, Btn, Stage, cx,
} from '../components/ui'
import PacketFlow from '../sims/PacketFlow'

/* ------------------------------ IP manzil tuzilishi (vizual) ------------------------------ */
const OCTETS = [
  { v: '192', net: true },
  { v: '168', net: true },
  { v: '10', net: true },
  { v: '25', net: false },
]

function OctetDiagram() {
  return (
    <figure className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-start justify-center gap-x-2 gap-y-3 font-mono">
        {OCTETS.map((o, i) => (
          <Fragment key={i}>
            {i > 0 && <span className="pt-2.5 text-2xl font-bold text-slate-400" aria-hidden="true">.</span>}
            <div className={cx('min-w-[4.2rem] rounded-xl border px-3 py-2.5 text-center text-2xl font-bold', o.net ? 'border-teal-200 bg-teal-50 text-teal-800' : 'border-amber-200 bg-amber-50 text-amber-900')}>{o.v}</div>
          </Fragment>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <Pill tone="teal">🏘️ koʻcha nomi — tarmoq</Pill>
        <Pill tone="amber">🏠 uy raqami — qurilma</Pill>
      </div>
      <figcaption className="mt-4 border-t border-slate-100 pt-3 text-center text-[0.95rem] text-slate-600">
        Yashil qism — <strong>qaysi tarmoq</strong>. Sariq qism — <strong>shu tarmoqdagi qaysi qurilma</strong>.
      </figcaption>
    </figure>
  )
}

/* ------------------------------ «Manzilni tekshiramiz» ------------------------------ */
const PREFIXES = [24, 25, 26]

type Parsed = { ok: true; octets: number[] } | { ok: false; msg: string }

function parseIPv4(raw: string): Parsed {
  const s = raw.trim()
  if (!s) return { ok: false, msg: 'Manzilni yozing, masalan: 192.168.10.25.' }
  if (s.includes('/')) return { ok: false, msg: 'Faqat manzilni yozing — oʻlchamni tugmadan tanlang.' }
  const parts = s.split('.')
  if (parts.length !== 4) return { ok: false, msg: 'Manzil nuqta bilan ajratilgan 4 ta sondan iborat: 192.168.10.25.' }
  const octets: number[] = []
  for (let i = 0; i < 4; i++) {
    const part = parts[i]
    if (!/^\d{1,3}$/.test(part)) return { ok: false, msg: `${i + 1}-son notoʻgʻri: «${part}». Faqat 0 dan 255 gacha son yoziladi.` }
    const n = Number(part)
    if (n > 255) return { ok: false, msg: `${i + 1}-son juda katta: ${n}. Eng kattasi — 255.` }
    octets.push(n)
  }
  return { ok: true, octets }
}

const toInt = (o: number[]) => ((o[0] * 256 + o[1]) * 256 + o[2]) * 256 + o[3]
const toDotted = (n: number) => [Math.floor(n / 16777216) % 256, Math.floor(n / 65536) % 256, Math.floor(n / 256) % 256, n % 256].join('.')

function isPrivate(o: number[]) {
  return o[0] === 10 || (o[0] === 172 && o[1] >= 16 && o[1] <= 31) || (o[0] === 192 && o[1] === 168)
}

function SubnetCalc() {
  const [ip, setIp] = useState('192.168.10.25')
  const [prefix, setPrefix] = useState(24)
  const inputId = useId()
  const msgId = useId()

  const parsed = parseIPv4(ip)
  const size = 2 ** (32 - prefix)
  const calc = parsed.ok
    ? (() => {
        const addr = toInt(parsed.octets)
        const network = Math.floor(addr / size) * size
        const broadcast = network + size - 1
        return { addr, network, broadcast, first: network + 1, last: broadcast - 1, hosts: size - 2, priv: isPrivate(parsed.octets) }
      })()
    : null

  const role = !calc ? null
    : calc.addr === calc.network ? <>bu — <strong>tarmoqning oʻz nomi</strong>, qurilmaga berilmaydi.</>
    : calc.addr === calc.broadcast ? <>bu — <strong>oxirgi, band manzil</strong>, qurilmaga berilmaydi.</>
    : <>bu — <strong>oddiy boʻsh manzil</strong>, uni qurilmaga berish mumkin. ✅</>

  return (
    <Stage
      title="Manzilni tekshiramiz"
      badge={calc ? `${calc.hosts} ta qurilma` : 'xato'}
      hint={<>Oʻlcham qanchalik kichik boʻlsa, qurilma ham shunchalik kam sigʻadi. <Mono>/24</Mono> — eng koʻp ishlatiladigani.</>}
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,17rem)_1fr]">
        <div>
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-navy-200">IP manzil</label>
          <input id={inputId} className="field-dark font-mono" value={ip} onChange={e => setIp(e.target.value)}
            inputMode="decimal" autoComplete="off" spellCheck={false} placeholder="192.168.10.25"
            aria-invalid={!parsed.ok} aria-describedby={msgId} />
        </div>
        <div>
          <div className="mb-1.5 text-sm font-semibold text-navy-200" id={msgId + 'p'}>Tarmoq oʻlchami</div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-labelledby={msgId + 'p'}>
            {PREFIXES.map(p => (
              <Btn key={p} size="sm" variant={p === prefix ? 'primary' : 'dark'} aria-pressed={p === prefix} className="font-mono" onClick={() => setPrefix(p)}>/{p}</Btn>
            ))}
          </div>
        </div>
      </div>

      <div id={msgId} role="status" aria-live="polite" className="mt-4">
        {!parsed.ok && (
          <p className="rounded-xl border border-rose-400/60 bg-rose-400/10 px-4 py-3 text-[0.95rem] text-rose-200">
            <strong className="!text-rose-100">Manzil notoʻgʻri.</strong> {parsed.msg}
          </p>
        )}
        {calc && (
          <>
            <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
              {([
                ['Tarmoq nomi', `${toDotted(calc.network)}/${prefix}`],
                ['Birinchi boʻsh manzil', toDotted(calc.first)],
                ['Oxirgi boʻsh manzil', toDotted(calc.last)],
                ['Nechta qurilma sigʻadi', `${calc.hosts} ta`],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="rounded-xl border border-navy-700 bg-navy-900 px-3.5 py-3">
                  <div className="text-xs font-semibold text-navy-300">{k}</div>
                  <div className="mt-1 break-all font-mono text-[1.02rem] font-bold text-white">{v}</div>
                </div>
              ))}
            </div>

            <p className="mt-3 text-[0.95rem] leading-relaxed text-navy-100">
              <span className="font-mono font-bold text-white">{toDotted(calc.addr)}</span> — {role}{' '}
              {calc.priv
                ? <>Bu manzil <strong>ichki</strong>: faqat tarmoq ichida ishlaydi, Internetda koʻrinmaydi. 🏠</>
                : <>Bu manzil ichki manzillarga kirmaydi — u Internetdagi manzilga oʻxshaydi. 🌍</>}
            </p>
          </>
        )}
      </div>
    </Stage>
  )
}

/* ------------------------------ NAT (vizual) ------------------------------ */
function NatBox({ label, value, note, cls }: { label: string; value: string; note: string; cls: string }) {
  return (
    <div className={cx('flex-1 rounded-xl border px-4 py-3 text-center', cls)}>
      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-1 font-mono text-[1.02rem] font-bold text-navy-950">{value}</div>
      <div className="mt-0.5 text-[0.82rem] text-slate-600">{note}</div>
    </div>
  )
}

export default function Ip() {
  return (
    <>
      <PageHeader no="08" tone="teal" eyebrow="Nazariya" title="IP manzil va tarmoq xizmatlari"
        lead={<>Pochtachi xatni manzil boʻyicha topadi. Tarmoqda ham shunday: har bir qurilmaga <strong>IP manzil</strong> kerak. 📬</>} />

      <Goal items={[
        'IP manzilning qaysi qismi tarmoq, qaysi qismi qurilma ekanini koʻrsatasiz',
        'DHCP va DNS nima qilishini oʻz soʻzingiz bilan aytasiz',
        'Maktab uchun oddiy IP reja jadvalini oʻqiy olasiz',
      ]} />

      <Block title="IP manzil nima?" tone="teal"
        sub={<>IP manzil — qurilmaning tarmoqdagi manzili. Nuqta bilan ajratilgan 4 ta son: <Mono>192.168.10.25</Mono>.</>}>
        <Grid cols={2}>
          <Card emoji="🏠" title="Manzil ikki qismdan iborat">
            <CheckList kind="dot" items={[
              <><strong>Tarmoq qismi</strong> — qaysi koʻcha.</>,
              <><strong>Qurilma qismi</strong> — shu koʻchadagi qaysi uy.</>,
              <>Chegara qayerdaligini <Mono>/24</Mono> kabi belgi koʻrsatadi.</>,
            ]} />
            <p className="mt-3">Ikki qurilmaning koʻchasi bir xil boʻlsa, ular bir-biriga toʻgʻridan-toʻgʻri xabar yuboradi. Har xil boʻlsa — xabar <strong>routerga</strong> beriladi.</p>
          </Card>
          <OctetDiagram />
        </Grid>

        <Callout kind="info" title="Nega 256 emas, 254?" className="my-4">
          <Mono>/24</Mono> tarmogʻida 256 ta manzil bor. Ikkitasi band: biri tarmoqning oʻz nomi (<Mono>192.168.10.0</Mono>), biri oxirgi manzil (<Mono>192.168.10.255</Mono>). Qurilmalarga 254 tasi qoladi.
        </Callout>

        <SubnetCalc />
      </Block>

      <Block title="Ichki manzillar va NAT" tone="teal"
        sub={<>Quyidagi manzillar faqat tarmoq ichida ishlaydi. Internetda ularni koʻrmaydilar.</>}>
        <DataTable dense
          head={['Ichki manzillar', 'Qayerda ishlatiladi']}
          rows={[
            [<Mono>10.x.x.x</Mono>, 'Katta tashkilotlar'],
            [<Mono>172.16–31.x.x</Mono>, 'Oʻrta tarmoqlar'],
            [<Mono>192.168.x.x</Mono>, 'Uy, maktab, kichik ofis'],
          ]} />

        <Card className="mt-4" icon={House} tone="blue" title="NAT — bitta umumiy manzil">
          <p>Maktabning tashqariga bitta telefon raqami bor. Barcha xonalar shu raqam orqali gaplashadi. ☎️</p>
          <p>Internet ham shunday: router ichki manzillarni <strong>bitta tashqi manzilga</strong> almashtiradi va javob kimga tegishli ekanini eslab qoladi. Bu — <Term en="NAT">manzil almashtirish</Term>.</p>
          <div className="mt-4 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            <NatBox label="Ichki kompyuter" value="192.168.10.25" note="ichki manzil" cls="border-teal-200 bg-teal-50" />
            <ArrowRight size={22} className="mx-auto flex-none rotate-90 text-slate-400 sm:rotate-0" aria-hidden="true" />
            <NatBox label="Router" value="almashtiradi" note="eslab qoladi" cls="border-slate-200 bg-slate-50" />
            <ArrowRight size={22} className="mx-auto flex-none rotate-90 text-slate-400 sm:rotate-0" aria-hidden="true" />
            <NatBox label="Internetda koʻrinadi" value="198.51.100.20" note="umumiy manzil" cls="border-amber-200 bg-amber-50" />
          </div>
        </Card>
      </Block>

      <Block title="DHCP va DNS — ikki foydali yordamchi" tone="teal"
        sub={<>Bu ikki xizmat boʻlmasa, har bir kompyuterga manzilni qoʻlda yozish kerak boʻlardi.</>}>
        <Grid cols={2}>
          <Card tone="teal" emoji="📋" title="DHCP — manzilni oʻzi beradi">
            <p>Sinf jurnaliga oʻxshaydi: yangi oʻquvchi kelsa, unga boʻsh raqam yoziladi. <Term en="DHCP">Manzil tarqatuvchi xizmat</Term> ham yangi qurilmaga boʻsh manzilni oʻzi beradi.</p>
            <div className="mt-4">
              <StepList tone="teal" items={[
                { n: '1', title: 'Soʻraydi', text: <>Qurilma: «Menga manzil kerak!»</> },
                { n: '2', title: 'Taklif qiladi', text: <>DHCP: «Mana boʻsh manzil».</> },
                { n: '3', title: 'Oladi', text: <>Qurilma: «Shuni olaman».</> },
                { n: '4', title: 'Tasdiqlanadi', text: <>DHCP: «Yozdim, u sizda».</> },
              ]} />
            </div>
          </Card>

          <Card tone="amber" icon={Search} title="DNS — nomni manzilga aylantiradi">
            <p>Siz <Mono>maktab.uz</Mono> deb yozasiz. Kompyuter esa faqat raqamli manzilni tushunadi. <Term en="DNS">Nom xizmati</Term> — tarmoqning telefon kitobi: nomni topib, manzilni beradi. 📞</p>
            <div className="my-4 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4">
              <span className="font-mono text-[1.05rem] font-bold text-navy-900">maktab.uz</span>
              <ArrowRight size={20} className="text-amber-600" aria-hidden="true" />
              <span className="font-mono text-[1.05rem] font-bold text-teal-700">203.0.113.10</span>
            </div>
            <p>Maktabda DNS orqali keraksiz saytlarni yopib qoʻyish ham mumkin. Lekin bu toʻliq himoya emas — uni chetlab oʻtish yoʻllari bor.</p>
          </Card>
        </Grid>
      </Block>

      <Block title="Maktab uchun IP reja" tone="teal"
        sub={<>Bu jadval loyihaning 5-qadamida tuziladi. Keyinchalik u nosozlikni tez topishga yordam beradi.</>}>
        <DataTable
          head={['Nima', 'Manzil', 'Usul', 'Nega shunday']}
          rows={[
            [<strong>Tarmoq</strong>, <Mono>192.168.10.0/24</Mono>, '—', 'Oʻquv xonasi'],
            [<strong>Router</strong>, <Mono>192.168.10.1</Mono>, <Pill tone="violet">Qoʻlda</Pill>, 'Chiqish nuqtasi — oʻzgarmasligi kerak'],
            [<strong>Printer</strong>, <Mono>192.168.10.10</Mono>, <Pill tone="violet">Qoʻlda</Pill>, 'Manzili oʻzgarsa, chop etish uziladi'],
            [<strong>Server</strong>, <Mono>192.168.40.5</Mono>, <Pill tone="violet">Qoʻlda</Pill>, 'Fayllar shu yerda turadi'],
            [<strong>Kompyuterlar</strong>, <Mono>192.168.10.100–200</Mono>, <Pill tone="teal">DHCP</Pill>, 'Manzilni DHCP oʻzi beradi'],
          ]} />

        <Callout kind="warn" title="Nega baʼzi qurilmalarga manzil qoʻlda beriladi?" className="mt-4">
          Printer yoki server manzili oʻzgarsa, ularga ulanish uziladi. Shuning uchun ularga <strong>doimiy</strong> manzil beriladi. DHCP esa 100–200 oraligʻidan tarqatadi — shunda manzillar toʻqnashmaydi.
        </Callout>
      </Block>

      <Block title="Paket safari: xabar qanday yoʻl bosadi?" tone="teal"
        sub={<>Tugmani bosib, xabarning kompyuterdan serverga yoʻlini kuzatamiz. Switch bilan router farqi shu yerda koʻrinadi. 👇</>}>
        <PacketFlow />

        <Grid cols={2} className="mt-6">
          <Card tone="blue" icon={Network} title="Switch nima qiladi?">
            <CheckList kind="dot" items={[
              <>Faqat <strong>bitta tarmoq ichida</strong> ishlaydi</>,
              <>Xabarni <strong>MAC manzil</strong> boʻyicha kerakli portga beradi</>,
              <>IP manzilga qaramaydi</>,
            ]} />
          </Card>
          <Card tone="amber" icon={Router} title="Router nima qiladi?">
            <CheckList kind="dot" items={[
              <>Turli tarmoqlarni <strong>bogʻlaydi</strong></>,
              <>Xabarni <strong>IP manzil</strong> boʻyicha yoʻnaltiradi</>,
              <>Internetga chiqishda manzilni almashtiradi (NAT)</>,
            ]} />
          </Card>
        </Grid>
      </Block>

      <Block title="IPv6 — qisqacha" tone="teal">
        <Card icon={Globe}>
          <p>Hozirgi manzillar tugab bormoqda, shuning uchun yangi, ancha uzun manzillar joriy etilmoqda: <Mono>2001:db8::1</Mono>. Bu — <strong>IPv6</strong>.</p>
        </Card>
      </Block>

      <LifeExample>
        <p>Kompyuter xonasining yarmida Internet toʻsatdan yoʻqoldi. 😮</p>
        <p>Tekshirdilar: oʻsha kompyuterlar <Mono>192.168.10.x</Mono> oʻrniga <Mono>192.168.0.x</Mono> manzil olgan. Kimdir uy routerini tarmoq rozetkasiga ulagan va u oʻz manzillarini tarqata boshlagan. IP reja jadvali borligi uchun xato bir necha daqiqada topildi.</p>
      </LifeExample>

      <Takeaway items={[
        <>IP manzil ikki qismdan iborat: <strong>tarmoq</strong> (koʻcha) va <strong>qurilma</strong> (uy raqami).</>,
        <><Mono>192.168.x.x</Mono> kabi <strong>ichki manzillar</strong> Internetda koʻrinmaydi — tashqariga <strong>NAT</strong> orqali chiqiladi.</>,
        <><strong>DHCP</strong> manzilni oʻzi beradi, <strong>DNS</strong> nomni manzilga aylantiradi.</>,
        <>Switch bitta tarmoq ichida, router esa tarmoqlar orasida ishlaydi.</>,
      ]} />


    </>
  )
}
