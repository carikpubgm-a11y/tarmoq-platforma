import { arrange, type Device, type DeviceKind, type LabState, type Link } from '../lib/net'

const M = '255.255.255.0'
function dev(kind: DeviceKind, name: string, x: number, y: number, ip?: string, gateway?: string, extra: Partial<Device> = {}): Device {
  return { id: name.toLowerCase(), kind, name, x, y, ip, mask: ip ? M : undefined, gateway, ...extra }
}
const link = (a: string, b: string): Link => ({ id: a + '-' + b, a, b })

export const EMPTY: LabState = { devices: [], links: [] }

function ringPos(n: number, cx = 480, cy = 265, r = 185) {
  return Array.from({ length: n }, (_, i) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2
    return { x: Math.round(cx + Math.cos(a) * r), y: Math.round(cy + Math.sin(a) * r) }
  })
}

const star: LabState = {
  devices: [
    dev('switch', 'Switch1', 480, 265),
    dev('pc', 'PC1', 200, 110, '192.168.1.10'), dev('pc', 'PC2', 760, 110, '192.168.1.11'),
    dev('pc', 'PC3', 170, 410, '192.168.1.12'), dev('printer', 'Printer1', 790, 410, '192.168.1.20'),
    dev('server', 'Server1', 480, 470, '192.168.1.5'),
  ],
  links: ['pc1', 'pc2', 'pc3', 'printer1', 'server1'].map(h => link('switch1', h)),
}

const bus: LabState = {
  devices: [0, 1, 2, 3, 4].map(i => dev('pc', 'PC' + (i + 1), 120 + i * 180, 265, '192.168.1.' + (10 + i))),
  links: [1, 2, 3, 4].map(i => link('pc' + i, 'pc' + (i + 1))),
}

const ring: LabState = (() => {
  const p = ringPos(5)
  return {
    devices: p.map((q, i) => dev('pc', 'PC' + (i + 1), q.x, q.y, '192.168.1.' + (10 + i))),
    links: [1, 2, 3, 4, 5].map(i => link('pc' + i, 'pc' + ((i % 5) + 1))),
  }
})()

const mesh: LabState = (() => {
  const p = ringPos(4, 480, 265, 195)
  const devices = p.map((q, i) => dev('pc', 'PC' + (i + 1), q.x, q.y, '192.168.1.' + (10 + i)))
  const links: Link[] = []
  for (let i = 1; i <= 4; i++) for (let j = i + 1; j <= 4; j++) links.push(link('pc' + i, 'pc' + j))
  return { devices, links }
})()

const GW = '192.168.1.1'
const office: LabState = {
  devices: [
    dev('router', 'Router1', 480, 60, GW),
    dev('firewall', 'Firewall1', 480, 165),
    dev('switch', 'Switch1', 480, 275),
    dev('ap', 'AP1', 770, 275),
    dev('pc', 'PC1', 110, 440, '192.168.1.10', GW), dev('pc', 'PC2', 270, 440, '192.168.1.11', GW), dev('pc', 'PC3', 430, 440, '192.168.1.12', GW),
    dev('printer', 'Printer1', 590, 440, '192.168.1.20', GW), dev('server', 'Server1', 200, 275, '192.168.1.5', GW),
    dev('laptop', 'Laptop1', 860, 440, '192.168.1.30', GW),
  ],
  links: [link('router1', 'firewall1'), link('firewall1', 'switch1'), link('switch1', 'ap1'), link('ap1', 'laptop1'),
    ...['pc1', 'pc2', 'pc3', 'printer1', 'server1'].map(h => link('switch1', h))],
}

const twoNets: LabState = {
  devices: [
    dev('router', 'Router1', 480, 90, '192.168.1.1', undefined, { ip2: '192.168.2.1', mask2: M }),
    dev('switch', 'Switch1', 250, 250), dev('switch', 'Switch2', 710, 250),
    dev('pc', 'PC1', 140, 430, '192.168.1.10', '192.168.1.1'), dev('pc', 'PC2', 340, 430, '192.168.1.11', '192.168.1.1'),
    dev('pc', 'PC3', 620, 430, '192.168.2.10', '192.168.2.1'), dev('server', 'Server1', 820, 430, '192.168.2.5', '192.168.2.1'),
  ],
  links: [link('router1', 'switch1'), link('router1', 'switch2'), link('switch1', 'pc1'), link('switch1', 'pc2'), link('switch2', 'pc3'), link('switch2', 'server1')],
}

/** «10 ta kompyuter va 1 ta printer» topshirigʻining namunaviy yechimi. */
export const LAN_SOLUTION: LabState = arrange({
  devices: [
    dev('router', 'Router1', 0, 0, GW), dev('firewall', 'Firewall1', 0, 0), dev('switch', 'Switch1', 0, 0),
    ...Array.from({ length: 10 }, (_, i) => dev('pc', 'PC' + (i + 1), 0, 0, '192.168.1.' + (10 + i), GW)),
    dev('printer', 'Printer1', 0, 0, '192.168.1.50', GW),
  ],
  links: [link('router1', 'firewall1'), link('firewall1', 'switch1'),
    ...Array.from({ length: 10 }, (_, i) => link('switch1', 'pc' + (i + 1))), link('switch1', 'printer1')],
})

export type PresetKey = 'star' | 'bus' | 'ring' | 'mesh' | 'office' | 'twoNets'
export const PRESETS: Record<PresetKey, { label: string; hint: string; state: LabState }> = {
  star: { label: 'Yulduz (star)', hint: 'Markazda switch, har bir qurilma alohida kabel bilan', state: star },
  bus: { label: 'Shina (bus)', hint: 'Qurilmalar bitta magistral boʻylab ketma-ket', state: bus },
  ring: { label: 'Halqa (ring)', hint: 'Har bir qurilma ikki qoʻshnisi bilan bogʻlangan', state: ring },
  mesh: { label: 'Toʻr (mesh)', hint: 'Har bir qurilma qolgan barchasi bilan bogʻlangan', state: mesh },
  office: { label: 'Kichik ofis', hint: 'Router → firewall → switch, Wi-Fi nuqtasi va laptop', state: office },
  twoNets: { label: 'Ikki tarmoq + router', hint: 'Turli IP-tarmoqlar orasida yoʻnaltirish', state: twoNets },
}
