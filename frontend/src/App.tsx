import Home from './pages/Home'     
import Chat from './pages/Chat'
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { Routes, Route } from 'react-router-dom' // A gente precisa disso pra poder ter múltiplas páginas

function App() {
  return (
    // O container Routes vai cuidar do redirecionamento entre as páginas
    <>  
      <div>
        <Routes>
          {/* Aqui está setado "Home" como default/página inicial do site */}
          <Route path="/" element={<Home />} />

          {/* Este é o padrão de código para outras páginas que não sejam "Home" */}
          <Route path="/chat" element={<Chat />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App
