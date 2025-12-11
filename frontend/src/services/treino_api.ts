// src/services/treino_api.ts

// Lê a URL da API do .env do frontend (Vite)
const API_URL: string = (import.meta.env.VITE_API_URL as string) || "http://127.0.0.1:8000";

if (!API_URL) throw new Error("VITE_API_URL não está definida no ambiente.");

// Nota: construímos headers inline como Record<string,string> para evitar conflitos com HeadersInit

// Novo tipo para o corpo da mensagem, espelhando o Pydantic MensagemChat do backend
export interface PlanRequestData {
  mensagem_usuario: string;
  nivel?: string;
  objetivo?: string;
  // Em produção o backend pode receber string ou array; aqui aceitamos ambos
  equipamentos?: string | string[];
  frequencia?: string;
}

// Nova função unificada para enviar requisições à IA (criação de plano ou chat de dúvidas)
// Esta função usa a rota autenticada POST /treinos que infere o usuário a partir do token.
export async function sendPlanRequest(
  data: PlanRequestData
): Promise<string> {
  try {
    // Rota autenticada: POST /treinos (o usuário é inferido pelo token no token do localStorage)
    const url = `${API_URL.replace(/\/+$/,'')}/treinos`;
    const headers: Record<string,string> = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('token');
    if (token) headers.Authorization = `Bearer ${token}`;

    // Normalizar payload: o backend pode esperar 'equipamentos' como string
    // ou como lista dependendo da versão implantada. Para evitar 422 em
    // backends que aguardam string, convertamos arrays em uma string
    // separada por vírgulas ao enviar.
    const payload: Record<string, unknown> = { ...data } as Record<string, unknown>;
    // Garantir que 'equipamentos' seja enviado como string para compatibilidade
    // com a versão do backend em produção que espera string.
    const eq = data.equipamentos;
    if (Array.isArray(eq)) {
      payload.equipamentos = eq.join(', ');
    } else if (typeof eq === 'string') {
      // trim para evitar espaços desnecessários
      payload.equipamentos = eq.trim();
    } else {
      // remove campo se undefined/null
      if (payload.equipamentos === undefined) delete payload.equipamentos;
    }

    const resp = await fetch(url, {
      method: 'POST',
      headers: headers as HeadersInit,
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const errorText = await resp.text().catch(() => "");
      let errorData: unknown = undefined;
      try {
        errorData = JSON.parse(errorText) as unknown;
      } catch {
        // se não for JSON, ignore e use o texto bruto
        errorData = undefined;
      }
      const safeGet = (obj: unknown, key: string) => {
        try {
          if (!obj || typeof obj !== 'object') return undefined;
          return (obj as Record<string, unknown>)[key];
        } catch { return undefined; }
      }
  // Preferir mensagens claras: se o backend retornou um objeto de erro,
  // stringify-o para facilitar debugging (ex: Pydantic validation errors).
  const detail = safeGet(errorData, 'detail');
  const message = safeGet(errorData, 'message');
  const errorMessage = detail || message || errorText;
  const pretty = typeof errorMessage === 'object' ? JSON.stringify(errorMessage, null, 2) : String(errorMessage);
  throw new Error(`Falha na requisição (${resp.status}): ${pretty}`);
    }

    // O backend responde: { status: "ok", treino: { plano_gerado: string, ... } }
    const responseData: unknown = await resp.json().catch(() => ({} as unknown));
    type BackendResponse = { treino?: { plano_gerado?: string }; plano_gerado?: string } | Record<string, unknown>;
    const rd = responseData as BackendResponse;
    if (rd && typeof rd === 'object') {
      if ('treino' in rd) {
        const treinoObj = (rd as { treino?: { plano_gerado?: string } }).treino;
        if (treinoObj && typeof treinoObj.plano_gerado === 'string') return treinoObj.plano_gerado;
      }
      if ('plano_gerado' in rd && typeof (rd as { plano_gerado?: unknown }).plano_gerado === 'string') {
        return (rd as { plano_gerado?: string }).plano_gerado as string;
      }
    }

    if (typeof responseData === 'object' && responseData !== null) return JSON.stringify(responseData, null, 2);
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
  _usuarioId: string, // <-- Parâmetro ignorado, mantido para compatibilidade (prefixado com _ para evitar lint)
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
export type TreinoDetalhe = Record<string, unknown>; // tipo genérico até definirmos a interface correta

export async function getTreinoDetalhe(treinoId: string): Promise<TreinoDetalhe> {
  // Rota GET para buscar um treino por ID
  try {
    const url = `${API_URL.replace(/\/+$/,'')}/treinos/${encodeURIComponent(treinoId)}`;
    const headers: Record<string,string> = {};
    const token = localStorage.getItem('token');
    if (token) headers.Authorization = `Bearer ${token}`;

    const resp = await fetch(url, {
      method: 'GET',
      headers: headers as HeadersInit,
    });

    if (resp.status === 404) {
      throw new Error('Treino não encontrado.');
    }

    if (!resp.ok) {
      throw new Error(`Falha ao carregar detalhe do treino: ${resp.status} ${resp.statusText}`);
    }

    return await resp.json() as TreinoDetalhe;
  } catch (err) {
    console.error('Erro ao buscar detalhes do treino:', err);
    throw new Error('Falha ao buscar detalhes do treino.');
  }
}