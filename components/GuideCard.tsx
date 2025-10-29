import React from 'react';
import type { Article } from '../types';
import { LIFE_ARENAS } from '../constants';

interface GuideCardProps {
  article: Article;
  onClick: () => void;
}

const GuideCard: React.FC<GuideCardProps> = ({ article, onClick }) => {
  const arena = LIFE_ARENAS.find(a => a.id === article.arena);

  return (
    <div 
      onClick={onClick}
      className="bg-secondary rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer group"
    >
      <div className="relative overflow-hidden">
        <img className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" src={article.imageUrl} alt={article.title} />
        {arena && (
           // FIX: Ensured className is a valid template literal string.
           <div className={`absolute top-4 left-4 h-10 w-10 rounded-full flex items-center justify-center bg-secondary/80 backdrop-blur-sm border border-gray-600/50`}>
              <arena.icon className={`h-6 w-6 ${arena.color}`} />
           </div>
        )}
      </div>
      <div className="p-6">
        {/* FIX: Ensured className is a valid template literal string. */}
        <p className={`text-sm ${arena?.color || 'text-accent'} font-semibold mb-1`}>{article.category.toUpperCase()}</p>
        <h3 className="text-xl font-bold mb-2 text-text-primary">{article.title}</h3>
        <p className="text-text-secondary">{article.summary}</p>
      </div>
    </div>
  );
};

export default GuideCard;
