#!/usr/bin/env python3
"""
Script para testar a conexão com MongoDB Atlas
"""

import os
import sys
from pathlib import Path

# Adicionar o diretório raiz ao path para imports
root_dir = Path(__file__).parent
sys.path.append(str(root_dir))

# Carregar variáveis de ambiente
from dotenv import load_dotenv
load_dotenv()

try:
    from src.database.mongodb import client, db
    
    print("🔍 Testando conexão com MongoDB...")
    
    # Teste de ping
    client.admin.command("ping")
    print("✅ Conectado ao MongoDB Atlas!")
    
    # Teste básico de operação
    test_collection = db.test_connection
    
    # Inserir um documento de teste
    test_doc = {"test": "connection", "timestamp": "2024-01-01"}
    result = test_collection.insert_one(test_doc)
    print(f"✅ Documento inserido com ID: {result.inserted_id}")
    
    # Buscar o documento
    found_doc = test_collection.find_one({"_id": result.inserted_id})
    if found_doc:
        print("✅ Documento encontrado com sucesso!")
    
    # Limpar o teste
    test_collection.delete_one({"_id": result.inserted_id})
    print("✅ Teste limpo com sucesso!")
    
    print("🎉 Todas as operações MongoDB funcionaram!")

except Exception as e:
    print(f"❌ Erro na conexão MongoDB: {e}")
    print("\n💡 Possíveis soluções:")
    print("1. Verifique se MONGO_URI está correta no .env")
    print("2. Confirme se seu IP está na whitelist do MongoDB Atlas")
    print("3. Verifique se as credenciais estão corretas")
    print("4. Tente usar uma conexão diferente (ex: mobile hotspot)")
    sys.exit(1)

finally:
    if 'client' in locals():
        client.close()
        print("🔌 Conexão MongoDB fechada.")