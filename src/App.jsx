import { useEffect, useMemo, useState } from 'react'
import BookingForm from './components/BookingForm'
import BookingList from './components/BookingList'

const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function App() {
  const todayStr = useMemo(() => new Date().toISOString().slice(0,10), [])
  const [selectedDate, setSelectedDate] = useState(todayStr)
  const [seeded, setSeeded] = useState(false)
  const [status, setStatus] = useState('')

  const seedIfNeeded = async () => {
    try {
      const res = await fetch(`${apiBase}/services`)
      if (res.ok) {
        const s = await res.json()
        if (!Array.isArray(s) || s.length === 0) {
          await fetch(`${apiBase}/seed`, { method: 'POST' })
          setSeeded(true)
        }
      }
    } catch (e) {
      setStatus('Backend not reachable. Open /test page to debug connection.')
    }
  }

  useEffect(() => { seedIfNeeded() }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" />

      <div className="relative max-w-6xl mx-auto px-6 py-10">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Barber Shop Booking</h1>
          <p className="text-blue-200 mt-2">Book your slot before you arrive. Choose a service, pick a time, and you’re all set.</p>
          {status && <p className="text-red-300 mt-2">{status}</p>}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 bg-slate-900/50 border border-blue-500/20 rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">Make a Booking</h2>
            <BookingForm onBooked={() => { /* refresh list */ }} />
          </div>

          <div className="lg:col-span-2 bg-slate-900/50 border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Today’s Schedule</h2>
              <input type="date" value={selectedDate} onChange={(e)=>setSelectedDate(e.target.value)} className="px-3 py-1 rounded bg-slate-800/60 border border-blue-500/20 text-white" />
            </div>
            <BookingList date={selectedDate} />
          </div>
        </div>

        <footer className="mt-10 text-center text-blue-300/60 text-sm">
          Tip: If this is empty on first load, click the test page to verify the backend, then return here.
          <div>
            <a href="/test" className="underline">Open test page</a>
          </div>
        </footer>
      </div>
    </div>
  )
}
