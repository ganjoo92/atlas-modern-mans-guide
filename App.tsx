import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import OnboardingModal from './components/OnboardingModal';
import MoodCheckIn, { loadMoodEntries, persistMoodEntries, type MoodEntry } from './components/MoodCheckIn';
import { getCurrentSession, needsOnboarding, updateSessionProfile, getSessionDisplayName, getSessionStats } from './utils/sessionManager';
import { analytics } from './utils/analytics';
import DashboardScreen from './screens/DashboardScreen';
import GuidesScreen from './screens/GuidesScreen';
import GuideDetailScreen from './screens/GuideDetailScreen';
const MentorScreen = lazy(() => import('./screens/MentorScreen'));
const CommunityScreen = lazy(() => import('./screens/CommunityScreen'));
const ChallengesScreen = lazy(() => import('./screens/ChallengesScreen'));
const ProgressScreen = lazy(() => import('./screens/ProgressScreen'));
const AboutScreen = lazy(() => import('./screens/AboutScreen'));
const DatingScreen = lazy(() => import('./screens/DatingScreen'));
const GroomingScreen = lazy(() => import('./screens/GroomingScreen'));
const FocusScreen = lazy(() => import('./screens/FocusScreen'));
const ToolsScreen = lazy(() => import('./screens/ToolsScreen'));
const MyCodeScreen = lazy(() => import('./screens/MyCodeScreen'));
import {
  MOCK_ARTICLES,
  MOCK_CHALLENGES,
  NAV_ITEMS_PRIMARY,
  NAV_ITEMS_EXPLORE,
  NAV_ITEMS_SUPPORT,
  LIFE_ARENAS,
} from './constants';
import type { View, Article, ArenaType, OnboardingProfile } from './types';
import type { ChallengeCompletionLog } from './utils/challengeMetrics';
import { calculateStreaks, deriveBadges } from './utils/challengeMetrics';
import { ScreenErrorBoundary, ScreenLoader } from './components/ScreenBoundary';

const SCREEN_LOADING_COPY: Partial<Record<View, { title: string; description: string }>> = {
  mentor: {
    title: 'Linking with your mentor…',
    description: 'Summoning tailored guidance and follow-up prompts.',
  },
  community: {
    title: 'Opening the brotherhood room…',
    description: 'Pulling in fresh posts and pinned prompts.',
  },
  tools: {
    title: 'Loading your tools hub…',
    description: 'Restoring completion streaks and evidence-based drills.',
  },
  challenges: {
    title: 'Syncing challenge board…',
    description: 'Rebuilding your streaks and arena progress.',
  },
  progress: {
    title: 'Calculating progress…',
    description: 'Crunching streaks, badges, and recent wins.',
  },
  dating: {
    title: 'Dialing in the dating toolkit…',
    description: 'Loading curated scenarios and playbooks.',
  },
  mycode: {
    title: 'Preparing your personal code…',
    description: 'Collecting stats, wins, and arena focus.',
  },
  guides: {
    title: 'Fetching guides…',
    description: 'Restoring your bookmarks and reading history.',
  },
};

const getLoadingCopy = (view: View) =>
  SCREEN_LOADING_COPY[view] ?? {
    title: 'Loading module…',
    description: 'Coordinating your Atlas workspace.',
  };

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [completedChallengeIds, setCompletedChallengeIds] = useState<Set<number>>(new Set());
  const [challengeHistory, setChallengeHistory] = useState<ChallengeCompletionLog[]>([]);
  const [onboardingProfile, setOnboardingProfile] = useState<OnboardingProfile | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mentorGreetingSeen, setMentorGreetingSeen] = useState(false);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [screenRetryToken, setScreenRetryToken] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    try {
      // Initialize session and check if onboarding is needed
      const session = getCurrentSession();
      const sessionStats = getSessionStats();

      // Track session start
      analytics.sessionStarted(session.type, sessionStats.daysSinceCreated);

      if (session.profile) {
        setOnboardingProfile(session.profile);
      } else {
        // Check legacy storage for backwards compatibility
        const storedProfile = localStorage.getItem('atlas_onboarding_profile');
        if (storedProfile) {
          const parsed: OnboardingProfile = JSON.parse(storedProfile);
          setOnboardingProfile(parsed);
          updateSessionProfile(parsed); // Migrate to session
        } else {
          setShowOnboarding(needsOnboarding());
        }
      }

      const storedMentorWelcome = localStorage.getItem('atlas_mentor_welcome_seen');
      if (storedMentorWelcome === 'true') {
        setMentorGreetingSeen(true);
      }
      setMoodEntries(loadMoodEntries());
    } catch (error) {
      console.error('Error loading stored profile', error);
      analytics.errorEncountered('app_initialization_failed', 'App.tsx');
      setShowOnboarding(true);
    }
  }, []);
  
  const handleToggleChallenge = (id: number) => {
    const challenge = MOCK_CHALLENGES.find(item => item.id === id);
    if (!challenge) {
      return;
    }
    setCompletedChallengeIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
        setChallengeHistory(prevHistory => prevHistory.filter(entry => entry.id !== id));
      } else {
        newSet.add(id);
        setChallengeHistory(prevHistory => [...prevHistory, { id, arena: challenge.arena, completedAt: new Date() }]);
      }
      return newSet;
    });
  };

  const setView = (view: View) => {
    setCurrentView(view);
    setSelectedArticle(null); // Reset article view when changing main view
    analytics.screenViewed(view);
  };

  const navSections = useMemo(
    () => [
      { title: 'Core', items: NAV_ITEMS_PRIMARY },
      { title: 'Explore', items: NAV_ITEMS_EXPLORE },
      { title: 'Support', items: NAV_ITEMS_SUPPORT },
    ],
    []
  );

  const arenaStats = useMemo(
    () =>
      LIFE_ARENAS.map(arena => ({
        id: arena.id,
        title: arena.title,
        completed: challengeHistory.filter(entry => entry.arena === arena.id).length,
      })),
    [challengeHistory]
  );

  const latestMood = moodEntries[0] ?? null;
  const strainedRecentCount = useMemo(
    () => moodEntries.slice(0, 3).filter(entry => entry.value === 'strained').length,
    [moodEntries]
  );

  const recommendedArena = useMemo(() => {
    if (!arenaStats.length) return undefined;
    const sorted = [...arenaStats].sort((a, b) => a.completed - b.completed);
    let candidate = sorted[0];
    if (latestMood?.value === 'strained') {
      const mindStat = arenaStats.find(stat => stat.id === 'mind');
      if (mindStat && mindStat.completed <= candidate.completed) {
        candidate = mindStat;
      }
    } else if (onboardingProfile) {
      const focusStat = arenaStats.find(stat => stat.id === onboardingProfile.focusArena);
      if (focusStat && focusStat.completed <= candidate.completed) {
        candidate = focusStat;
      }
    }
    return candidate;
  }, [arenaStats, onboardingProfile, latestMood]);

  const recommendedTool = useMemo(() => {
    if (strainedRecentCount >= 2) {
      return {
        view: 'mentor' as View,
        title: 'Unload the pressure',
        description: 'Your last check-ins show strain. Bring it to the mentor before it compounds.',
      };
    }

    if (!challengeHistory.length) {
      if (onboardingProfile) {
        switch (onboardingProfile.primaryGoal) {
          case 'dating':
            return {
              view: 'dating' as View,
              title: 'Build momentum in dating',
              description: 'Start with the Dating Toolkit to align your approach with your goal.',
            };
          case 'career':
            return {
              view: 'tools' as View,
              title: 'Map your career strategy',
              description: 'Run the Life Assessment and log one Work arena win.',
            };
          case 'confidence':
            return {
              view: 'mentor' as View,
              title: 'Sync with the mentor',
              description: 'Share your current obstacle so the mentor can coach you directly.',
            };
          case 'discipline':
          default:
            return {
              view: 'tools' as View,
              title: 'Run the Life Readiness Assessment',
              description: 'Get your baseline so every recommendation is dialed to you.',
            };
        }
      } else {
        return {
          view: 'tools' as View,
          title: 'Run the Life Readiness Assessment',
          description: 'Get your baseline so every recommendation is dialed to you.',
        };
      }
    }

    const heartCount = arenaStats.find(stat => stat.id === 'heart')?.completed ?? 0;
    const bodyCount = arenaStats.find(stat => stat.id === 'body')?.completed ?? 0;

    if (latestMood?.value === 'strained') {
      return {
        view: 'tools' as View,
        title: 'Reset your headspace',
        description: 'Run a breathing drill or short reflection from the Tools hub to recalibrate.',
      };
    }

    if (heartCount < 2) {
      return {
        view: 'dating' as View,
        title: 'Sharpen your connection toolkit',
        description: 'Focus on Heart arena reps—refresh the Dating Toolkit and run a conversation drill.',
      };
    }

    if (bodyCount < 2) {
      return {
        view: 'grooming' as View,
        title: 'Dial in external presence',
        description: 'Body reps are light—spend 10 minutes in the Style & Body Hub.',
      };
    }

    return {
      view: 'progress' as View,
      title: 'Review your gains',
      description: 'Check streaks and badges, then pick the next arena to level up.',
    };
  }, [arenaStats, challengeHistory, onboardingProfile, latestMood, strainedRecentCount]);

  const streaks = useMemo(() => calculateStreaks(challengeHistory), [challengeHistory]);
  const badges = useMemo(
    () => deriveBadges(completedChallengeIds.size, streaks.current, streaks.longest),
    [completedChallengeIds.size, streaks.current, streaks.longest]
  );
  const moodStatus = useMemo(
    () => ({
      latest: latestMood,
      strainedRecentCount,
    }),
    [latestMood, strainedRecentCount]
  );

  const handleMoodLog = useCallback(
    (entry: MoodEntry) => {
      const nextEntries = [entry, ...moodEntries].slice(0, 90);
      setMoodEntries(nextEntries);
      persistMoodEntries(nextEntries);
      analytics.moodLogged(entry.value, !!entry.note);
    },
    [moodEntries]
  );

  const handleOnboardingComplete = (profile: OnboardingProfile) => {
    setOnboardingProfile(profile);
    updateSessionProfile(profile);
    localStorage.setItem('atlas_onboarding_profile', JSON.stringify(profile));
    setShowOnboarding(false);
    analytics.onboardingCompleted(profile);
    setView('dashboard');
  };

  const handleMentorGreetingDelivered = useCallback(() => {
    setMentorGreetingSeen(true);
    localStorage.setItem('atlas_mentor_welcome_seen', 'true');
  }, []);

  const loaderCopy = selectedArticle
    ? {
        title: 'Opening guide…',
        description: 'Pulling in your saved highlights and reading streak.',
      }
    : getLoadingCopy(currentView);

  const handleScreenRetry = useCallback(() => {
    setScreenRetryToken(prev => prev + 1);
  }, []);

  const renderView = () => {
    if (selectedArticle) {
      return <GuideDetailScreen article={selectedArticle} onBack={() => setSelectedArticle(null)} />;
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardScreen
            setView={setView}
            recommendedArena={recommendedArena}
            recommendedTool={recommendedTool}
            username={getSessionDisplayName()}
            moodEntries={moodEntries}
            onLogMood={handleMoodLog}
            moodStatus={moodStatus}
          />
        );
      case 'guides':
        return <GuidesScreen articles={MOCK_ARTICLES} onSelectArticle={setSelectedArticle} />;
      case 'mentor':
        return (
          <MentorScreen
            onboardingProfile={onboardingProfile}
            mentorGreetingSeen={mentorGreetingSeen}
            onMentorGreetingDelivered={handleMentorGreetingDelivered}
            setView={setView}
            moodEntries={moodEntries}
          />
        );
      case 'community':
        return <CommunityScreen />;
      case 'challenges':
        return (
          <ChallengesScreen
            completedChallengeIds={completedChallengeIds}
            onToggleChallenge={handleToggleChallenge}
            challengeHistory={challengeHistory}
          />
        );
      case 'progress':
        return <ProgressScreen completedChallengeIds={completedChallengeIds} totalChallenges={MOCK_CHALLENGES.length} />;
      case 'dating':
        return <DatingScreen onSelectArticle={setSelectedArticle} />;
      case 'grooming':
        return <GroomingScreen />;
      case 'focus':
        return <FocusScreen />;
      case 'tools':
        return <ToolsScreen />;
      case 'mycode':
        return (
          <MyCodeScreen
            setView={setView}
            arenaStats={arenaStats}
            streaks={streaks}
            badges={badges}
            recommendedArena={recommendedArena}
            recommendedTool={recommendedTool}
            challengeHistory={challengeHistory}
            onboardingProfile={onboardingProfile}
            moodEntries={moodEntries}
            moodStatus={moodStatus}
          />
        );
      case 'about':
        return <AboutScreen />;
      default:
        return (
          <DashboardScreen
            setView={setView}
            recommendedArena={recommendedArena}
            recommendedTool={recommendedTool}
            username={onboardingProfile?.name ?? 'Brother'}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-primary via-secondary to-primary text-text-primary font-sans">
      {!isMobile && <Sidebar currentView={currentView} setView={setView} navSections={navSections} />}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gradient-to-br from-primary/50 to-secondary/30 backdrop-blur-sm">
        <div className="animate-fade-in">
          <ScreenErrorBoundary
            resetKeys={[currentView, selectedArticle?.id ?? null, screenRetryToken]}
            onReset={handleScreenRetry}
          >
            <Suspense fallback={<ScreenLoader title={loaderCopy.title} description={loaderCopy.description} />}>
              <div key={screenRetryToken}>{renderView()}</div>
            </Suspense>
          </ScreenErrorBoundary>
        </div>
      </main>
      {isMobile && <BottomNav currentView={currentView} setView={setView} navItems={NAV_ITEMS_PRIMARY} />}
      {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}
    </div>
  );
};

export default App;
