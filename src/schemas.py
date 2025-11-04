from typing import List, Optional

from pydantic import BaseModel


class MensagemChat(BaseModel):
    mensagem_usuario: str
