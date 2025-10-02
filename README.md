# 🏋️‍♂️ PersonalIA  

O **PersonalIA** é um projeto que integra **Inteligência Artificial** para oferecer planos de treino personalizados sem necessidade de equipamentos de academia. O objetivo é tornar o acesso ao fitness mais acessível, adaptando os treinos ao perfil do usuário e ao seu progresso.  

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
├── src/                       # 🖥️ Backend atual (FastAPI)
│   ├── routes/
│   │   └── treino_routes.py   # Rotas da API de treinos
│   ├── services/
│   │   └── gemini_service.py  # Integração com IA Gemini
│   └── main.py                # Servidor FastAPI principal
│
├── personalia/                # 🚧 Nova estrutura em desenvolvimento
│   ├── backend/
│   │   └── app/
│   │       ├── core/          # Configurações e utilitários centrais
│   │       ├── database/      # Modelos e conexões de banco
│   │       ├── models/        # Estruturas de dados (Pydantic)
│   │       ├── routes/        # Endpoints da API organizados
│   │       └── services/      # Lógica de negócio e integrações
│   └── frontend/              # Interface alternativa (em desenvolvimento)
│
├── requirements.txt           # 📦 Dependências Python
├── README.md                  # 📚 Documentação do projeto
└── .gitignore                 # 🚫 Arquivos ignorados pelo Git
```

### 🔄 Fluxo da Aplicação

1. **Frontend (React)** → Interface do usuário para configurar treinos
2. **API (FastAPI)** → Processa requisições e valida dados  
3. **IA Gemini** → Gera planos de treino personalizados
4. **Backend** → Retorna treinos formatados para o frontend

### 📂 Organização por Responsabilidades

| Camada | Tecnologia | Responsabilidade |
|--------|------------|------------------|
| **Frontend** | React + TypeScript + Vite | Interface, formulários, exibição de treinos |
| **Backend** | FastAPI + Python | API REST, validação, orquestração |
| **IA** | Google Gemini API | Geração inteligente de treinos |
| **Build** | Vite + npm | Bundling e desenvolvimento frontend |

---

## 📦 Tecnologias Utilizadas

**Backend:**

- **Python** – Linguagem de programação principal do backend  
- **FastAPI** – Framework para criação de APIs REST  
- **Gemini API** – Inteligência Artificial para criação de treinos personalizados  
- **uvicorn** – Servidor ASGI para rodar a aplicação  

**Frontend:**

- **React** – Biblioteca para construção de interfaces  
- **TypeScript** – Superset do JavaScript com tipagem estática  
- **Vite** – Build tool moderna e rápida  
- **CSS** – Estilização das páginas  

**Ferramentas de Desenvolvimento:**

- **ESLint** – Linter para código JavaScript/TypeScript  
- **npm** – Gerenciador de pacotes do Node.js  
- **Git** – Controle de versão  

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

# Configure as variáveis de ambiente (crie um arquivo .env)
# Adicione sua chave da API do Gemini:
# GEMINI_API_KEY=sua_chave_aqui

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
