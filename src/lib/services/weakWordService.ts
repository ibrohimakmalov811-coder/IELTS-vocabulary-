import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { sampleWords } from "@/data/vocabularyData";
import { WeakWordRecord, WordItem } from "@/types/vocabulary";

const CURATED_DIFFICULT_WORD_IDS = ["w1", "w6", "w11", "w19", "w25", "w34", "w45", "w58"];

export async function getUserWeakWords(userId?: string): Promise<{
  weakWords: WeakWordRecord[];
  isPersonalized: boolean;
}> {
  let mistakeMap: Record<string, { mistakes: number; seen: number; lastDate: string }> = {};

  if (isSupabaseConfigured() && userId) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("user_word_progress")
        .select("word_id, times_seen, times_incorrect, last_reviewed_at")
        .eq("user_id", userId)
        .gt("times_incorrect", 0)
        .order("times_incorrect", { ascending: false });

      if (!error && data && data.length > 0) {
        data.forEach((d: any) => {
          mistakeMap[d.word_id] = {
            mistakes: d.times_incorrect,
            seen: d.times_seen || d.times_incorrect,
            lastDate: d.last_reviewed_at || new Date().toISOString(),
          };
        });
      }
    } catch (e) {
      console.warn("Supabase weak words fallback:", e);
    }
  }

  // Local storage fallback for mistakes
  if (typeof window !== "undefined" && Object.keys(mistakeMap).length === 0) {
    try {
      const stored = localStorage.getItem("ielts_weak_words_log");
      if (stored) {
        mistakeMap = JSON.parse(stored);
      }
    } catch (e) {}
  }

  const hasPersonalData = Object.keys(mistakeMap).length > 0;

  // If user has personal mistake data, rank them
  if (hasPersonalData) {
    const list: WeakWordRecord[] = [];
    for (const [wId, stats] of Object.entries(mistakeMap)) {
      const matched = sampleWords.find((w) => w.id === wId);
      if (matched) {
        const accuracyPct = Math.max(
          0,
          Math.round(((stats.seen - stats.mistakes) / Math.max(1, stats.seen)) * 100)
        );
        const difficultyScore = stats.mistakes * 10 + (100 - accuracyPct);

        list.push({
          wordId: matched.id,
          word: matched.word,
          phonetic: matched.phonetic,
          translationUz: matched.translations.uzbek,
          definition: matched.definition,
          example: matched.example,
          unit: matched.unit,
          mistakeCount: stats.mistakes,
          timesSeen: stats.seen,
          accuracyPct,
          lastMistakeDate: stats.lastDate,
          difficultyScore,
        });
      }
    }

    list.sort((a, b) => b.difficultyScore - a.difficultyScore);
    return { weakWords: list, isPersonalized: true };
  }

  // Fallback: Curated challenging words with clear indicator
  const starterWords: WeakWordRecord[] = CURATED_DIFFICULT_WORD_IDS.map((id) => {
    const w = sampleWords.find((item) => item.id === id) || sampleWords[0];
    return {
      wordId: w.id,
      word: w.word,
      phonetic: w.phonetic,
      translationUz: w.translations.uzbek,
      definition: w.definition,
      example: w.example,
      unit: w.unit,
      mistakeCount: 0,
      timesSeen: 0,
      accuracyPct: 0,
      lastMistakeDate: new Date().toISOString(),
      difficultyScore: 50,
    };
  });

  return { weakWords: starterWords, isPersonalized: false };
}

export function logWordMistake(wordId: string): void {
  if (typeof window === "undefined") return;
  try {
    const stored = localStorage.getItem("ielts_weak_words_log");
    const map: Record<string, { mistakes: number; seen: number; lastDate: string }> = stored
      ? JSON.parse(stored)
      : {};

    if (!map[wordId]) {
      map[wordId] = { mistakes: 1, seen: 1, lastDate: new Date().toISOString() };
    } else {
      map[wordId].mistakes += 1;
      map[wordId].seen += 1;
      map[wordId].lastDate = new Date().toISOString();
    }

    localStorage.setItem("ielts_weak_words_log", JSON.stringify(map));
  } catch (e) {}
}

export function logWordSuccess(wordId: string): void {
  if (typeof window === "undefined") return;
  try {
    const stored = localStorage.getItem("ielts_weak_words_log");
    const map: Record<string, { mistakes: number; seen: number; lastDate: string }> = stored
      ? JSON.parse(stored)
      : {};

    if (map[wordId]) {
      map[wordId].seen += 1;
      if (map[wordId].mistakes > 0) {
        map[wordId].mistakes = Math.max(0, map[wordId].mistakes - 1);
      }
      localStorage.setItem("ielts_weak_words_log", JSON.stringify(map));
    }
  } catch (e) {}
}
