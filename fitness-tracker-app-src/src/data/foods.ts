import { Food } from '../types';

// Base de dados de alimentos comuns
export const foods: Food[] = [
  {
    id: '1',
    name: 'Frango (peito, grelhado)',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    servingSize: 100,
    servingUnit: 'g',
    category: 'proteínas'
  },
  {
    id: '2',
    name: 'Arroz branco cozido',
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    fiber: 0.4,
    servingSize: 100,
    servingUnit: 'g',
    category: 'carboidratos'
  },
  {
    id: '3',
    name: 'Ovo cozido',
    calories: 78,
    protein: 6.3,
    carbs: 0.6,
    fat: 5.3,
    servingSize: 50,
    servingUnit: 'g',
    category: 'proteínas'
  },
  {
    id: '4',
    name: 'Azeite',
    calories: 884,
    protein: 0,
    carbs: 0,
    fat: 100,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'gorduras'
  },
  {
    id: '5',
    name: 'Maçã',
    calories: 52,
    protein: 0.3,
    carbs: 14,
    fat: 0.2,
    fiber: 2.4,
    sugar: 10.3,
    servingSize: 100,
    servingUnit: 'g',
    category: 'frutas'
  },
  {
    id: '6',
    name: 'Brócolis cozido',
    calories: 35,
    protein: 2.4,
    carbs: 7.2,
    fat: 0.4,
    fiber: 3.3,
    servingSize: 100,
    servingUnit: 'g',
    category: 'vegetais'
  },
  {
    id: '7',
    name: 'Pão integral',
    calories: 247,
    protein: 13,
    carbs: 41,
    fat: 3.4,
    fiber: 7,
    servingSize: 100,
    servingUnit: 'g',
    category: 'carboidratos'
  },
  {
    id: '8',
    name: 'Leite desnatado',
    calories: 35,
    protein: 3.4,
    carbs: 5,
    fat: 0.1,
    servingSize: 100,
    servingUnit: 'ml',
    category: 'laticínios'
  },
  {
    id: '9',
    name: 'Salmão (grelhado)',
    calories: 206,
    protein: 22,
    carbs: 0,
    fat: 13,
    servingSize: 100,
    servingUnit: 'g',
    category: 'proteínas'
  },
  {
    id: '10',
    name: 'Batata doce cozida',
    calories: 86,
    protein: 1.6,
    carbs: 20,
    fat: 0.1,
    fiber: 3,
    servingSize: 100,
    servingUnit: 'g',
    category: 'carboidratos'
  },
  {
    id: '11',
    name: 'Aveia',
    calories: 389,
    protein: 16.9,
    carbs: 66.3,
    fat: 6.9,
    fiber: 10.6,
    servingSize: 100,
    servingUnit: 'g',
    category: 'carboidratos'
  },
  {
    id: '12',
    name: 'Banana',
    calories: 89,
    protein: 1.1,
    carbs: 22.8,
    fat: 0.3,
    fiber: 2.6,
    sugar: 12.2,
    servingSize: 100,
    servingUnit: 'g',
    category: 'frutas'
  },
  {
    id: '13',
    name: 'Iogurte natural',
    calories: 59,
    protein: 3.5,
    carbs: 4.7,
    fat: 3.3,
    servingSize: 100,
    servingUnit: 'g',
    category: 'laticínios'
  },
  {
    id: '14',
    name: 'Feijão preto cozido',
    calories: 132,
    protein: 8.9,
    carbs: 23.7,
    fat: 0.5,
    fiber: 8.7,
    servingSize: 100,
    servingUnit: 'g',
    category: 'leguminosas'
  },
  {
    id: '15',
    name: 'Nozes',
    calories: 654,
    protein: 15.2,
    carbs: 13.7,
    fat: 65.2,
    fiber: 6.7,
    servingSize: 100,
    servingUnit: 'g',
    category: 'oleaginosas'
  }
];

// Função para buscar alimentos por nome
export const searchFoods = (query: string): Food[] => {
  const normalizedQuery = query.toLowerCase().trim();
  return foods.filter(food => 
    food.name.toLowerCase().includes(normalizedQuery) || 
    food.category.toLowerCase().includes(normalizedQuery)
  );
};

// Função para buscar alimento por ID
export const getFoodById = (id: string): Food | undefined => {
  return foods.find(food => food.id === id);
};

// Função para calcular nutrientes com base na quantidade
export const calculateNutrients = (food: Food, quantity: number) => {
  return {
    calories: Math.round(food.calories * quantity),
    protein: +(food.protein * quantity).toFixed(1),
    carbs: +(food.carbs * quantity).toFixed(1),
    fat: +(food.fat * quantity).toFixed(1),
    fiber: food.fiber ? +(food.fiber * quantity).toFixed(1) : undefined,
    sugar: food.sugar ? +(food.sugar * quantity).toFixed(1) : undefined
  };
};
