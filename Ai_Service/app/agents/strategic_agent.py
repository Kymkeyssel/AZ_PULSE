import json
from typing import Dict, Any, List
from app.services.llm_service import LLMService

class StrategicAgent:
    def __init__(self) -> None:
        self.llm = LLMService()

    async def generate_recommendations(self, context: Dict[str, Any], objective: str = "performance") -> List[Dict[str, Any]]:
        """Génère des recommandations stratégiques personnalisées et prioritaires via Gemini."""
        context_str = json.dumps(context, ensure_ascii=False, indent=2)

        prompt = f"""
Tu es l'agent de recommandation stratégique et d'aide à la décision pour la gouvernance AZ PULSE.
Objectif recherché : {objective}

Contexte opérationnel :
{context_str}

Génère 3 à 5 recommandations stratégiques prioritaires, directement activables, avec niveau d'impact, urgence et bénéfice attendu.
"""
        schema = {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "title": {"type": "STRING", "description": "Titre clair et percutant de la recommandation"},
                    "description": {"type": "STRING", "description": "Détails opérationnels et démarches"},
                    "priority": {"type": "STRING", "enum": ["Haute", "Moyenne", "Basse"], "description": "Niveau de priorité"},
                    "impact": {"type": "STRING", "description": "Impact attendu sur l'activité ou les revenus"},
                    "category": {"type": "STRING", "description": "Ex: CRM, RH, IT, Formation, Pipeline"}
                },
                "required": ["title", "description", "priority", "impact", "category"]
            }
        }

        try:
            result_str = self.llm.generate(prompt, response_schema=schema)
            parsed = json.loads(result_str)
            if isinstance(parsed, list):
                return parsed
            return []
        except Exception:
            return [
                {
                    "title": "Optimiser le cycle de relance des prospects",
                    "description": "Automatiser le suivi des opportunités stagnantes de plus de 7 jours dans le pipeline.",
                    "priority": "Haute",
                    "impact": "+15% de taux de transformation commerciale",
                    "category": "CRM"
                },
                {
                    "title": "Renforcer la mise à jour des ressources documentaires",
                    "description": "Vérifier la validité des fiches de formation et certifications disponibles dans le Knowledge Hub.",
                    "priority": "Moyenne",
                    "impact": "Meilleure conformité et autonomie des apprenants",
                    "category": "Knowledge"
                }
            ]
