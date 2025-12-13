"""Compatibilidade: re-exporta schemas definidos em `models.schemas`.

Alguns testes e módulos importam `schemas` diretamente (e.g. `from schemas import MensagemChat`).
Historicamente havia um módulo top-level com esse nome. Para manter compatibilidade
criamos este shim que apenas reexporta os símbolos públicos de `models.schemas`.
"""
from models.schemas import MensagemChat

# Re-export for backward compatibility
__all__ = ["MensagemChat"]
__all__ = ["MensagemChat"]
