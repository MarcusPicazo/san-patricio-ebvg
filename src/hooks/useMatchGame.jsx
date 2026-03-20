import { useState, useEffect } from 'react';

// Símbolos mágicos de San Patricio
const EMOJIS = ['🍀', '🌈', '🍯', '🎩', '🪙', '🦉'];

export function useMatchGame(setStage) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [owlState, setOwlState] = useState('idle');

  // Inicializar y mezclar las cartas al montar el componente
  useEffect(() => {
    const shuffled = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }));
    setCards(shuffled);
  }, []);

  const handleCardClick = (index) => {
    // Evitar clics si está bloqueado, si la carta ya está volteada o resuelta
    if (disabled || flipped.includes(index) || solved.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    // Cuando hay 2 cartas volteadas, verificamos si son iguales
    if (newFlipped.length === 2) {
      setDisabled(true);
      const [first, second] = newFlipped;
      
      if (cards[first].emoji === cards[second].emoji) {
        // ¡Hicieron match!
        setSolved([...solved, first, second]);
        setFlipped([]);
        setDisabled(false);
        setOwlState('cheer');
        setTimeout(() => setOwlState('idle'), 1000);
      } else {
        // No coinciden, las volvemos a ocultar
        setOwlState('wrong');
        setTimeout(() => {
          setFlipped([]);
          setDisabled(false);
          setOwlState('idle');
        }, 1000);
      }
    }
  };

  // Verificar si ya completó todo el tablero
  useEffect(() => {
    if (solved.length === EMOJIS.length * 2 && solved.length > 0) {
      setOwlState('cheer');
      // Esperamos un momento para que celebre y lo mandamos al último minijuego
      setTimeout(() => setStage('catch'), 2500); 
    }
  }, [solved, setStage]);

  return { cards, flipped, solved, owlState, handleCardClick };
}