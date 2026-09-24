from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "development"
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    symfony_api_base_url: str = "http://localhost:8080/api"
    symfony_api_key: str = ""
    openai_api_key: str = ""
    gemini_api_key: str
    gemini_model: str = "gemini-2.5-flash"
    ai_service_token: str = "une_valeur_interne_secrete"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


settings = Settings()
