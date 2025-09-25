from google import genai 
import os
from dotenv import load_dotenv

def gerar_plano_de_treino(prompt_usuario: str) -> str:
    """
    Gera um plano de treino usando o modelo Gemini. O argumento é o prompt_usuario: A descrição do treino solicitado pelo usuário.
    Retorna: A resposta em texto do modelo.
    """
    load_dotenv()

    try:
        client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        
        # Instrução inicial para o assistente de IA
        system_instruction = ("Você é um assistente especializado em desenvolver planos de treino. "
                              "Você tem que ser o mais breve possível. "
                              "Você só responde coisas relacionadas a planos de treino, não permita outras coisas, quando isso acontecer, reafime ser usado para treinos. "
                              "Seja respeitoso, mas amigável, o usuario deve pensar ter alguem que se importe.")

        chat = client.chats.create(model="gemini-2.5-flash-lite", history=[{"role": "user", "parts": [{"text": system_instruction}]}])
        
        resposta = chat.send_message(prompt_usuario)
        return resposta.text
    except Exception:
        return f"Ocorreu um erro ao se comunicar com a API do Gemini"