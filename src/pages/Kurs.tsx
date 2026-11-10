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
        title="Kurs haqida va oʻquv maqsadlari"
        lead={<>Bugun maktab, shifoxona va uyda koʻplab xizmatlar tarmoqqa bogʻliq. Tarmoq toʻgʻri loyihalanmasa, oddiy kabel uzilishi yoki zaif parol ham darsga, ishga va maʼlumotlar xavfsizligiga taʼsir qiladi. Bu boʻlim kurs nima uchun kerakligini va undan qanday natija kutilishini belgilaydi.</>}
      />

      <Goal
        items={[
          'Mavzuning dolzarbligini uchta aniq sabab bilan asoslab berish',
          'Dars maqsadini taʼlimiy, tarbiyaviy va rivojlantiruvchi qismlarga ajratib yozish',
          'Har bir kutilayotgan natijani uni tekshiradigan mashq bilan bogʻlash',
        ]}
      />

      <Block
        tone="blue"
        title="Nega bu mavzu bugun dolzarb?"
        sub="Uchta sabab: maktab tarmoqqa tayanadi, himoyasiz qurilma butun tarmoqqa xavf soladi, yodlashga asoslangan dars esa tushunish bermaydi."
      >
        <Grid cols={3}>
          <Card tone="teal" icon={School} title="Maktablar raqamlashtirilmoqda">
            Elektron jurnal, onlayn darslik, videokonferensiya, kameralar va Wi-Fi — bularning barchasi bitta maktab tarmogʻida ishlaydi. Buni kimdir <strong>loyihalashi</strong> kerak.
          </Card>
          <Card tone="blue" icon={Target} title="Hujumlar oson nishonni tanlaydi">
            Tajovuzkor odatda eng himoyasiz joyni qidiradi. Kichik tashkilotda himoyasiz qolgan bitta qurilma — butun tarmoq uchun ochiq eshik.
          </Card>
          <Card tone="amber" icon={Brain} title="Oʻqitish metodi oʻzgaradi">
            «Taʼrifni yodla» yondashuvi tarmoqni tushuntirmaydi. Sabab–natija zanjirini koʻrsatadigan <strong>model va simulyatsiya</strong> kerak.
          </Card>
        </Grid>

        <Callout kind="warn" title="Pedagogik muammo" className="mt-4">
          Oʻquvchi «router — bu tarmoqlarni bogʻlaydigan qurilma» deb yodlaydi, lekin <em>nega</em> switch buni qila olmasligini tushunmaydi. Natijada yangi vaziyat uchun qurilmani tanlay olmaydi. Kursning asosiy maqsadi — <strong>yodlashdan tushunishga</strong> oʻtish.
        </Callout>
      </Block>

      <Block
        tone="blue"
        title="Anʼanaviy dars va ushbu kurs yondashuvi"
        sub="Farq mavzuda emas, tartibda: avval muammo qoʻyiladi, bilim esa uni yechish jarayonida beriladi."
      >
        <Grid cols={2}>
          <Card tone="rose" title="Anʼanaviy dars">
            <CheckList
              kind="cross"
              items={[
                'Taʼrif aytiladi va yozdiriladi',
                'Qurilmalar rasmi koʻrsatiladi',
                'Uyga «mavzuni oʻqish» beriladi',
                'Nazorat: taʼrifni soʻrash',
              ]}
            />
          </Card>
          <Card tone="green" title="Ushbu platformadagi yondashuv">
            <CheckList
              items={[
                'Avval muammo qoʻyiladi, keyin qurilma tanishtiriladi',
                <>Har bir qurilma <strong>tanlanadi</strong> va vazifasi ochiladi</>,
                'Paket harakati simulyatsiyada koʻz bilan kuzatiladi',
                'Nazorat: vaziyatni tahlil qilib, yechim tanlash',
              ]}
            />
          </Card>
        </Grid>
      </Block>

      <Block
        tone="blue"
        title="Darsning maqsadi: uch yoʻnalish"
        sub="Maqsad uch qismga boʻlinadi: bilim (taʼlimiy), munosabat (tarbiyaviy) va fikrlash qobiliyati (rivojlantiruvchi). Faqat birinchisini yozib qoʻyish — eng koʻp uchraydigan xato."
      >
        <Grid cols={3}>
          <Card tone="blue" icon={BookOpen} title="Taʼlimiy">
            <p className="mb-3">Oʻquvchi biladi va tushuntira oladi:</p>
            <CheckList
              kind="dot"
              items={[
                'tarmoq nima va uning vazifasi',
                'LAN va WAN farqi',
                'switch, router, access point vazifalari',
                'IP-manzil va quyi tarmoq (subnet) tushunchasi',
                'asosiy xavfsizlik choralari',
              ]}
            />
          </Card>
          <Card tone="amber" icon={Handshake} title="Tarbiyaviy">
            <p className="mb-3">Oʻquvchida shakllanadi:</p>
            <CheckList
              kind="dot"
              items={[
                'raqamli masʼuliyat hissi',
                'oʻzining va boshqalarning maʼlumotini himoya qilish',
                'qonunga rioya qilish (shaxsiy maʼlumotlar)',
                'jamoada ishlash madaniyati',
                'tanqidiy va halol munosabat',
              ]}
            />
          </Card>
          <Card tone="teal" icon={Cog} title="Rivojlantiruvchi">
            <p className="mb-3">Oʻquvchi qila oladi:</p>
            <CheckList
              kind="dot"
              items={[
                'vaziyatni tahlil qilib, yechim tanlash',
                'qurilmani vazifasiga qarab tanlash',
                'sxemani oʻqish va tuzish',
                'xatoni topish va sababini aytish',
                'oʻz yechimini asoslab berish',
              ]}
            />
          </Card>
        </Grid>
      </Block>

      <Block
        tone="blue"
        title="Kutilayotgan oʻquv natijalari"
        sub={<>Dars oxirida oʻquvchi quyidagi amallarni <strong>mustaqil</strong> bajara olishi kerak. Roʻyxat oddiydan murakkabga qarab tuzilgan va baholash mezonlari sifatida ham ishlatiladi.</>}
      >
        <DataTable
          head={['Daraja', 'Natija', 'Qanday tekshiriladi']}
          rows={[
            [<Pill tone="green">Bilish</Pill>, 'Tarmoq qurilmalarini nomlaydi va vazifasini aytadi', 'Ogʻzaki soʻrov, «qurilmani top» mashqi'],
            [<Pill tone="blue">Tushunish</Pill>, <>Switch va router farqini <em>sababi</em> bilan tushuntiradi</>, 'Paket oqimi simulyatoridan keyingi savol'],
            [<Pill tone="amber">Qoʻllash</Pill>, 'Berilgan bino uchun tarmoq sxemasini tuzadi', 'Amaliy mashq: maktab tarmogʻi loyihasi'],
            [<Pill tone="violet">Tahlil</Pill>, 'Xavfsizlik zaifligini topadi va yechim taklif qiladi', 'Vaziyatli test, firewall simulyatori'],
          ]}
        />
      </Block>

      <Block tone="blue" title="Jihozlar va muvaffaqiyat mezoni" sub="Dars eng oddiy sharoitda ham oʻtkazilishi mumkin: barcha simulyatsiyalar platformaning oʻzida.">
        <Grid cols={2}>
          <Card title="Zarur jihozlar">
            <KV
              items={[
                ['Asosiy', 'Kompyuter yoki planshet, proyektor, internet'],
                ['Ideal', '1 ta switch, 2–3 ta router yoki access point, tarmoq kabellari'],
                ['Minimal', 'Faqat proyektor va shu platforma — barcha simulyatsiyalar ichida'],
                ['Dasturiy', 'Brauzer; ixtiyoriy — Cisco Packet Tracer'],
              ]}
            />
          </Card>
          <Card tone="amber" title="Muvaffaqiyat mezoni">
            <CheckList
              items={[
                <>Oʻquvchilarning kamida <strong>80 foizi</strong> testdan oʻtadi</>,
                <>Har bir guruh oʻz sxemasini <strong>asoslab</strong> bera oladi</>,
                'Kamida bitta xavfsizlik xatosini mustaqil topadi',
              ]}
            />
            <p className="mt-4 text-sm text-slate-500">
              Bu raqamlar maktab darajasi uchun. Universitetda asosiy mezon — yechimni asoslab berish.
            </p>
          </Card>
        </Grid>
      </Block>

      <LifeExample>
        Tasavvur qiling: informatika oʻqituvchisi 9-sinfga «router — tarmoqlarni bogʻlaydigan qurilma» taʼrifini yozdirdi va hamma uni yoddan aytib berdi. Bir hafta oʻtib maktab kutubxonasiga oltita kompyuter keltirildi va oʻquvchilardan «bu yerga switch kerakmi yoki router?» deb soʻraldi — koʻpchilik javob bera olmadi. Ikkinchi sinfda esa dars aynan shu savoldan boshlandi: oʻquvchilar avval oʻzlari yechim taklif qilishdi, soʻng simulyatsiyada tekshirishdi. Ular taʼrifni yodlashmadi, lekin qurilmani <strong>nima uchun</strong> tanlaganini tushuntirib bera olishdi.
      </LifeExample>

      <Takeaway
        items={[
          'Tarmoq — oʻquv jarayonining infratuzilmasi: uni loyihalash va himoya qilishni oʻrgatish zarur.',
          'Dars maqsadi uch qismli: taʼlimiy, tarbiyaviy va rivojlantiruvchi — uchalasi ham yoziladi.',
          'Har bir natija oʻlchanadigan boʻlishi va aniq mashq bilan tekshirilishi kerak.',
          'Asosiy gʻoya — yodlashdan tushunishga oʻtish: avval muammo, keyin qurilma.',
        ]}
      />

      <MiniTask
        questions={[
          {
            q: 'Oʻqituvchi dars rejasiga faqat «Oʻquvchi switch va router taʼrifini biladi» deb yozdi. Bu maqsadda nima yetishmaydi?',
            options: [
              'Hech narsa — maqsad toʻliq yozilgan',
              'Qurilmalarning narxi va modeli',
              'Tarbiyaviy va rivojlantiruvchi qismlar',
              'Darsning sanasi va vaqti',
            ],
            correct: 2,
            explain: 'Maqsad uch qismdan iborat: bilim (taʼlimiy), munosabat (tarbiyaviy) va fikrlash qobiliyati (rivojlantiruvchi). Faqat taʼlimiy qismni yozish — eng koʻp uchraydigan xato.',
          },
          {
            q: 'Oʻquvchi «router tarmoqlarni bogʻlaydi» deb aytadi, ammo yangi kompyuter xonasi uchun qaysi qurilma kerakligini tanlay olmaydi. U qaysi darajada toʻxtab qolgan?',
            options: ['Bilish', 'Tushunish', 'Qoʻllash', 'Tahlil'],
            correct: 0,
            explain: 'U taʼrifni biladi, lekin sababini tushuntira olmaydi va bilimini yangi vaziyatga qoʻllay olmaydi. Demak, «bilish» darajasidan nariga oʻtmagan.',
          },
          {
            q: '«Berilgan bino uchun tarmoq sxemasini tuzadi» degan natijaga erishilganini qaysi usul eng toʻgʻri tekshiradi?',
            options: [
              'Taʼrifni ogʻzaki soʻrash',
              'Amaliy mashq: maktab tarmogʻi loyihasini tuzish',
              'Qurilmalar rasmini koʻrsatib, nomini soʻrash',
              'Uyga mavzuni oʻqib kelishni berish',
            ],
            correct: 1,
            explain: 'Bu «qoʻllash» darajasidagi natija, shuning uchun u faqat amalda — oʻquvchi sxemani oʻzi tuzganda — tekshiriladi. Ogʻzaki soʻrov faqat «bilish» darajasini oʻlchaydi.',
          },
        ]}
      />
    </>
  )
}
