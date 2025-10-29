import React, { useState, useEffect, useRef } from 'react';
import type { Article } from '../types';
import { ChevronLeftIcon, Star, ClockIcon, TrendingUp, Share, Target } from '../components/Icons';
import { ActionItem, ReflectionPrompt, QuickQuiz, TakeawayCard, ProgressChecklist } from '../components/InteractiveElements';
import { AchievementToast, Achievement } from '../components/AchievementSystem';
import { achievementManager } from '../utils/achievementManager';

interface GuideDetailScreenProps {
  article: Article;
  onBack: () => void;
}

interface ReadingSession {
  startTime: number;
  endTime?: number;
  scrollPosition: number;
  completed: boolean;
}

const GuideDetailScreen: React.FC<GuideDetailScreenProps> = ({ article, onBack }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [estimatedReadTime, setEstimatedReadTime] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [readingSpeed, setReadingSpeed] = useState(200); // words per minute
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [totalReadingTime, setTotalReadingTime] = useState(0);
  const [readingStreak, setReadingStreak] = useState(0);
  const [isActivelyReading, setIsActivelyReading] = useState(false);
  const [completedActionItems, setCompletedActionItems] = useState<{[key: string]: boolean}>({});
  const [reflectionResponses, setReflectionResponses] = useState<{[key: string]: string}>({});
  const [quizResults, setQuizResults] = useState<{[key: string]: boolean}>({});
  const [savedTakeaways, setSavedTakeaways] = useState<any[]>([]);
  const [checklistProgress, setChecklistProgress] = useState<{[key: string]: string[]}>({});
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastScrollTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Calculate estimated read time
    const wordsPerMinute = readingSpeed;
    const wordCount = article.content.split(' ').length;
    const estimatedTime = Math.ceil(wordCount / wordsPerMinute);
    setEstimatedReadTime(estimatedTime);

    // Load saved data
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedArticles') || '[]');
    setIsBookmarked(bookmarks.includes(article.id));

    const progress = localStorage.getItem(`readingProgress_${article.id}`);
    const savedProgress = progress ? parseInt(progress) : 0;
    setReadingProgress(savedProgress);

    // Load reading statistics
    const savedReadingTime = localStorage.getItem(`totalReadingTime_${article.id}`);
    setTotalReadingTime(savedReadingTime ? parseInt(savedReadingTime) : 0);

    const streak = localStorage.getItem('currentReadingStreak');
    setReadingStreak(streak ? parseInt(streak) : 0);

    // Load user's reading speed
    const savedSpeed = localStorage.getItem('userReadingSpeed');
    if (savedSpeed) {
      setReadingSpeed(parseInt(savedSpeed));
    }

    // Mark reading session start
    setSessionStartTime(Date.now());
    
    // Calculate time remaining based on progress
    const remainingWords = Math.ceil((wordCount * (100 - savedProgress)) / 100);
    setTimeRemaining(Math.ceil(remainingWords / readingSpeed));

    // Set up achievement listener
    const handleAchievementUnlocked = (achievement: Achievement) => {
      setNewAchievement(achievement);
    };

    achievementManager.addListener(handleAchievementUnlocked);

    return () => {
      achievementManager.removeListener(handleAchievementUnlocked);
    };
  }, [article.id, article.content, readingSpeed]);

  useEffect(() => {
    let activityTimer: number;
    
    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = Math.round((scrolled / scrollable) * 100);
      
      setScrollProgress(Math.min(progress, 100));
      
      // Update reading progress and track activity
      if (progress > readingProgress) {
        setReadingProgress(progress);
        localStorage.setItem(`readingProgress_${article.id}`, progress.toString());
        
        // Update time remaining
        const wordCount = article.content.split(' ').length;
        const remainingWords = Math.ceil((wordCount * (100 - progress)) / 100);
        setTimeRemaining(Math.ceil(remainingWords / readingSpeed));
      }
      
      // Track active reading
      setIsActivelyReading(true);
      lastScrollTimeRef.current = Date.now();
      
      // Clear previous timer and set new one
      clearTimeout(activityTimer);
      activityTimer = setTimeout(() => {
        setIsActivelyReading(false);
      }, 3000); // 3 seconds of inactivity
      
      // Auto-save reading position every 5%
      if (progress % 5 === 0 && progress > 0) {
        const readingSession: ReadingSession = {
          startTime: sessionStartTime,
          scrollPosition: progress,
          completed: progress >= 100
        };
        localStorage.setItem(`readingSession_${article.id}`, JSON.stringify(readingSession));
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched tabs - save reading time
        const sessionTime = Date.now() - sessionStartTime;
        const currentTotal = totalReadingTime + Math.floor(sessionTime / 1000);
        setTotalReadingTime(currentTotal);
        localStorage.setItem(`totalReadingTime_${article.id}`, currentTotal.toString());
      } else {
        // User returned - restart timer
        setSessionStartTime(Date.now());
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(activityTimer);
      
      // Save session time on unmount
      const sessionTime = Date.now() - sessionStartTime;
      const currentTotal = totalReadingTime + Math.floor(sessionTime / 1000);
      localStorage.setItem(`totalReadingTime_${article.id}`, currentTotal.toString());
    };
  }, [article.id, readingProgress, sessionStartTime, totalReadingTime, readingSpeed, article.content]);

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedArticles') || '[]');
    let updatedBookmarks;
    
    if (isBookmarked) {
      updatedBookmarks = bookmarks.filter((id: number) => id !== article.id);
    } else {
      updatedBookmarks = [...bookmarks, article.id];
    }
    
    localStorage.setItem('bookmarkedArticles', JSON.stringify(updatedBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  const markAsComplete = () => {
    setReadingProgress(100);
    localStorage.setItem(`readingProgress_${article.id}`, '100');
    
    // Calculate reading time and trigger achievements
    const sessionTime = Math.floor((Date.now() - sessionStartTime) / 1000);
    const totalTime = totalReadingTime + sessionTime;
    
    // Trigger achievement
    achievementManager.onArticleCompleted(article.id, article.arena, totalTime);
    
    // Update reading streak
    const today = new Date().toDateString();
    const lastReadDate = localStorage.getItem('lastReadDate');
    const currentStreak = parseInt(localStorage.getItem('currentReadingStreak') || '0');
    
    if (lastReadDate !== today) {
      const newStreak = lastReadDate === new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString() 
        ? currentStreak + 1 
        : 1;
      
      localStorage.setItem('currentReadingStreak', newStreak.toString());
      localStorage.setItem('lastReadDate', today);
      setReadingStreak(newStreak);
      
      achievementManager.onDailyReadingStreak(newStreak);
    }
  };

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  // Interactive element handlers
  const handleActionItemToggle = (id: string, completed: boolean) => {
    setCompletedActionItems(prev => ({ ...prev, [id]: completed }));
    localStorage.setItem(`actionItems_${article.id}`, JSON.stringify({ ...completedActionItems, [id]: completed }));
  };

  const handleReflectionSave = (id: string, response: string) => {
    setReflectionResponses(prev => ({ ...prev, [id]: response }));
    localStorage.setItem(`reflections_${article.id}`, JSON.stringify({ ...reflectionResponses, [id]: response }));
  };

  const handleQuizComplete = (id: string, correct: boolean) => {
    setQuizResults(prev => ({ ...prev, [id]: correct }));
    localStorage.setItem(`quizResults_${article.id}`, JSON.stringify({ ...quizResults, [id]: correct }));
  };

  const handleTakeawaySave = (takeaway: any) => {
    const newTakeaway = { ...takeaway, articleId: article.id, savedAt: Date.now() };
    setSavedTakeaways(prev => [...prev, newTakeaway]);
    
    // Save to global takeaways
    const globalTakeaways = JSON.parse(localStorage.getItem('savedTakeaways') || '[]');
    localStorage.setItem('savedTakeaways', JSON.stringify([...globalTakeaways, newTakeaway]));
  };

  const handleChecklistToggle = (checklistId: string, item: string, completed: boolean) => {
    setChecklistProgress(prev => {
      const currentItems = prev[checklistId] || [];
      const updatedItems = completed 
        ? [...currentItems, item]
        : currentItems.filter(i => i !== item);
      
      const newProgress = { ...prev, [checklistId]: updatedItems };
      localStorage.setItem(`checklists_${article.id}`, JSON.stringify(newProgress));
      return newProgress;
    });
  };

  // Helper function to get category-appropriate fallback images
  const getCategoryFallbackImage = (category: string) => {
    const fallbackImages = {
      'Communication': 'https://images.unsplash.com/photo-1520637836862-4d197d17c55a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'Productivity': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'Mindset': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'Fitness': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'Mental Health': 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'Dating Confidence': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'Social Skills': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'Dating Skills': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'Relationship Building': 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'Relationship Maintenance': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'Life Direction': 'https://images.unsplash.com/photo-1494059980473-813e73ee784b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'Confidence & Growth': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'Emotional Health': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'Mental Wellness': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'Dating & Attraction': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'Relationships': 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'Fitness & Strength': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'Health & Energy': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'Sexual Health': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'Intimacy & Connection': 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    };
    
    return fallbackImages[category as keyof typeof fallbackImages] || 
           'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
  };

  // Enhanced markdown-to-HTML converter with interactive elements
  const formatContent = (content: string) => {
    const lines = content.trim().split('\n');
    const elements: React.ReactElement[] = [];
    let currentIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Interactive element parsing
      if (line.startsWith('[ACTION]')) {
        const actionText = line.substring(8).trim();
        const actionId = `action_${currentIndex++}`;
        elements.push(
          <ActionItem
            key={actionId}
            id={actionId}
            text={actionText}
            completed={completedActionItems[actionId] || false}
            onToggle={handleActionItemToggle}
          />
        );
        continue;
      }

      if (line.startsWith('[REFLECTION]')) {
        const question = line.substring(12).trim();
        const reflectionId = `reflection_${currentIndex++}`;
        elements.push(
          <ReflectionPrompt
            key={reflectionId}
            question={question}
            onSave={(response) => handleReflectionSave(reflectionId, response)}
          />
        );
        continue;
      }

      if (line.startsWith('[QUIZ]')) {
        // Parse quiz format: [QUIZ] Question? | Option1 | Option2 | Option3 | CorrectIndex | Explanation
        const parts = line.substring(6).split('|').map(p => p.trim());
        if (parts.length >= 4) {
          const question = parts[0];
          const options = parts.slice(1, -2);
          const correctAnswer = parseInt(parts[parts.length - 2]);
          const explanation = parts[parts.length - 1];
          const quizId = `quiz_${currentIndex++}`;
          
          elements.push(
            <QuickQuiz
              key={quizId}
              question={question}
              options={options}
              correctAnswer={correctAnswer}
              explanation={explanation}
              onComplete={(correct) => handleQuizComplete(quizId, correct)}
            />
          );
        }
        continue;
      }

      if (line.startsWith('[TAKEAWAY]')) {
        // Parse takeaway format: [TAKEAWAY] Title | Content | Category
        const parts = line.substring(10).split('|').map(p => p.trim());
        if (parts.length >= 2) {
          const title = parts[0];
          const content = parts[1];
          const category = parts[2] || undefined;
          
          elements.push(
            <TakeawayCard
              key={`takeaway_${currentIndex++}`}
              title={title}
              content={content}
              category={category}
              onSave={handleTakeawaySave}
            />
          );
        }
        continue;
      }

      if (line.startsWith('[CHECKLIST]')) {
        // Parse checklist format: [CHECKLIST] Title | Item1 | Item2 | Item3
        const parts = line.substring(11).split('|').map(p => p.trim());
        if (parts.length >= 2) {
          const title = parts[0];
          const items = parts.slice(1);
          const checklistId = `checklist_${currentIndex++}`;
          
          elements.push(
            <ProgressChecklist
              key={checklistId}
              title={title}
              items={items}
              completedItems={checklistProgress[checklistId] || []}
              onItemToggle={(item, completed) => handleChecklistToggle(checklistId, item, completed)}
            />
          );
        }
        continue;
      }

      // Regular content parsing
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={`h3_${i}`} className="text-2xl font-bold text-text-primary mt-8 mb-4 scroll-mt-24" id={`section-${i}`}>
            {line.substring(4)}
          </h3>
        );
      } else if (line.startsWith('#### ')) {
        elements.push(
          <h4 key={`h4_${i}`} className="text-xl font-semibold text-text-primary mt-6 mb-3">
            {line.substring(5)}
          </h4>
        );
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <li key={`li_${i}`} className="mb-2 ml-4 list-disc text-text-secondary">
            {line.substring(2)}
          </li>
        );
      } else if (line.startsWith('**') && line.endsWith('**')) {
        elements.push(
          <p key={`bold_${i}`} className="mb-4 font-bold text-text-primary">
            {line.substring(2, line.length - 2)}
          </p>
        );
      } else if (line === '') {
        elements.push(<br key={`br_${i}`} />);
      } else if (line.length > 0) {
        elements.push(
          <p key={`p_${i}`} className="mb-4 leading-relaxed text-text-secondary">
            {line}
          </p>
        );
      }
    }

    return elements;
  };

  const formatTime = (minutes: number) => {
    if (minutes < 1) return '< 1 min';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return `${hours}h ${remainingMins}m`;
  };

  const formatSeconds = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSecs = seconds % 60;
    if (minutes < 60) return `${minutes}m ${remainingSecs}s`;
    const hours = Math.floor(minutes / 60);
    const remainingMins = minutes % 60;
    return `${hours}h ${remainingMins}m`;
  };

  return (
    <div className="animate-fade-in pb-16 md:pb-0 max-w-4xl mx-auto">
      {/* Enhanced Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-gray-700">
          <div 
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
        
        {/* Reading Stats Overlay */}
        {isActivelyReading && (
          <div className="bg-black/90 text-white px-4 py-2 text-sm">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                  Reading
                </span>
                <span>{scrollProgress}% complete</span>
                {timeRemaining > 0 && (
                  <span className="flex items-center">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    {formatTime(timeRemaining)} left
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4 text-xs">
                {totalReadingTime > 0 && (
                  <span>Time spent: {formatSeconds(totalReadingTime)}</span>
                )}
                {readingStreak > 0 && (
                  <span className="flex items-center text-yellow-400">
                    <Target className="h-3 w-3 mr-1" />
                    {readingStreak} day streak
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Header */}
      <header className="mb-6">
        <button 
          onClick={onBack} 
          className="flex items-center text-accent hover:text-sky-300 transition-colors mb-6 group"
        >
          <ChevronLeftIcon className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back to Library</span>
        </button>

        {/* Hero Image */}
        <div className="relative">
          <div className="relative h-64 md:h-80 overflow-hidden rounded-lg mb-6 bg-gray-200">
            <img 
              className="w-full h-full object-cover" 
              src={article.imageUrl} 
              alt={article.title}
              onError={(e) => {
                // Fallback to a category-appropriate image if the original fails to load
                e.currentTarget.src = getCategoryFallbackImage(article.category);
              }}
              onLoad={(e) => {
                // Remove background placeholder once image loads
                e.currentTarget.parentElement?.classList.remove('bg-gray-200');
              }}
              loading="eager"
            />
          </div>
          
          {/* Progress Badge */}
          {readingProgress > 0 && (
            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${
              readingProgress === 100 
                ? 'bg-green-400 text-black' 
                : 'bg-yellow-400 text-black'
            }`}>
              {readingProgress === 100 ? '✓ Completed' : `${readingProgress}% Read`}
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-4 right-4 px-3 py-1 bg-black/70 text-white text-sm font-medium rounded-full">
            {article.category}
          </div>
        </div>

        {/* Article Meta */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-accent font-semibold uppercase tracking-wide">
            {article.category}
          </span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-text-secondary text-sm">
              <ClockIcon className="h-4 w-4 mr-1" />
              {estimatedReadTime} min read
            </div>
            <button
              onClick={shareArticle}
              className="p-2 text-text-secondary hover:text-accent transition-colors"
              title="Share article"
            >
              <Share className="h-4 w-4" />
            </button>
            <button
              onClick={toggleBookmark}
              className={`p-2 transition-colors ${
                isBookmarked ? 'text-accent' : 'text-text-secondary hover:text-accent'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
            >
              <Star className="h-4 w-4" />
            </button>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary mb-4">
          {article.title}
        </h1>
        
        <p className="text-xl text-text-secondary leading-relaxed mb-6">
          {article.summary}
        </p>

        {/* Enhanced Action Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center space-x-4">
            {readingProgress < 100 ? (
              <button
                onClick={markAsComplete}
                className="flex items-center bg-accent text-primary px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
              >
                <span className="mr-2">✓</span>
                Mark as Complete
              </button>
            ) : (
              <div className="flex items-center text-green-400">
                <span className="mr-2 text-lg">✓</span>
                <span className="font-semibold">Completed!</span>
              </div>
            )}
            
            <button
              onClick={() => {
                const position = localStorage.getItem(`readingSession_${article.id}`);
                if (position) {
                  const session: ReadingSession = JSON.parse(position);
                  const scrollPercent = session.scrollPosition / 100;
                  const scrollTarget = (document.documentElement.scrollHeight - window.innerHeight) * scrollPercent;
                  window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
                }
              }}
              className="px-4 py-2 bg-secondary text-text-secondary hover:text-accent border border-gray-600 rounded-lg transition-colors"
            >
              Resume Reading
            </button>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-text-secondary">
            <div className="flex items-center">
              <div className="w-full bg-gray-700 rounded-full h-2 w-24 mr-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${readingProgress}%` }}
                />
              </div>
              <span>{readingProgress}%</span>
            </div>
            
            {timeRemaining > 0 && (
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                <span>{formatTime(timeRemaining)} left</span>
              </div>
            )}
            
            {totalReadingTime > 0 && (
              <div className="text-xs">
                Total time: {formatSeconds(totalReadingTime)}
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Article Content */}
      <article className="prose prose-invert prose-lg max-w-none">
        <div className="bg-secondary/30 rounded-lg p-6 mb-8 border-l-4 border-accent">
          <h3 className="text-lg font-semibold text-text-primary mb-2">💡 Key Takeaway</h3>
          <p className="text-text-secondary">
            {article.summary}
          </p>
        </div>
        
        {formatContent(article.content)}
        
        {/* Completion Section */}
        <div className="mt-12 p-6 bg-secondary rounded-lg border border-gray-600">
          <div className="text-center">
            {readingProgress === 100 ? (
              <div>
                <div className="text-green-400 text-5xl mx-auto mb-4">✓</div>
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  Great job completing this guide!
                </h3>
                <p className="text-text-secondary mb-4">
                  You've gained valuable knowledge to improve your {article.arena} skills.
                </p>
                <button
                  onClick={onBack}
                  className="bg-accent text-primary px-6 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
                >
                  Continue Learning
                </button>
              </div>
            ) : (
              <div>
                <TrendingUp className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  Keep reading to unlock the full guide
                </h3>
                <p className="text-text-secondary mb-4">
                  You're {readingProgress}% through this valuable content.
                </p>
                <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                  <div 
                    className="bg-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${readingProgress}%` }}
                  />
                </div>
                <button
                  onClick={markAsComplete}
                  className="text-accent hover:text-accent/80 font-medium"
                >
                  Mark as Complete
                </button>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Achievement Toast */}
      {newAchievement && (
        <AchievementToast
          achievement={newAchievement}
          onClose={() => setNewAchievement(null)}
        />
      )}
    </div>
  );
};

export default GuideDetailScreen;