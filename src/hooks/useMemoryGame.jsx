import { useState, useCallback } from 'react';

// Frecuencias musicales para los 4 botones
const FREQUENCIES = [329.63, 261.63, 220.00, 164.81]; 

export function useMemoryGame(setStage) {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePad, setActivePad] = useState(null);
  const [message, setMessage] = useState("Presiona Jugar para empezar");
  const [owlState, setOwlState] = useState('idle');
  const [level, setLevel] = useState(1);
  const maxLevels = 3;

  const playSound = (index) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(FREQUENCIES[index], audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
  };

  const playSequence = useCallback(async (currentSeq) => {
    setIsPlaying(true);
    setMessage("¡Escucha y observa!");
    setOwlState('idle');
    
    for (let i = 0; i < currentSeq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const padIndex = currentSeq[i];
      setActivePad(padIndex);
      playSound(padIndex);
      await new Promise(resolve => setTimeout(resolve, 400));
      setActivePad(null);
    }
    
    setIsPlaying(false);
    setMessage("¡Tu turno!");
  }, []);

  const startGame = () => {
    const nextSeq = [Math.floor(Math.random() * 4)];
    setSequence(nextSeq);
    setPlayerSequence([]);
    setLevel(1);
    playSequence(nextSeq);
  };

  const handlePadClick = (index) => {
    if (isPlaying || sequence.length === 0) return;

    playSound(index);
    setActivePad(index);
    setTimeout(() => setActivePad(null), 200);

    const newPlayerSeq = [...playerSequence, index];
    setPlayerSequence(newPlayerSeq);

    // Validar el paso actual
    if (newPlayerSeq[newPlayerSeq.length - 1] !== sequence[newPlayerSeq.length - 1]) {
      setMessage("¡Oh no! Te equivocaste.");
      setOwlState('wrong');
      setSequence([]);
      return;
    }

    // Si completó la secuencia de este nivel
    if (newPlayerSeq.length === sequence.length) {
      if (level === maxLevels) {
        setMessage("¡Excelente memoria! Has superado la prueba.");
        setOwlState('cheer');
        setIsPlaying(true); // Bloquea los botones
        setTimeout(() => setStage('match'), 3000); // Pasamos al siguiente juego (Match)
      } else {
        setMessage("¡Bien hecho! Siguiente nivel...");
        setOwlState('cheer');
        setIsPlaying(true);
        const nextSeq = [...sequence, Math.floor(Math.random() * 4)];
        setSequence(nextSeq);
        setPlayerSequence([]);
        setLevel(level + 1);
        setTimeout(() => playSequence(nextSeq), 1500);
      }
    }
  };

  return {
    sequence,
    isPlaying,
    activePad,
    message,
    owlState,
    level,
    maxLevels,
    startGame,
    handlePadClick
  };
}