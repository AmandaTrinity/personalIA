import "../styles/components/navbar.css";

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <a href="/" className="logo">PersonalIA</a>
            </div>

            <div className="navbar-center">
                <ul className="nav-links">
                    <li>
                        <a href="">Como Funciona?</a>
                    </li>
                    <li>
                        <a href="">Benefícios</a>
                    </li>
                    <li>
                        <a href="">Contato</a>
                    </li>
                </ul>
            </div>

            <div className="navbar-right">
                <button className="login-button">Começar Agora</button>
            </div>
        </nav>
    )
}

export default Navbar;