from fastapi import APIRouter, File, UploadFile
from app.models.requests import DocumentAnalysisRequest
from app.models.responses import DocumentResponse
from app.agents.document_agent import DocumentAgent
import io

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

@router.post("/extract")
async def extract_from_file(file: UploadFile = File(...)):
    """Simule un OCR et extrait le texte d'un fichier uploadé, puis l'analyse."""
    content = await file.read()
    
    # Dans un vrai scénario de prod, on appellerait Tesseract ou Textract ici
    # Pour le MVP, on simule l'extraction de texte (surtout si c'est un txt/pdf simple)
    # ou on demande au LLM s'il a des capacités Vision (gemini-pro-vision)
    
    try:
        text_content = content.decode('utf-8')
    except UnicodeDecodeError:
        text_content = f"[Fichier Binaire : {file.filename}] Extraction simulée du texte."
        
    result = await document_agent.process_document(
        document_id=file.filename,
        content=text_content
    )
    
    return {
        "success": True,
        "filename": file.filename,
        "summary": result.get("summary"),
        "entities": result.get("entities")
    }
