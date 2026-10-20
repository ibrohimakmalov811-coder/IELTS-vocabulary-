import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export async function GET() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (currentProfile?.role !== "admin") {
        return NextResponse.json({ error: "Forbidden: Admin role required" }, { status: 403 });
      }

      const { data: users, error } = await supabase
        .from("profiles")
        .select("id, display_name, username, role, target_band, total_coins, streak_days, created_at")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true, users });
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  // Fallback demo users
  return NextResponse.json({
    success: true,
    users: [
      {
        id: "usr_1",
        display_name: "Ibrohim Akmalov",
        role: "admin",
        target_band: "Band 8.5",
        total_coins: 520,
        streak_days: 12,
        created_at: "2026-10-10",
      },
      {
        id: "usr_2",
        display_name: "Azizbek Rahimov",
        role: "student",
        target_band: "Band 7.5",
        total_coins: 180,
        streak_days: 5,
        created_at: "2026-10-15",
      },
    ],
  });
}

export async function PATCH(request: Request) {
  try {
    const { userId, role } = await request.json();

    if (!["student", "moderator", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();

      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user?.id)
        .single();

      if (currentProfile?.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const { error } = await supabase
        .from("profiles")
        .update({ role })
        .eq("id", userId);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
