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

```bash
PersonalIA/
│
│── src/                       # Código-fonte do projeto
│   ├── routes/                # Definição das rotas da API
│   │   └── treino_routes.py   # Rotas relacionadas aos treinos
│   │
│   ├── services/              # Serviços que integram APIs externas
│   │   └── gemini_service.py  # Integração com a IA Gemini
│   │
│   └── main.py                # Ponto de entrada da aplicação
│
│── requirements.txt           # Dependências do Python
│── .gitignore                 # Arquivos e pastas ignoradas pelo Git
│── README.md                  # Documentação do projeto
```

## 📦 Tecnologias Utilizadas  
- **Python** – Linguagem de programação principal do backend  
- **FastAPI** – Framework para criação de APIs  
- **Gemini API** – Inteligência Artificial para criação de treinos personalizados  
- **uvicorn** – Servidor ASGI para rodar a aplicação  

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

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/PersonalIA.git
cd PersonalIA/src

# Crie e ative um ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Instale as dependências
pip install -r requirements.txt

# Execute a aplicação
python main.py
