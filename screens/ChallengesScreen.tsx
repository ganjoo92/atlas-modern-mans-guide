import React, { useMemo, useState } from 'react';
import { MOCK_CHALLENGES, LIFE_ARENAS } from '../constants';
import ChallengeCard from '../components/ChallengeCard';
import type { ArenaType } from '../types';
import {
  calculateStreaks,
  deriveBadges,
  type BadgeMeta,
  type ChallengeCompletionLog,
} from '../utils/challengeMetrics';
import {
  SparklesIcon,
  Target,
  TrendingUp,
  ClockIcon,
  CheckBadgeIcon,
  ChevronDown,
  ChevronUp,
  Star,
} from '../components/Icons';

interface ChallengesScreenProps {
  completedChallengeIds: Set<number>;
  onToggleChallenge: (id: number) => void;
  challengeHistory: ChallengeCompletionLog[];
}

type ArenaSummary = {
  id: ArenaType;
  title: string;
  color: string;
  total: number;
  completed: number;
};

const difficultyOrder: Record<'baseline' | 'momentum' | 'advanced', number> = {
  baseline: 0,
  momentum: 1,
  advanced: 2,
};

const ChallengesScreen: React.FC<ChallengesScreenProps> = ({ completedChallengeIds, onToggleChallenge, challengeHistory }) => {
  const [activeArena, setActiveArena] = useState<ArenaType | 'all'>('all');
  const [expandedArena, setExpandedArena] = useState<ArenaType | null>(null);
  const [focusSeed, setFocusSeed] = useState(0);

  const totalChallenges = MOCK_CHALLENGES.length;
  const completedCount = completedChallengeIds.size;
  const completionPercent = totalChallenges ? Math.round((completedCount / totalChallenges) * 100) : 0;

  const recommendedChallenges = useMemo(() => {
    const available = MOCK_CHALLENGES.filter(challenge => !completedChallengeIds.has(challenge.id));
    if (!available.length) return [];
    const sorted = [...available].sort(
      (a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
    );
    if (sorted.length <= 3) {
      return sorted;
    }
    const rotateBy = focusSeed % sorted.length;
    const rotated = sorted.slice(rotateBy).concat(sorted.slice(0, rotateBy));
    return rotated.slice(0, 3);
  }, [completedChallengeIds, focusSeed]);

  const filteredChallenges = useMemo(() => {
    if (activeArena === 'all') return MOCK_CHALLENGES;
    return MOCK_CHALLENGES.filter(challenge => challenge.arena === activeArena);
  }, [activeArena]);

  const arenaSummaries: ArenaSummary[] = useMemo(() => {
    return LIFE_ARENAS.map(arena => {
      const arenaChallenges = MOCK_CHALLENGES.filter(challenge => challenge.arena === arena.id);
      const completed = arenaChallenges.filter(challenge => completedChallengeIds.has(challenge.id)).length;
      return {
        id: arena.id,
        title: arena.title,
        color: arena.color,
        total: arenaChallenges.length,
        completed,
      };
    });
  }, [completedChallengeIds]);

  const arenaChallengeGroups = useMemo(() => {
    const groups: Record<ArenaType, typeof MOCK_CHALLENGES> = {
      mind: [],
      heart: [],
      body: [],
      work: [],
      soul: [],
    };
    MOCK_CHALLENGES.forEach(challenge => {
      groups[challenge.arena].push(challenge);
    });
    return groups;
  }, []);

  const streaks = useMemo(() => calculateStreaks(challengeHistory), [challengeHistory]);
  const badges = useMemo(
    () => deriveBadges(completedCount, streaks.current, streaks.longest),
    [completedCount, streaks.current, streaks.longest]
  );

  return (
    <div className="animate-fade-in pb-16 md:pb-6 space-y-10">
      <Hero
        completionPercent={completionPercent}
        completedCount={completedCount}
        totalChallenges={totalChallenges}
        streaks={streaks}
      />

      <FocusStrip
        recommendedChallenges={recommendedChallenges}
        onToggleChallenge={onToggleChallenge}
        completedChallengeIds={completedChallengeIds}
        onShuffle={() => setFocusSeed(prev => prev + 1)}
      />

      <ArenaGrid
        arenaSummaries={arenaSummaries}
        activeArena={activeArena}
        setActiveArena={setActiveArena}
      />

      <ChallengeLibrary
        activeArena={activeArena}
        expandedArena={expandedArena}
        setExpandedArena={setExpandedArena}
        filteredChallenges={filteredChallenges}
        arenaChallengeGroups={arenaChallengeGroups}
        onToggleChallenge={onToggleChallenge}
        completedChallengeIds={completedChallengeIds}
      />

      <BadgesPanel badges={badges} />

      <QuickWins />
      <MomentumRail />
    </div>
  );
};

const Hero: React.FC<{
  completionPercent: number;
  completedCount: number;
  totalChallenges: number;
  streaks: { current: number; longest: number };
}> = ({
  completionPercent,
  completedCount,
  totalChallenges,
  streaks,
}) => {
  return (
    <header className="bg-secondary/70 border border-gray-700/60 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div className="space-y-3 max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-primary/40 border border-gray-700/60 text-xs uppercase tracking-wide text-accent px-3 py-1 rounded-full">
          <CheckBadgeIcon className="w-4 h-4" />
          <span>Daily Momentum</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary">Stack Tiny Wins Into Lasting Change</h1>
        <p className="text-lg text-text-secondary">
          Finish three challenges a day, rotate arenas weekly, and sync insights with your mentor to compound faster.
        </p>
        <p className="text-sm text-accent">
          {completedCount} of {totalChallenges} challenges completed · Stay consistent to unlock arena mastery badges.
        </p>
        <div className="flex gap-4 text-sm text-text-secondary">
          <span>Current streak: <strong className="text-text-primary">{streaks.current} day{streaks.current === 1 ? '' : 's'}</strong></span>
          <span>All-time best: <strong className="text-text-primary">{streaks.longest} day{streaks.longest === 1 ? '' : 's'}</strong></span>
        </div>
      </div>

      <div className="bg-primary/40 border border-gray-700/60 rounded-2xl px-6 py-6 flex flex-col items-center w-full md:w-72">
        <div className="relative h-32 w-32 flex items-center justify-center mb-3">
          <svg className="absolute inset-0" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" stroke="currentColor" className="text-gray-700" strokeWidth="10" fill="none" />
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="currentColor"
              className="text-accent"
              strokeWidth="10"
              fill="none"
              strokeDasharray={2 * Math.PI * 54}
              strokeDashoffset={(2 * Math.PI * 54) * (1 - completionPercent / 100)}
              strokeLinecap="round"
              style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
            />
          </svg>
          <div className="relative text-3xl font-extrabold text-text-primary">{completionPercent}%</div>
        </div>
        <p className="text-sm text-text-secondary text-center">
          Complete 15+ challenges this month to unlock the Momentum badge and level up your progress dashboard.
        </p>
      </div>
    </header>
  );
};

const FocusStrip: React.FC<{
  recommendedChallenges: typeof MOCK_CHALLENGES;
  onToggleChallenge: (id: number) => void;
  completedChallengeIds: Set<number>;
  onShuffle: () => void;
}> = ({ recommendedChallenges, onToggleChallenge, completedChallengeIds, onShuffle }) => {
  if (!recommendedChallenges.length) {
    return (
      <section className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-accent" />
            Daily Focus Complete
          </h2>
          <p className="text-sm text-text-secondary">
            You have cleared the current queue. Explore the full library below or revisit completed challenges to reinforce the habit.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
            <Target className="w-5 h-5 text-accent" />
            Today’s Focus (Top 3)
          </h2>
          <p className="text-sm text-text-secondary">
            Knock these out first to keep your streak rolling. Mark as complete when done.
          </p>
        </div>
        <button
          onClick={onShuffle}
          className="text-sm text-accent hover:text-accent-light underline"
        >
          Shuffle alternatives
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendedChallenges.map(challenge => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            isCompleted={completedChallengeIds.has(challenge.id)}
            onToggleComplete={() => onToggleChallenge(challenge.id)}
            variant="compact"
          />
        ))}
      </div>
    </section>
  );
};

const ArenaGrid: React.FC<{
  arenaSummaries: ArenaSummary[];
  activeArena: ArenaType | 'all';
  setActiveArena: (arena: ArenaType | 'all') => void;
}> = ({ arenaSummaries, activeArena, setActiveArena }) => (
  <section className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-semibold text-text-primary">Arena Breakdown</h2>
      <button
        onClick={() => setActiveArena('all')}
        className="text-sm text-text-secondary hover:text-text-primary underline"
      >
        Reset filter
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <button
        onClick={() => setActiveArena('all')}
        className={`rounded-2xl border px-4 py-5 text-left transition-all ${
          activeArena === 'all'
            ? 'border-accent/60 bg-accent/10 text-text-primary shadow-card'
            : 'border-gray-700/60 bg-secondary/60 text-text-secondary hover:border-accent/40 hover:text-text-primary'
        }`}
      >
        <p className="text-xs uppercase tracking-wide mb-2">All Arenas</p>
        <p className="text-3xl font-bold text-text-primary">{arenaSummaries.reduce((sum, arena) => sum + arena.total, 0)}</p>
        <p className="text-sm text-text-secondary">
          {arenaSummaries.reduce((sum, arena) => sum + arena.completed, 0)} completed · 5 categories
        </p>
      </button>
      {arenaSummaries.map(arena => (
        <button
          key={arena.id}
          onClick={() => setActiveArena(arena.id)}
          className={`rounded-2xl border px-4 py-5 text-left transition-all ${
            activeArena === arena.id
              ? 'border-accent/60 bg-accent/10 text-text-primary shadow-card'
              : 'border-gray-700/60 bg-secondary/60 text-text-secondary hover:border-accent/40 hover:text-text-primary'
          }`}
        >
          <p className="text-xs uppercase tracking-wide mb-2" style={{ color: 'inherit' }}>
            {arena.title}
          </p>
          <p className="text-3xl font-bold text-text-primary">{arena.total}</p>
          <p className="text-sm text-text-secondary">{arena.completed} completed</p>
        </button>
      ))}
    </div>
  </section>
);

const ChallengeLibrary: React.FC<{
  activeArena: ArenaType | 'all';
  expandedArena: ArenaType | null;
  setExpandedArena: (arena: ArenaType | null) => void;
  filteredChallenges: typeof MOCK_CHALLENGES;
  arenaChallengeGroups: Record<ArenaType, typeof MOCK_CHALLENGES>;
  onToggleChallenge: (id: number) => void;
  completedChallengeIds: Set<number>;
}> = ({
  activeArena,
  expandedArena,
  setExpandedArena,
  filteredChallenges,
  arenaChallengeGroups,
  onToggleChallenge,
  completedChallengeIds,
}) => (
  <section className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-6 space-y-6">
    <header className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-text-primary flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          Challenge Library
        </h2>
        <p className="text-sm text-text-secondary">
          Filter by arena to focus your reps. Everything you complete feeds your progress dashboard and streaks.
        </p>
      </div>
    </header>

    {activeArena === 'all' ? (
      <div className="space-y-4">
        {LIFE_ARENAS.map(arena => {
          const challenges = arenaChallengeGroups[arena.id];
          const isExpanded = expandedArena === arena.id;
          return (
            <div key={arena.id} className="bg-primary/30 border border-gray-700/60 rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpandedArena(isExpanded ? null : arena.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-primary/40 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-text-primary">{arena.title}</p>
                  <p className="text-xs text-text-secondary">{challenges.length} total · {challenges.filter(ch => completedChallengeIds.has(ch.id)).length} completed</p>
                </div>
                {isExpanded ? <ChevronUp className="w-5 h-5 text-text-secondary" /> : <ChevronDown className="w-5 h-5 text-text-secondary" />}
              </button>
              {isExpanded && (
                <div className="px-5 pb-5 space-y-3">
                  {challenges.map(challenge => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      isCompleted={completedChallengeIds.has(challenge.id)}
                      onToggleComplete={() => onToggleChallenge(challenge.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    ) : (
      <div className="space-y-3">
        {filteredChallenges.map(challenge => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            isCompleted={completedChallengeIds.has(challenge.id)}
            onToggleComplete={() => onToggleChallenge(challenge.id)}
          />
        ))}
        {!filteredChallenges.length && (
          <p className="text-sm text-text-secondary">No challenges available for this arena yet. Check back soon.</p>
        )}
      </div>
    )}
  </section>
);

const QuickWins = () => {
  const tips = [
    {
      icon: ClockIcon,
      title: 'Block 15 minutes',
      description: 'Set a daily window (morning or lunch) to finish at least one challenge.',
    },
    {
      icon: SparklesIcon,
      title: 'Mentor recap',
      description: 'After completing a challenge, tell the AI Mentor what you learned.',
    },
    {
      icon: TrendingUp,
      title: 'Weekly review',
      description: 'Every Sunday, note patterns: Which arena gets ignored? Adjust intentionally.',
    },
  ];

  return (
    <section className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <ClockIcon className="w-5 h-5 text-accent" />
        <h2 className="text-xl font-semibold text-text-primary">Momentum tips</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {tips.map(tip => (
          <div key={tip.title} className="bg-primary/30 border border-gray-700/60 rounded-xl p-4 space-y-2">
            <tip.icon className="w-5 h-5 text-accent" />
            <p className="text-sm font-semibold text-text-primary">{tip.title}</p>
            <p className="text-sm text-text-secondary">{tip.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const MomentumRail = () => {
  const actions = [
    {
      title: 'Log it as a Challenge Streak',
      description: 'Head to the Progress dashboard and record today’s wins.',
      actionLabel: 'Open Progress',
      onClick: () => console.log('Navigate to progress'),
    },
    {
      title: 'Sync with Mentor',
      description: 'Tell the mentor: “I completed challenges X and Y today—what’s next?”',
      actionLabel: 'Message Mentor',
      onClick: () => console.log('Navigate to mentor'),
    },
    {
      title: 'Schedule Tomorrow’s Focus',
      description: 'Drop tomorrow’s three challenges into your calendar for accountability.',
      actionLabel: 'Plan it',
      onClick: () => console.log('Open planner'),
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {actions.map(action => (
        <div key={action.title} className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-5 space-y-2">
          <p className="text-sm font-semibold text-text-primary">{action.title}</p>
          <p className="text-sm text-text-secondary">{action.description}</p>
          <button onClick={action.onClick} className="text-sm text-accent hover:text-accent-light underline">
            {action.actionLabel}
          </button>
        </div>
      ))}
    </section>
  );
};

export default ChallengesScreen;

const BadgesPanel: React.FC<{ badges: BadgeMeta[] }> = ({ badges }) => (
  <section className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-6 space-y-4">
    <div className="flex items-center gap-3">
      <Star className="w-5 h-5 text-accent" />
      <h2 className="text-xl font-semibold text-text-primary">Badges & Milestones</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {badges.map(badge => (
        <div
          key={badge.id}
          className={`rounded-xl border px-4 py-3 space-y-2 ${
            badge.unlocked ? 'border-accent/60 bg-accent/10 text-text-primary' : 'border-gray-700/60 bg-primary/30 text-text-secondary'
          }`}
        >
          <p className="text-sm font-semibold">{badge.label}</p>
          <p className="text-sm">{badge.description}</p>
          <p className="text-xs uppercase tracking-wide">
            {badge.unlocked ? 'Unlocked' : 'Keep pushing'}
          </p>
        </div>
      ))}
    </div>
  </section>
);
