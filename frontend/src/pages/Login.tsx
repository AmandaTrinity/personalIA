import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/auth_api'; // Importa a função de login
import '../styles/pages/login.css';

function Login() {
  const navigate = useNavigate();
  // Estados para guardar o email e a senha
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Novos estados para UX
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Função para lidar com o envio do formulário
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      //Chama o serviço de login. A função 'login' já salva o token na sessão
      await login(email, senha);

      //Redireciona para a página de chat após o sucesso
      navigate('/chat');
      
    } catch (e: unknown) {
      //Exibe a mensagem de erro da API ou uma mensagem padrão
      const errorMessage = e instanceof Error ? e.message : 'Falha na conexão. Verifique seu email/senha ou o servidor.';
      setError(errorMessage);
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Login</h1>
        
        {error && <div className="login-error">{error}</div>}
        
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seuemail@exemplo.com"
            required 
            disabled={isLoading}
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="senha">Senha</label>
          <input 
            type="password" 
            id="senha" 
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Sua senha"
            required 
            disabled={isLoading}
          />
        </div>
        
        <button type="submit" className="login-button" disabled={isLoading}>
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
        
        <div className="login-links">
          <Link to="/recuperar-senha">Esqueceu a senha?</Link>
          <p>
            Não tem uma conta? <Link to="/register">Crie uma aqui</Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;