import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/recuperar.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOk(null); setErr(null);

    const emailTrim = email.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrim);
    if (!isEmail) {
      setErr('Informe um e-mail válido.');
      return;
    }

    setLoading(true);
    try {
      const resp = await fetch(`${API_BASE}/usuario/solicitar-nova-senha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailTrim }),
      });

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        throw new Error(data?.detail || 'Falha ao solicitar recuperação.');
      }

      setOk('Se o e-mail existir, um código foi enviado. Verifique sua caixa de entrada (e spam).');
      setEmail('');
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'Erro ao enviar solicitação.';
      setErr(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rec-container">
      <div className="rec-card">
        <h1 className="rec-title">Recuperar senha</h1>
        <p className="rec-subtitle">Digite seu e-mail. Vamos enviar um código de verificação para redefinir sua senha.</p>

        {ok && <div className="rec-alert ok">{ok}</div>}
        {err && <div className="rec-alert err">{err}</div>}

        <form className="rec-form" onSubmit={handleSubmit}>
          <label className="rec-label" htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            className="rec-input"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <div className="rec-actions">
            <button className="rec-btn" type="submit" disabled={loading}>
              {loading ? 'Enviando…' : 'Enviar código'}
            </button>
            <Link className="rec-link" to="/">Voltar</Link>
          </div>
          <p className="rec-hint">Usaremos o endpoint <code>/usuario/solicitar-nova-senha</code> do backend.</p>
        </form>
      </div>
    </div>
  );
}
