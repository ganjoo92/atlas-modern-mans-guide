import React, { useMemo, useState } from 'react';
import { LIFE_ARENAS } from '../constants';
import type { ArenaType, OnboardingProfile } from '../types';

interface OnboardingModalProps {
  onComplete: (profile: OnboardingProfile) => void;
}

const GOAL_OPTIONS: { id: OnboardingProfile['primaryGoal']; label: string; description: string }[] = [
  {
    id: 'dating',
    label: 'Strengthen dating & relationships',
    description: 'Become magnetic, intentional, and confident in connection.',
  },
  {
    id: 'career',
    label: 'Advance career & leadership',
    description: 'Build momentum in work, finances, and influence.',
  },
  {
    id: 'discipline',
    label: 'Dial in discipline & habits',
    description: 'Lock in the routines that keep you sharp daily.',
  },
  {
    id: 'confidence',
    label: 'Own your confidence',
    description: 'Reset your mindset and build unshakable self-belief.',
  },
];

const CADENCE_OPTIONS: { id: OnboardingProfile['challengeCadence']; label: string; description: string }[] = [
  { id: 'daily', label: 'Daily reps', description: 'At least one challenge every day.' },
  { id: 'weekly', label: 'Weekly sprints', description: '3-4 focused reps spread across the week.' },
  { id: 'custom', label: 'Custom cadence', description: 'I will choose based on my schedule.' },
];

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState<OnboardingProfile['primaryGoal']>('discipline');
  const [focusArena, setFocusArena] = useState<ArenaType>('mind');
  const [challengeCadence, setChallengeCadence] = useState<OnboardingProfile['challengeCadence']>('daily');
  const [obstacle, setObstacle] = useState('');

  const canSubmit = useMemo(() => name.trim().length > 0, [name]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    const profile: OnboardingProfile = {
      name: name.trim(),
      primaryGoal,
      focusArena,
      challengeCadence,
      obstacle: obstacle.trim(),
      createdAt: new Date().toISOString(),
    };
    onComplete(profile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-secondary/90 border border-gray-700/70 rounded-3xl p-8 md:p-10 space-y-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Atlas onboarding</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary">
            Welcome to Atlas. Let&apos;s forge your edge.
          </h1>
          <p className="text-sm text-text-secondary">
            This takes less than a minute. Your answers personalise the mentor, challenges, and tools you see.
          </p>
        </header>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2" htmlFor="onboarding-name">
              First name or call sign
            </label>
            <input
              id="onboarding-name"
              type="text"
              value={name}
              onChange={event => setName(event.target.value)}
              placeholder="How should the mentor address you?"
              className="w-full bg-primary text-text-primary border border-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-text-primary">What&apos;s the primary outcome you want right now?</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {GOAL_OPTIONS.map(option => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setPrimaryGoal(option.id)}
                  className={`text-left p-4 rounded-2xl border transition-all ${
                    primaryGoal === option.id
                      ? 'border-accent/60 bg-accent/10 text-text-primary shadow-card'
                      : 'border-gray-700/60 bg-primary/30 text-text-secondary hover:border-accent/40 hover:text-text-primary'
                  }`}
                >
                  <p className="text-sm font-semibold text-text-primary">{option.label}</p>
                  <p className="text-xs text-text-secondary mt-1">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

  <div className="space-y-3">
            <p className="text-sm font-semibold text-text-primary">Which arena needs the most attention this week?</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {LIFE_ARENAS.map(arena => (
                <button
                  key={arena.id}
                  type="button"
                  onClick={() => setFocusArena(arena.id)}
                  className={`text-left p-4 rounded-2xl border transition-all ${
                    focusArena === arena.id
                      ? 'border-accent/60 bg-accent/10 text-text-primary shadow-card'
                      : 'border-gray-700/60 bg-primary/30 text-text-secondary hover:border-accent/40 hover:text-text-primary'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <arena.icon className={`w-5 h-5 ${arena.color}`} />
                    <p className="text-sm font-semibold text-text-primary">{arena.title}</p>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">{arena.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-text-primary">How often do you want Atlas to push you?</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {CADENCE_OPTIONS.map(option => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setChallengeCadence(option.id)}
                  className={`text-left p-4 rounded-2xl border transition-all ${
                    challengeCadence === option.id
                      ? 'border-accent/60 bg-accent/10 text-text-primary shadow-card'
                      : 'border-gray-700/60 bg-primary/30 text-text-secondary hover:border-accent/40 hover:text-text-primary'
                  }`}
                >
                  <p className="text-sm font-semibold text-text-primary">{option.label}</p>
                  <p className="text-xs text-text-secondary mt-1">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2" htmlFor="onboarding-obstacle">
              Biggest obstacle right now (optional)
            </label>
            <textarea
              id="onboarding-obstacle"
              value={obstacle}
              onChange={event => setObstacle(event.target.value)}
              placeholder="e.g. No accountability, unsure where to start, time is stretched..."
              className="w-full bg-primary text-text-primary border border-gray-600 rounded-xl px-4 py-3 h-24 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
            <p className="text-xs text-text-secondary">
              Atlas uses these answers to personalise your dashboards, challenges, and mentor prompts. You can update them anytime from My Code.
            </p>
            <button
              type="submit"
              disabled={!canSubmit}
              className="bg-accent text-primary font-semibold px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              Forge my plan →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnboardingModal;
