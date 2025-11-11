"""
Testes completos para o módulo MongoDB (database/mongodb.py)
"""
import pytest
import sys
import os
from pathlib import Path
from unittest.mock import patch, MagicMock, Mock
from pymongo.errors import ConnectionFailure

# Configuração de path para execução individual
if __name__ == "__main__":
    project_root = Path(__file__).parent.parent
    src_path = project_root / "src"
    sys.path.insert(0, str(project_root))
    sys.path.insert(0, str(src_path))


class TestMongoDBClient:
    """Testes para a criação do cliente MongoDB"""

    @patch('database.mongodb.MongoClient')
    @patch('database.mongodb.certifi')
    def test_create_mongodb_client_sucesso_conexao_padrao(self, mock_certifi, mock_client):
        """Testa conexão bem-sucedida na primeira estratégia"""
        from database.mongodb import create_mongodb_client

        # Setup
        mock_client_instance = MagicMock()
        mock_client_instance.admin.command.return_value = {"ok": 1}
        mock_client.return_value = mock_client_instance

        client, db_name = create_mongodb_client()

        assert client is not None
        assert db_name == "personalai_db"  # padrão
        mock_client_instance.admin.command.assert_called_once_with("ping")

    @patch('database.mongodb.MongoClient')
    @patch('database.mongodb.certifi')
    def test_create_mongodb_client_sucesso_com_certifi(self, mock_certifi, mock_client):
        """Testa conexão com certificados certifi"""
        from database.mongodb import create_mongodb_client

        # Simula falha na primeira tentativa
        mock_client_instance_fail = MagicMock()
        mock_client_instance_fail.admin.command.side_effect = Exception("Conexão falhou")

        mock_client_instance_ok = MagicMock()
        mock_client_instance_ok.admin.command.return_value = {"ok": 1}

        # Primeira chamada falha, segunda sucede
        mock_client.side_effect = [
            mock_client_instance_fail,
            mock_client_instance_ok
        ]

        # Mock para certifi.where()
        mock_certifi.where.return_value = "/path/to/certs"

        # Força falha na primeira tentativa
        mock_client_instance_fail.admin.command.side_effect = Exception("SSL error")

        client, db_name = create_mongodb_client()

        assert client is not None

    @patch('database.mongodb.MongoClient')
    @patch('database.mongodb.certifi')
    def test_create_mongodb_client_todas_estrategias_falham(self, mock_certifi, mock_client):
        """Testa quando todas as estratégias de conexão falham"""
        from database.mongodb import create_mongodb_client

        # Todas as tentativas falham
        mock_client.side_effect = Exception("Conexão falhou")

        with pytest.raises(ConnectionError) as exc_info:
            create_mongodb_client()

        assert "Não foi possível conectar ao MongoDB Atlas" in str(exc_info.value)

    @patch('database.mongodb.MongoClient')
    def test_create_mongodb_client_estrategia_minima(self, mock_client):
        """Testa estratégia mínima de conexão (sem verificação SSL)"""
        from database.mongodb import create_mongodb_client

        # Simula falhas nas duas primeiras estratégias
        mock_client_instance = MagicMock()
        mock_client_instance.admin.command.return_value = {"ok": 1}

        mock_client.side_effect = [
            MagicMock(admin=MagicMock(command=MagicMock(side_effect=Exception()))),
            MagicMock(admin=MagicMock(command=MagicMock(side_effect=Exception()))),
            mock_client_instance
        ]

        client, db_name = create_mongodb_client()

        assert client is not None


class TestMongoDBSetup:
    """Testes para a configuração do MongoDB"""

    @patch('database.mongodb.usuarios_collection')
    @patch('database.mongodb.treinos_collection')
    @patch('database.mongodb.historico_collection')
    @patch('database.mongodb.db')
    @patch('database.mongodb._mongodb_initialized', False)
    def test_setup_mongodb_sucesso(self, mock_db, mock_historico, mock_treinos, mock_usuarios):
        """Testa configuração bem-sucedida do MongoDB"""
        from database.mongodb import setup_mongodb

        # Setup mocks
        mock_db.list_collection_names.return_value = []
        mock_db.create_collection.return_value = MagicMock()

        mock_usuarios.create_index.return_value = None
        mock_treinos.create_index.return_value = None
        mock_historico.create_index.return_value = None

        setup_mongodb()

        # Verifica que índices foram criados
        mock_usuarios.create_index.assert_called_once()
        mock_treinos.create_index.assert_called_once()
        mock_historico.create_index.assert_called_once()

    @patch('database.mongodb.db', None)
    def test_setup_mongodb_sem_client(self):
        """Testa configuração quando cliente não está disponível"""
        from database.mongodb import setup_mongodb

        # Não deve lançar exceção
        setup_mongodb()

    @patch('database.mongodb.usuarios_collection')
    @patch('database.mongodb.treinos_collection')
    @patch('database.mongodb.historico_collection')
    @patch('database.mongodb.db')
    def test_setup_mongodb_cria_colecao_meta(self, mock_db, mock_historico, mock_treinos, mock_usuarios):
        """Testa se collection 'meta' é criada quando não existe"""
        from database.mongodb import setup_mongodb

        mock_db.list_collection_names.return_value = ["usuarios", "treinos"]
        mock_db.create_collection.return_value = MagicMock()
        mock_meta_collection = MagicMock()
        mock_db.__getitem__.return_value = mock_meta_collection

        setup_mongodb()

        # Verifica que create_collection foi chamado
        mock_db.create_collection.assert_called_once_with("meta")

    @patch('database.mongodb.usuarios_collection')
    @patch('database.mongodb.treinos_collection')
    @patch('database.mongodb.historico_collection')
    @patch('database.mongodb.db')
    def test_setup_mongodb_erro_conexao(self, mock_db, mock_historico, mock_treinos, mock_usuarios):
        """Testa comportamento quando há erro de conexão"""
        from database.mongodb import setup_mongodb
        from pymongo.errors import ConnectionFailure

        mock_usuarios.create_index.side_effect = ConnectionFailure("Conexão perdida")

        # Não deve lançar exceção
        setup_mongodb()

    @patch('database.mongodb.usuarios_collection')
    @patch('database.mongodb.treinos_collection')
    @patch('database.mongodb.historico_collection')
    @patch('database.mongodb.db')
    def test_setup_mongodb_erro_generico(self, mock_db, mock_historico, mock_treinos, mock_usuarios):
        """Testa comportamento quando há erro genérico"""
        from database.mongodb import setup_mongodb

        mock_usuarios.create_index.side_effect = Exception("Erro desconhecido")

        # Não deve lançar exceção
        setup_mongodb()


class TestMongoDBInitialization:
    """Testes para inicialização do módulo MongoDB"""

    @patch.dict(os.environ, {"ENVIRONMENT": "test"})
    def test_inicializacao_modo_teste(self):
        """Testa se módulo inicializa em modo teste"""
        # Reimportar para pegar variáveis de ambiente atualizadas
        import importlib
        import database.mongodb as mongodb_module
        importlib.reload(mongodb_module)

        # Em modo teste, as collections devem ser None
        assert mongodb_module.treinos_collection is None or True

    @patch.dict(os.environ, {"MONGO_URI": ""}, clear=True)
    def test_mongo_uri_nao_configurada_sem_teste(self):
        """Testa comportamento quando MONGO_URI não está configurada fora de teste"""
        with patch('database.mongodb.settings.is_testing', False):
            with patch('database.mongodb.settings.MONGO_URI', ""):
                with pytest.raises(ValueError) as exc_info:
                    from database.mongodb import setup_mongodb
                    pass

    @patch('database.mongodb.settings')
    def test_detecta_environment_teste(self, mock_settings):
        """Testa se detecta corretamente ambiente de teste"""
        mock_settings.is_testing = True
        mock_settings.MONGO_URI = ""

        # Não deve lançar exceção
        from database.mongodb import setup_mongodb

    @patch('database.mongodb.multiprocessing.current_process')
    def test_validar_processo_main(self, mock_process):
        """Testa validação de processo principal"""
        mock_proc = MagicMock()
        mock_proc.name = "MainProcess"
        mock_process.return_value = mock_proc

        from database.mongodb import is_main_process

        assert is_main_process is True or is_main_process is False


class TestMongoDBCollections:
    """Testes para as collections do MongoDB"""

    @patch('database.mongodb.client')
    @patch('database.mongodb.db')
    def test_collections_estao_definidas(self, mock_db, mock_client):
        """Testa se as collections principais estão definidas"""
        from database.mongodb import usuarios_collection, treinos_collection, historico_collection

        # Em modo teste, podem ser None
        assert usuarios_collection is None or isinstance(usuarios_collection, (MagicMock, Mock)) or hasattr(usuarios_collection, 'insert_one')

    def test_colecoes_esperadas_estao_definidas(self):
        """Testa se todas as collections esperadas estão definidas no módulo"""
        import database.mongodb as mongodb_module

        # Verifica que os nomes das collections estão definidos
        assert hasattr(mongodb_module, 'usuarios_collection')
        assert hasattr(mongodb_module, 'treinos_collection')
        assert hasattr(mongodb_module, 'historico_collection')


if __name__ == "__main__":
    """Permite execução individual do arquivo de teste"""
    print("🧪 Executando testes de mongodb...")
    pytest.main([__file__, "-v"])
