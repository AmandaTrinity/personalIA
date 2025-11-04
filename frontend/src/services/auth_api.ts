// 1. Importamos o 'api' (que criamos antes) e o 'AuthResponse'
import { api, saveSession, clearSession, type AuthResponse } from "./api";

// 2. Definimos as rotas (elas batem com o backend síncrono)
const LOGIN_PATH = "/auth/login";
const REGISTER_PATH = "/auth/register";

// 3. Exportamos o TIPO de dados que o RegisterPage precisa
//    Isso garante que o frontend e o backend usam o mesmo "contrato"
export type RegisterData = {
  email: string;
  senha: string;
  nome: string;
  idade: number;
  sexo: string;
  altura: number;
  peso: number;
  objetivo: string;
  limitacoes?: string | null; // Opcional
  frequencia: string;
};

// 4. A função 'login' permanece a mesma
export async function login(email: string, senha: string) {
  const data = await api<AuthResponse>(LOGIN_PATH, {
    method: "POST",
    // O backend espera 'UserLogin' (email, senha), mas o Pydantic
    // os lê de 'json' se o frontend enviar assim.
    // Para ser 100% compatível com FastAPI, enviamos como 'json'.
    json: { email, senha },
    skipAuth: true,
  });
  saveSession(data);
  return data;
}

// 5. A função 'register' AGORA RECEBE O OBJETO INTEIRO
export async function register(formData: RegisterData) {
  const data = await api<AuthResponse>(REGISTER_PATH, {
    method: "POST",
    json: formData, // Envia o objeto 'formData' completo como JSON
    skipAuth: true,
  });
  // Não salva a sessão aqui, força o usuário a fazer login
  // (é mais seguro e confirma que ele lembra a senha)
  return data;
}

export function logout() {
  clearSession();
}

