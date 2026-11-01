import { NextResponse } from "next/server";
import { getUserMissions, claimMissionReward } from "@/lib/services/missionService";
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

    const missions = await getUserMissions(userId);
    return NextResponse.json({ missions });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch missions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { missionId } = await request.json();
    if (!missionId) {
      return NextResponse.json({ error: "Mission ID required" }, { status: 400 });
    }

    let userId: string | undefined;
    if (isSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) userId = user.id;
      } catch (e) {}
    }

    const result = await claimMissionReward(missionId, userId);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Cannot claim reward" }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to claim reward" }, { status: 500 });
  }
}
