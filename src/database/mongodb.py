import multiprocessing
import os
import ssl
import sys
from datetime import datetime
import certifi
from pymongo.errors import ConnectionFailure
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

from config.settings import settings

# Carregar configurações da aplicação
uri = settings.MONGO_URI
database_name = settings.DATABASE_NAME

# Verificar se estamos em ambiente de teste
is_testing = settings.is_testing
is_main_process = True

# Flags para evitar inicialização dupla
_mongodb_initialized = False
_connection_created = False

# Variáveis globais para conexão
client = None
db = None
usuarios_collection = None
treinos_collection = None
historico_collection = None

if not uri and not is_testing:
    raise ValueError(
        "❌ MONGO_URI não configurada no arquivo .env! Por favor, configure a variável de ambiente."
    )

def create_mongodb_client():
    """Cria cliente MongoDB com diferentes estratégias de conexão"""


    # Detectar contexto do processo para logs mais informativos
    process_info = f"(PID: {os.getpid()})"


    # Estratégia 1: Conexão padrão com certificados do sistema
    try:
        print(f"🔄 Tentando conexão padrão... {process_info}")
        client = MongoClient(
            uri,
            server_api=ServerApi("1"),
            serverSelectionTimeoutMS=10000,
            connectTimeoutMS=10000,
            tlsAllowInvalidCertificates=False,
        )
        # Teste de conexão
        client.admin.command("ping")
        print("✅ Conexão padrão bem-sucedida!")
        return client, database_name
    except Exception as e:
        print(f"❌ Conexão padrão falhou: {type(e).__name__}")


    # Estratégia 2: Usar certificados do certifi (padrão para muitos ambientes)
    try:
        print("🔄 Tentando com certificados certifi...")
        client = MongoClient(
            uri,
            server_api=ServerApi("1"),
            serverSelectionTimeoutMS=10000,
            connectTimeoutMS=10000,
            tlsCAFile=certifi.where(),
            tlsAllowInvalidCertificates=False,
        )
        client.admin.command("ping")
        print("✅ Conexão com certificados certifi bem-sucedida!")
        return client, database_name
    except Exception as e:
        print(f"❌ Conexão com certificados certifi falhou: {type(e).__name__}")

    # Estratégia 3: Sem verificação SSL (apenas para desenvolvimento/teste)
    try:
        print("🔄 Tentando conexão mínima...")
        client = MongoClient(
            uri,
            server_api=ServerApi("1"),
            serverSelectionTimeoutMS=10000,
            connectTimeoutMS=10000,
            ssl=True,
            ssl_cert_reqs=ssl.CERT_NONE,
            tlsAllowInvalidCertificates=True,
        )
        client.admin.command("ping")
        print("✅ Conexão mínima bem-sucedida!")
        return client, database_name
    except Exception as e:
        print(f"❌ Conexão mínima falhou: {type(e).__name__}")

    # Se todas falharam
    raise ConnectionError(
        "❌ Não foi possível conectar ao MongoDB Atlas.\n"
        "💡 Possíveis soluções:\n"
        "1. Verifique se seu IP está na whitelist do MongoDB Atlas\n"
        "2. Tente usar uma rede diferente (ex: mobile hotspot)\n"
        "3. Verifique se as credenciais estão corretas\n"
        "4. Atualize o Python e dependências: pip install --upgrade pymongo certifi\n"
        "5. Configure o firewall/proxy da sua rede"
    )


def setup_mongodb():
    """Configura o MongoDB, cria collections e índices iniciais."""
    global _mongodb_initialized

    if _mongodb_initialized:
        print("✅ MongoDB já foi inicializado anteriormente")
        return

    try:
        print("🔧 Configurando MongoDB...")

        if client is None or db is None:
            print("⚠️ Cliente MongoDB não disponível, pulando configuração")
            return

        # --- Índices úteis ---
        usuarios_collection.create_index("email", unique=True)
        treinos_collection.create_index("usuario_id")
        historico_collection.create_index([("usuario_id", 1), ("treino_id", 1)])

        # --- Documento de inicialização opcional ---
        if "meta" not in db.list_collection_names():
            db.create_collection("meta")
            db["meta"].insert_one(
                {
                    "app": "PersonalAI",
                    "versao": "1.0.0",
                    "criado_em": datetime.utcnow(),
                    "descricao": "Banco inicial do PersonalAI - IA de treino personalizada",
                }
            )

        print("📦 Collections e índices criados com sucesso!")
        print(f"🗃️ Collections existentes: {db.list_collection_names()}")

        _mongodb_initialized = True

    except ConnectionFailure as e:
        print("❌ Falha ao conectar ao MongoDB!")
        print(f"Detalhes: {e}")
    except Exception as e:
        print("⚠️ Erro durante a configuração:")
        print(e)


# Criar conexão apenas se não estivermos em ambiente de teste E se for processo apropriado
if not is_testing and uri and not _connection_created:
    try:
        _connection_created = True
        process_info = f"(PID: {os.getpid()}, Main: {is_main_process})"

        # Só conectar se for o processo worker ou se não estivermos em modo reload
        if not is_main_process or not any("reload" in str(arg) for arg in sys.argv):
            client, db_name = create_mongodb_client()
            db = client[db_name]
            print(f"🎯 Conectado ao banco: {db_name} {process_info}")

            # Criar as collections principais
            usuarios_collection = db["usuarios"]
            treinos_collection = db["treinos"]
            historico_collection = db["historico_acessos"]

            # Preparar collections e índices
            setup_mongodb()
        else:
            print(f"⏸️ Pulando conexão DB no processo reloader {process_info}")
            client = None
            db = None
            usuarios_collection = None
            treinos_collection = None
            historico_collection = None

    except Exception as e:
        print(f"💥 Erro fatal: {e}")
        # Para desenvolvimento, vamos criar um cliente mock
        print("⚠️  Usando modo de desenvolvimento sem MongoDB")
        client = None
        db = None
        usuarios_collection = None
        treinos_collection = None
        historico_collection = None
elif is_testing or not uri:
    # Ambiente de teste ou sem URI - usar mocks
    if not _connection_created:
        print(f"🧪 Ambiente de teste detectado - usando mocks (PID: {os.getpid()})")
        _connection_created = True
else:
    # Conexão já foi criada anteriormente
    if _connection_created:
        print(f"✅ Conexão MongoDB já estabelecida anteriormente (PID: {os.getpid()})")
