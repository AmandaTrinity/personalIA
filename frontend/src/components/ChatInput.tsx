import { type FormEvent } from 'react';
import '../styles/components/Chat.css';

interface ChatInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

// Componente responsável por capturar e enviar mensagens do usuário
const ChatInput = ({ prompt, setPrompt, onSend, isLoading }: ChatInputProps) => {
  // Previne envio de mensagens vazias ou durante loanding
  const handleSubmit = (event:FormEvent<HTMLFormElement>) : void => {
    event.preventDefault();

    const isPromptValid = prompt.trim() !== "";
    const canSend = isPromptValid && !isLoading;

    if (canSend) {
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