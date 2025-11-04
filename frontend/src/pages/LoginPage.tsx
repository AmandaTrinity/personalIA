import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/auth_api";
import "../styles/pages/auth.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate("/chat"); // ou "/" se quiser ir pra home
    } catch (err: any) {
      setError(err?.message ?? "Falha no login. Verifique seu e-mail e senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page auth-page">
      <h1>Entrar</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          E-mail
          <input
            type="email"
            placeholder="voce@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>

        <label>
          Senha
          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="muted">
        Novo por aqui? <Link to="/register">Crie sua conta</Link>
      </p>
    </div>
  );
}