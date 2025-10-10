from fastapi import APIRouter, HTTPException

from schemas import DadosUsr
from services.sign_service import criar_usuario, ler_usuario

user_router = APIRouter(prefix="/usuario", tags=["Usr"])


@user_router.post("/cadastro")
async def post_usuario(data: DadosUsr):
    try:
        status, usr = criar_usuario(data)
        return {"status": {status}, "usuario": usr}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@user_router.get("/cadastro")
async def get_usuario(email: str):
    return ler_usuario(email)
