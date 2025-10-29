import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, MessageAuthor, EnhancedChatMessage, OnboardingProfile } from '../types';
import { getMentorChat, getEnhancedMentorResponse } from '../services/geminiService';
import ChatMessageComponent from '../components/ChatMessage';
import { PaperAirplaneIcon, SparklesIcon, UserIcon } from '../components/Icons';
import { SPECIALIZED_MENTORS, getRandomPromptSuggestions, LIFE_ARENAS } from '../constants';
import WeeklyReflection from '../components/WeeklyReflection';
import WinTracker from '../components/WinTracker';
import { MoodEntry } from '../components/MoodCheckIn';
import { WinEntry } from '../utils/weeklyPatternAnalysis';

interface MentorScreenProps {
  onboardingProfile: OnboardingProfile | null;
  mentorGreetingSeen: boolean;
  onMentorGreetingDelivered: () => void;
  setView?: (view: string) => void;
  moodEntries?: MoodEntry[];
}

const goalFocusCopy: Record<OnboardingProfile['primaryGoal'], string> = {
  dating: 'dial in your dating playbook',
  career: 'level up your career path',
  discipline: 'lock in discipline and habits',
  confidence: 'build unshakeable confidence',
};

const cadenceCopy: Record<OnboardingProfile['challengeCadence'], string> = {
  daily: 'daily reps',
  weekly: 'weekly sprints',
  custom: 'a custom cadence',
};

interface SavedThread {
  id: string;
  mentorId: string;
  mentorName: string;
  title: string;
  createdAt: string;
  messages: EnhancedChatMessage[];
}

const SAVED_THREADS_KEY = 'atlas_saved_threads';

const loadSavedThreads = (): SavedThread[] => {
  try {
    const raw = localStorage.getItem(SAVED_THREADS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedThread[];
  } catch (error) {
    console.error('Failed to load saved mentor threads', error);
    return [];
  }
};

const persistSavedThreads = (threads: SavedThread[]) => {
  try {
    localStorage.setItem(SAVED_THREADS_KEY, JSON.stringify(threads));
  } catch (error) {
    console.error('Failed to persist saved mentor threads', error);
  }
};

const MentorScreen: React.FC<MentorScreenProps> = ({
  onboardingProfile,
  mentorGreetingSeen,
  onMentorGreetingDelivered,
  setView,
  moodEntries = [],
}) => {
  const [selectedMentor, setSelectedMentor] = useState(SPECIALIZED_MENTORS[0]);
  const [chat, setChat] = useState<any>(null);
  const [messages, setMessages] = useState<EnhancedChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrompts, setCurrentPrompts] = useState<string[]>([]);
  const [showMentorSelector, setShowMentorSelector] = useState(false);
  const [savedThreads, setSavedThreads] = useState<SavedThread[]>(() => loadSavedThreads());
  const [showSavedThreads, setShowSavedThreads] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate new random prompts
  const refreshPrompts = () => {
    const newPrompts = getRandomPromptSuggestions(selectedMentor.id);
    setCurrentPrompts(newPrompts);
  };

  useEffect(() => {
    refreshPrompts();
  }, [selectedMentor]);

  useEffect(() => {
    persistSavedThreads(savedThreads);
  }, [savedThreads]);

  useEffect(() => {
    const newChat = getMentorChat(selectedMentor.id);
    if (newChat) {
      setChat(newChat);
      const baseWelcome = `Welcome. I'm ${selectedMentor.name}, your ${selectedMentor.title.toLowerCase()}. ${selectedMentor.description} How can I help you today?`;
      let welcomeText = baseWelcome;
      let shouldNotify = false;
      if (!mentorGreetingSeen && onboardingProfile) {
        const focusArenaMeta = LIFE_ARENAS.find(arena => arena.id === onboardingProfile.focusArena);
        const focusLabel = focusArenaMeta?.title ?? onboardingProfile.focusArena;
        const goalLabel = goalFocusCopy[onboardingProfile.primaryGoal];
        const cadenceLabel = cadenceCopy[onboardingProfile.challengeCadence];
        welcomeText = `Good to have you here, ${onboardingProfile.name}. I know you want to ${goalLabel} and you're targeting ${focusLabel.toLowerCase()}. I'll hold you to those ${cadenceLabel}. What's the next move you want to tackle right now?`;
        shouldNotify = true;
      }
      setMessages(prev => {
        if (prev.length > 0) {
          return prev;
        }
        return [
          {
            author: MessageAuthor.MENTOR,
            text: welcomeText,
            timestamp: new Date(),
            mentorId: selectedMentor.id,
          },
        ];
      });
      if (shouldNotify) {
        // defer to avoid state updates during render cycle
        Promise.resolve().then(onMentorGreetingDelivered);
      }
    }
  }, [selectedMentor, onboardingProfile, mentorGreetingSeen, onMentorGreetingDelivered]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleMentorChange = (mentor: typeof SPECIALIZED_MENTORS[0]) => {
    setSelectedMentor(mentor);
    setMessages([]);
    setShowMentorSelector(false);
    setUserInput('');
    // New prompts will be generated via useEffect
  };

  const handleSaveConversation = () => {
    if (!messages.length) return;
    const defaultTitle = `${selectedMentor.name} · ${new Date().toLocaleDateString()}`;
    const title = window.prompt('Name this conversation so you can revisit it later.', defaultTitle);
    if (!title) return;
    const thread: SavedThread = {
      id: `${Date.now()}`,
      mentorId: selectedMentor.id,
      mentorName: selectedMentor.name,
      title: title.trim(),
      createdAt: new Date().toISOString(),
      messages,
    };
    setSavedThreads(prev => [thread, ...prev].slice(0, 20));
    setShowSavedThreads(true);
  };

  const handleLoadThread = (thread: SavedThread) => {
    setSelectedMentor(SPECIALIZED_MENTORS.find(m => m.id === thread.mentorId) ?? SPECIALIZED_MENTORS[0]);
    setMessages(thread.messages);
    setShowSavedThreads(false);
  };

  const handleDeleteThread = (id: string) => {
    setSavedThreads(prev => prev.filter(thread => thread.id !== id));
  };

  const handleSendMessage = async (promptText?: string) => {
    const textToSend = (typeof promptText === 'string' ? promptText : userInput).trim();
    if (!textToSend || isLoading || !chat) return;

    const userMessage: EnhancedChatMessage = {
      author: MessageAuthor.USER,
      text: textToSend,
      timestamp: new Date(),
      mentorId: selectedMentor.id
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const result = await getEnhancedMentorResponse(textToSend, selectedMentor.id);
      
      const mentorMessage: EnhancedChatMessage = {
        author: MessageAuthor.MENTOR,
        text: result.response,
        timestamp: new Date(),
        mentorId: selectedMentor.id,
        followUpQuestions: result.followUpQuestions
      };

      setMessages(prev => [...prev, mentorMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        author: MessageAuthor.MENTOR,
        text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
        mentorId: selectedMentor.id
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full animate-fade-in pb-16 md:pb-0">
        {/* Enhanced Header with Mentor Selector */}
        <header className="mb-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="text-4xl mr-3">{selectedMentor.avatar}</div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-text-primary">
                            {selectedMentor.name}
                        </h1>
                        <p className="text-lg text-text-secondary">
                            {selectedMentor.title}
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleSaveConversation}
                    className="px-4 py-2 bg-secondary border border-gray-700 rounded-lg hover:bg-gray-700/50 hover:border-accent/50 transition-colors"
                  >
                    <SparklesIcon className="w-5 h-5 inline mr-2" />
                    Save Conversation
                  </button>
                  <button
                    onClick={() => setShowSavedThreads(prev => !prev)}
                    className="px-4 py-2 bg-secondary border border-gray-700 rounded-lg hover:bg-gray-700/50 hover:border-accent/50 transition-colors"
                  >
                    Saved Threads ({savedThreads.length})
                  </button>
                  <button
                    onClick={() => setShowMentorSelector(!showMentorSelector)}
                    className="px-4 py-2 bg-secondary border border-gray-700 rounded-lg hover:bg-gray-700/50 hover:border-accent/50 transition-colors"
                  >
                    <UserIcon className="w-5 h-5 inline mr-2" />
                    Switch Mentor
                  </button>
                </div>
            </div>
            
            {/* Mentor Description */}
            <div className="mt-3 p-4 bg-primary/30 rounded-lg border border-gray-700/30">
                <p className="text-text-secondary">{selectedMentor.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                    {selectedMentor.expertise.map((skill, index) => (
                        <span key={index} className={`px-2 py-1 text-xs rounded-full bg-secondary border border-gray-600 ${selectedMentor.color}`}>
                            {skill}
                        </span>
                    ))}
                </div>
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-wide text-text-secondary mb-2">Pinned prompts</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedMentor.promptCategories.slice(0, 2).flatMap(category =>
                      category.prompts.slice(0, 2).map(prompt => (
                        <button
                          key={`${category.category}-${prompt}`}
                          onClick={() => handleSendMessage(prompt)}
                          className="px-3 py-2 text-xs rounded-lg border border-gray-700/60 text-text-secondary hover:border-accent/40 hover:text-text-primary transition-colors"
                        >
                          {prompt}
                        </button>
                      ))
                    )}
                    <button
                      onClick={refreshPrompts}
                      className="px-3 py-2 text-xs rounded-lg border border-gray-700/60 text-text-secondary hover:border-accent/40 hover:text-text-primary transition-colors"
                    >
                      Refresh prompts
                    </button>
                  </div>
                </div>
            </div>
        </header>

        {/* Weekly Reflection */}
        <WeeklyReflection
          moodEntries={moodEntries}
          challengeCompletions={[]}
          mentorMessages={messages.filter(m => m.author === MessageAuthor.MENTOR)}
          className="mb-4"
        />

        {/* Win Tracker */}
        <WinTracker
          onWinLogged={(win: WinEntry) => {
            console.log('Win logged:', win);
          }}
          className="mb-4"
        />

        {/* Saved Threads Drawer */}
        {showSavedThreads && (
          <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-secondary rounded-lg border border-gray-700 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-text-primary">Saved Threads</h3>
              <button
                onClick={() => setShowSavedThreads(false)}
                className="text-xs sm:text-sm text-text-secondary hover:text-text-primary underline"
              >
                Close
              </button>
            </div>
            {savedThreads.length ? (
              <ul className="space-y-2 sm:space-y-3">
                {savedThreads.map(thread => (
                  <li key={thread.id} className="bg-primary/30 border border-gray-700/60 rounded-xl p-3 sm:p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-3">
                    <div>
                      <p className="text-sm font-semibold text-text-primary line-clamp-2">{thread.title}</p>
                      <p className="text-[11px] sm:text-xs text-text-secondary uppercase tracking-wide">
                        {thread.mentorName} · {new Date(thread.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2 justify-end md:justify-start">
                      <button
                        onClick={() => handleLoadThread(thread)}
                        className="px-3 py-2 rounded-lg bg-accent text-primary text-xs font-semibold hover:bg-accent/90"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDeleteThread(thread.id)}
                        className="px-3 py-2 rounded-lg border border-gray-700/60 text-xs text-text-secondary hover:text-text-primary hover:border-accent/40"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs sm:text-sm text-text-secondary">No saved conversations yet. Save one to build your personal playbook.</p>
            )}
          </div>
        )}

        {/* Mentor Selector Modal */}
        {showMentorSelector && (
            <div className="mb-4 p-4 bg-secondary rounded-lg border border-gray-700">
                <h3 className="text-lg font-bold text-text-primary mb-4">Choose Your Mentor</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {SPECIALIZED_MENTORS.map((mentor) => (
                        <button
                            key={mentor.id}
                            onClick={() => handleMentorChange(mentor)}
                            className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                                mentor.id === selectedMentor.id
                                    ? 'border-accent bg-accent/10'
                                    : 'border-gray-600 hover:border-accent/50 hover:bg-gray-700/30'
                            }`}
                        >
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-3">{mentor.avatar}</span>
                                <div>
                                    <div className={`font-bold ${mentor.color}`}>{mentor.name}</div>
                                    <div className="text-sm text-text-secondary">{mentor.title}</div>
                                </div>
                            </div>
                            <p className="text-xs text-text-secondary line-clamp-2">{mentor.description}</p>
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-primary/50 rounded-lg">
            <div className="space-y-4">
            {messages.map((msg, index) => (
                <div key={index}>
                    <ChatMessageComponent 
                        message={msg} 
                        isLoading={isLoading && index === messages.length - 1 && msg.author === MessageAuthor.MENTOR}
                    />
                                        {/* Follow-up Questions */}
                    {msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                        <div className="mt-3 ml-12">
                            <p className="text-sm text-text-secondary mb-2">💭 Continue exploring:</p>
                            <div className="flex flex-wrap gap-2">
                                {msg.followUpQuestions.map((question, qIndex) => (
                                    <button
                                        key={qIndex}
                                        onClick={() => handleSendMessage(question)}
                                        className="px-3 py-2 text-sm bg-accent/10 border border-accent/30 rounded-lg hover:bg-accent/20 hover:border-accent/50 transition-colors text-accent"
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
            {isLoading && messages[messages.length - 1]?.author === MessageAuthor.USER && (
                <ChatMessageComponent 
                    message={{ author: MessageAuthor.MENTOR, text: '', timestamp: new Date(), mentorId: selectedMentor.id}} 
                    isLoading={true}
                />
            )}
            <div ref={messagesEndRef} />
            </div>
        </div>
        
        {/* Dynamic Prompt Suggestions */}
        {messages.length <= 1 && (
            <div className="mt-4 px-2">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-text-secondary">Or, start with a suggestion:</p>
                    <button
                        onClick={refreshPrompts}
                        className="text-xs text-accent hover:text-accent/80 transition-colors"
                    >
                        🎲 New suggestions
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {currentPrompts.map((prompt, index) => (
                        <button
                            key={index}
                            onClick={() => handleSendMessage(prompt)}
                            className={`px-3 py-2 text-sm bg-secondary border border-gray-700 rounded-lg hover:bg-gray-700/50 hover:border-accent/50 transition-colors ${selectedMentor.color}`}
                        >
                            {prompt}
                        </button>
                    ))}
                </div>
            </div>
        )}

        <div className="mt-6 bg-secondary/60 border border-gray-700/60 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-text-primary">Weekly AMA · Brotherhood Room</p>
            <p className="text-sm text-text-secondary">
              Drop your question for this week’s live thread. Answers post every Thursday at 21:00.
            </p>
          </div>
          <button
            onClick={() => setView?.('community')}
            className="px-4 py-2 rounded-lg bg-accent text-primary font-semibold hover:bg-accent/90 transition-colors"
          >
            Go to AMA
          </button>
        </div>

        {/* Input Area */}
        <div className="mt-4">
            <div className="flex items-center bg-secondary rounded-lg p-2 border border-gray-700/50 focus-within:ring-2 focus-within:ring-accent">
            <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Ask ${selectedMentor.name} anything about ${selectedMentor.expertise[0].toLowerCase()}...`}
                className="w-full bg-transparent text-text-primary p-2 focus:outline-none"
                disabled={isLoading}
            />
            <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !userInput.trim()}
                className="bg-accent text-primary rounded-md p-2 ml-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <PaperAirplaneIcon className="w-6 h-6" />
            </button>
            </div>
        </div>
    </div>
  );
};

export default MentorScreen;
