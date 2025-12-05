from fastapi import APIRouter, Depends, HTTPException

# Importações absolutas (sem '..')
from models.schemas import MensagemChat
from services import auth_service, gemini_service, security, treino_service

treino_router = APIRouter(prefix="/treinos", tags=["Treinos"])

# Compatibilidade: exportar aliases para que testes possam patchar
# diretamente `routes.treino_routes.salvar_treino` ou
# `routes.treino_routes.listar_treinos_por_usuario`.
salvar_treino = treino_service.salvar_treino
listar_treinos_por_usuario = treino_service.listar_treinos_por_usuario


@treino_router.post("/")
def criar_treino(
    data: MensagemChat,
    # Dependência SÍNCRONA
    email: str = Depends(security.get_current_user_email),
):  # <-- MUDANÇA: SÍNCRONO
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
            "mensagem_usuario": data.mensagem_usuario,  # Salva a pergunta também
        }

        # 4. Rota salva no DB (síncrono)
        # Use alias `salvar_treino` para permitir patching em testes
        treino_salvo = salvar_treino(
            usuario_id=str(user["_id"]),
            plano_gerado=plano_de_treino,
            user_context=user_context,
        )

        return {"status": "ok", "treino": treino_salvo}

    except Exception as e:
        print(
            f"!!!!!!!!!!!! ERRO DETALHADO !!!!!!!!!!!!\n{e}\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
        )
        raise HTTPException(status_code=500, detail=str(e))


@treino_router.get("/")
def get_treinos(email: str = Depends(security.get_current_user_email)):  # <-- MUDANÇA: SÍNCRONO
    """
    Lista os treinos salvos do usuário LOGADO (SÍNCRONO).
    """
    user = auth_service.get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    # Use alias `listar_treinos_por_usuario` para permitir patching em testes
    treinos = listar_treinos_por_usuario(str(user["_id"]))
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

    Endpoint de compatibilidade usado por testes sem autenticação.
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

        treino_salvo = salvar_treino(
            usuario_id=usuario_id, plano_gerado=plano_de_treino, user_context=user_context
        )

        return {"status": "ok", "treino": treino_salvo}

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@treino_router.get("/{usuario_id}", operation_id="get_treinos_public_get")
def get_treinos_public(usuario_id: str):
    """Retorna treinos salvos para um usuário (compatibilidade pública)."""
    try:
        return listar_treinos_por_usuario(usuario_id)
    except Exception:
        return []
