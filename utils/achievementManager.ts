import { Achievement, createAchievements } from '../components/AchievementSystem';
import { Star, Target, TrendingUp, Flame, Crown, Award } from '../components/Icons';

// Icon mapping for achievement restoration
const iconMap = {
  Star,
  Target,
  TrendingUp,
  Flame,
  Crown,
  Award
};

export class AchievementManager {
  private achievements: Achievement[] = [];
  private listeners: ((achievement: Achievement) => void)[] = [];

  constructor() {
    // Clear corrupted achievements on initialization if needed
    this.clearCorruptedAchievements();
    this.loadAchievements();
  }

  private clearCorruptedAchievements() {
    try {
      const saved = localStorage.getItem('achievements');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check if achievements have valid structure
        if (!Array.isArray(parsed) || parsed.some(a => !a.id || typeof a.icon === 'object')) {
          console.log('Clearing corrupted achievements...');
          localStorage.removeItem('achievements');
        }
      }
    } catch (error) {
      console.log('Clearing invalid achievements data...');
      localStorage.removeItem('achievements');
    }
  }

  private loadAchievements() {
    const saved = localStorage.getItem('achievements');
    if (saved) {
      const parsedAchievements = JSON.parse(saved);
      // Restore icon components after loading from localStorage
      this.achievements = parsedAchievements.map((achievement: any) => ({
        ...achievement,
        icon: this.getIconComponent(achievement.iconName || achievement.id)
      }));
    } else {
      this.achievements = createAchievements();
      this.saveAchievements();
    }
  }

  private getIconComponent(iconName: string) {
    // Map achievement IDs to their appropriate icons
    const achievementIconMap: {[key: string]: any} = {
      'first_article': iconMap.Star,
      'five_articles': iconMap.Target,
      'arena_master_mind': iconMap.TrendingUp,
      'streak_3': iconMap.Flame,
      'streak_7': iconMap.Flame,
      'speed_reader': iconMap.TrendingUp,
      'completionist': iconMap.Crown,
      'reflection_master': iconMap.Award
    };
    
    return achievementIconMap[iconName] || iconMap.Star;
  }

  private saveAchievements() {
    // Convert achievements to serializable format by storing icon names instead of components
    const serializableAchievements = this.achievements.map(achievement => ({
      ...achievement,
      iconName: achievement.id, // Use the achievement ID as the icon identifier
      icon: undefined // Remove the non-serializable component
    }));
    localStorage.setItem('achievements', JSON.stringify(serializableAchievements));
  }

  addListener(callback: (achievement: Achievement) => void) {
    this.listeners.push(callback);
  }

  removeListener(callback: (achievement: Achievement) => void) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  private notifyAchievementUnlocked(achievement: Achievement) {
    this.listeners.forEach(listener => listener(achievement));
  }

  getAchievements() {
    return this.achievements;
  }

  getAchievementsByCategory(category: string) {
    return this.achievements.filter(a => a.category === category);
  }

  getUnlockedAchievements() {
    return this.achievements.filter(a => a.unlocked);
  }

  getRecentAchievements(days: number = 7) {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    return this.achievements.filter(a => 
      a.unlocked && a.unlockedAt && a.unlockedAt > cutoff
    );
  }

  // Achievement triggers
  onArticleCompleted(articleId: number, arena: string, timeSpent: number) {
    const completedArticles = this.getCompletedArticlesCount();
    
    // First article
    this.updateProgress('first_article', 1);
    
    // Five articles
    this.updateProgress('five_articles', Math.min(completedArticles, 5));
    
    // Completionist (25 articles)
    this.updateProgress('completionist', Math.min(completedArticles, 25));
    
    // Speed reader (under 5 minutes)
    if (timeSpent < 300) { // 5 minutes in seconds
      this.updateProgress('speed_reader', 1);
    }

    // Arena mastery
    if (arena) {
      const arenaCount = this.getArenaCompletionCount(arena);
      const totalArenaArticles = this.getTotalArenaArticles(arena);
      
      if (arenaCount >= totalArenaArticles && totalArenaArticles > 0) {
        this.updateProgress(`arena_master_${arena}`, 1);
      }
    }

    this.saveAchievements();
  }

  onReflectionCompleted() {
    const reflectionCount = this.getCompletedReflectionsCount();
    this.updateProgress('reflection_master', Math.min(reflectionCount, 10));
    this.saveAchievements();
  }

  onDailyReadingStreak(streakLength: number) {
    this.updateProgress('streak_3', Math.min(streakLength, 3));
    this.updateProgress('streak_7', Math.min(streakLength, 7));
    this.saveAchievements();
  }

  private updateProgress(achievementId: string, newProgress: number) {
    const achievement = this.achievements.find(a => a.id === achievementId);
    if (!achievement) return;

    if (achievement.unlocked) return;

    achievement.progress = Math.max(achievement.progress, newProgress);
    
    if (achievement.progress >= achievement.maxProgress) {
      achievement.unlocked = true;
      achievement.unlockedAt = Date.now();
      this.notifyAchievementUnlocked(achievement);
    }
  }

  private getCompletedArticlesCount(): number {
    // Get from localStorage or your data source
    const progress = localStorage.getItem('globalReadingProgress') || '{}';
    const parsed = JSON.parse(progress);
    return Object.values(parsed).filter(p => p === 100).length;
  }

  private getCompletedReflectionsCount(): number {
    // Count all reflection responses across all articles
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('reflections_')) {
        const reflections = JSON.parse(localStorage.getItem(key) || '{}');
        count += Object.keys(reflections).length;
      }
    }
    return count;
  }

  private getArenaCompletionCount(arena: string): number {
    // This would need to be implemented based on your article data structure
    // For now, return a placeholder
    return 0;
  }

  private getTotalArenaArticles(arena: string): number {
    // This would need to be implemented based on your article data structure
    // For now, return a placeholder
    return 5; // Assuming 5 articles per arena
  }

  // Utility methods
  resetAchievements() {
    localStorage.removeItem('achievements');
    this.achievements = createAchievements();
    this.saveAchievements();
    console.log('Achievements reset successfully');
  }

  getAchievementStats() {
    const total = this.achievements.length;
    const unlocked = this.getUnlockedAchievements().length;
    const progress = Math.round((unlocked / total) * 100);

    return {
      total,
      unlocked,
      progress,
      recent: this.getRecentAchievements().length
    };
  }

  getRarityStats() {
    const stats = {
      common: { total: 0, unlocked: 0 },
      rare: { total: 0, unlocked: 0 },
      epic: { total: 0, unlocked: 0 },
      legendary: { total: 0, unlocked: 0 }
    };

    this.achievements.forEach(achievement => {
      stats[achievement.rarity].total++;
      if (achievement.unlocked) {
        stats[achievement.rarity].unlocked++;
      }
    });

    return stats;
  }
}

// Global instance
export const achievementManager = new AchievementManager();

// For debugging - expose on window in development
if (typeof window !== 'undefined') {
  (window as any).achievementManager = achievementManager;
}