from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.chat import router as chat_router
from app.routes.analysis import router as analysis_router
from app.routes.projects import router as projects_router
from app.routes.documents import router as documents_router
from app.config import settings

app = FastAPI(
    title="AZ Pulse - AI Service",
    description=(
        "Service IA d'AZ PULSE : orchestration d'agents, appel du fournisseur de "
        "modèle, OCR, scoring et traitements spécialisés."
    ),
    version="1.0.0",
)

# CORS
# Ce service n'est jamais appelé depuis un navigateur : seul Symfony l'appelle
# (React -> Symfony -> FastAPI, §9). On n'autorise donc que les origines
# explicitement configurées, et jamais "*" combiné à allow_credentials, qui est
# refusé par les navigateurs et qui exposerait le service à tout site tiers.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8000"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)

# Routers
app.include_router(chat_router)
app.include_router(analysis_router)
app.include_router(projects_router)
app.include_router(documents_router)


@app.get("/")
async def root():
    return {
        "service": "AZ Pulse AI Service",
        "status": "online",
        "env": settings.app_env,
        "provider": settings.active_provider,
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "az-pulse-ai",
    }
