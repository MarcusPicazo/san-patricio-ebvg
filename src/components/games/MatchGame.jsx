import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

// --- ICONOS ORIGINALES ---
const SvgClover = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md"><circle cx="50" cy="30" r="18" fill="#10b981" /><circle cx="30" cy="55" r="18" fill="#10b981" /><circle cx="70" cy="55" r="18" fill="#10b981" /><path d="M 50 50 Q 55 80 40 90 L 50 90 Q 60 80 50 50 Z" fill="#059669" /></svg>
);
const SvgCoin = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md"><circle cx="50" cy="50" r="35" fill="#fbbf24" stroke="#d97706" strokeWidth="5"/><circle cx="50" cy="50" r="25" fill="none" stroke="#fcd34d" strokeWidth="3" strokeDasharray="5 5"/><path d="M 45 35 L 55 35 L 55 65 L 45 65 Z" fill="#fef3c7" /></svg>
);
const SvgHat = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md"><path d="M 20 80 L 80 80 L 80 90 L 20 90 Z" fill="#064e3b" /><path d="M 30 40 L 70 40 L 75 80 L 25 80 Z" fill="#047857" /><rect x="26" y="70" width="48" height="10" fill="#111827" /><rect x="42" y="68" width="16" height="14" fill="none" stroke="#fbbf24" strokeWidth="3" /></svg>
);
const SvgPot = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md"><path d="M 20 50 C 0 90, 100 90, 80 50 Z" fill="#1f2937" /><ellipse cx="50" cy="50" rx="35" ry="12" fill="#111827" /><ellipse cx="50" cy="48" rx="28" ry="8" fill="#fbbf24" /><circle cx="35" cy="45" r="5" fill="#fcd34d" /><circle cx="50" cy="42" r="6" fill="#fcd34d" /><circle cx="65" cy="46" r="4" fill="#fcd34d" /><path d="M 15 50 L 85 50" stroke="#374151" strokeWidth="4" /></svg>
);
// ------------------------

export default function MatchGame({ setStage, setOwlAction }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [showNext, setShowNext] = useState(false);

  // Usamos los componentes SVG y un par de emojis para completar los 6 pares
  const cardTypes = [
    { type: 'clover', content: <SvgClover /> },
    { type: 'coin', content: <SvgCoin /> },
    { type: 'hat', content: <SvgHat /> },
    { type: 'pot', content: <SvgPot /> },
    { type: 'rainbow', content: <span className="text-4xl">🌈</span> },
    { type: 'beer', content: <span className="text-4xl">🍻</span> }
  ];

  useEffect(() => {
    const shuffledCards = [...cardTypes, ...cardTypes]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ id: index, ...card }));
    setCards(shuffledCards);
  }, []);

  const handleFlip = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].type === cards[second].type) {
        setMatched([...matched, first, second]);
        setFlipped([]);
        if (matched.length + 2 === cards.length) {
          if(setOwlAction) setOwlAction('cheer');
          setShowNext(true);
        }
      } else {
        if(setOwlAction) setOwlAction('wrong');
        setTimeout(() => {
          setFlipped([]);
          if(setOwlAction) setOwlAction('idle');
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl md:text-3xl font-black text-amber-400 mb-6 drop-shadow-md">Prueba IV: Memorama</h2>
      <p className="text-emerald-100 mb-6 text-center font-medium">Encuentra los pares mágicos.</p>
      
      <div className="grid grid-cols-4 gap-3 md:gap-4 mb-8">
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index);
          return (
            <button
              key={card.id}
              onClick={() => handleFlip(index)}
              className={`w-16 h-20 md:w-24 md:h-28 flex items-center justify-center rounded-xl md:rounded-2xl border-2 transition-all duration-300 shadow-md ${isFlipped ? 'bg-emerald-100 border-amber-400 rotate-0 p-2' : 'bg-emerald-800 border-emerald-600 hover:bg-emerald-700 text-3xl'}`}
            >
              {isFlipped ? card.content : '❓'}
            </button>
          );
        })}
      </div>

      {showNext && (
        <button onClick={() => setStage('catch')} className="px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-amber-950 rounded-full font-black flex items-center gap-2 shadow-lg hover:scale-105 transition-transform animate-pulse">
          Siguiente Prueba <ArrowRight size={20} />
        </button>
      )}
    </div>
  );
}