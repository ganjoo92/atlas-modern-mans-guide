import React from 'react';
import StatCard from '../components/StatCard';
import { CheckBadgeIcon, BookOpenIcon, UsersIcon } from '../components/Icons';

interface ProgressScreenProps {
  completedChallengeIds: Set<number>;
  totalChallenges: number;
}

const ProgressScreen: React.FC<ProgressScreenProps> = ({ completedChallengeIds, totalChallenges }) => {
  const challengesCompleted = completedChallengeIds.size;
  const progressPercentage = totalChallenges > 0 ? Math.round((challengesCompleted / totalChallenges) * 100) : 0;

  return (
    <div className="animate-fade-in space-y-8 pb-16 md:pb-0">
      <header>
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary">Your Progress</h1>
        <p className="text-lg md:text-xl text-text-secondary mt-2">
          Track your journey of self-improvement.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          label="Challenges Completed"
          value={challengesCompleted}
          icon={CheckBadgeIcon}
          color="text-accent"
        />
        <StatCard 
          label="Guides Read (Soon)"
          value={0}
          icon={BookOpenIcon}
          color="text-green-400"
        />
        <StatCard 
          label="Community Posts (Soon)"
          value={0}
          icon={UsersIcon}
          color="text-purple-400"
        />
      </div>

      <div className="bg-secondary p-6 rounded-lg shadow-lg border border-gray-700/50">
        <h2 className="text-2xl font-bold mb-4">Challenge Completion</h2>
        <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-text-secondary">Total Progress</span>
            <span className="text-sm font-medium text-accent">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4">
            <div className="bg-accent h-4 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressScreen;
