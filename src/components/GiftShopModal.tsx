"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flame, Moon, Crown, Coins, Check, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

interface GiftShopModalProps {
  isOpen: boolean;
  totalCoins: number;
  hasStreakFreeze: boolean;
  isDarkModeUnlocked: boolean;
  hasGoldenCrown: boolean;
  onClose: () => void;
  onPurchase: (item: "freeze" | "dark" | "crown", cost: number) => void;
}

export const GiftShopModal: React.FC<GiftShopModalProps> = ({
  isOpen,
  totalCoins,
  hasStreakFreeze,
  isDarkModeUnlocked,
  hasGoldenCrown,
  onClose,
  onPurchase,
}) => {
  const [justPurchased, setJustPurchased] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBuy = (item: "freeze" | "dark" | "crown", cost: number) => {
    if (totalCoins >= cost) {
      onPurchase(item, cost);
      setJustPurchased(item);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#F5A623", "#50E3C2", "#4A90E2"],
        });
      } catch (e) {
        // graceful fallback if canvas isn't supported
      }
      setTimeout(() => setJustPurchased(null), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-surface w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 space-y-6"
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slateText-heading">
              Reward Yourself
            </h2>
            <p className="text-sm text-slateText-body mt-1">
              Spend your coins on exclusive items.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slateText-muted hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Coin Balance Pill */}
        <div className="flex items-center justify-between px-4 py-3 bg-secondary-light rounded-2xl border border-secondary/20">
          <div className="flex items-center space-x-2">
            <Coins className="w-5 h-5 text-secondary" />
            <span className="text-sm font-semibold text-slateText-heading">
              Your Coin Balance:
            </span>
          </div>
          <span className="text-lg font-bold text-secondary">
            {totalCoins} Coins
          </span>
        </div>

        {/* Shop Items List */}
        <div className="space-y-3.5">
          {/* Item 1: Freeze Streak */}
          <div className="p-4 rounded-2xl border border-gray-100 hover:border-gray-200 bg-surface shadow-soft flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-secondary-light flex items-center justify-center shrink-0">
                <Flame className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h4 className="font-bold text-slateText-heading text-sm sm:text-base">
                  Freeze Streak{" "}
                  <span className="text-xs font-semibold text-secondary ml-1">
                    (Cost: 50 Coins)
                  </span>
                </h4>
                <p className="text-xs text-slateText-body mt-0.5">
                  Keep your streak alive if you miss a day.
                </p>
              </div>
            </div>

            <div>
              {hasStreakFreeze ? (
                <span className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl bg-tealAccent-light text-teal-800 font-bold border border-tealAccent/30">
                  <Check className="w-3.5 h-3.5" /> Active
                </span>
              ) : (
                <motion.button
                  whileHover={totalCoins >= 50 ? { scale: 1.05 } : {}}
                  whileTap={totalCoins >= 50 ? { scale: 0.95 } : {}}
                  disabled={totalCoins < 50}
                  onClick={() => handleBuy("freeze", 50)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    totalCoins >= 50
                      ? "bg-primary hover:bg-primary-hover text-white shadow-soft cursor-pointer"
                      : "bg-gray-100 text-slateText-muted cursor-not-allowed"
                  }`}
                >
                  Unlock
                </motion.button>
              )}
            </div>
          </div>

          {/* Item 2: Dark Mode Theme */}
          <div className="p-4 rounded-2xl border border-gray-100 hover:border-gray-200 bg-surface shadow-soft flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center shrink-0">
                <Moon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-bold text-slateText-heading text-sm sm:text-base">
                  Dark Mode Theme{" "}
                  <span className="text-xs font-semibold text-primary ml-1">
                    (Cost: 100 Coins)
                  </span>
                </h4>
                <p className="text-xs text-slateText-body mt-0.5">
                  Unlock the sleek dark UI.
                </p>
              </div>
            </div>

            <div>
              {isDarkModeUnlocked ? (
                <span className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl bg-tealAccent-light text-teal-800 font-bold border border-tealAccent/30">
                  <Check className="w-3.5 h-3.5" /> Unlocked
                </span>
              ) : (
                <motion.button
                  whileHover={totalCoins >= 100 ? { scale: 1.05 } : {}}
                  whileTap={totalCoins >= 100 ? { scale: 0.95 } : {}}
                  disabled={totalCoins < 100}
                  onClick={() => handleBuy("dark", 100)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    totalCoins >= 100
                      ? "bg-primary hover:bg-primary-hover text-white shadow-soft cursor-pointer"
                      : "bg-gray-100 text-slateText-muted cursor-not-allowed"
                  }`}
                >
                  Unlock
                </motion.button>
              )}
            </div>
          </div>

          {/* Item 3: Golden Crown Avatar */}
          <div className="p-4 rounded-2xl border border-gray-100 hover:border-gray-200 bg-surface shadow-soft flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                <Crown className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h4 className="font-bold text-slateText-heading text-sm sm:text-base">
                  Golden Crown Avatar{" "}
                  <span className="text-xs font-semibold text-amber-600 ml-1">
                    (Cost: 500 Coins)
                  </span>
                </h4>
                <p className="text-xs text-slateText-body mt-0.5">
                  Show off your mastery.
                </p>
              </div>
            </div>

            <div>
              {hasGoldenCrown ? (
                <span className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl bg-tealAccent-light text-teal-800 font-bold border border-tealAccent/30">
                  <Check className="w-3.5 h-3.5" /> Equipped
                </span>
              ) : (
                <motion.button
                  whileHover={totalCoins >= 500 ? { scale: 1.05 } : {}}
                  whileTap={totalCoins >= 500 ? { scale: 0.95 } : {}}
                  disabled={totalCoins < 500}
                  onClick={() => handleBuy("crown", 500)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    totalCoins >= 500
                      ? "bg-primary hover:bg-primary-hover text-white shadow-soft cursor-pointer"
                      : "bg-gray-100 text-slateText-muted cursor-not-allowed"
                  }`}
                >
                  Unlock
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Success toast inside modal */}
        <AnimatePresence>
          {justPurchased && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-3 rounded-xl bg-tealAccent-light border border-tealAccent/30 text-teal-900 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-secondary" />
              <span>Reward unlocked successfully! Enjoy your perk.</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
