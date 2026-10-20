"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ViewTab } from "@/types/vocabulary";
import { 
  BookOpen, 
  Layers, 
  Zap, 
  LayoutDashboard, 
  Coins, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  Crown,
  Volume2
} from "lucide-react";

interface NavbarProps {
  activeTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  totalCoins: number;
  hasCrown: boolean;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  accent: "US" | "UK";
  onToggleAccent: () => void;
  onOpenShop: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  totalCoins,
  hasCrown,
  isDarkMode,
  onToggleDarkMode,
  accent,
  onToggleAccent,
  onOpenShop,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "library", label: "Vocabulary Library", icon: <BookOpen className="w-4 h-4" /> },
    { id: "flashcards", label: "Flashcards", icon: <Layers className="w-4 h-4" /> },
    { id: "tasks", label: "Practice Tasks", icon: <Zap className="w-4 h-4" /> },
  ];

  const handleNavClick = (tab: ViewTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick("landing")}
          className="flex items-center space-x-3 text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-tealAccent flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
            <span className="text-white font-black text-base tracking-wider">E5</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slateText-heading dark:text-white text-lg leading-tight tracking-tight">
                Essential Vocab
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-primary-light text-primary dark:bg-primary/20">
                Book 5
              </span>
            </div>
            <span className="text-xs text-slateText-muted font-medium hidden sm:block">
              Pre-IELTS &amp; IELTS Vocabulary System
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as ViewTab)}
                className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "text-primary dark:text-tealAccent"
                    : "text-slateText-body dark:text-slate-300 hover:text-slateText-heading dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-slate-800/60"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 bg-primary-light/80 dark:bg-primary/15 rounded-xl -z-10 border border-primary/20 dark:border-tealAccent/20"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Tools & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Accent Toggle (US/UK) */}
          <button
            onClick={onToggleAccent}
            className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-bold text-slateText-body dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            title={`Pronunciation Accent: ${accent === "US" ? "American" : "British"}`}
          >
            <Volume2 className="w-3.5 h-3.5 text-primary" />
            <span>{accent === "US" ? "🇺🇸 US" : "🇬🇧 UK"}</span>
          </button>

          {/* Coins Badge (Click opens Gift Shop) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenShop}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-secondary-light dark:bg-secondary/15 border border-secondary/30 rounded-full cursor-pointer transition-colors shadow-xs"
            title="Total Coins • Click to open Gift Shop"
          >
            <Coins className="w-4 h-4 text-secondary" />
            <span className="text-xs sm:text-sm font-black text-secondary">
              {totalCoins}
            </span>
          </motion.button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slateText-body dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-100 dark:border-slate-800 transition-colors cursor-pointer"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slateText-heading" />
            )}
          </button>

          {/* Crown Avatar Badge if unlocked */}
          <div className="relative">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary-light dark:bg-primary/20 border-2 border-primary/30 flex items-center justify-center font-bold text-primary text-xs sm:text-sm shadow-xs">
              I
            </div>
            {hasCrown && (
              <div className="absolute -top-1.5 -right-1 bg-amber-400 text-white rounded-full p-0.5 shadow-sm">
                <Crown className="w-3 h-3" />
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden rounded-xl text-slateText-body dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 dark:border-slate-800 bg-surface dark:bg-slate-900 px-4 py-4 space-y-2 shadow-lg"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as ViewTab)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  activeTab === item.id
                    ? "bg-primary text-white"
                    : "text-slateText-body dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {activeTab === item.id && <span className="text-xs">Active</span>}
              </button>
            ))}

            <div className="pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={onToggleAccent}
                className="flex items-center space-x-2 text-xs font-semibold text-slateText-body dark:text-slate-300 p-2"
              >
                <Volume2 className="w-4 h-4 text-primary" />
                <span>Accent: {accent === "US" ? "American (US)" : "British (UK)"}</span>
              </button>
              <button
                onClick={onOpenShop}
                className="text-xs font-bold text-secondary flex items-center gap-1.5 p-2"
              >
                <Coins className="w-4 h-4" />
                <span>Gift Shop ({totalCoins} Coins)</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
