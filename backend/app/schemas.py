from pydantic import BaseModel, EmailStr, HttpUrl
from typing import Optional, List
from datetime import datetime


# ─── Auth Schemas ───────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    username: str
    email: str


# ─── URL Scan Schemas ───────────────────────────────────────────────────────────

class URLScanRequest(BaseModel):
    url: str


class URLScanResponse(BaseModel):
    url: str
    classification: str    # safe / suspicious / phishing
    risk_score: float
    reasons: List[str]
    features: dict
    scanned_at: str


# ─── Text Analysis Schemas ──────────────────────────────────────────────────────

class TextAnalysisRequest(BaseModel):
    text: str


class TextAnalysisResponse(BaseModel):
    classification: str
    risk_score: float
    reasons: List[str]
    keyword_hits: List[str]
    urls_found: List[str]
    analyzed_at: str


# ─── Fraud Report Schemas ───────────────────────────────────────────────────────

class FraudReportCreate(BaseModel):
    report_type: str        # sms / link / app / call
    content: str
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    severity: Optional[str] = "medium"


class FraudReportResponse(BaseModel):
    id: int
    report_type: str
    content: str
    location: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    severity: str
    verified: bool
    reported_at: str
    upvotes: int


# ─── APK Analyzer Schemas ───────────────────────────────────────────────────────

class APKAnalyzeRequest(BaseModel):
    app_name: str
    package_name: str
    permissions: List[str]
    source: Optional[str] = "unknown"   # play_store / apk_file / unknown


class APKAnalyzeResponse(BaseModel):
    app_name: str
    package_name: str
    total_permissions: int
    flagged_count: int
    flagged_permissions: List[dict]
    risk_score: float
    verdict: str


# ─── Risk Score Schemas ─────────────────────────────────────────────────────────

class RiskScoreRequest(BaseModel):
    user_id: Optional[int] = None
    actions: Optional[List[str]] = []
    recent_scan_score: Optional[float] = 0.0
    reported_count: Optional[int] = 0


class RiskScoreResponse(BaseModel):
    overall_risk_score: float
    risk_level: str
    behavioral_score: float
    breakdown: dict
    recommendations: List[str]
