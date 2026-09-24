from typing import Dict, Any

class RiskScoreCalculator:
    @staticmethod
    def calculate(project_data: Dict[str, Any]) -> float:
        """
        Calculate a composite risk score based on project metrics.
        Returns a score between 0.0 (low risk) and 1.0 (high risk).
        """
        # Baseline calculation logic
        score = 0.0
        budget_variance = project_data.get("budget_variance", 0.0)
        delay_days = project_data.get("delay_days", 0)
        task_completion_rate = project_data.get("task_completion_rate", 1.0)

        if budget_variance > 0.2:
            score += 0.4
        elif budget_variance > 0.1:
            score += 0.2

        if delay_days > 15:
            score += 0.4
        elif delay_days > 5:
            score += 0.2

        if task_completion_rate < 0.5:
            score += 0.2

        return min(round(score, 2), 1.0)
