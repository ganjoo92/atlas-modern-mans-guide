import React, { useEffect, useMemo, useState } from 'react';
import { SparklesIcon, Target, HeartIcon } from './Icons';

export type MoodLevel = 'charged' | 'steady' | 'strained';

export interface MoodEntry {
  value: MoodLevel;
  note?: string;
  timestamp: string;
}

interface MoodCheckInProps {
  onLog: (entry: MoodEntry) => void;
  recentEntries: MoodEntry[];
}

const MOOD_OPTIONS: { id: MoodLevel; label: string; description: string }[] = [
  { id: 'charged', label: 'Charged', description: 'Locked in, focused, ready to lead.' },
  { id: 'steady', label: 'Steady', description: 'Balanced but aware you need to maintain.' },
  { id: 'strained', label: 'Strained', description: 'Stress, fatigue, or frustration are loud.' },
];

const storageKey = 'atlas_mood_entries';

export const loadMoodEntries = (): MoodEntry[] => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as MoodEntry[];
    return parsed.map(entry => ({
      ...entry,
      timestamp: entry.timestamp,
    }));
  } catch (error) {
    console.error('Failed to load mood entries', error);
    return [];
  }
};

export const persistMoodEntries = (entries: MoodEntry[]) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(entries));
  } catch (error) {
    console.error('Failed to save mood entries', error);
  }
};

const MoodCheckIn: React.FC<MoodCheckInProps> = ({ onLog, recentEntries }) => {
  const [selected, setSelected] = useState<MoodLevel | null>(null);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!selected) return;
    const timer = window.setTimeout(() => {
      setNote('');
    }, 1000 * 60 * 2);
    return () => window.clearTimeout(timer);
  }, [selected]);

  const today = new Date().toDateString();
  const hasLoggedToday = useMemo(
    () => recentEntries.some(entry => new Date(entry.timestamp).toDateString() === today),
    [recentEntries, today]
  );

  const moodTrend = useMemo(() => {
    const lastSeven = recentEntries.slice(0, 7);
    if (!lastSeven.length) return null;
    const score = lastSeven.reduce((total, entry) => {
      switch (entry.value) {
        case 'charged':
          return total + 1;
        case 'steady':
          return total;
        case 'strained':
          return total - 1;
        default:
          return total;
      }
    }, 0);
    if (score >= 3) return { label: 'Trending up', tone: 'text-green-300', message: 'Your mindset is sharpening.' };
    if (score <= -3) return { label: 'Needs attention', tone: 'text-red-300', message: 'Let’s address the pressure early.' };
    return { label: 'Hold the line', tone: 'text-yellow-300', message: 'Stay aware and keep checking in.' };
  }, [recentEntries]);

  const handleSubmit = async () => {
    if (!selected || isSubmitting) return;
    setIsSubmitting(true);
    const entry: MoodEntry = {
      value: selected,
      note: note.trim() || undefined,
      timestamp: new Date().toISOString(),
    };
    await Promise.resolve(onLog(entry));
    setSelected(null);
    setNote('');
    setIsSubmitting(false);
  };

  return (
    <section className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-6 space-y-6">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wide text-accent">
          <SparklesIcon className="w-4 h-4" />
          Mental readiness
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-text-primary">Check in with yourself</h2>
          {moodTrend && <span className={`text-xs ${moodTrend.tone}`}>{moodTrend.label}</span>}
        </div>
        <p className="text-sm text-text-secondary">
          Take 10 seconds to log your state. Strong men track their internal load the same way they track training.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {MOOD_OPTIONS.map(option => (
          <button
            key={option.id}
            type="button"
            onClick={() => setSelected(option.id)}
            className={`text-left p-4 rounded-2xl border transition-all ${
              selected === option.id
                ? 'border-accent/60 bg-accent/10 text-text-primary shadow-card'
                : 'border-gray-700/60 bg-primary/30 text-text-secondary hover:border-accent/40 hover:text-text-primary'
            }`}
          >
            <p className="text-sm font-semibold text-text-primary">{option.label}</p>
            <p className="text-xs text-text-secondary mt-1">{option.description}</p>
          </button>
        ))}
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wide text-text-secondary mb-2" htmlFor="mood-note">
          Optional note
        </label>
        <textarea
          id="mood-note"
          value={note}
          onChange={event => setNote(event.target.value)}
          placeholder="Anything on your mind? (kept private)"
          className="w-full bg-primary text-text-primary border border-gray-600 rounded-xl px-4 py-3 h-24 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <p className="text-xs text-text-secondary">
          {hasLoggedToday
            ? 'Already logged today—great work staying aware.'
            : 'No entry today yet. Keep the streak going.'}
        </p>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!selected || isSubmitting || hasLoggedToday}
          className="bg-accent text-primary px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {hasLoggedToday ? 'Logged' : isSubmitting ? 'Saving...' : 'Log today’s mood'}
        </button>
      </div>
    </section>
  );
};

export default MoodCheckIn;
