import React, { useState } from 'react';
import { TrendingUp, Target, Award, ChevronRight, ArrowPathIcon, ChatBubbleLeftRightIcon, Calendar, BookOpenIcon, DumbbellIcon, BrainIcon, HeartIcon, BriefcaseIcon, SparklesIcon } from '../components/Icons';

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
  completedDate?: Date;
}

interface ResultsScreenProps {
  results: AssessmentResult;
  onRetakeAssessment: () => void;
  onStartCoaching: (area: string) => void;
  onViewProgress: () => void;
  setView: (view: string) => void;
}

const ARENA_INFO = {
  mind: {
    name: 'Mind',
    description: 'Mental clarity, emotional regulation, and cognitive wellness',
    icon: BrainIcon,
    color: 'text-blue-400',
    gradient: 'from-blue-500/20 to-blue-500/5'
  },
  heart: {
    name: 'Heart', 
    description: 'Relationships, social skills, and emotional connections',
    icon: HeartIcon,
    color: 'text-red-400',
    gradient: 'from-red-500/20 to-red-500/5'
  },
  body: {
    name: 'Body',
    description: 'Physical health, fitness, and personal presentation',
    icon: DumbbellIcon,
    color: 'text-green-400',
    gradient: 'from-green-500/20 to-green-500/5'
  },
  work: {
    name: 'Work',
    description: 'Career growth, financial wellness, and professional development',
    icon: BriefcaseIcon,
    color: 'text-yellow-400',
    gradient: 'from-yellow-500/20 to-yellow-500/5'
  },
  soul: {
    name: 'Soul',
    description: 'Purpose, values, personal growth, and spiritual wellness',
    icon: SparklesIcon,
    color: 'text-purple-400',
    gradient: 'from-purple-500/20 to-purple-500/5'
  }
};

const COACHING_PATHS = {
  'mental-wellness-first': {
    title: 'Mental Wellness Foundation',
    description: 'Start with building mental clarity and emotional regulation - the foundation for all other growth.',
    priority: 'High Priority',
    firstSteps: [
      'Daily mindfulness practice (10 minutes)',
      'Stress management techniques',
      'Sleep optimization protocol',
      'Professional mental health assessment'
    ],
    mentorRecommendation: 'phoenix',
    estimatedTimeframe: '4-6 weeks'
  },
  'social-confidence': {
    title: 'Social Confidence Builder',
    description: 'Develop the social skills and confidence to build meaningful relationships and connections.',
    priority: 'Focus Area',
    firstSteps: [
      'Practice daily small talk challenges',
      'Improve body language and presence',
      'Build conversation skills',
      'Expand social circle gradually'
    ],
    mentorRecommendation: 'sage',
    estimatedTimeframe: '6-8 weeks'
  },
  'physical-foundation': {
    title: 'Physical Foundation',
    description: 'Build the energy, health, and confidence that comes from taking care of your body.',
    priority: 'Foundation Building',
    firstSteps: [
      'Establish consistent sleep schedule',
      'Create simple exercise routine',
      'Improve grooming and style',
      'Optimize nutrition basics'
    ],
    mentorRecommendation: 'titan',
    estimatedTimeframe: '8-12 weeks'
  },
  'career-momentum': {
    title: 'Career & Financial Growth',
    description: 'Build professional confidence and create financial stability for long-term success.',
    priority: 'Growth Focus',
    firstSteps: [
      'Assess current career trajectory',
      'Develop key professional skills',
      'Create financial action plan',
      'Build professional network'
    ],
    mentorRecommendation: 'forge',
    estimatedTimeframe: '3-6 months'
  },
  'purpose-clarity': {
    title: 'Purpose & Direction',
    description: 'Discover your core values and create a meaningful life direction aligned with who you truly are.',
    priority: 'Life Direction',
    firstSteps: [
      'Values clarification exercises',
      'Life vision creation',
      'Goal-setting system',
      'Purpose exploration activities'
    ],
    mentorRecommendation: 'atlas',
    estimatedTimeframe: '6-10 weeks'
  },
  'comprehensive': {
    title: 'Comprehensive Development',
    description: 'A balanced approach to growth across all life areas for those ready for holistic transformation.',
    priority: 'Balanced Growth',
    firstSteps: [
      'Create integrated daily routine',
      'Set goals across all life areas',
      'Build accountability systems',
      'Track progress holistically'
    ],
    mentorRecommendation: 'atlas',
    estimatedTimeframe: '3-6 months'
  }
};

const ResultsScreen: React.FC<ResultsScreenProps> = ({ 
  results, 
  onRetakeAssessment, 
  onStartCoaching,
  onViewProgress,
  setView 
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'detailed' | 'action-plan'>('overview');
  
  const coachingPath = COACHING_PATHS[
    (results.coachingPath as keyof typeof COACHING_PATHS) ?? 'comprehensive'
  ] ?? COACHING_PATHS['comprehensive'];
  
  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const order: Array<'overview' | 'detailed' | 'action-plan'> = ['overview', 'detailed', 'action-plan'];
    const currentIndex = order.indexOf(selectedTab);
    if (e.key === 'ArrowRight') {
      const next = order[(currentIndex + 1) % order.length];
      setSelectedTab(next);
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      const prev = order[(currentIndex - 1 + order.length) % order.length];
      setSelectedTab(prev);
      e.preventDefault();
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    if (score >= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 8) return 'Strong';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Developing';
    return 'Needs Focus';
  };

  const getPersonalityInsight = () => {
    const { personalityProfile } = results;
    const traits = [];
    
    if (personalityProfile.extraversion >= 7) traits.push('socially energized');
    else if (personalityProfile.extraversion <= 4) traits.push('introspective');
    
    if (personalityProfile.conscientiousness >= 7) traits.push('highly organized');
    else if (personalityProfile.conscientiousness <= 4) traits.push('flexible and spontaneous');
    
    if (personalityProfile.openness >= 7) traits.push('open to new experiences');
    if (personalityProfile.neuroticism <= 4) traits.push('emotionally stable');
    else if (personalityProfile.neuroticism >= 7) traits.push('emotionally sensitive');
    
    return traits.length > 0 
      ? `You tend to be ${traits.join(', ')}.`
      : 'You have a balanced personality profile.';
  };

  return (
    <div className="min-h-screen bg-primary p-4 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full mb-4">
            <Award className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary">Your Life Readiness Results</h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Based on your responses, we've created a personalized roadmap for your growth journey.
          </p>
        </div>

        {/* Overall Score */}
        <div className="bg-secondary rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-text-primary mb-2">Overall Life Readiness</h2>
          <div className={`text-4xl font-bold mb-2 ${getScoreColor(results.overallScore)}`}>
            {results.overallScore.toFixed(1)}/10
          </div>
          <p className={`text-sm ${getScoreColor(results.overallScore)}`}>
            {getScoreDescription(results.overallScore)}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div
          className="flex border-b border-gray-600"
          role="tablist"
          aria-label="Results sections"
          onKeyDown={handleTabKeyDown}
        >
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'detailed', label: 'Detailed Scores' },
            { id: 'action-plan', label: 'Action Plan' }
          ].map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={selectedTab === (tab.id as 'overview' | 'detailed' | 'action-plan')}
              aria-controls={`panel-${tab.id}`}
              tabIndex={selectedTab === (tab.id as 'overview' | 'detailed' | 'action-plan') ? 0 : -1}
              onClick={() => setSelectedTab(tab.id as 'overview' | 'detailed' | 'action-plan')}
              className={`px-4 py-2 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-t ${
                selectedTab === tab.id
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div
            id="panel-overview"
            role="tabpanel"
            aria-labelledby="tab-overview"
            className="space-y-6"
          >
            
            {/* Coaching Path Recommendation */}
            <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg p-6 border border-accent/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-sm font-medium rounded-full mb-2">
                    {coachingPath.priority}
                  </span>
                  <h3 className="text-xl font-bold text-text-primary">{coachingPath.title}</h3>
                  <p className="text-text-secondary mt-2">{coachingPath.description}</p>
                </div>
                <Target className="h-8 w-8 text-accent flex-shrink-0" />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="font-semibold text-text-primary mb-2">Recommended Timeline</h4>
                  <p className="text-text-secondary text-sm">{coachingPath.estimatedTimeframe}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary mb-2">Best Mentor</h4>
                  <p className="text-text-secondary text-sm">
                    {coachingPath.mentorRecommendation === 'atlas' && 'Atlas - Life Coach'}
                    {coachingPath.mentorRecommendation === 'phoenix' && 'Dr. Phoenix - Mental Wellness'}
                    {coachingPath.mentorRecommendation === 'sage' && 'Sage - Relationships'}
                    {coachingPath.mentorRecommendation === 'titan' && 'Titan - Fitness'}
                    {coachingPath.mentorRecommendation === 'forge' && 'Forge - Career'}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => setView('mentor')}
                className="w-full mt-4 bg-accent text-primary font-medium py-3 rounded-lg hover:bg-accent/90 transition-colors"
              >
                Start Your Coaching Journey
              </button>
            </div>

            {/* Top Priorities */}
            <div className="bg-secondary rounded-lg p-6">
              <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-accent" />
                Your Top Growth Priorities
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {results.topPriorities
                  .map((arena) => {
                    const arenaInfo = ARENA_INFO[arena as keyof typeof ARENA_INFO];
                    if (!arenaInfo) return null;
                    const ArenaIcon = arenaInfo.icon;
                    const arenaKey = arena as keyof typeof results.arenaScores;
                    const arenaScore = results.arenaScores[arenaKey];
                    return (
                      <div key={arena} className={`p-4 rounded-lg bg-gradient-to-r ${arenaInfo.gradient} border border-gray-600`}>
                        <div className="flex items-center mb-2">
                          <ArenaIcon className={`h-5 w-5 mr-2 ${arenaInfo.color}`} />
                          <h4 className="font-semibold text-text-primary">{arenaInfo.name}</h4>
                        </div>
                        <p className="text-text-secondary text-sm">{arenaInfo.description}</p>
                        <div className="mt-3">
                          <div className={`text-sm font-medium ${getScoreColor(arenaScore)}`}>
                            Score: {arenaScore.toFixed(1)}/10
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Personality Insight */}
            <div className="bg-secondary rounded-lg p-6">
              <h3 className="text-xl font-bold text-text-primary mb-4">Personality Insights</h3>
              <p className="text-text-secondary mb-4">{getPersonalityInsight()}</p>
              <p className="text-text-secondary text-sm">
                Understanding your personality helps customize your growth approach for maximum effectiveness.
              </p>
            </div>
          </div>
        )}

        {selectedTab === 'detailed' && (
          <div
            id="panel-detailed"
            role="tabpanel"
            aria-labelledby="tab-detailed"
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-text-primary">Detailed Arena Scores</h3>
            {Object.entries(results.arenaScores).map(([arena, score]) => {
              const arenaInfo = ARENA_INFO[arena as keyof typeof ARENA_INFO];
              const ArenaIcon = arenaInfo.icon;
              const numericScore = score as number;
              
              return (
                <div key={arena} className="bg-secondary rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <ArenaIcon className={`h-6 w-6 mr-3 ${arenaInfo.color}`} />
                      <div>
                        <h4 className="font-semibold text-text-primary">{arenaInfo.name}</h4>
                        <p className="text-text-secondary text-sm">{arenaInfo.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(numericScore)}`}>
                        {numericScore.toFixed(1)}
                      </div>
                      <div className={`text-sm ${getScoreColor(numericScore)}`}>
                        {getScoreDescription(numericScore)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Score Bar */}
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 motion-reduce:transition-none ${
                        numericScore >= 8 ? 'bg-green-400' :
                        numericScore >= 6 ? 'bg-yellow-400' :
                        numericScore >= 4 ? 'bg-orange-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${(numericScore / 10) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {selectedTab === 'action-plan' && (
          <div
            id="panel-action-plan"
            role="tabpanel"
            aria-labelledby="tab-action-plan"
            className="space-y-6"
          >
            <div className="bg-secondary rounded-lg p-6">
              <h3 className="text-xl font-bold text-text-primary mb-4">Your 30-Day Action Plan</h3>
              <p className="text-text-secondary mb-6">
                Based on your assessment, here's a prioritized plan to start your transformation:
              </p>
              
              <div className="space-y-4">
                {coachingPath.firstSteps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-primary rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-accent text-primary rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-text-primary font-medium">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <button 
                  onClick={() => setView('challenges')}
                  className="flex items-center justify-center p-4 bg-primary rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                >
                  <Calendar className="h-5 w-5 mr-2 text-accent" />
                  <span className="text-text-primary font-medium">Daily Challenges</span>
                </button>
                
                <button 
                  onClick={() => setView('guides')}
                  className="flex items-center justify-center p-4 bg-primary rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                >
                  <BookOpenIcon className="h-5 w-5 mr-2 text-accent" />
                  <span className="text-text-primary font-medium">Learning Guides</span>
                </button>
                
                <button 
                  onClick={() => setView('mentor')}
                  className="flex items-center justify-center p-4 bg-primary rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-accent" />
                  <span className="text-text-primary font-medium">AI Mentor</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={onRetakeAssessment}
            className="flex items-center justify-center px-6 py-3 border border-gray-600 text-text-secondary rounded-lg hover:border-accent hover:text-accent transition-colors"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Retake Assessment
          </button>
          
          <button
            onClick={() => setView('progress')}
            className="flex items-center justify-center px-6 py-3 bg-accent text-primary font-medium rounded-lg hover:bg-accent/90 transition-colors"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Track Progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;