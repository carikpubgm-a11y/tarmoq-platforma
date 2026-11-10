import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Kurs from './pages/Kurs'
import Kirish from './pages/Kirish'
import Turlari from './pages/Turlari'
import Topologiyalar from './pages/Topologiyalar'
import Qurilmalar from './pages/Qurilmalar'
import Loyihalash from './pages/Loyihalash'
import Ip from './pages/Ip'
import Xavfsizlik from './pages/Xavfsizlik'
import Tahdidlar from './pages/Tahdidlar'
import Laboratoriya from './pages/Laboratoriya'
import LabFirewall from './pages/LabFirewall'
import Jurnal from './pages/methods/Jurnal'
import AmaliyTopshiriq from './pages/methods/AmaliyTopshiriq'
import Xulosa from './pages/Xulosa'
import Himoya from './pages/Himoya'
import OquvchiKirish from './pages/OquvchiKirish'
import Reyting from './pages/Reyting'
import Fikr from './pages/Fikr'
import Sertifikat from './pages/Sertifikat'
import Oqituvchi from './pages/Oqituvchi'
import Bosqich from './pages/Bosqich'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/himoya" element={<Himoya />} />
      <Route path="/kirish-oquvchi" element={<OquvchiKirish />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/bosqich/:slug" element={<Bosqich />} />
        <Route path="/kurs" element={<Kurs />} />
        <Route path="/kirish" element={<Kirish />} />
        <Route path="/turlari" element={<Turlari />} />
        <Route path="/topologiyalar" element={<Topologiyalar />} />
        <Route path="/qurilmalar" element={<Qurilmalar />} />
        <Route path="/loyihalash" element={<Loyihalash />} />
        <Route path="/ip" element={<Ip />} />
        <Route path="/xavfsizlik" element={<Xavfsizlik />} />
        <Route path="/tahdidlar" element={<Tahdidlar />} />
        <Route path="/laboratoriya" element={<Laboratoriya />} />
        <Route path="/laboratoriya/firewall" element={<LabFirewall />} />
        <Route path="/metodika/jurnal" element={<Jurnal />} />
        <Route path="/metodika/amaliy" element={<AmaliyTopshiriq />} />
        <Route path="/reyting" element={<Reyting />} />
        <Route path="/fikr" element={<Fikr />} />
        <Route path="/sertifikat" element={<Sertifikat />} />
        <Route path="/oqituvchi" element={<Oqituvchi />} />
        <Route path="/xulosa" element={<Xulosa />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
