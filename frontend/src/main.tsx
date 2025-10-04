import React from "react"
import ReactDOM from "react-dom/client"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Vamo colocar as coisas das páginas aqui */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
