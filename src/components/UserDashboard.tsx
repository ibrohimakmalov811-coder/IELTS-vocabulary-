"use client";

import React from "react";
import { motion } from "framer-motion";
import { Unit, UserStats, WordItem } from "@/types/vocabulary";
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
  Award,
  Layers,
  Heart,
  Clock,
  ArrowRight
} from "lucide-react";

interface UserDashboardProps {
  stats: UserStats;
  units: Unit[];
  allWords: WordItem[];
  learnedWordIds: string[];
  favoriteWordIds: string[];
  recentlyStudiedWords: WordItem[];
  onStartUnit: (unitId: number) => void;
  onOpenWordDetails: (word: WordItem) => void;
  onOpenShop: () => void;
  onGoToLibrary: (unitId?: number) => void;
  onGoToFlashcards: () => void;
  onGoToTasks: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  stats,
  units,
  allWords,
  learnedWordIds,
  favoriteWordIds,
  recentlyStudiedWords,
  onStartUnit,
  onOpenWordDetails,
  onOpenShop,
  onGoToLibrary,
  onGoToFlashcards,
  onGoToTasks,
}) => {
  const totalAvailableWords = allWords.length;
  const wordsLearnedCount = learnedWordIds.length;
  const wordsRemainingCount = Math.max(0, totalAvailableWords - wordsLearnedCount);
  const masteryPercentage = Math.round((wordsLearnedCount / totalAvailableWords) * 100);

  const dailyGoalPercent = Math.min(
    100,
    Math.round((stats.completedTodayWords / stats.dailyGoalWords) * 100)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10 font-sans">
      {/* Welcome Banner */}
      <section className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black uppercase tracking-widest text-primary px-2.5 py-0.5 rounded-full bg-primary-light dark:bg-primary/20">
                Essential Words Book 5
              </span>
              <span className="text-xs text-tealAccent font-bold">
                Band 7.5+ Target
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slateText-heading dark:text-white tracking-tight">
              Welcome back, {stats.userName}! Let&apos;s reach your daily goal.
            </h1>
            <p className="text-sm sm:text-base text-slateText-body dark:text-slate-300 mt-1 max-w-2xl">
              Consistent active recall and spaced repetition are your fastest route to IELTS vocabulary mastery.
            </p>
          </div>

          {/* Quick study mode buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onGoToFlashcards}
              className="px-4 py-2.5 rounded-2xl bg-tealAccent-light dark:bg-tealAccent/20 text-teal-900 dark:text-tealAccent border border-tealAccent/30 text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Layers className="w-4 h-4" />
              <span>Flashcards Practice</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onGoToLibrary()}
              className="px-4 py-2.5 rounded-2xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-soft"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse All Library</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Daily Goal Visual Progress Card */}
        <div className="bg-surface dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-slate-800 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm font-bold mb-2.5 gap-2">
            <span className="text-slateText-heading dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-tealAccent" />
              Daily Target: {stats.completedTodayWords} of {stats.dailyGoalWords} words completed today
            </span>
            <span className="text-primary dark:text-tealAccent font-extrabold">
              {dailyGoalPercent}% Daily Goal Reached
            </span>
          </div>
          <div className="w-full h-3 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${dailyGoalPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary via-tealAccent to-tealAccent rounded-full"
            />
          </div>
        </div>
      </section>

      {/* Real Statistics Grid (Section 8 Requirements) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Total Available Vocabulary */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-surface dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-soft flex flex-col justify-between"
        >
          <div className="space-y-1">
            <p className="text-[11px] uppercase font-black text-slateText-muted tracking-wider">
              📚 Available Vocab
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-slateText-heading dark:text-white">
              {totalAvailableWords}
            </h3>
            <p className="text-xs text-primary font-semibold">15 Units Loaded</p>
          </div>
          <div className="pt-3">
            <span className="text-[11px] text-slateText-muted">Official Book 5 Core</span>
          </div>
        </motion.div>

        {/* Metric 2: Words Learned & Percentage */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-surface dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-soft flex flex-col justify-between"
        >
          <div className="space-y-1">
            <p className="text-[11px] uppercase font-black text-tealAccent tracking-wider">
              ✅ Words Learned
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-slateText-heading dark:text-white">
              {wordsLearnedCount} <span className="text-xs text-slateText-muted font-bold">({masteryPercentage}%)</span>
            </h3>
            <p className="text-xs text-tealAccent font-semibold">
              {wordsRemainingCount} words remaining
            </p>
          </div>
          <div className="w-full h-1.5 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden mt-3">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${masteryPercentage}%` }}
            />
          </div>
        </motion.div>

        {/* Metric 3: Day Streak */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-surface dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-soft flex flex-col justify-between"
        >
          <div className="space-y-1">
            <p className="text-[11px] uppercase font-black text-secondary tracking-wider">
              🔥 Day Streak
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-slateText-heading dark:text-white">
              {stats.streakDays} <span className="text-xs text-slateText-muted font-bold">Days</span>
            </h3>
            <p className="text-xs text-secondary font-semibold">
              {stats.hasStreakFreeze ? "Protected with Freeze" : "Keep the streak going!"}
            </p>
          </div>
          <div className="pt-3 flex items-center justify-between">
            <span className="text-[11px] text-slateText-muted">Consecutive study</span>
            <Flame className="w-4 h-4 text-secondary" />
          </div>
        </motion.div>

        {/* Metric 4: Total Coins */}
        <motion.div
          whileHover={{ y: -2 }}
          onClick={onOpenShop}
          className="bg-surface dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-soft flex flex-col justify-between cursor-pointer group"
        >
          <div className="space-y-1">
            <p className="text-[11px] uppercase font-black text-amber-500 tracking-wider">
              🪙 Total Coins
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-slateText-heading dark:text-white group-hover:text-amber-500 transition-colors">
              {stats.totalCoins}
            </h3>
            <p className="text-xs text-primary font-semibold">
              Spend in Gift Shop →
            </p>
          </div>
          <div className="pt-3 flex items-center justify-between">
            <span className="text-[11px] text-slateText-muted">
              {favoriteWordIds.length} Saved Favorites
            </span>
            <Coins className="w-4 h-4 text-secondary" />
          </div>
        </motion.div>
      </section>

      {/* Recently Studied Words Carousel/Chips */}
      {recentlyStudiedWords.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-slateText-heading dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>Recently Studied Words</span>
            </h2>
            <button
              onClick={() => onGoToLibrary()}
              className="text-xs font-bold text-primary dark:text-tealAccent hover:underline cursor-pointer"
            >
              View in Library →
            </button>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {recentlyStudiedWords.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onOpenWordDetails(item)}
                className="px-4 py-2.5 rounded-2xl bg-surface dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-soft cursor-pointer shrink-0 flex items-center gap-2.5"
              >
                <div>
                  <span className="font-extrabold text-sm text-slateText-heading dark:text-white block">
                    {item.word}
                  </span>
                  <span className="text-[11px] text-primary dark:text-tealAccent font-semibold">
                    {item.translations.uzbek}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slateText-muted bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  U{item.unit}
                </span>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Available Units Grid (Section 8 Requirements) */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slateText-heading dark:text-white">
              Your Units (Essential Words Book 5)
            </h2>
            <p className="text-xs sm:text-sm text-slateText-body dark:text-slate-300">
              Each unit contains 20 high-yield IELTS words with native audio, definition, and practice.
            </p>
          </div>

          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-primary-light text-primary dark:bg-primary/20 dark:text-tealAccent w-fit">
            Units 1–15 Active (300 Words)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {units.slice(0, 15).map((unit) => {
            // Count learned words for this unit
            const unitWords = allWords.filter((w) => w.unit === unit.id);
            const unitLearned = unitWords.filter((w) => learnedWordIds.includes(w.id)).length;
            const progressPercent = Math.round((unitLearned / 20) * 100);

            return (
              <motion.div
                key={unit.id}
                whileHover={{ y: -3 }}
                className="bg-surface dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-6 shadow-soft hover:shadow-card-hover flex flex-col justify-between transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-primary-light text-primary dark:bg-primary/20 dark:text-tealAccent">
                      {unit.subtitle}
                    </span>
                    <span className="text-xs font-bold text-slateText-muted">
                      {unitLearned}/20 Mastered
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-xl text-slateText-heading dark:text-white">
                      {unit.title}
                    </h3>
                    <p className="text-xs text-slateText-body dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {unit.description}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between text-[11px] font-bold text-slateText-muted">
                      <span>Progress</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-primary to-tealAccent h-full rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onStartUnit(unit.id)}
                    className="flex-1 py-3 px-4 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-sm flex items-center justify-center gap-2 shadow-soft transition-all cursor-pointer"
                  >
                    <span>Continue Learning</span>
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>

                  <button
                    onClick={() => onGoToLibrary(unit.id)}
                    className="p-3 rounded-2xl border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-slateText-muted hover:text-slateText-heading dark:hover:text-white transition-colors cursor-pointer"
                    title="View word list in library"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Official Curriculum Roadmap (Units 16-30) */}
      <section className="bg-gradient-to-r from-primary-light/40 via-tealAccent-light/20 to-transparent dark:from-slate-900 dark:to-slate-900/60 p-6 sm:p-8 rounded-3xl border border-primary/20 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface dark:bg-slate-800 text-xs font-bold text-primary mb-2 shadow-xs">
              <Award className="w-3.5 h-3.5" />
              <span>Official 4000 Essential Words Book 5 Curriculum</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slateText-heading dark:text-white">
              Units 16 to 30: Roadmap &amp; Expansion
            </h3>
            <p className="text-xs sm:text-sm text-slateText-body dark:text-slate-300 max-w-2xl mt-1">
              Currently, approximately 50% of Book 5 (Units 1–15, 300 words) is fully interactive with audio, 
              translations, and quizzes. Units 16–30 are planned for release in Part 2.
            </p>
          </div>

          <button
            onClick={() => onGoToLibrary()}
            className="px-5 py-3 rounded-2xl bg-surface dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slateText-heading dark:text-white hover:border-primary transition-all shrink-0 cursor-pointer shadow-soft"
          >
            Explore 300 Active Words →
          </button>
        </div>
      </section>
    </div>
  );
};
