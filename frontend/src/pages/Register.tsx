import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api'; // Importando a instância da API
import '../styles/pages/register.css';

function Registro() {
  const navigate = useNavigate();
  // Estados para todos os campos do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  // Estado para mensagens de erro
  const [error, setError] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(''); // Limpa erros anteriores
    setIsLoading(true);

    // Validação simples de senha
    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      setIsLoading(false);
      return;
    }

    try {
      //Pré-validação do e-mail
      await api('/auth/check-email', {
        method: 'POST',
        json: { email },
      });

      // Se a verificação for bem-sucedida (não lançou erro), continua para a próxima etapa
      navigate('/profile-setup', { state: { nome, email, senha } });

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido.';
      // Exibe o erro de e-mail já existente ou outro erro de validação
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h1>Criar Conta</h1>

        {/* Exibe a mensagem de erro, se houver */}
        {error && <div className="register-error">{error}</div>}

        <h2>Informações da Conta</h2>
        <div className="input-group">
          <label htmlFor="nome">Nome Completo</label>
          <input 
            type="text" 
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled={isLoading}
            required 
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required 
          />
        </div>
        <div className="input-group">
          <label htmlFor="senha">Senha</label>
          <input 
            type="password" 
            id="senha" 
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            disabled={isLoading}
            required 
          />
        </div>
        <div className="input-group">
          <label htmlFor="confirmarSenha">Confirmar Senha</label>
          <input 
            type="password" 
            id="confirmarSenha" 
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            disabled={isLoading}
            required 
          />
        </div>
        
        <button type="submit" className="register-button" disabled={isLoading}>
          {isLoading ? 'Verificando...' : 'Avançar para Perfil'}
        </button>
        
        <div className="register-links">
          <p>
            Já tem uma conta? <Link to="/login">Faça login</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Registro;