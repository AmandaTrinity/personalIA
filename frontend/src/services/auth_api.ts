// src/services/auth_api.ts
import { api, saveSession, clearSession, type AuthResponse } from "./api";

// ajuste as rotas aqui para casar com seu backend
const LOGIN_PATH = "/auth/login";
const REGISTER_PATH = "/auth/register";

export type Credentials = {
  email: string;
  senha: string;
};

export async function login(email: string, senha: string) {
  const data = await api<AuthResponse>(LOGIN_PATH, {
    method: "POST",
    json: { email, senha },
  });
  saveSession(data);
  return data;
}

export async function register(email: string, senha: string) {
  const data = await api<AuthResponse>(REGISTER_PATH, {
    method: "POST",
    json: { email, senha },
  });
  saveSession(data);
  return data;
}

export function logout() {
  clearSession();
}