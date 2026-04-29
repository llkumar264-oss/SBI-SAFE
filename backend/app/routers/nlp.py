from fastapi import APIRouter
from ..schemas import TextAnalysisRequest, TextAnalysisResponse
from ..services.detection import analyze_text_for_phishing

router = APIRouter(prefix="/analyze-text", tags=["Text Analysis"])


@router.post("", response_model=TextAnalysisResponse)
def analyze_text(request: TextAnalysisRequest):
    result = analyze_text_for_phishing(request.text)
    return TextAnalysisResponse(
        classification=result["classification"],
        risk_score=result["risk_score"],
        reasons=result["reasons"],
        keyword_hits=result["keyword_hits"],
        urls_found=result["urls_found"],
        analyzed_at=result["analyzed_at"],
    )
