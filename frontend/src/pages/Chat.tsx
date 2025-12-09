import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { PlanLayout } from '../components/PlanLayout';
import { getCurrentUser } from '../services/api';
import '../styles/pages/chat.css'; 

function Chat() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    // Se não houver usuário logado, redireciona para a página de login
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Se o usuário não estiver logado, não renderiza nada para evitar erros
  if (!user) {
    return null; 
  }

  // Mapeia os dados do usuário logado para o formato esperado pelo PlanLayout
  const profile = {
    name: typeof user.nome === 'string' ? user.nome : 'Usuário',
    email: typeof user.email === 'string' ? user.email : '',
    age: typeof user.idade === 'number' ? user.idade : 0,
    gender: typeof user.sexo === 'string' ? user.sexo : 'Não informado',
    height: typeof user.altura === 'number' ? user.altura : 0,
    weight: typeof user.peso === 'number' ? user.peso : 0,
    objective: typeof user.objetivo === 'string' ? user.objetivo : 'Não informado',
    level: typeof user.nivel === 'string' ? user.nivel : 'iniciante',
    duration: typeof user.frequencia === 'string' ? user.frequencia : 'Não informado',
    equipment: typeof user.equipamentos === 'string' ? user.equipamentos : 'Não informado',
    limitacoes: typeof user.limitacoes === 'string' ? user.limitacoes : 'Nenhuma',
  };

  return (
    <div className="chat-page-container">
      {/* O componente PlanLayout implementa a tela do mockup */}
      <PlanLayout userProfile={profile} />
    </div>
  );
}

export default Chat;