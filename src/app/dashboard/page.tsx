"use client";

import React, { useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useVocab } from "@/components/layout/ClientLayout";
import { sampleWords, sampleUnits } from "@/data/vocabularyData";
import { UserDashboard } from "@/components/UserDashboard";
import { WordItem } from "@/types/vocabulary";
import {
  Trophy,
  Award,
  Sparkles,
  Heart,
  Volume2,
  Maximize2,
  ArrowRight,
  TrendingUp,
  Target,
  Bookmark,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

function DashboardContent() {
  const router = useRouter();
  const { store, openWordDetails, openShop, playAudio, activePlayingWord } = useVocab();

  // Resolve recently studied words from IDs
  const recentlyStudiedWords = useMemo(() => {
    return store.recentlyStudiedIds
      .map((id) => sampleWords.find((w) => w.id === id))
      .filter((w): w is WordItem => w !== undefined);
  }, [store.recentlyStudiedIds]);

  // Resolve favorite saved words
  const favoriteWords = useMemo(() => {
    return store.favoriteWordIds
      .map((id) => sampleWords.find((w) => w.id === id))
      .filter((w): w is WordItem => w !== undefined);
  }, [store.favoriteWordIds]);

  // Projected IELTS Band Calculation
  const masteredCount = store.learnedWordIds.length;
  const projectedBand = useMemo(() => {
    if (masteredCount >= 250) return { band: "Band 8.5", label: "Very High / Native-like Academic User", color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" };
    if (masteredCount >= 180) return { band: "Band 8.0", label: "Fluent Academic Discourse", color: "text-sky-500", bg: "bg-sky-500/10 border-sky-500/20" };
    if (masteredCount >= 100) return { band: "Band 7.5", label: "Good User with Lexical Flexibility", color: "text-indigo-500", bg: "bg-indigo-500/10 border-indigo-500/20" };
    if (masteredCount >= 40) return { band: "Band 6.5", label: "Competent User (Common Academic Core)", color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" };
    return { band: "Band 5.5", label: "Modest Foundation (Building Academic Base)", color: "text-slate-500", bg: "bg-slate-500/10 border-slate-500/20" };
  }, [masteredCount]);

  return (
    <div className="min-h-screen py-8 sm:py-12 space-y-10">
      {/* Projected IELTS Band Hero Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 sm:p-8 rounded-3xl border glass-card flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-soft ${projectedBand.bg}`}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-900 border border-current text-primary">
                Predictive Analytics
              </span>
              <span className="text-xs font-bold text-slateText-muted">Based on 301 Essential Book 5 Words</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slateText-heading dark:text-white flex items-center gap-3">
              <span>Projected IELTS Lexical Range:</span>
              <span className={`${projectedBand.color} underline decoration-dashed`}>
                {projectedBand.band}
              </span>
            </h2>
            <p className="text-sm text-slateText-body dark:text-slate-300 max-w-2xl">
              {projectedBand.label}. You have mastered <strong>{masteredCount}</strong> of 301 high-frequency words. Reach 200+ words to unlock Band 8.0 lexical resource mastery.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/practice"
              className="px-5 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-black flex items-center gap-2 shadow-soft transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Practice to Level Up</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Main Core Dashboard Component */}
      <UserDashboard
        stats={store.stats}
        units={sampleUnits}
        allWords={sampleWords}
        learnedWordIds={store.learnedWordIds}
        favoriteWordIds={store.favoriteWordIds}
        recentlyStudiedWords={recentlyStudiedWords}
        onStartUnit={(unitId) => router.push(`/vocabulary?unit=${unitId}`)}
        onOpenWordDetails={openWordDetails}
        onOpenShop={openShop}
        onGoToLibrary={(unitId) =>
          router.push(unitId ? `/vocabulary?unit=${unitId}` : "/vocabulary")
        }
        onGoToFlashcards={() => router.push("/learn")}
        onGoToTasks={() => router.push("/practice")}
      />

      {/* Saved Bookmarks / Favorites Quick Shelf */}
      {favoriteWords.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slateText-heading dark:text-white flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-rose-500 fill-rose-500" />
              <span>Bookmarked Words ({favoriteWords.length})</span>
            </h3>
            <Link
              href="/vocabulary"
              className="text-xs font-bold text-primary dark:text-sky-400 hover:underline cursor-pointer"
            >
              Filter in Library →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {favoriteWords.map((word) => (
              <motion.div
                key={word.id}
                whileHover={{ y: -2 }}
                className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slateText-heading dark:text-white capitalize">
                      {word.word}
                    </span>
                    <span className="text-[10px] font-bold text-slateText-muted uppercase">
                      {word.partOfSpeech}
                    </span>
                  </div>
                  <p className="text-xs text-primary font-semibold">
                    {word.translations.uzbek}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => playAudio(word.word)}
                    className="p-2 rounded-xl text-slateText-muted hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Pronounce"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => openWordDetails(word)}
                    className="p-2 rounded-xl text-slateText-muted hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="View details"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slateText-muted">Loading Dashboard...</p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
