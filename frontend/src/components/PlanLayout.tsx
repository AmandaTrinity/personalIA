import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Brain, User, Dumbbell, Save, MessageSquare, CheckCircle2, Circle, Play, BarChart3, Loader, Youtube, Pencil, X, LogOut } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import '../styles/pages/trainingPlan.css'; 
// Importa a nova função para comunicação com a API e o tipo de dados
import { sendPlanRequest, type PlanRequestData } from '../services/treino_api';
import { logout } from '../services/auth_api';
import { getExerciseVideo } from '../../../docs/exerciseLibrary';

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

// --- Componente Principal ---

export function PlanLayout({ userProfile }: PlanLayoutProps) {
  const navigate = useNavigate();
  // Estado local do perfil para permitir edição
  const [profile, setProfile] = useState<UserProfile>(userProfile);
  
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutDay[]>([]);
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutDay | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [savedWorkouts, setSavedWorkouts] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'workout' | 'progress'>('workout');
  
  // Estados para edição de perfil
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState<UserProfile>(userProfile);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Calcula a porcentagem de conclusão para o indicador de progresso
  // (Movido para cima para ser usado no useMemo)
  const getCompletionPercentage = (workout: WorkoutDay) => {
    const completed = workout.exercises.filter(e => e.completed).length;
    if (workout.exercises.length === 0) return 0;
    return Math.round((completed / workout.exercises.length) * 100);
  };

  // MVP: Gera dados mockados para o gráfico de evolução (estilo GitHub)
  // Cria um array de ~150 dias atrás até hoje
  const evolutionData = useMemo(() => {
    const data = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normaliza para meia-noite

    // Determina o início da semana atual (Domingo)
    const currentDayOfWeek = today.getDay(); // 0 (Dom) a 6 (Sab)
    const startOfCurrentWeek = new Date(today);
    startOfCurrentWeek.setDate(today.getDate() - currentDayOfWeek);
    startOfCurrentWeek.setHours(0, 0, 0, 0);

    for (let i = 150; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      let level = 0;

      // Se a data for anterior a essa semana, inicia zerado
      if (date < startOfCurrentWeek) {
        level = 0;
      } else {
        // Se for a semana atual, usa os dados REAIS do workoutPlan (checkboxes)
        const dayNameMap = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
        const dayName = dayNameMap[date.getDay()];
        
        // Procura se existe um treino para esse dia (ex: "Segunda-feira")
        const workoutForDay = workoutPlan.find(w => w.day.toLowerCase().includes(dayName) || w.title.toLowerCase().includes(dayName));
        
        if (workoutForDay) {
          const pct = getCompletionPercentage(workoutForDay);
          if (pct > 0) level = 1;
          if (pct > 25) level = 2;
          if (pct > 50) level = 3;
          if (pct > 75) level = 4;
        }
      }
      
      data.push({ date, level });
    }
    return data;
  }, [workoutPlan]); // Recalcula sempre que o plano (checkboxes) mudar
  
  // Calcula as estatísticas de evolução (dias treinados, sequências, etc.)
  const evolutionStats = useMemo(() => {
    const trainedDays = evolutionData.filter(d => d.level > 0).length;

    let longestStreak = 0;
    let currentLongest = 0;
    for (const day of evolutionData) {
      if (day.level > 0) {
        currentLongest++;
      } else {
        longestStreak = Math.max(longestStreak, currentLongest);
        currentLongest = 0;
      }
    }
    longestStreak = Math.max(longestStreak, currentLongest); // Checagem final

    let currentStreak = 0;
    // A sequência "atual" é contada de hoje para trás.
    const reversedData = [...evolutionData].reverse();
    
    // Permite que a sequência continue se o treino de hoje ainda não foi feito,
    // mas o de ontem foi (para não zerar a sequência logo de manhã).
    let startIndex = 0;
    if (reversedData.length > 1 && reversedData[0].level === 0 && reversedData[1].level > 0) {
      startIndex = 1;
    }

    for (let i = startIndex; i < reversedData.length; i++) {
      if (reversedData[i].level > 0) {
        currentStreak++;
      } else {
        break; // A sequência foi quebrada
      }
    }
    
    return { trainedDays, longestStreak, currentStreak };
  }, [evolutionData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Função para parsear o Markdown da IA em objetos WorkoutDay
  const parseMarkdownToWorkoutPlan = (text: string): WorkoutDay[] => {
    const days: WorkoutDay[] = [];
    // Divide por "### " que indica início de um dia
    const daySections = text.split(/^###\s+/m).slice(1);

    daySections.forEach(section => {
      const lines = section.split('\n').filter(l => l.trim());
      if (lines.length === 0) return;

      // Primeira linha é o título do dia (ex: "Dia 1: Peito")
      const header = lines[0].trim();
      let day = "Treino";
      let title = header;
      
      if (header.includes(':')) {
        const parts = header.split(':');
        day = parts[0].trim();
        title = parts.slice(1).join(':').trim();
      }

      const exercises: Exercise[] = [];
      // Regex para: 1. **Nome**: 3 séries de 10 reps, descanso de 60s
      const regex = /^\d+\.\s*\*\*?(.*?)\*\*?:\s*(\d+)\s*séries\s*de\s*(.*?)\s*(?:reps|repetições|repeticoes),\s*(?:descanso|intervalo)\s*de\s*(.*)/i;

      for (let i = 1; i < lines.length; i++) {
        const match = lines[i].match(regex);
        if (match) {
          exercises.push({
            name: match[1].trim(),
            sets: match[2].trim(),
            reps: match[3].trim(),
            rest: match[4].trim(),
            completed: false
          });
        }
      }

      if (exercises.length > 0) {
        days.push({ day, title, exercises });
      }
    });
    
    return days;
  };

  useEffect(() => {
    // Mensagem inicial de boas-vindas no chat
    const welcomeMessage: Message = {
      id: 1,
      sender: 'ai',
      text: `Olá ${profile.name}! Estou gerando um plano de treino personalizado para ${getObjectiveText(profile.objective)}.`,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [profile.name, profile.objective]);

  // Atualiza o perfil local se a prop mudar
  useEffect(() => {
    setProfile(userProfile);
  }, [userProfile]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Gera o plano ao carregar
  useEffect(() => {
    const generatePlan = async () => {
      setIsGenerating(true);
      try {
        const prompt = `Crie um plano de treino semanal completo para um usuário com:
        - Objetivo: ${profile.objective}
        - Nível: ${profile.level}
        - Frequência: ${profile.duration}
        - Equipamentos: ${profile.equipment}
        - Limitações: ${profile.limitacoes || 'Nenhuma'}
        
        Formate a resposta estritamente em Markdown.
        Para cada dia, use o formato "### Dia X: Dia da Semana - Foco do Treino".
        Exemplo: "### Dia 1: Segunda-feira - Peito e Tríceps".
        IMPORTANTE: O título DEVE especificar os grupos musculares (ex: "Costas e Bíceps", "Pernas"). Evite "Corpo Inteiro" para todos os dias, prefira dividir o treino se a frequência permitir.
        IMPORTANTE: Cada dia de treino deve ter pelo menos 5 exercícios.
        Para exercícios, use "1. **Nome**: X séries de Y reps, descanso de Z".`;

        const requestData: PlanRequestData = {
          mensagem_usuario: prompt,
          nivel: profile.level,
          objetivo: profile.objective,
          equipamentos: profile.equipment ? [profile.equipment] : [],
          frequencia: profile.duration
        };

        const response = await sendPlanRequest(requestData);
        const parsed = parseMarkdownToWorkoutPlan(response);
        
        if (parsed.length > 0) {
          setWorkoutPlan(parsed);
          setCurrentWorkout(parsed[0]);
        }
      } catch (error) {
        console.error("Erro ao gerar plano:", error);
      } finally {
        setIsGenerating(false);
      }
    };

    generatePlan();
  }, [profile]); // Regenera quando o perfil muda (ex: após edição)

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
          nivel: profile.level,
          objetivo: profile.objective,
          // O backend espera List[str] para equipamentos
          equipamentos: profile.equipment ? [profile.equipment] : undefined,
          frequencia: profile.duration,
      };

      // Chamada real à API do Gemini via backend
      const aiResponse = await sendPlanRequest(requestBody);
      
      const aiMessage: Message = {
        id: messages.length + 2,
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);

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
    if (!currentWorkout) return;
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
    const videoUrl = getExerciseVideo(exercise.name);

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
          {videoUrl && (
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ marginLeft: '8px', display: 'inline-flex', alignItems: 'center', color: '#3883CE', verticalAlign: 'middle' }}
              title="Ver execução no YouTube"
            >
              <Youtube size={18} />
            </a>
          )}
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

  // Handlers para edição de perfil
  const openEditModal = () => {
    setEditFormData({ ...profile });
    setIsEditingProfile(true);
  };

  const saveProfileChanges = () => {
    setProfile(editFormData);
    setIsEditingProfile(false);
    // Aqui você poderia adicionar uma chamada para salvar no backend
    // e.g., updateProfile(editFormData);
    setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: `Perfil atualizado! Gerando um novo treino para ${getObjectiveText(editFormData.objective)}...`, timestamp: new Date() }]);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isGenerating) {
    return (
      <div className="plan-page-container" style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <Loader className="animate-spin" size={48} color="#3883CE" />
        <h2 style={{ marginTop: '20px', color: '#3883CE' }}>Criando seu treino personalizado...</h2>
        <p style={{ color: '#666' }}>Analisando seu perfil e objetivos.</p>
      </div>
    );
  }

  return (
    <div className="plan-page-container">
      {/* 1. Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <Dumbbell className="logo-icon" />
            <span className="logo-text">Personal IA</span>
          </div>
          <div className="user-info">
            <div className="user-text">Bem-vindo,</div>
            <div className="user-name">{profile.name || 'Usuário'}</div>
          </div>
        </div>

        <div className="sidebar-content">
          <div className="profile-section">
            <div className="section-header-row">
              <h3 className="section-title">Seu Perfil</h3>
              <button className="edit-profile-btn" onClick={openEditModal} title="Editar Perfil"><Pencil size={14} /></button>
            </div>
            <div className="profile-item">
              <div className="item-label">Objetivo</div>
              <div className="item-value">{getObjectiveText(profile.objective)}</div>
            </div>
            <div className="profile-item">
              <div className="item-label">Nível</div>
              <div className="item-value">{getLevelText(profile.level)}</div>
            </div>
            <div className="profile-item">
              <div className="item-label">Duração</div>
              <div className="item-value">{profile.duration || '15 minutos'}</div>
            </div>
            <div className="profile-item">
              <div className="item-label">Equipamento</div>
              <div className="item-value">{getEquipmentText(profile.equipment)}</div>
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

        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Sair</span>
          </button>
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
          <div className={`tab ${activeTab === 'progress' ? 'active' : ''}`} onClick={() => setActiveTab('progress')}>
            <BarChart3 size={18} />
            Evolução
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
                  className={`workout-card ${currentWorkout?.day === workout.day ? 'active-card' : ''}`}
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
            {currentWorkout && (
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
            )}
          </div>
        )}
        
        {/* Tab Content: Evolução (MVP) */}
        {activeTab === 'progress' && (
          <div className="evolution-content-area">
            <div className="stats-grid-mvp">
              <div className="stat-card-mvp">
                <h4>Dias Treinados</h4>
                <div className="stat-number">{evolutionStats.trainedDays}</div>
              </div>
              <div className="stat-card-mvp">
                <h4>Sequência Atual</h4>
                <div className="stat-number">{evolutionStats.currentStreak} dias</div>
              </div>
              <div className="stat-card-mvp">
                <h4>Maior Sequência</h4>
                <div className="stat-number">{evolutionStats.longestStreak} dias</div>
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

      {/* 4. Edit Profile Modal */}
      {isEditingProfile && (
        <div className="modal-overlay">
          <div className="edit-profile-modal">
            <div className="modal-header">
              <h3>Editar Perfil</h3>
              <button className="close-modal-btn" onClick={() => setIsEditingProfile(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Objetivo</label>
                <select 
                  value={editFormData.objective} 
                  onChange={(e) => setEditFormData({...editFormData, objective: e.target.value})}
                >
                  <option value="ganhar-massa">Ganhar Massa</option>
                  <option value="perder-peso">Perder Peso</option>
                  <option value="condicionamento">Condicionamento</option>
                  <option value="resistencia">Resistência</option>
                </select>
              </div>

              <div className="form-group">
                <label>Nível</label>
                <select 
                  value={editFormData.level} 
                  onChange={(e) => setEditFormData({...editFormData, level: e.target.value})}
                >
                  <option value="iniciante">Iniciante</option>
                  <option value="intermediario">Intermediário</option>
                  <option value="avancado">Avançado</option>
                </select>
              </div>

              <div className="form-group">
                <label>Frequência</label>
                <select 
                  value={editFormData.duration} 
                  onChange={(e) => setEditFormData({...editFormData, duration: e.target.value})}
                >
                  <option value="1-2 dias por semana">1-2 dias por semana</option>
                  <option value="3 dias por semana">3 dias por semana</option>
                  <option value="4-5 dias por semana">4-5 dias por semana</option>
                  <option value="Diariamente (6+ dias)">Diariamente</option>
                </select>
              </div>

              <div className="form-group">
                <label>Equipamento</label>
                <select 
                  value={editFormData.equipment} 
                  onChange={(e) => setEditFormData({...editFormData, equipment: e.target.value})}
                >
                  <option value="sem-equipamento">Sem Equipamento</option>
                  <option value="basico">Básico (Halteres/Elásticos)</option>
                  <option value="completo">Academia Completa</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setIsEditingProfile(false)}>Cancelar</button>
              <button className="save-btn" onClick={saveProfileChanges}>Salvar Alterações</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}