import { useLocation, useNavigate } from 'react-router-dom';
import { Onboarding } from '../components/Onboarding';

export default function ProfileSetup() {
  const navigate = useNavigate();
  const location = useLocation();

  // Pega o nome do usuário do estado da rota ou usa um fallback "Usuário"
  const userName = location.state?.nome || 'Usuário';

  const handleOnboardingComplete = (profile: object) => {
    console.log('Perfil de Onboarding completo:', profile);
    // TODO: Enviar dados do perfil para o backend aqui

    // Redireciona para a página principal (chat) após a conclusão
    navigate('/chat');
  };

  return (
    <Onboarding 
      userName={userName} 
      onComplete={handleOnboardingComplete} 
    />
  );
}