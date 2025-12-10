import warnings
import uvicorn

# Suprimir warning específico do passlib que aparece em alguns ambientes
# quando o módulo 'crypt' (stdlib) emite DeprecationWarning. Isso evita
# spam nos logs de teste/CI; o comportamento de hash não é afetado.
warnings.filterwarnings(
    "ignore",
    message=r".*crypt is deprecated and slated for removal.*",
    category=DeprecationWarning,
    module=r".*passlib.*",
)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from routes.treino_routes import treino_router
from routes.auth_routes import auth_router 
from config.settings import settings 

app = FastAPI(
    title=settings.APP_NAME,
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION,
)

# CONFIGURAÇÃO DO CORS

# Lista de origens que podem fazer requisições para a API
origins = [
    "http://localhost:5173",  # Endereço do frontend React/Vite
    "https://personal-ia-git-deploy-yasmins-projects-1c6ea981.vercel.app",
    "https://personal-qcaaj956e-yasmins-projects-1c6ea981.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Permite as origens da lista
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos os cabeçalhos
)

app.include_router(auth_router)  
app.include_router(treino_router)


@app.get("/")
def root():
    """Endpoint de health check"""
    return {"message": "PersonalIA Backend is running! 🚀"}


@app.get("/health")
def health_check():
    """Endpoint detalhado de health check"""
    return {"status": "healthy", "message": "API funcionando corretamente", "version": "1.0.0"}


if __name__ == "__main__":
    # Configurações do servidor
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.is_development,  # Só habilita reload em desenvolvimento
        log_level="info",
        app_dir="."
    )
