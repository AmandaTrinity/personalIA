# 🏋️‍♂️ PersonalIA

O **PersonalIA** é um projeto que usa **Inteligência Artificial** para oferecer planos de treino personalizados sem necessidade de equipamentos de academia. O objetivo é tornar o acesso ao fitness mais acessível, adaptando os treinos ao perfil do usuário e ao seu progresso.

---

## 🚀 Funcionalidades

* Geração de planos de treino personalizados via IA.
* Treinos adaptados para casa, sem equipamentos.
* Feedback adaptativo e recomendações inteligentes.
* **Autenticação de Usuários (Login/Registro).**
* Estrutura modular para escalabilidade futura.

---

## 🏛️ Arquitetura do Projeto

O PersonalIA segue uma arquitetura **Full-Stack** moderna com separação clara entre frontend e backend. A estrutura reflete o crescimento do projeto, incluindo rotas e serviços de autenticação.

```bash
PersonalIA/
│
├── frontend/                     # 🎨 Interface do usuário (React + TypeScript)
│   ├── src/
│   │   ├── App.tsx               # Componente principal da aplicação
│   │   ├── main.tsx              # Ponto de entrada do React
│   │   ├── styles/               # Estilos CSS da aplicação
│   │   ├── components/           # Componentes reutilizáveis da interface
│   │   ├── pages/                # Páginas (Home, Chat, Login)
│   │   ├── services/             # Chamadas às APIs (api.ts, auth_api.ts)
│   │   └── tests/                # Testes do frontend (Jest/Vitest)
│   ├── package.json              # Dependências e scripts do frontend
│   ├── vite.config.ts            # Configuração do Vite
│   ├── tsconfig.json             # Configuração do TypeScript
│   └── index.html                # Template HTML principal
│
├── src/                          # 🖥️ Backend (FastAPI + MongoDB)
│   ├── routes/
│   │   ├── auth_routes.py        # Rotas de Autenticação
│   │   ├── user_routes.py        # Rotas de Usuário (CRUD)
│   │   └── treino_routes.py      # Rotas de Treinos
│   ├── services/
│   │   ├── auth_service.py       # Lógica de autenticação e tokens
│   │   ├── gemini_service.py     # Integração com IA Gemini
│   │   └── treino_service.py     # Lógica de negócio de treinos
│   ├── database/
│   │   └── mongodb.py            # Configuração do MongoDB
│   ├── config/                   # Configurações da aplicação
│   ├── models/                   # Modelos e Schemas
│   ├── utils/                    # Utilitários
│   └── main.py                   # Servidor FastAPI
│
├── tests/                        # 🧪 Testes automatizados (Pytest)
│   ├── test_routes.py
│   ├── test_schemas.py
│   ├── test_gemini_service.py
│   └── conftest.py
│
├── requirements.txt              # 📦 Dependências Python
├── .env.example                  # 🔧 Modelo de variáveis de ambiente
└── README.md                     # 📚 Documentação
```

### 🔄 Fluxo da Aplicação

1. **Frontend (React)** → Interface do usuário para treinos e autenticação.
2. **API (FastAPI)** → Processa requisições, valida dados e gerencia JWT.
3. **MongoDB Atlas** → Armazena usuários, treinos e histórico.
4. **IA Gemini** → Gera planos personalizados.
5. **Backend** → Retorna dados ao frontend.

### 📂 Organização por Responsabilidades

| Camada       | Tecnologia                | Responsabilidade                     |
| ------------ | ------------------------- | ------------------------------------ |
| **Frontend** | React + TypeScript + Vite | Interface, formulários, autenticação |
| **Backend**  | FastAPI + Python          | API REST, validação, segurança       |
| **Database** | MongoDB Atlas + Motor     | Persistência de dados                |
| **IA**       | Google Gemini API         | Geração de treinos                   |
| **Quality**  | Pylint + Flake8 + Black   | Qualidade e formatação               |

---

## 📦 Tecnologias Utilizadas

### Backend

* **Python 3.8+**
* **FastAPI**
* **Gemini API**
* **MongoDB Atlas**
* **Motor**
* **Uvicorn**

### Frontend

* **React**
* **TypeScript**
* **Vite**

### Ferramentas de Desenvolvimento

* **Pylint**, **Flake8**, **Black**, **isort**
* **Pytest**
* **Git**

---

## 👥 Equipe

* **Amanda** — Scrum Master (SM)
* **Leôncio** — Product Owner (PO)
* **Arthur** — Líder Técnico
* **Felipe** — Frontend Developer
* **Heitor** — Frontend Developer
* **Yasmin** — Backend Developer
* **Guilherme** — Backend Developer

---

## ⚙️ Configuração de Ambiente

### 🔐 Variáveis de Ambiente

1. **Criar o arquivo `.env`**

```bash
cp config/.env.example .env
```

2. **Configurar as chaves**

```bash
GEMINI_API_KEY=sua_chave_gemini
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=personalai_db
SECRET_KEY=sua_chave_secreta
```

3. **Obter as chaves**

* **Google Gemini API**: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
* **MongoDB Atlas**: [https://cloud.mongodb.com/](https://cloud.mongodb.com/)

---

## ▶️ Como Rodar o Projeto

### 📋 Pré-requisitos

* Python 3.8+
* Node.js 18+ e npm
* Git

### 🖥️ Backend

```bash
git clone https://github.com/AmandaTrinity/personalIA.git
cd personalIA

python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\\Scripts\\activate  # Windows

pip install -r requirements.txt
cp config/.env.example .env

cd src
python main.py
```

Backend: `http://localhost:8000`

### 🎨 Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

---

## 🚀 Build e Deploy

### Frontend (Vercel)

* **Root**: `frontend`
* **Build**: `npm install && npm run build`
* **Output**: `dist`
* **Env**: `VITE_API_URL=https://api.seudominio.com`

```bash
cd frontend
npm run build
```

### Backend (Render)

```bash
pip install -r requirements.txt
gunicorn src.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
```

Configure as variáveis de ambiente na plataforma.

---

## 🧪 Testes

```bash
make test
make test-cov
make all
```

Ou com Pytest:

```bash
python -m pytest tests/test_routes.py -v
python -m pytest tests/test_gemini_service.py -v
```
