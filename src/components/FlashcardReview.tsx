"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WordItem, Unit } from "@/types/vocabulary";
import { 
  Volume2, 
  RotateCw, 
  Shuffle, 
  Check, 
  X, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  HelpCircle,
  Eye
} from "lucide-react";
import confetti from "canvas-confetti";

interface FlashcardReviewProps {
  words: WordItem[];
  units: Unit[];
  learnedWordIds: string[];
  onToggleLearned: (id: string) => void;
  onPlayAudio: (text: string) => void;
  isPlayingAudio: boolean;
  onEarnCoins: (amount: number) => void;
}

export const FlashcardReview: React.FC<FlashcardReviewProps> = ({
  words,
  units,
  learnedWordIds,
  onToggleLearned,
  onPlayAudio,
  isPlayingAudio,
  onEarnCoins,
}) => {
  const [selectedUnit, setSelectedUnit] = useState<number | "all">("all");
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledSeed, setShuffledSeed] = useState(0);

  // Filtered flashcard deck
  const deck = useMemo(() => {
    let list = selectedUnit === "all" ? [...words] : words.filter((w) => w.unit === selectedUnit);
    if (shuffledSeed > 0) {
      list = [...list].sort(() => Math.random() - 0.5);
    }
    return list;
  }, [words, selectedUnit, shuffledSeed]);

  const currentWord = deck[cardIndex] || deck[0];
  const isLearned = currentWord ? learnedWordIds.includes(currentWord.id) : false;

  const handleNext = () => {
    setIsFlipped(false);
    if (cardIndex < deck.length - 1) {
      setCardIndex(cardIndex + 1);
    } else {
      setCardIndex(0); // loop
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (cardIndex > 0) {
      setCardIndex(cardIndex - 1);
    }
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setCardIndex(0);
    setShuffledSeed((prev) => prev + 1);
  };

  const handleKnowIt = () => {
    if (!isLearned && currentWord) {
      onToggleLearned(currentWord.id);
      onEarnCoins(5);
      try {
        confetti({
          particleCount: 30,
          spread: 45,
          origin: { y: 0.7 },
          colors: ["#50E3C2", "#4A90E2", "#F5A623"],
        });
      } catch (e) {}
    }
    handleNext();
  };

  const handleStillLearning = () => {
    if (isLearned && currentWord) {
      onToggleLearned(currentWord.id); // unmark if they feel they need to review
    }
    handleNext();
  };

  if (!currentWord) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 font-sans">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-tealAccent px-2.5 py-1 rounded-full bg-tealAccent-light dark:bg-tealAccent/20 text-teal-900 dark:text-tealAccent">
            Active Recall Flashcards
          </span>
          <h1 className="text-3xl font-extrabold text-slateText-heading dark:text-white tracking-tight mt-1">
            Flashcards Revision Mode
          </h1>
          <p className="text-xs sm:text-sm text-slateText-body dark:text-slate-300">
            Click the card to flip and reveal the Uzbek translation, definition, and example.
          </p>
        </div>

        {/* Unit Filter & Shuffle */}
        <div className="flex items-center space-x-2">
          <select
            value={selectedUnit}
            onChange={(e) => {
              setSelectedUnit(e.target.value === "all" ? "all" : Number(e.target.value));
              setCardIndex(0);
              setIsFlipped(false);
            }}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs font-bold text-slateText-heading dark:text-white focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="all">All Units ({words.length} cards)</option>
            {units.slice(0, 15).map((u) => (
              <option key={u.id} value={u.id}>
                Unit {u.id}
              </option>
            ))}
          </select>

          <button
            onClick={handleShuffle}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-xs font-bold text-slateText-heading dark:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Shuffle deck"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle</span>
          </button>
        </div>
      </div>

      {/* Progress Bar & Deck Counter */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs font-bold text-slateText-muted">
          <span>
            Card {cardIndex + 1} of {deck.length}
          </span>
          <span>
            {Math.round(((cardIndex + 1) / deck.length) * 100)}% Through Deck
          </span>
        </div>
        <div className="w-full h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-tealAccent transition-all duration-300 rounded-full"
            style={{ width: `${((cardIndex + 1) / deck.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 3D Interactive Flashcard */}
      <div className="w-full max-w-xl mx-auto perspective-1000 py-4">
        <motion.div
          whileHover={{ scale: 1.01 }}
          onClick={() => setIsFlipped(!isFlipped)}
          className={`min-h-[340px] sm:min-h-[380px] w-full rounded-3xl border p-8 flex flex-col justify-between shadow-soft cursor-pointer transition-all duration-300 relative select-none ${
            isFlipped
              ? "bg-gradient-to-br from-tealAccent-light/70 via-surface to-surface dark:from-slate-900 dark:to-slate-800 border-tealAccent/40"
              : "bg-surface dark:bg-slate-900 border-gray-200/80 dark:border-slate-800 hover:border-primary/50 hover:shadow-card-hover"
          }`}
        >
          {/* Top metadata of card */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-light text-primary dark:bg-primary/20 dark:text-tealAccent">
                Unit {currentWord.unit}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slateText-muted">
                {currentWord.partOfSpeech}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slateText-muted font-semibold flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5" /> Flip Card
              </span>
            </div>
          </div>

          {/* Card Body (Front vs Back) */}
          <div className="my-auto py-6 text-center space-y-4">
            {!isFlipped ? (
              /* FRONT OF CARD */
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div>
                  <h2 className="text-4xl sm:text-5xl font-black text-slateText-heading dark:text-white tracking-tight">
                    {currentWord.word}
                  </h2>
                  <p className="text-sm font-mono text-slateText-muted mt-2">
                    {currentWord.phonetic}
                  </p>
                </div>

                {/* Pronounce button */}
                <div className="pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlayAudio(currentWord.word);
                    }}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      isPlayingAudio
                        ? "bg-primary text-white border-primary shadow-soft animate-pulse"
                        : "bg-primary-light text-primary dark:bg-primary/20 dark:text-tealAccent border-primary/20 hover:bg-primary hover:text-white"
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Pronounce</span>
                  </button>
                </div>

                <p className="text-xs text-slateText-muted pt-4">
                  (Click card to see Uzbek translation &amp; definition)
                </p>
              </motion.div>
            ) : (
              /* BACK OF CARD */
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 text-left"
              >
                {/* Uzbek Meaning */}
                <div className="space-y-1">
                  <span className="text-xs uppercase font-extrabold text-tealAccent tracking-wider block">
                    O&apos;zbekcha Tarjima:
                  </span>
                  <p className="text-2xl font-bold text-slateText-heading dark:text-white">
                    {currentWord.translations.uzbek}
                  </p>
                </div>

                {/* English Definition */}
                <div className="space-y-1">
                  <span className="text-xs uppercase font-extrabold text-slateText-muted tracking-wider block">
                    Definition:
                  </span>
                  <p className="text-sm sm:text-base text-slateText-body dark:text-slate-200 font-medium">
                    {currentWord.definition}
                  </p>
                </div>

                {/* Example sentence */}
                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700">
                  <p className="text-xs sm:text-sm text-slateText-heading dark:text-white italic">
                    &ldquo;{currentWord.example}&rdquo;
                  </p>
                  {currentWord.uzbekExample && (
                    <p className="text-xs text-slateText-muted pt-1 border-t border-gray-200/40 dark:border-slate-700/40 mt-1">
                      {currentWord.uzbekExample}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer cue */}
          <div className="text-center text-xs text-slateText-muted font-medium pt-2 border-t border-gray-100 dark:border-slate-800">
            {isLearned ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center gap-1">
                <Check className="w-3.5 h-3.5" /> Mastered in your vocabulary
              </span>
            ) : (
              <span>Still learning • Practice daily for retention</span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Review Action Controls */}
      <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          onClick={handleStillLearning}
          className="w-full sm:w-1/2 py-3.5 px-4 rounded-2xl border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-slateText-heading dark:text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 text-amber-500" />
          <span>Still Learning (Next)</span>
        </button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleKnowIt}
          className="w-full sm:w-1/2 py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-soft transition-all cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>Know It! (+5 Coins)</span>
        </motion.button>
      </div>

      {/* Navigation shortcuts */}
      <div className="flex items-center justify-center space-x-6 pt-2 text-xs text-slateText-muted">
        <button
          onClick={handlePrev}
          disabled={cardIndex === 0}
          className="hover:text-slateText-heading dark:hover:text-white flex items-center gap-1 disabled:opacity-30 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> Previous Card
        </button>
        <span>•</span>
        <button
          onClick={handleNext}
          className="hover:text-slateText-heading dark:hover:text-white flex items-center gap-1 cursor-pointer"
        >
          Next Card <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
