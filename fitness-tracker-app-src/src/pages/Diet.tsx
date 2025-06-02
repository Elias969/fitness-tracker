import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, addMeal, deleteMeal, addFoodToMeal, removeFoodFromMeal } from '../store';
import { Meal, MealFood, Food } from '../types';
import { searchFoods, calculateNutrients } from '../data/foods';
import { v4 as uuidv4 } from 'uuid';

const Diet: React.FC = () => {
  const dispatch = useDispatch();
  const meals = useSelector((state: RootState) => state.meals);
  const user = useSelector((state: RootState) => state.user);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showAddMealForm, setShowAddMealForm] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  
  // Filtrar refeições pela data selecionada
  const mealsForSelectedDate = meals.filter(meal => meal.date.startsWith(selectedDate));
  
  // Calcular totais nutricionais para o dia
  const dailyTotals = mealsForSelectedDate.reduce(
    (totals, meal) => {
      meal.foods.forEach(food => {
        totals.calories += food.calories;
        totals.protein += food.protein;
        totals.carbs += food.carbs;
        totals.fat += food.fat;
      });
      return totals;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
  
  // Pesquisar alimentos
  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = searchFoods(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };
  
  // Adicionar nova refeição
  const handleAddMeal = () => {
    const newMeal: Meal = {
      id: uuidv4(),
      userId: user.id,
      date: selectedDate,
      type: selectedMealType,
      foods: [],
      notes: ''
    };
    
    dispatch(addMeal(newMeal));
    setSelectedMeal(newMeal);
    setShowAddMealForm(false);
  };
  
  // Adicionar alimento à refeição
  const handleAddFoodToMeal = (food: Food) => {
    if (!selectedMeal) return;
    
    const mealFood: MealFood = {
      foodId: food.id,
      name: food.name,
      quantity: quantity,
      ...calculateNutrients(food, quantity)
    };
    
    dispatch(addFoodToMeal({ mealId: selectedMeal.id, food: mealFood }));
    setQuantity(1);
  };
  
  // Remover alimento da refeição
  const handleRemoveFoodFromMeal = (mealId: string, foodId: string) => {
    dispatch(removeFoodFromMeal({ mealId, foodId }));
  };
  
  // Excluir refeição
  const handleDeleteMeal = (mealId: string) => {
    dispatch(deleteMeal(mealId));
    if (selectedMeal?.id === mealId) {
      setSelectedMeal(null);
    }
  };
  
  return (
    <div className="diet-container">
      <h2>Gestão de Dieta</h2>
      
      <div className="date-selector">
        <label htmlFor="date">Data:</label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
      
      <div className="nutrition-summary">
        <h3>Resumo Nutricional do Dia</h3>
        <div className="nutrition-cards">
          <div className="nutrition-card">
            <h4>Calorias</h4>
            <p>{dailyTotals.calories} / {user.dailyCalorieTarget || 2000} kcal</p>
            <div className="progress-bar">
              <div 
                className="progress" 
                style={{ width: `${Math.min(100, (dailyTotals.calories / (user.dailyCalorieTarget || 2000)) * 100)}%` }}
              ></div>
            </div>
          </div>
          <div className="nutrition-card">
            <h4>Proteínas</h4>
            <p>{dailyTotals.protein.toFixed(1)}g</p>
          </div>
          <div className="nutrition-card">
            <h4>Carboidratos</h4>
            <p>{dailyTotals.carbs.toFixed(1)}g</p>
          </div>
          <div className="nutrition-card">
            <h4>Gorduras</h4>
            <p>{dailyTotals.fat.toFixed(1)}g</p>
          </div>
        </div>
      </div>
      
      <div className="meals-section">
        <div className="meals-header">
          <h3>Refeições</h3>
          <button 
            className="add-meal-btn"
            onClick={() => setShowAddMealForm(true)}
          >
            + Adicionar Refeição
          </button>
        </div>
        
        {showAddMealForm && (
          <div className="add-meal-form">
            <h4>Nova Refeição</h4>
            <div className="form-group">
              <label htmlFor="meal-type">Tipo de Refeição:</label>
              <select
                id="meal-type"
                value={selectedMealType}
                onChange={(e) => setSelectedMealType(e.target.value as any)}
              >
                <option value="breakfast">Pequeno-almoço</option>
                <option value="lunch">Almoço</option>
                <option value="dinner">Jantar</option>
                <option value="snack">Lanche</option>
              </select>
            </div>
            <div className="form-actions">
              <button onClick={handleAddMeal}>Adicionar</button>
              <button onClick={() => setShowAddMealForm(false)}>Cancelar</button>
            </div>
          </div>
        )}
        
        <div className="meals-list">
          {mealsForSelectedDate.length === 0 ? (
            <p>Nenhuma refeição registada para esta data.</p>
          ) : (
            mealsForSelectedDate.map(meal => (
              <div 
                key={meal.id} 
                className={`meal-card ${selectedMeal?.id === meal.id ? 'selected' : ''}`}
                onClick={() => setSelectedMeal(meal)}
              >
                <div className="meal-header">
                  <h4>{
                    meal.type === 'breakfast' ? 'Pequeno-almoço' :
                    meal.type === 'lunch' ? 'Almoço' :
                    meal.type === 'dinner' ? 'Jantar' : 'Lanche'
                  }</h4>
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMeal(meal.id);
                    }}
                  >
                    Excluir
                  </button>
                </div>
                
                <div className="meal-foods">
                  {meal.foods.length === 0 ? (
                    <p>Nenhum alimento adicionado.</p>
                  ) : (
                    <ul>
                      {meal.foods.map(food => (
                        <li key={food.foodId}>
                          <span>{food.name} ({food.quantity}x)</span>
                          <span>{food.calories} kcal</span>
                          <button 
                            className="remove-food-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFoodFromMeal(meal.id, food.foodId);
                            }}
                          >
                            X
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <div className="meal-totals">
                  <p>Total: {meal.foods.reduce((sum, food) => sum + food.calories, 0)} kcal</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {selectedMeal && (
        <div className="food-search-section">
          <h3>Adicionar Alimentos à Refeição</h3>
          
          <div className="search-bar">
            <input
              type="text"
              placeholder="Pesquisar alimentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch}>Pesquisar</button>
          </div>
          
          <div className="search-results">
            {searchResults.length === 0 ? (
              <p>Nenhum resultado. Tente pesquisar por nome ou categoria.</p>
            ) : (
              <ul>
                {searchResults.map(food => (
                  <li key={food.id} className="food-item">
                    <div className="food-info">
                      <h4>{food.name}</h4>
                      <p>{food.calories} kcal por {food.servingSize}{food.servingUnit}</p>
                      <p>P: {food.protein}g | C: {food.carbs}g | G: {food.fat}g</p>
                    </div>
                    <div className="food-actions">
                      <input
                        type="number"
                        min="0.25"
                        step="0.25"
                        value={quantity}
                        onChange={(e) => setQuantity(parseFloat(e.target.value))}
                      />
                      <button onClick={() => handleAddFoodToMeal(food)}>Adicionar</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Diet;
