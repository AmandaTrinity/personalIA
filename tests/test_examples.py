#!/usr/bin/env python3
"""
Script simples para testar a API PersonalIA com curl
"""

print("🧪 Comandos para testar a API PersonalIA")
print("=" * 50)

# IDs de exemplo (formato MongoDB ObjectId)
test_ids = [
    "507f1f77bcf86cd799439011",
    "507f1f77bcf86cd799439012", 
    "507f1f77bcf86cd799439013"
]

print("📋 IDs de teste válidos:")
for i, test_id in enumerate(test_ids, 1):
    print(f"   Usuário {i}: {test_id}")

print("\n🔗 Comandos curl para teste:")
print("\n1️⃣ GET - Listar treinos de um usuário:")
for i, test_id in enumerate(test_ids[:1], 1):
    print(f'curl -X GET "http://localhost:8000/treinos/{test_id}"')

print("\n2️⃣ POST - Criar novo treino:")
test_id = test_ids[0]
curl_post = f'''curl -X POST "http://localhost:8000/treinos/{test_id}" \\
     -H "Content-Type: application/json" \\
     -d '{{
       "nivel": "iniciante",
       "objetivo": "perda de peso", 
       "equipamentos": ["halteres", "esteira"],
       "frequencia": "3x por semana",
       "mensagem_usuario": "Quero um treino para perder peso"
     }}\''''

print(curl_post)

print("\n3️⃣ URLs para teste no browser:")
print(f"   Health check: http://localhost:8000/health")
print(f"   Documentação: http://localhost:8000/docs")
for test_id in test_ids[:2]:
    print(f"   Treinos usuário: http://localhost:8000/treinos/{test_id}")

print(f"\n💡 Dica: Use um dos IDs acima nos endpoints da API")
print(f"💡 A documentação interativa está em: http://localhost:8000/docs")