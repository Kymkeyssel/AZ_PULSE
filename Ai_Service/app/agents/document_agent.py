from typing import Dict, Any, Optional
import json
from app.services.llm_service import LLMService

class DocumentAgent:
    def __init__(self):
        self.llm = LLMService()

    async def process_document(self, document_id: Optional[str] = None, content: Optional[str] = None) -> Dict[str, Any]:
        """Process and extract key information from documents using LLM."""
        if not content:
            return {
                "document_id": document_id,
                "summary": "Aucun contenu fourni.",
                "entities": []
            }
            
        prompt = f"""
Tu es l'agent documentaire d'AZ PULSE. Analyse le document suivant et extrais les informations clés.
Identifie le type de document (ex: Facture, Devis, Justificatif d'absence, Rapport) et extrais les entités pertinentes (Montants, Dates, Noms).

Contenu du document :
{content[:4000]}  # Limite le contenu pour éviter de surcharger le contexte
"""
        schema = {
            "type": "OBJECT",
            "properties": {
                "summary": {"type": "STRING", "description": "Résumé court du document et de son objectif"},
                "entities": {
                    "type": "ARRAY", 
                    "items": {
                        "type": "OBJECT",
                        "properties": {
                            "type": {"type": "STRING", "description": "Type d'entité (ex: Montant, Date, Personne)"},
                            "value": {"type": "STRING", "description": "Valeur de l'entité extraite"}
                        }
                    },
                    "description": "Liste des entités extraites"
                }
            },
            "required": ["summary", "entities"]
        }
        
        try:
            # L'appel à generate est synchrone dans LLMService actuellement
            result_str = self.llm.generate(prompt, response_schema=schema)
            # Puisque le LLM renvoie une string JSON (selon LLMService), on la parse
            try:
                parsed = json.loads(result_str)
                return {
                    "document_id": document_id,
                    "summary": parsed.get("summary", "Résumé non disponible."),
                    "entities": parsed.get("entities", [])
                }
            except json.JSONDecodeError:
                return {
                    "document_id": document_id,
                    "summary": result_str,
                    "entities": []
                }
        except Exception as e:
             return {
                "document_id": document_id,
                "summary": f"Erreur lors de l'analyse : {str(e)}",
                "entities": []
            }
