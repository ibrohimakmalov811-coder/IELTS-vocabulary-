import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = loginSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid credentials format", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = validated.data;

    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 401 });
      }

      // Fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      return NextResponse.json({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: profile?.display_name || email.split("@")[0],
          role: profile?.role || "student",
          targetBand: profile?.target_band || "Band 7.5",
          totalCoins: profile?.total_coins || 0,
        },
      });
    }

    // Local/Offline simulated login
    return NextResponse.json({
      success: true,
      user: {
        id: "usr_default",
        email,
        name: email.split("@")[0],
        role: "student",
        targetBand: "Band 7.5",
        totalCoins: 240,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Login failed" },
      { status: 500 }
    );
  }
}
