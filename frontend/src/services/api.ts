// src/services/api.ts

// 1) Base URL da API via .env do FRONT (Vite)
//    Crie/garanta: frontend/.env  ->  VITE_API_URL=http://127.0.0.1:8000
export const API_URL: string =
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

// 2) Tipos de resposta e sessão
export type AuthResponse = {
  // seu backend pode devolver "access_token" OU "token"
  access_token?: string;
  token?: string;
  // pode devolver "user" com vários formatos
  user?: {
    id?: string;
    _id?: string;
    usuarioId?: string;
    email?: string;
    [k: string]: any;
  } & Record<string, any>;
  [k: string]: any;
};

export type Session = {
  token: string;
  user: { id: string; email?: string; [k: string]: any };
};

// 3) Helpers de sessão
const TOKEN_KEY = "token";
const USER_KEY = "user";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser(): { id: string; email?: string } | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    const u = JSON.parse(raw);
    const id = u?.id ?? u?._id ?? u?.usuarioId ?? null;
    if (!id) return null;
    return { id, email: u?.email };
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

// 4) Cliente HTTP genérico (JSON-first)
type ApiInit = Omit<RequestInit, "body" | "headers"> & {
  json?: unknown;              // passa um objeto e virará JSON
  headers?: Record<string, string>;
  skipAuth?: boolean;          // true -> não envia Authorization
};

export async function api<T = any>(path: string, init: ApiInit = {}): Promise<T> {
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
  let data: any = null;
  const text = await resp.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!resp.ok) {
    // tenta uma mensagem de erro amigável
    const msg =
      (data && (data.detail || data.message || data.error)) ||
      `${resp.status} ${resp.statusText}`;
    throw new Error(typeof msg === "string" ? msg : "Falha na requisição");
  }

  return data as T;
}