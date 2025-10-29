import React from 'react';
import type { LifeArena } from '../types';

const ARENA_BORDER_CLASSES: Record<LifeArena['id'], string> = {
  mind: 'hover:border-blue-400/50',
  heart: 'hover:border-red-400/50',
  body: 'hover:border-green-400/50',
  work: 'hover:border-yellow-400/50',
  soul: 'hover:border-purple-400/50',
};

interface ArenaCardProps {
  arena: LifeArena;
  onClick: () => void;
}

const ArenaCard: React.FC<ArenaCardProps> = ({ arena, onClick }) => {
  const hoverBorderClass = ARENA_BORDER_CLASSES[arena.id] ?? 'hover:border-accent/50';

  return (
    <div
      onClick={onClick}
      className={`relative group p-6 rounded-xl overflow-hidden bg-secondary border border-gray-700/50 ${hoverBorderClass} transition-all duration-300 cursor-pointer transform hover:-translate-y-1 shadow-lg hover:shadow-2xl`}
    >
        <div className={`absolute top-0 left-0 h-full w-full bg-gradient-to-br ${arena.gradient} opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
        <div className="relative z-10 flex flex-col h-full">
            <arena.icon className={`h-10 w-10 mb-4 ${arena.color}`} />
            <h3 className="text-2xl font-bold text-text-primary">{arena.title}</h3>
            <p className="text-text-secondary mt-1 flex-1">{arena.description}</p>
        </div>
    </div>
  );
};

export default ArenaCard;
