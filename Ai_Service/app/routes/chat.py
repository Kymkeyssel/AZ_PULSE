from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.config import settings
from app.models.requests import ChatRequest
from app.models.responses import ChatResponse
from app.agents.chat_agent import ChatAgent

security = HTTPBearer(auto_error=False)

def verify_token_optional(credentials: HTTPAuthorizationCredentials = Security(security)):
    if credentials and settings.ai_service_token:
        if credentials.credentials != settings.ai_service_token:
            raise HTTPException(status_code=403, detail="Invalid token")
    return credentials.credentials if credentials else None

router = APIRouter(prefix="/chat", tags=["Chat"])
chat_agent = ChatAgent()

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(
    request: ChatRequest,
    token: str = Depends(verify_token_optional)
):
    """Dialogue en langage naturel propulsé par Gemini avec contexte rôle et métier."""
    user_role = (request.context or {}).get("user_role") if request.context else None
    
    result = chat_agent.generate_reply(
        message=request.message,
        conversation_id=request.conversation_id,
        context=request.context,
        user_role=user_role
    )
    
    return ChatResponse(
        response=result["response"],
        conversation_id=result["conversation_id"],
        metadata=result.get("metadata", {"status": "success"})
    )
