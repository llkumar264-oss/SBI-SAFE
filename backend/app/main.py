from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from .database import create_tables
from .routers import auth, scan, nlp, reports, fraud_map, risk
import uvicorn


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create DB tables and seed demo data
    create_tables()
    seed_demo_data()
    yield


def seed_demo_data():
    """Insert sample fraud reports for demo purposes."""
    from .database import SessionLocal, FraudReport, ScannedLink
    db = SessionLocal()
    try:
        if db.query(FraudReport).count() == 0:
            demo_reports = [
                FraudReport(
                    report_type="sms",
                    content="Dear customer, your SBI account has been blocked. Click http://sbi-verify.tk to unlock.",
                    location="Mumbai",
                    latitude=19.0760,
                    longitude=72.8777,
                    severity="high",
                    verified=True,
                    upvotes=42,
                ),
                FraudReport(
                    report_type="link",
                    content="http://hdfc-bank-login.xyz/secure — fake HDFC phishing page",
                    location="Delhi",
                    latitude=28.6139,
                    longitude=77.2090,
                    severity="high",
                    verified=True,
                    upvotes=28,
                ),
                FraudReport(
                    report_type="app",
                    content="Fake SBI YONO app on third-party store requests SMS and contact access.",
                    location="Bengaluru",
                    latitude=12.9716,
                    longitude=77.5946,
                    severity="high",
                    upvotes=15,
                ),
                FraudReport(
                    report_type="call",
                    content="Caller claiming to be RBI officer asking for ATM PIN.",
                    location="Hyderabad",
                    latitude=17.3850,
                    longitude=78.4867,
                    severity="medium",
                    upvotes=8,
                ),
                FraudReport(
                    report_type="whatsapp",
                    content="Won ₹5 lakh lottery! Click here to claim your prize: http://prize.click/win",
                    location="Chennai",
                    latitude=13.0827,
                    longitude=80.2707,
                    severity="medium",
                    upvotes=19,
                ),
            ]
            db.add_all(demo_reports)

        if db.query(ScannedLink).count() == 0:
            demo_scans = [
                ScannedLink(url="https://google.com", classification="safe", risk_score=5.0),
                ScannedLink(url="http://sbi-verify.tk/login", classification="phishing", risk_score=88.0),
                ScannedLink(url="http://free-recharge.xyz/offer", classification="phishing", risk_score=92.0),
                ScannedLink(url="https://onlinesbi.com", classification="safe", risk_score=3.0),
                ScannedLink(url="http://192.168.1.1/banking", classification="phishing", risk_score=95.0),
                ScannedLink(url="http://hdfc-offer.click/cashback", classification="suspicious", risk_score=55.0),
            ]
            db.add_all(demo_scans)

        db.commit()
    except Exception as e:
        print(f"Seeding error (non-fatal): {e}")
    finally:
        db.close()


app = FastAPI(
    title="SBI SAFE API",
    description="🛡️ AI-Powered Anti-Fraud Cybersecurity Platform for India",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(scan.router)
app.include_router(nlp.router)
app.include_router(reports.router)
app.include_router(fraud_map.router)
app.include_router(risk.router)


@app.get("/")
def root():
    return {
        "app": "SBI SAFE API",
        "version": "1.0.0",
        "status": "🟢 Online",
        "endpoints": [
            "/auth/register", "/auth/login",
            "/scan-url", "/analyze-text",
            "/report-fraud", "/fraud-map/heatmap",
            "/risk-score", "/analyze-apk", "/alerts",
            "/docs",
        ],
    }


@app.get("/health")
def health():
    return {"status": "healthy", "service": "SBI SAFE Backend"}


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
