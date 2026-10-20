"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, BookOpenCheck, Gamepad2, Gift, CheckCircle2 } from "lucide-react";

interface LandingHeroProps {
  onStart: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStart }) => {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Decorative Pastel Ambient Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-primary-light/40 via-tealAccent-light/20 to-transparent pointer-events-none rounded-full blur-3xl -z-10" />

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-surface border border-gray-200/80 shadow-soft">
            <span className="flex h-2 w-2 rounded-full bg-tealAccent animate-pulse" />
            <span className="text-xs font-semibold text-slateText-heading tracking-wide">
              Based on 4000 Essential English Words Book 5
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slateText-heading tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Master IELTS Vocabulary, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary to-tealAccent bg-clip-text text-transparent">
              Effortlessly.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-slateText-body max-w-2xl mx-auto font-normal leading-relaxed">
            Stop memorizing boring lists. Learn, practice, and master the &apos;Essential 5&apos; vocabulary with interactive games, native pronunciation, and smart repetition.
          </p>

          {/* CTA Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={onStart}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary hover:bg-primary-hover text-white font-semibold text-base sm:text-lg shadow-soft flex items-center justify-center gap-2.5 transition-all group cursor-pointer"
            >
              <span>Start Learning for Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>

          {/* Quick social proof / trust */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs sm:text-sm text-slateText-muted">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-tealAccent" />
              <span>Target Band 7.0 - 8.5</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Uzbek &amp; Russian translations</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-secondary" />
              <span>Native audio &amp; gamified coins</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-bold text-primary tracking-widest block mb-2">
            Why It Works
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slateText-heading">
            Designed for Pre-IELTS &amp; IELTS Success
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-surface p-7 rounded-3xl border border-gray-100 shadow-soft flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-primary-light flex items-center justify-center text-primary">
                <BookOpenCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slateText-heading">
                Learn in Context
              </h3>
              <p className="text-sm sm:text-base text-slateText-body leading-relaxed">
                Every word comes with HD images, native audio, and real-life sentence examples.
              </p>
            </div>
            <div className="pt-6">
              <span className="text-xs font-semibold text-primary">
                Collocations &amp; Sample Usages →
              </span>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-surface p-7 rounded-3xl border border-gray-100 shadow-soft flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-tealAccent-light flex items-center justify-center text-teal-800">
                <Gamepad2 className="w-7 h-7 text-tealAccent" />
              </div>
              <h3 className="text-xl font-bold text-slateText-heading">
                Interactive Tasks
              </h3>
              <p className="text-sm sm:text-base text-slateText-body leading-relaxed">
                Type from memory, match definitions, and train your listening skills to earn coins.
              </p>
            </div>
            <div className="pt-6">
              <span className="text-xs font-semibold text-tealAccent">
                Active Recall Retention →
              </span>
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-surface p-7 rounded-3xl border border-gray-100 shadow-soft flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-secondary-light flex items-center justify-center text-secondary">
                <Gift className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slateText-heading">
                Earn &amp; Unlock
              </h3>
              <p className="text-sm sm:text-base text-slateText-body leading-relaxed">
                Exchange your hard-earned coins for exclusive avatars, premium themes, and cheat-sheets in our Gift Shop.
              </p>
            </div>
            <div className="pt-6">
              <span className="text-xs font-semibold text-secondary">
                Gamified Motivation →
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
