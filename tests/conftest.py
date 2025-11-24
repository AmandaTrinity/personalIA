"""
Configuração do pytest e setup de imports
"""
import sys
import os
from pathlib import Path
import warnings

# Definir ambiente de teste
os.environ["ENVIRONMENT"] = "test"

# Suprimir DeprecationWarning gerado pelo passlib/crypt em alguns ambientes
warnings.filterwarnings(
	"ignore",
	message=r".*crypt is deprecated and slated for removal.*",
	category=DeprecationWarning,
)
warnings.filterwarnings(
	"ignore",
	category=DeprecationWarning,
	module=r".*passlib.*",
)

# Adiciona o diretório raiz do projeto ao path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(project_root / "src"))