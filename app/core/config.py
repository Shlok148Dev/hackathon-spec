from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    DATABASE_URL: str
    GEMINI_API_KEY: str
    SUPABASE_SERVICE_KEY: str
    JWT_SECRET: str
    LOG_LEVEL: str = "INFO"
    REDIS_URL: str

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()
