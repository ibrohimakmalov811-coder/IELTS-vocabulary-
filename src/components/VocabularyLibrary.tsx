"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WordItem, PartOfSpeech, Unit } from "@/types/vocabulary";
import { WordCard } from "./WordCard";
import { 
  Search, 
  Filter, 
  RotateCcw, 
  LayoutGrid, 
  List, 
  ArrowUpDown, 
  BookOpen, 
  CheckCircle2, 
  Heart,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";

interface VocabularyLibraryProps {
  words: WordItem[];
  units: Unit[];
  learnedWordIds: string[];
  favoriteWordIds: string[];
  onToggleLearned: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onOpenDetails: (word: WordItem) => void;
  onPlayAudio: (text: string) => void;
  activePlayingWord: string | null;
  initialUnitFilter?: number | "all";
}

export const VocabularyLibrary: React.FC<VocabularyLibraryProps> = ({
  words,
  units,
  learnedWordIds,
  favoriteWordIds,
  onToggleLearned,
  onToggleFavorite,
  onOpenDetails,
  onPlayAudio,
  activePlayingWord,
  initialUnitFilter = "all",
}) => {
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<number | "all">(initialUnitFilter);
  const [selectedPos, setSelectedPos] = useState<PartOfSpeech | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "learned" | "unlearned" | "favorites">("all");
  const [sortBy, setSortBy] = useState<"az" | "za" | "unit" | "random">("unit");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [wordsPerPage, setWordsPerPage] = useState<number>(12);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedUnit("all");
    setSelectedPos("all");
    setSelectedStatus("all");
    setSortBy("unit");
    setCurrentPage(1);
  };

  // Filtered & Sorted vocabulary list
  const filteredWords = useMemo(() => {
    return words.filter((item) => {
      // 1. Search Query (English or Uzbek)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesWord = item.word.toLowerCase().includes(query);
        const matchesUzbek = item.translations.uzbek.toLowerCase().includes(query);
        const matchesDef = item.definition.toLowerCase().includes(query);
        if (!matchesWord && !matchesUzbek && !matchesDef) return false;
      }

      // 2. Unit filter
      if (selectedUnit !== "all" && item.unit !== selectedUnit) {
        return false;
      }

      // 3. Part of speech filter
      if (selectedPos !== "all" && item.partOfSpeech !== selectedPos) {
        return false;
      }

      // 4. Status filter
      if (selectedStatus === "learned" && !learnedWordIds.includes(item.id)) {
        return false;
      }
      if (selectedStatus === "unlearned" && learnedWordIds.includes(item.id)) {
        return false;
      }
      if (selectedStatus === "favorites" && !favoriteWordIds.includes(item.id)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "az") return a.word.localeCompare(b.word);
      if (sortBy === "za") return b.word.localeCompare(a.word);
      if (sortBy === "unit") return a.unit - b.unit || a.word.localeCompare(b.word);
      if (sortBy === "random") return Math.random() - 0.5;
      return 0;
    });
  }, [words, searchQuery, selectedUnit, selectedPos, selectedStatus, sortBy, learnedWordIds, favoriteWordIds]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredWords.length / wordsPerPage) || 1;
  const paginatedWords = useMemo(() => {
    const startIndex = (currentPage - 1) * wordsPerPage;
    return filteredWords.slice(startIndex, startIndex + wordsPerPage);
  }, [filteredWords, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans">
      {/* Library Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-widest text-primary px-2.5 py-1 rounded-full bg-primary-light dark:bg-primary/20">
              Vocabulary Library
            </span>
            <span className="text-xs text-slateText-muted font-bold">
              300+ Verified Words
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slateText-heading dark:text-white tracking-tight">
            Essential 5 Vocabulary Library
          </h1>
          <p className="text-sm sm:text-base text-slateText-body dark:text-slate-300 mt-1">
            Search, filter, practice, and listen to official IELTS vocabulary from Book 5.
          </p>
        </div>

        {/* View mode toggle (Grid vs List) */}
        <div className="flex items-center space-x-2 self-start md:self-auto">
          <div className="flex items-center bg-gray-100 dark:bg-slate-800 p-1 rounded-2xl border border-gray-200/60 dark:border-slate-700">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-surface dark:bg-slate-900 text-primary dark:text-tealAccent shadow-soft"
                  : "text-slateText-muted hover:text-slateText-heading dark:hover:text-white"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-surface dark:bg-slate-900 text-primary dark:text-tealAccent shadow-soft"
                  : "text-slateText-muted hover:text-slateText-heading dark:hover:text-white"
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="bg-surface dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-gray-100 dark:border-slate-800 shadow-soft space-y-4">
        {/* Row 1: Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slateText-muted absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by English word or Uzbek translation (e.g., 'allot' or 'ajratmoq')..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-slate-700 bg-background dark:bg-slate-800/80 text-slateText-heading dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm sm:text-base font-medium transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slateText-muted hover:text-slateText-heading p-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Row 2: Dropdown Filters & Controls */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 pt-1">
          {/* Unit Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slateText-muted block">
              Unit
            </label>
            <select
              value={selectedUnit}
              onChange={(e) => {
                setSelectedUnit(e.target.value === "all" ? "all" : Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slateText-heading dark:text-white focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="all">All Units (1-15)</option>
              {units.slice(0, 15).map((u) => (
                <option key={u.id} value={u.id}>
                  Unit {u.id}: {u.title.split(":")[1]?.trim() || u.title}
                </option>
              ))}
            </select>
          </div>

          {/* Part of Speech Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slateText-muted block">
              Word Type
            </label>
            <select
              value={selectedPos}
              onChange={(e) => {
                setSelectedPos(e.target.value as PartOfSpeech | "all");
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slateText-heading dark:text-white focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="verb">Verb (Fe'l)</option>
              <option value="noun">Noun (Ot)</option>
              <option value="adjective">Adjective (Sifat)</option>
              <option value="adverb">Adverb (Ravish)</option>
            </select>
          </div>

          {/* Learning Status Filter */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slateText-muted block">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value as any);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slateText-heading dark:text-white focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="all">All Words</option>
              <option value="learned">Learned ({learnedWordIds.length})</option>
              <option value="unlearned">Need Study ({words.length - learnedWordIds.length})</option>
              <option value="favorites">Favorites ({favoriteWordIds.length})</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slateText-muted block">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-surface dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slateText-heading dark:text-white focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="unit">By Unit (1 → 15)</option>
              <option value="az">Alphabetical (A → Z)</option>
              <option value="za">Alphabetical (Z → A)</option>
              <option value="random">Random Shuffle</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-1 flex items-end">
            <button
              onClick={handleResetFilters}
              className="w-full py-2.5 px-3 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-xs font-bold text-slateText-body dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* Counter & Active Tags */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slateText-muted pt-2 border-t border-gray-100 dark:border-slate-800 gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span>
              Ko&apos;rsatilyapti: <strong className="text-slateText-heading dark:text-white">{filteredWords.length}</strong> / {words.length} ta so&apos;z
            </span>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="font-semibold text-slateText-muted">Sahifada:</span>
              {[12, 24, 48, 301].map((count) => (
                <button
                  key={count}
                  onClick={() => {
                    setWordsPerPage(count);
                    setCurrentPage(1);
                  }}
                  className={`px-2 py-0.5 rounded-lg border text-[11px] font-bold transition-all cursor-pointer ${
                    wordsPerPage === count
                      ? "bg-primary text-white border-primary"
                      : "border-slate-200 dark:border-slate-700 text-slateText-muted hover:border-primary hover:text-primary dark:hover:text-white"
                  }`}
                >
                  {count === 301 ? "Barchasi" : count}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedUnit !== "all" && (
              <span className="px-2 py-0.5 rounded bg-primary-light text-primary dark:bg-primary/20 text-[11px] font-bold">
                Unit {selectedUnit}
              </span>
            )}
            {selectedPos !== "all" && (
              <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-slateText-heading dark:text-white text-[11px] font-bold uppercase">
                {selectedPos}
              </span>
            )}
            {selectedStatus !== "all" && (
              <span className="px-2 py-0.5 rounded bg-tealAccent-light text-teal-900 dark:bg-tealAccent/20 dark:text-tealAccent text-[11px] font-bold capitalize">
                {selectedStatus}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Vocabulary Cards Grid / List */}
      {filteredWords.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface dark:bg-slate-900 rounded-3xl p-12 text-center border border-gray-100 dark:border-slate-800 shadow-soft max-w-lg mx-auto space-y-4"
        >
          <div className="w-16 h-16 rounded-full bg-primary-light dark:bg-primary/20 flex items-center justify-center mx-auto text-primary">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slateText-heading dark:text-white">
              No matching vocabulary found
            </h3>
            <p className="text-sm text-slateText-body dark:text-slate-300">
              We couldn&apos;t find any word matching &ldquo;{searchQuery || "your active filters"}&rdquo;.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-soft transition-all cursor-pointer"
          >
            Reset All Filters
          </button>
        </motion.div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-3"
          }
        >
          {paginatedWords.map((word) => (
            <WordCard
              key={word.id}
              word={word}
              isLearned={learnedWordIds.includes(word.id)}
              isFavorite={favoriteWordIds.includes(word.id)}
              onToggleLearned={onToggleLearned}
              onToggleFavorite={onToggleFavorite}
              onOpenDetails={onOpenDetails}
              onPlayAudio={onPlayAudio}
              isPlayingAudio={activePlayingWord === word.word}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2.5 rounded-xl border flex items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
              currentPage === 1
                ? "border-gray-200 dark:border-slate-800 text-slateText-muted opacity-40 cursor-not-allowed"
                : "border-gray-200 dark:border-slate-700 text-slateText-heading dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Page numbers */}
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
              .map((pageNum, idx, arr) => {
                const prevNum = arr[idx - 1];
                const showEllipsis = prevNum && pageNum - prevNum > 1;

                return (
                  <React.Fragment key={pageNum}>
                    {showEllipsis && (
                      <span className="px-2 text-slateText-muted text-xs">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? "bg-primary text-white shadow-soft"
                          : "border border-gray-200 dark:border-slate-700 text-slateText-heading dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {pageNum}
                    </button>
                  </React.Fragment>
                );
              })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2.5 rounded-xl border flex items-center gap-1 text-xs font-bold transition-all cursor-pointer ${
              currentPage === totalPages
                ? "border-gray-200 dark:border-slate-800 text-slateText-muted opacity-40 cursor-not-allowed"
                : "border-gray-200 dark:border-slate-700 text-slateText-heading dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800"
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
