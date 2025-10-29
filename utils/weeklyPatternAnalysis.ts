import { MoodEntry } from '../components/MoodCheckIn';
import { ArenaType } from '../types';

export interface WinEntry {
  id: string;
  title: string;
  description: string;
  arena: ArenaType;
  timestamp: string;
  impact: 'small' | 'medium' | 'large';
}

export interface WeeklyPattern {
  weekStart: string;
  weekEnd: string;
  totalWins: number;
  winsByArena: Record<ArenaType, number>;
  winsByDay: Record<string, number>;
  moodTrend: 'improving' | 'stable' | 'declining';
  focusPeakDay: string;
  challengesCompleted: number;
  mentorInteractions: number;
  insights: string[];
}

export interface WeeklyReflection {
  id: string;
  weekPattern: WeeklyPattern;
  aiSummary: string;
  suggestedActions: string[];
  generatedAt: string;
}

const WINS_STORAGE_KEY = 'atlas_user_wins';
const WEEKLY_REFLECTIONS_KEY = 'atlas_weekly_reflections';

// Win tracking functions
export const saveWin = (win: Omit<WinEntry, 'id' | 'timestamp'>): WinEntry => {
  const newWin: WinEntry = {
    ...win,
    id: `win_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString()
  };

  const existingWins = getWins();
  const updatedWins = [newWin, ...existingWins];

  try {
    localStorage.setItem(WINS_STORAGE_KEY, JSON.stringify(updatedWins));
  } catch (error) {
    console.error('Failed to save win:', error);
  }

  return newWin;
};

export const getWins = (): WinEntry[] => {
  try {
    const stored = localStorage.getItem(WINS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load wins:', error);
    return [];
  }
};

export const getWinsForDateRange = (startDate: Date, endDate: Date): WinEntry[] => {
  const wins = getWins();
  return wins.filter(win => {
    const winDate = new Date(win.timestamp);
    return winDate >= startDate && winDate <= endDate;
  });
};

// Pattern analysis functions
export const analyzeWeeklyPattern = (
  weekStart: Date,
  moodEntries: MoodEntry[],
  challengeCompletions: any[] = [],
  mentorMessages: any[] = []
): WeeklyPattern => {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const weekWins = getWinsForDateRange(weekStart, weekEnd);
  const weekMoods = moodEntries.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    return entryDate >= weekStart && entryDate <= weekEnd;
  });

  // Analyze wins by arena
  const winsByArena: Record<ArenaType, number> = {
    mind: 0,
    heart: 0,
    body: 0,
    soul: 0,
    work: 0
  };

  weekWins.forEach(win => {
    winsByArena[win.arena]++;
  });

  // Analyze wins by day of week
  const winsByDay: Record<string, number> = {
    'Monday': 0,
    'Tuesday': 0,
    'Wednesday': 0,
    'Thursday': 0,
    'Friday': 0,
    'Saturday': 0,
    'Sunday': 0
  };

  weekWins.forEach(win => {
    const dayName = new Date(win.timestamp).toLocaleDateString('en-US', { weekday: 'long' });
    winsByDay[dayName]++;
  });

  // Find focus peak day
  const focusPeakDay = Object.entries(winsByDay).reduce((peak, [day, count]) =>
    count > peak.count ? { day, count } : peak,
    { day: 'Monday', count: 0 }
  ).day;

  // Analyze mood trend
  let moodTrend: 'improving' | 'stable' | 'declining' = 'stable';
  if (weekMoods.length >= 3) {
    const moodScores = weekMoods.map(mood => {
      switch (mood.value) {
        case 'charged': return 1;
        case 'steady': return 0;
        case 'strained': return -1;
        default: return 0;
      }
    });

    const firstHalf = moodScores.slice(0, Math.ceil(moodScores.length / 2));
    const secondHalf = moodScores.slice(Math.ceil(moodScores.length / 2));

    const firstHalfAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;

    if (secondHalfAvg > firstHalfAvg + 0.3) {
      moodTrend = 'improving';
    } else if (secondHalfAvg < firstHalfAvg - 0.3) {
      moodTrend = 'declining';
    }
  }

  // Generate insights
  const insights: string[] = [];

  if (weekWins.length > 0) {
    const topArena = Object.entries(winsByArena).reduce((top, [arena, count]) =>
      count > top.count ? { arena: arena as ArenaType, count } : top,
      { arena: 'mind' as ArenaType, count: 0 }
    );

    if (topArena.count > 0) {
      insights.push(`${topArena.arena.charAt(0).toUpperCase() + topArena.arena.slice(1)} arena dominated this week with ${topArena.count} wins`);
    }
  }

  if (focusPeakDay && winsByDay[focusPeakDay] > 1) {
    insights.push(`Peak performance day: ${focusPeakDay}`);
  }

  if (moodTrend === 'improving') {
    insights.push('Mindset trajectory trending upward');
  } else if (moodTrend === 'declining') {
    insights.push('Attention needed: mood patterns showing strain');
  }

  return {
    weekStart: weekStart.toISOString(),
    weekEnd: weekEnd.toISOString(),
    totalWins: weekWins.length,
    winsByArena,
    winsByDay,
    moodTrend,
    focusPeakDay,
    challengesCompleted: challengeCompletions.length,
    mentorInteractions: mentorMessages.length,
    insights
  };
};

// Weekly reflection storage
export const saveWeeklyReflection = (reflection: WeeklyReflection): void => {
  try {
    const existing = getWeeklyReflections();
    const updated = [reflection, ...existing.filter(r => r.id !== reflection.id)];
    localStorage.setItem(WEEKLY_REFLECTIONS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save weekly reflection:', error);
  }
};

export const getWeeklyReflections = (): WeeklyReflection[] => {
  try {
    const stored = localStorage.getItem(WEEKLY_REFLECTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load weekly reflections:', error);
    return [];
  }
};

export const getMostRecentReflection = (): WeeklyReflection | null => {
  const reflections = getWeeklyReflections();
  return reflections.length > 0 ? reflections[0] : null;
};

// Helper functions
export const getCurrentWeekStart = (): Date => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Make Monday the start of week
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - daysToSubtract);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
};

export const getLastWeekStart = (): Date => {
  const currentWeekStart = getCurrentWeekStart();
  const lastWeekStart = new Date(currentWeekStart);
  lastWeekStart.setDate(currentWeekStart.getDate() - 7);
  return lastWeekStart;
};

export const shouldGenerateWeeklyReflection = (): boolean => {
  const lastReflection = getMostRecentReflection();
  if (!lastReflection) return true;

  const lastReflectionDate = new Date(lastReflection.generatedAt);
  const lastWeekStart = getLastWeekStart();

  // Generate if last reflection is older than last week's start
  return lastReflectionDate < lastWeekStart;
};