// Mapeamento de palavras-chave de exercícios para URLs de vídeo.
// Dica: Use chaves em minúsculas e sem acentos para facilitar a "busca" automática.

export const exerciseLibrary: Record<string, string> = {
  // Peito
  "flexao": "https://www.youtube.com/results?search_query=como+fazer+flexao+de+braco",
  "flexao de braco": "https://www.youtube.com/watch?v=IODxDxX7oi4",
  "supino": "https://www.youtube.com/watch?v=rT7DgCr-3pg",
  "supino reto": "https://www.youtube.com/watch?v=rT7DgCr-3pg",
  
  // Pernas
  "agachamento": "https://www.youtube.com/watch?v=U3HlEF_E9fo",
  "agachamento livre": "https://www.youtube.com/watch?v=U3HlEF_E9fo",
  "afundo": "https://www.youtube.com/watch?v=L8M8qYq3gqQ",
  "leg press": "https://www.youtube.com/watch?v=GvQ63j33sAc",

  // Costas
  "barra fixa": "https://www.youtube.com/watch?v=R3G5jM2hX_8",
  "remada": "https://www.youtube.com/watch?v=G8x_hXZ8_8",
};

export function getExerciseVideo(exerciseName: string): string | null {
  // Normaliza o nome vindo da IA (minúsculas, sem acentos) para comparar
  const normalizedInput = exerciseName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Verifica se alguma chave da nossa biblioteca está contida no nome do exercício
  // Ex: Se a IA mandou "Flexão de braço com joelhos", vai dar match com "flexao"
  const match = Object.keys(exerciseLibrary).find(key => normalizedInput.includes(key));
  
  return match ? exerciseLibrary[match] : null;
}