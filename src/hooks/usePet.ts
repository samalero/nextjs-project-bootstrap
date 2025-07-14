'use client';

import { useState, useEffect, useCallback } from 'react';

export interface PetStats {
  felicidad: number;
  energia: number;
  salud: number;
}

export interface PetActions {
  acariciar: () => void;
  saltar: () => void;
  bailar: () => void;
  cambiarColor: (newColor: string) => void;
}

export interface PetState {
  stats: PetStats;
  actions: PetActions;
  color: string;
  message: string;
  mood: 'happy' | 'tired' | 'sad' | 'excited' | 'normal';
}

const INITIAL_STATS: PetStats = {
  felicidad: 75,
  energia: 80,
  salud: 90
};

const MESSAGES = {
  acariciar: [
    '¡Me encantan las caricias! 💕',
    '¡Qué rico! Me siento muy querido 🥰',
    '¡Más caricias por favor! ✨'
  ],
  saltar: [
    '¡Qué salto tan divertido! 🦘',
    '¡Weee! Me encanta saltar 🌟',
    '¡Mira qué alto puedo saltar! 🚀'
  ],
  bailar: [
    '¡Bailar es lo mejor, aunque me canso! 💃',
    '¡Mira mis movimientos! 🕺',
    '¡La música me llena de energía! 🎵'
  ],
  cambiarColor: [
    '¡Nuevo look, nuevo yo! ✨',
    '¡Me veo fantástico con este color! 🌈',
    '¡Gracias por hacerme más hermoso! 💖'
  ],
  degradacion: [
    'Necesito un poco de atención... 😔',
    'Me siento un poco solo... 🥺',
    'Un poco de cariño me vendría bien... 💭'
  ]
};

export function usePet(initialColor: string = '#ff6b6b'): PetState {
  const [stats, setStats] = useState<PetStats>(INITIAL_STATS);
  const [color, setColor] = useState<string>(initialColor);
  const [message, setMessage] = useState<string>('¡Hola! Estoy listo para jugar contigo 🎮');
  const [mood, setMood] = useState<'happy' | 'tired' | 'sad' | 'excited' | 'normal'>('normal');

  // Función para obtener mensaje aleatorio
  const getRandomMessage = useCallback((type: keyof typeof MESSAGES) => {
    const messages = MESSAGES[type];
    return messages[Math.floor(Math.random() * messages.length)];
  }, []);

  // Función para actualizar el estado de ánimo basado en las estadísticas
  const updateMood = useCallback((newStats: PetStats) => {
    const average = (newStats.felicidad + newStats.energia + newStats.salud) / 3;
    
    if (average >= 80) {
      setMood('happy');
    } else if (average >= 60) {
      setMood('normal');
    } else if (average >= 40) {
      setMood('tired');
    } else if (newStats.energia < 20) {
      setMood('tired');
    } else {
      setMood('sad');
    }
  }, []);

  // Acciones de la mascota
  const acariciar = useCallback(() => {
    setStats(prev => {
      const newStats = {
        ...prev,
        felicidad: Math.min(prev.felicidad + 15, 100),
        salud: Math.min(prev.salud + 5, 100)
      };
      updateMood(newStats);
      return newStats;
    });
    setMessage(getRandomMessage('acariciar'));
    setMood('happy');
  }, [getRandomMessage, updateMood]);

  const saltar = useCallback(() => {
    setStats(prev => {
      if (prev.energia < 10) {
        setMessage('¡Estoy muy cansado para saltar! 😴');
        return prev;
      }
      
      const newStats = {
        ...prev,
        energia: Math.max(prev.energia - 12, 0),
        felicidad: Math.min(prev.felicidad + 8, 100)
      };
      updateMood(newStats);
      return newStats;
    });
    setMessage(getRandomMessage('saltar'));
    setMood('excited');
  }, [getRandomMessage, updateMood]);

  const bailar = useCallback(() => {
    setStats(prev => {
      if (prev.energia < 15) {
        setMessage('¡Necesito más energía para bailar! 💤');
        return prev;
      }
      
      const newStats = {
        ...prev,
        felicidad: Math.min(prev.felicidad + 20, 100),
        energia: Math.max(prev.energia - 25, 0)
      };
      updateMood(newStats);
      return newStats;
    });
    setMessage(getRandomMessage('bailar'));
    setMood('excited');
  }, [getRandomMessage, updateMood]);

  const cambiarColor = useCallback((newColor: string) => {
    setColor(newColor);
    setMessage(getRandomMessage('cambiarColor'));
    setStats(prev => {
      const newStats = {
        ...prev,
        felicidad: Math.min(prev.felicidad + 10, 100)
      };
      updateMood(newStats);
      return newStats;
    });
    setMood('happy');
  }, [getRandomMessage, updateMood]);

  // Degradación gradual de estadísticas
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => {
        const newStats = {
          felicidad: Math.max(prev.felicidad - 2, 0),
          energia: Math.max(prev.energia - 1, 0),
          salud: Math.max(prev.salud - 1, 0)
        };
        
        // Mostrar mensaje de degradación ocasionalmente
        if (Math.random() < 0.3 && (newStats.felicidad < 30 || newStats.energia < 30)) {
          setMessage(getRandomMessage('degradacion'));
        }
        
        updateMood(newStats);
        return newStats;
      });
    }, 8000); // Cada 8 segundos

    return () => clearInterval(interval);
  }, [getRandomMessage, updateMood]);

  // Regeneración de salud cuando la mascota está feliz
  useEffect(() => {
    const healthInterval = setInterval(() => {
      setStats(prev => {
        if (prev.felicidad > 70 && prev.salud < 100) {
          const newStats = {
            ...prev,
            salud: Math.min(prev.salud + 3, 100)
          };
          updateMood(newStats);
          return newStats;
        }
        return prev;
      });
    }, 15000); // Cada 15 segundos

    return () => clearInterval(healthInterval);
  }, [updateMood]);

  const actions: PetActions = {
    acariciar,
    saltar,
    bailar,
    cambiarColor
  };

  return {
    stats,
    actions,
    color,
    message,
    mood
  };
}
