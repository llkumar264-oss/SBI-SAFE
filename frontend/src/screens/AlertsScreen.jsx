import { useState, useEffect } from 'react'
import { Bell, BellOff, RefreshCw, Shield, AlertTriangle, Info, CheckCircle } from 'lucide-react'
import { getAlerts } from '../services/api'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

const MOCK_ALERTS = [
  {
    id: 1, title: '🚨 Phishing SMS Blocked',
    message: 'A message impersonating SBI was intercepted and blocked automatically.',
    severity: 'high', type: 'sms', time: '2 mins ago', is_read: false,
  },
  {
    id: 2, title: '⚠️ Suspicious URL Flagged',
    message: 'http://sbi-login.tk was flagged as phishing (Risk Score: 88/100).',
    severity: 'high', type: 'link', time: '15 mins ago', is_read: false,
  },
  {
    id: 3, title: '🟡 Risky App Permission',
    message: 'An installed app requested READ_SMS permission which can intercept OTPs.',
    severity: 'medium', type: 'app', time: '1 hour ago', is_read: false,
  },
  {
    id: 4, title: '📢 Community Alert',
    message: 'New phishing campaign targeting SBI customers detected in Mumbai.',
    severity: 'medium', type: 'community', time: '3 hours ago', is_read: true,
  },
  {
    id: 5, title: '✅ System Scan Complete',
    message: 'Scheduled scan finished. No new threats found on your device.',
    severity: 'low', type: 'system', time: '5 hours ago', is_read: true,
  },
  {
    id: 6, title: '🔐 Login from New Location',
    message: 'Banking app login detected from an unfamiliar IP address.',
    severity: 'medium', type: 'security', time: '1 day ago', is_read: true,
  },
  {
    id: 7, title: '💡 Tip: Enable 2FA',
    message: 'Enable two-factor authentication on your banking apps for better protection.',
    severity: 'low', type: 'tip', time: '2 days ago', is_read: true,
  },
]

function AlertCard({ alert, onDismiss }) {
  const bgColors = {
    high: 'rgba(255,58,58,0.08)',
    medium: 'rgba(255,214,10,0.08)',
    low: 'rgba(0,255,136,0.05)',
  }
  const borderColors = {
    high: 'rgba(255,58,58,0.3)',
    medium: 'rgba(255,214,10,0.3)',
    low: 'rgba(0,255,136,0.2)',
  }
  const icons = { high: <AlertTriangle size={18} />, medium: <Info size={18} />, low: <CheckCircle size={18} /> }
  const iconColors = { high: 'var(--accent-red)', medium: 'var(--accent-yellow)', low: 'var(--accent-green)' }

  return (
    <div style={{
      background: bgColors[alert.severity] || 'var(--bg-card)',
      border: `1px solid ${borderColors[alert.severity] || 'var(--border-color)'}`,
      borderRadius: 'var(--radius-md)',
      padding: '14px', marginBottom: 10,
      opacity: alert.is_read ? 0.7 : 1,
      transition: 'all 0.2s',
      animation: 'slideUp 0.3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          background: `${iconColors[alert.severity]}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: iconColors[alert.severity],
        }}>
          {icons[alert.severity]}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{alert.title}</div>
            {!alert.is_read && (
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-blue)', flexShrink: 0 }} />
            )}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{alert.message}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{alert.time}</div>
            <span className={`badge badge-${alert.severity}`}>{alert.severity.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState(MOCK_ALERTS)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const { markAlertsRead } = useApp()

  useEffect(() => {
    markAlertsRead()
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    setLoading(true)
    try {
      const res = await getAlerts()
      if (res.data.alerts?.length > 0) {
        setAlerts([...res.data.alerts.map(a => ({ ...a, is_read: false })), ...MOCK_ALERTS.slice(2)])
      }
    } catch {
      // Use mock data
    } finally { setLoading(false) }
  }

  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.severity === filter)
  const unreadCount = alerts.filter(a => !a.is_read).length

  const filterBtns = [
    { id: 'all', label: 'All' },
    { id: 'high', label: '🔴 High' },
    { id: 'medium', label: '🟡 Medium' },
    { id: 'low', label: '🟢 Low' },
  ]

  return (
    <div>
      <div className="top-bar">
        <div className="top-bar-title">🔔 Alerts</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {unreadCount > 0 && (
            <span className="badge badge-high">{unreadCount} new</span>
          )}
          <div className="icon-btn" onClick={fetchAlerts}>
            <RefreshCw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </div>
        </div>
      </div>

      <div className="screen-content screen-pad animate-fadeIn">
        {/* Stats Row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[
            { label: 'Total', value: alerts.length, color: 'var(--accent-blue)' },
            { label: 'High', value: alerts.filter(a => a.severity === 'high').length, color: 'var(--accent-red)' },
            { label: 'Unread', value: unreadCount, color: 'var(--accent-yellow)' },
          ].map(s => (
            <div key={s.label} className="card" style={{ flex: 1, textAlign: 'center', padding: 12 }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
          {filterBtns.map(btn => (
            <button key={btn.id} onClick={() => setFilter(btn.id)} style={{
              flexShrink: 0, padding: '6px 14px', borderRadius: 99, border: '1px solid',
              borderColor: filter === btn.id ? 'var(--accent-blue)' : 'var(--border-color)',
              background: filter === btn.id ? 'rgba(0,198,255,0.12)' : 'transparent',
              color: filter === btn.id ? 'var(--accent-blue)' : 'var(--text-secondary)',
              fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)',
              transition: 'all 0.2s',
            }}>
              {btn.label}
            </button>
          ))}
        </div>

        {/* Real-time indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
          padding: '8px 12px', background: 'rgba(0,255,136,0.06)',
          border: '1px solid rgba(0,255,136,0.15)', borderRadius: 8,
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-green)',
            animation: 'blink 1.5s infinite',
          }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: 500 }}>
            Live monitoring active — auto-refreshes every 30s
          </span>
        </div>

        {/* Alert list */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <BellOff size={40} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No alerts in this category</div>
          </div>
        ) : (
          filtered.map(alert => <AlertCard key={alert.id} alert={alert} />)
        )}
      </div>
    </div>
  )
}
