from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

"""
Testes para o signup de usuários
"""
import pytest
import sys
from pathlib import Path

# Configuração de path para execução individual
if __name__ == "__main__":
    project_root = Path(__file__).parent.parent
    src_path = project_root / "src"
    sys.path.insert(0, str(project_root))
    sys.path.insert(0, str(src_path))

class TestSignup:
    """Testes para validação de signup"""

    def test_user_signup_and_get(self):
        payload = {
            "email_usuario": "bvga@cin.ufpe.br",
            "nome_usuario": "Brenda",
            "idade_usuario": 24,
            "peso_usuario": 60,
            "altura_usuario": 175,
            "limitacoes_usuario": False,
            "dias_usuario": 3,
            "minutos_usuario": 30,
            "senha_usuario": "s3nh@s",
            "lugar_usuario": "apartamento"
        }

        # POST /usuario/cadastro
        response = client.post("/usuario/cadastro", json=payload)
        assert response.status_code in (200, 201, 409)
        data = response.json()
        assert "status" in data
        assert "usuario" in data

        # Verifica se a senha não está exposta
        usuario = data["usuario"]
        assert "senha_hash" not in usuario

        # GET /usuario/cadastro
        response_get = client.get(f"/usuario/cadastro?email={payload['email_usuario']}")
        assert response_get.status_code in (200, 404)
        
if __name__ == "__main__":
    """Permite execução individual do arquivo de teste"""
    print("🧪 Executando testes de signup...")

    test_instance = TestSignup()

    try:
        test_instance.test_user_signup_and_get()
        print("✅ test_user_signup_and_get passou")
    except Exception as e:
        print(f"❌ test_user_signup_and_get falhou: {e}")
    print("🎉 Testes de signup concluídos!")