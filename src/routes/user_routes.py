from fastapi import APIRouter, HTTPException

from schemas import DadosUsr
from services.sign_service import criar_usuario, ler_usuario, mudar_senha, solicitar_recuperacao

user_router = APIRouter(prefix="/usuario", tags=["Usr"])


@user_router.post("/cadastro")
async def post_usuario(data: DadosUsr):
    try:
        status, usr = criar_usuario(data)
        # Retornar 201 quando criado, 409 quando já existe
        from fastapi.responses import JSONResponse

        if str(status).startswith("Cadastro feito"):
            return JSONResponse(status_code=201, content={"status": status, "usuario": usr})
        else:
            return JSONResponse(status_code=409, content={"status": status, "usuario": usr})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@user_router.get("/cadastro")
async def get_usuario(email: str):
    return ler_usuario(email)


@user_router.post("/solicitar-nova-senha")
async def post_solicitacao(email: str):
    try:
        status, usr = solicitar_recuperacao(email)
        return {"status": status, "usuario": usr}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@user_router.post("/mudar-senha")
async def post_alterar(token: str, senha_nova: str):
    try:
        status = mudar_senha(token, senha_nova)
        return {"status": status}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
