"""Funções utilitárias para serialização/normalização de documentos do banco.

Colocamos aqui transformações reutilizáveis como converter ObjectId para str e
remover campos sensíveis antes de retornar para a API.
"""

from typing import Any


def normalize_user(user_doc: dict | None, safe: bool = True) -> dict | None:
    """Retorna uma cópia normalizada do documento do usuário.

    - Converte `_id` (ObjectId) para string.
    - Se `safe` for True, remove campos sensíveis (ex: hashed_password).
    """
    if not user_doc:
        return None

    doc = dict(user_doc)  # shallow copy
    if "_id" in doc:
        try:
            doc["_id"] = str(doc["_id"])
        except Exception:
            pass

    if safe:
        doc.pop("hashed_password", None)
        doc.pop("senha", None)

    return doc
