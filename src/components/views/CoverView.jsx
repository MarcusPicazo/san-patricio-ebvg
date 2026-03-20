import React from 'react';
import { BookOpen } from 'lucide-react';
import ProfeBuho3D from '../3d/ProfeBuho3D';

export default function CoverView({ setStage }) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 animate-fade-in w-full justify-center">
      
      {/* Contenedor del Búho 3D */}
      <div className="flex-shrink-0 animate-float w-64 h-64 md:w-80 md:h-80">
        <ProfeBuho3D action="idle" />
      </div>
      
      {/* Contenedor de Textos */}
      <div className="max-w-xl text-center md:text-left space-y-4 md:space-y-6">
        <div className="inline-block px-4 py-1 rounded-full border border-amber-500/30 text-amber-400 text-sm font-bold tracking-widest mb-2 bg-amber-500/10 backdrop-blur-sm">
          Una Aventura Interactiva 3D de la Escuela Berta Von Glumer
        </div>
        
        <h2 className="text-4xl md:text-7xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-br from-emerald-200 via-emerald-400 to-amber-500">
          La Magia de <br/> San Patricio
        </h2>
        
        <p className="text-lg md:text-xl text-emerald-200/80 font-medium leading-relaxed">
          Descubre la historia completa, desde sus orígenes hasta los misterios de los duendes, y supera las 5 pruebas dinámicas.
        </p>
        
        <button
          onClick={() => setStage('reading')}
          className="mt-4 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-amber-500 hover:to-orange-500 text-white rounded-2xl font-black text-lg md:text-xl shadow-[0_0_30px_rgba(52,211,153,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] flex items-center justify-center gap-3 mx-auto md:mx-0 group w-full md:w-auto"
        >
          <BookOpen className="group-hover:rotate-12 transition-transform" />
          Comenzar Lectura
        </button>
      </div>

    </div>
  );
}