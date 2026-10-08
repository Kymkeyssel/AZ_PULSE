from typing import Optional, Any
from google import genai
from pydantic import BaseModel

from app.config import settings


class LLMService:
    def __init__(self) -> None:
        self.client = genai.Client(
            api_key=settings.gemini_api_key
        )

    def generate(self, prompt: str, response_schema: Optional[Any] = None) -> str:
        config = {}
        if response_schema:
            config['response_mime_type'] = 'application/json'
            config['response_schema'] = response_schema
            
        try:
            response = self.client.models.generate_content(
                model=settings.gemini_model,
                contents=prompt,
                config=config if config else None
            )
            return response.text or ""
        except Exception as e:
            # Fallback structuré si Gemini retourne une erreur (quota, connexion, etc.)
            if response_schema:
                import json
                return json.dumps({
                    "status": "failed",
                    "analysis": f"Diagnostic interrompu : le service IA Gemini est temporairement indisponible ({str(e)}).",
                    "risks": ["Indisponibilité temporaire de l'API Gemini ou quota de clés atteint."],
                    "recommendations": ["Vérifier la clé GEMINI_API_KEY et la connectivité au service Gemini."]
                })
            raise RuntimeError(f"Erreur du service LLM: {str(e)}")
