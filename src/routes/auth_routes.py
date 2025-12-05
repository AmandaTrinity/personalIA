from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status

# Importações absolutas (sem '..')
from models.user import TokenResponse, UserCreate, UserLogin, UserResponse
from services import auth_service, email_service, gemini_service, security

auth_router = APIRouter(prefix="/auth", tags=["Autenticação"])


@auth_router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserCreate):  # <-- SÍNCRONO
    """Rota síncrona para registrar usuário"""
    try:
        # Chamada síncrona
        new_user = auth_service.create_user(user_data)
    except HTTPException as e:
        raise e

    access_token = security.create_access_token(data={"sub": new_user["email"]})
    user_resp = UserResponse.model_validate(new_user)

    return TokenResponse(access_token=access_token, user=user_resp)


@auth_router.post("/login", response_model=TokenResponse)
def login_user(form_data: UserLogin, background_tasks: BackgroundTasks):  # <-- SÍNCRONO
    """Rota síncrona para login"""
    user = auth_service.authenticate(form_data.email, form_data.senha)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou senha incorretos.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = security.create_access_token(data={"sub": user["email"]})
    # Normalizar _id para string antes de validar com Pydantic
    if user and "_id" in user:
        try:
            user["_id"] = str(user["_id"])
        except Exception:
            pass

    user_resp = UserResponse.model_validate(user)
    # Agendamos envio do contexto do usuário ao Gemini em background.
    # O `user_resp` já é safe (sem hashed_password) e tem o perfil cadastrado
    # (idade, peso, altura, objetivo, limitacoes, etc) — passamos o dict.
    try:
        background_tasks.add_task(gemini_service.registrar_contexto_usuario, user_resp.model_dump())
    except Exception:
        # Não queremos falhar o login por conta de problemas ao enfileirar a task.
        pass

    return TokenResponse(access_token=access_token, user=user_resp)


@auth_router.post("/forgot-password")
def forgot_password(email: str):
    user = auth_service.get_user_by_email(email)
    if not user:
        return {"message": "Se o e-mail estiver cadastrado, um link de recuperação será enviado."}
    reset_token = security.create_recovery_token(email)
    auth_service.update_token(email, reset_token)
    email_service.send_email(email, reset_token)
    return {"message": "Se o e-mail estiver cadastrado, um link de recuperação será enviado."}


@auth_router.post("/reset-password")
def reset_password(token: str, password: str):
    email = security.verify_recovery_token(token)
    if not email:
        return {"message": "não foi possivel alterar"}
    senha_hash = security.hash_password(password)
    msg = auth_service.update_user_password(email, senha_hash, token)
    return {"message": msg}
