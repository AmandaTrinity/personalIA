import { type ChangeEvent, type FormEvent } from 'react';
import React from 'react';
import '../styles/components/chatInput.css';

interface ChatInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

// Componente responsável por capturar e enviar mensagens do usuário
const ChatInput = ({ prompt, setPrompt, onSend, isLoading }: ChatInputProps) => {
  // Previne envio de mensagens vazias ou durante loanding
  const handleSubmit = (event:FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const isPromptValid = prompt.trim() !== "";
    const canSend = isPromptValid && !isLoading;

    if (canSend) {
      onSend();
    }
  };

  //Atualiza o estado do prompt conforme o usuário digita
  const handleInputChange = (event:ChangeEvent<HTMLInputElement>): void => {
    setPrompt(event.target.value);
  };

  //Determina se o botão deve estar desativado
  const isButtonDisabled = isLoading || prompt.trim().length === 0;

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="prompt-input-field"
        value={prompt}
        onChange={handleInputChange}
        placeholder="Qual sua dúvida sobre o treino recomendado?"
        disabled={isLoading}
      />
      <button 
        type="submit" 
        className="recommend-button"
        disabled={isButtonDisabled}
      >
        {isLoading ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
};

export default ChatInput;