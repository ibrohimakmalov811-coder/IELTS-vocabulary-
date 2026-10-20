"use client";

import React, { useState, Suspense } from "react";
import { useVocab } from "@/components/layout/ClientLayout";
import { sampleWords, sampleUnits } from "@/data/vocabularyData";
import { FlashcardReview } from "@/components/FlashcardReview";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Brain,
  Layers,
  ArrowRight,
  CheckCircle2,
  Zap,
  Target,
  Clock,
  Compass,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

function LearnContent() {
  const { store, playAudio, activePlayingWord } = useVocab();
  const [activeUnitId, setActiveUnitId] = useState<number | "all">("all");

  const filteredWordsForFlashcards =
    activeUnitId === "all"
      ? sampleWords
      : sampleWords.filter((w) => w.unit === activeUnitId);

  return (
    <div className="min-h-screen py-8 sm:py-12 space-y-12">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="pb-8 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-tealAccent-light dark:bg-tealAccent/20 text-teal-900 dark:text-tealAccent border border-tealAccent/30">
              <Brain className="w-3.5 h-3.5" />
              Pedagogical Methodology
            </span>
            <span className="text-xs text-slateText-muted font-bold">
              Cognitive Science & Spaced Retrieval
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slateText-heading dark:text-white tracking-tight">
            Learn Vocabulary That Sticks
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slateText-body dark:text-slate-300 max-w-3xl leading-relaxed">
            Memorizing isolated word lists creates passive recognition that disappears in high-pressure IELTS exams. Our system utilizes Paul Nation&apos;s four strands and Leitner spaced intervals to convert words into spontaneous active speech and writing.
          </p>
        </div>
      </div>

      {/* 4 Pillars of Vocabulary Acquisition */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black">
              1
            </div>
            <h3 className="text-lg font-black text-slateText-heading dark:text-white">
              Contextual Encoding
            </h3>
            <p className="text-xs text-slateText-body dark:text-slate-300 leading-relaxed">
              Every word is introduced in high-register academic sentence frames mirroring IELTS Reading and Writing Task 2 topics.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-tealAccent/20 text-teal-800 dark:text-tealAccent flex items-center justify-center font-black">
              2
            </div>
            <h3 className="text-lg font-black text-slateText-heading dark:text-white">
              Phonological Echo
            </h3>
            <p className="text-xs text-slateText-body dark:text-slate-300 leading-relaxed">
              Switch seamlessly between standard US and British RP accents with Web Speech audio to condition auditory comprehension.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
              3
            </div>
            <h3 className="text-lg font-black text-slateText-heading dark:text-white">
              Lexical Chunks
            </h3>
            <p className="text-xs text-slateText-body dark:text-slate-300 leading-relaxed">
              Learn natural collocations and semantic synonyms to satisfy IELTS Lexical Resource Band 7+ criteria without forced awkward phrasing.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black">
              4
            </div>
            <h3 className="text-lg font-black text-slateText-heading dark:text-white">
              Active Retrieval
            </h3>
            <p className="text-xs text-slateText-body dark:text-slate-300 leading-relaxed">
              3D flashcards and cloze quizzes force your brain to retrieve words under low pressure, generating durable neural pathways.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Interactive Flashcard Study Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slateText-heading dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                <span>Interactive Flashcard Trainer</span>
              </h2>
              <p className="text-xs text-slateText-muted mt-0.5">
                Practice active recall with 3D flip cards, phonetic pronunciation, and instant coin rewards.
              </p>
            </div>

            {/* Quick Practice Link */}
            <Link
              href="/practice"
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto shrink-0 shadow-soft"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Go to Quiz Arena</span>
            </Link>
          </div>

          {/* Embedded Flashcard Deck */}
          <FlashcardReview
            words={sampleWords}
            units={sampleUnits}
            learnedWordIds={store.learnedWordIds}
            onToggleLearned={store.toggleLearned}
            onPlayAudio={playAudio}
            isPlayingAudio={activePlayingWord !== null}
            onEarnCoins={(amount) => store.addCoins(amount)}
          />
        </div>
      </div>

      {/* Curriculum Units Browser */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slateText-heading dark:text-white">
              Curriculum Units (Units 1–15 Core)
            </h2>
            <p className="text-xs text-slateText-muted mt-1">
              Select any unit to jump into dedicated vocabulary library browsing or quiz practice.
            </p>
          </div>

          <Link
            href="/vocabulary"
            className="text-xs font-bold text-primary dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Library</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleUnits.slice(0, 15).map((unit) => {
            const unitWords = sampleWords.filter((w) => w.unit === unit.id);
            const masteredInUnit = unitWords.filter((w) =>
              store.learnedWordIds.includes(w.id)
            ).length;
            const percent = Math.round((masteredInUnit / (unitWords.length || 20)) * 100);

            return (
              <motion.div
                key={unit.id}
                whileHover={{ y: -2 }}
                className="p-5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-primary font-black uppercase tracking-wider">
                      Unit {unit.id}
                    </span>
                    <span className="text-slateText-muted">{masteredInUnit}/{unitWords.length || 20} Mastered</span>
                  </div>
                  <h3 className="font-extrabold text-base text-slateText-heading dark:text-white">
                    {unit.title.replace(`Unit ${unit.id}: `, "")}
                  </h3>
                  <p className="text-xs text-slateText-body dark:text-slate-300 mt-1 line-clamp-2">
                    {unit.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-tealAccent rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <Link
                      href={`/vocabulary?unit=${unit.id}`}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-slateText-heading dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      Study Words ({unitWords.length})
                    </Link>
                    <Link
                      href={`/practice?unit=${unit.id}`}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-primary dark:text-tealAccent hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Quiz Unit</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function LearnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slateText-muted">Loading Learning Hub...</p>
          </div>
        </div>
      }
    >
      <LearnContent />
    </Suspense>
  );
}
