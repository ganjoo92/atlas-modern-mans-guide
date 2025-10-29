import React from 'react';
import { Award, Target, Flame, Crown, Star, TrendingUp } from './Icons';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.FC<React.ComponentProps<'svg'>>;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: number;
  category: 'reading' | 'streak' | 'completion' | 'mastery' | 'engagement';
}

interface AchievementBadgeProps {
  achievement: Achievement;
  showProgress?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const rarityColors = {
  common: 'text-gray-400 border-gray-400',
  rare: 'text-blue-400 border-blue-400',
  epic: 'text-purple-400 border-purple-400',
  legendary: 'text-yellow-400 border-yellow-400'
};

const rarityGradients = {
  common: 'from-gray-400 to-gray-500',
  rare: 'from-blue-400 to-blue-500',
  epic: 'from-purple-400 to-purple-500',
  legendary: 'from-yellow-400 to-yellow-500'
};

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ 
  achievement, 
  showProgress = true, 
  size = 'medium' 
}) => {
  const IconComponent = achievement.icon || Star; // Fallback to Star if icon is undefined
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-20 h-20'
  };

  const iconSizes = {
    small: 'h-5 w-5',
    medium: 'h-6 w-6',
    large: 'h-8 w-8'
  };

  const isCompleted = achievement.unlocked;
  const progressPercent = Math.round((achievement.progress / achievement.maxProgress) * 100);

  // Ensure IconComponent is a valid React component
  if (typeof IconComponent !== 'function') {
    console.warn('Invalid icon component for achievement:', achievement.id);
    return (
      <div className={`${sizeClasses[size]} rounded-full border-2 border-gray-600 bg-gray-700 flex items-center justify-center`}>
        <span className="text-gray-400">?</span>
      </div>
    );
  }

  return (
    <div className={`relative ${isCompleted ? 'opacity-100' : 'opacity-60'}`}>
      {/* Badge Circle */}
      <div className={`
        ${sizeClasses[size]} 
        rounded-full border-2 
        ${isCompleted ? rarityColors[achievement.rarity] : 'border-gray-600 text-gray-500'}
        ${isCompleted ? `bg-gradient-to-br ${rarityGradients[achievement.rarity]}` : 'bg-gray-700'}
        flex items-center justify-center
        transition-all duration-300 hover:scale-105
        ${isCompleted ? 'shadow-lg' : ''}
      `}>
        <IconComponent className={`${iconSizes[size]} ${isCompleted ? 'text-white' : 'text-gray-400'}`} />
        
        {/* Completed Checkmark */}
        {isCompleted && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
        )}
      </div>

      {/* Progress Ring for Incomplete Achievements */}
      {!isCompleted && showProgress && achievement.progress > 0 && (
        <svg className={`absolute inset-0 ${sizeClasses[size]} transform -rotate-90`}>
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="rgba(59, 130, 246, 0.3)"
            strokeWidth="2"
          />
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="none"
            stroke="rgb(59, 130, 246)"
            strokeWidth="2"
            strokeDasharray={`${progressPercent * 2.83} 283`}
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
};

interface AchievementCardProps {
  achievement: Achievement;
  isNew?: boolean;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, isNew = false }) => {
  const progressPercent = Math.round((achievement.progress / achievement.maxProgress) * 100);

  return (
    <div className={`
      bg-secondary rounded-lg p-4 border 
      ${achievement.unlocked ? 'border-accent/30' : 'border-gray-600'}
      ${isNew ? 'ring-2 ring-accent animate-pulse' : ''}
      transition-all duration-300 hover:border-accent/50
    `}>
      <div className="flex items-start space-x-4">
        <AchievementBadge achievement={achievement} size="medium" />
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`font-semibold ${achievement.unlocked ? 'text-text-primary' : 'text-text-secondary'}`}>
              {achievement.title}
            </h3>
            {isNew && (
              <span className="text-xs px-2 py-1 bg-accent text-primary rounded-full font-medium">
                NEW!
              </span>
            )}
          </div>
          
          <p className="text-sm text-text-secondary mb-3">
            {achievement.description}
          </p>

          {/* Progress Bar */}
          {!achievement.unlocked && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">
                  Progress: {achievement.progress}/{achievement.maxProgress}
                </span>
                <span className="text-accent font-medium">{progressPercent}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Completion Info */}
          {achievement.unlocked && achievement.unlockedAt && (
            <div className="text-xs text-green-400">
              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface AchievementToastProps {
  achievement: Achievement;
  onClose: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 bg-secondary border border-accent rounded-lg p-4 shadow-lg max-w-sm animate-slide-in-right">
      <div className="flex items-center space-x-3">
        <AchievementBadge achievement={achievement} size="small" showProgress={false} />
        
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <Crown className="h-4 w-4 text-accent" />
            <span className="text-accent font-semibold text-sm">Achievement Unlocked!</span>
          </div>
          <h4 className="font-medium text-text-primary text-sm">{achievement.title}</h4>
          <p className="text-xs text-text-secondary">{achievement.description}</p>
        </div>
        
        <button
          onClick={onClose}
          className="text-text-secondary hover:text-accent transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// Predefined achievements
export const createAchievements = (): Achievement[] => [
  {
    id: 'first_article',
    title: 'Getting Started',
    description: 'Complete your first article',
    icon: Star,
    rarity: 'common',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    category: 'reading'
  },
  {
    id: 'five_articles',
    title: 'Knowledge Seeker',
    description: 'Complete 5 articles',
    icon: Target,
    rarity: 'common',
    progress: 0,
    maxProgress: 5,
    unlocked: false,
    category: 'reading'
  },
  {
    id: 'arena_master_mind',
    title: 'Mind Master',
    description: 'Complete all articles in the Mind arena',
    icon: TrendingUp,
    rarity: 'rare',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    category: 'mastery'
  },
  {
    id: 'streak_3',
    title: 'Building Momentum',
    description: 'Read for 3 consecutive days',
    icon: Flame,
    rarity: 'common',
    progress: 0,
    maxProgress: 3,
    unlocked: false,
    category: 'streak'
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Read for 7 consecutive days',
    icon: Flame,
    rarity: 'rare',
    progress: 0,
    maxProgress: 7,
    unlocked: false,
    category: 'streak'
  },
  {
    id: 'speed_reader',
    title: 'Speed Reader',
    description: 'Complete an article in under 5 minutes',
    icon: TrendingUp,
    rarity: 'rare',
    progress: 0,
    maxProgress: 1,
    unlocked: false,
    category: 'reading'
  },
  {
    id: 'completionist',
    title: 'Completionist',
    description: 'Complete 25 articles',
    icon: Crown,
    rarity: 'epic',
    progress: 0,
    maxProgress: 25,
    unlocked: false,
    category: 'completion'
  },
  {
    id: 'reflection_master',
    title: 'Deep Thinker',
    description: 'Complete 10 reflection prompts',
    icon: Award,
    rarity: 'rare',
    progress: 0,
    maxProgress: 10,
    unlocked: false,
    category: 'engagement'
  }
];