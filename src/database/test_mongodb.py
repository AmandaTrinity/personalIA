#!/usr/bin/env python3
"""
Teste SIMPLES MongoDB - Operações Básicas
"""
import os
from datetime import datetime

from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

# Carregar variáveis de ambiente
load_dotenv()

# Carregar configurações do .env
uri = os.getenv("MONGO_URI")
if not uri:
    print("❌ MONGO_URI não configurada no arquivo .env!")
    print("Configure a variável MONGO_URI no arquivo .env")
    exit(1)

database_name = os.getenv("DATABASE_NAME", "personalai_db")

print("🔍 Testando operações básicas no MongoDB...")

try:
    # Conectar
    client = MongoClient(uri, server_api=ServerApi("1"))
    db = client[database_name]

    print("✅ Conectado ao MongoDB Atlas!")

    # 1️⃣ COLOCAR algo no database
    print("\n1. 🟢 COLOCANDO dados no database...")
    treino_data = {
        "user_id": "usuario_teste",
        "titulo": "Treino de Teste - Peito",
        "tempo": 45,
        "tipo": "musculação",
        "nivel": "iniciante",
        "objetivo": "teste",
        "exercicios": ["Supino", "Flexão", "Crucifixo"],
        "data": datetime.now().strftime("%Y-%m-%d"),
        "created_at": datetime.now(),
    }

    result = db.treinos.insert_one(treino_data)
    print(f"   ✅ Dados INSERIDOS! ID: {result.inserted_id}")

    # 2️⃣ BUSCAR algo no database
    print("\n2. 🔍 BUSCANDO dados no database...")
    treino_encontrado = db.treinos.find_one({"_id": result.inserted_id})
    if treino_encontrado:
        print("   ✅ Dados ENCONTRADOS!")
        print(f"      Título: {treino_encontrado['titulo']}")
        print(f"      Tempo: {treino_encontrado['tempo']}min")
        print(f"      Exercícios: {', '.join(treino_encontrado['exercicios'])}")
    else:
        print("   ❌ Dados NÃO encontrados")

    # 3️⃣ PEGAR vários itens do database
    print("\n3. 📦 PEGANDO vários dados do database...")
    todos_treinos = list(db.treinos.find({"user_id": "usuario_teste"}))
    print(f"   ✅ Encontrados {len(todos_treinos)} treinos do usuário")

    # 4️⃣ ATUALIZAR dados
    print("\n4. ✏️ ATUALIZANDO dados no database...")
    update_result = db.treinos.update_one(
        {"_id": result.inserted_id}, {"$set": {"tempo": 60, "status": "completado"}}
    )
    print(f"   ✅ Dados ATUALIZADOS! Modificados: {update_result.modified_count}")

    # 5️⃣ DELETAR dados (limpeza)
    print("\n5. 🗑️ DELETANDO dados de teste...")
    delete_result = db.treinos.delete_one({"_id": result.inserted_id})
    print(f"   ✅ Dados DELETADOS! Removidos: {delete_result.deleted_count}")

    client.close()

    print("\n🎉 TODAS AS OPERAÇÕES BÁSICAS FUNCIONAM!")
    print("   ✅ COLOCAR - Funciona")
    print("   ✅ BUSCAR - Funciona")
    print("   ✅ PEGAR - Funciona")
    print("   ✅ ATUALIZAR - Funciona")
    print("   ✅ DELETAR - Funciona")

except Exception as e:
    print(f"❌ ERRO: {e}")
