// Barra de navegação, deve estar presente em (praticamente) toda página
import '../styles/components/Nav.css'
import { Link, useMatch, useResolvedPath } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        Personal AI
      </Link>
      {/* Adicione novas páginas para a Navbar aqui */}
      <ul>
        <CustomLink to="/chat">Chat</CustomLink>
        <CustomLink to="/chat">Chat</CustomLink>
      </ul>
    </nav>
  )
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  )
}