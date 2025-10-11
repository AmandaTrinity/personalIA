from passlib.context import CryptContext

modelo_hash = CryptContext(schemes=["pbkdf2_sha256"])


def hash_pass(senha: str) -> str:
    return modelo_hash.hash(senha)


def verifica_senha(senha: str, hash_senha: str) -> bool:
    return modelo_hash.verify(senha, hash_senha)
