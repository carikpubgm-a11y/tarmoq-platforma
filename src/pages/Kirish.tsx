import { Repeat, Users } from 'lucide-react'
import {
  PageHeader, Goal, Block, Grid, Card, Callout, Term, Mono, DataTable, Accordion, LifeExample, Takeaway, MiniTask,
} from '../components/ui'

/* Katta fayl kichik boʻlaklarga — paketlarga — boʻlinib yuboriladi. */
function PaketChizma() {
  const konvert = [0, 1, 2, 3]
  return (
    <figure className="rounded-3xl border-2 border-slate-200 bg-white p-5 shadow-card sm:p-6">
      <svg viewBox="0 0 620 160" className="h-auto w-full" role="img"
        aria-label="Katta rasm toʻrtta kichik konvertga boʻlinadi, konvertlar bittalab yuboriladi va oxirida yana bitta rasm boʻlib yigʻiladi">
        <rect x={10} y={42} width={110} height={76} rx={14} fill="#CCFBF1" stroke="#14B8A6" strokeWidth={2.5} />
        <text x={65} y={75} textAnchor="middle" fontSize={26}>🖼️</text>
        <text x={65} y={102} textAnchor="middle" fontSize={13} fontWeight={700} fill="#0C1A35">1 ta rasm</text>

        <path d="M128 80 L166 80" stroke="#94A3B8" strokeWidth={3} strokeLinecap="round" />
        <polygon points="178,80 164,73 164,87" fill="#94A3B8" />

        {konvert.map(i => (
          <g key={i}>
            <rect x={192 + i * 62} y={52} width={52} height={56} rx={10} fill="#FEF3C7" stroke="#F59E0B" strokeWidth={2.5} />
            <text x={218 + i * 62} y={82} textAnchor="middle" fontSize={20}>✉️</text>
            <text x={218 + i * 62} y={100} textAnchor="middle" fontSize={11} fontWeight={700} fill="#0C1A35">{i + 1}</text>
          </g>
        ))}
        <text x={316} y={38} textAnchor="middle" fontSize={13} fontWeight={700} fill="#1D335F">4 ta paket</text>

        <path d="M452 80 L490 80" stroke="#94A3B8" strokeWidth={3} strokeLinecap="round" />
        <polygon points="502,80 488,73 488,87" fill="#94A3B8" />

        <rect x={500} y={42} width={110} height={76} rx={14} fill="#CCFBF1" stroke="#14B8A6" strokeWidth={2.5} />
        <text x={555} y={75} textAnchor="middle" fontSize={26}>🖼️</text>
        <text x={555} y={102} textAnchor="middle" fontSize={13} fontWeight={700} fill="#0C1A35">yana 1 ta rasm</text>
      </svg>
      <figcaption className="mt-4 border-t-2 border-slate-100 pt-3 text-[0.95rem] leading-relaxed text-slate-600">
        Katta fayl kichik boʻlaklarga boʻlinib yuboriladi. Har bir boʻlak — <strong>paket</strong>. Oxirida ular yana bir butun boʻlib yigʻiladi.
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
        title="Tarmoq nima?"
        lead={<>Bitta kompyuter — yolgʻiz. Ikkitasi ulansa, savol tugʻiladi: ular bir-birini qanday tushunadi?</>}
      />

      <Goal
        items={[
          'Tarmoq nima ekanini oʻz soʻzim bilan aytib beraman',
          'Tugun, kanal, paket va protokolga misol keltiraman',
          'TCP bilan UDP qachon ishlatilishini ayta olaman',
        ]}
      />

      <Block tone="blue" title="Tarmoq — nima?">
        <Callout kind="note" title="Qisqa taʼrif">
          <strong>Tarmoq</strong> — bir-biriga ulangan va bir tilda «gaplashadigan» qurilmalar. Shu til — kelishilgan qoidalar, yaʼni <Term en="protocol">protokol</Term>.
        </Callout>
      </Block>

      <Block tone="blue" title="Tarmoq bizga nima beradi?">
        <Grid cols={4}>
          <Card tone="teal" emoji="🖨️" title="Birga ishlatish">
            Bitta printer — butun sinf uchun.
          </Card>
          <Card tone="blue" emoji="📂" title="Fayl almashish">
            Oʻqituvchi faylni bir joyga qoʻyadi, hamma oladi.
          </Card>
          <Card tone="violet" emoji="🔑" title="Bitta joydan boshqarish">
            Login, parol va ruxsatlar bir joyda saqlanadi.
          </Card>
          <Card tone="amber" emoji="🌐" title="Umumiy xizmatlar">
            Sayt, pochta, bulut — hammasi tarmoq orqali.
          </Card>
        </Grid>
      </Block>

      <Block tone="blue" title="Ikki daraja: oʻxshatish va haqiqat" sub="Avval kundalik misol, keyin esa aslida nima boʻlayotgani.">
        <Accordion
          items={[
            {
              tag: '1-DARAJA',
              title: '🗣️ Sinfdagi suhbat',
              content: (
                <>
                  <p>30 oʻquvchi bir vaqtda gapirsa, hech kim hech narsani eshitmaydi. Gaplashish uchun uch narsa kerak: <strong>kimga</strong> aytyapsiz, <strong>navbat</strong> kimda va <strong>qaysi tilda</strong> gapirasiz.</p>
                </>
              ),
            },
            {
              tag: '2-DARAJA',
              title: '💡 Aslida nima boʻladi',
              content: (
                <>
                  <p>Kompyuterlarda ham xuddi shunday: manzil, navbat va til kerak. Bu uchtasi protokolda yozilgan. Eng koʻp ishlatiladigan protokollar oilasi — <Mono>TCP/IP</Mono>.</p>
                </>
              ),
            },
          ]}
        />
      </Block>

      <Block tone="blue" title="Toʻrtta tayanch soʻz">
        <DataTable
          head={['Soʻz', 'Nimani bildiradi', 'Maktabdagi misol']}
          rows={[
            [<strong>Tugun</strong>, 'Tarmoqqa ulangan har qanday qurilma', 'Kompyuter, printer, kamera, telefon'],
            [<strong>Kanal</strong>, 'Qurilmalarni bogʻlovchi yoʻl', 'Tarmoq kabeli yoki Wi-Fi'],
            [<strong>Paket</strong>, 'Maʼlumotning kichik boʻlagi', 'Rasm 4 ta paketga boʻlinib ketadi'],
            [<Term en="protocol">Protokol</Term>, 'Qurilmalar kelishgan qoidalar', 'TCP/IP — eng keng tarqalgani'],
          ]}
        />
        <div className="mt-4">
          <PaketChizma />
        </div>
      </Block>

      <Block tone="blue" title="Paket toʻrt bosqichdan oʻtadi" sub="Pochta bilan taqqoslang — tartib bir xil.">
        <DataTable
          head={['Bosqich', 'Nima qiladi', 'Pochtaga oʻxshatsak']}
          rows={[
            [<strong>Amaliy</strong>, 'Dastur maʼlumotni tayyorlaydi', 'Xatni yozyapsiz'],
            [<strong>Transport</strong>, 'Qaysi dasturga borishini belgilaydi', 'Kimga: «9-A sinf, Ali»'],
            [<strong>Internet</strong>, 'Manzilni yozadi va yoʻlni topadi', 'Konvertdagi shahar va uy manzili'],
            [<strong>Kanal</strong>, 'Keyingi qurilmaga jismonan uzatadi', 'Pochtachi xatni qoʻlga oladi'],
          ]}
        />
        <Callout kind="info" title="Esda tuting" className="mt-4">
          Har bir bosqich paketga oʻz yozuvini qoʻshadi. Qabul qiluvchi tomonda bu yozuvlar teskari tartibda ochiladi.
        </Callout>
      </Block>

      <Block tone="blue" title="TCP yoki UDP?" sub="Savol bitta: toʻliqlik muhimmi yoki tezlik?">
        <DataTable
          head={['Savol', 'TCP', 'UDP']}
          rows={[
            [<strong>Paket yoʻqolsa?</strong>, 'Qayta yuboriladi ✅', 'Qayta yuborilmaydi ❌'],
            [<strong>Tezligi?</strong>, 'Sekinroq — tekshiradi', 'Juda tez'],
            [<strong>Qayerda?</strong>, 'Sayt, fayl, pochta', 'Video, qoʻngʻiroq, oʻyin'],
          ]}
        />
        <Callout kind="note" title="Oson eslash" className="mt-4">
          TCP — buyurtma xat: yetib borgani tasdiqlanadi. UDP — otilgan qogʻoz samolyotcha: tez uchadi, lekin yetib bordimi — bilinmaydi.
        </Callout>
      </Block>

      <Block tone="blue" title="Mijoz–server va tengdosh tarmoq">
        <Grid cols={2}>
          <Card tone="blue" icon={Users} title="🏪 Mijoz–server">
            Bitta kompyuter xizmat koʻrsatadi (server), qolganlari soʻraydi (mijoz). Maktab tarmogʻi odatda shunday.
          </Card>
          <Card tone="teal" icon={Repeat} title="🤝 Tengdosh (P2P)">
            Hamma teng: har biri ham soʻraydi, ham beradi. Markaziy server shart emas.
          </Card>
        </Grid>
        <Callout kind="success" title="Muhim" className="mt-4">
          Server — alohida qurilma turi emas, <strong>rol</strong>. Boshqalarga xizmat qilsa, oddiy kompyuter ham server boʻladi.
        </Callout>
      </Block>

      <LifeExample>
        Kutubxonada noutbukdan kitob katalogini ochdingiz. Noutbuk (<strong>tugun</strong>) Wi-Fi (<strong>kanal</strong>) orqali soʻrovni <strong>paketlarga</strong> boʻlib yuboradi — sahifa toʻliq kelishi kerak, shuning uchun TCP ishlaydi. Yoningizdagi oʻquvchi videoqoʻngʻiroqda: tasvir bir lahza qotadi-yu, suhbat davom etadi — bu UDP.
      </LifeExample>

      <Takeaway
        items={[
          'Tarmoq — shunchaki kabellar emas, umumiy qoidalar boʻyicha ishlaydigan aloqa.',
          'Toʻrtta tayanch soʻz: tugun, kanal, paket, protokol.',
          'Katta fayl kichik paketlarga boʻlinib yuboriladi.',
          'TCP — ishonchli, UDP — tez. Server esa qurilma emas, rol.',
        ]}
      />

      <MiniTask
        questions={[
          {
            q: 'Onlayn darsda tasvir bir lahza qotdi va davom etdi. Yoʻqolgan qism qayta koʻrsatilmadi. Bu qaysi protokol?',
            options: [
              'TCP — yoʻqolgan paketni qayta yuboradi',
              'UDP — tezlik muhim, yoʻqolgani qayta yuborilmaydi',
              'DNS — sayt nomi topilmadi',
              'Wi-Fi — kabel uzildi',
            ],
            correct: 1,
            explain: 'Jonli videoda kechikkan paketning foydasi yoʻq, shuning uchun UDP ishlatiladi. TCP boʻlsa, tasvir toʻxtab, yoʻqolgan qismni kutib turardi.',
          },
          {
            q: 'Oʻqituvchi oddiy kompyuterda umumiy papka ochdi, sinf esa undan fayl oladi. Oʻqituvchi kompyuteri qanday rolda?',
            options: ['Mijoz', 'Router', 'Server', 'Wi-Fi nuqtasi'],
            correct: 2,
            explain: 'Server — rol, qurilma turi emas. Boshqalarga xizmat qilayotgan har qanday kompyuter server boʻladi.',
          },
          {
            q: 'Katta rasmni doʻstingizga yubordingiz. U yoʻlda nimaga boʻlinadi?',
            options: ['Paketlarga', 'Kanallarga', 'Tugunlarga', 'Protokollarga'],
            correct: 0,
            explain: 'Katta fayl kichik paketlarga boʻlinib yuboriladi va qabul qiluvchida yana bir butun boʻlib yigʻiladi.',
          },
        ]}
      />
    </>
  )
}
