import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// 1. Importamos o TIPO de dados que a API espera
import { register, type RegisterData } from "../services/auth_api";
import "../styles/pages/auth.css"; // (Mantendo o estilo que criamos)

export default function RegisterPage() {
  const navigate = useNavigate();

  // 2. Criamos um estado para TODOS os campos
  const [formData, setFormData] = useState<RegisterData>({
    email: "",
    senha: "",
    nome: "",
    idade: 18, // Valor padrão
    sexo: "masculino", // Valor padrão
    altura: 170, // Valor padrão (em cm)
    peso: 70, // Valor padrão (em kg)
    objetivo: "condicionamento", // Valor padrão
    limitacoes: "",
    frequencia: "3-4 dias", // Valor padrão
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 3. Handler genérico para atualizar o estado
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    // Converte 'number' inputs para números reais
    const valorProcessado = type === 'number' ? parseFloat(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: valorProcessado,
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 4. Enviamos o objeto 'formData' completo
      await register(formData);
      // Após o registro, enviamos para a tela de Login
      // (É melhor do que logar direto, para o usuário confirmar a senha)
      navigate("/login"); 
    } catch (err: any) {
      setError(err?.message ?? "Falha no cadastro. Verifique os campos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page auth-page">
      <h1>Criar conta</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        
        {/* --- DADOS DE LOGIN --- */}
        <label>
          Nome Completo
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          E-mail
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </label>
        <label>
          Senha (mínimo 6 caracteres)
          <input
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            required
            minLength={6}
            autoComplete="new-password"
          />
        </label>

        {/* --- DADOS DO PERFIL (Obrigatórios) --- */}
        <div className="form-row">
          <label>
            Idade
            <input
              type="number"
              name="idade"
              value={formData.idade}
              onChange={handleChange}
              min={13}
              max={100}
              required
            />
          </label>
          <label>
            Sexo
            <select name="sexo" value={formData.sexo} onChange={handleChange}>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="outro">Outro</option>
            </select>
          </label>
        </div>
        
        <div className="form-row">
          <label>
            Altura (cm)
            <input
              type="number"
              name="altura"
              value={formData.altura}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Peso (kg)
            <input
              type="number"
              name="peso"
              step="0.1"
              value={formData.peso}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <label>
          Qual seu objetivo principal?
          <select name="objetivo" value={formData.objetivo} onChange={handleChange}>
            <option value="condicionamento">Condicionamento Físico</option>
            <option value="perda_de_peso">Perda de Peso</option>
            <option value="ganho_de_massa">Ganho de Massa Muscular</option>
            <option value="saude">Saúde / Bem-estar</option>
          </select>
        </label>

        <label>
          Frequência de Atividades Físicas
          <select name="frequencia" value={formData.frequencia} onChange={handleChange}>
            <option value="1-2 dias">1-2 dias por semana</option>
            <option value="3-4 dias">3-4 dias por semana</option>
            <option value="5+ dias">5 ou mais dias por semana</option>
          </select>
        </label>

        <label>
          Limitação física ou condição de saúde? (Opcional)
          <textarea
            name="limitacoes"
            value={formData.limitacoes || ""}
            onChange={handleChange}
            placeholder="Ex: Dor no joelho, hérnia de disco, etc."
          />
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

