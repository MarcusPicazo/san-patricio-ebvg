import React from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';

export default function Header({ stage, setStage }) {
  return (
    <header className="p-4 md:p-6 flex justify-between items-center relative z-20 border-b border-emerald-800/50 bg-black/20 backdrop-blur-md">
      <div className="flex items-center gap-2 md:gap-3">
        <Sparkles className="text-amber-400" />
        <h1 className="text-lg md:text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">
          SAN PATRICIO EBVG
        </h1>
      </div>
      
      {stage !== 'cover' && (
        <button 
          onClick={() => setStage('cover')}
          className="text-emerald-400 hover:text-amber-400 font-bold flex items-center gap-2 transition-colors text-sm md:text-base"
        >
          <RotateCcw size={18} /> 
          <span className="hidden md:inline">Menú Principal</span>
        </button>
      )}
    </header>
  );
}