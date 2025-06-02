import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, updateUser, calculateCalorieTarget } from '../store';

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  
  const [name, setName] = useState(user.name || '');
  const [age, setAge] = useState(user.age || 30);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(user.gender || 'male');
  const [height, setHeight] = useState(user.height || 175);
  const [weight, setWeight] = useState(user.weight || 70);
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'>(user.activityLevel || 'moderate');
  const [goal, setGoal] = useState<'lose_weight' | 'maintain' | 'gain_muscle' | 'improve_fitness'>(user.goal || 'maintain');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    dispatch(updateUser({
      name,
      age,
      gender,
      height,
      weight,
      activityLevel,
      goal
    }));
    
    dispatch(calculateCalorieTarget());
  };
  
  return (
    <div className="profile-container">
      <h2>Perfil do Utilizador</h2>
      
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="age">Idade:</label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value))}
              min="15"
              max="100"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="gender">Género:</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
            >
              <option value="male">Masculino</option>
              <option value="female">Feminino</option>
              <option value="other">Outro</option>
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="height">Altura (cm):</label>
            <input
              type="number"
              id="height"
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value))}
              min="100"
              max="250"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="weight">Peso (kg):</label>
            <input
              type="number"
              id="weight"
              value={weight}
              onChange={(e) => setWeight(parseInt(e.target.value))}
              min="30"
              max="300"
              step="0.1"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="activity-level">Nível de Atividade:</label>
          <select
            id="activity-level"
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active')}
          >
            <option value="sedentary">Sedentário (pouco ou nenhum exercício)</option>
            <option value="light">Levemente ativo (exercício leve 1-3 dias/semana)</option>
            <option value="moderate">Moderadamente ativo (exercício moderado 3-5 dias/semana)</option>
            <option value="active">Muito ativo (exercício intenso 6-7 dias/semana)</option>
            <option value="very_active">Extremamente ativo (exercício muito intenso, trabalho físico)</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="goal">Objetivo Principal:</label>
          <select
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value as 'lose_weight' | 'maintain' | 'gain_muscle' | 'improve_fitness')}
          >
            <option value="lose_weight">Perder Peso</option>
            <option value="maintain">Manter Peso</option>
            <option value="gain_muscle">Ganhar Massa Muscular</option>
            <option value="improve_fitness">Melhorar Condicionamento Físico</option>
          </select>
        </div>
        
        <div className="calorie-target">
          <h3>Meta Calórica Diária:</h3>
          <p className="calorie-value">{user.dailyCalorieTarget || '(Calcular)'} kcal</p>
          <p className="calorie-info">
            Esta meta é calculada com base nos seus dados e objetivo.
            Atualize seu perfil para recalcular.
          </p>
        </div>
        
        <button type="submit" className="save-profile-btn">Salvar Perfil</button>
      </form>
    </div>
  );
};

export default Profile;
