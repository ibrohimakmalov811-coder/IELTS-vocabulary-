"use client";

import { useState, useEffect, useCallback } from "react";
import { initialUserStats } from "@/data/vocabularyData";
import { UserStats } from "@/types/vocabulary";

export function useVocabularyStore() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [learnedWordIds, setLearnedWordIds] = useState<string[]>([]);
  const [favoriteWordIds, setFavoriteWordIds] = useState<string[]>([]);
  const [recentlyStudiedIds, setRecentlyStudiedIds] = useState<string[]>(["w1", "w2", "w3"]);
  const [stats, setStats] = useState<UserStats>(initialUserStats);
  const [accent, setAccentState] = useState<"US" | "UK">("US");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const storedLearned = localStorage.getItem("ielts_learned_words");
      if (storedLearned) {
        setLearnedWordIds(JSON.parse(storedLearned));
      } else {
        // default initial learned words from Unit 1
        const defaultLearned = ["w1", "w2", "w3", "w4", "w5", "w6", "w7", "w8", "w9", "w10"];
        setLearnedWordIds(defaultLearned);
        localStorage.setItem("ielts_learned_words", JSON.stringify(defaultLearned));
      }

      const storedFavorites = localStorage.getItem("ielts_favorite_words");
      if (storedFavorites) {
        setFavoriteWordIds(JSON.parse(storedFavorites));
      } else {
        const defaultFavs = ["w1", "w7", "w14"];
        setFavoriteWordIds(defaultFavs);
        localStorage.setItem("ielts_favorite_words", JSON.stringify(defaultFavs));
      }

      const storedRecent = localStorage.getItem("ielts_recent_words");
      if (storedRecent) {
        setRecentlyStudiedIds(JSON.parse(storedRecent));
      }

      const storedStats = localStorage.getItem("ielts_user_stats");
      if (storedStats) {
        setStats(JSON.parse(storedStats));
      }

      const storedAccent = localStorage.getItem("ielts_accent") as "US" | "UK";
      if (storedAccent === "US" || storedAccent === "UK") {
        setAccentState(storedAccent);
      }

      const storedTheme = localStorage.getItem("ielts_dark_mode");
      if (storedTheme === "true") {
        setIsDarkMode(true);
        document.documentElement.classList.add("dark");
      }
    } catch (e) {
      console.warn("localStorage is unavailable", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to localStorage
  const toggleLearned = useCallback((wordId: string) => {
    setLearnedWordIds((prev) => {
      const isCurrentlyLearned = prev.includes(wordId);
      const updated = isCurrentlyLearned ? prev.filter((id) => id !== wordId) : [...prev, wordId];
      try {
        localStorage.setItem("ielts_learned_words", JSON.stringify(updated));
      } catch (e) {}

      // Update stats
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

  const toggleFavorite = useCallback((wordId: string) => {
    setFavoriteWordIds((prev) => {
      const updated = prev.includes(wordId) ? prev.filter((id) => id !== wordId) : [...prev, wordId];
      try {
        localStorage.setItem("ielts_favorite_words", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

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

  const setAccent = useCallback((newAccent: "US" | "UK") => {
    setAccentState(newAccent);
    try {
      localStorage.setItem("ielts_accent", newAccent);
    } catch (e) {}
  }, []);

  return {
    isLoaded,
    learnedWordIds,
    favoriteWordIds,
    recentlyStudiedIds,
    stats,
    accent,
    isDarkMode,
    toggleLearned,
    toggleFavorite,
    addRecentlyStudied,
    addCoins,
    purchaseItem,
    toggleDarkMode,
    setAccent,
  };
}
