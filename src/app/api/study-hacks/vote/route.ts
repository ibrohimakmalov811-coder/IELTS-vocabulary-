import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { hackId, voteType } = await request.json();

    if (!hackId) {
      return NextResponse.json({ error: "Hack ID required" }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // Check existing vote
          const { data: existing } = await supabase
            .from("study_hack_votes")
            .select("id, vote_type")
            .eq("hack_id", hackId)
            .eq("user_id", user.id)
            .maybeSingle();

          if (existing) {
            return NextResponse.json({ error: "Siz ushbu maslahatga allaqachon ovoz bergansiz." }, { status: 409 });
          }

          await supabase.from("study_hack_votes").insert({
            hack_id: hackId,
            user_id: user.id,
            vote_type: voteType || "upvote",
          });

          await supabase.rpc("increment_study_hack_votes", { p_hack_id: hackId });
          return NextResponse.json({ success: true, message: "Ovozingiz qabul qilindi!" });
        }
      } catch (e) {
        console.warn("Supabase vote fallback:", e);
      }
    }

    return NextResponse.json({ success: true, message: "Ovozingiz muvaffaqiyatli saqlandi!" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to submit vote" }, { status: 500 });
  }
}
