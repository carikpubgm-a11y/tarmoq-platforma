import { Block, Callout, Goal, LifeExample, PageHeader, StepList, Takeaway } from '../components/ui'
import FirewallLab from '../lab/FirewallLab'

export default function LabFirewall() {
  return (
    <>
      <PageHeader no="11.1" tone="green" eyebrow="Interaktiv laboratoriya" title="Firewall laboratoriyasi"
        lead={<>Firewall — tarmoq eshigidagi qorovul. Siz unga qoida yozasiz: nimani oʻtkazsin, nimani toʻxtatsin. Keyin xabar yuborib, qorovul qanday ishlaganini koʻrasiz.</>} />
      <Goal items={[
        'Ruxsat va taqiq qoidalarini yozish',
        'Qoidalar tartibi natijani qanday oʻzgartirishini koʻrish',
        '«Qolgan hammasi — taqiq» qoidasini sinab koʻrish',
      ]} />

      <Callout kind="info" title="Eng muhim qoida" className="mb-8">
        Firewall qoidalarni <strong>yuqoridan pastga</strong> oʻqiydi va <strong>birinchi mos kelganini</strong> bajaradi. Qolganlarini hatto koʻrmaydi ham.
      </Callout>

      <Block title="Tajriba" tone="green" sub="Boshida qoida yoʻq — hamma narsa oʻtib ketadi. Toʻrt vazifani bajaring.">
        <FirewallLab />
      </Block>

      <Block title="Qorovul qanday qaror qiladi?" tone="blue">
        <StepList items={[
          { title: 'Xabarni koʻradi', text: 'Qayerdan, qayerga va nima uchun kelganini oʻqiydi.' },
          { title: 'Qoidalarni yuqoridan pastga tekshiradi', text: <>Birinchi mos kelgan qoida bajariladi — shuning uchun <strong>aniq qoidalar yuqorida</strong> turishi kerak.</> },
          { title: 'Mos qoida boʻlmasa — «qolgan hammasi»', text: 'Xavfsiz tarmoqda u doim «taqiq»: ruxsat berilmagan narsa oʻtmaydi.' },
        ]} />
        <Callout kind="warn" title="Nega «qolgan hammasi — ruxsat» xavfli?" className="mt-4">
          Yangi, hech kim bilmagan dastur avtomatik oʻtib ketadi — uni hech kim taqiqlamagan. «Taqiq» holatida esa har bir ruxsat ongli qaror boʻladi.
        </Callout>
      </Block>

      <LifeExample>
        Kompyuter xonasida saytlar ochiladi, lekin oʻyin serverlari va torrent ishlamaydi. Sababi — eshikdagi firewall: saytlar uchun kerakli portlar ochiq, qolgan hammasi yopiq. Tashqaridan esa xona kompyuterlariga umuman ulanib boʻlmaydi.
      </LifeExample>

      <Takeaway items={[
        'Qoidalar tartibi muhim: birinchi mos kelgani ishlaydi.',
        'Oxirgi qoida — «qolgan hammasi taqiqlanadi».',
        'Firewall — himoyaning bir qatlami, yolgʻiz yechim emas.',
      ]} />


    </>
  )
}
