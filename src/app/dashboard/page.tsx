'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Flame, Clock, Target, Award, AlertTriangle, ArrowRight, BookCheck, RefreshCw } from 'lucide-react';

interface QuizSession {
  id: string;
  unit_number: number;
  test_type: string;
  total_questions: number;
  correct_answers: number;
  accuracy_rate: number;
  completed_at: string;
}

interface VocabularyDetails {
  word: string;
  definition_en: string;
  definition_uz: string;
}

interface WeakWord {
  id: string;
  incorrect_count: number;
  vocabulary: VocabularyDetails | VocabularyDetails[] | null;
}

interface Profile {
  id: string;
  full_name?: string;
  target_band?: number;
  current_streak?: number;
}

export default function DashboardPage() {
  const [sessions, setSessions] = useState<QuizSession[]>([]);
  const [weakWords, setWeakWords] = useState<WeakWord[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [masteredCount, setMasteredCount] = useState<number>(64);
  const [loading, setLoading] = useState(true);

  async function loadDashboardData() {
    setLoading(true);

    try {
      // 1. Fetch Quiz History
      const { data: sessionData, error: sessionError } = await supabase
        .from('quiz_sessions')
        .select('*')
        .order('completed_at', { ascending: false })
        .limit(5);

      if (sessionError) {
        console.warn('Quiz sessions fetch notice:', sessionError.message);
      } else if (sessionData) {
        setSessions(sessionData as QuizSession[]);
      }

      // 2. Fetch Words needing practice
      const { data: weakData, error: weakError } = await supabase
        .from('user_word_progress')
        .select('id, incorrect_count, vocabulary(word, definition_en, definition_uz)')
        .gt('incorrect_count', 0)
        .eq('mastered', false)
        .order('incorrect_count', { ascending: false })
        .limit(4);

      if (weakError) {
        console.warn('Weak words fetch notice:', weakError.message);
      } else if (weakData) {
        setWeakWords(weakData as unknown as WeakWord[]);
      }

      // 3. Fetch Student Profile & Streak (if authenticated)
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle();

        if (profileData) {
          setProfile(profileData as Profile);
        }

        // Count Mastered Words
        const { count } = await supabase
          .from('user_word_progress')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', authData.user.id)
          .eq('mastered', true);

        if (count !== null && count !== undefined && count > 0) {
          setMasteredCount(count);
        }
      }
    } catch (err) {
      console.error('Dashboard data loading error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="animate-pulse text-lg text-emerald-400 font-medium">Dashboard yuklanmoqda...</p>
      </div>
    );
  }

  const streakDays = profile?.current_streak ?? 3;
  const targetBandText = profile?.target_band ? `Band ${profile.target_band}` : 'Band 7.5';
  const profileTitle = profile?.full_name || 'Talaba Profili';

  const averageAccuracy =
    sessions.length > 0
      ? Math.round(sessions.reduce((acc, s) => acc + Number(s.accuracy_rate), 0) / sessions.length)
      : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24 md:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8">
      {/* 1. Header Profile Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">{profileTitle}</h1>
          <p className="text-sm text-slate-400">Maqsad: {targetBandText} • Paul Nation Book 5</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => loadDashboardData()}
            title="Yangilash"
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <Link
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-5 py-2.5 rounded-xl transition"
            href="/practice"
          >
            <BookCheck className="w-5 h-5" />
            <span>Yangi Test Ishlash</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <Flame className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase">Kunlik Seriya</span>
          </div>
          <p className="text-2xl font-extrabold">{streakDays} Kun</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <Target className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase">O‘rtacha Aniqlik</span>
          </div>
          <p className="text-2xl font-extrabold">{sessions.length > 0 ? `${averageAccuracy}%` : '0%'}</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase">Sessiyalar</span>
          </div>
          <p className="text-2xl font-extrabold">{sessions.length} ta</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-purple-400 mb-2">
            <Award className="w-5 h-5" />
            <span className="text-xs font-semibold uppercase">O‘zlashtirilgan</span>
          </div>
          <p className="text-2xl font-extrabold">{masteredCount} / 300</p>
        </div>
      </div>

      {/* 3. Spaced Repetition / Weak Words Module */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Qaytarish Kerak Bo‘lgan So‘zlar (Weak Words)</h2>
          </div>
          <Link className="text-xs text-emerald-400 hover:underline flex items-center gap-1" href="/practice">
            Qayta mashq qilish <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {weakWords.length === 0 ? (
          <p className="text-slate-400 text-sm py-4">Barcha so‘zlar yaxshi o‘zlashtirilgan!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {weakWords.map((item) => {
              const vocab = Array.isArray(item.vocabulary) ? item.vocabulary[0] : item.vocabulary;
              const word = vocab?.word || 'So‘z';
              const definition = vocab?.definition_uz || vocab?.definition_en || 'Ta’rif mavjud emas';

              return (
                <div key={item.id} className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl">
                  <span className="text-xs text-rose-400 font-semibold">{item.incorrect_count} marta xato</span>
                  <h3 className="text-base font-bold text-white mt-1">{word}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">{definition}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Recent Test Sessions (Mobile Card-based / Desktop Responsive) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Oxirgi Testlar Tarixi</h2>

        {sessions.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl">
            <p className="text-slate-400 text-sm">Hozircha topshirilgan testlar mavjud emas.</p>
            <Link
              className="mt-3 inline-block text-xs bg-slate-800 text-slate-200 px-4 py-2 rounded-lg hover:bg-slate-700 transition"
              href="/practice"
            >
              Birinchi testni boshlash
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl gap-2 hover:border-slate-700 transition"
              >
                <div>
                  <span className="text-xs text-emerald-400 font-semibold uppercase">Unit {session.unit_number}</span>
                  <p className="text-sm font-medium text-slate-200">{session.test_type}</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6 text-sm">
                  <span className="text-slate-400">
                    {session.correct_answers}/{session.total_questions} to‘g‘ri
                  </span>
                  <span className="font-bold text-emerald-400">{session.accuracy_rate}%</span>
                  <span className="text-xs text-slate-500">
                    {session.completed_at ? new Date(session.completed_at).toLocaleDateString() : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
