from fastapi import APIRouter
from app.models.requests import ChatRequest
from app.models.responses import ChatResponse

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Handle chat messages with AI assistants."""
    return ChatResponse(
        response=f"Received: {request.message}",
        conversation_id=request.conversation_id or "default-session",
        metadata={"status": "success"}
    )
