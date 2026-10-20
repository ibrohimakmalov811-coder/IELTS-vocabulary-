import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = registerSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password, targetBand } = validated.data;

    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
            target_band: targetBand,
          },
        },
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        user: {
          id: data.user?.id,
          email: data.user?.email,
          name,
          targetBand,
        },
      });
    }

    // Local/Offline simulated success
    return NextResponse.json({
      success: true,
      user: {
        id: "usr_" + Date.now(),
        email,
        name,
        targetBand,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Registration failed" },
      { status: 500 }
    );
  }
}
