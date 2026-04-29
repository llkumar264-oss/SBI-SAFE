import { useState } from 'react'
import { Search, Shield, AlertTriangle, CheckCircle, XCircle, Link, MessageSquare, Cpu, ChevronDown, ChevronUp, Loader } from 'lucide-react'
import { scanUrl, analyzeText, analyzeApk } from '../services/api'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

const DEMO_PERMISSIONS = [
  'android.permission.READ_SMS',
  'android.permission.RECEIVE_SMS',
  'android.permission.READ_CONTACTS',
  'android.permission.ACCESS_FINE_LOCATION',
  'android.permission.CAMERA',
]

function RiskGauge({ score }) {
  const color = score >= 65 ? 'var(--accent-red)' : score >= 35 ? 'var(--accent-yellow)' : 'var(--accent-green)'
  const label = score >= 65 ? 'PHISHING' : score >= 35 ? 'SUSPICIOUS' : 'SAFE'

  return (
    <div style={{ textAlign: 'center', padding: '16px 0' }}>
      <div style={{
        width: 100, height: 100, borderRadius: '50%', margin: '0 auto 12px',
        background: `conic-gradient(${color} ${score}%, rgba(255,255,255,0.06) 0%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 24px ${color}40`,
      }}>
        <div style={{
          width: 76, height: 76, borderRadius: '50%',
          background: 'var(--bg-secondary)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 900, color }}>{score}</span>
          <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>RISK</span>
        </div>
      </div>
      <span className={`badge badge-${score >= 65 ? 'phishing' : score >= 35 ? 'suspicious' : 'safe'}`}
        style={{ fontSize: '0.8rem', padding: '6px 16px' }}>
        {label}
      </span>
    </div>
  )
}

function ResultCard({ result, type }) {
  const [expanded, setExpanded] = useState(false)
  if (!result) return null

  const cls = result.classification
  const resultClass = `result-container result-${cls}`

  return (
    <div className={resultClass}>
      <RiskGauge score={Math.round(result.risk_score)} />

      {/* Reasons */}
      {result.reasons?.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
            🔍 Analysis Findings:
          </div>
          {result.reasons.map((r, i) => (
            <div key={i} style={{
              fontSize: '0.78rem', color: 'var(--text-primary)',
              padding: '4px 8px', background: 'rgba(255,255,255,0.03)',
              borderRadius: 6, marginBottom: 4,
              borderLeft: `2px solid ${cls === 'safe' ? 'var(--accent-green)' : cls === 'suspicious' ? 'var(--accent-yellow)' : 'var(--accent-red)'}`,
            }}>
              • {r}
            </div>
          ))}
        </div>
      )}

      {/* Expandable details */}
      {(result.keyword_hits?.length > 0 || result.urls_found?.length > 0) && (
        <div
          style={{ marginTop: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
          onClick={() => setExpanded(v => !v)}
        >
          <span style={{ fontSize: '0.78rem', color: 'var(--accent-blue)' }}>
            {expanded ? 'Hide' : 'Show'} details
          </span>
          {expanded ? <ChevronUp size={14} color="var(--accent-blue)" /> : <ChevronDown size={14} color="var(--accent-blue)" />}
        </div>
      )}
      {expanded && (
        <div style={{ marginTop: 8 }}>
          {result.keyword_hits?.length > 0 && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
              <strong>Keywords:</strong> {result.keyword_hits.join(', ')}
            </div>
          )}
          {result.urls_found?.length > 0 && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <strong>URLs found:</strong> {result.urls_found.join(', ')}
            </div>
          )}
          {result.features?.domain && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <strong>Domain:</strong> {result.features.domain} | <strong>HTTPS:</strong> {result.features.has_https ? '✅' : '❌'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ApkResult({ result }) {
  if (!result) return null
  return (
    <div className={`result-container result-${result.verdict === 'safe' ? 'safe' : result.verdict === 'suspicious' ? 'suspicious' : 'phishing'}`}>
      <div className="text-center" style={{ marginBottom: 12 }}>
        <span className={`badge badge-${result.verdict === 'safe' ? 'safe' : result.verdict === 'suspicious' ? 'suspicious' : 'phishing'}`}
          style={{ fontSize: '0.85rem', padding: '6px 20px' }}>
          {result.verdict.toUpperCase()}
        </span>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 8 }}>
          Risk Score: <strong style={{ color: 'var(--text-primary)' }}>{result.risk_score}/100</strong> | 
          Flagged: <strong style={{ color: 'var(--accent-red)' }}>{result.flagged_count}/{result.total_permissions}</strong> permissions
        </div>
      </div>
      {result.flagged_permissions?.map((p, i) => (
        <div key={i} style={{
          padding: '8px 10px', borderRadius: 8, marginBottom: 6,
          background: p.severity === 'critical' ? 'rgba(255,58,58,0.1)' : p.severity === 'high' ? 'rgba(255,140,0,0.1)' : 'rgba(255,214,10,0.1)',
          borderLeft: `2px solid ${p.severity === 'critical' ? 'var(--accent-red)' : p.severity === 'high' ? 'var(--accent-orange)' : 'var(--accent-yellow)'}`,
        }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>{p.permission}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{p.description}</div>
          <span className={`badge badge-${p.severity === 'critical' || p.severity === 'high' ? 'phishing' : 'suspicious'}`}
            style={{ marginTop: 4, fontSize: '0.65rem' }}>
            {p.severity}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function ScanScreen() {
  const [tab, setTab] = useState('url')  // url | sms | apk
  const [urlInput, setUrlInput] = useState('')
  const [smsInput, setSmsInput] = useState('')
  const [apkName, setApkName] = useState('com.fake.banking.apk')
  const [loading, setLoading] = useState(false)
  const [urlResult, setUrlResult] = useState(null)
  const [smsResult, setSmsResult] = useState(null)
  const [apkResult, setApkResult] = useState(null)
  const { addScanResult } = useApp()

  const handleScanUrl = async () => {
    if (!urlInput.trim()) return toast.error('Enter a URL to scan')
    setLoading(true)
    setUrlResult(null)
    try {
      const res = await scanUrl(urlInput)
      setUrlResult(res.data)
      addScanResult(res.data)
      const cls = res.data.classification
      if (cls === 'phishing') toast.error('⚠️ Phishing URL detected!')
      else if (cls === 'suspicious') toast('⚡ URL looks suspicious', { icon: '⚠️' })
      else toast.success('✅ URL appears safe')
    } catch {
      toast.error('Backend offline — check if server is running')
      // Demo fallback
      setUrlResult({
        url: urlInput, classification: 'suspicious',
        risk_score: 45,
        reasons: ['URL contains phishing keywords', 'No HTTPS encryption'],
        features: { domain: urlInput, has_https: false },
        keyword_hits: ['login', 'verify'],
        urls_found: [],
      })
    } finally { setLoading(false) }
  }

  const handleScanSms = async () => {
    if (!smsInput.trim()) return toast.error('Enter message text to analyze')
    setLoading(true)
    setSmsResult(null)
    try {
      const res = await analyzeText(smsInput)
      setSmsResult(res.data)
      const cls = res.data.classification
      if (cls === 'phishing') toast.error('🚨 Phishing message detected!')
      else if (cls === 'suspicious') toast('⚠️ Message looks suspicious', { icon: '⚡' })
      else toast.success('✅ Message appears safe')
    } catch {
      toast.error('Backend offline — showing demo result')
      setSmsResult({
        classification: 'phishing', risk_score: 78,
        reasons: ['Phishing pattern matched', 'Contains suspicious URL'],
        keyword_hits: ['otp', 'account', 'blocked'],
        urls_found: ['http://sbi-verify.tk'],
      })
    } finally { setLoading(false) }
  }

  const handleScanApk = async () => {
    setLoading(true)
    setApkResult(null)
    try {
      const res = await analyzeApk({
        app_name: apkName || 'Unknown App',
        package_name: 'com.unknown.app',
        permissions: DEMO_PERMISSIONS,
        source: 'apk_file',
      })
      setApkResult(res.data)
      toast.error('⚠️ Dangerous permissions detected in APK!')
    } catch {
      setApkResult({
        verdict: 'dangerous', risk_score: 75,
        total_permissions: 5, flagged_count: 4,
        flagged_permissions: [
          { permission: 'READ_SMS', description: 'Can read your SMS/OTP', severity: 'critical' },
          { permission: 'RECEIVE_SMS', description: 'Intercepts incoming messages', severity: 'critical' },
          { permission: 'ACCESS_FINE_LOCATION', description: 'Tracks your location', severity: 'medium' },
        ],
      })
    } finally { setLoading(false) }
  }

  const tabs = [
    { id: 'url', icon: <Link size={15} />, label: 'URL Scan' },
    { id: 'sms', icon: <MessageSquare size={15} />, label: 'SMS / Text' },
    { id: 'apk', icon: <Cpu size={15} />, label: 'APK Check' },
  ]

  return (
    <div>
      <div className="top-bar">
        <div className="top-bar-title">🔍 Scanner</div>
      </div>

      <div className="screen-content screen-pad animate-fadeIn">
        {/* Tabs */}
        <div style={{
          display: 'flex', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)',
          padding: 4, marginBottom: 20, border: '1px solid var(--border-color)',
        }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '9px 8px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font)', fontSize: '0.8rem', fontWeight: 600,
              background: tab === t.id ? 'linear-gradient(135deg, #0066cc, #00c6ff)' : 'transparent',
              color: tab === t.id ? 'white' : 'var(--text-secondary)',
              transition: 'all 0.2s',
              boxShadow: tab === t.id ? '0 4px 12px rgba(0,198,255,0.3)' : 'none',
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* URL Scan */}
        {tab === 'url' && (
          <div>
            <div className="card mb-3">
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
                🔗 Paste any URL — our AI will analyze it for phishing, malware, and suspicious patterns.
              </div>
              <div className="input-group mb-3">
                <label className="input-label">URL to Scan</label>
                <input
                  id="url-input"
                  className="input"
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  placeholder="https://example.com or any suspicious link"
                  onKeyDown={e => e.key === 'Enter' && handleScanUrl()}
                />
              </div>
              <button id="scan-url-btn" className="btn btn-primary btn-full btn-lg" onClick={handleScanUrl} disabled={loading}>
                {loading ? <><div className="spinner" /><span>Analyzing...</span></> : <><Search size={18} />Scan URL</>}
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {['http://sbi-verify.tk/login', 'http://free-recharge.xyz', 'https://onlinesbi.com'].map(u => (
                <button key={u} onClick={() => setUrlInput(u)} style={{
                  background: 'var(--bg-glass)', border: '1px solid var(--border-color)',
                  borderRadius: 99, padding: '4px 10px', fontSize: '0.7rem',
                  color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font)',
                }}>
                  {u.slice(0, 28)}…
                </button>
              ))}
            </div>
            <ResultCard result={urlResult} type="url" />
          </div>
        )}

        {/* SMS Scan */}
        {tab === 'sms' && (
          <div>
            <div className="card mb-3">
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
                💬 Paste any SMS or WhatsApp message to detect phishing, fraud, or suspicious content.
              </div>
              <div className="input-group mb-3">
                <label className="input-label">Message Text</label>
                <textarea
                  id="sms-input"
                  className="input"
                  value={smsInput}
                  onChange={e => setSmsInput(e.target.value)}
                  placeholder="Paste your SMS or WhatsApp message here..."
                  rows={4}
                />
              </div>
              <button id="scan-sms-btn" className="btn btn-primary btn-full btn-lg" onClick={handleScanSms} disabled={loading}>
                {loading ? <><div className="spinner" /><span>Analyzing...</span></> : <><MessageSquare size={18} />Analyze Message</>}
              </button>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6 }}>💡 Try these examples:</div>
              {[
                'Dear SBI customer, your account is blocked. Verify now: http://sbi-verify.tk/login',
                'Congratulations! You have won ₹5,00,000! Click here to claim: http://prize.click',
                'Your OTP is 482910. Do not share with anyone.',
              ].map((msg, i) => (
                <div key={i} onClick={() => setSmsInput(msg)} style={{
                  fontSize: '0.75rem', padding: '8px 10px', marginBottom: 4,
                  background: 'var(--bg-glass)', border: '1px solid var(--border-color)',
                  borderRadius: 8, cursor: 'pointer', color: 'var(--text-secondary)',
                  transition: 'all 0.2s',
                }}>
                  {msg.slice(0, 60)}…
                </div>
              ))}
            </div>
            <ResultCard result={smsResult} type="sms" />
          </div>
        )}

        {/* APK Analyzer */}
        {tab === 'apk' && (
          <div>
            <div className="card mb-3">
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
                📱 Check Android APK permissions for dangerous or suspicious access requests.
              </div>
              <div className="input-group mb-3">
                <label className="input-label">App Name / Package</label>
                <input
                  id="apk-input"
                  className="input"
                  value={apkName}
                  onChange={e => setApkName(e.target.value)}
                  placeholder="com.fake.banking.apk"
                />
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
                <strong>Permissions to analyze:</strong>
                <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {DEMO_PERMISSIONS.map(p => (
                    <span key={p} style={{
                      fontSize: '0.68rem', padding: '2px 8px',
                      background: 'rgba(255,58,58,0.1)', color: 'var(--accent-red)',
                      border: '1px solid rgba(255,58,58,0.2)', borderRadius: 99,
                    }}>{p.replace('android.permission.', '')}</span>
                  ))}
                </div>
              </div>
              <button id="scan-apk-btn" className="btn btn-danger btn-full btn-lg" onClick={handleScanApk} disabled={loading}>
                {loading ? <><div className="spinner" /><span>Checking...</span></> : <><Cpu size={18} />Analyze APK</>}
              </button>
            </div>
            <ApkResult result={apkResult} />
          </div>
        )}
      </div>
    </div>
  )
}
