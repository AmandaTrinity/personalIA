"""
Define os "contratos" de dados (schemas) para
entrada e saída de usuários, usando Pydantic.
"""
from pydantic import BaseModel, EmailStr, ConfigDict, model_validator

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
    nivel: str
    nivel: str | None = None
    # Aceitamos tanto lista quanto string por compatibilidade com dados antigos.
    # Normalizamos para lista no model_validator abaixo.
    equipamentos: list[str] | str | None = None
    limitacoes: str | None = None
    frequencia: str

    @model_validator(mode="after")
    def _normalize_equipamentos(self):
        if isinstance(self.equipamentos, str):
            # Se for string separada por vírgulas, split e limpe espaços
            parts = [p.strip() for p in self.equipamentos.split(",") if p.strip()]
            self.equipamentos = parts if parts else [self.equipamentos.strip()]
        return self

class UserLogin(BaseModel):
    """ Schema para /auth/login """
    email: EmailStr
    senha: str

# --- Schemas de Saída ---
# -- teste
class UserResponse(BaseModel):
    """ O que o frontend recebe de volta (sem senha) """
    id: str
    email: EmailStr
    nome: str
    # Adicionando os campos do perfil para que sejam retornados na API
    idade: int | None = None
    sexo: str | None = None
    altura: int | None = None
    peso: float | None = None
    objetivo: str | None = None
    nivel: str | None = None
    equipamentos: list[str] | str | None = None
    limitacoes: str | None = None
    frequencia: str | None = None
    
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
        alias_generator=lambda field_name: "_id" if field_name == "id" else field_name
    )

    @model_validator(mode="after")
    def _normalize_equipamentos(self):
        # Se equipamentos foi armazenado como string em versões antigas,
        # converte para lista com o valor.
        if isinstance(self.equipamentos, str):
            parts = [p.strip() for p in self.equipamentos.split(",") if p.strip()]
            self.equipamentos = parts if parts else [self.equipamentos.strip()]
        return self

class TokenResponse(BaseModel):
    """ A resposta de Login/Registro """
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
