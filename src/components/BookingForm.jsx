import { useEffect, useState } from 'react'

const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function BookingForm({ onBooked }) {
  const [services, setServices] = useState([])
  const [barbers, setBarbers] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    service_id: '',
    date: '',
    time: '',
    barber_id: '',
    notes: ''
  })
  const [message, setMessage] = useState(null)

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [sRes, bRes] = await Promise.all([
          fetch(`${apiBase}/services`),
          fetch(`${apiBase}/barbers`)
        ])
        const [s, b] = await Promise.all([sRes.json(), bRes.json()])
        setServices(s)
        setBarbers(b)
        setForm(f => ({ ...f, service_id: s[0]?._id || '', barber_id: '' }))
      } catch (e) {
        console.error(e)
        setMessage('Failed to load services/barbers')
      } finally {
        setLoading(false)
      }
    }
    fetchMeta()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setMessage(null)
    try {
      const payload = { ...form }
      if (!payload.barber_id) delete payload.barber_id
      const res = await fetch(`${apiBase}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Booking failed')
      setMessage('✅ Booking confirmed!')
      onBooked?.()
    } catch (err) {
      setMessage(`❌ ${err.message}`)
    }
  }

  if (loading) return <div className="text-blue-200">Loading...</div>

  return (
    <form onSubmit={submit} className="space-y-4">
      {message && <div className="text-sm p-2 rounded bg-slate-800 text-blue-200">{message}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-blue-200 mb-1">Your Name</label>
          <input name="customer_name" value={form.customer_name} onChange={handleChange} className="w-full px-3 py-2 rounded bg-slate-800/60 border border-blue-500/20 text-white" required />
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-3 py-2 rounded bg-slate-800/60 border border-blue-500/20 text-white" required />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-blue-200 mb-1">Service</label>
          <select name="service_id" value={form.service_id} onChange={handleChange} className="w-full px-3 py-2 rounded bg-slate-800/60 border border-blue-500/20 text-white" required>
            {services.map(s => (
              <option key={s._id || s.title} value={s._id}>{s.title} • ${s.price} • {s.duration_minutes}m</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} className="w-full px-3 py-2 rounded bg-slate-800/60 border border-blue-500/20 text-white" required />
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Time</label>
          <input type="time" name="time" value={form.time} onChange={handleChange} className="w-full px-3 py-2 rounded bg-slate-800/60 border border-blue-500/20 text-white" required />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-blue-200 mb-1">Preferred Barber (optional)</label>
          <select name="barber_id" value={form.barber_id} onChange={handleChange} className="w-full px-3 py-2 rounded bg-slate-800/60 border border-blue-500/20 text-white">
            <option value="">No preference</option>
            {barbers.map(b => (
              <option key={b._id || b.name} value={b._id}>{b.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-blue-200 mb-1">Notes</label>
          <input name="notes" value={form.notes} onChange={handleChange} className="w-full px-3 py-2 rounded bg-slate-800/60 border border-blue-500/20 text-white" placeholder="Any special requests" />
        </div>
      </div>
      <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors">Book Now</button>
    </form>
  )
}
