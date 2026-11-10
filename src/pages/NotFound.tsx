import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="font-mono text-sm font-bold text-teal-700">404</p>
      <h1 className="mt-3 text-3xl font-extrabold">Bunday boʻlim topilmadi</h1>
      <p className="mt-3 text-slate-600">Manzil notoʻgʻri yozilgan boʻlishi mumkin.</p>
      <Link to="/" className="mt-6 inline-block rounded-xl bg-teal-600 px-5 py-3 font-semibold text-white hover:bg-teal-700">Bosh sahifaga qaytish</Link>
    </div>
  )
}
