-- =====================================================================
-- LexiVance IELTS — Production PostgreSQL Schema & Security Policies
-- Framework: Supabase + PostgreSQL with Row Level Security (RLS)
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------------
-- 1. Helper function for updated_at timestamps
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------
-- 2. PROFILES TABLE (Extends Supabase auth.users)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  username TEXT UNIQUE,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'moderator', 'admin')),
  preferred_language TEXT NOT NULL DEFAULT 'uz',
  preferred_pronunciation_accent TEXT NOT NULL DEFAULT 'US' CHECK (preferred_pronunciation_accent IN ('US', 'UK')),
  daily_learning_goal INTEGER NOT NULL DEFAULT 10,
  target_band TEXT DEFAULT 'Band 7.5',
  timezone TEXT DEFAULT 'Asia/Tashkent',
  total_coins INTEGER NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  has_streak_freeze BOOLEAN NOT NULL DEFAULT FALSE,
  has_golden_crown BOOLEAN NOT NULL DEFAULT FALSE,
  study_time_seconds INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------
-- 3. VOCABULARY UNITS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vocabulary_units (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  subtitle TEXT,
  description TEXT,
  unit_number INTEGER NOT NULL UNIQUE,
  total_words INTEGER NOT NULL DEFAULT 20,
  category TEXT DEFAULT 'Foundation & Academic',
  cover_image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 1,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vocabulary_units_order ON public.vocabulary_units(display_order);
CREATE INDEX IF NOT EXISTS idx_vocabulary_units_published ON public.vocabulary_units(is_published);

-- ---------------------------------------------------------------------
-- 4. VOCABULARY WORDS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vocabulary_words (
  id TEXT PRIMARY KEY,
  word TEXT NOT NULL,
  normalized_word TEXT NOT NULL,
  unit_id INTEGER NOT NULL REFERENCES public.vocabulary_units(id) ON DELETE CASCADE,
  part_of_speech TEXT NOT NULL CHECK (part_of_speech IN ('verb', 'noun', 'adjective', 'adverb', 'other')),
  ipa_us TEXT,
  ipa_uk TEXT,
  definition_en TEXT NOT NULL,
  definition_uz TEXT,
  translation_uz TEXT NOT NULL,
  translation_ru TEXT,
  example_sentence_en TEXT NOT NULL,
  example_translation_uz TEXT,
  cloze_sentence TEXT,
  target_answer TEXT,
  synonyms TEXT[] DEFAULT '{}',
  collocations TEXT[] DEFAULT '{}',
  antonyms TEXT[] DEFAULT '{}',
  word_family TEXT[] DEFAULT '{}',
  difficulty_level TEXT NOT NULL DEFAULT 'B2' CHECK (difficulty_level IN ('B1', 'B2', 'C1', 'C2')),
  topic_tags TEXT[] DEFAULT '{}',
  audio_url_us TEXT,
  audio_url_uk TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vocab_words_unit ON public.vocabulary_words(unit_id);
CREATE INDEX IF NOT EXISTS idx_vocab_words_normalized ON public.vocabulary_words(normalized_word);
CREATE INDEX IF NOT EXISTS idx_vocab_words_pos ON public.vocabulary_words(part_of_speech);
CREATE INDEX IF NOT EXISTS idx_vocab_words_difficulty ON public.vocabulary_words(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_vocab_words_published ON public.vocabulary_words(is_published);

CREATE TRIGGER trg_vocabulary_words_updated_at
BEFORE UPDATE ON public.vocabulary_words
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------
-- 5. USER WORD PROGRESS (Spaced Repetition & Learning Status)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_word_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  word_id TEXT NOT NULL REFERENCES public.vocabulary_words(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'learning', 'reviewing', 'mastered')),
  times_seen INTEGER NOT NULL DEFAULT 0,
  times_correct INTEGER NOT NULL DEFAULT 0,
  times_incorrect INTEGER NOT NULL DEFAULT 0,
  confidence_level INTEGER NOT NULL DEFAULT 0,
  repetition_number INTEGER NOT NULL DEFAULT 0,
  ease_factor NUMERIC(4,2) NOT NULL DEFAULT 2.50,
  interval_days INTEGER NOT NULL DEFAULT 0,
  last_reviewed_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ,
  last_answer_correct BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, word_id)
);

CREATE INDEX IF NOT EXISTS idx_uwp_user ON public.user_word_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_uwp_user_status ON public.user_word_progress(user_id, status);
CREATE INDEX IF NOT EXISTS idx_uwp_next_review ON public.user_word_progress(user_id, next_review_at);

CREATE TRIGGER trg_user_word_progress_updated_at
BEFORE UPDATE ON public.user_word_progress
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------
-- 6. USER FAVORITES TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  word_id TEXT NOT NULL REFERENCES public.vocabulary_words(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, word_id)
);

CREATE INDEX IF NOT EXISTS idx_user_fav_user ON public.user_favorites(user_id);

-- ---------------------------------------------------------------------
-- 7. QUIZ ATTEMPTS & DETAILS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quiz_type TEXT NOT NULL CHECK (quiz_type IN ('quiz', 'recall', 'cloze', 'flashcards')),
  unit_id INTEGER REFERENCES public.vocabulary_units(id) ON DELETE SET NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  incorrect_answers INTEGER NOT NULL,
  score_percentage NUMERIC(5,2) NOT NULL,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  coins_earned INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON public.quiz_attempts(user_id, completed_at DESC);

CREATE TABLE IF NOT EXISTS public.quiz_answer_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
  word_id TEXT NOT NULL REFERENCES public.vocabulary_words(id) ON DELETE CASCADE,
  selected_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  response_time_ms INTEGER DEFAULT 0,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_answer_details_attempt ON public.quiz_answer_details(attempt_id);

-- ---------------------------------------------------------------------
-- 8. DAILY ACTIVITY TABLE (Streak & Activity Aggregates)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.daily_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  words_reviewed INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  incorrect_answers INTEGER NOT NULL DEFAULT 0,
  quizzes_completed INTEGER NOT NULL DEFAULT 0,
  study_time_seconds INTEGER NOT NULL DEFAULT 0,
  coins_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, activity_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_activity_user_date ON public.daily_activity(user_id, activity_date DESC);

-- ---------------------------------------------------------------------
-- 9. USER COINS & REWARD AUDIT LEDGER
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reward_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('quiz_completion', 'daily_goal', 'streak_bonus', 'shop_purchase', 'admin_adjustment', 'word_mastered')),
  reference_id TEXT,
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reward_events_user ON public.reward_events(user_id, created_at DESC);

-- ---------------------------------------------------------------------
-- 10. STUDY HACKS & COMMUNITY TIPS
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.study_hacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  related_word_id TEXT REFERENCES public.vocabulary_words(id) ON DELETE SET NULL,
  related_unit_id INTEGER REFERENCES public.vocabulary_units(id) ON DELETE SET NULL,
  tag TEXT NOT NULL DEFAULT 'Memory Hook',
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected', 'hidden')),
  votes_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_study_hacks_status ON public.study_hacks(status, votes_count DESC);
CREATE INDEX IF NOT EXISTS idx_study_hacks_author ON public.study_hacks(author_id);

CREATE TABLE IF NOT EXISTS public.study_hack_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hack_id UUID NOT NULL REFERENCES public.study_hacks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vote_type INTEGER NOT NULL CHECK (vote_type IN (1, -1)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(hack_id, user_id)
);

-- Trigger to keep votes_count in sync
CREATE OR REPLACE FUNCTION update_study_hack_votes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.study_hacks
    SET votes_count = votes_count + NEW.vote_type
    WHERE id = NEW.hack_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.study_hacks
    SET votes_count = votes_count - OLD.vote_type
    WHERE id = OLD.hack_id;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE public.study_hacks
    SET votes_count = votes_count - OLD.vote_type + NEW.vote_type
    WHERE id = NEW.hack_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_study_hack_votes_count
AFTER INSERT OR UPDATE OR DELETE ON public.study_hack_votes
FOR EACH ROW EXECUTE FUNCTION update_study_hack_votes_count();

-- ---------------------------------------------------------------------
-- 11. REPORTS & MODERATION
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reports_moderation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('study_hack', 'user_comment', 'other')),
  content_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  moderator_notes TEXT,
  moderator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports_moderation(status);

-- ---------------------------------------------------------------------
-- 12. USER SETTINGS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_settings (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  interface_language TEXT NOT NULL DEFAULT 'uz',
  preferred_accent TEXT NOT NULL DEFAULT 'US',
  dark_mode BOOLEAN NOT NULL DEFAULT FALSE,
  sound_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  email_reminders BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 13. AUDIT LOGS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id, created_at DESC);

-- =====================================================================
-- 14. AUTHENTICATION HOOK (Automatic Profile Creation)
-- =====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_name TEXT;
  v_target_band TEXT;
BEGIN
  v_name := COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
  v_target_band := COALESCE(NEW.raw_user_meta_data->>'target_band', 'Band 7.5');

  INSERT INTO public.profiles (id, display_name, target_band, role)
  VALUES (NEW.id, v_name, v_target_band, 'student')
  ON CONFLICT (id) DO UPDATE
  SET display_name = EXCLUDED.display_name;

  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================================
-- 15. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary_words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_word_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answer_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_hacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_hack_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports_moderation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper security functions
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_moderator()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('moderator', 'admin')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND
  (role = (SELECT role FROM public.profiles WHERE id = auth.uid()) OR public.is_admin())
);

-- Vocabulary Units Policies
CREATE POLICY "Published units are viewable by everyone"
ON public.vocabulary_units FOR SELECT
USING (is_published = TRUE OR public.is_moderator());

CREATE POLICY "Admins can manage units"
ON public.vocabulary_units FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Vocabulary Words Policies
CREATE POLICY "Published words are viewable by everyone"
ON public.vocabulary_words FOR SELECT
USING (is_published = TRUE OR public.is_moderator());

CREATE POLICY "Admins can manage words"
ON public.vocabulary_words FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- User Word Progress Policies (Strict Privacy)
CREATE POLICY "Users can manage their own word progress"
ON public.user_word_progress FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view word progress"
ON public.user_word_progress FOR SELECT
USING (public.is_admin());

-- User Favorites Policies
CREATE POLICY "Users can manage their own favorites"
ON public.user_favorites FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Quiz Attempts Policies
CREATE POLICY "Users can view and insert their own quiz attempts"
ON public.quiz_attempts FOR SELECT
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can create their own quiz attempt"
ON public.quiz_attempts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view and insert their own quiz answers"
ON public.quiz_answer_details FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.quiz_attempts
    WHERE id = attempt_id AND user_id = auth.uid()
  ) OR public.is_admin()
);

CREATE POLICY "Users can insert their own quiz answers"
ON public.quiz_answer_details FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.quiz_attempts
    WHERE id = attempt_id AND user_id = auth.uid()
  )
);

-- Daily Activity Policies
CREATE POLICY "Users can view and update their own daily activity"
ON public.daily_activity FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Reward Events (Auditable Ledger: Users can only view, server functions insert)
CREATE POLICY "Users can view their own reward history"
ON public.reward_events FOR SELECT
USING (auth.uid() = user_id OR public.is_admin());

-- Study Hacks Policies
CREATE POLICY "Approved study hacks are viewable by everyone"
ON public.study_hacks FOR SELECT
USING (status = 'approved' OR auth.uid() = author_id OR public.is_moderator());

CREATE POLICY "Authenticated users can submit study hacks"
ON public.study_hacks FOR INSERT
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update pending study hacks"
ON public.study_hacks FOR UPDATE
USING (auth.uid() = author_id OR public.is_moderator())
WITH CHECK (auth.uid() = author_id OR public.is_moderator());

CREATE POLICY "Authors or admins can delete study hacks"
ON public.study_hacks FOR DELETE
USING (auth.uid() = author_id OR public.is_admin());

-- Study Hack Votes Policies
CREATE POLICY "Users can view and submit votes"
ON public.study_hack_votes FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Reports & Moderation Policies
CREATE POLICY "Authenticated users can file reports"
ON public.reports_moderation FOR INSERT
WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Moderators can view and update reports"
ON public.reports_moderation FOR ALL
USING (public.is_moderator())
WITH CHECK (public.is_moderator());

-- User Settings Policies
CREATE POLICY "Users can manage their own settings"
ON public.user_settings FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Audit Logs Policies
CREATE POLICY "Admins can view audit logs"
ON public.audit_logs FOR SELECT
USING (public.is_admin());

-- =====================================================================
-- 16. ATOMIC SECURE PROCEDURES
-- =====================================================================

-- Secure Server-Validated Quiz Submission Function
CREATE OR REPLACE FUNCTION public.submit_quiz_session(
  p_quiz_type TEXT,
  p_unit_id INTEGER,
  p_total_questions INTEGER,
  p_correct_answers INTEGER,
  p_duration_seconds INTEGER,
  p_answers JSONB -- array of {word_id, selected_answer, is_correct, response_time_ms}
)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_attempt_id UUID;
  v_score_pct NUMERIC(5,2);
  v_coins_to_award INTEGER;
  v_new_balance INTEGER;
  v_today DATE := CURRENT_DATE;
  v_ans JSONB;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  v_score_pct := ROUND((p_correct_answers::NUMERIC / GREATEST(1, p_total_questions)::NUMERIC) * 100, 2);
  -- 10 coins per correct answer, anti-cheat server calculation
  v_coins_to_award := p_correct_answers * 10;

  -- 1. Insert Quiz Attempt
  INSERT INTO public.quiz_attempts (
    user_id, quiz_type, unit_id, total_questions, correct_answers,
    incorrect_answers, score_percentage, duration_seconds, coins_earned
  )
  VALUES (
    v_user_id, p_quiz_type, p_unit_id, p_total_questions, p_correct_answers,
    (p_total_questions - p_correct_answers), v_score_pct, p_duration_seconds, v_coins_to_award
  )
  RETURNING id INTO v_attempt_id;

  -- 2. Insert Answer Details
  FOR v_ans IN SELECT * FROM jsonb_array_elements(p_answers)
  LOOP
    INSERT INTO public.quiz_answer_details (
      attempt_id, word_id, selected_answer, is_correct, response_time_ms
    )
    VALUES (
      v_attempt_id,
      v_ans->>'word_id',
      v_ans->>'selected_answer',
      (v_ans->>'is_correct')::BOOLEAN,
      COALESCE((v_ans->>'response_time_ms')::INTEGER, 0)
    );
  END LOOP;

  -- 3. Award Coins via Ledger
  IF v_coins_to_award > 0 THEN
    UPDATE public.profiles
    SET total_coins = total_coins + v_coins_to_award
    WHERE id = v_user_id
    RETURNING total_coins INTO v_new_balance;

    INSERT INTO public.reward_events (
      user_id, event_type, reference_id, amount, balance_after, description
    )
    VALUES (
      v_user_id, 'quiz_completion', v_attempt_id::TEXT, v_coins_to_award, v_new_balance,
      'Completed ' || p_quiz_type || ' test (' || p_correct_answers || '/' || p_total_questions || ' correct)'
    );
  ELSE
    SELECT total_coins INTO v_new_balance FROM public.profiles WHERE id = v_user_id;
  END IF;

  -- 4. Update Daily Activity
  INSERT INTO public.daily_activity (
    user_id, activity_date, words_reviewed, correct_answers, incorrect_answers,
    quizzes_completed, study_time_seconds, coins_earned
  )
  VALUES (
    v_user_id, v_today, p_total_questions, p_correct_answers,
    (p_total_questions - p_correct_answers), 1, p_duration_seconds, v_coins_to_award
  )
  ON CONFLICT (user_id, activity_date) DO UPDATE
  SET
    words_reviewed = daily_activity.words_reviewed + EXCLUDED.words_reviewed,
    correct_answers = daily_activity.correct_answers + EXCLUDED.correct_answers,
    incorrect_answers = daily_activity.incorrect_answers + EXCLUDED.incorrect_answers,
    quizzes_completed = daily_activity.quizzes_completed + 1,
    study_time_seconds = daily_activity.study_time_seconds + EXCLUDED.study_time_seconds,
    coins_earned = daily_activity.coins_earned + EXCLUDED.coins_earned;

  RETURN jsonb_build_object(
    'attempt_id', v_attempt_id,
    'score_percentage', v_score_pct,
    'coins_earned', v_coins_to_award,
    'new_balance', v_new_balance
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---------------------------------------------------------------------
-- 17. SECURE INITIAL ADMIN BOOTSTRAP FUNCTION
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.bootstrap_admin(p_email TEXT)
RETURNS TEXT AS $$
DECLARE
  v_target_user_id UUID;
BEGIN
  -- Look up user ID from auth.users
  SELECT id INTO v_target_user_id
  FROM auth.users
  WHERE email = LOWER(TRIM(p_email));

  IF v_target_user_id IS NULL THEN
    RETURN 'Error: User with email ' || p_email || ' does not exist. Please register first.';
  END IF;

  UPDATE public.profiles
  SET role = 'admin'
  WHERE id = v_target_user_id;

  INSERT INTO public.audit_logs (actor_id, action, entity_type, entity_id, new_data)
  VALUES (v_target_user_id, 'bootstrap_admin', 'profiles', v_target_user_id::TEXT, jsonb_build_object('role', 'admin', 'email', p_email));

  RETURN 'Success: User ' || p_email || ' (' || v_target_user_id || ') is now an administrator.';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
