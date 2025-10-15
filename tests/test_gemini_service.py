"""
Testes para o serviço do Gemini
"""
import pytest
import os
import sys
from pathlib import Path
from unittest.mock import patch, MagicMock

# Configuração de path para execução individual
if __name__ == "__main__":
    project_root = Path(__file__).parent.parent
    src_path = project_root / "src"
    sys.path.insert(0, str(project_root))
    sys.path.insert(0, str(src_path))

from services.gemini_service import gerar_plano_de_treino
from schemas import MensagemChat


class TestGeminiService:
    """Testes para o serviço do Gemini"""
    
    @patch('services.gemini_service.settings')
    def test_gerar_plano_de_treino_sem_api_key(self, mock_settings):
        """Testa comportamento quando API key não está configurada"""
        mock_settings.GEMINI_API_KEY = ""  # Simula API key não configurada
        
        data = MensagemChat(
            mensagem_usuario="Quero um treino para casa",
            nivel="iniciante",
            objetivo="perder peso",
            equipamentos=["peso corporal"],  # Mudou para array
            frequencia="3 vezes por semana"
        )
        
        resultado = gerar_plano_de_treino(data)
        assert "GEMINI_API_KEY não configurada" in resultado
    
    @patch('services.gemini_service.genai')
    @patch('services.gemini_service.settings')
    def test_gerar_plano_de_treino_sucesso(self, mock_settings, mock_genai):
        """Testa geração de plano de treino com sucesso"""
        mock_settings.GEMINI_API_KEY = 'test_key'
        
        # Mock da resposta da API
        mock_model = MagicMock()
        mock_response = MagicMock()
        mock_response.text = "Plano de treino gerado com sucesso"
        mock_model.generate_content.return_value = mock_response
        mock_genai.GenerativeModel.return_value = mock_model
        
        data = MensagemChat(
            mensagem_usuario="Quero um treino para casa",
            nivel="iniciante",
            objetivo="perder peso",
            equipamentos=["peso corporal"],  # Mudou para array
            frequencia="3 vezes por semana"
        )
        
        resultado = gerar_plano_de_treino(data)
        
        # Verificações
        assert resultado == "Plano de treino gerado com sucesso"
        mock_genai.configure.assert_called_once_with(api_key='test_key')
        # Verifica que GenerativeModel foi chamado com model_name e system_instruction
        mock_genai.GenerativeModel.assert_called_once()
        call_args = mock_genai.GenerativeModel.call_args
        assert call_args.kwargs['model_name'] == 'gemini-2.5-flash'
        assert 'system_instruction' in call_args.kwargs
        mock_model.generate_content.assert_called_once()
    
    @patch('services.gemini_service.genai')
    @patch('services.gemini_service.settings')
    def test_gerar_plano_de_treino_erro_api(self, mock_settings, mock_genai):
        """Testa comportamento quando há erro na API"""
        mock_settings.GEMINI_API_KEY = 'test_key'
        
        # Mock de erro na API
        mock_genai.GenerativeModel.side_effect = Exception("Erro na API")
        
        data = MensagemChat(
            mensagem_usuario="Quero um treino para casa",
            nivel="iniciante",
            objetivo="perder peso",
            equipamentos=["peso corporal"],  # Mudou para array
            frequencia="3 vezes por semana"
        )
        
        resultado = gerar_plano_de_treino(data)
        
        assert "Ocorreu um erro ao se comunicar com a API do Gemini" in resultado
        assert "Erro na API" in resultado


if __name__ == "__main__":
    """Permite execução individual do arquivo de teste"""
    print("🧪 Executando testes do serviço Gemini...")
    
    test_instance = TestGeminiService()
    
    # Nota: Para execução individual, alguns testes com mocks podem não funcionar
    # Use 'make test' para execução completa com pytest
    
    try:
        # Este teste tem mocks, pode não funcionar individualmente
        print("ℹ️  Testes com mocks requerem pytest para funcionar corretamente")
        print("ℹ️  Use: make test ou python -m pytest tests/test_gemini_service.py")
        
    except Exception as e:
        print(f"❌ Erro: {e}")
    
    print("💡 Para execução completa, use: make test")