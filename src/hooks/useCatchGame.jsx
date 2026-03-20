import { useState, useEffect } from 'react';

const GAME_DURATION = 30; // 30 segundos de juego
const SPAWN_RATE = 800;   // Cada 800ms aparece un nuevo elemento

const ITEM_TYPES = [
  { type: 'coin', emoji: '🪙', points: 10 },
  { type: 'clover', emoji: '🍀', points: 20 },
  { type: 'hat', emoji: '🎩', points: 30 }
];

export function useCatchGame(setStage) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [items, setItems] = useState([]);
  const [owlState, setOwlState] = useState('idle');

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setItems([]);
    setIsPlaying(true);
  };

  // Temporizador Principal
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) {
      if (timeLeft === 0 && isPlaying) {
        setIsPlaying(false);
        setOwlState('cheer');
        setTimeout(() => setStage('conclusion'), 3000); 
      }
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, setStage]);

  // Generador Aleatorio de Elementos
  useEffect(() => {
    if (!isPlaying) return;

    const spawner = setInterval(() => {
      const randomType = ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];
      
      const newItem = {
        id: Date.now() + Math.random(),
        ...randomType,
        x: Math.random() * 80 + 10,
        y: Math.random() * 70 + 10  
      };

      setItems(prev => [...prev, newItem]);

      setTimeout(() => {
        setItems(prev => prev.filter(item => item.id !== newItem.id));
      }, 1500 + Math.random() * 1000); 

    }, SPAWN_RATE);

    return () => clearInterval(spawner);
  }, [isPlaying]);

  const handleCatch = (id, points) => {
    setScore(s => s + points);
    setItems(prev => prev.filter(item => item.id !== id));
    setOwlState('cheer');
    setTimeout(() => setOwlState('idle'), 400); 
  };

  return { score, timeLeft, isPlaying, items, owlState, startGame, handleCatch };
}