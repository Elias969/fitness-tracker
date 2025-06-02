import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, addWorkout, updateWorkout, deleteWorkout } from '../store';
import { Workout, WorkoutExercise, ExerciseSet, Exercise } from '../types';
import { searchExercises, calculateCaloriesBurned } from '../data/exercises';
import { v4 as uuidv4 } from 'uuid';

const Exercises: React.FC = () => {
  const dispatch = useDispatch();
  const workouts = useSelector((state: RootState) => state.workouts);
  const user = useSelector((state: RootState) => state.user);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Exercise[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showAddWorkoutForm, setShowAddWorkoutForm] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  
  // Estado para o formulário de novo treino
  const [workoutName, setWorkoutName] = useState('');
  const [workoutDuration, setWorkoutDuration] = useState(30);
  const [workoutNotes, setWorkoutNotes] = useState('');
  
  // Estado para adicionar exercício
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [exerciseSets, setExerciseSets] = useState<ExerciseSet[]>([{ reps: 10, weight: 20, completed: false }]);
  const [exerciseDuration, setExerciseDuration] = useState(0);
  
  // Filtrar treinos pela data selecionada
  const workoutsForSelectedDate = workouts.filter(workout => workout.date.startsWith(selectedDate));
  
  // Pesquisar exercícios
  const handleSearch = () => {
    if (searchQuery.trim()) {
      const results = searchExercises(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };
  
  // Adicionar novo treino
  const handleAddWorkout = () => {
    if (!workoutName) return;
    
    const newWorkout: Workout = {
      id: uuidv4(),
      userId: user.id,
      date: selectedDate,
      name: workoutName,
      duration: workoutDuration,
      exercises: [],
      notes: workoutNotes
    };
    
    dispatch(addWorkout(newWorkout));
    setSelectedWorkout(newWorkout);
    resetWorkoutForm();
    setShowAddWorkoutForm(false);
  };
  
  // Adicionar exercício ao treino
  const handleAddExerciseToWorkout = () => {
    if (!selectedWorkout || !selectedExercise) return;
    
    const workoutExercise: WorkoutExercise = {
      exerciseId: selectedExercise.id,
      name: selectedExercise.name,
      sets: [...exerciseSets],
      duration: selectedExercise.category === 'cardio' ? exerciseDuration : undefined
    };
    
    const updatedWorkout = {
      ...selectedWorkout,
      exercises: [...selectedWorkout.exercises, workoutExercise],
      caloriesBurned: (selectedWorkout.caloriesBurned || 0) + 
        calculateCaloriesBurned(
          selectedExercise, 
          selectedExercise.category === 'cardio' ? exerciseDuration : workoutDuration / selectedWorkout.exercises.length + 1,
          user.weight
        )
    };
    
    dispatch(updateWorkout(updatedWorkout));
    resetExerciseForm();
    setShowExerciseForm(false);
  };
  
  // Excluir treino
  const handleDeleteWorkout = (workoutId: string) => {
    dispatch(deleteWorkout(workoutId));
    if (selectedWorkout?.id === workoutId) {
      setSelectedWorkout(null);
    }
  };
  
  // Resetar formulário de treino
  const resetWorkoutForm = () => {
    setWorkoutName('');
    setWorkoutDuration(30);
    setWorkoutNotes('');
  };
  
  // Resetar formulário de exercício
  const resetExerciseForm = () => {
    setSelectedExercise(null);
    setExerciseSets([{ reps: 10, weight: 20, completed: false }]);
    setExerciseDuration(0);
  };
  
  // Adicionar set ao exercício
  const handleAddSet = () => {
    setExerciseSets([...exerciseSets, { reps: 10, weight: 20, completed: false }]);
  };
  
  // Remover set do exercício
  const handleRemoveSet = (index: number) => {
    setExerciseSets(exerciseSets.filter((_, i) => i !== index));
  };
  
  // Atualizar set do exercício
  const handleUpdateSet = (index: number, field: keyof ExerciseSet, value: any) => {
    const updatedSets = [...exerciseSets];
    updatedSets[index] = { ...updatedSets[index], [field]: value };
    setExerciseSets(updatedSets);
  };
  
  // Marcar exercício como concluído
  const handleToggleExerciseCompletion = (workoutId: string, exerciseIndex: number, setIndex: number) => {
    const workout = workouts.find(w => w.id === workoutId);
    if (!workout) return;
    
    const updatedWorkout = { ...workout };
    const updatedExercises = [...updatedWorkout.exercises];
    const updatedSets = [...updatedExercises[exerciseIndex].sets];
    
    updatedSets[setIndex] = {
      ...updatedSets[setIndex],
      completed: !updatedSets[setIndex].completed
    };
    
    updatedExercises[exerciseIndex] = {
      ...updatedExercises[exerciseIndex],
      sets: updatedSets
    };
    
    updatedWorkout.exercises = updatedExercises;
    
    dispatch(updateWorkout(updatedWorkout));
  };
  
  return (
    <div className="exercises-container">
      <h2>Gestão de Exercícios</h2>
      
      <div className="date-selector">
        <label htmlFor="date">Data:</label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>
      
      <div className="workouts-section">
        <div className="workouts-header">
          <h3>Treinos</h3>
          <button 
            className="add-workout-btn"
            onClick={() => setShowAddWorkoutForm(true)}
          >
            + Novo Treino
          </button>
        </div>
        
        {showAddWorkoutForm && (
          <div className="add-workout-form">
            <h4>Novo Treino</h4>
            
            <div className="form-group">
              <label htmlFor="workout-name">Nome do Treino:</label>
              <input
                type="text"
                id="workout-name"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder="Ex: Treino de Pernas, Cardio..."
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="workout-duration">Duração (minutos):</label>
              <input
                type="number"
                id="workout-duration"
                value={workoutDuration}
                onChange={(e) => setWorkoutDuration(parseInt(e.target.value))}
                min="1"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="workout-notes">Notas:</label>
              <textarea
                id="workout-notes"
                value={workoutNotes}
                onChange={(e) => setWorkoutNotes(e.target.value)}
                placeholder="Detalhes adicionais sobre o treino..."
              ></textarea>
            </div>
            
            <div className="form-actions">
              <button onClick={handleAddWorkout}>Criar Treino</button>
              <button onClick={() => {
                resetWorkoutForm();
                setShowAddWorkoutForm(false);
              }}>Cancelar</button>
            </div>
          </div>
        )}
        
        <div className="workouts-list">
          {workoutsForSelectedDate.length === 0 ? (
            <p>Nenhum treino registado para esta data.</p>
          ) : (
            workoutsForSelectedDate.map(workout => (
              <div 
                key={workout.id} 
                className={`workout-card ${selectedWorkout?.id === workout.id ? 'selected' : ''}`}
                onClick={() => setSelectedWorkout(workout)}
              >
                <div className="workout-header">
                  <h4>{workout.name}</h4>
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteWorkout(workout.id);
                    }}
                  >
                    Excluir
                  </button>
                </div>
                
                <div className="workout-details">
                  <p><strong>Duração:</strong> {workout.duration} minutos</p>
                  <p><strong>Calorias Queimadas:</strong> {workout.caloriesBurned || 0} kcal</p>
                  {workout.notes && <p><strong>Notas:</strong> {workout.notes}</p>}
                </div>
                
                <div className="workout-exercises">
                  <h5>Exercícios:</h5>
                  {workout.exercises.length === 0 ? (
                    <p>Nenhum exercício adicionado.</p>
                  ) : (
                    <ul>
                      {workout.exercises.map((exercise, exerciseIndex) => (
                        <li key={exercise.exerciseId} className="exercise-item">
                          <h6>{exercise.name}</h6>
                          {exercise.duration && (
                            <p>Duração: {exercise.duration} minutos</p>
                          )}
                          <table className="sets-table">
                            <thead>
                              <tr>
                                <th>Série</th>
                                <th>Reps</th>
                                <th>Peso</th>
                                <th>Concluído</th>
                              </tr>
                            </thead>
                            <tbody>
                              {exercise.sets.map((set, setIndex) => (
                                <tr key={setIndex}>
                                  <td>{setIndex + 1}</td>
                                  <td>{set.reps || '-'}</td>
                                  <td>{set.weight ? `${set.weight} kg` : '-'}</td>
                                  <td>
                                    <input
                                      type="checkbox"
                                      checked={set.completed}
                                      onChange={() => handleToggleExerciseCompletion(workout.id, exerciseIndex, setIndex)}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                {selectedWorkout?.id === workout.id && (
                  <button 
                    className="add-exercise-btn"
                    onClick={() => setShowExerciseForm(true)}
                  >
                    + Adicionar Exercício
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
      {selectedWorkout && showExerciseForm && (
        <div className="add-exercise-form">
          <h3>Adicionar Exercício ao Treino</h3>
          
          <div className="search-bar">
            <input
              type="text"
              placeholder="Pesquisar exercícios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch}>Pesquisar</button>
          </div>
          
          <div className="search-results">
            {searchResults.length === 0 ? (
              <p>Nenhum resultado. Tente pesquisar por nome, categoria ou grupo muscular.</p>
            ) : (
              <ul>
                {searchResults.map(exercise => (
                  <li 
                    key={exercise.id} 
                    className={`exercise-item ${selectedExercise?.id === exercise.id ? 'selected' : ''}`}
                    onClick={() => setSelectedExercise(exercise)}
                  >
                    <h4>{exercise.name}</h4>
                    <p>Categoria: {exercise.category}</p>
                    <p>Músculos: {exercise.muscleGroups.join(', ')}</p>
                    <p>Dificuldade: {
                      exercise.difficulty === 'beginner' ? 'Iniciante' :
                      exercise.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'
                    }</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {selectedExercise && (
            <div className="exercise-details-form">
              <h4>Detalhes do Exercício: {selectedExercise.name}</h4>
              
              {selectedExercise.category === 'cardio' ? (
                <div className="form-group">
                  <label htmlFor="exercise-duration">Duração (minutos):</label>
                  <input
                    type="number"
                    id="exercise-duration"
                    value={exerciseDuration}
                    onChange={(e) => setExerciseDuration(parseInt(e.target.value))}
                    min="1"
                  />
                </div>
              ) : (
                <>
                  <h5>Séries:</h5>
                  {exerciseSets.map((set, index) => (
                    <div key={index} className="set-row">
                      <div className="set-number">Série {index + 1}</div>
                      <div className="set-inputs">
                        <div className="form-group">
                          <label htmlFor={`reps-${index}`}>Repetições:</label>
                          <input
                            type="number"
                            id={`reps-${index}`}
                            value={set.reps || ''}
                            onChange={(e) => handleUpdateSet(index, 'reps', parseInt(e.target.value))}
                            min="1"
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor={`weight-${index}`}>Peso (kg):</label>
                          <input
                            type="number"
                            id={`weight-${index}`}
                            value={set.weight || ''}
                            onChange={(e) => handleUpdateSet(index, 'weight', parseFloat(e.target.value))}
                            min="0"
                            step="0.5"
                          />
                        </div>
                      </div>
                      <button 
                        className="remove-set-btn"
                        onClick={() => handleRemoveSet(index)}
                        disabled={exerciseSets.length <= 1}
                      >
                        X
                      </button>
                    </div>
                  ))}
                  
                  <button 
                    className="add-set-btn"
                    onClick={handleAddSet}
                  >
                    + Adicionar Série
                  </button>
                </>
              )}
              
              {selectedExercise.instructions && (
                <div className="exercise-instructions">
                  <h5>Instruções:</h5>
                  <p>{selectedExercise.instructions}</p>
                </div>
              )}
            </div>
          )}
          
          <div className="form-actions">
            <button 
              onClick={handleAddExerciseToWorkout}
              disabled={!selectedExercise}
            >
              Adicionar ao Treino
            </button>
            <button onClick={() => {
              resetExerciseForm();
              setShowExerciseForm(false);
            }}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exercises;
