import uvicorn
from fastapi import FastAPI

from routes.treino_routes import treino_router

app = FastAPI(
    title="PersonalIA Backend",
    description="API para sistema de treinos personalizados com IA",
    version="1.0.0",
)

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
        host="0.0.0.0",
        port=8000,
        reload=True,  # Recarrega automaticamente quando você edita o código
        log_level="info",
    )
