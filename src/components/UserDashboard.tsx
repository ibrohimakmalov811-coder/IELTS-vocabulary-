"use client";

import React from "react";
import { motion } from "framer-motion";
import { Unit, UserStats } from "@/types/vocabulary";
import { 
  Flame, 
  Coins, 
  BookOpen, 
  ChevronRight, 
  Lock, 
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Crown,
  ShieldCheck,
  Award
} from "lucide-react";

interface UserDashboardProps {
  stats: UserStats;
  units: Unit[];
  onStartUnit: (unitId: number) => void;
  onOpenShop: () => void;
  onGoToLanding: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  stats,
  units,
  onStartUnit,
  onOpenShop,
  onGoToLanding,
}) => {
  const goalPercentage = Math.min(
    100,
    Math.round((stats.completedTodayWords / stats.dailyGoalWords) * 100)
  );

  return (
    <div className="min-h-screen bg-background text-slateText-body font-sans pb-20">
      {/* Top Floating App Bar */}
      <header className="sticky top-0 z-30 bg-surface/85 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo / Title */}
          <button
            onClick={onGoToLanding}
            className="flex items-center space-x-3 text-left cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-tealAccent flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <span className="text-white font-extrabold text-base tracking-wider">E5</span>
            </div>
            <div>
              <span className="font-bold text-slateText-heading text-lg block leading-none">
                Essential Vocab
              </span>
              <span className="text-xs text-slateText-muted font-medium">
                Book 5 • Pre-IELTS / IELTS
              </span>
            </div>
          </button>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3">
            {/* Streak Freeze Indicator if active */}
            {stats.hasStreakFreeze && (
              <div 
                className="hidden sm:flex items-center space-x-1 px-3 py-1 bg-tealAccent-light border border-tealAccent/30 rounded-full text-xs font-semibold text-teal-800"
                title="Streak Freeze is Active"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-tealAccent" />
                <span>Protected</span>
              </div>
            )}

            {/* Total Coins Pill */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenShop}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-secondary-light border border-secondary/25 rounded-full cursor-pointer transition-colors shadow-xs"
              title="Click to view Gift Shop"
            >
              <Coins className="w-4 h-4 text-secondary" />
              <span className="text-sm font-bold text-secondary">
                {stats.totalCoins}
              </span>
            </motion.button>

            {/* Gift Shop Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenShop}
              className="p-2 rounded-xl text-slateText-heading hover:bg-gray-100 transition-colors border border-gray-100"
              title="Gift Shop"
            >
              <ShoppingBag className="w-5 h-5 text-slateText-heading" />
            </motion.button>

            {/* User Profile Avatar with optional Golden Crown */}
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-primary-light border-2 border-primary/25 flex items-center justify-center font-bold text-primary text-sm shadow-xs">
                {stats.userName.charAt(0)}
              </div>
              {stats.hasGoldenCrown && (
                <div className="absolute -top-2 -right-1 bg-amber-400 text-white rounded-full p-0.5 shadow-sm">
                  <Crown className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Welcome Section */}
        <section className="space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slateText-heading tracking-tight">
              Welcome back, {stats.userName}! Let&apos;s reach your daily goal.
            </h1>
            <p className="text-sm sm:text-base text-slateText-body max-w-2xl">
              Consistent daily practice is your key to mastering IELTS Book 5 vocabulary. 
              Complete your exercises today to protect your streak!
            </p>
          </motion.div>

          {/* Daily Goal Visual Card */}
          <div className="bg-surface rounded-2xl p-5 border border-gray-100 shadow-soft">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm font-semibold mb-2 gap-2">
              <span className="text-slateText-heading flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-tealAccent" />
                Daily Target: {stats.completedTodayWords} of {stats.dailyGoalWords} words practiced
              </span>
              <span className="text-primary font-bold">{goalPercentage}% Completed</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${goalPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary via-tealAccent to-tealAccent rounded-full"
              />
            </div>
          </div>
        </section>

        {/* 3 Gamification Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Card 1: Day Streak */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 350 }}
            className="bg-surface p-6 rounded-3xl border border-gray-100 shadow-soft flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs uppercase font-bold text-slateText-muted tracking-wider">
                🔥 Day Streak
              </p>
              <h3 className="text-3xl font-extrabold text-slateText-heading">
                {stats.streakDays} <span className="text-sm font-medium text-slateText-body">Days</span>
              </h3>
              <p className="text-xs text-secondary font-semibold">
                {stats.hasStreakFreeze ? "Protected with Freeze" : "Practice today to continue!"}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-secondary-light flex items-center justify-center text-secondary shadow-xs">
              <Flame className="w-7 h-7" />
            </div>
          </motion.div>

          {/* Card 2: Total Coins */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 350 }}
            onClick={onOpenShop}
            className="bg-surface p-6 rounded-3xl border border-gray-100 shadow-soft flex items-center justify-between cursor-pointer"
          >
            <div className="space-y-1">
              <p className="text-xs uppercase font-bold text-slateText-muted tracking-wider">
                🪙 Total Coins
              </p>
              <h3 className="text-3xl font-extrabold text-slateText-heading">
                {stats.totalCoins}
              </h3>
              <p className="text-xs text-primary font-semibold">
                Spend in Gift Shop →
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-secondary-light flex items-center justify-center text-secondary shadow-xs">
              <Coins className="w-7 h-7" />
            </div>
          </motion.div>

          {/* Card 3: Words Mastered */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 350 }}
            className="bg-surface p-6 rounded-3xl border border-gray-100 shadow-soft flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-xs uppercase font-bold text-slateText-muted tracking-wider">
                📚 Words Mastered
              </p>
              <h3 className="text-3xl font-extrabold text-slateText-heading">
                {stats.wordsMastered} <span className="text-sm font-medium text-slateText-body">Words</span>
              </h3>
              <p className="text-xs text-tealAccent font-semibold">
                Pre-IELTS Band Ready
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-tealAccent-light flex items-center justify-center text-teal-800 shadow-xs">
              <BookOpen className="w-7 h-7 text-tealAccent" />
            </div>
          </motion.div>
        </section>

        {/* Section: Your Units */}
        <section className="space-y-5 pt-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <h2 className="text-2xl font-bold text-slateText-heading">
                Your Units (Essential Words Book 5)
              </h2>
              <p className="text-xs sm:text-sm text-slateText-body">
                Step-by-step vocabulary progression designed for Pre-IELTS &amp; IELTS candidates.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-surface border border-gray-200 text-slateText-muted w-fit">
              30 Units in Book 5
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {units.map((unit) => {
              const progressPercent = Math.round(
                (unit.masteredWords / unit.totalWords) * 100
              );
              const isFinished = unit.masteredWords === unit.totalWords;

              return (
                <motion.div
                  key={unit.id}
                  whileHover={!unit.isLocked ? { scale: 1.02 } : {}}
                  className={`bg-surface rounded-3xl border transition-all p-6 flex flex-col justify-between ${
                    unit.isLocked
                      ? "border-gray-200/60 opacity-60 cursor-not-allowed"
                      : "border-gray-100 shadow-soft hover:shadow-card-hover"
                  }`}
                >
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary-light text-primary">
                        {unit.subtitle}
                      </span>
                      {unit.isLocked ? (
                        <span className="flex items-center gap-1 text-xs text-slateText-muted font-medium bg-gray-100 px-2.5 py-1 rounded-full">
                          <Lock className="w-3.5 h-3.5" /> Locked
                        </span>
                      ) : isFinished ? (
                        <span className="flex items-center gap-1 text-xs text-tealAccent font-semibold bg-tealAccent-light px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-primary">
                          {unit.masteredWords}/{unit.totalWords} Words Mastered
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-xl text-slateText-heading">
                        {unit.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slateText-body mt-1 leading-relaxed">
                        {unit.description}
                      </p>
                    </div>

                    {/* Unit Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs text-slateText-muted font-medium">
                        <span>Progress</span>
                        <span>{progressPercent}%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    {unit.isLocked ? (
                      <button
                        disabled
                        className="w-full py-3 px-4 rounded-2xl bg-gray-100 text-slateText-muted font-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                      >
                        <Lock className="w-4 h-4" /> Locked Unit
                      </button>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onStartUnit(unit.id)}
                        className="w-full py-3 px-5 rounded-2xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 shadow-soft transition-all cursor-pointer"
                      >
                        <span>Continue Learning</span>
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};
