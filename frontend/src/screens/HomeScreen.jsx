import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { getScanStats, getAlerts } from '../services/api'

/* ── SVG Icons ── */
const ShieldIcon = ({ size = 24, color = '#00c6ff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
)
const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
)
const ScanFrameIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/></svg>
)
const LinkIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 7h3a5 5 0 0 1 0 10h-3m-6 0H6a5 5 0 0 1 0-10h3"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
)
const AlertTriIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
)
const ChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
)
const CrownIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffd600" strokeWidth="1.8"><path d="M2 18l3-9 5 4 2-8 2 8 5-4 3 9"/><path d="M2 18h20v2H2z"/></svg>
)
const TrendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
)

export default function HomeScreen({ onNavigate }) {
  const { alerts, setAlerts } = useApp()
  const [stats, setStats] = useState({ total_scans: 247, threats_blocked: 123, safe_percentage: 98.4 })
  const [protectionOn, setProtectionOn] = useState(true)

  useEffect(() => {
    getScanStats().then(r => r && setStats(r)).catch(() => {})
    getAlerts().then(r => r && setAlerts(r)).catch(() => {})
  }, [])

  const liveAlerts = [
    { id: 1, title: 'Phishing SMS Detected', desc: 'Suspicious message from +1 234-567-8900', time: '2 min ago', severity: 'high', icon: '⚠️', color: '#ff9100' },
    { id: 2, title: 'Fake App Warning', desc: 'Banking app clone detected', time: '15 min ago', severity: 'critical', icon: '🛑', color: '#ff3d57' },
    { id: 3, title: 'Fraud Near You', desc: '3 scams reported in your area', time: '1 hour ago', severity: 'medium', icon: '⚠️', color: '#ffd600' },
  ]

  const weekData = [
    { day: 'Mon', threats: 8, blocked: 7 },
    { day: 'Tue', threats: 12, blocked: 11 },
    { day: 'Wed', threats: 15, blocked: 14 },
    { day: 'Thu', threats: 22, blocked: 20 },
    { day: 'Fri', threats: 25, blocked: 24 },
    { day: 'Sat', threats: 18, blocked: 17 },
    { day: 'Sun', threats: 14, blocked: 13 },
  ]

  const maxVal = 28

  return (
    <div className="screen-content" style={{ padding: '0 0 90px 0' }}>
      {/* ── Top bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px 8px', background: 'linear-gradient(180deg, rgba(10,22,40,1) 0%, transparent 100%)', position: 'sticky', top: 0, zIndex: 10, backdropFilter: 'blur(10px)' }}>
        <h1 style={{ fontSize: '1.15rem', fontWeight: 800, background: 'linear-gradient(135deg, #00c6ff, #0ff0fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SecureShield AI</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <div onClick={() => onNavigate('alerts')} style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,198,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', color: '#8a9cbc' }}>
            <BellIcon />
            <span style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, background: '#ff3d57', borderRadius: '50%', fontSize: '0.6rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0a1628' }}>3</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 18px' }}>
        {/* ── Protection Active Card ── */}
        <div style={{ background: 'linear-gradient(135deg, rgba(16,30,52,0.9), rgba(20,40,70,0.8))', border: '1px solid rgba(0,198,255,0.12)', borderRadius: 18, padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #1a3a6a, #2a5aa0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldIcon size={24} color="#00c6ff" />
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f0f4ff' }}>Protection Active</div>
              <div style={{ fontSize: '0.8rem', color: '#8a9cbc' }}>You're secured</div>
            </div>
          </div>
          {/* Toggle */}
          <div onClick={() => setProtectionOn(!protectionOn)} style={{ width: 52, height: 28, borderRadius: 14, background: protectionOn ? 'linear-gradient(135deg, #00c6ff, #0066cc)' : '#2a3a5a', cursor: 'pointer', position: 'relative', transition: 'background 0.3s' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: protectionOn ? 27 : 3, transition: 'left 0.3s', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }} />
          </div>
        </div>

        {/* ── Protection Ring Card ── */}
        <div style={{ background: 'rgba(16,30,52,0.7)', border: '1px solid rgba(0,198,255,0.1)', borderRadius: 20, padding: '30px 20px 24px', textAlign: 'center', marginBottom: 16, backdropFilter: 'blur(12px)' }}>
          {/* Animated SVG Ring */}
          <div style={{ position: 'relative', width: 180, height: 180, margin: '0 auto 16px' }}>
            <svg width="180" height="180" viewBox="0 0 180 180">
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00e676" />
                  <stop offset="100%" stopColor="#00c6ff" />
                </linearGradient>
                <filter id="glow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
              <circle cx="90" cy="90" r="78" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
              <circle cx="90" cy="90" r="78" fill="none" stroke="url(#ringGrad)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${87 * 4.9} ${100 * 4.9}`} transform="rotate(-90 90 90)" filter="url(#glow)" style={{ transition: 'stroke-dasharray 1.5s ease' }} />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <ShieldIcon size={28} color="#00c6ff" />
              <div style={{ fontSize: '2.2rem', fontWeight: 900, background: 'linear-gradient(135deg, #00e676, #00c6ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginTop: 4 }}>87%</div>
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#8a9cbc', marginBottom: 4 }}>Protection Status</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#00e676', marginBottom: 14 }}>Secure</div>
          <div onClick={() => onNavigate('profile')} style={{ fontSize: '0.85rem', color: '#00c6ff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontWeight: 600 }}>
            View Detailed Analytics <ChevronRight />
          </div>
        </div>

        {/* ── Premium Banner ── */}
        <div style={{ background: 'linear-gradient(135deg, rgba(30,20,60,0.9), rgba(20,15,50,0.8))', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 18, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, cursor: 'pointer' }}>
          <div style={{ width: 50, height: 50, borderRadius: 14, background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CrownIcon />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffd600' }}>Unlock Premium Features</div>
            <div style={{ fontSize: '0.78rem', color: '#8a9cbc' }}>Advanced AI protection • Just $99/year</div>
          </div>
          <ChevronRight />
        </div>

        {/* ── Quick Actions ── */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 14, color: '#f0f4ff' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            {[
              { label: 'Scan Now', icon: <ScanFrameIcon />, gradient: 'linear-gradient(135deg, #1a3a6a, #2a5aa0)', onClick: () => onNavigate('scan') },
              { label: 'Check Link', icon: <LinkIcon />, gradient: 'linear-gradient(135deg, #1a5a3a, #2a8a5a)', onClick: () => onNavigate('scan') },
              { label: 'Report Fraud', icon: <AlertTriIcon />, gradient: 'linear-gradient(135deg, #5a1a3a, #a02a5a)', onClick: () => onNavigate('community') },
            ].map((item, i) => (
              <div key={i} onClick={item.onClick} style={{ background: 'rgba(16,30,52,0.8)', border: '1px solid rgba(0,198,255,0.08)', borderRadius: 16, padding: '20px 12px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.25s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,198,255,0.25)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,198,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: item.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: '#fff' }}>
                  {item.icon}
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#f0f4ff' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Live Alerts ── */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f0f4ff' }}>Live Alerts</h3>
            <span onClick={() => onNavigate('alerts')} style={{ fontSize: '0.8rem', color: '#00c6ff', cursor: 'pointer', fontWeight: 600 }}>View All</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {liveAlerts.map(alert => (
              <div key={alert.id} style={{ background: 'rgba(16,30,52,0.7)', border: '1px solid rgba(0,198,255,0.08)', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${alert.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <AlertTriIcon />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f0f4ff' }}>{alert.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#8a9cbc' }}>{alert.desc}</div>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#4a5a7a', whiteSpace: 'nowrap' }}>{alert.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Fraud in Your Area Banner ── */}
        <div onClick={() => onNavigate('map')} style={{ background: 'linear-gradient(135deg, rgba(0,198,255,0.08), rgba(0,230,118,0.06))', border: '1px solid rgba(0,198,255,0.15)', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, cursor: 'pointer' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f0f4ff' }}>Fraud in Your Area</span>
          <ChevronRight />
        </div>

        {/* ── Stats Row (Figma: 247 Total Scans, 123 Threats Blocked, 98.4% Protection Rate) ── */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: '0.8rem', color: '#8a9cbc', marginBottom: 12 }}>Your security insights and statistics</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[
              { value: stats.total_scans || 247, label: 'Total Scans', trend: '+12%', color: '#00c6ff', icon: <ShieldIcon size={18} color="#00c6ff" /> },
              { value: stats.threats_blocked || 123, label: 'Threats Blocked', trend: '+8%', color: '#ff9100', icon: <AlertTriIcon /> },
              { value: `${stats.safe_percentage || 98.4}%`, label: 'Protection Rate', trend: '+2%', color: '#00e676', icon: '✓' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(16,30,52,0.7)', border: '1px solid rgba(0,198,255,0.08)', borderRadius: 14, padding: '14px 12px' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10, color: s.color, fontSize: '0.85rem' }}>
                  {typeof s.icon === 'string' ? s.icon : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f0f4ff', marginBottom: 2 }}>{s.value}</div>
                <div style={{ fontSize: '0.68rem', color: '#8a9cbc', marginBottom: 6 }}>{s.label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.68rem', fontWeight: 600, color: '#00e676' }}>
                  <TrendIcon /> {s.trend}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Weekly Threat Activity Chart ── */}
        <div style={{ background: 'rgba(16,30,52,0.7)', border: '1px solid rgba(0,198,255,0.08)', borderRadius: 18, padding: '20px 16px', marginBottom: 20 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20, color: '#f0f4ff' }}>Weekly Threat Activity</h3>
          <div style={{ position: 'relative', height: 160 }}>
            {/* Y-axis labels */}
            {[0, 7, 14, 21, 28].reverse().map((v, i) => (
              <div key={v} style={{ position: 'absolute', left: 0, top: i * 35, fontSize: '0.65rem', color: '#4a5a7a', width: 24, textAlign: 'right' }}>{v}</div>
            ))}
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} style={{ position: 'absolute', left: 30, right: 0, top: i * 35, height: 1, background: 'rgba(255,255,255,0.04)' }} />
            ))}
            {/* SVG Lines */}
            <svg style={{ position: 'absolute', left: 30, top: 0, width: 'calc(100% - 30px)', height: 160 }} viewBox="0 0 300 140" preserveAspectRatio="none">
              {/* Threats line (red) */}
              <polyline fill="none" stroke="#ff3d57" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
                points={weekData.map((d, i) => `${i * (300/6)},${140 - (d.threats / maxVal) * 140}`).join(' ')} />
              {/* Blocked line (cyan) */}
              <polyline fill="none" stroke="#00c6ff" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
                points={weekData.map((d, i) => `${i * (300/6)},${140 - (d.blocked / maxVal) * 140}`).join(' ')} />
            </svg>
            {/* X-axis labels */}
            <div style={{ position: 'absolute', bottom: -22, left: 30, right: 0, display: 'flex', justifyContent: 'space-between' }}>
              {weekData.map(d => (
                <span key={d.day} style={{ fontSize: '0.65rem', color: '#4a5a7a' }}>{d.day}</span>
              ))}
            </div>
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', gap: 20, marginTop: 30, justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff3d57' }} />
              <span style={{ fontSize: '0.7rem', color: '#8a9cbc' }}>threats</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#00c6ff' }} />
              <span style={{ fontSize: '0.7rem', color: '#8a9cbc' }}>blocked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
