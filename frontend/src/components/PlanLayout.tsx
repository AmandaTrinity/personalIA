import { useState, useRef, useEffect } from 'react';
import { Send, Brain, User, Dumbbell, Save, MessageSquare, CheckCircle2, Circle, Play } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import '../styles/pages/trainingPlan.css'; 
// Importa a nova função para comunicação com a API e o tipo de dados
import { sendPlanRequest, type PlanRequestData, listTreinos } from '../services/treino_api';

// --- Tipos de Dados ---
interface UserProfile {
  name: string;
  email: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  objective?: string;
  level?: string;
  duration?: string; // Frequência do treino
  equipment?: string;
  limitacoes?: string;
}

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  completed: boolean; // Simulação de progresso
}

interface WorkoutDay {
  day: string; // Ex: Segunda-feira
  title: string; // Ex: Peito e Braços em Casa
  exercises: Exercise[];
}

interface PlanLayoutProps {
  userProfile: UserProfile;
}

// --- Funções Auxiliares ---
// Funções mantidas para display/UX

function getObjectiveText(objective?: string): string {
  const objectives: Record<string, string> = {
    'ganhar-massa': 'Ganhar Massa Muscular',
    'perder-peso': 'Perder Peso',
    'condicionamento': 'Melhorar Condicionamento',
    'resistencia': 'Aumentar Resistência',
  };
  return objectives[objective || 'ganhar-massa'] || 'Ganho de Massa Muscular';
}

function getLevelText(level?: string): string {
  const levels: Record<string, string> = {
    'iniciante': 'Iniciante',
    'intermediario': 'Intermediário',
    'avancado': 'Avançado',
  };
  return levels[level || 'iniciante'] || 'Iniciante';
}

function getEquipmentText(equipment?: string): string {
  const equipments: Record<string, string> = {
    'sem-equipamento': 'Sem Equipamento',
    'basico': 'Equipamento Básico',
    'completo': 'Academia Completa',
  };
  return equipments[equipment || 'sem-equipamento'] || 'Sem Equipamento';
}

// Parser: converte o texto livre da IA em um array de WorkoutDay
function parsePlanFromAI(text: string): WorkoutDay[] {
  if (!text || typeof text !== 'string') return [];

  const lines = text.split('\n').map(l => l.trim()).filter(l => l !== '');

  // Detecta indices onde começam novos dias (ex: Segunda-feira:, Dia 1:, Treino - Dia 1)
  const dayStartIndexes: number[] = [];
  const dayNameRegex = /^(segunda|terça|terca|quarta|quinta|sexta|sábado|sabado|domingo)[:\s-]?/i;
  const diaRegex = /^dia\s+\d+/i;

  for (let i = 0; i < lines.length; i++) {
    if (dayNameRegex.test(lines[i]) || diaRegex.test(lines[i]) || /^dia[:\s]/i.test(lines[i])) {
      dayStartIndexes.push(i);
    }
  }

  // Se não encontrar divisões por dia, tenta dividir por blocos separados por linhas em branco (já removidas),
  // então assume que cada bloco de exercícios separado por "\n\n" no original corresponde a um dia.
  if (dayStartIndexes.length === 0) {
    // Tenta dividir por títulos que contenham 'Dia' ou 'Treino' ou por headings numeradas (1., 2., ...)
    // fallback: agrupa tudo como um único dia
    const single: WorkoutDay = {
      day: 'Dia 1',
      title: lines[0] || 'Treino Personalizado',
      exercises: parseExercisesFromLines(lines),
    };
    return [single];
  }

  const days: WorkoutDay[] = [];
  for (let d = 0; d < dayStartIndexes.length; d++) {
    const start = dayStartIndexes[d];
    const end = d + 1 < dayStartIndexes.length ? dayStartIndexes[d + 1] : lines.length;
    const block = lines.slice(start, end);

    // O primeiro line do bloco costuma conter o dia/título
    const first = block[0];
    // Remove prefixo como "Segunda-feira:" ou "Dia 1 -"
  const title = first.replace(/^(segunda|terça|terca|quarta|quinta|sexta|sábado|sabado|domingo)[:\s-]*/i, '').replace(/^dia\s+\d+[:\s-]*/i, '').trim() || 'Treino';

    const exercises = parseExercisesFromLines(block.slice(1));

  days.push({ day: first.split(/[:-]/)[0] || 'Dia', title: title || 'Treino', exercises });
  }

  return days;
}

// Extrai exercícios de um bloco de linhas
function parseExercisesFromLines(lines: string[]): Exercise[] {
  const exercises: Exercise[] = [];

  // Regex para capturar linhas como "1. Agachamento - 3 séries de 12" ou "1) Agachamento"
  const exerciseLineRegex = /^\d+[.)]?\s*(.+)/;
  const setsRepsRegex = /(\d+)\s*[xX]\s*(\d+)|(?:(\d+)\s*s(?:éries|eries)?\s*(?:de)?\s*(\d+))/i;
  const restRegex = /(descans[oa]o|descanso|intervalo):?\s*(\d+s|\d+m|\d+\s*min)/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nameMatch = line.match(exerciseLineRegex);
    if (nameMatch) {
      const name = nameMatch[1].split('-')[0].trim();

      // procura sets/reps/rest nas próximas 2 linhas
      let sets = '';
      let reps = '';
      let rest = '';

      const lookahead = lines.slice(i + 1, i + 4).join(' ');
      const sr = lookahead.match(setsRepsRegex);
      if (sr) {
        if (sr[1] && sr[2]) {
          sets = sr[1];
          reps = sr[2];
        } else if (sr[3] && sr[4]) {
          sets = sr[3];
          reps = sr[4];
        }
      }

      const rr = lookahead.match(restRegex);
      if (rr) {
        rest = rr[2];
      }

      exercises.push({ name: name || line, sets: sets || '3', reps: reps || '12', rest: rest || '60s', completed: false });
    } else {
      // Também aceita listas iniciadas com '-' ou '*'
      if (/^[-*]\s+/.test(line)) {
        const name = line.replace(/^[-*]\s+/, '').split('-')[0].trim();
        exercises.push({ name, sets: '3', reps: '12', rest: '60s', completed: false });
      }
    }
  }

  return exercises;
}

// REMOVIDA: function generateAIResponse(userMessage: string, profile: UserProfile): string {

// --- Componente Principal ---

export function PlanLayout({ userProfile }: PlanLayoutProps) {
  // MOCK: Plano de treino baseado na imagem e no perfil mockado
  const mockWorkoutPlan: WorkoutDay[] = [
    {
      day: "Segunda-feira",
      title: "Peito e Braços em Casa",
      exercises: [
        { name: "Flexão de Braço no Chão", sets: "3", reps: "10-15", rest: "60s", completed: true },
        { name: "Flexão com Joelhos Apoiados", sets: "3", reps: "15", rest: "45s", completed: true },
        { name: "Mergulho na Cadeira (Tríceps)", sets: "3", reps: "12", rest: "45s", completed: false },
        { name: "Abdominal Crunch", sets: "3", reps: "15", rest: "30s", completed: false },
        { name: "Prancha (Core)", sets: "3", reps: "60s", rest: "30s", completed: false },
        { name: "Alongamento Peitoral", sets: "1", reps: "30s", rest: "0s", completed: false },
      ],
    },
    {
      day: "Quarta-feira",
      title: "Pernas e Glúteos",
      exercises: [
        { name: "Agachamento Livre", sets: "3", reps: "12-15", rest: "60s", completed: false },
        { name: "Avanço (Afundo)", sets: "3", reps: "10 (cada perna)", rest: "60s", completed: false },
        { name: "Elevação de Panturrilha", sets: "3", reps: "20", rest: "30s", completed: false },
        { name: "Elevação de Quadril (Glúteo)", sets: "3", reps: "15", rest: "45s", completed: false },
        { name: "Alongamento de Isquiotibiais", sets: "1", reps: "30s", rest: "0s", completed: false },
      ],
    },
    {
      day: "Sexta-feira",
      title: "Abdômen e Core",
      exercises: [
        { name: "Elevação de Pernas", sets: "3", reps: "15", rest: "45s", completed: false },
        { name: "Bicicleta no Chão", sets: "3", reps: "20 (total)", rest: "45s", completed: false },
        { name: "Prancha Lateral", sets: "3", reps: "45s (cada lado)", rest: "30s", completed: false },
        { name: "Rotação Russa", sets: "3", reps: "15 (cada lado)", rest: "45s", completed: false },
      ],
    },
  ];

  const [workoutPlan, setWorkoutPlan] = useState<WorkoutDay[]>(mockWorkoutPlan);
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutDay>(mockWorkoutPlan[0]);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [savedWorkouts, setSavedWorkouts] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'workout' | 'progress'>('workout');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Calcula a porcentagem de conclusão para o indicador de progresso
  const getCompletionPercentage = (workout: WorkoutDay) => {
    const completed = workout.exercises.filter(e => e.completed).length;
    if (workout.exercises.length === 0) return 0;
    return Math.round((completed / workout.exercises.length) * 100);
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    // Mensagem inicial de boas-vindas no chat
    const welcomeMessage: Message = {
      id: 1,
      sender: 'ai',
      text: `Olá ${userProfile.name}! Seu plano de treino já está pronto e personalizado para ${getObjectiveText(userProfile.objective)}!`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [userProfile.name, userProfile.objective]);

  // Ao montar, tenta carregar o último treino salvo do backend e popular a UI
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const treinos = await listTreinos();
        if (!mounted) return;
        if (treinos && treinos.length > 0) {
          // Assume que o último elemento é o mais recente (backend retorna em ordem)
          const latest = treinos[0];
          const plano = latest.plano_gerado;
          if (typeof plano === 'string' && plano.trim().length > 0) {
            const parsed = parsePlanFromAI(plano);
            if (parsed && parsed.length > 0) {
              setWorkoutPlan(parsed);
              setCurrentWorkout(parsed[0]);
            }
          }
        }
      } catch (e) {
        console.debug('Falha ao carregar treinos salvos:', e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      text: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Mapeia o perfil do usuário para o corpo da API (PlanRequestData)
      const requestBody: PlanRequestData = {
          mensagem_usuario: userMessage.text,
          nivel: userProfile.level,
          objetivo: userProfile.objective,
          // O backend espera List[str] para equipamentos
          equipamentos: userProfile.equipment ? [userProfile.equipment] : undefined,
          frequencia: userProfile.duration,
      };

      // Chamada real à API do Gemini via backend
      const aiResponse = await sendPlanRequest(requestBody);
      
      // Adiciona a mensagem bruta ao chat
      const aiMessage: Message = {
        id: messages.length + 2,
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      // DEBUG/robustez: tentar extrair um plano mesmo se o backend retornar JSON
      // ou um objeto serializado. O sendPlanRequest às vezes pode retornar
      // um JSON stringificado contendo { treino: { plano_gerado: '...' } }.
      try {
        let planText: string | null = null;

        // 1) se aiResponse já contém 'Plano de Treino' ou linhas, usa diretamente
        if (typeof aiResponse === 'string' && /plano de treino|segunda-feira|dia 1|1\./i.test(aiResponse)) {
          planText = aiResponse;
        }

        // 2) tenta parsear como JSON caso seja stringified JSON
        if (!planText) {
          try {
            const parsedJson = JSON.parse(aiResponse);
            // procura por treino.plano_gerado
            if (parsedJson && typeof parsedJson === 'object') {
              if ('treino' in parsedJson && parsedJson.treino && typeof parsedJson.treino === 'object' && 'plano_gerado' in parsedJson.treino) {
                planText = parsedJson.treino.plano_gerado as string;
              } else if ('plano_gerado' in parsedJson && typeof parsedJson.plano_gerado === 'string') {
                planText = parsedJson.plano_gerado as string;
              }
            }
          } catch {
            // não é JSON, ignora
          }
        }

        // 3) fallback: se a mensagem da IA contém um bloco de Markdown com listas numeradas,
        // tratamos o texto raw como planText
        if (!planText && typeof aiResponse === 'string') {
          // pega até um limite razoável
          planText = aiResponse;
        }

        if (planText) {
          const parsed = parsePlanFromAI(planText);
          if (parsed && parsed.length > 0) {
            setWorkoutPlan(parsed);
            setCurrentWorkout(parsed[0]);
            console.debug('Plano extraído da resposta da IA:', parsed);
          } else {
            console.debug('Parser não extraiu dias/exercícios da resposta da IA. Raw:', planText);
          }
        }
      } catch (e) {
        console.debug('Erro ao tentar extrair plano da IA:', e);
      }

    } catch (error) {
        console.error('Erro ao enviar mensagem para IA:', error);
        const errorMessage: Message = {
            id: messages.length + 2,
            sender: 'ai',
            text: '❌ Ocorreu um erro ao conectar com o PersonalIA. Tente novamente.',
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Lida com o clique no círculo para marcar/desmarcar exercício
  const toggleExercise = (workoutDay: WorkoutDay, exerciseName: string) => {
    const updatedPlan = workoutPlan.map(day => {
      if (day.day === workoutDay.day) {
        return {
          ...day,
          exercises: day.exercises.map(exercise => {
            if (exercise.name === exerciseName) {
              return { ...exercise, completed: !exercise.completed };
            }
            return exercise;
          }),
        };
      }
      return day;
    });

    setWorkoutPlan(updatedPlan);
    setCurrentWorkout(updatedPlan.find(d => d.day === workoutDay.day) || currentWorkout);
  };

  const handleSaveWorkout = () => {
    setSavedWorkouts([...savedWorkouts, `${currentWorkout.title} - ${new Date().toLocaleDateString('pt-BR')}`]);
    const aiMessage: Message = {
      id: messages.length + 1,
      sender: 'ai',
      text: `✅ Treino "${currentWorkout.title}" salvo com sucesso! Você pode acessá-lo na seção "Treinos Salvos".`,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMessage]);
  };
  
  // Renderiza os detalhes do exercício na tabela
  const renderExerciseRow = (exercise: Exercise, index: number, workoutDay: WorkoutDay) => {
    const isCompleted = exercise.completed;

    return (
      <div 
        key={index} 
        className={`exercise-row ${isCompleted ? 'completed' : 'pending'}`}
        onClick={() => toggleExercise(workoutDay, exercise.name)} // Permite marcar/desmarcar
      >
        {/* COLUNA 1: Checkbox (filho direto do Grid) */}
        <button className="check-button" onClick={(e) => { e.stopPropagation(); toggleExercise(workoutDay, exercise.name); }}>
          {isCompleted ? <CheckCircle2 size={24} className="check-icon" /> : <Circle size={24} className="circle-icon" />}
        </button>        
        {/* COLUNA 2: Nome (Filho direto do Grid, vai crescer e quebrar linha se precisar) */}
        <span className={`exercise-name ${isCompleted ? 'text-strikethrough' : ''}`}>
          {exercise.name}
        </span>

        {/* COLUNA 3: Estatísticas */}
        <div className="exercise-stats-grid">
          <div className="stat-box">
            <span className="stat-value">{exercise.sets}</span>
            <span className="stat-label">Séries</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">{exercise.reps}</span>
            <span className="stat-label">Reps</span>
          </div>
          <div className="stat-box">
            <span className="stat-value">{exercise.rest}</span>
            <span className="stat-label">Descanso</span>
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="plan-page-container">
      {/* 1. Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <Dumbbell className="logo-icon" />
            <span className="logo-text">FitPlan AI</span>
          </div>
          <div className="user-info">
            <div className="user-text">Bem-vindo,</div>
            <div className="user-name">{userProfile.name || 'Usuário'}</div>
          </div>
        </div>

        <div className="sidebar-content">
          <div className="profile-section">
            <h3 className="section-title">Seu Perfil</h3>
            <div className="profile-item">
              <div className="item-label">Objetivo</div>
              <div className="item-value">{getObjectiveText(userProfile.objective)}</div>
            </div>
            <div className="profile-item">
              <div className="item-label">Nível</div>
              <div className="item-value">{getLevelText(userProfile.level)}</div>
            </div>
            <div className="profile-item">
              <div className="item-label">Duração</div>
              <div className="item-value">{userProfile.duration || '15 minutos'}</div>
            </div>
            <div className="profile-item">
              <div className="item-label">Equipamento</div>
              <div className="item-value">{getEquipmentText(userProfile.equipment)}</div>
            </div>
          </div>

          <div className="saved-workouts-section">
            <h3 className="section-title">Treinos Salvos</h3>
            {savedWorkouts.length === 0 ? (
              <div className="empty-state">Nenhum treino salvo ainda</div>
            ) : (
              <div className="saved-list">
                {savedWorkouts.map((workout, index) => (
                  <div key={index} className="saved-item">
                    {workout}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 2. Main Content */}
      <div className="main-content">
        <div className="main-header">
          <div className="header-info">
            <div className="title">Seu Plano de Treino Personalizado</div>
            <div className="subtitle">Plano ABC - 3x por semana</div>
          </div>
          <div className="header-actions">
            <button
              onClick={() => setShowChat(!showChat)}
              className="action-button chat-button"
            >
              <MessageSquare size={18} />
              <span className="hidden sm:inline">Chat com IA</span>
            </button>
            <button
              onClick={handleSaveWorkout}
              className="action-button save-button"
            >
              <Save size={18} />
              <span className="hidden sm:inline">Salvar</span>
            </button>
          </div>
        </div>

        <div className="tabs-container">
          <div className={`tab ${activeTab === 'workout' ? 'active' : ''}`} onClick={() => setActiveTab('workout')}>
            <Dumbbell size={18} />
            Meu Treino
          </div>
        </div>

        {/* Tab Content: Meu Treino */}
        {activeTab === 'workout' && (
          <div className="workout-content-area">
            {/* Visão Geral da Semana */}
            <div className="workout-overview-grid">
              {workoutPlan.map((workout, index) => (
                <div
                  key={index}
                  className={`workout-card ${currentWorkout.day === workout.day ? 'active-card' : ''}`}
                  onClick={() => setCurrentWorkout(workout)}
                >
                  <div className="card-day">{workout.day}</div>
                  <div className="card-title">{workout.title}</div>
                  <div className="card-progress-bar">
                    <div className="progress-fill" style={{ width: `${getCompletionPercentage(workout)}%` }}></div>
                  </div>
                  <div className="card-footer">
                    <div className="card-exercises">{workout.exercises.length} exercícios</div>
                    <div className="card-percent">{getCompletionPercentage(workout)}%</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Detalhes do Treino Atual */}
            <div className="current-workout-details">
              <div className="details-header">
                <div className="header-text-group">
                  <h2 className="details-title">{currentWorkout.title}</h2>
                  <span className="details-subtitle">{currentWorkout.day}</span>
                </div>
                
                <button className="start-button">
                  <Play size={18} /> Iniciar Treino
                </button>
              </div>

              <div className="exercise-list-container">
                {currentWorkout.exercises.map((exercise, index) =>
                  renderExerciseRow(exercise, index, currentWorkout)
                )}
              </div>
            </div>
          </div>
        )}
        
      </div>

      {/* 3. Chat Sidebar/Modal */}
      {showChat && (
        <div className="chat-sidebar-overlay" onClick={() => setShowChat(false)}>
          <div className="chat-sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="chat-header">
              <div className="chat-info">
                <Brain size={24} />
                <div>
                  <div className="chat-title">Chat com IA</div>
                  <div className="chat-subtitle">Tire suas dúvidas sobre o treino</div>
                </div>
              </div>
              <button className="close-button" onClick={() => setShowChat(false)}>
                ✕
              </button>
            </div>

            <div className="chat-messages-container">
              {messages.map((message) => (
                <div key={message.id} className={`message-row ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}>
                  <div className="sender-icon">
                    {message.sender === 'ai' ? <Brain size={16} /> : <User size={16} />}
                  </div>
                  <div className="message-bubble">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="message-row ai-message">
                  <div className="sender-icon"><Brain size={16} /></div>
                  <div className="message-bubble typing-indicator">
                    <div className="dot"></div>
                    <div className="dot delay-1"></div>
                    <div className="dot delay-2"></div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Qual sua dúvida sobre o treino?"
                className="chat-input-field"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="chat-send-button"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}