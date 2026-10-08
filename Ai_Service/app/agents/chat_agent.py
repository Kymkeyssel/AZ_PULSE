import json
from typing import Optional, Dict, Any
from app.services.llm_service import LLMService

class ChatAgent:
    def __init__(self) -> None:
        self.llm = LLMService()

    def generate_reply(
        self,
        message: str,
        conversation_id: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None,
        user_role: Optional[str] = None
    ) -> Dict[str, Any]:
        """Génère une réponse intelligente adaptée au contexte métier AZ PULSE."""
        role_label = user_role or "Collaborateur / Utilisateur"
        context_str = json.dumps(context or {}, ensure_ascii=False, indent=2)

        prompt = f"""
Tu es l'assistant IA conversationnel et décisionnel de la plateforme d'entreprise AZ PULSE.
Ton rôle est d'accompagner l'utilisateur avec professionnalisme, pertinence et précision.

Profil de l'interlocuteur :
- Rôle / Permissions : {role_label}
- Identifiant de conversation : {conversation_id or 'session-active'}

Contexte métier fourni :
{context_str}

Message de l'utilisateur :
"{message}"

Directives :
1. Réponds de façon concise, proactive et orientée action.
2. Si le message concerne le CRM (clients, opportunités, relances, pipeline), donne des conseils concrets de conversion et d'organisation.
3. Si le message concerne les formations, les documents (Knowledge Hub) ou les projets IT, adapte tes explications à son rôle.
4. Si l'information n'est pas connue ou absente, propose les démarches appropriées sans inventer de fausses données confidentielles.
5. Sois courtois, structuré (puces, points clés si pertinent).
"""
        try:
            reply_text = self.llm.generate(prompt)
            if not reply_text:
                reply_text = "Je suis à votre disposition. Que souhaitez-vous analyser ou planifier ?"
            return {
                "response": reply_text.strip(),
                "conversation_id": conversation_id or "session-default",
                "metadata": {
                    "model": "gemini",
                    "role_context": role_label,
                    "status": "success"
                }
            }
        except Exception as e:
            return {
                "response": f"Désolé, je rencontre une difficulté technique temporaire pour traiter votre message ({str(e)}). Veuillez réessayer dans quelques instants.",
                "conversation_id": conversation_id or "session-default",
                "metadata": {"status": "error", "error": str(e)}
            }
