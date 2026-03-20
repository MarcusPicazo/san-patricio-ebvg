import React, { useState, useEffect } from 'react';
import { Trophy, Timer, Play, ArrowRight } from 'lucide-react';
import ProfeBuho3D from '../3d/ProfeBuho3D';

export default function CatchGame({ setStage, setOwlAction, owlAction }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [items, setItems] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const targetScore = 15;

  const startGame = () => {
    setScore(0);
    setTimeLeft(20);
    setItems([]);
    setIsPlaying(true);
    setShowNext(false);
    setOwlAction('idle');
  };

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setIsPlaying(false);
          if (score < targetScore) setOwlAction('wrong');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, score]);

  useEffect(() => {
    if (!isPlaying) return;
    const spawner = setInterval(() => {
      const c = Math.floor(Math.random() * 4);
      const x = (c * 25) + 5 + Math.random() * 10;
      const y = (Math.floor(Math.random() * 3) * 30) + 5 + Math.random() * 10;
      const isBad = Math.random() > 0.7;
      const id = Date.now();
      
      setItems(prev => [...prev, { id, x, y, isBad, clicked: false }]);
      
      setTimeout(() => {
        setItems(prev => prev.filter(i => i.id !== id));
      }, 1200);
    }, 600);
    return () => clearInterval(spawner);
  }, [isPlaying]);

  useEffect(() => {
    if (score >= targetScore && isPlaying) {
      setIsPlaying(false);
      setOwlAction('cheer');
      setShowNext(true);
    }
  }, [score, isPlaying, setOwlAction]);

  const handleClick = (item) => {
    if (!isPlaying || item.clicked) return;
    
    // Marcar como clickeado para la animación de salida
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, clicked: true } : i));

    if (item.isBad) {
      setScore(s => Math.max(0, s - 2));
      setOwlAction('wrong');
    } else {
      setScore(s => s + 1);
      setOwlAction('idle');
    }

    setTimeout(() => {
      setItems(prev => prev.filter(i => i.id !== item.id));
    }, 200);
  };

  return (
    <div className="w-full h-full flex flex-col items-center animate-fade-in relative min-h-[70vh]">
      
      {/* Animación local para las monedas/hongos */}
      <style>{`
        @keyframes softSpawn {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-soft-spawn { animation: softSpawn 0.3s ease-out forwards; }
      `}</style>

      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 glass-panel px-6 py-4 rounded-3xl mb-4 z-20 shadow-2xl w-full max-w-3xl justify-between">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
            <ProfeBuho3D action={owlAction} />
          </div>
          <div>
            <h3 className="text-xs md:text-sm font-black text-amber-400 tracking-widest uppercase mb-1">Prueba V: Lluvia de Oro</h3>
            <p className="text-sm md:text-base font-bold text-emerald-50">Atrapa {targetScore} monedas. ¡Evita los hongos morados!</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-amber-500 text-amber-950 px-4 py-2 rounded-xl font-black text-xl flex items-center gap-2">
            <Trophy size={20} /> {score}/{targetScore}
          </div>
          <div className={`px-4 py-2 rounded-xl font-black text-xl flex items-center gap-2 ${timeLeft <= 5 && isPlaying ? 'bg-red-500 text-white animate-pulse' : 'glass-panel text-white'}`}>
            <Timer size={20} /> {timeLeft}s
          </div>
        </div>
      </div>

      {!isPlaying && !showNext && score < targetScore && (
        <div className="mt-20 z-30 flex flex-col items-center">
          {timeLeft === 0 && <span className="text-2xl text-red-400 font-bold mb-4 bg-black/50 px-6 py-2 rounded-full">¡Se acabó el tiempo!</span>}
          <button onClick={startGame} className="px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-black text-2xl shadow-[0_0_30px_rgba(251,191,36,0.6)] hover:scale-105 transition-transform flex items-center gap-3">
            <Play /> Iniciar Captura
          </button>
        </div>
      )}

      {showNext && (
        <div className="mt-20 z-30 flex flex-col items-center">
          <span className="text-3xl text-amber-400 font-bold mb-6 bg-black/50 px-8 py-4 rounded-full glow-gold">¡Prueba Superada!</span>
          <button onClick={() => { setShowNext(false); setOwlAction('idle'); setStage('end'); }} className="px-10 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-black text-2xl shadow-[0_0_30px_rgba(251,191,36,0.6)] hover:scale-105 transition-transform flex items-center gap-3 animate-pulse">
            Ver Resultados <ArrowRight />
          </button>
        </div>
      )}

      {isPlaying && (
        <div className="relative w-full max-w-4xl flex-grow z-10 overflow-hidden glass-panel rounded-3xl border-2 border-emerald-500 mt-4 shadow-inner min-h-[400px]">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              className={`absolute w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transition-all duration-200 ${item.clicked ? 'scale-0 opacity-0' : 'animate-soft-spawn hover:scale-110 active:scale-90'}`}
            >
              {item.isBad ? (
                // SVG HONGO MEJORADO
                <svg width="100%" height="100%" viewBox="0 0 100 100" className="drop-shadow-lg">
                  {/* Tallo del hongo */}
                  <path d="M 35,55 L 35,85 C 35,95 65,95 65,85 L 65,55 Z" fill="#e9d5ff" />
                  {/* Sombrero del hongo */}
                  <path d="M 10,55 C 10,10 90,10 90,55 Z" fill="#9333ea" />
                  {/* Manchas moradas claras */}
                  <circle cx="30" cy="35" r="8" fill="#d8b4fe" />
                  <circle cx="70" cy="35" r="8" fill="#d8b4fe" />
                  <circle cx="50" cy="20" r="10" fill="#d8b4fe" />
                </svg>
              ) : (
                // SVG MONEDA
                <svg width="100%" height="100%" viewBox="0 0 100 100" className="drop-shadow-lg">
                  <circle cx="50" cy="50" r="40" fill="#fbbf24" stroke="#d97706" strokeWidth="6" />
                  <circle cx="50" cy="50" r="25" fill="none" stroke="#fcd34d" strokeWidth="3" strokeDasharray="6 6" />
                  <path d="M 45,35 L 55,35 L 55,65 L 45,65 Z" fill="#fef3c7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}