import { getCurrentSession, exportSessionData, saveSession } from './sessionManager';
import { createWeeklyReflectionForUser } from './weeklyReflectionGenerator';
import { loadMoodEntries } from '../components/MoodCheckIn';

export interface ResetOptions {
  clearMoodEntries?: boolean;
  clearWins?: boolean;
  clearWeeklyReflections?: boolean;
  clearChallenges?: boolean;
  clearMentorThreads?: boolean;
  clearAchievements?: boolean;
  clearAll?: boolean;
  preserveProfile?: boolean;
}

export interface ResetResult {
  success: boolean;
  backupData?: string;
  error?: string;
  itemsCleared: string[];
}

// Create backup before reset
export const createResetBackup = (): string => {
  const timestamp = new Date().toISOString().split('T')[0];
  const session = getCurrentSession();
  const backupData = exportSessionData();

  try {
    const backupKey = `atlas_backup_${session.id}_${timestamp}`;
    localStorage.setItem(backupKey, backupData);
    return backupKey;
  } catch (error) {
    console.error('Failed to create backup:', error);
    return '';
  }
};

// Weekly reset - simulates a fresh week for testing
export const performWeeklyReset = (options: ResetOptions = {}): ResetResult => {
  const itemsCleared: string[] = [];

  try {
    // Create backup first
    const backupData = exportSessionData();
    createResetBackup();

    // Default weekly reset clears wins and reflections but keeps profile and mood entries
    const resetOptions = {
      clearWins: true,
      clearWeeklyReflections: true,
      clearChallenges: true,
      preserveProfile: true,
      ...options
    };

    if (resetOptions.clearAll) {
      // Clear everything except session
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('atlas_') && key !== 'atlas_user_session') {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      itemsCleared.push('All user data');

      // Reset session but keep user type
      const session = getCurrentSession();
      if (!resetOptions.preserveProfile) {
        session.profile = null;
      }
      session.lastActive = new Date().toISOString();
      saveSession(session);

    } else {
      // Selective reset
      if (resetOptions.clearMoodEntries) {
        localStorage.removeItem('atlas_mood_entries');
        itemsCleared.push('Mood entries');
      }

      if (resetOptions.clearWins) {
        localStorage.removeItem('atlas_user_wins');
        itemsCleared.push('User wins');
      }

      if (resetOptions.clearWeeklyReflections) {
        localStorage.removeItem('atlas_weekly_reflections');
        itemsCleared.push('Weekly reflections');
      }

      if (resetOptions.clearChallenges) {
        localStorage.removeItem('atlas_completed_challenges');
        itemsCleared.push('Challenge completions');
      }

      if (resetOptions.clearMentorThreads) {
        localStorage.removeItem('atlas_saved_threads');
        itemsCleared.push('Mentor conversation threads');
      }

      if (resetOptions.clearAchievements) {
        localStorage.removeItem('achievements');
        itemsCleared.push('Achievements');
      }
    }

    return {
      success: true,
      backupData,
      itemsCleared
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      itemsCleared: []
    };
  }
};

// Generate sample data for testing
export const generateSampleData = (): ResetResult => {
  try {
    const backupData = exportSessionData();
    createResetBackup();

    // Generate sample mood entries for the past week
    const moodEntries = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const moods = ['charged', 'steady', 'strained'];
      const mood = moods[Math.floor(Math.random() * moods.length)];

      moodEntries.push({
        value: mood,
        note: i === 0 ? 'Sample mood entry for testing' : undefined,
        timestamp: date.toISOString()
      });
    }

    localStorage.setItem('atlas_mood_entries', JSON.stringify(moodEntries));

    // Generate sample wins
    const sampleWins = [
      {
        id: 'win_1',
        title: 'Completed morning workout',
        description: 'Did a full 45-minute strength training session',
        arena: 'body',
        impact: 'medium',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'win_2',
        title: 'Had difficult conversation',
        description: 'Talked through conflict with roommate',
        arena: 'heart',
        impact: 'large',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'win_3',
        title: 'Finished reading chapter',
        description: 'Read chapter 3 of Atomic Habits',
        arena: 'mind',
        impact: 'small',
        timestamp: new Date().toISOString()
      }
    ];

    localStorage.setItem('atlas_user_wins', JSON.stringify(sampleWins));

    return {
      success: true,
      backupData,
      itemsCleared: ['Generated sample mood entries', 'Generated sample wins']
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate sample data',
      itemsCleared: []
    };
  }
};

// Force generate new weekly reflection
export const generateNewReflection = async (): Promise<ResetResult> => {
  try {
    const moodEntries = loadMoodEntries();
    const reflection = await createWeeklyReflectionForUser(moodEntries, [], []);

    if (reflection) {
      return {
        success: true,
        itemsCleared: ['Generated new weekly reflection']
      };
    } else {
      return {
        success: false,
        error: 'Failed to generate reflection',
        itemsCleared: []
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate reflection',
      itemsCleared: []
    };
  }
};

// Get all backup keys
export const getBackupKeys = (): string[] => {
  const backups: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('atlas_backup_')) {
      backups.push(key);
    }
  }
  return backups.sort().reverse(); // Most recent first
};

// Restore from backup
export const restoreFromBackup = (backupKey: string): boolean => {
  try {
    const backupData = localStorage.getItem(backupKey);
    if (!backupData) {
      throw new Error('Backup not found');
    }

    const data = JSON.parse(backupData);

    // Clear current data
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('atlas_') && !key.startsWith('atlas_backup_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));

    // Restore data
    Object.keys(data).forEach(key => {
      if (key !== 'exportedAt' && data[key]) {
        const storageKey = key === 'session' ? 'atlas_user_session' :
                           key === 'moodEntries' ? 'atlas_mood_entries' :
                           key === 'wins' ? 'atlas_user_wins' :
                           key === 'weeklyReflections' ? 'atlas_weekly_reflections' :
                           key === 'challenges' ? 'atlas_completed_challenges' :
                           key === 'savedThreads' ? 'atlas_saved_threads' :
                           key === 'globalProgress' ? 'globalReadingProgress' :
                           key;

        if (typeof data[key] === 'string') {
          localStorage.setItem(storageKey, data[key]);
        } else {
          localStorage.setItem(storageKey, JSON.stringify(data[key]));
        }
      }
    });

    return true;
  } catch (error) {
    console.error('Failed to restore backup:', error);
    return false;
  }
};