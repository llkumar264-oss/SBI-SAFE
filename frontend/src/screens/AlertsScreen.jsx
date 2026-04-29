import { useState } from 'react'

export default function AlertsScreen() {
  const [filter, setFilter] = useState('all')

  const alerts = [
    { id: 1, title: 'Phishing SMS Detected', desc: 'Suspicious message from +1 234-567-8900', time: '2 min ago', severity: 'critical', icon: '🛑', read: false },
    { id: 2, title: 'Fake App Warning', desc: 'Banking app clone detected on device', time: '15 min ago', severity: 'critical', icon: '🛑', read: false },
    { id: 3, title: 'Fraud Near You', desc: '3 scams reported in your area', time: '1 hour ago', severity: 'medium', icon: '⚠️', read: false },
    { id: 4, title: 'Suspicious Link Blocked', desc: 'Blocked access to phishing URL', time: '3 hours ago', severity: 'high', icon: '🔴', read: true },
    { id: 5, title: 'Weekly Security Report', desc: 'Your weekly security summary is ready', time: '1 day ago', severity: 'low', icon: '📊', read: true },
    { id: 6, title: 'New Scam Trending', desc: 'Crypto investment scam on the rise', time: '2 days ago', severity: 'medium', icon: '📈', read: true },
  ]

  const sevColors = { critical: '#ff3d57', high: '#ff9100', medium: '#ffd600', low: '#00e676' }
  const filters = ['all', 'critical', 'high', 'medium', 'low']
  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.severity === filter)
  const unread = alerts.filter(a => !a.read).length

  return (
    <div className="screen-content" style={{ padding: '0 0 90px 0' }}>
      <div style={{ padding: '16px 18px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 800, background: 'linear-gradient(135deg, #00c6ff, #0ff0fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Alerts</h1>
          {unread > 0 && (
            <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, background: 'rgba(255,61,87,0.15)', color: '#ff3d57', border: '1px solid rgba(255,61,87,0.3)' }}>{unread} new</span>
          )}
        </div>
        <p style={{ fontSize: '0.82rem', color: '#8a9cbc' }}>Real-time security notifications</p>
      </div>

      <div style={{ padding: '0 18px' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 18, overflowX: 'auto', paddingBottom: 4 }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '7px 16px', borderRadius: 20, border: 'none', fontSize: '0.75rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Inter', transition: 'all 0.25s', whiteSpace: 'nowrap', textTransform: 'capitalize',
              background: filter === f ? 'linear-gradient(135deg, #00c6ff, #0066cc)' : 'rgba(255,255,255,0.04)',
              color: filter === f ? '#fff' : '#8a9cbc',
            }}>{f}</button>
          ))}
        </div>

        {/* Live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '10px 14px', background: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,230,118,0.15)', borderRadius: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00e676', animation: 'pulseGlow 2s infinite' }} />
          <span style={{ fontSize: '0.78rem', color: '#00e676', fontWeight: 600 }}>Live Monitoring Active</span>
        </div>

        {/* Alert List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(a => (
            <div key={a.id} style={{
              background: a.read ? 'rgba(16,30,52,0.5)' : 'rgba(16,30,52,0.8)',
              border: `1px solid ${a.read ? 'rgba(0,198,255,0.05)' : 'rgba(0,198,255,0.12)'}`,
              borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 14,
              borderLeft: `3px solid ${sevColors[a.severity]}`,
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `${sevColors[a.severity]}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.1rem' }}>{a.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f0f4ff' }}>{a.title}</span>
                  {!a.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00c6ff' }} />}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#8a9cbc', marginBottom: 6 }}>{a.desc}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '0.68rem', color: '#4a5a7a' }}>{a.time}</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: 600, padding: '2px 8px', borderRadius: 20, textTransform: 'capitalize', background: `${sevColors[a.severity]}15`, color: sevColors[a.severity], border: `1px solid ${sevColors[a.severity]}30` }}>{a.severity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
