from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db, FraudReport
import random

router = APIRouter(prefix="/fraud-map", tags=["Fraud Map"])

# Mock heatmap seed data (India-centric coordinates)
MOCK_FRAUD_POINTS = [
    {"lat": 28.6139, "lng": 77.2090, "city": "New Delhi", "count": 45, "type": "phishing"},
    {"lat": 19.0760, "lng": 72.8777, "city": "Mumbai", "count": 67, "type": "sms_fraud"},
    {"lat": 12.9716, "lng": 77.5946, "city": "Bengaluru", "count": 38, "type": "fake_app"},
    {"lat": 22.5726, "lng": 88.3639, "city": "Kolkata", "count": 29, "type": "phishing"},
    {"lat": 17.3850, "lng": 78.4867, "city": "Hyderabad", "count": 52, "type": "sms_fraud"},
    {"lat": 13.0827, "lng": 80.2707, "city": "Chennai", "count": 41, "type": "phishing"},
    {"lat": 23.0225, "lng": 72.5714, "city": "Ahmedabad", "count": 33, "type": "fake_app"},
    {"lat": 26.8467, "lng": 80.9462, "city": "Lucknow", "count": 27, "type": "sms_fraud"},
    {"lat": 18.5204, "lng": 73.8567, "city": "Pune", "count": 44, "type": "phishing"},
    {"lat": 26.9124, "lng": 75.7873, "city": "Jaipur", "count": 22, "type": "fake_app"},
    {"lat": 21.1458, "lng": 79.0882, "city": "Nagpur", "count": 18, "type": "sms_fraud"},
    {"lat": 30.7333, "lng": 76.7794, "city": "Chandigarh", "count": 15, "type": "phishing"},
    {"lat": 25.5941, "lng": 85.1376, "city": "Patna", "count": 31, "type": "sms_fraud"},
    {"lat": 23.2599, "lng": 77.4126, "city": "Bhopal", "count": 20, "type": "fake_app"},
    {"lat": 8.5241, "lng": 76.9366, "city": "Thiruvananthapuram", "count": 16, "type": "phishing"},
]


@router.get("/heatmap")
def get_fraud_heatmap(db: Session = Depends(get_db)):
    """Return fraud heatmap data combining DB reports + mock seed data."""
    db_reports = (
        db.query(FraudReport)
        .filter(FraudReport.latitude.isnot(None))
        .all()
    )

    points = list(MOCK_FRAUD_POINTS)  # Always include seed data

    for r in db_reports:
        points.append({
            "lat": r.latitude,
            "lng": r.longitude,
            "city": r.location or "Unknown",
            "count": 1 + r.upvotes,
            "type": r.report_type,
            "severity": r.severity,
        })

    return {
        "total_points": len(points),
        "fraud_hotspots": points,
        "last_updated": "2026-04-27T06:00:00Z",
    }


@router.get("/stats")
def fraud_map_stats(db: Session = Depends(get_db)):
    total = db.query(FraudReport).count()
    high = db.query(FraudReport).filter(FraudReport.severity == "high").count()
    today = db.query(FraudReport).count()  # simplified

    return {
        "total_reports": total + len(MOCK_FRAUD_POINTS),
        "high_risk_areas": high + 5,
        "cities_affected": 15,
        "most_common_type": "SMS Fraud",
        "hottest_city": "Mumbai",
    }
