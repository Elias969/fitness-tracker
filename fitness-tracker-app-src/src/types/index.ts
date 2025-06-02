// Tipos básicos para a aplicação

export interface User {
  id: string;
  name: string;
  email?: string;
  height?: number; // em cm
  weight?: number; // em kg
  age?: number;
  gender?: 'male' | 'female' | 'other';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal?: 'lose_weight' | 'maintain' | 'gain_muscle' | 'improve_fitness';
  dailyCalorieTarget?: number;
}

export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number; // em gramas
  carbs: number; // em gramas
  fat: number; // em gramas
  fiber?: number; // em gramas
  sugar?: number; // em gramas
  servingSize: number; // em gramas
  servingUnit: string;
  category: string;
}

export interface Meal {
  id: string;
  userId: string;
  date: string; // formato ISO
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name?: string;
  foods: MealFood[];
  notes?: string;
}

export interface MealFood {
  foodId: string;
  name: string;
  quantity: number; // número de porções
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroups: string[];
  caloriesPerMinute?: number;
  instructions?: string;
  equipment?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Workout {
  id: string;
  userId: string;
  date: string; // formato ISO
  name: string;
  duration: number; // em minutos
  caloriesBurned?: number;
  exercises: WorkoutExercise[];
  notes?: string;
}

export interface WorkoutExercise {
  exerciseId: string;
  name: string;
  sets: ExerciseSet[];
  duration?: number; // em minutos (para exercícios cardio)
}

export interface ExerciseSet {
  reps?: number;
  weight?: number; // em kg
  duration?: number; // em segundos
  distance?: number; // em metros
  completed: boolean;
}

export interface Goal {
  id: string;
  userId: string;
  type: 'weight' | 'measurement' | 'strength' | 'endurance' | 'habit' | 'custom';
  name: string;
  startValue: number;
  targetValue: number;
  unit: string;
  startDate: string; // formato ISO
  targetDate: string; // formato ISO
  currentValue?: number;
  progress?: number; // percentagem de conclusão
  completed: boolean;
  checkpoints?: GoalCheckpoint[];
}

export interface GoalCheckpoint {
  date: string; // formato ISO
  value: number;
  notes?: string;
}

export interface BodyMeasurement {
  id: string;
  userId: string;
  date: string; // formato ISO
  weight?: number; // em kg
  bodyFat?: number; // percentagem
  chest?: number; // em cm
  waist?: number; // em cm
  hips?: number; // em cm
  arms?: number; // em cm
  thighs?: number; // em cm
  notes?: string;
}

export interface DailyLog {
  id: string;
  userId: string;
  date: string; // formato ISO
  caloriesConsumed: number;
  caloriesBurned: number;
  waterIntake?: number; // em ml
  sleepHours?: number;
  stressLevel?: number; // 1-10
  mood?: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
  notes?: string;
}

export interface NutritionSummary {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
}

export interface DateRange {
  startDate: string; // formato ISO
  endDate: string; // formato ISO
}

export interface ChartData {
  label: string;
  value: number;
}

export interface ProgressData {
  dates: string[];
  values: number[];
  labels?: string[];
}
