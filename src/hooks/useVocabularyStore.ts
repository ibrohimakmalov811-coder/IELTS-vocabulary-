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
}

const DEFAULT_DEMO_ACCOUNT: StoredUserAccount = {
  id: "user_demo",
  name: "Ibrohim Akmalov",
  email: "ibrohim@ielts.uz",
  password: "ielts2026",
  targetBand: "Band 8.5",
  avatarColor: "from-blue-600 to-indigo-600",
  joinedAt: "2026-10-10",
  totalCoins: 350,
  streakDays: 7,
  learnedWordIds: ["w1", "w2", "w3", "w4", "w5", "w6", "w7", "w8", "w9", "w10", "w11", "w12", "w13", "w14", "w15"],
  favoriteWordIds: ["w1", "w7", "w14"],
  studyTimeSeconds: 2700,
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
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(DEFAULT_DEMO_ACCOUNT);
  const [learnedWordIds, setLearnedWordIds] = useState<string[]>(DEFAULT_DEMO_ACCOUNT.learnedWordIds);
  const [favoriteWordIds, setFavoriteWordIds] = useState<string[]>(DEFAULT_DEMO_ACCOUNT.favoriteWordIds);
  const [recentlyStudiedIds, setRecentlyStudiedIds] = useState<string[]>(["w1", "w2", "w3"]);
  const [stats, setStats] = useState<UserStats>({
    ...initialUserStats,
    userName: DEFAULT_DEMO_ACCOUNT.name,
    totalCoins: DEFAULT_DEMO_ACCOUNT.totalCoins,
    streakDays: DEFAULT_DEMO_ACCOUNT.streakDays,
  });
  const [testHistory, setTestHistory] = useState<TestResultSession[]>(INITIAL_TEST_SESSIONS);
  const [studyTimeSeconds, setStudyTimeSeconds] = useState<number>(DEFAULT_DEMO_ACCOUNT.studyTimeSeconds);
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
          const userObj = JSON.parse(storedUser);
          setCurrentUser(userObj);
          if (userObj.name) {
            setStats((prev) => ({ ...prev, userName: userObj.name }));
          }
        } catch (e) {
          setCurrentUser(DEFAULT_DEMO_ACCOUNT);
        }
      } else {
        localStorage.setItem("ielts_current_user", JSON.stringify(DEFAULT_DEMO_ACCOUNT));
      }

      // 3. Learned Words
      const storedLearned = localStorage.getItem("ielts_learned_words");
      if (storedLearned) {
        setLearnedWordIds(JSON.parse(storedLearned));
      }

      // 4. Favorite Words
      const storedFavorites = localStorage.getItem("ielts_favorite_words");
      if (storedFavorites) {
        setFavoriteWordIds(JSON.parse(storedFavorites));
      }

      // 5. Recently Studied
      const storedRecent = localStorage.getItem("ielts_recent_words");
      if (storedRecent) {
        setRecentlyStudiedIds(JSON.parse(storedRecent));
      }

      // 6. Test History
      const storedHistory = localStorage.getItem("ielts_test_history");
      if (storedHistory) {
        try {
          setTestHistory(JSON.parse(storedHistory));
        } catch (e) {}
      } else {
        localStorage.setItem("ielts_test_history", JSON.stringify(INITIAL_TEST_SESSIONS));
      }

      // 7. Study Time
      const storedTime = localStorage.getItem("ielts_study_time_seconds");
      if (storedTime) {
        setStudyTimeSeconds(parseInt(storedTime, 10) || 2700);
      }

      // 8. Stats
      const storedStats = localStorage.getItem("ielts_user_stats");
      if (storedStats) {
        setStats(JSON.parse(storedStats));
      }

      // 9. Accent
      const storedAccent = localStorage.getItem("ielts_accent") as "US" | "UK";
      if (storedAccent === "US" || storedAccent === "UK") {
        setAccentState(storedAccent);
      }

      // 10. Dark Mode
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
          localStorage.setItem("ielts_users_db", JSON.stringify(users));
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
    toggleUserFavorite(currentUser?.id, wordId).catch(() => {});

    setFavoriteWordIds((prev) => {
      const updated = prev.includes(wordId) ? prev.filter((id) => id !== wordId) : [...prev, wordId];
      try {
        localStorage.setItem("ielts_favorite_words", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, [currentUser?.id]);

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
      submitQuizAttempt(currentUser?.id, {
        quizType: session.mode,
        unitId: session.unit,
        totalQuestions: session.totalQuestions,
        correctAnswers: session.correctAnswers,
        durationSeconds: session.timeSpentSeconds,
        answers: [],
      }).catch(() => {});

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
    [currentUser?.id]
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

      // Create new student account
      const newAccount: StoredUserAccount = {
        id: "user_" + Date.now(),
        name: name.trim(),
        email: cleanEmail,
        password: password,
        targetBand: targetBand || "Band 7.5",
        avatarColor: "from-teal-500 to-sky-600",
        joinedAt: new Date().toISOString().split("T")[0],
        totalCoins: 240,
        streakDays: 1,
        learnedWordIds: ["w1", "w2", "w3", "w4", "w5"],
        favoriteWordIds: ["w1"],
        studyTimeSeconds: 60,
      };

      usersDb.push(newAccount);
      try {
        localStorage.setItem("ielts_users_db", JSON.stringify(usersDb));
        localStorage.setItem("ielts_current_user", JSON.stringify(newAccount));
        localStorage.setItem("ielts_learned_words", JSON.stringify(newAccount.learnedWordIds));
        localStorage.setItem("ielts_favorite_words", JSON.stringify(newAccount.favoriteWordIds));
        localStorage.setItem("ielts_study_time_seconds", String(newAccount.studyTimeSeconds));
      } catch (e) {}

      // Update state
      setCurrentUser(newAccount);
      setLearnedWordIds(newAccount.learnedWordIds);
      setFavoriteWordIds(newAccount.favoriteWordIds);
      setStudyTimeSeconds(newAccount.studyTimeSeconds);
      setStats((prev) => ({
        ...prev,
        userName: newAccount.name,
        totalCoins: newAccount.totalCoins,
        streakDays: newAccount.streakDays,
        wordsMastered: newAccount.learnedWordIds.length,
      }));

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
      const userLearned = matchedUser.learnedWordIds || ["w1", "w2", "w3", "w4", "w5"];
      const userFavs = matchedUser.favoriteWordIds || ["w1"];
      const userCoins = matchedUser.totalCoins ?? 240;
      const userStreak = matchedUser.streakDays ?? 1;
      const userTime = matchedUser.studyTimeSeconds ?? 120;

      setCurrentUser(matchedUser);
      setLearnedWordIds(userLearned);
      setFavoriteWordIds(userFavs);
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
    try {
      localStorage.removeItem("ielts_current_user");
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
