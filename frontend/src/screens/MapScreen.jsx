import { useState, useEffect } from 'react'
import { getFraudHeatmap } from '../services/api'

export default function MapScreen() {
  const [filter, setFilter] = useState('24h')
  const [heatData, setHeatData] = useState([])
  const [selectedCity, setSelectedCity] = useState(null)

  const filters = [
    { id: '1h', label: 'Last Hour' },
    { id: '24h', label: '24 Hours' },
    { id: '7d', label: 'This Week' },
  ]

  const fraudPins = [
    { id: 1, city: 'Delhi', lat: 28.6, lng: 77.2, severity: 'critical', reports: 45, x: '58%', y: '22%' },
    { id: 2, city: 'Mumbai', lat: 19.0, lng: 72.8, severity: 'high', reports: 38, x: '35%', y: '55%' },
    { id: 3, city: 'Bangalore', lat: 12.9, lng: 77.5, severity: 'medium', reports: 22, x: '50%', y: '75%' },
    { id: 4, city: 'Chennai', lat: 13.0, lng: 80.2, severity: 'high', reports: 30, x: '62%', y: '78%' },
    { id: 5, city: 'Kolkata', lat: 22.5, lng: 88.3, severity: 'medium', reports: 18, x: '75%', y: '40%' },
    { id: 6, city: 'Hyderabad', lat: 17.3, lng: 78.4, severity: 'critical', reports: 42, x: '52%', y: '62%' },
  ]

  const severityColors = { critical: '#ff3d57', high: '#ff9100', medium: '#ffd600' }
  const severityGlow = { critical: 'rgba(255,61,87,0.4)', high: 'rgba(255,145,0,0.35)', medium: 'rgba(255,214,0,0.3)' }

  const recentReports = [
    { id: 1, type: 'Phishing SMS', location: 'Mumbai, Maharashtra', time: '5 min ago', severity: 'critical' },
    { id: 2, type: 'Fake Banking App', location: 'Delhi NCR', time: '12 min ago', severity: 'high' },
    { id: 3, type: 'WhatsApp Scam', location: 'Bangalore, Karnataka', time: '25 min ago', severity: 'medium' },
    { id: 4, type: 'UPI Fraud', location: 'Chennai, Tamil Nadu', time: '1 hour ago', severity: 'high' },
  ]

  useEffect(() => {
    getFraudHeatmap().then(r => r && setHeatData(r)).catch(() => {})
  }, [])

  return (
    <div className="screen-content" style={{ padding: '0 0 90px 0' }}>
      {/* Header */}
      <div style={{ padding: '16px 18px 8px' }}>
        <h1 style={{ fontSize: '1.15rem', fontWeight: 800, background: 'linear-gradient(135deg, #00c6ff, #0ff0fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4 }}>Live Fraud Map</h1>
        <p style={{ fontSize: '0.82rem', color: '#8a9cbc' }}>Real-time fraud activity near you</p>
      </div>

      <div style={{ padding: '0 18px' }}>
        {/* Time Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a9cbc" strokeWidth="1.8"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding: '8px 18px', borderRadius: 20, border: 'none', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter', transition: 'all 0.25s',
              background: filter === f.id ? 'linear-gradient(135deg, #00c6ff, #0066cc)' : 'rgba(255,255,255,0.04)',
              color: filter === f.id ? '#fff' : '#8a9cbc',
              boxShadow: filter === f.id ? '0 4px 16px rgba(0,198,255,0.3)' : 'none',
            }}>{f.label}</button>
          ))}
        </div>

        {/* Map Container */}
        <div style={{ background: 'rgba(16,30,52,0.6)', border: '1px solid rgba(0,198,255,0.08)', borderRadius: 20, padding: 20, position: 'relative', height: 320, marginBottom: 16, overflow: 'hidden' }}>
          {/* Dark map background with grid */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(20,40,70,0.8) 0%, rgba(10,22,40,0.95) 100%)' }}>
            {/* Grid lines */}
            {[...Array(8)].map((_, i) => (
              <div key={`h${i}`} style={{ position: 'absolute', left: 0, right: 0, top: `${(i + 1) * 12}%`, height: 1, background: 'rgba(255,255,255,0.03)' }} />
            ))}
            {[...Array(6)].map((_, i) => (
              <div key={`v${i}`} style={{ position: 'absolute', top: 0, bottom: 0, left: `${(i + 1) * 16}%`, width: 1, background: 'rgba(255,255,255,0.03)' }} />
            ))}
          </div>

          {/* Fraud Pins */}
          {fraudPins.map(pin => (
            <div key={pin.id} onClick={() => setSelectedCity(selectedCity?.id === pin.id ? null : pin)} style={{
              position: 'absolute', left: pin.x, top: pin.y, transform: 'translate(-50%, -50%)', cursor: 'pointer', zIndex: 5, transition: 'transform 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.15)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'}>
              {/* Pulse ring */}
              <div style={{ position: 'absolute', inset: -12, borderRadius: '50%', background: severityGlow[pin.severity], animation: 'pulseGlow 2s infinite' }} />
              {/* Pin body */}
              <div style={{ width: 36, height: 36, borderRadius: 10, background: severityColors[pin.severity], display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: `0 4px 16px ${severityGlow[pin.severity]}` }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3" fill={severityColors[pin.severity]}/></svg>
              </div>
            </div>
          ))}

          {/* Selected City Popup */}
          {selectedCity && (
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(10,22,40,0.95)', border: '1px solid rgba(0,198,255,0.2)', borderRadius: 14, padding: '14px 18px', zIndex: 10, minWidth: 180, backdropFilter: 'blur(12px)' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f0f4ff', marginBottom: 6 }}>{selectedCity.city}</div>
              <div style={{ fontSize: '0.78rem', color: '#8a9cbc', marginBottom: 4 }}>{selectedCity.reports} reports</div>
              <div style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, fontSize: '0.68rem', fontWeight: 600, background: `${severityColors[selectedCity.severity]}18`, color: severityColors[selectedCity.severity], border: `1px solid ${severityColors[selectedCity.severity]}40` }}>
                {selectedCity.severity}
              </div>
            </div>
          )}

          {/* Legend */}
          <div style={{ position: 'absolute', bottom: 14, left: 14, background: 'rgba(10,22,40,0.85)', borderRadius: 10, padding: '10px 14px', zIndex: 5 }}>
            {[
              { label: 'Critical', color: '#ff3d57' },
              { label: 'High Risk', color: '#ff9100' },
              { label: 'Medium', color: '#ffd600' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color }} />
                <span style={{ fontSize: '0.72rem', color: '#8a9cbc' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports Nearby */}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 14, color: '#f0f4ff' }}>Recent Reports Nearby</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {recentReports.map(r => (
            <div key={r.id} style={{ background: 'rgba(16,30,52,0.7)', border: '1px solid rgba(0,198,255,0.08)', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${severityColors[r.severity]}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={severityColors[r.severity]} strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f0f4ff' }}>{r.type}</div>
                <div style={{ fontSize: '0.75rem', color: '#8a9cbc' }}>{r.location}</div>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#4a5a7a', whiteSpace: 'nowrap' }}>{r.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
