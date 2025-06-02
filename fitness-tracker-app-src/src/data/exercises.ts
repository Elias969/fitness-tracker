import { Exercise } from '../types';

// Base de dados de exercícios comuns
export const exercises: Exercise[] = [
  {
    id: '1',
    name: 'Agachamento',
    category: 'força',
    muscleGroups: ['quadríceps', 'glúteos', 'isquiotibiais'],
    caloriesPerMinute: 8,
    instructions: 'Posicione os pés na largura dos ombros, desça como se fosse sentar numa cadeira, mantendo o peito erguido e os joelhos alinhados com os pés.',
    equipment: ['barra', 'halteres', 'peso corporal'],
    difficulty: 'intermediate'
  },
  {
    id: '2',
    name: 'Supino',
    category: 'força',
    muscleGroups: ['peito', 'tríceps', 'ombros'],
    caloriesPerMinute: 6,
    instructions: 'Deite-se no banco com os pés no chão. Segure a barra com as mãos um pouco mais afastadas que a largura dos ombros. Baixe a barra até o peito e empurre de volta para cima.',
    equipment: ['barra', 'halteres', 'banco'],
    difficulty: 'intermediate'
  },
  {
    id: '3',
    name: 'Corrida',
    category: 'cardio',
    muscleGroups: ['pernas', 'core'],
    caloriesPerMinute: 10,
    instructions: 'Mantenha uma postura ereta, aterrisse no meio do pé e mantenha um ritmo constante.',
    equipment: ['nenhum'],
    difficulty: 'intermediate'
  },
  {
    id: '4',
    name: 'Flexão',
    category: 'força',
    muscleGroups: ['peito', 'tríceps', 'ombros', 'core'],
    caloriesPerMinute: 7,
    instructions: 'Comece na posição de prancha com as mãos um pouco mais afastadas que os ombros. Dobre os cotovelos para baixar o corpo até quase tocar o chão, depois empurre de volta para cima.',
    equipment: ['peso corporal'],
    difficulty: 'beginner'
  },
  {
    id: '5',
    name: 'Levantamento terra',
    category: 'força',
    muscleGroups: ['costas', 'glúteos', 'isquiotibiais'],
    caloriesPerMinute: 9,
    instructions: 'Posicione os pés na largura dos quadris, segure a barra com as mãos fora dos joelhos. Mantenha as costas retas e levante a barra empurrando os quadris para frente.',
    equipment: ['barra', 'halteres'],
    difficulty: 'advanced'
  },
  {
    id: '6',
    name: 'Bicicleta estacionária',
    category: 'cardio',
    muscleGroups: ['pernas', 'core'],
    caloriesPerMinute: 8,
    instructions: 'Ajuste o banco para que a perna fique quase estendida no ponto mais baixo do pedal. Mantenha um ritmo constante.',
    equipment: ['bicicleta estacionária'],
    difficulty: 'beginner'
  },
  {
    id: '7',
    name: 'Prancha',
    category: 'core',
    muscleGroups: ['abdômen', 'lombar', 'ombros'],
    caloriesPerMinute: 4,
    instructions: 'Apoie-se nos antebraços e nas pontas dos pés, mantendo o corpo em linha reta da cabeça aos calcanhares. Contraia o abdômen e mantenha a posição.',
    equipment: ['peso corporal'],
    difficulty: 'beginner'
  },
  {
    id: '8',
    name: 'Elevação lateral',
    category: 'força',
    muscleGroups: ['ombros'],
    caloriesPerMinute: 4,
    instructions: 'Em pé, segure halteres ao lado do corpo. Levante os braços para os lados até a altura dos ombros, mantendo os cotovelos levemente dobrados.',
    equipment: ['halteres'],
    difficulty: 'beginner'
  },
  {
    id: '9',
    name: 'Remada curvada',
    category: 'força',
    muscleGroups: ['costas', 'bíceps'],
    caloriesPerMinute: 6,
    instructions: 'Incline o tronco para frente com as costas retas. Segure os pesos com os braços estendidos e puxe em direção à cintura, contraindo as escápulas.',
    equipment: ['barra', 'halteres'],
    difficulty: 'intermediate'
  },
  {
    id: '10',
    name: 'Burpee',
    category: 'cardio',
    muscleGroups: ['corpo inteiro'],
    caloriesPerMinute: 12,
    instructions: 'Comece em pé, agache, coloque as mãos no chão, salte para a posição de flexão, faça uma flexão, salte de volta para a posição agachada e salte para cima com os braços estendidos.',
    equipment: ['peso corporal'],
    difficulty: 'advanced'
  },
  {
    id: '11',
    name: 'Abdominal',
    category: 'core',
    muscleGroups: ['abdômen'],
    caloriesPerMinute: 5,
    instructions: 'Deite-se de costas com os joelhos dobrados e os pés apoiados no chão. Coloque as mãos atrás da cabeça e levante os ombros do chão, contraindo o abdômen.',
    equipment: ['peso corporal'],
    difficulty: 'beginner'
  },
  {
    id: '12',
    name: 'Tríceps no banco',
    category: 'força',
    muscleGroups: ['tríceps'],
    caloriesPerMinute: 5,
    instructions: 'Sente-se na borda do banco, coloque as mãos ao lado do corpo no banco, deslize o quadril para frente e dobre os cotovelos para baixar o corpo, depois estenda os braços para subir.',
    equipment: ['banco', 'peso corporal'],
    difficulty: 'beginner'
  },
  {
    id: '13',
    name: 'Rosca direta',
    category: 'força',
    muscleGroups: ['bíceps'],
    caloriesPerMinute: 4,
    instructions: 'Em pé, segure os pesos com os braços estendidos. Dobre os cotovelos e levante os pesos em direção aos ombros, mantendo os cotovelos junto ao corpo.',
    equipment: ['barra', 'halteres'],
    difficulty: 'beginner'
  },
  {
    id: '14',
    name: 'Pular corda',
    category: 'cardio',
    muscleGroups: ['pernas', 'ombros', 'core'],
    caloriesPerMinute: 11,
    instructions: 'Mantenha os cotovelos junto ao corpo, gire a corda com os pulsos e salte apenas o suficiente para deixar a corda passar sob os pés.',
    equipment: ['corda'],
    difficulty: 'intermediate'
  },
  {
    id: '15',
    name: 'Afundo',
    category: 'força',
    muscleGroups: ['quadríceps', 'glúteos', 'isquiotibiais'],
    caloriesPerMinute: 7,
    instructions: 'Dê um passo à frente e dobre ambos os joelhos a 90 graus, mantendo o joelho da frente alinhado com o tornozelo e o joelho de trás próximo ao chão.',
    equipment: ['peso corporal', 'halteres'],
    difficulty: 'intermediate'
  }
];

// Função para buscar exercícios por nome ou categoria
export const searchExercises = (query: string): Exercise[] => {
  const normalizedQuery = query.toLowerCase().trim();
  return exercises.filter(exercise => 
    exercise.name.toLowerCase().includes(normalizedQuery) || 
    exercise.category.toLowerCase().includes(normalizedQuery) ||
    exercise.muscleGroups.some(muscle => muscle.toLowerCase().includes(normalizedQuery))
  );
};

// Função para buscar exercício por ID
export const getExerciseById = (id: string): Exercise | undefined => {
  return exercises.find(exercise => exercise.id === id);
};

// Função para calcular calorias queimadas
export const calculateCaloriesBurned = (exercise: Exercise, durationMinutes: number, bodyWeight?: number): number => {
  if (!exercise.caloriesPerMinute) return 0;
  
  // Se o peso corporal for fornecido, ajustamos o cálculo
  // Assumimos que os valores base são para uma pessoa de 70kg
  const weightFactor = bodyWeight ? bodyWeight / 70 : 1;
  
  return Math.round(exercise.caloriesPerMinute * durationMinutes * weightFactor);
};
