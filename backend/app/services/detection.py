"""
SBI SAFE — AI-Powered URL & Text Fraud Detection Service
Uses keyword-based heuristics + feature extraction (ML-ready)
"""
import re
import math
import json
from urllib.parse import urlparse
from datetime import datetime

# ─── Phishing indicators ───────────────────────────────────────────────────────

PHISHING_KEYWORDS = [
    "login", "signin", "account", "verify", "update", "secure", "banking",
    "paypal", "amazon", "netflix", "microsoft", "google", "apple", "sbi",
    "hdfc", "icici", "axis", "paytm", "verify", "confirm", "urgent",
    "suspended", "blocked", "limited", "click", "free", "prize", "won",
    "congratulations", "winner", "offer", "discount", "reward", "claim",
    "otp", "kyc", "aadhar", "pan", "credit", "debit", "atm", "pin",
    "password", "credential", "security", "alert", "warning", "immediate",
    "expire", "expired", "overdue", "penalty", "fine", "tax", "refund",
    "cashback", "bonus", "gift", "voucher", "coupon", "lucky",
]

SUSPICIOUS_TLDS = [
    ".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".top", ".click",
    ".link", ".online", ".site", ".website", ".info", ".biz",
]

SAFE_DOMAINS = [
    "google.com", "youtube.com", "facebook.com", "twitter.com", "github.com",
    "wikipedia.org", "sbi.co.in", "onlinesbi.com", "rbi.org.in",
    "india.gov.in", "nic.in", "gov.in",
]

SMS_PHISHING_PATTERNS = [
    r"(your\s+account\s+(has\s+been\s+)?(suspended|blocked|limited))",
    r"(click\s+(?:here|now|immediately))",
    r"(urgent\s*[:\-])",
    r"(otp\s*(is|:)\s*\d{4,8})",
    r"(won\s+(?:a\s+)?(?:prize|lottery|iphone|car|cash))",
    r"(verify\s+(?:your\s+)?(?:account|kyc|identity|aadhar|pan))",
    r"(free\s+(?:recharge|data|gift|voucher))",
    r"((?:rs|inr|₹)\s*\d+[\.,]?\d*\s*(?:cashback|reward|bonus))",
    r"(limited\s+(?:time\s+)?offer)",
    r"(dear\s+(?:customer|user|sbi|hdfc|icici))",
]


# ─── Feature Extraction ────────────────────────────────────────────────────────

def extract_url_features(url: str) -> dict:
    """Extract numerical and categorical features from a URL."""
    try:
        parsed = urlparse(url if url.startswith(("http://", "https://")) else "http://" + url)
    except Exception:
        return {}

    domain = parsed.netloc.lower()
    path = parsed.path.lower()
    full_url = url.lower()

    # Basic metrics
    url_length = len(url)
    num_dots = url.count(".")
    num_hyphens = url.count("-")
    num_digits = sum(c.isdigit() for c in domain)
    num_special = sum(c in "@#%&=+?$" for c in url)
    has_ip = bool(re.match(r"\d{1,3}(\.\d{1,3}){3}", domain))
    has_https = url.startswith("https://")
    has_port = bool(parsed.port)
    path_depth = len([p for p in parsed.path.split("/") if p])

    # Keyword analysis
    keyword_hits = [kw for kw in PHISHING_KEYWORDS if kw in full_url]
    keyword_score = len(keyword_hits)

    # TLD check
    suspicious_tld = any(domain.endswith(tld) for tld in SUSPICIOUS_TLDS)

    # Safe domain check
    is_safe_domain = any(sd in domain for sd in SAFE_DOMAINS)

    # Subdomain count
    parts = domain.split(".")
    subdomain_count = max(0, len(parts) - 2)

    # Entropy (randomness) of domain
    def entropy(s):
        if not s:
            return 0
        freq = {c: s.count(c) / len(s) for c in set(s)}
        return -sum(p * math.log2(p) for p in freq.values())

    domain_entropy = entropy(parts[0] if parts else domain)

    return {
        "url_length": url_length,
        "num_dots": num_dots,
        "num_hyphens": num_hyphens,
        "num_digits": num_digits,
        "num_special": num_special,
        "has_ip": has_ip,
        "has_https": has_https,
        "has_port": has_port,
        "path_depth": path_depth,
        "keyword_score": keyword_score,
        "keyword_hits": keyword_hits[:5],
        "suspicious_tld": suspicious_tld,
        "is_safe_domain": is_safe_domain,
        "subdomain_count": subdomain_count,
        "domain_entropy": round(domain_entropy, 3),
        "domain": domain,
    }


def calculate_url_risk(features: dict) -> tuple[float, str, list]:
    """
    Compute a 0–100 risk score and classification.
    Returns (score, classification, reasons)
    """
    if not features:
        return 75.0, "suspicious", ["Could not parse URL"]

    score = 0.0
    reasons = []

    # Instant safe check
    if features.get("is_safe_domain"):
        return 5.0, "safe", ["Trusted domain"]

    # Instant high-risk: IP address as hostname
    if features.get("has_ip"):
        score += 40
        reasons.append("IP address used as domain")

    # URL length
    length = features.get("url_length", 0)
    if length > 100:
        score += 15
        reasons.append(f"Very long URL ({length} chars)")
    elif length > 75:
        score += 8

    # HTTPS penalty
    if not features.get("has_https"):
        score += 10
        reasons.append("No HTTPS encryption")

    # Suspicious TLD
    if features.get("suspicious_tld"):
        score += 20
        reasons.append("Suspicious top-level domain")

    # Keyword hits
    kw_score = features.get("keyword_score", 0)
    if kw_score >= 4:
        score += 25
        reasons.append(f"Multiple phishing keywords ({kw_score})")
    elif kw_score >= 2:
        score += 15
        reasons.append(f"Phishing keywords detected ({kw_score})")
    elif kw_score == 1:
        score += 5

    # Domain features
    if features.get("num_hyphens", 0) >= 3:
        score += 10
        reasons.append("Multiple hyphens in domain")

    if features.get("subdomain_count", 0) >= 3:
        score += 10
        reasons.append("Excessive subdomains")

    if features.get("domain_entropy", 0) > 3.8:
        score += 10
        reasons.append("High domain randomness (possible DGA)")

    if features.get("has_port"):
        score += 5
        reasons.append("Non-standard port detected")

    score = min(100.0, score)

    if score >= 65:
        classification = "phishing"
    elif score >= 35:
        classification = "suspicious"
    else:
        classification = "safe"

    return round(score, 1), classification, reasons


def analyze_text_for_phishing(text: str) -> dict:
    """Analyze SMS/message text for phishing signals."""
    text_lower = text.lower()
    matched_patterns = []
    urls = re.findall(r'https?://[^\s]+|www\.[^\s]+', text_lower)

    for pattern in SMS_PHISHING_PATTERNS:
        if re.search(pattern, text_lower, re.IGNORECASE):
            matched_patterns.append(pattern)

    keyword_hits = [kw for kw in PHISHING_KEYWORDS if kw in text_lower]
    has_url = len(urls) > 0
    is_short = len(text) < 100

    # Score calculation
    score = 0
    reasons = []

    score += len(matched_patterns) * 20
    if matched_patterns:
        reasons.append(f"{len(matched_patterns)} phishing pattern(s) matched")

    score += len(keyword_hits) * 5
    if len(keyword_hits) >= 3:
        reasons.append(f"Multiple fraud keywords: {', '.join(keyword_hits[:3])}")

    if has_url:
        score += 15
        reasons.append(f"Contains URL(s): {urls[:2]}")

    score = min(100, score)

    if score >= 60:
        classification = "phishing"
    elif score >= 30:
        classification = "suspicious"
    else:
        classification = "safe"

    return {
        "text": text[:200],
        "classification": classification,
        "risk_score": round(score, 1),
        "reasons": reasons,
        "patterns_matched": len(matched_patterns),
        "keyword_hits": keyword_hits[:5],
        "urls_found": urls[:3],
        "analyzed_at": datetime.utcnow().isoformat(),
    }


def compute_behavioral_risk(actions: list) -> dict:
    """Mock behavioral risk engine."""
    RISKY_ACTIONS = {
        "clicked_unknown_link": 20,
        "entered_otp_on_unknown_site": 40,
        "downloaded_apk_unknown_source": 35,
        "granted_sms_permission": 15,
        "multiple_failed_logins": 25,
        "accessed_banking_on_http": 30,
    }

    total_score = 0
    breakdown = {}
    for action in actions:
        weight = RISKY_ACTIONS.get(action, 5)
        breakdown[action] = weight
        total_score += weight

    total_score = min(100, total_score)

    return {
        "behavioral_score": round(total_score, 1),
        "breakdown": breakdown,
        "risk_level": "high" if total_score >= 60 else ("medium" if total_score >= 30 else "low"),
    }


def analyze_apk_permissions(permissions: list) -> dict:
    """Flag suspicious Android app permissions."""
    DANGEROUS_PERMISSIONS = {
        "READ_SMS": ("Reads your SMS messages", "high"),
        "SEND_SMS": ("Can send SMS without consent", "high"),
        "RECEIVE_SMS": ("Intercepts incoming SMS/OTP", "critical"),
        "READ_CALL_LOG": ("Accesses call history", "medium"),
        "RECORD_AUDIO": ("Can record microphone", "high"),
        "READ_CONTACTS": ("Reads your contact list", "medium"),
        "ACCESS_FINE_LOCATION": ("Tracks precise location", "medium"),
        "READ_PHONE_STATE": ("Accesses device & call info", "medium"),
        "CAMERA": ("Can take photos/videos", "medium"),
        "PROCESS_OUTGOING_CALLS": ("Intercepts outgoing calls", "high"),
        "BIND_DEVICE_ADMIN": ("Device admin privileges", "critical"),
        "INSTALL_PACKAGES": ("Can install other apps", "critical"),
        "WRITE_SETTINGS": ("Modifies system settings", "high"),
    }

    flagged = []
    score = 0

    for perm in permissions:
        perm_upper = perm.replace("android.permission.", "").upper()
        if perm_upper in DANGEROUS_PERMISSIONS:
            desc, severity = DANGEROUS_PERMISSIONS[perm_upper]
            weights = {"critical": 30, "high": 20, "medium": 10}
            score += weights.get(severity, 5)
            flagged.append({"permission": perm_upper, "description": desc, "severity": severity})

    score = min(100, score)

    return {
        "total_permissions": len(permissions),
        "flagged_count": len(flagged),
        "flagged_permissions": flagged,
        "risk_score": round(score, 1),
        "verdict": "dangerous" if score >= 60 else ("suspicious" if score >= 30 else "safe"),
    }
