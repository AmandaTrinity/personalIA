"""
test_gemini_model.py

Formato consistente com outros test_*.py:
- Usa pytest
- Pule testes se GEMINI_API_KEY não estiver definido
- Usa pytest.importorskip para falhar graciosamente se google.generativeai não estiver instalado
"""
import os
import pytest
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = os.getenv("GEMINI_MODEL") or "gemini-2.5-flash"

pytestmark = pytest.mark.skipif(not API_KEY, reason="GEMINI_API_KEY não definida no ambiente")

genai = None  # será configurado em setup_module


# tenta importar exceções específicas do cliente google para permitir skips mais informativos
try:
    from google.api_core import exceptions as google_exceptions
except Exception:
    google_exceptions = None


def _google_retry_exceptions():
    """Retorna uma tupla com classes de exceção disponíveis que indicam problemas de rede/quota."""
    if not google_exceptions:
        return tuple()
    names = [
        "ResourceExhausted",
        "DeadlineExceeded",
        "ServiceUnavailable",
        "InternalServerError",
        "TooManyRequests",
        "RetryError",
        "GoogleAPICallError",
    ]
    return tuple(getattr(google_exceptions, n) for n in names if hasattr(google_exceptions, n))


def setup_module(module):
    """
    Importa e configura o cliente antes dos testes.
    Se o pacote não existir, pytest.importorskip marcará os testes como SKIP.
    """
    global genai
    genai = pytest.importorskip("google.generativeai")
    genai.configure(api_key=API_KEY)


def test_list_models_if_supported():
    """Tenta listar modelos se o cliente oferecer essa função."""
    list_models = getattr(genai, "list_models", None)
    if not callable(list_models):
        pytest.skip("genai.list_models não disponível neste cliente")
    try:
        models = list_models()
    except Exception as e:
        retry_excs = _google_retry_exceptions()
        if retry_excs and isinstance(e, retry_excs):
            pytest.skip(f"Skipped due to remote API error: {e}")
        raise
    assert models is not None
    # garante que é iterável
    assert hasattr(models, "__iter__")
    # tenta inspecionar o primeiro item (se existir) sem falhar no caso de iterador vazio
    try:
        first = next(iter(models))
    except StopIteration:
        first = None
    if first is not None:
        assert getattr(first, "name", None) or isinstance(first, str)


def test_generate_content_basic():
    """Gera um texto simples e verifica retorno mínimo."""
    model = genai.GenerativeModel(model_name=MODEL)
    try:
        response = model.generate_content("Teste rápido: Gere um parágrafo curto dizendo 'Olá mundo'.")
    except Exception as e:
        retry_excs = _google_retry_exceptions()
        if retry_excs and isinstance(e, retry_excs):
            pytest.skip(f"Skipped due to remote API error: {e}")
        raise
    text = getattr(response, "text", None) or (str(response) if response is not None else "")
    assert text and isinstance(text, str)
    # aceita variações como "Olá mundo" ou "Olá, mundo"; se não encontrar, exige que resposta tenha algumas palavras
    assert "Olá mundo" in text or "Olá, mundo" in text or len(text.split()) >= 3
