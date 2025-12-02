import { useState } from 'react';
import { Link } from 'react-router-dom'; 
import ChatArea from '../components/ChatArea';
import ChatInput from '../components/ChatInput';
import { getTreinos } from '../services/treino_api';
import { getCurrentUser } from '../services/api';
import '../styles/pages/chat.css'; 

function Chat() {
  // A resposta da IA. Mensagem fixa do PersonalIA para simular a tela
  const [iaResponse, setIaResponse] = useState(
    "Olá! Bem-Vindo ao PersonalIa Encontrar o treino perfeito começa com o seu estado de espírito e objetivos. Para que eu possa te ajudar, me diga um pouco mais:" + 
    "\n1. Como você se sente agora? (Ex: Com energia, cansado, estressado.)" + 
    "\n2. Qual o seu principal objetivo? (Ex: Perder peso, ganhar massa, flexibilidade.)" + 
    "\n3. Quanto tempo você tem disponível? (Ex: 20 minutos, 1 hora.)"
  );
  
  // O que o usuário vai digitar no input.
  const [currentPrompt, setCurrentPrompt] = useState(""); 
  
  //Estado para simular o carregamento (envio para a API)
  const [isLoading, setIsLoading] = useState(false);

  const user = getCurrentUser();

  // Função que será chamada ao clicar em "Enviar"
  const handleSend = async () => {
    if (!currentPrompt.trim()) return; // Não envia se o input estiver vazio

    if (!user || !user.id) {
      setIaResponse('Você precisa estar logado para interagir com a IA.');
      return;
    }

    setIsLoading(true);

    const usuarioId = user.id;
    
    try {
      //chama a API com o prompt do usuário
      const response = await getTreinos(usuarioId, currentPrompt);
      console.log('Resposta bruta da API:', response);
      
      //Atualiza a resposta da IA com o retorno da API
      setIaResponse(response);
      setCurrentPrompt('');
    } catch(error) {
      console.error('Erro ao buscar treinos', error);
      setIaResponse('Erro ao processar sua solicitação. Tente novamente.')
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-page-container">
      <ChatArea iaResponse={iaResponse} />
      <ChatInput
        prompt={currentPrompt}
        setPrompt={setCurrentPrompt}
        onSend={handleSend}
        isLoading={isLoading}
      />

      <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
        <Link to="/" className="back-button-link">
          <button>Voltar para o Início</button>
        </Link>

        {!user && (
          <>
            <Link to="/login"><button>Entrar</button></Link>
            <Link to="/register"><button>Criar conta</button></Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Chat;