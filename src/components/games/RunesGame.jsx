import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import ProfeBuho3D from '../3d/ProfeBuho3D';
import { runewords } from '../../data/gameData';

export default function RunesGame({ setStage, setOwlAction, owlAction }) {
  const [level, setLevel] = useState(0);
  const data = runewords[level];
  const [collected, setCollected] = useState([]);
  const [showNext, setShowNext] = useState(false);

  // Mezclar las letras de la palabra para que floten
  const shuffledLetters = useMemo(() => {
    if (!data) return [];
    const chars = data.word.split('').map((char, index) => ({ char, id: `${char}-${index}` }));
    return chars.sort(() => Math.random() - 0.5).map((item) => ({
      ...item,
      delay: Math.random() * 2 // Retraso aleatorio para la animación
    }));
  }, [data]);

  const handleCatch = (letterObj) => {
    if (showNext) return;
    const nextRequiredChar = data.word[collected.length];

    if (letterObj.char === nextRequiredChar) {
      setCollected([...collected, letterObj]);
      setOwlAction('idle');
    } else {
      setOwlAction('wrong');
      setTimeout(() => setOwlAction('idle'), 1000);
    }
  };

  useEffect(() => {
    if (data && collected.length === data.word.length && data.word.length > 0) {
      setOwlAction('cheer');
      setShowNext(true); // Esperar a botón manual
    }
  }, [collected, data, setOwlAction]);

  const handleNext = () => {
    setShowNext(false);
    setOwlAction('idle');
    if (level < runewords.length - 1) {
      setLevel(l => l + 1);
      setCollected([]);
    } else {
      setStage('memory'); // Pasar al siguiente juego
    }
  };

  if (!data) return null;

  return (
    <div className="w-full h-full flex flex-col items-center animate-fade-in relative min-h-[70vh]">
      
      {/* Cabecera del Juego */}
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 glass-panel px-6 py-4 rounded-3xl mb-4 z-20 shadow-2xl text-center md:text-left w-full max-w-2xl">
        <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
          <ProfeBuho3D action={owlAction} />
        </div>
        <div>
          <h3 className="text-xs md:text-sm font-black text-amber-400 tracking-widest uppercase mb-1">
            Prueba II: Atrapa las Runas
          </h3>
          <p className="text-lg md:text-xl font-bold text-emerald-50">"{data.clue}"</p>
          
          <div className="flex gap-1 mt-2 justify-center md:justify-start">
            {runewords.map((_, i) => (
              <div key={i} className={`h-1.5 w-6 rounded-full ${i <= level ? 'bg-amber-400' : 'bg-emerald-800'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Cajas de Letras Recolectadas */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 z-20 min-h-[80px]">
        {data.word.split('').map((char, i) => {
          const filledObj = collected[i];
          return (
            <div
              key={i}
              className={`w-12 h-14 md:w-16 md:h-20 rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-4xl font-black transition-all duration-500 ${
                filledObj 
                  ? 'bg-amber-500 text-amber-950 shadow-[0_0_20px_rgba(251,191,36,0.8)] scale-110' 
                  : 'glass-panel border-2 border-emerald-700/50 text-transparent'
              }`}
            >
              {filledObj ? filledObj.char : ''}
            </div>
          );
        })}
      </div>

      {/* Botones Flotantes (Runas para atrapar) */}
      <div className="w-full max-w-4xl flex-grow flex flex-wrap justify-center items-center gap-4 md:gap-8 p-4 z-40">
        {shuffledLetters.map((item) => {
          const isCollected = collected.find(c => c.id === item.id);
          return (
            <div key={item.id} className="relative flex justify-center items-center w-14 h-14 md:w-20 md:h-20">
              {!isCollected && (
                <button
                  disabled={showNext}
                  onClick={() => handleCatch(item)}
                  style={{ animationDelay: `${item.delay}s` }}
                  className={`w-12 h-12 md:w-16 md:h-16 bg-emerald-800/80 backdrop-blur-md rounded-full border-2 border-emerald-400 text-white text-2xl md:text-3xl font-black flex items-center justify-center shadow-lg hover:bg-emerald-500 hover:scale-110 transition-transform animate-float ${showNext ? 'opacity-0' : 'opacity-100'}`}
                >
                  {item.char}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Zona de Feedback y Botón de Siguiente */}
      <div className="h-20 w-full text-center px-4 mt-2 z-20 flex flex-col items-center justify-center gap-2">
        {owlAction === 'wrong' && (
          <span className="inline-block px-4 md:px-6 py-2 bg-red-900/80 text-white rounded-full font-bold text-sm md:text-base">
            ¡Cuidado! Esa no es la letra correcta.
          </span>
        )}
        
        {owlAction === 'cheer' && !showNext && (
          <span className="inline-block px-4 md:px-6 py-2 bg-amber-500 text-amber-950 rounded-full font-bold text-base md:text-xl glow-gold">
            ¡Palabra Mágica Completada!
          </span>
        )}
        
        {showNext && (
          <button onClick={handleNext} className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-full font-black flex items-center gap-2 shadow-lg hover:scale-105 transition-transform animate-pulse glow-gold text-lg md:text-xl">
            Siguiente <ArrowRight size={20} />
          </button>
        )}
      </div>

    </div>
  );
}