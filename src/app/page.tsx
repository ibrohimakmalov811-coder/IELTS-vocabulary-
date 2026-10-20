"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useVocab } from "@/components/layout/ClientLayout";
import { sampleWords, sampleUnits } from "@/data/vocabularyData";
import { WordCard } from "@/components/WordCard";
import { 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  Volume2, 
  CheckCircle2, 
  Layers, 
  Zap, 
  Flame, 
  Coins, 
  HelpCircle, 
  ChevronDown, 
  Lightbulb,
  ShieldCheck,
  TrendingUp,
  Award,
  Play
} from "lucide-react";

export default function HomePage() {
  const { store, openWordDetails, playAudio, activePlayingWord } = useVocab();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Real preview words for library section (first 6 words from Book 5)
  const previewWords = sampleWords.slice(0, 6);

  // FAQ Items
  const faqItems = [
    {
      q: "Are these words officially from Paul Nation's 4000 Essential English Words Book 5?",
      a: "Yes. All 301 target vocabulary items, IPA transcriptions, definitions, and sentence examples are extracted directly from the official curriculum of 4000 Essential English Words Book 5 (Units 1 to 15), verified for Pre-IELTS and IELTS academic candidates."
    },
    {
      q: "How does the native audio pronunciation work?",
      a: "The platform integrates browser Web Speech synthesis calibrated to natural IELTS speaking tempo (0.88x). You can toggle between American (US) and British (UK) accents directly in the top navigation bar."
    },
    {
      q: "Are the Uzbek and Russian translations authentic?",
      a: "Yes! Every single word includes contextual Uzbek translations, grammatical parts of speech, and translated example sentences so students can grasp both meaning and accurate collocations."
    },
    {
      q: "How does the gamification and coin system work?",
      a: "Every time you mark a word as learned (+5 Coins) or complete an interactive practice task (+10 Coins), your coins increase. You can use your coins in the Gift Shop to unlock Streak Freezes, Dark Mode, and special profile badges."
    },
    {
      q: "Is my progress saved between sessions?",
      a: "Yes. Your learned words, saved favorites, daily streak, coin balance, and recently studied items are stored automatically in your browser's local storage so you never lose your progress."
    }
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-20 font-sans overflow-hidden">
      {/* ==================================================== */}
      {/* 1. HERO SECTION (Cinematic, Modern, Animated)       */}
      {/* ==================================================== */}
      <section className="relative pt-12 sm:pt-20 pb-12 sm:pb-20 overflow-hidden">
        {/* Ambient Radial Lights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-gradient-to-b from-sky-400/15 via-indigo-500/10 to-transparent dark:from-sky-500/10 dark:via-indigo-900/15 pointer-events-none rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content (7 cols) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft">
                <span className="w-2 h-2 rounded-full bg-tealAccent animate-pulse" />
                <span className="text-xs font-bold text-slateText-heading dark:text-slate-200 tracking-wide">
                  Official 4000 Essential English Words Book 5
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-primary-light text-primary dark:bg-primary/20">
                  Band 7.5+
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slateText-heading dark:text-white tracking-tight leading-[1.12]">
                Master IELTS Vocabulary, <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-tealAccent bg-clip-text text-transparent">
                  Effortlessly &amp; Permanently.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-slateText-body dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Stop memorizing boring alphabetic lists. Learn, practice, and retain 300+ high-yield academic words with native pronunciation, Uzbek translations, contextual examples, and active recall flashcards.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/practice"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-primary via-blue-600 to-indigo-600 hover:from-primary-hover hover:to-indigo-700 text-white font-bold text-base shadow-soft hover:shadow-glow-blue flex items-center justify-center gap-2.5 transition-all group"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/vocabulary"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-surface dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 text-slateText-heading dark:text-white font-bold text-base hover:border-primary transition-all flex items-center justify-center gap-2 shadow-soft"
                >
                  <BookOpen className="w-5 h-5 text-primary dark:text-sky-400" />
                  <span>Explore Vocabulary</span>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slateText-muted">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>301 Active Academic Words</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-500" />
                  <span>Native US/UK Speech</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                  <span>Uzbek Explanations &amp; Collocations</span>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Preview Card (5 cols) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-5 relative"
            >
              {/* Decorative floating card */}
              <div className="relative mx-auto max-w-md">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-sky-500 via-indigo-500 to-tealAccent rounded-3xl blur-lg opacity-30 group-hover:opacity-60 transition duration-1000 -z-10" />

                {/* Hero Showcase Card: Word "Allot" */}
                <div className="glass-card rounded-3xl p-6 sm:p-7 space-y-4 border border-white/20 dark:border-slate-800 shadow-2xl relative">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold px-3 py-0.5 rounded-full bg-primary-light text-primary dark:bg-sky-500/20 dark:text-sky-300">
                        Unit 1 • Foundation
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slateText-muted bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        verb
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Book 5 Verified
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-3xl font-black text-slateText-heading dark:text-white">
                        Allot
                      </h3>
                      <button
                        onClick={() => playAudio("Allot")}
                        className="w-10 h-10 rounded-2xl bg-primary hover:bg-primary-hover text-white flex items-center justify-center shadow-soft transition-all cursor-pointer"
                        title="Click to hear pronunciation"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>
                    <span className="text-xs font-mono text-slateText-muted block">
                      /əˈlɒt/
                    </span>
                  </div>

                  {/* Uzbek Meaning */}
                  <div className="p-3.5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/40">
                    <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 dark:text-sky-400 block mb-0.5">
                      O&apos;zbekcha Ma&apos;nosi
                    </span>
                    <p className="text-base font-bold text-slateText-heading dark:text-white">
                      Ajratmoq, bermoq, taqsimlamoq
                    </p>
                  </div>

                  {/* Definition */}
                  <div className="space-y-1 text-xs sm:text-sm text-slateText-body dark:text-slate-300">
                    <span className="font-bold text-slateText-heading dark:text-white">Definition: </span>
                    <span>To allot something means to give it to someone.</span>
                  </div>

                  {/* Sentence with Highlight */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slateText-body dark:text-slate-200 italic">
                    &ldquo;The coach <span className="font-bold text-primary dark:text-sky-400 bg-sky-100/70 dark:bg-sky-500/20 px-1 py-0.5 rounded">allotted</span> each team five minutes to prepare a strategy.&rdquo;
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="text-slateText-muted font-medium">Uzbek example translation available</span>
                    <Link
                      href="/vocabulary?unit=1"
                      className="font-bold text-primary dark:text-sky-400 hover:underline flex items-center gap-1"
                    >
                      Study Unit 1 →
                    </Link>
                  </div>
                </div>

                {/* Floating stat pill */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-5 -left-4 bg-surface dark:bg-slate-900 px-4 py-2.5 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slateText-heading dark:text-white block">
                      +10 Coins Per Quiz
                    </span>
                    <span className="text-[10px] text-slateText-muted font-semibold">
                      Earn rewards as you master words
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 2. HOW IT WORKS (Section 5 Requirement)              */}
      {/* ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <span className="text-xs uppercase font-black text-primary tracking-widest px-3 py-1 rounded-full bg-primary-light dark:bg-primary/20">
            Systematic Methodology
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slateText-heading dark:text-white tracking-tight">
            How The Essential 5 System Works
          </h2>
          <p className="text-sm sm:text-base text-slateText-body dark:text-slate-300">
            Engineered around cognitive science principles for maximum retention and effortless IELTS Band 7.5+ recall.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="glass-card rounded-3xl p-6 space-y-4 border border-slate-200/80 dark:border-slate-800 relative">
            <span className="text-3xl font-black text-primary/30 dark:text-sky-400/20 absolute top-4 right-6">
              01
            </span>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-primary dark:text-sky-400 flex items-center justify-center font-bold text-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slateText-heading dark:text-white">
              1. Contextual Discovery
            </h3>
            <p className="text-xs sm:text-sm text-slateText-body dark:text-slate-400 leading-relaxed">
              Explore words inside full IELTS-caliber sentences. Understand nuances with clear English definitions and accurate Uzbek explanations.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-card rounded-3xl p-6 space-y-4 border border-slate-200/80 dark:border-slate-800 relative">
            <span className="text-3xl font-black text-tealAccent/30 dark:text-tealAccent/20 absolute top-4 right-6">
              02
            </span>
            <div className="w-12 h-12 rounded-2xl bg-tealAccent-light dark:bg-tealAccent/20 text-teal-800 dark:text-tealAccent flex items-center justify-center font-bold text-lg">
              <Volume2 className="w-6 h-6 text-tealAccent" />
            </div>
            <h3 className="text-lg font-bold text-slateText-heading dark:text-white">
              2. Native Pronunciation
            </h3>
            <p className="text-xs sm:text-sm text-slateText-body dark:text-slate-400 leading-relaxed">
              Listen to native US and UK audio at proper exam speed. Train your ear for IELTS Listening Section 3 &amp; 4 and Speaking accuracy.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-card rounded-3xl p-6 space-y-4 border border-slate-200/80 dark:border-slate-800 relative">
            <span className="text-3xl font-black text-indigo-500/30 dark:text-indigo-400/20 absolute top-4 right-6">
              03
            </span>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slateText-heading dark:text-white">
              3. Interactive Recall
            </h3>
            <p className="text-xs sm:text-sm text-slateText-body dark:text-slate-400 leading-relaxed">
              Test your memory with fill-in-the-blank cloze tests, multiple-choice quizzes, and definitions matching to earn coins and track streaks.
            </p>
          </div>

          {/* Step 4 */}
          <div className="glass-card rounded-3xl p-6 space-y-4 border border-slate-200/80 dark:border-slate-800 relative">
            <span className="text-3xl font-black text-amber-500/30 dark:text-amber-400/20 absolute top-4 right-6">
              04
            </span>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center font-bold text-lg">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slateText-heading dark:text-white">
              4. 3D Flashcard Revision
            </h3>
            <p className="text-xs sm:text-sm text-slateText-body dark:text-slate-400 leading-relaxed">
              Reinforce difficult vocabulary before forgetting occurs. Review saved favorites and track your progress to 100% mastery.
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 3. VOCABULARY LIBRARY PREVIEW (Real Words)           */}
      {/* ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs uppercase font-black text-tealAccent tracking-widest px-3 py-1 rounded-full bg-tealAccent-light dark:bg-tealAccent/20 text-teal-900 dark:text-tealAccent">
              Verified Curriculum Preview
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slateText-heading dark:text-white tracking-tight mt-2">
              Essential 5 Vocabulary Cards
            </h2>
            <p className="text-xs sm:text-sm text-slateText-body dark:text-slate-300 mt-1">
              Every card integrates translation, clear definition, highlighted example sentence, audio, and learning actions.
            </p>
          </div>

          <Link
            href="/vocabulary"
            className="px-5 py-2.5 rounded-2xl bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slateText-heading dark:text-white hover:border-primary flex items-center gap-2 shadow-soft transition-all shrink-0"
          >
            <span>View All 301 Words</span>
            <ArrowRight className="w-4 h-4 text-primary" />
          </Link>
        </div>

        {/* 6 Real Cards Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewWords.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              isLearned={store.learnedWordIds.includes(word.id)}
              isFavorite={store.favoriteWordIds.includes(word.id)}
              onToggleLearned={store.toggleLearned}
              onToggleFavorite={store.toggleFavorite}
              onOpenDetails={openWordDetails}
              onPlayAudio={playAudio}
              isPlayingAudio={activePlayingWord === word.word}
            />
          ))}
        </div>
      </section>

      {/* ==================================================== */}
      {/* 4. LEARN WITH AUDIO SECTION                          */}
      {/* ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-indigo-500/20 shadow-2xl relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-400/30">
                Acoustic Pronunciation Engine
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Train Your Ears For IELTS Listening &amp; Speaking
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Mispronunciation is one of the biggest reasons IELTS test-takers lose points in Speaking Part 1 &amp; 2. 
                Every single word in our Essential 5 platform includes functional audio with US and UK accents so you learn natural phonetics from Day 1.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-xs font-black text-sky-400 uppercase tracking-wider block">
                    Single-Audio Guard
                  </span>
                  <p className="text-xs text-slate-300">
                    Audio clips never overlap or lag. Click any word to hear crystal-clear pronunciation immediately.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-xs font-black text-tealAccent uppercase tracking-wider block">
                    Sentence Context Audio
                  </span>
                  <p className="text-xs text-slate-300">
                    Listen to complete IELTS sentence examples to master natural sentence stress and collocations.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/practice"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-sm transition-all"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Try Listening Exercises</span>
                </Link>
              </div>
            </div>

            {/* Interactive Audio Visualizer Box */}
            <div className="lg:col-span-5 bg-slate-950/80 rounded-3xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-white/10">
                <span>Interactive Acoustic Player</span>
                <span className="text-sky-400 font-bold">Web Speech API</span>
              </div>

              <div className="space-y-3">
                {["Allot", "Dire", "Resourceful", "Sustenance"].map((w, idx) => (
                  <div
                    key={w}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors"
                  >
                    <div>
                      <span className="font-extrabold text-base block">{w}</span>
                      <span className="text-xs text-slate-400">Word #{idx + 1} of Unit 1</span>
                    </div>

                    <button
                      onClick={() => playAudio(w)}
                      className="w-10 h-10 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 flex items-center justify-center font-bold transition-transform hover:scale-105 cursor-pointer"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 5. LEARNING METHODS & COGNITIVE SCIENCE             */}
      {/* ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-sky-400 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
              Evidence-Based Pedagogy
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slateText-heading dark:text-white tracking-tight">
              Science-Backed Learning Methods
            </h2>
            <p className="text-sm sm:text-base text-slateText-body dark:text-slate-300 leading-relaxed">
              Passive vocabulary reading has a 90% forget rate after 48 hours. 
              Our platform uses multi-modal active recall, contextual collocations, and spaced revision intervals so your vocabulary moves from short-term memory to permanent academic proficiency.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft">
                <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/50 flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slateText-heading dark:text-white">
                    3D Active Recall Flashcards
                  </h4>
                  <p className="text-xs text-slateText-muted mt-0.5">
                    Test your memory before looking at the Uzbek translation. Immediate self-testing doubles long-term retention.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-surface dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft">
                <div className="w-8 h-8 rounded-xl bg-tealAccent-light dark:bg-tealAccent/20 flex items-center justify-center text-teal-800 shrink-0 mt-0.5">
                  <Zap className="w-4 h-4 text-tealAccent" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slateText-heading dark:text-white">
                    Gamified Recall &amp; Cloze Testing
                  </h4>
                  <p className="text-xs text-slateText-muted mt-0.5">
                    Type words from memory in our Practice Center to train rapid retrieval speed for IELTS Writing Task 2.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/learn"
                className="font-bold text-primary dark:text-sky-400 hover:underline inline-flex items-center gap-1.5 text-sm"
              >
                <span>Read Full Methodology Guide</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 bg-surface dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6">
            <h3 className="text-xl font-bold text-slateText-heading dark:text-white">
              The Retention Curve: Passive vs LexiVance
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-rose-500">Traditional List Memorization (Forgetting Curve)</span>
                  <span className="text-rose-500">18% Retained</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-rose-400 h-full rounded-full" style={{ width: "18%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-emerald-500">LexiVance Essential 5 (Active Recall + Audio)</span>
                  <span className="text-emerald-500">86% Retained</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-tealAccent to-emerald-500 h-full rounded-full" style={{ width: "86%" }} />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs text-slateText-muted">
              💡 <strong>Pro Tip:</strong> Practice 10 words daily and review previous units every 3 days to guarantee Band 7.5+ lexical resource score.
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 6. LEARNING PROGRESS SECTION                         */}
      {/* ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 text-center space-y-6">
          <span className="text-xs uppercase font-black text-amber-500 tracking-widest px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40">
            Real Student Activity
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slateText-heading dark:text-white tracking-tight">
            Track Every Word On Your Personal Dashboard
          </h2>
          <p className="text-sm sm:text-base text-slateText-body dark:text-slate-300 max-w-2xl mx-auto">
            Your learning progress is never lost. See exactly how many words you&apos;ve mastered in Book 5, 
            protect your daily streak, and review bookmarked favorites anytime.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-4">
            <div className="p-5 rounded-2xl bg-surface dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <span className="text-3xl font-black text-primary dark:text-sky-400 block">301</span>
              <span className="text-xs text-slateText-muted font-bold">Total Words</span>
            </div>
            <div className="p-5 rounded-2xl bg-surface dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <span className="text-3xl font-black text-emerald-500 block">{store.learnedWordIds.length}</span>
              <span className="text-xs text-slateText-muted font-bold">Words Mastered</span>
            </div>
            <div className="p-5 rounded-2xl bg-surface dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <span className="text-3xl font-black text-secondary block">{store.stats.streakDays} Days</span>
              <span className="text-xs text-slateText-muted font-bold">Active Streak</span>
            </div>
            <div className="p-5 rounded-2xl bg-surface dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <span className="text-3xl font-black text-amber-500 block">{store.stats.totalCoins}</span>
              <span className="text-xs text-slateText-muted font-bold">Total Coins</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-soft"
            >
              <span>Open Student Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 7. STUDENT IDEAS HIGHLIGHT                           */}
      {/* ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-tr from-indigo-950/80 via-slate-900 to-slate-950 p-8 sm:p-12 rounded-3xl border border-indigo-500/20 text-white flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-sky-300 text-xs font-bold">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Community-Powered Hacks</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Have A Clever Mnemonic Or Memory Trick?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore student ideas for remembering difficult Book 5 words, or share your own study tricks with the IELTS community.
            </p>
          </div>

          <Link
            href="/ideas"
            className="px-6 py-3.5 rounded-2xl bg-surface text-slate-950 font-bold text-sm hover:bg-sky-50 transition-colors shrink-0 shadow-lg"
          >
            Explore Student Ideas →
          </Link>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 8. FAQ SECTION                                       */}
      {/* ==================================================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary-light dark:bg-primary/20">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slateText-heading dark:text-white tracking-tight">
            Got Questions? We Have Answers.
          </h2>
        </div>

        <div className="space-y-3.5">
          {faqItems.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-surface dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-soft transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slateText-heading dark:text-white cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slateText-muted shrink-0 transition-transform ${isOpen ? "rotate-180 text-primary" : ""}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-5 pb-5 text-xs sm:text-sm text-slateText-body dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3"
                    >
                      {item.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================== */}
      {/* 9. FINAL CTA BANNER                                  */}
      {/* ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 rounded-3xl p-8 sm:p-14 text-white text-center space-y-6 shadow-glow-blue relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/20 text-white">
              Ready to Upgrade Your Lexicon?
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Start Mastering Essential 5 Today
            </h2>
            <p className="text-sm sm:text-base text-white/90">
              Join thousands of pre-IELTS and IELTS students mastering academic vocabulary with native audio and interactive flashcards.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <Link
              href="/practice"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-primary hover:bg-slate-50 font-black text-base shadow-xl transition-all"
            >
              Start Learning Now — 100% Free
            </Link>
            <Link
              href="/vocabulary"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-base border border-white/25 transition-all"
            >
              Browse Vocabulary
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
