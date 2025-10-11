# 🏋️‍♂️ PersonalIA  

O **PersonalIA** é um projeto que ├── .env.example               # 🔧 Modelo de configuração segura
├── .env                       # 🔒 Variáveis de ambiente (não commitado)
├── .gitignore                 # 🚫 Arquivos ignorados pelo Git
├── .pylintrc                  # ⚙️ Configuração do Pylint
├── .flake8                    # 📏 Configuração do Flake8
├── pytest.ini                # 🧪 Configuração dos testes
├── Makefile                   # 🔨 Automação de comandos
├── run_tests.py               # 🏃 Script para execução de testes
├── list_models.py             # 📋 Utilitário para listar modelos Gemini
├── README.md                  # 📚 Documentação do projeto
└── pyproject.toml             # 📋 Configuração do projeto Python*Inteligência Artificial** para oferecer planos de treino personalizados sem necessidade de equipamentos de academia. O objetivo é tornar o acesso ao fitness mais acessível, adaptando os treinos ao perfil do usuário e ao seu progresso.  

---

## 🚀 Funcionalidades  
- Geração de planos de treino personalizados via IA.  
- Treinos adaptados para casa, sem equipamentos.  
- Feedback adaptativo e recomendações inteligentes.  
- Estrutura modular para escalabilidade futura.  

---

## 🏛️ Arquitetura do Projeto

O PersonalIA segue uma arquitetura **Full-Stack** moderna com separação clara entre frontend e backend:

```bash
PersonalIA/
│
├── frontend/                  # 🎨 Interface do usuário (React + TypeScript)
│   ├── public/
│   │   └── index.html         # Template HTML principal
│   ├── src/
│   │   ├── App.tsx            # Componente principal da aplicação
│   │   ├── main.tsx           # Ponto de entrada do React
│   │   └── styles/            # Estilos CSS da aplicação
│   ├── package.json           # Dependências e scripts do frontend
│   ├── vite.config.ts         # Configuração do Vite (build tool)
│   └── tsconfig.json          # Configuração do TypeScript
│
├── src/                       # 🖥️ Backend (FastAPI + MongoDB)
│   ├── routes/
│   │   └── treino_routes.py   # Rotas da API de treinos
│   ├── services/
│   │   └── gemini_service.py  # Integração com IA Gemini
│   ├── database/
│   │   ├── mongodb.py         # Configuração segura do MongoDB
│   │   └── test_mongodb.py    # Testes de conexão do banco
│   ├── config/                # Configurações da aplicação (estrutura futura)
│   ├── models/                # Modelos de dados (estrutura futura)
│   ├── schemas/               # Schemas Pydantic (estrutura futura)
│   ├── utils/                 # Utilitários gerais (estrutura futura)
│   ├── exceptions/            # Tratamento de exceções (estrutura futura)
│   ├── schemas.py             # Schemas Pydantic centralizados
│   └── main.py                # Servidor FastAPI principal
│
├── tests/                     # 🧪 Testes automatizados
│   ├── test_routes.py         # Testes das rotas da API
│   ├── test_schemas.py        # Testes dos modelos Pydantic
│   ├── test_gemini_service.py # Testes do serviço Gemini
│   ├── test_gemini.py         # Testes de integração
│   ├── conftest.py            # Configurações dos testes
│   └── README.md              # Documentação dos testes
│
├── requirements.txt           # 📦 Dependências Python
├── .env.example               # 🔧 Modelo de configuração segura
├── .env                       # � Variáveis de ambiente (não commitado)
├── .gitignore                 # 🚫 Arquivos ignorados pelo Git
├── .pylintrc                  # ⚙️ Configuração do Pylint
├── .flake8                    # 📏 Configuração do Flake8
├── pytest.ini                # 🧪 Configuração dos testes
├── Makefile                   # 🔨 Automação de comandos
├── README.md                  # 📚 Documentação do projeto
└── pyproject.toml             # 📋 Configuração do projeto Python
```

### 🔄 Fluxo da Aplicação

1. **Frontend (React)** → Interface do usuário para configurar treinos
2. **API (FastAPI)** → Processa requisições e valida dados  
3. **MongoDB Atlas** → Armazena dados de usuários e treinos
4. **IA Gemini** → Gera planos de treino personalizados
5. **Backend** → Retorna treinos formatados para o frontend

### 📂 Organização por Responsabilidades

| Camada | Tecnologia | Responsabilidade |
|--------|------------|------------------|
| **Frontend** | React + TypeScript + Vite | Interface, formulários, exibição de treinos |
| **Backend** | FastAPI + Python | API REST, validação, orquestração |
| **Database** | MongoDB Atlas + Motor | Persistência de dados, queries |
| **IA** | Google Gemini API | Geração inteligente de treinos |
| **Build** | Vite + npm | Bundling e desenvolvimento frontend |
| **Quality** | Pylint + Flake8 + Black | Qualidade e formatação de código |

---

## 📦 Tecnologias Utilizadas

**Backend:**

- **Python 3.8+** – Linguagem de programação principal do backend  
- **FastAPI** – Framework para criação de APIs REST  
- **Gemini API** – Inteligência Artificial para criação de treinos personalizados  
- **MongoDB Atlas** – Banco de dados NoSQL na nuvem
- **Motor** – Driver assíncrono para MongoDB
- **uvicorn** – Servidor ASGI para rodar a aplicação  
- **python-dotenv** – Gerenciamento seguro de variáveis de ambiente

**Frontend:**

- **React** – Biblioteca para construção de interfaces  
- **TypeScript** – Superset do JavaScript com tipagem estática  
- **Vite** – Build tool moderna e rápida  
- **CSS** – Estilização das páginas  

**Ferramentas de Desenvolvimento:**

- **Pylint** – Análise estática de código (score: 10.00/10)
- **Flake8** – Verificação de estilo PEP8
- **Black** – Formatação automática de código
- **isort** – Organização de imports
- **Pytest** – Framework de testes com cobertura
- **ESLint** – Linter para código JavaScript/TypeScript  
- **npm** – Gerenciador de pacotes do Node.js  
- **Git** – Controle de versão  

**Segurança:**

- **Variáveis de ambiente** (.env) para proteção de credenciais
- **Validação de entrada** com Pydantic
- **Tratamento de erros** robusto
- **Configuração segura** de banco de dados  

---

## 👥 Equipe  

- **Amanda** – Scrum Master  
- **Leôncio** – Product Owner  
- **Arthur** – Líder Técnico  
- **Yasmin** – Design  
- **Felipe** – Design  
- **Victor** – Processo/Pesquisa  
- **Filipe** – Documentação  
- **Heitor** – Documentação  

---

## ⚙️ Configuração de Ambiente

### 🔐 Configuração Segura das Variáveis de Ambiente

Para proteger informações sensíveis como chaves de API e credenciais de banco de dados, o projeto utiliza variáveis de ambiente:

#### 1. **Configuração Inicial**

```bash
# Copie o arquivo de exemplo para criar seu .env
cp .env.example .env
```

#### 2. **Configure suas Chaves no .env**

Abra o arquivo `.env` e configure as seguintes variáveis:

```bash
# API do Google Gemini (OBRIGATÓRIO)
GEMINI_API_KEY=sua_chave_gemini_aqui

# Configurações do Banco de Dados (OBRIGATÓRIO)
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/?retryWrites=true&w=majority&appName=app
DATABASE_NAME=personalai_db

# Configurações de Segurança (OPCIONAL)
SECRET_KEY=sua_chave_secreta_aqui

# Configurações do Servidor (OPCIONAL)
PORT=8000
HOST=127.0.0.1
DEBUG=False
```

#### 3. **Obter as Chaves Necessárias**

**🔑 Google Gemini API:**
1. Acesse: https://aistudio.google.com/app/apikey
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Copie a chave gerada e cole em `GEMINI_API_KEY`

**🗄️ MongoDB Atlas:**
1. Acesse: https://cloud.mongodb.com/
2. Crie uma conta gratuita
3. Crie um novo cluster
4. Configure um usuário de banco de dados
5. Obtenha a connection string e cole em `MONGO_URI`

#### 4. **Verificação da Configuração**

```bash
# Teste se as variáveis estão carregadas
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print('✅ GEMINI_API_KEY:', 'OK' if os.getenv('GEMINI_API_KEY') else '❌ NÃO CONFIGURADA')"

# Teste conexão com MongoDB
python -c "from src.database.mongodb import db; print('✅ MongoDB configurado com sucesso!')"
```

### ⚠️ **Segurança Importante**

- ❌ **NUNCA** faça commit do arquivo `.env` 
- ✅ **SEMPRE** use o arquivo `.env.example` como referência
- 🔒 Mantenha suas chaves de API privadas
- 🔄 Regenere chaves se suspeitar de comprometimento

---

## ▶️ Como Rodar o Projeto  

### 📋 Pré-requisitos

- **Python 3.8+** para o backend
- **Node.js 18+** e **npm** para o frontend
- **Git** para clonar o repositório

### 🖥️ Setup do Backend

```bash
# Clone o repositório
git clone https://github.com/AmandaTrinity/personalIA.git
cd personalIA

# Crie e ative um ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Instale as dependências
pip install -r requirements.txt

# Configure as variáveis de ambiente (IMPORTANTE!)
cp .env.example .env
# Edite o arquivo .env com suas chaves reais (veja seção "Configuração de Ambiente" acima)

# Verifique se as configurações estão corretas
python -c "from dotenv import load_dotenv; load_dotenv(); import os; print('✅ Configuração OK' if os.getenv('GEMINI_API_KEY') and os.getenv('MONGO_URI') else '❌ Configure o .env')"

# Execute o backend
cd src
python main.py
```

O backend estará rodando em `http://localhost:8000`

### 🎨 Setup do Frontend

```bash
# Em um novo terminal, navegue para a pasta do frontend
cd frontend

# Instale as dependências
npm install

# Execute o frontend em modo de desenvolvimento
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

### 🚀 Comandos Úteis

**Backend:**

```bash
# Rodar com uvicorn (alternativa)
uvicorn main:app --reload

# Instalar nova dependência
pip install nome_da_dependencia
pip freeze > requirements.txt
```

**Frontend:**

```bash
# Build para produção
npm run build

# Preview da build de produção
npm run preview

# Lint do código
npm run lint
```

### 🧪 **Executando Testes**

O projeto inclui um sistema completo de testes automatizados:

```bash
# Executar todos os testes (RECOMENDADO)
make test

# Executar testes com cobertura de código
make test-cov

# Testar conexão com API do Gemini
make test-gemini

# Pipeline completo (limpar + instalar + testar)
make all

# Ver todos os comandos disponíveis
make help
```

**Execução individual de testes:**

```bash
# Script interativo para escolher testes
python run_tests.py

# Executar arquivo específico diretamente
python tests/test_routes.py
python tests/test_schemas.py

# Executar com pytest (mais completo)
python -m pytest tests/test_routes.py -v
python -m pytest tests/test_gemini_service.py -v
```

### 🔍 **Qualidade de Código**

O projeto possui um sistema completo de verificação de qualidade:

```bash
# Verificar estilo e qualidade (pylint + flake8)
make lint

# Verificar apenas com pylint (score 10.00/10)
make lint-pylint

# Verificar apenas com flake8 (PEP8)
make lint-flake8

# Formatar código automaticamente
make format

# Pipeline completo de qualidade
make all
```

**Ferramentas de qualidade:**
- **Pylint** - Análise estática e qualidade de código (score: 10.00/10)
- **Flake8** - Verificação de estilo PEP8
- **Black** - Formatação automática de código
- **isort** - Organização de imports

**Estrutura de testes:**
- `tests/test_routes.py` - Testes das rotas da API
- `tests/test_schemas.py` - Testes dos modelos Pydantic  
- `tests/test_gemini_service.py` - Testes do serviço Gemini
- `tests/test_gemini.py` - Testes de integração
