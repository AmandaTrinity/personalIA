from fastapi import FastAPI

app = FastAPI()

from routes.treino_routes import treino_router

app.include_router(treino_router)