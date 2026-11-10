import { Link } from 'react-router-dom'
import { Cloud, ShieldCheck, Split, TriangleAlert } from 'lucide-react'
import { PageHeader, Goal, Block, Grid, Card, Callout, StepList, DataTable, LifeExample, Takeaway } from '../components/ui'
import SchoolBuild from '../sims/SchoolBuild'

export default function Loyihalash() {
  return (
    <>
      <PageHeader no="07" tone="teal" eyebrow="Nazariya" title="Tarmoqni loyihalash bosqichlari"
        lead={<>Tarmoq kabel tortishdan boshlanmaydi. Avval <strong>nima kerakligi</strong> yozib olinadi. Keyin qurilma tanlanadi. 🧰</>} />

      <Goal items={[
        'Loyihaning 7 qadamini tartib bilan aytib bera olasiz',
        'Maktab tarmogʻini qaysi qurilmadan boshlab qurishni koʻrsatasiz',
        'Nega xavfsizlik birinchi kundan oʻylanishini tushuntirasiz',
      ]} />

      <Block title="7 qadam — 7 ta tayyor hujjat" tone="teal"
        sub={<>Tartib muhim. Har qadam oxirida kichik bir hujjat (jadval yoki chizma) qoladi.</>}>
        <StepList tone="teal" items={[
          { title: 'Nima kerakligini yozamiz', text: <>Nechta kompyuter? Printer, Wi-Fi, Internet kerakmi? 📝</>, result: 'Natija: talablar roʻyxati' },
          { title: 'Binoni oʻrganamiz', text: <>Xonalar, qavatlar, kabel oʻtadigan yoʻllar, rozetkalar.</>, result: 'Natija: bino chizmasi' },
          { title: 'Sxemani tanlaymiz', text: <>Qanday ulaymiz (koʻpincha yulduz) va tarmoqni qanday boʻlaklarga ajratamiz.</>, result: 'Natija: tarmoq sxemasi' },
          { title: 'Qurilma tanlaymiz', text: <>Switchda nechta port kerak? Tezlik qancha? Narxi qancha?</>, result: 'Natija: xarid roʻyxati' },
          { title: 'Manzillarni rejalaymiz', text: <>Kimga qanday IP manzil beriladi. Batafsil: <Link to="/ip">IP manzillash</Link>.</>, result: 'Natija: IP reja jadvali' },
          { title: 'Himoyani rejalaymiz', text: <>Firewall qoidalari, Wi-Fi paroli, zaxira nusxa, kim nimaga ruxsatli.</>, result: 'Natija: xavfsizlik rejasi' },
          { title: 'Oʻrnatamiz va sinab koʻramiz', text: <>Kabel tortiladi, qurilma sozlanadi, har nuqta tekshiriladi. Oxirida hujjatlar saqlanadi.</>, result: 'Natija: ishlaydigan tarmoq' },
        ]} />

        <Grid cols={2} className="mt-6">
          <Card tone="amber" icon={TriangleAlert} title="Eng qimmat xato">
            <p>Xavfsizlikni <strong>eng oxirida</strong> qoʻshish. Tarmoq boʻlaklarga ajratilmagan boʻlsa, keyin hammasini qaytadan qurish kerak boʻladi.</p>
          </Card>
          <Card tone="blue" emoji="🗂️" title="Kichik maslahat">
            <p>Har qadamni bitta varaqda yozib qoʻying. Keyin nosozlik chiqsa, shu varaq sizni tez qutqaradi.</p>
          </Card>
        </Grid>
      </Block>

      <Block title="Maktab tarmogʻini qadam-baqadam quramiz" tone="teal"
        sub={<>Tugmani bosib boring. Har qadamda bitta qurilma qoʻshiladi va nega shu joyda turishi aytiladi. 👇</>}>
        <SchoolBuild />

        <Grid cols={3} className="mt-6">
          <Card icon={Cloud} title="Nega Internetdan boshlanadi?">
            <p>Tashqi dunyoga chiqish nuqtasi birinchi aniqlanadi. Qolgan qurilmalar shunga qarab joylashadi.</p>
          </Card>
          <Card tone="amber" icon={ShieldCheck} title="Nega firewall chegarada?">
            <p>Qorovul maktab darvozasida turadi, koridorda emas. Firewall ham shunday — trafikni ichkariga kirishidan <strong>oldin</strong> tekshiradi. 🚪</p>
          </Card>
          <Card tone="violet" icon={Split} title="Nega boʻlaklarga ajratiladi?">
            <p>Oʻquv tarmogʻi, oʻqituvchilar va Wi-Fi alohida turadi. Bir joydagi muammo boshqasiga oʻtmaydi.</p>
          </Card>
        </Grid>

        <Callout kind="note" title="Avval qogʻozda" className="mt-4">
          Simulyator qurilish tartibini koʻrsatadi. Lekin bunga qadar 1–6 qadam qogʻozda bajarilgan boʻladi.
        </Callout>
      </Block>

      <Block title="Qisqa xulosa jadvali" tone="teal">
        <DataTable dense
          head={['Qadam', 'Nima qilinadi', 'Qoʻlda qoladigan hujjat']}
          rows={[
            ['1', 'Nima kerakligini yozamiz', 'Talablar roʻyxati'],
            ['2', 'Binoni oʻrganamiz', 'Bino chizmasi'],
            ['3', 'Sxemani tanlaymiz', 'Tarmoq sxemasi'],
            ['4', 'Qurilma tanlaymiz', 'Xarid roʻyxati'],
            ['5', 'Manzillarni rejalaymiz', 'IP reja jadvali'],
            ['6', 'Himoyani rejalaymiz', 'Xavfsizlik rejasi'],
            ['7', 'Oʻrnatamiz va sinaymiz', 'Ishlaydigan tarmoq'],
          ]} />
      </Block>

      <LifeExample>
        <p>Maktab yangi informatika xonasiga 20 ta kompyuter oldi. Tarmoq uchun esa «yetadi» deb 16 portli switch sotib olindi. 😕</p>
        <p>Oʻrnatish kuni portlar yetmay qoldi: printer va oʻqituvchi kompyuteriga joy qolmadi. Agar 1-qadamda sanab chiqilganida (20 + printer + oʻqituvchi + router = 23 ta ulanish), 24 portli switch olinardi. Bir varaq hisob — ikkinchi xariddan arzon.</p>
      </LifeExample>

      <Takeaway items={[
        <>Loyiha qurilmadan emas, <strong>talablardan</strong> boshlanadi.</>,
        <>Har qadam oxirida bitta hujjat qoladi: roʻyxat → chizma → sxema → xarid → IP reja → himoya rejasi.</>,
        <>Tarmoq Internetdan boshlab quriladi: Internet → modem → firewall → router → switch → boʻlaklar.</>,
        <>Xavfsizlik oxirgi qadam emas — u <strong>birinchi kundan</strong> oʻylanadi.</>,
      ]} />


    </>
  )
}
