import Navbar from './pages/Navbar'
import Home from './pages/Home'     
import Chat from './pages/Chat'
import { Routes, Route } from 'react-router-dom' // A gente precisa disso pra poder ter múltiplas páginas

function App() {
  return (
    // O container Routes vai cuidar do redirecionamento entre as páginas
    <>
      <Navbar/>
      <div>
        <Routes>
          {/* Aqui está setado "Home" como default/página inicial do site */}
          <Route path="/" element={<Home />} />

          {/* Este é o padrão de código para outras páginas que não sejam "Home" */}
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </>
  )
}

export default App
