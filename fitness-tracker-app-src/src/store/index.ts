import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, Meal, MealFood, Workout, Goal, GoalCheckpoint, BodyMeasurement } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Estado inicial para o utilizador
const initialUserState: User = {
  id: uuidv4(),
  name: '',
  height: 175,
  weight: 70,
  age: 30,
  gender: 'male',
  activityLevel: 'moderate',
  goal: 'maintain',
  dailyCalorieTarget: 2000
};

// Estado inicial para as refeições
const initialMealsState: Meal[] = [];

// Estado inicial para os treinos
const initialWorkoutsState: Workout[] = [];

// Estado inicial para as metas
const initialGoalsState: Goal[] = [];

// Estado inicial para as medições corporais
const initialMeasurementsState: BodyMeasurement[] = [];

// Slice para o utilizador
const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      return { ...state, ...action.payload };
    },
    calculateCalorieTarget: (state) => {
      // Fórmula de Harris-Benedict para calcular o metabolismo basal (BMR)
      let bmr = 0;
      
      if (state.gender === 'male') {
        // Homens: BMR = 88.362 + (13.397 × peso em kg) + (4.799 × altura em cm) - (5.677 × idade em anos)
        bmr = 88.362 + (13.397 * (state.weight || 70)) + (4.799 * (state.height || 175)) - (5.677 * (state.age || 30));
      } else {
        // Mulheres: BMR = 447.593 + (9.247 × peso em kg) + (3.098 × altura em cm) - (4.330 × idade em anos)
        bmr = 447.593 + (9.247 * (state.weight || 70)) + (3.098 * (state.height || 175)) - (4.330 * (state.age || 30));
      }
      
      // Fator de atividade
      let activityFactor = 1.2; // Sedentário
      switch (state.activityLevel) {
        case 'light':
          activityFactor = 1.375; // Exercício leve 1-3 dias/semana
          break;
        case 'moderate':
          activityFactor = 1.55; // Exercício moderado 3-5 dias/semana
          break;
        case 'active':
          activityFactor = 1.725; // Exercício intenso 6-7 dias/semana
          break;
        case 'very_active':
          activityFactor = 1.9; // Exercício muito intenso, trabalho físico
          break;
      }
      
      // Calorias diárias = BMR * Fator de atividade
      let dailyCalories = Math.round(bmr * activityFactor);
      
      // Ajuste com base no objetivo
      switch (state.goal) {
        case 'lose_weight':
          dailyCalories -= 500; // Déficit para perda de peso
          break;
        case 'gain_muscle':
          dailyCalories += 300; // Superávit para ganho muscular
          break;
        case 'improve_fitness':
          // Sem ajuste específico
          break;
      }
      
      state.dailyCalorieTarget = dailyCalories;
    }
  }
});

// Slice para as refeições
const mealsSlice = createSlice({
  name: 'meals',
  initialState: initialMealsState,
  reducers: {
    addMeal: (state, action: PayloadAction<Meal>) => {
      state.push(action.payload);
    },
    updateMeal: (state, action: PayloadAction<Meal>) => {
      const index = state.findIndex(meal => meal.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteMeal: (state, action: PayloadAction<string>) => {
      return state.filter(meal => meal.id !== action.payload);
    },
    addFoodToMeal: (state, action: PayloadAction<{ mealId: string, food: MealFood }>) => {
      const { mealId, food } = action.payload;
      const mealIndex = state.findIndex(meal => meal.id === mealId);
      
      if (mealIndex !== -1) {
        state[mealIndex].foods.push(food);
      }
    },
    removeFoodFromMeal: (state, action: PayloadAction<{ mealId: string, foodId: string }>) => {
      const { mealId, foodId } = action.payload;
      const mealIndex = state.findIndex(meal => meal.id === mealId);
      
      if (mealIndex !== -1) {
        state[mealIndex].foods = state[mealIndex].foods.filter(food => food.foodId !== foodId);
      }
    }
  }
});

// Slice para os treinos
const workoutsSlice = createSlice({
  name: 'workouts',
  initialState: initialWorkoutsState,
  reducers: {
    addWorkout: (state, action: PayloadAction<Workout>) => {
      state.push(action.payload);
    },
    updateWorkout: (state, action: PayloadAction<Workout>) => {
      const index = state.findIndex(workout => workout.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteWorkout: (state, action: PayloadAction<string>) => {
      return state.filter(workout => workout.id !== action.payload);
    }
  }
});

// Slice para as metas
const goalsSlice = createSlice({
  name: 'goals',
  initialState: initialGoalsState,
  reducers: {
    addGoal: (state, action: PayloadAction<Goal>) => {
      state.push(action.payload);
    },
    updateGoal: (state, action: PayloadAction<Goal>) => {
      const index = state.findIndex(goal => goal.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteGoal: (state, action: PayloadAction<string>) => {
      return state.filter(goal => goal.id !== action.payload);
    },
    updateGoalProgress: (state, action: PayloadAction<{ id: string, currentValue: number }>) => {
      const { id, currentValue } = action.payload;
      const goalIndex = state.findIndex(goal => goal.id === id);
      
      if (goalIndex !== -1) {
        const goal = state[goalIndex];
        goal.currentValue = currentValue;
        
        // Calcular progresso em percentagem
        const totalChange = goal.targetValue - goal.startValue;
        const currentChange = currentValue - goal.startValue;
        const progressPercentage = (currentChange / totalChange) * 100;
        
        // Limitar entre 0 e 100
        goal.progress = Math.min(100, Math.max(0, progressPercentage));
        
        // Verificar se a meta foi concluída
        if (
          (goal.targetValue > goal.startValue && currentValue >= goal.targetValue) ||
          (goal.targetValue < goal.startValue && currentValue <= goal.targetValue)
        ) {
          goal.completed = true;
          goal.progress = 100;
        }
      }
    },
    addGoalCheckpoint: (state, action: PayloadAction<{ goalId: string, checkpoint: GoalCheckpoint }>) => {
      const { goalId, checkpoint } = action.payload;
      const goalIndex = state.findIndex(goal => goal.id === goalId);
      
      if (goalIndex !== -1) {
        if (!state[goalIndex].checkpoints) {
          state[goalIndex].checkpoints = [];
        }
        state[goalIndex].checkpoints!.push(checkpoint);
      }
    }
  }
});

// Slice para as medições corporais
const measurementsSlice = createSlice({
  name: 'measurements',
  initialState: initialMeasurementsState,
  reducers: {
    addMeasurement: (state, action: PayloadAction<BodyMeasurement>) => {
      state.push(action.payload);
    },
    updateMeasurement: (state, action: PayloadAction<BodyMeasurement>) => {
      const index = state.findIndex(measurement => measurement.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteMeasurement: (state, action: PayloadAction<string>) => {
      return state.filter(measurement => measurement.id !== action.payload);
    }
  }
});

// Exportar actions
export const { updateUser, calculateCalorieTarget } = userSlice.actions;
export const { addMeal, updateMeal, deleteMeal, addFoodToMeal, removeFoodFromMeal } = mealsSlice.actions;
export const { addWorkout, updateWorkout, deleteWorkout } = workoutsSlice.actions;
export const { addGoal, updateGoal, deleteGoal, updateGoalProgress, addGoalCheckpoint } = goalsSlice.actions;
export const { addMeasurement, updateMeasurement, deleteMeasurement } = measurementsSlice.actions;

// Configurar a store
export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    meals: mealsSlice.reducer,
    workouts: workoutsSlice.reducer,
    goals: goalsSlice.reducer,
    measurements: measurementsSlice.reducer
  }
});

// Tipos para o estado global e dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
