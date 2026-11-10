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
        lead={<>Har bir qurilma tarmoqda bitta aniq vazifani bajaradi. Qurilmani bosing — vazifasi, ishlash qatlami va <strong>eng koʻp chalkashtiriladigan jihati</strong> ochiladi.</>}
      />

      <Goal
        items={[
          'Toʻqqizta asosiy tarmoq qurilmasining vazifasini aytib berish',
          'Switch va router farqini sababi bilan tushuntirish: MAC va IP, bitta tarmoq ichi va tarmoqlar orasi',
          'Modem, router va access pointni bir-biridan ajratish',
          'Berilgan vaziyat uchun kerakli qurilmani tanlash',
        ]}
      />

      <Block
        tone="teal"
        title="Qurilmalar uch guruhga boʻlinadi"
        sub="Qurilmani yodlash oʻrniga, avval u qaysi guruhga kirishini aniqlang: maʼlumotni yaratadimi, uzatadimi yoki tekshiradimi?"
      >
        <Grid cols={3}>
          <Card tone="blue" icon={Monitor} title="Oxirgi qurilmalar">
            Maʼlumot ulardan chiqadi va ularga keladi: kompyuter, noutbuk, printer, server. Tarmoq aynan shu <Term en="end device">oxirgi qurilmalar</Term> uchun quriladi.
          </Card>
          <Card tone="teal" icon={ArrowLeftRight} title="Oraliq qurilmalar">
            Maʼlumotni manzilga yetkazadi: switch — bitta tarmoq ichida, router — tarmoqlar orasida, access point — simsiz mijozlar uchun, modem — operator liniyasida.
          </Card>
          <Card tone="violet" icon={ShieldCheck} title="Himoya qurilmasi">
            Firewall trafikni qoidalar boʻyicha tekshiradi: ruxsat etilganini oʻtkazadi, qolganini toʻxtatadi. U tarmoq chegarasida turadi.
          </Card>
        </Grid>
      </Block>

      <Block
        tone="teal"
        title="Qurilma eksploreri"
        sub="Sxemada qurilmaning tarmoqdagi oʻrni, kartada esa uning vazifasi koʻrsatilgan."
      >
        <DeviceExplorer />
      </Block>

      <Block
        tone="teal"
        title="Switch va router: asosiy farq"
        sub="Mavzuning oʻzagi shu jadvalda: ikkala qurilma ham maʼlumotni uzatadi, lekin turli manzilga qarab va turli chegarada."
      >
        <DataTable
          head={['Mezon', 'Switch', 'Router']}
          rows={[
            [<strong>Vazifasi</strong>, 'Bitta tarmoq ichidagi qurilmalarni oʻzaro bogʻlaydi', 'Turli tarmoqlarni bir-biri bilan va internet bilan bogʻlaydi'],
            [<strong>Qaysi manzilga qaraydi</strong>, 'MAC-manzil', 'IP-manzil'],
            [<strong>Ishlash qatlami</strong>, 'OSI 2-qatlam (kanal)', 'OSI 3-qatlam (tarmoq)'],
            [<strong>Nimani uzatadi</strong>, 'Ramka (frame)', 'Paket'],
            [<strong>Jadvali</strong>, 'MAC-manzillar jadvali — oʻzi oʻrganib tuzadi', 'Yoʻnaltirish jadvali — sozlanadi yoki protokol orqali toʻldiriladi'],
            [<strong>Portlari</strong>, 'Koʻp: 8, 24 yoki 48 ta', 'Kam; har bir port — alohida tarmoq'],
            [<strong>Qoʻshimcha vazifa</strong>, 'VLAN yordamida tarmoqni mantiqan boʻlish', 'NAT, koʻpincha DHCP va oddiy firewall'],
            [<strong>Maktabdagi oʻrni</strong>, 'Kompyuter xonasidagi qurilmalarni ulaydi', 'Maktab tarmogʻini internetga chiqaradi'],
          ]}
        />
        <Callout kind="info" title="Aniqlik" className="mt-4">
          «3-qatlamli switch» deb ataladigan qurilmalar ham bor — ular switch va router vazifasini birlashtiradi. Oddiy (2-qatlamli) switch esa IP-manzilga qaramaydi.
        </Callout>
      </Block>

      <Block tone="teal" title="Uchta eng koʻp uchraydigan xato" sub="Bu uch chalkashlik deyarli har bir sinfda uchraydi — ularni oldindan aytib oʻtish foydali.">
        <StepList
          tone="amber"
          items={[
            {
              title: '«Switch ham tarmoqlarni bogʻlaydi»',
              text: <>Yoʻq. Switch <em>bitta</em> tarmoq ichida ishlaydi. Turli IP-tarmoqlarni bogʻlash uchun router kerak.</>,
            },
            {
              title: '«Modem va router — bir narsa»',
              text: <>Yoʻq. Modem operator liniyasidagi signalni Ethernet signaliga aylantiradi; router esa tarmoqlar orasida yoʻnaltiradi. Uy qurilmalarida ular koʻpincha bitta qutiga joylashtirilgan — chalkashlik shundan.</>,
            },
            {
              title: '«Access point — bu router»',
              text: <>Yoʻq. Access point simsiz mijozlarni simli tarmoqqa ulaydi, xolos; yoʻnaltirish bilan shugʻullanmaydi.</>,
            },
          ]}
        />
      </Block>

      <LifeExample>
        Maktab kompyuter xonasiga 15 ta kompyuter va bitta printer oʻrnatildi. Ularni oʻzaro ulash uchun 24 portli <strong>switch</strong> yetarli — hammasi bitta tarmoqda. Xonani internetga chiqarish kerak boʻlganda esa <strong>router</strong> zarur: u maktab tarmogʻini provayder tarmogʻi bilan bogʻlaydi. Provayderning optik kabeli <strong>ONT</strong> qurilmasiga, undan chiqqan kabel routerga, router esa switchga ulanadi. Oʻqituvchilarning noutbuklari uchun shiftga <strong>access point</strong> oʻrnatiladi — u ham oʻsha switchga kabel bilan ulanadi.
      </LifeExample>

      <Takeaway
        items={[
          'Switch — bitta tarmoq ichida, MAC-manzil boʻyicha; router — tarmoqlar orasida, IP-manzil boʻyicha ishlaydi.',
          'Modem (ONT) signalni aylantiradi, access point simsiz mijozlarni ulaydi — ikkalasi ham yoʻnaltirmaydi.',
          'Uydagi «Wi-Fi router» — bitta qutidagi router, switch, access point va firewall.',
          'Server — qurilma turi emas, rol; firewall — trafikni qoidalar boʻyicha filtrlaydigan himoya.',
        ]}
      />

      <MiniTask
        questions={[
          {
            q: 'Kompyuter xonasida 12 ta kompyuter bor. Ular faqat oʻzaro fayl almashishi va bitta printerdan foydalanishi kerak; internet talab qilinmaydi. Qaysi qurilma yetarli?',
            options: ['Router', 'Switch', 'Modem', 'Firewall'],
            correct: 1,
            explain: 'Barcha qurilmalar bitta tarmoqda, shuning uchun ularni MAC-manzil boʻyicha bogʻlaydigan switch yetarli. Router faqat boshqa tarmoqqa (masalan, internetga) chiqish kerak boʻlganda zarur.',
          },
          {
            q: 'Maktabda ikkita tarmoq bor: oʻquvchilar (192.168.10.0/24) va maʼmuriyat (192.168.20.0/24). Ular orasida nazorat ostida aloqa oʻrnatish kerak. Buning uchun nima zarur?',
            options: [
              'Yana bitta oddiy switch',
              'Access point',
              'Router yoki 3-qatlamli switch',
              'Modem',
            ],
            correct: 2,
            explain: 'Bular ikki xil IP-tarmoq. Ular orasida paketlarni faqat IP-manzil boʻyicha ishlaydigan qurilma — router yoki 3-qatlamli switch — yoʻnaltira oladi. Oddiy switch IP-manzilga qaramaydi.',
          },
          {
            q: 'Majlislar zalida Wi-Fi signali yetmayapti, lekin devorda ishlab turgan tarmoq rozetkasi (Ethernet) bor. Nimani oʻrnatish toʻgʻri?',
            options: ['Access point', 'Modem', 'Yana bitta router', 'Server'],
            correct: 0,
            explain: 'Access point simsiz mijozlarni mavjud simli tarmoqqa ulaydi — aynan shu kerak. Qoʻshimcha router esa keraksiz ikkinchi tarmoq hosil qiladi va sozlashni murakkablashtiradi.',
          },
        ]}
      />
    </>
  )
}
