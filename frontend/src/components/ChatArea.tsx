import React from 'react';
import '../styles/components/chatArea.css';

interface ChatAreaProps {
  iaResponse: string;
}

//Componente renderiza a caixa de conversa da IA
const ChatArea: React.FC<ChatAreaProps> = ({ iaResponse }) => {
  // Função para garantir que as quebras de linha do texto sejam renderizadas corretamente no HTML
  const formattedResponse = iaResponse.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <div className="chat-area-container">
      <div className="personal-ia-header">
        <h1 className="personal-ia-title">PersonalIA</h1>
        <p className="personal-ia-subtitle">Descreva o seu objetivo e eu criarei o seu treino perfeito.</p>
        <hr className="header-divider" />
      </div>
      
      {/* Esta é a caixa principal da resposta da IA */}
      <div className="ia-response-box">
        <p className="ia-text">{formattedResponse}</p>
      </div>
    </div>
  );
};

export default ChatArea;