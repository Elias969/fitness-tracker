import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts';
import { format, subDays } from 'date-fns';
import { pt } from 'date-fns/locale';

const Dashboard: React.FC = () => {
  const meals = useSelector((state: RootState) => state.meals);
  const workouts = useSelector((state: RootState) => state.workouts);
  const goals = useSelector((state: RootState) => state.goals);
  const user = useSelector((state: RootState) => state.user);
  
  // Obter data atual
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  
  // Filtrar dados para hoje
  const todayMeals = meals.filter(meal => meal.date.startsWith(todayStr));
  const todayWorkouts = workouts.filter(workout => workout.date.startsWith(todayStr));
  
  // Calcular calorias consumidas hoje
  const caloriesConsumed = todayMeals.reduce((total, meal) => {
    return total + meal.foods.reduce((mealTotal, food) => mealTotal + food.calories, 0);
  }, 0);
  
  // Calcular calorias queimadas hoje
  const caloriesBurned = todayWorkouts.reduce((total, workout) => {
    return total + (workout.caloriesBurned || 0);
  }, 0);
  
  // Calcular balanço calórico
  const caloriesRemaining = (user.dailyCalorieTarget || 2000) - caloriesConsumed;
  
  // Preparar dados para gráfico de calorias dos últimos 7 dias
  const caloriesData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Calorias consumidas
    const dayMeals = meals.filter(meal => meal.date.startsWith(dateStr));
    const consumed = dayMeals.reduce((total, meal) => {
      return total + meal.foods.reduce((mealTotal, food) => mealTotal + food.calories, 0);
    }, 0);
    
    // Calorias queimadas
    const dayWorkouts = workouts.filter(workout => workout.date.startsWith(dateStr));
    const burned = dayWorkouts.reduce((total, workout) => {
      return total + (workout.caloriesBurned || 0);
    }, 0);
    
    return {
      date: format(date, 'dd/MM', { locale: pt }),
      consumidas: consumed,
      queimadas: burned,
      balanço: consumed - burned
    };
  });
  
  // Preparar dados para gráfico de distribuição de macronutrientes
  const macroData = todayMeals.reduce(
    (totals, meal) => {
      meal.foods.forEach(food => {
        totals.protein += food.protein;
        totals.carbs += food.carbs;
        totals.fat += food.fat;
      });
      return totals;
    },
    { protein: 0, carbs: 0, fat: 0 }
  );
  
  const macroChartData = [
    { name: 'Proteínas', value: macroData.protein, color: '#4361ee' },
    { name: 'Carboidratos', value: macroData.carbs, color: '#4cc9f0' },
    { name: 'Gorduras', value: macroData.fat, color: '#f72585' }
  ];
  
  // Preparar dados para gráfico de progresso das metas
  const goalsData = goals
    .filter(goal => !goal.completed)
    .slice(0, 3)
    .map(goal => ({
      name: goal.name,
      progresso: goal.progress || 0,
      color: '#4361ee'
    }));
  
  // Próximos treinos agendados (simulação)
  const upcomingWorkouts = [
    { name: 'Treino de Pernas', time: '18:00', day: 'Hoje' },
    { name: 'Cardio', time: '07:30', day: 'Amanhã' },
    { name: 'Treino de Peito', time: '19:00', day: 'Quarta-feira' }
  ];
  
  // Formatter personalizado para tooltip
  const customTooltipFormatter = (value: number | string) => {
    if (typeof value === 'number') {
      return `${value.toFixed(1)}g`;
    }
    return value;
  };
  
  // Formatter para percentagem
  const percentageFormatter = (value: number | string) => {
    if (typeof value === 'number') {
      return `${value}%`;
    }
    return value;
  };
  
  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      
      <div className="welcome-section">
        <h3>Bem-vindo, {user.name || 'Utilizador'}!</h3>
        <p>Aqui está o resumo do seu dia.</p>
      </div>
      
      <div className="dashboard-grid">
        {/* Resumo Calórico */}
        <div className="dashboard-card calorie-summary">
          <h3>Resumo Calórico de Hoje</h3>
          
          <div className="calorie-stats">
            <div className="calorie-stat">
              <h4>Meta</h4>
              <p>{user.dailyCalorieTarget || 2000} kcal</p>
            </div>
            <div className="calorie-stat">
              <h4>Consumidas</h4>
              <p>{caloriesConsumed} kcal</p>
            </div>
            <div className="calorie-stat">
              <h4>Queimadas</h4>
              <p>{caloriesBurned} kcal</p>
            </div>
            <div className="calorie-stat">
              <h4>Restantes</h4>
              <p className={caloriesRemaining < 0 ? 'negative' : ''}>{caloriesRemaining} kcal</p>
            </div>
          </div>
          
          <div className="progress-container">
            <div className="progress-label">
              <span>Consumo Calórico</span>
              <span>{Math.min(100, (caloriesConsumed / (user.dailyCalorieTarget || 2000)) * 100).toFixed(0)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress" 
                style={{ width: `${Math.min(100, (caloriesConsumed / (user.dailyCalorieTarget || 2000)) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Gráfico de Calorias */}
        <div className="dashboard-card calorie-chart">
          <h3>Balanço Calórico (Últimos 7 dias)</h3>
          
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={caloriesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="consumidas" stroke="#4361ee" name="Consumidas" />
              <Line type="monotone" dataKey="queimadas" stroke="#4cc9f0" name="Queimadas" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Macronutrientes */}
        <div className="dashboard-card macro-chart">
          <h3>Macronutrientes de Hoje</h3>
          
          {macroData.protein === 0 && macroData.carbs === 0 && macroData.fat === 0 ? (
            <p className="no-data">Nenhuma refeição registada hoje.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={macroChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {macroChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={customTooltipFormatter} />
              </PieChart>
            </ResponsiveContainer>
          )}
          
          <div className="macro-stats">
            <div className="macro-stat">
              <span className="macro-label">Proteínas</span>
              <span className="macro-value">{macroData.protein.toFixed(1)}g</span>
            </div>
            <div className="macro-stat">
              <span className="macro-label">Carboidratos</span>
              <span className="macro-value">{macroData.carbs.toFixed(1)}g</span>
            </div>
            <div className="macro-stat">
              <span className="macro-label">Gorduras</span>
              <span className="macro-value">{macroData.fat.toFixed(1)}g</span>
            </div>
          </div>
        </div>
        
        {/* Progresso das Metas */}
        <div className="dashboard-card goals-progress">
          <h3>Progresso das Metas</h3>
          
          {goalsData.length === 0 ? (
            <p className="no-data">Nenhuma meta ativa. Crie uma nova meta para acompanhar seu progresso!</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                layout="vertical"
                data={goalsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip formatter={percentageFormatter} />
                <Bar dataKey="progresso" fill="#4361ee">
                  {goalsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
          
          <div className="view-all-link">
            <a href="#/goals">Ver todas as metas →</a>
          </div>
        </div>
        
        {/* Próximos Treinos */}
        <div className="dashboard-card upcoming-workouts">
          <h3>Próximos Treinos</h3>
          
          <ul className="workout-schedule">
            {upcomingWorkouts.map((workout, index) => (
              <li key={index} className="scheduled-workout">
                <div className="workout-info">
                  <h4>{workout.name}</h4>
                  <p>{workout.day} às {workout.time}</p>
                </div>
                <button className="workout-action">Iniciar</button>
              </li>
            ))}
          </ul>
          
          <div className="view-all-link">
            <a href="#/exercises">Gerir treinos →</a>
          </div>
        </div>
        
        {/* Refeições de Hoje */}
        <div className="dashboard-card today-meals">
          <h3>Refeições de Hoje</h3>
          
          {todayMeals.length === 0 ? (
            <p className="no-data">Nenhuma refeição registada hoje.</p>
          ) : (
            <ul className="meals-summary">
              {todayMeals.map(meal => (
                <li key={meal.id} className="meal-summary">
                  <div className="meal-info">
                    <h4>{
                      meal.type === 'breakfast' ? 'Pequeno-almoço' :
                      meal.type === 'lunch' ? 'Almoço' :
                      meal.type === 'dinner' ? 'Jantar' : 'Lanche'
                    }</h4>
                    <p>{meal.foods.length} alimentos · {meal.foods.reduce((sum, food) => sum + food.calories, 0)} kcal</p>
                  </div>
                  <div className="meal-macros">
                    <span>P: {meal.foods.reduce((sum, food) => sum + food.protein, 0).toFixed(1)}g</span>
                    <span>C: {meal.foods.reduce((sum, food) => sum + food.carbs, 0).toFixed(1)}g</span>
                    <span>G: {meal.foods.reduce((sum, food) => sum + food.fat, 0).toFixed(1)}g</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
          
          <div className="view-all-link">
            <a href="#/diet">Gerir dieta →</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
