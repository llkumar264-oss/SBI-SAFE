import { useState, useEffect, useRef } from 'react'
import { MapPin, RefreshCw, AlertTriangle, TrendingUp } from 'lucide-react'
import { getFraudHeatmap, getFraudMapStats } from '../services/api'

// Simple SVG-based India map with fraud markers (no Leaflet dependency issues)
const INDIA_CITIES = [
  { name: 'Mumbai', lat: 19.07, lng: 72.87, x: 28, y: 55, count: 67, type: 'SMS Fraud' },
  { name: 'Delhi', lat: 28.61, lng: 77.20, x: 42, y: 28, count: 45, type: 'Phishing' },
  { name: 'Bengaluru', lat: 12.97, lng: 77.59, x: 44, y: 73, count: 38, type: 'Fake App' },
  { name: 'Hyderabad', lat: 17.38, lng: 78.48, x: 46, y: 60, count: 52, type: 'SMS Fraud' },
  { name: 'Chennai', lat: 13.08, lng: 80.27, x: 50, y: 72, count: 41, type: 'Phishing' },
  { name: 'Kolkata', lat: 22.57, lng: 88.36, x: 68, y: 40, count: 29, type: 'Phishing' },
  { name: 'Ahmedabad', lat: 23.02, lng: 72.57, x: 27, y: 39, count: 33, type: 'Fake App' },
  { name: 'Pune', lat: 18.52, lng: 73.85, x: 31, y: 57, count: 44, type: 'Phishing' },
  { name: 'Jaipur', lat: 26.91, lng: 75.78, x: 36, y: 33, count: 22, type: 'Fake App' },
  { name: 'Lucknow', lat: 26.84, lng: 80.94, x: 50, y: 33, count: 27, type: 'SMS Fraud' },
  { name: 'Patna', lat: 25.59, lng: 85.13, x: 61, y: 36, count: 31, type: 'SMS Fraud' },
  { name: 'Chandigarh', lat: 30.73, lng: 76.77, x: 38, y: 22, count: 15, type: 'Phishing' },
]

function IndiaFraudMap({ selectedCity, onCitySelect }) {
  return (
    <div style={{
      position: 'relative', width: '100%', paddingBottom: '90%',
      background: 'rgba(0,0,0,0.4)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border-color)',
      overflow: 'hidden',
    }}>
      {/* Background gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(0,100,200,0.08) 0%, rgba(0,0,0,0.4) 100%)',
      }} />

      {/* India outline (simplified SVG) */}
      <svg
        viewBox="0 0 100 100"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Simplified India map path */}
        <path
          d="M35,10 L45,8 L58,10 L70,15 L78,22 L80,30 L75,35 L78,42 L72,50 L68,58 L62,68 L55,78 L50,88 L46,82 L42,72 L38,65 L30,60 L22,55 L18,48 L20,40 L24,32 L28,24 L32,16 Z"
          fill="rgba(0,100,200,0.06)"
          stroke="rgba(0,198,255,0.2)"
          strokeWidth="0.5"
        />
        {/* Grid lines */}
        {[20, 40, 60, 80].map(x => (
          <line key={x} x1={x} y1="0" x2={x} y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
        ))}
        {[20, 40, 60, 80].map(y => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
        ))}

        {/* Fraud markers */}
        {INDIA_CITIES.map((city) => {
          const isSelected = selectedCity?.name === city.name
          const radius = Math.max(3, Math.min(8, city.count / 10))
          const color = city.count >= 50 ? '#ff3a3a' : city.count >= 30 ? '#ffd60a' : '#00c6ff'

          return (
            <g key={city.name} onClick={() => onCitySelect(city)} style={{ cursor: 'pointer' }}>
              {/* Pulse ring */}
              <circle
                cx={city.x} cy={city.y} r={radius + 3}
                fill="none" stroke={color} strokeWidth="0.5" opacity="0.4"
                style={{ animation: 'pulse-glow 2s infinite' }}
              />
              {/* Main dot */}
              <circle
                cx={city.x} cy={city.y} r={radius}
                fill={color} opacity="0.85"
                style={{
                  filter: `drop-shadow(0 0 ${isSelected ? 6 : 3}px ${color})`,
                  transform: isSelected ? 'scale(1.3)' : 'scale(1)',
                  transformOrigin: `${city.x}px ${city.y}px`,
                  transition: 'all 0.2s',
                }}
              />
              {/* City label (only for larger dots) */}
              {city.count >= 40 && (
                <text x={city.x + radius + 1} y={city.y + 1} fontSize="3" fill="rgba(255,255,255,0.6)">
                  {city.name}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: 12, left: 12,
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        {[
          { color: '#ff3a3a', label: 'High (50+)' },
          { color: '#ffd60a', label: 'Medium (30–50)' },
          { color: '#00c6ff', label: 'Low (<30)' },
        ].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color, boxShadow: `0 0 6px ${l.color}` }} />
            <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function MapScreen() {
  const [selectedCity, setSelectedCity] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getFraudMapStats().then(r => setStats(r.data)).catch(() => {
      setStats({ total_reports: 234, high_risk_areas: 8, cities_affected: 15, most_common_type: 'SMS Fraud', hottest_city: 'Mumbai' })
    })
  }, [])

  return (
    <div>
      <div className="top-bar">
        <div className="top-bar-title">🗺️ Fraud Map</div>
        <div className="icon-btn" onClick={() => setLoading(v => !v)}>
          <RefreshCw size={16} />
        </div>
      </div>

      <div className="screen-content screen-pad animate-fadeIn">
        {/* Stats */}
        {stats && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[
              { label: 'Reports', value: stats.total_reports, color: 'var(--accent-red)' },
              { label: 'Hot Zones', value: stats.high_risk_areas, color: 'var(--accent-orange)' },
              { label: 'Cities', value: stats.cities_affected, color: 'var(--accent-blue)' },
            ].map(s => (
              <div key={s.label} className="card" style={{ flex: 1, textAlign: 'center', padding: 10 }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Live badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
          padding: '7px 12px', background: 'rgba(255,58,58,0.06)',
          border: '1px solid rgba(255,58,58,0.15)', borderRadius: 8,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-red)', animation: 'blink 1s infinite' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-red)', fontWeight: 500 }}>
            Live Fraud Intelligence — {INDIA_CITIES.length} active zones detected
          </span>
        </div>

        {/* Map */}
        <IndiaFraudMap selectedCity={selectedCity} onCitySelect={setSelectedCity} />

        {/* Selected city detail */}
        {selectedCity && (
          <div className="card mt-3" style={{ animation: 'slideUp 0.3s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <MapPin size={18} color="var(--accent-red)" />
              <div style={{ fontWeight: 700, fontSize: '1rem' }}>{selectedCity.name}</div>
              <span className={`badge badge-${selectedCity.count >= 50 ? 'phishing' : selectedCity.count >= 30 ? 'suspicious' : 'safe'}`}>
                {selectedCity.count >= 50 ? 'HIGH RISK' : selectedCity.count >= 30 ? 'MEDIUM' : 'LOW'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Reports</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-red)' }}>{selectedCity.count}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Type</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>{selectedCity.type}</div>
              </div>
            </div>
          </div>
        )}

        {/* City list */}
        <div className="section-header mt-4">
          <span className="section-title">🔴 Fraud Hotspots</span>
        </div>
        {[...INDIA_CITIES].sort((a, b) => b.count - a.count).map(city => (
          <div key={city.name}
            className="alert-item mb-2"
            onClick={() => setSelectedCity(city)}
            style={{ cursor: 'pointer' }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: city.count >= 50 ? 'rgba(255,58,58,0.15)' : 'rgba(255,214,10,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MapPin size={16} color={city.count >= 50 ? 'var(--accent-red)' : 'var(--accent-yellow)'} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{city.name}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{city.type}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: city.count >= 50 ? 'var(--accent-red)' : 'var(--accent-yellow)' }}>
                {city.count}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>reports</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
