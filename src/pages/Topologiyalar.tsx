import {
  PageHeader, Goal, Block, Grid, Card, Callout, Pill, DataTable, LifeExample, Takeaway, MiniTask, Term,
} from '../components/ui'
import TopologyExplorer from '../sims/TopologyExplorer'

export default function Topologiyalar() {
  return (
    <>
      <PageHeader
        no="05"
        tone="teal"
        eyebrow="Interaktiv koʻrgazma"
        title="Qurilmalarni qanday ulaymiz?"
        lead={<>Qurilmalarning ulanish shakli — <Term en="topology">topologiya</Term>. Bitta savol hammasini hal qiladi: <strong>bitta kabel uzilsa, nima boʻladi?</strong></>}
      />

      <Goal
        items={[
          'Toʻrt topologiyani sxemasiga qarab tanib olaman',
          'Bitta kabel uzilsa nima boʻlishini oldindan ayta olaman',
          'Vaziyatga mos topologiyani tanlab, sababini aytaman',
        ]}
      />

      <Block tone="teal" title="Toʻrt asosiy shakl">
        <Grid cols={4}>
          <Card tone="teal" tag={<Pill tone="teal">star</Pill>} title="⭐ Yulduz">
            Hamma bitta markaziy switchga ulanadi.
          </Card>
          <Card tone="slate" tag={<Pill tone="slate">bus</Pill>} title="➖ Shina">
            Hamma bitta uzun kabelga ulanadi.
          </Card>
          <Card tone="amber" tag={<Pill tone="amber">ring</Pill>} title="🔄 Halqa">
            Har biri ikki qoʻshnisiga ulanadi, maʼlumot doira boʻylab yuradi.
          </Card>
          <Card tone="violet" tag={<Pill tone="violet">mesh</Pill>} title="🕸️ Toʻr">
            Koʻp yoʻl bor — biri uzilsa, boshqasi ishlaydi.
          </Card>
        </Grid>
        <Callout kind="note" title="Avval oʻzingiz taxmin qiling" className="mt-4">
          Simulyatorni bosishdan oldin daftaringizga yozib qoʻying: har bir shaklda bitta kabel uzilsa, nechta qurilma aloqasiz qoladi?
        </Callout>
      </Block>

      <Block
        tone="teal"
        title="Sinab koʻring: kabelni uzamiz"
        sub={<>Shaklni tanlang, soʻng <strong>«Aloqani uzish»</strong> tugmasini bosing.</>}
      >
        <TopologyExplorer />
      </Block>

      <Block tone="teal" title="Toʻrttasini taqqoslaymiz">
        <DataTable
          head={['Shakl', 'Kabel', 'Bitta uzilish', 'Bugun qayerda?']}
          rows={[
            [<strong>⭐ Yulduz</strong>, 'Oʻrtacha', '1 ta qurilma uziladi ✅', 'Maktab, ofis, uy — hamma joyda'],
            [<strong>➖ Shina</strong>, 'Eng kam', 'Tarmoq ikkiga boʻlinadi ❌', 'Ishlatilmaydi — eski usul'],
            [<strong>🔄 Halqa</strong>, 'Kam', 'Butun halqa toʻxtaydi ❌', 'Operatorlarning optik yoʻllarida'],
            [<strong>🕸️ Toʻr</strong>, 'Eng koʻp', 'Hech kim uzilmaydi ✅', 'Internet magistrallari, serverlar'],
          ]}
        />
        <Callout kind="info" title="Amalda shunday" className="mt-4">
          Koʻp binolarda «katta yulduz» ishlatiladi: har qavatning switchi markaziy switchga ulanadi. Eng muhim joylarga esa zaxira kabel tortiladi.
        </Callout>
      </Block>

      <LifeExample>
        Informatika xonasida 15 kompyuter bitta switchga ulangan — bu yulduz. Bir oʻquvchi stol ostidagi kabelni oyogʻi bilan uzdi: faqat oʻsha kompyuter tarmoqdan chiqdi, dars davom etdi. Ertasiga switchning quvvat bloki kuydi — butun xona tarmoqsiz qoldi. Xulosa: kabel uzilishi — kichik muammo, markaziy qurilma nosozligi — katta muammo.
      </LifeExample>

      <Takeaway
        items={[
          'Topologiya tarmoqning uzilishga chidamliligini belgilaydi.',
          'Yulduz — eng koʻp ishlatiladigani; zaif joyi markaziy switch.',
          'Shina va halqada bitta uzilish hammaga taʼsir qiladi.',
          'Toʻr — eng ishonchli, lekin eng qimmat.',
        ]}
      />

      <MiniTask
        questions={[
          {
            q: 'Yulduz ulangan sinfda 12-kompyuterning kabeli uzildi. Nima boʻladi?',
            options: [
              'Butun sinf tarmoqsiz qoladi',
              'Faqat 12-kompyuter uziladi',
              'Tarmoq ikkiga boʻlinadi',
              'Signal teskari aylanadi',
            ],
            correct: 1,
            explain: 'Yulduzda har qurilmaning oʻz kabeli bor, shuning uchun nosozlik bittasida qoladi. Tarmoqning boʻlinishi — shinaga xos holat.',
          },
          {
            q: 'Shifoxonada serverlar aloqasi bir daqiqa ham uzilmasligi kerak. Nima qilamiz?',
            options: [
              'Hammasini bitta uzun kabelga ulaymiz',
              'Halqa qilib ulaymiz',
              'Muhim joylarga zaxira kabel tortamiz — toʻr',
              'Bitta switchli yulduz qilamiz',
            ],
            correct: 2,
            explain: 'Uzilmasligi uchun muqobil yoʻl kerak. Biri uzilsa, trafik ikkinchisidan ketadi.',
          },
          {
            q: 'Maktabga 40 kompyuter uchun yulduz tanlandi. Qaysi xavfni hisobga olish kerak?',
            options: [
              'Markaziy switch buzilsa, hamma toʻxtaydi',
              'Bitta kompyuter oʻchsa, qolganlari uziladi',
              'Tarmoq albatta sekin ishlaydi',
              'Yangi kompyuter qoʻshilmaydi',
            ],
            correct: 0,
            explain: 'Yulduzning zaif joyi — markaziy qurilma. Shuning uchun zaxira switch va uzluksiz quvvat manbai kerak.',
          },
        ]}
      />
    </>
  )
}
