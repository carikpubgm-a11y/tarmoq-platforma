import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BrickWall, CircleCheck, Circle, ArrowRight } from 'lucide-react'
import { Block, Callout, Card, DataTable, Goal, Grid, LifeExample, PageHeader, Takeaway, cx } from '../components/ui'
import NetworkLab from '../lab/NetworkLab'
import { PRESETS } from '../lab/presets'
import { KIND, components, detectTopology, diagnose, ifaces, type LabState } from '../lib/net'
import { saveResult, useStored } from '../lib/storage'

interface Progress { pingOk: boolean; pingFail: boolean; cut: boolean; topos: string[] }
const P0: Progress = { pingOk: false, pingFail: false, cut: false, topos: [] }

export default function Laboratoriya() {
  const [lab, setLab] = useStored<LabState>('lab-main', PRESETS.star.state)
  const [prog, setProg, resetProg] = useStored<Progress>('lab-progress', P0)

  const topo = useMemo(() => detectTopology(lab), [lab])
  useEffect(() => {
    if (['star', 'bus', 'ring', 'mesh'].includes(topo.key) && !prog.topos.includes(topo.key)) setProg(p => ({ ...p, topos: [...p.topos, topo.key] }))
  }, [topo.key]) // eslint-disable-line react-hooks/exhaustive-deps

  const tasks = useMemo(() => {
    const hosts = lab.devices.filter(d => KIND[d.kind].host)
    const noErr = !diagnose(lab).some(f => f.level === 'error')
    return [
      { t: 'Kamida 4 ta qurilma qoʻshilgan va barchasi oʻzaro ulangan', d: lab.devices.length >= 4 && components(lab).length === 1 },
      { t: 'Oxirgi qurilmalarning barchasida toʻgʻri va takrorlanmaydigan IP manzil bor', d: hosts.length >= 2 && hosts.every(h => ifaces(h).length > 0) && noErr },
      { t: 'Paket muvaffaqiyatli yetkazildi («Aloqa bor»)', d: prog.pingOk },
      { t: 'Kabel uzilib, nosozlik taʼsiri kuzatildi', d: prog.cut },
      { t: 'Muvaffaqiyatsiz paketning sababi oʻrganildi («Aloqa yoʻq» izohi)', d: prog.pingFail },
      { t: `Toʻrt topologiya amalda koʻrildi: yulduz, shina, halqa, toʻr (${prog.topos.length} / 4)`, d: prog.topos.length >= 4 },
    ]
  }, [lab, prog])
  const score = tasks.filter(x => x.d).length
  useEffect(() => {
    saveResult('lab', { score, max: tasks.length, label: 'Tarmoq konstruktori', detail: `${score} / ${tasks.length} topshiriq` })
  }, [score, tasks.length])

  return (
    <>
      <PageHeader no="11" tone="green" eyebrow="Interaktiv laboratoriya" title="Tarmoq konstruktori"
        lead={<>Bu yerda tayyor rasm yoʻq — tarmoqni <strong>oʻzingiz</strong> qurasiz: qurilma qoʻshasiz, kabel ulaysiz, IP manzil sozlaysiz, paket yuborasiz va xatoning sababini koʻrasiz.</>} />
      <Goal items={[
        'Sakkiz turdagi qurilmadan kichik tarmoq yigʻish va ularni toʻgʻri ulash',
        'IP manzil, subnet maska va shlyuzni sozlash, xato konfiguratsiyani topish',
        'Paketning switch va router orqali yoʻlini kuzatib, aloqa bor-yoʻqligini asoslash',
        'Yulduz, shina, halqa va toʻr topologiyalarining nosozlikka chidamliligini amalda solishtirish',
      ]} />

      <Block title="Ish maydoni" tone="green" sub="Boshlash uchun «Yulduz» andozasi yuklangan. Uni oʻzgartiring yoki «Qayta boshlash» bilan noldan quring.">
        <NetworkLab value={lab} onChange={setLab}
          onPing={r => setProg(p => (r.ok ? { ...p, pingOk: true } : { ...p, pingFail: true }))}
          onCut={() => setProg(p => ({ ...p, cut: true }))} />
      </Block>

      <Block title="Laboratoriya topshiriqlari" tone="green" sub="Topshiriqlar avtomatik tekshiriladi va natija «Test markazi»dagi umumiy baholash jadvaliga yoziladi.">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-xl bg-emerald-600 px-3 py-1.5 font-mono text-sm font-bold text-white" role="status" aria-live="polite">{score} / {tasks.length}</span>
            <div className="h-2 min-w-[8rem] flex-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: (score / tasks.length) * 100 + '%' }} /></div>
            <button type="button" onClick={resetProg} className="text-sm font-semibold text-slate-500 underline-offset-2 hover:text-rose-600 hover:underline">Natijani nollash</button>
          </div>
          <ul className="space-y-2.5">
            {tasks.map((x, i) => (
              <li key={i} className="flex gap-3">
                {x.d ? <CircleCheck size={22} className="flex-none text-emerald-600" /> : <Circle size={22} className="flex-none text-slate-300" />}
                <span className={cx('text-[0.98rem]', x.d ? 'text-slate-800' : 'text-slate-600')}>{x.t}</span>
              </li>
            ))}
          </ul>
        </div>
      </Block>

      <Block title="Toʻrt topologiya — bitta tajriba" tone="teal" sub="Har bir andozani yuklang, bitta kabelni uzing va PC1 dan eng uzoq qurilmaga paket yuboring.">
        <DataTable head={['Topologiya', 'Kabel soni (n ta qurilma)', 'Bitta kabel uzilsa', 'Bugungi qoʻllanishi']} rows={[
          [<strong>Yulduz (star)</strong>, 'n − 1 (markazga)', 'Faqat bitta qurilma aloqasiz qoladi', 'Deyarli barcha lokal tarmoqlar'],
          [<strong>Shina (bus)</strong>, 'Bitta umumiy magistral', 'Tarmoq ikki qismga boʻlinadi', 'Amalda ishlatilmaydi (tarixiy)'],
          [<strong>Halqa (ring)</strong>, 'n', 'Ikki tomonlama halqada teskari yoʻl qoladi', 'Magistral va sanoat tarmoqlari'],
          [<strong>Toʻr (mesh)</strong>, 'n·(n − 1) / 2', 'Hech narsa oʻzgarmaydi — muqobil yoʻl bor', 'Routerlar oʻrtasida, Wi-Fi mesh'],
        ]} />
        <Callout kind="note" title="Model haqida" className="mt-4">
          Shina va halqa andozalarida signal qoʻshni kompyuterlar orqali oʻtadi deb soddalashtirilgan. Bir tomonlama halqada (token ring) bitta uzilish butun halqani toʻxtatadi — buni <Link to="/topologiyalar">Topologiyalar</Link> boʻlimidagi koʻrgazmada koʻrasiz.
        </Callout>
      </Block>

      <Block title="Simulyator aloqani qanday tekshiradi?" tone="blue">
        <Grid cols={2}>
          <Card tone="teal" title="Bir xil tarmoq ichida">
            <p>Manba va qabul qiluvchi manzillari maskaga koʻra bitta tarmoqqa tegishli boʻlsa, paket <strong>router ishtirokisiz</strong> yuboriladi. Buning uchun ular orasida kabel yoʻli (switch, access point orqali) boʻlishi kifoya.</p>
          </Card>
          <Card tone="blue" title="Turli tarmoqlar orasida">
            <p>Manzillar turli tarmoqda boʻlsa, paket <strong>shlyuzga</strong> (routerga) yuboriladi. Router qabul qiluvchi tarmogʻiga ulangan boʻlishi, qabul qiluvchida esa javob qaytishi uchun shlyuz toʻgʻri koʻrsatilishi shart.</p>
          </Card>
        </Grid>
        <Callout kind="warn" title="Ataylab xato qiling" className="mt-4">
          Eng yaxshi oʻrganish usuli — tarmoqni buzib koʻrish. Ikki kompyuterga bir xil IP bering, shlyuzni oʻchirib tashlang yoki maskani oʻzgartiring: simulyator <strong>nima uchun</strong> aloqa yoʻqligini va qanday tuzatishni aytadi.
        </Callout>
      </Block>

      <LifeExample>
        Kafedraga yangi kompyuter oʻrnatildi, lekin u printerni «koʻrmayapti». Laboratoriyada shu vaziyatni qayta yarating: yangi PC qoʻshing, uni switchga ulang, ammo IP manzilni boshqa tarmoqdan (masalan, <span className="font-mono">192.168.5.7</span>) bering. Paket yuborilganda simulyator sababni koʻrsatadi — kabel joyida, muammo manzillashda.
      </LifeExample>

      <Takeaway items={[
        'Aloqa uchun ikki shart kerak: jismoniy yoʻl (kabel) va mantiqiy moslik (IP, maska, shlyuz).',
        'Switch bitta tarmoq ichida ishlaydi; turli tarmoqlarni faqat router bogʻlaydi.',
        'Topologiya tanlovi nosozlik taʼsirini belgilaydi: yulduzda bitta kabel — bitta qurilma.',
        'Xato konfiguratsiyani topish ham koʻnikma: avval kabel, keyin IP, soʻng shlyuz tekshiriladi.',
      ]} />

      <Link to="/laboratoriya/firewall" className="no-print group flex items-center gap-4 rounded-2xl border border-emerald-200 bg-white p-5 shadow-card transition hover:border-emerald-500">
        <span className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-emerald-600 text-white"><BrickWall size={24} /></span>
        <span className="flex-1"><span className="block font-display text-lg font-bold text-navy-950">Keyingi tajriba: Firewall laboratoriyasi</span><span className="block text-slate-600">Qoidalarni oʻzingiz yozing: HTTP ga ruxsat, SSH ga taqiq, nomaʼlum trafikka toʻsiq.</span></span>
        <ArrowRight className="text-emerald-600 transition group-hover:translate-x-1" />
      </Link>
    </>
  )
}
