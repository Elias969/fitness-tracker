import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts';
import { format, subDays, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';

const Progress: React.FC = () => {
  const meals = useSelector((state: RootState) => state.meals);
  const workouts = useSelector((state: RootState) => state.workouts);
  const goals = useSelector((state: RootState) => state.goals);
  const measurements = useSelector((state: RootState) => state.measurements);
  
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'calories' | 'workouts'>('calories');
  
  // Preparar dados para gráficos
  const prepareTimeRangeData = () => {
    const today = new Date();
    let days = 7;
    
    switch (timeRange) {
      case 'month':
        days = 30;
        break;
      case 'year':
        days = 365;
        break;
      default:
        days = 7;
    }
    
    // Criar array de datas para o período selecionado
    const dateRange = Array.from({ length: days }, (_, i) => {
      const date = subDays(today, days - i - 1);
      return format(date, 'yyyy-MM-dd');
    });
    
    return dateRange;
  };
  
  // Dados para gráfico de calorias
  const prepareCaloriesData = () => {
    const dateRange = prepareTimeRangeData();
    
    return dateRange.map(date => {
      // Calorias consumidas
      const mealsForDate = meals.filter(meal => meal.date.startsWith(date));
      const caloriesConsumed = mealsForDate.reduce((total, meal) => {
        return total + meal.foods.reduce((mealTotal, food) => mealTotal + food.calories, 0);
      }, 0);
      
      // Calorias queimadas
      const workoutsForDate = workouts.filter(workout => workout.date.startsWith(date));
      const caloriesBurned = workoutsForDate.reduce((total, workout) => {
        return total + (workout.caloriesBurned || 0);
      }, 0);
      
      return {
        date: format(parseISO(date), 'dd/MM', { locale: pt }),
        consumidas: caloriesConsumed,
        queimadas: caloriesBurned,
        balanço: caloriesConsumed - caloriesBurned
      };
    });
  };
  
  // Dados para gráfico de peso
  const prepareWeightData = () => {
    const dateRange = prepareTimeRangeData();
    
    // Encontrar medições para cada data
    return dateRange.map(date => {
      const measurementForDate = measurements
        .filter(m => m.date.startsWith(date) && m.weight !== undefined)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      
      return {
        date: format(parseISO(date), 'dd/MM', { locale: pt }),
        peso: measurementForDate?.weight || null
      };
    }).filter(item => item.peso !== null);
  };
  
  // Dados para gráfico de treinos
  const prepareWorkoutsData = () => {
    const dateRange = prepareTimeRangeData();
    
    return dateRange.map(date => {
      const workoutsForDate = workouts.filter(workout => workout.date.startsWith(date));
      
      return {
        date: format(parseISO(date), 'dd/MM', { locale: pt }),
        treinos: workoutsForDate.length,
        duração: workoutsForDate.reduce((total, workout) => total + workout.duration, 0)
      };
    });
  };
  
  // Dados para gráfico de distribuição de macronutrientes
  const prepareMacroDistributionData = () => {
    // Considerar apenas refeições dos últimos 7 dias
    const recentDate = subDays(new Date(), 7).toISOString().split('T')[0];
    const recentMeals = meals.filter(meal => meal.date >= recentDate);
    
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    
    recentMeals.forEach(meal => {
      meal.foods.forEach(food => {
        totalProtein += food.protein;
        totalCarbs += food.carbs;
        totalFat += food.fat;
      });
    });
    
    const totalMacros = totalProtein + totalCarbs + totalFat;
    
    return [
      { name: 'Proteínas', value: totalProtein, percentage: totalMacros ? Math.round((totalProtein / totalMacros) * 100) : 0 },
      { name: 'Carboidratos', value: totalCarbs, percentage: totalMacros ? Math.round((totalCarbs / totalMacros) * 100) : 0 },
      { name: 'Gorduras', value: totalFat, percentage: totalMacros ? Math.round((totalFat / totalMacros) * 100) : 0 }
    ];
  };
  
  // Dados para gráfico de progresso das metas
  const prepareGoalsProgressData = () => {
    return goals
      .filter(goal => !goal.completed)
      .map(goal => ({
        name: goal.name,
        progresso: goal.progress || 0
      }))
      .sort((a, b) => b.progresso - a.progresso);
  };
  
  // Cores para gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
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
    <div className="progress-container">
      <h2>Análise de Progresso</h2>
      
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="time-range">Período:</label>
          <select
            id="time-range"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
          >
            <option value="week">Última Semana</option>
            <option value="month">Último Mês</option>
            <option value="year">Último Ano</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="metric">Métrica Principal:</label>
          <select
            id="metric"
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as any)}
          >
            <option value="calories">Calorias</option>
            <option value="weight">Peso</option>
            <option value="workouts">Treinos</option>
          </select>
        </div>
      </div>
      
      <div className="charts-grid">
        {/* Gráfico Principal */}
        <div className="chart-card main-chart">
          <h3>
            {selectedMetric === 'calories' ? 'Balanço Calórico' : 
             selectedMetric === 'weight' ? 'Evolução do Peso' : 'Atividade Física'}
          </h3>
          
          <ResponsiveContainer width="100%" height={300}>
            {selectedMetric === 'calories' ? (
              <LineChart
                data={prepareCaloriesData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="consumidas" stroke="#8884d8" name="Calorias Consumidas" />
                <Line type="monotone" dataKey="queimadas" stroke="#82ca9d" name="Calorias Queimadas" />
                <Line type="monotone" dataKey="balanço" stroke="#ff7300" name="Balanço Calórico" />
              </LineChart>
            ) : selectedMetric === 'weight' ? (
              <LineChart
                data={prepareWeightData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="peso" stroke="#8884d8" name="Peso (kg)" />
              </LineChart>
            ) : (
              <BarChart
                data={prepareWorkoutsData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="treinos" fill="#8884d8" name="Número de Treinos" />
                <Bar yAxisId="right" dataKey="duração" fill="#82ca9d" name="Duração Total (min)" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        
        {/* Gráfico de Distribuição de Macronutrientes */}
        <div className="chart-card">
          <h3>Distribuição de Macronutrientes</h3>
          
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={prepareMacroDistributionData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percentage }) => `${name}: ${percentage}%`}
              >
                {prepareMacroDistributionData().map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={customTooltipFormatter} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Gráfico de Progresso das Metas */}
        <div className="chart-card">
          <h3>Progresso das Metas</h3>
          
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              layout="vertical"
              data={prepareGoalsProgressData()}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip formatter={percentageFormatter} />
              <Bar dataKey="progresso" fill="#8884d8">
                {prepareGoalsProgressData().map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Resumo de Estatísticas */}
        <div className="stats-card">
          <h3>Resumo de Estatísticas</h3>
          
          <div className="stats-grid">
            <div className="stat-item">
              <h4>Total de Treinos</h4>
              <p className="stat-value">{workouts.length}</p>
            </div>
            
            <div className="stat-item">
              <h4>Calorias Queimadas (Total)</h4>
              <p className="stat-value">
                {workouts.reduce((total, workout) => total + (workout.caloriesBurned || 0), 0)} kcal
              </p>
            </div>
            
            <div className="stat-item">
              <h4>Metas Concluídas</h4>
              <p className="stat-value">
                {goals.filter(goal => goal.completed).length}
              </p>
            </div>
            
            <div className="stat-item">
              <h4>Metas em Progresso</h4>
              <p className="stat-value">
                {goals.filter(goal => !goal.completed).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
