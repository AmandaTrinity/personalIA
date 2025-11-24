import Navbar from "../components/NavbarLanding";
import { UserRound, Users, Lock, Zap, Save, Brain, CheckCircle2, ArrowRight } from 'lucide-react';
import { Target } from 'lucide-react';
import { ClipboardList } from 'lucide-react';
import { MessageCircle } from 'lucide-react';
import { PartyPopper } from 'lucide-react';
import "../styles/pages/home.css";

function App() {
  return (
    <div>
      {/* ========== NAVBAR ========== */}
      <Navbar/>

      {/* ========== INTRODUÇÃO ========== */}
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

      {/* ========== COMO FUNCIONA? ========== */}
            <div id="como-funciona" className="section-como-funciona">
        <div className="title-como-funciona">
           <h2>Como Funciona?</h2>
           <p>Em apenas 5 passos simples, você terá seu plano de treino personalizado</p>
        </div>
        
        <div className="passos-como-funciona">
          <div className="passo">
            <div className="numero-passo">1</div>
            <div className="icone-cadastro"><UserRound/></div>
            <h3>Cadastro visual</h3>
            <p>Responda perguntas de forma visual e intuitiva sobre seu perfil</p>
          </div>

          <div className="passo">
              <div className="numero-passo">2</div>
              <div className="icone-cadastro"><Target/></div>
              <h3>Escolha seu objetivo</h3>
              <p>Selecione visualmente entre ganho de massa, perda de peso, ou condicionamento</p>
          </div>

          <div className="passo">
              <div className="numero-passo">3</div>
              <div className="icone-cadastro"><ClipboardList/></div>
              <h3>Suas Características</h3>
              <p>Informe altura, peso e nível de experiência de forma simples</p>
          </div>

          <div className="passo">
              <div className="numero-passo">4</div>
              <div className="icone-cadastro"><MessageCircle/></div>
              <h3>Chat Inteligente</h3>
              <p>Converse com a IA que lembra de todas suas informações</p>
          </div>

          <div className="passo">
              <div className="numero-passo">5</div>
              <div className="icone-cadastro"><PartyPopper/></div>
              <h3>Seu plano pronto</h3>
              <p>Receba, salve e tire dúvidas sobre seu treino personalizado</p>
          </div>
        </div>

      {/* ========== CADASTRO 100% VISUAL ========== */}
        <div className="cadastro-visual">
          <div className="explicacao-cadastro">
            <h2>Cadastro 100% Visual e Interativo</h2>
            <p>Esqueça formulários chatos! Nosso cadastro foi desenhado para ser uma experiência fluida. Escolha ícones, selecione imagens e deslize opções para criar seu perfil em segundos.</p>
            <ul>
              <li><CheckCircle2 size={20} className="check-icon" /> Interface intuitiva e amigável</li>
              <li><CheckCircle2 size={20} className="check-icon" /> Sem textos longos e cansativos</li>
              <li><CheckCircle2 size={20} className="check-icon" /> Experiência rápida e divertida</li>
            </ul>
          </div>

          <div className="container-cadastro">
            <h2>Qual seu objetivo?</h2>

            <div className="opcoes-objetivo">
              <div className="opcao-objetivo">
                <Zap size={32} />
                <span>Ganho de Massa</span>
              </div>

              <div className="opcao-objetivo">
                <Target size={32} />
                <span>Perda de Peso</span>
              </div>

              <div className="opcao-objetivo">
                <Brain size={32} />
                <span>Condicionamento</span>
              </div>

              <div className="opcao-objetivo">
                <UserRound size={32} />
                <span>Flexibilidade</span>
              </div>
            </div>
          </div>
        </div>

      {/* ========== PORQUE ESCOLHER PERSONALIA? ========== */}
        <div id="porque-nos-escolher" className="porque-escolher">
          <div className="header-escolher">
            <h2>Por que escolher o <span>PersonalIA</span>?</h2>
            <p>Tecnologia de ponta combinada com simplicidade para transformar seu treino</p>
          </div>

          <div className="grid-motivos">
            <div className="card-motivo">
              <div className="icone-motivo">
                <Brain size={32} />
              </div>
              <h3>IA Personalizada</h3>
              <p>Nossa inteligência artificial cria treinos únicos baseados no seu perfil completo, não apenas templates genéricos.</p>
            </div>
           
            <div className="card-motivo">
              <div className="icone-motivo">
                <MessageCircle size={32} />
              </div>
              <h3>Chat Inteligente</h3>
              <p>Tire dúvidas, ajuste exercícios e converse sobre seu treino a qualquer momento</p>
            </div>

            <div className="card-motivo">
              <div className="icone-motivo">
                <Save size={32} />
              </div>
              <h3>Salve seus Treinos</h3>
              <p>Guarde todos os seus planos de treino e acesse quando precisar</p>
            </div>

            <div className="card-motivo">
              <div className="icone-motivo">
                <Zap size={32} />
              </div>
              <h3>Resultados Rápidos</h3>
              <p>Receba seu plano personalizado em segundos, não em dias</p>
            </div>

            <div className="card-motivo">
              <div className="icone-motivo">
                <Lock size={32} />
              </div>
              <h3>Seus Dados Seguros</h3>
              <p>Mantemos suas informações pessoais protegidas e privadas</p>
            </div>

            <div className="card-motivo">
              <div className="icone-motivo">
                <Users size={32} />
              </div>
              <h3>Suporte Dedicado</h3>
              <p>Nossa equipe está sempre pronta para ajudar você</p>
            </div>
          </div>
        </div>
    </div>
      {/* ========== PRONTO PARA COMEÇAR SUA TRANSFORMAÇÃO? ========== */}
        <div id="comecar-transformacao" className="cta-transformacao">
          <div className="cta-conteudo">
            <h2>Pronto para Começar sua Transformação?</h2>
            <p>Junte-se as pessoas que já mudaram de vida com o <span>PersonalIA</span>. Seu plano perfeito está a apenas alguns cliques de distância.</p>
            
            <button className="btn-cta-final">
              Começar agora <ArrowRight size={24} />
            </button>
          </div>
        </div>
      </div>
  );
};

export default App
