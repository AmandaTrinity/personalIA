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


# --- NOVOS CONSTANTES DE INSTRUÇÃO ---

SYSTEM_INSTRUCTION_BASE = (
    "Seu papel: Você será um personal trainer digital que responderá dúvidas sobre treinos, principalmente como faz a execução de um certo exercício. Em hipótese alguma, dê resposta sobre outros assuntos(ex: culinária, música, filmes, etc). "
    "Linguagem e Proibição de Aconselhamento Médico: Utilize sempre uma linguagem clara e objetiva, evitando jargões técnicos da educação física. Se um usuário mencionar dor, lesões ou qualquer condição médica, sua resposta padrão e obrigatória deve ser: \"É muito importante cuidar da sua saúde. Como personal trainer, meu foco é na execução dos exercícios, mas não posso dar conselhos médicos. Recomendo fortemente que você procure um médico ou fisioterapeuta para avaliar seu caso com segurança antes de continuar.\""
    "Restrições: Sem resposta de assuntos que não sejam sobre exercícios físicos, sem linguagem acadêmica. **PROIBIDO incluir referências a 'Imagem', 'GIF', 'Figma' ou 'realização' no modo de chat.** Caso \"Mensagem do Usuário:\" não seja relacionado com treino, informe que é uma IA de treino e não responda mais nada, independentemente do conteúdo, mesmo que seja apenas um \"Olá\" ou \"Oi\", não importa o conteúdo dos outros campos, caso a mensagem do usuário não seja sobre treinos, não responda com um treino")

SYSTEM_INSTRUCTION_PLANO = (
    SYSTEM_INSTRUCTION_BASE +
    "Restrição de Equipamentos: A prioridade máxima é a acessibilidade. Por isso, sugerir exercícios com base no local de treino do usuário. Caso seja em academia, recomende exercícios que usem equipamentos mais específicos. Caso seja em casa, recomenda exercícios que usem o peso do corpo ou objetos domésticos que facilitem sua execução. Caso seja em alguma praça, recomende exercícios que possa usar barras"
    "Objetivo: Moldar com base na carga horária do usuário e a frequência que ele irá realizar exercícios físicos. Com base nisso, separe a quantidade de treinos e dívida de modo que todas as partes do corpo sejam trabalhadas durante o andamento semanal do treino"
    "Alternativa: Caso o usuário sinta dificuldade na realização de um exercício, faça mais de 2 perguntas com dúvidas sobre a execução, recomende um exercício alternativo que trabalhe as mesmas áreas do anterior e que seja de fácil execução"
    "Requisitos: Mínimo de 6 exercícios, recomendar alongamento antes e após os treinos, alertar sobre atenção a postura, recomendar descansos entre as séries."
    "Restrições: ... sem respostas longas acerca dos benefícios do exercício realizado e sem formatação que não seja em markdown, não menos que 6 opções de exercícios, sem generalização da divisão corporal como “superior” e “inferior” e a recomendação de exercícios mudará conforme o local que o usuário for utilizar. Sem exercícios que necessitem de acompanhamento profissional (pilates, fisioterapia, etc)."
    """
    A saída DEVE seguir o modelo:
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

    ### 2. [Nome do Exercício 2]
    ...
    """
)
# --- FIM NOVOS CONSTANTES DE INSTRUÇÃO ---

def gerar_plano_de_treino(arg1=None, arg2=None, user: Optional[dict] = None, historico: Optional[str] = None) -> str:
    """
    Compatibilidade de chamada: suportamos chamadas antigas e novas assinaturas.
    Possíveis formas:
      - gerar_plano_de_treino(data: MensagemChat, user: Optional[dict]=None, historico=None)
      - gerar_plano_de_treino(user_any, data: MensagemChat)

    Aqui normalizamos os argumentos para (data: MensagemChat, user: Optional[dict], historico: Optional[str]).
    """
    # Normaliza argumentos (suporta: gerar_plano_de_treino(data, user=user, historico=...)
    # e chamadas posicionais antigas como gerar_plano_de_treino(user, data) ou gerar_plano_de_treino(data, user)
    data: MensagemChat | None = None
    # se user foi passado via keyword, já está em 'user'
    if isinstance(arg1, MensagemChat):
        data = arg1
        # se arg2 for um dict e user não foi passado como keyword, considera arg2 como user
        if user is None and isinstance(arg2, dict):
            user = arg2
    else:
        # arg1 pode ser user (dict) ou outro; arg2 pode ser data
        if isinstance(arg2, MensagemChat):
            data = arg2
        elif isinstance(arg1, MensagemChat):
            data = arg1
        # se user não foi passado e arg1 for dict, considere arg1 como user
        if user is None and isinstance(arg1, dict):
            user = arg1
    # Validação mínima
    if data is None:
        raise ValueError('gerar_plano_de_treino: data (MensagemChat) não fornecida')
    """
    Gera o texto do plano de treino ou responde a uma dúvida (SÍNCRONO).
    """
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        return "Erro: GEMINI_API_KEY não configurada"

    # 1. Lógica para DETECTAR INTENÇÃO (Geração de Plano vs. Dúvida/Chat)
    mensagem_lower = getattr(data, 'mensagem_usuario', '').lower().strip()
    
    # Detecção V2: Se contiver palavras-chave de plano (treino, plano, foco)
    is_plan_request = any(
        keyword in mensagem_lower for keyword in ["treino", "plano", "foco"]
    )
    # Detecção V2: Se contiver palavras-chave de dúvida/execução (dúvida, como, execução, alternativa)
    is_chat_doubt = any(
        keyword in mensagem_lower for keyword in ["olá", "oi", "dúvida", "como é", "execução", "alternativa", "o que é", "ajuda", "diga"]
    ) or len(mensagem_lower.split()) < 6 
    
    # 2. SELECIONAR A INSTRUÇÃO DO SISTEMA
    # Se for uma requisição de plano E NÃO for uma dúvida/execução simples
    if is_plan_request and not is_chat_doubt:
        system_instruction = SYSTEM_INSTRUCTION_PLANO
        is_plan_mode = True
    else:
        # Se for uma dúvida simples (ou requisição que não contem palavras-chave de plano)
        system_instruction = SYSTEM_INSTRUCTION_BASE
        is_plan_mode = False

    try:
        genai.configure(api_key=api_key)

        model_name = getattr(settings, "GEMINI_MODEL", None)
        if not isinstance(model_name, str) or not model_name:
            model_name = "gemini-2.0-flash-001"

        # Monta o PROMPT DO USUÁRIO
        equipamentos_str = ", ".join(data.equipamentos) if getattr(data, "equipamentos", None) else "peso corporal"

        user_parts = []
        if user:
            # Extrai campos úteis do perfil do usuário
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

        if is_plan_mode:
            # Prompt detalhado para geração de plano
            prompt_usuario = (
                f"Por favor, gere um plano de treino para o usuário com base nas seguintes informações:\n"
                f"- Nível de Experiência: {getattr(data, 'nivel', 'iniciante')}\n"
                f"- Objetivo Principal: {getattr(data, 'objetivo', 'condicionamento')}\n"
                f"- Equipamentos Disponíveis: {equipamentos_str}\n"
                f"- Disponibilidade na semana: {getattr(data, 'frequencia', '2 dias por semana')}\n"
                f"\n{user_info_block}"
                f"{historico_block}"
                f"Mensagem do Usuário: {data.mensagem_usuario}"
            )
        else:
             # Prompt Simples para Dúvidas/Chat - FORÇA A RESPOSTA CURTA E DIRECIONADA
             prompt_usuario = (
                 f"Mensagem do Usuário: {data.mensagem_usuario}\n\n"
                 f"**Atenção:** Ignore a formatação de plano de treino e as regras de lista. Use apenas texto corrido e **negrito (**) para palavras-chave. Responda APENAS à pergunta do usuário de forma concisa e direta, mantendo seu papel de personal trainer digital. Use os dados do perfil do usuário ({user_info_block.strip()}) apenas como contexto para uma resposta mais útil, se necessário."             )


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