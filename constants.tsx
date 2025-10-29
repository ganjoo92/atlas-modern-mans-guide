import React from 'react';
import { LifeArena, Article, Post, Challenge, NavItem, View, ChecklistItem, Workout, DateIdea } from './types';
import {
  BrainIcon,
  HeartIcon,
  DumbbellIcon,
  UserGroupIcon,
  UsersIcon, // Added missing import
  BriefcaseIcon,
  SparklesIcon,
  BookOpenIcon,
  CheckBadgeIcon,
  Home,
  UserIcon,
  InformationCircleIcon,
  ScissorsIcon,
  ClockIcon,
  Settings,
  TrendingUp,
} from './components/Icons';

export const LIFE_ARENAS: LifeArena[] = [
  {
    id: 'mind',
    title: 'Mind',
    description: 'Mental clarity, focus, and emotional intelligence.',
    icon: BrainIcon,
    color: 'text-blue-400',
    gradient: 'from-blue-500/20 to-secondary',
  },
  {
    id: 'heart',
    title: 'Heart',
    description: 'Relationships, connection, and social skills.',
    icon: HeartIcon,
    color: 'text-red-400',
    gradient: 'from-red-500/20 to-secondary',
  },
  {
    id: 'body',
    title: 'Body',
    description: 'Fitness, nutrition, and physical well-being.',
    icon: DumbbellIcon,
    color: 'text-green-400',
    gradient: 'from-green-500/20 to-secondary',
  },
  {
    id: 'work',
    title: 'Work',
    description: 'Career, productivity, and financial mastery.',
    icon: BriefcaseIcon,
    color: 'text-yellow-400',
    gradient: 'from-yellow-500/20 to-secondary',
  },
  {
    id: 'soul',
    title: 'Soul',
    description: 'Purpose, presence, and personal growth.',
    icon: SparklesIcon,
    color: 'text-purple-400',
    gradient: 'from-purple-500/20 to-secondary',
  },
];

export const NAV_ITEMS_PRIMARY: NavItem[] = [
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'mentor', label: 'AI Mentor', icon: SparklesIcon },
  { id: 'grooming', label: 'Style & Body', icon: ScissorsIcon },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'mycode', label: 'My Code', icon: UserIcon },
  { id: 'guides', label: 'Guides', icon: BookOpenIcon },
];

export const NAV_ITEMS_EXPLORE: NavItem[] = [
  { id: 'dating', label: 'Dating Toolkit', icon: HeartIcon },
  { id: 'tools', label: 'Tools', icon: Settings },
  { id: 'challenges', label: 'Challenges', icon: CheckBadgeIcon },
  { id: 'community', label: 'Community', icon: UsersIcon },
];

export const NAV_ITEMS_SUPPORT: NavItem[] = [
  { id: 'focus', label: 'Focus Mode', icon: ClockIcon },
  { id: 'about', label: 'About', icon: InformationCircleIcon },
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: 1,
    title: "The Art of Active Listening",
    summary: "Most conflicts arise from misunderstanding. Learn how to truly hear what others are saying.",
    imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
    category: "Communication",
    arena: 'heart',
    content: `
### The Core Problem
We often listen to reply, not to understand. We're formulating our response while the other person is still speaking. This is the root of countless arguments and feelings of being unheard in relationships, friendships, and professional settings.

### What is Active Listening?
Active listening is a communication technique that requires the listener to fully concentrate, understand, respond, and then remember what is being said. It's about being present in the conversation.

### Three Key Steps
- **Paraphrase:** After the person speaks, repeat back what you heard in your own words. Start with, "So, if I'm understanding you correctly..." or "It sounds like you're feeling...". This clarifies your understanding and validates their feelings.

- **Ask Open-Ended Questions:** Instead of "yes/no" questions, ask questions that encourage deeper explanation. For example, instead of "Are you upset?", try "Can you tell me more about what's making you feel that way?".

- **Pay Attention to Non-Verbal Cues:** A significant portion of communication is non-verbal. Notice their tone of voice, posture, and facial expressions. Are they avoiding eye contact? Do they seem tense? Acknowledging this can show a deeper level of empathy, e.g., "I notice you seem really tense while we're talking about this."

### The Payoff
Mastering active listening will not only prevent conflicts but will also deepen your relationships. People will feel respected, heard, and more connected to you. It is a superpower in a world full of noise.
`
  },
  {
    id: 2,
    title: "The 2-Minute Rule to Stop Procrastinating",
    summary: "Beat procrastination by making tasks so small you can't say no. Build momentum and watch it grow.",
    imageUrl: "https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Productivity",
    arena: 'work',
    content: `
### Why We Procrastinate
Procrastination isn't about laziness; it's often about emotion. We avoid tasks that make us feel bad: boredom, frustration, anxiety, self-doubt. The bigger the task, the more overwhelming it feels, and the more likely we are to put it off.

### Introducing the 2-Minute Rule
The rule is simple: When you start a new habit, it should take less than two minutes to do.

- "Read before bed each night" becomes "Read one page."
- "Study for class" becomes "Open my notes."
- "Fold the laundry" becomes "Fold one pair of socks."
- "Run three miles" becomes "Put on my running shoes."

### How It Works
The goal of the 2-Minute Rule is not to get results, but to master the art of showing up. It's a gateway habit. The real goal is to get started. Anyone can read one page, or open their notes, or put on their running shoes. Once you've started, it's much easier to continue.

### Building Momentum
A new habit should not feel like a challenge. The actions that follow can be challenging, but the first two minutes should be easy. This is how you build momentum. The feeling of accomplishment, even from a tiny action, is a powerful motivator. Use this rule to get started on anything you've been putting off.
`
  },
  {
    id: 3,
    title: "Understanding Your 'Why': The Foundation of Discipline",
    summary: "Motivation fades, but purpose endures. Discovering your 'why' is the key to long-term discipline.",
    imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1674&q=80",
    category: "Mindset",
    arena: 'soul',
    content: `
### Motivation vs. Discipline
Motivation is an emotion. It's a fleeting feeling that gets you excited to start something. Discipline is a system. It's the engine that keeps you going when the initial excitement wears off. You cannot rely on motivation to achieve long-term goals.

### What is Your 'Why'?
Your 'why' is your core purpose. It's the deep-seated reason behind your goals.
- You don't just want to 'get in shape'. You want the energy to be present for your kids, the confidence to feel good in your own skin, and the health to live a long, vibrant life. THAT is your 'why'.
- You don't just want to 'get a promotion'. You want to provide security for your family, challenge yourself intellectually, and build something meaningful. THAT is your 'why'.

### How to Find It
Ask yourself "Why?" five times.
1.  **Goal:** I want to save more money.
2.  **Why?** To have a financial cushion.
3.  **Why?** To feel less anxious about the future.
4.  **Why?** To have the freedom to make choices without being trapped.
5.  **Why?** Because I value freedom and peace of mind above all else.

Now, 'saving money' is not a chore. It's a direct action toward achieving freedom and peace of mind.

### The Power of Purpose
When you are connected to your 'why', the daily actions required to achieve your goals are no longer negotiable. Waking up early to work out isn't a debate when it's tied to being a great father. Saying no to a frivolous purchase is easy when you're buying your future freedom.
`
  },
   {
    id: 4,
    title: "The No-Nonsense Guide to Compound Lifting",
    summary: "Build foundational strength and muscle efficiently with the 'big three' lifts.",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Fitness",
    arena: 'body',
    content: `
### What Are Compound Lifts?
Compound lifts are multi-joint movements that work several muscles or muscle groups at once. Instead of isolating a single muscle (like a bicep curl), you're engaging your entire body. This is the most efficient way to build strength and muscle.

### The Big Three
- **Squat:** The king of leg exercises. Works your quads, hamstrings, glutes, and core. Proper form is crucial to avoid injury. Focus on keeping your chest up and back straight.

- **Deadlift:** The ultimate full-body lift. Engages your back, legs, glutes, and grip strength. It's a powerful movement but requires strict attention to form. Start light and perfect the movement before adding significant weight.

- **Bench Press:** The classic upper-body strength builder. Primarily works the chest, shoulders, and triceps. Ensure your shoulder blades are retracted and your feet are planted firmly on the ground.

### Why They Work
These exercises trigger a significant hormonal response (testosterone and growth hormone) that promotes muscle growth all over your body. They also build functional strength that translates directly to real-world activities.

### Getting Started
Focus on form over weight. Watch tutorials, consider hiring a coach for a session, or record yourself to check your technique. A simple routine could be performing one of these lifts at the start of your workout, 3-4 sets of 5-8 reps, and then adding a few accessory exercises.
`
  },
  {
    id: 5,
    title: "Escaping the Comparison Trap",
    summary: "Social media is a highlight reel. Learn to focus on your own journey, not someone else's.",
    imageUrl: "https://images.unsplash.com/photo-1530184499186-8a18f4a4e327?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "Mental Health",
    arena: 'mind',
    content: `
### The Illusion of Social Media
It's crucial to remember that what you see online is a curated version of reality. People post their wins, their perfect vacations, their new promotions—not their struggles, their self-doubts, or their boring Tuesday nights. You are comparing your behind-the-scenes to their highlight reel. It's a game you can't win.

### The Real Cost of Comparison
Comparing yourself to others is the thief of joy. It breeds resentment, envy, and a feeling of inadequacy. It distracts you from your own path and your own progress. Your journey is unique. Your starting point, your challenges, and your goals are different from everyone else's.

### Practical Steps to Break Free
- **Curate Your Feed:** Unfollow accounts that consistently make you feel bad about yourself. Follow people who inspire, educate, or entertain you in a positive way. Your social media feed should be a tool for your growth, not a source of your anxiety.

- **Practice Gratitude:** Actively focus on what you have, not what you lack. Spend a few minutes each day writing down three things you are grateful for. This simple act shifts your perspective from scarcity to abundance.

- **Track Your Own Progress:** Instead of comparing your chapter 1 to someone else's chapter 20, compare yourself to who you were last week, last month, or last year. Are you making progress? Are you learning? That's the only comparison that matters.
`
  },
  {
    id: 6,
    title: "Building Dating Confidence: Overcoming Anxiety and Self-Doubt",
    summary: "True confidence comes from within. Learn practical strategies to build genuine self-esteem and overcome dating anxiety.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "Dating Confidence",
    arena: 'heart',
    content: `
### Understanding Dating Anxiety
Dating anxiety is normal and more common than you think. It stems from fear of rejection, judgment, or not being 'enough.' The key is not to eliminate anxiety entirely, but to manage it and build genuine confidence alongside it.

### Building Internal Confidence
- **Know Your Values:** Be clear about what matters to you. When you're grounded in your values, you're less likely to compromise yourself for someone else's approval. This authenticity is attractive and sustainable.

- **Develop Your Interests:** Pursue hobbies and passions that genuinely interest you. This gives you interesting things to talk about and makes you a more well-rounded person. Plus, shared interests are a great foundation for connections.

- **Practice Self-Compassion:** Talk to yourself the way you'd talk to a good friend. Replace harsh self-criticism with understanding and encouragement. Confidence grows in an environment of self-acceptance, not self-attack.

### Practical Confidence Building
- **Start Small:** Practice conversations with cashiers, baristas, or neighbors. Build your social comfort gradually rather than jumping into high-stakes dating situations.

- **Focus on Connection, Not Perfection:** The goal isn't to be perfect; it's to connect authentically with another person. Shift your focus from 'Will they like me?' to 'Do I like them? Are we compatible?'

- **Reframe Rejection:** Rejection isn't a reflection of your worth; it's simply incompatibility. Every 'no' gets you closer to a 'yes' with someone who's truly right for you.

### Remember: Confidence is attractive, but desperation never is. Work on becoming the kind of person you'd want to date.
`
  },
  {
    id: 7,
    title: "Approaching Women: Respectful Ways to Initiate Conversations",
    summary: "Learn how to approach and start conversations naturally, respectfully, and without coming across as pushy or insincere.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    category: "Social Skills",
    arena: 'heart',
    content: `
### The Foundation: Respect and Authenticity
Before any conversation technique, understand this: every woman is a complete human being with her own thoughts, feelings, and agenda. Your approach should honor that reality. You're not trying to 'get' something from her; you're exploring if there's mutual interest and compatibility.

### Reading the Room
- **Body Language Matters:** If she's wearing headphones, deeply focused on something, or giving closed-off body language, respect those signals. Good timing is everything.

- **Choose Appropriate Settings:** Coffee shops, bookstores, social events, and classes are generally better than gyms, public transport, or when she's clearly in a hurry. Context matters.

### Natural Conversation Starters
- **Situational Comments:** "That book looks interesting, what's it about?" or "Have you tried the coffee here before?" These feel natural and non-threatening.

- **Genuine Compliments:** Focus on choices rather than appearance. "I love your taste in music" (if you notice her band t-shirt) feels much better than commenting on physical features.

- **Ask for Opinions:** "I'm trying to decide between these two options, what do you think?" People generally like to help and share their perspective.

### The 5-Second Rule
If she doesn't seem engaged after a few exchanges (short answers, looking away, checking her phone), politely wrap up the conversation. "Well, I don't want to keep you. Have a great day!" This shows respect for her time and comfort.

### Most Important: Accept Rejection Gracefully
If she's not interested, respond with a simple "No worries, have a great day!" and move on. How you handle rejection says everything about your character. Being gracious in rejection is a mark of maturity and respect.
`
  },
  {
    id: 8,
    title: "First Date Success: Planning, Conversation, and Red Flags",
    summary: "Master the art of first dates with thoughtful planning, engaging conversation, and the wisdom to recognize compatibility early.",
    imageUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Dating Skills",
    arena: 'heart',
    content: `
### Planning the Perfect First Date
- **Keep It Simple:** Coffee, lunch, or a casual walk are ideal. They're low-pressure, time-limited, and easy to extend if things go well or wrap up if they don't.

- **Choose a Place You Know:** Pick somewhere you're comfortable and can have a conversation without shouting over loud music. Familiarity helps you stay relaxed.

- **Have a Backup Plan:** If coffee goes well, know a nearby park or ice cream shop where you can continue the conversation.

### Conversation That Flows
- **Ask Open-Ended Questions:** Instead of "Do you like your job?" try "What's the most interesting part of your work?" This invites storytelling and deeper sharing.

- **Share, Don't Interview:** For every question you ask, share something about yourself. Conversation should feel like a tennis match, not an interrogation.

- **Find Common Ground:** Look for shared experiences, values, or interests. These create connection and future conversation topics.

### Topics to Explore
- Travel experiences and dream destinations
- Books, movies, or shows that impacted them
- What they're passionate about or working toward
- Funny stories or memorable experiences
- Their thoughts on current events (but keep it light)

### Red Flags to Watch For
- **Rudeness to Service Staff:** How someone treats waiters, baristas, or other service workers reveals their character.

- **Phone Obsession:** Constantly checking their phone or being distracted shows lack of respect for your time together.

- **Negative Attitudes:** Constant complaining about exes, work, friends, or life in general suggests they might not be in a good place for a relationship.

- **Pushing Boundaries:** If they don't respect your 'no' about small things (like ordering for you when you decline), they likely won't respect bigger boundaries.

### Trust Your Gut
If something feels off, it probably is. First dates should leave you feeling energized and excited to see them again, not drained or uncomfortable.
`
  },
  {
    id: 9,
    title: "Building Connections: From Surface-Level to Meaningful Conversations",
    summary: "Transform small talk into genuine connection by learning how to create emotional intimacy through authentic conversation.",
    imageUrl: "https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Relationship Building",
    arena: 'heart',
    content: `
### Moving Beyond Small Talk
Small talk serves a purpose—it's a way to gauge comfort and compatibility before diving deeper. But real connection happens when you move beyond the surface. The key is knowing when and how to transition to more meaningful topics.

### The Art of Vulnerable Sharing
- **Start Small:** Share something mildly personal first. "I've been thinking about changing careers lately" is more personal than discussing the weather, but not overly intimate.

- **Match Energy:** If they share something personal, reciprocate at a similar level. Don't jump from casual to deeply intimate too quickly.

- **Be Genuine:** Share real thoughts and feelings, not what you think they want to hear. Authenticity creates trust, which creates connection.

### Questions That Create Connection
- "What's something you're really excited about right now?"
- "What's been on your mind lately?"
- "What's something most people don't know about you?"
- "What's been the highlight of your week/month?"
- "What's something you've changed your mind about recently?"

### The Power of Follow-Up Questions
When someone shares something meaningful, don't just nod and move on. Dig deeper:
- "What was that experience like for you?"
- "How did that change your perspective?"
- "What did you learn about yourself?"

### Creating Emotional Safety
- **Don't Judge:** React to vulnerable sharing with curiosity and acceptance, not judgment or advice (unless they ask for it).

- **Remember Details:** Reference things they've told you in previous conversations. This shows you value what they share and are truly listening.

- **Share Your Own Struggles:** Perfect people are hard to relate to. Sharing your challenges and growth makes you more human and approachable.

### Building Intimacy Over Time
Real connection isn't built in one conversation—it's developed through consistent, authentic interactions where both people feel seen, heard, and valued. Be patient with the process.
`
  },
  {
    id: 10,
    title: "Maintaining Relationships: Long-Term Partnership Skills and Compromise",
    summary: "Learn the essential skills for nurturing lasting relationships: effective communication, healthy compromise, and mutual support.",
    imageUrl: "https://images.unsplash.com/photo-1573497161161-c3e73707e25c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    category: "Relationship Maintenance",
    arena: 'heart',
    content: `
### The Foundation: Respect and Appreciation
Long-term relationships require intentional effort. The excitement of early dating naturally fades, but deep love and connection can grow stronger if you cultivate it. Start with daily appreciation and respect for your partner as a separate, complete person.

### Healthy Communication Patterns
- **Fight Fair:** Address the behavior, not the person. "I feel hurt when..." is better than "You always..." Avoid character attacks and generalizations.

- **Take Breaks:** If emotions are high, take a 20-minute break to cool down. Come back when you can discuss, not just react.

- **Listen to Understand:** Your goal isn't to win; it's to understand each other and find solutions. Ask clarifying questions and repeat back what you heard.

### The Art of Compromise
- **Pick Your Battles:** Not every disagreement needs to be a fight. Ask yourself: "Will this matter in 5 years?" Some things are worth letting go.

- **Find Win-Win Solutions:** Look for creative solutions where both people get their needs met, rather than one person winning and one losing.

- **Take Turns:** For decisions where compromise isn't possible, take turns getting your way. Keep track to ensure fairness over time.

### Supporting Each Other's Growth
- **Encourage Dreams:** Support your partner's goals and ambitions, even if they don't directly benefit you. Healthy relationships help both people become their best selves.

- **Maintain Independence:** Keep your friendships, hobbies, and personal growth separate from your relationship. You should enhance each other's lives, not complete them.

- **Celebrate Successes:** Be genuinely happy for your partner's wins. Jealousy or competition within a relationship is toxic.

### Regular Relationship Maintenance
- **Weekly Check-ins:** Set aside time to discuss how the relationship is going. What's working? What needs attention?

- **Date Nights:** Continue courting each other. Regular one-on-one time away from life's responsibilities keeps the romantic connection alive.

- **Express Gratitude:** Regularly tell your partner what you appreciate about them. Don't assume they know.

### Remember: A healthy relationship should make both people's lives better, not harder. If you're constantly walking on eggshells or feeling drained, that's a sign something needs to change.
`
  },
  {
    id: 11,
    title: "Mental Fitness Warm-Up: Daily Practices to Stay Sharp",
    summary: "Three quick drills to release pressure, process emotions, and stay mission ready.",
    imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    category: "Mental Fitness",
    arena: 'mind',
    content: `
### Why mental reps matter
Your performance collapses when stress stacks up and the nervous system never resets. Treat emotional regulation like a training block—warm up, execute, recover.

### Drill 1: Box breathing reset (4-7-8)
- Inhale through the nose for four counts.
- Hold for seven counts.
- Exhale through the mouth for eight counts.
- Repeat four rounds, focusing on slow, controlled exhales to downshift your nervous system.

### Drill 2: Emotional tag journal
- Write one sentence naming the emotion ("I feel...").
- Add one sentence describing the trigger.
- Close with one action you can take (call, walk, plan). Action beats rumination.

### Drill 3: Brotherhood check-in
Send a 30-second voice note to a trusted brother. Share the headline of your day and ask for one insight. Strength is built in community, not isolation.

### When to escalate
If you log multiple days feeling strained, talk to a professional. Atlas keeps you accountable, and reaching for qualified support is how you lead for the long haul.
`
  }
];

export const MOCK_POSTS: Post[] = [
    {
        id: 1,
        author: 'Consistent_Cal',
        timestamp: '3 hours ago',
        title: "Feeling stuck in my career. Any advice?",
        content: "I've been in the same role for 4 years and feel like I'm not growing. My boss doesn't seem to value my contributions. I want to make a change but I'm afraid to leave a stable job. Has anyone navigated a similar situation?",
        comments: 12,
        upvotes: 45
    },
    {
        id: 2,
        author: 'GymNewbie88',
        timestamp: '8 hours ago',
        title: "What's a realistic fitness goal for a beginner?",
        content: "Just started going to the gym and I'm feeling a bit overwhelmed by all the information out there. I'm 35, work a desk job, and my main goal is to just feel healthier and have more energy. What's a good place to start?",
        comments: 23,
        upvotes: 78
    },
    {
        id: 3,
        author: 'Anxious_Alex',
        timestamp: '1 day ago',
        title: "How do you guys deal with social anxiety at work events?",
        content: "Got a mandatory company party coming up and I'm already dreading it. I'm terrible at small talk and usually just stand in the corner. Any tips for making these things less painful?",
        comments: 18,
        upvotes: 62
    }
];

// AI Mentor System
export interface SpecializedMentor {
  id: string;
  name: string;
  title: string;
  avatar: string;
  description: string;
  expertise: string[];
  color: string;
  promptCategories: {
    category: string;
    prompts: string[];
  }[];
}

export const SPECIALIZED_MENTORS: SpecializedMentor[] = [
  {
    id: 'atlas',
    name: 'Atlas',
    title: 'Life & Leadership Coach',
    avatar: '🧭',
    description: 'Your primary mentor for life guidance, goal-setting, and personal development.',
    expertise: ['Life Direction', 'Leadership', 'Goal Setting', 'Personal Growth', 'Confidence'],
    color: 'text-blue-400',
    promptCategories: [
      {
        category: 'Life Direction',
        prompts: [
          "I feel lost and don't know what direction my life should take.",
          "How do I find my purpose in life?",
          "I'm at a crossroads and need help making a big decision.",
          "How can I build a life that feels meaningful?"
        ]
      },
      {
        category: 'Confidence & Growth',
        prompts: [
          "I want to build unshakeable confidence.",
          "How do I overcome imposter syndrome?",
          "I'm afraid of taking risks and stepping out of my comfort zone.",
          "How can I develop better leadership skills?"
        ]
      }
    ]
  },
  {
    id: 'brotherhood',
    name: 'Jaxon',
    title: 'Brotherhood & Accountability Coach',
    avatar: '🛡️',
    description: 'Keeps you honest about your word, your routines, and the men you run with.',
    expertise: ['Accountability', 'Discipline', 'Brotherhood', 'Habits'],
    color: 'text-slate-300',
    promptCategories: [
      {
        category: 'Accountability & Standards',
        prompts: [
          "Hold me accountable to the cadence I picked during onboarding.",
          "I need a weekly reset ritual to stay disciplined.",
          "How do I build a brotherhood around me when I feel isolated?",
          "My routines slip on weekends—help me stay aligned.",
        ],
      },
      {
        category: 'Mission & Discipline',
        prompts: [
          "I want to structure my week like a professional athlete.",
          "How do I rebuild discipline after slipping for a month?",
          "Help me craft a personal code that actually sticks.",
          "What micro-habits do high-performing men rely on?",
        ],
      },
    ],
  },
  {
    id: 'phoenix',
    name: 'Dr. Phoenix',
    title: 'Emotional Wellness Specialist',
    avatar: '🔥',
    description: 'Expert in emotional intelligence, mental health, and overcoming life challenges.',
    expertise: ['Emotional Intelligence', 'Mental Health', 'Stress Management', 'Trauma Recovery'],
    color: 'text-orange-400',
    promptCategories: [
      {
        category: 'Emotional Health',
        prompts: [
          "I'm struggling with anxiety and stress.",
          "How do I process difficult emotions in a healthy way?",
          "I feel emotionally numb and disconnected.",
          "How can I build better emotional intelligence?"
        ]
      },
      {
        category: 'Mental Wellness',
        prompts: [
          "I'm dealing with depression and low motivation.",
          "How do I break negative thought patterns?",
          "I'm having trouble sleeping and it's affecting everything.",
          "How can I develop better coping mechanisms?"
        ]
      }
    ]
  },
  {
    id: 'sage',
    name: 'Sage',
    title: 'Relationship & Dating Coach',
    avatar: '💝',
    description: 'Specialist in relationships, dating, communication, and building meaningful connections.',
    expertise: ['Dating', 'Relationships', 'Communication', 'Intimacy', 'Social Skills'],
    color: 'text-pink-400',
    promptCategories: [
      {
        category: 'Dating & Attraction',
        prompts: [
          "I'm struggling with dating and meeting new people.",
          "How do I build genuine confidence with women?",
          "I keep getting rejected and it's crushing my self-esteem.",
          "How can I be more attractive without changing who I am?"
        ]
      },
      {
        category: 'Relationships',
        prompts: [
          "My relationship is struggling and I don't know how to fix it.",
          "How do I communicate better with my partner?",
          "We keep having the same fights over and over.",
          "How do I build deeper intimacy and connection?"
        ]
      }
    ]
  },
  {
    id: 'titan',
    name: 'Titan',
    title: 'Health & Fitness Expert',
    avatar: '💪',
    description: 'Your guide for physical health, fitness, nutrition, and building a strong body.',
    expertise: ['Fitness', 'Nutrition', 'Health', 'Body Image', 'Energy'],
    color: 'text-green-400',
    promptCategories: [
      {
        category: 'Fitness & Strength',
        prompts: [
          "I want to get in shape but don't know where to start.",
          "How do I build muscle and get stronger?",
          "I keep starting workout routines but never stick with them.",
          "What's the most effective way to lose fat and build muscle?"
        ]
      },
      {
        category: 'Health & Energy',
        prompts: [
          "I'm always tired and have no energy.",
          "How can I improve my sleep and recovery?",
          "I want to eat healthier but struggle with consistency.",
          "How do I deal with body image issues as a man?"
        ]
      }
    ]
  },
  {
    id: 'zephyr',
    name: 'Dr. Zephyr',
    title: 'Sexual Wellness Counselor',
    avatar: '🌊',
    description: 'Confidential guidance on sexual health, intimacy, and overcoming sexual challenges.',
    expertise: ['Sexual Health', 'Intimacy', 'Performance', 'Education', 'Confidence'],
    color: 'text-purple-400',
    promptCategories: [
      {
        category: 'Sexual Health',
        prompts: [
          "I'm dealing with performance anxiety in bed.",
          "How do I improve my sexual confidence?",
          "I have questions about sexual health and safety.",
          "How can I last longer and improve stamina?"
        ]
      },
      {
        category: 'Intimacy & Connection',
        prompts: [
          "How do I create better intimacy with my partner?",
          "I'm struggling with communication about sexual needs.",
          "How do I overcome shame around sexuality?",
          "What does healthy masculine sexuality look like?"
        ]
      }
    ]
  },
  {
    id: 'forge',
    name: 'Forge',
    title: 'Career & Success Coach',
    avatar: '🔨',
    description: 'Expert in career development, productivity, financial success, and professional growth.',
    expertise: ['Career Growth', 'Productivity', 'Finance', 'Success', 'Leadership'],
    color: 'text-yellow-400',
    promptCategories: [
      {
        category: 'Career & Professional',
        prompts: [
          "I feel stuck in my career and want to level up.",
          "How do I ask for a promotion or raise?",
          "I want to start my own business but don't know how.",
          "How can I be more productive and focused at work?"
        ]
      },
      {
        category: 'Money & Success',
        prompts: [
          "I'm struggling with money management and debt.",
          "How do I build wealth and financial security?",
          "I want to develop better financial habits.",
          "How can I negotiate better and advocate for myself?"
        ]
      }
    ]
  }
];

export const getRandomPromptSuggestions = (mentorId?: string): string[] => {
  const mentor = SPECIALIZED_MENTORS.find(m => m.id === mentorId) || SPECIALIZED_MENTORS[0];
  const allPrompts = mentor.promptCategories.flatMap(cat => cat.prompts);
  
  // Shuffle and return 4 random prompts
  const shuffled = allPrompts.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4);
};

export const generateFollowUpQuestions = (category: string): string[] => {
  const followUpsByCategory: { [key: string]: string[] } = {
    'emotional': [
      "What emotions come up most often for you?",
      "How do you typically handle stress or difficult feelings?",
      "What would emotional balance look like in your daily life?",
      "Who in your life do you feel comfortable being vulnerable with?"
    ],
    'relationships': [
      "What do you value most in your relationships?",
      "How do you typically handle conflict with people you care about?",
      "What patterns do you notice in your past relationships?",
      "What would your ideal relationship dynamic look like?"
    ],
    'career': [
      "What does career fulfillment mean to you personally?",
      "What skills do you want to develop over the next year?",
      "How do you balance ambition with personal well-being?",
      "What's holding you back from taking the next step?"
    ],
    'health': [
      "What's your biggest challenge when it comes to staying healthy?",
      "How do you want to feel in your body six months from now?",
      "What health habits do you want to build or break?",
      "How does your physical health affect other areas of your life?"
    ],
    'confidence': [
      "In what situations do you feel most/least confident?",
      "What would you do if you knew you couldn't fail?",
      "How do you talk to yourself when things don't go as planned?",
      "What accomplishment are you most proud of and why?"
    ],
    'general': [
      "What's one area of your life you'd like to focus on improving?",
      "What patterns or habits are you noticing about yourself lately?",
      "How can you show yourself more compassion in this situation?",
      "What would taking one small step forward look like for you?"
    ]
  };

  const categoryKey = Object.keys(followUpsByCategory).find(key => 
    category.toLowerCase().includes(key)
  ) || 'general';

  return followUpsByCategory[categoryKey].sort(() => Math.random() - 0.5).slice(0, 3);
};

// Legacy export for backwards compatibility
export const MENTOR_PROMPT_SUGGESTIONS: string[] = [
    "I'm feeling really stressed about work.",
    "How can I be more disciplined?",
    "I'm having issues in my relationship.",
    "I want to build my confidence."
];

export const MOCK_CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: '2-Minute Rule',
    description: 'Start a task you have been procrastinating on for just two minutes.',
    arena: 'work',
    difficulty: 'baseline',
    estimatedTime: '2 min',
  },
  {
    id: 2,
    title: 'Active Listening',
    description: 'In one conversation today, only listen. Paraphrase what they say.',
    arena: 'heart',
    difficulty: 'baseline',
    estimatedTime: '10 min',
  },
  {
    id: 3,
    title: 'Digital Detox',
    description: 'Spend the first hour of your day without looking at your phone.',
    arena: 'mind',
    difficulty: 'momentum',
    estimatedTime: '60 min',
  },
  {
    id: 4,
    title: '15-Minute Walk',
    description: 'Go for a 15-minute walk with no distractions (no phone, no music).',
    arena: 'body',
    difficulty: 'baseline',
    estimatedTime: '15 min',
  },
  {
    id: 5,
    title: 'Define Your Why',
    description: 'Write down one goal and ask yourself "Why?" five times.',
    arena: 'soul',
    difficulty: 'baseline',
    estimatedTime: '10 min',
  },
  {
    id: 6,
    title: 'Gratitude Practice',
    description: 'Write down three things you are genuinely grateful for.',
    arena: 'mind',
    difficulty: 'baseline',
    estimatedTime: '5 min',
  },
  {
    id: 7,
    title: 'Reach Out',
    description: 'Send a meaningful text to a friend you have not spoken to in a while.',
    arena: 'heart',
    difficulty: 'baseline',
    estimatedTime: '5 min',
  },
  {
    id: 8,
    title: 'Mindful Meal',
    description: 'Eat one meal today with zero distractions. Focus only on the food.',
    arena: 'body',
    difficulty: 'momentum',
    estimatedTime: '20 min',
  },
  {
    id: 9,
    title: 'Confidence Builder',
    description: 'Make genuine small talk with a stranger (cashier, barista, or neighbor).',
    arena: 'heart',
    difficulty: 'momentum',
    estimatedTime: '5 min',
  },
  {
    id: 10,
    title: 'Vulnerability Practice',
    description: 'Share something personal (but appropriate) with a friend or date.',
    arena: 'heart',
    difficulty: 'advanced',
    estimatedTime: '15 min',
  },
  {
    id: 11,
    title: 'Compliment Challenge',
    description: 'Give someone a genuine, specific compliment about their choices or actions.',
    arena: 'heart',
    difficulty: 'baseline',
    estimatedTime: '3 min',
  },
  {
    id: 12,
    title: 'Deep Question',
    description: 'Ask someone "What is something you are excited about right now?" and really listen.',
    arena: 'heart',
    difficulty: 'momentum',
    estimatedTime: '10 min',
  },
  {
    id: 13,
    title: 'Appreciation Text',
    description: 'Send a message to your partner or friend telling them something specific you appreciate about them.',
    arena: 'heart',
    difficulty: 'baseline',
    estimatedTime: '5 min',
  },
  {
    id: 14,
    title: 'Box Breathing Reset',
    description: 'Do four rounds of 4-7-8 breathing to bring your nervous system back to neutral.',
    arena: 'mind',
    difficulty: 'baseline',
    estimatedTime: '5 min',
  },
  {
    id: 15,
    title: 'Emotional Tag Journal',
    description: 'Write three sentences naming what you feel, why it might be there, and one action you can take.',
    arena: 'mind',
    difficulty: 'momentum',
    estimatedTime: '10 min',
  },
];

export const MOCK_DATE_IDEAS: DateIdea[] = [
    { title: "Themed Cooking Night", description: "Pick a country (like Italy or Mexico), find a recipe together, and cook a meal from scratch. Bonus points for matching music." },
    { title: "Local Brewery/Winery Tour", description: "Visit a local spot for a tasting flight. It's a relaxed way to try something new and have a conversation." },
    { title: "Stargazing", description: "Drive out of the city, lay down a blanket, and use a stargazing app to identify constellations. Bring hot chocolate." },
    { title: "Bookstore Challenge", description: "Go to a bookstore, split up, and each pick a book for the other person that you think they'd love." },
    { title: "Visit a Farmer's Market", description: "Wander through a local market, sample some food, and maybe pick out ingredients to cook together later." },
    { title: "Go for a Hike", description: "Choose a scenic trail. It's a great way to talk without the pressure of constant eye contact." }
];

export const WARDROBE_ESSENTIALS: ChecklistItem[] = [
    { id: 'we1', name: 'Well-Fitting Dark Wash Jeans', description: 'Versatile for casual to smart-casual. Avoid rips and excessive fading.' },
    { id: 'we2', name: 'Plain White T-Shirts', description: 'A clean, simple base for almost any outfit. Focus on quality cotton.' },
    { id: 'we3', name: 'A Quality Pair of Boots', description: 'A leather or suede boot (like a Chelsea or Chukka) elevates any outfit.' },
    { id: 'we4', name: 'An Oxford Cloth Button-Down Shirt', description: 'More relaxed than a dress shirt, perfect for layering or on its own.' },
    { id: 'we5', name: 'A Versatile Jacket', description: 'A bomber jacket, Harrington, or denim jacket that fits your style.' },
    { id: 'we6', name: 'Clean, Minimalist Sneakers', description: 'A simple white or black leather sneaker goes with everything.' }
];

export const HYGIENE_HABITS: ChecklistItem[] = [
  { id: 'hh1', name: 'Nail Care', description: 'Keep your fingernails trimmed and clean. It\'s a small detail people notice.' },
  { id: 'hh2', name: 'Tongue Scraping', description: 'Brushing isn\'t enough. Use a tongue scraper to combat bad breath.' },
  { id: 'hh3', name: 'Exfoliate', description: 'Use a face scrub 1-2 times a week to remove dead skin cells for a brighter complexion.' },
  { id: 'hh4', name: 'Moisturize Body', description: 'Use lotion on your body, especially after showering, to prevent dry skin.' },
  { id: 'hh5', name: 'Regular Haircuts', description: 'Get a trim every 4-6 weeks to keep your hair looking sharp and intentional.' },
  { id: 'hh6', name: 'Subtle Scent', description: 'Apply cologne sparingly. One or two sprays is enough. It should be discovered, not announced.' }
];


export const WORKOUT_LIBRARY = {
  strength: {
    label: 'Strength & Muscle',
    description: 'Compound lifts and progressive overload. Perfect for building muscle and a resilient frame.',
    plans: [
      {
        level: 'beginner',
        summary: '3x per week full-body sessions to build movement patterns and consistency.',
        schedule: 'Day A / Rest / Day B / Rest / Day A / Rest / Rest',
        equipment: 'Adjustable dumbbells or kettlebells, flat bench (or sturdy surface).',
        sessions: [
          {
            title: 'Day A: Push Focus',
            focus: 'Upper body push + posterior chain',
            exercises: [
              { name: 'Goblet Squat', sets: '3', reps: '10-12', rest: '75s' },
              { name: 'Incline Push-Up', sets: '3', reps: 'RIR 2', rest: '60s', note: 'Reps in reserve: stop 2 reps before failure.' },
              { name: 'Single-Arm Row', sets: '3', reps: '10 each side', rest: '75s' },
              { name: 'Glute Bridge', sets: '3', reps: '15', rest: '45s' },
              { name: 'Dead Bug', sets: '3', reps: '10 each side', rest: '45s' }
            ],
            finisher: 'Optional: 5 minute farmer carry intervals.'
          },
          {
            title: 'Day B: Pull & Legs',
            focus: 'Posterior chain and core stability',
            exercises: [
              { name: 'Romanian Deadlift', sets: '3', reps: '8-10', rest: '90s' },
              { name: 'Half-Kneeling Shoulder Press', sets: '3', reps: '10 each side', rest: '60s' },
              { name: 'Reverse Lunge', sets: '3', reps: '10 each leg', rest: '60s' },
              { name: 'One-Arm Supported Row', sets: '3', reps: '12 each side', rest: '60s' },
              { name: 'Side Plank', sets: '3', reps: '30-40s per side', rest: '45s' }
            ],
            finisher: 'Optional: slow mountain climbers 3×45 seconds.'
          }
        ],
        progression: 'Add 1–2 reps each week or increase load once you can complete top reps with control.'
      },
      {
        level: 'intermediate',
        summary: 'Upper/Lower split with progressive overload and weekly conditioning.',
        schedule: 'Upper / Lower / Rest / Upper / Lower / Active Recovery / Rest',
        equipment: 'Barbell access or heavier dumbbells, resistance bands.',
        sessions: [
          {
            title: 'Upper A: Heavy Press',
            focus: 'Strength emphasis in horizontal pressing and vertical pulling',
            exercises: [
              { name: 'Barbell Bench Press', sets: '4', reps: '5-6', rest: '120s' },
              { name: 'Weighted Pull-Up or Lat Pulldown', sets: '4', reps: '6-8', rest: '90s' },
              { name: 'Incline Dumbbell Press', sets: '3', reps: '8-10', rest: '75s' },
              { name: 'Chest-Supported Row', sets: '3', reps: '10-12', rest: '75s' },
              { name: 'Face Pull', sets: '3', reps: '15', rest: '60s', note: 'Focus on upper-back squeeze.' }
            ],
            finisher: '3 rounds: 12 dips + 15 band pull-aparts.'
          },
          {
            title: 'Lower A: Strength & Power',
            focus: 'Compound lifts with posterior-chain accessory work',
            exercises: [
              { name: 'Back Squat', sets: '4', reps: '5', rest: '150s' },
              { name: 'Romanian Deadlift', sets: '3', reps: '8', rest: '120s' },
              { name: 'Walking Lunge', sets: '3', reps: '12 each leg', rest: '75s' },
              { name: 'Nordic Curl or Hamstring Slider', sets: '3', reps: '8-10', rest: '90s' },
              { name: 'Hanging Leg Raise', sets: '3', reps: '12-15', rest: '60s' }
            ],
            finisher: 'Bike sprints: 6×20s with 70s easy pedal.'
          },
          {
            title: 'Upper B: Volume & Arms',
            focus: 'Hypertrophy with emphasis on shoulders and arms',
            exercises: [
              { name: 'Standing Overhead Press', sets: '4', reps: '6', rest: '120s' },
              { name: 'Single-Arm Dumbbell Row', sets: '4', reps: '10 each side', rest: '90s' },
              { name: 'Cable Flyes', sets: '3', reps: '12-15', rest: '60s' },
              { name: 'Incline Curl superset Triceps Rope Pushdown', sets: '3', reps: '12-15', rest: '45s', note: 'Minimal rest between exercises.' },
              { name: 'Farmer Carry', sets: '3', reps: '40 meters', rest: '60s' }
            ],
            finisher: 'Optional: 10 min easy row for recovery.'
          },
          {
            title: 'Lower B: Athletic Lower Body',
            focus: 'Unilateral work and tendon resilience',
            exercises: [
              { name: 'Trap Bar Deadlift', sets: '4', reps: '5', rest: '120s' },
              { name: 'Front Squat', sets: '3', reps: '6-8', rest: '120s' },
              { name: 'Bulgarian Split Squat', sets: '3', reps: '10 each leg', rest: '90s' },
              { name: 'Seated Calf Raise', sets: '4', reps: '12-15', rest: '45s' },
              { name: 'Pallof Press', sets: '3', reps: '12 each side', rest: '45s' }
            ],
            finisher: 'Optional: sled pushes 4×25m.'
          }
        ],
        progression: 'Rotate to heavier loads every 3 weeks, deload in week 4 with 20% less volume.'
      }
    ],
    quickWins: [
      'Fuel your sessions: 25–30g protein within 90 minutes post-workout.',
      'Track your lifts. Progression beats novelty—only swap movements when progress stalls.',
      'Sleep 7-9 hours. Muscle is built outside the gym.'
    ]
  },
  conditioning: {
    label: 'Conditioning & Body Composition',
    description: 'Interval work and metabolic finishers to raise VO₂ max and drop body fat.',
    plans: [
      {
        level: 'beginner',
        summary: 'Three mixed-modality sessions focusing on fundamentals and easy progression.',
        schedule: 'Conditioning / Rest / Mobility / Conditioning / Rest / Active Recovery / Rest',
        equipment: 'Jump rope, light kettlebell, open space or cardio machine.',
        sessions: [
          {
            title: 'Session A: Tempo Intervals',
            focus: 'Cardio engine + core',
            exercises: [
              { name: 'Row or Bike', sets: '6', reps: '60s on / 60s off', rest: '—', note: 'Keep heart rate <85% max.' },
              { name: 'Kettlebell Swing', sets: '3', reps: '15', rest: '45s' },
              { name: 'Plank with Shoulder Tap', sets: '3', reps: '20 taps', rest: '45s' }
            ],
            finisher: 'Walk 5 minutes to return heart rate to baseline.'
          },
          {
            title: 'Session B: EMOM Builder',
            focus: 'Work capacity & trunk endurance',
            exercises: [
              { name: 'Minute 1: Jump Rope', sets: '1', reps: '60s', rest: '—' },
              { name: 'Minute 2: Dumbbell Thruster', sets: '1', reps: '10', rest: '—' },
              { name: 'Minute 3: Alternating Reverse Lunges', sets: '1', reps: '16', rest: '—' },
              { name: 'Minute 4: Rest', sets: '1', reps: '-', rest: '—', note: 'Repeat for 5 rounds.' }
            ],
            finisher: 'Seated breathing: 3 minutes nasal breathing to downshift.'
          }
        ],
        progression: 'Add one interval per week (up to 8) and reduce rest to 45 seconds once comfortable.'
      },
      {
        level: 'intermediate',
        summary: 'Four sessions blending zone 2 work, sprints, and functional conditioning.',
        schedule: 'Zone 2 / Strength Circuit / Rest / Sprint Work / Conditioning / Rest / Mobility',
        equipment: 'Bike, rower or treadmill, kettlebells, slam ball.',
        sessions: [
          {
            title: 'Zone 2 Foundation',
            focus: 'Build aerobic base (45–60 minutes)',
            exercises: [
              { name: 'Cardio of choice', sets: '1', reps: 'Maintain HR 65-75% max', rest: '—', note: 'Hold easy conversation pace.' }
            ],
            finisher: '5 minutes of mobility for hips and ankles.'
          },
          {
            title: 'Sprint Session',
            focus: 'Anaerobic power',
            exercises: [
              { name: 'Sprint (track/bike/row)', sets: '8', reps: '15s all out', rest: '75s' },
              { name: 'Walk Back Recovery', sets: '8', reps: '-', rest: '—' }
            ],
            finisher: 'Couch stretch 2×60s each leg.'
          },
          {
            title: 'Functional Conditioning',
            focus: 'Full-body circuits',
            exercises: [
              { name: 'Kettlebell Clean + Press', sets: '4', reps: '10 each side', rest: '60s' },
              { name: 'Box Step-Up', sets: '4', reps: '12 each leg', rest: '45s' },
              { name: 'Slam Ball', sets: '4', reps: '12', rest: '45s' },
              { name: 'Ab Wheel Rollout', sets: '4', reps: '10', rest: '45s' }
            ],
            finisher: 'Light jog or jump rope 5 minutes for cool-down.'
          }
        ],
        progression: 'Alternate week focus: increase sprint count to 10 in weeks 2 and 4; week 5 deload.'
      }
    ],
    quickWins: [
      'Log recovery metrics—resting HR and sleep quality flag overtraining faster than soreness.',
      'Nail nutrition: 10k daily steps plus 0.8–1g protein per pound of goal body weight accelerates recomposition.',
      'Swap one session for outdoor movement weekly to stay mentally fresh.'
    ]
  },
  mobility: {
    label: 'Mobility & Recovery',
    description: 'Loosen restrictions, improve posture, and accelerate recovery with focused mobility flows.',
    plans: [
      {
        level: 'beginner',
        summary: 'Daily 15-minute micro-sessions to open tight areas from desk work.',
        schedule: 'Mobility / Rest / Mobility / Rest / Mobility / Rest / Rest',
        equipment: 'Yoga mat, foam roller, lacrosse ball (optional).',
        sessions: [
          {
            title: 'Desk Athlete Reset',
            focus: 'Thoracic spine and hips',
            exercises: [
              { name: 'Cat-Cow', sets: '2', reps: '60s flow', rest: '15s' },
              { name: 'World’s Greatest Stretch', sets: '2', reps: '5 each side', rest: '15s' },
              { name: 'Thoracic Windmill', sets: '2', reps: '8 each side', rest: '15s' },
              { name: '90/90 Hip Switch', sets: '2', reps: '10 each side', rest: '15s' },
              { name: 'Box Breathing', sets: '1', reps: '4 minutes', rest: '—', note: '4s inhale, 4s hold, 4s exhale, 4s hold.' }
            ]
          },
          {
            title: 'Soft Tissue + Stretch',
            focus: 'Lower body recovery',
            exercises: [
              { name: 'Foam Roll Quads & IT Band', sets: '1', reps: '90s each area', rest: '—' },
              { name: 'Hamstring Strap Stretch', sets: '2', reps: '45s each leg', rest: '15s' },
              { name: 'Ankle Dorsiflexion Rock', sets: '2', reps: '12 each side', rest: '15s' },
              { name: 'Glute Figure-4 Stretch', sets: '2', reps: '60s each side', rest: '15s' }
            ]
          }
        ],
        progression: 'Add a fourth day with gentle yoga flow once habits stick for 3 consecutive weeks.'
      },
      {
        level: 'intermediate',
        summary: '25-minute flows paired with breath work and nervous system downshifts.',
        schedule: 'Flow / Strength / Flow / Rest / Flow / Active Recovery / Rest',
        equipment: 'Yoga blocks, foam roller, resistance band.',
        sessions: [
          {
            title: 'Posterior Chain Opener',
            focus: 'Hamstrings, glutes, and lower back',
            exercises: [
              { name: 'Jefferson Curl', sets: '3', reps: '8', rest: '45s', note: 'Use light load, slow tempo.' },
              { name: 'Prone Swimmer', sets: '3', reps: '12', rest: '30s' },
              { name: 'Cossack Squat', sets: '3', reps: '10 each side', rest: '45s' },
              { name: 'Seated Forward Fold', sets: '2', reps: '60s hold', rest: '30s' }
            ]
          },
          {
            title: 'Shoulder & Neck Release',
            focus: 'Upper body mobility and posture',
            exercises: [
              { name: 'Band Pull-Apart Series', sets: '3', reps: '12 each variation', rest: '30s' },
              { name: 'Wall Slides', sets: '3', reps: '12', rest: '30s' },
              { name: 'Thoracic Extension over Foam Roller', sets: '2', reps: '60s', rest: '—' },
              { name: 'Neck CARs (Controlled Articular Rotations)', sets: '2', reps: '5 each direction', rest: '15s' }
            ]
          }
        ],
        progression: 'Pair with sauna or contrast showers 1–2x per week to amplify recovery.'
      }
    ],
    quickWins: [
      'Habit stack mobility with existing routines (post-shower or after meetings).',
      'Film yourself monthly to track posture changes—objective feedback keeps you consistent.',
      'If a drill causes pain, scale back range of motion and consult a professional.'
    ]
  }
} as const;
