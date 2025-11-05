import { Link } from 'react-router-dom';    // Link é um container que vai levar a gente de uma página para outra
import '../styles/pages/home.css'

function App() {
  return (
      <div className='home-page-wrapper'>
        <h1>PersonalIA</h1>

        <div className='card'>  
          <div className='text-card'>
              {'Seu personal trainer de inteligência artificial.'}
          </div>

        <p className='description-text'>
          Descreva seus objetivos e criaremos o treino perfeito para você!
        </p>        
        <Link to="/chat">  
          <button className='start-button'>
            Começar Agora
          </button>        
        </Link> 

        </div>

      </div>
  );
}

export default App
