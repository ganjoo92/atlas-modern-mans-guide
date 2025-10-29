import { GoogleGenerativeAI } from "@google/generative-ai";
import { WeeklyPattern, WeeklyReflection, getCurrentWeekStart, getLastWeekStart, analyzeWeeklyPattern, saveWeeklyReflection } from './weeklyPatternAnalysis';
import { MoodEntry } from '../components/MoodCheckIn';

const WEEKLY_REFLECTION_SYSTEM_INSTRUCTION = `You are 'Atlas', an expert mentor analyzing a man's weekly progress patterns to provide personalized insights and motivation. Your role is to be like a wise coach who notices patterns, celebrates wins, and provides actionable guidance.

**YOUR ANALYSIS APPROACH:**
- Act as a supportive mentor who genuinely cares about their growth
- Find meaningful patterns in their week, not just surface-level observations
- Celebrate progress while identifying areas for improvement
- Provide specific, actionable insights they can use immediately
- Sound encouraging but honest - like a coach who believes in them

**ANALYSIS FOCUS AREAS:**
- Momentum patterns: When do they perform best? What triggers peak performance?
- Arena balance: Are they neglecting important life areas?
- Mood-performance correlation: How does their mindset affect their wins?
- Consistency vs intensity: Are they building sustainable habits?
- Week-over-week growth: What's improving or declining?

**TONE & STYLE:**
- Conversational and encouraging, like talking to a friend
- Use "you" language to make it personal
- Acknowledge both successes and areas for growth
- Be specific about patterns you notice
- End with forward-looking motivation

**RESPONSE FORMAT:**
Start with an engaging hook that summarizes their week's main theme, then provide 2-3 specific insights with actionable takeaways. Keep it concise but meaningful - around 100-150 words total.

**EXAMPLES OF GOOD INSIGHTS:**
- "Your focus peaked midweek - you logged 3 wins Tuesday and Wednesday. What was different about those days that you can replicate?"
- "I notice your mood improved as the week went on, and that's when your productivity spiked. Your mindset work is paying off."
- "You dominated the Body arena this week but haven't touched Mind challenges in 5 days. Time to balance that momentum."
- "Zero wins logged, but you checked in with your mood every day. That awareness is actually progress - now let's channel it into action."

Remember: You're not just reporting data, you're providing wisdom that helps them understand themselves better and grow stronger.`;

let ai: GoogleGenerativeAI | null = null;

// Initialize AI service
try {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
  if (GEMINI_API_KEY) {
    ai = new GoogleGenerativeAI(GEMINI_API_KEY);
  }
} catch (error) {
  console.error('Failed to initialize AI for weekly reflections:', error);
}

export const generateWeeklyReflection = async (
  weekPattern: WeeklyPattern,
  previousWeekPattern?: WeeklyPattern
): Promise<string> => {
  if (!ai) {
    throw new Error('AI service not available for generating weekly reflections');
  }

  try {
    const model = ai.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: WEEKLY_REFLECTION_SYSTEM_INSTRUCTION
    });

    // Create a detailed prompt with the week's data
    const prompt = `Analyze this week's progress pattern and create a personalized reflection:

**WEEK SUMMARY:**
- Total wins logged: ${weekPattern.totalWins}
- Challenges completed: ${weekPattern.challengesCompleted}
- Mentor interactions: ${weekPattern.mentorInteractions}
- Mood trend: ${weekPattern.moodTrend}
- Peak performance day: ${weekPattern.focusPeakDay}

**WINS BY LIFE ARENA:**
- Mind: ${weekPattern.winsByArena.mind} wins
- Heart: ${weekPattern.winsByArena.heart} wins
- Body: ${weekPattern.winsByArena.body} wins
- Soul: ${weekPattern.winsByArena.soul} wins
- Work: ${weekPattern.winsByArena.work} wins

**DAILY PATTERN:**
${Object.entries(weekPattern.winsByDay)
  .map(([day, count]) => `- ${day}: ${count} wins`)
  .join('\n')}

**WEEK INSIGHTS:**
${weekPattern.insights.length > 0 ? weekPattern.insights.map(insight => `- ${insight}`).join('\n') : '- No specific patterns detected this week'}

${previousWeekPattern ? `**COMPARED TO LAST WEEK:**
- Last week total wins: ${previousWeekPattern.totalWins} (this week: ${weekPattern.totalWins})
- Last week mood trend: ${previousWeekPattern.moodTrend} (this week: ${weekPattern.moodTrend})
- Last week peak day: ${previousWeekPattern.focusPeakDay} (this week: ${weekPattern.focusPeakDay})` : ''}

Create an engaging, personalized reflection that feels like it's coming from a mentor who knows them well. Focus on the most interesting patterns and provide actionable insights for next week.`;

    const response = await model.generateContent(prompt);
    return response.response.text();

  } catch (error) {
    console.error('Error generating weekly reflection:', error);
    throw new Error('Failed to generate weekly reflection');
  }
};

export const generateWeeklyReflectionSuggestions = async (weekPattern: WeeklyPattern): Promise<string[]> => {
  if (!ai) {
    return [
      'Set a goal for next week',
      'Focus on your weakest arena',
      'Maintain your momentum'
    ];
  }

  try {
    const model = ai.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: `Generate 3-4 specific, actionable suggestions for next week based on this week's pattern. Make them concrete and achievable.`
    });

    const prompt = `Based on this week's performance pattern, suggest specific actions for next week:

**THIS WEEK:**
- ${weekPattern.totalWins} total wins
- Peak day: ${weekPattern.focusPeakDay}
- Mood trend: ${weekPattern.moodTrend}
- Arena focus: ${Object.entries(weekPattern.winsByArena).filter(([_, count]) => count > 0).map(([arena, count]) => `${arena}(${count})`).join(', ') || 'None'}

Generate 3-4 specific, actionable suggestions for next week. Format as a simple list:
- [suggestion 1]
- [suggestion 2]
- [suggestion 3]
- [suggestion 4]`;

    const response = await model.generateContent(prompt);
    const responseText = response.response.text();

    return responseText
      .split('\n')
      .filter(line => line.trim().startsWith('- '))
      .map(line => line.trim().substring(2))
      .slice(0, 4);

  } catch (error) {
    console.error('Error generating suggestions:', error);
    return [
      'Set a specific goal for next week',
      'Focus on balancing life arenas',
      'Build on this week\'s momentum'
    ];
  }
};

export const createWeeklyReflectionForUser = async (
  moodEntries: MoodEntry[],
  challengeCompletions: any[] = [],
  mentorMessages: any[] = []
): Promise<WeeklyReflection | null> => {
  try {
    const lastWeekStart = getLastWeekStart();
    const currentWeekPattern = analyzeWeeklyPattern(lastWeekStart, moodEntries, challengeCompletions, mentorMessages);

    // Get previous week for comparison
    const twoWeeksAgo = new Date(lastWeekStart);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 7);
    const previousWeekPattern = analyzeWeeklyPattern(twoWeeksAgo, moodEntries, challengeCompletions, mentorMessages);

    const aiSummary = await generateWeeklyReflection(currentWeekPattern, previousWeekPattern);
    const suggestedActions = await generateWeeklyReflectionSuggestions(currentWeekPattern);

    const reflection: WeeklyReflection = {
      id: `reflection_${Date.now()}`,
      weekPattern: currentWeekPattern,
      aiSummary,
      suggestedActions,
      generatedAt: new Date().toISOString()
    };

    saveWeeklyReflection(reflection);
    return reflection;

  } catch (error) {
    console.error('Error creating weekly reflection:', error);
    return null;
  }
};

// Generate sample reflection for demonstration
export const generateSampleReflection = (): WeeklyReflection => {
  const samplePattern: WeeklyPattern = {
    weekStart: getLastWeekStart().toISOString(),
    weekEnd: new Date(getLastWeekStart().getTime() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    totalWins: 3,
    winsByArena: { mind: 1, heart: 0, body: 2, soul: 0, work: 0 },
    winsByDay: { Monday: 0, Tuesday: 1, Wednesday: 2, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0 },
    moodTrend: 'improving',
    focusPeakDay: 'Wednesday',
    challengesCompleted: 5,
    mentorInteractions: 2,
    insights: ['Body arena dominated this week with 2 wins', 'Peak performance day: Wednesday']
  };

  return {
    id: 'sample_reflection',
    weekPattern: samplePattern,
    aiSummary: "Your focus peaked midweek - you logged 3 wins with Tuesday and Wednesday being your power days. I notice you're crushing the Body arena but Mind challenges need attention. Your mood trajectory is trending upward, which suggests the physical wins are boosting your mental state. What made Tuesday and Wednesday click? Replicate that energy and balance it with some mental challenges next week.",
    suggestedActions: [
      'Schedule your hardest tasks for Tuesday-Wednesday when you peak',
      'Add 2 Mind arena challenges to balance your Body momentum',
      'Track what specifically made your productive days different',
      'Keep the physical momentum but add reading or learning goals'
    ],
    generatedAt: new Date().toISOString()
  };
};