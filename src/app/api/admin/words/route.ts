import { NextResponse } from "next/server";
import { wordAdminSchema } from "@/lib/validations/vocabulary";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

async function verifyAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "admin";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = wordAdminSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation error", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      const isAdmin = await verifyAdmin(supabase);

      if (!isAdmin) {
        return NextResponse.json({ error: "Forbidden: Admin role required" }, { status: 403 });
      }

      const wordData = validated.data;
      const wordId = wordData.id || "w" + Date.now();
      const normalized = wordData.word.toLowerCase().trim();

      const { data, error } = await supabase
        .from("vocabulary_words")
        .upsert({
          id: wordId,
          word: wordData.word,
          normalized_word: normalized,
          unit_id: wordData.unit_id,
          part_of_speech: wordData.part_of_speech,
          ipa_us: wordData.ipa_us,
          ipa_uk: wordData.ipa_uk,
          definition_en: wordData.definition_en,
          definition_uz: wordData.definition_uz,
          translation_uz: wordData.translation_uz,
          translation_ru: wordData.translation_ru,
          example_sentence_en: wordData.example_sentence_en,
          example_translation_uz: wordData.example_translation_uz,
          synonyms: wordData.synonyms,
          collocations: wordData.collocations,
          difficulty_level: wordData.difficulty_level,
          is_published: wordData.is_published,
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ success: true, message: "Word saved (offline mode)" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
