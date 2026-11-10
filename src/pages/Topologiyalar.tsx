import {
  PageHeader, Goal, Block, Grid, Card, Callout, Pill, DataTable, LifeExample, Takeaway, MiniTask,
} from '../components/ui'
import TopologyExplorer from '../sims/TopologyExplorer'

export default function Topologiyalar() {
  return (
    <>
      <PageHeader
        no="05"
        tone="teal"
        eyebrow="Interaktiv koʻrgazma"
        title="Tarmoq topologiyalari"
        lead={<>Topologiya — qurilmalarning <em>qanday joylashgani va oʻzaro ulangani</em>. Bu shunchaki nazariy savol emas: topologiya tarmoqning nosozlikka chidamliligini toʻgʻridan-toʻgʻri belgilaydi. Asosiy savol: bitta kabel uzilsa, nima boʻladi?</>}
      />

      <Goal
        items={[
          'Yulduz, shina, halqa va toʻr topologiyalarini sxemasiga qarab tanish',
          'Bitta kabel uzilganda har bir topologiyada nima boʻlishini bashorat qilish va simulyatsiyada tekshirish',
          'Vaziyatga mos topologiyani kabel sarfi va ishonchlilik boʻyicha asoslab tanlash',
        ]}
      />

      <Block
        tone="teal"
        title="Toʻrt asosiy topologiya"
        sub="Har bir topologiya ikki savolga turlicha javob beradi: qancha kabel kerak va bitta nosozlik nechta qurilmaga taʼsir qiladi."
      >
        <Grid cols={4}>
          <Card tone="teal" tag={<Pill tone="teal">star</Pill>} title="Yulduz">
            Har bir qurilma markaziy qurilmaga (switchga) alohida kabel bilan ulanadi.
          </Card>
          <Card tone="slate" tag={<Pill tone="slate">bus</Pill>} title="Shina">
            Barcha qurilmalar bitta umumiy magistral kabelga ulanadi.
          </Card>
          <Card tone="amber" tag={<Pill tone="amber">ring</Pill>} title="Halqa">
            Har bir qurilma ikki qoʻshnisiga ulanadi; maʼlumot doira boʻylab aylanadi.
          </Card>
          <Card tone="violet" tag={<Pill tone="violet">mesh</Pill>} title="Toʻr">
            Qurilmalar oʻzaro bir nechta yoʻl bilan bogʻlanadi; har doim muqobil yoʻl bor.
          </Card>
        </Grid>
        <Callout kind="note" title="Avval bashorat qiling" className="mt-4">
          Simulyatorni ishga tushirishdan oldin oʻzingizdan soʻrang: har bir topologiyada bitta kabel uzilsa, nechta qurilma aloqasiz qoladi? Javobingizni yozib qoʻying, keyin tekshiring.
        </Callout>
      </Block>

      <Block
        tone="teal"
        title="Bitta kabel uzilsa nima boʻladi?"
        sub={<>Topologiyani tanlang, soʻng <strong>«Aloqani uzish»</strong> tugmasini bosib, natijani kuzating.</>}
      >
        <TopologyExplorer />
      </Block>

      <Block tone="teal" title="Toʻrt topologiya taqqosi" sub="Kabel sarfi, nosozlikka chidamlilik va bugungi qoʻllanilishi.">
        <DataTable
          head={['Topologiya', 'Kabel sarfi', 'Nosozlikka chidamlilik', 'Bugun qayerda ishlatiladi']}
          rows={[
            [
              <strong>Yulduz</strong>,
              'Oʻrtacha: har bir qurilmaga markazgacha alohida kabel',
              'Yaxshi: bitta kabel uzilsa, faqat bitta qurilma aloqasiz qoladi. Zaif nuqtasi — markaziy switch',
              'Deyarli barcha zamonaviy lokal tarmoqlar: maktab, ofis, uy',
            ],
            [
              <strong>Shina</strong>,
              'Eng kam: bitta magistral kabel',
              'Past: magistral bir joyda uzilsa, butun tarmoq boʻlinadi yoki toʻxtaydi',
              'Amalda ishlatilmaydi — eski koaksial Ethernet tarmoqlarida qoʻllangan',
            ],
            [
              <strong>Halqa</strong>,
              'Kam: har bir qurilmadan ikki qoʻshnisiga',
              'Past: bir yoʻnalishli halqada bitta uzilish hammani toʻxtatadi. Qoʻsh halqada zaxira yoʻl bor',
              'Lokal tarmoqlarda deyarli uchramaydi; operatorlarning optik magistrallarida zaxirali halqa sifatida qoʻllanadi',
            ],
            [
              <strong>Toʻr</strong>,
              'Eng koʻp: toʻliq toʻrda 5 ta qurilma uchun 10 ta kanal',
              'Eng yuqori: kanal uzilsa, trafik muqobil yoʻldan ketadi',
              'Internet magistrallari, provayder va maʼlumot markazlari tarmoqlari, simsiz mesh tizimlar — odatda qismiy toʻr',
            ],
          ]}
        />
        <Callout kind="info" title="Amaliyotda" className="mt-4">
          Zamonaviy bino tarmogʻi koʻpincha «kengaytirilgan yulduz» boʻladi: har bir qavatdagi switch markaziy switchga ulanadi. Eng muhim kanallar — markaziy switchlar, serverlar va internetga chiqish — zaxira yoʻl bilan, yaʼni qismiy toʻr koʻrinishida ulanadi.
        </Callout>
      </Block>

      <LifeExample>
        Informatika xonasida 15 ta kompyuter bitta switchga ulangan — bu yulduz. Dars paytida bir oʻquvchi stol ostidagi kabelni oyogʻi bilan uzib yubordi: faqat oʻsha kompyuter tarmoqdan chiqdi, dars davom etdi. Ertasi kuni esa switchning quvvat bloki kuyib qoldi — butun xona tarmoqsiz qoldi. Xulosa: yulduzda kabel uzilishi kichik muammo, markaziy qurilmaning nosozligi esa katta muammo. Shuning uchun maktabda zaxira switch saqlanadi, muhim joylarda esa zaxira kanal tortiladi.
      </LifeExample>

      <Takeaway
        items={[
          'Topologiya tarmoqning nosozlikka chidamliligi va kabel sarfini belgilaydi.',
          'Yulduz — bugungi lokal tarmoqlarning asosi: bitta kabel uzilsa, bitta qurilma aloqasiz qoladi; zaif nuqtasi — markaziy switch.',
          'Shina va bir yoʻnalishli halqada bitta uzilish butun tarmoqqa taʼsir qiladi — shu sababli ular lokal tarmoqlarda qoʻllanmay qoʻygan.',
          'Toʻr — eng ishonchli va eng qimmat; amalda muhim kanallar uchun qismiy toʻr tanlanadi.',
        ]}
      />

      <MiniTask
        questions={[
          {
            q: 'Yulduz topologiyali sinfda 12-kompyuterning tarmoq kabeli uzildi. Nima boʻladi?',
            options: [
              'Butun sinf tarmoqsiz qoladi',
              'Faqat 12-kompyuter aloqasiz qoladi',
              'Tarmoq ikki boʻlakka boʻlinadi',
              'Signal teskari yoʻnalishda aylana boshlaydi',
            ],
            correct: 1,
            explain: 'Yulduzda har bir qurilma switchga alohida kabel bilan ulangan, shuning uchun nosozlik faqat bitta qurilmaga taʼsir qiladi. Tarmoqning boʻlinishi — shinaga xos holat.',
          },
          {
            q: 'Shifoxonada serverlar va markaziy switchlar orasidagi aloqa bir daqiqa ham uzilmasligi kerak. Qaysi yechim eng mos?',
            options: [
              'Hammasini bitta shina kabeliga ulash',
              'Bir yoʻnalishli halqa qurish',
              'Muhim tugunlarni zaxira kanallar bilan ulash — qismiy toʻr',
              'Bitta switchli oddiy yulduz qurish',
            ],
            correct: 2,
            explain: 'Uzluksizlik uchun muqobil yoʻl zarur. Qismiy toʻrda muhim tugunlar orasida zaxira kanal boʻladi: biri uzilsa, trafik ikkinchisidan ketadi. Oddiy yulduzda esa bitta switch — yagona nosozlik nuqtasi.',
          },
          {
            q: 'Maktabda 40 ta kompyuter uchun yulduz topologiyasi tanlandi. Loyihada qaysi xavf alohida hisobga olinishi kerak?',
            options: [
              'Markaziy switch ishdan chiqsa, butun tarmoq toʻxtaydi',
              'Bitta kompyuter oʻchirilsa, qolganlari ham uziladi',
              'Maʼlumotlar toʻqnashuvi sababli tarmoq juda sekin ishlaydi',
              'Yangi kompyuter qoʻshish uchun tarmoqni toʻxtatish kerak boʻladi',
            ],
            correct: 0,
            explain: 'Yulduzning zaif nuqtasi — markaziy qurilma. Shuning uchun loyihada zaxira switch, uzluksiz quvvat manbai va muhim kanallar uchun zaxira ulanish koʻzda tutiladi.',
          },
        ]}
      />
    </>
  )
}
