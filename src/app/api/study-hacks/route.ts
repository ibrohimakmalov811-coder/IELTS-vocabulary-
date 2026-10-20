import { NextResponse } from "next/server";
import { studyHackSchema } from "@/lib/validations/studyHack";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export async function GET() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from("study_hacks")
        .select(`
          id, author_id, title, content, related_word_id, related_unit_id,
          tag, votes_count, status, created_at,
          profiles (display_name)
        `)
        .eq("status", "approved")
        .order("votes_count", { ascending: false });

      if (!error && data) {
        return NextResponse.json({ success: true, data });
      }
    } catch (e: any) {
      console.warn("API GET study hacks error:", e);
    }
  }

  return NextResponse.json({ success: true, data: [] });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = studyHackSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { data, error } = await supabase
        .from("study_hacks")
        .insert({
          author_id: user.id,
          title: validated.data.title,
          content: validated.data.content,
          tag: validated.data.tag,
          related_word_id: validated.data.related_word_id || null,
          related_unit_id: validated.data.related_unit_id || null,
          status: "approved",
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: "hack_" + Date.now(),
        ...validated.data,
        votes_count: 0,
        status: "approved",
        created_at: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to submit study hack" },
      { status: 500 }
    );
  }
}
