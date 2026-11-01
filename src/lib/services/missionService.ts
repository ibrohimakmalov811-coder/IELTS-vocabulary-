import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { DEFAULT_MISSIONS } from "@/data/missionsData";
import { LearningMission, UserStats } from "@/types/vocabulary";

export async function getUserMissions(
  userId: string | undefined,
  stats?: UserStats,
  sentencesCount = 0,
  quizCountToday = 0
): Promise<LearningMission[]> {
  const missions = JSON.parse(JSON.stringify(DEFAULT_MISSIONS)) as LearningMission[];

  // Retrieve claimed mission IDs from localStorage or Supabase
  let claimedIds: string[] = [];
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(`ielts_claimed_missions_${userId || "guest"}`);
      if (stored) claimedIds = JSON.parse(stored);
    } catch (e) {}
  }

  // Update progress based on real student performance
  return missions.map((m) => {
    let current = 0;
    if (m.id === "m_daily_learn") {
      current = Math.min(m.targetCount, stats?.completedTodayWords || 0);
    } else if (m.id === "m_daily_quiz") {
      current = Math.min(m.targetCount, quizCountToday);
    } else if (m.id === "m_daily_sentence") {
      current = Math.min(m.targetCount, sentencesCount);
    } else if (m.id === "m_weekly_master") {
      current = Math.min(m.targetCount, stats?.wordsMastered || 0);
    } else if (m.id === "m_weekly_streak") {
      current = Math.min(m.targetCount, stats?.streakDays || 0);
    }

    const isCompleted = current >= m.targetCount;
    const isClaimed = claimedIds.includes(m.id);

    return {
      ...m,
      currentCount: current,
      isCompleted,
      isClaimed,
    };
  });
}

export async function claimMissionReward(
  missionId: string,
  userId?: string
): Promise<{ success: boolean; coinsAwarded: number; newBalance: number; error?: string }> {
  const mission = DEFAULT_MISSIONS.find((m) => m.id === missionId);
  if (!mission) {
    return { success: false, coinsAwarded: 0, newBalance: 0, error: "Mission not found" };
  }

  // Supabase RPC claim if online
  if (isSupabaseConfigured() && userId) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("claim_mission_reward", {
        p_mission_id: missionId,
      });

      if (!error && data) {
        return {
          success: true,
          coinsAwarded: Number(data.coins_awarded),
          newBalance: Number(data.new_balance),
        };
      }
    } catch (e) {
      console.warn("Supabase claim fallback:", e);
    }
  }

  // Local storage claim
  if (typeof window !== "undefined") {
    try {
      const key = `ielts_claimed_missions_${userId || "guest"}`;
      const stored = localStorage.getItem(key);
      const claimed: string[] = stored ? JSON.parse(stored) : [];

      if (claimed.includes(missionId)) {
        return { success: false, coinsAwarded: 0, newBalance: 0, error: "Already claimed" };
      }

      claimed.push(missionId);
      localStorage.setItem(key, JSON.stringify(claimed));
    } catch (e) {}
  }

  return {
    success: true,
    coinsAwarded: mission.coinReward,
    newBalance: 240 + mission.coinReward,
  };
}
