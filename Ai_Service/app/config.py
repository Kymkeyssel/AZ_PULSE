from pydantic import Field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configuration du service IA.

    Rappel d'architecture (§9.1) : ce service orchestre des agents et appelle un
    fournisseur de modèle par API. Il ne détient aucun secret côté client : la
    clé du fournisseur ne vit qu'ici, jamais dans React ni dans le navigateur.
    """

    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000

    # Secret partagé avec Symfony (AI_SERVICE_TOKEN). Il protège l'API du
    # service : sans lui, n'importe qui pourrait déclencher des appels LLM.
    ai_service_token: str = Field(
        min_length=16,
        description="Secret d'authentification service-à-service. Doit correspondre à AI_SERVICE_TOKEN côté Symfony.",
    )

    # Fournisseur de modèle : au moins une clé doit être fournie.
    gemini_api_key: str | None = None
    gemini_model: str = "gemini-2.5-flash"
    openai_api_key: str | None = None

    # Point d'entrée Symfony. FastAPI ne se connecte jamais directement à
    # PostgreSQL : toute donnée métier transite par Symfony.
    symfony_api_base_url: str = "http://localhost:8080/api"
    symfony_api_key: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @model_validator(mode="after")
    def _require_a_model_provider(self) -> "Settings":
        if not self.gemini_api_key and not self.openai_api_key:
            raise ValueError(
                "Aucune clé fournisseur définie. Renseignez GEMINI_API_KEY "
                "(ou OPENAI_API_KEY) dans Ai_Service/.env."
            )
        return self

    @property
    def active_provider(self) -> str:
        return "gemini" if self.gemini_api_key else "openai"


settings = Settings()
