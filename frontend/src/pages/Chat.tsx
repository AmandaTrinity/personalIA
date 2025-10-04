import '../styles/pages/chat.css'
import {useLocation, Link, NavLink} from 'react-router-dom'; 
// Link é um container que vai levar a gente de uma página para outra
// useLocation permiti acessar informações de outras páginas ("initial_user_input" nesse caso)


function Chat() {
    const location = useLocation();             // Pega a localização da chave "initial_user_input"
    const user_message_0 = location.state?.initial_user_input || 'Mensagem default'; //Essa linha pergunta se location.state têm realmente um .initial_user_input, se tiver ele coloca isso em user_message_0, mas se não tiver (o usuário não enviou uma mensagem em home), setamos uma mensagem default, porque se não essa merda ia crachar

  return (
    <div className="chat-page-container"> 
        <nav>
        </nav>     
        <h1>Seu Treino do Dia</h1>

      <div className='card'>
        <p>A mensagem que você acabou de digitar é:</p>
        <h2>{user_message_0}</h2> 
      </div>

      <Link to="/">
        <button style={{ marginTop: '20px', marginLeft: '500px' }}>Voltar</button>
      </Link>
    </div>
  );
}

export default Chat
