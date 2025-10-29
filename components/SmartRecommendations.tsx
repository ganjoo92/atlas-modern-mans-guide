import React from 'react';
import type { Article, ArenaType } from '../types';
import { Target, TrendingUp, ClockIcon, Star, ChevronRight } from './Icons';

interface RecommendationEngine {
  getRecommendations(
    currentArticle: Article,
    allArticles: Article[],
    readingProgress: {[key: number]: number},
    userPreferences?: {
      preferredArenas?: ArenaType[];
      preferredReadTime?: 'quick' | 'medium' | 'long';
      difficulty?: 'beginner' | 'intermediate' | 'advanced';
    }
  ): RecommendedArticle[];
}

interface RecommendedArticle extends Article {
  reason: string;
  relevanceScore: number;
  type: 'quick_win' | 'deep_dive' | 'follow_up' | 'complementary';
  estimatedReadTime: number;
}

interface SmartRecommendationsProps {
  currentArticle: Article;
  allArticles: Article[];
  readingProgress: {[key: number]: number};
  onSelectArticle: (article: Article) => void;
  maxRecommendations?: number;
}

export class ArticleRecommendationEngine implements RecommendationEngine {
  getRecommendations(
    currentArticle: Article,
    allArticles: Article[],
    readingProgress: {[key: number]: number} = {},
    userPreferences = {}
  ): RecommendedArticle[] {
    const recommendations: RecommendedArticle[] = [];
    
    // Filter out current article and completed articles
    const candidateArticles = allArticles.filter(article => 
      article.id !== currentArticle.id && 
      (readingProgress[article.id] || 0) < 100
    );

    // 1. Same arena follow-ups
    const sameArenaArticles = candidateArticles
      .filter(article => article.arena === currentArticle.arena)
      .map(article => ({
        ...article,
        reason: `Continue your ${this.getArenaDisplayName(article.arena)} journey`,
        relevanceScore: 0.9,
        type: 'follow_up' as const,
        estimatedReadTime: this.estimateReadTime(article.content)
      }));

    recommendations.push(...sameArenaArticles.slice(0, 2));

    // 2. Complementary arenas (cross-pollination)
    const complementaryArenas = this.getComplementaryArenas(currentArticle.arena);
    const complementaryArticles = candidateArticles
      .filter(article => complementaryArenas.includes(article.arena))
      .map(article => ({
        ...article,
        reason: `Enhance your ${this.getArenaDisplayName(currentArticle.arena)} skills with ${this.getArenaDisplayName(article.arena)}`,
        relevanceScore: 0.7,
        type: 'complementary' as const,
        estimatedReadTime: this.estimateReadTime(article.content)
      }));

    recommendations.push(...complementaryArticles.slice(0, 2));

    // 3. Quick wins (short articles for motivation)
    const quickWins = candidateArticles
      .filter(article => this.estimateReadTime(article.content) <= 5)
      .map(article => ({
        ...article,
        reason: 'Quick read for immediate impact',
        relevanceScore: 0.6,
        type: 'quick_win' as const,
        estimatedReadTime: this.estimateReadTime(article.content)
      }));

    recommendations.push(...quickWins.slice(0, 1));

    // 4. Deep dives (longer, comprehensive articles)
    const deepDives = candidateArticles
      .filter(article => this.estimateReadTime(article.content) >= 10)
      .map(article => ({
        ...article,
        reason: 'Deep dive for comprehensive understanding',
        relevanceScore: 0.8,
        type: 'deep_dive' as const,
        estimatedReadTime: this.estimateReadTime(article.content)
      }));

    recommendations.push(...deepDives.slice(0, 1));

    // Sort by relevance and return top recommendations
    return recommendations
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 6);
  }

  private estimateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  private getArenaDisplayName(arena: ArenaType): string {
    const names = {
      mind: 'Mind',
      heart: 'Heart',
      body: 'Body',
      soul: 'Soul',
      work: 'Work'
    };
    return names[arena] || arena;
  }

  private getComplementaryArenas(currentArena: ArenaType): ArenaType[] {
    const complementary: {[key in ArenaType]: ArenaType[]} = {
      mind: ['heart', 'work'],
      heart: ['mind', 'soul'],
      body: ['mind', 'soul'],
      soul: ['heart', 'body'],
      work: ['mind', 'heart']
    };
    return complementary[currentArena] || [];
  }
}

const RecommendationCard: React.FC<{
  article: RecommendedArticle;
  onSelect: () => void;
}> = ({ article, onSelect }) => {
  const getTypeIcon = () => {
    switch (article.type) {
      case 'quick_win': return <Target className="h-4 w-4" />;
      case 'deep_dive': return <TrendingUp className="h-4 w-4" />;
      case 'follow_up': return <ChevronRight className="h-4 w-4" />;
      case 'complementary': return <Star className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getTypeColor = () => {
    switch (article.type) {
      case 'quick_win': return 'text-green-400 bg-green-400/10';
      case 'deep_dive': return 'text-purple-400 bg-purple-400/10';
      case 'follow_up': return 'text-blue-400 bg-blue-400/10';
      case 'complementary': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-accent bg-accent/10';
    }
  };

  const getTypeLabel = () => {
    switch (article.type) {
      case 'quick_win': return 'Quick Win';
      case 'deep_dive': return 'Deep Dive';
      case 'follow_up': return 'Follow Up';
      case 'complementary': return 'Related';
      default: return 'Suggested';
    }
  };

  return (
    <div 
      onClick={onSelect}
      className="bg-secondary rounded-lg p-4 border border-gray-600 hover:border-accent/50 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor()}`}>
          {getTypeIcon()}
          <span>{getTypeLabel()}</span>
        </div>
        
        <div className="flex items-center text-xs text-text-secondary">
          <ClockIcon className="h-3 w-3 mr-1" />
          {article.estimatedReadTime}m
        </div>
      </div>

      <h4 className="font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors">
        {article.title}
      </h4>
      
      <p className="text-sm text-text-secondary mb-3 line-clamp-2">
        {article.summary}
      </p>

      <div className="flex items-center justify-between">
        <p className="text-xs text-accent">
          {article.reason}
        </p>
        
        <ChevronRight className="h-4 w-4 text-text-secondary group-hover:text-accent transition-colors" />
      </div>
    </div>
  );
};

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  currentArticle,
  allArticles,
  readingProgress,
  onSelectArticle,
  maxRecommendations = 6
}) => {
  const engine = new ArticleRecommendationEngine();
  const recommendations = engine.getRecommendations(
    currentArticle,
    allArticles,
    readingProgress
  ).slice(0, maxRecommendations);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="bg-secondary/30 rounded-lg p-6 border border-gray-600">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="h-5 w-5 text-accent" />
        <h3 className="text-lg font-semibold text-text-primary">
          Continue Your Growth
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((article) => (
          <RecommendationCard
            key={article.id}
            article={article}
            onSelect={() => onSelectArticle(article)}
          />
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-text-secondary">
          Recommendations based on your reading history and interests
        </p>
      </div>
    </div>
  );
};

export const QuickActions: React.FC<{
  currentProgress: number;
  onContinueReading: () => void;
  onMarkComplete: () => void;
  onBookmark: () => void;
  isBookmarked: boolean;
}> = ({ 
  currentProgress, 
  onContinueReading, 
  onMarkComplete, 
  onBookmark, 
  isBookmarked 
}) => {
  return (
    <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
      <h4 className="font-semibold text-text-primary mb-3">Quick Actions</h4>
      
      <div className="grid grid-cols-2 gap-3">
        {currentProgress < 100 && currentProgress > 0 && (
          <button
            onClick={onContinueReading}
            className="flex items-center justify-center space-x-2 bg-accent text-primary px-4 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors"
          >
            <Target className="h-4 w-4" />
            <span>Continue</span>
          </button>
        )}
        
        {currentProgress < 100 && (
          <button
            onClick={onMarkComplete}
            className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <Target className="h-4 w-4" />
            <span>Complete</span>
          </button>
        )}
        
        <button
          onClick={onBookmark}
          className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isBookmarked
              ? 'bg-yellow-600 text-white hover:bg-yellow-700'
              : 'bg-secondary border border-gray-600 text-text-secondary hover:text-accent hover:border-accent'
          }`}
        >
          <Star className="h-4 w-4" />
          <span>{isBookmarked ? 'Saved' : 'Save'}</span>
        </button>
      </div>
    </div>
  );
};