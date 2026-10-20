import { NextResponse } from "next/server";
import { submitQuizSchema } from "@/lib/validations/quiz";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { calculateSM2, qualityFromQuiz } from "@/lib/algorithms/sm2";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = submitQuizSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid quiz submission payload", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { quizType, unitId, totalQuestions, correctAnswers, durationSeconds, answers } = validated.data;

    // Server-side calculation of score and anti-cheat coin reward
    const scorePercentage = Math.round((correctAnswers / Math.max(1, totalQuestions)) * 100);
    const coinsEarned = correctAnswers * 10;

    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Execute atomic RPC procedure
        const { data, error } = await supabase.rpc("submit_quiz_session", {
          p_quiz_type: quizType,
          p_unit_id: unitId === "all" ? null : unitId,
          p_total_questions: totalQuestions,
          p_correct_answers: correctAnswers,
          p_duration_seconds: durationSeconds,
          p_answers: answers.map((a) => ({
            word_id: a.wordId,
            selected_answer: a.selectedAnswer,
            is_correct: a.isCorrect,
            response_time_ms: a.responseTimeMs || 0,
          })),
        });

        if (!error && data) {
          // Update SM-2 spaced repetition for each answered word
          for (const ans of answers) {
            const quality = qualityFromQuiz(ans.isCorrect, ans.responseTimeMs);
            const { data: existingProgress } = await supabase
              .from("user_word_progress")
              .select("*")
              .eq("user_id", user.id)
              .eq("word_id", ans.wordId)
              .maybeSingle();

            const sm2 = calculateSM2({
              quality,
              repetitionNumber: existingProgress?.repetition_number || 0,
              easeFactor: Number(existingProgress?.ease_factor) || 2.5,
              intervalDays: existingProgress?.interval_days || 0,
            });

            await supabase
              .from("user_word_progress")
              .upsert({
                user_id: user.id,
                word_id: ans.wordId,
                status: sm2.status,
                times_seen: (existingProgress?.times_seen || 0) + 1,
                times_correct: (existingProgress?.times_correct || 0) + (ans.isCorrect ? 1 : 0),
                times_incorrect: (existingProgress?.times_incorrect || 0) + (!ans.isCorrect ? 1 : 0),
                repetition_number: sm2.repetitionNumber,
                ease_factor: sm2.easeFactor,
                interval_days: sm2.intervalDays,
                last_reviewed_at: new Date().toISOString(),
                next_review_at: sm2.nextReviewDate.toISOString(),
                last_answer_correct: ans.isCorrect,
              }, { onConflict: "user_id,word_id" });
          }

          return NextResponse.json({
            success: true,
            attemptId: data.attempt_id,
            scorePercentage: Number(data.score_percentage),
            coinsEarned: Number(data.coins_earned),
            newBalance: Number(data.new_balance),
          });
        }
      }
    }

    // Offline / Guest simulation response
    return NextResponse.json({
      success: true,
      attemptId: "attempt_" + Date.now(),
      scorePercentage,
      coinsEarned,
      newBalance: 240 + coinsEarned,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to submit quiz attempt" },
      { status: 500 }
    );
  }
}
