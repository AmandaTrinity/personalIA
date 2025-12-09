//Base URL da API via .env do FRONT (Vite)
export const API_URL: string =
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export interface UserSessionData {
  id: string; // O ID normalizado
  email?: string;
  [k: string]: unknown;
}

export type AuthResponse = {
  access_token?: string;
  token?: string;
  // O backend devolve um objeto, mas não tipamos a estrutura completa aqui
  user?: Record<string, unknown>; 
  [k: string]: unknown;
};

export type Session = {
  token: string;
  user: UserSessionData;
};

//Helpers de sessão
const TOKEN_KEY = "token";
const USER_KEY = "user";

// Lógica isolada para mapear diferentes chaves de ID
function normalizeUserId(userObject: Record<string, unknown>): string | null {
  return (
    (userObject.id as string) ??
    (userObject._id as string) ??
    (userObject.usuarioId as string) ??
    null
  );
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

// Usa UserSessionData e normalizeUserId
export function getCurrentUser(): UserSessionData | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    // Trata o JSON como Record<string, unknown>
    const u = JSON.parse(raw) as Record<string, unknown>;
    
    const id = normalizeUserId(u);
    if (!id) return null; // Se não houver ID, o usuário é inválido
    
    // Retorna o objeto de usuário completo, como está no localStorage
    return u as UserSessionData;
  } catch {
    return null;
  }
}

export function saveSession(auth: AuthResponse) {
  const token = auth.access_token ?? auth.token;
  if (token) localStorage.setItem(TOKEN_KEY, token);

  if (auth.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
  }
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

//Cliente HTTP genérico (JSON-first)
type ApiInit = Omit<RequestInit, "body" | "headers"> & {
  json?: unknown;              // passa um objeto e virará JSON
  headers?: Record<string, string>;
  skipAuth?: boolean;          // true -> não envia Authorization
};

export async function api<T = unknown>(path: string, init: ApiInit = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;

  const headers: Record<string, string> = {
    ...(init.headers ?? {}),
  };

  // JSON body
  let body: BodyInit | undefined = undefined;
  if (init.json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(init.json);
  }

  // Authorization
  if (!init.skipAuth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const resp = await fetch(url, {
    ...init,
    headers,
    body,
  });

  // tenta ler JSON; se falhar, pega texto
  let data: unknown = null;
  const text = await resp.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!resp.ok) {

    const errorData = data as Record<string, unknown>;
    // tenta uma mensagem de erro amigável
    const msg =
      (errorData && (errorData.detail || errorData.message || errorData.error)) ||
      `${resp.status} ${resp.statusText}`;
      
    throw new Error(typeof msg === "string" ? msg : "Falha na requisição");
  }

  return data as T;
}