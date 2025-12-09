import { useState } from "react";
import { ArrowRight, ArrowLeft, Dumbbell, Flame, Zap, HeartPulse, Leaf, Target, Trophy, Home} from "lucide-react";
import "../styles/components/howitworks.css";

export interface OnboardingProfile {
    gender: string;
    age: number;
    height: number;
    weight: number;
    objective: string;
    level: string;
    duration: string;
    equipment: string;
    limitations?: string | null;
}

interface OnboardingProps {
  onComplete: (profile: OnboardingProfile) => void;
  userName: string;
}

export function Onboarding({ onComplete, userName }: OnboardingProps) {
  // Estados
  const [currentStep, setCurrentStep] = useState(1);
  const [objective, setObjective] = useState('');
  const [level, setLevel] = useState('');
  const [duration, setDuration] = useState('');
  const [equipment, setEquipment] = useState('');
  const [limitations, setLimitations] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const handleNumberChange = (value: string, setter: (val: number) => void) => {
    const numberValue = Number(value);

    // Se for negativo, ignora
    if (numberValue < 0) return;

    setter(numberValue);
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete({ gender, age, height, weight, objective, level, duration, equipment, limitations });
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
        return gender !== '' && age > 5 && height > 50 && weight > 20;
      case 2:
        return objective !== '';
      case 3:
        return level !== '';
      case 4:
        return duration !== '';
      case 5:
        return equipment !== '';
      case 6:
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
            <div className="hello">Olá, {userName}!</div>
            <div className="progress-title">Vamos personalizar seu treino</div>
          </div>

          <div className="progress-count">
            <span className="step">{currentStep}</span>
            <span className="total">/6</span>
          </div>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>

        {/* Card */}
        <div className="onboarding-card">
         
          {/* Step 1 — Informações pessoais */}
          {currentStep === 1 && (
            <div className="step-area">
              <h2 className="onboarding-title">Informações Iniciais</h2>
              <p className="onboarding-subtitle">Precisamos conhecer um pouco sobre você</p>

              {/* Seleção de Gênero */}
              <div className="option-grid">
                <button
                  onClick={() => setGender("masculino")}
                  className={`option-card ${gender === "masculino" ? "active" : ""}`}
                >
                  <div className={`emoji ${gender === "masculino" ? "icon-active" : ""}`}>♂</div>
                  <div className="option-title">Masculino</div>
                </button>

                <button
                  onClick={() => setGender("feminino")}
                  className={`option-card ${gender === "feminino" ? "active" : ""}`}
                >
                  <div className={`emoji ${gender === "feminino" ? "icon-active" : ""}`}>♀</div>
                  <div className="option-title">Feminino</div>
                </button>
              </div>

              {/* Inputs numéricos */}
              <div className="option-grid column" style={{ marginTop: "25px" }}>
                <label>
                  Idade:
                  <input
                    type="number"
                    value={age || ""}
                    onChange={(e) => handleNumberChange(e.target.value, setAge)}
                    className="textarea"
                    placeholder="Ex: 25"
                    style={{ height: "55px" }}
                  />
                </label>

                <label>
                  Altura (cm):
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => handleNumberChange(e.target.value, setHeight)}
                    className="textarea"
                    placeholder="Ex: 175"
                    style={{ height: "55px" }}
                  />
                </label>

                <label>
                  Peso (kg):
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => handleNumberChange(e.target.value, setWeight)}
                    className="textarea"
                    placeholder="Ex: 70"
                    style={{ height: "55px" }}
                  />
                </label>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="step-area">
              <h2 className="onboarding-title">Qual é o seu objetivo?</h2>
              <p className="onboarding-subtitle">Escolha o que melhor descreve sua meta principal</p>

              <div className="option-grid">
                <button
                  onClick={() => setObjective('ganhar-massa')}
                  className={`option-card ${objective === 'ganhar-massa' ? "active" : ""}`}
                >
                  <div className={`emoji ${objective === 'ganhar-massa' ? "icon-active" : ""}`}>
                    <Dumbbell size={32} />
                  </div>
                  <div className="option-title">Ganhar Massa</div>
                  <div className="option-desc">Hipertrofia e força</div>
                </button>

                <button
                  onClick={() => setObjective('perder-peso')}
                  className={`option-card ${objective === 'perder-peso' ? "active" : ""}`}
                >
                  <div className={`emoji ${objective === 'perder-peso' ? "icon-active" : ""}`}>
                    <Flame size={32} />
                  </div>
                  <div className="option-title">Perder Peso</div>
                  <div className="option-desc">Queima de gordura</div>
                </button>

                <button
                  onClick={() => setObjective('condicionamento')}
                  className={`option-card ${objective === 'condicionamento' ? "active" : ""}`}
                >
                  <div className={`emoji ${objective === 'condicionamento' ? "icon-active" : ""}`}>
                    <Zap size={32} />
                  </div>
                  <div className="option-title">Condicionamento</div>
                  <div className="option-desc">Fitness geral</div>
                </button>

                <button
                  onClick={() => setObjective('resistencia')}
                  className={`option-card ${objective === 'resistencia' ? "active" : ""}`}
                >
                  <div className={`emoji ${objective === 'resistencia' ? "icon-active" : ""}`}>
                    <HeartPulse size={32} />
                  </div>
                  <div className="option-title">Resistência</div>
                  <div className="option-desc">Endurance e stamina</div>
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="step-area">
              <h2 className="onboarding-title">Qual seu nível?</h2>
              <p className="onboarding-subtitle">Isso nos ajuda a ajustar a intensidade</p>

              <div className="option-grid column">
                <button
                  onClick={() => setLevel('iniciante')}
                  className={`option-card ${level === 'iniciante' ? "active" : ""}`}
                >
                  <div className={`emoji ${level === 'iniciante' ? "icon-active" : ""}`}>
                    <Leaf size={32} />
                  </div>
                  <div className="option-title">Iniciante</div>
                  <div className="option-desc">Pouca ou nenhuma experiência</div>
                </button>

                <button
                  onClick={() => setLevel('intermediario')}
                  className={`option-card ${level === 'intermediario' ? "active" : ""}`}
                >
                  <div className={`emoji ${level === 'intermediario' ? "icon-active" : ""}`}>
                    <Target size={32} />
                  </div>
                  <div className="option-title">Intermediário</div>
                  <div className="option-desc">Treina há alguns meses</div>
                </button>

                <button
                  onClick={() => setLevel('avancado')}
                  className={`option-card ${level === 'avancado' ? "active" : ""}`}
                >
                  <div className={`emoji ${level === 'avancado' ? "icon-active" : ""}`}>
                    <Trophy size={32} />
                  </div>
                  <div className="option-title">Avançado</div>
                  <div className="option-desc">Treina há +1 ano</div>
                </button>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="step-area">
              <h2 className="onboarding-title">Com que frequência você treina?</h2>
              <p className="onboarding-subtitle">Isso nos ajuda a criar um plano sustentável</p>

              <div className="option-grid">
                {[
                  // Mapeamento de valores para refletir frequência (frequencia)
                  { value: "1-2 dias por semana", title: "Iniciante", desc: "1 a 2x/semana" },
                  { value: "3 dias por semana", title: "Intermediário", desc: "3x/semana" },
                  { value: "4-5 dias por semana", title: "Avançado", desc: "4 a 5x/semana" },
                  { value: "Diariamente (6+ dias)", title: "Diariamente", desc: "6+ vezes/semana" }
                ].map((t, i) => (
                  <button
                    key={i}
                    onClick={() => setDuration(t.value)} // Armazena a frequência em 'duration'
                    className={`option-card ${duration === t.value ? "active" : ""}`}
                  >
                    <div className={`emoji ${duration === t.value ? "icon-active" : ""}`}>
                      {[<Zap size={32}/>, <Target size={32}/>, <Dumbbell size={32}/>, <Flame size={32}/>][i]}
                    </div>
                    <div className="option-title">{t.title}</div>
                    <div className="option-desc">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="step-area">
              <h2 className="onboarding-title">Que equipamentos tem?</h2>
              <p className="onboarding-subtitle">Adaptamos os exercícios ao que você possui</p>

              <div className="option-grid column">
                {[
                  { key: "sem-equipamento", icon: <Home size={32} />, title: "Sem Equipamento", desc: "Apenas peso corporal" },
                  { key: "basico", icon: <Dumbbell size={32} />, title: "Básico", desc: "Halteres, elásticos, tapete" },
                  { key: "completo", icon: <Trophy size={32} />, title: "Completo", desc: "Máquinas de academia" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setEquipment(item.key)}
                    className={`option-card ${equipment === item.key ? "active" : ""}`}
                  >
                    <div className={`emoji ${equipment === item.key ? "icon-active" : ""}`}>
                      {item.icon}
                    </div>
                    <div className="option-title">{item.title}</div>
                    <div className="option-desc">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 6 && (
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
              {currentStep === 6 ? 'Finalizar' : 'Avançar'}{' '}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
