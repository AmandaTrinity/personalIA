import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// Importamos o tipo e a função da nossa API
import { register, type RegisterData } from "../services/auth_api";
// Importamos o CSS de autenticação
import "../styles/pages/auth.css"; 

export default function RegisterPage() {
  const navigate = useNavigate();

  // --- States para TODOS os campos ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [sexo, setSexo] = useState("masculino"); // Valor padrão
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [objetivo, setObjetivo] = useState("perder_peso"); // Valor padrão
  const [limitacoes, setLimitacoes] = useState(""); // Campo de texto
  const [frequencia, setFrequencia] = useState("sedentario"); // Valor padrão
  // ---------------------------------

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validação de números
    if (isNaN(Number(idade)) || isNaN(Number(altura)) || isNaN(Number(peso))) {
        setError("Idade, altura e peso devem ser números.");
        setLoading(false);
        return;
    }
    
    // 1. Monta o objeto de dados EXATAMENTE como o backend espera
    const data: RegisterData = {
      email: email.trim(),
      senha: password, 
      nome: nome.trim(),
      idade: Number(idade),
      sexo: sexo,
      altura: Number(altura), 
      peso: Number(peso),     
      objetivo: objetivo,
      limitacoes: limitacoes.trim(), 
      frequencia: frequencia
    };

    try {
      // 2. Envia o objeto completo para a API
      await register(data);
      navigate("/chat"); // Redireciona após o sucesso
    } catch (err: any) {
      setError(err?.message ?? "Falha no cadastro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page auth-page">
      <h1>Criar conta</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        
        <label>
          Nome Completo
          <input
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </label>
        
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
            placeholder="Crie uma senha (mín. 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
        </label>
        
        {/* --- Linha Dupla --- */}
        <div className="form-row">
          <label className="form-label-half">
            Idade
            <input
              type="number"
              placeholder="Sua idade"
              value={idade}
              onChange={(e) => setIdade(e.target.value)}
              required
              min="1"
            />
          </label>
          <label className="form-label-half">
            Sexo
            <select value={sexo} onChange={(e) => setSexo(e.target.value)} className="styled-select">
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="outro">Outro</option>
            </select>
          </label>
        </div>

        {/* --- Linha Dupla --- */}
        <div className="form-row">
          <label className="form-label-half">
            Altura (cm)
            <input
              type="number"
              placeholder="ex: 175"
              value={altura}
              onChange={(e) => setAltura(e.target.value)}
              required
              min="1"
            />
          </label>
          <label className="form-label-half">
            Peso (kg)
            <input
              type="number"
              placeholder="ex: 70.5"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              required
              min="1"
              step="0.1" 
            />
          </label>
        </div>
        
        <label>
          Objetivo Principal
          <select value={objetivo} onChange={(e) => setObjetivo(e.target.value)} className="styled-select">
            <option value="perder_peso">Perder Peso</option>
            <option value="ganhar_massa">Ganhar Massa Muscular</option>
            <option value="manter_saude">Manter Saúde/Forma</option>
          </select>
        </label>
        
        <label>
          Você possui alguma limitação física ou condição de saúde?
          <textarea
            className="styled-textarea"
            placeholder="Ex: Dor no joelho, asma, etc. (Opcional)"
            value={limitacoes}
            onChange={(e) => setLimitacoes(e.target.value)}
            rows={3}
          />
        </label>
        
        <label>
          Com que frequência você pratica atividades físicas?
          <select value={frequencia} onChange={(e) => setFrequencia(e.target.value)} className="styled-select">
            <option value="sedentario">Sedentário (nenhuma)</option>
            <option value="1-2_vezes">1-2 vezes/semana</option>
            <option value="3-4_vezes">3-4 vezes/semana</option>
            <option value="5-7_vezes">5-7 vezes/semana</option>
          </select>
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Criando..." : "Criar conta"}
        </button>
      </form>

      <p className="muted">
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </div>
  );
}

