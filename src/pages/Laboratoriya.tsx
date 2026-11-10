import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BrickWall, CircleCheck, Circle, ArrowRight } from 'lucide-react'
import { Block, Callout, DataTable, Goal, LifeExample, PageHeader, Progress, Takeaway, cx } from '../components/ui'
import NetworkLab from '../lab/NetworkLab'
import { PRESETS } from '../lab/presets'
import { KIND, components, detectTopology, diagnose, ifaces, type LabState } from '../lib/net'
import { saveResult, useStored } from '../lib/storage'

interface Progress2 { pingOk: boolean; pingFail: boolean; cut: boolean; topos: string[] }
const P0: Progress2 = { pingOk: false, pingFail: false, cut: false, topos: [] }

export default function Laboratoriya() {
  const [lab, setLab] = useStored<LabState>('lab-main', PRESETS.star.state)
  const [prog, setProg, resetProg] = useStored<Progress2>('lab-progress', P0)

  const topo = useMemo(() => detectTopology(lab), [lab])
  useEffect(() => {
    if (['star', 'bus', 'ring', 'mesh'].includes(topo.key) && !prog.topos.includes(topo.key)) setProg(p => ({ ...p, topos: [...p.topos, topo.key] }))
  }, [topo.key]) // eslint-disable-line react-hooks/exhaustive-deps

  const tasks = useMemo(() => {
    const hosts = lab.devices.filter(d => KIND[d.kind].host)
    const noErr = !diagnose(lab).some(f => f.level === 'error')
    return [
      { t: 'Kamida 4 ta qurilma qoʻshdim va hammasini ulab chiqdim', d: lab.devices.length >= 4 && components(lab).length === 1 },
      { t: 'Har bir kompyuterda toʻgʻri IP manzil bor', d: hosts.length >= 2 && hosts.every(h => ifaces(h).length > 0) && noErr },
      { t: 'Xabar yetib bordi 🎉', d: prog.pingOk },
      { t: 'Simni uzib koʻrdim — nima boʻlishini bildim', d: prog.cut },
      { t: 'Xabar yetib bormagan holatni ham koʻrdim va sababini oʻqidim', d: prog.pingFail },
      { t: `Toʻrt shaklni sinab koʻrdim: yulduz, shina, halqa, toʻr (${prog.topos.length} / 4)`, d: prog.topos.length >= 4 },
    ]
  }, [lab, prog])
  const score = tasks.filter(x => x.d).length
  useEffect(() => {
    saveResult('lab', { score, max: tasks.length, label: 'Tarmoq konstruktori', detail: `${score} / ${tasks.length} topshiriq` })
  }, [score, tasks.length])

  return (
    <>
      <PageHeader no="11" tone="green" eyebrow="Interaktiv laboratoriya" title="Tarmoq konstruktori"
        lead={<>Bu yerda tarmoqni <strong>oʻzingiz</strong> qurasiz: qurilma qoʻshasiz, sim ulaysiz, xabar yuborasiz. Xato chiqsa — nima qilish kerakligi darhol yoziladi.</>} />
      <Goal items={[
        'Kichik tarmoq yigʻish: qurilma qoʻshish va sim ulash',
        'Qurilmalarga IP manzil berish («Avto IP» ham bor)',
        'Xabar yetib bordimi — tekshirish va sababini tushunish',
        'Simni uzib, tarmoqning qaysi shakli chidamli ekanini koʻrish',
      ]} />

      <Callout kind="info" title="Ikki shart" className="mb-8">
        Xabar yetib borishi uchun ikki narsa kerak: <strong>sim</strong> (yoʻl bor) va <strong>toʻgʻri IP manzil</strong> (manzil bor). Bittasi yetishmasa — xabar yoʻqoladi.
      </Callout>

      <Block title="Ish maydoni" tone="green" sub="Boshlash uchun tayyor «Yulduz» sxemasi turibdi. Uni oʻzgartiring yoki «🔄 Boshidan» bilan noldan quring.">
        <NetworkLab value={lab} onChange={setLab}
          onPing={r => setProg(p => (r.ok ? { ...p, pingOk: true } : { ...p, pingFail: true }))}
          onCut={() => setProg(p => ({ ...p, cut: true }))} />
      </Block>

      <Block title="Topshiriqlar" tone="green" sub="Oʻzi tekshiriladi va natija «Test markazi»dagi jadvalga yoziladi.">
        <div className="rounded-4xl border-2 border-emerald-200 bg-white p-5 shadow-card sm:p-6">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-xl bg-emerald-600 px-3.5 py-1.5 font-display text-base font-extrabold text-white" role="status" aria-live="polite">{score} / {tasks.length}</span>
            <Progress value={score} max={tasks.length} className="min-w-[8rem] flex-1" />
            <button type="button" onClick={resetProg} className="text-sm font-semibold text-slate-500 underline-offset-2 hover:text-rose-600 hover:underline">Boshidan hisoblash</button>
          </div>
          <ul className="space-y-2.5">
            {tasks.map((x, i) => (
              <li key={i} className="flex gap-3">
                {x.d ? <CircleCheck size={24} className="flex-none text-emerald-600" /> : <Circle size={24} className="flex-none text-slate-300" />}
                <span className={cx('text-[1.02rem]', x.d ? 'font-semibold text-slate-800' : 'text-slate-600')}>{x.t}</span>
              </li>
            ))}
          </ul>
        </div>
      </Block>

      <Block title="Toʻrt shakl — bitta tajriba" tone="teal" sub="Har bir shaklni yuklang, bitta simni uzing va yana xabar yuboring.">
        <DataTable head={['Tarmoq shakli', 'Bitta sim uzilsa']} rows={[
          [<strong>Yulduz</strong>, 'Faqat bitta qurilma aloqasiz qoladi'],
          [<strong>Shina</strong>, 'Tarmoq ikkiga boʻlinadi'],
          [<strong>Halqa</strong>, 'Xabar teskari yoʻldan ketadi'],
          [<strong>Toʻr</strong>, 'Hech narsa oʻzgarmaydi — boshqa yoʻl bor'],
        ]} />
      </Block>

      <LifeExample>
        Sinfga yangi kompyuter qoʻyildi, lekin u printerni «koʻrmayapti». Shuni laboratoriyada takrorlang: yangi kompyuter qoʻshing, uni switchga ulang, ammo IP manzilini boshqa tarmoqdan — <span className="font-mono">192.168.5.7</span> — bering. Xabar yuborsangiz, sim joyida boʻlsa ham yetib bormaydi: muammo manzilda.
      </LifeExample>

      <Takeaway items={[
        'Xabar yetib borishi uchun sim ham, toʻgʻri IP manzil ham kerak.',
        'Switch bitta tarmoq ichida ishlaydi; ikki xil tarmoqni router bogʻlaydi.',
        'Tarmoq shakli nosozlik qanchalik katta zarar berishini belgilaydi.',
        'Xatoni ataylab qilib koʻrish — oʻrganishning eng tez yoʻli.',
      ]} />

      <Link to="/laboratoriya/firewall" className="no-print group flex items-center gap-4 rounded-4xl border-2 border-emerald-200 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-emerald-500">
        <span className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-emerald-600 text-white"><BrickWall size={24} /></span>
        <span className="flex-1"><span className="block font-display text-lg font-extrabold text-navy-950">Keyingi tajriba: Firewall laboratoriyasi</span><span className="block text-slate-600">Qoidalarni oʻzingiz yozasiz: nimaga ruxsat, nimaga taqiq.</span></span>
        <ArrowRight className="text-emerald-600 transition group-hover:translate-x-1" />
      </Link>
    </>
  )
}
