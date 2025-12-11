from typing import List, Optional

from pydantic import BaseModel


class MensagemChat(BaseModel):
    mensagem_usuario: str
    nivel: Optional[str] = "iniciante"
    objetivo: Optional[str] = "condicionamento"
    equipamentos: Optional[str] = "peso corporal"
    frequencia: Optional[str] = "2 dias por semana"
