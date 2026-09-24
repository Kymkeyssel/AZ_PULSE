from fastapi import APIRouter
from app.models.requests import DocumentAnalysisRequest
from app.models.responses import DocumentResponse
from app.agents.document_agent import DocumentAgent

router = APIRouter(prefix="/documents", tags=["Documents"])
document_agent = DocumentAgent()

@router.post("/process", response_model=DocumentResponse)
async def process_document(request: DocumentAnalysisRequest):
    """Process a document and return extracted information."""
    result = await document_agent.process_document(
        document_id=request.document_id,
        content=request.content
    )
    return DocumentResponse(
        document_id=result.get("document_id"),
        extracted_data=result.get("entities"),
        summary=result.get("summary")
    )
