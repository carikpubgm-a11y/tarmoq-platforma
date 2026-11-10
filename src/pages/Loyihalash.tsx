import { Link } from 'react-router-dom'
import { Cloud, PencilRuler, ShieldCheck, Split, TriangleAlert } from 'lucide-react'
import { PageHeader, Goal, Block, Grid, Card, Callout, StepList, LifeExample, Takeaway, MiniTask } from '../components/ui'
import SchoolBuild from '../sims/SchoolBuild'

export default function Loyihalash() {
  return (
    <>
      <PageHeader no="07" tone="teal" eyebrow="Nazariya" title="Tarmoqni loyihalash bosqichlari"
        lead={<>Tarmoq «kabel tortishdan» boshlanmaydi — u <strong>talablarni aniqlashdan</strong> boshlanadi. Yetti bosqichning har biri yozma natija bilan yakunlanadi, shunda har bir qaror asoslangan boʻladi.</>} />

      <Goal items={[
        'Tarmoqni loyihalashning yetti bosqichini toʻgʻri ketma-ketlikda aytib berish',
        'Har bir bosqich qanday yozma hujjat bilan yakunlanishini bilish',
        'Maktab tarmogʻi misolida qurilmalar va segmentlar joylashuvini asoslash',
        'Nega xavfsizlik oxirida emas, har bir bosqichda hisobga olinishini tushuntirish',
      ]} />

      <Block title="Yetti bosqich — yetti hujjat" tone="teal"
        sub={<>Ketma-ketlik aynan shu tartibda oʻrgatiladi. Aks holda oʻquvchi qurilmani ehtiyojga qarab emas, «chiroyli koʻringani» uchun tanlaydi.</>}>
        <StepList tone="teal" items={[
          {
            title: 'Talablarni aniqlash',
            text: <>Nechta foydalanuvchi boʻladi? Qanday xizmatlar kerak: fayl almashish, printer, Internet, kamera, elektron jurnal? Qanday oʻsish kutiladi? Xavfsizlik talablari qanday?</>,
            result: 'Natija: yozma texnik topshiriq',
          },
          {
            title: 'Hududni oʻrganish',
            text: <>Bino plani olinadi: xonalar, qavatlar, devor materiali, kabel yoʻllari, elektr nuqtalari. Simsiz qamrov uchun toʻsiqlar hisobga olinadi.</>,
            result: 'Natija: kabel va qamrov xaritasi',
          },
          {
            title: 'Topologiya va arxitekturani tanlash',
            text: <>Yulduz, halqa yoki aralash topologiyami? Bitta qavatmi yoki magistral bilan bogʻlangan bir necha qavatmi? Qaysi qismlar ajratilishi kerak (VLAN)? Nosozlikka chidamlilik darajasi qanday boʻlishi kerak?</>,
            result: 'Natija: mantiqiy va jismoniy sxema',
          },
          {
            title: 'Uskunani tanlash va hisoblash',
            text: <>Portlar soni, tezlik (1G/10G), PoE ehtiyoji (kamera va access point uchun), boshqariladigan (managed) switch kerakmi, zaxira quvvat (UPS) kerakmi? Har bir hisob-kitob yozma asoslanadi.</>,
            result: 'Natija: uskunalar roʻyxati va byudjet',
          },
          {
            title: 'IP manzillash va xizmatlarni rejalash',
            text: <>Manzil diapazonlari, subnetlar, VLAN raqamlari, DHCP doirasi, DNS, band qilingan manzillar (printer, kamera, server uchun). Bu bosqich koʻpincha eʼtibordan chetda qoladi — keyin manzillar «konflikti» koʻrinishida qaytadi. Batafsil: <Link to="/ip">IP manzillash va tarmoq xizmatlari</Link>.</>,
            result: 'Natija: IP reja jadvali',
          },
          {
            title: 'Xavfsizlikni loyihalash',
            text: <>Segmentatsiya, firewall qoidalari, foydalanuvchi huquqlari, Wi-Fi shifrlash, mehmon tarmogʻini ajratish, zaxira va monitoring rejasi.</>,
            result: 'Natija: xavfsizlik siyosati (yozma hujjat)',
          },
          {
            title: 'Oʻrnatish, sinov va hujjatlashtirish',
            text: <>Kabel tortiladi, qurilmalar ulanadi va sozlanadi, soʻng tekshiriladi: har bir nuqtadan ulanish, tezlik, Wi-Fi qamrovi, xavfsizlik qoidalari ishlayaptimi. Oxirida hujjatlar tayyorlanadi: sxema, IP jadval, parollarni saqlash tartibi, xizmat koʻrsatish rejasi.</>,
            result: 'Natija: ishlaydigan tarmoq va hujjatlar toʻplami',
          },
        ]} />

        <Grid cols={2} className="mt-6">
          <Card tone="amber" icon={TriangleAlert} title="Loyihalashdagi eng qimmat xato">
            <p>Xavfsizlikni <strong>oxirida</strong> qoʻshishga urinish. Tarmoq segmentlarga boʻlinmagan boʻlsa, keyinchalik firewall qoʻshish koʻp joyni qayta qurishni talab qiladi.</p>
            <p>Xavfsizlik — faqat 6-bosqich emas, <strong>barcha bosqichlardagi shart</strong>.</p>
          </Card>
          <Card tone="blue" icon={PencilRuler} title="Metodik maslahat">
            <p>Oʻquvchilardan har bir bosqichni <strong>hujjat bilan</strong> yakunlashni talab qiling — kichik jadval yoki chizma boʻlsa ham.</p>
            <p>Bu kelajakdagi mutaxassisning eng muhim koʻnikmasini shakllantiradi: <strong>qarorni yozma asoslash</strong>.</p>
          </Card>
        </Grid>
      </Block>

      <Block title="Namuna: maktab tarmogʻini bosqichma-bosqich qurish" tone="teal"
        sub={<>Ssenariy real loyihaga asoslangan: 20 kompyuterli xona, oʻqituvchilar xonasi, direktor xonasi, kutubxona, server xonasi va Wi-Fi hududi. Har bir qadamda bitta qurilma qoʻshiladi va nima uchun aynan shu joyda turishi izohlanadi.</>}>
        <SchoolBuild />

        <Grid cols={3} className="mt-6">
          <Card icon={Cloud} title="Nega provayderdan boshlanadi?">
            <p>Tashqi dunyoga chiqish nuqtasi — eng avval aniqlanishi kerak boʻlgan joy. Uning oʻrni qolgan barcha uskunaning joylashuvini belgilaydi.</p>
          </Card>
          <Card tone="amber" icon={ShieldCheck} title="Nega himoya chegarada?">
            <p>Firewall siyosati tarmoqning <strong>chegarasida</strong> bajarilishi kerak. Ayrim sxemalarda firewall routerdan oldin turadi, boshqalarida router bilan bitta qurilmaga birlashadi yoki oʻzi marshrutlaydi.</p>
            <p>Muhimi — trafik himoyalangan segmentlarga yetishidan oldin tekshiriladi.</p>
          </Card>
          <Card tone="violet" icon={Split} title="Nega segmentlarga boʻlinadi?">
            <p>Oʻquv tarmogʻi, maʼmuriyat va Wi-Fi — har biri alohida VLAN. Bitta segmentdagi muammo (virus, ortiqcha trafik) boshqalarga oʻtmaydi.</p>
          </Card>
        </Grid>

        <Callout kind="note" title="Loyiha va qurilish tartibi" className="mt-4">
          Simulyatsiya qurilish ketma-ketligini koʻrsatadi. Unga qadar yetti bosqichning dastlabki oltitasi qogʻozda bajarilgan boʻlishi kerak: qaysi qurilma qayerda turishi, nechta VLAN boʻlishi va ular orasidagi qoidalar oldindan hal qilinadi.
        </Callout>
      </Block>

      <LifeExample>
        <p>Maktab yangi informatika xonasi uchun 20 ta kompyuter oldi, tarmoq uchun esa «har ehtimolga qarshi» 16 portli oddiy switch xarid qilindi. Oʻrnatish kuni maʼlum boʻldi: portlar yetmaydi, printer va oʻqituvchi kompyuteriga joy yoʻq, switch esa VLAN ni qoʻllab-quvvatlamaydi — oʻquv tarmogʻini maʼmuriyatdan ajratib boʻlmaydi.</p>
        <p>Agar 1-bosqichda talablar yozilganida (20 kompyuter + printer + oʻqituvchi kompyuteri + routerga chiqish = 23 ta ulanish), 4-bosqichda kamida 24 portli boshqariladigan switch tanlangan boʻlar edi. Bir varaq hisob-kitob uskunani ikkinchi marta sotib olishdan arzon.</p>
      </LifeExample>

      <Takeaway items={[
        <>Loyihalash uskunadan emas, <strong>talablardan</strong> boshlanadi.</>,
        <>Har bir bosqich yozma hujjat bilan tugaydi: texnik topshiriq → qamrov xaritasi → sxema → uskunalar roʻyxati → IP reja → xavfsizlik siyosati → yakuniy hujjatlar.</>,
        <>Xavfsizlik alohida bosqich emas, <strong>barcha bosqichlardagi shart</strong>: segmentatsiya boshidan rejalashtiriladi.</>,
        <>Tarmoq provayderdan boshlab quriladi: Internet → modem → firewall → router → asosiy switch → VLAN segmentlari.</>,
      ]} />

      <MiniTask questions={[
        {
          q: 'Direktor: «Avval 24 portli switch sotib olaylik, qolganini keyin koʻramiz», — dedi. Loyihachi sifatida birinchi navbatda nima qilasiz?',
          options: [
            'Eng arzon switchni topib, darhol buyurtma beraman',
            'Talablarni aniqlayman: foydalanuvchilar soni, xizmatlar, oʻsish — va yozma texnik topshiriq tuzaman',
            'Kabel tortishni boshlayman, uskuna keyin tanlanadi',
            'Avval Wi-Fi parolini oʻylab topaman',
          ],
          correct: 1,
          explain: 'Loyihalash talablarni aniqlashdan boshlanadi. Portlar soni, PoE va VLAN ehtiyoji texnik topshiriqdan kelib chiqadi; aks holda uskunani qayta sotib olishga toʻgʻri keladi.',
        },
        {
          q: 'Tarmoq ishga tushgach, oʻquvchi kompyuteridan buxgalteriya papkasi koʻrinib qoldi. Bu qaysi bosqichlardagi kamchilik?',
          options: [
            '2-bosqich: devor materiali hisobga olinmagan',
            '4-bosqich: switchda portlar yetmagan',
            '7-bosqich: kabel notoʻgʻri tortilgan',
            '3- va 6-bosqich: segmentatsiya (VLAN) va kirish qoidalari rejalashtirilmagan',
          ],
          correct: 3,
          explain: 'Oʻquv tarmogʻi va maʼmuriyat alohida VLAN ga ajratilmagan, ular orasidagi qoidalar yozilmagan. Buni keyin tuzatish tarmoqning katta qismini qayta sozlashni talab qiladi.',
        },
        {
          q: 'Yangi printer ulangach, u bilan bitta kompyuter bir xil manzil olib qoldi va ikkalasi ham tarmoqdan uzilib turibdi. Qaysi hujjat buning oldini olar edi?',
          options: [
            'IP reja jadvali: statik manzillar DHCP doirasidan tashqarida belgilanadi',
            'Kabel va qamrov xaritasi',
            'Uskunalar roʻyxati va byudjet',
            'Bino plani',
          ],
          correct: 0,
          explain: '5-bosqich natijasi — IP reja jadvali. Unda qaysi manzillar statik berilishi va DHCP qaysi oraliqdan tarqatishi yoziladi, shunda manzillar toʻqnashmaydi.',
        },
      ]} />
    </>
  )
}
