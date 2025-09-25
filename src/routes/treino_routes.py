from fastapi import APIRouter
from services.gemini_service import gerar_plano_de_treino

treino_router = APIRouter(prefix='/treino',tags=['treino'])

@treino_router.get("/plano")
def get_plano(prompt: str):
    """
    Gera um plano de treino com base em um prompt do usuário.
    """
    
    plano = gerar_plano_de_treino(prompt)
    return {"plano_de_treino": plano}