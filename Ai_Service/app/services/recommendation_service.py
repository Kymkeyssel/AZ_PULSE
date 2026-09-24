from typing import Dict, Any, List
from app.agents.strategic_agent import StrategicAgent

class RecommendationService:
    def __init__(self):
        self.strategic_agent = StrategicAgent()

    async def get_strategic_recommendations(self, context: Dict[str, Any]) -> List[str]:
        """Generate recommendations based on project context."""
        return await self.strategic_agent.generate_recommendations(context)
