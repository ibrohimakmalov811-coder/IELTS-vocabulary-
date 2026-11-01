import { NextResponse } from "next/server";
import { saveUserSentence, getUserSentences, evaluateSentence } from "@/lib/services/sentenceService";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    let userId: string | undefined;

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) userId = user.id;
      } catch (e) {}
    }

    const sentences = await getUserSentences(userId);
    return NextResponse.json({ sentences });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch sentences" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { wordId, word, sentenceEn, translationUz, ieltsContext } = body;

    if (!wordId || !word || !sentenceEn) {
      return NextResponse.json({ error: "Word ID, Word, and Sentence are required" }, { status: 400 });
    }

    const evaluation = evaluateSentence(word, sentenceEn);
    if (!evaluation.isValid) {
      return NextResponse.json({ error: evaluation.feedback, evaluation }, { status: 422 });
    }

    let userId: string | undefined;
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) userId = user.id;
      } catch (e) {}
    }

    const saved = await saveUserSentence(userId, {
      wordId,
      word,
      sentenceEn,
      translationUz,
      ieltsContext: ieltsContext || "General IELTS",
    });

    return NextResponse.json({ success: true, sentence: saved, evaluation });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to save sentence" }, { status: 500 });
  }
}
