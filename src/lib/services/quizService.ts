import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { TestResultSession } from "@/types/vocabulary";

export interface SubmitQuizPayload {
  quizType: "quiz" | "recall" | "cloze" | "flashcards";
  unitId: number | "all";
  totalQuestions: number;
  correctAnswers: number;
  durationSeconds: number;
  answers: Array<{
    wordId: string;
    selectedAnswer: string;
    isCorrect: boolean;
    responseTimeMs?: number;
  }>;
}

export interface QuizSubmissionResponse {
  attemptId: string;
  scorePercentage: number;
  coinsEarned: number;
  newBalance: number;
}

export async function submitQuizAttempt(
  userId: string | undefined,
  payload: SubmitQuizPayload
): Promise<QuizSubmissionResponse> {
  // Anti-cheat: calculate coins on server/service level (10 coins per correct answer)
  const scorePct = Math.round((payload.correctAnswers / Math.max(1, payload.totalQuestions)) * 100);
  const coinsEarned = payload.correctAnswers * 10;

  if (isSupabaseConfigured() && userId) {
    try {
      const supabase = createClient();

      // Call atomic database procedure
      const { data, error } = await supabase.rpc("submit_quiz_session", {
        p_quiz_type: payload.quizType,
        p_unit_id: payload.unitId === "all" ? null : payload.unitId,
        p_total_questions: payload.totalQuestions,
        p_correct_answers: payload.correctAnswers,
        p_duration_seconds: payload.durationSeconds,
        p_answers: payload.answers.map((a) => ({
          word_id: a.wordId,
          selected_answer: a.selectedAnswer,
          is_correct: a.isCorrect,
          response_time_ms: a.responseTimeMs || 0,
        })),
      });

      if (!error && data) {
        return {
          attemptId: data.attempt_id,
          scorePercentage: Number(data.score_percentage),
          coinsEarned: Number(data.coins_earned),
          newBalance: Number(data.new_balance),
        };
      }
    } catch (e) {
      console.warn("Supabase submit quiz error, using fallback:", e);
    }
  }

  // Fallback to local session
  const fallbackSession: TestResultSession = {
    id: "ts-" + Date.now(),
    date: new Date().toISOString(),
    mode: payload.quizType === "flashcards" ? "quiz" : payload.quizType,
    unit: payload.unitId,
    totalQuestions: payload.totalQuestions,
    correctAnswers: payload.correctAnswers,
    accuracy: scorePct,
    timeSpentSeconds: payload.durationSeconds,
    coinsEarned,
  };

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("ielts_test_history");
      const list: TestResultSession[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem("ielts_test_history", JSON.stringify([fallbackSession, ...list]));
    } catch (e) {}
  }

  return {
    attemptId: fallbackSession.id,
    scorePercentage: scorePct,
    coinsEarned,
    newBalance: 240 + coinsEarned,
  };
}

export async function getUserQuizHistory(userId?: string): Promise<TestResultSession[]> {
  if (isSupabaseConfigured() && userId) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("quiz_attempts")
        .select("*")
        .eq("user_id", userId)
        .order("completed_at", { ascending: false })
        .limit(20);

      if (!error && data) {
        return data.map((d: any) => ({
          id: d.id,
          date: d.completed_at,
          mode: d.quiz_type,
          unit: d.unit_id || "all",
          totalQuestions: d.total_questions,
          correctAnswers: d.correct_answers,
          accuracy: Number(d.score_percentage),
          timeSpentSeconds: d.duration_seconds,
          coinsEarned: d.coins_earned,
        }));
      }
    } catch (e) {
      console.warn("Supabase fetch history fallback:", e);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("ielts_test_history");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
  }

  return [];
}
