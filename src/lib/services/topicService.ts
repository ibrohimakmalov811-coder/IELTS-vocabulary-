import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { IELTS_TOPICS, getWordsForTopic } from "@/data/topicsData";
import { IELTSTopic, WordItem } from "@/types/vocabulary";

export async function getIELTSTopics(): Promise<IELTSTopic[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("topics")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((t: any) => ({
          id: t.id,
          slug: t.slug,
          titleEn: t.title_en,
          titleUz: t.title_uz,
          icon: t.icon,
          descriptionEn: t.description_en || "",
          descriptionUz: t.description_uz || "",
          speakingPrompt: t.speaking_prompt || "",
          writingPrompt: t.writing_prompt || "",
          wordCount: getWordsForTopic(t.slug).length,
        }));
      }
    } catch (e) {
      console.warn("Supabase topics fallback:", e);
    }
  }

  return IELTS_TOPICS;
}

export function getTopicDetails(slug: string): { topic: IELTSTopic | undefined; words: WordItem[] } {
  const topic = IELTS_TOPICS.find((t) => t.slug === slug);
  const words = getWordsForTopic(slug);
  return { topic, words };
}
