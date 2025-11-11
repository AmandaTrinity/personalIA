"""
Testes completos para as rotas de treino (treino_routes.py)
"""
import pytest
import sys
from pathlib import Path
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from bson import ObjectId

# Configuração de path para execução individual
if __name__ == "__main__":
    project_root = Path(__file__).parent.parent
    src_path = project_root / "src"
    sys.path.insert(0, str(project_root))
    sys.path.insert(0, str(src_path))

from main import app
from schemas import MensagemChat

client = TestClient(app)


class TestTreinoRoutes:
    """Testes para as rotas de treino"""

    @pytest.fixture
    def usuario_id(self):
        """Fixture para gerar um ID de usuário válido"""
        return str(ObjectId())

    @pytest.fixture
    def treino_data(self):
        """Fixture com dados válidos para treino"""
        return {
            "mensagem_usuario": "Quero um treino completo",
            "nivel": "intermediario",
            "objetivo": "ganho de massa",
            "equipamentos": ["halteres", "barra"],
            "frequencia": "4x por semana"
        }

    def test_criar_treino_sucesso(self, usuario_id, treino_data):
        """Testa criação de treino com sucesso"""
        with patch('routes.treino_routes.salvar_treino') as mock_salvar:
            mock_treino = {
                "_id": "mock_id",
                "usuario_id": usuario_id,
                "plano_gerado": "Plano de treino gerado",
                **treino_data
            }
            mock_salvar.return_value = mock_treino

            response = client.post(f"/treinos/{usuario_id}", json=treino_data)

            assert response.status_code == 200
            data = response.json()
            assert data["status"] == "ok"
            assert "treino" in data
            assert data["treino"]["usuario_id"] == usuario_id
            mock_salvar.assert_called_once()

    def test_criar_treino_erro(self, usuario_id, treino_data):
        """Testa criação de treino com erro na service"""
        with patch('routes.treino_routes.salvar_treino') as mock_salvar:
            mock_salvar.side_effect = Exception("Erro ao salvar treino")

            response = client.post(f"/treinos/{usuario_id}", json=treino_data)

            assert response.status_code == 500
            data = response.json()
            assert "detail" in data
            assert "Erro ao salvar treino" in data["detail"]

    def test_criar_treino_validacao_dados(self, usuario_id):
        """Testa validação de dados ao criar treino"""
        dados_invalidos = {
            "nivel": "intermediario"
            # Faltam campos obrigatórios
        }

        response = client.post(f"/treinos/{usuario_id}", json=dados_invalidos)

        # A validação do Pydantic retorna 422
        assert response.status_code == 422

    def test_listar_treinos_usuario_vazio(self, usuario_id):
        """Testa listagem de treinos quando usuário não tem treinos"""
        with patch('routes.treino_routes.listar_treinos_por_usuario') as mock_listar:
            mock_listar.return_value = []

            response = client.get(f"/treinos/{usuario_id}")

            assert response.status_code == 200
            data = response.json()
            assert data == []
            mock_listar.assert_called_once_with(usuario_id)

    def test_listar_treinos_usuario_com_treinos(self, usuario_id):
        """Testa listagem de treinos quando usuário tem múltiplos treinos"""
        treinos_mockados = [
            {
                "_id": str(ObjectId()),
                "nivel": "iniciante",
                "objetivo": "perda de peso",
                "equipamentos": ["esteira"],
                "plano_gerado": "Plano 1",
                "criado_em": "2025-01-01"
            },
            {
                "_id": str(ObjectId()),
                "nivel": "intermediario",
                "objetivo": "ganho de massa",
                "equipamentos": ["halteres"],
                "plano_gerado": "Plano 2",
                "criado_em": "2025-01-02"
            }
        ]

        with patch('routes.treino_routes.listar_treinos_por_usuario') as mock_listar:
            mock_listar.return_value = treinos_mockados

            response = client.get(f"/treinos/{usuario_id}")

            assert response.status_code == 200
            data = response.json()
            assert len(data) == 2
            assert data[0]["objetivo"] == "perda de peso"
            assert data[1]["objetivo"] == "ganho de massa"
            mock_listar.assert_called_once_with(usuario_id)

    def test_listar_treinos_usuario_diferentes_ids(self):
        """Testa listagem com IDs de usuários diferentes"""
        usuario_id_1 = str(ObjectId())
        usuario_id_2 = str(ObjectId())

        with patch('routes.treino_routes.listar_treinos_por_usuario') as mock_listar:
            mock_listar.side_effect = lambda uid: [] if uid == usuario_id_2 else [
                {"_id": str(ObjectId()), "objetivo": "teste"}
            ]

            response1 = client.get(f"/treinos/{usuario_id_1}")
            response2 = client.get(f"/treinos/{usuario_id_2}")

            assert response1.status_code == 200
            assert response2.status_code == 200
            assert len(response1.json()) == 1
            assert len(response2.json()) == 0

    def test_criar_treino_exception_generica(self, usuario_id, treino_data):
        """Testa criação de treino com exceção genérica"""
        with patch('routes.treino_routes.salvar_treino') as mock_salvar:
            mock_salvar.side_effect = ValueError("Erro de validação")

            response = client.post(f"/treinos/{usuario_id}", json=treino_data)

            assert response.status_code == 500
            assert "detail" in response.json()


if __name__ == "__main__":
    """Permite execução individual do arquivo de teste"""
    print("🧪 Executando testes de treino_routes...")
    pytest.main([__file__, "-v"])
