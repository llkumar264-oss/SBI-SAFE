import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function ProfileScreen() {
  const [smsProtection, setSmsProtection] = useState(true)
  const [linkScanning, setLinkScanning] = useState(true)
  const [appMonitor, setAppMonitor] = useState(false)

  const Toggle = ({ on, onToggle }) => (
    <div onClick={onToggle} style={{ width: 48, height: 26, borderRadius: 13, background: on ? 'linear-gradient(135deg, #00c6ff, #0066cc)' : '#2a3a5a', cursor: 'pointer', position: 'relative', transition: 'background 0.3s', flexShrink: 0 }}>
      <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: on ? 25 : 3, transition: 'left 0.3s', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }} />
    </div>
  )

  return (
    <div className="screen-content" style={{ padding: '0 0 90px 0' }}>
      {/* Header */}
      <div style={{ padding: '16px 18px 8px' }}>
        <h1 style={{ fontSize: '1.15rem', fontWeight: 800, background: 'linear-gradient(135deg, #00c6ff, #0ff0fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4 }}>Profile</h1>
        <p style={{ fontSize: '0.82rem', color: '#8a9cbc' }}>Your security dashboard</p>
      </div>

      <div style={{ padding: '0 18px' }}>
        {/* User Card */}
        <div style={{ background: 'rgba(16,30,52,0.7)', border: '1px solid rgba(0,198,255,0.08)', borderRadius: 18, padding: '20px', textAlign: 'center', marginBottom: 16 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #0066cc, #00c6ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '1.6rem', fontWeight: 800, color: '#fff', border: '3px solid rgba(0,198,255,0.3)', boxShadow: '0 0 20px rgba(0,198,255,0.2)' }}>LK</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f0f4ff', marginBottom: 4 }}>Lalit Kumar</div>
          <div style={{ fontSize: '0.8rem', color: '#8a9cbc' }}>Security Level: Advanced</div>
        </div>

        {/* Protection Points Card (Figma: 2,847 total points) */}
        <div style={{ background: 'linear-gradient(135deg, rgba(16,30,52,0.8), rgba(0,40,80,0.5))', border: '1px solid rgba(0,198,255,0.12)', borderRadius: 18, padding: '24px 20px', textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: '2.8rem', fontWeight: 900, background: 'linear-gradient(135deg, #00e676, #00c6ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 6 }}>2,847</div>
          <div style={{ fontSize: '0.85rem', color: '#8a9cbc', marginBottom: 8 }}>Total Protection Points</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 600, color: '#00e676' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
            +120 this week
          </div>
        </div>

        {/* Stats Row (Figma: 28 Reports, 156 Threats, #247 Rank) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[
            { value: '28', label: 'Reports Filed', icon: '🎯', color: '#00c6ff' },
            { value: '156', label: 'Threats Blocked', icon: '🛡️', color: '#8b5cf6' },
            { value: '#247', label: 'Community Rank', icon: '📈', color: '#ff9100' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(16,30,52,0.7)', border: '1px solid rgba(0,198,255,0.08)', borderRadius: 14, padding: '16px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f0f4ff', marginBottom: 2 }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: '#8a9cbc' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Badges & Achievements (Figma: Fraud Hunter, Cyber Protector) */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: '1.1rem' }}>🏆</span>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f0f4ff' }}>Badges & Achievements</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { title: 'Fraud Hunter', desc: 'Report 10+ fraud attempts', icon: '🎯', earned: true, color: '#ff3d57' },
              { title: 'Cyber Protector', desc: 'Block 100+ threats', icon: '🛡️', earned: true, color: '#00c6ff' },
              { title: 'Community Hero', desc: 'Get 50+ upvotes', icon: '⭐', earned: false, color: '#ffd600' },
              { title: 'Vigilant Eye', desc: '30 day scan streak', icon: '👁️', earned: false, color: '#8b5cf6' },
            ].map((b, i) => (
              <div key={i} style={{
                background: b.earned ? 'rgba(16,30,52,0.8)' : 'rgba(16,30,52,0.4)',
                border: `1px solid ${b.earned ? 'rgba(0,198,255,0.15)' : 'rgba(255,255,255,0.04)'}`,
                borderRadius: 16, padding: '16px 14px', opacity: b.earned ? 1 : 0.5
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: `${b.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{b.icon}</div>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: b.earned ? b.color : '#4a5a7a', marginBottom: 4 }}>{b.title}</div>
                <div style={{ fontSize: '0.72rem', color: '#8a9cbc', marginBottom: 8 }}>{b.desc}</div>
                {b.earned && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', fontWeight: 600, color: '#00e676' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Earned
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Security Settings */}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 14, color: '#f0f4ff' }}>Security Settings</h3>
        <div style={{ background: 'rgba(16,30,52,0.7)', border: '1px solid rgba(0,198,255,0.08)', borderRadius: 16, padding: '4px 16px', marginBottom: 20 }}>
          {[
            { label: 'SMS Protection', desc: 'Scan incoming messages', on: smsProtection, toggle: () => setSmsProtection(!smsProtection) },
            { label: 'Link Scanning', desc: 'Auto-check shared links', on: linkScanning, toggle: () => setLinkScanning(!linkScanning) },
            { label: 'App Monitor', desc: 'Watch for fake apps', on: appMonitor, toggle: () => setAppMonitor(!appMonitor) },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f0f4ff' }}>{s.label}</div>
                <div style={{ fontSize: '0.72rem', color: '#8a9cbc' }}>{s.desc}</div>
              </div>
              <Toggle on={s.on} onToggle={s.toggle} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
