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
            
        response = self.client.models.generate_content(
            model=settings.gemini_model,
            contents=prompt,
            config=config if config else None
        )

        return response.text or ""
