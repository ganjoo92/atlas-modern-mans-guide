import React, { useState } from 'react';
import { saveWin, WinEntry } from '../utils/weeklyPatternAnalysis';
import { ArenaType } from '../types';
import { LIFE_ARENAS } from '../constants';
import { PlusIcon, TrophyIcon, CheckIcon } from './Icons';
import { analytics } from '../utils/analytics';

interface WinTrackerProps {
  onWinLogged?: (win: WinEntry) => void;
  className?: string;
}

const IMPACT_OPTIONS = [
  { id: 'small' as const, label: 'Small Win', description: 'Daily progress, habit building' },
  { id: 'medium' as const, label: 'Solid Win', description: 'Notable achievement, milestone hit' },
  { id: 'large' as const, label: 'Major Win', description: 'Breakthrough moment, significant progress' }
];

const WinTracker: React.FC<WinTrackerProps> = ({ onWinLogged, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedArena, setSelectedArena] = useState<ArenaType>('mind');
  const [selectedImpact, setSelectedImpact] = useState<'small' | 'medium' | 'large'>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justLogged, setJustLogged] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const win = saveWin({
        title: title.trim(),
        description: description.trim(),
        arena: selectedArena,
        impact: selectedImpact
      });

      analytics.winLogged(selectedArena, selectedImpact, !!description.trim());
      onWinLogged?.(win);

      // Reset form
      setTitle('');
      setDescription('');
      setSelectedArena('mind');
      setSelectedImpact('medium');
      setIsOpen(false);

      // Show success state
      setJustLogged(true);
      setTimeout(() => setJustLogged(false), 3000);

    } catch (error) {
      console.error('Failed to log win:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setTitle('');
    setDescription('');
    setSelectedArena('mind');
    setSelectedImpact('medium');
  };

  if (justLogged) {
    return (
      <div className={`bg-green-500/10 border border-green-500/30 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <CheckIcon className="w-5 h-5 text-green-400" />
          <div>
            <p className="text-sm font-semibold text-green-400">Win logged!</p>
            <p className="text-xs text-text-secondary">Building your momentum story.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`bg-accent/10 border border-accent/30 rounded-lg p-4 hover:bg-accent/20 hover:border-accent/50 transition-colors w-full text-left ${className}`}
      >
        <div className="flex items-center gap-3">
          <TrophyIcon className="w-5 h-5 text-accent" />
          <div>
            <p className="text-sm font-semibold text-accent">Log a win</p>
            <p className="text-xs text-text-secondary">Track your progress and build momentum</p>
          </div>
          <PlusIcon className="w-4 h-4 text-accent ml-auto" />
        </div>
      </button>
    );
  }

  return (
    <div className={`bg-secondary border border-gray-700 rounded-lg p-4 space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrophyIcon className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold text-text-primary">Log Your Win</h3>
        </div>
        <button
          onClick={handleCancel}
          className="text-xs text-text-secondary hover:text-text-primary"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wide text-text-secondary mb-2">
            What did you accomplish?
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Completed morning workout, Had difficult conversation"
            className="w-full bg-primary text-text-primary border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide text-text-secondary mb-2">
            Details (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add context about what made this meaningful..."
            className="w-full bg-primary text-text-primary border border-gray-600 rounded-lg px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide text-text-secondary mb-2">
            Life Arena
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {LIFE_ARENAS.map((arena) => (
              <button
                key={arena.id}
                type="button"
                onClick={() => setSelectedArena(arena.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedArena === arena.id
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-gray-600 bg-primary/50 text-text-secondary hover:border-accent/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <arena.icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{arena.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide text-text-secondary mb-2">
            Impact Level
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {IMPACT_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedImpact(option.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedImpact === option.id
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-gray-600 bg-primary/50 text-text-secondary hover:border-accent/50'
                }`}
              >
                <p className="text-sm font-medium">{option.label}</p>
                <p className="text-xs opacity-80">{option.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={!title.trim() || isSubmitting}
            className="flex-1 bg-accent text-primary px-4 py-2 rounded-lg font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Log Win'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-600 text-text-secondary rounded-lg hover:border-accent/50 hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default WinTracker;