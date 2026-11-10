import { Repeat, Users } from 'lucide-react'
import {
  PageHeader, Goal, Block, Grid, Card, Callout, Term, Mono, DataTable, Accordion, LifeExample, Takeaway, MiniTask, cx,
} from '../components/ui'

/* Inkapsulyatsiya: har bir qatlam yuqoridan kelgan maʼlumot oldiga oʻz sarlavhasini qoʻshadi. */
const PART: Record<string, string> = {
  data: 'border-amber-300 bg-amber-100 text-amber-900',
  tcp: 'border-teal-300 bg-teal-100 text-teal-900',
  ip: 'border-blue-300 bg-blue-100 text-blue-900',
  eth: 'border-violet-300 bg-violet-100 text-violet-900',
}
const ENCAP: { layer: string; unit: string; parts: [keyof typeof PART, string][] }[] = [
  { layer: 'Amaliy', unit: 'maʼlumot', parts: [['data', 'HTTP soʻrovi']] },
  { layer: 'Transport', unit: 'segment', parts: [['tcp', 'TCP'], ['data', 'HTTP soʻrovi']] },
  { layer: 'Internet', unit: 'paket', parts: [['ip', 'IP'], ['tcp', 'TCP'], ['data', 'HTTP soʻrovi']] },
  { layer: 'Kanal', unit: 'ramka', parts: [['eth', 'Ethernet'], ['ip', 'IP'], ['tcp', 'TCP'], ['data', 'HTTP soʻrovi']] },
]

function Encapsulation() {
  return (
    <figure className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-6">
      <div className="overflow-x-auto">
        <div className="min-w-[40rem] space-y-2.5">
          {ENCAP.map(row => (
            <div key={row.layer} className="grid grid-cols-[8.5rem_1fr] items-center gap-3">
              <div>
                <div className="font-display text-[0.95rem] font-bold text-navy-950">{row.layer}</div>
                <div className="font-mono text-xs text-slate-500">{row.unit}</div>
              </div>
              <div className="flex justify-end gap-1">
                {row.parts.map(([kind, label]) => (
                  <span key={kind}
                    className={cx('rounded-lg border px-3 py-2 text-center font-mono text-xs font-bold', PART[kind], kind === 'data' ? 'w-44 flex-none' : 'w-24 flex-none')}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <figcaption className="mt-4 border-t border-slate-100 pt-3 text-sm leading-relaxed text-slate-600">
        Yuborishda maʼlumot yuqoridan pastga tushadi va har bir qatlam uning oldiga oʻz sarlavhasini qoʻshadi. Qabul qiluvchi tomonda sarlavhalar teskari tartibda — pastdan yuqoriga — ochiladi.
      </figcaption>
    </figure>
  )
}

export default function Kirish() {
  return (
    <>
      <PageHeader
        no="03"
        tone="blue"
        eyebrow="Asoslar"
        title="Kompyuter tarmoqlariga kirish"
        lead={<>Bitta kompyuter — alohida olam. Ikkinchisi qoʻshilganda esa savol tugʻiladi: ular qanday qilib bir-birini tushunadi? Bu boʻlimda tarmoq nima ekani, u nima berishi va qanday qoidalar asosida ishlashi tushuntiriladi.</>}
      />

      <Goal
        items={[
          'Kompyuter tarmogʻiga taʼrif berish va u taqdim etadigan toʻrt imkoniyatni sanash',
          'Tugun, kanal, paket va protokol atamalarini toʻgʻri qoʻllash',
          'TCP/IP modelining toʻrt qatlamini va inkapsulyatsiyani tushuntirish',
          'TCP bilan UDP, mijoz–server bilan tengdosh tarmoq farqini misolda koʻrsatish',
        ]}
      />

      <Block tone="blue" title="Kompyuter tarmogʻi nima va u nima uchun kerak?">
        <Callout kind="note" title="Taʼrif">
          <strong>Kompyuter tarmogʻi</strong> — maʼlumot va resurslarni (fayl, printer, internet, dastur) almashish uchun qurilmalarni aloqa kanallari orqali bogʻlovchi tizim. Tarmoqning qiymati qurilmalar sonida emas, ularning <strong>kelishilgan qoidalar</strong> asosida «gaplasha olishida».
        </Callout>
      </Block>

      <Block
        tone="blue"
        title="Bir tushuncha — toʻrt qatlamda"
        sub="Qatlamlarni birma-bir oching: har biri oldingisini chuqurlashtiradi — kundalik oʻxshatishdan universitet darajasidagi modelgacha."
      >
        <Accordion
          items={[
            {
              tag: '1-QATLAM',
              title: 'Kundalik hayotdan: sinfdagi suhbat',
              content: (
                <>
                  <p>Sinfda 30 oʻquvchi bir vaqtda gapirsa, hech kim hech narsani eshitmaydi. Gaplashish uchun uch narsa kelishilishi kerak: <strong>kimga</strong> aytayotganingiz, <strong>navbat</strong> qanday va <strong>qaysi tilda</strong>.</p>
                  <p>Tarmoqda ham xuddi shunday. Kompyuterlar bir-biriga maʼlumot yuborishi uchun manzil, navbat va til — yaʼni <strong>protokol</strong> boʻyicha kelishishi shart.</p>
                </>
              ),
            },
            {
              tag: '2-QATLAM',
              title: 'Asosiy tushuncha: tarmoq nima beradi',
              content: (
                <>
                  <p>Tarmoq toʻrt asosiy imkoniyat beradi: <strong>resurs boʻlishish</strong> (bitta printer — hamma uchun), <strong>maʼlumot almashish</strong> (fayl, xabar), <strong>markazlashgan boshqaruv</strong> (hisoblar, huquqlar) va <strong>umumiy xizmatlar</strong> (veb, pochta, bulut).</p>
                  <p>Shu sababli maktab tarmogʻi — shunchaki kabellar emas, balki oʻquv jarayonining infratuzilmasi.</p>
                </>
              ),
            },
            {
              tag: '3-QATLAM',
              title: 'Texnik: tugun, kanal, paket, protokol',
              content: (
                <>
                  <p><Term en="node">Tugun</Term> — tarmoqqa ulangan har qanday qurilma: kompyuter, printer, telefon, kamera, server.</p>
                  <p><Term en="link">Kanal</Term> — tugunlarni bogʻlovchi simli yoki simsiz muhit: UTP kabel, optik tola, radiotoʻlqin.</p>
                  <p><Term en="packet">Paket</Term> — uzatiladigan maʼlumotning kichik boʻlagi. Uning <em>sarlavhasi</em> (header) yuboruvchi va qabul qiluvchi manzilini, <em>yuki</em> (payload) esa foydali maʼlumotni saqlaydi. Katta fayl yuzlab paketlarga boʻlinib yuboriladi.</p>
                  <p><Term en="protocol">Protokol</Term> — qurilmalar kelishgan qoidalar toʻplami. Eng keng tarqalgan protokollar oilasi — <Mono>TCP/IP</Mono>.</p>
                </>
              ),
            },
            {
              tag: '4-QATLAM',
              title: 'Universitet darajasi: qatlamli model',
              content: (
                <>
                  <p>Aloqa masalasi bir yoʻla hal qilinmaydi — u <strong>qatlamlarga</strong> boʻlinadi. Har bir qatlam faqat oʻz vazifasini bajaradi va quyi qatlamga tayanadi. Bu — murakkablikni boshqarish usuli.</p>
                  <p>Amaliyotda <Mono>TCP/IP</Mono> modeli ishlatiladi: <em>Kanal</em> (Ethernet, Wi-Fi) → <em>Internet</em> (IP) → <em>Transport</em> (TCP, UDP) → <em>Amaliy</em> (HTTP, DNS). Oʻquv maqsadida koʻpincha yetti qatlamli <Mono>OSI</Mono> modeli ham tushuntiriladi — u batafsilroq va nosozlikni qidirishda qulay.</p>
                  <p>Toʻrt qatlamning vazifasi va bitta paket ichida qanday joylashishi quyidagi jadval va chizmada koʻrsatilgan.</p>
                </>
              ),
            },
          ]}
        />
      </Block>

      <Block
        tone="blue"
        title="TCP/IP modeli va inkapsulyatsiya"
        sub="Har bir qatlam bitta savolga javob beradi: qaysi xizmat, qaysi dastur, qaysi tarmoq va qaysi qoʻshni qurilma."
      >
        <DataTable
          head={['TCP/IP qatlami', 'Vazifasi', 'Misol']}
          rows={[
            [<strong>Amaliy</strong>, 'Foydalanuvchi xizmatlari', 'HTTP, DNS, SMTP'],
            [<strong>Transport</strong>, 'Dasturdan dasturgacha yetkazish: portlar, ishonchlilik', 'TCP, UDP'],
            [<strong>Internet</strong>, 'Manzillash va tarmoqlar orasida yoʻnaltirish', 'IP, ICMP'],
            [<strong>Kanal</strong>, 'Bitta tarmoq ichida qoʻshni qurilmaga jismoniy uzatish', 'Ethernet, Wi-Fi'],
          ]}
        />
        <div className="mt-4">
          <Encapsulation />
        </div>
        <Callout kind="info" title="Muhim aniqlik" className="mt-4">
          Qatlamlar — ketma-ket «bosqichlar» emas, balki bitta paket ichida <em>bir vaqtda mavjud</em> sarlavhalar. Paket yuborilganda har bir qatlam oʻz sarlavhasini qoʻshadi — bu <Term en="encapsulation">inkapsulyatsiya</Term>; qabul qilinganda esa sarlavhalar navbat bilan ochiladi.
        </Callout>
      </Block>

      <Block tone="blue" title="TCP yoki UDP — qaysi biri?" sub="Ikkalasi ham transport qatlami protokoli. Tanlov bitta savolga bogʻliq: toʻliqlik muhimmi yoki tezlik?">
        <DataTable
          head={['Xususiyat', 'TCP', 'UDP']}
          rows={[
            [<strong>Yetkazish</strong>, 'Ishonchli: yoʻqolgan paket qayta yuboriladi, tartib saqlanadi', 'Kafolatsiz: yoʻqolgan paket qayta yuborilmaydi'],
            [<strong>Ulanish</strong>, 'Avval ulanish oʻrnatiladi', 'Ulanish oʻrnatilmaydi — darhol yuboriladi'],
            [<strong>Tezlik</strong>, 'Sekinroq, tekshiruvlar qoʻshimcha vaqt oladi', 'Tez va yengil'],
            [<strong>Qayerda</strong>, 'Veb-sahifa, fayl, elektron pochta', 'Jonli video va ovozli qoʻngʻiroq, onlayn oʻyin, DNS soʻrovi'],
          ]}
        />
        <Callout kind="note" title="Oʻquvchiga qanday tushuntiriladi" className="mt-4">
          TCP — buyurtma xat: yetib borgani tasdiqlanadi, yoʻqolsa qayta joʻnatiladi. UDP — otilgan qogʻoz samolyotcha: tez uchadi, lekin yetib borgani nomaʼlum.
        </Callout>
      </Block>

      <Block tone="blue" title="Mijoz–server va tengdosh tarmoq" sub="Tarmoqdagi qurilmalar oʻzaro rollarni ikki xil taqsimlashi mumkin.">
        <Grid cols={2}>
          <Card tone="blue" icon={Users} title="Mijoz–server">
            Bitta kompyuter (server) xizmat koʻrsatadi, qolganlari (mijozlar) unga soʻrov yuboradi. Boshqaruv va maʼlumot bir joyda toʻplanadi. Maktab tarmogʻi odatda shunday quriladi.
          </Card>
          <Card tone="teal" icon={Repeat} title="Tengdosh (P2P)">
            Barcha qurilmalar teng huquqli: har biri ham soʻraydi, ham xizmat koʻrsatadi. Markaziy server shart emas. Misol: fayl almashish tarmoqlari, torrent.
          </Card>
        </Grid>
        <Callout kind="success" title="Muhim xulosa" className="mt-4">
          Server — <em>alohida qurilma turi</em> emas, balki <em>rol</em>. Oddiy kompyuter ham boshqalarga xizmat koʻrsatsa, server boʻladi.
        </Callout>
      </Block>

      <LifeExample>
        Universitet kutubxonasida talaba noutbukidan elektron katalogni ochadi. Noutbuk (<strong>tugun</strong>) Wi-Fi (<strong>kanal</strong>) orqali soʻrovni <strong>paketlarga</strong> boʻlib yuboradi; paketlar TCP/IP <strong>protokollari</strong> boʻyicha katalog serveriga yetib boradi — bu mijoz–server aloqasi. Sahifa TCP orqali keladi, chunki u toʻliq va xatosiz yetishi shart. Yonidagi talaba esa videoqoʻngʻiroq orqali maʼruza tinglayapti: bir-ikki paket yoʻqolsa, tasvir bir lahza qotadi-yu, suhbat davom etaveradi — bu UDP.
      </LifeExample>

      <Takeaway
        items={[
          'Tarmoq — qurilmalar yigʻindisi emas, kelishilgan qoidalar (protokollar) asosida ishlaydigan aloqa tizimi.',
          'Toʻrt tayanch atama: tugun, kanal, paket va protokol.',
          'TCP/IP toʻrt qatlamdan iborat; har bir qatlam paketga oʻz sarlavhasini qoʻshadi — bu inkapsulyatsiya.',
          'TCP — ishonchli, UDP — tez. Server esa qurilma turi emas, rol.',
        ]}
      />

      <MiniTask
        questions={[
          {
            q: 'Onlayn dars paytida tasvir bir lahza qotdi va davom etdi — yoʻqolgan qism qayta koʻrsatilmadi. Bu qaysi protokolga xos va nima uchun?',
            options: [
              'TCP — chunki u yoʻqolgan paketni qayta yuboradi',
              'UDP — tezlik muhim, yoʻqolgan paket qayta yuborilmaydi',
              'DNS — chunki sayt nomi topilmadi',
              'Ethernet — chunki kabel uzilib qoldi',
            ],
            correct: 1,
            explain: 'Jonli videoda kechikkan paketning foydasi yoʻq, shuning uchun UDP ishlatiladi: u tez, lekin yoʻqolgan paketni qayta yubormaydi. TCP boʻlganda tasvir toʻxtab, yoʻqolgan qismni kutib turardi.',
          },
          {
            q: 'Oʻqituvchi oddiy kompyuterda umumiy papka ochib, dars fayllarini joyladi; oʻquvchilar oʻz kompyuterlaridan shu papkadan fayl olishadi. Oʻqituvchi kompyuteri qanday rol bajaryapti?',
            options: ['Mijoz', 'Router', 'Server', 'Access point'],
            correct: 2,
            explain: 'Server — qurilma turi emas, rol. Boshqalarga xizmat (bu yerda — fayl saqlash) koʻrsatayotgan har qanday kompyuter server vazifasini bajaradi; oʻquvchilar kompyuterlari esa mijoz.',
          },
          {
            q: 'Brauzer sahifa soʻraganda HTTP soʻrovi oldiga navbat bilan TCP, IP va Ethernet sarlavhalari qoʻshiladi. Bu jarayon nima deb ataladi?',
            options: ['Inkapsulyatsiya', 'Yoʻnaltirish', 'Shifrlash', 'Autentifikatsiya'],
            correct: 0,
            explain: 'Har bir qatlam yuqoridan kelgan maʼlumotga oʻz sarlavhasini qoʻshadi — bu inkapsulyatsiya. Qabul qiluvchi tomonda sarlavhalar teskari tartibda ochiladi.',
          },
        ]}
      />
    </>
  )
}
