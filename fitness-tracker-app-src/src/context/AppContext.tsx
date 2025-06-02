import { createContext, useContext, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store, RootState, updateUser, calculateCalorieTarget } from '../store';
import useLocalStorage from '../hooks/useLocalStorage';

// Tipo para o contexto de persistência
type PersistenceContextType = {
  loadFromStorage: () => void;
  saveToStorage: (state: RootState) => void;
};

// Criar o contexto
const PersistenceContext = createContext<PersistenceContextType | undefined>(undefined);

// Hook personalizado para usar o contexto
export const usePersistence = () => {
  const context = useContext(PersistenceContext);
  if (!context) {
    throw new Error('usePersistence deve ser usado dentro de um PersistenceProvider');
  }
  return context;
};

// Componente Provider
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storedState, setStoredState] = useLocalStorage<RootState | null>('fitness-tracker-state', null);

  // Carregar dados do localStorage para a store
  const loadFromStorage = () => {
    if (storedState) {
      // Restaurar o estado do utilizador
      store.dispatch(updateUser(storedState.user));
      
      // Recalcular o objetivo calórico
      store.dispatch(calculateCalorieTarget());
    }
  };

  // Guardar dados da store no localStorage
  const saveToStorage = (state: RootState) => {
    setStoredState(state);
  };

  // Carregar dados ao iniciar
  useEffect(() => {
    loadFromStorage();
  }, []);

  // Guardar dados quando a store mudar
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      saveToStorage(store.getState());
    });

    return () => unsubscribe();
  }, []);

  return (
    <Provider store={store}>
      <PersistenceContext.Provider value={{ loadFromStorage, saveToStorage }}>
        {children}
      </PersistenceContext.Provider>
    </Provider>
  );
};
