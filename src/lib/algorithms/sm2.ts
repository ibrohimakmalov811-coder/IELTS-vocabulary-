/**
 * SuperMemo-2 (SM-2) Spaced Repetition Scheduling Algorithm
 * Used for optimizing memory retention intervals for IELTS vocabulary.
 */

export interface SM2Input {
  quality: number; // 0 to 5 (0: complete blackout, 3: pass with effort, 5: perfect instant recall)
  repetitionNumber: number; // consecutive correct reviews
  easeFactor: number; // difficulty multiplier (min 1.3, default 2.5)
  intervalDays: number; // previous interval in days
}

export interface SM2Output {
  repetitionNumber: number;
  easeFactor: number;
  intervalDays: number;
  nextReviewDate: Date;
  status: "new" | "learning" | "reviewing" | "mastered";
}

export function calculateSM2(input: SM2Input): SM2Output {
  const { quality, repetitionNumber, easeFactor, intervalDays } = input;

  // Clamp quality between 0 and 5
  const q = Math.max(0, Math.min(5, quality));

  let nextRep = repetitionNumber;
  let nextInterval = 1;
  let nextEase = easeFactor;

  if (q >= 3) {
    // Correct response
    if (nextRep === 0) {
      nextInterval = 1;
    } else if (nextRep === 1) {
      nextInterval = 6;
    } else {
      nextInterval = Math.round(intervalDays * nextEase);
    }
    nextRep += 1;
  } else {
    // Incorrect response, reset streak
    nextRep = 0;
    nextInterval = 1;
  }

  // Update ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  nextEase = nextEase + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (nextEase < 1.3) {
    nextEase = 1.3;
  }
  // Round to 2 decimal places
  nextEase = Math.round(nextEase * 100) / 100;

  // Determine learning status
  let status: "new" | "learning" | "reviewing" | "mastered" = "learning";
  if (nextRep >= 5 || nextInterval >= 21) {
    status = "mastered";
  } else if (nextRep >= 1) {
    status = "reviewing";
  } else {
    status = "learning";
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + nextInterval);

  return {
    repetitionNumber: nextRep,
    easeFactor: nextEase,
    intervalDays: nextInterval,
    nextReviewDate,
    status,
  };
}

/**
 * Convenience helper to map boolean quiz outcome to SM-2 rating
 */
export function qualityFromQuiz(isCorrect: boolean, responseTimeMs?: number, hadHint?: boolean): number {
  if (!isCorrect) return 1;
  if (hadHint) return 3;
  if (responseTimeMs && responseTimeMs < 3000) return 5;
  return 4;
}
