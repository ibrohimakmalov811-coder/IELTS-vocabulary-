# LexiVance IELTS — Supabase & Production Backend Deployment Guide

This guide provides end-to-end instructions for deploying the PostgreSQL database, Row Level Security (RLS) policies, authentication, curriculum seed data, and administrative setup for **LexiVance IELTS**.

---

## 1. Create a Supabase Project

1. Log in to [https://supabase.com](https://supabase.com) and click **New Project**.
2. **Project Name:** `lexivance-ielts`
3. **Database Password:** Generate a secure password and store it safely.
4. **Region:** Select a region close to your primary audience (e.g., `Frankfurt (eu-central-1)` or `Singapore (ap-southeast-1)`).
5. Click **Create new project** and wait 1–2 minutes for the database to provision.

---

## 2. Obtain API Credentials

In the Supabase Dashboard, navigate to **Project Settings > API**:

1. Copy **Project URL** -> `NEXT_PUBLIC_SUPABASE_URL`
2. Copy **Project API keys > `anon` `public`** -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Copy **Project API keys > `service_role` (secret)** -> `SUPABASE_SERVICE_ROLE_KEY`

---

## 3. Apply the Database Schema & RLS Policies

1. In Supabase Dashboard, open the **SQL Editor** tab from the left sidebar.
2. Click **New query**.
3. Open the file `supabase/migrations/20261021000000_lexivance_schema.sql` from your project repository.
4. Copy its entire contents and paste into the Supabase SQL Editor.
5. Click **Run**.
6. **Verification:** You should see `Success. No rows returned`.
   Under the **Table Editor**, you will now see all 14 tables:
   - `profiles`
   - `vocabulary_units`
   - `vocabulary_words`
   - `user_word_progress`
   - `user_favorites`
   - `quiz_attempts`
   - `quiz_answer_details`
   - `daily_activity`
   - `reward_events`
   - `study_hacks`
   - `study_hack_votes`
   - `reports_moderation`
   - `user_settings`
   - `audit_logs`

---

## 4. Import the Curriculum Seed Data (Units 1–15 & 301 Words)

1. In Supabase SQL Editor, click **New query**.
2. Open `supabase/seed.sql` from your project repository.
3. Copy and paste the entire script (contains all 15 units and 301 academic words from *4000 Essential English Words Book 5*).
4. Click **Run**.
5. **Verification:**
   - Run: `SELECT count(*) FROM vocabulary_words;` -> returns `301`.
   - Run: `SELECT count(*) FROM vocabulary_units;` -> returns `15`.

---

## 5. Bootstrap the First Administrator

For security, every user who registers receives the default role `student`. To promote your personal account to `admin`:

1. Start your application and register an account at `/register` (e.g. `ibrohim@ielts.uz`).
2. Go to Supabase SQL Editor and execute:
   ```sql
   SELECT public.bootstrap_admin('ibrohim@ielts.uz');
   ```
3. You will receive: `Success: User ibrohim@ielts.uz is now an administrator.`
4. Log in at `/login`, and your account will now have administrative access to `/admin`!

---

## 6. Configure Local Environment Variables

Create a file named `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Run the local dev server:
```powershell
npm run dev
```

---

## 7. Deploy to Vercel

1. In your GitHub repository, ensure all recent commits are pushed:
   ```bash
   git push origin main
   ```
2. In the [Vercel Dashboard](https://vercel.com):
   - Select your project `ielts-vocabulary`.
   - Go to **Settings > Environment Variables**.
   - Add the 3 required variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
   - Target Environments: `Production`, `Preview`, `Development`.
3. Trigger a redeploy under **Deployments > Redeploy**.
4. Test live authentication, vocabulary cards, quiz submissions, and `/admin`!

---

## 8. Graceful Fallback Guarantee

If environment variables are omitted or database connectivity is temporarily interrupted, LexiVance IELTS gracefully activates its built-in offline engine:
- All 301 words and 15 units remain 100% accessible.
- Quiz sessions and flashcard practices continue without failure.
- Progress and test history are cached in browser `localStorage`.
- Once Supabase credentials are supplied, data syncs with the live PostgreSQL database.
