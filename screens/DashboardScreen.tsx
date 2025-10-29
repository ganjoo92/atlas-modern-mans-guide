import React from 'react';
import FeatureCard from '../components/FeatureCard';
import type { View, ArenaType } from '../types';
import MoodCheckIn, { type MoodEntry } from '../components/MoodCheckIn';
import WeeklyReflection from '../components/WeeklyReflection';
import WinTracker from '../components/WinTracker';
import {
  SparklesIcon,
  BookOpenIcon,
  UsersIcon,
  CheckBadgeIcon,
  HeartIcon,
  ScissorsIcon,
  ClockIcon,
  TrendingUp,
  Settings,
  Target,
} from '../components/Icons';
import ArenaCard from '../components/ArenaCard';
import { LIFE_ARENAS } from '../constants';
import { WinEntry } from '../utils/weeklyPatternAnalysis';

interface DashboardScreenProps {
  setView: (view: View) => void;
  username?: string;
  recommendedArena?: { id: ArenaType; title: string; completed: number };
  recommendedTool?: { view: View; title: string; description: string };
  moodEntries: MoodEntry[];
  onLogMood: (entry: MoodEntry) => void;
  moodStatus: { latest: MoodEntry | null; strainedRecentCount: number };
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({
  setView,
  username = 'User',
  recommendedArena,
  recommendedTool,
  moodEntries,
  onLogMood,
  moodStatus,
}) => {
  const strainAlert = moodStatus.strainedRecentCount >= 2;
  const crisisAlert = moodStatus.strainedRecentCount >= 3;

  const priorityFlows = [
    {
      icon: SparklesIcon,
      title: 'AI Mentor',
      description: 'Tap into 24/7 guidance, reflection, and accountability.',
      view: 'mentor' as View,
    },
    {
      icon: ScissorsIcon,
      title: 'Style & Body Hub',
      description: 'Personalised grooming, style systems, and training plans.',
      view: 'grooming' as View,
    },
    {
      icon: TrendingUp,
      title: 'Progress Dashboard',
      description: 'Track your challenge streaks and arena momentum in one place.',
      view: 'progress' as View,
    },
    {
      icon: BookOpenIcon,
      title: 'Guides Library',
      description: 'Deep-dive playbooks for mindset, relationships, and focus.',
      view: 'guides' as View,
    },
  ];

  const expansionFlows = [
    {
      icon: HeartIcon,
      title: 'Dating Toolkit',
      description: 'AI prompts, message scripts, and date ideas tailored to you.',
      view: 'dating' as View,
    },
    {
      icon: CheckBadgeIcon,
      title: 'Challenge Tracker',
      description: 'Daily reps that stack momentum across every arena.',
      view: 'challenges' as View,
    },
    {
      icon: Settings,
      title: 'Practical Tools',
      description: 'Assessments, planners, and emergency resources on tap.',
      view: 'tools' as View,
    },
    {
      icon: UsersIcon,
      title: 'Community Hub',
      description: 'Share wins, ask for feedback, and connect with the tribe.',
      view: 'community' as View,
    },
    {
      icon: ClockIcon,
      title: 'Focus Mode',
      description: 'Drop into deep work with Pomodoro-style intervals.',
      view: 'focus' as View,
    },
  ];

  const todayStack = [
    recommendedArena
      ? {
          title: `Charge ${recommendedArena.title}`,
          description: `You have ${recommendedArena.completed} logged rep${recommendedArena.completed === 1 ? '' : 's'}. Hit that arena today.`,
          cta: 'Open Challenges',
          view: 'challenges' as View,
        }
      : {
          title: 'Complete 1 Challenge',
          description: 'Pick a quick win from the daily focus list and log it.',
          cta: 'Open Challenges',
          view: 'challenges' as View,
        },
    recommendedTool
      ? {
          title: recommendedTool.title,
          description: recommendedTool.description,
          cta: 'Go now',
          view: recommendedTool.view,
        }
      : {
          title: 'Review Today’s Plan',
          description: 'Skim your tools and calendar so nothing slips.',
          cta: 'Open Tools',
          view: 'tools' as View,
        },
    {
      title: 'Check in with Mentor',
      description: 'Drop a 2-minute voice or text note to stay accountable.',
      cta: 'Message Mentor',
      view: 'mentor' as View,
    },
  ];

  const orientationSteps = [
    {
      title: 'Run your baseline assessment',
      detail: 'Personalises every recommendation and mentor prompt.',
      view: 'tools' as View,
    },
    recommendedArena
      ? {
          title: `Lock in a ${recommendedArena.title} win`,
          detail: `This arena needs attention—grab a challenge and execute today.`,
          view: 'challenges' as View,
        }
      : {
          title: 'Pick one arena to focus on this week',
          detail: 'Rotate Mind, Heart, Body, Work, Soul for balanced growth.',
          view: 'guides' as View,
        },
    {
      title: 'Share a win or question',
      detail: 'Community reps build confidence faster than solo grind.',
      view: 'community' as View,
    },
  ];

  return (
    <div className="animate-fade-in space-y-10 pb-16 md:pb-0">
      <header className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary">Welcome, {username}</h1>
        <p className="text-lg md:text-xl text-text-secondary">
          Pick the stack that moves the needle today, then stay consistent across arenas.
        </p>
      </header>

      <section className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-4 md:p-6">
        <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700/70 pr-2">
          {todayStack.map(item => (
            <div key={item.title} className="min-w-[220px] md:min-w-0 bg-primary/30 border border-gray-700/60 rounded-xl p-4 space-y-3">
              <p className="text-sm font-semibold text-text-primary uppercase tracking-wide">{item.title}</p>
              <p className="text-sm text-text-secondary">{item.description}</p>
              <button
                onClick={() => setView(item.view)}
                className="text-sm text-accent hover:text-accent-light underline"
              >
                {item.cta} →
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-4 md:p-6">
        <MoodCheckIn onLog={onLogMood} recentEntries={moodEntries} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyReflection
          moodEntries={moodEntries}
          challengeCompletions={[]}
          mentorMessages={[]}
        />
        <WinTracker
          onWinLogged={(win: WinEntry) => {
            console.log('Win logged from dashboard:', win);
          }}
        />
      </section>

      {(strainAlert || crisisAlert) && (
        <section className={`border rounded-2xl p-5 ${crisisAlert ? 'bg-red-500/10 border-red-500/40' : 'bg-yellow-500/10 border-yellow-500/40'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <HeartIcon className="w-5 h-5 text-accent" />
                {crisisAlert ? 'Take care of your headspace now' : 'Your check-ins show strain'}
              </h3>
              <p className="text-sm text-text-secondary mt-1">
                {crisisAlert
                  ? 'Three strained check-ins in a row—pause, breathe, and reach out. Atlas is a tool, but pros are the backup.'
                  : 'You logged strain more than once recently. Talk it out or run a reset drill before it snowballs.'}
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={() => setView('mentor')}
                className="w-full md:w-auto px-4 py-2 rounded-lg bg-accent text-primary font-semibold hover:bg-accent/90 transition-colors"
              >
                Message mentor
              </button>
              <button
                onClick={() => setView('tools')}
                className="w-full md:w-auto px-4 py-2 rounded-lg border border-gray-700/60 text-sm text-text-secondary hover:text-text-primary hover:border-accent/50 transition-colors"
              >
                Crisis resources
              </button>
            </div>
          </div>
        </section>
      )}

      <section>
        <h2 className="text-3xl font-bold text-text-primary mb-4">Start With Your Priorities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {priorityFlows.map(flow => (
            <FeatureCard
              key={flow.view}
              icon={flow.icon}
              title={flow.title}
              description={flow.description}
              onClick={() => setView(flow.view)}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-text-primary mb-4">Explore Life Arenas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {LIFE_ARENAS.map(arena => (
            <ArenaCard key={arena.id} arena={arena} onClick={() => setView('guides')} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-text-primary mb-4">Deepen Your Momentum</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {expansionFlows.map(flow => (
            <FeatureCard
              key={flow.view}
              icon={flow.icon}
              title={flow.title}
              description={flow.description}
              onClick={() => setView(flow.view)}
            />
          ))}
        </div>
      </section>

      <section className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-semibold text-text-primary">New to Atlas? Start here.</h2>
        </div>
        <ol className="space-y-3 text-sm text-text-secondary list-decimal list-inside">
          {orientationSteps.map(step => (
            <li key={step.title} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-primary/30 border border-gray-700/60 rounded-xl p-4">
              <div>
                <p className="text-sm font-semibold text-text-primary">{step.title}</p>
                <p className="text-sm text-text-secondary">{step.detail}</p>
              </div>
              <button
                onClick={() => setView(step.view)}
                className="text-sm text-accent hover:text-accent-light underline self-start md:self-auto"
              >
                Jump in →
              </button>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};

export default DashboardScreen;
