import React from 'react';

export default function ProfeBuho3D({ action }) {
  // Este es el Búho mágico de emergencia para que todas tus pantallas funcionen
  return (
    <div className="w-full h-full flex items-center justify-center animate-float relative">
      <div className="text-8xl md:text-9xl drop-shadow-2xl filter contrast-125">
        🦉
      </div>
      {/* Si la acción es 'cheer' (celebrar), le salen brillitos */}
      {action === 'cheer' && (
        <div className="absolute top-0 right-0 text-4xl animate-bounce">✨</div>
      )}
    </div>
  );
}