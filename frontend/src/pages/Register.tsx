import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(''); // Limpa erros anteriores

    // Validação simples de senha
    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }    
    // Após o sucesso, redireciona para a tela de personalização do perfil
    navigate('/profile-setup', { state: { nome: nome, email: email, senha: senha } });
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
            required 
          />
        </div>
        
        <button type="submit" className="register-button">Criar Conta</button>
        
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