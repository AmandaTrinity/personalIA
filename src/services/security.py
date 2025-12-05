"""
Lida com hash de senhas e criação/validação de Tokens JWT.
Este arquivo é totalmente síncrono.
"""

import importlib
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

# Importa as configurações (do Passo 1)
from config.settings import settings

# --- Configuração de Senha ---
# Evitamos importar CryptContext no nível de módulo para reduzir warnings
# durante a coleta de testes; inicializamos o contexto sob demanda.
_pwd_context = None


def get_pwd_context():
    """Inicializa e retorna o CryptContext (lazy import)."""
    global _pwd_context
    if _pwd_context is None:
        passlib = importlib.import_module("passlib.context")
        CryptContext = getattr(passlib, "CryptContext")
        # Usamos PBKDF2-SHA256 como esquema seguro e amplamente suportado
        _pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
    return _pwd_context


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica a senha simples contra o hash salvo."""
    return get_pwd_context().verify(plain_password, hashed_password)


def hash_password(password: str) -> str:
    """Cria um hash seguro (PBKDF2-SHA256) da senha."""
    return get_pwd_context().hash(password)


# --- Configuração de Token JWT ---
# (Seu requirements.txt tem 'python-jose')
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 dias
RECOVERY_TOKEN_EXPIRE_MINUTES = 15


def create_access_token(data: dict) -> str:
    """Cria um novo token JWT."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_recovery_token(email: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=RECOVERY_TOKEN_EXPIRE_MINUTES)
    dados_token = {"exp": expire, "sub": email}
    token = jwt.encode(dados_token, SECRET_KEY, algorithm=ALGORITHM)
    return token


def verify_recovery_token(token: str):
    try:
        verificador = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        email_usuario = verificador.get("sub")
        if email_usuario is None:
            return None
        return email_usuario
    except JWTError:
        return None


# --- Dependência de Rota Protegida (SÍNCRONA) ---
# Diz ao FastAPI para procurar o token em /auth/login
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user_email(token: str = Depends(oauth2_scheme)) -> str:
    """
    Dependência SÍNCRONA. Decodifica o token e retorna o email.
    Usada pelo 'treino_routes.py'.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Verifica se a chave secreta foi carregada
        if not SECRET_KEY:
            raise JWTError("SECRET_KEY não configurada no .env")

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        return email
    except JWTError as e:
        print(f"Erro no Token: {e}")  # Log para debug
        raise credentials_exception
