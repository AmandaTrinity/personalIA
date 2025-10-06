import os
import pytest
from dotenv import load_dotenv

# ==== Configuração inicial ====
BASE_DIR = "/home/yasmws/Documentos/personalAI/personalIA"
ENV_PATH = os.path.join(BASE_DIR, ".env")

@pytest.fixture(scope="session", autouse=True)
def load_environment():
    """Carrega as variáveis de ambiente antes de rodar os testes."""
    load_dotenv(dotenv_path=ENV_PATH)
    api_key = os.getenv("GEMINI_API_KEY")
    assert api_key is not None, "❌ Variável GEMINI_API_KEY não encontrada no .env"
    return api_key


def test_import_google_genai():
    """Testa se a biblioteca google-generativeai está instalada corretamente."""
    try:
        import google.generativeai as genai
    except ImportError as e:
        pytest.fail(f"Erro ao importar google.generativeai: {e}")
    assert hasattr(genai, "GenerativeModel"), "A biblioteca parece estar corrompida ou incompleta."


def test_configure_api(load_environment):
    """Testa se a configuração da API Gemini funciona."""
    import google.generativeai as genai
    try:
        genai.configure(api_key=load_environment)
    except Exception as e:
        pytest.fail(f"Erro ao configurar a API: {e}")


def test_generate_simple_response(load_environment):
    """Testa se o modelo Gemini responde corretamente."""
    import google.generativeai as genai
    genai.configure(api_key=load_environment)
    model = genai.GenerativeModel("gemini-2.5-flash")

    try:
        response = model.generate_content("Responda apenas 'ok'")
    except Exception as e:
        pytest.fail(f"Erro ao se comunicar com o modelo: {e}")

    # Verificações básicas
    assert response is not None, "A resposta veio vazia."
    assert hasattr(response, "text"), "O objeto de resposta não tem atributo 'text'."
    assert "ok" in response.text.lower(), f"Resposta inesperada: {response.text}"


def test_environment_path_exists():
    """Verifica se o .env existe no caminho configurado."""
    assert os.path.exists(ENV_PATH), f"Arquivo .env não encontrado em {ENV_PATH}"
