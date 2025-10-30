// src/pages/Chat.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ChatArea from "../components/ChatArea";
import ChatInput from "../components/ChatInput";
import { getTreinos } from "../services/treino_api";
import { getCurrentUser } from "../services/api"; // <- centraliza sessão
import "../styles/pages/chat.css";

export default function Chat() {
  const navigate = useNavigate();

  const [iaResponse, setIaResponse] = useState(
    "Olá! Bem-vindo ao PersonalIA. Encontrar o treino perfeito começa com o seu estado de espírito e objetivos. Para que eu possa te ajudar, me diga um pouco mais:" +
      "\n1. Como você se sente agora? (Ex: Com energia, cansado, estressado.)" +
      "\n2. Qual o seu principal objetivo? (Ex: Perder peso, ganhar massa, flexibilidade.)" +
      "\n3. Quanto tempo você tem disponível? (Ex: 20 minutos, 1 hora.)"
  );
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const user = getCurrentUser(); // { id, email } salvo no login/register

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  async function handleSend() {
    if (!currentPrompt.trim() || !user?.id) return;

    setIsLoading(true);
    try {
      const plano = await getTreinos(user.id, currentPrompt);
      setIaResponse(plano);
      setCurrentPrompt("");
    } catch (error) {
      console.error("Erro ao buscar treinos", error);
      setIaResponse("Erro ao processar sua solicitação. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }

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