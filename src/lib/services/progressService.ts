import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { calculateSM2, qualityFromQuiz } from "@/lib/algorithms/sm2";

export interface WordProgressRecord {
  wordId: string;
  status: "new" | "learning" | "reviewing" | "mastered";
  timesSeen: number;
  timesCorrect: number;
  timesIncorrect: number;
  nextReviewAt: string | null;
}

export async function getUserFavorites(userId?: string): Promise<string[]> {
  if (isSupabaseConfigured() && userId) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("user_favorites")
        .select("word_id")
        .eq("user_id", userId);

      if (!error && data) {
        return data.map((d: any) => d.word_id);
      }
    } catch (e) {
      console.warn("Supabase favorites fallback:", e);
    }
  }

  // LocalStorage fallback
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("ielts_favorite_words");
      return stored ? JSON.parse(stored) : ["w1", "w7", "w14"];
    } catch (e) {}
  }
  return ["w1", "w7", "w14"];
}

export async function toggleUserFavorite(userId: string | undefined, wordId: string): Promise<boolean> {
  let isFav = false;

  if (isSupabaseConfigured() && userId) {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("user_favorites")
        .select("id")
        .eq("user_id", userId)
        .eq("word_id", wordId)
        .maybeSingle();

      if (data) {
        await supabase
          .from("user_favorites")
          .delete()
          .eq("user_id", userId)
          .eq("word_id", wordId);
        isFav = false;
      } else {
        await supabase
          .from("user_favorites")
          .insert({ user_id: userId, word_id: wordId });
        isFav = true;
      }
    } catch (e) {
      console.warn("Supabase toggle favorite fallback:", e);
    }
  }

  // Sync to localStorage
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("ielts_favorite_words");
      const list: string[] = stored ? JSON.parse(stored) : [];
      const updated = list.includes(wordId)
        ? list.filter((id) => id !== wordId)
        : [...list, wordId];
      localStorage.setItem("ielts_favorite_words", JSON.stringify(updated));
      isFav = updated.includes(wordId);
    } catch (e) {}
  }

  return isFav;
}

export async function recordWordStudyProgress(
  userId: string | undefined,
  wordId: string,
  isCorrect: boolean,
  responseTimeMs: number = 0
): Promise<WordProgressRecord> {
  const quality = qualityFromQuiz(isCorrect, responseTimeMs);

  let existing = {
    repetitionNumber: 0,
    easeFactor: 2.5,
    intervalDays: 0,
    timesSeen: 0,
    timesCorrect: 0,
    timesIncorrect: 0,
  };

  if (isSupabaseConfigured() && userId) {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("user_word_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("word_id", wordId)
        .maybeSingle();

      if (data) {
        existing = {
          repetitionNumber: data.repetition_number || 0,
          easeFactor: Number(data.ease_factor) || 2.5,
          intervalDays: data.interval_days || 0,
          timesSeen: data.times_seen || 0,
          timesCorrect: data.times_correct || 0,
          timesIncorrect: data.times_incorrect || 0,
        };
      }

      // Compute SM-2
      const sm2 = calculateSM2({
        quality,
        repetitionNumber: existing.repetitionNumber,
        easeFactor: existing.easeFactor,
        intervalDays: existing.intervalDays,
      });

      const updatedProgress = {
        user_id: userId,
        word_id: wordId,
        status: sm2.status,
        times_seen: existing.timesSeen + 1,
        times_correct: existing.timesCorrect + (isCorrect ? 1 : 0),
        times_incorrect: existing.timesIncorrect + (!isCorrect ? 1 : 0),
        repetition_number: sm2.repetitionNumber,
        ease_factor: sm2.easeFactor,
        interval_days: sm2.intervalDays,
        last_reviewed_at: new Date().toISOString(),
        next_review_at: sm2.nextReviewDate.toISOString(),
        last_answer_correct: isCorrect,
      };

      await supabase
        .from("user_word_progress")
        .upsert(updatedProgress, { onConflict: "user_id,word_id" });

      return {
        wordId,
        status: sm2.status,
        timesSeen: updatedProgress.times_seen,
        timesCorrect: updatedProgress.times_correct,
        timesIncorrect: updatedProgress.times_incorrect,
        nextReviewAt: updatedProgress.next_review_at,
      };
    } catch (e) {
      console.warn("Supabase record progress error:", e);
    }
  }

  // Fallback
  return {
    wordId,
    status: isCorrect ? "mastered" : "learning",
    timesSeen: 1,
    timesCorrect: isCorrect ? 1 : 0,
    timesIncorrect: isCorrect ? 0 : 1,
    nextReviewAt: new Date(Date.now() + 86400000).toISOString(),
  };
}
