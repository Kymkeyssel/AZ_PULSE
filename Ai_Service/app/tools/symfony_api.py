import httpx
from typing import Dict, Any, Optional
from app.config import settings

class SymfonyApiClient:
    def __init__(self, base_url: Optional[str] = None, api_key: Optional[str] = None):
        self.base_url = base_url or settings.SYMFONY_API_BASE_URL
        self.api_key = api_key or settings.SYMFONY_API_KEY
        self.headers = {
            "Authorization": f"Bearer {self.api_key}" if self.api_key else "",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

    async def get_project(self, project_id: str) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/projects/{project_id}",
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()

    async def get_project_metrics(self, project_id: str) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/projects/{project_id}/metrics",
                headers=self.headers
            )
            response.raise_for_status()
            return response.json()
