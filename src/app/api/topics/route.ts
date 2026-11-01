import { NextResponse } from "next/server";
import { IELTS_TOPICS, getWordsForTopic } from "@/data/topicsData";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const topic = IELTS_TOPICS.find((t) => t.slug === slug);
      if (!topic) {
        return NextResponse.json({ error: "Topic not found" }, { status: 404 });
      }
      const words = getWordsForTopic(slug);
      return NextResponse.json({ topic, words });
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
          .from("topics")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true });

        if (!error && data && data.length > 0) {
          const list = data.map((t: any) => ({
            id: t.id,
            slug: t.slug,
            titleEn: t.title_en,
            titleUz: t.title_uz,
            icon: t.icon,
            descriptionEn: t.description_en,
            descriptionUz: t.description_uz,
            speakingPrompt: t.speaking_prompt,
            writingPrompt: t.writing_prompt,
            wordCount: getWordsForTopic(t.slug).length,
          }));
          return NextResponse.json({ topics: list });
        }
      } catch (e) {
        console.warn("Supabase topics fallback:", e);
      }
    }

    return NextResponse.json({ topics: IELTS_TOPICS });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch topics" }, { status: 500 });
  }
}
