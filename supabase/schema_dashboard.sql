-- =============================================================================
-- LexiVance IELTS — Dashboard Refactor & Schema Migration
-- Run this script in the Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- =============================================================================

-- 1. Profiles & Gamification Streak
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  target_band NUMERIC(2, 1) DEFAULT 7.5,
  current_streak INT DEFAULT 0,
  last_study_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Master Vocabulary (Paul Nation Book 5)
CREATE TABLE IF NOT EXISTS public.vocabulary (
  id SERIAL PRIMARY KEY,
  unit_number INT NOT NULL,
  word TEXT NOT NULL,
  definition_en TEXT NOT NULL,
  definition_uz TEXT,
  example_sentence TEXT
);

-- 3. Weak Words & Spaced Repetition Tracker
CREATE TABLE IF NOT EXISTS public.user_word_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  word_id INT REFERENCES public.vocabulary(id) ON DELETE CASCADE,
  correct_count INT DEFAULT 0,
  incorrect_count INT DEFAULT 0,
  last_reviewed TIMESTAMPTZ DEFAULT NOW(),
  mastered BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, word_id)
);

-- 4. Completed Test / Quiz Sessions History
CREATE TABLE IF NOT EXISTS public.quiz_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  unit_number INT NOT NULL,
  test_type TEXT NOT NULL,
  total_questions INT NOT NULL,
  correct_answers INT NOT NULL,
  accuracy_rate NUMERIC(5, 2) NOT NULL,
  time_spent_seconds INT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- Row Level Security (RLS) & Access Policies
-- Ensures real-time reading and writing works seamlessly
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_word_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Vocabulary Policies (Readable by all students)
DROP POLICY IF EXISTS "Vocabulary is readable by everyone" ON public.vocabulary;
CREATE POLICY "Vocabulary is readable by everyone" ON public.vocabulary FOR SELECT USING (true);

DROP POLICY IF EXISTS "Vocabulary manageable by service or authenticated" ON public.vocabulary;
CREATE POLICY "Vocabulary manageable by service or authenticated" ON public.vocabulary FOR ALL USING (true);

-- User Word Progress Policies
DROP POLICY IF EXISTS "Word progress readable by everyone" ON public.user_word_progress;
CREATE POLICY "Word progress readable by everyone" ON public.user_word_progress FOR SELECT USING (true);

DROP POLICY IF EXISTS "Word progress manageable" ON public.user_word_progress;
CREATE POLICY "Word progress manageable" ON public.user_word_progress FOR ALL USING (true) WITH CHECK (true);

-- Quiz Sessions Policies
DROP POLICY IF EXISTS "Quiz sessions readable by everyone" ON public.quiz_sessions;
CREATE POLICY "Quiz sessions readable by everyone" ON public.quiz_sessions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Quiz sessions insertable" ON public.quiz_sessions;
CREATE POLICY "Quiz sessions insertable" ON public.quiz_sessions FOR INSERT WITH CHECK (true);

-- =============================================================================
-- Initial Sample Seed Data (Paul Nation Book 5 & Sample Quiz Sessions)
-- =============================================================================

INSERT INTO public.vocabulary (unit_number, word, definition_en, definition_uz, example_sentence)
VALUES
  (1, 'Allot', 'To give something for a specific purpose or distribute shares.', 'Muayyan maqsad uchun ajratmoq yoki ulashmoq.', 'The committee decided to allot two hours for each candidate.'),
  (1, 'Appall', 'To greatly dismay or horrify someone.', 'Dahshatga solmoq, qattiq hayratda qoldirmoq.', 'The terrible working conditions appall anyone who visits.'),
  (1, 'Cache', 'A hiding place, especially one in the ground, for ammunition, food, or treasures.', 'Yashirin joy, xazina yoki qurol-yarog‘ yashirilgan joy.', 'The police discovered a secret cache of stolen artworks.'),
  (1, 'Convenience', 'The state of being able to proceed with something with little effort or difficulty.', 'Qulaylik, osonlik.', 'Online banking offers unmatched convenience for busy professionals.'),
  (1, 'Dearth', 'A scarcity or lack of something.', 'Tanqislik, yetishmovchilik.', 'There is a severe dearth of affordable housing in the city.'),
  (2, 'Deliberate', 'Done consciously and intentionally.', 'Qasddan qilingan, o‘ylab qilingan.', 'It was a deliberate attempt to mislead the investigation.'),
  (2, 'Dire', 'Extremely serious or urgent.', 'Juda og‘ir, xavfli, fojiali.', 'The refugees are in dire need of food and clean water.'),
  (2, 'Elapse', 'Pass or go by (referring to time).', 'O‘tmoq (vaqt haqida).', 'Several years elapsed before the project was finally approved.')
ON CONFLICT DO NOTHING;

-- Sample completed sessions so dashboard has instant data upon setup
INSERT INTO public.quiz_sessions (unit_number, test_type, total_questions, correct_answers, accuracy_rate, time_spent_seconds, completed_at)
VALUES
  (1, 'Multiple Choice Test', 20, 18, 90.00, 240, NOW() - INTERVAL '2 hours'),
  (1, 'Spelling & Recall', 15, 12, 80.00, 180, NOW() - INTERVAL '1 day'),
  (2, 'Contextual Sentence Quiz', 20, 17, 85.00, 310, NOW() - INTERVAL '2 days'),
  (2, 'Speed Vocabulary Match', 25, 24, 96.00, 195, NOW() - INTERVAL '3 days')
ON CONFLICT DO NOTHING;

-- Sample weak words progress
INSERT INTO public.user_word_progress (word_id, correct_count, incorrect_count, mastered, last_reviewed)
SELECT id, 1, 3, false, NOW() FROM public.vocabulary WHERE word = 'Appall'
ON CONFLICT DO NOTHING;

INSERT INTO public.user_word_progress (word_id, correct_count, incorrect_count, mastered, last_reviewed)
SELECT id, 2, 4, false, NOW() FROM public.vocabulary WHERE word = 'Dearth'
ON CONFLICT DO NOTHING;

INSERT INTO public.user_word_progress (word_id, correct_count, incorrect_count, mastered, last_reviewed)
SELECT id, 0, 2, false, NOW() FROM public.vocabulary WHERE word = 'Dire'
ON CONFLICT DO NOTHING;
