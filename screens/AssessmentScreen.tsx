import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRight, CheckCircleIcon, UserIcon, HeartIcon, BrainIcon, DumbbellIcon, BriefcaseIcon, SparklesIcon } from '../components/Icons';

interface Question {
  id: number;
  category: string;
  arena: string;
  text: string;
  type: 'scale' | 'multiple' | 'boolean';
  options?: string[];
  weight: number; // Importance weight for scoring
}

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
}

interface AssessmentScreenProps {
  onComplete: (results: AssessmentResult) => void;
  onBack: () => void;
}

const QUESTIONS: Question[] = [
  // Mind Arena - Mental Health & Clarity
  {
    id: 1,
    category: 'Mental Clarity',
    arena: 'mind',
    text: 'How often do you feel mentally clear and focused throughout the day?',
    type: 'scale',
    weight: 0.9
  },
  {
    id: 2,
    category: 'Emotional Regulation',
    arena: 'mind',
    text: 'When faced with stress or setbacks, how well do you manage your emotions?',
    type: 'scale',
    weight: 0.95
  },
  {
    id: 3,
    category: 'Self-Awareness',
    arena: 'mind',
    text: 'How well do you understand your own thoughts, feelings, and motivations?',
    type: 'scale',
    weight: 0.8
  },
  {
    id: 4,
    category: 'Mental Health',
    arena: 'mind',
    text: 'Do you currently struggle with anxiety, depression, or other mental health challenges?',
    type: 'multiple',
    options: ['No significant struggles', 'Mild occasional difficulties', 'Moderate ongoing challenges', 'Significant daily struggles'],
    weight: 1.0
  },

  // Heart Arena - Relationships & Social Skills
  {
    id: 5,
    category: 'Social Confidence',
    arena: 'heart',
    text: 'How comfortable are you starting conversations with new people?',
    type: 'scale',
    weight: 0.85
  },
  {
    id: 6,
    category: 'Relationship Quality',
    arena: 'heart',
    text: 'How satisfied are you with the quality of your close relationships?',
    type: 'scale',
    weight: 0.9
  },
  {
    id: 7,
    category: 'Dating Confidence',
    arena: 'heart',
    text: 'How confident do you feel when it comes to dating and romantic relationships?',
    type: 'scale',
    weight: 0.8
  },
  {
    id: 8,
    category: 'Communication Skills',
    arena: 'heart',
    text: 'How effectively can you express your thoughts and feelings to others?',
    type: 'scale',
    weight: 0.85
  },

  // Body Arena - Physical Health & Fitness
  {
    id: 9,
    category: 'Physical Fitness',
    arena: 'body',
    text: 'How satisfied are you with your current level of physical fitness?',
    type: 'scale',
    weight: 0.8
  },
  {
    id: 10,
    category: 'Energy Levels',
    arena: 'body',
    text: 'How would you rate your daily energy levels?',
    type: 'scale',
    weight: 0.9
  },
  {
    id: 11,
    category: 'Grooming & Style',
    arena: 'body',
    text: 'How confident are you in your personal grooming and style?',
    type: 'scale',
    weight: 0.7
  },
  {
    id: 12,
    category: 'Health Habits',
    arena: 'body',
    text: 'How consistent are you with healthy habits (sleep, nutrition, exercise)?',
    type: 'scale',
    weight: 0.85
  },

  // Work Arena - Career & Financial Success
  {
    id: 13,
    category: 'Career Satisfaction',
    arena: 'work',
    text: 'How satisfied are you with your current career path and progress?',
    type: 'scale',
    weight: 0.9
  },
  {
    id: 14,
    category: 'Financial Confidence',
    arena: 'work',
    text: 'How confident do you feel about your financial situation and future?',
    type: 'scale',
    weight: 0.85
  },
  {
    id: 15,
    category: 'Professional Skills',
    arena: 'work',
    text: 'How confident are you in your professional skills and abilities?',
    type: 'scale',
    weight: 0.8
  },
  {
    id: 16,
    category: 'Work-Life Balance',
    arena: 'work',
    text: 'How well do you balance work demands with personal life?',
    type: 'scale',
    weight: 0.75
  },

  // Soul Arena - Purpose & Personal Growth
  {
    id: 17,
    category: 'Life Purpose',
    arena: 'soul',
    text: 'How clear are you about your life purpose and what truly matters to you?',
    type: 'scale',
    weight: 1.0
  },
  {
    id: 18,
    category: 'Personal Growth',
    arena: 'soul',
    text: 'How committed are you to continuous learning and self-improvement?',
    type: 'scale',
    weight: 0.8
  },
  {
    id: 19,
    category: 'Values Alignment',
    arena: 'soul',
    text: 'How well does your current life align with your core values?',
    type: 'scale',
    weight: 0.95
  },
  {
    id: 20,
    category: 'Spiritual Wellness',
    arena: 'soul',
    text: 'How connected do you feel to something greater than yourself?',
    type: 'scale',
    weight: 0.7
  },

  // Personality & Behavioral Patterns
  {
    id: 21,
    category: 'Openness',
    arena: 'mind',
    text: 'How open are you to new experiences, ideas, and ways of thinking?',
    type: 'scale',
    weight: 0.6
  },
  {
    id: 22,
    category: 'Conscientiousness',
    arena: 'work',
    text: 'How organized, disciplined, and goal-oriented would you say you are?',
    type: 'scale',
    weight: 0.7
  },
  {
    id: 23,
    category: 'Extraversion',
    arena: 'heart',
    text: 'How energized do you feel when interacting with others vs. being alone?',
    type: 'multiple',
    options: ['Much more energized alone', 'Somewhat more energized alone', 'About equal', 'Somewhat more energized with others', 'Much more energized with others'],
    weight: 0.6
  },

  // Deep Belief & Mindset Questions
  {
    id: 24,
    category: 'Self-Worth',
    arena: 'mind',
    text: 'How often do you feel truly worthy of love, success, and happiness?',
    type: 'scale',
    weight: 1.0
  },
  {
    id: 25,
    category: 'Growth Mindset',
    arena: 'soul',
    text: 'When you face challenges, how much do you believe you can improve and overcome them?',
    type: 'scale',
    weight: 0.9
  },
  {
    id: 26,
    category: 'Fear Patterns',
    arena: 'mind',
    text: 'What most often holds you back from taking action toward your goals?',
    type: 'multiple',
    options: ['Fear of failure', 'Fear of judgment', 'Lack of confidence', 'Perfectionism', 'Not knowing where to start', 'Past negative experiences'],
    weight: 0.8
  },
  {
    id: 27,
    category: 'Social Support',
    arena: 'heart',
    text: 'How strong is your support network of friends, family, or mentors?',
    type: 'scale',
    weight: 0.8
  },
  {
    id: 28,
    category: 'Authenticity',
    arena: 'soul',
    text: 'How often do you feel like you can be your true, authentic self around others?',
    type: 'scale',
    weight: 0.85
  },
  {
    id: 29,
    category: 'Resilience',
    arena: 'mind',
    text: 'How quickly do you typically bounce back from setbacks or disappointments?',
    type: 'scale',
    weight: 0.9
  },
  {
    id: 30,
    category: 'Future Vision',
    arena: 'soul',
    text: 'How clear and exciting is your vision for who you want to become?',
    type: 'scale',
    weight: 0.85
  }
];

const AssessmentScreen: React.FC<AssessmentScreenProps> = ({ onComplete, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number | string }>({});
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

  const handleAnswer = (value: number | string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      completeAssessment();
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateResults = (): AssessmentResult => {
    const arenaScores = {
      mind: 0,
      heart: 0,
      body: 0,
      work: 0,
      soul: 0
    };

    const arenaCounts = {
      mind: 0,
      heart: 0,
      body: 0,
      work: 0,
      soul: 0
    };

    let totalWeightedScore = 0;
    let totalWeight = 0;

    // Calculate arena scores
    QUESTIONS.forEach(question => {
      const answer = answers[question.id];
      if (answer !== undefined) {
        let normalizedScore = 0;
        
        if (question.type === 'scale') {
          normalizedScore = typeof answer === 'number' ? answer / 10 : 0;
        } else if (question.type === 'multiple') {
          const optionIndex = question.options?.indexOf(answer as string) || 0;
          normalizedScore = (question.options!.length - optionIndex - 1) / (question.options!.length - 1);
        } else if (question.type === 'boolean') {
          normalizedScore = answer === 'true' ? 1 : 0;
        }

        const weightedScore = normalizedScore * question.weight;
        arenaScores[question.arena as keyof typeof arenaScores] += weightedScore;
        arenaCounts[question.arena as keyof typeof arenaCounts] += question.weight;
        
        totalWeightedScore += weightedScore;
        totalWeight += question.weight;
      }
    });

    // Normalize arena scores
    Object.keys(arenaScores).forEach(arena => {
      const arenaKey = arena as keyof typeof arenaScores;
      if (arenaCounts[arenaKey] > 0) {
        arenaScores[arenaKey] = (arenaScores[arenaKey] / arenaCounts[arenaKey]) * 10;
      }
    });

    const overallScore = totalWeight > 0 ? (totalWeightedScore / totalWeight) * 10 : 0;

    // Determine personality profile (simplified Big Five)
    const personalityProfile = {
      openness: arenaScores.mind * 0.4 + arenaScores.soul * 0.6,
      conscientiousness: arenaScores.work * 0.7 + arenaScores.body * 0.3,
      extraversion: arenaScores.heart,
      agreeableness: arenaScores.heart * 0.6 + arenaScores.soul * 0.4,
      neuroticism: 10 - arenaScores.mind // Inverse of mental clarity/emotional regulation
    };

    // Determine top priorities (lowest scoring areas)
    const arenaEntries = Object.entries(arenaScores).sort(([,a], [,b]) => a - b);
    const topPriorities = arenaEntries.slice(0, 2).map(([arena]) => arena);

    // Determine coaching path based on lowest areas and personality
    let coachingPath = 'comprehensive';
    const lowestArena = arenaEntries[0][0];
    
    if (arenaScores.mind < 6) coachingPath = 'mental-wellness-first';
    else if (lowestArena === 'heart') coachingPath = 'social-confidence';
    else if (lowestArena === 'body') coachingPath = 'physical-foundation';
    else if (lowestArena === 'work') coachingPath = 'career-momentum';
    else if (lowestArena === 'soul') coachingPath = 'purpose-clarity';

    // Identify strengths and growth areas
    const strengths = arenaEntries.slice(-2).map(([arena]) => arena);
    const growthAreas = arenaEntries.slice(0, 3).map(([arena]) => arena);

    return {
      overallScore,
      arenaScores,
      personalityProfile,
      topPriorities,
      coachingPath,
      strengths,
      growthAreas
    };
  };

  const completeAssessment = () => {
    const results = calculateResults();
    setIsComplete(true);
    onComplete(results);
  };

  const renderQuestion = () => {
    if (currentQuestion.type === 'scale') {
      return (
        <div className="space-y-4">
          <p className="text-text-secondary text-sm">Rate from 1 (very low) to 10 (very high)</p>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => (
              <button
                key={value}
                onClick={() => handleAnswer(value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  answers[currentQuestion.id] === value
                    ? 'border-accent bg-accent/20 text-accent'
                    : 'border-gray-600 hover:border-accent/50 text-text-secondary hover:text-text-primary'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (currentQuestion.type === 'multiple') {
      return (
        <div className="space-y-3">
          {currentQuestion.options?.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                answers[currentQuestion.id] === option
                  ? 'border-accent bg-accent/10 text-text-primary'
                  : 'border-gray-600 hover:border-accent/50 text-text-secondary hover:text-text-primary'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      );
    }

    return null;
  };

  const getArenaIcon = (arena: string) => {
    switch (arena) {
      case 'mind': return BrainIcon;
      case 'heart': return HeartIcon;
      case 'body': return DumbbellIcon;
      case 'work': return BriefcaseIcon;
      case 'soul': return SparklesIcon;
      default: return UserIcon;
    }
  };

  const getArenaColor = (arena: string) => {
    switch (arena) {
      case 'mind': return 'text-blue-400';
      case 'heart': return 'text-red-400';
      case 'body': return 'text-green-400';
      case 'work': return 'text-yellow-400';
      case 'soul': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-secondary rounded-lg p-8 text-center">
          <CheckCircleIcon className="h-16 w-16 text-accent mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-primary mb-2">Assessment Complete!</h2>
          <p className="text-text-secondary mb-6">
            Your personalized coaching path has been generated. Let's start your transformation journey.
          </p>
        </div>
      </div>
    );
  }

  const ArenaIcon = getArenaIcon(currentQuestion.arena);

  return (
    <div className="min-h-screen bg-primary p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-text-secondary hover:text-text-primary transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Back
          </button>
          <h1 className="text-xl font-bold text-text-primary">Life Readiness Assessment</h1>
          <div className="text-text-secondary text-sm">
            {currentQuestionIndex + 1} / {QUESTIONS.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-8">
          <div 
            className="bg-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-secondary rounded-lg p-8 mb-8">
          {/* Category & Arena */}
          <div className="flex items-center mb-4">
            <ArenaIcon className={`h-6 w-6 mr-2 ${getArenaColor(currentQuestion.arena)}`} />
            <span className="text-sm text-text-secondary">
              {currentQuestion.category} • {currentQuestion.arena.toUpperCase()}
            </span>
          </div>

          {/* Question */}
          <h2 className="text-xl font-semibold text-text-primary mb-6">
            {currentQuestion.text}
          </h2>

          {/* Answer Options */}
          {renderQuestion()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center px-4 py-2 text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Previous
          </button>

          <button
            onClick={nextQuestion}
            disabled={answers[currentQuestion.id] === undefined}
            className="flex items-center px-6 py-2 bg-accent text-primary font-medium rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestionIndex === QUESTIONS.length - 1 ? 'Complete' : 'Next'}
            {currentQuestionIndex < QUESTIONS.length - 1 && (
              <ChevronRight className="h-4 w-4 ml-1" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentScreen;