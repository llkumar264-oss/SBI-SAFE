# 🛡️ SBI SAFE — AI-Powered Anti-Fraud Mobile App

## Complete Setup & Run Guide

---

## 📁 Project Structure

```
sbi-safe/
├── backend/                        # FastAPI Python backend
│   ├── app/
│   │   ├── main.py                 # App entry point + seeding
│   │   ├── database.py             # SQLAlchemy models (SQLite)
│   │   ├── schemas.py              # Pydantic request/response schemas
│   │   ├── routers/
│   │   │   ├── auth.py             # JWT register/login
│   │   │   ├── scan.py             # /scan-url endpoint
│   │   │   ├── nlp.py              # /analyze-text endpoint
│   │   │   ├── reports.py          # /report-fraud endpoint
│   │   │   ├── fraud_map.py        # /fraud-map endpoint
│   │   │   └── risk.py             # /risk-score + /analyze-apk
│   │   └── services/
│   │       └── detection.py        # Core AI fraud detection engine
│   ├── requirements.txt
│   └── .env
│
├── frontend/                       # React + Vite mobile-responsive app
│   ├── src/
│   │   ├── App.jsx                 # Navigation shell
│   │   ├── main.jsx                # React entry point
│   │   ├── index.css               # Global design system
│   │   ├── context/
│   │   │   └── AppContext.jsx      # Global state management
│   │   ├── services/
│   │   │   └── api.js              # Axios API client
│   │   └── screens/
│   │       ├── HomeScreen.jsx      # Dashboard with protection ring
│   │       ├── ScanScreen.jsx      # URL/SMS/APK scanner
│   │       ├── AlertsScreen.jsx    # Real-time alerts
│   │       ├── MapScreen.jsx       # Live fraud map (India)
│   │       ├── CommunityScreen.jsx # Community reports
│   │       └── ProfileScreen.jsx   # Profile + analytics
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## ⚙️ Step-by-Step Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm 9+

---

### 1. Backend Setup

```powershell
# Navigate to backend
cd sbi-safe\backend

# Install Python packages
pip install fastapi uvicorn[standard] sqlalchemy pydantic python-jose passlib python-multipart python-dotenv scikit-learn numpy

# Start the FastAPI server
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

✅ Backend runs at: **http://localhost:8000**  
📚 Auto docs at: **http://localhost:8000/docs**

---

### 2. Frontend Setup

```powershell
# Navigate to frontend
cd sbi-safe\frontend

# Install Node packages
npm install

# Start Vite dev server
npm run dev
```

✅ Frontend runs at: **http://localhost:3000**

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/login` | Login (returns JWT) |
| `POST` | `/scan-url` | Scan URL for phishing |
| `GET`  | `/scan-url/history` | Get scan history |
| `GET`  | `/scan-url/stats` | Get scan statistics |
| `POST` | `/analyze-text` | NLP SMS/text analysis |
| `POST` | `/report-fraud` | Submit community report |
| `GET`  | `/report-fraud` | List fraud reports |
| `POST` | `/report-fraud/{id}/upvote` | Upvote a report |
| `GET`  | `/fraud-map/heatmap` | Get fraud heatmap data |
| `GET`  | `/fraud-map/stats` | Fraud map statistics |
| `POST` | `/risk-score` | Compute behavioral risk score |
| `POST` | `/analyze-apk` | Analyze APK permissions |
| `GET`  | `/alerts` | Get real-time alerts |

---

## 🤖 AI/ML Detection Logic

### URL Analysis (`/scan-url`)
Extracts these features from URLs:
- URL length (>100 chars = suspicious)
- HTTPS presence
- IP address as hostname (high risk)
- Suspicious TLDs (.tk, .ml, .xyz, etc.)
- Phishing keyword density (login, verify, otp, kyc, etc.)
- Domain entropy (detects DGA domains)
- Subdomain count
- Special character count

**Risk Score → Classification:**
- `0–34`: ✅ Safe
- `35–64`: ⚠️ Suspicious  
- `65–100`: 🔴 Phishing

### SMS Analysis (`/analyze-text`)
- Pattern matching for 10 phishing regex patterns
- Keyword frequency scoring (50+ fraud keywords)
- URL extraction and flagging
- Message length heuristics

### APK Analyzer (`/analyze-apk`)
Flags dangerous Android permissions:
- `READ_SMS` / `RECEIVE_SMS` — OTP interception
- `BIND_DEVICE_ADMIN` — Device takeover
- `INSTALL_PACKAGES` — Malware dropper
- `PROCESS_OUTGOING_CALLS` — Call hijacking

### Behavioral Risk Engine (`/risk-score`)
Tracks risky actions with weighted scoring:
- Clicked unknown link: +20
- Entered OTP on unknown site: +40
- Downloaded APK from unknown source: +35
- Granted SMS permission: +15

---

## 📱 App Screens

| Screen | Features |
|--------|----------|
| **Home** | Protection ring (87%), stats, weekly chart, quick actions, recent threats |
| **Scanner** | URL scan, SMS/text analysis, APK permission checker |
| **Alerts** | Real-time alerts, severity filtering, live monitoring badge |
| **Map** | SVG India fraud map, 15 city hotspots, clickable markers |
| **Community** | Submit & browse fraud reports, upvoting, category filters |
| **Profile** | Behavioral risk score, analytics charts, security settings |

---

## 🔒 Security Features

- ✅ JWT authentication (register/login)
- ✅ Input validation on all endpoints
- ✅ CORS enabled for development
- ✅ SQL injection prevention (SQLAlchemy ORM)
- ✅ Minimum content length validation on reports
- ✅ Report type whitelist validation

---

## 🚀 Future Improvements

### Phase 2
- [ ] Real-time WebSocket push notifications
- [ ] ML model trained on actual phishing datasets (PhishTank, OpenPhish)
- [ ] Google Safe Browsing API integration
- [ ] VirusTotal URL check integration

### Phase 3
- [ ] React Native mobile app (iOS + Android)
- [ ] Background SMS scanning service
- [ ] Push notifications via Firebase
- [ ] OTP/Banking pattern detection
- [ ] MongoDB migration for scale

### Phase 4
- [ ] Multi-language support (Hindi, Tamil, Telugu)
- [ ] Shared threat intelligence across users
- [ ] Admin dashboard for verified reports
- [ ] AI model auto-retraining pipeline
- [ ] Dark Web monitoring alerts

---

## 🧪 Quick Test

```bash
# Test URL scan
curl -X POST http://localhost:8000/scan-url \
  -H "Content-Type: application/json" \
  -d '{"url": "http://sbi-verify.tk/login"}'

# Test SMS analysis
curl -X POST http://localhost:8000/analyze-text \
  -H "Content-Type: application/json" \
  -d '{"text": "Your SBI account is blocked. Click http://sbi-verify.tk"}'

# Get fraud map
curl http://localhost:8000/fraud-map/heatmap
```

---

## 📊 Sample Data

The backend auto-seeds these fraud reports on startup:
- Fake SBI SMS (Mumbai, High severity, 42 upvotes)
- HDFC phishing link (Delhi, High severity, 28 upvotes)  
- Fake SBI YONO APK (Bengaluru, High severity, 15 upvotes)
- RBI officer fraud call (Hyderabad, Medium severity)
- WhatsApp lottery scam (Chennai, Medium severity)

---

*Built with ❤️ to protect Indian banking customers from digital fraud.*
