"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { initialUserStats } from "@/data/vocabularyData";
import { UserStats, UserProfile, TestResultSession } from "@/types/vocabulary";
import { toggleUserFavorite } from "@/lib/services/progressService";
import { submitQuizAttempt } from "@/lib/services/quizService";

interface StoredUserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  targetBand: string;
  avatarColor: string;
  joinedAt: string;
  totalCoins: number;
  streakDays: number;
  learnedWordIds: string[];
  favoriteWordIds: string[];
  studyTimeSeconds: number;
  testHistory?: TestResultSession[];
}

const DEFAULT_DEMO_ACCOUNT: StoredUserAccount = {
  id: "user_demo",
  name: "Ibrohim Akmalov",
  email: "ibrohim@ielts.uz",
  password: "ielts2026",
  targetBand: "Band 8.5",
  avatarColor: "from-blue-600 to-indigo-600",
  joinedAt: "2026-10-10",
  totalCoins: 0,
  streakDays: 0,
  learnedWordIds: [],
  favoriteWordIds: [],
  studyTimeSeconds: 0,
  testHistory: [],
};

export function useVocabularyStore() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [learnedWordIds, setLearnedWordIds] = useState<string[]>([]);
  const [favoriteWordIds, setFavoriteWordIds] = useState<string[]>([]);
  const [recentlyStudiedIds, setRecentlyStudiedIds] = useState<string[]>([]);
  const [stats, setStats] = useState<UserStats>(initialUserStats);
  const [testHistory, setTestHistory] = useState<TestResultSession[]>([]);
  const [studyTimeSeconds, setStudyTimeSeconds] = useState<number>(0);
  const [accent, setAccentState] = useState<"US" | "UK">("US");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Keep references to current state for saving on logout/switch
  const learnedRef = useRef(learnedWordIds);
  learnedRef.current = learnedWordIds;
  const favoritesRef = useRef(favoriteWordIds);
  favoritesRef.current = favoriteWordIds;
  const statsRef = useRef(stats);
  statsRef.current = stats;
  const studyTimeRef = useRef(studyTimeSeconds);
  studyTimeRef.current = studyTimeSeconds;
  const testHistoryRef = useRef(testHistory);
  testHistoryRef.current = testHistory;
  const currentUserRef = useRef(currentUser);
  currentUserRef.current = currentUser;

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      // 1. Initialize Users DB in localStorage if not exists
      const storedUsersDb = localStorage.getItem("ielts_users_db");
      if (!storedUsersDb) {
        localStorage.setItem("ielts_users_db", JSON.stringify([DEFAULT_DEMO_ACCOUNT]));
      }

      // 2. Current User session
      const storedUser = localStorage.getItem("ielts_current_user");
      if (storedUser) {
        try {
          const userObj: StoredUserAccount = JSON.parse(storedUser);
          setCurrentUser(userObj);

          const userLearned = userObj.learnedWordIds || [];
          const userFavs = userObj.favoriteWordIds || [];
          const userTime = userObj.studyTimeSeconds || 0;
          const userCoins = userObj.totalCoins || 0;
          const userStreak = userObj.streakDays || 0;

          setLearnedWordIds(userLearned);
          setFavoriteWordIds(userFavs);
          setStudyTimeSeconds(userTime);

          // User-specific or general test history
          const userHistoryKey = `ielts_test_history_${userObj.id}`;
          const storedUserHistory = localStorage.getItem(userHistoryKey) || localStorage.getItem("ielts_test_history");
          if (storedUserHistory) {
            try {
              setTestHistory(JSON.parse(storedUserHistory));
            } catch (e) {
              setTestHistory(userObj.testHistory || []);
            }
          } else {
            setTestHistory(userObj.testHistory || []);
          }

          setStats({
            ...initialUserStats,
            userName: userObj.name,
            totalCoins: userCoins,
            streakDays: userStreak,
            wordsMastered: userLearned.length,
          });
        } catch (e) {
          setCurrentUser(null);
        }
      } else {
        // Guest user: starts at zero
        setCurrentUser(null);
        setLearnedWordIds([]);
        setFavoriteWordIds([]);
        setTestHistory([]);
        setStudyTimeSeconds(0);
        setStats(initialUserStats);
      }

      // 3. Recently Studied
      const storedRecent = localStorage.getItem("ielts_recent_words");
      if (storedRecent) {
        setRecentlyStudiedIds(JSON.parse(storedRecent));
      }

      // 4. Accent
      const storedAccent = localStorage.getItem("ielts_accent") as "US" | "UK";
      if (storedAccent === "US" || storedAccent === "UK") {
        setAccentState(storedAccent);
      }

      // 5. Dark Mode
      const storedTheme = localStorage.getItem("ielts_dark_mode");
      if (storedTheme === "true") {
        setIsDarkMode(true);
        document.documentElement.classList.add("dark");
      } else if (storedTheme === "false") {
        setIsDarkMode(false);
        document.documentElement.classList.remove("dark");
      } else {
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

  // Real-time Active Study Time Tracker
  // Increments every second while page/tab is actively visible
  useEffect(() => {
    const timer = setInterval(() => {
      if (typeof document !== "undefined" && !document.hidden) {
        setStudyTimeSeconds((prev) => {
          const next = prev + 1;
          // Periodically sync every 5 seconds to localStorage and user DB
          if (next % 5 === 0) {
            try {
              localStorage.setItem("ielts_study_time_seconds", String(next));
              if (currentUserRef.current?.email) {
                const storedUsers = localStorage.getItem("ielts_users_db");
                if (storedUsers) {
                  const users: StoredUserAccount[] = JSON.parse(storedUsers);
                  const idx = users.findIndex(
                    (u) => u.email.toLowerCase() === currentUserRef.current?.email.toLowerCase()
                  );
                  if (idx !== -1) {
                    users[idx].studyTimeSeconds = next;
                    localStorage.setItem("ielts_users_db", JSON.stringify(users));
                  }
                }
              }
            } catch (e) {}
          }
          return next;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Helper to save current user's profile state to Users DB
  const persistUserToDb = useCallback((userEmail: string) => {
    try {
      const storedUsers = localStorage.getItem("ielts_users_db");
      if (storedUsers) {
        const users: StoredUserAccount[] = JSON.parse(storedUsers);
        const idx = users.findIndex((u) => u.email.toLowerCase() === userEmail.toLowerCase());
        if (idx !== -1) {
          users[idx].learnedWordIds = learnedRef.current;
          users[idx].favoriteWordIds = favoritesRef.current;
          users[idx].totalCoins = statsRef.current.totalCoins;
          users[idx].streakDays = statsRef.current.streakDays;
          users[idx].studyTimeSeconds = studyTimeRef.current;
          users[idx].testHistory = testHistoryRef.current;
          localStorage.setItem("ielts_users_db", JSON.stringify(users));

          // Also save user-specific storage keys
          const uid = users[idx].id;
          localStorage.setItem(`ielts_learned_words_${uid}`, JSON.stringify(learnedRef.current));
          localStorage.setItem(`ielts_favorite_words_${uid}`, JSON.stringify(favoritesRef.current));
          localStorage.setItem(`ielts_test_history_${uid}`, JSON.stringify(testHistoryRef.current));
        }
      }
    } catch (e) {}
  }, []);

  // Toggle Learned
  const toggleLearned = useCallback((wordId: string) => {
    setLearnedWordIds((prev) => {
      const isCurrentlyLearned = prev.includes(wordId);
      const updated = isCurrentlyLearned ? prev.filter((id) => id !== wordId) : [...prev, wordId];
      try {
        localStorage.setItem("ielts_learned_words", JSON.stringify(updated));
        if (currentUserRef.current?.id) {
          localStorage.setItem(`ielts_learned_words_${currentUserRef.current.id}`, JSON.stringify(updated));
        }
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
  const toggleFavorite = useCallback(
    (wordId: string) => {
      setFavoriteWordIds((prev) => {
        const isFav = prev.includes(wordId);
        const updated = isFav ? prev.filter((id) => id !== wordId) : [...prev, wordId];
        try {
          localStorage.setItem("ielts_favorite_words", JSON.stringify(updated));
          if (currentUserRef.current?.id) {
            localStorage.setItem(`ielts_favorite_words_${currentUserRef.current.id}`, JSON.stringify(updated));
          }
        } catch (e) {}

        // Backend integration if available
        if (currentUser?.id) {
          toggleUserFavorite(currentUser.id, wordId).catch(() => {});
        }

        return updated;
      });
    },
    [currentUser?.id]
  );

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

      // Server/Database RPC Submission (Anti-Cheat)
      if (currentUser?.id) {
        submitQuizAttempt(currentUser.id, {
          quizType: session.mode,
          unitId: session.unit,
          totalQuestions: session.totalQuestions,
          correctAnswers: session.correctAnswers,
          durationSeconds: session.timeSpentSeconds,
          answers: [],
        }).catch(() => {});
      }

      setTestHistory((prev) => {
        const updated = [newSession, ...prev];
        try {
          localStorage.setItem("ielts_test_history", JSON.stringify(updated));
          if (currentUserRef.current?.id) {
            localStorage.setItem(`ielts_test_history_${currentUserRef.current.id}`, JSON.stringify(updated));
          }
        } catch (e) {}
        return updated;
      });

      // Update total coins and daily stats accurately
      setStats((prev) => {
        const updatedStreak = prev.streakDays === 0 ? 1 : prev.streakDays;
        const updated = {
          ...prev,
          totalCoins: prev.totalCoins + session.coinsEarned,
          streakDays: updatedStreak,
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

      // Auto-save to users DB
      if (currentUserRef.current?.email) {
        setTimeout(() => {
          if (currentUserRef.current?.email) {
            persistUserToDb(currentUserRef.current.email);
          }
        }, 100);
      }
    },
    [currentUser?.id, persistUserToDb]
  );

  // Coins
  const addCoins = useCallback((amount: number) => {
    setStats((prev) => {
      const updated = { ...prev, totalCoins: prev.totalCoins + amount };
      try {
        localStorage.setItem("ielts_user_stats", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  // Shop purchase
  const purchaseItem = useCallback(
    (itemType: "freeze" | "dark" | "crown", cost: number) => {
      if (stats.totalCoins < cost) return false;

      setStats((prev) => {
        const updated = {
          ...prev,
          totalCoins: prev.totalCoins - cost,
          hasStreakFreeze: itemType === "freeze" ? true : prev.hasStreakFreeze,
          isDarkModeUnlocked: itemType === "dark" ? true : prev.isDarkModeUnlocked,
          hasGoldenCrown: itemType === "crown" ? true : prev.hasGoldenCrown,
        };
        try {
          localStorage.setItem("ielts_user_stats", JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });

      return true;
    },
    [stats.totalCoins]
  );

  // Dark Mode Toggle
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("ielts_dark_mode", String(next));
      } catch (e) {}

      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  }, []);

  // Pronunciation Accent
  const setAccent = useCallback((newAccent: "US" | "UK") => {
    setAccentState(newAccent);
    try {
      localStorage.setItem("ielts_accent", newAccent);
    } catch (e) {}
  }, []);

  // Auth: Register New Account
  const register = useCallback(
    async (name: string, email: string, targetBand: string, password?: string) => {
      try {
        if (password) {
          await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, targetBand, password }),
          });
        }
      } catch (e) {}

      // Check local user database
      let usersDb: StoredUserAccount[] = [DEFAULT_DEMO_ACCOUNT];
      try {
        const stored = localStorage.getItem("ielts_users_db");
        if (stored) usersDb = JSON.parse(stored);
      } catch (e) {}

      const cleanEmail = email.trim().toLowerCase();
      const existing = usersDb.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        throw new Error("Ushbu email bilan akkaunt allaqachon mavjud. Iltimos, Kirish (Login) qiling.");
      }

      // Save currently active user progress before switching
      if (currentUserRef.current?.email) {
        persistUserToDb(currentUserRef.current.email);
      }

      // Create new student account initialized at ZERO
      const newAccount: StoredUserAccount = {
        id: "user_" + Date.now(),
        name: name.trim(),
        email: cleanEmail,
        password: password,
        targetBand: targetBand || "Band 7.5",
        avatarColor: "from-teal-500 to-sky-600",
        joinedAt: new Date().toISOString().split("T")[0],
        totalCoins: 0,
        streakDays: 0,
        learnedWordIds: [],
        favoriteWordIds: [],
        studyTimeSeconds: 0,
        testHistory: [],
      };

      usersDb.push(newAccount);
      try {
        localStorage.setItem("ielts_users_db", JSON.stringify(usersDb));
        localStorage.setItem("ielts_current_user", JSON.stringify(newAccount));
        localStorage.setItem("ielts_learned_words", JSON.stringify([]));
        localStorage.setItem("ielts_favorite_words", JSON.stringify([]));
        localStorage.setItem("ielts_study_time_seconds", "0");
        localStorage.setItem("ielts_test_history", JSON.stringify([]));
        localStorage.setItem(`ielts_test_history_${newAccount.id}`, JSON.stringify([]));
      } catch (e) {}

      // Update state to absolute zero
      setCurrentUser(newAccount);
      setLearnedWordIds([]);
      setFavoriteWordIds([]);
      setTestHistory([]);
      setStudyTimeSeconds(0);
      setStats({
        ...initialUserStats,
        userName: newAccount.name,
        totalCoins: 0,
        streakDays: 0,
        wordsMastered: 0,
      });

      return newAccount;
    },
    [persistUserToDb]
  );

  // Auth: Login Existing Account
  const login = useCallback(
    async (email: string, name?: string, password?: string) => {
      try {
        if (password) {
          await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
        }
      } catch (e) {}

      let usersDb: StoredUserAccount[] = [DEFAULT_DEMO_ACCOUNT];
      try {
        const stored = localStorage.getItem("ielts_users_db");
        if (stored) usersDb = JSON.parse(stored);
      } catch (e) {}

      const cleanEmail = email.trim().toLowerCase();
      let matchedUser = usersDb.find((u) => u.email.toLowerCase() === cleanEmail);

      // Check Demo user
      if (!matchedUser && cleanEmail === "ibrohim@ielts.uz") {
        matchedUser = DEFAULT_DEMO_ACCOUNT;
        usersDb.push(DEFAULT_DEMO_ACCOUNT);
        localStorage.setItem("ielts_users_db", JSON.stringify(usersDb));
      }

      if (!matchedUser) {
        throw new Error(
          "Ushbu email manzili bilan akkaunt topilmadi. Iltimos, avval Ro'yxatdan o'tish (Register) bo'limiga kiring."
        );
      }

      // Verify password if set
      if (password && matchedUser.password && matchedUser.password !== password) {
        throw new Error("Kiritilgan parol noto'g'ri. Iltimos, qaytadan tekshirib kiriting.");
      }

      // Save previous user before switching
      if (currentUserRef.current?.email && currentUserRef.current.email !== cleanEmail) {
        persistUserToDb(currentUserRef.current.email);
      }

      // Restore matched user's personal data
      const userLearned = matchedUser.learnedWordIds || [];
      const userFavs = matchedUser.favoriteWordIds || [];
      const userCoins = matchedUser.totalCoins ?? 0;
      const userStreak = matchedUser.streakDays ?? 0;
      const userTime = matchedUser.studyTimeSeconds ?? 0;

      // Restore user-specific test history
      let userHistory = matchedUser.testHistory || [];
      try {
        const storedUserHist = localStorage.getItem(`ielts_test_history_${matchedUser.id}`);
        if (storedUserHist) {
          userHistory = JSON.parse(storedUserHist);
        }
      } catch (e) {}

      setCurrentUser(matchedUser);
      setLearnedWordIds(userLearned);
      setFavoriteWordIds(userFavs);
      setTestHistory(userHistory);
      setStudyTimeSeconds(userTime);
      setStats((prev) => ({
        ...prev,
        userName: matchedUser.name,
        totalCoins: userCoins,
        streakDays: userStreak,
        wordsMastered: userLearned.length,
      }));

      try {
        localStorage.setItem("ielts_current_user", JSON.stringify(matchedUser));
        localStorage.setItem("ielts_learned_words", JSON.stringify(userLearned));
        localStorage.setItem("ielts_favorite_words", JSON.stringify(userFavs));
        localStorage.setItem("ielts_study_time_seconds", String(userTime));
        localStorage.setItem("ielts_test_history", JSON.stringify(userHistory));
        localStorage.setItem(`ielts_test_history_${matchedUser.id}`, JSON.stringify(userHistory));
      } catch (e) {}

      return matchedUser;
    },
    [persistUserToDb]
  );

  // Auth: Logout
  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {}

    // Save current user's progress before logout
    if (currentUserRef.current?.email) {
      persistUserToDb(currentUserRef.current.email);
    }

    setCurrentUser(null);
    setLearnedWordIds([]);
    setFavoriteWordIds([]);
    setTestHistory([]);
    setStudyTimeSeconds(0);
    setStats(initialUserStats);

    try {
      localStorage.removeItem("ielts_current_user");
      localStorage.removeItem("ielts_learned_words");
      localStorage.removeItem("ielts_favorite_words");
      localStorage.removeItem("ielts_study_time_seconds");
      localStorage.removeItem("ielts_test_history");
    } catch (e) {}
  }, [persistUserToDb]);

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
