import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/login.css'; // Importando o CSS

function Login() {
  // Estados para guardar o email e a senha
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Função para lidar com o envio do formulário
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Impede o recarregamento da página
    
    // Por enquanto, vamos apenas mostrar no console
    // Aqui é onde você chamaria sua API de backend
    console.log('Tentativa de login com:', { email, senha });
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Login</h1>
        
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seuemail@exemplo.com"
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
            placeholder="Sua senha"
            required 
          />
        </div>
        
        <button type="submit" className="login-button">Entrar</button>
        
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