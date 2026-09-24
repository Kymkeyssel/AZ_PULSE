from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

class AnalysisRequest(BaseModel):
    project_id: Optional[str] = None
    data: Optional[Dict[str, Any]] = None
    metrics: Optional[List[str]] = None

class ProjectAnalysisRequest(BaseModel):
    project_id: int
    question: str = Field(min_length=3)
    context: dict[str, Any]

class DocumentAnalysisRequest(BaseModel):
    document_id: Optional[str] = None
    content: Optional[str] = None
    file_type: Optional[str] = None
