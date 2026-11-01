import { NextResponse } from "next/server";
import { sampleWords } from "@/data/vocabularyData";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase().trim() || "";
    const unitParam = searchParams.get("unit");
    const posParam = searchParams.get("pos");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "24", 10)));

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        let query = supabase
          .from("vocabulary_words")
          .select("*, vocabulary_units(unit_number, title_en, title_uz)", { count: "exact" })
          .eq("is_active", true);

        if (unitParam && unitParam !== "all") {
          query = query.eq("unit_id", parseInt(unitParam, 10));
        }

        if (posParam && posParam !== "all") {
          query = query.eq("part_of_speech", posParam);
        }

        if (search) {
          query = query.or(`word.ilike.%${search}%,translation_uz.ilike.%${search}%,definition_en.ilike.%${search}%`);
        }

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data, count, error } = await query
          .order("display_order", { ascending: true })
          .range(from, to);

        if (!error && data) {
          return NextResponse.json({
            words: data,
            total: count || 0,
            page,
            limit,
            totalPages: Math.ceil((count || 0) / limit),
          });
        }
      } catch (e) {
        console.warn("Supabase vocabulary API fallback:", e);
      }
    }

    // High performance in-memory fallback using verified 301 words
    let filtered = sampleWords;

    if (unitParam && unitParam !== "all") {
      const uNum = parseInt(unitParam, 10);
      filtered = filtered.filter((w) => w.unit === uNum);
    }

    if (posParam && posParam !== "all") {
      filtered = filtered.filter((w) => w.partOfSpeech === posParam);
    }

    if (search) {
      filtered = filtered.filter(
        (w) =>
          w.word.toLowerCase().includes(search) ||
          w.translations.uzbek.toLowerCase().includes(search) ||
          w.definition.toLowerCase().includes(search)
      );
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginatedWords = filtered.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      words: paginatedWords,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch vocabulary" }, { status: 500 });
  }
}
