"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WordItem } from "@/types/vocabulary";
import { 
  X, 
  Volume2, 
  Heart, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  Sparkles,
  Layers,
  Share2
} from "lucide-react";

interface WordDetailModalProps {
  word: WordItem | null;
  isOpen: boolean;
  onClose: () => void;
  onPrevWord: () => void;
  onNextWord: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  isLearned: boolean;
  isFavorite: boolean;
  onToggleLearned: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onPlayAudio: (text: string) => void;
  isPlayingAudio: boolean;
  accent: "US" | "UK";
}

export const WordDetailModal: React.FC<WordDetailModalProps> = ({
  word,
  isOpen,
  onClose,
  onPrevWord,
  onNextWord,
  hasPrev,
  hasNext,
  isLearned,
  isFavorite,
  onToggleLearned,
  onToggleFavorite,
  onPlayAudio,
  isPlayingAudio,
  accent,
}) => {
  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onPrevWord();
      if (e.key === "ArrowRight" && hasNext) onNextWord();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, hasPrev, hasNext, onClose, onPrevWord, onNextWord]);

  if (!isOpen || !word) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="bg-surface dark:bg-slate-900 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-slate-800 space-y-6 my-auto"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary-light text-primary dark:bg-primary/20 dark:text-tealAccent">
              Unit {word.unit}
            </span>
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gray-100 dark:bg-slate-800 text-slateText-body dark:text-slate-300">
              {word.partOfSpeech}
            </span>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => onToggleFavorite(word.id)}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isFavorite
                  ? "bg-rose-50 text-rose-500 dark:bg-rose-950/40"
                  : "text-slateText-muted hover:text-rose-500 hover:bg-gray-100 dark:hover:bg-slate-800"
              }`}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-rose-500" : ""}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slateText-muted hover:text-slateText-heading dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Word Title & Audio Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-slateText-heading dark:text-white tracking-tight">
              {word.word}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-mono text-slateText-muted">
                {word.phonetic}
              </span>
              <span className="text-xs font-bold text-primary">
                ({accent === "US" ? "American" : "British"} Accent)
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPlayAudio(word.word)}
            className={`flex items-center space-x-2 px-5 py-3 rounded-2xl font-bold text-sm shadow-soft transition-all cursor-pointer ${
              isPlayingAudio
                ? "bg-primary text-white animate-pulse"
                : "bg-primary-light hover:bg-primary text-primary hover:text-white dark:bg-primary/20 dark:text-tealAccent border border-primary/20"
            }`}
          >
            <Volume2 className="w-5 h-5" />
            <span>🔊 Listen Pronunciation</span>
          </motion.button>
        </div>

        {/* Translation & Definitions */}
        <div className="space-y-4">
          {/* Main Uzbek Translation */}
          <div className="p-4 rounded-2xl bg-tealAccent-light/60 dark:bg-tealAccent/10 border border-tealAccent/30 space-y-1">
            <span className="text-xs font-black uppercase text-teal-900 dark:text-tealAccent tracking-wider block">
              O&apos;zbekcha Tarjimasi
            </span>
            <p className="text-xl font-bold text-teal-950 dark:text-teal-200">
              {word.translations.uzbek}
            </p>
            {word.uzbekDefinition && (
              <p className="text-xs text-teal-900/80 dark:text-teal-300 italic pt-1">
                {word.uzbekDefinition}
              </p>
            )}
          </div>

          {/* English Definition */}
          <div className="space-y-1.5">
            <span className="text-xs uppercase font-extrabold text-slateText-muted tracking-wider block">
              English Definition
            </span>
            <p className="text-base sm:text-lg text-slateText-heading dark:text-slate-100 font-medium leading-relaxed">
              {word.definition}
            </p>
          </div>

          {/* Contextual Sentence Example */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slateText-muted uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-primary" /> Sentence Example
              </span>
              <button
                onClick={() => onPlayAudio(word.example)}
                className="text-xs font-bold text-primary dark:text-tealAccent hover:underline cursor-pointer"
              >
                Listen Sentence 🔊
              </button>
            </div>
            <p className="text-base text-slateText-heading dark:text-white italic">
              &ldquo;{word.example}&rdquo;
            </p>
            {word.uzbekExample && (
              <p className="text-xs text-slateText-muted pt-2 border-t border-gray-200/50 dark:border-slate-700/50">
                {word.uzbekExample}
              </p>
            )}
          </div>

          {/* Collocations & Synonyms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {word.synonyms && word.synonyms.length > 0 && (
              <div className="p-3.5 rounded-xl border border-gray-100 dark:border-slate-800 bg-surface dark:bg-slate-900 space-y-1.5">
                <span className="text-xs font-bold text-slateText-muted block">Related Synonyms:</span>
                <div className="flex flex-wrap gap-1.5">
                  {word.synonyms.map((s, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-tealAccent-light dark:bg-tealAccent/20 text-teal-900 dark:text-tealAccent text-xs font-semibold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {word.collocations && word.collocations.length > 0 && (
              <div className="p-3.5 rounded-xl border border-gray-100 dark:border-slate-800 bg-surface dark:bg-slate-900 space-y-1.5">
                <span className="text-xs font-bold text-slateText-muted block">Common Collocations:</span>
                <div className="flex flex-wrap gap-1.5">
                  {word.collocations.map((c, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-slate-800 text-slateText-body dark:text-slate-300 text-xs font-medium"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Navigation & Mastered Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-slate-800">
          {/* Previous / Next buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onPrevWord}
              disabled={!hasPrev}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                hasPrev
                  ? "border-gray-200 dark:border-slate-700 text-slateText-heading dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800"
                  : "border-gray-100 dark:border-slate-800 text-slateText-muted opacity-40 cursor-not-allowed"
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={onNextWord}
              disabled={!hasNext}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                hasNext
                  ? "border-gray-200 dark:border-slate-700 text-slateText-heading dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800"
                  : "border-gray-100 dark:border-slate-800 text-slateText-muted opacity-40 cursor-not-allowed"
              }`}
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mark Learned Action */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onToggleLearned(word.id)}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isLearned
                ? "bg-emerald-500 text-white shadow-soft"
                : "bg-primary hover:bg-primary-hover text-white shadow-soft"
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{isLearned ? "Mastered (Click to Unmark)" : "Mark Word as Learned"}</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
