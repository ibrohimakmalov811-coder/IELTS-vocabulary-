import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { sampleWords, sampleUnits } from "@/data/vocabularyData";
import { WordItem, Unit, PartOfSpeech } from "@/types/vocabulary";

export interface GetWordsParams {
  unit?: number | "all";
  search?: string;
  partOfSpeech?: PartOfSpeech | "all";
  page?: number;
  limit?: number;
}

export interface GetWordsResult {
  words: WordItem[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getUnits(): Promise<Unit[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("vocabulary_units")
        .select("*")
        .eq("is_published", true)
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((u: any) => ({
          id: u.id,
          title: u.title,
          subtitle: u.subtitle || "",
          description: u.description || "",
          totalWords: u.total_words || 20,
          masteredWords: 0,
          isLocked: false,
          category: u.category || "Foundation & Academic",
        }));
      }
    } catch (e) {
      console.warn("Supabase fetch units fallback:", e);
    }
  }

  return sampleUnits.slice(0, 15);
}

export async function getWords(params: GetWordsParams = {}): Promise<GetWordsResult> {
  const {
    unit = "all",
    search = "",
    partOfSpeech = "all",
    page = 1,
    limit = 12,
  } = params;

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      let query = supabase
        .from("vocabulary_words")
        .select("*", { count: "exact" })
        .eq("is_published", true);

      if (unit !== "all") {
        query = query.eq("unit_id", unit);
      }

      if (partOfSpeech !== "all") {
        query = query.eq("part_of_speech", partOfSpeech);
      }

      if (search && search.trim()) {
        const q = search.trim();
        query = query.or(`word.ilike.%${q}%,translation_uz.ilike.%${q}%,definition_en.ilike.%${q}%`);
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, count, error } = await query
        .order("display_order", { ascending: true })
        .range(from, to);

      if (!error && data) {
        const words: WordItem[] = data.map((w: any) => ({
          id: w.id,
          word: w.word,
          phonetic: w.ipa_us || w.ipa_uk || "",
          partOfSpeech: w.part_of_speech,
          definition: w.definition_en,
          uzbekDefinition: w.definition_uz || "",
          example: w.example_sentence_en,
          uzbekExample: w.example_translation_uz || "",
          translations: {
            uzbek: w.translation_uz,
            russian: w.translation_ru || "",
          },
          unit: w.unit_id,
          synonyms: w.synonyms || [],
          collocations: w.collocations || [],
          audioText: w.word,
          clozeSentence: w.cloze_sentence || "",
          targetAnswer: w.target_answer || w.word,
        }));

        const total = count || words.length;
        return {
          words,
          total,
          page,
          totalPages: Math.ceil(total / limit),
        };
      }
    } catch (e) {
      console.warn("Supabase fetch words fallback:", e);
    }
  }

  // Robust Local Fallback (guarantees zero-downtime offline functionality)
  let filtered = [...sampleWords];

  if (unit !== "all") {
    filtered = filtered.filter((w) => w.unit === unit);
  }

  if (partOfSpeech !== "all") {
    filtered = filtered.filter((w) => w.partOfSpeech === partOfSpeech);
  }

  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (w) =>
        w.word.toLowerCase().includes(q) ||
        w.translations.uzbek.toLowerCase().includes(q) ||
        w.definition.toLowerCase().includes(q)
    );
  }

  const total = filtered.length;
  const from = (page - 1) * limit;
  const paginatedWords = filtered.slice(from, from + limit);

  return {
    words: paginatedWords,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}
