from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Por enquanto SQLite. Depois, trocar no .env por MySQL:
    # mysql+pymysql://usuario:senha@localhost:3306/brisa_vinicola
    database_url: str = "sqlite:///./brisa.db"
    secret_key: str = "troque-esta-chave-depois"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()