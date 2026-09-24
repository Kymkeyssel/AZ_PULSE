from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class ChatResponse(BaseModel):
    response: str
    conversation_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class AnalysisResponse(BaseModel):
    status: str
    results: Dict[str, Any]
    summary: Optional[str] = None

class ProjectResponse(BaseModel):
    project_id: str
    risk_score: Optional[float] = None
    anomalies: Optional[List[Dict[str, Any]]] = None
    recommendations: Optional[List[str]] = None

class DocumentResponse(BaseModel):
    document_id: Optional[str] = None
    extracted_data: Optional[Dict[str, Any]] = None
    summary: Optional[str] = None

class ProjectAnalysisResponse(BaseModel):
    status: str
    project_id: int
    analysis: str
    risks: list[str] = []
    recommendations: list[str] = []
    metadata: dict[str, Any] = {}
