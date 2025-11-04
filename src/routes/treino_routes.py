from fastapi import APIRouter, HTTPException, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

# Importações absolutas (sem '..')
from models.schemas import MensagemChat   
from services import gemini_service
from services import security          
from services import auth_service       
from database.db import get_db        
from services import treino_service 

treino_router = APIRouter(prefix="/treinos", tags=["Treinos"])


@treino_router.post("/")
async def criar_treino(
    data: MensagemChat, 
    email: str = Depends(security.get_current_user_email),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Cria um novo plano de treino para o usuário LOGADO.
    """
    
    user = await auth_service.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    try:
        # 1. Rota chama o "Especialista" (IA)
        plano_de_treino = await gemini_service.gerar_plano_de_treino(
            mensagem=data.mensagem_usuario,
            user=user 
        )
        
        # 2. Prepara o "contexto" do usuário para salvar
        user_context = {
            "email": user.get("email"),
            "idade": user.get("idade"),
            "peso": user.get("peso"),
            "altura": user.get("altura"),
            "objetivo": user.get("objetivo"),
            "frequencia": user.get("frequencia"),
            "limitacoes": user.get("limitacoes"),
        }
        
        # 3. Rota chama o "Arquivista" (DB)
        treino_salvo = await treino_service.salvar_treino(
            usuario_id=str(user["_id"]), 
            plano_gerado=plano_de_treino,
            user_context=user_context,
            db=db
        )
        
        return {"status": "ok", "treino": treino_salvo}
    
    except Exception as e:
        print(f"!!!!!!!!!!!! ERRO DETALHADO !!!!!!!!!!!!\n{e}\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        raise HTTPException(status_code=500, detail=str(e))


@treino_router.get("/")
async def get_treinos(
    email: str = Depends(security.get_current_user_email),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """
    Lista os treinos salvos do usuário LOGADO.
    """
    user = await auth_service.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
        
    treinos = await treino_service.listar_treinos_por_usuario(
        usuario_id=str(user["_id"]), 
        db=db
    )
    return treinos