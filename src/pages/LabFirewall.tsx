import { Block, Callout, Card, Goal, Grid, LifeExample, MiniTask, PageHeader, StepList, Takeaway, Term } from '../components/ui'
import FirewallLab from '../lab/FirewallLab'

export default function LabFirewall() {
  return (
    <>
      <PageHeader no="11.1" tone="green" eyebrow="Interaktiv laboratoriya" title="Firewall laboratoriyasi"
        lead={<><Term en="firewall">Tarmoqlararo ekran</Term> trafikni oldindan yozilgan qoidalar boʻyicha oʻtkazadi yoki toʻxtatadi. Bu yerda qoidalarni oʻzingiz tuzasiz va har bir paket taqdirini kuzatasiz.</>} />
      <Goal items={[
        'Ruxsat va taqiq qoidalarini yozish, ularning tartibi natijaga qanday taʼsir qilishini koʻrish',
        '«Standart taqiq» (default deny) tamoyilini amalda qoʻllash',
        'Ruxsat etilgan va bloklangan paketlarni jurnal orqali farqlash',
      ]} />

      <Block title="Tajriba" tone="green" sub="Boshlangʻich holatda qoida yoʻq va standart qoida «ruxsat» — yaʼni firewall hamma narsani oʻtkazyapti. Toʻrtta vazifani bajaring.">
        <FirewallLab />
      </Block>

      <Block title="Firewall qanday qaror qiladi?" tone="blue">
        <StepList items={[
          { title: 'Paket keladi', text: 'Firewall uning yoʻnalishini (qayerdan — qayerga), protokolini va port raqamini oʻqiydi.' },
          { title: 'Qoidalar yuqoridan pastga tekshiriladi', text: <>Birinchi mos kelgan qoida qoʻllanadi, qolganlari koʻrilmaydi. Shuning uchun <strong>aniq qoidalar umumiylaridan yuqorida</strong> turishi kerak.</> },
          { title: 'Hech biri mos kelmasa — standart qoida', text: <>Xavfsiz tarmoqda u doim «taqiq»: ruxsat berilmagan hamma narsa toʻxtatiladi (<Term en="default deny">standart taqiq</Term>).</> },
          { title: 'Natija jurnalga yoziladi', text: 'Qaysi paket qaysi qoida bilan oʻtgani yoki bloklangani keyinchalik hodisalarni tahlil qilish uchun saqlanadi.' },
        ]} />
        <Grid cols={2} className="mt-4">
          <Card tone="amber" title="Nega «standart ruxsat» xavfli?">
            <p>Yangi xizmat yoki zararli dastur paydo boʻlganda u avtomatik ochiq qoladi — chunki uni hech kim taqiqlamagan. «Standart taqiq»da esa har bir ruxsat ongli qaror boʻladi.</p>
          </Card>
          <Card tone="violet" title="Model nimani soddalashtiradi?">
            <p>Haqiqiy firewall ulanish holatini kuzatadi (<Term en="stateful">holatli</Term>): ichkaridan boshlangan soʻrovning javobi avtomatik oʻtkaziladi. Bu laboratoriyada faqat ulanishni <strong>boshlovchi</strong> paket koʻrib chiqiladi.</p>
          </Card>
        </Grid>
        <Callout kind="info" title="Firewall nima qila olmaydi" className="mt-4">
          Ruxsat etilgan kanal ichidagi hujumni toʻxtatmaydi: fishing havolasi oddiy HTTPS orqali keladi va qoidalarga toʻliq mos. Shuning uchun firewall autentifikatsiya, yangilanish va foydalanuvchi savodxonligi bilan birga ishlaydi.
        </Callout>
      </Block>

      <LifeExample>
        Universitet kompyuter xonasida talabalar veb-saytlarga kira oladi, lekin oʻyin serverlari va torrent ishlamaydi. Sababi — chegaradagi firewall: 80, 443 va 53-portlarga ruxsat berilgan, qolgan hamma narsa standart qoida bilan yopilgan. Tashqaridan esa xona kompyuterlariga umuman ulanib boʻlmaydi.
      </LifeExample>

      <Takeaway items={[
        'Qoidalar tartibi muhim: birinchi mos kelgani ishlaydi.',
        'Oxirgi qoida — standart taqiq: ruxsat berilmagan hamma narsa bloklanadi.',
        'Firewall — himoyaning bir qatlami, yagona yechim emas.',
      ]} />

      <MiniTask questions={[
        { q: 'Roʻyxatda 1-qoida «TAQIQ: istalgan xizmat, istalgan joydan istalgan joyga», 2-qoida «RUXSAT: HTTPS, LAN dan Internetga». Talaba HTTPS saytni ocha oladimi?',
          options: ['Ha, chunki 2-qoida aniqroq', 'Yoʻq, chunki birinchi mos kelgan qoida — taqiq', 'Ha, chunki ruxsat taqiqdan ustun', 'Faqat standart qoida «ruxsat» boʻlsa'], correct: 1,
          explain: 'Firewall qoidalarni yuqoridan pastga oʻqiydi va birinchi mos kelganida toʻxtaydi. Umumiy taqiq yuqorida tursa, pastdagi ruxsatga navbat yetmaydi — tartibni almashtirish kerak.' },
        { q: 'Maktab tarmogʻida yangi, hech kim eshitmagan dastur 6667-port orqali tashqariga ulanmoqchi. Qaysi sozlama uni avtomatik toʻxtatadi?',
          options: ['Antivirusni yangilash', 'Standart qoida «taqiq» boʻlishi', 'Wi-Fi parolini almashtirish', 'HTTP ga ruxsat berish'], correct: 1,
          explain: 'Standart taqiqda aniq ruxsat berilmagan har qanday trafik bloklanadi — nomaʼlum port uchun alohida qoida yozish shart emas.' },
      ]} />
    </>
  )
}
