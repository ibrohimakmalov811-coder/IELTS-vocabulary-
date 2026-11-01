"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useVocab } from "@/components/layout/ClientLayout";
import { getUserWeakWords } from "@/lib/services/weakWordService";
import { sampleWords } from "@/data/vocabularyData";
import { WeakWordRecord, WordItem } from "@/types/vocabulary";
import {
  AlertTriangle,
  Flame,
  Volume2,
  Zap,
  RotateCcw,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Clock,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

function WeakWordsContent() {
  const { store, playAudio, activePlayingWord, openWordDetails } = useVocab();
  const [weakWords, setWeakWords] = useState<WeakWordRecord[]>([]);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<number | "all">("all");

  useEffect(() => {
    let isMounted = true;
    getUserWeakWords(store.currentUser?.id).then((res) => {
      if (isMounted) {
        setWeakWords(res.weakWords);
        setIsPersonalized(res.isPersonalized);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [store.currentUser]);

  const filteredWords = useMemo(() => {
    if (selectedUnit === "all") return weakWords;
    return weakWords.filter((w) => w.unit === selectedUnit);
  }, [weakWords, selectedUnit]);

  return (
    <div className="min-h-screen py-8 sm:py-12 space-y-10">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <AlertTriangle className="w-4 h-4" />
          <span>Xatolarni Tahlil Qilish &amp; Mustahkamlash</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slateText-heading dark:text-white tracking-tight">
          My Weak Words — Qiyin So&apos;zlar
        </h1>

        <p className="text-sm sm:text-base text-slateText-body dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Testlarda ko&apos;p xato qilingan yoki xotiradan tez ko&apos;tariladigan so&apos;zlar tizim tomonidan avtomatik qayd etiladi. Ushbu so&apos;zlarni muntazam takrorlash orqali imtihonda 100% aniqlikka erishing.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Banner with Stats & Action */}
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-rose-500 text-white">
                {weakWords.length} ta so&apos;z
              </span>
              {isPersonalized ? (
                <span className="text-xs font-bold text-tealAccent">
                  ✓ Sizning shaxsiy test tarixingiz asosida
                </span>
              ) : (
                <span className="text-xs font-bold text-amber-500">
                  ⚡ Tavsiya etilgan eng murakkab akademik so&apos;zlar
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slateText-body dark:text-slate-300">
              Qiyin so&apos;zlar bo&apos;yicha alohida 10 savollik maqsadli test yechib, xatolaringizni to&apos;g&apos;rilang.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/practice"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-soft transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Qiyin So&apos;zlar Bo&apos;yicha Test Boshlash</span>
            </Link>
          </div>
        </div>

        {/* Filter by Unit */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-xs font-bold text-slateText-muted uppercase tracking-wider shrink-0">
              Unit:
            </span>
            <button
              onClick={() => setSelectedUnit("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                selectedUnit === "all"
                  ? "bg-primary text-white"
                  : "bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slateText-body dark:text-slate-300"
              }`}
            >
              Barchasi ({weakWords.length})
            </button>
            {Array.from({ length: 15 }, (_, i) => i + 1).map((u) => {
              const count = weakWords.filter((w) => w.unit === u).length;
              if (count === 0) return null;
              return (
                <button
                  key={u}
                  onClick={() => setSelectedUnit(u)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                    selectedUnit === u
                      ? "bg-primary text-white"
                      : "bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slateText-body dark:text-slate-300"
                  }`}
                >
                  Unit {u} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Weak Words Cards Grid */}
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredWords.length === 0 ? (
          <div className="p-12 text-center rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slateText-heading dark:text-white">
              Ajoyib natija!
            </h3>
            <p className="text-xs sm:text-sm text-slateText-body dark:text-slate-300 max-w-md mx-auto">
              Siz ushbu bo&apos;limdagi barcha so&apos;zlarni to&apos;g&apos;ri yechgansiz yoki hali xatolar aniqlanmagan. Mashq qilishda davom eting!
            </p>
            <Link
              href="/practice"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-soft"
            >
              <span>Yangi test topshirish</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredWords.map((item) => (
              <motion.div
                key={item.wordId}
                whileHover={{ y: -3 }}
                className="p-6 rounded-3xl glass-card border border-rose-200/60 dark:border-rose-900/40 flex flex-col justify-between space-y-4 shadow-xs relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        Unit {item.unit}
                      </span>
                      {item.mistakeCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400">
                          {item.mistakeCount} marta xato
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => playAudio(item.word)}
                      className="p-1.5 rounded-lg text-slateText-muted hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Pronounce"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-2xl font-black text-slateText-heading dark:text-white capitalize">
                        {item.word}
                      </h3>
                      <span className="text-xs text-slateText-muted italic font-mono">
                        {item.phonetic}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                      {item.translationUz}
                    </p>
                    <p className="text-xs text-slateText-body dark:text-slate-300 mt-1 line-clamp-2">
                      &quot;{item.definition}&quot;
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slateText-body dark:text-slate-300 italic">
                    {item.example}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 text-xs">
                  <Link
                    href={`/practice?word=${encodeURIComponent(item.word)}`}
                    className="font-bold text-primary dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Testda qayta tekshirish</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => {
                      const fullWord = sampleWords.find((w: WordItem) => w.id === item.wordId);
                      if (fullWord) openWordDetails(fullWord);
                    }}
                    className="text-[11px] font-bold text-slateText-muted hover:text-slateText-heading dark:hover:text-white cursor-pointer"
                  >
                    Batafsil
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function WeakWordsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <WeakWordsContent />
    </Suspense>
  );
}
