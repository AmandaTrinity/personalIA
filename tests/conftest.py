"""
Configuração do pytest e setup de imports
"""
import sys
import os
from pathlib import Path

# Definir ambiente de teste
os.environ["ENVIRONMENT"] = "test"

# Adiciona o diretório raiz do projeto ao path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / "src"))