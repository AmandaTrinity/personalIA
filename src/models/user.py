"""
Define os "contratos" de dados (schemas) para
entrada e saída de usuários, usando Pydantic.
"""
from pydantic import BaseModel, EmailStr, ConfigDict

# --- Schemas de Entrada ---

class UserCreate(BaseModel):
    """ Schema para /auth/register (com todos os campos) """
    email: EmailStr
    senha: str
    nome: str
    idade: int
    sexo: str
    altura: int  
    peso: float  
    objetivo: str
    limitacoes: str | None = None
    frequencia: str

class UserLogin(BaseModel):
    """ Schema para /auth/login """
    email: EmailStr
    senha: str

# --- Schemas de Saída ---

class UserResponse(BaseModel):
    """ O que o frontend recebe de volta (sem senha) """
    id: str
    email: EmailStr
    nome: str
    
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
        alias_generator=lambda field_name: "_id" if field_name == "id" else field_name
    )

class TokenResponse(BaseModel):
    """ A resposta de Login/Registro """
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

