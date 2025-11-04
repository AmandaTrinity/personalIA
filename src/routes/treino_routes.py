from fastapi import APIRouter, HTTPException, Depends
# Importações absolutas (sem '..')
from models.schemas import MensagemChat   
from services import gemini_service
from services import security          
from services import auth_service       
from services import treino_service 

treino_router = APIRouter(prefix="/treinos", tags=["Treinos"])

@treino_router.post("/")
def criar_treino(
    data: MensagemChat, 
    # Dependência SÍNCRONA
    email: str = Depends(security.get_current_user_email) 
): # <-- MUDANÇA: SÍNCRONO
    """
    Cria um novo plano de treino para o usuário LOGADO (SÍNCRONO).
    """
    user = auth_service.get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    try:
        # 1. Pega o histórico de treinos (síncrono)
        treinos_anteriores = treino_service.listar_treinos_por_usuario(str(user["_id"]))
        historico_str = "\n\n---\n\n".join([t.get("plano_gerado", "") for t in treinos_anteriores])

        # 2. Rota chama a IA (síncrono)
        plano_de_treino = gemini_service.gerar_plano_de_treino(
            mensagem=data.mensagem_usuario,
            user=user,
            historico=historico_str
        )
        
        # 3. Prepara o contexto
        user_context = {
            "email": user.get("email"),
            "idade": user.get("idade"),
            "peso": user.get("peso"),
            "altura": user.get("altura"),
            "objetivo": user.get("objetivo"),
            "frequencia": user.get("frequencia"),
            "limitacoes": user.get("limitacoes"),
            "mensagem_usuario": data.mensagem_usuario, # Salva a pergunta também
        }
        
        # 4. Rota salva no DB (síncrono)
        treino_salvo = treino_service.salvar_treino(
            usuario_id=str(user["_id"]), 
            plano_gerado=plano_de_treino,
            user_context=user_context
        )
        
        return {"status": "ok", "treino": treino_salvo}
    
    except Exception as e:
        print(f"!!!!!!!!!!!! ERRO DETALHADO !!!!!!!!!!!!\n{e}\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        raise HTTPException(status_code=500, detail=str(e))

@treino_router.get("/")
def get_treinos(
    email: str = Depends(security.get_current_user_email)
): # <-- MUDANÇA: SÍNCRONO
    """
    Lista os treinos salvos do usuário LOGADO (SÍNCRONO).
    """
    user = auth_service.get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
        
    treinos = treino_service.listar_treinos_por_usuario(
        usuario_id=str(user["_id"])
    )
    return treinos
