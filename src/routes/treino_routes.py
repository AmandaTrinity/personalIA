from fastapi import APIRouter
from services.gemini_service import gerar_plano_de_treino
from schemas import MensagemChat

treino_router = APIRouter(prefix='/mensagem',tags=['mensagem'])

@treino_router.post("/chat")
def post_plano(data: MensagemChat):
    """
    Gera um plano de treino com base em um prompt do usuário.
    """
    
    plano = gerar_plano_de_treino(data)
    return {"plano_de_treino": plano}