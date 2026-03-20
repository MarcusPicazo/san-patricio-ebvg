import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import ProfeBuho3D from '../3d/ProfeBuho3D';
import { potions } from '../../data/gameData';

export default function CauldronGame({ setStage, setOwlAction, owlAction }) {
  const [qIndex, setQIndex] = useState(0);
  const [animatingId, setAnimatingId] = useState(null);
  const [showNext, setShowNext] = useState(false);

  const potion = potions[qIndex];

  const handleSelect = (option, index) => {
    if (animatingId !== null || showNext) return;
    setAnimatingId(index);

    setTimeout(() => {
      if (option === potion.answer) {
        setOwlAction('cheer');
        setShowNext(true); // Muestra el botón para avanzar manualmente
        setAnimatingId(null);
      } else {
        setOwlAction('wrong');
        setTimeout(() => {
          setOwlAction('idle');
          setAnimatingId(null);
        }, 1500);
      }
    }, 1000);
  };

  const handleNext = () => {
    setShowNext(false);
    setOwlAction('idle');
    if (qIndex < potions.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      setStage('runes'); // <--- Pasa a la prueba II solo cuando terminas
    }
  };

  return (
    <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6 md:gap-8 items-center justify-center animate-fade-in">
      
      {/* Zona del Búho y Caldero 3D */}
      <div className="flex flex-col items-center relative w-full md:w-1/3 mb-4 md:mb-0">
        <div className="w-64 h-64 md:w-96 md:h-96">
          <ProfeBuho3D action={owlAction} showCauldron={true} />
        </div>
      </div>

      {/* Zona de Preguntas */}
      <div className="md:w-2/3 glass-panel p-6 md:p-8 rounded-3xl text-center w-full relative z-30 min-h-[400px] flex flex-col justify-center">
        <h3 className="text-xs md:text-sm font-black text-emerald-400 tracking-widest uppercase mb-2">
          Prueba I: El Caldero de la Sabiduría
        </h3>
        
        {/* Indicador de progreso de preguntas */}
        <div className="flex justify-center mb-6 gap-2">
          {potions.map((_, i) => (
            <div key={i} className={`h-2 w-8 rounded-full ${i <= qIndex ? 'bg-amber-400' : 'bg-emerald-800'}`} />
          ))}
        </div>

        <h2 className="text-xl md:text-3xl font-bold text-amber-100 mb-8 md:mb-12">
          "{potion.question}"
        </h2>

        {/* Botones de Opciones */}
        <div className="flex flex-col md:flex-row flex-wrap justify-center gap-4 md:gap-6 relative min-h-[100px]">
          {potion.options.map((opt, i) => {
            const isFlying = animatingId === i;
            const delayClass = i === 0 ? 'animate-float' : i === 1 ? 'animate-float-delay-1' : 'animate-float-delay-2';
            
            return (
              <button
                key={i}
                disabled={animatingId !== null || showNext}
                onClick={() => handleSelect(opt, i)}
                className={`
                  relative px-6 py-4 rounded-2xl md:rounded-full font-bold text-sm md:text-lg text-white 
                  border-2 border-emerald-400/50 bg-gradient-to-br from-emerald-800/80 to-emerald-900/80 
                  shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:scale-105 hover:shadow-[0_0_25px_rgba(251,191,36,0.6)] 
                  hover:border-amber-400 transition-all 
                  ${isFlying ? 'fly-away z-50 bg-amber-500 border-amber-300' : delayClass} 
                  ${(animatingId !== null && animatingId !== i) || showNext ? 'opacity-30 scale-90' : ''}
                `}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Mensajes de Retroalimentación y Botón Siguiente */}
        <div className="h-24 mt-6 flex flex-col items-center justify-center gap-2">
          {owlAction === 'cheer' && !showNext && (
            <span className="text-lg md:text-2xl text-amber-400 font-bold animate-pulse flex items-center gap-2">
              <CheckCircle2 /> ¡Mezcla Magistral! Has descubierto la verdad.
            </span>
          )}
          
          {owlAction === 'wrong' && (
            <span className="text-base md:text-xl text-red-400 font-bold flex items-center gap-2">
              <XCircle /> ¡Cuidado! El caldero escupe humo negro... Esa no es la respuesta.
            </span>
          )}

          {showNext && (
            <button
              onClick={handleNext}
              className="mt-2 px-8 py-3 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-full font-black flex items-center gap-2 shadow-lg hover:scale-105 transition-transform animate-pulse glow-gold text-lg md:text-xl"
            >
              Siguiente <ArrowRight size={20} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}