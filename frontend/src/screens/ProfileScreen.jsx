import { useState, useEffect } from 'react'
import { User, Shield, Bell, Lock, ChevronRight, LogOut, Star, TrendingUp, Activity, BarChart2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getRiskScore, getScanStats } from '../services/api'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

const threatData = [
  { type: 'SMS', count: 47 },
  { type: 'Links', count: 35 },
  { type: 'Apps', count: 19 },
  { type: 'Calls', count: 14 },
]

const radarData = [
  { subject: 'SMS Safety', A: 85 },
  { subject: 'URL Safety', A: 72 },
  { subject: 'App Safety', A: 90 },
  { subject: 'Network', A: 65 },
  { subject: 'Behavior', A: 78 },
]

const recentlyRemoved = [
  { title: 'Fake Banking SMS', date: 'Apr 5, 2026', icon: '💬', color: '#ff3a3a' },
  { title: 'Phishing Email Link', date: 'Apr 4, 2026', icon: '🔗', color: '#ff8c00' },
  { title: 'Suspicious App Install', date: 'Apr 3, 2026', icon: '📱', color: '#ffd60a' },
]

function RiskScoreCard({ score, level }) {
  const color = level === 'high' ? 'var(--accent-red)' : level === 'medium' ? 'var(--accent-yellow)' : 'var(--accent-green)'
  const label = level === 'high' ? 'High Risk' : level === 'medium' ? 'Medium Risk' : 'Low Risk'

  return (
    <div className="card mb-4">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 70, height: 70, borderRadius: '50%',
          background: `conic-gradient(${color} ${score}%, rgba(255,255,255,0.05) 0%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 20px ${color}30`,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%', background: 'var(--bg-secondary)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, color, lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: '0.5rem', color: 'var(--text-muted)' }}>RISK</span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '1rem', fontWeight: 700 }}>Behavioral Risk Score</div>
          <div style={{ fontSize: '0.8rem', color, fontWeight: 600, marginTop: 3 }}>{label}</div>
          <div className="progress-bar-container mt-2">
            <div className="progress-bar-fill" style={{
              width: `${score}%`,
              background: `linear-gradient(90deg, ${color}80, ${color})`,
            }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProfileScreen() {
  const { user, protectionActive, setProtectionActive } = useApp()
  const [riskData, setRiskData] = useState({ overall_risk_score: 22, risk_level: 'low', recommendations: [] })
  const [stats, setStats] = useState({ total_scanned: 247, phishing_detected: 123, protection_rate: 98.4 })
  const [settings, setSettings] = useState({
    smsMonitoring: true,
    pushAlerts: true,
    autoBlock: true,
    nightMode: true,
    biometric: false,
  })

  useEffect(() => {
    getRiskScore({ actions: [], recent_scan_score: 22, reported_count: 2 })
      .then(r => setRiskData(r.data)).catch(() => {})
    getScanStats().then(r => setStats(r.data)).catch(() => {})
  }, [])

  const toggleSetting = (key) => setSettings(s => ({ ...s, [key]: !s[key] }))

  const initials = user.username?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U'

  return (
    <div>
      <div className="top-bar">
        <div className="top-bar-title">👤 Profile</div>
      </div>

      <div className="screen-content screen-pad animate-fadeIn">
        {/* Profile Card */}
        <div className="card mb-4" style={{ textAlign: 'center', padding: '24px 16px' }}>
          <div className="avatar" style={{ margin: '0 auto 12px' }}>{initials}</div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{user.username}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 3 }}>{user.email}</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10 }}>
            <span className="badge badge-safe">✅ Verified</span>
            <span className="badge badge-suspicious">⭐ Premium</span>
          </div>
        </div>

        {/* Risk Score */}
        <RiskScoreCard score={Math.round(riskData.overall_risk_score)} level={riskData.risk_level} />

        {/* Security Analytics */}
        <div className="section-header">
          <span className="section-title">📊 Reports & Analytics</span>
        </div>
        <div className="metric-grid mb-4">
          <div className="metric-card">
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Scans</div>
            <div className="metric-value gradient-text">{stats.total_scanned}</div>
          </div>
          <div className="metric-card">
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Blocked</div>
            <div className="metric-value" style={{ color: 'var(--accent-red)' }}>{stats.phishing_detected}</div>
          </div>
        </div>

        {/* Weekly chart */}
        <div className="card mb-4">
          <div className="section-title mb-3">🔐 Security Score Trend</div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={threatData} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
              <XAxis dataKey="type" tick={{ fontSize: 10, fill: '#4a5a80' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#4a5a80' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0d1b2a', border: '1px solid rgba(0,198,255,0.2)', borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="count" fill="url(#barGrad)" radius={[4, 4, 0, 0]} name="Threats" />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00c6ff" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recently removed */}
        <div className="section-header">
          <span className="section-title">🗑️ Recently Removed Threats</span>
        </div>
        <div className="flex flex-col gap-2 mb-4">
          {recentlyRemoved.map((t, i) => (
            <div key={i} className="alert-item">
              <div className="alert-icon" style={{ background: `${t.color}15` }}>
                <span style={{ fontSize: '1.1rem' }}>{t.icon}</span>
              </div>
              <div className="alert-content">
                <div className="alert-title">{t.title}</div>
                <div className="alert-time">Removed on {t.date}</div>
              </div>
              <span className="badge badge-safe">Blocked</span>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        {riskData.recommendations?.length > 0 && (
          <div className="card mb-4">
            <div className="section-title mb-2">💡 Recommendations</div>
            {riskData.recommendations.map((r, i) => (
              <div key={i} style={{
                fontSize: '0.8rem', padding: '8px 10px', marginBottom: 6,
                background: 'rgba(0,198,255,0.05)', borderRadius: 8,
                borderLeft: '2px solid var(--accent-blue)', color: 'var(--text-secondary)',
              }}>
                {r}
              </div>
            ))}
          </div>
        )}

        {/* Settings */}
        <div className="section-title mb-3">⚙️ Security Settings</div>
        <div className="card mb-4">
          {[
            { key: 'smsMonitoring', icon: '💬', label: 'SMS Monitoring', desc: 'Scan incoming messages' },
            { key: 'pushAlerts', icon: '🔔', label: 'Push Alerts', desc: 'Real-time threat alerts' },
            { key: 'autoBlock', icon: '🛡️', label: 'Auto-Block', desc: 'Block threats automatically' },
            { key: 'biometric', icon: '👁️', label: 'Biometric Lock', desc: 'Fingerprint/Face ID' },
          ].map(s => (
            <div key={s.key} className="settings-item">
              <div className="settings-item-left">
                <div className="settings-item-icon" style={{ background: 'var(--bg-glass)', fontSize: '1rem' }}>{s.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{s.label}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.desc}</div>
                </div>
              </div>
              <div className={`toggle ${settings[s.key] ? 'active' : ''}`} onClick={() => toggleSetting(s.key)} />
            </div>
          ))}
        </div>

        {/* Sign out */}
        <button className="btn btn-outline btn-full mb-4" style={{ borderColor: 'var(--accent-red)', color: 'var(--accent-red)' }}>
          <LogOut size={16} /> Sign Out
        </button>

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div className="gradient-text" style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.05em' }}>🛡️ SBI SAFE</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>v1.0.0 • AI-Powered Fraud Protection</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>© 2026 SBI SAFE. All rights reserved.</div>
        </div>
      </div>
    </div>
  )
}
