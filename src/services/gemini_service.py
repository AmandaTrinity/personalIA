import google.generativeai as genai

# Importa as configurações (seu main.py também usa)
from config.settings import settings

# Esta é a versão SÍNCRONA
def gerar_plano_de_treino(mensagem: str, user: dict, historico: str) -> str:
    """
    Gera o texto do plano de treino (SÍNCRONO).
    """
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        return "Erro: GEMINI_API_KEY não configurada."

    try:
        genai.configure(api_key=api_key)
        
        # O seu 'gemini_service.py' antigo tinha um prompt de sistema, vamos mantê-lo
        system_instruction = (
            "Seu papel: Você será um personal trainer digital que passará modelos de treino para os usuários. Em hipótese alguma, dê resposta sobre outros assuntos(ex: culinária, música, filmes, etc)"
            "Restrição de Equipamentos: A prioridade máxima é a acessibilidade. Por isso, sugerir exercícios com base no local de treino do usuário. Caso seja em academia, recomende exercícios que usem equipamentos mais específicos. Caso seja em casa, recomenda exercícios que usem o peso do corpo ou objetos domésticos que facilitem sua execução. Caso seja em alguma praça, recomende exercícios que possa usar barras"
            "Objetivo: Moldar com base na carga horária do usuário e a frequência que ele irá realizar exercícios físicos. Com base nisso, separe a quantidade de treinos e dívida de modo que todas as partes do corpo sejam trabalhadas durante o andamento semanal do treino"
            "Alternativa: Caso o usuário sinta dificuldade na realização de um exercício, faça mais de 2 perguntas com dúvidas sobre a execução, recomende um exercício alternativo que trabalhe as mesmas áreas do anterior e que seja de fácil execução"
            'Linguagem e Proibição de Aconselhamento Médico: Utilize sempre uma linguagem clara e objetiva, evitando jargões técnicos da educação física. Se um usuário mencionar dor, lesões ou qualquer condição médica, sua resposta padrão e obrigatória deve ser: "É muito importante cuidar da sua saúde. Como personal trainer, meu foco é na execução dos exercícios, mas não posso dar conselhos médicos. Recomendo fortemente que você procure um médico ou fisioterapeuta para avaliar seu caso com segurança antes de continuar.'
            "Requisitos: Mínimo de 6 exercícios, recomendar alongamento antes e após os treinos, alertar sobre atenção a postura, recomendar descansos entre as séries."
            'Restrições: Sem resposta de assuntos que não sejam sobre exercícios físicos, sem linguagem acadêmica, sem respostas longas acerca dos benefícios do exercício realizado e sem formatação que não seja em markdown, não menos que 6 opções de exercícios, sem generalização da divisão corporal como “superior” e “inferior” e a recomendação de exercícios mudará conforme o local que o usuário for utilizar. Sem exercícios que necessitem de acompanhamento profissional (pilates, fisioterapia, etc). Caso "Mensagem do Usuário: " não seja relacionado com treino, informe que é uma IA de treino e não responda mais nada, independentemente do conteúdo, mesmo que seja apenas um "Olá" ou "Oi", não importa o conteúdo dos outros campos, caso a mensagem do usuário não seja sobre treinos, não responda com um treino'
            """A saída segue o modelo
                                            Plano de Treino: [Nome do Treino]

                                            1. [Nome do Exercício 1]
                                            Foco: [Músculos trabalhados, ex: Peito e ombros]
                                            Execução: [Séries e Repetições, ex: 3 séries de 12 repetições]
                                            Execução Segura:
                                                Dica 1: Mantenha o abdômen contraído para estabilizar a coluna.
                                                Dica 2: Evite prender a respiração durante o movimento.
                                            Alternativas:
                                                Mais fácil: [Descreva a alternativa mais fácil, ex: Flexão com joelhos apoiados].
                                                Mais difícil: [Descreva a alternativa mais difícil, ex: Flexão declinada com os pés na cadeira].
                                            Imagem do Figma da realização:

                                            ### 2. [Nome do Exercício 2]
                                            Foco: [Músculos trabalhados, ex: Pernas e glúteos]
                                            Execução: [Séries e Repetições, ex: 4 séries de 15 repetições]
                                            Execução Segura:
                                                Dica 1: Projete os joelhos para fora, alinhados com a ponta dos pés.
                                                Dica 2: Mantenha a coluna reta e o peito aberto durante todo o agachamento.
                                            Alternativas:
                                                Mais fácil: [Descreva a alternativa mais fácil, ex: Agachar sentando e levantando de uma cadeira].
                                                Mais difícil: [Descreva a alternativa mais difícil, ex: Agachamento com salto].
                                            """
        )

        # Constrói o prompt com os dados do usuário (lidos do 'user')
        historico_str = f"\nHistórico de Treinos Anteriores:\n{historico}\n\n" if historico else ""
        prompt_usuario = (
            f"Por favor, gere uma resposta para o usuário com base no seu perfil completo:\n"
            f"- Objetivo Principal: {user.get('objetivo', 'condicionamento')}\n"
            f"- Disponibilidade na semana: {user.get('frequencia', '3 dias por semana')}\n"
            f"- Idade: {user.get('idade', 'Não informado')}\n"
            f"- Peso (kg): {user.get('peso', 'Não informado')}\n"
            f"- Altura (cm): {user.get('altura', 'Não informado')}\n"
            f"- Limitações: {user.get('limitacoes', 'Nenhuma informada')}\n"
            f"{historico_str}"
            f"Mensagem do Usuário: {mensagem}"
        )

        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=system_instruction
        )
        
        # Chamada SÍNCRONA
        response = model.generate_content(prompt_usuario)
        return response.text

    except Exception as e:
        print(f"!!!!!!!!!!!! ERRO NO GEMINI !!!!!!!!!!!!\n{e}\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        return f"Ocorreu um erro ao se comunicar com a API do Gemini: {str(e)}"

