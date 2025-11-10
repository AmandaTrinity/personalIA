"""
Testes para os schemas Pydantic
"""
import pytest
import sys
from pathlib import Path

# Configuração de path para execução individual
if __name__ == "__main__":
    project_root = Path(__file__).parent.parent
    src_path = project_root / "src"
    sys.path.insert(0, str(project_root))
    sys.path.insert(0, str(src_path))

from models.schemas import MensagemChat


class TestSchemas:
    """Testes para validação de schemas"""
    
    def test_mensagem_chat_dados_validos(self):
        """Testa criação de MensagemChat com dados válidos"""
        data = MensagemChat(
            mensagem_usuario="Quero um treino para casa",
            nivel="iniciante",
            objetivo="perder peso",
            equipamentos=["peso corporal"],  # Mudou para array
            frequencia="3 vezes por semana"
        )
        
        assert data.mensagem_usuario == "Quero um treino para casa"
        assert data.nivel == "iniciante"
        assert data.objetivo == "perder peso"
        assert data.equipamentos == ["peso corporal"]  # Mudou para array
        assert data.frequencia == "3 vezes por semana"
    
    def test_mensagem_chat_valores_padrao(self):
        """Testa valores padrão do MensagemChat"""
        data = MensagemChat(mensagem_usuario="Teste")
        
        assert data.mensagem_usuario == "Teste"
        assert data.nivel == "iniciante"
        assert data.objetivo == "condicionamento"
        assert data.equipamentos == ["peso corporal"] 
        assert data.frequencia == "2 dias por semana"
    
    def test_mensagem_chat_campo_obrigatorio(self):
        """Testa que mensagem_usuario é obrigatória"""
        with pytest.raises(ValueError):
            MensagemChat()


if __name__ == "__main__":
    """Permite execução individual do arquivo de teste"""
    print("🧪 Executando testes de schemas...")
    
    test_instance = TestSchemas()
    
    try:
        test_instance.test_mensagem_chat_dados_validos()
        print("✅ test_mensagem_chat_dados_validos passou")
    except Exception as e:
        print(f"❌ test_mensagem_chat_dados_validos falhou: {e}")
    
    try:
        test_instance.test_mensagem_chat_valores_padrao()
        print("✅ test_mensagem_chat_valores_padrao passou")
    except Exception as e:
        print(f"❌ test_mensagem_chat_valores_padrao falhou: {e}")
    
    try:
        # Este teste usa pytest.raises, pode não funcionar individualmente
        print("ℹ️  test_mensagem_chat_campo_obrigatorio requer pytest")
        print("ℹ️  Use: python -m pytest tests/test_schemas.py::TestSchemas::test_mensagem_chat_campo_obrigatorio")
    except Exception as e:
        print(f"❌ Erro: {e}")
    
    print("🎉 Testes de schemas concluídos!")