import { useEffect, useState } from 'react'

const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function BookingList({ date }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchBookings = async (d) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${apiBase}/bookings?date=${d}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to load bookings')
      setBookings(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (date) fetchBookings(date)
  }, [date])

  return (
    <div className="space-y-3">
      {loading && <div className="text-blue-200">Loading bookings...</div>}
      {error && <div className="text-red-300 bg-red-900/30 border border-red-500/30 p-2 rounded">{error}</div>}
      {(!loading && bookings.length === 0) && (
        <div className="text-blue-200">No bookings for this date yet.</div>
      )}
      {bookings.map(b => (
        <div key={b.id} className="bg-slate-800/50 border border-blue-500/20 rounded p-3 text-blue-100">
          <div className="flex items-center justify-between">
            <div className="font-semibold">{b.customer_name}</div>
            <div className="text-sm opacity-80">{b.status}</div>
          </div>
          <div className="text-sm opacity-90">{b.service_title} • {b.time} • {b.duration_minutes}m {b.barber_name ? `• ${b.barber_name}` : ''}</div>
          <div className="text-xs opacity-70">{b.phone}</div>
        </div>
      ))}
    </div>
  )
}
