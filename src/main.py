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
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import re
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

# Evita redirects automáticos de barra final (previne 307/308 que podem
# remover headers em chamadas cross-origin)
app.router.redirect_slashes = False
import logging
from datetime import datetime

# CONFIGURAÇÃO DO CORS

# Lista de origens que podem fazer requisições para a API
origins = [
    "http://localhost:5173",  # Endereço do frontend React/Vite
    "https://personal-ia-git-deploy-yasmins-projects-1c6ea981.vercel.app",
    "https://personal-ia-git-fix-deploy-yasmins-projects-1c6ea981.vercel.app",
    "https://personal-qcaaj956e-yasmins-projects-1c6ea981.vercel.app",
    "https://personal-ia-rouge.vercel.app",
    "https://personal-ia-rouge.vercel.app/",
    "personal-hsip6asjk-yasmins-projects-1c6ea981.vercel.app",
    "https://personal-ia-git-fix-testedeploy-yasmins-projects-1c6ea981.vercel.app"
]

# Para diagnosticabilidade e para suportar ambientes onde o middleware CORS
# pode não ser aplicado corretamente, configuramos a middleware para permitir
# origens amplas e também adicionamos handlers/middleware que ecoam o Origin
# nas respostas. ATENÇÃO: isto torna a API permissiva para qualquer origem.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # permite todas as origens
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.options("/{any_path:path}")
async def _cors_preflight(any_path: str, request: Request):
    """Resposta explícita para preflight OPTIONS que ecoa o Origin.

    Isso garante que, mesmo que o proxy/hospedagem intercepte OPTIONS, a
    aplicação retorne os cabeçalhos CORS necessários.
    """
    origin = request.headers.get("origin")
    req_headers = request.headers.get("access-control-request-headers", "*")

    if origin:
        headers = {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS,PATCH,HEAD",
            "Access-Control-Allow-Headers": req_headers,
            "Access-Control-Allow-Credentials": "true",
            "Vary": "Origin",
        }
    else:
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS,PATCH,HEAD",
            "Access-Control-Allow-Headers": req_headers,
            "Access-Control-Allow-Credentials": "true",
        }

    # Log simples para ajudar diagnóstico em produção — remover após verificação
    print(f"CORS preflight handled for origin={origin!r}")
    return Response(status_code=204, headers=headers)


# Middleware para garantir que todas as respostas contenham o header
# Access-Control-Allow-Origin (ecoando o Origin quando presente).
@app.middleware("http")
async def _ensure_cors_headers(request: Request, call_next):
    response = await call_next(request)
    origin = request.headers.get("origin")
    if origin:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Vary"] = "Origin"
    else:
        response.headers.setdefault("Access-Control-Allow-Origin", "*")
    return response

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
