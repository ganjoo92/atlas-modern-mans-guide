import { createClient } from '@supabase/supabase-js';
import { OnboardingProfile } from '../types';
import { MoodEntry } from '../components/MoodCheckIn';
import { WinEntry, WeeklyReflection } from './weeklyPatternAnalysis';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client (only if credentials are provided)
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey && supabase);
};

// Database Schema Interfaces
export interface UserProfile {
  id: string;
  created_at: string;
  email?: string;
  name: string;
  primary_goal: string;
  focus_arena: string;
  challenge_cadence: string;
  obstacle: string;
  onboarding_completed_at: string;
}

export interface MoodEntryDB {
  id: string;
  user_id: string;
  mood_value: string;
  note?: string;
  created_at: string;
}

export interface WinEntryDB {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  arena: string;
  impact: string;
  created_at: string;
}

export interface WeeklyReflectionDB {
  id: string;
  user_id: string;
  week_start: string;
  week_end: string;
  ai_summary: string;
  total_wins: number;
  mood_trend: string;
  focus_peak_day: string;
  suggested_actions: string[];
  created_at: string;
}

// User Profile Functions
export const syncUserProfile = async (profile: OnboardingProfile): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;

  try {
    const { data: { user } } = await supabase!.auth.getUser();
    if (!user) return false;

    const { error } = await supabase!
      .from('user_profiles')
      .upsert({
        id: user.id,
        name: profile.name,
        primary_goal: profile.primaryGoal,
        focus_arena: profile.focusArena,
        challenge_cadence: profile.challengeCadence,
        obstacle: profile.obstacle,
        onboarding_completed_at: profile.createdAt,
      });

    return !error;
  } catch (error) {
    console.error('Failed to sync user profile:', error);
    return false;
  }
};

// Mood Entry Functions
export const syncMoodEntries = async (entries: MoodEntry[]): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;

  try {
    const { data: { user } } = await supabase!.auth.getUser();
    if (!user) return false;

    // Convert to database format
    const dbEntries: Omit<MoodEntryDB, 'id'>[] = entries.map(entry => ({
      user_id: user.id,
      mood_value: entry.value,
      note: entry.note,
      created_at: entry.timestamp,
    }));

    const { error } = await supabase!
      .from('mood_entries')
      .upsert(dbEntries);

    return !error;
  } catch (error) {
    console.error('Failed to sync mood entries:', error);
    return false;
  }
};

export const fetchMoodEntries = async (): Promise<MoodEntry[]> => {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data: { user } } = await supabase!.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase!
      .from('mood_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(entry => ({
      value: entry.mood_value as 'charged' | 'steady' | 'strained',
      note: entry.note,
      timestamp: entry.created_at,
    }));
  } catch (error) {
    console.error('Failed to fetch mood entries:', error);
    return [];
  }
};

// Win Entry Functions
export const syncWinEntries = async (entries: WinEntry[]): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;

  try {
    const { data: { user } } = await supabase!.auth.getUser();
    if (!user) return false;

    const dbEntries: Omit<WinEntryDB, 'id'>[] = entries.map(entry => ({
      user_id: user.id,
      title: entry.title,
      description: entry.description,
      arena: entry.arena,
      impact: entry.impact,
      created_at: entry.timestamp,
    }));

    const { error } = await supabase!
      .from('win_entries')
      .upsert(dbEntries);

    return !error;
  } catch (error) {
    console.error('Failed to sync win entries:', error);
    return false;
  }
};

// Weekly Reflection Functions
export const syncWeeklyReflections = async (reflections: WeeklyReflection[]): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;

  try {
    const { data: { user } } = await supabase!.auth.getUser();
    if (!user) return false;

    const dbReflections: Omit<WeeklyReflectionDB, 'id'>[] = reflections.map(reflection => ({
      user_id: user.id,
      week_start: reflection.weekPattern.weekStart,
      week_end: reflection.weekPattern.weekEnd,
      ai_summary: reflection.aiSummary,
      total_wins: reflection.weekPattern.totalWins,
      mood_trend: reflection.weekPattern.moodTrend,
      focus_peak_day: reflection.weekPattern.focusPeakDay,
      suggested_actions: reflection.suggestedActions,
      created_at: reflection.generatedAt,
    }));

    const { error } = await supabase!
      .from('weekly_reflections')
      .upsert(dbReflections);

    return !error;
  } catch (error) {
    console.error('Failed to sync weekly reflections:', error);
    return false;
  }
};

// Authentication Functions
export const signInAnonymously = async (): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;

  try {
    const { error } = await supabase!.auth.signInAnonymously();
    return !error;
  } catch (error) {
    console.error('Failed to sign in anonymously:', error);
    return false;
  }
};

export const getCurrentUser = async () => {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data: { user } } = await supabase!.auth.getUser();
    return user;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
};

// Sync all data to cloud
export const syncAllData = async (): Promise<{
  success: boolean;
  synced: string[];
  errors: string[];
}> => {
  const result = {
    success: true,
    synced: [] as string[],
    errors: [] as string[]
  };

  if (!isSupabaseConfigured()) {
    result.success = false;
    result.errors.push('Supabase not configured');
    return result;
  }

  try {
    // Get local data
    const profile = localStorage.getItem('atlas_onboarding_profile');
    const moodEntries = localStorage.getItem('atlas_mood_entries');
    const winEntries = localStorage.getItem('atlas_user_wins');
    const weeklyReflections = localStorage.getItem('atlas_weekly_reflections');

    // Sync profile
    if (profile) {
      const success = await syncUserProfile(JSON.parse(profile));
      if (success) {
        result.synced.push('User Profile');
      } else {
        result.errors.push('User Profile sync failed');
      }
    }

    // Sync mood entries
    if (moodEntries) {
      const success = await syncMoodEntries(JSON.parse(moodEntries));
      if (success) {
        result.synced.push('Mood Entries');
      } else {
        result.errors.push('Mood Entries sync failed');
      }
    }

    // Sync win entries
    if (winEntries) {
      const success = await syncWinEntries(JSON.parse(winEntries));
      if (success) {
        result.synced.push('Win Entries');
      } else {
        result.errors.push('Win Entries sync failed');
      }
    }

    // Sync weekly reflections
    if (weeklyReflections) {
      const success = await syncWeeklyReflections(JSON.parse(weeklyReflections));
      if (success) {
        result.synced.push('Weekly Reflections');
      } else {
        result.errors.push('Weekly Reflections sync failed');
      }
    }

    result.success = result.errors.length === 0;
    return result;

  } catch (error) {
    result.success = false;
    result.errors.push(`Sync failed: ${error}`);
    return result;
  }
};