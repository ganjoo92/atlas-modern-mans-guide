import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, ClockIcon, Star, Award, Flame, BookOpenIcon } from './Icons';
import { AchievementBadge, Achievement } from './AchievementSystem';
import { achievementManager } from '../utils/achievementManager';

interface ReadingStats {
  totalArticlesRead: number;
  totalReadingTime: number; // in minutes
  currentStreak: number;
  longestStreak: number;
  averageReadingTime: number;
  completionRate: number;
  favoriteArena: string;
  recentActivity: ReadingActivity[];
  weeklyGoalProgress: number;
  monthlyGoalProgress: number;
}

interface ReadingActivity {
  date: string;
  articlesRead: number;
  timeSpent: number; // in minutes
}

interface ArenaProgress {
  arena: string;
  completed: number;
  total: number;
  percentage: number;
  color: string;
}

export const ReadingAnalyticsDashboard: React.FC = () => {
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [arenaProgress, setArenaProgress] = useState<ArenaProgress[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    loadAnalytics();
  }, [selectedTimeframe]);

  const loadAnalytics = () => {
    // This would normally fetch from an API or local storage
    // For now, we'll generate mock data based on actual stored data
    const mockStats: ReadingStats = {
      totalArticlesRead: getCompletedArticlesCount(),
      totalReadingTime: getTotalReadingTime(),
      currentStreak: getCurrentStreak(),
      longestStreak: getLongestStreak(),
      averageReadingTime: getAverageReadingTime(),
      completionRate: getCompletionRate(),
      favoriteArena: getFavoriteArena(),
      recentActivity: getRecentActivity(),
      weeklyGoalProgress: getWeeklyProgress(),
      monthlyGoalProgress: getMonthlyProgress()
    };

    setStats(mockStats);
    setArenaProgress(getArenaProgress());
    setAchievements(achievementManager.getAchievements());
  };

  // Helper functions to calculate stats from localStorage
  const getCompletedArticlesCount = (): number => {
    const progress = getAllReadingProgress();
    return Object.values(progress).filter(p => p === 100).length;
  };

  const getTotalReadingTime = (): number => {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('totalReadingTime_')) {
        total += parseInt(localStorage.getItem(key) || '0');
      }
    }
    return Math.round(total / 60); // Convert seconds to minutes
  };

  const getCurrentStreak = (): number => {
    return parseInt(localStorage.getItem('currentReadingStreak') || '0');
  };

  const getLongestStreak = (): number => {
    return parseInt(localStorage.getItem('longestReadingStreak') || '0');
  };

  const getAverageReadingTime = (): number => {
    const total = getTotalReadingTime();
    const articles = getCompletedArticlesCount();
    return articles > 0 ? Math.round(total / articles) : 0;
  };

  const getCompletionRate = (): number => {
    const progress = getAllReadingProgress();
    const totalArticles = Object.keys(progress).length;
    const completedArticles = Object.values(progress).filter(p => p === 100).length;
    return totalArticles > 0 ? Math.round((completedArticles / totalArticles) * 100) : 0;
  };

  const getFavoriteArena = (): string => {
    // This would analyze which arena has the most completed articles
    return 'Mind'; // Placeholder
  };

  const getRecentActivity = (): ReadingActivity[] => {
    // Generate last 7 days of activity
    const activities: ReadingActivity[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      activities.push({
        date: date.toLocaleDateString(),
        articlesRead: Math.floor(Math.random() * 3), // Mock data
        timeSpent: Math.floor(Math.random() * 60) + 10 // Mock data
      });
    }
    return activities;
  };

  const getWeeklyProgress = (): number => {
    // Mock weekly goal progress (goal: 3 articles per week)
    const weeklyGoal = 3;
    const thisWeekRead = 2; // This would be calculated from actual data
    return Math.min((thisWeekRead / weeklyGoal) * 100, 100);
  };

  const getMonthlyProgress = (): number => {
    // Mock monthly goal progress (goal: 12 articles per month)
    const monthlyGoal = 12;
    const thisMonthRead = 7; // This would be calculated from actual data
    return Math.min((thisMonthRead / monthlyGoal) * 100, 100);
  };

  const getAllReadingProgress = (): {[key: number]: number} => {
    const progress: {[key: number]: number} = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('readingProgress_')) {
        const articleId = parseInt(key.replace('readingProgress_', ''));
        progress[articleId] = parseInt(localStorage.getItem(key) || '0');
      }
    }
    return progress;
  };

  const getArenaProgress = (): ArenaProgress[] => {
    return [
      { arena: 'Mind', completed: 4, total: 8, percentage: 50, color: 'text-blue-400' },
      { arena: 'Heart', completed: 3, total: 6, percentage: 50, color: 'text-red-400' },
      { arena: 'Body', completed: 2, total: 5, percentage: 40, color: 'text-green-400' },
      { arena: 'Soul', completed: 1, total: 4, percentage: 25, color: 'text-purple-400' },
      { arena: 'Work', completed: 2, total: 7, percentage: 29, color: 'text-yellow-400' }
    ];
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return `${hours}h ${remainingMins}m`;
  };

  if (!stats) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-700 rounded mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const recentAchievements = achievements.filter(a => a.unlocked).slice(-3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-text-primary">Your Reading Journey</h2>
          <p className="text-text-secondary mt-1">Track your progress and celebrate your growth</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {(['week', 'month', 'year'] as const).map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTimeframe === timeframe
                  ? 'bg-accent text-primary'
                  : 'bg-secondary text-text-secondary hover:text-accent'
              }`}
            >
              {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-secondary rounded-lg p-6 text-center">
          <BookOpenIcon className="h-8 w-8 text-accent mx-auto mb-3" />
          <div className="text-3xl font-bold text-text-primary">{stats.totalArticlesRead}</div>
          <div className="text-sm text-text-secondary">Articles Completed</div>
        </div>

        <div className="bg-secondary rounded-lg p-6 text-center">
          <ClockIcon className="h-8 w-8 text-green-400 mx-auto mb-3" />
          <div className="text-3xl font-bold text-text-primary">{formatTime(stats.totalReadingTime)}</div>
          <div className="text-sm text-text-secondary">Time Invested</div>
        </div>

        <div className="bg-secondary rounded-lg p-6 text-center">
          <Flame className="h-8 w-8 text-orange-400 mx-auto mb-3" />
          <div className="text-3xl font-bold text-text-primary">{stats.currentStreak}</div>
          <div className="text-sm text-text-secondary">Day Streak</div>
        </div>

        <div className="bg-secondary rounded-lg p-6 text-center">
          <Target className="h-8 w-8 text-purple-400 mx-auto mb-3" />
          <div className="text-3xl font-bold text-text-primary">{stats.completionRate}%</div>
          <div className="text-sm text-text-secondary">Completion Rate</div>
        </div>
      </div>

      {/* Goals Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-secondary rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Weekly Goal</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">3 articles per week</span>
              <span className="text-accent font-medium">{stats.weeklyGoalProgress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-accent h-3 rounded-full transition-all duration-300"
                style={{ width: `${stats.weeklyGoalProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-secondary rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Monthly Goal</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary">12 articles per month</span>
              <span className="text-accent font-medium">{stats.monthlyGoalProgress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-accent h-3 rounded-full transition-all duration-300"
                style={{ width: `${stats.monthlyGoalProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Arena Progress */}
      <div className="bg-secondary rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-6">Progress by Life Arena</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {arenaProgress.map((arena) => (
            <div key={arena.arena} className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-gray-700"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${arena.percentage * 2.26} 226`}
                    className={arena.color}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-text-primary">
                    {arena.percentage}%
                  </span>
                </div>
              </div>
              <h4 className="font-medium text-text-primary">{arena.arena}</h4>
              <p className="text-xs text-text-secondary">
                {arena.completed}/{arena.total} completed
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <div className="bg-secondary rounded-lg p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-6">Recent Achievements</h3>
          <div className="flex items-center space-x-6">
            {recentAchievements.map((achievement) => (
              <div key={achievement.id} className="text-center">
                <AchievementBadge achievement={achievement} size="medium" showProgress={false} />
                <h4 className="text-sm font-medium text-text-primary mt-2">
                  {achievement.title}
                </h4>
                <p className="text-xs text-text-secondary">
                  {achievement.unlockedAt && new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Heatmap */}
      <div className="bg-secondary rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-6">Reading Activity</h3>
        <div className="grid grid-cols-7 gap-2">
          {stats.recentActivity.map((activity, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-text-secondary mb-2">
                {new Date(activity.date).toLocaleDateString('en', { weekday: 'short' })}
              </div>
              <div 
                className={`w-full h-8 rounded flex items-center justify-center text-xs font-medium ${
                  activity.articlesRead > 0 
                    ? 'bg-accent text-primary' 
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {activity.articlesRead}
              </div>
              <div className="text-xs text-text-secondary mt-1">
                {formatTime(activity.timeSpent)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">💡 Insights</h3>
        <div className="space-y-3 text-sm">
          <p className="text-text-secondary">
            <span className="text-accent font-medium">Great momentum!</span> 
            {` You've read ${stats.totalArticlesRead} articles and spent ${formatTime(stats.totalReadingTime)} learning. `}
            {stats.currentStreak > 0 && `Your ${stats.currentStreak}-day streak shows real commitment.`}
          </p>
          
          {stats.averageReadingTime > 0 && (
            <p className="text-text-secondary">
              <span className="text-accent font-medium">Reading pace:</span>
              {` You average ${formatTime(stats.averageReadingTime)} per article. `}
              {stats.averageReadingTime < 10 
                ? "Consider slowing down to absorb more deeply."
                : "You're taking time to really absorb the content."
              }
            </p>
          )}

          <p className="text-text-secondary">
            <span className="text-accent font-medium">Next milestone:</span>
            {` ${stats.totalArticlesRead < 5 
              ? "Complete your first 5 articles to unlock the Knowledge Seeker achievement!"
              : stats.totalArticlesRead < 25
                ? `${25 - stats.totalArticlesRead} more articles to become a Completionist!`
                : "You're a true learning champion! Keep exploring new areas."
            }`}
          </p>
        </div>
      </div>
    </div>
  );
};