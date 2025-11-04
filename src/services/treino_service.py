from datetime import datetime


from bson import ObjectId

from database.mongodb import treinos_collection
from schemas import MensagemChat
from services.gemini_service import gerar_plano_de_treino


def salvar_treino(usuario_id: str, data: MensagemChat) -> dict:
    """
    Gera um plano de treino com o Gemini e salva no MongoDB.
    Retorna o documento inserido.
    """
    historico = listar_treinos_por_usuario(usuario_id)
    historico = [treino["plano_gerado"] for treino in historico]
    historico = "\n\n---\n\n".join(historico)
    plano = gerar_plano_de_treino(historico, data)

    treino_doc = {
        "usuario_id": ObjectId(usuario_id) if treinos_collection is not None else usuario_id,
        "nivel": data.nivel,
        "objetivo": data.objetivo,
        "equipamentos": data.equipamentos,
        "frequencia": data.frequencia,
        "mensagem_usuario": data.mensagem_usuario,
        "plano_gerado": plano,
        "criado_em": datetime.utcnow(),
    }

    if treinos_collection is not None:
        try:
            result = treinos_collection.insert_one(treino_doc)
            treino_doc["_id"] = str(result.inserted_id)
            treino_doc["usuario_id"] = str(treino_doc["usuario_id"])
        except Exception as e:
            print(f"Erro ao salvar no MongoDB: {e}")
            # Em caso de erro, trate de forma apropriada, talvez elevando a exceção
    else:
        # Modo de teste/desenvolvimento
        treino_doc["_id"] = "mock_id"

        treino_doc["usuario_id"] = usuario_id  # Mantém como string no mock

    return treino_doc


def listar_treinos_por_usuario(usuario_id: str) -> list:
    """
    Retorna todos os treinos salvos de um usuário específico.
    """
    if treinos_collection is None:
        # Modo de teste/desenvolvimento
        return []


    treinos = treinos_collection.find({"usuario_id": ObjectId(usuario_id)}).sort("criado_em", -1)


    return [
        {
            "_id": str(t["_id"]),
            "nivel": t["nivel"],
            "objetivo": t["objetivo"],
            "plano_gerado": t["plano_gerado"],
            "criado_em": t["criado_em"],
        }
        for t in treinos
    ]


def buscar_treino_por_id(treino_id: str) -> dict | None:
    """
    Retorna um treino específico pelo ID.
    """
    if treinos_collection is None:
        # Modo de teste/desenvolvimento
        return None


    treino = treinos_collection.find_one({"_id": ObjectId(treino_id)})
    if treino:
        treino["_id"] = str(treino["_id"])
        treino["usuario_id"] = str(treino["usuario_id"])
    return treino