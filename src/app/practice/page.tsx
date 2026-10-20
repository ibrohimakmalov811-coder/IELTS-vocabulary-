"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useVocab } from "@/components/layout/ClientLayout";
import { sampleWords, sampleUnits } from "@/data/vocabularyData";
import { WordItem } from "@/types/vocabulary";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Zap,
  Volume2,
  Sparkles,
  Check,
  X,
  ArrowRight,
  RotateCcw,
  Trophy,
  Flame,
  Brain,
  Target,
  BookOpen,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  Clock,
  LayoutDashboard,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

type PracticeMode = "quiz" | "recall" | "cloze";

function PracticeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetWordParam = searchParams.get("word");
  const unitParam = searchParams.get("unit");

  const { store, playAudio, activePlayingWord, openWordDetails } = useVocab();

  // Selected Unit & Mode
  const [selectedUnit, setSelectedUnit] = useState<number | "all">(
    unitParam && !isNaN(Number(unitParam)) ? Number(unitParam) : "all"
  );
  const [mode, setMode] = useState<PracticeMode>("quiz");

  // Round questions
  const [questionList, setQuestionList] = useState<WordItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // User input states
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Timer & Scoring
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [sessionScore, setSessionScore] = useState(0);
  const [coinsEarned, setCoinsEarned] = useState(0);
  const [missedWords, setMissedWords] = useState<WordItem[]>([]);
  const [isRoundFinished, setIsRoundFinished] = useState(false);

  // Timer effect during active round
  useEffect(() => {
    if (isRoundFinished || questionList.length === 0) return;
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isRoundFinished, questionList.length]);

  // Format timer MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
  };

  // Initialize questions
  const initializeRound = (unit: number | "all", targetWordStr?: string | null) => {
    let pool = unit === "all" ? [...sampleWords] : sampleWords.filter((w) => w.unit === unit);
    if (pool.length === 0) pool = [...sampleWords];

    let selectedQuestions: WordItem[] = [];

    // If target word is requested, put it first!
    if (targetWordStr) {
      const found = sampleWords.find(
        (w) => w.word.toLowerCase() === targetWordStr.trim().toLowerCase()
      );
      if (found) {
        const others = pool.filter((w) => w.id !== found.id).sort(() => Math.random() - 0.5);
        selectedQuestions = [found, ...others.slice(0, 9)];
      }
    }

    if (selectedQuestions.length === 0) {
      selectedQuestions = [...pool].sort(() => Math.random() - 0.5).slice(0, 10);
    }

    setQuestionList(selectedQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setTypedAnswer("");
    setShowHint(false);
    setIsAnswerSubmitted(false);
    setIsCorrect(null);
    setSessionScore(0);
    setCoinsEarned(0);
    setElapsedSeconds(0);
    setMissedWords([]);
    setIsRoundFinished(false);
  };

  useEffect(() => {
    initializeRound(selectedUnit, targetWordParam);
  }, [selectedUnit, targetWordParam]);

  const currentWord = questionList[currentIndex];

  // Generate 4 multiple-choice options for Quiz mode
  const multipleChoiceOptions = useMemo(() => {
    if (!currentWord) return [];

    const correctTranslation = currentWord.translations.uzbek;
    const otherWords = sampleWords.filter((w) => w.id !== currentWord.id);
    const shuffledOthers = [...otherWords].sort(() => Math.random() - 0.5);
    const distractorTranslations = shuffledOthers
      .slice(0, 3)
      .map((w) => w.translations.uzbek);

    const allOpts = Array.from(new Set([correctTranslation, ...distractorTranslations]));
    return allOpts.sort(() => Math.random() - 0.5);
  }, [currentWord]);

  // Handle Answer Check
  const handleSubmitAnswer = (answerProvided: string) => {
    if (isAnswerSubmitted || !currentWord) return;

    let correct = false;

    if (mode === "quiz") {
      correct = answerProvided.trim().toLowerCase() === currentWord.translations.uzbek.trim().toLowerCase();
    } else if (mode === "recall" || mode === "cloze") {
      correct = answerProvided.trim().toLowerCase() === currentWord.word.trim().toLowerCase();
    }

    setIsAnswerSubmitted(true);
    setIsCorrect(correct);

    if (correct) {
      setSessionScore((prev) => prev + 1);
      setCoinsEarned((prev) => prev + 10);
      store.addCoins(10);

      // Play audio of the word upon successful answer
      playAudio(currentWord.word);

      // Celebratory confetti
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#38BDF8", "#50E3C2", "#F5A623", "#6366F1"],
      });
    } else {
      setMissedWords((prev) => [...prev, currentWord]);
    }
  };

  // Next question or finish
  const handleNextQuestion = () => {
    if (currentIndex + 1 < questionList.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setTypedAnswer("");
      setShowHint(false);
      setIsAnswerSubmitted(false);
      setIsCorrect(null);
    } else {
      setIsRoundFinished(true);

      // Final score calculation
      const finalScore = sessionScore + (isCorrect ? 1 : 0);
      const accuracy = Math.round((finalScore / questionList.length) * 100);

      // Save to Student's persistent test history in Chrome's localStorage!
      store.recordTestSession({
        date: new Date().toISOString(),
        mode,
        unit: selectedUnit,
        totalQuestions: questionList.length,
        correctAnswers: finalScore,
        accuracy,
        timeSpentSeconds: elapsedSeconds,
        coinsEarned: finalScore * 10,
      });

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header Navigation & Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Zap className="w-3.5 h-3.5" />
                IELTS Test &amp; Mashq Markazi
              </span>
              <span className="text-xs text-slateText-muted font-bold">
                10 savollik nazorat testi
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slateText-heading dark:text-white tracking-tight">
              Lug&apos;at Boyligi Testi
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slateText-body dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 text-primary" />
              <span>Natijalar Paneli</span>
            </Link>
            <button
              onClick={() => initializeRound(selectedUnit, targetWordParam)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-primary dark:text-sky-400 hover:bg-primary-light dark:hover:bg-primary/20 border border-primary/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Testni qayta boshlash"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Qaytadan</span>
            </button>
          </div>
        </div>

        {/* Target Word Mode Notification */}
        {targetWordParam && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm">
                🎯
              </div>
              <div>
                <p className="text-xs font-bold text-slateText-muted">Aynan tanlangan so&apos;z bo&apos;yicha mashq</p>
                <p className="text-sm font-extrabold text-slateText-heading dark:text-white">
                  Nishon so&apos;z: <span className="text-primary capitalize">{targetWordParam}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push("/practice")}
              className="text-xs font-bold text-slateText-muted hover:text-slateText-heading dark:hover:text-white underline cursor-pointer"
            >
              Filtrni tozalash
            </button>
          </motion.div>
        )}

        {/* Mode Switcher & Unit Selection Cockpit */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800">
          {/* Test Modes */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900/90 p-1.5 rounded-2xl overflow-x-auto">
            <button
              onClick={() => {
                setMode("quiz");
                initializeRound(selectedUnit, targetWordParam);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                mode === "quiz"
                  ? "bg-white dark:bg-slate-800 text-primary dark:text-sky-300 shadow-xs"
                  : "text-slateText-muted hover:text-slateText-heading dark:hover:text-white"
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Ma&apos;no Testi</span>
            </button>

            <button
              onClick={() => {
                setMode("recall");
                initializeRound(selectedUnit, targetWordParam);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                mode === "recall"
                  ? "bg-white dark:bg-slate-800 text-primary dark:text-sky-300 shadow-xs"
                  : "text-slateText-muted hover:text-slateText-heading dark:hover:text-white"
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Imlo &amp; Yozish</span>
            </button>

            <button
              onClick={() => {
                setMode("cloze");
                initializeRound(selectedUnit, targetWordParam);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                mode === "cloze"
                  ? "bg-white dark:bg-slate-800 text-primary dark:text-sky-300 shadow-xs"
                  : "text-slateText-muted hover:text-slateText-heading dark:hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gapni To&apos;ldirish</span>
            </button>
          </div>

          {/* Unit Filter */}
          <div className="flex items-center gap-2 self-end md:self-center">
            <span className="text-xs font-bold text-slateText-muted">Unit tanlash:</span>
            <select
              value={selectedUnit}
              onChange={(e) => {
                const val = e.target.value === "all" ? "all" : Number(e.target.value);
                setSelectedUnit(val);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-surface dark:bg-slate-900 text-slateText-heading dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Barcha Unitlar (1–15 Core)</option>
              {sampleUnits.slice(0, 15).map((u) => (
                <option key={u.id} value={u.id}>
                  Unit {u.id} (20 So&apos;z)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Test Status & Progress Cockpit */}
        {!isRoundFinished && questionList.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slateText-heading dark:text-white flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:text-sky-300 font-extrabold">
                  Savol {currentIndex + 1} / {questionList.length}
                </span>
                <span className="text-slateText-muted flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatTime(elapsedSeconds)}
                </span>
              </span>

              <div className="flex items-center gap-3">
                <span className="text-amber-500 flex items-center gap-1 font-extrabold">
                  <Sparkles className="w-3.5 h-3.5" />
                  +{coinsEarned} Tangalar
                </span>
                <span className="text-emerald-500 flex items-center gap-1 font-extrabold">
                  <Check className="w-3.5 h-3.5" />
                  {sessionScore} To&apos;g&apos;ri
                </span>
              </div>
            </div>

            {/* Smooth animated progress line */}
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-tealAccent to-emerald-400 rounded-full"
                animate={{
                  width: `${((currentIndex + (isAnswerSubmitted ? 1 : 0)) / questionList.length) * 100}%`,
                }}
                transition={{ duration: 0.35 }}
              />
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* ROUND FINISHED: SCORE SUMMARY & PERSISTENCE CARD         */}
        {/* ======================================================== */}
        {isRoundFinished ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 sm:p-10 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 text-center space-y-6 shadow-2xl"
          >
            <div className="w-20 h-20 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
              <Trophy className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black text-slateText-heading dark:text-white">
                Test Yakunlandi!
              </h2>
              <p className="text-slateText-body dark:text-slate-300 max-w-md mx-auto text-sm sm:text-base">
                Natijangiz shaxsiy student dashboardingizga va diagrammalarga muvaffaqiyatli saqlandi.
              </p>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto py-2">
              <div className="p-4 rounded-2xl bg-surface dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <div className="text-xs font-bold text-slateText-muted">To&apos;g&apos;ri Javoblar</div>
                <div className="text-2xl font-black text-slateText-heading dark:text-white">
                  {sessionScore}/{questionList.length}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <div className="text-xs font-bold text-slateText-muted">Aniqlik (Accuracy)</div>
                <div className="text-2xl font-black text-primary dark:text-sky-300">
                  {Math.round((sessionScore / questionList.length) * 100)}%
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <div className="text-xs font-bold text-slateText-muted">Ketgan Vaqt</div>
                <div className="text-2xl font-black text-tealAccent">
                  {formatTime(elapsedSeconds)}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <div className="text-xs font-bold text-slateText-muted">Yutuq</div>
                <div className="text-2xl font-black text-amber-500">
                  +{coinsEarned} 🪙
                </div>
              </div>
            </div>

            {/* Missed Words Section */}
            {missedWords.length > 0 && (
              <div className="text-left p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-slateText-heading dark:text-white flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-500" />
                  Xato qilingan so&apos;zlar ({missedWords.length} ta):
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {missedWords.map((w) => (
                    <div
                      key={w.id}
                      onClick={() => openWordDetails(w)}
                      className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between cursor-pointer hover:border-primary/50 transition-colors"
                    >
                      <div>
                        <span className="font-bold text-sm text-slateText-heading dark:text-white capitalize">
                          {w.word}
                        </span>
                        <span className="text-xs text-slateText-muted ml-2">
                          ({w.partOfSpeech})
                        </span>
                        <p className="text-xs text-primary font-semibold">{w.translations.uzbek}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slateText-muted" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => initializeRound(selectedUnit, targetWordParam)}
                className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white font-extrabold text-sm flex items-center gap-2 shadow-soft transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Testni Qaytadan Topshirish</span>
              </button>

              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-2xl bg-surface dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slateText-heading dark:text-white font-extrabold text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4 text-tealAccent" />
                <span>Dashboardda Diagrammalarni Ko&apos;rish</span>
              </Link>
            </div>
          </motion.div>
        ) : (
          /* ======================================================== */
          /* ACTIVE TEST QUESTION CARD                                */
          /* ======================================================== */
          currentWord && (
            <motion.div
              key={currentWord.id + currentIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-soft"
            >
              {/* Question Header & Meta */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slateText-heading dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    Unit {currentWord.unit}
                  </span>
                  <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded-full bg-tealAccent-light dark:bg-tealAccent/20 text-teal-900 dark:text-tealAccent">
                    {currentWord.partOfSpeech}
                  </span>
                </div>

                <button
                  onClick={() => playAudio(currentWord.word)}
                  className={`p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer flex items-center gap-2 ${
                    activePlayingWord === currentWord.word
                      ? "text-primary bg-primary/10 border-primary"
                      : "text-slateText-muted hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  title="Talaffuzni eshitish"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="text-xs font-bold hidden sm:inline">Tinglash</span>
                </button>
              </div>

              {/* MODE 1: MULTIPLE CHOICE MEANING QUIZ */}
              {mode === "quiz" && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slateText-muted">
                      Ushbu so&apos;zning to&apos;g&apos;ri o&apos;zbekcha tarjimasini tanlang:
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-black text-slateText-heading dark:text-white capitalize">
                      {currentWord.word}
                    </h2>
                    <p className="text-sm text-slateText-muted italic font-mono">
                      {currentWord.phonetic}
                    </p>
                    <div className="max-w-xl mx-auto p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 mt-2">
                      <p className="text-xs sm:text-sm text-slateText-body dark:text-slate-300 italic">
                        &quot;{currentWord.definition}&quot;
                      </p>
                    </div>
                  </div>

                  {/* 4 Choices */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {multipleChoiceOptions.map((opt, i) => {
                      const letter = ["A", "B", "C", "D"][i];
                      const isThisSelected = selectedOption === opt;
                      const isThisCorrect = opt === currentWord.translations.uzbek;

                      let btnStyle =
                        "border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 hover:border-primary/50 text-slateText-heading dark:text-white";

                      if (isAnswerSubmitted) {
                        if (isThisCorrect) {
                          btnStyle =
                            "border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold ring-2 ring-emerald-500/30";
                        } else if (isThisSelected && !isThisCorrect) {
                          btnStyle =
                            "border-rose-500 bg-rose-500/15 text-rose-600 dark:text-rose-400 font-extrabold";
                        } else {
                          btnStyle = "opacity-40 border-slate-200 dark:border-slate-800";
                        }
                      }

                      return (
                        <motion.button
                          key={i}
                          whileHover={!isAnswerSubmitted ? { scale: 1.02 } : {}}
                          whileTap={!isAnswerSubmitted ? { scale: 0.98 } : {}}
                          onClick={() => {
                            if (!isAnswerSubmitted) {
                              setSelectedOption(opt);
                              handleSubmitAnswer(opt);
                            }
                          }}
                          disabled={isAnswerSubmitted}
                          className={`p-4 rounded-2xl border text-left font-bold text-sm sm:text-base flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slateText-muted">
                              {letter}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isAnswerSubmitted && isThisCorrect && (
                            <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                          )}
                          {isAnswerSubmitted && isThisSelected && !isThisCorrect && (
                            <X className="w-5 h-5 text-rose-500 shrink-0" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MODE 2: ACTIVE RECALL & SPELLING */}
              {mode === "recall" && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slateText-muted">
                      O&apos;zbekcha ma&apos;noga mos inglizcha so&apos;zni yozing:
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-black text-primary dark:text-sky-300 capitalize">
                      {currentWord.translations.uzbek}
                    </h2>
                    <p className="text-sm text-slateText-body dark:text-slate-300 max-w-lg mx-auto pt-1">
                      Ta&apos;rif: &quot;{currentWord.definition}&quot;
                    </p>
                  </div>

                  {/* Input form */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (typedAnswer.trim()) {
                        handleSubmitAnswer(typedAnswer);
                      }
                    }}
                    className="max-w-md mx-auto space-y-4"
                  >
                    <input
                      type="text"
                      autoFocus
                      disabled={isAnswerSubmitted}
                      value={typedAnswer}
                      onChange={(e) => setTypedAnswer(e.target.value)}
                      placeholder="Inglizcha so'zni kiriting..."
                      className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-surface dark:bg-slate-900 text-slateText-heading dark:text-white font-black text-lg text-center tracking-wide focus:outline-none focus:border-primary transition-colors disabled:opacity-80"
                    />

                    {!isAnswerSubmitted ? (
                      <div className="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setShowHint(!showHint)}
                          className="text-xs font-bold text-slateText-muted hover:text-amber-500 flex items-center gap-1 cursor-pointer"
                        >
                          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                          <span>{showHint ? "Maslahatni berkitish" : "Maslahat olish"}</span>
                        </button>

                        <button
                          type="submit"
                          disabled={!typedAnswer.trim()}
                          className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-40 text-white font-extrabold text-sm shadow-soft transition-all cursor-pointer"
                        >
                          Javobni Tekshirish
                        </button>
                      </div>
                    ) : null}

                    {/* Hint Box */}
                    {showHint && !isAnswerSubmitted && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between"
                      >
                        <span>
                          Birinchi harf: <strong className="uppercase">{currentWord.word[0]}</strong> (
                          {currentWord.word.length} ta harf, IPA: {currentWord.phonetic})
                        </span>
                        <button
                          type="button"
                          onClick={() => playAudio(currentWord.word)}
                          className="font-bold underline text-primary cursor-pointer"
                        >
                          Tinglash
                        </button>
                      </motion.div>
                    )}
                  </form>
                </div>
              )}

              {/* MODE 3: SENTENCE CLOZE */}
              {mode === "cloze" && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slateText-muted">
                      Gapdagi bo&apos;shliqqa to&apos;g&apos;ri so&apos;zni qo&apos;ying:
                    </p>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 max-w-xl mx-auto">
                      <p className="text-base sm:text-lg font-medium text-slateText-heading dark:text-slate-100 leading-relaxed">
                        {currentWord.example
                          .replace(
                            new RegExp(`\\b${currentWord.word}\\b`, "gi"),
                            "__________"
                          )}
                      </p>
                    </div>
                    <p className="text-xs text-slateText-muted italic">
                      Ma&apos;nosi: {currentWord.translations.uzbek}
                    </p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (typedAnswer.trim()) {
                        handleSubmitAnswer(typedAnswer);
                      }
                    }}
                    className="max-w-md mx-auto space-y-4"
                  >
                    <input
                      type="text"
                      autoFocus
                      disabled={isAnswerSubmitted}
                      value={typedAnswer}
                      onChange={(e) => setTypedAnswer(e.target.value)}
                      placeholder="Tushirib qoldirilgan so'z..."
                      className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-surface dark:bg-slate-900 text-slateText-heading dark:text-white font-black text-lg text-center tracking-wide focus:outline-none focus:border-primary transition-colors disabled:opacity-80"
                    />

                    {!isAnswerSubmitted ? (
                      <div className="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setShowHint(!showHint)}
                          className="text-xs font-bold text-slateText-muted hover:text-amber-500 flex items-center gap-1 cursor-pointer"
                        >
                          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                          <span>{showHint ? "Berkitish" : "Maslahat"}</span>
                        </button>

                        <button
                          type="submit"
                          disabled={!typedAnswer.trim()}
                          className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-40 text-white font-extrabold text-sm shadow-soft transition-all cursor-pointer"
                        >
                          Javobni Tekshirish
                        </button>
                      </div>
                    ) : null}

                    {showHint && !isAnswerSubmitted && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-200"
                      >
                        Boshlanishi: <strong className="uppercase">{currentWord.word[0]}</strong> • Ta&apos;rif: {currentWord.definition}
                      </motion.div>
                    )}
                  </form>
                </div>
              )}

              {/* POST-SUBMISSION FEEDBACK BANNER */}
              {isAnswerSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 rounded-2xl border space-y-3 ${
                    isCorrect
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                          <span className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
                            Ajoyib! To&apos;g&apos;ri javob (+10 Tangalar)
                          </span>
                        </>
                      ) : (
                        <>
                          <X className="w-5 h-5 text-rose-500 shrink-0" />
                          <span className="font-extrabold text-sm text-rose-600 dark:text-rose-400">
                            Xato. To&apos;g&apos;ri so&apos;z: <strong className="capitalize">{currentWord.word}</strong>
                          </span>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => openWordDetails(currentWord)}
                      className="text-xs font-bold underline hover:opacity-80 cursor-pointer"
                    >
                      Batafsil
                    </button>
                  </div>

                  {/* Context sentence revelation */}
                  <div className="p-3.5 rounded-xl bg-white/60 dark:bg-slate-900/80 text-xs font-medium text-slateText-heading dark:text-slate-200 border border-slate-200/40 dark:border-slate-700/40">
                    <span className="font-bold text-slateText-muted mr-1">Misol:</span>
                    &quot;{currentWord.example}&quot;
                  </div>

                  {/* Continue Button */}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-extrabold text-sm flex items-center gap-2 shadow-soft transition-all cursor-pointer"
                    >
                      <span>{currentIndex + 1 < questionList.length ? "Keyingi Savol" : "Natijalarni Ko'rish"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        )}
      </div>
    </div>
  );
}

export default function PracticePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slateText-muted">Test Markazi Yuklanmoqda...</p>
          </div>
        </div>
      }
    >
      <PracticeContent />
    </Suspense>
  );
}
