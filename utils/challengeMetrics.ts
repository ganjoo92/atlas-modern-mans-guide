import { LIFE_ARENAS } from '../constants';
import type { ArenaType } from '../types';

export interface ChallengeCompletionLog {
  id: number;
  arena: ArenaType;
  completedAt: Date;
}

export interface BadgeMeta {
  id: string;
  label: string;
  description: string;
  unlocked: boolean;
}

const DAY_MS = 1000 * 60 * 60 * 24;

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const differenceInDays = (a: Date, b: Date) =>
  Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / DAY_MS);

export const calculateStreaks = (history: ChallengeCompletionLog[]) => {
  if (!history.length) {
    return { current: 0, longest: 0 };
  }

  const uniqueDayStrings = Array.from(
    new Set(
      history.map(entry =>
        startOfDay(entry.completedAt instanceof Date ? entry.completedAt : new Date(entry.completedAt)).toISOString()
      )
    )
  );

  const dayDates = uniqueDayStrings.map(day => new Date(day)).sort((a, b) => a.getTime() - b.getTime());

  let longest = 0;
  let running = 0;
  let previousDay: Date | null = null;

  dayDates.forEach(day => {
    if (!previousDay) {
      running = 1;
    } else {
      const diff = differenceInDays(day, previousDay);
      running = diff === 1 ? running + 1 : 1;
    }
    longest = Math.max(longest, running);
    previousDay = day;
  });

  const today = startOfDay(new Date());
  let current = 0;
  previousDay = null;

  for (let i = dayDates.length - 1; i >= 0; i -= 1) {
    const day = dayDates[i];
    const diffFromToday = differenceInDays(today, day);

    if (previousDay === null) {
      if (diffFromToday === 0) {
        current = 1;
        previousDay = day;
      } else if (diffFromToday === 1) {
        current = 0;
        break;
      } else {
        current = 0;
        break;
      }
    } else {
      const diff = differenceInDays(previousDay, day);
      if (diff === 1) {
        current += 1;
        previousDay = day;
      } else {
        break;
      }
    }
  }

  return { current, longest };
};

export const deriveBadges = (
  completedCount: number,
  currentStreak: number,
  longestStreak: number
): BadgeMeta[] => {
  const rules: BadgeMeta[] = [
    {
      id: 'first-blood',
      label: 'First Rep',
      description: 'Complete your first challenge.',
      unlocked: completedCount >= 1,
    },
    {
      id: 'momentum-5',
      label: 'Momentum Five',
      description: 'Complete five challenges total.',
      unlocked: completedCount >= 5,
    },
    {
      id: 'streak-3',
      label: 'Hot Streak',
      description: 'Maintain a three-day streak.',
      unlocked: currentStreak >= 3 || longestStreak >= 3,
    },
    {
      id: 'arena-master',
      label: 'Arena Master',
      description: 'Finish every arena at least once.',
      unlocked: completedCount >= LIFE_ARENAS.length,
    },
  ];

  return rules;
};
