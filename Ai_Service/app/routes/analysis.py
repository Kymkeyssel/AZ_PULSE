from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import settings
from app.models.requests import AnalysisRequest
from app.models.responses import AnalysisResponse
from app.agents.analytics_agent import AnalyticsAgent
from app.agents.strategic_agent import StrategicAgent
from typing import Dict, Any

security = HTTPBearer(auto_error=False)

def verify_token_optional(credentials: HTTPAuthorizationCredentials = Security(security)):
    if credentials and settings.ai_service_token:
        if credentials.credentials != settings.ai_service_token:
            raise HTTPException(status_code=403, detail="Invalid token")
    return credentials.credentials if credentials else None

router = APIRouter(prefix="/analysis", tags=["Analysis"])
analytics_agent = AnalyticsAgent()
strategic_agent = StrategicAgent()

@router.post("/", response_model=AnalysisResponse)
async def analyze_endpoint(
    request: AnalysisRequest,
    token: str = Depends(verify_token_optional)
):
    """Analyse multidimensionnelle et détection d'insights réels propulsée par Gemini."""
    data = request.data or {}
    scope = (data.get("scope") or "general")
    
    analytics_results = await analytics_agent.analyze_metrics(data, scope=scope)
    recommendations = await strategic_agent.generate_recommendations(
        context={"metrics": analytics_results, "source_data": data},
        objective=f"Optimisation {scope}"
    )
    
    analytics_results["strategic_recommendations"] = recommendations
    
    summary_text = (
        f"Analyse IA effectuée sur {analytics_results.get('metrics_evaluated', 0)} indicateurs. "
        f"Score global : {analytics_results.get('score', 0)}/100. "
        f"Tendance : {analytics_results.get('trends', 'N/A')}."
    )

    return AnalysisResponse(
        status="success",
        results=analytics_results,
        summary=summary_text
    )

@router.post("/recommendations")
async def recommendations_endpoint(
    data: Dict[str, Any],
    token: str = Depends(verify_token_optional)
):
    """Génération directe de recommandations stratégiques et opérationnelles."""
    scope = data.get("scope", "CRM & Opérations")
    recommendations = await strategic_agent.generate_recommendations(
        context=data,
        objective=scope
    )
    return {
        "status": "success",
        "scope": scope,
        "recommendations": recommendations
    }
