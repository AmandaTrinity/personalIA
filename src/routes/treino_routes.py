from fastapi import APIRouter, HTTPException

from schemas import MensagemChat
from services.treino_service import listar_treinos_por_usuario, salvar_treino

treino_router = APIRouter(prefix="/treinos", tags=["Treinos"])


@treino_router.post("/{usuario_id}")
async def criar_treino(usuario_id: str, data: MensagemChat):
    try:
        treino = salvar_treino(usuario_id, data)
        return {"status": "ok", "treino": treino}
    except Exception as e:
        print("!!!!!!!!!!!! ERRO DETALHADO !!!!!!!!!!!!")
        print(e)  # <--- ADICIONE ESTA LINHA!
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        raise HTTPException(status_code=500, detail=str(e))


@treino_router.get("/{usuario_id}")
async def get_treinos(usuario_id: str):
    return listar_treinos_por_usuario(usuario_id)
