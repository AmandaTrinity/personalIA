from datetime import datetime
from bson import ObjectId

# Importa a coleção SÍNCRONA do seu arquivo mongodb.py
from database.mongodb import treinos_collection
# NÃO importamos mais gemini_service aqui!
from services import gemini_service # Importamos para usar a nova função

def salvar_treino(usuario_id: str, plano_gerado: str, user_context: dict) -> dict:
    """
    Salva um plano de treino gerado no MongoDB (SÍNCRONO).
    """
    if treinos_collection is None:
        raise HTTPException(status_code=503, detail="Conexão com banco de dados não disponível")

    treino_doc = user_context 
    
    treino_doc.update(
        {
            "usuario_id": ObjectId(usuario_id),
            "plano_gerado": plano_gerado,
            "criado_em": datetime.utcnow(),
        }
    )
    
    try:
        result = treinos_collection.insert_one(treino_doc)
        
        treino_doc["_id"] = str(result.inserted_id)
        treino_doc["usuario_id"] = str(treino_doc["usuario_id"])
        return treino_doc
        
    except Exception as e:
        print(f"Erro ao salvar no MongoDB: {e}")
        raise e 

def listar_treinos_por_usuario(usuario_id: str) -> list:
    """
    Retorna todos os treinos salvos de um usuário (SÍNCRONO).
    """
    if treinos_collection is None:
        return [] # Evita crash se DB estiver fora

    cursor = treinos_collection.find(
        {"usuario_id": ObjectId(usuario_id)}
    ).sort("criado_em", -1)

    treinos = []
    for t in cursor:
        treinos.append({
            "_id": str(t["_id"]),
            "objetivo": t.get("objetivo"),
            "frequencia": t.get("frequencia"),
            "plano_gerado": t.get("plano_gerado"),
            "criado_em": t.get("criado_em"),
        })
    return treinos

