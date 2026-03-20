import React, { useState } from 'react';

// --- IMPORTACIÓN DE COMPONENTES UI ---
// Asumo que moviste el encabezado a la carpeta ui. Si no lo has hecho, 
// puedes reemplazar esta línea con el código HTML directo del header.
import Header from './components/ui/Header'; 

// --- IMPORTACIÓN DE VISTAS ---
import CoverView from './components/views/CoverView';
import ReadingView from './components/views/ReadingView';
import ConclusionView from './components/views/ConclusionView';

// --- IMPORTACIÓN DE JUEGOS ---
import CauldronGame from './components/games/CauldronGame';
import RunesGame from './components/games/RunesGame';
import MemoryGame from './components/games/MemoryGame';
import MatchGame from './components/games/MatchGame';
import CatchGame from './components/games/CatchGame';

export default function App() {
  // Estado principal para la navegación de la aplicación
  const [stage, setStage] = useState('cover'); // cover, reading, cauldron, runes, memory, match, catch, end
  
  // Estado global para las animaciones del Búho 3D a través de los minijuegos
  const [owlAction, setOwlAction] = useState('idle');

  return (
    <div className="min-h-screen bg-[#061e14] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f3e2a] via-[#061e14] to-black text-emerald-50 font-sans overflow-hidden">
      
      {/* Textura de fondo (Polvo de estrellas) */}
      <div className="fixed inset-0 pointer-events-none opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      
      {/* Componente Header */}
      <Header stage={stage} setStage={setStage} />

      {/* Contenedor Principal */}
      <main className="max-w-6xl mx-auto p-4 md:p-8 relative z-10 flex flex-col items-center justify-center min-h-[85vh]">
        
        {/* Renderizado Condicional de Vistas */}
        {stage === 'cover' && <CoverView setStage={setStage} />}
        {stage === 'reading' && <ReadingView setStage={setStage} />}
        
        {/* Renderizado Condicional de Juegos (pasando estados del Búho) */}
        {stage === 'cauldron' && (
          <CauldronGame setStage={setStage} setOwlAction={setOwlAction} owlAction={owlAction} />
        )}
        {stage === 'runes' && (
          <RunesGame setStage={setStage} setOwlAction={setOwlAction} owlAction={owlAction} />
        )}
        {stage === 'memory' && (
          <MemoryGame setStage={setStage} setOwlAction={setOwlAction} owlAction={owlAction} />
        )}
        {stage === 'match' && (
          <MatchGame setStage={setStage} setOwlAction={setOwlAction} owlAction={owlAction} />
        )}
        {stage === 'catch' && (
          <CatchGame setStage={setStage} setOwlAction={setOwlAction} owlAction={owlAction} />
        )}
        
        {/* Vista Final */}
        {stage === 'end' && <ConclusionView setStage={setStage} />}
        
      </main>
    </div>
  );
}