"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WordItem } from "@/types/vocabulary";
import { 
  Volume2, 
  VolumeX, 
  Check, 
  Heart, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Maximize2,
  Sparkles,
  Tag
} from "lucide-react";

interface WordCardProps {
  word: WordItem;
  isLearned: boolean;
  isFavorite: boolean;
  onToggleLearned: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onOpenDetails: (word: WordItem) => void;
  onPlayAudio: (text: string) => void;
  isPlayingAudio: boolean;
  viewMode?: "grid" | "list";
}

export const WordCard: React.FC<WordCardProps> = ({
  word,
  isLearned,
  isFavorite,
  onToggleLearned,
  onToggleFavorite,
  onOpenDetails,
  onPlayAudio,
  isPlayingAudio,
  viewMode = "grid",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPosBadgeClass = (pos: string) => {
    switch (pos) {
      case "verb":
        return "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200/60";
      case "noun":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200/60";
      case "adjective":
        return "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200/60";
      case "adverb":
        return "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200/60";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200";
    }
  };

  if (viewMode === "list") {
    return (
      <motion.div
        layout
        whileHover={{ scale: 1.008 }}
        className={`bg-surface dark:bg-slate-900/90 rounded-2xl border p-4 sm:p-5 transition-all shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isLearned
            ? "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20"
            : "border-gray-100 dark:border-slate-800 hover:border-primary/40"
        }`}
      >
        <div className="flex items-start md:items-center gap-4 flex-1">
          {/* Audio button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => onPlayAudio(word.word)}
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
              isPlayingAudio
                ? "bg-primary text-white border-primary shadow-glow-teal animate-pulse"
                : "bg-primary-light text-primary dark:bg-primary/20 dark:text-tealAccent border-primary/20 hover:bg-primary hover:text-white"
            }`}
            title="Listen to pronunciation"
          >
            <Volume2 className="w-5 h-5" />
          </motion.button>

          {/* Word & Core translation */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 
                onClick={() => onOpenDetails(word)}
                className="text-xl font-extrabold text-slateText-heading dark:text-white cursor-pointer hover:text-primary transition-colors"
              >
                {word.word}
              </h3>
              <span className="text-xs font-mono text-slateText-muted">
                {word.phonetic}
              </span>
              <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-full border ${getPosBadgeClass(word.partOfSpeech)}`}>
                {word.partOfSpeech}
              </span>
              <span className="text-[11px] font-semibold text-slateText-muted bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                Unit {word.unit}
              </span>
            </div>
            <p className="text-sm font-bold text-primary dark:text-tealAccent">
              {word.translations.uzbek}
            </p>
            <p className="text-xs text-slateText-body dark:text-slate-300 line-clamp-1">
              {word.definition}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggleFavorite(word.id)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isFavorite
                ? "bg-rose-50 text-rose-500 border-rose-200 dark:bg-rose-950/40"
                : "text-slateText-muted hover:text-rose-500 border-gray-100 dark:border-slate-800"
            }`}
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-rose-500" : ""}`} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggleLearned(word.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-colors cursor-pointer ${
              isLearned
                ? "bg-emerald-500 text-white border-emerald-500 shadow-xs"
                : "border-gray-200 dark:border-slate-700 text-slateText-body dark:text-slate-300 hover:border-emerald-400"
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isLearned ? "Learned" : "Mark Learned"}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpenDetails(word)}
            className="p-2 rounded-xl text-slateText-body dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-700 cursor-pointer"
            title="Open Details Modal"
          >
            <Maximize2 className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Grid Card View (Default)
  return (
    <motion.div
      layout
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`bg-surface dark:bg-slate-900/90 rounded-3xl border p-5 sm:p-6 transition-all shadow-soft flex flex-col justify-between relative group ${
        isLearned
          ? "border-emerald-200/80 dark:border-emerald-900/50 bg-gradient-to-b from-emerald-50/25 to-surface dark:from-emerald-950/20 dark:to-slate-900"
          : "border-gray-100 dark:border-slate-800 hover:border-primary/40 hover:shadow-card-hover"
      }`}
    >
      {/* Top Header: Unit & Actions */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slateText-muted bg-gray-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
            Unit {word.unit}
          </span>
          <span className={`text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full border ${getPosBadgeClass(word.partOfSpeech)}`}>
            {word.partOfSpeech}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => onToggleFavorite(word.id)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isFavorite
                ? "text-rose-500 bg-rose-50 dark:bg-rose-950/30"
                : "text-slateText-muted hover:text-rose-500"
            }`}
            title={isFavorite ? "Remove favorite" : "Save to favorites"}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-rose-500" : ""}`} />
          </button>

          <button
            onClick={() => onOpenDetails(word)}
            className="p-1.5 rounded-lg text-slateText-muted hover:text-primary transition-colors cursor-pointer"
            title="Expand Full Details"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Word Block */}
      <div className="pt-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 
              onClick={() => onOpenDetails(word)}
              className="text-2xl font-black text-slateText-heading dark:text-white tracking-tight cursor-pointer hover:text-primary transition-colors"
            >
              {word.word}
            </h3>
            <span className="text-xs font-mono text-slateText-muted font-medium">
              {word.phonetic}
            </span>
          </div>

          {/* Working Audio Play Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => onPlayAudio(word.word)}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
              isPlayingAudio
                ? "bg-primary text-white border-primary shadow-glow-teal animate-pulse"
                : "bg-primary-light text-primary dark:bg-primary/20 dark:text-tealAccent border-primary/20 hover:bg-primary hover:text-white"
            }`}
            title="Listen to native pronunciation"
          >
            <Volume2 className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Primary Translation & Definition */}
        <div className="space-y-1">
          <div className="text-sm font-extrabold text-primary dark:text-tealAccent flex items-baseline gap-1.5">
            <span>{word.translations.uzbek}</span>
          </div>
          <p className="text-xs sm:text-sm text-slateText-heading dark:text-slate-200 font-medium leading-relaxed">
            {word.definition}
          </p>
          {word.uzbekDefinition && (
            <p className="text-xs text-slateText-muted italic">
              {word.uzbekDefinition}
            </p>
          )}
        </div>

        {/* English Example Sentence & Translation */}
        <div className="p-3.5 rounded-2xl bg-gray-50/90 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slateText-muted uppercase tracking-wider">
            <BookOpen className="w-3 h-3 text-primary" />
            <span>Example</span>
          </div>
          <p className="text-xs sm:text-sm text-slateText-heading dark:text-slate-100 font-medium italic">
            &ldquo;{word.example}&rdquo;
          </p>
          {word.uzbekExample && (
            <p className="text-[11px] text-slateText-muted pt-0.5 border-t border-gray-200/50 dark:border-slate-700/50">
              {word.uzbekExample}
            </p>
          )}
        </div>

        {/* Expandable Section for Synonyms & Collocations */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 pt-2 border-t border-gray-100 dark:border-slate-800 text-xs overflow-hidden"
            >
              {word.synonyms && word.synonyms.length > 0 && (
                <div>
                  <span className="font-bold text-slateText-muted block mb-1">Synonyms:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {word.synonyms.map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-tealAccent-light dark:bg-tealAccent/15 text-teal-900 dark:text-tealAccent font-semibold text-[11px]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {word.collocations && word.collocations.length > 0 && (
                <div>
                  <span className="font-bold text-slateText-muted block mb-1">Collocations:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {word.collocations.map((c, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-slate-800 text-slateText-body dark:text-slate-300 font-medium text-[11px]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card Footer Controls */}
      <div className="pt-4 mt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between gap-2">
        {/* Toggle Expand */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-slateText-muted hover:text-slateText-heading dark:hover:text-white flex items-center gap-1 cursor-pointer"
        >
          <span>{isExpanded ? "Less" : "Collocations"}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {/* Mark as Learned Toggle */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onToggleLearned(word.id)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
            isLearned
              ? "bg-emerald-500 text-white border-emerald-500 shadow-soft"
              : "border-gray-200 dark:border-slate-700 text-slateText-body dark:text-slate-300 hover:border-emerald-400 hover:text-emerald-600"
          }`}
        >
          <Check className="w-3.5 h-3.5" />
          <span>{isLearned ? "Mastered" : "Mark Learned"}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
