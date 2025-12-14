// src/services/treino_api.ts

// Lê a URL da API do .env do frontend (Vite)
const API_URL: string = (import.meta.env.VITE_API_URL as string) || "http://127.0.0.1:8000";

if (!API_URL) throw new Error("VITE_API_URL não está definida no ambiente.");

// Header de auth opcional a partir do localStorage ("token")
function authHeader(): Record<string, string> | undefined {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

// Novo tipo para o corpo da mensagem, espelhando o Pydantic MensagemChat do backend
export interface PlanRequestData {
  mensagem_usuario: string;
  nivel?: string;
  objetivo?: string;
  equipamentos?: string[];
  frequencia?: string;
}

// Nova função unificada para enviar requisições à IA (criação de plano ou chat de dúvidas)
// Esta função usa a rota autenticada POST /treinos que infere o usuário a partir do token.
export async function sendPlanRequest(
  data: PlanRequestData
): Promise<string> {
  try {
    // Dev-only: se VITE_USE_MOCK_PLAN estiver ativado, retorna um plano de exemplo
    if ((import.meta.env.VITE_USE_MOCK_PLAN as string) === 'true') {
      const samplePlan = `Segunda-feira: Peito e Tríceps (Dia A)
1. Flexões tradicionais - 4 séries de 8-15 repetições - descanso 60-90s
2. Flexão com pés elevados - 3 séries de 6-12 repetições - descanso 60-90s
3. Flexão diamante - 3 séries de 8-12 repetições - descanso 60s

Quarta-feira: Costas e Bíceps (Dia B)
1. Remada australiana - 4 séries de 6-12 repetições - descanso 60-90s
2. Chin-up negativas - 3 séries até falha/negativas - descanso 90s
3. Remada com toalha - 3 séries de 8-12 repetições - descanso 60s

Sexta-feira: Pernas e Ombros (Dia C)
1. Agachamento livre - 4 séries de 12-20 repetições - descanso 60-90s
2. Avanços (lunges) - 3 séries de 10-12 por perna - descanso 60-90s
3. Step-ups - 3 séries de 6-10 por perna - descanso 60-90s`;

      return samplePlan;
    }
    // Rota autenticada: POST /treinos (o usuário é inferido pelo token no authHeader)
  const resp = await fetch(`${API_URL}/treinos/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authHeader() ?? {}), // Usa o token do usuário logado
    },
    body: JSON.stringify(data),
  });

    if (!resp.ok) {
      const errorText = await resp.text().catch(() => "");
      let errorData: unknown = {};
      try {
        const parsed = JSON.parse(errorText);
        if (typeof parsed === "object" && parsed !== null) {
          errorData = parsed;
        }
      } catch {
        // Ignora erros de parsing JSON do corpo da resposta; manter errorData como {}
        // Opcional: console.debug("Erro ao parsear JSON de erro:");
      }
      
      const getStringField = (obj: unknown, key: string): string | undefined => {
        if (typeof obj === "object" && obj !== null && key in obj) {
          const val = (obj as Record<string, unknown>)[key];
          return typeof val === "string" ? val : undefined;
        }
        return undefined;
      };

      const errorMessage =
        getStringField(errorData, "detail") ??
        getStringField(errorData, "message") ??
        errorText;
      
      throw new Error(
        `Falha na requisição (${resp.status}): ${errorMessage}`
      );
    }

    // O backend responde: { status: "ok", treino: { plano_gerado: string, ... } }
    const responseData = await resp.json().catch(() => ({} as Record<string, unknown>));

    // 1) Caso de sucesso esperado: { treino: { plano_gerado: string } }
    const treinoField = (responseData as Record<string, unknown>)['treino'];
    if (typeof treinoField === 'object' && treinoField !== null) {
      const plano = (treinoField as Record<string, unknown>)['plano_gerado'];
      if (typeof plano === 'string') {
        return plano;
      }
    }

    // 2) Fallback se o backend responder algo diferente (ex: para mensagens de "não relacionadas ao treino")
    const fallbackPlano = (responseData as Record<string, unknown>)['plano_gerado'];
    if (typeof fallbackPlano === 'string') {
      return fallbackPlano;
    }
    
    // 3) Se for JSON, retorna stringify para debug
    if (typeof responseData === 'object' && responseData !== null) {
        return JSON.stringify(responseData, null, 2);
    }

    // 4) Se for texto puro
    return String(responseData);

  } catch (err) {
    console.error("Erro ao enviar plano/chat para a API:", err);
    // Erro amigável
    return "Ocorreu um erro ao conectar com o serviço de IA. Verifique se você está logado e se o servidor backend está rodando.";
  }
}

// ----------------------------------------------------
// A função original 'getTreinos' é mantida aqui para compatibilidade com a assinatura
// de testes (como ChatApi_integration.test.tsx), mas agora usa a rota autenticada.
// ----------------------------------------------------

/**
 * @deprecated Use sendPlanRequest. Mantido apenas para compatibilidade
 * com código que não usa a estrutura PlanRequestData.
 */
export async function getTreinos(
  usuarioId: string, // <-- Parâmetro ignorado, mas mantido para compatibilidade
  prompt: string
): Promise<string> {
    // Evita erro de parâmetro não utilizado em TypeScript
    void usuarioId;

    const defaultData: PlanRequestData = {
        mensagem_usuario: prompt,
        // O restante dos campos MensagemChat terá defaults definidos no backend
    };
    
    // Chamamos a nova função com a rota autenticada POST /treinos
    return sendPlanRequest(defaultData);
}

// ----------------------------------------------------
// Tipo e função necessários para TreinoDetalhe.tsx
// ----------------------------------------------------
export type TreinoDetalhe = {
  id?: string;
  usuario_id?: string;
  titulo?: string;
  descricao?: string;
  plano_gerado?: string;
  criado_em?: string;
  atualizado_em?: string;
  // Qualquer outro campo vindo do backend
  [key: string]: unknown;
};

export async function getTreinoDetalhe(treinoId: string): Promise<TreinoDetalhe> {
  // Rota GET para buscar um treino por ID
  try {
  const resp = await fetch(`${API_URL}/treinos/${encodeURIComponent(treinoId)}`, {
        method: "GET",
        headers: authHeader(),
    });

    if (resp.status === 404) {
        throw new Error("Treino não encontrado.");
    }

    if (!resp.ok) {
        throw new Error(`Falha ao carregar detalhe do treino: ${resp.status} ${resp.statusText}`);
    }

    return await resp.json();
  } catch (err) {
    console.error("Erro ao buscar detalhes do treino:", err);
    throw new Error("Falha ao buscar detalhes do treino.");
  }
}

// Lista treinos do usuário autenticado
export async function listTreinos(): Promise<TreinoDetalhe[]> {
  try {
    const resp = await fetch(`${API_URL}/treinos/`, {
      method: 'GET',
      headers: authHeader(),
    });

    if (!resp.ok) {
      throw new Error(`Falha ao listar treinos: ${resp.status} ${resp.statusText}`);
    }

    const data = await resp.json();
    if (Array.isArray(data)) return data as TreinoDetalhe[];
    return [];
  } catch (err) {
    console.error('Erro ao listar treinos:', err);
    return [];
  }
}