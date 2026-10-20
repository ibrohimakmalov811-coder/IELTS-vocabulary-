"use client";

import { useState, useEffect, useCallback } from "react";
import { initialUserStats } from "@/data/vocabularyData";
import { UserStats, UserProfile, TestResultSession } from "@/types/vocabulary";

const DEFAULT_USER: UserProfile = {
  id: "user_default",
  name: "Ibrohim Akmalov",
  email: "ibrohim@ielts.uz",
  targetBand: "Band 7.5",
  avatarColor: "from-blue-600 to-indigo-600",
  joinedAt: "2026-10-10",
};

const INITIAL_TEST_SESSIONS: TestResultSession[] = [
  {
    id: "ts-1",
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
    mode: "quiz",
    unit: 1,
    totalQuestions: 10,
    correctAnswers: 9,
    accuracy: 90,
    timeSpentSeconds: 95,
    coinsEarned: 90,
  },
  {
    id: "ts-2",
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    mode: "recall",
    unit: 1,
    totalQuestions: 10,
    correctAnswers: 8,
    accuracy: 80,
    timeSpentSeconds: 120,
    coinsEarned: 80,
  },
  {
    id: "ts-3",
    date: new Date(Date.now() - 1 * 86400000).toISOString(),
    mode: "cloze",
    unit: 2,
    totalQuestions: 10,
    correctAnswers: 10,
    accuracy: 100,
    timeSpentSeconds: 110,
    coinsEarned: 100,
  },
  {
    id: "ts-4",
    date: new Date().toISOString(),
    mode: "quiz",
    unit: 3,
    totalQuestions: 10,
    correctAnswers: 9,
    accuracy: 90,
    timeSpentSeconds: 85,
    coinsEarned: 90,
  },
];

export function useVocabularyStore() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(DEFAULT_USER);
  const [learnedWordIds, setLearnedWordIds] = useState<string[]>([]);
  const [favoriteWordIds, setFavoriteWordIds] = useState<string[]>([]);
  const [recentlyStudiedIds, setRecentlyStudiedIds] = useState<string[]>(["w1", "w2", "w3"]);
  const [stats, setStats] = useState<UserStats>(initialUserStats);
  const [testHistory, setTestHistory] = useState<TestResultSession[]>(INITIAL_TEST_SESSIONS);
  const [studyTimeSeconds, setStudyTimeSeconds] = useState<number>(2100); // ~35 minutes initial
  const [accent, setAccentState] = useState<"US" | "UK">("US");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      // 1. Current User
      const storedUser = localStorage.getItem("ielts_current_user");
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (e) {
          setCurrentUser(DEFAULT_USER);
        }
      } else {
        localStorage.setItem("ielts_current_user", JSON.stringify(DEFAULT_USER));
      }

      // 2. Learned Words
      const storedLearned = localStorage.getItem("ielts_learned_words");
      if (storedLearned) {
        setLearnedWordIds(JSON.parse(storedLearned));
      } else {
        const defaultLearned = ["w1", "w2", "w3", "w4", "w5", "w6", "w7", "w8", "w9", "w10"];
        setLearnedWordIds(defaultLearned);
        localStorage.setItem("ielts_learned_words", JSON.stringify(defaultLearned));
      }

      // 3. Favorite Words
      const storedFavorites = localStorage.getItem("ielts_favorite_words");
      if (storedFavorites) {
        setFavoriteWordIds(JSON.parse(storedFavorites));
      } else {
        const defaultFavs = ["w1", "w7", "w14"];
        setFavoriteWordIds(defaultFavs);
        localStorage.setItem("ielts_favorite_words", JSON.stringify(defaultFavs));
      }

      // 4. Recently Studied
      const storedRecent = localStorage.getItem("ielts_recent_words");
      if (storedRecent) {
        setRecentlyStudiedIds(JSON.parse(storedRecent));
      }

      // 5. Test History
      const storedHistory = localStorage.getItem("ielts_test_history");
      if (storedHistory) {
        try {
          setTestHistory(JSON.parse(storedHistory));
        } catch (e) {
          setTestHistory(INITIAL_TEST_SESSIONS);
        }
      } else {
        localStorage.setItem("ielts_test_history", JSON.stringify(INITIAL_TEST_SESSIONS));
      }

      // 6. Study Time
      const storedTime = localStorage.getItem("ielts_study_time_seconds");
      if (storedTime) {
        setStudyTimeSeconds(parseInt(storedTime, 10) || 2100);
      }

      // 7. Stats
      const storedStats = localStorage.getItem("ielts_user_stats");
      if (storedStats) {
        setStats(JSON.parse(storedStats));
      }

      // 8. Accent
      const storedAccent = localStorage.getItem("ielts_accent") as "US" | "UK";
      if (storedAccent === "US" || storedAccent === "UK") {
        setAccentState(storedAccent);
      }

      // 9. Dark Mode
      const storedTheme = localStorage.getItem("ielts_dark_mode");
      if (storedTheme === "true") {
        setIsDarkMode(true);
        document.documentElement.classList.add("dark");
      } else if (storedTheme === "false") {
        setIsDarkMode(false);
        document.documentElement.classList.remove("dark");
      } else {
        // Check system preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setIsDarkMode(prefersDark);
        if (prefersDark) {
          document.documentElement.classList.add("dark");
        }
      }
    } catch (e) {
      console.warn("localStorage is unavailable", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Time Tracker: increments every 10 seconds while page is open
  useEffect(() => {
    const timer = setInterval(() => {
      setStudyTimeSeconds((prev) => {
        const next = prev + 10;
        try {
          localStorage.setItem("ielts_study_time_seconds", String(next));
        } catch (e) {}
        return next;
      });
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  // Toggle Learned
  const toggleLearned = useCallback((wordId: string) => {
    setLearnedWordIds((prev) => {
      const isCurrentlyLearned = prev.includes(wordId);
      const updated = isCurrentlyLearned ? prev.filter((id) => id !== wordId) : [...prev, wordId];
      try {
        localStorage.setItem("ielts_learned_words", JSON.stringify(updated));
      } catch (e) {}

      setStats((prevStats) => {
        const newStats = {
          ...prevStats,
          wordsMastered: updated.length,
          totalCoins: !isCurrentlyLearned ? prevStats.totalCoins + 5 : prevStats.totalCoins,
          completedTodayWords: !isCurrentlyLearned
            ? Math.min(prevStats.dailyGoalWords, prevStats.completedTodayWords + 1)
            : prevStats.completedTodayWords,
        };
        try {
          localStorage.setItem("ielts_user_stats", JSON.stringify(newStats));
        } catch (e) {}
        return newStats;
      });

      return updated;
    });
  }, []);

  // Toggle Favorite
  const toggleFavorite = useCallback((wordId: string) => {
    setFavoriteWordIds((prev) => {
      const updated = prev.includes(wordId) ? prev.filter((id) => id !== wordId) : [...prev, wordId];
      try {
        localStorage.setItem("ielts_favorite_words", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  // Add Recently Studied
  const addRecentlyStudied = useCallback((wordId: string) => {
    setRecentlyStudiedIds((prev) => {
      const filtered = prev.filter((id) => id !== wordId);
      const updated = [wordId, ...filtered].slice(0, 10);
      try {
        localStorage.setItem("ielts_recent_words", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  // Record a Completed Test Session
  const recordTestSession = useCallback(
    (session: Omit<TestResultSession, "id">) => {
      const newSession: TestResultSession = {
        ...session,
        id: "ts-" + Date.now(),
      };

      setTestHistory((prev) => {
        const updated = [newSession, ...prev];
        try {
          localStorage.setItem("ielts_test_history", JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      // Update total coins and daily stats
      setStats((prev) => {
        const updated = {
          ...prev,
          totalCoins: prev.totalCoins + session.coinsEarned,
          completedTodayWords: Math.min(
            prev.dailyGoalWords,
            prev.completedTodayWords + session.correctAnswers
          ),
        };
        try {
          localStorage.setItem("ielts_user_stats", JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    },
    []
  );

  // Coins
  const addCoins = useCallback((amount: number) => {
    setStats((prev) => {
      const updated = {
        ...prev,
        totalCoins: prev.totalCoins + amount,
        completedTodayWords: Math.min(prev.dailyGoalWords, prev.completedTodayWords + 1),
      };
      try {
        localStorage.setItem("ielts_user_stats", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  // Gift shop purchase
  const purchaseItem = useCallback((item: "freeze" | "dark" | "crown", cost: number) => {
    setStats((prev) => {
      if (prev.totalCoins < cost) return prev;
      const updated = {
        ...prev,
        totalCoins: prev.totalCoins - cost,
        hasStreakFreeze: item === "freeze" ? true : prev.hasStreakFreeze,
        isDarkModeUnlocked: item === "dark" ? true : prev.isDarkModeUnlocked,
        hasGoldenCrown: item === "crown" ? true : prev.hasGoldenCrown,
      };
      try {
        localStorage.setItem("ielts_user_stats", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  // Dark mode toggle
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      try {
        localStorage.setItem("ielts_dark_mode", String(next));
      } catch (e) {}
      return next;
    });
  }, []);

  // Accent Switcher
  const setAccent = useCallback((newAccent: "US" | "UK") => {
    setAccentState(newAccent);
    try {
      localStorage.setItem("ielts_accent", newAccent);
    } catch (e) {}
  }, []);

  // Auth: Login
  const login = useCallback((email: string, name?: string) => {
    const user: UserProfile = {
      id: "user_" + Date.now(),
      name: name || email.split("@")[0],
      email: email,
      targetBand: "Band 7.5",
      avatarColor: "from-sky-500 to-indigo-600",
      joinedAt: new Date().toISOString().split("T")[0],
    };
    setCurrentUser(user);
    try {
      localStorage.setItem("ielts_current_user", JSON.stringify(user));
    } catch (e) {}
    return user;
  }, []);

  // Auth: Register
  const register = useCallback((name: string, email: string, targetBand: string) => {
    const user: UserProfile = {
      id: "user_" + Date.now(),
      name,
      email,
      targetBand: targetBand || "Band 7.5",
      avatarColor: "from-teal-500 to-sky-600",
      joinedAt: new Date().toISOString().split("T")[0],
    };
    setCurrentUser(user);
    try {
      localStorage.setItem("ielts_current_user", JSON.stringify(user));
    } catch (e) {}
    return user;
  }, []);

  // Auth: Logout
  const logout = useCallback(() => {
    setCurrentUser(null);
    try {
      localStorage.removeItem("ielts_current_user");
    } catch (e) {}
  }, []);

  return {
    isLoaded,
    currentUser,
    learnedWordIds,
    favoriteWordIds,
    recentlyStudiedIds,
    stats,
    testHistory,
    studyTimeSeconds,
    accent,
    isDarkMode,
    toggleLearned,
    toggleFavorite,
    addRecentlyStudied,
    recordTestSession,
    addCoins,
    purchaseItem,
    toggleDarkMode,
    setAccent,
    login,
    register,
    logout,
  };
}
