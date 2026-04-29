from fastapi import APIRouter
from ..schemas import RiskScoreRequest, RiskScoreResponse, APKAnalyzeRequest, APKAnalyzeResponse
from ..services.detection import compute_behavioral_risk, analyze_apk_permissions

router = APIRouter(tags=["Risk & APK"])


@router.post("/risk-score", response_model=RiskScoreResponse)
def compute_risk_score(request: RiskScoreRequest):
    behavioral = compute_behavioral_risk(request.actions or [])
    b_score = behavioral["behavioral_score"]
    scan_score = request.recent_scan_score or 0.0
    report_bonus = min(20, (request.reported_count or 0) * 5)

    overall = round((b_score * 0.4) + (scan_score * 0.4) + (report_bonus * 0.2), 1)
    overall = min(100, overall)

    level = "high" if overall >= 60 else ("medium" if overall >= 30 else "low")

    recommendations = []
    if b_score > 40:
        recommendations.append("Avoid clicking unknown links from SMS or WhatsApp.")
    if scan_score > 50:
        recommendations.append("Recent scans show high-risk URLs. Exercise caution.")
    if overall < 20:
        recommendations.append("Your device security looks good. Keep it up!")
    if not recommendations:
        recommendations.append("Enable two-factor authentication on banking apps.")

    return RiskScoreResponse(
        overall_risk_score=overall,
        risk_level=level,
        behavioral_score=b_score,
        breakdown=behavioral["breakdown"],
        recommendations=recommendations,
    )


@router.post("/analyze-apk", response_model=APKAnalyzeResponse)
def analyze_apk(request: APKAnalyzeRequest):
    result = analyze_apk_permissions(request.permissions)
    return APKAnalyzeResponse(
        app_name=request.app_name,
        package_name=request.package_name,
        total_permissions=result["total_permissions"],
        flagged_count=result["flagged_count"],
        flagged_permissions=result["flagged_permissions"],
        risk_score=result["risk_score"],
        verdict=result["verdict"],
    )


@router.get("/alerts")
def get_alerts():
    """Mock real-time alert feed."""
    return {
        "alerts": [
            {
                "id": 1,
                "title": "⚠️ Phishing SMS Detected",
                "message": "A message pretending to be SBI was blocked.",
                "severity": "high",
                "time": "2 mins ago",
                "type": "sms",
            },
            {
                "id": 2,
                "title": "🔴 Suspicious URL Blocked",
                "message": "http://sbi-login.tk was flagged as phishing.",
                "severity": "high",
                "time": "15 mins ago",
                "type": "link",
            },
            {
                "id": 3,
                "title": "🟡 Risky App Permission",
                "message": "An app requested SMS read access.",
                "severity": "medium",
                "time": "1 hour ago",
                "type": "app",
            },
            {
                "id": 4,
                "title": "✅ System Scan Complete",
                "message": "No threats found in last scheduled scan.",
                "severity": "low",
                "time": "3 hours ago",
                "type": "system",
            },
        ]
    }
