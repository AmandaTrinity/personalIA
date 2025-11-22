"""
Lida com a lógica de criar e autenticar usuários.
Versão SÍNCRONA para funcionar com mongodb.py
"""
from fastapi import HTTPException, status
from datetime import datetime, timezone

# Importa o serviço de segurança
from services.security import hash_password, verify_password
# Importa a coleção SÍNCRONA do seu arquivo mongodb.py
from database.mongodb import usuarios_collection
# Importa o "contrato" do seu 'models/user.py'
from models.user import UserCreate

# Importa utilitário de normalização
from utils.serializers import normalize_user


def get_user_by_email_raw(email: str):
    """Busca e retorna o documento cru do usuário (contém hashed_password).

    Use esta função quando for necessário verificar a senha.
    """
    if usuarios_collection is None:
        raise HTTPException(status_code=503, detail="Conexão com banco de dados não disponível")
    return usuarios_collection.find_one({"email": email})


def get_user_by_email(email: str, safe: bool = True):
    """Busca um usuário pelo email e retorna versão normalizada.

    Por padrão retorna a versão 'safe' (sem hashed_password).
    """
    raw = get_user_by_email_raw(email)
    return normalize_user(raw, safe=safe)


def create_user(user_data: UserCreate) -> dict:
    """Cria um novo usuário no banco de dados (síncrono)."""
    if usuarios_collection is None:
        raise HTTPException(status_code=503, detail="Conexão com banco de dados não disponível")

    existing_user = get_user_by_email_raw(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este email já está cadastrado.",
        )

    hashed_senha = hash_password(user_data.senha)
    new_user_data = user_data.model_dump()

    new_user_data["hashed_password"] = hashed_senha
    del new_user_data["senha"]  # NUNCA salve a senha em texto puro
    new_user_data["created_at"] = datetime.now(timezone.utc)

    result = usuarios_collection.insert_one(new_user_data)
    created_user = usuarios_collection.find_one({"_id": result.inserted_id})

    return normalize_user(created_user, safe=True)


def authenticate(email: str, senha: str):
    """Autentica um usuário e retorna a versão safe do documento se válido."""
    if usuarios_collection is None:
        return None

    user_raw = get_user_by_email_raw(email)
    if not user_raw:
        return None

    if not verify_password(senha, user_raw.get("hashed_password", "")):
        return None

    return normalize_user(user_raw, safe=True)


def update_token(email:str, token: str):
    usuarios_collection.update_one({"email": email}, {"$set": {"token": token}})

def update_user_password(email: str, senha: str, token: str):
    if usuarios_collection is None:
        return None
    if usuarios_collection.find_one({"email": email, "token": token}):
        senha_nova = (senha)
        usuarios_collection.update_one(
            {"email": email}, {"$set": {"senha_hash": senha_nova}, "$unset": {"token": token}}
        )
        return "Senha alterada com sucesso"
    return "Não foi possivel alterar a senha"

# Backwards compatibility: antiga função ainda disponível
# note: removed legacy `authenticate_user` wrapper; use `authenticate` directly

