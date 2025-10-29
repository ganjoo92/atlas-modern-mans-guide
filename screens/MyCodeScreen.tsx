import React, { useMemo, useState } from 'react';
import { LIFE_ARENAS, MOCK_CHALLENGES } from '../constants';
import type { ArenaType, View, OnboardingProfile } from '../types';
import type { BadgeMeta, ChallengeCompletionLog } from '../utils/challengeMetrics';
import type { MoodEntry, MoodLevel } from '../components/MoodCheckIn';
import {
  SparklesIcon,
  TrendingUp,
  Target,
  Star,
  CheckBadgeIcon,
  UsersIcon,
  BookOpenIcon,
  HeartIcon,
} from '../components/Icons';

interface ArenaSummary {
  id: ArenaType;
  title: string;
  completed: number;
}

interface RecommendedTool {
  view: View;
  title: string;
  description: string;
}

interface MyCodeScreenProps {
  setView: (view: View) => void;
  arenaStats: ArenaSummary[];
  streaks: { current: number; longest: number };
  badges: BadgeMeta[];
  recommendedArena?: ArenaSummary;
  recommendedTool?: RecommendedTool;
  challengeHistory: ChallengeCompletionLog[];
  onboardingProfile: OnboardingProfile | null;
  moodEntries: MoodEntry[];
  moodStatus: { latest: MoodEntry | null; strainedRecentCount: number };
}

const DEFAULT_VALUES = [
  {
    title: 'Presence over distraction',
    description: 'No passive scrolling before work. If it is not building me or the mission, it waits.',
  },
  {
    title: 'Lead with honesty',
    description: 'Say the hard thing with respect. No half-truths, no avoiding the conversation.',
  },
  {
    title: 'Earn the body and mind daily',
    description: 'Sweat, learn, or repair—every single day. The standard is maintained, not remembered.',
  },
];

const GOAL_LABELS: Record<OnboardingProfile['primaryGoal'], string> = {
  dating: 'Dial in dating & relationships',
  career: 'Advance career & leadership',
  discipline: 'Master discipline & habits',
  confidence: 'Own your confidence',
};

const CADENCE_FRIENDLY: Record<OnboardingProfile['challengeCadence'], string> = {
  daily: 'Daily reps',
  weekly: 'Weekly sprints',
  custom: 'Custom cadence',
};

const MOOD_LABELS: Record<MoodLevel, { label: string; tone: string }> = {
  charged: { label: 'Charged', tone: 'text-green-300' },
  steady: { label: 'Steady', tone: 'text-yellow-300' },
  strained: { label: 'Strained', tone: 'text-red-300' },
};

const MyCodeScreen: React.FC<MyCodeScreenProps> = ({
  setView,
  arenaStats,
  streaks,
  badges,
  recommendedArena,
  recommendedTool,
  challengeHistory,
  onboardingProfile,
  moodEntries,
  moodStatus,
}) => {
  const totalReps = challengeHistory.length;
  const displayName = onboardingProfile?.name ?? 'Brother';
  const goalLabel = onboardingProfile ? GOAL_LABELS[onboardingProfile.primaryGoal] : null;
  const cadenceLabel = onboardingProfile ? CADENCE_FRIENDLY[onboardingProfile.challengeCadence] : null;
  const moodHistory = useMemo(() => moodEntries.slice(0, 7), [moodEntries]);
  const [shareCopied, setShareCopied] = useState(false);

  const handleCopyShare = async () => {
    const summary = `${displayName} • ${totalReps} reps • ${streaks.current}-day streak • Focus: ${recommendedArena?.title ?? 'Balanced'}`;
    try {
      await navigator.clipboard.writeText(summary);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy share summary', error);
    }
  };

  const recentCompletions = useMemo(() => {
    if (!challengeHistory.length)
      return [] as Array<{ id: number; title: string; date: string; arena: ArenaType; arenaTitle: string }>;
    const challengeLookup = new Map(MOCK_CHALLENGES.map(challenge => [challenge.id, challenge]));
    return [...challengeHistory]
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, 4)
      .map(entry => {
        const challenge = challengeLookup.get(entry.id);
        const arenaId = challenge?.arena ?? entry.arena;
        const arenaMeta = LIFE_ARENAS.find(arena => arena.id === arenaId);
        return {
          id: entry.id,
          title: challenge?.title ?? 'Challenge',
          date: new Date(entry.completedAt).toLocaleDateString(),
          arena: arenaId,
          arenaTitle: arenaMeta?.title ?? arenaId,
        };
      });
  }, [challengeHistory]);

  const maxArenaCompletions = Math.max(1, ...arenaStats.map(stat => stat.completed));

  const unlockedBadges = badges.filter(badge => badge.unlocked);
  const lockedBadges = badges.filter(badge => !badge.unlocked);

  return (
    <div className="animate-fade-in pb-16 md:pb-6 space-y-10">
      <header className="bg-secondary/70 border border-gray-700/60 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-primary/40 border border-gray-700/60 text-xs uppercase tracking-wide text-accent px-3 py-1 rounded-full">
            <SparklesIcon className="w-4 h-4" />
            <span>My Code</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary">
            Forge your edge, {displayName}.
          </h1>
          <p className="text-lg text-text-secondary">
            These are your standards in motion—values, reps, streaks, and the next plays to stay sharp.
          </p>
          {goalLabel && (
            <p className="text-sm text-text-secondary">
              <span className="text-text-primary font-semibold">{goalLabel}</span> · Focus arena:{' '}
              <span className="text-text-primary font-semibold">
                {LIFE_ARENAS.find(arena => arena.id === (onboardingProfile?.focusArena ?? 'mind'))?.title}
              </span>{' '}
              · Cadence:{' '}
              <span className="text-text-primary font-semibold">{cadenceLabel}</span>
            </p>
          )}
        </div>
        <div className="bg-primary/40 border border-gray-700/60 rounded-2xl px-6 py-6 grid grid-cols-1 gap-3 w-full md:w-80">
          <StatPill icon={TrendingUp} label="Total reps" value={totalReps} />
          <StatPill icon={Target} label="Current streak" value={`${streaks.current} day${streaks.current === 1 ? '' : 's'}`} />
          <StatPill icon={Star} label="Best streak" value={`${streaks.longest} day${streaks.longest === 1 ? '' : 's'}`} />
          {cadenceLabel && <StatPill icon={SparklesIcon} label="Cadence" value={cadenceLabel} />}
        </div>
      </header>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <CheckBadgeIcon className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-semibold text-text-primary">Your code pillars</h2>
          </div>
          <ul className="space-y-3 text-sm text-text-secondary">
            {DEFAULT_VALUES.map(value => (
              <li key={value.title} className="bg-primary/30 border border-gray-700/60 rounded-xl p-4">
                <p className="text-sm font-semibold text-text-primary">{value.title}</p>
                <p>{value.description}</p>
              </li>
            ))}
          </ul>
          <button className="text-sm text-accent hover:text-accent-light underline" onClick={() => setView('community')}>
            Share your code with the community →
          </button>
        </div>

        <div className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-semibold text-text-primary">Arena reps</h2>
          </div>
          <div className="space-y-3">
            {arenaStats.map(stat => {
              const arenaMeta = LIFE_ARENAS.find(arena => arena.id === stat.id);
              const percent = Math.round((stat.completed / maxArenaCompletions) * 100);
              return (
                <div key={stat.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-text-primary">{arenaMeta?.title ?? stat.id}</span>
                    <span className="text-xs text-text-secondary">{stat.completed} rep{stat.completed === 1 ? '' : 's'}</span>
                  </div>
                  <div className="w-full bg-primary/30 border border-gray-700/60 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full bg-accent"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <HeartIcon className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-semibold text-text-primary">Mental readiness log</h2>
          {moodStatus.latest && (
            <span className={`text-xs ${MOOD_LABELS[moodStatus.latest.value].tone}`}>
              {MOOD_LABELS[moodStatus.latest.value].label}
            </span>
          )}
        </div>
        <p className="text-sm text-text-secondary">
          You can log your state from the dashboard. This feed keeps the last seven entries so you can notice patterns early.
        </p>
        {moodHistory.length ? (
          <ul className="space-y-2 text-sm text-text-secondary">
            {moodHistory.map((entry, index) => (
              <li
                key={`${entry.timestamp}-${index}`}
                className="bg-primary/30 border border-gray-700/60 rounded-xl px-4 py-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold ${MOOD_LABELS[entry.value].tone}`}>
                    {MOOD_LABELS[entry.value].label}
                  </span>
                  <span className="text-xs text-text-secondary uppercase tracking-wide">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </span>
                </div>
                {entry.note && <span className="text-xs text-text-secondary truncate max-w-xs">{entry.note}</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-text-secondary">No mood logs yet. Start with today’s check-in from the dashboard.</p>
        )}
        <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary">
          <button
            onClick={() => setView('dashboard')}
            className="text-sm text-accent hover:text-accent-light underline"
          >
            Log today’s mood →
          </button>
          {moodStatus.strainedRecentCount >= 2 && (
            <span className="text-red-300">
              Multiple strained check-ins recently—talk to the mentor or tap crisis resources.
            </span>
          )}
        </div>
      </section>

      <section className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Star className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-semibold text-text-primary">Badges</h2>
          <span className="text-xs text-text-secondary">
            {unlockedBadges.length} unlocked · {lockedBadges.length} to earn
          </span>
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
              <p className="text-xs uppercase tracking-wide">{badge.unlocked ? 'Unlocked' : 'In progress'}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-text-primary">Next arena rep</h2>
          </div>
          <p className="text-sm text-text-secondary">
            {recommendedArena
              ? `Focus on ${recommendedArena.title} today to balance your reps.`
              : 'Pick an arena and execute a challenge to keep momentum.'}
          </p>
          <button
            onClick={() => setView('challenges')}
            className="text-sm text-accent hover:text-accent-light underline"
          >
            Open challenges →
          </button>
        </div>
        <div className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-3">
            <BookOpenIcon className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-text-primary">Recommended tool</h2>
          </div>
          <p className="text-sm text-text-secondary">
            {recommendedTool ? recommendedTool.description : 'Review the Tools hub to run your systems refresh.'}
          </p>
          <button
            onClick={() => setView(recommendedTool ? recommendedTool.view : 'tools')}
            className="text-sm text-accent hover:text-accent-light underline"
          >
            {recommendedTool ? 'Launch recommended tool →' : 'Open tools →'}
          </button>
        </div>
      </section>

      <section className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <UsersIcon className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-semibold text-text-primary">Recent reps</h2>
        </div>
        {recentCompletions.length ? (
          <ul className="space-y-3 text-sm text-text-secondary">
            {recentCompletions.map(item => (
              <li key={item.id} className="bg-primary/30 border border-gray-700/60 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                  <p className="text-xs text-text-secondary uppercase tracking-wide">{item.arenaTitle}</p>
                </div>
                <span className="text-xs text-text-secondary">{item.date}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-text-secondary">No reps logged yet. Complete your first challenge to populate this timeline.</p>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-3">
            <SparklesIcon className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-text-primary">Share your momentum</h2>
          </div>
          <p className="text-sm text-text-secondary">
            Copy your current stats and drop them in the group chat or socials. Men sharpen men—bring a brother in.
          </p>
          <button
            onClick={handleCopyShare}
            className="px-4 py-2 rounded-lg bg-accent text-primary font-semibold hover:bg-accent/90 transition-colors"
          >
            {shareCopied ? 'Copied' : 'Copy progress summary'}
          </button>
        </div>
        <div className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-3">
            <CheckBadgeIcon className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-text-primary">Atlas Pro (coming soon)</h2>
          </div>
          <p className="text-sm text-text-secondary">
            Live group calls, deep-dive playbooks, and quarterly performance reviews. Invite two friends using your future code and you’ll unlock early access.
          </p>
          <button
            onClick={() => setView('community')}
            className="px-4 py-2 rounded-lg border border-gray-700/60 text-sm text-text-secondary hover:text-text-primary hover:border-accent/50 transition-colors"
          >
            Join the waitlist channel →
          </button>
        </div>
      </section>
    </div>
  );
};

interface StatPillProps {
  icon: React.FC<React.ComponentProps<'svg'>>;
  label: string;
  value: string | number;
}

const StatPill: React.FC<StatPillProps> = ({ icon: Icon, label, value }) => (
  <div className="bg-secondary/60 border border-gray-700/60 rounded-xl p-4 flex items-center gap-3">
    <Icon className="w-5 h-5 text-accent" />
    <div>
      <p className="text-lg font-semibold text-text-primary">{value}</p>
      <p className="text-xs text-text-secondary uppercase tracking-wide">{label}</p>
    </div>
  </div>
);

export default MyCodeScreen;
