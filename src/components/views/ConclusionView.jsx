import React from 'react';
import ProfeBuho3D from '../3d/ProfeBuho3D'; // <--- ¡Esta es la ruta corregida!

export default function ConclusionView({ setStage }) {
  return (
    <div className="flex flex-col items-center text-center space-y-6 md:space-y-8 animate-fade-in py-8 md:py-12 glass-panel p-6 md:p-12 rounded-3xl max-w-3xl border-2 border-amber-500/50 relative overflow-hidden mx-4 md:mx-0">
      
      <div className="absolute inset-0 bg-amber-500 mix-blend-overlay opacity-10 animate-pulse"></div>
      
      {/* Contenedor del Búho */}
      <div className="w-48 h-48 md:w-64 md:h-64">
        <ProfeBuho3D action="cheer" />
      </div>

      <div className="space-y-4 relative z-10">
        <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 uppercase tracking-widest drop-shadow-lg">
          ¡Maestro de San Patricio!
        </h2>
        <p className="text-lg md:text-2xl text-emerald-100 leading-relaxed font-medium">
          ¡Felicidades! Has superado las 5 legendarias pruebas del Bosque Esmeralda. Eres digno de poseer la sabiduría y la suerte infinita.
        </p>

        <div className="mt-8 p-6 bg-amber-500/20 border-2 border-amber-400 rounded-2xl animate-pulse shadow-[0_0_20px_rgba(251,191,36,0.4)]">
          <p className="text-2xl md:text-4xl font-black text-amber-300 drop-shadow-lg">
            ¡Pasa a la oficina de la directora para recibir tu recompensa!
          </p>
        </div>
      </div>

      <button
        onClick={() => setStage('cover')}
        className="mt-6 md:mt-8 px-8 md:px-10 py-3 md:py-4 bg-transparent border-4 border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-amber-950 transition-colors rounded-2xl text-lg md:text-xl font-black uppercase tracking-widest relative z-10 glow-gold"
      >
        Volver a la Biblioteca
      </button>

    </div>
  );
}