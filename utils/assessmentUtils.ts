// Assessment Data Storage and Management Utilities

export interface AssessmentResult {
  id: string;
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
  answers: { [key: number]: number | string };
}

// Local Storage Keys
const ASSESSMENT_HISTORY_KEY = 'atlas_assessment_history';
const CURRENT_RESULTS_KEY = 'atlas_current_assessment';

/**
 * Save assessment result to local storage
 */
export const saveAssessmentResult = (result: AssessmentResult): void => {
  try {
    // Get existing history
    const history = getAssessmentHistory();
    
    // Add new result to the beginning
    const updatedHistory = [result, ...history];
    
    // Keep only last 10 assessments
    const trimmedHistory = updatedHistory.slice(0, 10);
    
    // Save to localStorage
    localStorage.setItem(ASSESSMENT_HISTORY_KEY, JSON.stringify(trimmedHistory));
    localStorage.setItem(CURRENT_RESULTS_KEY, JSON.stringify(result));
  } catch (error) {
    console.error('Error saving assessment result:', error);
  }
};

/**
 * Get assessment history from local storage
 */
export const getAssessmentHistory = (): AssessmentResult[] => {
  try {
    const history = localStorage.getItem(ASSESSMENT_HISTORY_KEY);
    if (!history) return [];
    
    const parsed = JSON.parse(history);
    
    // Convert date strings back to Date objects
    return parsed.map((result: any) => ({
      ...result,
      completedDate: new Date(result.completedDate)
    }));
  } catch (error) {
    console.error('Error loading assessment history:', error);
    return [];
  }
};

/**
 * Get the most recent assessment result
 */
export const getCurrentAssessmentResult = (): AssessmentResult | null => {
  try {
    const current = localStorage.getItem(CURRENT_RESULTS_KEY);
    if (!current) return null;
    
    const parsed = JSON.parse(current);
    return {
      ...parsed,
      completedDate: new Date(parsed.completedDate)
    };
  } catch (error) {
    console.error('Error loading current assessment:', error);
    return null;
  }
};

/**
 * Clear all assessment data
 */
export const clearAssessmentData = (): void => {
  try {
    localStorage.removeItem(ASSESSMENT_HISTORY_KEY);
    localStorage.removeItem(CURRENT_RESULTS_KEY);
  } catch (error) {
    console.error('Error clearing assessment data:', error);
  }
};

/**
 * Calculate improvement between two assessments
 */
export const calculateImprovement = (current: number, previous: number): number => {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * Get coaching recommendations based on assessment results
 */
export const getCoachingRecommendations = (result: AssessmentResult): {
  immediateActions: string[];
  weeklyGoals: string[];
  monthlyTargets: string[];
  recommendedMentor: string;
} => {
  const recommendations = {
    immediateActions: [] as string[],
    weeklyGoals: [] as string[],
    monthlyTargets: [] as string[],
    recommendedMentor: 'atlas'
  };

  // Based on coaching path
  switch (result.coachingPath) {
    case 'mental-wellness-first':
      recommendations.immediateActions = [
        'Download a meditation app and do 5 minutes today',
        'Create a simple morning routine',
        'Practice one deep breathing exercise'
      ];
      recommendations.weeklyGoals = [
        'Establish consistent sleep schedule',
        'Practice stress management techniques',
        'Journal for 10 minutes daily'
      ];
      recommendations.monthlyTargets = [
        'Complete mental health assessment with professional',
        'Build sustainable stress management routine',
        'Improve emotional regulation skills'
      ];
      recommendations.recommendedMentor = 'phoenix';
      break;

    case 'social-confidence':
      recommendations.immediateActions = [
        'Make eye contact and smile at 3 strangers today',
        'Start one conversation with a cashier or barista',
        'Practice good posture for the next hour'
      ];
      recommendations.weeklyGoals = [
        'Attend one social event or gathering',
        'Practice conversation starters',
        'Work on active listening skills'
      ];
      recommendations.monthlyTargets = [
        'Join a social group or hobby club',
        'Improve dating confidence',
        'Build meaningful friendships'
      ];
      recommendations.recommendedMentor = 'sage';
      break;

    case 'physical-foundation':
      recommendations.immediateActions = [
        'Do 10 push-ups or bodyweight squats',
        'Plan tomorrow\'s meals',
        'Review your grooming routine'
      ];
      recommendations.weeklyGoals = [
        'Exercise 3 times this week',
        'Improve grooming and style',
        'Optimize sleep schedule'
      ];
      recommendations.monthlyTargets = [
        'Establish consistent fitness routine',
        'Develop personal style',
        'Improve overall health markers'
      ];
      recommendations.recommendedMentor = 'titan';
      break;

    case 'career-momentum':
      recommendations.immediateActions = [
        'Update your LinkedIn profile',
        'Set one professional goal for this week',
        'Organize your workspace'
      ];
      recommendations.weeklyGoals = [
        'Network with one new professional contact',
        'Learn a new skill related to your career',
        'Improve time management'
      ];
      recommendations.monthlyTargets = [
        'Advance career progression plan',
        'Increase income or responsibility',
        'Build professional reputation'
      ];
      recommendations.recommendedMentor = 'forge';
      break;

    case 'purpose-clarity':
      recommendations.immediateActions = [
        'Write down your top 5 values',
        'Reflect on what truly matters to you',
        'Set aside 15 minutes for self-reflection'
      ];
      recommendations.weeklyGoals = [
        'Explore your life purpose',
        'Align actions with values',
        'Practice gratitude daily'
      ];
      recommendations.monthlyTargets = [
        'Create life vision and mission',
        'Align career with purpose',
        'Develop spiritual practice'
      ];
      recommendations.recommendedMentor = 'atlas';
      break;

    default:
      recommendations.immediateActions = [
        'Choose one area to focus on today',
        'Set a small, achievable goal',
        'Take one action toward improvement'
      ];
      recommendations.weeklyGoals = [
        'Create daily routine',
        'Track progress',
        'Maintain consistency'
      ];
      recommendations.monthlyTargets = [
        'Build sustainable habits',
        'See measurable improvement',
        'Expand growth to other areas'
      ];
  }

  return recommendations;
};

/**
 * Generate progress insights from assessment history
 */
export const generateProgressInsights = (history: AssessmentResult[]): {
  overallTrend: 'improving' | 'stable' | 'declining';
  bestImprovedArea: string;
  needsAttentionArea: string;
  insights: string[];
} => {
  if (history.length < 2) {
    return {
      overallTrend: 'stable',
      bestImprovedArea: 'none',
      needsAttentionArea: 'none',
      insights: ['Take more assessments to track your progress over time.']
    };
  }

  const latest = history[0];
  const previous = history[1];
  
  const overallImprovement = calculateImprovement(latest.overallScore, previous.overallScore);
  
  // Determine overall trend
  let overallTrend: 'improving' | 'stable' | 'declining' = 'stable';
  if (overallImprovement > 2) overallTrend = 'improving';
  else if (overallImprovement < -2) overallTrend = 'declining';

  // Find best improved and needs attention areas
  const arenaImprovements = Object.entries(latest.arenaScores).map(([arena, score]) => {
    const previousScore = previous.arenaScores[arena as keyof typeof previous.arenaScores] as number;
    return {
      arena,
      improvement: calculateImprovement(score as number, previousScore)
    };
  });

  const bestImproved = arenaImprovements.reduce((best, current) => 
    current.improvement > best.improvement ? current : best
  );

  const needsAttention = arenaImprovements.reduce((worst, current) => 
    current.improvement < worst.improvement ? current : worst
  );

  // Generate insights
  const insights = [];
  
  if (overallTrend === 'improving') {
    insights.push(`Great progress! You've improved your overall score by ${overallImprovement.toFixed(1)}%.`);
  } else if (overallTrend === 'declining') {
    insights.push(`Your scores have dipped slightly. This is normal - focus on consistency.`);
  }

  if (bestImproved.improvement > 5) {
    insights.push(`Your ${bestImproved.arena} area has improved significantly (+${bestImproved.improvement.toFixed(1)}%).`);
  }

  if (needsAttention.improvement < -5) {
    insights.push(`Consider focusing more attention on your ${needsAttention.arena} area.`);
  }

  if (history.length >= 3) {
    insights.push(`You've been consistently tracking your progress - that's a great habit!`);
  }

  return {
    overallTrend,
    bestImprovedArea: bestImproved.arena,
    needsAttentionArea: needsAttention.arena,
    insights
  };
};