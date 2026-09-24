from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.chat import router as chat_router
from app.routes.analysis import router as analysis_router
from app.routes.projects import router as projects_router
from app.routes.documents import router as documents_router
from app.config import settings

app = FastAPI(
    title="AZ Pulse - AI Service",
    description="AI service powering intelligent analysis, recommendations, and agents for AZ Pulse",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(chat_router)
app.include_router(analysis_router)
app.include_router(projects_router)
app.include_router(documents_router)

@app.get("/")
async def root():
    return {
        "service": "AZ Pulse AI Service",
        "status": "online",
        "env": settings.app_env
    }

@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "az-pulse-ai",
    }
