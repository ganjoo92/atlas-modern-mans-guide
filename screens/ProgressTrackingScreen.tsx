import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Target, Award, ChevronRight, ChevronLeftIcon, DumbbellIcon, BrainIcon, HeartIcon, BriefcaseIcon, SparklesIcon } from '../components/Icons';

interface AssessmentResult {
  overallScore: number;
  arenaScores: {
    mind: number;
    heart: number;
    body: number;
    work: number;
    soul: number;
  };
  personalityProfile: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  topPriorities: string[];
  coachingPath: string;
  strengths: string[];
  growthAreas: string[];
  completedDate: Date;
}

interface ProgressTrackingScreenProps {
  onBack: () => void;
  onRetakeAssessment: () => void;
}

const ARENA_INFO = {
  mind: {
    name: 'Mind',
    icon: BrainIcon,
    color: 'text-blue-400',
    gradient: 'from-blue-500/20 to-blue-500/5'
  },
  heart: {
    name: 'Heart', 
    icon: HeartIcon,
    color: 'text-red-400',
    gradient: 'from-red-500/20 to-red-500/5'
  },
  body: {
    name: 'Body',
    icon: DumbbellIcon,
    color: 'text-green-400',
    gradient: 'from-green-500/20 to-green-500/5'
  },
  work: {
    name: 'Work',
    icon: BriefcaseIcon,
    color: 'text-yellow-400',
    gradient: 'from-yellow-500/20 to-yellow-500/5'
  },
  soul: {
    name: 'Soul',
    icon: SparklesIcon,
    color: 'text-purple-400',
    gradient: 'from-purple-500/20 to-purple-500/5'
  }
};

const ProgressTrackingScreen: React.FC<ProgressTrackingScreenProps> = ({ onBack, onRetakeAssessment }) => {
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentResult[]>([]);
  const [selectedComparison, setSelectedComparison] = useState<'last-30-days' | 'last-3-months' | 'all-time'>('last-30-days');
  const [isLoading, setIsLoading] = useState(true);
  const [animateProgress, setAnimateProgress] = useState(false);

  // In a real app, this would load from localStorage or a database
  useEffect(() => {
    const loadData = async () => {
      // Simulate loading delay
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockHistory: AssessmentResult[] = [
        {
          overallScore: 7.2,
          arenaScores: { mind: 8.1, heart: 6.5, body: 7.0, work: 7.8, soul: 6.8 },
          personalityProfile: { openness: 7.5, conscientiousness: 8.0, extraversion: 6.0, agreeableness: 7.0, neuroticism: 4.5 },
          topPriorities: ['heart', 'soul'],
          coachingPath: 'social-confidence',
          strengths: ['mind', 'work'],
          growthAreas: ['heart', 'soul', 'body'],
          completedDate: new Date('2024-10-01')
        },
        {
          overallScore: 6.8,
          arenaScores: { mind: 7.5, heart: 5.8, body: 6.2, work: 7.5, soul: 6.0 },
          personalityProfile: { openness: 7.0, conscientiousness: 7.8, extraversion: 5.5, agreeableness: 6.8, neuroticism: 5.0 },
          topPriorities: ['heart', 'body'],
          coachingPath: 'social-confidence',
          strengths: ['mind', 'work'],
          growthAreas: ['heart', 'body', 'soul'],
          completedDate: new Date('2024-09-01')
        },
        {
          overallScore: 6.2,
          arenaScores: { mind: 7.0, heart: 5.2, body: 5.8, work: 7.2, soul: 5.8 },
          personalityProfile: { openness: 6.8, conscientiousness: 7.5, extraversion: 5.0, agreeableness: 6.5, neuroticism: 5.5 },
          topPriorities: ['heart', 'body'],
          coachingPath: 'physical-foundation',
          strengths: ['mind', 'work'],
          growthAreas: ['heart', 'body', 'soul'],
          completedDate: new Date('2024-08-01')
        }
      ];
      
      setAssessmentHistory(mockHistory);
      setIsLoading(false);
      
      // Trigger progress bar animation after a short delay
      setTimeout(() => {
        setAnimateProgress(true);
        console.log('Progress animation triggered'); // Debug log
      }, 100);
    };
    
    loadData();
  }, []);

  const getLatestResult = () => assessmentHistory[0];
  const getPreviousResult = () => assessmentHistory[1];

  const calculateImprovement = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const getImprovementColor = (improvement: number) => {
    if (improvement > 5) return 'text-green-400';
    if (improvement > 0) return 'text-green-300';
    if (improvement > -5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0) return '↗';
    if (improvement < 0) return '↘';
    return '→';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const latestResult = getLatestResult();
  const previousResult = getPreviousResult();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-primary p-4">
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-text-primary">Loading Progress...</h2>
        </div>
      </div>
    );
  }

  if (!latestResult) {
    return (
      <div className="min-h-screen bg-primary p-4">
        <div className="max-w-2xl mx-auto text-center py-16">
          <Target className="h-16 w-16 text-accent mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-text-primary mb-4">No Assessment History</h2>
          <p className="text-text-secondary mb-8">
            Take your first Life Readiness Assessment to start tracking your progress.
          </p>
          <button
            onClick={onRetakeAssessment}
            className="bg-accent text-primary font-medium px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors"
          >
            Take Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center text-text-secondary hover:text-text-primary transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-text-primary">Progress Tracking</h1>
          <button
            onClick={onRetakeAssessment}
            className="bg-accent text-primary font-medium px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors text-sm"
          >
            New Assessment
          </button>
        </div>

        {/* Current Score Overview */}
        <div className="bg-secondary rounded-lg p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-sm font-medium text-text-secondary mb-2">Current Overall Score</h3>
              <div className="text-3xl font-bold text-accent mb-1">
                {latestResult.overallScore.toFixed(1)}/10
              </div>
              <p className="text-xs text-text-secondary">
                Assessed on {formatDate(latestResult.completedDate)}
              </p>
            </div>
            
            {previousResult && (
              <>
                <div className="text-center">
                  <h3 className="text-sm font-medium text-text-secondary mb-2">Previous Score</h3>
                  <div className="text-2xl font-bold text-text-primary mb-1">
                    {previousResult.overallScore.toFixed(1)}/10
                  </div>
                  <p className="text-xs text-text-secondary">
                    {formatDate(previousResult.completedDate)}
                  </p>
                </div>
                
                <div className="text-center">
                  <h3 className="text-sm font-medium text-text-secondary mb-2">Improvement</h3>
                  <div className={`text-2xl font-bold mb-1 ${getImprovementColor(calculateImprovement(latestResult.overallScore, previousResult.overallScore))}`}>
                    {getImprovementIcon(calculateImprovement(latestResult.overallScore, previousResult.overallScore))}
                    {Math.abs(calculateImprovement(latestResult.overallScore, previousResult.overallScore)).toFixed(1)}%
                  </div>
                  <p className="text-xs text-text-secondary">
                    vs. last assessment
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Arena Progress */}
        <div className="bg-secondary rounded-lg p-6">
          <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-accent" />
            Progress by Life Arena
          </h3>
          
          <div className="space-y-4">
            {Object.entries(latestResult.arenaScores).map(([arena, currentScore]) => {
              const arenaInfo = ARENA_INFO[arena as keyof typeof ARENA_INFO];
              const ArenaIcon = arenaInfo.icon;
              const previousScore = previousResult?.arenaScores[arena as keyof typeof previousResult.arenaScores] || 0;
              const improvement = calculateImprovement(currentScore as number, previousScore as number);
              
              return (
                <div key={arena} className="flex items-center justify-between p-4 bg-primary rounded-lg">
                  <div className="flex items-center">
                    <ArenaIcon className={`h-6 w-6 mr-3 ${arenaInfo.color}`} />
                    <div>
                      <h4 className="font-semibold text-text-primary">{arenaInfo.name}</h4>
                      <p className="text-sm text-text-secondary">
                        Current: {(currentScore as number).toFixed(1)}/10
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {previousResult && (
                      <div className={`text-sm font-medium ${getImprovementColor(improvement)}`}>
                        {getImprovementIcon(improvement)} {Math.abs(improvement).toFixed(1)}%
                      </div>
                    )}
                    <div className="text-xs text-text-secondary mb-1">
                      {(currentScore as number).toFixed(1)}/10
                    </div>
                    <div className="w-24 bg-gray-700 rounded-full h-3 mt-1 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all ease-out ${
                          (currentScore as number) >= 8 ? 'bg-green-400' :
                          (currentScore as number) >= 6 ? 'bg-yellow-400' :
                          (currentScore as number) >= 4 ? 'bg-orange-400' : 'bg-red-400'
                        }`}
                        style={{ 
                          width: animateProgress ? `${((currentScore as number) / 10) * 100}%` : '0%',
                          transition: 'width 2s ease-out',
                          minWidth: animateProgress && (currentScore as number) > 0 ? '8px' : '0px'
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assessment History */}
        <div className="bg-secondary rounded-lg p-6">
          <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-accent" />
            Assessment History
          </h3>
          
          <div className="space-y-3">
            {assessmentHistory.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-primary rounded-lg">
                <div>
                  <div className="font-medium text-text-primary">
                    Overall Score: {result.overallScore.toFixed(1)}/10
                  </div>
                  <div className="text-sm text-text-secondary">
                    {formatDate(result.completedDate)} • Coaching Path: {result.coachingPath}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {index === 0 && (
                    <span className="bg-accent/20 text-accent text-xs font-medium px-2 py-1 rounded-full">
                      Latest
                    </span>
                  )}
                  <Award className={`h-5 w-5 ${
                    result.overallScore >= 8 ? 'text-green-400' :
                    result.overallScore >= 6 ? 'text-yellow-400' :
                    result.overallScore >= 4 ? 'text-orange-400' : 'text-red-400'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights & Recommendations */}
        <div className="bg-secondary rounded-lg p-6">
          <h3 className="text-xl font-bold text-text-primary mb-4">Progress Insights</h3>
          
          <div className="space-y-4">
            {previousResult && (
              <div className="p-4 bg-primary rounded-lg">
                <h4 className="font-semibold text-text-primary mb-2">Your Growth Journey</h4>
                <p className="text-text-secondary text-sm">
                  Over the past {Math.round((latestResult.completedDate.getTime() - previousResult.completedDate.getTime()) / (1000 * 60 * 60 * 24))} days, 
                  you've improved your overall life readiness by {calculateImprovement(latestResult.overallScore, previousResult.overallScore).toFixed(1)}%. 
                  Your strongest improvement has been in areas you've been focusing on through your coaching path.
                </p>
              </div>
            )}
            
            <div className="p-4 bg-primary rounded-lg">
              <h4 className="font-semibold text-text-primary mb-2">Next Steps</h4>
              <p className="text-text-secondary text-sm mb-3">
                Continue focusing on your growth areas: {latestResult.growthAreas.join(', ')}.
              </p>
              <button
                onClick={onRetakeAssessment}
                className="bg-accent text-primary font-medium px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors text-sm"
              >
                Take New Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTrackingScreen;