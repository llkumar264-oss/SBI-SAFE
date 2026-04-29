<div align="center">
  <img src="https://raw.githubusercontent.com/llkumar264-oss/SBI-SAFE/main/frontend/public/sbi_safe_logo.svg" width="80" alt="SBI SAFE Logo" />
  <h1>🛡️ SBI SAFE — Enterprise AI Fraud Prevention Platform</h1>
  <p>
    <b>A highly scalable, real-time machine learning cybersecurity application designed to detect and prevent financial fraud across SMS, WhatsApp, and the Web.</b>
  </p>
  <p>
    <img src="https://img.shields.io/badge/Python-3.11+-blue.svg" alt="Python" />
    <img src="https://img.shields.io/badge/FastAPI-0.111.0-009688.svg?logo=fastapi" alt="FastAPI" />
    <img src="https://img.shields.io/badge/React-18.x-61DAFB.svg?logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Machine%20Learning-Scikit--Learn-orange.svg" alt="ML" />
    <img src="https://img.shields.io/badge/Architecture-Microservices%20Ready-success.svg" alt="Microservices" />
  </p>
</div>

---

## 📖 The Vision

In an era where digital financial fraud costs billions annually, **SBI SAFE** acts as a proactive shield for consumers. Built with enterprise-grade architecture in mind, it analyzes telemetry data, URLs, and communication patterns in real-time to intercept phishing attempts and malicious applications *before* they compromise the user's financial assets.

## ✨ Core Capabilities

*   **⚡ Real-Time Threat Intelligence:** Sub-50ms latency on URL and text scanning using an optimized heuristic and NLP pipeline.
*   **🧠 Multi-Vector ML Detection:** Analyzes URLs (entropy, DGA detection, feature extraction), SMS (NLP keyword density, regex pattern matching), and APK metadata (dangerous permission matrices).
*   **🌐 Geographic Heatmaps:** Interactive, real-time visualization of fraud hotspots across India to alert users of regional scam surges.
*   **🛡️ Behavioral Risk Engine:** Computes an adaptive global risk score based on the user's recent interactions, granted permissions, and blocked threats.
*   **💎 Premium UX/UI:** "Cybersecurity Command Center" aesthetic utilizing complex glassmorphism, responsive data visualization, and neon-dark styling.

---

## 🏗️ System Architecture

The MVP is built on a decoupled, API-first architecture, ensuring that the frontend clients (Web/Mobile) communicate seamlessly with the Python-based AI microservice.

```mermaid
graph TD
    Client[React + Vite Frontend (PWA)]
    API[FastAPI Gateway]
    ML[AI Detection Engine]
    DB[(SQLite/MongoDB)]
    Ext[External Threat Feeds]
    
    Client -- REST / HTTPS --> API
    API -- Analyzes Text/URLs --> ML
    API -- Reads/Writes --> DB
    ML -. future integration .-> Ext
    
    subgraph Backend Service
        API
        ML
        DB
    end
```

### 🛠️ Technology Stack & Engineering Decisions

*   **Frontend:** React + Vite. Chosen for component reusability, Virtual DOM performance, and rapid PWA compilation. Implements global state context for real-time risk tracking.
*   **Backend:** FastAPI (Python). Chosen for high-performance asynchronous request handling (ASGI), automatic OpenAPI documentation, and seamless integration with Python's rich data science ecosystem (Scikit-Learn, Numpy).
*   **Security:** JWT-based stateless authentication, bcrypt password hashing, comprehensive CORS policies, and SQL injection prevention via SQLAlchemy ORM.

---

## 🧠 AI & Threat Detection Engine

The core value proposition lies in the `detection.py` service, which operates on a multi-layered heuristic approach:

1.  **URL Feature Extraction (`/scan-url`):**
    *   Analyzes structural anomalies (e.g., extremely long paths, multiple subdomains).
    *   Evaluates domain entropy to detect Domain Generation Algorithms (DGAs).
    *   Cross-references with high-risk TLDs and phishing keyword lexicons.
2.  **NLP SMS Analysis (`/analyze-text`):**
    *   Regex-based pattern matching for known phishing structures (e.g., "KYC Blocked", "Account Suspended").
    *   Extracts embedded URLs and recursively feeds them into the URL Engine.
3.  **Risk Scoring (`/risk-score`):**
    *   A weighted algorithm that assigns penalties for specific risky behaviors (e.g., `+40` for entering an OTP on an untrusted domain).

---

## 🚀 Quick Start (Local Development)

### Prerequisites
*   Node.js 18+ & npm 9+
*   Python 3.11+

### 1. Initialize the Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*The API will be available at `http://localhost:8000` (Docs: `/docs`)*

### 2. Initialize the Frontend
```bash
cd frontend
npm install
npm run dev
```
*The web app will be available at `http://localhost:3000`*

---

## 🧪 Testing the API

```bash
# Test the AI URL Scanner
curl -X POST http://localhost:8000/scan-url \
  -H "Content-Type: application/json" \
  -d '{"url": "http://sbi-update-kyc.xyz/login"}'

# Expected Output: Classification as "Phishing" with high risk score.
```

---

## 📈 Scalability Roadmap (Path to Production)

While this repository represents the MVP, the architecture is designed to scale to millions of DAUs (Daily Active Users):

*   **Phase 2 (Data Layer):** Migrate from SQLite to a distributed **MongoDB** cluster. Implement **Redis** for caching high-frequency URL scan results to reduce ML compute overhead.
*   **Phase 3 (Event Streaming):** Introduce **Apache Kafka** to handle real-time ingestion of community fraud reports and asynchronously update the Fraud Map.
*   **Phase 4 (Advanced ML):** Replace heuristic engines with deep learning models (e.g., Transformers for SMS NLP) trained on massive proprietary datasets. Deploy models using **Google Vertex AI** or **AWS SageMaker**.
*   **Phase 5 (Mobile Native):** Compile the React architecture into React Native / Expo for native iOS and Android deployment, enabling background SMS scanning (where OS permissions allow).

---
<div align="center">
  <p><i>Engineered with security-first principles to combat digital fraud at scale.</i></p>
</div>
