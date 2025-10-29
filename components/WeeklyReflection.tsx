import React, { useState, useEffect } from 'react';
import { WeeklyReflection as WeeklyReflectionType, getMostRecentReflection, shouldGenerateWeeklyReflection } from '../utils/weeklyPatternAnalysis';
import { createWeeklyReflectionForUser, generateSampleReflection } from '../utils/weeklyReflectionGenerator';
import { MoodEntry } from './MoodCheckIn';
import { SparklesIcon, TrendingUpIcon, CalendarIcon, Target, ChevronDownIcon, ChevronUpIcon, RefreshIcon } from './Icons';

interface WeeklyReflectionProps {
  moodEntries: MoodEntry[];
  challengeCompletions?: any[];
  mentorMessages?: any[];
  className?: string;
}

const WeeklyReflection: React.FC<WeeklyReflectionProps> = ({
  moodEntries,
  challengeCompletions = [],
  mentorMessages = [],
  className = ''
}) => {
  const [reflection, setReflection] = useState<WeeklyReflectionType | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReflection();
  }, []);

  const loadReflection = () => {
    const mostRecent = getMostRecentReflection();
    if (mostRecent) {
      setReflection(mostRecent);
    } else {
      // Show sample reflection if no real data exists
      setReflection(generateSampleReflection());
    }
  };

  const generateNewReflection = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const newReflection = await createWeeklyReflectionForUser(
        moodEntries,
        challengeCompletions,
        mentorMessages
      );

      if (newReflection) {
        setReflection(newReflection);
        setIsExpanded(true);
      } else {
        setError('Failed to generate reflection. Using sample data.');
        setReflection(generateSampleReflection());
      }
    } catch (error) {
      console.error('Error generating reflection:', error);
      setError('Unable to generate reflection. Check your connection.');
    } finally {
      setIsGenerating(false);
    }
  };

  const formatWeekRange = (weekStart: string, weekEnd: string) => {
    const start = new Date(weekStart);
    const end = new Date(weekEnd);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  const getArenaIcon = (arena: string, count: number) => {
    if (count === 0) return null;
    return (
      <div key={arena} className="flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full bg-accent`}></div>
        <span className="text-xs text-text-secondary capitalize">{arena} ({count})</span>
      </div>
    );
  };

  const getMoodTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-400';
      case 'declining': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  if (!reflection) {
    return (
      <div className={`bg-secondary/60 border border-gray-700/60 rounded-2xl p-6 ${className}`}>
        <div className="text-center">
          <SparklesIcon className="w-8 h-8 text-accent mx-auto mb-3" />
          <p className="text-text-secondary">No weekly reflection available yet.</p>
          <button
            onClick={generateNewReflection}
            disabled={isGenerating}
            className="mt-3 px-4 py-2 bg-accent text-primary rounded-lg font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate Reflection'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-secondary/60 border border-gray-700/60 rounded-2xl p-6 space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <TrendingUpIcon className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Weekly Reflection</h3>
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <CalendarIcon className="w-3 h-3" />
              <span>{formatWeekRange(reflection.weekPattern.weekStart, reflection.weekPattern.weekEnd)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {shouldGenerateWeeklyReflection() && (
            <button
              onClick={generateNewReflection}
              disabled={isGenerating}
              className="p-2 text-text-secondary hover:text-accent transition-colors"
              title="Generate new reflection"
            >
              <RefreshIcon className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-text-secondary hover:text-accent transition-colors"
          >
            {isExpanded ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-primary/30 border border-gray-700/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <SparklesIcon className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-text-primary leading-relaxed">{reflection.aiSummary}</p>
            {error && (
              <p className="text-xs text-yellow-400 mt-2 italic">{error}</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-primary/20 border border-gray-700/30 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-accent">{reflection.weekPattern.totalWins}</div>
          <div className="text-xs text-text-secondary">Total Wins</div>
        </div>
        <div className="bg-primary/20 border border-gray-700/30 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-accent">{reflection.weekPattern.focusPeakDay}</div>
          <div className="text-xs text-text-secondary">Peak Day</div>
        </div>
        <div className="bg-primary/20 border border-gray-700/30 rounded-lg p-3 text-center">
          <div className={`text-lg font-bold ${getMoodTrendColor(reflection.weekPattern.moodTrend)}`}>
            {reflection.weekPattern.moodTrend === 'improving' ? '↗' :
             reflection.weekPattern.moodTrend === 'declining' ? '↘' : '→'}
          </div>
          <div className="text-xs text-text-secondary">Mood Trend</div>
        </div>
        <div className="bg-primary/20 border border-gray-700/30 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-accent">{reflection.weekPattern.challengesCompleted}</div>
          <div className="text-xs text-text-secondary">Challenges</div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="space-y-4 border-t border-gray-700/30 pt-4">
          {/* Arena Breakdown */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-2">Arena Performance</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(reflection.weekPattern.winsByArena).map(([arena, count]) =>
                getArenaIcon(arena, count)
              ).filter(Boolean)}
              {Object.values(reflection.weekPattern.winsByArena).every(count => count === 0) && (
                <span className="text-xs text-text-secondary italic">No arena wins logged this week</span>
              )}
            </div>
          </div>

          {/* Suggested Actions */}
          {reflection.suggestedActions.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-accent" />
                Next Week Focus
              </h4>
              <div className="space-y-2">
                {reflection.suggestedActions.map((action, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-text-secondary">{action}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weekly Insights */}
          {reflection.weekPattern.insights.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-2">Key Insights</h4>
              <div className="space-y-1">
                {reflection.weekPattern.insights.map((insight, index) => (
                  <p key={index} className="text-xs text-text-secondary">• {insight}</p>
                ))}
              </div>
            </div>
          )}

          {/* Generation timestamp */}
          <div className="text-xs text-text-secondary opacity-70 text-center pt-2">
            Generated {new Date(reflection.generatedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyReflection;