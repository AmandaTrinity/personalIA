try:
    import google.generativeai as genai
except Exception:
    # Se a biblioteca não estiver disponível (ambientes de teste ou CI),
    # definimos `genai = None` e os testes podem mockar `services.gemini_service.genai`.
    genai = None

from typing import Optional

# Importa as configurações (seu main.py também usa)
from config.settings import settings
from models.schemas import MensagemChat

def _pegar_modelo() -> str:
    model_name = getattr(settings, "GEMINI_MODEL", None)
    if not isinstance(model_name, str) or not model_name:
        model_name = "gemini-2.5-flash-lite"
    return model_name

def _montar_system_instruction() -> str:
    return (
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

def _montar_user_info(user: Optional[dict]) -> str:
    if not user:
        return ""

    parts = []
    if user.get("idade") is not None:
        parts.append(f"Idade: {user.get('idade')}")
    if user.get("peso") is not None:
        parts.append(f"Peso: {user.get('peso')} kg")
    if user.get("altura") is not None:
        parts.append(f"Altura: {user.get('altura')} cm")
    if user.get("objetivo"):
        parts.append(f"Objetivo do usuário: {user.get('objetivo')}")
    if user.get("limitacoes"):
        parts.append(f"Limitações: {user.get('limitacoes')}")

    return "\n".join(parts) + "\n" if parts else ""


def _montar_historico(historico: Optional[str]) -> str:
    if not historico:
        return ""
    return f"Histórico de treinos anteriores:\n{historico}\n\n"
    

def _formatar_equipamentos(data: MensagemChat) -> str:
    return ", ".join(data.equipamentos) if getattr(data, "equipamentos", None) else "peso corporal"

def _montar_prompt_usuario(
    data: MensagemChat,
    equipamentos_str: str,
    user_info_block: str,
    historico_block: str
) -> str:
    return (
        f"Por favor, gere uma resposta para o usuário com base nas seguintes informações:\n"
        f"- Nível de Experiência: {getattr(data, 'nivel', 'iniciante')}\n"
        f"- Objetivo Principal: {getattr(data, 'objetivo', 'condicionamento')}\n"
        f"- Equipamentos Disponíveis: {equipamentos_str}\n"
        f"- Disponibilidade na semana: {getattr(data, 'frequencia', '2 dias por semana')}\n"
        f"\n{user_info_block}"
        f"{historico_block}"
        f"Mensagem do Usuário: {data.mensagem_usuario}"
    )
    

def _tratar_erro(e: Exception) -> str:
    err_text = str(e)

    try:
        list_models = getattr(genai, "list_models", None)
        if callable(list_models):
            models = list_models()
            model_names = []

            for m in models:
                if isinstance(m, str):
                    model_names.append(m)
                elif isinstance(m, dict) and "name" in m:
                    model_names.append(m["name"])
                else:
                    name = getattr(m, "name", None)
                    if name:
                        model_names.append(name)

            if model_names:
                return (
                    f"Ocorreu um erro ao se comunicar com a API do Gemini: {err_text}. "
                    f"Modelos disponíveis: {', '.join(model_names)}. "
                    "Defina a variável de ambiente GEMINI_MODEL com um modelo suportado."
                )
    except Exception:
        pass

    return f"Ocorreu um erro ao se comunicar com a API do Gemini: {err_text}"

def gerar_plano_de_treino(
    data: MensagemChat, user: Optional[dict] = None, historico: Optional[str] = None
) -> str:
    """
    Gera o texto do plano de treino (SÍNCRONO).
    """

    api_key = settings.GEMINI_API_KEY
    if not api_key:
        return "Erro: GEMINI_API_KEY não configurada"

    try:
        genai.configure(api_key=api_key)

        model_name = _pegar_modelo()
        system_instruction = _montar_system_instruction()

        user_info_block = _montar_user_info(user)
        historico_block = _montar_historico(historico)
        equipamentos_str = _formatar_equipamentos(data)

        prompt_usuario = _montar_prompt_usuario(
            data, equipamentos_str, user_info_block, historico_block
        )

        model = genai.GenerativeModel(
            model_name=model_name,
            system_instruction=system_instruction
        )

        response = model.generate_content(prompt_usuario)
        return response.text
    except Exception as e:
        return _tratar_erro(e)


def registrar_contexto_usuario(user: dict) -> None:
    """
    Envia um request de contexto ao Gemini quando o usuário faz login.
    Não lança exceções e retorna None — seguro para BackgroundTask.
    """

    if genai is None:
        return

    api_key = getattr(settings, "GEMINI_API_KEY", None)
    if not api_key:
        return

    if not _configurar_gemini(api_key):
        return

    resumo = _montar_resumo_usuario(user)
    if resumo is None:
        return

    prompt = (
        "Atualize o contexto do usuário para personalização de treinos. "
        f"Perfil: {resumo}. Responda somente com 'OK'."
    )

    model_name = _resolver_modelo(getattr(settings, "GEMINI_MODEL", None))

    try:
        model = genai.GenerativeModel(model_name=model_name)
        model.generate_content(prompt)
    except Exception:
        pass  # nunca propagar exceções no background


def _configurar_gemini(api_key: str) -> bool:
    try:
        genai.configure(api_key=api_key)
        return True
    except Exception:
        return False


def _montar_resumo_usuario(user: dict) -> str | None:
    if not isinstance(user, dict):
        return None

    chave_list = ("nome", "idade", "peso", "altura", "objetivo", "limitacoes", "frequencia")
    parts = [f"{k}: {user[k]}" for k in chave_list if user.get(k) is not None]

    return "; ".join(parts) if parts else None


def _resolver_modelo(model_name) -> str:
    if isinstance(model_name, str) and model_name.strip():
        return model_name
    return "gemini-2.5-flash-lite"

