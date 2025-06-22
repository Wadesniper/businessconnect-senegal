import { useState, useEffect } from 'react';

// Hook personnalisé pour "débattre" une valeur.
// Utile pour retarder l'exécution d'une opération coûteuse (ex: un appel API)
// jusqu'à ce que l'utilisateur ait fini de taper.
export function useDebounce<T>(value: T, delay: number): T {
  // État pour stocker la valeur débattue
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Met à jour la valeur débattue après le délai spécifié
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Nettoie le minuteur si la valeur change (ex: l'utilisateur tape encore)
    // ou si le composant est démonté.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Ne se ré-exécute que si la valeur ou le délai change

  return debouncedValue;
} 