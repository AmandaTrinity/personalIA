import google.generativeai as genai
from config.settings import settings
from schemas import MensagemChat

def gerar_plano_de_treino(data: MensagemChat) -> str:
    """
    Gera o texto do plano de treino usando o modelo Gemini.
    
    Args:
        data: Dados do chat com informações do usuário
        
    Returns:
        str: Plano de treino gerado pela IA
    """
    
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        return "Erro: GEMINI_API_KEY não configurada no ambiente."
    
    try:
        genai.configure(api_key=api_key)
        
        # Construir o prompt baseado nos dados da mensagem
        prompt = f"""
        Crie um plano de treino personalizado com as seguintes especificações:
        
        Mensagem do usuário: {data.mensagem_usuario}
        Nível de experiência: {data.nivel}
        Objetivo: {data.objetivo}
        Equipamentos disponíveis: {data.equipamentos}
        Frequência semanal: {data.frequencia}
        
        Por favor, forneça um plano detalhado que seja adequado para essas características.
        """
        
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
        return response.text
    
    except Exception as e:
        return f"Ocorreu um erro ao se comunicar com a API do Gemini: {str(e)}"
