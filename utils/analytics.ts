import { getCurrentSession } from './sessionManager';

export interface AnalyticsEvent {
  id: string;
  event: string;
  properties: Record<string, any>;
  sessionId: string;
  timestamp: string;
  userType: 'guest' | 'registered';
}

export interface AnalyticsPageView {
  id: string;
  page: string;
  referrer?: string;
  sessionId: string;
  timestamp: string;
  userType: 'guest' | 'registered';
}

const ANALYTICS_EVENTS_KEY = 'atlas_analytics_events';
const ANALYTICS_PAGEVIEWS_KEY = 'atlas_analytics_pageviews';
const MAX_STORED_EVENTS = 1000; // Limit storage usage

// Generate event ID
const generateEventId = (): string => {
  return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Track user events
export const trackEvent = (eventName: string, properties: Record<string, any> = {}): void => {
  try {
    const session = getCurrentSession();
    const event: AnalyticsEvent = {
      id: generateEventId(),
      event: eventName,
      properties: {
        ...properties,
        url: window.location.href,
        userAgent: navigator.userAgent,
        viewport: `${window.innerWidth}x${window.innerHeight}`
      },
      sessionId: session.id,
      timestamp: new Date().toISOString(),
      userType: session.type
    };

    // Store event locally
    const events = getStoredEvents();
    events.unshift(event);

    // Trim to max size
    if (events.length > MAX_STORED_EVENTS) {
      events.splice(MAX_STORED_EVENTS);
    }

    localStorage.setItem(ANALYTICS_EVENTS_KEY, JSON.stringify(events));

    // In production, you would send to analytics service here
    console.log('📊 Analytics Event:', eventName, properties);

  } catch (error) {
    console.error('Failed to track event:', error);
  }
};

// Track page views
export const trackPageView = (page: string, referrer?: string): void => {
  try {
    const session = getCurrentSession();
    const pageView: AnalyticsPageView = {
      id: generateEventId(),
      page,
      referrer,
      sessionId: session.id,
      timestamp: new Date().toISOString(),
      userType: session.type
    };

    const pageViews = getStoredPageViews();
    pageViews.unshift(pageView);

    if (pageViews.length > MAX_STORED_EVENTS) {
      pageViews.splice(MAX_STORED_EVENTS);
    }

    localStorage.setItem(ANALYTICS_PAGEVIEWS_KEY, JSON.stringify(pageViews));

    console.log('📄 Page View:', page);

  } catch (error) {
    console.error('Failed to track page view:', error);
  }
};

// Get stored events
export const getStoredEvents = (): AnalyticsEvent[] => {
  try {
    const stored = localStorage.getItem(ANALYTICS_EVENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load analytics events:', error);
    return [];
  }
};

// Get stored page views
export const getStoredPageViews = (): AnalyticsPageView[] => {
  try {
    const stored = localStorage.getItem(ANALYTICS_PAGEVIEWS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load page views:', error);
    return [];
  }
};

// Common event tracking functions
export const analytics = {
  // User actions
  moodLogged: (mood: string, hasNote: boolean = false) => {
    trackEvent('mood_logged', { mood, hasNote });
  },

  winLogged: (arena: string, impact: string, hasDescription: boolean = false) => {
    trackEvent('win_logged', { arena, impact, hasDescription });
  },

  challengeCompleted: (challengeId: number, arena: string, difficulty: string) => {
    trackEvent('challenge_completed', { challengeId, arena, difficulty });
  },

  mentorMessageSent: (mentorId: string, messageLength: number) => {
    trackEvent('mentor_message_sent', { mentorId, messageLength });
  },

  mentorSwitched: (fromMentor: string, toMentor: string) => {
    trackEvent('mentor_switched', { fromMentor, toMentor });
  },

  weeklyReflectionViewed: (reflectionId: string, wasExpanded: boolean = false) => {
    trackEvent('weekly_reflection_viewed', { reflectionId, wasExpanded });
  },

  weeklyReflectionGenerated: (totalWins: number, moodTrend: string) => {
    trackEvent('weekly_reflection_generated', { totalWins, moodTrend });
  },

  // Navigation
  screenViewed: (screen: string) => {
    trackPageView(screen);
  },

  toolLaunched: (toolId: string, completedBefore: boolean = false) => {
    trackEvent('tool_launched', { toolId, completedBefore });
  },

  guideViewed: (guideId: number, arena: string) => {
    trackEvent('guide_viewed', { guideId, arena });
  },

  // Onboarding
  onboardingStarted: () => {
    trackEvent('onboarding_started');
  },

  onboardingCompleted: (profile: any) => {
    trackEvent('onboarding_completed', {
      primaryGoal: profile.primaryGoal,
      focusArena: profile.focusArena,
      challengeCadence: profile.challengeCadence
    });
  },

  // Testing/Reset actions
  weeklyReset: (options: any) => {
    trackEvent('weekly_reset', options);
  },

  sampleDataGenerated: () => {
    trackEvent('sample_data_generated');
  },

  dataExported: () => {
    trackEvent('data_exported');
  },

  dataImported: () => {
    trackEvent('data_imported');
  },

  // Engagement
  sessionStarted: (sessionType: 'guest' | 'registered', daysSinceCreated: number) => {
    trackEvent('session_started', { sessionType, daysSinceCreated });
  },

  featureDiscovered: (feature: string, location: string) => {
    trackEvent('feature_discovered', { feature, location });
  },

  errorEncountered: (error: string, location: string) => {
    trackEvent('error_encountered', { error, location });
  }
};

// Analytics summary for debugging/admin view
export const getAnalyticsSummary = () => {
  const events = getStoredEvents();
  const pageViews = getStoredPageViews();

  const eventCounts = events.reduce((acc, event) => {
    acc[event.event] = (acc[event.event] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topEvents = Object.entries(eventCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);

  return {
    totalEvents: events.length,
    totalPageViews: pageViews.length,
    topEvents,
    firstEvent: events[events.length - 1]?.timestamp,
    lastEvent: events[0]?.timestamp
  };
};

// Clear analytics data
export const clearAnalyticsData = (): void => {
  localStorage.removeItem(ANALYTICS_EVENTS_KEY);
  localStorage.removeItem(ANALYTICS_PAGEVIEWS_KEY);
};