import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ArrowRight, Play, Sparkles, RotateCcw } from 'lucide-react';
import ProfeBuho3D from '../3d/ProfeBuho3D';

const stones = [
  { id: 0, inactiveColor: 'text-emerald-400', activeColor: 'text-white', bg: 'bg-emerald-900', activeBg: 'bg-emerald-400', border: 'border-emerald-400', shadow: 'rgba(52,211,153,1)', freq: 329.63 },
  { id: 1, inactiveColor: 'text-amber-400', activeColor: 'text-white', bg: 'bg-amber-900', activeBg: 'bg-amber-400', border: 'border-amber-400', shadow: 'rgba(251,191,36,1)', freq: 440.00 },
  { id: 2, inactiveColor: 'text-blue-400', activeColor: 'text-white', bg: 'bg-blue-900', activeBg: 'bg-blue-400', border: 'border-blue-400', shadow: 'rgba(96,165,250,1)', freq: 554.37 },
  { id: 3, inactiveColor: 'text-purple-400', activeColor: 'text-white', bg: 'bg-purple-900', activeBg: 'bg-purple-400', border: 'border-purple-400', shadow: 'rgba(192,132,252,1)', freq: 659.25 }
];

export default function MemoryGame({ setStage, setOwlAction, owlAction }) {
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState([]);
  const [playerStep, setPlayerStep] = useState(0);
  const [isPlayingSeq, setIsPlayingSeq] = useState(false);
  const [activeStone, setActiveStone] = useState(null);
  const [message, setMessage] = useState("Preparando la magia...");
  const [showNext, setShowNext] = useState(false);
  const [playTrigger, setPlayTrigger] = useState(0);
  const audioCtxRef = useRef(null);

  const playTone = (freq) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const t = ctx.currentTime;
      
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.5, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.6);
    } catch (e) {
      console.log("Audio no soportado", e);
    }
  };

  useEffect(() => {
    const length = level + 2; 
    const newSeq = Array.from({ length }, () => Math.floor(Math.random() * 4));
    setSequence(newSeq);
    setPlayerStep(0);
  }, [level]);

  useEffect(() => {
    if (sequence.length === 0) return;
    let isCancelled = false;

    const play = async () => {
      setIsPlayingSeq(true);
      setMessage("Observa y escucha la magia...");
      setOwlAction('idle');
      setPlayerStep(0);
      
      await new Promise(r => setTimeout(r, 1000));
      
      for (let i = 0; i < sequence.length; i++) {
        if (isCancelled) return;
        const stoneId = sequence[i];
        setActiveStone(stoneId);
        playTone(stones[stoneId].freq);
        await new Promise(r => setTimeout(r, 500));
        setActiveStone(null);
        await new Promise(r => setTimeout(r, 200));
      }
      
      if (!isCancelled) {
        setIsPlayingSeq(false);
        setMessage("¡Tu turno! Repite la melodia.");
      }
    };

    play();
    return () => { isCancelled = true; };
  }, [sequence, playTrigger, setOwlAction]);

  const handleStoneClick = (stoneId) => {
    if (isPlayingSeq || sequence.length === 0 || showNext) return;

    setActiveStone(stoneId);
    playTone(stones[stoneId].freq);
    setTimeout(() => setActiveStone(null), 300);

    if (stoneId === sequence[playerStep]) {
      const nextStep = playerStep + 1;
      setPlayerStep(nextStep);

      if (nextStep === sequence.length) {
        setOwlAction('cheer');
        setMessage("¡Melodia perfecta!");
        setIsPlayingSeq(true); // Bloquear clics mientras aparece botón siguiente
        setShowNext(true);
      }
    } else {
      setOwlAction('wrong');
      setMessage("Oops, nota incorrecta. Generando nueva melodia...");
      setIsPlayingSeq(true);
      setTimeout(() => {
        const length = level + 2;
        const newSeq = Array.from({ length }, () => Math.floor(Math.random() * 4));
        setSequence(newSeq);
        setPlayerStep(0);
      }, 2000);
    }
  };

  return (
    <div className="w-full flex flex-col items-center animate-fade-in relative z-20">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 glass-panel px-6 py-4 rounded-3xl mb-8 text-center md:text-left w-full max-w-2xl">
        <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
          <ProfeBuho3D action={owlAction} />
        </div>
        <div className="flex-grow">
          <h3 className="text-xs md:text-sm font-black text-purple-400 tracking-widest uppercase mb-1">Prueba III: Piedras Sonoras</h3>
          {/* min-h-[3.5rem] asegura que si el texto ocupa dos líneas, el contenedor no salte */}
          <p className="text-lg md:text-xl font-bold text-emerald-50 min-h-[3.5rem] flex items-center justify-center md:justify-start">
            {message}
          </p>
          <div className="flex gap-1 mt-2 justify-center md:justify-start">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 w-6 rounded-full transition-colors duration-300 ${i <= level && sequence.length > 0 ? 'bg-purple-400 glow-gold' : 'bg-emerald-800'}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-full">
        <div className="grid grid-cols-2 gap-4 md:gap-8 p-12 md:p-16 glass-panel rounded-full relative overflow-hidden flex-shrink-0 shadow-2xl">
          <div className="absolute inset-0 border-4 border-emerald-900/50 rounded-full pointer-events-none"></div>
          {stones.map((stone) => {
            const isActive = activeStone === stone.id;
            return (
              <button
                key={stone.id}
                disabled={isPlayingSeq || showNext}
                onClick={() => handleStoneClick(stone.id)}
                className={`
                  w-20 h-20 md:w-28 md:h-28 rounded-full border-4 flex items-center justify-center transition-all duration-200 ease-out
                  ${isActive ? `${stone.activeBg} scale-125 z-30 border-white stone-active` : `${stone.bg} ${stone.border} opacity-80 hover:opacity-100 hover:scale-105`}
                `}
                style={{ boxShadow: isActive ? `0 0 50px 10px ${stone.shadow}` : 'none' }}
              >
                <Sparkles className={`${isActive ? stone.activeColor : stone.inactiveColor} transition-colors`} size={ isActive ? 48 : 32} />
              </button>
            )
          })}

          {showNext && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full z-20 backdrop-blur-sm">
              <button onClick={() => { setShowNext(false); setOwlAction('idle'); if(level < 3) setLevel(l => l + 1); else setStage('match'); }} className="px-6 py-3 md:px-8 md:py-4 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-full font-black text-lg md:text-xl shadow-[0_0_30px_rgba(251,191,36,0.8)] hover:scale-105 transition-transform animate-pulse flex items-center gap-3 glow-gold">
                Siguiente <ArrowRight />
              </button>
            </div>
          )}
        </div>

        {/* h-20 asegura el espacio y evita saltos de interfaz. Efectos active agregados al botón. */}
        <div className="h-20 mt-8 w-full flex justify-center items-center">
          <button 
            onClick={() => setPlayTrigger(p => p + 1)} 
            disabled={isPlayingSeq} 
            className={`
              px-6 py-3 bg-emerald-800/80 hover:bg-emerald-700 border-2 border-emerald-500 text-emerald-100 rounded-full font-bold flex items-center gap-2 
              transition-all duration-150 active:scale-90 active:bg-emerald-500 active:border-emerald-300
              shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.6)]
              ${showNext ? 'opacity-0 pointer-events-none' : 'opacity-100'}
            `}
          >
            <RotateCcw size={20} className={isPlayingSeq ? "animate-spin text-emerald-400" : ""} /> 
            {isPlayingSeq ? "Escuchando..." : "Escuchar otra vez"}
          </button>
        </div>
      </div>
    </div>
  );
}