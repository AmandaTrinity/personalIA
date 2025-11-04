from fastapi import APIRouter, Depends, HTTPException, status
# Importações absolutas (sem '..')
from models.user import UserCreate, UserLogin, TokenResponse, UserResponse
from services import auth_service, security

auth_router = APIRouter(prefix="/auth", tags=["Autenticação"])

@auth_router.post("/register", 
             response_model=TokenResponse, 
             status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserCreate): # <-- SÍNCRONO
    """ Rota síncrona para registrar usuário """
    try:
        # Chamada síncrona
        new_user = auth_service.create_user(user_data)
    except HTTPException as e:
        raise e 
    
    access_token = security.create_access_token(
        data={"sub": new_user["email"]}
    )
    user_resp = UserResponse.model_validate(new_user)
    
    return TokenResponse(access_token=access_token, user=user_resp)

@auth_router.post("/login", response_model=TokenResponse)
def login_user(form_data: UserLogin): # <-- SÍNCRONO
    """ Rota síncrona para login """
    user = auth_service.authenticate_user(form_data.email, form_data.senha)
    
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

