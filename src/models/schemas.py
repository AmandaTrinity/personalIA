from typing import List, Optional

from pydantic import BaseModel, model_validator


class MensagemChat(BaseModel):
    mensagem_usuario: str
    nivel: Optional[str] = "iniciante"
    objetivo: Optional[str] = "condicionamento"
    # Aceitamos tanto lista quanto string (compatibilidade). Normalizamos
    # para lista no validador abaixo, porque o serviço de geração espera
    # iterável de equipamentos.
    equipamentos: Optional[List[str] | str] = None
    frequencia: Optional[str] = "2 dias por semana"

    @model_validator(mode="after")
    def _normalize_equipamentos(self):
        if isinstance(self.equipamentos, str):
            parts = [p.strip() for p in self.equipamentos.split(",") if p.strip()]
            self.equipamentos = parts if parts else [self.equipamentos.strip()]
        # Se None, deixamos como None — o serviço tratará o padrão
        return self
