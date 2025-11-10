try:
    import google.generativeai as genai
except Exception:
    # Se a biblioteca não estiver disponível (ambientes de teste ou CI),
    # definimos `genai = None` e os testes podem mockar `services.gemini_service.genai`.
    genai = None

# Importa as configurações (seu main.py também usa)
from config.settings import settings
from models.schemas import MensagemChat
from typing import Optional


def gerar_plano_de_treino(data: MensagemChat, user: Optional[dict] = None, historico: Optional[str] = None) -> str:
    """
    Gera o texto do plano de treino (SÍNCRONO).

    Recebe um objeto `MensagemChat` conforme os testes.
    """
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        return "Erro: GEMINI_API_KEY não configurada"

    try:
        genai.configure(api_key=api_key)

        # permite sobrescrever o modelo via variável de ambiente GEMINI_MODEL
        model_name = getattr(settings, "GEMINI_MODEL", None)
        # se o valor não for uma string não vazia (por exemplo um MagicMock nos
        # testes), usamos o valor padrão compatível com os testes.
        if not isinstance(model_name, str) or not model_name:
            model_name = "gemini-2.5-flash"

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


        # Monta o prompt incorporando dados do `data` (MensagemChat) e,
        # se fornecido, informações do usuário cadastrado e histórico.
        equipamentos_str = ", ".join(data.equipamentos) if getattr(data, "equipamentos", None) else "peso corporal"

        user_parts = []
        if user:
            # Extraia campos úteis do perfil do usuário, quando disponíveis
            if user.get("idade") is not None:
                user_parts.append(f"Idade: {user.get('idade')}")
            if user.get("peso") is not None:
                user_parts.append(f"Peso: {user.get('peso')} kg")
            if user.get("altura") is not None:
                user_parts.append(f"Altura: {user.get('altura')} cm")
            if user.get("objetivo"):
                user_parts.append(f"Objetivo do usuário: {user.get('objetivo')}")
            if user.get("limitacoes"):
                user_parts.append(f"Limitações: {user.get('limitacoes')}")

        user_info_block = ("\n".join(user_parts) + "\n") if user_parts else ""

        historico_block = f"Histórico de treinos anteriores:\n{historico}\n\n" if historico else ""

        prompt_usuario = (
            f"Por favor, gere uma resposta para o usuário com base nas seguintes informações:\n"
            f"- Nível de Experiência: {getattr(data, 'nivel', 'iniciante')}\n"
            f"- Objetivo Principal: {getattr(data, 'objetivo', 'condicionamento')}\n"
            f"- Equipamentos Disponíveis: {equipamentos_str}\n"
            f"- Disponibilidade na semana: {getattr(data, 'frequencia', '2 dias por semana')}\n"
            f"\n{user_info_block}"
            f"{historico_block}"
            f"Mensagem do Usuário: {data.mensagem_usuario}"
        )

        model = genai.GenerativeModel(model_name=model_name, system_instruction=system_instruction)
        response = model.generate_content(prompt_usuario)
        return response.text

    except Exception as e:
        # Mensagem de erro mais útil: se a biblioteca suportar listar modelos,
        # tentamos recuperar a lista disponível para ajudar na correção.
        err_text = str(e)
        try:
            list_models = getattr(genai, "list_models", None)
            if callable(list_models):
                models = list_models()
                # models pode ser lista de strings, objetos ou dicionários
                model_names = []
                try:
                    for m in models:
                        if isinstance(m, str):
                            model_names.append(m)
                        elif isinstance(m, dict) and "name" in m:
                            model_names.append(m["name"])
                        else:
                            # tenta atributo 'name'
                            name = getattr(m, "name", None)
                            if name:
                                model_names.append(name)
                except Exception:
                    model_names = []

                if model_names:
                    return (
                        f"Ocorreu um erro ao se comunicar com a API do Gemini: {err_text}. "
                        f"Modelos disponíveis: {', '.join(model_names)}. "
                        "Defina a variável de ambiente GEMINI_MODEL com um modelo suportado."
                    )
        except Exception:
            # se falhar ao listar modelos, apenas cair para a mensagem genérica
            pass

        return f"Ocorreu um erro ao se comunicar com a API do Gemini: {err_text}"


def registrar_contexto_usuario(user: dict) -> None:
    """
    Envia (em chamada assíncrona/background) um pequeno request ao Gemini
    contendo informações do perfil do usuário. Usado para 'informar' o modelo
    sobre o contexto do usuário quando ele faz login. Não levanta exceções
    e retorna None — é seguro ser executado como BackgroundTask.
    """
    if genai is None:
        return None

    api_key = getattr(settings, "GEMINI_API_KEY", None)
    if not api_key:
        return None

    try:
        genai.configure(api_key=api_key)
    except Exception:
        return None

    # Monta um resumo curto do perfil do usuário
    parts = []
    for k in ("nome", "idade", "peso", "altura", "objetivo", "limitacoes", "frequencia"):
        v = user.get(k) if isinstance(user, dict) else None
        if v is not None:
            parts.append(f"{k}: {v}")

    if not parts:
        return None

    resumo = "; ".join(parts)

    prompt = f"Atualize o contexto do usuário para personalização de treinos. Perfil: {resumo}. Responda somente com 'OK'."

    # Modelo configurável
    model_name = getattr(settings, "GEMINI_MODEL", None)
    if not isinstance(model_name, str) or not model_name:
        model_name = "gemini-2.5-flash"

    try:
        model = genai.GenerativeModel(model_name=model_name)
        # Faz uma chamada simples; descartamos a resposta (é apenas para registrar/contexto)
        _ = model.generate_content(prompt)
        return None
    except Exception:
        # Não propagar exceções em background
        return None

