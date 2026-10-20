"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WordItem } from "@/types/vocabulary";
import { 
  Volume2, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  BookOpen,
  HelpCircle,
  X,
  Coins,
  Play
} from "lucide-react";
import confetti from "canvas-confetti";

interface WordCardInterfaceProps {
  words: WordItem[];
  currentWordIndex: number;
  totalCoins: number;
  onNextWord: () => void;
  onPrevWord: () => void;
  onBackToDashboard: () => void;
  onEarnCoins: (amount: number) => void;
}

export const WordCardInterface: React.FC<WordCardInterfaceProps> = ({
  words,
  currentWordIndex,
  totalCoins,
  onNextWord,
  onPrevWord,
  onBackToDashboard,
  onEarnCoins,
}) => {
  const currentWord = words[currentWordIndex] || words[0];

  // Active view: "learn" or gamified practice tasks: "task1" | "task2" | "task3"
  const [activeTab, setActiveTab] = useState<"learn" | "task1" | "task2" | "task3">("learn");

  // Task 1 (Memory) State
  const [typedMemoryWord, setTypedMemoryWord] = useState("");
  const [task1Feedback, setTask1Feedback] = useState<"idle" | "correct" | "incorrect">("idle");
  const [task1RewardClaimed, setTask1RewardClaimed] = useState(false);

  // Task 2 (Match) State
  const [selectedMatchIdx, setSelectedMatchIdx] = useState<number | null>(null);
  const [task2Feedback, setTask2Feedback] = useState<"idle" | "correct" | "incorrect">("idle");
  const [task2RewardClaimed, setTask2RewardClaimed] = useState(false);

  // Task 3 (Listen & Fill) State
  const [typedListenWord, setTypedListenWord] = useState("");
  const [task3Feedback, setTask3Feedback] = useState<"idle" | "correct" | "incorrect">("idle");
  const [task3RewardClaimed, setTask3RewardClaimed] = useState(false);

  // Audio state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Reset task feedback when word changes
  const handleWordChange = (action: () => void) => {
    setTypedMemoryWord("");
    setTask1Feedback("idle");
    setTask1RewardClaimed(false);

    setSelectedMatchIdx(null);
    setTask2Feedback("idle");
    setTask2RewardClaimed(false);

    setTypedListenWord("");
    setTask3Feedback("idle");
    setTask3RewardClaimed(false);

    setActiveTab("learn");
    action();
  };

  // Web Speech API Native Pronunciation
  const playNativeAudio = (textToSpeak: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const triggerSuccessCelebration = () => {
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.65 },
        colors: ["#50E3C2", "#4A90E2", "#F5A623"],
      });
    } catch (e) {
      // Fallback
    }
  };

  // Task 1 Submit
  const handleCheckTask1 = () => {
    if (typedMemoryWord.trim().toLowerCase() === currentWord.word.toLowerCase()) {
      setTask1Feedback("correct");
      if (!task1RewardClaimed) {
        onEarnCoins(10);
        setTask1RewardClaimed(true);
        triggerSuccessCelebration();
      }
    } else {
      setTask1Feedback("incorrect");
    }
  };

  // Task 2 Options
  const matchOptions = [
    { id: 1, text: "To cause disgust, shock, or dismay." },
    { id: 2, text: currentWord.definition },
    { id: 3, text: "A hiding place for valuable or dangerous things." },
  ];

  const handleSelectMatch = (idx: number) => {
    setSelectedMatchIdx(idx);
    if (matchOptions[idx].text === currentWord.definition) {
      setTask2Feedback("correct");
      if (!task2RewardClaimed) {
        onEarnCoins(10);
        setTask2RewardClaimed(true);
        triggerSuccessCelebration();
      }
    } else {
      setTask2Feedback("incorrect");
    }
  };

  // Task 3 Submit
  const handleCheckTask3 = () => {
    const cleaned = typedListenWord.trim().toLowerCase();
    const correctTarget = (currentWord.targetAnswer || currentWord.word).toLowerCase();
    const baseWord = currentWord.word.toLowerCase();

    if (cleaned === correctTarget || cleaned === baseWord) {
      setTask3Feedback("correct");
      if (!task3RewardClaimed) {
        onEarnCoins(10);
        setTask3RewardClaimed(true);
        triggerSuccessCelebration();
      }
    } else {
      setTask3Feedback("incorrect");
    }
  };

  return (
    <div className="min-h-screen bg-background text-slateText-body font-sans flex flex-col justify-between pb-12">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 bg-surface/85 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onBackToDashboard}
            className="flex items-center space-x-2 text-sm font-semibold text-slateText-body hover:text-slateText-heading transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </motion.button>

          {/* Word Progress Indicator */}
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-slateText-muted">
              Word {currentWordIndex + 1} of {words.length}
            </span>
            <div className="w-24 sm:w-36 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-tealAccent transition-all duration-300"
                style={{ width: `${((currentWordIndex + 1) / words.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Coin Badge & Exit */}
          <div className="flex items-center space-x-2.5">
            <div className="flex items-center space-x-1 px-3 py-1 bg-secondary-light border border-secondary/20 rounded-full text-xs font-bold text-secondary">
              <Coins className="w-3.5 h-3.5" />
              <span>{totalCoins}</span>
            </div>
            <button
              onClick={onBackToDashboard}
              className="p-1.5 rounded-xl text-slateText-muted hover:bg-gray-100 transition-colors"
              title="Close learning session"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mode Sub-nav Tabs */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 w-full">
        <div className="flex justify-center">
          <div className="inline-flex p-1 bg-gray-100/80 rounded-2xl space-x-1 text-xs sm:text-sm font-semibold shadow-inner">
            <button
              onClick={() => setActiveTab("learn")}
              className={`px-3 sm:px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === "learn"
                  ? "bg-surface text-primary shadow-soft"
                  : "text-slateText-body hover:text-slateText-heading"
              }`}
            >
              Learn
            </button>
            <button
              onClick={() => setActiveTab("task1")}
              className={`px-3 sm:px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === "task1"
                  ? "bg-surface text-primary shadow-soft"
                  : "text-slateText-body hover:text-slateText-heading"
              }`}
            >
              Task 1 (Memory)
            </button>
            <button
              onClick={() => setActiveTab("task2")}
              className={`px-3 sm:px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === "task2"
                  ? "bg-surface text-primary shadow-soft"
                  : "text-slateText-body hover:text-slateText-heading"
              }`}
            >
              Task 2 (Match)
            </button>
            <button
              onClick={() => setActiveTab("task3")}
              className={`px-3 sm:px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === "task3"
                  ? "bg-surface text-primary shadow-soft"
                  : "text-slateText-body hover:text-slateText-heading"
              }`}
            >
              Task 3 (Listen &amp; Fill)
            </button>
          </div>
        </div>
      </div>

      {/* Main Dynamic Workspace Area */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 my-auto pt-6 pb-8 w-full">
        <AnimatePresence mode="wait">
          {/* ==================================================== */}
          {/* TAB: THE LEARNING PHASE (WORD CARD INTERFACE) */}
          {/* ==================================================== */}
          {activeTab === "learn" && (
            <motion.div
              key="tab-learn"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="bg-surface rounded-3xl border border-gray-100 shadow-soft p-6 sm:p-10 space-y-6"
            >
              {/* Word & Pronunciation Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                <div>
                  <div className="flex items-center space-x-3">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slateText-heading tracking-tight">
                      {currentWord.word}
                    </h2>
                    <span className="text-xs px-3 py-1 rounded-full bg-tealAccent-light text-teal-900 font-bold border border-tealAccent/20">
                      {currentWord.partOfSpeech}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slateText-muted mt-1">
                    {currentWord.phonetic}
                  </p>
                </div>

                {/* Audio Icon: [🔊 Listen] */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => playNativeAudio(currentWord.word)}
                  className={`inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition-all border cursor-pointer ${
                    isPlayingAudio
                      ? "bg-primary text-white border-primary shadow-soft"
                      : "bg-primary-light text-primary hover:bg-primary/20 border-primary/20"
                  }`}
                >
                  <Volume2 className="w-5 h-5" />
                  <span>🔊 Listen</span>
                </motion.button>
              </div>

              {/* Definition */}
              <div className="space-y-1.5">
                <span className="text-xs uppercase font-extrabold text-slateText-muted tracking-wider block">
                  Definition
                </span>
                <p className="text-lg sm:text-xl font-medium text-slateText-heading leading-relaxed">
                  {currentWord.definition}
                </p>
              </div>

              {/* Real-life Example */}
              <div className="space-y-2 bg-gray-50/80 p-5 rounded-2xl border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-slateText-muted tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-primary" /> Example
                  </span>
                  <button
                    onClick={() => playNativeAudio(currentWord.example)}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3 h-3" /> Listen Sentence
                  </button>
                </div>
                <p className="text-base sm:text-lg text-slateText-heading italic">
                  &ldquo;{currentWord.example}&rdquo;
                </p>
              </div>

              {/* Translations (Uzbek / Russian) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-background border border-gray-200/60 space-y-1">
                <span className="text-xs uppercase font-extrabold text-slateText-muted tracking-wider block">
                  Translations
                </span>
                <p className="text-sm sm:text-base font-semibold text-slateText-heading">
                  Uzbek: {currentWord.translations.uzbek} | Russian: {currentWord.translations.russian}
                </p>
              </div>

              {/* Bottom Quick Action: Switch to Practice */}
              <div className="pt-2 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab("task1")}
                  className="px-5 py-2.5 rounded-xl bg-tealAccent-light hover:bg-tealAccent/20 text-teal-900 border border-tealAccent/30 text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span>Practice this Word (+30 Coins available)</span>
                  <ArrowRight className="w-4 h-4 text-tealAccent" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ==================================================== */}
          {/* TAB: TASK 1 (MEMORY) */}
          {/* ==================================================== */}
          {activeTab === "task1" && (
            <motion.div
              key="tab-task1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-surface rounded-3xl border border-gray-100 shadow-soft p-6 sm:p-10 space-y-6"
            >
              <div className="space-y-2">
                <span className="text-xs uppercase font-extrabold text-primary tracking-wider block">
                  Task 1 (Memory)
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slateText-heading">
                  Type the word you just learned.
                </h3>
                <p className="text-xs sm:text-sm text-slateText-body">
                  Definition clue: &ldquo;{currentWord.definition}&rdquo;
                </p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={typedMemoryWord}
                  onChange={(e) => {
                    setTypedMemoryWord(e.target.value);
                    if (task1Feedback !== "idle") setTask1Feedback("idle");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleCheckTask1()}
                  placeholder="Enter word here..."
                  className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-slateText-heading font-medium text-lg placeholder:text-gray-400 transition-all shadow-inner"
                />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckTask1}
                  className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-sm sm:text-base shadow-soft transition-all cursor-pointer"
                >
                  Verify Word
                </motion.button>
              </div>

              {/* Feedback Copy */}
              <AnimatePresence>
                {task1Feedback === "correct" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-2xl bg-tealAccent-light border border-tealAccent/30 flex items-center justify-between text-teal-900 font-bold"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-secondary" />
                      🎉 Awesome job! +10 Coins
                    </span>
                    <button
                      onClick={() => setActiveTab("task2")}
                      className="text-xs bg-surface px-3 py-1.5 rounded-xl border border-tealAccent/30 shadow-xs font-extrabold hover:bg-tealAccent/10 cursor-pointer"
                    >
                      Task 2 →
                    </button>
                  </motion.div>
                )}

                {task1Feedback === "incorrect" && (
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-sm font-semibold"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>Keep trying! Look at the hint.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ==================================================== */}
          {/* TAB: TASK 2 (MATCH) */}
          {/* ==================================================== */}
          {activeTab === "task2" && (
            <motion.div
              key="tab-task2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-surface rounded-3xl border border-gray-100 shadow-soft p-6 sm:p-10 space-y-6"
            >
              <div className="space-y-2">
                <span className="text-xs uppercase font-extrabold text-tealAccent tracking-wider block">
                  Task 2 (Match)
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slateText-heading">
                  Drag the word to its correct definition.
                </h3>
                <p className="text-xs sm:text-sm text-slateText-body">
                  Select the card that accurately defines the highlighted word:
                </p>
              </div>

              {/* Target Word Badge */}
              <div className="flex justify-center">
                <div className="px-6 py-2.5 rounded-2xl bg-primary-light border-2 border-primary/30 font-extrabold text-primary text-xl shadow-xs">
                  {currentWord.word}
                </div>
              </div>

              {/* Interactive Matching Cards */}
              <div className="space-y-3 pt-2">
                {matchOptions.map((opt, idx) => {
                  const isSelected = selectedMatchIdx === idx;
                  const isCorrect = opt.text === currentWord.definition;

                  return (
                    <motion.div
                      key={opt.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleSelectMatch(idx)}
                      className={`p-4 rounded-2xl border text-sm sm:text-base font-medium cursor-pointer transition-all ${
                        isSelected
                          ? isCorrect
                            ? "bg-tealAccent-light border-tealAccent text-teal-900 shadow-soft"
                            : "bg-red-50 border-red-300 text-red-900"
                          : "bg-surface border-gray-200 hover:border-primary/50 text-slateText-heading"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Feedback Copy */}
              <AnimatePresence>
                {task2Feedback === "correct" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-2xl bg-tealAccent-light border border-tealAccent/30 flex items-center justify-between text-teal-900 font-bold"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-secondary" />
                      🎉 Awesome job! +10 Coins
                    </span>
                    <button
                      onClick={() => setActiveTab("task3")}
                      className="text-xs bg-surface px-3 py-1.5 rounded-xl border border-tealAccent/30 shadow-xs font-extrabold hover:bg-tealAccent/10 cursor-pointer"
                    >
                      Task 3 →
                    </button>
                  </motion.div>
                )}

                {task2Feedback === "incorrect" && (
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-sm font-semibold"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>Keep trying! Look at the hint.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ==================================================== */}
          {/* TAB: TASK 3 (LISTEN & FILL) */}
          {/* ==================================================== */}
          {activeTab === "task3" && (
            <motion.div
              key="tab-task3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-surface rounded-3xl border border-gray-100 shadow-soft p-6 sm:p-10 space-y-6"
            >
              <div className="space-y-2">
                <span className="text-xs uppercase font-extrabold text-secondary tracking-wider block">
                  Task 3 (Listen &amp; Fill)
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slateText-heading">
                  Listen carefully and type the missing word.
                </h3>
              </div>

              {/* Audio Player Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3.5">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => playNativeAudio(currentWord.example)}
                    className="w-12 h-12 rounded-2xl bg-primary hover:bg-primary-hover flex items-center justify-center text-white shadow-soft transition-colors cursor-pointer"
                    title="Play sentence audio"
                  >
                    <Volume2 className="w-6 h-6" />
                  </motion.button>
                  <div>
                    <span className="font-bold text-slateText-heading text-sm block">
                      Audio Player
                    </span>
                    <span className="text-xs text-slateText-muted">
                      Click icon to listen to the sentence
                    </span>
                  </div>
                </div>
              </div>

              {/* Cloze Sentence */}
              <div className="p-5 rounded-2xl bg-surface border border-gray-200 text-slateText-heading text-lg font-medium text-center shadow-xs">
                &ldquo;The coach <span className="text-primary font-bold underline decoration-2 decoration-primary/40">______</span> each team five minutes...&rdquo;
              </div>

              {/* Input for missing word */}
              <div className="space-y-4">
                <input
                  type="text"
                  value={typedListenWord}
                  onChange={(e) => {
                    setTypedListenWord(e.target.value);
                    if (task3Feedback !== "idle") setTask3Feedback("idle");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleCheckTask3()}
                  placeholder="Enter word here..."
                  className="w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-slateText-heading font-medium text-lg placeholder:text-gray-400 transition-all shadow-inner"
                />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCheckTask3}
                  className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-sm sm:text-base shadow-soft transition-all cursor-pointer"
                >
                  Verify Answer
                </motion.button>
              </div>

              {/* Feedback Copy */}
              <AnimatePresence>
                {task3Feedback === "correct" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-2xl bg-tealAccent-light border border-tealAccent/30 flex items-center justify-between text-teal-900 font-bold"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-secondary" />
                      🎉 Awesome job! +10 Coins
                    </span>
                    <button
                      onClick={() => handleWordChange(onNextWord)}
                      className="text-xs bg-surface px-3 py-1.5 rounded-xl border border-tealAccent/30 shadow-xs font-extrabold hover:bg-tealAccent/10 cursor-pointer"
                    >
                      Next Word →
                    </button>
                  </motion.div>
                )}

                {task3Feedback === "incorrect" && (
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-700 text-sm font-semibold"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>Keep trying! Look at the hint.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Footer: [<- Previous Word] | [Next Word ->] */}
      <footer className="max-w-2xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex items-center justify-between pt-4 border-t border-gray-200/80">
          <motion.button
            whileHover={currentWordIndex > 0 ? { scale: 1.03 } : {}}
            whileTap={currentWordIndex > 0 ? { scale: 0.97 } : {}}
            onClick={() => handleWordChange(onPrevWord)}
            disabled={currentWordIndex === 0}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-sm border transition-all ${
              currentWordIndex === 0
                ? "bg-gray-100 text-slateText-muted border-gray-200 cursor-not-allowed opacity-50"
                : "bg-surface hover:bg-gray-50 text-slateText-heading border-gray-200 shadow-soft cursor-pointer"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>&lt;- Previous Word</span>
          </motion.button>

          <span className="text-xs font-bold text-slateText-muted">
            {currentWordIndex + 1} / {words.length}
          </span>

          <motion.button
            whileHover={currentWordIndex < words.length - 1 ? { scale: 1.03 } : {}}
            whileTap={currentWordIndex < words.length - 1 ? { scale: 0.97 } : {}}
            onClick={() => handleWordChange(onNextWord)}
            disabled={currentWordIndex >= words.length - 1}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
              currentWordIndex >= words.length - 1
                ? "bg-gray-100 text-slateText-muted border border-gray-200 cursor-not-allowed opacity-50"
                : "bg-primary hover:bg-primary-hover text-white shadow-soft cursor-pointer"
            }`}
          >
            <span>Next Word -&gt;</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </footer>
    </div>
  );
};
