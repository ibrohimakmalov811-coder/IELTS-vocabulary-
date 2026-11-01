import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { UserSentenceRecord } from "@/types/vocabulary";

export interface CreateSentencePayload {
  wordId: string;
  word: string;
  sentenceEn: string;
  translationUz?: string;
  ieltsContext: "Speaking Part 2/3" | "Writing Task 2" | "General IELTS";
}

export interface SentenceEvaluationResult {
  isValid: boolean;
  containsTargetWord: boolean;
  wordCount: number;
  feedback: string;
  contextAppropriate: boolean;
}

export function evaluateSentence(word: string, sentence: string): SentenceEvaluationResult {
  const cleanWord = word.trim().toLowerCase();
  const cleanSentence = sentence.trim();
  const wordsInSentence = cleanSentence.split(/\s+/).filter(Boolean);

  // Check if target word or common morphological variation is present
  const regex = new RegExp(`\\b${cleanWord}(s|ed|ing|ly)?\\b`, "i");
  const containsWord = regex.test(cleanSentence);

  if (!containsWord) {
    return {
      isValid: false,
      containsTargetWord: false,
      wordCount: wordsInSentence.length,
      feedback: `Jumlada "${word}" so'zi qatnashmagan. Iltimos, so'zning o'zini yoki uning grammatik shaklini jumla ichida ishlating.`,
      contextAppropriate: false,
    };
  }

  if (wordsInSentence.length < 5) {
    return {
      isValid: false,
      containsTargetWord: true,
      wordCount: wordsInSentence.length,
      feedback: "Jumla juda qisqa. IELTS darajasiga mos bo'lishi uchun kamida 5-6 ta so'zdan iborat to'liq fikr tuzing.",
      contextAppropriate: false,
    };
  }

  // Academic quality check
  const isGoodLength = wordsInSentence.length >= 8;
  const feedback = isGoodLength
    ? `Ajoyib akademik jumla! "${word}" so'zi tabiiy kontekstda to'g'ri qo'llanilgan.`
    : `Yaxshi jumla! Keyingi safar qo'shimcha bog'lovchilar bilan kengaytirishingiz mumkin.`;

  return {
    isValid: true,
    containsTargetWord: true,
    wordCount: wordsInSentence.length,
    feedback,
    contextAppropriate: true,
  };
}

export async function saveUserSentence(
  userId: string | undefined,
  payload: CreateSentencePayload
): Promise<UserSentenceRecord> {
  const evaluation = evaluateSentence(payload.word, payload.sentenceEn);

  const record: UserSentenceRecord = {
    id: "sent-" + Date.now(),
    userId,
    wordId: payload.wordId,
    word: payload.word,
    sentenceEn: payload.sentenceEn.trim(),
    translationUz: payload.translationUz?.trim(),
    ieltsContext: payload.ieltsContext,
    feedbackNotes: evaluation.feedback,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured() && userId) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("user_sentences")
        .insert({
          user_id: userId,
          word_id: payload.wordId,
          sentence_en: payload.sentenceEn.trim(),
          translation_uz: payload.translationUz?.trim(),
          ielts_context: payload.ieltsContext,
          feedback_notes: evaluation.feedback,
        })
        .select()
        .single();

      if (!error && data) {
        record.id = data.id;
      }
    } catch (e) {
      console.warn("Supabase sentence save fallback:", e);
    }
  }

  // Local storage persistence
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("ielts_user_sentences");
      const list: UserSentenceRecord[] = stored ? JSON.parse(stored) : [];
      localStorage.setItem("ielts_user_sentences", JSON.stringify([record, ...list]));
    } catch (e) {}
  }

  return record;
}

export async function getUserSentences(userId?: string): Promise<UserSentenceRecord[]> {
  if (isSupabaseConfigured() && userId) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("user_sentences")
        .select("*, vocabulary_words(word)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map((d: any) => ({
          id: d.id,
          userId: d.user_id,
          wordId: d.word_id,
          word: d.vocabulary_words?.word || "Word",
          sentenceEn: d.sentence_en,
          translationUz: d.translation_uz,
          ieltsContext: d.ielts_context,
          feedbackNotes: d.feedback_notes,
          createdAt: d.created_at,
        }));
      }
    } catch (e) {
      console.warn("Supabase get sentences fallback:", e);
    }
  }

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("ielts_user_sentences");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
  }

  return [];
}
