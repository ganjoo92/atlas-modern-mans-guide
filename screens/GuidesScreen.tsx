import React, { useState, useMemo, useEffect } from 'react';
import { LIFE_ARENAS } from '../constants';
import GuideCard from '../components/GuideCard';
import { SmartRecommendations } from '../components/SmartRecommendations';
import { ReadingAnalyticsDashboard } from '../components/ReadingAnalyticsDashboard';
import { Search, Filter, Star, ClockIcon, TrendingUp, BookOpenIcon, Target, Award, ChevronDown, ChevronUp } from '../components/Icons';
import type { ArenaType, Article } from '../types';

interface GuidesScreenProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

type SortOption = 'recent' | 'popular' | 'title' | 'readTime';
type ViewMode = 'grid' | 'list';

const GuidesScreen: React.FC<GuidesScreenProps> = ({ articles, onSelectArticle }) => {
  const [filter, setFilter] = useState<ArenaType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  // Mock data - in real app would come from local storage or API
  const [bookmarkedArticles, setBookmarkedArticles] = useState<number[]>([1, 3, 5]);
  const [readingProgress, setReadingProgress] = useState<{[key: number]: number}>({});

  // Load reading progress from localStorage on mount
  useEffect(() => {
    loadReadingProgress();
  }, []);

  const loadReadingProgress = () => {
    const progress: {[key: number]: number} = {};
    articles.forEach(article => {
      const saved = localStorage.getItem(`readingProgress_${article.id}`);
      if (saved) {
        progress[article.id] = parseInt(saved);
      }
    });
    setReadingProgress(progress);
  };

  // Refresh progress data when component gains focus (user returns from article)
  useEffect(() => {
    const handleFocus = () => {
      loadReadingProgress();
    };
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadReadingProgress();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const filteredAndSortedArticles = useMemo(() => {
    let filtered = articles;

    // Apply arena filter
    if (filter !== 'all') {
      filtered = filtered.filter(article => article.arena === filter);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query)
      );
    }

    // Apply bookmarks filter
    if (showBookmarksOnly) {
      filtered = filtered.filter(article => bookmarkedArticles.includes(article.id));
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'recent':
          return b.id - a.id; // Assuming higher ID = more recent
        case 'readTime':
          // Estimate read time based on content length
          const aReadTime = Math.ceil(a.content.split(' ').length / 200);
          const bReadTime = Math.ceil(b.content.split(' ').length / 200);
          return aReadTime - bReadTime;
        case 'popular':
        default:
          // Mock popularity based on some criteria
          return (bookmarkedArticles.includes(b.id) ? 1 : 0) - (bookmarkedArticles.includes(a.id) ? 1 : 0);
      }
    });

    return sorted;
  }, [articles, filter, searchQuery, sortBy, showBookmarksOnly, bookmarkedArticles]);

  const toggleBookmark = (articleId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedArticles(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const getEstimatedReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  // Helper function to get category-appropriate fallback images
  const getCategoryFallbackImage = (category: string) => {
    const fallbackImages = {
      'Communication': 'https://images.unsplash.com/photo-1520637836862-4d197d17c55a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'Productivity': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'Mindset': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'Fitness': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'Mental Health': 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'Dating Confidence': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'Social Skills': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'Dating Skills': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'Relationship Building': 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'Relationship Maintenance': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'Life Direction': 'https://images.unsplash.com/photo-1494059980473-813e73ee784b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'Confidence & Growth': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'Emotional Health': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'Mental Wellness': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'Dating & Attraction': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'Relationships': 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'Fitness & Strength': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'Health & Energy': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'Sexual Health': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'Intimacy & Connection': 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    };
    
    return fallbackImages[category as keyof typeof fallbackImages] || 
           'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-400';
    if (progress > 0) return 'bg-yellow-400';
    return 'bg-gray-600';
  };

  const getArenaStats = () => {
    return LIFE_ARENAS.map(arena => {
      const arenaArticles = articles.filter(article => article.arena === arena.id);
      const completedCount = arenaArticles.filter(article => readingProgress[article.id] === 100).length;
      
      return {
        ...arena,
        totalArticles: arenaArticles.length,
        completedArticles: completedCount,
        completionRate: arenaArticles.length > 0 ? Math.round((completedCount / arenaArticles.length) * 100) : 0
      };
    });
  };

  return (
    <div className="animate-fade-in pb-16 md:pb-0">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-text-primary">Knowledge Library</h1>
            <p className="text-lg text-text-secondary mt-2">
              Expert-curated guides to accelerate your growth across all areas of life.
            </p>
          </div>
          
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-lg hover:bg-accent/20 transition-colors"
          >
            <TrendingUp className="h-5 w-5" />
            <span>Your Progress</span>
            {showAnalytics ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Analytics Dashboard */}
      {showAnalytics && (
        <div className="mb-8 animate-fade-in">
          <ReadingAnalyticsDashboard />
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {getArenaStats().map(arena => {
          const IconComponent = arena.icon;
          return (
            <div key={arena.id} className="bg-secondary rounded-lg p-4 text-center">
              <IconComponent className={`h-6 w-6 mx-auto mb-2 ${arena.color}`} />
              <div className="text-2xl font-bold text-text-primary">{arena.completedArticles}/{arena.totalArticles}</div>
              <div className="text-sm text-text-secondary">{arena.title}</div>
              <div className={`text-xs font-medium mt-1 ${arena.completionRate === 100 ? 'text-green-400' : 'text-yellow-400'}`}>
                {arena.completionRate}% Complete
              </div>
            </div>
          );
        })}
      </div>

      {/* Smart Recommendations */}
      {articles.length > 0 && (
        <div className="mb-8">
          <SmartRecommendations
            currentArticle={articles[0]} // Use the first article as reference
            allArticles={articles}
            readingProgress={readingProgress}
            onSelectArticle={onSelectArticle}
            maxRecommendations={4}
          />
        </div>
      )}

      {/* Search and Controls */}
      <div className="bg-secondary rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-secondary" />
            <input
              type="text"
              placeholder="Search guides, topics, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-primary border border-gray-600 rounded-lg text-text-primary focus:border-accent focus:outline-none"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-primary border border-gray-600 rounded-lg px-4 py-3 text-text-primary focus:border-accent focus:outline-none pr-10"
            >
              <option value="popular">Most Popular</option>
              <option value="recent">Most Recent</option>
              <option value="title">Alphabetical</option>
              <option value="readTime">Read Time</option>
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary pointer-events-none" />
          </div>

          {/* Bookmarks Toggle */}
          <button
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
              showBookmarksOnly 
                ? 'bg-accent text-primary' 
                : 'bg-primary border border-gray-600 text-text-secondary hover:text-text-primary'
            }`}
          >
            <Star className="h-4 w-4 mr-2" />
            Bookmarks
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center space-x-2 mb-8 overflow-x-auto pb-2">
        <button 
          onClick={() => setFilter('all')} 
          className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors whitespace-nowrap ${
            filter === 'all' ? 'bg-accent text-primary' : 'bg-secondary text-text-secondary hover:text-text-primary'
          }`}
        >
          All ({articles.length})
        </button>
        {LIFE_ARENAS.map(arena => {
          const count = articles.filter(article => article.arena === arena.id).length;
          return (
            <button 
              key={arena.id} 
              onClick={() => setFilter(arena.id)} 
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors whitespace-nowrap ${
                filter === arena.id ? 'bg-accent text-primary' : 'bg-secondary text-text-secondary hover:text-text-primary'
              }`}
            >
              {arena.title} ({count})
            </button>
          );
        })}
      </div>

      {/* Results Info */}
      {searchQuery && (
        <div className="mb-6 text-text-secondary">
          Found {filteredAndSortedArticles.length} guide(s) for "{searchQuery}"
        </div>
      )}

      {/* Guides Grid */}
      {filteredAndSortedArticles.length > 0 ? (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" 
          : "space-y-4"
        }>
          {filteredAndSortedArticles.map((article) => {
            const progress = readingProgress[article.id] || 0;
            const isBookmarked = bookmarkedArticles.includes(article.id);
            const readTime = getEstimatedReadTime(article.content);
            
            return (
              <div key={article.id} className="relative group">
                {/* Enhanced Guide Card */}
                <div 
                  onClick={() => onSelectArticle(article)}
                  className="bg-secondary rounded-lg overflow-hidden border border-gray-600 hover:border-accent/50 transition-all duration-200 cursor-pointer"
                >
                  {/* Image with overlay */}
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback to a category-appropriate image if the original fails to load
                        e.currentTarget.src = getCategoryFallbackImage(article.category);
                      }}
                      onLoad={(e) => {
                        // Remove background placeholder once image loads
                        e.currentTarget.parentElement?.classList.remove('bg-gray-200');
                      }}
                      loading="lazy"
                    />
                    
                    {/* Progress bar overlay */}
                    {progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1">
                        <div 
                          className={`h-full transition-all duration-300 ${getProgressColor(progress)}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}

                    {/* Bookmark button */}
                    <button
                      onClick={(e) => toggleBookmark(article.id, e)}
                      className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                        isBookmarked 
                          ? 'bg-accent text-primary' 
                          : 'bg-black/50 text-white hover:bg-black/70'
                      }`}
                    >
                      <Star className="h-4 w-4" />
                    </button>

                    {/* Progress badge */}
                    {progress > 0 && (
                      <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${
                        progress === 100 
                          ? 'bg-green-400 text-black' 
                          : 'bg-yellow-400 text-black'
                      }`}>
                        {progress === 100 ? '✓ Complete' : `${progress}% Read`}
                      </div>
                    )}

                    {/* Category overlay */}
                    <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/70 text-white text-xs font-medium rounded-full">
                      {article.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-accent font-semibold">{article.category}</span>
                      <div className="flex items-center text-text-secondary text-sm">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {readTime} min read
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-accent transition-colors">
                      {article.title}
                    </h3>
                    
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {article.summary}
                    </p>

                    {/* Action indicators */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-600">
                      <div className="flex items-center space-x-4 text-xs text-text-secondary">
                        {progress === 100 && (
                          <div className="flex items-center text-green-400">
                            <Award className="h-3 w-3 mr-1" />
                            Completed
                          </div>
                        )}
                        {isBookmarked && (
                          <div className="flex items-center text-accent">
                            <Star className="h-3 w-3 mr-1" />
                            Saved
                          </div>
                        )}
                      </div>
                      
                      <button className="text-accent hover:text-accent/80 text-sm font-medium">
                        {progress > 0 && progress < 100 ? 'Continue Reading' : 'Read Guide'} →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <BookOpenIcon className="h-16 w-16 text-text-secondary mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-text-primary mb-2">No guides found</h3>
          <p className="text-text-secondary">
            {searchQuery 
              ? `Try adjusting your search terms or browse by category.` 
              : showBookmarksOnly 
                ? `You haven't bookmarked any guides yet. Start reading to save your favorites!`
                : `No guides available in this category yet.`
            }
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-accent hover:text-accent/80 font-medium"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Quick Stats Footer */}
      {filteredAndSortedArticles.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-accent">
                {articles.filter(a => readingProgress[a.id] === 100).length}
              </div>
              <div className="text-text-secondary">Guides Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {bookmarkedArticles.length}
              </div>
              <div className="text-text-secondary">Guides Bookmarked</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {articles.reduce((total, article) => total + getEstimatedReadTime(article.content), 0)}
              </div>
              <div className="text-text-secondary">Total Minutes of Content</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuidesScreen;
