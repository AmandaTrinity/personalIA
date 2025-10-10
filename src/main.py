import uvicorn
from fastapi import FastAPI
from config.settings import settings
from routes.treino_routes import treino_router
from routes.user_routes import user_router

app = FastAPI(
    title=settings.APP_NAME,
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION,
)

app.include_router(treino_router)
app.include_router(user_router)

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
    )
