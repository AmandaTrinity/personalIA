from typing import List, Optional

from pydantic import BaseModel


class MensagemChat(BaseModel):
    mensagem_usuario: str
    nivel: Optional[str] = "iniciante"
    objetivo: Optional[str] = "condicionamento"
    equipamentos: Optional[List[str]] = ["peso corporal"]
    frequencia: Optional[str] = "2 dias por semana"


class DadosUsr(BaseModel):
    email_usuario: str
    nome_usuario: str
    idade_usuario: int
    peso_usuario: int
    altura_usuario: int
    limitacoes_usuario: bool
    dias_usuario: int
    minutos_usuario: int
    senha_usuario: str
    lugar_usuario: str
