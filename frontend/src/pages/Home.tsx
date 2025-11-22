import Navbar from "../components/NavbarLanding";
import "../styles/pages/home.css";

function App() {
  return (
    <div>
      <Navbar/>

      <div className="container-inicial">
        <div className="texto-inicial">
          <div className="plano">Planos de treino personalizados com IA</div>
          <h1>Seu Treino <br />Perfeito em Minutos</h1>
          <p> Crie planos de treino personalizados baseados nos seus objetivos, 
              experiência e preferências. Tudo de forma visual e intuitiva.</p>
          <div className="botoes-iniciais">
            <button className="botao-inicial">Começar Agora</button>
            <button className="botao-saiba-mais">Saiba Mais</button>
          </div>
        </div>

        <div className="container">
          <div className="card-visual">
            <div className="conteudo">
              <div className="linha">
                <div className="bolinha-ai">AI</div>
                <div className="texto-falso">
                  <div className="linha-grande"></div>
                  <div className="linha-pequena"></div>
                </div>
              </div>

              <div className="card-plano">
                <div className="titulo-plano">Seu plano personalizado</div>
                <div className="item-plano">
                  <span>Segunda - Peito e Tríceps</span>
                  <div className="indicador"></div>
                </div>
                <div className="item-plano">
                  <span>Terça - Costas e Bíceps</span>
                  <div className="indicador"></div>
                </div>
                <div className="item-plano">
                  <span>Quarta - Pernas</span>
                  <div className="indicador"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App
