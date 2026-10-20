"use client";

import React, { useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useVocab } from "@/components/layout/ClientLayout";
import { sampleWords, sampleUnits } from "@/data/vocabularyData";
import { WordItem, TestResultSession } from "@/types/vocabulary";
import {
  Trophy,
  Award,
  Sparkles,
  Heart,
  Volume2,
  Maximize2,
  ArrowRight,
  TrendingUp,
  Target,
  Bookmark,
  CheckCircle2,
  Clock,
  Zap,
  BarChart3,
  PieChart,
  Calendar,
  Layers,
  User,
  ShieldCheck,
  Flame,
  Coins,
  History,
  RotateCcw,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

function DashboardContent() {
  const router = useRouter();
  const { store, openWordDetails, openShop, playAudio, activePlayingWord } = useVocab();

  const user = store.currentUser || {
    name: "Ibrohim Akmalov",
    email: "talaba@ielts.uz",
    targetBand: "Band 7.5",
    joinedAt: "2026-10-10",
  };

  // Format study time from seconds into human-readable Uzbek string
  const formattedStudyTime = useMemo(() => {
    const totalSecs = store.studyTimeSeconds || 2100;
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);

    if (hours > 0) {
      return `${hours} soat ${minutes} daqiqa`;
    }
    return `${minutes} daqiqa`;
  }, [store.studyTimeSeconds]);

  // Test statistics
  const testHistory = store.testHistory || [];
  const totalTestsTaken = testHistory.length;

  const averageAccuracy = useMemo(() => {
    if (testHistory.length === 0) return 0;
    const total = testHistory.reduce((sum, item) => sum + item.accuracy, 0);
    return Math.round(total / testHistory.length);
  }, [testHistory]);

  const totalQuestionsAnswered = useMemo(() => {
    return testHistory.reduce((sum, item) => sum + item.totalQuestions, 0);
  }, [testHistory]);

  const totalCorrectQuestions = useMemo(() => {
    return testHistory.reduce((sum, item) => sum + item.correctAnswers, 0);
  }, [testHistory]);

  // Breakdown by mode
  const modeBreakdown = useMemo(() => {
    const counts = { quiz: 0, recall: 0, cloze: 0 };
    testHistory.forEach((t) => {
      if (counts[t.mode] !== undefined) {
        counts[t.mode] += 1;
      }
    });
    return counts;
  }, [testHistory]);

  // Resolve recently studied words from IDs
  const recentlyStudiedWords = useMemo(() => {
    return store.recentlyStudiedIds
      .map((id) => sampleWords.find((w) => w.id === id))
      .filter((w): w is WordItem => w !== undefined);
  }, [store.recentlyStudiedIds]);

  // Resolve favorite saved words
  const favoriteWords = useMemo(() => {
    return store.favoriteWordIds
      .map((id) => sampleWords.find((w) => w.id === id))
      .filter((w): w is WordItem => w !== undefined);
  }, [store.favoriteWordIds]);

  // Projected IELTS Band Calculation
  const masteredCount = store.learnedWordIds.length;
  const projectedBand = useMemo(() => {
    if (masteredCount >= 250)
      return {
        band: "Band 8.5",
        label: "Very High / Native-like Academic User",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10 border-emerald-500/20",
      };
    if (masteredCount >= 180)
      return {
        band: "Band 8.0",
        label: "Fluent Academic Discourse",
        color: "text-sky-500",
        bg: "bg-sky-500/10 border-sky-500/20",
      };
    if (masteredCount >= 100)
      return {
        band: "Band 7.5",
        label: "Good User with Lexical Flexibility",
        color: "text-indigo-500",
        bg: "bg-indigo-500/10 border-indigo-500/20",
      };
    if (masteredCount >= 40)
      return {
        band: "Band 6.5",
        label: "Competent User (Common Academic Core)",
        color: "text-amber-500",
        bg: "bg-amber-500/10 border-amber-500/20",
      };
    return {
      band: "Band 5.5",
      label: "Modest Foundation (Building Academic Base)",
      color: "text-slate-500",
      bg: "bg-slate-500/10 border-slate-500/20",
    };
  }, [masteredCount]);

  return (
    <div className="min-h-screen py-8 sm:py-12 space-y-10">
      {/* 1. Student Identity Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 via-primary to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-slateText-heading dark:text-white">
                  {user.name}
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-tealAccent-light dark:bg-tealAccent/20 text-teal-900 dark:text-tealAccent border border-tealAccent/30">
                  {user.targetBand}
                </span>
                {store.stats.hasGoldenCrown && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-400/20 text-amber-600 dark:text-amber-300 border border-amber-400/40 flex items-center gap-1">
                    👑 Oltin Toj
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slateText-muted">
                {user.email} • Ro&apos;yxatdan o&apos;tgan: {user.joinedAt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <Link
              href="/practice"
              className="px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-soft transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Yangi Test Ishlash</span>
            </Link>
            <button
              onClick={openShop}
              className="px-4 py-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/40 dark:border-amber-600/30 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Coins className="w-4 h-4 text-amber-500" />
              <span>{store.stats.totalCoins} Tangalar</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Student Metrics Grid (Time on Site, Tests Solved, Accuracy, Streak) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Metric 1: Nechta Test Yechgani */}
          <motion.div
            whileHover={{ y: -2 }}
            className="p-5 sm:p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-primary">
                Yechilgan Testlar
              </span>
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slateText-heading dark:text-white">
              {totalTestsTaken} <span className="text-xs text-slateText-muted font-bold">ta sessiya</span>
            </div>
            <p className="text-xs text-slateText-muted">
              Jami {totalQuestionsAnswered} ta savol ishlandi
            </p>
          </motion.div>

          {/* Metric 2: Qancha Vaqt Siteda Bo'lgani */}
          <motion.div
            whileHover={{ y: -2 }}
            className="p-5 sm:p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-tealAccent">
                O&apos;rganish Vaqti
              </span>
              <div className="w-8 h-8 rounded-xl bg-tealAccent/20 text-teal-800 dark:text-tealAccent flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slateText-heading dark:text-white">
              {formattedStudyTime}
            </div>
            <p className="text-xs text-tealAccent font-semibold">
              Xotirada real vaqt rejimida hisoblanadi
            </p>
          </motion.div>

          {/* Metric 3: O'rtacha Aniqlik (Accuracy) */}
          <motion.div
            whileHover={{ y: -2 }}
            className="p-5 sm:p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-500">
                O&apos;rtacha Aniqlik
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slateText-heading dark:text-white">
              {averageAccuracy}%
            </div>
            <p className="text-xs text-slateText-muted">
              {totalCorrectQuestions} ta to&apos;g&apos;ri javob
            </p>
          </motion.div>

          {/* Metric 4: Day Streak */}
          <motion.div
            whileHover={{ y: -2 }}
            className="p-5 sm:p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-secondary">
                Kunlik Seriya
              </span>
              <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slateText-heading dark:text-white">
              {store.stats.streakDays} <span className="text-xs text-slateText-muted font-bold">Kun</span>
            </div>
            <p className="text-xs text-secondary font-semibold">
              {store.stats.hasStreakFreeze ? "Freeze himoyasi ostida" : "Ketma-ket faol o'rganish"}
            </p>
          </motion.div>
        </div>
      </div>

      {/* 3. VISUAL DIAGRAMS (DIAGRAMMALAR) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="text-xl sm:text-2xl font-black text-slateText-heading dark:text-white">
              Student Natijalari Diagrammasi
            </h2>
          </div>
          <span className="text-xs font-bold text-slateText-muted">
            Oxirgi testlar bo&apos;yicha tahlil
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* DIAGRAMMA 1: Test Natijalari Dinamikasi (Test Accuracy Trend Bar Chart) */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slateText-heading dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span>Test Natijalari Aniqlik Grafigi (%)</span>
                </h3>
                <p className="text-xs text-slateText-muted mt-0.5">
                  Har bir yechilgan test sessiyasidagi to&apos;g&apos;ri javoblar foizi
                </p>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                O&apos;rtacha: {averageAccuracy}%
              </span>
            </div>

            {/* Visual SVG/CSS Interactive Chart */}
            {testHistory.length > 0 ? (
              <div className="pt-4">
                <div className="h-48 flex items-end justify-between gap-3 sm:gap-6 border-b border-slate-200 dark:border-slate-800 pb-2 px-2">
                  {testHistory.slice(0, 8).map((session, index) => {
                    const heightPercent = Math.max(15, session.accuracy);
                    const isGreat = session.accuracy >= 80;

                    return (
                      <div
                        key={session.id || index}
                        className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative"
                      >
                        {/* Tooltip on hover */}
                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-900 text-white text-[11px] font-bold py-1 px-2.5 rounded-lg whitespace-nowrap shadow-lg z-20">
                          {session.accuracy}% ({session.correctAnswers}/{session.totalQuestions})
                        </div>

                        {/* Animated Bar */}
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${heightPercent}%` }}
                          transition={{ duration: 0.6, delay: index * 0.08 }}
                          className={`w-full max-w-[42px] rounded-t-xl transition-all ${
                            isGreat
                              ? "bg-gradient-to-t from-primary to-tealAccent group-hover:brightness-110"
                              : "bg-gradient-to-t from-amber-500 to-amber-300"
                          }`}
                        />

                        {/* Label */}
                        <span className="text-[10px] font-extrabold text-slateText-muted">
                          T#{testHistory.length - index}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-xs text-slateText-muted pt-3">
                  <span>← Ilk testlar</span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-tealAccent" />
                      Yuqori ball (&ge;80%)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      O&apos;rtacha ball
                    </span>
                  </div>
                  <span>Oxirgi test →</span>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slateText-muted text-sm">
                Hali testlar topshirilmagan. Birinchi testingizni hoziroq ishlang!
              </div>
            )}
          </div>

          {/* DIAGRAMMA 2: Test Rejimlari Bo'yicha Taqsimot (Donut/Breakdown) */}
          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-6 flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slateText-heading dark:text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-primary" />
                <span>Test Turlari Taqsimoti</span>
              </h3>
              <p className="text-xs text-slateText-muted mt-0.5">
                Qaysi rejimda ko&apos;proq mashq qilingani
              </p>
            </div>

            <div className="space-y-4 py-2">
              {/* Meaning Quiz */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slateText-heading dark:text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                    Ma&apos;no Testi (Multiple Choice)
                  </span>
                  <span className="text-primary font-black">{modeBreakdown.quiz} marta</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${totalTestsTaken > 0 ? (modeBreakdown.quiz / totalTestsTaken) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              {/* Active Recall */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slateText-heading dark:text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-tealAccent" />
                    Imlo &amp; Yozish (Active Recall)
                  </span>
                  <span className="text-tealAccent font-black">{modeBreakdown.recall} marta</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-tealAccent rounded-full"
                    style={{
                      width: `${totalTestsTaken > 0 ? (modeBreakdown.recall / totalTestsTaken) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              {/* Sentence Cloze */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slateText-heading dark:text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    Gapni To&apos;ldirish (Cloze)
                  </span>
                  <span className="text-indigo-500 font-black">{modeBreakdown.cloze} marta</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{
                      width: `${totalTestsTaken > 0 ? (modeBreakdown.cloze / totalTestsTaken) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <Link
              href="/practice"
              className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary text-center text-xs font-bold text-primary dark:text-sky-300 transition-colors cursor-pointer block"
            >
              Yangi Rejimda Test Ishlash →
            </Link>
          </div>
        </div>
      </div>

      {/* 4. YECHILGAN TESTLAR TARIXI JADVALI (TEST HISTORY LOG) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-black text-slateText-heading dark:text-white">
              Oxirgi Testlar Tarixi
            </h3>
          </div>
          <span className="text-xs font-bold text-slateText-muted">
            Xotirada avtomatik qayd etilgan
          </span>
        </div>

        <div className="rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 text-[11px] font-black uppercase text-slateText-muted tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Sana</th>
                  <th className="py-3.5 px-4">Test Turi</th>
                  <th className="py-3.5 px-4">Unit</th>
                  <th className="py-3.5 px-4">Natija</th>
                  <th className="py-3.5 px-4">Aniqlik</th>
                  <th className="py-3.5 px-4">Vaqt</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Yutuq</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {testHistory.slice(0, 6).map((test) => {
                  const testDate = new Date(test.date);
                  const formattedDate = testDate.toLocaleDateString("uz-UZ", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr
                      key={test.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-slateText-heading dark:text-white">
                        {formattedDate}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="capitalize font-semibold text-slateText-body dark:text-slate-300">
                          {test.mode === "quiz"
                            ? "Ma'no Testi"
                            : test.mode === "recall"
                            ? "Imlo & Yozish"
                            : "Gap Cloze"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-primary">
                        {test.unit === "all" ? "Barcha Unitlar" : `Unit ${test.unit}`}
                      </td>
                      <td className="py-3.5 px-4 font-black text-slateText-heading dark:text-white">
                        {test.correctAnswers}/{test.totalQuestions}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-black ${
                            test.accuracy >= 80
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          }`}
                        >
                          {test.accuracy}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slateText-muted font-medium">
                        {Math.floor(test.timeSpentSeconds / 60)}d {test.timeSpentSeconds % 60}s
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right font-black text-amber-500">
                        +{test.coinsEarned} 🪙
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5. 15 TA UNIT BO'YICHA O'ZLASHTIRISH DARAXTI (UNIT MASTERY BREAKDOWN) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-tealAccent" />
            <h3 className="text-xl font-black text-slateText-heading dark:text-white">
              Unitlar Bo&apos;yicha O&apos;zlashtirish (1–15 Core)
            </h3>
          </div>
          <Link
            href="/vocabulary"
            className="text-xs font-bold text-primary dark:text-sky-400 hover:underline cursor-pointer"
          >
            Kutubxonada ko&apos;rish →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {sampleUnits.slice(0, 15).map((unit) => {
            const unitWords = sampleWords.filter((w) => w.unit === unit.id);
            const masteredInUnit = unitWords.filter((w) =>
              store.learnedWordIds.includes(w.id)
            ).length;
            const percent = Math.round((masteredInUnit / (unitWords.length || 20)) * 100);

            return (
              <div
                key={unit.id}
                className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-primary">Unit {unit.id}</span>
                  <span className="text-[11px] font-extrabold text-slateText-muted">
                    {masteredInUnit}/{unitWords.length || 20}
                  </span>
                </div>

                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-tealAccent rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Link
                    href={`/practice?unit=${unit.id}`}
                    className="text-[11px] font-bold text-tealAccent hover:underline flex items-center gap-0.5"
                  >
                    <span>Test ishlash</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </Link>
                  <span className="text-[11px] font-black text-slateText-muted">{percent}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Saved Bookmarks / Sevimli So'zlar Javoni */}
      {favoriteWords.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slateText-heading dark:text-white flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-rose-500 fill-rose-500" />
              <span>Saqlab Qo&apos;yilgan So&apos;zlar ({favoriteWords.length})</span>
            </h3>
            <Link
              href="/vocabulary"
              className="text-xs font-bold text-primary dark:text-sky-400 hover:underline cursor-pointer"
            >
              Filtrda ko&apos;rish →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {favoriteWords.map((word) => (
              <motion.div
                key={word.id}
                whileHover={{ y: -2 }}
                className="p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slateText-heading dark:text-white capitalize">
                      {word.word}
                    </span>
                    <span className="text-[10px] font-bold text-slateText-muted uppercase">
                      {word.partOfSpeech}
                    </span>
                  </div>
                  <p className="text-xs text-primary font-semibold">
                    {word.translations.uzbek}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => playAudio(word.word)}
                    className="p-2 rounded-xl text-slateText-muted hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Talaffuz"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => openWordDetails(word)}
                    className="p-2 rounded-xl text-slateText-muted hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Batafsil"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slateText-muted">Dashboard Yuklanmoqda...</p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
