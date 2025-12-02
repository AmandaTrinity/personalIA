import { useLocation, useNavigate } from 'react-router-dom';
import { Onboarding } from '../components/Onboarding';
import { register, type RegisterData } from '../services/auth_api';
import { saveSession } from '../services/api';

export default function ProfileSetup() {
  const navigate = useNavigate();
  const location = useLocation();

  //Obtém as credenciais da etapa anterior (Registro)
  const registrationData = location.state as { nome: string, email: string, senha: string } | undefined;

  if (!registrationData || !registrationData.email || !registrationData.senha) {
    navigate('/register');
    return null; 
  }

  const userName = registrationData.nome || 'Usuário';

  //Lida com a conclusão do Onboarding e envia o formulário completo
  const handleOnboardingComplete = async (profile: any) => { 
    
    //Mapeia e combina os dados para o formato RegisterData (e UserCreate do BE)
    const fullRegistrationData: RegisterData = {
      // Credenciais (da etapa anterior)
      email: registrationData.email,
      senha: registrationData.senha,
      nome: registrationData.nome,

      //Dados do Perfil (do Onboarding) - Mapeamento para o schema UserCreate:
      idade: profile.age,
      sexo: profile.gender,
      altura: profile.height,
      peso: profile.weight,
      objetivo: profile.objective,
      frequencia: profile.duration, 
      level: profile.level, 
      equipment: profile.equipment,
      limitacoes: profile.limitations || null, 
    };

    try {
      //Envia os dados para a API de registro
      const response = await register(fullRegistrationData);
      
      //Salva a sessão (token e usuário) para manter o usuário logado
      saveSession(response); 
      navigate('/chat');
      
    } catch (error: any) {
      console.error('Erro no registro completo:', error);
      alert(`Falha no registro. Verifique o console. Detalhes: ${error.message || "Erro desconhecido"}`);
      navigate('/register'); 
    }
  };
  
  return (
    <Onboarding 
      userName={userName} 
      onComplete={handleOnboardingComplete} 
    />
  );
}