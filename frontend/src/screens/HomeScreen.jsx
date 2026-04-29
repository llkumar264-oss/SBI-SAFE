import { useState, useEffect } from 'react'
import { Bell, Settings, Shield, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Zap, Eye, ChevronRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getScanStats, getAlerts, getFraudMapStats } from '../services/api'
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

const weeklyData = [
  { day: 'Mon', threats: 14, blocked: 13 },
  { day: 'Tue', threats: 18, blocked: 17 },
  { day: 'Wed', threats: 22, blocked: 20 },
  { day: 'Thu', threats: 26, blocked: 24 },
  { day: 'Fri', threats: 24, blocked: 23 },
  { day: 'Sat', threats: 16, blocked: 15 },
  { day: 'Sun', threats: 14, blocked: 13 },
]

function ProtectionRing({ score }) {
  const radius = 56
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? '#00ff88' : score >= 50 ? '#ffd60a' : '#ff3a3a'

  return (
    <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto' }}>
      <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
        {/* Background track */}
        <circle cx="80" cy="80" r={radius} fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        {/* Progress arc */}
        <circle cx="80" cy="80" r={radius} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Shield size={22} color={color} />
        <span style={{ fontSize: '1.8rem', fontWeight: 900, color, lineHeight: 1.1, marginTop: 4 }}>
          {score}%
        </span>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
          Protection
        </span>
      </div>
    </div>
  )
}

export default function HomeScreen({ onNavigate }) {
  const { user, alertCount, protectionActive, setProtectionActive, markAlertsRead } = useApp()
  const [stats, setStats] = useState({ total_scanned: 247, phishing_detected: 123, protection_rate: 98.4 })
  const [mapStats, setMapStats] = useState({ total_reports: 234, high_risk_areas: 8 })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getScanStats().then(r => setStats(r.data)).catch(() => {})
    getFraudMapStats().then(r => setMapStats(r.data)).catch(() => {})
  }, [])

  const protectionScore = protectionActive ? 87 : 32

  return (
    <div>
      {/* Top Bar */}
      <div className="top-bar">
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400 }}>Welcome back,</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{user.username}</div>
        </div>
        <div className="flex gap-2">
          <div className="icon-btn" onClick={() => { onNavigate('alerts'); markAlertsRead() }}>
            <Bell size={18} />
            {alertCount > 0 && <span className="badge-dot">{alertCount}</span>}
          </div>
          <div className="icon-btn" onClick={() => onNavigate('profile')}>
            <Settings size={18} />
          </div>
        </div>
      </div>

      <div className="screen-content screen-pad animate-fadeIn">
        {/* Protection Toggle Card */}
        <div className="card mb-3" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: protectionActive ? 'rgba(0,198,255,0.15)' : 'rgba(255,58,58,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={22} color={protectionActive ? 'var(--accent-blue)' : 'var(--accent-red)'} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
              {protectionActive ? 'Protection Active' : 'Protection Disabled'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {protectionActive ? "You're secured" : 'Tap to enable protection'}
            </div>
          </div>
          <div
            className={`toggle ${protectionActive ? 'active' : ''}`}
            onClick={() => setProtectionActive(v => !v)}
          />
        </div>

        {/* Protection Ring */}
        <div className="card mb-3" style={{ textAlign: 'center' }}>
          <ProtectionRing score={protectionScore} />
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Protection Status</div>
            <div style={{
              fontSize: '0.95rem', fontWeight: 700, marginTop: 3,
              color: protectionScore >= 80 ? 'var(--accent-green)' : protectionScore >= 50 ? 'var(--accent-yellow)' : 'var(--accent-red)',
            }}>
              {protectionScore >= 80 ? '🟢 Secure' : protectionScore >= 50 ? '🟡 At Risk' : '🔴 Vulnerable'}
            </div>
          </div>
          <div
            className="flex items-center justify-between mt-3"
            style={{
              paddingTop: 12, borderTop: '1px solid var(--border-color)',
              cursor: 'pointer', color: 'var(--accent-blue)',
            }}
            onClick={() => onNavigate('alerts')}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>View Detailed Analytics</span>
            <ChevronRight size={16} />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="section-header">
          <span className="section-title">📊 Security Overview</span>
        </div>
        <div className="metric-grid mb-4">
          <div className="metric-card">
            <div className="metric-icon" style={{ background: 'rgba(0,198,255,0.12)' }}>
              <Eye size={18} color="var(--accent-blue)" />
            </div>
            <div className="metric-value gradient-text">{stats.total_scanned}</div>
            <div className="metric-label">Total Scans</div>
            <div className="metric-trend trend-up"><TrendingUp size={11} /> +12%</div>
          </div>
          <div className="metric-card">
            <div className="metric-icon" style={{ background: 'rgba(255,58,58,0.12)' }}>
              <AlertTriangle size={18} color="var(--accent-red)" />
            </div>
            <div className="metric-value" style={{ color: 'var(--accent-red)' }}>{stats.phishing_detected}</div>
            <div className="metric-label">Threats Blocked</div>
            <div className="metric-trend trend-up"><TrendingUp size={11} /> +8%</div>
          </div>
          <div className="metric-card">
            <div className="metric-icon" style={{ background: 'rgba(0,255,136,0.12)' }}>
              <CheckCircle size={18} color="var(--accent-green)" />
            </div>
            <div className="metric-value gradient-text-green">{stats.protection_rate}%</div>
            <div className="metric-label">Protection Rate</div>
            <div className="metric-trend trend-up"><TrendingUp size={11} /> +2%</div>
          </div>
          <div className="metric-card">
            <div className="metric-icon" style={{ background: 'rgba(255,140,0,0.12)' }}>
              <Zap size={18} color="var(--accent-orange)" />
            </div>
            <div className="metric-value" style={{ color: 'var(--accent-orange)' }}>{mapStats.high_risk_areas || 8}</div>
            <div className="metric-label">Hot Zones</div>
            <div className="metric-trend trend-down"><TrendingDown size={11} /> –3</div>
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="card mb-4">
          <div className="section-title mb-3">📈 Weekly Threat Activity</div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={weeklyData} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
              <defs>
                <linearGradient id="threats" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff3a3a" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff3a3a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="blocked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00c6ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00c6ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#4a5a80' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#4a5a80' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#0d1b2a', border: '1px solid rgba(0,198,255,0.2)', borderRadius: 8 }}
                labelStyle={{ color: '#f0f4ff', fontSize: 11 }}
                itemStyle={{ fontSize: 11 }}
              />
              <Area type="monotone" dataKey="threats" stroke="#ff3a3a" fill="url(#threats)" strokeWidth={2} dot={false} name="Threats" />
              <Area type="monotone" dataKey="blocked" stroke="#00c6ff" fill="url(#blocked)" strokeWidth={2} dot={false} name="Blocked" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-3 mt-2">
            <div className="flex items-center gap-2"><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff3a3a' }} /><span className="text-xs text-secondary">Threats Detected</span></div>
            <div className="flex items-center gap-2"><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00c6ff' }} /><span className="text-xs text-secondary">Blocked</span></div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="section-header">
          <span className="section-title">⚡ Quick Actions</span>
        </div>
        <div className="feature-grid mb-4">
          {[
            { icon: '🔍', title: 'Scan Link', desc: 'Check any URL', screen: 'scan', color: '#00c6ff' },
            { icon: '📱', title: 'Scan SMS', desc: 'Analyze message', screen: 'scan', color: '#8b5cf6' },
            { icon: '🗺️', title: 'Fraud Map', desc: 'View hotspots', screen: 'map', color: '#ff8c00' },
            { icon: '🚨', title: 'Report', desc: 'Flag fraud', screen: 'community', color: '#ff3a3a' },
          ].map((f) => (
            <div key={f.title} className="feature-card" onClick={() => onNavigate(f.screen)}>
              <div className="feature-icon" style={{ background: `${f.color}15` }}>
                <span>{f.icon}</span>
              </div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Recent Threats */}
        <div className="section-header">
          <span className="section-title">🔴 Recently Blocked</span>
          <span className="section-action" onClick={() => onNavigate('alerts')}>See all</span>
        </div>
        <div className="flex flex-col gap-2 mb-4">
          {[
            { icon: '💬', title: 'Fake Banking SMS', time: 'Apr 5, 2026', color: 'var(--accent-red)' },
            { icon: '🔗', title: 'Phishing Email Link', time: 'Apr 4, 2026', color: 'var(--accent-orange)' },
            { icon: '📦', title: 'Suspicious App Install', time: 'Apr 3, 2026', color: 'var(--accent-yellow)' },
          ].map((t, i) => (
            <div key={i} className="alert-item">
              <div className="alert-icon" style={{ background: `${t.color}15` }}>
                <span style={{ fontSize: '1.1rem' }}>{t.icon}</span>
              </div>
              <div className="alert-content">
                <div className="alert-title">{t.title}</div>
                <div className="alert-time">Removed on {t.time}</div>
              </div>
              <span className="badge badge-safe">Blocked</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
