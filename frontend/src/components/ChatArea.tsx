import React from 'react';
import ReactMarkdown from 'react-markdown'; // <-- PASSO 1
import '../styles/components/Chat.css';

interface ChatAreaProps {
  iaResponse: string;
}

const ChatArea: React.FC<ChatAreaProps> = ({ iaResponse }) => {
  // A lógica de 'formattedResponse' foi removida. ReactMarkdown vai cumprir esta função agora

  return (
    <div className="chat-area-container">
      <div className="personal-ia-header">
        <h1 className="personal-ia-title">PersonalIA</h1>
        <p className="personal-ia-subtitle">Descreva o seu objetivo e eu criarei o seu treino perfeito.</p>
        <hr className="header-divider" />
      </div>
      
      <div className="ia-response-box">
        {/* Usamos o ReactMarkdown aqui */}
        <div className="ia-text">
          <ReactMarkdown>{iaResponse}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;