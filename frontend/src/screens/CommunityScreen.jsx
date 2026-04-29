import { useState, useEffect } from 'react'
import { Plus, ThumbsUp, AlertTriangle, MessageSquare, Link, Smartphone, Phone, ChevronDown } from 'lucide-react'
import { submitReport, getReports, upvoteReport } from '../services/api'
import toast from 'react-hot-toast'

const TYPE_META = {
  sms: { icon: <MessageSquare size={16} />, label: 'SMS Fraud', color: '#8b5cf6' },
  link: { icon: <Link size={16} />, label: 'Phishing Link', color: '#ff3a3a' },
  app: { icon: <Smartphone size={16} />, label: 'Fake App', color: '#ff8c00' },
  call: { icon: <Phone size={16} />, label: 'Fraud Call', color: '#ffd60a' },
  whatsapp: { icon: '💬', label: 'WhatsApp Fraud', color: '#00c853' },
  email: { icon: '📧', label: 'Phishing Email', color: '#00c6ff' },
}

const MOCK_REPORTS = [
  {
    id: 1, report_type: 'sms', severity: 'high', upvotes: 42, verified: true,
    content: 'Dear SBI customer, your account is blocked. Click http://sbi-verify.tk to unlock immediately.',
    location: 'Mumbai', reported_at: '2026-04-25T10:00:00',
  },
  {
    id: 2, report_type: 'link', severity: 'high', upvotes: 28, verified: true,
    content: 'http://hdfc-bank-login.xyz/secure — Fake HDFC login page stealing credentials.',
    location: 'Delhi', reported_at: '2026-04-24T14:00:00',
  },
  {
    id: 3, report_type: 'app', severity: 'high', upvotes: 15, verified: false,
    content: 'Fake SBI YONO app from third-party store requesting SMS + Contact permissions.',
    location: 'Bengaluru', reported_at: '2026-04-23T08:00:00',
  },
  {
    id: 4, report_type: 'call', severity: 'medium', upvotes: 8, verified: false,
    content: 'Caller claiming to be RBI officer asking for ATM PIN and OTP.',
    location: 'Hyderabad', reported_at: '2026-04-22T16:00:00',
  },
  {
    id: 5, report_type: 'whatsapp', severity: 'medium', upvotes: 19, verified: false,
    content: 'Won ₹5 lakh lottery! Click here to claim: http://prize.click/win — WhatsApp message.',
    location: 'Chennai', reported_at: '2026-04-21T11:00:00',
  },
]

function ReportCard({ report, onUpvote }) {
  const meta = TYPE_META[report.report_type] || TYPE_META.link
  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86400000)
    return days === 0 ? 'Today' : `${days}d ago`
  }

  return (
    <div className="report-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9, flexShrink: 0,
          background: `${meta.color}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: meta.color,
        }}>
          {meta.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{meta.label}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            📍 {report.location} • {timeAgo(report.reported_at)}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
          <span className={`badge badge-${report.severity}`}>{report.severity}</span>
          {report.verified && <span style={{ fontSize: '0.65rem', color: 'var(--accent-green)' }}>✅ Verified</span>}
        </div>
      </div>

      <div style={{
        fontSize: '0.78rem', color: 'var(--text-secondary)',
        lineHeight: 1.5, padding: '8px 10px',
        background: 'rgba(255,255,255,0.02)', borderRadius: 8,
        borderLeft: `2px solid ${meta.color}40`,
      }}>
        {report.content.slice(0, 120)}{report.content.length > 120 ? '…' : ''}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => onUpvote(report.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(0,198,255,0.08)', border: '1px solid rgba(0,198,255,0.2)',
            borderRadius: 99, padding: '5px 12px', cursor: 'pointer',
            color: 'var(--accent-blue)', fontSize: '0.78rem', fontWeight: 600,
            fontFamily: 'var(--font)', transition: 'all 0.2s',
          }}
        >
          <ThumbsUp size={13} /> {report.upvotes} Helpful
        </button>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          Report #{report.id}
        </span>
      </div>
    </div>
  )
}

function ReportForm({ onClose, onSubmit }) {
  const [form, setForm] = useState({ report_type: 'sms', content: '', location: '', severity: 'medium' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (form.content.trim().length < 10) return toast.error('Please provide more details (min 10 chars)')
    setLoading(true)
    try {
      await onSubmit(form)
      toast.success('🚨 Fraud report submitted! Thank you for keeping others safe.')
      onClose()
    } catch {
      toast.error('Could not submit report. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
      zIndex: 200, display: 'flex', alignItems: 'flex-end',
      backdropFilter: 'blur(4px)',
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--bg-secondary)', borderRadius: '24px 24px 0 0',
        padding: '24px 20px', width: '100%', maxWidth: '390px',
        margin: '0 auto', border: '1px solid var(--border-color)',
        animation: 'slideUp 0.3s ease',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>🚨 Report Fraud</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            Help protect the community
          </div>
        </div>

        <div className="input-group mb-3">
          <label className="input-label">Type</label>
          <select className="input" value={form.report_type} onChange={e => setForm(f => ({ ...f, report_type: e.target.value }))}>
            {Object.entries(TYPE_META).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>

        <div className="input-group mb-3">
          <label className="input-label">Description *</label>
          <textarea className="input" rows={3}
            placeholder="Describe the fraud — include the message, URL, or app name..."
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
          />
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <div className="input-group" style={{ flex: 1 }}>
            <label className="input-label">Location</label>
            <input className="input" placeholder="City (optional)"
              value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
          </div>
          <div className="input-group" style={{ flex: 1 }}>
            <label className="input-label">Severity</label>
            <select className="input" value={form.severity} onChange={e => setForm(f => ({ ...f, severity: e.target.value }))}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <button className="btn btn-danger btn-full btn-lg" onClick={handleSubmit} disabled={loading}>
          {loading ? <><div className="spinner" /> Submitting…</> : '🚨 Submit Report'}
        </button>
        <button className="btn btn-outline btn-full mt-2" onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}

export default function CommunityScreen() {
  const [reports, setReports] = useState(MOCK_REPORTS)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getReports({ limit: 30 }).then(r => {
      if (r.data.length > 0) setReports([...r.data, ...MOCK_REPORTS])
    }).catch(() => {})
  }, [])

  const handleUpvote = async (id) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
    try { await upvoteReport(id) } catch {}
  }

  const handleSubmit = async (form) => {
    const res = await submitReport(form)
    setReports(prev => [res.data, ...prev])
  }

  const filtered = filter === 'all' ? reports : reports.filter(r => r.report_type === filter)

  return (
    <div>
      <div className="top-bar">
        <div className="top-bar-title">🛡️ Community</div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary btn-sm"
          style={{ padding: '6px 12px' }}
        >
          <Plus size={14} /> Report
        </button>
      </div>

      <div className="screen-content screen-pad animate-fadeIn">
        {/* Stats */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[
            { label: 'Reports', value: reports.length, color: 'var(--accent-red)' },
            { label: 'Verified', value: reports.filter(r => r.verified).length, color: 'var(--accent-green)' },
            { label: 'High Risk', value: reports.filter(r => r.severity === 'high').length, color: 'var(--accent-orange)' },
          ].map(s => (
            <div key={s.label} className="card" style={{ flex: 1, textAlign: 'center', padding: 10 }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
          {[
            { id: 'all', label: 'All' },
            { id: 'sms', label: '💬 SMS' },
            { id: 'link', label: '🔗 Links' },
            { id: 'app', label: '📱 Apps' },
            { id: 'call', label: '📞 Calls' },
          ].map(btn => (
            <button key={btn.id} onClick={() => setFilter(btn.id)} style={{
              flexShrink: 0, padding: '6px 12px', borderRadius: 99,
              border: `1px solid ${filter === btn.id ? 'var(--accent-blue)' : 'var(--border-color)'}`,
              background: filter === btn.id ? 'rgba(0,198,255,0.12)' : 'transparent',
              color: filter === btn.id ? 'var(--accent-blue)' : 'var(--text-secondary)',
              fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)',
            }}>
              {btn.label}
            </button>
          ))}
        </div>

        {/* Reports */}
        <div className="flex flex-col gap-3">
          {filtered.map(r => <ReportCard key={r.id} report={r} onUpvote={handleUpvote} />)}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No reports in this category yet.
          </div>
        )}
      </div>

      {showForm && <ReportForm onClose={() => setShowForm(false)} onSubmit={handleSubmit} />}
    </div>
  )
}
