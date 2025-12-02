import Home from './pages/Home'     
import Chat from './pages/Chat'
import RecuperarSenha from './pages/RecuperarSenha'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import ProfileSetup from './pages/ProfileSetup.tsx';
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        </Routes>
      </div>
    </>
  )
}

export default App
