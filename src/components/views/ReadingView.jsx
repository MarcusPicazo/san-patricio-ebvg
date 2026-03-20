import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import ProfeBuho3D from '../3d/ProfeBuho3D'; 
import { chapters } from '../../data/gameData'; 

export default function ReadingView({ setStage }) {
  const [idx, setIdx] = useState(0);
  const chapter = chapters[idx];

  return (
    <div className="w-full max-w-5xl flex flex-col items-center animate-fade-in">
      {/* Indicadores de Progreso */}
      <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8 flex-wrap justify-center">
        {chapters.map((_, i) => (
          <div 
            key={i} 
            className={`h-2 rounded-full transition-all duration-500 ${
              i === idx ? 'w-10 md:w-16 bg-amber-400 glow-gold' : 'w-4 md:w-8 bg-emerald-800'
            }`} 
          />
        ))}
      </div>

      <div className="glass-panel w-full rounded-3xl p-6 md:p-12 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-6 md:gap-12">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20"></div>
        
        {/* Contenedor del Búho */}
        <div className="w-40 h-40 md:w-64 md:h-64 flex justify-center flex-shrink-0">
          <ProfeBuho3D action={idx === chapters.length - 1 ? 'cheer' : 'idle'} />
        </div>

        {/* Contenido del Capítulo */}
        <div className="space-y-4 md:space-y-6 relative z-10 text-center md:text-left w-full">
          <div className="text-5xl md:text-6xl animate-bounce">{chapter.icon}</div>
          <h3 className="text-2xl md:text-4xl font-black text-amber-300">{chapter.title}</h3>
          <p className="text-lg md:text-xl leading-relaxed text-emerald-100 font-medium">"{chapter.content}"</p>
          
          {/* Botones de Navegación */}
          <div className="pt-6 flex flex-col sm:flex-row justify-center md:justify-end gap-3 md:gap-4">
            {idx > 0 && (
              <button 
                onClick={() => setIdx(i => i - 1)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-emerald-600 text-emerald-400 hover:bg-emerald-900/50 transition-colors font-bold"
              >
                Anterior
              </button>
            )}
            <button
              onClick={() => idx < chapters.length - 1 ? setIdx(i => i + 1) : setStage('cauldron')}
              className={`
                w-full sm:w-auto px-6 md:px-8 py-3 bg-amber-500 hover:bg-amber-400 
                text-amber-950 rounded-xl font-black shadow-lg flex justify-center 
                items-center gap-2 transition-transform hover:scale-105
              `}
            >
              {idx < chapters.length - 1 ? 'Siguiente' : 'Ir a las 5 Pruebas'} <ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}