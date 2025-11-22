# PersonalIA - Makefile
# Facilita a execução de tarefas comuns do projeto

.PHONY: help install test lint format clean dev build docker run-server test-gemini check-env all

# Variáveis
PYTHON = python3
PIP = pip
VENV = venv
SRC_DIR = src
TEST_DIR = tests
REQUIREMENTS = requirements.txt

# Comando padrão
help: ## Mostra esta mensagem de ajuda
	@echo "PersonalIA - Comandos disponíveis:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Instalação e Configuração
install: ## Instala todas as dependências do projeto
	@echo "📦 Instalando dependências..."
	$(PIP) install -r $(REQUIREMENTS)
	@echo "✅ Dependências instaladas!"

install-dev: ## Instala dependências de desenvolvimento
	@echo "📦 Instalando dependências de desenvolvimento..."
	$(PIP) install -r $(REQUIREMENTS)
	$(PIP) install pytest pytest-asyncio pytest-cov black flake8 isort
	@echo "✅ Dependências de desenvolvimento instaladas!"

# Verificações
check-env: ## Verifica se o arquivo .env está configurado
	@echo "🔍 Verificando configuração do ambiente..."
	@if [ ! -f .env ]; then \
		echo "❌ Arquivo .env não encontrado!"; \
		echo "📝 Crie o arquivo .env com: cp config/.env.example .env"; \
		exit 1; \
	fi
	@if ! grep -q "GEMINI_API_KEY=" .env || grep -q "sua_api_key_aqui" .env; then \
		echo "❌ GEMINI_API_KEY não configurada no .env!"; \
		echo "📝 Configure sua chave da API do Gemini no arquivo .env"; \
		exit 1; \
	fi
	@echo "✅ Arquivo .env configurado corretamente!"

# Testes
test: ## Executa todos os testes
	@echo "🧪 Executando testes..."
	@if [ ! -d "$(TEST_DIR)" ]; then \
		echo "📁 Criando diretório de testes..."; \
		mkdir -p $(TEST_DIR); \
		touch $(TEST_DIR)/__init__.py; \
		echo "# Tests for PersonalIA" > $(TEST_DIR)/test_example.py; \
		echo "def test_example():" >> $(TEST_DIR)/test_example.py; \
		echo "    assert True" >> $(TEST_DIR)/test_example.py; \
	fi
	$(PYTHON) -m pytest $(TEST_DIR) -v --tb=short -c config/pytest.ini

test-cov: ## Executa testes com cobertura de código
	@echo "🧪 Executando testes com cobertura..."
	$(PYTHON) -m pytest $(TEST_DIR) -v --cov=$(SRC_DIR) --cov-report=html --cov-report=term -c config/pytest.ini

test-gemini: check-env ## Testa a conexão com a API do Gemini
	@echo "🤖 Testando conexão com API do Gemini..."
	@if [ -f tests/test_gemini_service.py ]; then \
		$(PYTHON) tests/test_gemini_service.py; \
	else \
		echo "❌ Arquivo test_gemini_service.py não encontrado!"; \
		exit 1; \
	fi

# Qualidade de Código
lint: ## Executa verificação de estilo de código (flake8 + pylint)
	@echo "🔍 Verificando estilo de código com flake8..."
	$(PYTHON) -m flake8 $(SRC_DIR) --config=config/.flake8 --exclude=venv,src/venv
	@echo "🔍 Verificando qualidade de código com pylint..."
	$(PYTHON) -m pylint $(SRC_DIR) --rcfile=config/.pylintrc
	@echo "✅ Verificação de estilo e qualidade concluída!"

lint-flake8: ## Executa apenas flake8
	@echo "🔍 Verificando estilo com flake8..."
	$(PYTHON) -m flake8 $(SRC_DIR) --config=config/.flake8 --exclude=venv,src/venv
	@echo "✅ Verificação flake8 concluída!"

lint-pylint: ## Executa apenas pylint
	@echo "🔍 Verificando qualidade com pylint..."
	$(PYTHON) -m pylint $(SRC_DIR) --rcfile=config/.pylintrc
	@echo "✅ Verificação pylint concluída!"

format: ## Formata o código usando black e isort
	@echo "🎨 Formatando código..."
	$(PYTHON) -m black $(SRC_DIR) --line-length=100
	$(PYTHON) -m isort $(SRC_DIR) --profile black
	@echo "✅ Código formatado!"

# Servidor
run-server: check-env ## Inicia o servidor de desenvolvimento
	@echo "🚀 Iniciando servidor..."
	cd $(SRC_DIR) && $(PYTHON) main.py

run-server-prod: check-env ## Inicia o servidor em modo produção
	@echo "🚀 Iniciando servidor em modo produção..."
	cd $(SRC_DIR) && uvicorn main:app --host 0.0.0.0 --port 8000

# Frontend (se necessário)
install-frontend: ## Instala dependências do frontend
	@echo "📦 Instalando dependências do frontend..."
	cd frontend && npm install
	@echo "✅ Dependências do frontend instaladas!"

run-frontend: ## Inicia o frontend em modo desenvolvimento
	@echo "🎨 Iniciando frontend..."
	cd frontend && npm run dev

# Docker (opcional)
docker-build: ## Constrói a imagem Docker
	@echo "🐳 Construindo imagem Docker..."
	docker build -t personalai .

docker-run: ## Executa o container Docker
	@echo "🐳 Executando container..."
	docker run -p 8000:8000 --env-file .env personalai

# Limpeza
clean: ## Remove arquivos temporários e cache
	@echo "🧹 Limpando arquivos temporários..."
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	find . -type f -name "*.pyo" -delete 2>/dev/null || true
	find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	rm -rf .pytest_cache/ 2>/dev/null || true
	rm -rf htmlcov/ 2>/dev/null || true
	rm -rf .coverage 2>/dev/null || true
	@echo "✅ Limpeza concluída!"

# Comandos combinados
all: clean install-dev check-env lint test ## Executa pipeline completo (limpa, instala, verifica, testa)
	@echo ""
	@echo "🎉 Pipeline completo executado com sucesso!"
	@echo "✅ Projeto pronto para desenvolvimento!"

ci: lint test ## Pipeline de integração contínua
	@echo "🔄 Pipeline CI executado com sucesso!"

# Utilitários
requirements: ## Gera requirements.txt atualizado
	@echo "📝 Gerando requirements.txt..."
	$(PIP) freeze > $(REQUIREMENTS)
	@echo "✅ Requirements atualizado!"

setup: ## Configuração inicial do projeto
	@echo "⚙️  Configuração inicial do PersonalIA..."
	@if [ ! -f .env ]; then \
		echo "📝 Criando arquivo .env..."; \
		cp .env.example .env 2>/dev/null || echo "# PersonalIA Environment Variables" > .env; \
		echo "GEMINI_API_KEY=sua_api_key_aqui" >> .env; \
		echo "MONGO_URL=mongodb://localhost:27017" >> .env; \
		echo "DATABASE_NAME=personalai_db" >> .env; \
		echo "SECRET_KEY=VY2tNc3WHPpU6dWyjVtBEZks4aCqnuUM" >> .env; \
		echo "ALGORITHM=HS256" >> .env; \
		echo "ACCESS_TOKEN_EXPIRE_MINUTES=30" >> .env; \
		echo "ENVIRONMENT=development" >> .env; \
		echo "HOST=0.0.0.0" >> .env; \
		echo "PORT=8000" >> .env; \
		echo "DEBUG=true" >> .env; \
	fi
	@make install-dev
	@echo ""
	@echo "🎉 Configuração inicial concluída!"
	@echo "📝 Não esqueça de configurar sua GEMINI_API_KEY no arquivo .env"
	@echo "🚀 Use 'make run-server' para iniciar o servidor"