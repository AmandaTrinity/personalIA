"""
Lida com hash de senhas e criação/validação de Tokens JWT.
Este arquivo é totalmente síncrono.
"""
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

# Importa as configurações (do Passo 1)
from config.settings import settings 

# --- Configuração de Senha ---
# (Seu requirements.txt tem 'passlib')
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica a senha simples contra o hash salvo."""
    return pwd_context.verify(plain_password, hashed_password)

def hash_password(password: str) -> str:
    """Cria um hash bcrypt da senha."""
    return pwd_context.hash(password)

# --- Configuração de Token JWT ---
# (Seu requirements.txt tem 'python-jose')
SECRET_KEY = settings.SECRET_KEY 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 dias

def create_access_token(data: dict) -> str:
    """Cria um novo token JWT."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

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
        print(f"Erro no Token: {e}") # Log para debug
        raise credentials_exception

