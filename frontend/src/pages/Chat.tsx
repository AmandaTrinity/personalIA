import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; 
import ChatArea from '../components/ChatArea';
import ChatInput from '../components/ChatInput';
import '../styles/pages/chat.css'; 
import '../styles/components/Chat.css';

function Chat() {
  const location = useLocation();
  // Pega o input inicial (se houver) e o define como o prompt inicial
  const initialPrompt = location.state?.initial_user_input || '';

  // A resposta da IA. Mensagem fixa do PersonalIA para simular a tela
  const [iaResponse, setIaResponse] = useState(
    "Ótimo! Encontrar o treino perfeito começa com o seu estado de espírito e objetivos. Para que eu possa te ajudar, me diga um pouco mais:" + 
    "\n\n1. Como você se sente agora?** (Ex: Com energia, cansado, estressado.)" + 
    "\n2. Qual o seu principal objetivo?** (Ex: Perder peso, ganhar massa, flexibilidade.)" + 
    "\n3. Quanto tempo você tem disponível?** (Ex: 20 minutos, 1 hora.)"
  );
  
  // O que o usuário vai digitar no input.
  const [currentPrompt, setCurrentPrompt] = useState(initialPrompt); 
  
  //Estado para simular o carregamento (envio para a API)
  const [isLoading, setIsLoading] = useState(false);

  // Efeito para garantir que o prompt inicial seja carregado no input.
  useEffect(() => {
    if (initialPrompt) {
      setCurrentPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  // Função que será chamada ao clicar em "Enviar"
  const handleSend = () => {
    //1. Simulação do envio para o Backend
    setIsLoading(true);
    
    //Simulação da resposta da IA após 2 segundos
    setTimeout(() => {
      //2. Atualiza a resposta (aqui entraria o resultado real da API)
      setIaResponse(`Entendido! Você disse: "${currentPrompt}".\n\nAqui está um treino de 30 minutos focado em pernas para fazer em casa:...\n\nO que achou? Quer adaptar algo?`);
      
      //3. Limpa o input e desliga o loading
      setCurrentPrompt('');
      setIsLoading(false);
    }, 2000);
    
  };

  return (
    <div className="chat-page-container">
      {/* Área de Exibição(Título, Resposta da IA)*/}
      <ChatArea iaResponse={iaResponse} />

      {/*Área de Input(Prompt do Usuário e Botão)*/}
      <ChatInput 
        prompt={currentPrompt}
        setPrompt={setCurrentPrompt}
        onSend={handleSend}
        isLoading={isLoading}
      />

      {/* O botão "Voltar"*/}
      <Link to="/" className="back-button-link">
        <button style={{ marginTop: '20px' }}>Voltar para o Início</button>
      </Link>
    </div>
  );
}

export default Chat;