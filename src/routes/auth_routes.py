from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase

# Importações absolutas (sem '..')
from models.user import UserCreate, UserLogin, TokenResponse, UserResponse
from database.db import get_db
from services import auth_service, security

auth_router = APIRouter(prefix="/auth", tags=["Autenticação"])

@auth_router.post("/register", 
             response_model=TokenResponse, 
             status_code=status.HTTP_201_CREATED)
async def register_user(
    user_data: UserCreate, 
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    try:
        new_user = await auth_service.create_user(db, user_data)
    except HTTPException as e:
        raise e 
    
    access_token = security.create_access_token(
        data={"sub": new_user["email"]}
    )
    user_resp = UserResponse.model_validate(new_user)
    
    return TokenResponse(access_token=access_token, user=user_resp)


@auth_router.post("/login", response_model=TokenResponse)
async def login_user(
    form_data: UserLogin, 
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    user = await auth_service.authenticate_user(db, form_data.email, form_data.senha)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token = security.create_access_token(
        data={"sub": user["email"]}
    )
    user_resp = UserResponse.model_validate(user)
    
    return TokenResponse(access_token=access_token, user=user_resp)