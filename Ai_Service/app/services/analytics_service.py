from typing import Dict, Any, List
from app.agents.analytics_agent import AnalyticsAgent

class AnalyticsService:
    def __init__(self):
        self.analytics_agent = AnalyticsAgent()

    async def compute_analytics(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Compute advanced analytics on input data."""
        return await self.analytics_agent.analyze_metrics(data)
