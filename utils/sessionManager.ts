import { OnboardingProfile } from '../types';

export interface UserSession {
  id: string;
  type: 'guest' | 'registered';
  profile: OnboardingProfile | null;
  createdAt: string;
  lastActive: string;
  dataVersion: string;
}

const SESSION_KEY = 'atlas_user_session';
const CURRENT_DATA_VERSION = '1.0.0';

// Generate a simple guest ID
export const generateGuestId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `guest_${timestamp}_${random}`;
};

// Create a new guest session
export const createGuestSession = (): UserSession => {
  const session: UserSession = {
    id: generateGuestId(),
    type: 'guest',
    profile: null,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    dataVersion: CURRENT_DATA_VERSION
  };

  saveSession(session);
  return session;
};

// Update session with onboarding profile
export const updateSessionProfile = (profile: OnboardingProfile): void => {
  const session = getCurrentSession();
  if (session) {
    session.profile = profile;
    session.lastActive = new Date().toISOString();
    saveSession(session);
  }
};

// Get current session or create guest session
export const getCurrentSession = (): UserSession => {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      const session: UserSession = JSON.parse(stored);

      // Update last active
      session.lastActive = new Date().toISOString();
      saveSession(session);

      return session;
    }
  } catch (error) {
    console.error('Failed to load session:', error);
  }

  // Create new guest session if none exists
  return createGuestSession();
};

// Save session to localStorage
export const saveSession = (session: UserSession): void => {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Failed to save session:', error);
  }
};

// Check if user needs onboarding
export const needsOnboarding = (): boolean => {
  const session = getCurrentSession();
  return !session.profile;
};

// Get session display name
export const getSessionDisplayName = (): string => {
  const session = getCurrentSession();
  if (session.profile?.name) {
    return session.profile.name;
  }

  if (session.type === 'guest') {
    return 'Guest User';
  }

  return 'Brother';
};

// Check if session is guest
export const isGuestSession = (): boolean => {
  const session = getCurrentSession();
  return session.type === 'guest';
};

// Export session data for backup/transfer
export const exportSessionData = (): string => {
  const session = getCurrentSession();
  const allData = {
    session,
    moodEntries: localStorage.getItem('atlas_mood_entries'),
    wins: localStorage.getItem('atlas_user_wins'),
    weeklyReflections: localStorage.getItem('atlas_weekly_reflections'),
    challenges: localStorage.getItem('atlas_completed_challenges'),
    achievements: localStorage.getItem('achievements'),
    savedThreads: localStorage.getItem('atlas_saved_threads'),
    globalProgress: localStorage.getItem('globalReadingProgress'),
    exportedAt: new Date().toISOString()
  };

  return JSON.stringify(allData, null, 2);
};

// Import session data from backup
export const importSessionData = (dataJson: string): boolean => {
  try {
    const data = JSON.parse(dataJson);

    // Validate data structure
    if (!data.session || !data.exportedAt) {
      throw new Error('Invalid backup format');
    }

    // Import session
    if (data.session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(data.session));
    }

    // Import other data
    const dataKeys = [
      'moodEntries',
      'wins',
      'weeklyReflections',
      'challenges',
      'achievements',
      'savedThreads',
      'globalProgress'
    ];

    dataKeys.forEach(key => {
      if (data[key]) {
        const storageKey = key === 'moodEntries' ? 'atlas_mood_entries' :
                           key === 'wins' ? 'atlas_user_wins' :
                           key === 'weeklyReflections' ? 'atlas_weekly_reflections' :
                           key === 'challenges' ? 'atlas_completed_challenges' :
                           key === 'savedThreads' ? 'atlas_saved_threads' :
                           key === 'globalProgress' ? 'globalReadingProgress' :
                           key;

        localStorage.setItem(storageKey, data[key]);
      }
    });

    return true;
  } catch (error) {
    console.error('Failed to import session data:', error);
    return false;
  }
};

// Get session stats for display
export const getSessionStats = () => {
  const session = getCurrentSession();
  const createdDate = new Date(session.createdAt);
  const daysSinceCreated = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

  return {
    sessionId: session.id,
    type: session.type,
    daysSinceCreated,
    hasProfile: !!session.profile,
    dataVersion: session.dataVersion
  };
};