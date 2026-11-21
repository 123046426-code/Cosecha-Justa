from typing import List, Union
from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Cosecha Justa API"
    ENVIRONMENT: str = "development"
    API_V1_STR: str = "/api/v1"
    
    # Seguridad JWT
    SECRET_KEY: str = "cosecha_justa_super_secret_jwt_key_estadisticas_upq_2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 horas
    
    # Conexión asíncrona a PostgreSQL
    DATABASE_URL: str = "postgresql+asyncpg://cosecha_user:cosecha_secure_password_2026@localhost:5432/cosecha_justa_db"
    
    # Orígenes CORS permitidos para desacoplamiento
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost",
        "http://localhost:3000",
        "http://localhost:8000",
        "http://localhost:8080",
        "http://127.0.0.1:8000",
        "http://localhost:19006"
    ]

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
