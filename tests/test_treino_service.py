"""
Testes completos para o serviço de treino (treino_service.py)
"""
import pytest
import sys
from pathlib import Path
from unittest.mock import patch, MagicMock
from datetime import datetime
from bson import ObjectId

# Configuração de path para execução individual
if __name__ == "__main__":
    project_root = Path(__file__).parent.parent
    src_path = project_root / "src"
    sys.path.insert(0, str(project_root))
    sys.path.insert(0, str(src_path))

from schemas import MensagemChat


class TestTreinoService:
    """Testes para o serviço de treino"""

    @pytest.fixture
    def mensagem_chat(self):
        """Fixture com dados válidos para MensagemChat"""
        return MensagemChat(
            mensagem_usuario="Quero um treino para ganhar massa",
            nivel="intermediario",
            objetivo="ganho de massa",
            equipamentos=["halteres", "barra"],
            frequencia="4x por semana"
        )

    @pytest.fixture
    def usuario_id(self):
        """Fixture para gerar um ID de usuário válido"""
        return str(ObjectId())

    @patch('services.treino_service.gerar_plano_de_treino')
    @patch('services.treino_service.treinos_collection')
    def test_salvar_treino_com_collection(self, mock_collection, mock_gerar_plano, mensagem_chat, usuario_id):
        """Testa salvamento de treino com collection disponível"""
        from services.treino_service import salvar_treino

        mock_plano = "Plano de treino gerado com sucesso"
        mock_gerar_plano.return_value = mock_plano

        mock_insert_result = MagicMock()
        mock_insert_result.inserted_id = ObjectId()
        mock_collection.insert_one.return_value = mock_insert_result

        resultado = salvar_treino(usuario_id, mensagem_chat)

        assert resultado is not None
        assert "_id" in resultado
        assert resultado["usuario_id"] == usuario_id
        assert resultado["plano_gerado"] == mock_plano
        assert "criado_em" in resultado
        mock_collection.insert_one.assert_called_once()
        mock_gerar_plano.assert_called_once_with(mensagem_chat)

    @patch('services.treino_service.gerar_plano_de_treino')
    @patch('services.treino_service.treinos_collection', None)
    def test_salvar_treino_sem_collection(self, mock_gerar_plano, mensagem_chat, usuario_id):
        """Testa salvamento de treino sem collection (modo mock)"""
        from services.treino_service import salvar_treino

        mock_plano = "Plano de treino em modo mock"
        mock_gerar_plano.return_value = mock_plano

        resultado = salvar_treino(usuario_id, mensagem_chat)

        assert resultado is not None
        assert resultado["_id"] == "mock_id"
        assert resultado["usuario_id"] == usuario_id
        assert resultado["plano_gerado"] == mock_plano

    @patch('services.treino_service.gerar_plano_de_treino')
    @patch('services.treino_service.treinos_collection')
    def test_salvar_treino_erro_insert(self, mock_collection, mock_gerar_plano, mensagem_chat, usuario_id):
        """Testa salvamento com erro no insert"""
        from services.treino_service import salvar_treino

        mock_plano = "Plano de treino"
        mock_gerar_plano.return_value = mock_plano
        mock_collection.insert_one.side_effect = Exception("Erro de conexão")

        resultado = salvar_treino(usuario_id, mensagem_chat)

        # Mesmo com erro, a função retorna o documento (sem _id)
        assert resultado is not None
        assert resultado["usuario_id"] == usuario_id

    @patch('services.treino_service.treinos_collection')
    def test_listar_treinos_por_usuario_vazio(self, mock_collection, usuario_id):
        """Testa listagem quando não há treinos"""
        from services.treino_service import listar_treinos_por_usuario

        mock_collection.find.return_value.sort.return_value = []

        resultado = listar_treinos_por_usuario(usuario_id)

        assert resultado == []
        mock_collection.find.assert_called_once()

    @patch('services.treino_service.treinos_collection')
    def test_listar_treinos_por_usuario_com_treinos(self, mock_collection, usuario_id):
        """Testa listagem com múltiplos treinos"""
        from services.treino_service import listar_treinos_por_usuario

        treinos_mock = [
            {
                "_id": ObjectId(),
                "usuario_id": ObjectId(usuario_id),
                "nivel": "iniciante",
                "objetivo": "perda de peso",
                "equipamentos": ["esteira"],
                "plano_gerado": "Plano 1",
                "criado_em": datetime.utcnow()
            },
            {
                "_id": ObjectId(),
                "usuario_id": ObjectId(usuario_id),
                "nivel": "intermediario",
                "objetivo": "ganho de massa",
                "equipamentos": ["halteres"],
                "plano_gerado": "Plano 2",
                "criado_em": datetime.utcnow()
            }
        ]

        mock_find = MagicMock()
        mock_find.sort.return_value = treinos_mock
        mock_collection.find.return_value = mock_find

        resultado = listar_treinos_por_usuario(usuario_id)

        assert len(resultado) == 2
        assert resultado[0]["objetivo"] == "perda de peso"
        assert resultado[1]["objetivo"] == "ganho de massa"
        assert all("_id" in t for t in resultado)
        assert all("usuario_id" in t for t in resultado)

    @patch('services.treino_service.treinos_collection', None)
    def test_listar_treinos_sem_collection(self, usuario_id):
        """Testa listagem sem collection (modo mock)"""
        from services.treino_service import listar_treinos_por_usuario

        resultado = listar_treinos_por_usuario(usuario_id)

        assert resultado == []

    @patch('services.treino_service.treinos_collection')
    def test_buscar_treino_por_id_encontrado(self, mock_collection, usuario_id):
        """Testa busca de treino por ID quando encontrado"""
        from services.treino_service import buscar_treino_por_id

        treino_id = str(ObjectId())
        treino_mock = {
            "_id": ObjectId(treino_id),
            "usuario_id": ObjectId(usuario_id),
            "nivel": "intermediario",
            "objetivo": "ganho de massa",
            "equipamentos": ["halteres"],
            "plano_gerado": "Plano de treino",
            "criado_em": datetime.utcnow()
        }

        mock_collection.find_one.return_value = treino_mock

        resultado = buscar_treino_por_id(treino_id)

        assert resultado is not None
        assert resultado["_id"] == treino_id
        assert resultado["usuario_id"] == usuario_id
        mock_collection.find_one.assert_called_once()

    @patch('services.treino_service.treinos_collection')
    def test_buscar_treino_por_id_nao_encontrado(self, mock_collection):
        """Testa busca de treino por ID quando não encontrado"""
        from services.treino_service import buscar_treino_por_id

        treino_id = str(ObjectId())
        mock_collection.find_one.return_value = None

        resultado = buscar_treino_por_id(treino_id)

        assert resultado is None
        mock_collection.find_one.assert_called_once()

    @patch('services.treino_service.treinos_collection', None)
    def test_buscar_treino_sem_collection(self):
        """Testa busca de treino sem collection (modo mock)"""
        from services.treino_service import buscar_treino_por_id

        treino_id = str(ObjectId())
        resultado = buscar_treino_por_id(treino_id)

        assert resultado is None

    @patch('services.treino_service.treinos_collection')
    def test_listar_treinos_formata_ids(self, mock_collection, usuario_id):
        """Testa se IDs são formatados como strings corretamente"""
        from services.treino_service import listar_treinos_por_usuario

        treino_id = ObjectId()
        treinos_mock = [
            {
                "_id": treino_id,
                "usuario_id": ObjectId(usuario_id),
                "nivel": "iniciante",
                "objetivo": "teste",
                "equipamentos": ["peso corporal"],
                "plano_gerado": "Plano",
                "criado_em": datetime.utcnow()
            }
        ]

        mock_find = MagicMock()
        mock_find.sort.return_value = treinos_mock
        mock_collection.find.return_value = mock_find

        resultado = listar_treinos_por_usuario(usuario_id)

        assert isinstance(resultado[0]["_id"], str)
        assert isinstance(resultado[0]["usuario_id"], str)
        assert resultado[0]["_id"] == str(treino_id)

    @patch('services.treino_service.gerar_plano_de_treino')
    @patch('services.treino_service.treinos_collection')
    def test_salvar_treino_converte_usuario_id_para_objectid(self, mock_collection, mock_gerar_plano, mensagem_chat, usuario_id):
        """Testa se usuario_id é convertido para ObjectId corretamente"""
        from services.treino_service import salvar_treino

        mock_plano = "Plano"
        mock_gerar_plano.return_value = mock_plano

        mock_insert_result = MagicMock()
        mock_insert_result.inserted_id = ObjectId()
        mock_collection.insert_one.return_value = mock_insert_result

        resultado = salvar_treino(usuario_id, mensagem_chat)

        # Verifica que insert_one foi chamado
        called_doc = mock_collection.insert_one.call_args[0][0]
        assert "usuario_id" in called_doc
        # Se treinos_collection é not None, usuario_id deve ser ObjectId
        assert isinstance(called_doc["usuario_id"], ObjectId)


if __name__ == "__main__":
    """Permite execução individual do arquivo de teste"""
    print("🧪 Executando testes de treino_service...")
    pytest.main([__file__, "-v"])
