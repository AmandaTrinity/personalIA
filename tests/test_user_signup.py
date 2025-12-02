"""Testes para cadastro de usuário (rota /auth/register).

Verifica que a rota responde 201 e que o objeto `user` retornado
não expõe a senha nem o hash de senha.
"""
from fastapi.testclient import TestClient

from main import app


def test_register_user_no_password_exposed(monkeypatch):
    client = TestClient(app)

    payload = {
        "email": "teste_signup@example.com",
        "senha": "SenhaSegura123!",
        "nome": "Teste Signup",
        "idade": 30,
        "sexo": "M",
        "altura": 180,
        "peso": 75.0,
        "objetivo": "ganho de massa",
        "limitacoes": None,
        "frequencia": "3x por semana",
    }

    # Usuário criado falso (o serviço de criação normalmente retornaria o documento do DB)
    fake_created_user = {
        "_id": "64bfae6f1d2f4b5a6c7d8e9f",
        "email": payload["email"],
        "nome": payload["nome"],
        # Simula que o DB armazenou um hash (que NÃO deve aparecer na resposta)
        "hashed_password": "$pbkdf2-sha256$fakehash",
    }

    def fake_create_user(user_data):
        # O rota espera um dict-like com campos — retornamos o fake_created_user
        return fake_created_user

    def fake_create_access_token(data: dict):
        return "fake.access.token"

    # Substitui as funções reais por versões controladas
    monkeypatch.setattr("services.auth_service.create_user", fake_create_user)
    monkeypatch.setattr("services.security.create_access_token", fake_create_access_token)

    resp = client.post("/auth/register", json=payload)
    assert resp.status_code == 201
    body = resp.json()

    # Verifica estrutura básica
    assert "access_token" in body
    assert "user" in body

    user_obj = body["user"]

    # Campos esperados
    assert user_obj["email"] == payload["email"]
    assert user_obj["nome"] == payload["nome"]

    # NÃO expor senha ou hash
    assert "senha" not in user_obj
    assert "hashed_password" not in user_obj
