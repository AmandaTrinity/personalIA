import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/register.css'; // Importando o CSS

function Registro() {
  // Estados para todos os campos do formulário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [genero, setGenero] = useState('');
  const [equipamentos, setEquipamentos] = useState('');
  const [limitacoes, setLimitacoes] = useState('');
  
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

    // Aqui você chamaria sua API de backend
    // Por enquanto, vamos apenas mostrar no console
    const dadosDoUsuario = {
      nome,
      email,
      senha, // Em um app real, NUNCA logue a senha!
      idade,
      peso,
      altura,
      genero,
      equipamentos: equipamentos.split(',').map(item => item.trim()), // Transforma a string em array
      limitacoes,
    };
    
    console.log('Dados do novo usuário:', dadosDoUsuario);
    setError(''); // Limpa a mensagem de erro em caso de sucesso
    
    //
    // TODO: Adicionar lógica de API aqui
    //
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h1>Criar Conta</h1>

        {/* Exibe a mensagem de erro, se houver */}
        {error && <div className="register-error">{error}</div>}

        {/* --- Seção 1: Informações da Conta --- */}
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

        {/* --- Seção 2: Informações Pessoais --- */}
        <h2>Sobre Você</h2>
        <div className="input-group">
          <label htmlFor="idade">Idade</label>
          <input 
            type="number" 
            id="idade"
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
            required 
          />
        </div>
        <div className="input-group">
          <label htmlFor="genero">Gênero</label>
          <select 
            id="genero" 
            value={genero} 
            onChange={(e) => setGenero(e.target.value)}
            required
          >
            <option value="" disabled>Selecione...</option>
            <option value="masculino">Masculino</option>
            <option value="feminino">Feminino</option>
            <option value="outro">Outro</option>
            <option value="prefiro_nao_dizer">Prefiro não dizer</option>
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="peso">Peso (em kg)</label>
          <input 
            type="number" 
            id="peso"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            placeholder="Ex: 70.5"
            step="0.1"
            required 
          />
        </div>
        <div className="input-group">
          <label htmlFor="altura">Altura (em cm)</label>
          <input 
            type="number" 
            id="altura"
            value={altura}
            onChange={(e) => setAltura(e.target.value)}
            placeholder="Ex: 175"
            required 
          />
        </div>

        {/* --- Seção 3: Informações de Treino --- */}
        <h2>Informações para o Treino</h2>
        <div className="input-group">
          <label htmlFor="equipamentos">Equipamentos Disponíveis</label>
          <input 
            type="text" 
            id="equipamentos"
            value={equipamentos}
            onChange={(e) => setEquipamentos(e.target.value)}
            placeholder="Ex: halteres, esteira, barra fixa"
          />
          <small>Separe os equipamentos por vírgula.</small>
        </div>
        <div className="input-group">
          <label htmlFor="limitacoes">Limitações Físicas ou Lesões</label>
          <textarea 
            id="limitacoes"
            value={limitacoes}
            onChange={(e) => setLimitacoes(e.target.value)}
            placeholder="Ex: Dor no joelho direito ao agachar, cirurgia no ombro..."
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