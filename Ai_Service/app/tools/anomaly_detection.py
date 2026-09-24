from typing import List, Dict, Any

class AnomalyDetector:
    @staticmethod
    def detect(metrics_history: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Detect anomalies in project metrics history.
        """
        anomalies = []
        for entry in metrics_history:
            metric_name = entry.get("metric_name")
            value = entry.get("value", 0)
            threshold = entry.get("threshold", 100)

            if value > threshold:
                anomalies.append({
                    "metric": metric_name,
                    "value": value,
                    "threshold": threshold,
                    "severity": "high" if value > threshold * 1.5 else "medium"
                })
        return anomalies
