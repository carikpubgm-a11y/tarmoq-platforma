import { ArrowLeftRight, Monitor, ShieldCheck } from 'lucide-react'
import {
  PageHeader, Goal, Block, Grid, Card, Callout, Term, DataTable, StepList, LifeExample, Takeaway, MiniTask,
} from '../components/ui'
import DeviceExplorer from '../sims/DeviceExplorer'

export default function Qurilmalar() {
  return (
    <>
      <PageHeader
        no="06"
        tone="teal"
        eyebrow="Interaktiv"
        title="Tarmoq qurilmalari"
        lead={<>Har bir qurilma bitta vazifani bajaradi. Sxemadagi qurilmani bosing — vazifasi va eng koʻp chalkashtiriladigan jihati ochiladi.</>}
      />

      <Goal
        items={[
          'Switch bilan routerning farqini sababi bilan ayta olaman',
          'Modem, router va Wi-Fi nuqtasini bir-biridan ajrataman',
          'Berilgan vaziyat uchun kerakli qurilmani tanlayman',
        ]}
      />

      <Block
        tone="teal"
        title="Avval guruhini aniqlang"
        sub="Yodlash oʻrniga bitta savol bering: bu qurilma maʼlumotni yaratadimi, uzatadimi yoki tekshiradimi?"
      >
        <Grid cols={3}>
          <Card tone="blue" icon={Monitor} title="💻 Oxirgi qurilmalar">
            Maʼlumot ulardan chiqadi va ularga keladi: kompyuter, telefon, printer, server. Tarmoq aynan shular uchun quriladi.
          </Card>
          <Card tone="teal" icon={ArrowLeftRight} title="🔀 Oraliq qurilmalar">
            Maʼlumotni manzilga yetkazadi: switch, router, Wi-Fi nuqtasi, modem.
          </Card>
          <Card tone="violet" icon={ShieldCheck} title="🛡️ Himoya qurilmasi">
            Firewall tarmoq chegarasida turadi: ruxsat etilganini oʻtkazadi, qolganini toʻxtatadi.
          </Card>
        </Grid>
      </Block>

      <Block tone="teal" title="Qurilma eksploreri" sub="Sxemadan yoki pastdagi kartadan qurilmani tanlang.">
        <DeviceExplorer />
      </Block>

      <Block
        tone="teal"
        title="Switch va router: asosiy farq"
        sub="Mavzuning eng muhim jadvali. Ikkalasi ham maʼlumotni uzatadi, lekin boshqa manzilga qarab."
      >
        <DataTable
          head={['Savol', '🔀 Switch', '🌐 Router']}
          rows={[
            [<strong>Nima qiladi?</strong>, 'Bitta tarmoq ichidagi qurilmalarni ulaydi', 'Ikki xil tarmoqni va internetni bogʻlaydi'],
            [<strong>Qaysi manzilga qaraydi?</strong>, 'MAC-manzil (qurilmaning tugʻma raqami)', <><Term en="IP address">IP-manzil</Term> (tarmoqdagi manzil)</>],
            [<strong>Portlari?</strong>, 'Koʻp: 8, 24 yoki 48 ta', 'Kam — har biri alohida tarmoq uchun'],
            [<strong>Maktabda qayerda?</strong>, 'Kompyuter xonasidagi qurilmalarni ulaydi', 'Maktabni internetga chiqaradi'],
          ]}
        />
        <Callout kind="info" title="Qisqa qoida" className="mt-4">
          Bitta tarmoq ichida — <strong>switch</strong>. Tarmoqdan tashqariga chiqish kerak boʻlsa — <strong>router</strong>.
        </Callout>
      </Block>

      <Block tone="teal" title="Uch eng koʻp uchraydigan xato">
        <StepList
          tone="amber"
          items={[
            {
              title: '❌ «Switch ham tarmoqlarni bogʻlaydi»',
              text: <>Yoʻq. Switch faqat <em>bitta</em> tarmoq ichida ishlaydi. Ikki tarmoqni bogʻlash — routerning ishi.</>,
            },
            {
              title: '❌ «Modem va router — bir narsa»',
              text: <>Yoʻq. Modem operator signalini oʻgiradi, router esa yoʻl koʻrsatadi. Uyda ular bitta qutida — chalkashlik shundan.</>,
            },
            {
              title: '❌ «Wi-Fi nuqtasi — bu router»',
              text: <>Yoʻq. Wi-Fi nuqtasi (access point) simsiz qurilmalarni simli tarmoqqa ulaydi, xolos.</>,
            },
          ]}
        />
      </Block>

      <LifeExample>
        Kompyuter xonasiga 15 kompyuter va printer oʻrnatildi. Ularni ulash uchun 24 portli <strong>switch</strong> yetarli — hammasi bitta tarmoqda. Internet kerak boʻlganda <strong>router</strong> qoʻshiladi: provayder kabeli <strong>ONT</strong> ga, undan routerga, routerdan switchga ulanadi. Oʻqituvchilar noutbuki uchun shiftga <strong>Wi-Fi nuqtasi</strong> oʻrnatiladi — u ham oʻsha switchga kabel bilan ulanadi.
      </LifeExample>

      <Takeaway
        items={[
          'Switch — bitta tarmoq ichida, MAC-manzil boʻyicha.',
          'Router — tarmoqlar orasida, IP-manzil boʻyicha.',
          'Modem signalni oʻgiradi, Wi-Fi nuqtasi simsiz ulaydi — ikkisi ham yoʻl koʻrsatmaydi.',
          'Uydagi «Wi-Fi router» — bitta qutidagi router, switch va Wi-Fi nuqtasi.',
        ]}
      />

      <MiniTask
        questions={[
          {
            q: '12 kompyuter faqat oʻzaro fayl almashishi va bitta printerdan foydalanishi kerak. Internet shart emas. Nima yetarli?',
            options: ['Router', 'Switch', 'Modem', 'Firewall'],
            correct: 1,
            explain: 'Hammasi bitta tarmoqda, shuning uchun switch yetarli. Router faqat boshqa tarmoqqa chiqish kerak boʻlganda zarur.',
          },
          {
            q: 'Maktabda ikki tarmoq bor: oʻquvchilar va maʼmuriyat. Ular orasida nazorat ostida aloqa kerak. Nima zarur?',
            options: [
              'Yana bitta switch',
              'Wi-Fi nuqtasi',
              'Router',
              'Modem',
            ],
            correct: 2,
            explain: 'Bular ikki xil IP-tarmoq. Ularni faqat IP-manzilga qaraydigan qurilma — router — bogʻlay oladi.',
          },
          {
            q: 'Majlislar zalida Wi-Fi yetmaydi, lekin devorda ishlaydigan tarmoq rozetkasi bor. Nima oʻrnatamiz?',
            options: ['Wi-Fi nuqtasi', 'Modem', 'Yana bitta router', 'Server'],
            correct: 0,
            explain: 'Wi-Fi nuqtasi simsiz qurilmalarni mavjud simli tarmoqqa ulaydi — aynan shu kerak. Qoʻshimcha router keraksiz ikkinchi tarmoq hosil qiladi.',
          },
        ]}
      />
    </>
  )
}
