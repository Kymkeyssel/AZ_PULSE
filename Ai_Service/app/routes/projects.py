from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import settings
from app.agents.project_agent import ProjectAgent
from app.models.requests import ProjectAnalysisRequest
from app.models.responses import ProjectAnalysisResponse

security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    if credentials.credentials != settings.ai_service_token:
        raise HTTPException(status_code=403, detail="Invalid token")
    return credentials.credentials

router = APIRouter(
    prefix="/api/v1/projects",
    tags=["projects"],
    dependencies=[Depends(verify_token)]
)

project_agent = ProjectAgent()


@router.post(
    "/analyze",
    response_model=ProjectAnalysisResponse,
)
def analyze_project(
    request: ProjectAnalysisRequest,
) -> ProjectAnalysisResponse:

    import json
    result_str = project_agent.analyze(
        project_context=request.context,
        user_question=request.question,
    )
    
    try:
        parsed_result = json.loads(result_str)
    except json.JSONDecodeError:
        parsed_result = {"analysis": result_str, "risks": [], "recommendations": []}

    return ProjectAnalysisResponse(
        status="completed",
        project_id=request.project_id,
        analysis=parsed_result.get("analysis", ""),
        risks=parsed_result.get("risks", []),
        recommendations=parsed_result.get("recommendations", [])
    )
