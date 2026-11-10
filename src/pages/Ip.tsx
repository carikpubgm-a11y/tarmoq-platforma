import { Fragment, useId, useState } from 'react'
import { ArrowRight, Globe, House, Network, Router, Search } from 'lucide-react'
import {
  PageHeader, Goal, Block, Grid, Card, Callout, Pill, Term, Mono, CodeBlock, DataTable, CheckList, StepList,
  LifeExample, Takeaway, Btn, Stage, MiniTask, cx,
} from '../components/ui'
import PacketFlow from '../sims/PacketFlow'

/* ------------------------------ IPv4 manzil tuzilishi (vizual) ------------------------------ */
const OCTETS = [
  { v: '192', bin: '11000000', net: true },
  { v: '168', bin: '10101000', net: true },
  { v: '10', bin: '00001010', net: true },
  { v: '25', bin: '00011001', net: false },
]

function OctetDiagram() {
  return (
    <figure className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-start justify-center gap-x-2 gap-y-3 font-mono">
        {OCTETS.map((o, i) => (
          <Fragment key={i}>
            {i > 0 && <span className="pt-2.5 text-2xl font-bold text-slate-400" aria-hidden="true">.</span>}
            <div className="text-center">
              <div className={cx('min-w-[4.2rem] rounded-xl border px-3 py-2.5 text-2xl font-bold', o.net ? 'border-teal-200 bg-teal-50 text-teal-800' : 'border-amber-200 bg-amber-50 text-amber-900')}>{o.v}</div>
              <div className="mt-1.5 text-[0.72rem] tracking-wider text-slate-500">{o.bin}</div>
            </div>
          </Fragment>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <Pill tone="teal">tarmoq qismi — 24 bit</Pill>
        <Pill tone="amber">host qismi — 8 bit</Pill>
      </div>
      <figcaption className="mt-4 border-t border-slate-100 pt-3 text-center text-[0.95rem] text-slate-600">
        Prefiks <Mono>/24</Mono> — subnet maskasi <Mono>255.255.255.0</Mono>: dastlabki 24 bit tarmoqni, qolgan 8 bit qurilmani bildiradi.
      </figcaption>
    </figure>
  )
}

/* ------------------------------ Subnet kalkulyatori ------------------------------ */
const PREFIXES = [24, 25, 26, 27, 28, 29, 30]

type Parsed = { ok: true; octets: number[] } | { ok: false; msg: string }

function parseIPv4(raw: string): Parsed {
  const s = raw.trim()
  if (!s) return { ok: false, msg: 'IPv4 manzilni kiriting, masalan: 192.168.10.25.' }
  if (s.includes('/')) return { ok: false, msg: 'Prefiksni manzilga qoʻshib yozmang — uni quyidagi tugmalardan tanlang.' }
  const parts = s.split('.')
  if (parts.length !== 4) {
    return { ok: false, msg: 'IPv4 manzil nuqta bilan ajratilgan toʻrtta sondan iborat boʻlishi kerak, masalan: 192.168.10.25.' }
  }
  const octets: number[] = []
  for (let i = 0; i < 4; i++) {
    const part = parts[i]
    if (part === '') return { ok: false, msg: `${i + 1}-oktet boʻsh qolgan. Toʻrtta sonning hammasini kiriting.` }
    if (!/^\d{1,3}$/.test(part)) {
      return { ok: false, msg: `${i + 1}-oktet notoʻgʻri: «${part}». Har bir oktet 0 dan 255 gacha boʻlgan butun son boʻlishi kerak.` }
    }
    const n = Number(part)
    if (n > 255) return { ok: false, msg: `${i + 1}-oktet notoʻgʻri: ${n}. Har bir oktet 0 dan 255 gacha boʻlishi kerak.` }
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
        return {
          addr, network, broadcast, first: network + 1, last: broadcast - 1, hosts: size - 2,
          mask: 2 ** 32 - size, bits: addr.toString(2).padStart(32, '0'), priv: isPrivate(parsed.octets),
        }
      })()
    : null

  const role = !calc ? null
    : calc.addr === calc.network ? <><strong>tarmoq manzilining oʻzi</strong>; u qurilmaga berilmaydi.</>
    : calc.addr === calc.broadcast ? <>shu tarmoqning <strong>broadcast manzili</strong>; u qurilmaga berilmaydi.</>
    : <>shu tarmoqdagi <strong>oddiy host manzili</strong>; uni qurilmaga berish mumkin.</>

  return (
    <Stage
      title="Subnet kalkulyatori"
      badge={calc ? `/${prefix} · ${calc.hosts} ta host` : 'xato'}
      hint={<>Formula: hostlar soni = 2<sup>(32 − prefiks)</sup> − 2. Ikkita manzil — tarmoq manzili va broadcast — qurilmalarga berilmaydi.</>}
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,17rem)_1fr]">
        <div>
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-navy-200">IPv4 manzil</label>
          <input id={inputId} className="field-dark font-mono" value={ip} onChange={e => setIp(e.target.value)}
            inputMode="decimal" autoComplete="off" spellCheck={false} placeholder="192.168.10.25"
            aria-invalid={!parsed.ok} aria-describedby={msgId} />
        </div>
        <div>
          <div className="mb-1.5 text-sm font-semibold text-navy-200" id={msgId + 'p'}>Prefiks (subnet maskasi uzunligi)</div>
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
            <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-3">
              {([
                ['Tarmoq manzili', `${toDotted(calc.network)}/${prefix}`],
                ['Broadcast manzili', toDotted(calc.broadcast)],
                ['Subnet maskasi', toDotted(calc.mask)],
                ['Birinchi host', toDotted(calc.first)],
                ['Oxirgi host', toDotted(calc.last)],
                ['Foydalanish mumkin boʻlgan hostlar', `${calc.hosts} ta (${size} − 2)`],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="rounded-xl border border-navy-700 bg-navy-900 px-3.5 py-3">
                  <div className="text-xs font-semibold text-navy-300">{k}</div>
                  <div className="mt-1 break-all font-mono text-[1.02rem] font-bold text-white">{v}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 rounded-xl border border-navy-700 bg-navy-900 px-3.5 py-3">
              <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-navy-300">
                <span>Manzilning 32 biti:</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-teal-400" />tarmoq qismi ({prefix} bit)</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-amber-400" />host qismi ({32 - prefix} bit)</span>
              </div>
              <div className="flex flex-wrap gap-x-2.5 gap-y-2" aria-hidden="true">
                {[0, 1, 2, 3].map(o => (
                  <div key={o} className="flex gap-px">
                    {calc.bits.slice(o * 8, o * 8 + 8).split('').map((b, k) => {
                      const net = o * 8 + k < prefix
                      return (
                        <span key={k} className={cx('grid h-7 w-[1.05rem] place-items-center rounded-[4px] font-mono text-[0.74rem] font-bold', net ? 'bg-teal-400/20 text-teal-200' : 'bg-amber-400/25 text-amber-200')}>{b}</span>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-3 text-[0.95rem] leading-relaxed text-navy-100">
              <span className="font-mono font-bold text-white">{toDotted(calc.addr)}</span> — {role}{' '}
              {calc.priv
                ? <>Manzil <strong>xususiy</strong> diapazonga kiradi (RFC 1918) — Internetda yoʻnaltirilmaydi.</>
                : <>Manzil RFC 1918 xususiy diapazonlariga kirmaydi.</>}
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
      <PageHeader no="08" tone="teal" eyebrow="Nazariya" title="IP manzillash va tarmoq xizmatlari"
        lead={<>Qurilma tarmoqda «koʻrinishi» uchun unga <strong>manzil</strong> kerak. Bu boʻlim — eng amaliy qism: manzil qanday tuziladi, uni kim beradi, nom qanday qilib manzilga aylanadi va paket boshqa tarmoqqa qanday yetib boradi.</>} />

      <Goal items={[
        'IPv4 manzilning tarmoq va host qismini subnet maskasi yordamida ajratish',
        'Xususiy manzillar, NAT, DHCP va DNS vazifasini tushuntirish',
        'Kichik tashkilot uchun IP reja tuzish: qaysi qurilmaga statik manzil, qaysisiga DHCP',
        'Paket boshqa tarmoqqa oʻtganda MAC va IP manzillar bilan nima boʻlishini koʻrsatish',
      ]} />

      <Block title="IPv4 manzil tuzilishi" tone="teal"
        sub={<>IPv4 manzil — <strong>32 bit</strong>. U toʻrtta oktetga boʻlinadi va nuqta bilan yoziladi; har bir oktet 0 dan 255 gacha.</>}>
        <Grid cols={2}>
          <Card icon={Network} title="Manzil ikki qismdan iborat">
            <CheckList kind="dot" items={[
              <><strong>Tarmoq qismi</strong> — qurilma qaysi tarmoqda ekanini bildiradi.</>,
              <><strong>Host qismi</strong> — shu tarmoq ichidagi aniq qurilmani bildiradi.</>,
              <><Term en="subnet mask">Subnet maskasi</Term> ikki qism orasidagi chegarani koʻrsatadi. U prefiks koʻrinishida ham yoziladi: <Mono>/24</Mono> = <Mono>255.255.255.0</Mono>.</>,
            ]} />
            <p className="mt-3">Ikki qurilmaning tarmoq qismi bir xil boʻlsa, ular bir-biriga toʻgʻridan-toʻgʻri murojaat qiladi; har xil boʻlsa — paket <strong>shlyuzga</strong> (routerga) yuboriladi.</p>
          </Card>
          <OctetDiagram />
        </Grid>

        <Callout kind="info" title="Nega 256 emas, 254 ta?" className="my-4">
          Odatdagi <Mono>/24</Mono> tarmogʻida 256 ta manzil bor, lekin ikkitasi hostlarga berilmaydi: <strong>tarmoq manzili</strong> (masalan, 192.168.10.0) va <strong>broadcast manzili</strong> (192.168.10.255). Shuning uchun 254 ta foydalanish mumkin boʻlgan manzil qoladi. Maxsus <Mono>/31</Mono>, <Mono>/32</Mono> hamda IPv6 holatlarida bu qoida boshqacha.
        </Callout>

        <SubnetCalc />
      </Block>

      <Block title="Xususiy manzillar va NAT" tone="teal"
        sub={<>Quyidagi diapazonlar Internetda yoʻnaltirilmaydi — ular faqat ichki tarmoqda ishlatiladi (<Mono>RFC 1918</Mono>).</>}>
        <DataTable
          head={['Diapazon', 'Manzillar oraligʻi', 'Odatda qayerda']}
          rows={[
            [<Mono>10.0.0.0/8</Mono>, '10.0.0.0 – 10.255.255.255', 'Yirik tashkilotlar'],
            [<Mono>172.16.0.0/12</Mono>, '172.16.0.0 – 172.31.255.255', 'Oʻrta tarmoqlar'],
            [<Mono>192.168.0.0/16</Mono>, '192.168.0.0 – 192.168.255.255', 'Uy va kichik ofis'],
          ]} />

        <Card className="mt-4" icon={House} tone="blue" title="NAT — manzil tarjimasi">
          <p>Ichki manzillar tashqariga chiqishi uchun <Term en="Network Address Translation">NAT</Term> ishlatiladi: chegaradagi router ichki manzillarni odatda <strong>bitta umumiy tashqi manzilga</strong> almashtiradi va javob qaysi qurilmaga tegishli ekanini oʻz jadvalida saqlaydi.</p>
          <div className="mt-4 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            <NatBox label="Ichki kompyuter" value="192.168.10.25" note="xususiy manzil" cls="border-teal-200 bg-teal-50" />
            <ArrowRight size={22} className="mx-auto flex-none rotate-90 text-slate-400 sm:rotate-0" aria-hidden="true" />
            <NatBox label="Router (NAT)" value="almashtiradi" note="jadvalda eslab qoladi" cls="border-slate-200 bg-slate-50" />
            <ArrowRight size={22} className="mx-auto flex-none rotate-90 text-slate-400 sm:rotate-0" aria-hidden="true" />
            <NatBox label="Internetda koʻrinadi" value="198.51.100.20" note="umumiy manzil" cls="border-amber-200 bg-amber-50" />
          </div>
        </Card>
      </Block>

      <Block title="Tarmoqni avtomatik sozlaydigan xizmatlar: DHCP va DNS" tone="teal"
        sub={<>Bu ikki xizmat boʻlmasa, har bir kompyuterga manzilni qoʻlda yozish kerak boʻlardi — 20 ta kompyuter uchun bu mashaqqat, 200 ta uchun esa amalda imkonsiz.</>}>
        <Grid cols={2}>
          <div>
            <h3 className="text-lg font-bold">DHCP — manzilni kim beradi?</h3>
            <p className="prose-uz mb-4 mt-2 text-[0.97rem] leading-relaxed text-slate-600">
              <Term en="Dynamic Host Configuration Protocol">DHCP</Term> qurilmaga IP manzil, subnet maskasi, shlyuz va DNS manzilini avtomatik beradi (<Mono>RFC 2131</Mono>). Jarayon toʻrt qadamdan iborat — bosh harflari boʻyicha <strong>DORA</strong>:
            </p>
            <StepList tone="teal" items={[
              { n: 'D', title: 'Discover — qidirish', text: <>Mijoz: «Menga manzil kerak!» Soʻrov butun tarmoqqa (broadcast) yuboriladi.</> },
              { n: 'O', title: 'Offer — taklif', text: <>Server: «Mana boʻsh manzil».</> },
              { n: 'R', title: 'Request — soʻrov', text: <>Mijoz: «Shu manzilni olaman».</> },
              { n: 'A', title: 'Acknowledge — tasdiq', text: <>Server: «Tasdiqlandi, ijara muddati — N soat».</> },
            ]} />
          </div>

          <Card tone="amber" icon={Search} title="DNS — nomni manzilga aylantiradi">
            <p>Odam <Mono>maktab.uz</Mono> deb yozadi, kompyuter esa IP manzil bilan ishlaydi. Ularni bogʻlovchi xizmat — <Term en="Domain Name System">DNS</Term> (<Mono>RFC 1034/1035</Mono>).</p>
            <div className="my-3">
              <CodeBlock><span className="text-navy-400"># Odam uchun</span>{'\n'}maktab.uz{'\n\n'}<span className="text-navy-400"># Kompyuter uchun</span>{'\n'}<span className="text-teal-300">203.0.113.10</span></CodeBlock>
            </div>
            <p><strong>Xavfsizlik nuqtayi nazaridan:</strong> DNS soʻrovlarini kuzatib, qurilma qaysi saytlarga murojaat qilayotganini bilish mumkin. Maktab DNS filtri faqat mijozlar tashkilot resolveridan foydalansa samarali boʻladi; muqobil DNS, DoH/DoT, kesh yoki toʻgʻridan-toʻgʻri IP manzil uni chetlab oʻtishi mumkin.</p>
            <p>Demak, DNS filtrlash — toʻliq kontent nazorati emas, balki himoya qatlamlaridan biri.</p>
          </Card>
        </Grid>
      </Block>

      <Block title="Amaliy misol: maktab uchun IP reja" tone="teal"
        sub={<>Loyihalashning 5-bosqichi aynan shu jadvalni tuzish bilan tugaydi. Keyinchalik u har qanday nosozlikni tez topishga yordam beradi.</>}>
        <DataTable
          head={['Nima', 'Manzil', 'Usul', 'Izoh']}
          rows={[
            [<strong>Tarmoq</strong>, <Mono>192.168.10.0/24</Mono>, '—', 'Oʻquv tarmogʻi (VLAN 10)'],
            [<strong>Shlyuz</strong>, <Mono>192.168.10.1</Mono>, <Pill tone="violet">Statik</Pill>, 'Router interfeysi'],
            [<strong>Server</strong>, <Mono>192.168.40.5</Mono>, <Pill tone="violet">Statik</Pill>, 'VLAN 40 · fayl + DNS + DHCP'],
            [<strong>Printer</strong>, <Mono>192.168.10.10</Mono>, <Pill tone="violet">Statik</Pill>, 'VLAN 10 · manzil oʻzgarmasligi kerak'],
            [<strong>Kompyuterlar</strong>, <Mono>192.168.10.100–200</Mono>, <Pill tone="teal">DHCP</Pill>, '101 ta manzil — 20 ta kompyuterga zaxirasi bilan yetadi'],
            [<strong>Zaxira DNS</strong>, <Mono>192.168.40.6</Mono>, <Pill tone="violet">Statik</Pill>, 'Ichki siyosatni saqlaydigan ikkilamchi resolver'],
          ]} />

        <Grid cols={2} className="mt-4">
          <Callout kind="warn" title="Nega baʼzi qurilmalar statik manzil oladi?">
            Printer, kamera va serverga manzil oddiy DHCP orqali berilsa, u vaqt oʻtib oʻzgarishi mumkin — va ularga ulanish uziladi. Shuning uchun xizmat koʻrsatuvchi qurilmalarga <strong>doimiy (statik)</strong> manzil beriladi yoki DHCP da ular uchun manzil <strong>band qilinadi</strong> (reservation).
          </Callout>
          <Callout kind="note" title="Jadvalni oʻqish">
            Statik manzillar (1–99) DHCP doirasidan (100–200) tashqarida — shunda ular toʻqnashmaydi. DHCP serveri boshqa VLAN da turgani uchun routerda soʻrovni serverga uzatuvchi <Term en="DHCP relay">DHCP uzatish</Term> yoqiladi: broadcast soʻrov oʻzi routerdan oʻtmaydi.
          </Callout>
        </Grid>
      </Block>

      <Block title="Paket safari: maʼlumot qanday yoʻl bosadi?" tone="teal"
        sub={<>Bir kompyuterdan boshqa tarmoqdagi serverga xabar yuborilganda nima sodir boʻladi? Har bir qadamni kuzatamiz — switch bilan router orasidagi farq aynan shu yerda koʻrinadi.</>}>
        <PacketFlow />

        <Grid cols={2} className="mt-6">
          <Card tone="blue" icon={Network} title="Switch nima qiladi?">
            <CheckList kind="dot" items={[
              <>Ramkani <strong>MAC manzil</strong> boʻyicha yoʻnaltiradi</>,
              <>Faqat <strong>bitta</strong> tarmoq ichida ishlaydi</>,
              <>IP manzilga qaramaydi</>,
              <>MAC jadvalni oʻzi oʻrganib boradi</>,
            ]} />
          </Card>
          <Card tone="amber" icon={Router} title="Router nima qiladi?">
            <CheckList kind="dot" items={[
              <><strong>IP manzil</strong> boʻyicha yoʻnaltiradi</>,
              <>Turli tarmoqlarni bogʻlaydi</>,
              <>Har sakrashda ramka sarlavhasini <strong>qayta yozadi</strong></>,
              <>Manzil tarjimasi (NAT) koʻpincha shu yerda bajariladi</>,
            ]} />
          </Card>
        </Grid>

        <Callout kind="info" title="Simulyatsiya nimani koʻrsatadi" className="mt-4">
          <p>Ichki tarmoqlar orasidagi yoʻnaltirishda <strong>IP manzillar saqlanadi</strong>, har bir uchastkada esa <strong>MAC manzillar qayta yoziladi</strong>.</p>
          <p>NAT bu yerda qatnashmaydi: u faqat Internet chegarasida ishlaydi — oʻsha yerda router yoki firewall xususiy manba manzilini tashqi umumiy manzilga tarjima qiladi.</p>
        </Callout>
      </Block>

      <Block title="IPv6 haqida qisqacha" tone="teal">
        <Card icon={Globe}>
          <p>IPv4 manzillari yetishmaydi: 32 bit atigi ≈ 4,3 milliard manzil beradi. Shuning uchun <strong>IPv6</strong> joriy etilmoqda — <strong>128 bit</strong>, oʻn oltilik sanoq tizimida yoziladi: <Mono>2001:db8::1</Mono>.</p>
          <p>IPv6 manzil tanqisligini amalda bartaraf etadi, NAT ga ehtiyojni koʻpincha yoʻqotadi va IPsec kabi himoya mexanizmlarini qoʻllash uchun qulay asos yaratadi. Biroq IPsec barcha IPv6 tarmoqlarida majburiy emas.</p>
        </Card>
      </Block>

      <LifeExample>
        <p>Universitet kompyuter sinfidagi kompyuterlarning yarmida toʻsatdan Internet yoʻqoldi. Tekshiruv koʻrsatdiki, ular <Mono>192.168.10.x</Mono> oʻrniga <Mono>192.168.0.x</Mono> manzil olgan: kimdir «Wi-Fi kuchliroq boʻlsin» deb uy routerini tarmoq rozetkasiga ulagan, uning DHCP xizmati esa kompyuterlarga oʻz manzillarini tarqata boshlagan.</p>
        <p>IP reja jadvali borligi uchun nosozlik bir necha daqiqada topildi — manzil rejadagi diapazonga toʻgʻri kelmasligi darhol koʻrindi. Begona router uzilgach, kompyuterlar qaytadan toʻgʻri manzil oldi.</p>
      </LifeExample>

      <Takeaway items={[
        <>IPv4 manzil — 32 bit; subnet maskasi uni <strong>tarmoq</strong> va <strong>host</strong> qismiga ajratadi. <span className="font-mono">/24</span> tarmogʻida 254 ta qurilmaga manzil beriladi.</>,
        <>Xususiy manzillar (RFC 1918) Internetda yoʻnaltirilmaydi; tashqariga <strong>NAT</strong> orqali chiqiladi.</>,
        <><strong>DHCP</strong> manzilni avtomatik beradi (DORA), <strong>DNS</strong> nomni manzilga aylantiradi. Server, printer va kameraga statik yoki band qilingan manzil beriladi.</>,
        <>Switch MAC boʻyicha, router IP boʻyicha yoʻnaltiradi: har uchastkada MAC manzillar qayta yoziladi, IP manzillar saqlanadi.</>,
      ]} />

      <MiniTask questions={[
        {
          q: 'Kompyuter (192.168.10.25/24) fayl serveriga (192.168.40.5) paket yubormoqda. Kompyuterdan chiqayotgan ramkada nishon MAC manzil kimniki boʻladi?',
          options: [
            'Fayl serverining MAC manzili',
            'Switchning MAC manzili',
            'Shlyuzning — router interfeysi 192.168.10.1 ning MAC manzili',
            'Broadcast manzil (FF:FF:FF:FF:FF:FF)',
          ],
          correct: 2,
          explain: 'Server boshqa tarmoqda, shuning uchun ramka shlyuzga yuboriladi: nishon MAC — router, nishon IP esa server manzili boʻlib qolaveradi. Router ramkani qayta yozib, serverga uzatadi.',
        },
        {
          q: 'Maktab printeri manzilni DHCP orqali olgan. Taʼtildan keyin hech kim chop eta olmayapti: printer boshqa manzil olgan. Eng toʻgʻri yechim qaysi?',
          options: [
            'Printerga statik manzil berish yoki DHCP da uning manzilini band qilish',
            'Barcha kompyuterlarda DNS serverini almashtirish',
            'Switchni oʻchirib, qayta yoqish',
            'Printerni Wi-Fi orqali ulash',
          ],
          correct: 0,
          explain: 'Xizmat koʻrsatuvchi qurilmaning manzili oʻzgarmasligi kerak. Statik manzil yoki DHCP dagi band qilish (reservation) shuni taʼminlaydi va IP reja jadvaliga yoziladi.',
        },
        {
          q: 'Kutubxona uchun 192.168.30.0/26 tarmogʻi ajratildi. Unda nechta qurilmaga manzil berish mumkin?',
          options: ['64 ta', '254 ta', '30 ta', '62 ta'],
          correct: 3,
          explain: '/26 da host qismi 6 bit: 2 ning 6-darajasi = 64 ta manzil. Tarmoq manzili va broadcast ayiriladi — 62 ta qoladi. Yuqoridagi kalkulyatorda tekshirib koʻring.',
        },
      ]} />
    </>
  )
}
