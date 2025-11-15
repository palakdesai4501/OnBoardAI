"""Configuration management for the application."""
import os
from typing import List

try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # API Configuration
    api_title: str = "OnBoard AI API"
    api_version: str = "1.0.0"
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = False
    
    # OpenAI Configuration
    openai_api_key: str
    openai_model: str = "gpt-4o-mini"
    openai_temperature: float = 0.2
    openai_max_tokens: int = 1800
    openai_timeout: float = 30.0
    openai_max_retries: int = 2
    openai_max_rpm: int = 60
    
    # CORS Configuration
    cors_origins: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"
    
    # Paths
    pdf_directory: str = "data/pdfs"
    persist_directory: str = "data/chroma_db"
    outputs_directory: str = "outputs"
    
    # File Management
    file_retention_days: int = 30
    
    # Logging
    log_level: str = "INFO"
    log_format: str = "json"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins string into list."""
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()

