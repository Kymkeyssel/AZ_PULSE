import json
from app.services.llm_service import LLMService
from app.models.responses import ProjectAnalysisResponse

class ProjectAgent:
    def __init__(self) -> None:
        self.llm = LLMService()

    def analyze(self, project_context: dict, user_question: str) -> str:
        prompt = f"""
Tu es l'agent d'analyse de projets d'AZ PULSE.

Analyse uniquement les données fournies.

Projet :
{project_context}

Question :
{user_question}

Génère une analyse détaillée selon la structure demandée. Ne crée aucune information absente des données.
Ne prétends jamais avoir accès à une donnée qui n'est pas fournie.
"""
        # Demander à l'IA de sortir directement au format du modèle de réponse (en omettant les champs techniques comme project_id et status)
        schema = {
            "type": "OBJECT",
            "properties": {
                "analysis": {"type": "STRING", "description": "Résumé et constats de l'analyse"},
                "risks": {"type": "ARRAY", "items": {"type": "STRING"}, "description": "Liste des risques identifiés"},
                "recommendations": {"type": "ARRAY", "items": {"type": "STRING"}, "description": "Liste des recommandations stratégiques"}
            },
            "required": ["analysis", "risks", "recommendations"]
        }
        
        result_str = self.llm.generate(prompt, response_schema=schema)
        return result_str
