-- FitBuddy-AI: Supabase Database Schema
-- Run this in your Supabase SQL Editor to set up the database tables and Row Level Security.

-- 1. Create the users table
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age > 0 AND age <= 120),
    gender TEXT NOT NULL CHECK (gender IN ('Female', 'Male', 'Other')),
    height NUMERIC(5, 2) NOT NULL CHECK (height > 0),
    weight NUMERIC(5, 2) NOT NULL CHECK (weight > 0),
    goal TEXT NOT NULL CHECK (goal IN ('Weight Loss', 'Weight Gain', 'Muscle Gain', 'General Fitness')),
    activity TEXT NOT NULL CHECK (activity IN ('Low', 'Moderate', 'High')),
    workout_preference TEXT,
    dietary_preference TEXT,
    available_time TEXT,
    plan JSONB NOT NULL,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create indexes for performance on frequent filter & search fields
CREATE INDEX IF NOT EXISTS idx_users_goal ON public.users (goal);
CREATE INDEX IF NOT EXISTS idx_users_activity ON public.users (activity);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_name ON public.users (name);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. Set up RLS Policies for secure public/anon access for the FitBuddy application
-- Allow anyone to read user profiles and public plan summaries
CREATE POLICY "Allow public read access to users"
    ON public.users
    FOR SELECT
    USING (true);

-- Allow inserting newly generated user plans
CREATE POLICY "Allow anonymous insert of user plans"
    ON public.users
    FOR INSERT
    WITH CHECK (true);

-- Allow users to delete their plan
CREATE POLICY "Allow deleting user plan"
    ON public.users
    FOR DELETE
    USING (true);

-- 5. Helpful comment for BSc Project documentation
COMMENT ON TABLE public.users IS 'Stores FitBuddy-AI registered users and their AI-generated personalized fitness & nutrition plans';
