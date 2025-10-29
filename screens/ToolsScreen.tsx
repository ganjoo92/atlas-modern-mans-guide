import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  Bell,
  TrendingUp,
  ChatBubbleLeftRightIcon,
  Shield,
  Target,
  UserIcon,
  SparklesIcon,
  CheckBadgeIcon,
  ChevronDown,
  ChevronUp,
  Settings,
  ClipboardDocumentCheckIcon,
  LightBulbIcon,
} from '../components/Icons';
import AssessmentScreen from './AssessmentScreen';
import AssessmentResultsScreen from './AssessmentResultsScreen';
import ProgressTrackingScreen from './ProgressTrackingScreen';
import MensSexualHealthScreen from './MensSexualHealthScreen';
import RecoveryToolsScreen from './RecoveryToolsScreen';
import AnalogPresenceScreen from './AnalogPresenceScreen';
import ResetPanel from '../components/ResetPanel';

interface Tool {
  id: ToolId;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  status: 'available' | 'coming-soon';
  category: 'assessment' | 'daily' | 'safety' | 'communication' | 'tracking';
  frequencyHint?: string;
}

type ToolId =
  | 'life-assessment'
  | 'date-planner'
  | 'grooming-reminders'
  | 'expense-tracker'
  | 'analog-presence'
  | 'conversation-practice'
  | 'emergency-support'
  | 'mens-sexual-health'
  | 'recovery-tools';

const TOOL_LIBRARY: Tool[] = [
  {
    id: 'life-assessment',
    name: 'Life Readiness Assessment',
    description: 'Comprehensive evaluation to discover your strengths and create a personalized growth plan.',
    icon: Target,
    color: 'text-accent',
    status: 'available',
    category: 'assessment',
    frequencyHint: 'Retake every 30 days',
  },
  {
    id: 'date-planner',
    name: 'Date Planning Assistant',
    description: 'Curated itineraries matched to vibe, budget, and city.',
    icon: Calendar,
    color: 'text-blue-400',
    status: 'available',
    category: 'daily',
    frequencyHint: 'Use before planning each date',
  },
  {
    id: 'grooming-reminders',
    name: 'Grooming Reminders',
    description: 'Automated reminders for self-care rituals and appointments.',
    icon: Bell,
    color: 'text-green-400',
    status: 'available',
    category: 'daily',
    frequencyHint: 'Set once, review monthly',
  },
  {
    id: 'expense-tracker',
    name: 'Experience & Grooming Budget',
    description: 'Keep an eye on date nights, training sessions, and personal upgrades.',
    icon: TrendingUp,
    color: 'text-yellow-400',
    status: 'available',
    category: 'tracking',
    frequencyHint: 'Update after each purchase',
  },
  {
    id: 'analog-presence',
    name: 'Analog Presence Lab',
    description: 'Train boredom tolerance, schedule device-free blocks, and rewire your baseline calm.',
    icon: LightBulbIcon,
    color: 'text-amber-200',
    status: 'available',
    category: 'daily',
    frequencyHint: 'Run 2-3 analog blocks weekly',
  },
  {
    id: 'conversation-practice',
    name: 'AI Script Lab',
    description: 'Practice respectful conversations before you hit send.',
    icon: ChatBubbleLeftRightIcon,
    color: 'text-purple-400',
    status: 'available',
    category: 'communication',
    frequencyHint: 'Run 5-minute drills weekly',
  },
  {
    id: 'emergency-support',
    name: 'Emergency Support',
    description: 'Instant access to crisis hotlines and trusted resources.',
    icon: Shield,
    color: 'text-red-400',
    status: 'available',
    category: 'safety',
  },
  {
    id: 'mens-sexual-health',
    name: 'Men’s Sexual Health',
    description: 'Private assessments, education, and actionable next steps for common sexual health concerns.',
    icon: SparklesIcon,
    color: 'text-purple-200',
    status: 'available',
    category: 'safety',
    frequencyHint: 'Review quarterly or whenever concerns arise',
  },
  {
    id: 'recovery-tools',
    name: 'Recovery Tools',
    description: 'Self-assessment, craving tracking, and evidence-based exercises for behavioral or substance addictions.',
    icon: CheckBadgeIcon,
    color: 'text-blue-200',
    status: 'available',
    category: 'safety',
    frequencyHint: 'Daily check-ins recommended during early recovery',
  },
];

const TOOL_SECTION_SPECS: Array<{ category: keyof typeof CATEGORY_META; defaultOpen?: boolean }> = [
  { category: 'assessment', defaultOpen: true },
  { category: 'daily' },
  { category: 'communication' },
  { category: 'tracking' },
  { category: 'safety' },
];

const TOOL_SECTION_GROUPS = TOOL_SECTION_SPECS.map(spec => ({
  ...spec,
  tools: TOOL_LIBRARY.filter(tool => tool.category === spec.category),
}));

const TOOL_CARD_CHUNK = 3;

const CATEGORY_META = {
  assessment: {
    title: 'Start Here',
    blurb: 'Establish your baseline and personalize the entire Atlas experience.',
  },
  daily: {
    title: 'Daily Momentum',
    blurb: 'Keep routines, dates, and grooming dialed with repeatable systems.',
  },
  communication: {
    title: 'Conversations & Confidence',
    blurb: 'Practice respectful language and stay sharp before big moments.',
  },
  tracking: {
    title: 'Track & Iterate',
    blurb: 'See where your time and money flow so you can iterate smarter.',
  },
  safety: {
    title: 'Safety & Support',
    blurb: 'Know exactly where to go when life throws a curveball.',
  },
} as const;

type ToolCompletion = Partial<Record<ToolId, { completedAt: Date | null; runs: number }>>;

const initialCompletionState: ToolCompletion = {
  'life-assessment': { completedAt: null, runs: 0 },
  'date-planner': { completedAt: null, runs: 0 },
  'grooming-reminders': { completedAt: null, runs: 0 },
  'expense-tracker': { completedAt: null, runs: 0 },
  'analog-presence': { completedAt: null, runs: 0 },
  'conversation-practice': { completedAt: null, runs: 0 },
  'emergency-support': { completedAt: null, runs: 0 },
  'mens-sexual-health': { completedAt: null, runs: 0 },
  'recovery-tools': { completedAt: null, runs: 0 },
};

const ToolsScreen: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<ToolId | null>(null);
  const [assessmentResults, setAssessmentResults] = useState<any>(null);
  const [showAssessment, setShowAssessment] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [completionState, setCompletionState] = useState<ToolCompletion>(initialCompletionState);

  const completedCount = useMemo(
    () =>
      Object.values(completionState).filter(entry => entry?.completedAt || (entry?.runs ?? 0) > 0)
        .length,
    [completionState]
  );
  const completionPercent = Math.round((completedCount / TOOL_LIBRARY.length) * 100);

  const handleToolLaunch = useCallback((toolId: ToolId) => {
    const tool = TOOL_LIBRARY.find(t => t.id === toolId);
    if (!tool || tool.status !== 'available') return;

    if (toolId === 'life-assessment') {
      setShowAssessment(true);
    } else {
      setSelectedTool(toolId);
    }
  }, []);

  const markToolUsed = (toolId: ToolId) => {
    setCompletionState(prev => {
      const existing = prev[toolId] ?? { completedAt: null, runs: 0 };
      return {
        ...prev,
        [toolId]: {
          completedAt: existing.completedAt ?? new Date(),
          runs: (existing.runs ?? 0) + 1,
        },
      };
    });
  };

  const handleAssessmentComplete = (results: any) => {
    setAssessmentResults(results);
    setShowAssessment(false);
    setShowResults(true);
    markToolUsed('life-assessment');
  };

  const handleRetakeAssessment = () => {
    setShowResults(false);
    setShowProgress(false);
    setShowAssessment(true);
  };

  const handleViewProgress = () => {
    setShowResults(false);
    setShowProgress(true);
  };

  const handleBackToTools = () => {
    setShowAssessment(false);
    setShowResults(false);
    setShowProgress(false);
    setSelectedTool(null);
  };

  if (showAssessment) {
    return <AssessmentScreen onComplete={handleAssessmentComplete} onBack={handleBackToTools} />;
  }

  if (showProgress) {
    return <ProgressTrackingScreen onBack={handleBackToTools} onRetakeAssessment={handleRetakeAssessment} />;
  }

  if (showResults && assessmentResults) {
    return (
      <AssessmentResultsScreen
        results={assessmentResults}
        onRetakeAssessment={handleRetakeAssessment}
        onStartCoaching={(area: string) => {
          console.log('Starting coaching for:', area);
        }}
        onViewProgress={handleViewProgress}
        setView={(view: string) => {
          console.log('Navigate to:', view);
        }}
      />
    );
  }

  const activeTool = TOOL_LIBRARY.find(tool => tool.id === selectedTool);

  return (
    <div className="animate-fade-in pb-16 md:pb-6 space-y-10">
      <ToolsHero completionPercent={completionPercent} completionState={completionState} />

      <QuickActions
        onLaunch={handleToolLaunch}
        completionState={completionState}
        assessmentResults={assessmentResults}
      />

      {!selectedTool && (
        <ToolSections
          onLaunch={handleToolLaunch}
          completionState={completionState}
        />
      )}
      {!selectedTool && (
        <ResetPanel
          onDataReset={() => {
            window.location.reload();
          }}
        />
      )}

      {selectedTool && activeTool && (
        selectedTool === 'mens-sexual-health' ? (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedTool(null)}
              className="text-sm text-accent hover:text-accent-light underline"
            >
              ← Back to all tools
            </button>
            <MensSexualHealthScreen onComplete={() => markToolUsed('mens-sexual-health')} />
          </div>
        ) : selectedTool === 'recovery-tools' ? (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedTool(null)}
              className="text-sm text-accent hover:text-accent-light underline"
            >
              ← Back to all tools
            </button>
            <RecoveryToolsScreen onComplete={() => markToolUsed('recovery-tools')} />
          </div>
        ) : selectedTool === 'analog-presence' ? (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedTool(null)}
              className="text-sm text-accent hover:text-accent-light underline"
            >
              ← Back to all tools
            </button>
            <AnalogPresenceScreen onComplete={() => markToolUsed('analog-presence')} />
          </div>
        ) : (
          <ActiveToolPanel
            tool={activeTool}
            onBack={() => setSelectedTool(null)}
            onComplete={() => markToolUsed(activeTool.id)}
          />
        )
      )}

      <QuickWins />

      <SuggestionRail completionState={completionState} onLaunch={handleToolLaunch} />
    </div>
  );
};

const ToolsHero: React.FC<{ completionPercent: number; completionState: ToolCompletion }> = ({
  completionPercent,
  completionState,
}) => {
  const lastAssessment = completionState['life-assessment']?.completedAt;
  return (
    <header className="bg-secondary/70 border border-gray-700/60 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div className="space-y-3 max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-primary/40 border border-gray-700/60 text-xs uppercase tracking-wide text-accent px-3 py-1 rounded-full">
          <Settings className="w-4 h-4" />
          <span>Practical Tools</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary">Systems That Keep You Sharp</h1>
        <p className="text-lg text-text-secondary">
          Run the rituals that raise your baseline—assess, plan, communicate, and protect. Every tool feeds the bigger Atlas
          journey.
        </p>
        {lastAssessment && (
          <p className="text-sm text-accent">
            Last assessment completed {lastAssessment.toLocaleDateString()} · retake every 30 days to keep your plan fresh.
          </p>
        )}
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
          System load complete when every tool has been activated once. Iterate weekly to keep momentum.
        </p>
      </div>
    </header>
  );
};

const QuickActions: React.FC<{
  onLaunch: (toolId: ToolId) => void;
  completionState: ToolCompletion;
  assessmentResults: any;
}> = ({ onLaunch, completionState, assessmentResults }) => {
  const quickCards = [
    {
      title: 'Run Assessment',
      description: 'It’s been a while—retake it to refresh your plan.',
      icon: Target,
      action: () => onLaunch('life-assessment'),
      show: !completionState['life-assessment']?.completedAt,
    },
    {
      title: 'View Latest Results',
      description: 'See your scores and coaching path at a glance.',
      icon: TrendingUp,
      action: assessmentResults ? () => onLaunch('life-assessment') : null,
      show: Boolean(assessmentResults),
    },
    {
      title: 'Schedule Grooming Reminders',
      description: 'Lock in routines so confidence stays automatic.',
      icon: Bell,
      action: () => onLaunch('grooming-reminders'),
      show: true,
    },
    {
      title: 'Analog presence reset',
      description: 'Book a boredom workout to lower anxiety and boost creativity.',
      icon: LightBulbIcon,
      action: () => onLaunch('analog-presence'),
      show: true,
    },
    {
      title: 'Plan Your Next Date',
      description: 'Generate a chemistry-building itinerary in minutes.',
      icon: Calendar,
      action: () => onLaunch('date-planner'),
      show: true,
    },
    {
      title: 'Check sexual health',
      description: 'Run the private module—log symptoms, get drills, and know when to call a specialist.',
      icon: SparklesIcon,
      action: () => onLaunch('mens-sexual-health'),
      show: true,
    },
    {
      title: 'Recovery check-in',
      description: 'Log cravings, review coping plans, and strengthen your recovery reps.',
      icon: CheckBadgeIcon,
      action: () => onLaunch('recovery-tools'),
      show: true,
    },
  ].filter(card => card.show && card.action);

  if (!quickCards.length) return null;

  return (
    <section className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-4 md:p-6">
      <div className="flex md:grid md:grid-cols-2 gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700/70">
        {quickCards.map(card => {
          const Icon = card.icon;
          return (
            <button
              key={card.title}
              onClick={card.action ?? (() => {})}
              className="min-w-[220px] md:min-w-0 flex items-center justify-between gap-4 bg-primary/30 border border-gray-700/60 rounded-2xl px-5 py-4 text-left hover:border-accent/50 hover:text-text-primary transition-all"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-accent" />
                  <span className="font-semibold text-text-primary">{card.title}</span>
                </div>
                <p className="text-sm text-text-secondary mt-1">{card.description}</p>
              </div>
              <ChevronRightGlyph />
            </button>
          );
        })}
      </div>
    </section>
  );
};

type ToolSectionsProps = {
  onLaunch: (toolId: ToolId) => void;
  completionState: ToolCompletion;
};

const ToolSectionsComponent: React.FC<ToolSectionsProps> = ({ onLaunch, completionState }) => (
  <div className="space-y-6">
    {TOOL_SECTION_GROUPS.map(section => (
      <CollapsibleToolSection
        key={section.category}
        category={section.category}
        tools={section.tools}
        onLaunch={onLaunch}
        completionState={completionState}
        defaultOpen={section.defaultOpen}
      />
    ))}
  </div>
);

const ToolSections = React.memo(ToolSectionsComponent);

const CollapsibleToolSection: React.FC<{
  category: keyof typeof CATEGORY_META;
  tools: Tool[];
  onLaunch: (toolId: ToolId) => void;
  completionState: ToolCompletion;
  defaultOpen?: boolean;
}> = ({ category, tools, onLaunch, completionState, defaultOpen = false }) => {
  const [isExpanded, setExpanded] = useState(defaultOpen);
  const [chunkCount, setChunkCount] = useState(1);
  const meta = CATEGORY_META[category];

  useEffect(() => {
    if (!isExpanded) {
      setChunkCount(1);
    }
  }, [isExpanded]);

  const visibleTools = useMemo(
    () => tools.slice(0, chunkCount * TOOL_CARD_CHUNK),
    [tools, chunkCount]
  );

  const hasMoreTools = visibleTools.length < tools.length;

  return (
    <section className="bg-secondary/60 border border-gray-700/60 rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded(prev => !prev)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-secondary/50 transition-colors"
      >
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">{meta.title}</h2>
          <p className="text-sm text-text-secondary">{meta.blurb}</p>
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5 text-text-secondary" /> : <ChevronDown className="w-5 h-5 text-text-secondary" />}
      </button>
      {isExpanded && (
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {visibleTools.map(tool => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onLaunch={onLaunch}
                completionState={completionState[tool.id]}
              />
            ))}
          </div>
          {hasMoreTools && (
            <div className="flex justify-center">
              <button
                onClick={() => setChunkCount(prev => prev + 1)}
                className="px-4 py-2 rounded-lg border border-gray-700/60 text-xs text-text-secondary hover:text-text-primary hover:border-accent/40 transition-colors"
              >
                Show more tools
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

const ToolCard: React.FC<{
  tool: Tool;
  onLaunch: (toolId: ToolId) => void;
  completionState?: { completedAt: Date | null; runs: number };
}> = ({ tool, onLaunch, completionState }) => {
  const Icon = tool.icon;
  const completed = Boolean(completionState?.completedAt || (completionState?.runs ?? 0) > 0);
  return (
    <div className="bg-primary/30 border border-gray-700/60 rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-primary/40 border border-gray-700/60 flex items-center justify-center">
          <Icon className={`w-6 h-6 ${tool.color}`} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">{tool.name}</h3>
          {completed && (
            <p className="text-xs text-accent flex items-center gap-2">
              <SparklesIcon className="w-4 h-4" />
              Ready when you are
            </p>
          )}
          {!completed && tool.frequencyHint && (
            <p className="text-xs text-text-secondary">{tool.frequencyHint}</p>
          )}
        </div>
      </div>
      <p className="text-sm text-text-secondary flex-1">{tool.description}</p>
      <div className="flex gap-2 items-center justify-between">
        <button
          onClick={() => onLaunch(tool.id)}
          disabled={tool.status !== 'available'}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tool.status === 'available'
              ? 'bg-accent text-primary hover:bg-accent/90'
              : 'bg-gray-700 text-text-secondary cursor-not-allowed'
          }`}
        >
          {completed ? 'Run again' : 'Launch'}
        </button>
        {tool.status === 'available' && (
          <button className="text-xs text-text-secondary hover:text-text-primary underline">
            View guide
          </button>
        )}
      </div>
    </div>
  );
};

const ActiveToolPanel: React.FC<{
  tool: Tool;
  onBack: () => void;
  onComplete: () => void;
}> = ({ tool, onBack, onComplete }) => {
  return (
    <section className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-6 space-y-6">
      <button onClick={onBack} className="text-sm text-accent hover:text-accent-light underline">
        ← Back to all tools
      </button>
      <div className="flex items-center gap-3">
        <tool.icon className={`w-6 h-6 ${tool.color}`} />
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">{tool.name}</h2>
          <p className="text-sm text-text-secondary">{tool.description}</p>
        </div>
      </div>
      <div className="bg-primary/30 border border-gray-700/60 rounded-xl p-4 text-sm text-text-secondary space-y-3">
        <p className="font-semibold text-text-primary">This tool is being rebuilt with deeper functionality.</p>
        <p>
          For now, revisit the old experience in the previous release—or plug into the Dating Toolkit for a closer look at how
          the new modular flow will feel.
        </p>
        <p className="text-xs text-text-secondary/80">
          Need something immediately? Talk to the AI Mentor and ask for the “{tool.name} quick workaround.”
        </p>
      </div>
      <button
        onClick={onComplete}
        className="bg-accent text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-accent/90 transition-colors"
      >
        Mark complete for now
      </button>
    </section>
  );
};

const QuickWins = () => {
  const tips = [
    {
      title: 'Sunday systems check',
      description: 'Review reminders, budget, and upcoming dates in one 20-minute block. Fewer surprises during the week.',
      icon: Calendar,
    },
    {
      title: 'Mentor sync',
      description: 'After every tool run, drop insights into the AI Mentor. Builds context the coach can reference later.',
      icon: SparklesIcon,
    },
    {
      title: 'Tag your wins',
      description: 'Log tool completions as challenges. Seeing streaks climb reinforces the habits behind progress.',
      icon: CheckBadgeIcon,
    },
  ];

  return (
    <section className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <ClipboardDocumentCheckIcon className="w-5 h-5 text-accent" />
        <h2 className="text-xl font-semibold text-text-primary">Quick wins this week</h2>
      </div>
      <ul className="space-y-3">
        {tips.map(tip => (
          <li key={tip.title} className="bg-primary/30 border border-gray-700/60 rounded-xl p-4 flex gap-3 items-start">
            <tip.icon className="w-5 h-5 text-accent mt-1" />
            <div>
              <p className="text-sm font-semibold text-text-primary">{tip.title}</p>
              <p className="text-sm text-text-secondary">{tip.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

const SuggestionRail: React.FC<{
  completionState: ToolCompletion;
  onLaunch: (toolId: ToolId) => void;
}> = ({ completionState, onLaunch }) => {
  const suggestions = [
    {
      title: 'Log gains as challenges',
      description: 'Turn each completed tool into momentum by logging it as a challenge. Keeps streaks alive.',
      actionLabel: 'Open Challenges',
      icon: CheckBadgeIcon,
      action: () => console.log('Navigate to challenges'),
    },
    {
      title: 'Mentor hand-off',
      description: 'Ask the mentor, “How should I integrate the Life Assessment with my current focus?”',
      actionLabel: 'Open Mentor',
      icon: SparklesIcon,
      action: () => console.log('Navigate to mentor'),
    },
    {
      title: 'Review safety plan',
      description: completionState['emergency-support']?.completedAt
        ? 'Refresh emergency contacts so the info stays accurate.'
        : 'Set up your emergency resources before you need them.',
      actionLabel: 'Open Safety Tool',
      icon: Shield,
      action: () => onLaunch('emergency-support'),
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {suggestions.map(card => (
        <div key={card.title} className="bg-secondary/60 border border-gray-700/60 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <card.icon className="w-5 h-5 text-accent" />
            <p className="text-sm font-semibold text-text-primary">{card.title}</p>
          </div>
          <p className="text-sm text-text-secondary">{card.description}</p>
          <button onClick={card.action} className="text-sm text-accent hover:text-accent-light underline">
            {card.actionLabel}
          </button>
        </div>
      ))}
    </section>
  );
};

const ChevronRightGlyph: React.FC = () => (
  <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default ToolsScreen;
