// src/services/treino_api.ts

// Lê a URL da API do .env do frontend (Vite)
// Se não existir, cai no 127.0.0.1:8000
const API_URL: string = (import.meta.env.VITE_API_URL as string) || "http://127.0.0.1:8000";

if (!API_URL) throw new Error("VITE_API_URL não está definida no ambiente.");

// Header de auth opcional a partir do localStorage ("token")
function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Envia o prompt do usuário para o backend gerar um plano de treino.
 * Exemplo de rota utilizada: POST /treinos/:usuarioId
 * Body esperado (conforme seu backend atual): { mensagem_usuario: string }
 *
 * Retorna apenas o texto do plano (string) para renderizar no ReactMarkdown.
 */
export async function getTreinos(
  usuarioId: string,
  prompt: string
): Promise<string> {
  try {
    const resp = await fetch(`${API_URL}/treinos/${encodeURIComponent(usuarioId)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader(),
      },
      body: JSON.stringify({ mensagem_usuario: prompt }),
    });

    if (!resp.ok) {
      const errorText = await resp.text().catch(() => "");
      throw new Error(
        `Falha na requisição: ${resp.status} ${resp.statusText} ${errorText ? "- " + errorText : ""
        }`
      );
    }

    // O backend pode responder em formatos ligeiramente diferentes.
    // Tentamos as opções mais prováveis antes de cair no texto bruto.
    const data = await resp.json().catch(() => ({} as any));

    // 1) { treino: { plano_gerado: string } }
    if (data?.treino?.plano_gerado && typeof data.treino.plano_gerado === "string") {
      return data.treino.plano_gerado as string;
    }

    // 2) { plano_gerado: string }
    if (data?.plano_gerado && typeof data.plano_gerado === "string") {
      return data.plano_gerado as string;
    }

    // 3) { result: string } ou { content: string }
    if (typeof data?.result === "string") return data.result as string;
    if (typeof data?.content === "string") return data.content as string;

    // 4) Se nada acima, devolve o JSON como string para depuração
    return JSON.stringify(data, null, 2);
  } catch (err) {
    console.error("Erro ao buscar treinos:", err);
    return "Ocorreu um erro ao conectar com o serviço de IA. Verifique o servidor backend e tente novamente.";
  }
}