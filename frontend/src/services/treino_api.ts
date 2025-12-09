// src/services/treino_api.ts

// Lê a URL da API do .env do frontend (Vite)
const API_URL: string = (import.meta.env.VITE_API_URL as string) || "http://127.0.0.1:8000";

if (!API_URL) throw new Error("VITE_API_URL não está definida no ambiente.");

// Header de auth opcional a partir do localStorage ("token")
function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
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
    // Rota autenticada: POST /treinos (o usuário é inferido pelo token no authHeader)
    const resp = await fetch(`${API_URL}/treinos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(), // Usa o token do usuário logado
      },
      body: JSON.stringify(data),
    });

    if (!resp.ok) {
      const errorText = await resp.text().catch(() => "");
      let errorData: any = {};
      try {
        errorData = JSON.parse(errorText);
      } catch {}
      const errorMessage = errorData?.detail || errorData?.message || errorText;
      
      throw new Error(
        `Falha na requisição (${resp.status}): ${errorMessage}`
      );
    }

    // O backend responde: { status: "ok", treino: { plano_gerado: string, ... } }
    const responseData = await resp.json().catch(() => ({} as any));

    // 1) Caso de sucesso esperado: { treino: { plano_gerado: string } }
    if (responseData?.treino?.plano_gerado && typeof responseData.treino.plano_gerado === "string") {
      return responseData.treino.plano_gerado as string;
    }

    // 2) Fallback se o backend responder algo diferente (ex: para mensagens de "não relacionadas ao treino")
    if (responseData?.plano_gerado && typeof responseData.plano_gerado === "string") {
      return responseData.plano_gerado as string;
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
export type TreinoDetalhe = any; // Tipo temporário a ser definido

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