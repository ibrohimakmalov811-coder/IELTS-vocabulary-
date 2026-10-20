"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useVocab } from "@/components/layout/ClientLayout";
import { VocabularyLibrary } from "@/components/VocabularyLibrary";
import { sampleWords, sampleUnits } from "@/data/vocabularyData";
import { getWords, getUnits } from "@/lib/services/vocabularyService";
import { WordItem, Unit } from "@/types/vocabulary";
import { BookOpen, Sparkles, CheckCircle2, Bookmark, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

function VocabularyContent() {
  const { store, openWordDetails, playAudio, activePlayingWord } = useVocab();
  const searchParams = useSearchParams();
  const unitParam = searchParams.get("unit");
  const initialUnit = unitParam && !isNaN(Number(unitParam)) ? Number(unitParam) : "all";

  const [wordsList, setWordsList] = useState<WordItem[]>(sampleWords);
  const [unitsList, setUnitsList] = useState<Unit[]>(sampleUnits);

  useEffect(() => {
    getWords({ limit: 400 })
      .then((res) => {
        if (res && res.words && res.words.length > 0) {
          setWordsList(res.words);
        }
      })
      .catch(() => {});

    getUnits()
      .then((res) => {
        if (res && res.length > 0) {
          setUnitsList(res);
        }
      })
      .catch(() => {});
  }, []);

  const totalWords = wordsList.length;
  const learnedCount = store.learnedWordIds.length;
  const favoriteCount = store.favoriteWordIds.length;
  const masteryPercentage = Math.round((learnedCount / totalWords) * 100);

  return (
    <div className="min-h-screen py-8 sm:py-12">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-primary-light dark:bg-primary/20 text-primary dark:text-sky-300">
                <GraduationCap className="w-3.5 h-3.5" />
                Curriculum Library
              </span>
              <span className="text-xs font-bold text-tealAccent">
                4000 Essential English Words • Book 5
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slateText-heading dark:text-white tracking-tight">
              Essential IELTS Vocabulary
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slateText-body dark:text-slate-300 max-w-2xl leading-relaxed">
              Explore 301 verified high-frequency academic words across Units 1–15 with native audio pronunciation, context sentences, Uzbek translations, collocations, and active recall practice.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 flex-wrap">
            <div className="glass-card px-4 py-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-primary" />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slateText-muted">Total Words</div>
                <div className="text-base font-black text-slateText-heading dark:text-white">{totalWords}</div>
              </div>
            </div>

            <div className="glass-card px-4 py-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slateText-muted">Mastered</div>
                <div className="text-base font-black text-emerald-600 dark:text-emerald-400">
                  {learnedCount} <span className="text-xs text-slateText-muted font-normal">({masteryPercentage}%)</span>
                </div>
              </div>
            </div>

            <div className="glass-card px-4 py-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
              <Bookmark className="w-4 h-4 text-rose-500" />
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slateText-muted">Saved</div>
                <div className="text-base font-black text-slateText-heading dark:text-white">{favoriteCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Vocabulary Library Component */}
      <VocabularyLibrary
        words={wordsList}
        units={unitsList}
        learnedWordIds={store.learnedWordIds}
        favoriteWordIds={store.favoriteWordIds}
        onToggleLearned={store.toggleLearned}
        onToggleFavorite={store.toggleFavorite}
        onOpenDetails={openWordDetails}
        onPlayAudio={playAudio}
        activePlayingWord={activePlayingWord}
        initialUnitFilter={initialUnit}
      />
    </div>
  );
}

export default function VocabularyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slateText-muted">Loading Vocabulary Library...</p>
          </div>
        </div>
      }
    >
      <VocabularyContent />
    </Suspense>
  );
}
