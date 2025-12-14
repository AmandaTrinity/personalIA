import { useEffect, useState } from 'react';
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTreinoDetalhe, type TreinoDetalhe } from '../services/treino_api';
import { ClipboardList, Save, Dumbbell, Zap, HeartPulse, Target, BarChart3, MessageSquare, Play, Circle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import '../styles/pages/treinoDetalhe.css';

// Definição da estrutura para a tabela
interface Exercise {
  name: string;
  sets: number;
  reps: number;
  rest: string;
}

interface ParsedWorkout {
  title: string;
  day: string;
  exercises: Exercise[];
}

// Helper para parsear o texto Markdown da IA para uma estrutura de dados.
// Ela tenta extrair NOME, SÉRIES, REPS e DESCANSO.
function parsePlanoDeTreino(markdown: string): ParsedWorkout | null {
  const lines = markdown.split('\n').filter(line => line.trim() !== '');
  const exercises: Exercise[] = [];
  let currentTitle = 'Treino Personalizado';
  const currentDay = 'Dia de Treino';
  let currentName = '';
  
  // Regex para capturar NOME e FOCO (usando os números 1., 2., etc.)
  const exerciseRegex = /^\d+\.\s*([^:\n]+)/;
  // Regex para capturar SÉRIES e REPETIÇÕES
  const executionRegex = /Execução:\s*(\d+)\s*série(s)?\s*de\s*(\d+)\s*repetiç(ões|ão)/i;
  // Regex para capturar Desanso
  const restRegex = /(descan[sç]o|intervalo):\s*(\d+s|\d+m|[\d.]+ min)/i;

  for (const line of lines) {
    if (line.toLowerCase().includes('plano de treino:')) {
      currentTitle = line.split(':').pop()?.trim() || 'Plano de Treino';
      continue;
    }
    
    const matchExercise = line.match(exerciseRegex);
    if (matchExercise) {
      // Encontrou um novo exercício (ex: 1. Supino Reto)
      currentName = matchExercise[1].trim();
      
      // Tenta procurar a linha de execução nas próximas 3 linhas (para simplificar)
      let series = 0;
      let reps = 0;
      let rest = '60s'; 
      
      const executionLineIndex = lines.indexOf(line) + 1;
      for (let i = executionLineIndex; i < Math.min(executionLineIndex + 3, lines.length); i++) {
        const checkLine = lines[i];
        
        const matchExecution = checkLine.match(executionRegex);
        if (matchExecution) {
          series = parseInt(matchExecution[1], 10);
          reps = parseInt(matchExecution[3], 10);
          
          // Tenta encontrar descanso na mesma linha (se houver)
          const matchRest = checkLine.match(restRegex);
          if (matchRest) {
            rest = matchRest[2];
          }
          break;
        }
      }

      if (currentName && series > 0) {
        exercises.push({ name: currentName, sets: series, reps: reps, rest: rest });
      }
    }
  }

  if (exercises.length === 0) return null;

  // Assume que o título do treino é a primeira parte (ex: Peito e Tríceps)
  const firstDayTitle = exercises[0]?.name.split('-').shift()?.trim() || currentTitle;
  
  return {
    title: firstDayTitle,
    day: currentDay, // 'Dia de Treino' será o placeholder, o usuário verá o nome do treino
    exercises: exercises,
  };
}


// Helper Functions
function getObjectiveText(objective?: string): string {
  const objectives: Record<string, string> = {
    'ganhar-massa': 'Ganho de Massa Muscular',
    'perder-peso': 'Perda de Peso',
    'condicionamento': 'Melhorar Condicionamento',
    'resistencia': 'Aumentar Resistência',
  };
  return objectives[objective || ''] || 'Não definido';
}

function getLevelText(level?: string): string {
  const levels: Record<string, string> = {
    'iniciante': 'Iniciante',
    'intermediario': 'Intermediário',
    'avancado': 'Avançado',
  };
  return levels[level || ''] || 'Não definido';
}

function getEquipmentText(equipment?: string): string {
  const equipments: Record<string, string> = {
    'sem-equipamento': 'Sem Equipamento',
    'basico': 'Equipamento Básico',
    'completo': 'Academia Completa',
  };
  return equipments[equipment || ''] || 'Não definido';
}

export default function TreinoDetalhe() {
  const { treinoId } = useParams<{ treinoId: string }>();
  const [treino, setTreino] = useState<TreinoDetalhe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [parsedData, setParsedData] = useState<ParsedWorkout | null>(null);

  useEffect(() => {
    if (!treinoId) {
      setError('ID do treino não fornecido.');
      setLoading(false);
      return;
    }
    
    const fetchTreino = async () => {
      try {
        const data = await getTreinoDetalhe(treinoId);
        setTreino(data);
        
        // Processa o plano gerado para o formato da UI (somente se for string)
        if (typeof data.plano_gerado === 'string') {
          const parsed = parsePlanoDeTreino(data.plano_gerado);
          if (!parsed) {
            setError('Não foi possível estruturar o plano de treino. Exibindo texto bruto.');
          }
          setParsedData(parsed);
        } else {
          setParsedData(null);
        }
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Falha ao carregar detalhes do treino. Verifique o backend.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchTreino();
  }, [treinoId]);

  if (loading) return <div className="treino-loading">Carregando detalhes do treino...</div>;
  if (error && !treino) return <div className="treino-error">{error} <Link to="/chat">Voltar ao Chat</Link></div>;

  // Se houve erro no parsing, mas temos os dados, exibe o texto bruto.
  if (!treino || (!parsedData && !treino.plano_gerado)) return <div className="treino-not-found">Treino não encontrado.</div>;
  
  // Usaremos o treino gerado como base para o nome do treino (o título grande)
  const workoutTitle = (typeof treino.plano_gerado === 'string' ? treino.plano_gerado : '').split('\n')[0].replace('Plano de Treino:', '').trim() || 'Plano de Treino';

  // helper seguro para extrair strings de campos possivelmente unknown
  const safeStr = (v: unknown): string | undefined => (typeof v === 'string' ? v : undefined);

  // Mapeamento do Perfil para o Painel Lateral (valores garantidos como string)
  const profileItems: { label: string; value: string; icon: React.ReactNode }[] = [
    { label: 'Objetivo', value: getObjectiveText(safeStr(treino?.['objetivo'])), icon: <Target size={20} /> },
    { label: 'Nível', value: getLevelText(safeStr(treino?.['level'])), icon: <Dumbbell size={20} /> },
    { label: 'Frequência', value: String(treino?.['frequencia'] ?? 'N/A'), icon: <Zap size={20} /> },
    { label: 'Equipamento', value: getEquipmentText(safeStr(treino?.['equipment'])), icon: <ClipboardList size={20} /> },
    { label: 'Idade', value: String(treino?.['idade'] ?? 'N/A'), icon: <HeartPulse size={20} /> },
  ];

  return (
    <div className="treino-detail-container">
        
        {/* Painel Lateral de Perfil (Esquerda) */}
        <aside className="profile-sidebar">
            <div className="sidebar-header">
                <h2>Seu Perfil</h2>
            </div>
            
            {profileItems.map((item, index) => (
                <div key={index} className="profile-item">
                    <div className="item-icon">{item.icon}</div>
                    <div className="item-text">
                        <span className="item-label">{item.label}</span>
                        <span className="item-value">{item.value}</span>
                    </div>
                </div>
            ))}

            <div className="sidebar-saved-workouts">
                <h3>Treinos Salvos</h3>
                <div className="saved-workout-list">
                    {/* Aqui entraria a lista de treinos salvos, buscando a rota GET /treinos/ */}
                    <div className="text-sm text-gray-500 mt-2">Nenhum treino salvo ainda.</div>
                </div>
            </div>
        </aside>

        {/* Área de Conteúdo Principal (Direita) */}
        <main className="workout-main-content">
            
            <header className="main-header">
                <div className="main-title-section">
                    <h1 className="main-workout-title">Seu Plano de Treino Personalizado</h1>
                    <p className="main-workout-subtitle">{workoutTitle}</p>
                </div>
                <div className="actions">
                    <Link to="/chat" className="btn-chat"><MessageSquare size={20} /> Chat com IA</Link>
                    <button className="btn-salvar"><Save size={20} /> Salvar</button>
                </div>
            </header>
            
            {/* Tabs (Apenas o Meu Treino por enquanto) */}
            <nav className="workout-tabs">
                <button className="tab-button active"><Dumbbell size={20} /> Meu Treino</button>
                <button className="tab-button"><BarChart3 size={20} /> Evolução</button>
            </nav>

            {/* Overview Semanal (Blocos dos dias de treino) - MOCK */}
            <section className="workout-overview">
                <div className="day-card active">
                    <span className="day-name">Segunda-feira</span>
                    <span className="day-title">Peito e Tríceps</span>
                    <span className="exercise-count">{parsedData?.exercises.length || 0} exercícios</span>
                </div>
                <div className="day-card">
                    <span className="day-name">Quarta-feira</span>
                    <span className="day-title">Costas e Bíceps</span>
                    <span className="exercise-count">5 exercícios</span>
                </div>
                <div className="day-card">
                    <span className="day-name">Sexta-feira</span>
                    <span className="day-title">Pernas e Ombros</span>
                    <span className="exercise-count">5 exercícios</span>
                </div>
            </section>
            
            {/* Detalhes do Treino (Tabela) */}
            <section className="current-workout-details">
                <div className="details-header">
                    <h2>Peito e Tríceps</h2>
                    <button className="btn-iniciar"><Play size={20} /> Iniciar Treino</button>
                </div>
                
                {parsedData?.exercises && parsedData.exercises.length > 0 ? (
                    <div className="exercise-list-container">
                        <div className="exercise-list-item header">
                            <span className="check-box"></span>
                            <span className="ex-name">Exercício</span>
                            <span className="ex-sets">Séries</span>
                            <span className="ex-reps">Reps</span>
                            <span className="ex-rest">Descanso</span>
                        </div>
                        {parsedData.exercises.map((ex, index) => (
                            <div key={index} className="exercise-list-item">
                                <span className="check-box"><Circle size={24} /></span>
                                <span className="ex-name">{ex.name}</span>
                                <span className="ex-sets">{ex.sets}</span>
                                <span className="ex-reps">{ex.reps}</span>
                                <span className="ex-rest">{ex.rest}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                   <div className="raw-markdown-area mt-4">
                      <p>Não foi possível exibir em formato de tabela. Texto bruto da IA:</p>
                      <ReactMarkdown>{treino.plano_gerado}</ReactMarkdown>
                  </div>
                )}
            </section>
            
        </main>
    </div>
  );
}