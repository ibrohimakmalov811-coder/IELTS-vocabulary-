-- ==============================================================================
-- LexiVance IELTS — V2 Platform Upgrade Database Migration
-- Covers: Topics, Word Topics, User Sentences, Learning Missions & Gamification
-- ==============================================================================

-- 1. IELTS Topics Directory
CREATE TABLE IF NOT EXISTS public.topics (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title_en TEXT NOT NULL,
  title_uz TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'BookOpen',
  description_en TEXT,
  description_uz TEXT,
  speaking_prompt TEXT,
  writing_prompt TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Word Topics Mapping with IELTS Speaking & Writing Contexts
CREATE TABLE IF NOT EXISTS public.word_topics (
  word_id TEXT NOT NULL REFERENCES public.vocabulary_words(id) ON DELETE CASCADE,
  topic_slug TEXT NOT NULL REFERENCES public.topics(slug) ON DELETE CASCADE,
  speaking_sample TEXT,
  writing_sample TEXT,
  collocation_context TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (word_id, topic_slug)
);

-- 3. User Sentences (Active Vocabulary Practice)
CREATE TABLE IF NOT EXISTS public.user_sentences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  word_id TEXT NOT NULL REFERENCES public.vocabulary_words(id) ON DELETE CASCADE,
  sentence_en TEXT NOT NULL,
  translation_uz TEXT,
  ielts_context TEXT DEFAULT 'General IELTS', -- 'Speaking Part 2/3', 'Writing Task 2', 'General IELTS'
  feedback_notes TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Learning Missions & Daily/Weekly Objectives
CREATE TABLE IF NOT EXISTS public.learning_missions (
  id TEXT PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_uz TEXT NOT NULL,
  description_en TEXT,
  description_uz TEXT,
  mission_type TEXT NOT NULL CHECK (mission_type IN ('daily', 'weekly', 'achievement')),
  target_count INT NOT NULL DEFAULT 1,
  target_metric TEXT NOT NULL, -- 'learn_words', 'review_words', 'complete_quiz', 'write_sentence', 'streak_days'
  coin_reward INT NOT NULL DEFAULT 30,
  badge_reward TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. User Mission Progress
CREATE TABLE IF NOT EXISTS public.user_mission_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mission_id TEXT NOT NULL REFERENCES public.learning_missions(id) ON DELETE CASCADE,
  current_count INT DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  is_claimed BOOLEAN DEFAULT FALSE,
  claimed_at TIMESTAMPTZ,
  period_start DATE DEFAULT CURRENT_DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, mission_id, period_start)
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_topics_slug ON public.topics(slug);
CREATE INDEX IF NOT EXISTS idx_word_topics_topic ON public.word_topics(topic_slug);
CREATE INDEX IF NOT EXISTS idx_word_topics_word ON public.word_topics(word_id);
CREATE INDEX IF NOT EXISTS idx_user_sentences_user ON public.user_sentences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sentences_word ON public.user_sentences(word_id);
CREATE INDEX IF NOT EXISTS idx_user_mission_user_period ON public.user_mission_progress(user_id, period_start);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.word_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sentences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mission_progress ENABLE ROW LEVEL SECURITY;

-- Topics policies
DROP POLICY IF EXISTS "Public can view active topics" ON public.topics;
CREATE POLICY "Public can view active topics" ON public.topics
  FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Admin manage topics" ON public.topics;
CREATE POLICY "Admin manage topics" ON public.topics
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Word Topics policies
DROP POLICY IF EXISTS "Public can view word topics" ON public.word_topics;
CREATE POLICY "Public can view word topics" ON public.word_topics
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Admin manage word topics" ON public.word_topics;
CREATE POLICY "Admin manage word topics" ON public.word_topics
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- User Sentences policies
DROP POLICY IF EXISTS "Users can manage own sentences" ON public.user_sentences;
CREATE POLICY "Users can manage own sentences" ON public.user_sentences
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Learning Missions policies
DROP POLICY IF EXISTS "Public can view active missions" ON public.learning_missions;
CREATE POLICY "Public can view active missions" ON public.learning_missions
  FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Admin manage learning missions" ON public.learning_missions;
CREATE POLICY "Admin manage learning missions" ON public.learning_missions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- User Mission Progress policies
DROP POLICY IF EXISTS "Users can manage own mission progress" ON public.user_mission_progress;
CREATE POLICY "Users can manage own mission progress" ON public.user_mission_progress
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- STORED PROCEDURE: ATOMIC MISSION REWARD CLAIM
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.claim_mission_reward(
  p_mission_id TEXT,
  p_period_start DATE DEFAULT CURRENT_DATE
)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_mission public.learning_missions%ROWTYPE;
  v_progress public.user_mission_progress%ROWTYPE;
  v_new_balance INT;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO v_mission FROM public.learning_missions WHERE id = p_mission_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Mission not found';
  END IF;

  SELECT * INTO v_progress FROM public.user_mission_progress
  WHERE user_id = v_user_id AND mission_id = p_mission_id AND period_start = p_period_start;

  IF NOT FOUND OR v_progress.current_count < v_mission.target_count THEN
    RAISE EXCEPTION 'Mission objective not yet met';
  END IF;

  IF v_progress.is_claimed THEN
    RAISE EXCEPTION 'Mission reward already claimed for this period';
  END IF;

  -- Mark claimed
  UPDATE public.user_mission_progress
  SET is_claimed = TRUE, is_completed = TRUE, claimed_at = NOW(), updated_at = NOW()
  WHERE id = v_progress.id;

  -- Credit coins
  UPDATE public.profiles
  SET total_coins = total_coins + v_mission.coin_reward
  WHERE id = v_user_id
  RETURNING total_coins INTO v_new_balance;

  -- Record in ledger
  INSERT INTO public.reward_events (user_id, event_type, amount, balance_after, reason)
  VALUES (
    v_user_id,
    'mission_reward',
    v_mission.coin_reward,
    v_new_balance,
    'Claimed reward for mission: ' || v_mission.title_en
  );

  RETURN jsonb_build_object(
    'success', true,
    'coins_awarded', v_mission.coin_reward,
    'new_balance', v_new_balance,
    'badge', v_mission.badge_reward
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
