import '../styles/pages/home.css'
import {useState} from 'react'


function App() {
  //Estado para guardar o valor que o usuário digitar
  const [treino, setTreino] = useState('')

  const handleEnviar = () => {
    alert(`Seu treino de hoje é: ${treino}`)
  }

  return (
      <div>

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

        <button onClick={handleEnviar}>
          Enviar
        </button>
        
        </div>

      </div>
  );
}

export default App
