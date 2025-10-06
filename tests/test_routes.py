"""
Testes de integração para as rotas da API
"""
import pytest
import sys
import os
from pathlib import Path
from fastapi.testclient import TestClient

# Configuração de path para execução individual
if __name__ == "__main__":
    # Adiciona o diretório src ao path quando executado diretamente
    project_root = Path(__file__).parent.parent
    src_path = project_root / "src"
    sys.path.insert(0, str(project_root))
    sys.path.insert(0, str(src_path))

from main import app

client = TestClient(app)


class TestRoutes:
    """Testes de integração para rotas"""
    
    def test_health_check_root(self):
        """Testa rota raiz de health check"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "PersonalIA Backend is running" in data["message"]
    
    def test_health_check_detailed(self):
        """Testa rota detalhada de health check"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "API funcionando" in data["message"]
        assert data["version"] == "1.0.0"
    
    def test_openapi_docs(self):
        """Testa se a documentação da API está disponível"""
        response = client.get("/docs")
        assert response.status_code == 200
    
    def test_openapi_json(self):
        """Testa se o schema OpenAPI está disponível"""
        response = client.get("/openapi.json")
        assert response.status_code == 200
        data = response.json()
        assert data["info"]["title"] == "PersonalIA Backend"


if __name__ == "__main__":
    """Permite execução individual do arquivo de teste"""
    # Executar todos os testes desta classe
    test_instance = TestRoutes()
    
    print("🧪 Executando testes de rotas...")
    
    try:
        test_instance.test_health_check_root()
        print("✅ test_health_check_root passou")
    except Exception as e:
        print(f"❌ test_health_check_root falhou: {e}")
    
    try:
        test_instance.test_health_check_detailed()
        print("✅ test_health_check_detailed passou")
    except Exception as e:
        print(f"❌ test_health_check_detailed falhou: {e}")
    
    try:
        test_instance.test_openapi_docs()
        print("✅ test_openapi_docs passou")
    except Exception as e:
        print(f"❌ test_openapi_docs falhou: {e}")
    
    try:
        test_instance.test_openapi_json()
        print("✅ test_openapi_json passou")
    except Exception as e:
        print(f"❌ test_openapi_json falhou: {e}")
    
    print("🎉 Testes concluídos!")