from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.treino_routes import treino_router

app = FastAPI(
    title="PersonalIA API",
    description="API para gerar treinos personalizados com IA.",
    version="1.0.0"
)

#CONFIGURAÇÃO DO CORS

# Lista de origens que podem fazer requisições para a API
origins = [
    "http://localhost:5173", # Endereço do frontend React/Vite
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # Permite as origens da lista
    allow_credentials=True,
    allow_methods=["*"], # Permite todos os métodos (GET, POST, etc.)
    allow_headers=["*"], # Permite todos os cabeçalhos
)

app.include_router(treino_router)