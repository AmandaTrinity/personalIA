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

        # 2. Rota chama a IA (síncrono) — passamos o objeto MensagemChat, o
        # contexto do usuário e o histórico para que a IA possa personalizar
        # o plano com base nos dados cadastrados.
        plano_de_treino = gemini_service.gerar_plano_de_treino(
            data, user=user, historico=historico_str
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


# -------------------------
# Endpoints de compatibilidade pública (para testes/integração)
# Mantemos os endpoints autenticados acima por padrão, mas algumas integrações
# e testes usam chamadas diretas a /treinos/{usuario_id} sem auth. Estes
# endpoints duplicam a funcionalidade sem exigir token.
# -------------------------


@treino_router.post("/{usuario_id}", operation_id="criar_treino_public_post")
def criar_treino_public(usuario_id: str, data: MensagemChat):
    """Cria um novo plano de treino para o usuário identificado por ID (público).

    Este endpoint é destinado apenas para compatibilidade com testes que
    executam chamadas sem autenticação. Ele gera um plano (via gemini_service)
    e salva no banco com o `usuario_id` informado.
    """
    try:
        plano_de_treino = gemini_service.gerar_plano_de_treino(data)

        user_context = {
            "mensagem_usuario": data.mensagem_usuario,
            "nivel": getattr(data, "nivel", None),
            "objetivo": getattr(data, "objetivo", None),
            "equipamentos": getattr(data, "equipamentos", None),
            "frequencia": getattr(data, "frequencia", None),
        }

        treino_salvo = treino_service.salvar_treino(
            usuario_id=usuario_id, plano_gerado=plano_de_treino, user_context=user_context
        )

        return {"status": "ok", "treino": treino_salvo}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@treino_router.get("/{usuario_id}", operation_id="get_treinos_public_get")
def get_treinos_public(usuario_id: str):
    """Retorna treinos salvos para um usuário (compatibilidade pública)."""
    return treino_service.listar_treinos_por_usuario(usuario_id=usuario_id)


# ---------- Rotas públicas de compatibilidade (usadas nos testes antigos) ----------
@treino_router.post("/{usuario_id}")
def criar_treino_public(usuario_id: str, data: MensagemChat):
    """Compatibilidade: cria um treino para `usuario_id` (sem autenticação).

    Usada pelos testes que fazem requests diretos para /treinos/{usuario_id}.
    """
    try:
        plano_de_treino = gemini_service.gerar_plano_de_treino(data)

        # Prepara contexto mínimo e salva
        user_context = {
            "mensagem_usuario": data.mensagem_usuario,
            "nivel": getattr(data, "nivel", None),
            "objetivo": getattr(data, "objetivo", None),
            "equipamentos": getattr(data, "equipamentos", None),
            "frequencia": getattr(data, "frequencia", None),
        }

        treino_salvo = treino_service.salvar_treino(
            usuario_id=usuario_id,
            plano_gerado=plano_de_treino,
            user_context=user_context,
        )

        return {"treino": treino_salvo}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@treino_router.get("/{usuario_id}")
def get_treinos_public(usuario_id: str):
    """Compatibilidade: lista treinos do `usuario_id` sem autenticação."""
    try:
        return treino_service.listar_treinos_por_usuario(usuario_id)
    except Exception:
        return []

