import { NextResponse } from "next/server";
import { getUserWeakWords } from "@/lib/services/weakWordService";
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

    const result = await getUserWeakWords(userId);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch weak words" }, { status: 500 });
  }
}
