import React from 'react';
import type { Challenge } from '../types';
import { LIFE_ARENAS } from '../constants';
import { CheckCircleIcon } from './Icons';

interface ChallengeCardProps {
  challenge: Challenge;
  isCompleted: boolean;
  onToggleComplete: () => void;
  variant?: 'default' | 'compact';
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, isCompleted, onToggleComplete, variant = 'default' }) => {
  const arena = LIFE_ARENAS.find(a => a.id === challenge.arena);

  const containerClass =
    variant === 'compact'
      ? `relative rounded-2xl border transition-all duration-300 ${
          isCompleted
            ? 'border-accent/60 bg-accent/10'
            : 'border-gray-700/60 bg-primary/30 hover:border-accent/40 hover:bg-primary/40'
        }`
      : `bg-secondary p-5 rounded-lg flex items-center justify-between transition-all duration-300 border ${
          isCompleted ? 'border-accent/60 bg-accent/10' : 'border-gray-700/50'
        }`;

  return (
    <div className={containerClass}>
      <div
        className={
          variant === 'compact'
            ? 'flex flex-col gap-3 px-4 py-4'
            : 'flex items-center justify-between px-0 py-0'
        }
      >
        <div className={variant === 'compact' ? 'flex items-start gap-3' : 'flex items-center'}>
          {arena && (
            <div
              className={`${
                variant === 'compact' ? 'p-3 rounded-2xl bg-secondary/40 border border-gray-700/60' : 'mr-4 p-3 rounded-full bg-gray-700'
              } ${isCompleted ? 'opacity-60' : ''}`}
            >
              <arena.icon className={`h-6 w-6 ${arena.color}`} />
            </div>
          )}
          <div className={variant === 'compact' ? 'flex-1 space-y-2' : ''}>
            <div className="flex items-center gap-2">
              <h3
                className={`text-lg font-semibold ${
                  isCompleted ? 'text-text-secondary line-through' : 'text-text-primary'
                }`}
              >
                {challenge.title}
              </h3>
              <span
                className={`inline-flex items-center text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full ${
                  challenge.difficulty === 'advanced'
                    ? 'bg-red-500/20 text-red-300'
                    : challenge.difficulty === 'momentum'
                    ? 'bg-yellow-500/20 text-yellow-300'
                    : 'bg-green-500/20 text-green-300'
                }`}
              >
                {challenge.difficulty}
              </span>
              {challenge.estimatedTime && (
                <span className="text-[10px] text-text-secondary border border-gray-600 rounded-full px-2 py-0.5">
                  {challenge.estimatedTime}
                </span>
              )}
            </div>
            <p className={`text-sm ${isCompleted ? 'text-gray-500' : 'text-text-secondary'}`}>
              {challenge.description}
            </p>
          </div>
        </div>
        {variant === 'compact' ? (
          <button
            onClick={onToggleComplete}
            className="self-start mt-2 text-xs text-accent hover:text-accent-light underline"
          >
            {isCompleted ? 'Mark as not done' : 'Mark complete'}
          </button>
        ) : (
          <button
            onClick={onToggleComplete}
            className="flex-shrink-0"
            aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {isCompleted ? (
              <CheckCircleIcon className="h-8 w-8 text-accent" />
            ) : (
              <div className="h-8 w-8 rounded-full border-2 border-gray-600 group-hover:border-accent transition-colors"></div>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default ChallengeCard;
