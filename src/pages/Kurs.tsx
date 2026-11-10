import { BookOpen, Brain, Cog, Handshake, School, Target } from 'lucide-react'
import {
  PageHeader, Goal, Block, Grid, Card, Callout, Pill, DataTable, CheckList, KV, LifeExample, Takeaway, MiniTask,
} from '../components/ui'

export default function Kurs() {
  return (
    <>
      <PageHeader
        no="02"
        tone="blue"
        eyebrow="Kirish"
        title="Bu kursda nima oʻrganamiz?"
        lead={<>Maktabdagi elektron jurnal, Wi-Fi va kameralar — hammasi bitta tarmoqda ishlaydi. Shu tarmoq qanday qurilishini va qanday himoyalanishini oʻrganamiz.</>}
      />

      <Goal
        items={[
          'Tarmoq nega kerakligini ikki misol bilan aytib beraman',
          'Bu kursda nimani oʻrganishimni bilaman',
          'Dars oxirida oʻzimni qanday sinashimni bilaman',
        ]}
      />

      <Block tone="blue" title="Nega bu mavzu kerak?">
        <Grid cols={3}>
          <Card tone="teal" icon={School} title="🏫 Maktab tarmoqqa bogʻlangan">
            Elektron jurnal, onlayn darslik, Wi-Fi — barchasi tarmoq orqali ishlaydi. Tarmoq oʻchsa, dars ham toʻxtaydi.
          </Card>
          <Card tone="blue" icon={Target} title="🔓 Bitta zaif joy — hammaga xavf">
            Parolsiz qolgan bitta kompyuter butun tarmoqqa ochiq eshik boʻladi.
          </Card>
          <Card tone="amber" icon={Brain} title="🧠 Yodlash yetarli emas">
            Taʼrifni yodlash oson. Qiyini — kerakli qurilmani oʻzingiz tanlay olish.
          </Card>
        </Grid>

        <Callout kind="warn" title="Asosiy gʻoya" className="mt-4">
          Biz taʼrif yodlamaymiz. Avval muammoni koʻramiz, keyin yechimni topamiz.
        </Callout>
      </Block>

      <Block tone="blue" title="Darsni qanday oʻtamiz?">
        <Grid cols={2}>
          <Card tone="rose" title="😴 Oddiy usul">
            <CheckList
              kind="cross"
              items={[
                'Taʼrif aytiladi va yoziladi',
                'Rasm koʻrsatiladi',
                'Uyga «oʻqib kelish» beriladi',
              ]}
            />
          </Card>
          <Card tone="green" title="🚀 Bizning usul">
            <CheckList
              items={[
                'Avval savol: «Bu yerga nima kerak?»',
                'Qurilmani oʻzingiz bosib sinab koʻrasiz',
                'Paket harakatini ekranda kuzatasiz',
              ]}
            />
          </Card>
        </Grid>
      </Block>

      <Block tone="blue" title="Darsning uch maqsadi" sub="Faqat bilim emas — munosabat va fikrlash ham muhim.">
        <Grid cols={3}>
          <Card tone="blue" icon={BookOpen} title="📘 Bilim">
            <CheckList
              kind="dot"
              items={[
                'tarmoq nima',
                'LAN va WAN farqi',
                'switch, router, Wi-Fi nuqtasi',
                'IP-manzil nima',
              ]}
            />
          </Card>
          <Card tone="amber" icon={Handshake} title="🤝 Munosabat">
            <CheckList
              kind="dot"
              items={[
                'oʻz maʼlumotimni himoya qilaman',
                'boshqaning maʼlumotiga tegmayman',
                'jamoada ishlayman',
              ]}
            />
          </Card>
          <Card tone="teal" icon={Cog} title="🛠 Koʻnikma">
            <CheckList
              kind="dot"
              items={[
                'qurilmani vazifasiga qarab tanlayman',
                'sxemani oʻqiyman va tuzaman',
                'xatoni topib, sababini aytaman',
              ]}
            />
          </Card>
        </Grid>
      </Block>

      <Block tone="blue" title="Dars oxirida nima qila olaman?" sub="Oddiydan qiyinga qarab — oʻzingizni shu jadval boʻyicha sinang.">
        <DataTable
          head={['Daraja', 'Nima qila olaman', 'Qanday tekshiraman']}
          rows={[
            [<Pill tone="green">Bilaman</Pill>, 'Qurilmalarni nomlab, vazifasini aytaman', 'Savol-javob'],
            [<Pill tone="blue">Tushunaman</Pill>, 'Switch bilan routerning farqini sababi bilan aytaman', 'Simulyatordan keyingi savol'],
            [<Pill tone="amber">Qoʻllayman</Pill>, 'Sinf uchun tarmoq sxemasini tuzaman', 'Amaliy mashq'],
            [<Pill tone="violet">Tahlil qilaman</Pill>, 'Xavfsizlik xatosini topib, yechim taklif qilaman', 'Firewall laboratoriyasi'],
          ]}
        />
      </Block>

      <Block tone="blue" title="Nima kerak boʻladi?">
        <Grid cols={2}>
          <Card title="💻 Jihozlar">
            <KV
              items={[
                ['Eng kami', 'Proyektor va shu sayt — barcha simulyatsiyalar ichida'],
                ['Yaxshisi', 'Har oʻquvchiga kompyuter yoki planshet'],
                ['Boʻlsa, zoʻr', '1 ta switch, 1–2 ta router, tarmoq kabellari'],
              ]}
            />
          </Card>
          <Card tone="amber" title="🏆 Dars muvaffaqiyatli, agar...">
            <CheckList
              items={[
                <>sinfning koʻp qismi testdan <strong>oʻtsa</strong></>,
                <>har bir guruh oʻz sxemasini <strong>tushuntirib</strong> bersa</>,
                'kamida bitta xavfsizlik xatosi topilsa',
              ]}
            />
          </Card>
        </Grid>
      </Block>

      <LifeExample>
        Bir sinfda oʻquvchilar «router — tarmoqlarni bogʻlaydigan qurilma» degan taʼrifni yoddan aytib berdi. Bir hafta oʻtib kutubxonaga 6 ta kompyuter keltirildi va «bu yerga switch kerakmi yoki router?» deb soʻrashdi — javob berilmadi. Ikkinchi sinf esa aynan shu savoldan boshlab, simulyatorda sinab koʻrdi — va tanlovini asoslab berdi.
      </LifeExample>

      <Takeaway
        items={[
          'Maktab tarmogʻi — darsning bir qismi, shuning uchun uni tushunish kerak.',
          'Maqsad uchta: bilim, munosabat va koʻnikma.',
          'Yodlash emas — tanlovingizni asoslab berish muhim.',
        ]}
      />

      <MiniTask
        questions={[
          {
            q: 'Oʻqituvchi dars maqsadiga faqat «switch va router taʼrifini biladi» deb yozdi. Nima yetishmaydi?',
            options: [
              'Hech narsa, hammasi joyida',
              'Qurilmalar narxi',
              'Munosabat va koʻnikma qismlari',
              'Dars sanasi',
            ],
            correct: 2,
            explain: 'Maqsad uch qismdan iborat: bilim, munosabat va koʻnikma. Faqat bilimni yozish — eng koʻp uchraydigan xato.',
          },
          {
            q: 'Oʻquvchi taʼrifni aytadi, lekin yangi sinf uchun qaysi qurilma kerakligini tanlay olmaydi. U qaysi darajada toʻxtab qolgan?',
            options: ['Bilaman', 'Tushunaman', 'Qoʻllayman', 'Tahlil qilaman'],
            correct: 0,
            explain: 'U taʼrifni biladi, ammo bilimini yangi vaziyatga qoʻllay olmaydi. Demak, «bilaman» darajasidan nariga oʻtmagan.',
          },
          {
            q: '«Sinf uchun tarmoq sxemasini tuzadi» — buni qanday tekshirish toʻgʻri?',
            options: [
              'Taʼrifni ogʻzaki soʻrash',
              'Oʻquvchi sxemani oʻzi chizib, tushuntirib bersin',
              'Qurilma rasmini koʻrsatib, nomini soʻrash',
              'Uyga oʻqishga berish',
            ],
            correct: 1,
            explain: 'Sxema tuzish — amaliy koʻnikma. U faqat amalda, oʻquvchining oʻz ishida koʻrinadi.',
          },
        ]}
      />
    </>
  )
}
