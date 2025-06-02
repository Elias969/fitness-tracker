import { useState, useEffect } from 'react';

// Hook personalizado para persistência de dados no localStorage
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // Função para obter o valor inicial do localStorage ou usar o valor padrão
  const readValue = (): T => {
    // Verificar se estamos no ambiente do navegador
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // Tentar obter o valor do localStorage
      const item = window.localStorage.getItem(key);
      // Retornar o valor parseado ou o valor inicial se não existir
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Erro ao ler localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // Estado para armazenar o valor atual
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Função para atualizar o valor no estado e no localStorage
  const setValue = (value: T) => {
    // Verificar se estamos no ambiente do navegador
    if (typeof window === 'undefined') {
      console.warn(`Não é possível salvar "${key}" no localStorage quando não estamos no navegador.`);
      return;
    }

    try {
      // Permitir que o valor seja uma função (como no useState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Salvar no estado
      setStoredValue(valueToStore);
      // Salvar no localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Erro ao salvar "${key}" no localStorage:`, error);
    }
  };

  // Escutar por mudanças no localStorage (para sincronização entre abas)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };

    // Adicionar o event listener
    window.addEventListener('storage', handleStorageChange);

    // Limpar o event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;
