#!/usr/bin/env python3
"""
Script para testar a API PersonalIA com IDs válidos
"""

import requests
import json
from bson import ObjectId

# Configuração
BASE_URL = "http://localhost:8000"

def test_api():
    print("🧪 Testando API PersonalIA")
    print("=" * 50)
    
    # Gerar um ID válido para MongoDB
    test_user_id = str(ObjectId())
    print(f"📝 ID de teste gerado: {test_user_id}")
    
    # 1. Testar GET (listar treinos) - deve retornar lista vazia
    print("\n1️⃣ Testando GET /treinos/{usuario_id}")
    try:
        response = requests.get(f"{BASE_URL}/treinos/{test_user_id}")
        print(f"Status: {response.status_code}")
        print(f"Resposta: {response.json()}")
    except Exception as e:
        print(f"❌ Erro no GET: {e}")
    
    # 2. Testar POST (criar treino)
    print("\n2️⃣ Testando POST /treinos/{usuario_id}")
    
    treino_data = {
        "nivel": "iniciante",
        "objetivo": "perda de peso",
        "equipamentos": ["halteres", "esteira"],  # Array como você queria
        "frequencia": "3x por semana",
        "mensagem_usuario": "Quero um treino para perder peso e ganhar condicionamento"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/treinos/{test_user_id}",
            json=treino_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Treino criado com sucesso!")
            print(f"ID do treino: {result.get('_id', 'N/A')}")
            print(f"Plano gerado: {result.get('plano_gerado', 'N/A')[:100]}...")
        else:
            print(f"❌ Erro: {response.text}")
    except Exception as e:
        print(f"❌ Erro no POST: {e}")
    
    # 3. Testar GET novamente (agora deve ter o treino)
    print("\n3️⃣ Testando GET novamente (deve mostrar o treino criado)")
    try:
        response = requests.get(f"{BASE_URL}/treinos/{test_user_id}")
        print(f"Status: {response.status_code}")
        treinos = response.json()
        print(f"Quantidade de treinos: {len(treinos)}")
        if treinos:
            print(f"Primeiro treino: {treinos[0].get('objetivo', 'N/A')}")
    except Exception as e:
        print(f"❌ Erro no segundo GET: {e}")

    # 4. IDs de exemplo para teste manual
    print("\n" + "=" * 50)
    print("📋 IDs de exemplo para teste manual:")
    print(f"   Usuário 1: {test_user_id}")
    print(f"   Usuário 2: {str(ObjectId())}")
    print(f"   Usuário 3: {str(ObjectId())}")
    
    print("\n🔗 URLs para teste:")
    print(f"   GET:  {BASE_URL}/treinos/{test_user_id}")
    print(f"   POST: {BASE_URL}/treinos/{test_user_id}")

if __name__ == "__main__":
    test_api()