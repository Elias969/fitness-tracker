import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, addGoal, deleteGoal, updateGoalProgress, addGoalCheckpoint } from '../store';
import { Goal, GoalCheckpoint } from '../types';
import { v4 as uuidv4 } from 'uuid';

const Goals: React.FC = () => {
  const dispatch = useDispatch();
  const goals = useSelector((state: RootState) => state.goals);
  const user = useSelector((state: RootState) => state.user);
  
  const [showAddGoalForm, setShowAddGoalForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  
  // Estado para o formulário de nova meta
  const [goalType, setGoalType] = useState<'weight' | 'measurement' | 'strength' | 'endurance' | 'habit' | 'custom'>('weight');
  const [goalName, setGoalName] = useState('');
  const [startValue, setStartValue] = useState<number>(0);
  const [targetValue, setTargetValue] = useState<number>(0);
  const [unit, setUnit] = useState('kg');
  const [targetDate, setTargetDate] = useState<string>('');
  
  // Estado para atualização de progresso
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [checkpointNote, setCheckpointNote] = useState('');
  
  // Filtrar metas por status
  const activeGoals = goals.filter(goal => !goal.completed);
  const completedGoals = goals.filter(goal => goal.completed);
  
  // Adicionar nova meta
  const handleAddGoal = () => {
    if (!goalName || !targetDate) return;
    
    const newGoal: Goal = {
      id: uuidv4(),
      userId: user.id,
      type: goalType,
      name: goalName,
      startValue,
      targetValue,
      unit,
      startDate: new Date().toISOString().split('T')[0],
      targetDate,
      currentValue: startValue,
      progress: 0,
      completed: false,
      checkpoints: []
    };
    
    dispatch(addGoal(newGoal));
    resetForm();
    setShowAddGoalForm(false);
  };
  
  // Atualizar progresso da meta
  const handleUpdateProgress = () => {
    if (!selectedGoal) return;
    
    dispatch(updateGoalProgress({
      id: selectedGoal.id,
      currentValue
    }));
    
    // Adicionar checkpoint
    const checkpoint: GoalCheckpoint = {
      date: new Date().toISOString().split('T')[0],
      value: currentValue,
      notes: checkpointNote
    };
    
    dispatch(addGoalCheckpoint({
      goalId: selectedGoal.id,
      checkpoint
    }));
    
    setShowUpdateForm(false);
    setCheckpointNote('');
  };
  
  // Excluir meta
  const handleDeleteGoal = (goalId: string) => {
    dispatch(deleteGoal(goalId));
    if (selectedGoal?.id === goalId) {
      setSelectedGoal(null);
      setShowUpdateForm(false);
    }
  };
  
  // Resetar formulário
  const resetForm = () => {
    setGoalType('weight');
    setGoalName('');
    setStartValue(0);
    setTargetValue(0);
    setUnit('kg');
    setTargetDate('');
  };
  
  // Selecionar meta para atualização
  const handleSelectGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setCurrentValue(goal.currentValue || goal.startValue);
  };
  
  // Renderizar unidades com base no tipo de meta
  const renderUnitOptions = () => {
    switch (goalType) {
      case 'weight':
        return (
          <>
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </>
        );
      case 'measurement':
        return (
          <>
            <option value="cm">cm</option>
            <option value="in">in</option>
          </>
        );
      case 'strength':
        return (
          <>
            <option value="kg">kg</option>
            <option value="lb">lb</option>
            <option value="reps">repetições</option>
          </>
        );
      case 'endurance':
        return (
          <>
            <option value="km">km</option>
            <option value="min">minutos</option>
            <option value="steps">passos</option>
          </>
        );
      case 'habit':
        return (
          <>
            <option value="days">dias</option>
            <option value="times">vezes</option>
            <option value="%">%</option>
          </>
        );
      default:
        return (
          <>
            <option value="units">unidades</option>
            <option value="%">%</option>
          </>
        );
    }
  };
  
  return (
    <div className="goals-container">
      <h2>Metas e Objetivos</h2>
      
      <div className="goals-header">
        <button 
          className="add-goal-btn"
          onClick={() => setShowAddGoalForm(true)}
        >
          + Nova Meta
        </button>
      </div>
      
      {showAddGoalForm && (
        <div className="add-goal-form">
          <h3>Criar Nova Meta</h3>
          
          <div className="form-group">
            <label htmlFor="goal-type">Tipo de Meta:</label>
            <select
              id="goal-type"
              value={goalType}
              onChange={(e) => setGoalType(e.target.value as any)}
            >
              <option value="weight">Peso</option>
              <option value="measurement">Medida Corporal</option>
              <option value="strength">Força</option>
              <option value="endurance">Resistência</option>
              <option value="habit">Hábito</option>
              <option value="custom">Personalizada</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="goal-name">Nome da Meta:</label>
            <input
              type="text"
              id="goal-name"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              placeholder="Ex: Perder peso, Aumentar supino..."
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start-value">Valor Inicial:</label>
              <input
                type="number"
                id="start-value"
                value={startValue}
                onChange={(e) => setStartValue(parseFloat(e.target.value))}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="target-value">Valor Objetivo:</label>
              <input
                type="number"
                id="target-value"
                value={targetValue}
                onChange={(e) => setTargetValue(parseFloat(e.target.value))}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="unit">Unidade:</label>
              <select
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              >
                {renderUnitOptions()}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="target-date">Data Objetivo:</label>
            <input
              type="date"
              id="target-date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>
          
          <div className="form-actions">
            <button onClick={handleAddGoal}>Criar Meta</button>
            <button onClick={() => {
              resetForm();
              setShowAddGoalForm(false);
            }}>Cancelar</button>
          </div>
        </div>
      )}
      
      <div className="goals-section">
        <h3>Metas Ativas</h3>
        
        <div className="goals-list">
          {activeGoals.length === 0 ? (
            <p>Nenhuma meta ativa. Crie uma nova meta para começar!</p>
          ) : (
            activeGoals.map(goal => (
              <div 
                key={goal.id} 
                className={`goal-card ${selectedGoal?.id === goal.id ? 'selected' : ''}`}
                onClick={() => handleSelectGoal(goal)}
              >
                <div className="goal-header">
                  <h4>{goal.name}</h4>
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteGoal(goal.id);
                    }}
                  >
                    Excluir
                  </button>
                </div>
                
                <div className="goal-details">
                  <p>
                    <strong>Tipo:</strong> {
                      goal.type === 'weight' ? 'Peso' :
                      goal.type === 'measurement' ? 'Medida' :
                      goal.type === 'strength' ? 'Força' :
                      goal.type === 'endurance' ? 'Resistência' :
                      goal.type === 'habit' ? 'Hábito' : 'Personalizada'
                    }
                  </p>
                  <p>
                    <strong>Objetivo:</strong> {goal.startValue} → {goal.targetValue} {goal.unit}
                  </p>
                  <p>
                    <strong>Atual:</strong> {goal.currentValue || goal.startValue} {goal.unit}
                  </p>
                  <p>
                    <strong>Data Limite:</strong> {new Date(goal.targetDate).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="goal-progress">
                  <div className="progress-label">
                    <span>Progresso: {goal.progress?.toFixed(1)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress" 
                      style={{ width: `${goal.progress || 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <button 
                  className="update-progress-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUpdateForm(true);
                  }}
                >
                  Atualizar Progresso
                </button>
              </div>
            ))
          )}
        </div>
        
        <h3>Metas Concluídas</h3>
        
        <div className="goals-list completed">
          {completedGoals.length === 0 ? (
            <p>Nenhuma meta concluída ainda.</p>
          ) : (
            completedGoals.map(goal => (
              <div key={goal.id} className="goal-card completed">
                <div className="goal-header">
                  <h4>{goal.name}</h4>
                  <span className="completed-badge">Concluída</span>
                </div>
                
                <div className="goal-details">
                  <p>
                    <strong>Objetivo:</strong> {goal.startValue} → {goal.targetValue} {goal.unit}
                  </p>
                  <p>
                    <strong>Concluída em:</strong> {
                      goal.checkpoints && goal.checkpoints.length > 0
                        ? new Date(goal.checkpoints[goal.checkpoints.length - 1].date).toLocaleDateString()
                        : 'Data desconhecida'
                    }
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {selectedGoal && showUpdateForm && (
        <div className="update-progress-form">
          <h3>Atualizar Progresso: {selectedGoal.name}</h3>
          
          <div className="form-group">
            <label htmlFor="current-value">Valor Atual:</label>
            <div className="input-with-unit">
              <input
                type="number"
                id="current-value"
                value={currentValue}
                onChange={(e) => setCurrentValue(parseFloat(e.target.value))}
              />
              <span>{selectedGoal.unit}</span>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="checkpoint-note">Nota (opcional):</label>
            <textarea
              id="checkpoint-note"
              value={checkpointNote}
              onChange={(e) => setCheckpointNote(e.target.value)}
              placeholder="Ex: Atingi este marco após 3 semanas de treino consistente..."
            ></textarea>
          </div>
          
          <div className="form-actions">
            <button onClick={handleUpdateProgress}>Salvar Progresso</button>
            <button onClick={() => setShowUpdateForm(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
