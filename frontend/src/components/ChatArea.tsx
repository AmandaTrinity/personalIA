import ReactMarkdown from 'react-markdown';
import '../styles/components/Chat.css';

interface ChatAreaProps {
  iaResponse: string;
}
//Exibe o cabeçalho da PersonalIA e a área de resposta com suporte a Markdown
const ChatArea = ({ iaResponse }: ChatAreaProps) => {

  return (
    <div className="chat-area-container">
      <header className="personal-ia-header">
        <h1 className="personal-ia-title">PersonalIA</h1>
        <p className="personal-ia-subtitle">Descreva o seu objetivo e eu criarei o seu treino perfeito.</p>
        <hr className="header-divider" />
      </header>
      
      <div className="ia-response-box">
        <div className="ia-text">
          <ReactMarkdown>{iaResponse}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;