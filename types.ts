import React from 'react';

export type View =
  | 'dashboard'
  | 'guides'
  | 'mentor'
  | 'community'
  | 'challenges'
  | 'progress'
  | 'about'
  | 'dating'
  | 'grooming'
  | 'focus'
  | 'tools'
  | 'mycode';

export type ArenaType = 'mind' | 'heart' | 'body' | 'soul' | 'work';

export interface NavItem {
  id: View;
  label: string;
  icon: React.FC<React.ComponentProps<'svg'>>;
}

export interface LifeArena {
  id: ArenaType;
  title: string;
  description: string;
  icon: React.FC<React.ComponentProps<'svg'>>;
  color: string;
  gradient: string;
}

export interface Article {
  id: number;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  category: string;
  arena: ArenaType;
}

export interface Post {
    id: number;
    author: string;
    timestamp: string;
    title: string;
    content: string;
    comments: number;
    upvotes: number;
}

export enum MessageAuthor {
    USER = 'user',
    MENTOR = 'mentor',
}

export interface ChatMessage {
    author: MessageAuthor;
    text: string;
    timestamp: Date;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  arena: ArenaType;
  difficulty: 'baseline' | 'momentum' | 'advanced';
  estimatedTime?: string;
}

export interface Workout {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  note?: string;
}

export interface ChecklistItem {
  id: string;
  name: string;
  description: string;
}

export interface DateIdea {
    title: string;
    description: string;
}

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

export interface EnhancedChatMessage extends ChatMessage {
    followUpQuestions?: string[];
    mentorId?: string;
}

export interface OnboardingProfile {
  name: string;
  primaryGoal: 'dating' | 'career' | 'discipline' | 'confidence';
  focusArena: ArenaType;
  challengeCadence: 'daily' | 'weekly' | 'custom';
  obstacle: string;
  createdAt: string;
}
