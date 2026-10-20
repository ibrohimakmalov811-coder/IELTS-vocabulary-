"use client";

import React from "react";
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Volume2,
  Globe,
  Zap,
  ArrowRight,
  Award,
  Layers,
  HeartHandshake,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";

export default function AboutPage() {
  return (
    <div className="min-h-screen py-10 sm:py-16 space-y-16">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-primary-light dark:bg-primary/20 text-primary dark:text-sky-300 border border-primary/30">
          <GraduationCap className="w-4 h-4" />
          <span>About IELTS Vocabulary Master</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slateText-heading dark:text-white tracking-tight leading-tight">
          Empowering IELTS Candidates with High-Frequency Lexical Mastery
        </h1>

        <p className="text-base sm:text-lg text-slateText-body dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Built on Professor Paul Nation&apos;s renowned <em>4000 Essential English Words Book 5</em>, this platform delivers an interactive, distraction-free environment for students aiming for IELTS Band 7.0 to 8.5+.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/vocabulary"
            className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white font-extrabold text-sm flex items-center gap-2 shadow-soft transition-all cursor-pointer"
          >
            <span>Explore 301 Words</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/practice"
            className="px-6 py-3 rounded-2xl bg-surface dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slateText-heading dark:text-white font-extrabold text-sm transition-all cursor-pointer"
          >
            Start Quiz Arena
          </Link>
        </div>
      </div>

      {/* The Curriculum & Academic Foundation */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-8 shadow-soft">
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-tealAccent">
              The Academic Pedagogy
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slateText-heading dark:text-white">
              Why Paul Nation&apos;s Book 5 Matters for IELTS
            </h2>
            <p className="text-sm sm:text-base text-slateText-body dark:text-slate-300 leading-relaxed">
              In the IELTS Academic exam, Lexical Resource accounts for 25% of your total score in Writing and Speaking, and directly dictates comprehension speed in Academic Reading. The words in Book 5 sit at the exact inflection point between intermediate fluency and advanced academic competence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-surface dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slateText-heading dark:text-white">
                301 Active Core Words
              </h3>
              <p className="text-xs text-slateText-body dark:text-slate-300">
                Units 1 through 15 transcribed faithfully with genuine IPA phonetics, parts of speech, and academic contexts.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-tealAccent/20 text-teal-800 dark:text-tealAccent flex items-center justify-center font-bold">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slateText-heading dark:text-white">
                Uzbek Bilingual Scaffolding
              </h3>
              <p className="text-xs text-slateText-body dark:text-slate-300">
                Native translations designed specifically for Central Asian students to eliminate ambiguity in nuanced definitions.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-slateText-heading dark:text-white">
                US & UK Dual Speech
              </h3>
              <p className="text-xs text-slateText-body dark:text-slate-300">
                Auditory exposure to both General American and British accents to prepare for diverse IELTS Listening audio speakers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Engineering & Design Philosophy */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-black uppercase tracking-wider text-primary">
            Platform Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slateText-heading dark:text-white">
            Built for Privacy, Speed & Zero Distraction
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <h3 className="font-bold text-base text-slateText-heading dark:text-white">
                Local-First Offline Persistence
              </h3>
            </div>
            <p className="text-xs text-slateText-body dark:text-slate-300 leading-relaxed">
              Your learning streak, coin balance, mastered words, and bookmarked favorites are saved locally in your browser storage. No invasive trackers, no mandatory sign-ups, and instant zero-latency loading.
            </p>
          </div>

          <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-base text-slateText-heading dark:text-white">
                Modern Next.js 16 & Tailwind Stack
              </h3>
            </div>
            <p className="text-xs text-slateText-body dark:text-slate-300 leading-relaxed">
              Crafted with Next.js App Router, Tailwind CSS v4 design tokens, and Framer Motion micro-interactions to create a fluid, calming study environment that makes long study sessions effortless.
            </p>
          </div>
        </div>
      </div>

      {/* Curriculum Roadmap */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-primary">
                Curriculum Progression
              </span>
              <h3 className="text-2xl font-black text-slateText-heading dark:text-white mt-1">
                Book 5 Coverage Roadmap
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Units 1–15 Live Now
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                  Phase 1: Units 1–15 (301 Words) — Complete & Verified
                </h4>
                <p className="text-xs text-slateText-body dark:text-slate-300 mt-0.5">
                  Full coverage of the initial 15 units including definitions, IPA phonetics, context sentences with highlighted target words, Uzbek translations, collocations, and active recall quizzes.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3 opacity-90">
              <Layers className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm text-slateText-heading dark:text-white">
                  Phase 2: Units 16–30 (Next 300 Words) — Curriculum Expansion
                </h4>
                <p className="text-xs text-slateText-body dark:text-slate-300 mt-0.5">
                  Roadmap expansion to cover the remaining 15 units of 4000 Essential English Words Book 5, bringing total mastery to 600 advanced academic words.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
