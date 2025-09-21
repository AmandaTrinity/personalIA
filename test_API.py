from google import genai
import os

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

chat = client.chats.create(model="gemini-2.5-flash-lite", history = [{"role": "user", "parts" : [{"text" : "Você é um assistente especializado em desenvolver planos de treino" "Você tem que ser o mais breve possível" "Você só responde coisas relacionadas a planos de treino, não permita outras coisas, quando isso acontecer, reafime ser usado para treinos" "Seja respeitoso, mas amigável, o usuario deve pensar ter alguem que se importe"}]}])

while(True):
    input_usr = input("> ")
    if (input_usr == "sair"):
        break
    resposta = chat.send_message(input_usr)
    print(resposta.text)
