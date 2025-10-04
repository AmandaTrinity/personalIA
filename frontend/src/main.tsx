import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // 1. Import BrowserRouter
import './styles/index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Vamo colocar as coisas das páginas aqui */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
