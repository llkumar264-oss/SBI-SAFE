import { useState, useEffect } from 'react'
import { submitReport, getReports } from '../services/api'
import toast from 'react-hot-toast'

export default function CommunityScreen() {
  const [showReportForm, setShowReportForm] = useState(false)
  const [reports, setReports] = useState([])
  const [reportType, setReportType] = useState('')
  const [reportDesc, setReportDesc] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const trendingScams = [
    { rank: 1, title: 'Fake Package Delivery SMS', reports: 1247, trend: '+45%', color: '#00c6ff' },
    { rank: 2, title: 'Crypto Investment Scam', reports: 892, trend: '+32%', color: '#8b5cf6' },
    { rank: 3, title: 'Tech Support Calls', reports: 567, trend: '+18%', color: '#00e676' },
  ]

  const recentReports = [
    { id: 1, user: 'Sarah Chen', initials: 'SC', badge: 'Fraud Hunter', time: '5 min ago', type: 'Phishing SMS', verified: true, desc: 'Fake DHL delivery message asking for payment to release package.', color: '#00e676', upvotes: 24 },
    { id: 2, user: 'Raj Patel', initials: 'RP', badge: 'Cyber Guardian', time: '18 min ago', type: 'Fake App', verified: true, desc: 'Fake SBI YONO app on third-party store requesting all permissions.', color: '#00c6ff', upvotes: 15 },
    { id: 3, user: 'Anita K.', initials: 'AK', badge: null, time: '1 hour ago', type: 'Scam Call', verified: false, desc: 'Caller claiming to be RBI officer asking for Aadhaar and OTP.', color: '#ff9100', upvotes: 8 },
  ]

  const fraudTypes = [
    { id: 'sms_fraud', label: 'SMS Fraud', icon: '💬' },
    { id: 'whatsapp_scam', label: 'WhatsApp Scam', icon: '💬' },
    { id: 'fake_app', label: 'Fake App', icon: '📱' },
    { id: 'scam_call', label: 'Scam Call', icon: '📞' },
  ]

  useEffect(() => {
    getReports().then(r => r && setReports(r)).catch(() => {})
  }, [])

  const handleSubmit = async () => {
    if (!reportType || !reportDesc.trim()) return toast.error('Fill all fields')
    setSubmitting(true)
    try {
      await submitReport({ report_type: reportType, description: reportDesc, source: 'community', location: 'India' })
      toast.success('Report submitted!')
      setShowReportForm(false)
      setReportType('')
      setReportDesc('')
    } catch { toast.error('Failed to submit') }
    setSubmitting(false)
  }

  // Report Form View
  if (showReportForm) {
    return (
      <div className="screen-content" style={{ padding: '0 0 90px 0' }}>
        <div style={{ padding: '16px 18px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div onClick={() => setShowReportForm(false)} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,198,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#8a9cbc' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </div>
          <div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Report Fraud</h1>
            <p style={{ fontSize: '0.78rem', color: '#00c6ff' }}>Help protect the community by reporting scams</p>
          </div>
        </div>

        <div style={{ padding: '16px 18px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 14, color: '#f0f4ff' }}>Select Fraud Type</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            {fraudTypes.map(ft => (
              <div key={ft.id} onClick={() => setReportType(ft.id)} style={{
                background: reportType === ft.id ? 'rgba(0,198,255,0.08)' : 'rgba(16,30,52,0.7)',
                border: `1px solid ${reportType === ft.id ? 'rgba(0,198,255,0.3)' : 'rgba(0,198,255,0.08)'}`,
                borderRadius: 16, padding: '24px 16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.25s'
              }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: '1.4rem' }}>{ft.icon}</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f0f4ff' }}>{ft.label}</div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 10, color: '#f0f4ff' }}>Description</h3>
          <textarea value={reportDesc} onChange={e => setReportDesc(e.target.value)} placeholder="Describe the fraud in detail..."
            style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,198,255,0.12)', borderRadius: 14, color: '#f0f4ff', fontSize: '0.9rem', fontFamily: 'Inter', outline: 'none', marginBottom: 20, minHeight: 120, resize: 'vertical' }} />

          <button onClick={handleSubmit} disabled={submitting} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #0066cc, #00c6ff)', border: 'none', borderRadius: 14, color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', fontFamily: 'Inter', opacity: submitting ? 0.6 : 1 }}>
            {submitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </div>
    )
  }

  // Main Community Screen
  return (
    <div className="screen-content" style={{ padding: '0 0 90px 0' }}>
      <div style={{ padding: '16px 18px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 800, background: 'linear-gradient(135deg, #00c6ff, #0ff0fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4 }}>Community</h1>
          <p style={{ fontSize: '0.82rem', color: '#8a9cbc' }}>Report and track fraud together</p>
        </div>
        <button onClick={() => setShowReportForm(true)} style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #0066cc, #00c6ff)', border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'Inter', display: 'flex', alignItems: 'center', gap: 6 }}>
          + Report
        </button>
      </div>

      <div style={{ padding: '0 18px' }}>
        {/* Trending Scams */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00c6ff" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#00c6ff' }}>Trending Scams</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {trendingScams.map(s => (
              <div key={s.rank} style={{ background: 'rgba(16,30,52,0.7)', border: '1px solid rgba(0,198,255,0.08)', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem', fontWeight: 800, color: s.color }}>{s.rank}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f0f4ff' }}>{s.title}</div>
                  <div style={{ fontSize: '0.72rem', color: '#8a9cbc' }}>{s.reports} reports</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 600, color: '#00e676' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
                  {s.trend}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 14, color: '#f0f4ff' }}>Recent Reports</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {recentReports.map(r => (
            <div key={r.id} style={{ background: 'rgba(16,30,52,0.7)', border: '1px solid rgba(0,198,255,0.08)', borderRadius: 16, padding: '16px' }}>
              {/* User header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${r.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: r.color, border: `2px solid ${r.color}40` }}>{r.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f0f4ff' }}>{r.user}</span>
                    {r.verified && <svg width="14" height="14" viewBox="0 0 24 24" fill="#00c6ff"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#00c6ff" strokeWidth="2" fill="none"/></svg>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {r.badge && <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#00e676', background: 'rgba(0,230,118,0.12)', padding: '2px 8px', borderRadius: 20, border: '1px solid rgba(0,230,118,0.25)' }}>{r.badge}</span>}
                    <span style={{ fontSize: '0.7rem', color: '#4a5a7a' }}>{r.time}</span>
                  </div>
                </div>
              </div>
              {/* Tags */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#ff9100', background: 'rgba(255,145,0,0.12)', padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(255,145,0,0.25)' }}>{r.type}</span>
                {r.verified && <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#00e676', background: 'rgba(0,230,118,0.12)', padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(0,230,118,0.25)' }}>✓ Verified by community</span>}
              </div>
              <p style={{ fontSize: '0.82rem', color: '#8a9cbc', lineHeight: 1.5 }}>{r.desc}</p>
              {/* Upvote */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, color: '#4a5a7a', fontSize: '0.78rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                {r.upvotes}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
