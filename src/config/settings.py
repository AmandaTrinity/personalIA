"""
Configurações centralizadas da aplicação PersonalIA
"""

import os
from pathlib import Path

from dotenv import load_dotenv

# Carregar variáveis de ambiente
# (Ele procura o .env na pasta raiz do projeto, 'personalIA/')
project_root = Path(__file__).parent.parent.parent 
load_dotenv(dotenv_path=project_root / ".env")


class Settings:
    """Configurações centralizadas da aplicação

    Observação: algumas baterias de testes precisam sobrescrever
    `settings.is_testing`. Para permitir patching (mock/patch), essa
    flag é criada como atributo de instância no __init__ em vez de
    ser uma property somente leitura.
    """

    def __init__(self) -> None:
        # Configurações da API
        self.APP_NAME: str = "PersonalIA Backend"
        self.APP_VERSION: str = "1.0.0"
        self.APP_DESCRIPTION: str = "API para sistema de treinos personalizados com IA"

        # Configurações do servidor
        self.HOST: str = os.getenv("HOST", "0.0.0.0")
        self.PORT: int = int(os.getenv("PORT", "8000"))
        self.DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"

        # Configurações do banco de dados
        self.MONGO_URI: str = os.getenv("MONGO_URI", "")
        self.DATABASE_NAME: str = os.getenv("DATABASE_NAME", "personalai_db")

        # Configurações da API do Gemini
        self.GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
        # Modelo do Gemini a ser usado por padrão (pode ser sobrescrito via ENV)
        self.GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

        # Chave para Tokens JWT (Lida do .env)
        self.SECRET_KEY: str = os.getenv("SECRET_KEY", "")

        # Configurações de email
        self.EMAIL: str = os.getenv("EMAIL", "")
        self.SENHA_SMTP: str = os.getenv("SENHA_SMTP", "")

        # Configurações de ambiente
        self.ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

        # Flag patchável para indicar modo de testes
        self.is_testing: bool = self.ENVIRONMENT.lower() == "test" or "pytest" in os.environ.get("_", "")

    @property
    def is_development(self) -> bool:
        """Verifica se está em ambiente de desenvolvimento"""
        return self.ENVIRONMENT.lower() in ["development", "dev"]

    @property
    def is_production(self) -> bool:
        """Verifica se está em ambiente de produção"""
        return self.ENVIRONMENT.lower() in ["production", "prod"]


# Instância global das configurações
# A instância lê o valor de GEMINI_MODEL do ambiente (ou usa o default definido
# dentro de Settings.__init__). Não sobrescrevemos aqui para permitir que
# deployments/variáveis de ambiente controlem qual modelo será usado.
settings = Settings()

