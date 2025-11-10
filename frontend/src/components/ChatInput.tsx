import React from 'react';
import '../styles/components/chatInput.css';

interface ChatInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

// Componente que lida com o input do usuário e o botão
const ChatInput: React.FC<ChatInputProps> = ({ prompt, setPrompt, onSend, isLoading }) => {
  const handleSubmit = (e: React.FormEvent) => { //e --> define o parametro que a função receberá
    e.preventDefault();
    if (prompt.trim() !== '' && !isLoading) {
      onSend();
    }
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="prompt-input-field"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Qual sua dúvida sobre o treino recomendado?"
        disabled={isLoading}
      />
      <button 
        type="submit" 
        className="recommend-button"
        disabled={isLoading}
      >
        {isLoading ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
};

export default ChatInput;