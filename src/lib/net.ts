/* ==========================================================================
   Tarmoq simulyatsiyasi yadrosi (oʻquv modeli).
   Haqiqiy tarmoq boshqarilmaydi — bu faqat brauzer ichidagi soddalashtirilgan model:
   - switch, access point, firewall — 2-qatlamda «shaffof» ishlaydi;
   - router — tarmoqlar chegarasi (2 tagacha interfeys);
   - shina/halqa andozalarida signal qoʻshni stansiyalar orqali oʻtadi.
   ========================================================================== */

export type DeviceKind = 'pc' | 'laptop' | 'printer' | 'server' | 'switch' | 'router' | 'ap' | 'firewall'

export interface Device {
  id: string
  kind: DeviceKind
  name: string
  x: number
  y: number
  ip?: string
  mask?: string
  gateway?: string
  /** router: ikkinchi interfeys */
  ip2?: string
  mask2?: string
  /** firewall: ping (ICMP) ni bloklash */
  blockPing?: boolean
}
export interface Link { id: string; a: string; b: string; down?: boolean }
export interface LabState { devices: Device[]; links: Link[] }

export const KIND: Record<DeviceKind, { label: string; plural: string; host: boolean; l3: boolean; layer: string; desc: string }> = {
  pc: { label: 'Kompyuter', plural: 'kompyuter', host: true, l3: true, layer: 'Oxirgi qurilma', desc: 'Maʼlumot manbasi va qabul qiluvchisi. Tarmoqda ishlashi uchun IP manzil, maska va shlyuz kerak.' },
  laptop: { label: 'Laptop', plural: 'laptop', host: true, l3: true, layer: 'Oxirgi qurilma', desc: 'Koʻchma kompyuter. Odatda access point orqali simsiz (Wi-Fi) ulanadi.' },
  printer: { label: 'Printer', plural: 'printer', host: true, l3: true, layer: 'Umumiy resurs', desc: 'Tarmoq orqali boʻlishiladigan qurilma. Manzili oʻzgarmasligi uchun statik IP beriladi.' },
  server: { label: 'Server', plural: 'server', host: true, l3: true, layer: 'Xizmat koʻrsatuvchi', desc: 'Fayl, DNS, DHCP kabi umumiy xizmatlarni taqdim etadi. «Server» — qurilma turi emas, rol.' },
  switch: { label: 'Switch', plural: 'switch', host: false, l3: false, layer: '2-qatlam (MAC)', desc: 'Bitta tarmoq ichida ramkalarni MAC-manzil boʻyicha kerakli portga yoʻnaltiradi. IP manzilga qaramaydi.' },
  router: { label: 'Router', plural: 'router', host: false, l3: true, layer: '3-qatlam (IP)', desc: 'Turli IP-tarmoqlarni bogʻlaydi. Kompyuterlar uchun shlyuz (gateway) vazifasini bajaradi.' },
  ap: { label: 'Access Point', plural: 'access point', host: false, l3: false, layer: '2-qatlam (Wi-Fi)', desc: 'Simsiz qurilmalarni simli tarmoqqa ulaydi. Yoʻnaltirish bilan shugʻullanmaydi.' },
  firewall: { label: 'Firewall', plural: 'firewall', host: false, l3: false, layer: 'Chegara himoyasi', desc: 'Trafikni qoidalar boʻyicha oʻtkazadi yoki toʻxtatadi. Bu modelda kabelga «shaffof» ulanadi.' },
}
export const KIND_ORDER: DeviceKind[] = ['pc', 'laptop', 'printer', 'server', 'switch', 'router', 'ap', 'firewall']

/* ------------------------------ IP yordamchilari ------------------------------ */
export function parseIp(s?: string): number | null {
  if (!s) return null
  const m = s.trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (!m) return null
  const p = m.slice(1).map(Number)
  if (p.some(n => n > 255)) return null
  return ((p[0] << 24) | (p[1] << 16) | (p[2] << 8) | p[3]) >>> 0
}
export function ipStr(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.')
}
export function prefixToMask(prefix: number): number {
  return prefix <= 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0
}
/** Maska toʻgʻrimi (ketma-ket birlar)? Toʻgʻri boʻlsa prefiks uzunligi, aks holda null. */
export function maskPrefix(mask: number | null): number | null {
  if (mask === null) return null
  for (let p = 0; p <= 32; p++) if (prefixToMask(p) === mask) return p
  return null
}
export interface SubnetInfo { prefix: number; mask: number; network: number; broadcast: number; first: number; last: number; hosts: number }
export function subnetInfo(ip: number, prefix: number): SubnetInfo {
  const mask = prefixToMask(prefix)
  const network = (ip & mask) >>> 0
  const broadcast = (network | (~mask >>> 0)) >>> 0
  const hosts = prefix >= 31 ? (prefix === 31 ? 2 : 1) : Math.pow(2, 32 - prefix) - 2
  return { prefix, mask, network, broadcast, first: prefix >= 31 ? network : network + 1, last: prefix >= 31 ? broadcast : broadcast - 1, hosts }
}

export interface Iface { ip: number; mask: number; prefix: number; label: string }
/** Qurilmaning toʻgʻri sozlangan IP interfeyslari. */
export function ifaces(d: Device): Iface[] {
  const out: Iface[] = []
  const add = (ipS: string | undefined, maskS: string | undefined, label: string) => {
    const ip = parseIp(ipS), mask = parseIp(maskS), prefix = maskPrefix(mask)
    if (ip !== null && mask !== null && prefix !== null && prefix > 0) out.push({ ip, mask, prefix, label })
  }
  if (!KIND[d.kind].l3) return out
  add(d.ip, d.mask, d.kind === 'router' ? '1-interfeys' : 'IP')
  if (d.kind === 'router') add(d.ip2, d.mask2, '2-interfeys')
  return out
}
const inNet = (ip: number, f: Iface) => ((ip & f.mask) >>> 0) === ((f.ip & f.mask) >>> 0)

/** Bitta maydon uchun xato matni (boʻsh satr — xato yoʻq). */
export function fieldError(kind: 'ip' | 'mask' | 'gateway', value: string | undefined, d?: Device): string {
  if (!value) return ''
  const n = parseIp(value)
  if (n === null) return 'Format notoʻgʻri. Namuna: 192.168.1.10 (toʻrtta son, har biri 0–255).'
  if (kind === 'mask') return maskPrefix(n) === null || n === 0 ? 'Bunday maska yoʻq. Namuna: 255.255.255.0' : ''
  if (kind === 'ip' && d) {
    const mask = parseIp(d.mask), prefix = maskPrefix(mask)
    if (mask !== null && prefix !== null && prefix > 0 && prefix < 31) {
      const s = subnetInfo(n, prefix)
      if (n === s.network) return 'Bu — tarmoq manzili, qurilmaga berilmaydi.'
      if (n === s.broadcast) return 'Bu — broadcast manzili, qurilmaga berilmaydi.'
    }
  }
  if (kind === 'gateway' && d) {
    const f = ifaces(d)[0]
    if (f && !inNet(n, f)) return 'Shlyuz qurilma bilan bir xil tarmoqda boʻlishi kerak.'
    if (f && n === f.ip) return 'Shlyuz qurilmaning oʻz manzili boʻla olmaydi.'
  }
  return ''
}

/* ------------------------------ Graf ------------------------------ */
function adjacency(s: LabState): Map<string, { to: string; link: string }[]> {
  const adj = new Map<string, { to: string; link: string }[]>()
  s.devices.forEach(d => adj.set(d.id, []))
  s.links.forEach(l => {
    if (l.down || !adj.has(l.a) || !adj.has(l.b)) return
    adj.get(l.a)!.push({ to: l.b, link: l.id })
    adj.get(l.b)!.push({ to: l.a, link: l.id })
  })
  return adj
}
/** Eng qisqa yoʻl (BFS). l2 = true boʻlsa oraliq tugun router boʻla olmaydi (router — tarmoq chegarasi). */
export function findPath(s: LabState, from: string, to: string, l2 = true): string[] | null {
  if (from === to) return [from]
  const adj = adjacency(s)
  const kind = new Map(s.devices.map(d => [d.id, d.kind]))
  const prev = new Map<string, string | null>([[from, null]])
  const q = [from]
  while (q.length) {
    const c = q.shift()!
    for (const e of adj.get(c) ?? []) {
      if (prev.has(e.to)) continue
      if (l2 && e.to !== to && kind.get(e.to) === 'router') continue
      prev.set(e.to, c)
      if (e.to === to) {
        const path: string[] = []
        for (let n: string | null = to; n !== null; n = prev.get(n) ?? null) path.unshift(n)
        return path
      }
      q.push(e.to)
    }
  }
  return null
}
/** Bogʻlangan qismlar (uzilgan kabellar hisobga olinadi). */
export function components(s: LabState): string[][] {
  const adj = adjacency(s)
  const seen = new Set<string>(), out: string[][] = []
  s.devices.forEach(d => {
    if (seen.has(d.id)) return
    const comp: string[] = [], st = [d.id]
    seen.add(d.id)
    while (st.length) {
      const c = st.pop()!
      comp.push(c)
      for (const e of adj.get(c) ?? []) if (!seen.has(e.to)) { seen.add(e.to); st.push(e.to) }
    }
    out.push(comp)
  })
  return out.sort((a, b) => b.length - a.length)
}

/* ------------------------------ Paket yuborish (ping) ------------------------------ */
export interface Hop { device: string; text: string; state: 'info' | 'ok' | 'fail' }
export interface PingResult { ok: boolean; path: string[]; hops: Hop[]; reason: string; fix?: string }

function hopText(d: Device): string {
  switch (d.kind) {
    case 'switch': return 'ramkani MAC-jadval boʻyicha kerakli portga yoʻnaltirdi (IP manzilga qaramadi).'
    case 'ap': return 'simsiz va simli tarmoq oʻrtasida koʻprik boʻlib, ramkani uzatdi.'
    case 'firewall': return 'paketni qoidalar boʻyicha tekshirdi — ruxsat berildi.'
    default: return 'signalni qoʻshni stansiyaga uzatdi (shina yoki halqa topologiyasi).'
  }
}

export function ping(s: LabState, srcId: string, dstId: string): PingResult {
  const byId = new Map(s.devices.map(d => [d.id, d]))
  const src = byId.get(srcId), dst = byId.get(dstId)
  const fail = (reason: string, fix: string, path: string[] = src ? [src.id] : [], hops: Hop[] = []): PingResult =>
    ({ ok: false, path, hops: [...hops, { device: path[path.length - 1] ?? srcId, text: reason, state: 'fail' }], reason, fix })
  if (!src || !dst) return fail('Manba va qabul qiluvchini tanlang.', 'Roʻyxatdan ikkita qurilmani tanlang.')
  if (src.id === dst.id) return fail('Manba va qabul qiluvchi bitta qurilma.', 'Ikki xil qurilmani tanlang.')
  for (const d of [src, dst]) {
    if (!KIND[d.kind].l3) return fail(`${d.name} — 2-qatlam qurilmasi, unga IP manzil berilmaydi.`, 'Manba va qabul qiluvchi sifatida kompyuter, laptop, printer, server yoki routerni tanlang.')
    if (!ifaces(d).length) return fail(`${d.name} qurilmasida IP manzil yoki maska sozlanmagan (yoki notoʻgʻri).`, `${d.name} ni tanlab, IP manzil va maskani kiriting yoki «Avto IP» tugmasini bosing.`, [src.id])
  }
  // IP ziddiyati
  const used = new Map<number, string>()
  for (const d of s.devices) for (const f of ifaces(d)) {
    const other = used.get(f.ip)
    if (other && other !== d.id && (d.id === src.id || d.id === dst.id || other === src.id || other === dst.id)) {
      return fail(`IP ziddiyati: ${ipStr(f.ip)} manzili ${byId.get(other)!.name} va ${d.name} qurilmalarining ikkalasida ham bor.`, 'Har bir qurilmaga takrorlanmaydigan manzil bering.')
    }
    used.set(f.ip, d.id)
  }

  const describe = (path: string[], from = 1, to = path.length - 1): Hop[] =>
    path.slice(from, to).map(id => ({ device: id, text: `${byId.get(id)!.name} ${hopText(byId.get(id)!)}`, state: 'info' as const }))
  const blocked = (path: string[]) => path.find(id => byId.get(id)!.kind === 'firewall' && byId.get(id)!.blockPing)
  const start: Hop = { device: src.id, text: `${src.name} paket tayyorladi: qabul qiluvchi — ${dst.name} (${ipStr(ifaces(dst)[0].ip)}).`, state: 'info' }

  const dstF = ifaces(dst)
  const srcF = ifaces(src).find(f => dstF.some(g => inNet(g.ip, f))) ?? ifaces(src)[0]
  const dstSame = dstF.find(g => inNet(g.ip, srcF))

  /* ---- 1-holat: bir xil tarmoq ---- */
  if (dstSame) {
    if (!inNet(srcF.ip, dstSame)) return fail(`Maskalar mos emas: ${src.name} uchun ${dst.name} «oʻz tarmogʻida», lekin ${dst.name} uchun ${src.name} boshqa tarmoqda. Soʻrov boradi, javob qaytmaydi.`, 'Ikkala qurilmaga bir xil maska bering (masalan, 255.255.255.0).', [src.id], [start])
    const path = findPath(s, src.id, dst.id, true)
    if (!path) {
      const viaRouter = findPath(s, src.id, dst.id, false)
      if (viaRouter) return fail(`${src.name} va ${dst.name} manzillari bir xil tarmoqqa tegishli, ammo ular orasida router turibdi. Router tarmoq ichidagi (ARP/broadcast) soʻrovni oʻtkazmaydi.`, 'Qurilmalarni bitta switchga ulang yoki ularni turli tarmoqlarga ajratib, shlyuzni sozlang.', [src.id], [start])
      const cut = s.links.some(l => l.down)
      return fail(`${src.name} dan ${dst.name} gacha jismoniy yoʻl yoʻq${cut ? ' — kabel uzilgan' : ''}.`, cut ? 'Uzilgan kabelni tiklang yoki muqobil yoʻl (qoʻshimcha kabel) yarating.' : '«Kabel ulash» rejimida qurilmalarni switchga ulang.', [src.id], [start])
    }
    const fw = blocked(path)
    if (fw) { const cutPath = path.slice(0, path.indexOf(fw) + 1); return fail(`${byId.get(fw)!.name} ping (ICMP) paketini blokladi.`, 'Firewall sozlamasida «Ping (ICMP) ni bloklash» belgisini olib tashlang yoki bu kutilgan himoya ekanini tushuntiring.', cutPath, [start, ...describe(cutPath, 1, cutPath.length - 1)]) }
    return { ok: true, path, reason: `${src.name} va ${dst.name} bir xil tarmoqda (${ipStr((srcF.ip & srcF.mask) >>> 0)}/${srcF.prefix}) — paket router ishtirokisiz yetib bordi va javob qaytdi.`,
      hops: [start, { device: src.id, text: `Manzil oʻz tarmogʻida — paket shlyuzga emas, toʻgʻridan-toʻgʻri ${dst.name} ning MAC manziliga yuboriladi.`, state: 'info' }, ...describe(path), { device: dst.id, text: `${dst.name} paketni qabul qildi va javob yubordi.`, state: 'ok' }] }
  }

  /* ---- 2-holat: boshqa tarmoq — router kerak ---- */
  let router: Device | undefined, p1: string[] | null = null
  const hops: Hop[] = [start]
  if (src.kind === 'router') {
    return fail(`${src.name} routerining hech bir interfeysi ${dst.name} tarmogʻida emas.`, `Routerning boʻsh interfeysiga ${dst.name} tarmogʻidan manzil bering.`, [src.id], hops)
  }
  const gw = parseIp(src.gateway)
  if (gw === null) return fail(`${dst.name} boshqa tarmoqda, lekin ${src.name} da shlyuz (gateway) ${src.gateway ? 'notoʻgʻri yozilgan' : 'koʻrsatilmagan'}. Kompyuter paketni qayerga yuborishni bilmaydi.`, `${src.name} ga shlyuz sifatida router manzilini kiriting.`, [src.id], hops)
  if (!inNet(gw, srcF)) return fail(`${src.name} ning shlyuzi (${ipStr(gw)}) uning oʻz tarmogʻida emas — unga yetib boʻlmaydi.`, 'Shlyuz kompyuter bilan bir xil tarmoqdan boʻlishi kerak.', [src.id], hops)
  router = s.devices.find(d => d.kind === 'router' && ifaces(d).some(f => f.ip === gw))
  if (!router) return fail(`Shlyuz manzili ${ipStr(gw)} hech bir routerga tegishli emas.`, 'Routerni qoʻshing va uning interfeysiga shu manzilni bering.', [src.id], hops)
  hops.push({ device: src.id, text: `Qabul qiluvchi boshqa tarmoqda — paket shlyuzga (${router.name}, ${ipStr(gw)}) yuboriladi.`, state: 'info' })
  p1 = findPath(s, src.id, router.id, true)
  if (!p1) return fail(`${src.name} dan shlyuzgacha (${router.name}) jismoniy yoʻl yoʻq.`, 'Kompyuter → switch → router zanjirini kabel bilan ulang.', [src.id], hops)
  const fw1 = blocked(p1)
  if (fw1) { const cutPath = p1.slice(0, p1.indexOf(fw1) + 1); return fail(`${byId.get(fw1)!.name} ping (ICMP) paketini blokladi.`, 'Firewall sozlamasini tekshiring.', cutPath, [...hops, ...describe(cutPath, 1, cutPath.length - 1)]) }
  hops.push(...describe(p1))
  const out = ifaces(router).find(f => dstF.some(g => inNet(g.ip, f)))
  if (!out) return fail(`${router.name} qabul qiluvchi tarmogʻiga ulanmagan — yoʻnaltirish jadvalida bunday yoʻl yoʻq.`, `Routerning ikkinchi interfeysiga ${dst.name} tarmogʻidan manzil bering.`, p1, hops)
  hops.push({ device: router.id, text: `${router.name} IP-sarlavhani oʻqidi, TTL ni kamaytirdi va yangi ramka yasadi (MAC manzillar qayta yozildi, IP manzillar oʻzgarmadi). Paket ${out.label} orqali chiqdi.`, state: 'info' })
  const p2 = findPath(s, router.id, dst.id, true)
  if (!p2) return fail(`${router.name} dan ${dst.name} gacha jismoniy yoʻl yoʻq.`, 'Routerni qabul qiluvchi tarmogʻidagi switchga ulang.', p1, hops)
  const full = [...p1, ...p2.slice(1)]
  const fw2 = blocked(p2)
  if (fw2) { const cutPath = [...p1, ...p2.slice(1, p2.indexOf(fw2) + 1)]; return fail(`${byId.get(fw2)!.name} ping (ICMP) paketini blokladi.`, 'Firewall sozlamasini tekshiring.', cutPath, [...hops, ...describe(p2, 1, p2.indexOf(fw2))]) }
  hops.push(...describe(p2))
  if (KIND[dst.kind].host) {
    const back = parseIp(dst.gateway)
    if (back === null || back !== out.ip) return fail(`Paket ${dst.name} ga yetib bordi, lekin javob qaytmadi: ${dst.name} da shlyuz ${back === null ? 'koʻrsatilmagan' : 'notoʻgʻri'}.`, `${dst.name} ga shlyuz sifatida ${ipStr(out.ip)} ni kiriting.`, full, hops)
  }
  hops.push({ device: dst.id, text: `${dst.name} paketni qabul qildi va javobni oʻz shlyuzi orqali qaytardi.`, state: 'ok' })
  return { ok: true, path: full, hops, reason: `${src.name} va ${dst.name} turli tarmoqlarda — paket ${router.name} orqali yoʻnaltirildi va javob qaytdi.` }
}

/* ------------------------------ Topologiyani aniqlash ------------------------------ */
export type TopoKey = 'none' | 'split' | 'star' | 'bus' | 'ring' | 'mesh' | 'tree' | 'hybrid'
export interface TopoInfo { key: TopoKey; name: string; note: string }
export function detectTopology(s: LabState): TopoInfo {
  const n = s.devices.length
  const links = s.links.filter(l => !l.down)
  const m = links.length
  if (n < 3) return { key: 'none', name: 'Hali aniqlanmadi', note: 'Topologiyani aniqlash uchun kamida 3 ta qurilmani qoʻshib, kabel bilan ulang.' }
  if (components(s).length > 1) return { key: 'split', name: 'Boʻlingan tarmoq', note: 'Qurilmalarning bir qismi qolganlari bilan bogʻlanmagan: ulanmagan qurilma yoki uzilgan kabel bor.' }
  const deg = new Map<string, number>(s.devices.map(d => [d.id, 0]))
  links.forEach(l => { deg.set(l.a, (deg.get(l.a) ?? 0) + 1); deg.set(l.b, (deg.get(l.b) ?? 0) + 1) })
  const degs = [...deg.values()]
  const max = Math.max(...degs)
  if (m === (n * (n - 1)) / 2) return { key: 'mesh', name: 'Toʻr (full mesh)', note: 'Har bir qurilma qolgan barchasi bilan bevosita bogʻlangan — istalgan kabel uzilsa ham muqobil yoʻl bor.' }
  if (m === n - 1 && max === n - 1) {
    const c = s.devices.find(d => deg.get(d.id) === max)!
    return { key: 'star', name: 'Yulduz (star)', note: `Barcha qurilmalar markazga — ${c.name} ga ulangan. Bitta kabel uzilsa faqat bitta qurilma aloqasiz qoladi, markaz ishdan chiqsa — butun tarmoq.` }
  }
  if (m === n && degs.every(d => d === 2)) return { key: 'ring', name: 'Halqa (ring)', note: 'Har bir qurilma ikkita qoʻshnisi bilan bogʻlangan, zanjir yopiq. Ikki tomonlama halqada bitta uzilishdan keyin ham teskari yoʻl qoladi.' }
  if (m === n - 1 && max <= 2) return { key: 'bus', name: 'Shina (bus)', note: 'Qurilmalar bitta umumiy magistral boʻylab ketma-ket joylashgan. Magistral oʻrtada uzilsa, tarmoq ikki qismga boʻlinadi.' }
  if (m === n - 1) return { key: 'tree', name: 'Kengaytirilgan yulduz (daraxt)', note: 'Bir nechta yulduz markazlari (switch, router) oʻzaro ketma-ket ulangan — zamonaviy LAN larning odatiy koʻrinishi.' }
  return { key: 'hybrid', name: 'Aralash / qisman toʻr', note: 'Baʼzi qurilmalar orasida zaxira (ortiqcha) aloqalar bor: bitta kabel uzilsa, trafik boshqa yoʻldan oʻtishi mumkin.' }
}

export const TOPO_FACTS: Record<'star' | 'bus' | 'ring' | 'mesh', { title: string; pros: string[]; cons: string[] }> = {
  star: { title: 'Yulduz (star)', pros: ['Bitta kabel uzilsa, qolganlar ishlaydi', 'Nosozlikni topish oson', 'Yangi qurilma qoʻshish oson', 'Zamonaviy LAN larning asosiy turi'], cons: ['Markaziy switch ishdan chiqsa — butun tarmoq toʻxtaydi', 'Har bir qurilmaga alohida kabel kerak'] },
  bus: { title: 'Shina (bus)', pros: ['Kam kabel talab qiladi', 'Oʻrnatish arzon va oddiy'], cons: ['Magistral uzilsa — tarmoq boʻlinadi', 'Toʻqnashuvlar (collision) koʻp', 'Nosozlikni topish qiyin', 'Bugun amalda ishlatilmaydi'] },
  ring: { title: 'Halqa (ring)', pros: ['Navbat bilan uzatish — toʻqnashuv yoʻq', 'Katta yuklamada barqaror tezlik', 'Ikki tomonlama halqada bitta uzilishga chidaydi'], cons: ['Bir tomonlama halqada bitta uzilish hammasini toʻxtatadi', 'Qurilma qoʻshish tarmoqni toʻxtatadi', 'LAN larda kam qoʻllanadi'] },
  mesh: { title: 'Toʻr (mesh)', pros: ['Eng yuqori nosozlikka chidamlilik', 'Muqobil yoʻl doim mavjud', 'Yuklama kanallar boʻylab taqsimlanadi'], cons: ['Koʻp kabel va port talab qiladi', 'Eng qimmat yechim', 'Sozlash murakkab'] },
}

/* ------------------------------ Diagnostika ------------------------------ */
export interface Finding { level: 'error' | 'warn' | 'ok' | 'info'; text: string; device?: string }
export function diagnose(s: LabState): Finding[] {
  const out: Finding[] = []
  if (!s.devices.length) return [{ level: 'info', text: 'Ish maydoni boʻsh. Yuqoridagi tugmalar bilan qurilma qoʻshing yoki tayyor andozani yuklang.' }]
  const hosts = s.devices.filter(d => KIND[d.kind].host)
  const routers = s.devices.filter(d => d.kind === 'router')
  const linked = new Set<string>()
  s.links.forEach(l => { linked.add(l.a); linked.add(l.b) })

  s.devices.filter(d => !linked.has(d.id)).forEach(d => out.push({ level: 'error', device: d.id, text: `${d.name} hech narsaga ulanmagan — unga kabel torting.` }))
  s.links.filter(l => l.down).forEach(l => {
    const a = s.devices.find(d => d.id === l.a)?.name, b = s.devices.find(d => d.id === l.b)?.name
    out.push({ level: 'warn', text: `${a} ↔ ${b} kabeli uzilgan.` })
  })
  const comps = components(s)
  if (comps.length > 1 && s.devices.every(d => linked.has(d.id))) out.push({ level: 'error', text: `Tarmoq ${comps.length} ta alohida qismga boʻlingan — ular bir-biri bilan aloqa qila olmaydi.` })

  const seen = new Map<number, Device>()
  for (const d of s.devices.filter(x => KIND[x.kind].l3)) {
    const ipErr = fieldError('ip', d.ip, d), maskErr = fieldError('mask', d.mask)
    if (!d.ip && KIND[d.kind].host) out.push({ level: 'error', device: d.id, text: `${d.name}: IP manzil berilmagan.` })
    else if (ipErr) out.push({ level: 'error', device: d.id, text: `${d.name}: IP manzil xato — ${ipErr}` })
    if (d.ip && !d.mask) out.push({ level: 'error', device: d.id, text: `${d.name}: maska koʻrsatilmagan.` })
    else if (maskErr) out.push({ level: 'error', device: d.id, text: `${d.name}: maska xato — ${maskErr}` })
    for (const f of ifaces(d)) {
      const o = seen.get(f.ip)
      if (o && o.id !== d.id) out.push({ level: 'error', device: d.id, text: `IP ziddiyati: ${ipStr(f.ip)} manzili ${o.name} va ${d.name} da takrorlangan.` })
      seen.set(f.ip, d)
    }
    if (KIND[d.kind].host && ifaces(d).length) {
      const gwErr = fieldError('gateway', d.gateway, d)
      if (!d.gateway) { if (routers.length) out.push({ level: 'warn', device: d.id, text: `${d.name}: shlyuz koʻrsatilmagan — u faqat oʻz tarmogʻi ichida ishlaydi.` }) }
      else if (gwErr) out.push({ level: 'error', device: d.id, text: `${d.name}: shlyuz xato — ${gwErr}` })
      else if (!routers.some(r => ifaces(r).some(f => f.ip === parseIp(d.gateway)))) out.push({ level: 'warn', device: d.id, text: `${d.name}: shlyuz manzili (${d.gateway}) hech bir routerga tegishli emas.` })
    }
  }
  // bir segmentdagi turli tarmoqlar
  const nets = new Set(hosts.flatMap(h => ifaces(h).map(f => ipStr((f.ip & f.mask) >>> 0) + '/' + f.prefix)))
  if (nets.size > 1 && !routers.length) out.push({ level: 'warn', text: `Qurilmalar ${nets.size} xil tarmoqqa (${[...nets].join(', ')}) tegishli, lekin router yoʻq — turli tarmoqlar oʻzaro gaplasha olmaydi.` })
  if (hosts.length > 2 && !s.devices.some(d => d.kind === 'switch')) out.push({ level: 'info', text: 'Uchtadan ortiq qurilmani ulash uchun switch qulay: har biri alohida kabel bilan markazga ulanadi (yulduz).' })
  if (routers.length && !s.devices.some(d => d.kind === 'firewall')) out.push({ level: 'info', text: 'Tarmoq chegarasida firewall yoʻq. Xavfsizlik uchun router va ichki tarmoq orasiga firewall qoʻying.' })

  if (!out.some(f => f.level === 'error')) {
    if (hosts.length >= 2 && hosts.every(h => ifaces(h).length)) out.unshift({ level: 'ok', text: `Barcha ${hosts.length} ta oxirgi qurilmada IP manzil toʻgʻri va takrorlanmagan.` })
    if (comps.length === 1 && s.devices.length > 1) out.unshift({ level: 'ok', text: `Barcha ${s.devices.length} ta qurilma bitta tarmoqqa ulangan.` })
  }
  return out
}

/* ------------------------------ Yordamchi amallar ------------------------------ */
let seq = 0
export const uid = (p: string) => p + Date.now().toString(36) + (seq++).toString(36)

export function nextName(s: LabState, kind: DeviceKind): string {
  const base = { pc: 'PC', laptop: 'Laptop', printer: 'Printer', server: 'Server', switch: 'Switch', router: 'Router', ap: 'AP', firewall: 'Firewall' }[kind]
  for (let i = 1; ; i++) { const name = base + i; if (!s.devices.some(d => d.name === name)) return name }
}

/** DHCP ga oʻxshab manzil tarqatadi: router — .1, qolganlar — .10 dan boshlab. Mavjud toʻgʻri manzillar saqlanadi. */
export function autoAddress(s: LabState): LabState {
  const base = '192.168.1.', mask = '255.255.255.0'
  const router = s.devices.find(d => d.kind === 'router')
  const taken = new Set(s.devices.flatMap(d => [d.ip, d.ip2]).filter(Boolean) as string[])
  let gw = router?.ip && parseIp(router.ip) !== null ? router.ip : ''
  let next = 10
  const free = () => { while (taken.has(base + next)) next++; const v = base + next; taken.add(v); return v }
  const devices = s.devices.map(d => {
    if (d.kind === 'router' && d.id === router?.id && !gw) { gw = base + '1'; taken.add(gw); return { ...d, ip: gw, mask } }
    return d
  }).map(d => {
    if (!KIND[d.kind].host) return d
    const okIp = ifaces(d).length > 0
    return { ...d, ip: okIp ? d.ip : free(), mask: okIp ? d.mask : mask, gateway: d.gateway && !fieldError('gateway', d.gateway, d) ? d.gateway : gw || undefined }
  })
  return { ...s, devices }
}

/** Qurilmalarni tartibli joylashtiradi: tepada chegara qurilmalari, oʻrtada switch, pastda oxirgi qurilmalar. */
export function arrange(s: LabState, W = 960): LabState {
  const row = (ids: Device[], y: number, from = 90, to = W - 90) => ids.forEach((d, i) => { d.x = ids.length === 1 ? W / 2 : from + ((to - from) * i) / (ids.length - 1); d.y = y })
  const ds = s.devices.map(d => ({ ...d }))
  const top = ds.filter(d => d.kind === 'router' || d.kind === 'firewall')
  const mid = ds.filter(d => d.kind === 'switch' || d.kind === 'ap')
  const hosts = ds.filter(d => KIND[d.kind].host)
  const span = (n: number, gap: number): [number, number] => [W / 2 - (gap * Math.max(n - 1, 0)) / 2, W / 2 + (gap * Math.max(n - 1, 0)) / 2]
  row(top, 70, ...span(top.length, 190))
  row(mid, 215, ...span(mid.length, 240))
  if (hosts.length <= 8) row(hosts, 430)
  else { const h = Math.ceil(hosts.length / 2); row(hosts.slice(0, h), 365); row(hosts.slice(h), 475) }
  return { ...s, devices: ds }
}

/* ------------------------------ Amaliy topshiriqni baholash ------------------------------ */
export interface Criterion { title: string; score: number; max: number; notes: string[] }
/** «10 ta kompyuter va 1 ta printer uchun lokal tarmoq» topshirigʻi — olti mezon, jami 100 ball. */
export function gradeLan(s: LabState, measures: string[], explanation: string): Criterion[] {
  const pcs = s.devices.filter(d => d.kind === 'pc' || d.kind === 'laptop')
  const printers = s.devices.filter(d => d.kind === 'printer')
  const switches = s.devices.filter(d => d.kind === 'switch')
  const routers = s.devices.filter(d => d.kind === 'router')
  const fws = s.devices.filter(d => d.kind === 'firewall')
  const hosts = [...pcs, ...printers]
  const live = s.links.filter(l => !l.down)
  const neigh = (id: string) => live.filter(l => l.a === id || l.b === id).map(l => (l.a === id ? l.b : l.a))
  const kindOf = (id: string) => s.devices.find(d => d.id === id)?.kind
  const c: Criterion[] = []

  // 1. Topologiya
  const onCenter = hosts.filter(h => neigh(h.id).some(n => kindOf(n) === 'switch' || kindOf(n) === 'ap'))
  const hostToHost = hosts.filter(h => neigh(h.id).some(n => { const k = kindOf(n); return k === 'pc' || k === 'laptop' || k === 'printer' }))
  let t = 0; const tn: string[] = []
  if (hosts.length && onCenter.length === hosts.length) { t += 12; tn.push('Barcha kompyuter va printer markaziy switchga (yoki access pointga) ulangan — yulduz topologiyasi.') }
  else tn.push(`${hosts.length - onCenter.length} ta qurilma markaziy switchga ulanmagan.`)
  if (!hostToHost.length && hosts.length) { t += 6; tn.push('Kompyuterlar bir-biriga ketma-ket ulanmagan (shina emas).') } else if (hosts.length) tn.push('Baʼzi kompyuterlar bir-biriga toʻgʻridan-toʻgʻri ulangan — bu yulduzni buzadi.')
  c.push({ title: 'Topologiyani toʻgʻri tanlash', score: t, max: 18, notes: tn })

  // 2. Qurilmalar
  let dv = 0; const dn: string[] = []
  dv += Math.min(pcs.length, 10) * 0.8; dn.push(`Kompyuterlar: ${pcs.length} / 10.`)
  if (printers.length >= 1) { dv += 3; dn.push('Printer bor.') } else dn.push('Printer qoʻshilmagan.')
  if (switches.length >= 1) { dv += 3; dn.push('Switch bor — lokal tarmoq markazi.') } else dn.push('Switch yoʻq: 11 ta qurilmani nima birlashtiradi?')
  if (routers.length >= 1) { dv += 3; dn.push('Router bor — Internetga chiqish va shlyuz.') } else dn.push('Router yoʻq: Internetga chiqish nuqtasi kerak.')
  c.push({ title: 'Qurilmalarni toʻgʻri tanlash', score: Math.round(dv), max: 17, notes: dn })

  // 3. IP manzillash
  let ip = 0; const inn: string[] = []
  const good = hosts.filter(h => ifaces(h).length && !fieldError('ip', h.ip, h))
  const ips = good.map(h => h.ip)
  const unique = new Set(ips).size === ips.length
  const nets = new Set(good.map(h => { const f = ifaces(h)[0]; return ((f.ip & f.mask) >>> 0) + '/' + f.prefix }))
  if (hosts.length && good.length === hosts.length) { ip += 7; inn.push('Har bir qurilmada toʻgʻri IP manzil va maska bor.') } else inn.push(`${hosts.length - good.length} ta qurilmada IP manzil yoʻq yoki xato.`)
  if (good.length > 1 && unique) { ip += 4; inn.push('Manzillar takrorlanmagan.') } else if (good.length > 1) inn.push('Takrorlangan IP manzil bor (ziddiyat).')
  if (good.length > 1 && nets.size === 1) { ip += 3; inn.push('Hamma qurilma bitta tarmoqda.') } else if (good.length > 1) inn.push('Qurilmalar turli tarmoqlarga tarqalib ketgan.')
  const rIps = routers.flatMap(r => ifaces(r).map(f => f.ip))
  const gwOk = good.filter(h => { const g = parseIp(h.gateway); return g !== null && rIps.includes(g) })
  if (good.length && gwOk.length === good.length) { ip += 4; inn.push('Shlyuz hamma joyda router manziliga teng.') } else inn.push('Shlyuz baʼzi qurilmalarda yoʻq yoki router manziliga mos emas.')
  c.push({ title: 'IP manzillash', score: ip, max: 18, notes: inn })

  // 4. Ulanishlar
  let ln = 0; const lnn: string[] = []
  const ref = hosts[0]
  const reach = ref ? hosts.filter(h => h.id === ref.id || findPath(s, ref.id, h.id, true)) : []
  if (hosts.length > 1 && reach.length === hosts.length) { ln += 10; lnn.push('Barcha kompyuterlar va printer bir-biriga yetib boradi.') } else lnn.push(`${hosts.length - reach.length} ta qurilma qolganlari bilan bogʻlanmagan.`)
  if (routers.length && ref && findPath(s, ref.id, routers[0].id, true)) { ln += 5; lnn.push('Lokal tarmoq routerga ulangan.') } else lnn.push('Lokal tarmoqdan routergacha yoʻl yoʻq.')
  if (s.links.every(l => !l.down)) ln += 2; else lnn.push('Uzilgan kabel bor.')
  c.push({ title: 'Ulanishlar', score: ln, max: 17, notes: lnn })

  // 5. Xavfsizlik
  let sec = 0; const sn: string[] = []
  if (fws.length) { sec += 6; sn.push('Firewall qoʻshilgan.') } else sn.push('Sxemada firewall yoʻq.')
  const fwInline = fws.some(f => { const k = neigh(f.id).map(kindOf); return k.includes('router') && k.includes('switch') })
  if (fwInline) { sec += 3; sn.push('Firewall router va switch orasida — chegarada turibdi.') } else if (fws.length) sn.push('Firewall router bilan switch orasiga qoʻyilsa, butun trafik u orqali oʻtadi.')
  const mm = Math.min(measures.length, 3) * 2; sec += mm
  sn.push(measures.length >= 3 ? `Tanlangan choralar: ${measures.length} ta.` : `Kamida 3 ta qoʻshimcha chora tanlang (hozir ${measures.length} ta).`)
  c.push({ title: 'Xavfsizlik', score: sec, max: 15, notes: sn })

  // 6. Izoh
  const words = explanation.trim().split(/\s+/).filter(Boolean)
  const low = explanation.toLowerCase()
  const keys = ['switch', 'router', 'ip', 'firewall', 'yulduz', 'star', 'dhcp', 'parol', 'vlan', 'shlyuz', 'gateway'].filter(k => low.includes(k))
  let ex = 0; const en: string[] = []
  if (words.length >= 25) { ex += 8; en.push(`Izoh yetarlicha batafsil (${words.length} soʻz).`) } else if (words.length >= 10) { ex += 4; en.push(`Izoh qisqa (${words.length} soʻz) — kamida 25 soʻz bilan asoslang.`) } else en.push('Tanlovingizni kamida 25 soʻz bilan asoslang.')
  ex += Math.min(keys.length, 4) * 1.75
  en.push(keys.length ? `Asosiy tushunchalar ishlatilgan: ${keys.join(', ')}.` : 'Izohda switch, router, IP, firewall kabi tushunchalarga tayaning.')
  en.push('Izoh mazmunini yakuniy tarzda oʻqituvchi baholaydi.')
  c.push({ title: 'Loyihani izohlash', score: Math.round(ex), max: 15, notes: en })
  return c
}
