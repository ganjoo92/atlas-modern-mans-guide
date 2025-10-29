-- Atlas Modern Man's Guide Database Schema
-- Run this in your Supabase SQL editor to create the necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    email TEXT,
    name TEXT NOT NULL,
    primary_goal TEXT NOT NULL CHECK (primary_goal IN ('dating', 'career', 'discipline', 'confidence')),
    focus_arena TEXT NOT NULL CHECK (focus_arena IN ('mind', 'heart', 'body', 'soul', 'work')),
    challenge_cadence TEXT NOT NULL CHECK (challenge_cadence IN ('daily', 'weekly', 'custom')),
    obstacle TEXT,
    onboarding_completed_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Mood Entries Table
CREATE TABLE mood_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    mood_value TEXT NOT NULL CHECK (mood_value IN ('charged', 'steady', 'strained')),
    note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Win Entries Table
CREATE TABLE win_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    arena TEXT NOT NULL CHECK (arena IN ('mind', 'heart', 'body', 'soul', 'work')),
    impact TEXT NOT NULL CHECK (impact IN ('small', 'medium', 'large')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weekly Reflections Table
CREATE TABLE weekly_reflections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    week_end DATE NOT NULL,
    ai_summary TEXT NOT NULL,
    total_wins INTEGER DEFAULT 0,
    mood_trend TEXT CHECK (mood_trend IN ('improving', 'stable', 'declining')),
    focus_peak_day TEXT,
    suggested_actions TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Challenge Completions Table
CREATE TABLE challenge_completions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge_id INTEGER NOT NULL,
    arena TEXT NOT NULL CHECK (arena IN ('mind', 'heart', 'body', 'soul', 'work')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('baseline', 'momentum', 'advanced')),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mentor Interactions Table
CREATE TABLE mentor_interactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    mentor_id TEXT NOT NULL,
    message_text TEXT NOT NULL,
    response_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Events Table
CREATE TABLE analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT,
    event_name TEXT NOT NULL,
    properties JSONB DEFAULT '{}',
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE win_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Mood Entries Policies
CREATE POLICY "Users can view own mood entries" ON mood_entries
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mood entries" ON mood_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own mood entries" ON mood_entries
    FOR UPDATE USING (auth.uid() = user_id);

-- Win Entries Policies
CREATE POLICY "Users can view own win entries" ON win_entries
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own win entries" ON win_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own win entries" ON win_entries
    FOR UPDATE USING (auth.uid() = user_id);

-- Weekly Reflections Policies
CREATE POLICY "Users can view own weekly reflections" ON weekly_reflections
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own weekly reflections" ON weekly_reflections
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own weekly reflections" ON weekly_reflections
    FOR UPDATE USING (auth.uid() = user_id);

-- Challenge Completions Policies
CREATE POLICY "Users can view own challenge completions" ON challenge_completions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own challenge completions" ON challenge_completions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Mentor Interactions Policies
CREATE POLICY "Users can view own mentor interactions" ON mentor_interactions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own mentor interactions" ON mentor_interactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Analytics Events Policies
CREATE POLICY "Users can view own analytics events" ON analytics_events
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own analytics events" ON analytics_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Indexes for Performance
CREATE INDEX mood_entries_user_id_created_at_idx ON mood_entries(user_id, created_at DESC);
CREATE INDEX win_entries_user_id_created_at_idx ON win_entries(user_id, created_at DESC);
CREATE INDEX weekly_reflections_user_id_week_start_idx ON weekly_reflections(user_id, week_start DESC);
CREATE INDEX challenge_completions_user_id_completed_at_idx ON challenge_completions(user_id, completed_at DESC);
CREATE INDEX mentor_interactions_user_id_created_at_idx ON mentor_interactions(user_id, created_at DESC);
CREATE INDEX analytics_events_user_id_created_at_idx ON analytics_events(user_id, created_at DESC);

-- Functions for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for user_profiles updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();