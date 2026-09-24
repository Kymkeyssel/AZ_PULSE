from typing import Dict, Any
from app.agents.project_agent import ProjectAgent
from app.tools.risk_score import RiskScoreCalculator
from app.tools.anomaly_detection import AnomalyDetector
from app.tools.symfony_api import SymfonyApiClient

class ProjectService:
    def __init__(self):
        self.project_agent = ProjectAgent()
        self.risk_calculator = RiskScoreCalculator()
        self.anomaly_detector = AnomalyDetector()
        self.symfony_client = SymfonyApiClient()

    async def get_project_analysis(self, project_id: str) -> Dict[str, Any]:
        """Analyze a project by aggregating agent and tool insights."""
        agent_results = await self.project_agent.analyze(project_id)
        
        # Default mock / calculation
        risk = self.risk_calculator.calculate({"budget_variance": 0.15, "delay_days": 6})
        anomalies = self.anomaly_detector.detect([
            {"metric_name": "task_delay", "value": 8, "threshold": 5}
        ])

        return {
            "project_id": project_id,
            "risk_score": risk,
            "anomalies": anomalies,
            "insights": agent_results.get("insights", [])
        }
