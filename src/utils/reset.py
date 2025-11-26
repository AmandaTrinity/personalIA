from datetime import datetime, timedelta

from jose import jwt

from config.settings import settings

chave = settings.SECRET_KEY
algoritmo = "HS256"
tempo = 10


def criar_token(email: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=tempo)
    dados_token = {"exp": expire, "sub": email}
    token = jwt.encode(dados_token, chave, algorithm=algoritmo)
    return token


def verifica_token(token: str):
    try:
        verificador = jwt.decode(token, chave, algorithms=algoritmo)
        email_usuario = verificador.get("sub")
        return email_usuario
    except JWTError:
        return None