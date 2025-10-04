import { Routes, Route } from 'react-router-dom' // A gente precisa disso pra poder ter múltiplas páginas
import Home from './pages/Home'     // Aqui a gente importa as páginas que serão usadas
import Chat from './pages/Chat'

function App() {
  return (
    // O container Routes vai cuidar do redirecionamento entre as páginas
    <Routes>
      {/* Aqui está setado "Home" como default/página inicial do site */}
      <Route path="/" element={<Home />} />

      {/* Este é o padrão de código para outras páginas que não sejam "Home" */}
      <Route path="/chat" element={<Chat />} />
    </Routes>
  )
}

export default App
