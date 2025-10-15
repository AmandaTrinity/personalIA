"""
Configurações centralizadas da aplicação PersonalIA
"""

import os
from pathlib import Path

from dotenv import load_dotenv

# Carregar variáveis de ambiente
project_root = Path(__file__).parent.parent.parent
load_dotenv(dotenv_path=project_root / ".env")


class Settings:
    """Configurações centralizadas da aplicação"""

    # Configurações da API
    APP_NAME: str = "PersonalIA Backend"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "API para sistema de treinos personalizados com IA"

    # Configurações do servidor
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"

    # Configurações do banco de dados
    MONGO_URI: str = os.getenv("MONGO_URI", "")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "personalai_db")

    # Configurações da API do Gemini
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    # Configurações de ambiente
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    @property
    def is_development(self) -> bool:
        """Verifica se está em ambiente de desenvolvimento"""
        return self.ENVIRONMENT.lower() in ["development", "dev"]

    @property
    def is_production(self) -> bool:
        """Verifica se está em ambiente de produção"""
        return self.ENVIRONMENT.lower() in ["production", "prod"]

    @property
    def is_testing(self) -> bool:
        """Verifica se está em ambiente de teste"""
        return self.ENVIRONMENT.lower() == "test" or "pytest" in os.environ.get("_", "")


# Instância global das configurações
settings = Settings()
