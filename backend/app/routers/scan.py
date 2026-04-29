from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
import json
from ..database import get_db, ScannedLink
from ..schemas import URLScanRequest, URLScanResponse
from ..services.detection import extract_url_features, calculate_url_risk

router = APIRouter(prefix="/scan-url", tags=["URL Scanner"])


@router.post("", response_model=URLScanResponse)
def scan_url(request: URLScanRequest, db: Session = Depends(get_db)):
    url = request.url.strip()
    features = extract_url_features(url)
    risk_score, classification, reasons = calculate_url_risk(features)

    # Persist to DB
    record = ScannedLink(
        url=url,
        classification=classification,
        risk_score=risk_score,
        features=json.dumps(features),
    )
    db.add(record)
    db.commit()

    return URLScanResponse(
        url=url,
        classification=classification,
        risk_score=risk_score,
        reasons=reasons,
        features=features,
        scanned_at=datetime.utcnow().isoformat(),
    )


@router.get("/history")
def scan_history(limit: int = 20, db: Session = Depends(get_db)):
    records = db.query(ScannedLink).order_by(ScannedLink.scanned_at.desc()).limit(limit).all()
    return [
        {
            "id": r.id,
            "url": r.url,
            "classification": r.classification,
            "risk_score": r.risk_score,
            "scanned_at": r.scanned_at.isoformat(),
        }
        for r in records
    ]


@router.get("/stats")
def scan_stats(db: Session = Depends(get_db)):
    total = db.query(ScannedLink).count()
    phishing = db.query(ScannedLink).filter(ScannedLink.classification == "phishing").count()
    suspicious = db.query(ScannedLink).filter(ScannedLink.classification == "suspicious").count()
    safe = db.query(ScannedLink).filter(ScannedLink.classification == "safe").count()
    return {
        "total_scanned": total,
        "phishing_detected": phishing,
        "suspicious_detected": suspicious,
        "safe_detected": safe,
        "protection_rate": round((safe / total * 100) if total > 0 else 100, 1),
    }
