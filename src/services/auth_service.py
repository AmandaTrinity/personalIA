"""
Lida com a lógica de criar e autenticar usuários.
Versão SÍNCRONA para funcionar com mongodb.py
"""
from fastapi import HTTPException, status
from datetime import datetime, timezone

# Importa o serviço de segurança (agora corrigido)
from services.security import hash_password, verify_password 
# Importa a coleção SÍNCRONA do seu arquivo mongodb.py
from database.mongodb import usuarios_collection
# Importa o "contrato" do seu 'models/user.py'
from models.user import UserCreate 

def get_user_by_email(email: str):
    """ Busca um usuário pelo email (síncrono) """
    if usuarios_collection is None:
        raise HTTPException(status_code=503, detail="Conexão com banco de dados não disponível")
    return usuarios_collection.find_one({"email": email})

def create_user(user_data: UserCreate) -> dict: # Recebe UserCreate
    """ Cria um novo usuário no banco de dados (síncrono) """
    if usuarios_collection is None:
        raise HTTPException(status_code=503, detail="Conexão com banco de dados não disponível")
        
    existing_user = get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este email já está cadastrado." 
        )
    
    hashed_senha = hash_password(user_data.senha)
    new_user_data = user_data.model_dump() 
    
    new_user_data["hashed_password"] = hashed_senha
    del new_user_data["senha"] # NUNCA salve a senha em texto puro
    new_user_data["created_at"] = datetime.now(timezone.utc)
    
    result = usuarios_collection.insert_one(new_user_data)
    created_user = usuarios_collection.find_one({"_id": result.inserted_id})
    return created_user

def authenticate_user(email: str, senha: str):
    """ Autentica um usuário (síncrono) """
    if usuarios_collection is None:
        return None # Evita crash se DB estiver fora

    user = get_user_by_email(email)
    if not user:
        return None # Usuário não encontrado
        
    if not verify_password(senha, user["hashed_password"]):
        return None # Senha incorreta
    
    return user

