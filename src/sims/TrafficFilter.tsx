import { useEffect, useState } from 'react'
import { Check, Eraser, FastForward, Play, X } from 'lucide-react'
import { Btn, Stage, cx } from '../components/ui'

/* Trafik filtri simulyatori: 8 ta tayyor paket 7 ta qoida + standart taqiq boʻyicha tekshiriladi.
   Qoidalar yuqoridan pastga oʻqiladi — birinchi mos kelgani qoʻllanadi. */

interface Packet {
  src: string; sport: number; dst: string; port: number; proto: 'TCP'
  vlan: number; toVlan: number; zone: 'lan' | 'wan'; inbound?: boolean; why: string
}
interface Rule { id: string; action: 'allow' | 'deny'; text: string; test: (p: Packet) => boolean }

const RULES: Rule[] = [
  { id: 'R1B', action: 'deny', text: 'Karantindagi kompyuter 192.168.10.26 → fayl serveri', test: p => p.src === '192.168.10.26' && p.dst === '192.168.40.5' && p.port === 445 },
  { id: 'R1', action: 'allow', text: 'Oʻquv xonasi (VLAN 10) → fayl serveri', test: p => p.vlan === 10 && p.dst === '192.168.40.5' && p.port === 445 },
  { id: 'R2', action: 'allow', text: 'Oʻquv xonasi → Internet, faqat sayt portlari (80, 443)', test: p => p.vlan === 10 && p.zone === 'wan' && (p.port === 443 || p.port === 80) },
  { id: 'R3', action: 'allow', text: 'Oʻqituvchilar (VLAN 20) → ichki tarmoqning hamma joyiga', test: p => p.vlan === 20 && p.zone === 'lan' },
  { id: 'R4', action: 'deny', text: 'Oʻquv xonasi → oʻqituvchilar tarmogʻi (VLAN 20)', test: p => p.vlan === 10 && p.toVlan === 20 },
  { id: 'R5', action: 'deny', text: 'Internetdan ichkariga kirish urinishi', test: p => p.inbound === true },
  { id: 'R6', action: 'deny', text: 'Telnet (eski, xavfli protokol) — hamma joyda', test: p => p.port === 23 },
]
const STD = { id: 'STD', text: 'Oxirgi qoida: qolgan hamma narsa taqiqlanadi' }

const PACKETS: Packet[] = [
  { src: '192.168.10.25', sport: 51234, dst: '192.168.40.5', port: 445, proto: 'TCP', vlan: 10, toVlan: 40, zone: 'lan', why: 'Oʻquvchi fayl serveriga ulanmoqchi.' },
  { src: '192.168.10.26', sport: 51236, dst: '192.168.40.5', port: 445, proto: 'TCP', vlan: 10, toVlan: 40, zone: 'lan', why: 'Karantindagi kompyuter ulanmoqchi. Aniq qoida (R1B) umumiy ruxsatdan (R1) yuqorida turadi.' },
  { src: '192.168.10.25', sport: 51235, dst: '192.168.20.5', port: 445, proto: 'TCP', vlan: 10, toVlan: 20, zone: 'lan', why: 'Oʻquvchi oʻqituvchilar serveriga ulanmoqchi.' },
  { src: '198.51.100.7', sport: 44321, dst: '192.168.40.5', port: 3389, proto: 'TCP', vlan: 0, toVlan: 40, zone: 'lan', inbound: true, why: 'Internetdan ichki serverga kirish urinishi.' },
  { src: '192.168.20.30', sport: 49001, dst: '192.168.40.5', port: 445, proto: 'TCP', vlan: 20, toVlan: 40, zone: 'lan', why: 'Oʻqituvchi fayl serveriga ulanmoqchi.' },
  { src: '192.168.10.40', sport: 41122, dst: '203.0.113.10', port: 443, proto: 'TCP', vlan: 10, toVlan: 0, zone: 'wan', why: 'Oʻquvchi xavfsiz saytga kirmoqchi.' },
  { src: '192.168.10.40', sport: 41123, dst: '192.168.40.5', port: 23, proto: 'TCP', vlan: 10, toVlan: 40, zone: 'lan', why: 'Telnet orqali ulanish urinishi.' },
  { src: '192.168.10.40', sport: 41124, dst: '203.0.113.10', port: 8080, proto: 'TCP', vlan: 10, toVlan: 0, zone: 'wan', why: 'Oʻquvchi gʻalati portga murojaat qilmoqchi.' },
]

/** Birinchi mos kelgan qoida qoʻllanadi; hech biri mos kelmasa — standart taqiq. */
function evaluate(p: Packet): { index: number; id: string; allow: boolean } {
  for (let k = 0; k < RULES.length; k++) {
    if (RULES[k].test(p)) return { index: k, id: RULES[k].id, allow: RULES[k].action === 'allow' }
  }
  return { index: RULES.length, id: STD.id, allow: false }
}

const RESULTS = PACKETS.map(evaluate)
const STEP_MS = 650

export default function TrafficFilter() {
  const [sent, setSent] = useState(0)
  const [auto, setAuto] = useState(false)
  const total = PACKETS.length
  const finished = sent >= total
  const running = auto && !finished

  useEffect(() => {
    if (!running) return
    const t = window.setTimeout(() => setSent(s => Math.min(total, s + 1)), STEP_MS)
    return () => window.clearTimeout(t)
  }, [running, sent, total])

  const last = sent > 0 ? RESULTS[sent - 1] : null
  const allowed = RESULTS.slice(0, sent).filter(r => r.allow).length
  const blocked = sent - allowed

  const sendOne = () => setSent(s => Math.min(total, s + 1))
  const runAll = () => { sendOne(); setAuto(true) }
  const reset = () => { setAuto(false); setSent(0) }

  const rowClass = (k: number) => {
    if (!last) return 'border-navy-700 bg-navy-900'
    if (k === last.index) return last.allow ? 'border-emerald-400 bg-emerald-400/10' : 'border-rose-400 bg-rose-400/10'
    return k < last.index ? 'border-navy-800 bg-navy-900/60' : 'border-navy-700 bg-navy-900'
  }
  const rowNote = (k: number) => {
    if (!last) return null
    if (k === last.index) {
      return <span className={cx('font-mono text-[0.7rem] font-bold uppercase', last.allow ? 'text-emerald-300' : 'text-rose-300')}>mos keldi</span>
    }
    if (k < last.index) return <span className="font-mono text-[0.7rem] text-navy-400">mos emas</span>
    return null
  }

  return (
    <Stage
      title="Firewall qanday ishlaydi?"
      badge={`${sent} / ${total} paket`}
      hint={<>Mos kelgan qoida <strong className="!text-emerald-300">yashil</strong> (ruxsat) yoki <strong className="!text-rose-300">qizil</strong> (taqiq) boʻlib yonadi. Hech biri mos kelmasa — hammasi taqiqlanadi.</>}
    >
      <div className="mb-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <h4 className="text-[0.95rem] font-bold !text-white">Qoidalar roʻyxati</h4>
        <span className="text-sm text-navy-300">yuqoridan pastga tekshiriladi — birinchi mos kelgani qoʻllanadi</span>
      </div>
      <ol className="space-y-1.5">
        {RULES.map((r, k) => (
          <li key={r.id} className={cx('grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 rounded-xl border px-3 py-2 transition-colors', rowClass(k))}>
            <span className="w-11 rounded-md bg-navy-800 px-1.5 py-1 text-center font-mono text-xs font-bold text-teal-300">{r.id}</span>
            <span className={cx('text-[0.9rem]', last && k < last.index ? 'text-navy-300' : 'text-navy-100')}>{r.text}</span>
            <span className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-3">
              {rowNote(k)}
              <span className={cx('rounded-full px-2.5 py-0.5 text-xs font-bold', r.action === 'allow' ? 'bg-emerald-400/15 text-emerald-300' : 'bg-rose-400/15 text-rose-300')}>
                {r.action === 'allow' ? 'ruxsat' : 'taqiq'}
              </span>
            </span>
          </li>
        ))}
        <li className={cx('grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 rounded-xl border border-dashed px-3 py-2 transition-colors', rowClass(RULES.length))}>
          <span className="w-11 rounded-md bg-navy-800 px-1.5 py-1 text-center font-mono text-xs font-bold text-amber-300">{STD.id}</span>
          <span className="text-[0.9rem] text-navy-100">{STD.text}</span>
          <span className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-3">
            {rowNote(RULES.length)}
            <span className="rounded-full bg-navy-700 px-2.5 py-0.5 text-xs font-bold text-navy-100">taqiq</span>
          </span>
        </li>
      </ol>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Btn variant="primary" icon={Play} disabled={finished || running} onClick={sendOne}>Paket yuborish</Btn>
        <Btn variant="dark" icon={FastForward} disabled={finished || running} onClick={runAll}>Hammasini yuborish</Btn>
        <Btn variant="dark" icon={Eraser} disabled={sent === 0} onClick={reset}>Tozalash</Btn>
        {sent > 0 && (
          <span className="ml-auto flex flex-wrap gap-2 font-mono text-xs font-bold">
            <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-emerald-300">oʻtkazildi: {allowed}</span>
            <span className="rounded-full bg-rose-400/15 px-2.5 py-1 text-rose-300">bloklandi: {blocked}</span>
          </span>
        )}
      </div>

      <div role="status" aria-live="polite" className="mt-3">
        {sent === 0 ? (
          <p className="rounded-xl border border-navy-700 bg-navy-900 px-4 py-3 text-[0.94rem] text-navy-100">
            Jurnal boʻsh. <strong>«Paket yuborish»</strong> tugmasini bosing va paket qaysi qoidaga tushishini kuzating. 👀
          </p>
        ) : (
          <ol className="space-y-1.5" aria-label="Paketlar jurnali, eng yangisi yuqorida">
            {PACKETS.slice(0, sent).map((p, k) => ({ p, r: RESULTS[k], n: k + 1 })).reverse().map(({ p, r, n }) => (
              <li key={n} className={cx('flex items-start gap-3 rounded-xl border-l-4 bg-navy-900 px-3 py-2.5', n === sent && 'anim-in', r.allow ? 'border-emerald-400' : 'border-rose-400')}>
                <div className="min-w-0 flex-1 sm:flex sm:gap-3">
                  <span className={cx('inline-flex flex-none items-center gap-1 pt-0.5 font-mono text-xs font-bold sm:w-32 sm:self-start', r.allow ? 'text-emerald-300' : 'text-rose-300')}>
                    {r.allow ? <Check size={14} /> : <X size={14} />}
                    {r.allow ? 'OʻTKAZILDI' : 'BLOKLANDI'}
                  </span>
                  <span className="block min-w-0">
                    <span className="block font-mono text-[0.82rem] text-white">{p.proto} {p.src}:{p.sport} → {p.dst}:{p.port}</span>
                    <span className="block text-[0.84rem] leading-snug text-navy-300">{p.why}</span>
                  </span>
                </div>
                <span className="flex-none rounded-md bg-navy-800 px-2 py-1 font-mono text-xs font-bold text-teal-300">{r.id}</span>
              </li>
            ))}
          </ol>
        )}
      </div>

      {finished && (
        <p className="mt-3 rounded-xl border border-teal-500/40 bg-teal-500/10 px-4 py-3 text-[0.94rem] text-navy-100">
          {total} ta paket tekshirildi: {allowed} tasi oʻtdi, {blocked} tasi bloklandi. Oxirgi paket hech bir qoidaga tushmadi — uni <strong>oxirgi qoida</strong> toʻxtatdi. ✅
        </p>
      )}
    </Stage>
  )
}
