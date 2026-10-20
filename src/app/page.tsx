"use client";

import React, { useState } from "react";
import { LandingHero } from "@/components/LandingHero";
import { UserDashboard } from "@/components/UserDashboard";
import { WordCardInterface } from "@/components/WordCardInterface";
import { GiftShopModal } from "@/components/GiftShopModal";
import { initialUserStats, sampleUnits, sampleWords } from "@/data/mockVocabulary";

export default function Home() {
  const [stats, setStats] = useState(initialUserStats);
  const [view, setView] = useState<"landing" | "dashboard" | "learning">("dashboard");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isShopOpen, setIsShopOpen] = useState(false);

  // Start learning a unit
  const handleStartUnit = (_unitId: number) => {
    setCurrentWordIndex(0);
    setView("learning");
  };

  // Add coins earned through gamified tasks
  const handleEarnCoins = (amount: number) => {
    setStats((prev) => ({
      ...prev,
      totalCoins: prev.totalCoins + amount,
      completedTodayWords: Math.min(prev.dailyGoalWords, prev.completedTodayWords + 1),
    }));
  };

  // Spend coins in Gift Shop
  const handlePurchase = (item: "freeze" | "dark" | "crown", cost: number) => {
    if (stats.totalCoins >= cost) {
      setStats((prev) => ({
        ...prev,
        totalCoins: prev.totalCoins - cost,
        hasStreakFreeze: item === "freeze" ? true : prev.hasStreakFreeze,
        isDarkModeUnlocked: item === "dark" ? true : prev.isDarkModeUnlocked,
        hasGoldenCrown: item === "crown" ? true : prev.hasGoldenCrown,
      }));
    }
  };

  return (
    <div className={`min-h-screen ${stats.isDarkModeUnlocked ? "dark" : ""}`}>
      {/* View Switcher: Landing, Dashboard, or Word Learning Interface */}
      {view === "landing" && (
        <LandingHero onStart={() => setView("dashboard")} />
      )}

      {view === "dashboard" && (
        <UserDashboard
          stats={stats}
          units={sampleUnits}
          onStartUnit={handleStartUnit}
          onOpenShop={() => setIsShopOpen(true)}
          onGoToLanding={() => setView("landing")}
        />
      )}

      {view === "learning" && (
        <WordCardInterface
          words={sampleWords}
          currentWordIndex={currentWordIndex}
          totalCoins={stats.totalCoins}
          onNextWord={() => {
            if (currentWordIndex < sampleWords.length - 1) {
              setCurrentWordIndex(currentWordIndex + 1);
            }
          }}
          onPrevWord={() => {
            if (currentWordIndex > 0) {
              setCurrentWordIndex(currentWordIndex - 1);
            }
          }}
          onBackToDashboard={() => setView("dashboard")}
          onEarnCoins={handleEarnCoins}
        />
      )}

      {/* Persistent Gift Shop Rewards Modal */}
      <GiftShopModal
        isOpen={isShopOpen}
        totalCoins={stats.totalCoins}
        hasStreakFreeze={stats.hasStreakFreeze}
        isDarkModeUnlocked={stats.isDarkModeUnlocked}
        hasGoldenCrown={stats.hasGoldenCrown}
        onClose={() => setIsShopOpen(false)}
        onPurchase={handlePurchase}
      />
    </div>
  );
}
