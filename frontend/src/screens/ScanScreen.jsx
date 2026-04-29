import { useState } from 'react'
import { scanUrl, analyzeText } from '../services/api'
import toast from 'react-hot-toast'

const ShieldIcon = ({ size = 24, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
)

export default function ScanScreen() {
  const [scanMode, setScanMode] = useState(null) // null | 'url' | 'sms' | 'results'
  const [url, setUrl] = useState('')
  const [smsText, setSmsText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)

  const handleStartScan = () => {
    setScanning(true)
    setScanProgress(0)
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) { clearInterval(interval); setScanning(false); return 100 }
        return prev + 2
      })
    }, 50)
  }

  const handleUrlScan = async () => {
    if (!url.trim()) return toast.error('Enter a URL to scan')
    setLoading(true)
    try {
      const data = await scanUrl(url)
      setResult({ type: 'url', data })
      setScanMode('results')
    } catch { toast.error('Scan failed') }
    setLoading(false)
  }

  const handleSmsScan = async () => {
    if (!smsText.trim()) return toast.error('Enter text to analyze')
    setLoading(true)
    try {
      const data = await analyzeText(smsText)
      setResult({ type: 'sms', data })
      setScanMode('results')
    } catch { toast.error('Analysis failed') }
    setLoading(false)
  }

  const getRiskColor = (score) => score >= 65 ? '#ff3d57' : score >= 35 ? '#ffd600' : '#00e676'
  const getRiskLabel = (cls) => cls === 'phishing' ? 'Phishing Detected' : cls === 'suspicious' ? 'Suspicious' : 'Safe'

  // Results View
  if (scanMode === 'results' && result) {
    const d = result.data
    const score = d.risk_score || d.phishing_score || 0
    const cls = d.classification || (score >= 65 ? 'phishing' : score >= 35 ? 'suspicious' : 'safe')
    const col = getRiskColor(score)

    return (
      <div className="screen-content" style={{ padding: '0 0 90px 0' }}>
        <div style={{ padding: '16px 18px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div onClick={() => { setScanMode(null); setResult(null) }} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,198,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#8a9cbc' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Scan Results</h1>
        </div>
        <div style={{ padding: '20px 18px', textAlign: 'center' }}>
          {/* Score Ring */}
          <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto 20px' }}>
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
              <circle cx="80" cy="80" r="68" fill="none" stroke={col} strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${score * 4.27} 427`} transform="rotate(-90 80 80)" style={{ filter: `drop-shadow(0 0 8px ${col}50)` }} />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: 900, color: col }}>{score}</div>
              <div style={{ fontSize: '0.7rem', color: '#8a9cbc' }}>Risk Score</div>
            </div>
          </div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: col, marginBottom: 8 }}>{getRiskLabel(cls)}</div>
          <div style={{ fontSize: '0.82rem', color: '#8a9cbc', marginBottom: 24 }}>{d.url || 'Text analysis complete'}</div>

          {/* Details */}
          {d.flags && d.flags.length > 0 && (
            <div style={{ background: 'rgba(16,30,52,0.7)', border: '1px solid rgba(0,198,255,0.08)', borderRadius: 14, padding: 16, textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: 12, color: '#f0f4ff' }}>Detection Details</div>
              {d.flags.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: i < d.flags.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <span style={{ color: '#ff3d57' }}>⚠</span>
                  <span style={{ fontSize: '0.8rem', color: '#8a9cbc' }}>{f}</span>
                </div>
              ))}
            </div>
          )}

          <button onClick={() => { setScanMode(null); setResult(null) }} style={{ width: '100%', marginTop: 20, padding: '14px', background: 'linear-gradient(135deg, #0066cc, #00c6ff)', border: 'none', borderRadius: 14, color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'Inter' }}>
            Scan Another
          </button>
        </div>
      </div>
    )
  }

  // URL Input Mode
  if (scanMode === 'url') {
    return (
      <div className="screen-content" style={{ padding: '0 0 90px 0' }}>
        <div style={{ padding: '16px 18px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div onClick={() => setScanMode(null)} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,198,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#8a9cbc' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Check Link</h1>
        </div>
        <div style={{ padding: '20px 18px' }}>
          <div style={{ fontSize: '0.85rem', color: '#8a9cbc', marginBottom: 16 }}>Enter a URL to check if it's safe or a phishing attempt</div>
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com"
            style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,198,255,0.12)', borderRadius: 14, color: '#f0f4ff', fontSize: '0.9rem', fontFamily: 'Inter', outline: 'none', marginBottom: 16 }}
            onFocus={e => e.target.style.borderColor = 'rgba(0,198,255,0.4)'}
            onBlur={e => e.target.style.borderColor = 'rgba(0,198,255,0.12)'} />
          <button onClick={handleUrlScan} disabled={loading}
            style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #0066cc, #00c6ff)', border: 'none', borderRadius: 14, color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'Inter', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Scanning...' : 'Scan URL'}
          </button>
        </div>
      </div>
    )
  }

  // SMS Input Mode
  if (scanMode === 'sms') {
    return (
      <div className="screen-content" style={{ padding: '0 0 90px 0' }}>
        <div style={{ padding: '16px 18px 8px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div onClick={() => setScanMode(null)} style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,198,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#8a9cbc' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </div>
          <h1 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Analyze Message</h1>
        </div>
        <div style={{ padding: '20px 18px' }}>
          <div style={{ fontSize: '0.85rem', color: '#8a9cbc', marginBottom: 16 }}>Paste a suspicious SMS or WhatsApp message to analyze</div>
          <textarea value={smsText} onChange={e => setSmsText(e.target.value)} placeholder="Paste suspicious message here..."
            style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,198,255,0.12)', borderRadius: 14, color: '#f0f4ff', fontSize: '0.9rem', fontFamily: 'Inter', outline: 'none', marginBottom: 16, minHeight: 120, resize: 'vertical' }}
            onFocus={e => e.target.style.borderColor = 'rgba(0,198,255,0.4)'}
            onBlur={e => e.target.style.borderColor = 'rgba(0,198,255,0.12)'} />
          <button onClick={handleSmsScan} disabled={loading}
            style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #0066cc, #00c6ff)', border: 'none', borderRadius: 14, color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'Inter', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Analyzing...' : 'Analyze Text'}
          </button>
        </div>
      </div>
    )
  }

  // Main Scan Screen (Figma design)
  return (
    <div className="screen-content" style={{ padding: '0 0 90px 0' }}>
      <div style={{ padding: '16px 18px 8px' }}>
        <h1 style={{ fontSize: '1.15rem', fontWeight: 800, background: 'linear-gradient(135deg, #00c6ff, #0ff0fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4 }}>Security Scanner</h1>
        <p style={{ fontSize: '0.82rem', color: '#8a9cbc' }}>Scan your device for threats</p>
      </div>

      <div style={{ padding: '0 18px' }}>
        {/* Scan Type Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          {[
            { title: 'Quick Scan', desc: 'Fast security check', time: '~1 min', icon: '⚡' },
            { title: 'Deep Scan', desc: 'Comprehensive threat analysis', time: '~3 min', icon: '🔍' },
            { title: 'Real-Time Monitor', desc: 'Continuous protection mode', time: 'Always on', icon: '👁️' },
          ].map((item, i) => (
            <div key={i} onClick={() => setScanMode('url')} style={{ background: 'rgba(16,30,52,0.7)', border: '1px solid rgba(0,198,255,0.08)', borderRadius: 16, padding: '18px 18px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', transition: 'all 0.25s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,198,255,0.25)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,198,255,0.08)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f0f4ff' }}>{item.title}</div>
                <div style={{ fontSize: '0.78rem', color: '#8a9cbc' }}>{item.desc}</div>
                <div style={{ fontSize: '0.7rem', color: '#4a5a7a', marginTop: 2 }}>{item.time}</div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a5a7a" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          ))}
        </div>

        {/* Start Scan Button (Figma: large gradient blue-purple button) */}
        <div onClick={handleStartScan} style={{
          background: scanning ? 'linear-gradient(135deg, #00c6ff, #7c3aed)' : 'linear-gradient(135deg, #00c6ff, #8b5cf6)',
          borderRadius: 20, padding: scanning ? '30px 20px' : '50px 20px', textAlign: 'center', cursor: 'pointer',
          transition: 'all 0.3s', position: 'relative', overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,198,255,0.2)',
        }}
          onMouseEnter={e => { if (!scanning) e.currentTarget.style.transform = 'scale(1.02)' }}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
          {scanning ? (
            <>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: 8 }}>{scanProgress}%</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', marginBottom: 14 }}>Scanning your device...</div>
              <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 3 }}>
                <div style={{ width: `${scanProgress}%`, height: '100%', background: '#fff', borderRadius: 3, transition: 'width 0.1s' }} />
              </div>
            </>
          ) : (
            <>
              <ShieldIcon size={48} color="#fff" />
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginTop: 12 }}>Start Scan</div>
            </>
          )}
        </div>

        {/* Additional scan options */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
          <div onClick={() => setScanMode('url')} style={{ background: 'rgba(16,30,52,0.7)', border: '1px solid rgba(0,198,255,0.08)', borderRadius: 14, padding: '16px', textAlign: 'center', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,198,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,198,255,0.08)'}>
            <div style={{ fontSize: '1.4rem', marginBottom: 8 }}>🔗</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f0f4ff' }}>Check Link</div>
          </div>
          <div onClick={() => setScanMode('sms')} style={{ background: 'rgba(16,30,52,0.7)', border: '1px solid rgba(0,198,255,0.08)', borderRadius: 14, padding: '16px', textAlign: 'center', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,198,255,0.25)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,198,255,0.08)'}>
            <div style={{ fontSize: '1.4rem', marginBottom: 8 }}>💬</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f0f4ff' }}>Analyze SMS</div>
          </div>
        </div>
      </div>
    </div>
  )
}
