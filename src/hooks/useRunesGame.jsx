import { useState, useMemo, useEffect } from 'react';
import { runewords } from '../data/gameData';

export function useRunesGame(setStage) {
  const [level, setLevel] = useState(0);
  const data = runewords[level];
  const [collected, setCollected] = useState([]);
  const [showNext, setShowNext] = useState(false);
  const [owlState, setOwlState] = useState('idle');

  // Desordenar letras y asignarles un pequeño retraso para la animación flotante
  const shuffledLetters = useMemo(() => {
    if (!data) return [];
    const chars = data.word.split('').map((char, index) => ({
      char,
      id: `${char}-${index}`
    }));
    return chars
      .sort(() => Math.random() - 0.5)
      .map((item) => ({ ...item, delay: Math.random() * 2 }));
  }, [data]);

  const handleCatch = (letterObj) => {
    if (showNext) return;
    const nextRequiredChar = data.word[collected.length];
    
    // Validar si la letra clickeada es la correcta
    if (letterObj.char === nextRequiredChar) {
      setCollected([...collected, letterObj]);
      setOwlState('idle');
    } else {
      setOwlState('wrong');
      setTimeout(() => setOwlState('idle'), 1000);
    }
  };

  // Revisar si ya completó la palabra
  useEffect(() => {
    if (data && collected.length === data.word.length && data.word.length > 0) {
      setOwlState('cheer');
      setShowNext(true);
    }
  }, [collected, data]);

  const handleNext = () => {
    setShowNext(false);
    setOwlState('idle');
    if (level < runewords.length - 1) {
      setLevel(l => l + 1);
      setCollected([]);
    } else {
      // Cuando termina todas las runas, pasará al juego de memoria
      setStage('memory'); 
    }
  };

  return {
    data,
    level,
    collected,
    shuffledLetters,
    showNext,
    owlState,
    handleCatch,
    handleNext,
    totalLevels: runewords.length
  };
}