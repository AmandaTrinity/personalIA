import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import "../styles/components/howitworks.css";

interface OnboardingProps {
  onComplete: (profile: {
    objective?: string;
    level?: string;
    duration?: string;
    equipment?: string;
    limitations?: string;
  }) => void;
  userName: string;
}

export function Onboarding({ onComplete, userName }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [objective, setObjective] = useState('');
  const [level, setLevel] = useState('');
  const [duration, setDuration] = useState('');
  const [equipment, setEquipment] = useState('');
  const [limitations, setLimitations] = useState('');

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete({ objective, level, duration, equipment, limitations });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return objective !== '';
      case 2:
        return level !== '';
      case 3:
        return duration !== '';
      case 4:
        return equipment !== '';
      case 5:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="onboarding-container">

      <div className="onboarding-blur blur-1"></div>
      <div className="onboarding-blur blur-2"></div>

      <div className="onboarding-wrapper">
        
        {/* Progress */}
        <div className="progress-header">
          <div className="progress-info">
            <div className="hello">Olá, {userName}! 👋</div>
            <div className="progress-title">Vamos personalizar seu treino</div>
          </div>

          <div className="progress-count">
            <span className="step">{currentStep}</span>
            <span className="total">/5</span>
          </div>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>

        {/* Card */}
        <div className="onboarding-card">

          {/* Step 1 */}
          {currentStep === 1 && (
            <div className="step-area">
              <h2 className="onboarding-title">Qual é o seu objetivo?</h2>
              <p className="onboarding-subtitle">Escolha o que melhor descreve sua meta principal</p>

              <div className="option-grid">
                <button
                  onClick={() => setObjective('ganhar-massa')}
                  className={`option-card ${objective === 'ganhar-massa' ? "active" : ""}`}
                >
                  <div className="emoji">💪</div>
                  <div className="option-title">Ganhar Massa</div>
                  <div className="option-desc">Hipertrofia e força</div>
                </button>

                <button
                  onClick={() => setObjective('perder-peso')}
                  className={`option-card ${objective === 'perder-peso' ? "active" : ""}`}
                >
                  <div className="emoji">🔥</div>
                  <div className="option-title">Perder Peso</div>
                  <div className="option-desc">Queima de gordura</div>
                </button>

                <button
                  onClick={() => setObjective('condicionamento')}
                  className={`option-card ${objective === 'condicionamento' ? "active" : ""}`}
                >
                  <div className="emoji">⚡</div>
                  <div className="option-title">Condicionamento</div>
                  <div className="option-desc">Fitness geral</div>
                </button>

                <button
                  onClick={() => setObjective('resistencia')}
                  className={`option-card ${objective === 'resistencia' ? "active" : ""}`}
                >
                  <div className="emoji">🏃</div>
                  <div className="option-title">Resistência</div>
                  <div className="option-desc">Endurance e stamina</div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <div className="step-area">
              <h2 className="onboarding-title">Qual seu nível?</h2>
              <p className="onboarding-subtitle">Isso nos ajuda a ajustar a intensidade</p>

              <div className="option-grid column">
                <button
                  onClick={() => setLevel('iniciante')}
                  className={`option-card ${level === 'iniciante' ? "active" : ""}`}
                >
                  <div className="emoji">🌱</div>
                  <div className="option-title">Iniciante</div>
                  <div className="option-desc">Pouca ou nenhuma experiência</div>
                </button>

                <button
                  onClick={() => setLevel('intermediario')}
                  className={`option-card ${level === 'intermediario' ? "active" : ""}`}
                >
                  <div className="emoji">🎯</div>
                  <div className="option-title">Intermediário</div>
                  <div className="option-desc">Treina há alguns meses</div>
                </button>

                <button
                  onClick={() => setLevel('avancado')}
                  className={`option-card ${level === 'avancado' ? "active" : ""}`}
                >
                  <div className="emoji">🏆</div>
                  <div className="option-title">Avançado</div>
                  <div className="option-desc">Treina há +1 ano</div>
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <div className="step-area">
              <h2 className="onboarding-title">Quanto tempo você tem?</h2>
              <p className="onboarding-subtitle">Duração ideal por sessão</p>

              <div className="option-grid">
                {["15", "30", "45", "60+"].map((t, i) => (
                  <button
                    key={i}
                    onClick={() => setDuration(t)}
                    className={`option-card ${duration === t ? "active" : ""}`}
                  >
                    <div className="emoji">{["⚡", "🎯", "💪", "🔥"][i]}</div>
                    <div className="option-title">{t} min</div>
                    <div className="option-desc">
                      {["Rápido e eficiente", "Equilibrado", "Completo", "Intenso"][i]}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4 */}
          {currentStep === 4 && (
            <div className="step-area">
              <h2 className="onboarding-title">Que equipamentos tem?</h2>
              <p className="onboarding-subtitle">Adaptamos os exercícios ao que você possui</p>

              <div className="option-grid column">
                {[
                  { key: "sem-equipamento", emoji: "🏠", title: "Sem Equipamento", desc: "Apenas peso corporal" },
                  { key: "basico", emoji: "🏋️", title: "Básico", desc: "Halteres, elásticos, tapete" },
                  { key: "completo", emoji: "🏢", title: "Completo", desc: "Máquinas de academia" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setEquipment(item.key)}
                    className={`option-card ${equipment === item.key ? "active" : ""}`}
                  >
                    <div className="emoji">{item.emoji}</div>
                    <div className="option-title">{item.title}</div>
                    <div className="option-desc">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5 */}
          {currentStep === 5 && (
            <div className="step-area">
              <h2 className="onboarding-title">Alguma limitação física?</h2>
              <p className="onboarding-subtitle">Opcional – Nos conte qualquer restrição</p>

              <textarea
                className="textarea"
                value={limitations}
                onChange={(e) => setLimitations(e.target.value)}
                placeholder="Ex: dor no joelho direito..."
              />
            </div>
          )}

          {/* Buttons */}
          <div className="navigation">
            {currentStep > 1 && (
              <button className="back-btn" onClick={handleBack}>
                <ArrowLeft size={20} /> Voltar
              </button>
            )}

            <button
              className={`next-btn ${canProceed() ? "enabled" : ""}`}
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {currentStep === 5 ? 'Finalizar' : 'Avançar'}{' '}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
