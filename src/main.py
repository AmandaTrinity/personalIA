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
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Permite as origens da lista
    # Além das origens explícitas, permitimos dinamicamente subdomínios do
    # Vercel (ex: previews em https://<nome>.vercel.app) usando regex.
    # Regex to allow Vercel preview domains (matches with or without scheme)
    allow_origin_regex=r".*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos os cabeçalhos
)


# Handle CORS preflight explicitly as a fallback for hosting environments
# that may intercept or change middleware behavior (some proxies/load balancers
# treat OPTIONS specially). This endpoint will reply to any OPTIONS request
# with the appropriate Access-Control-Allow-* headers when the Origin matches
# our allowed list or regex.
@app.options("/{any_path:path}")
async def _cors_preflight(any_path: str, request: Request):
    origin = request.headers.get("origin")
    if not origin:
        return Response(status_code=204)

    # permissive match: either exact in origins or matches the vercel regex
    vercel_regex = re.compile(r".*\\.vercel\\.app")
    # use search to match host anywhere in the origin string
    allowed = origin in origins or bool(vercel_regex.search(origin))

    # debug log to help diagnose production behavior (can be removed later)
    print(f"CORS preflight - origin={origin!r} allowed={allowed}")

    if not allowed:
        # Do not attach CORS headers if origin is not allowed
        return Response(status_code=403)

    req_headers = request.headers.get("access-control-request-headers", "*")
    headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": req_headers,
        "Access-Control-Allow-Credentials": "true",
    }
    return Response(status_code=204, headers=headers)

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
