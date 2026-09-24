from fastapi import APIRouter
from app.models.requests import AnalysisRequest
from app.models.responses import AnalysisResponse
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analysis", tags=["Analysis"])
analytics_service = AnalyticsService()

@router.post("/", response_model=AnalysisResponse)
async def analyze_endpoint(request: AnalysisRequest):
    """Run data analysis."""
    data = request.data or {}
    results = await analytics_service.compute_analytics(data)
    return AnalysisResponse(
        status="success",
        results=results,
        summary="Analysis completed successfully."
    )
