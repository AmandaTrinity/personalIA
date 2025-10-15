import '../styles/pages/home.css'
import {useState} from 'react'
import { Link } from 'react-router-dom';    // Link é um container que vai levar a gente de uma página para outra

function App() {
  //Estado para guardar o valor que o usuário digitar
  const [treino, setTreino] = useState('')    // "treino" é a variável que conterá o texto do usuário
                                              // "treino" é enviado para a página "Chat" como input inicial
  return (
      <div className='home-page-wrapper'>
        
        <h1>PersonalIA</h1>

        <div className='card'>  

          <div className='text-card'>
              {'Qual seu treino de hoje?'}
          </div>

        
        <input
          type='text'
          placeholder='Digite aqui...'
          value={treino}
          onChange={(e) => setTreino(e.target.value)} //Atualiza o estado quando digita
          className='input-treino'
        />

        {/* "initial_user_input" é uma chave que têm como valor "treino". É enviado para chat como mensagem inicial do usuário*/}
        
        <Link to="/chat" state={{ initial_user_input: treino }}>  
          <button>
            Enviar
          </button>        
        </Link> 
        

        </div>

      </div>
  );
}

export default App
