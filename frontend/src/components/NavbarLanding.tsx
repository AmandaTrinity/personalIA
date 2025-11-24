import "../styles/components/navbar.css";

const Navbar = () => {
    // Função para scroll suave até a seção
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <nav className="navbar">
            {/* ========== LOGO (ESQUERDA) ========== */}
            <div className="navbar-left">
                <a href="/" className="logo">PersonalIA</a>
            </div>

            {/* ========== LINKS DE NAVEGAÇÃO (CENTRO) ========== */}
            <div className="navbar-center">
                <ul className="nav-links">
                    <li>
                        <a onClick={() => scrollToSection('como-funciona')} style={{ cursor: 'pointer' }}>
                            Como Funciona?
                        </a>
                    </li>
                    <li>
                        <a onClick={() => scrollToSection('porque-nos-escolher')} style={{ cursor: 'pointer' }}>
                            Por que-nos escolher?
                        </a>
                    </li>
                    <li>
                        <a onClick={() => scrollToSection('comecar-transformacao')} style={{ cursor: 'pointer' }}>
                            Começar sua Transformação
                        </a>
                    </li>
                </ul>
            </div>

            {/* ========== BOTÃO CTA (DIREITA) ========== */}
            <div className="navbar-right">
                <button className="login-button">Começar Agora</button>
            </div>
        </nav>
    )
}

export default Navbar;