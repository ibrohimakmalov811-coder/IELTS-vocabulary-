"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BrandLogo } from "./brand/BrandLogo";
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
  Volume2,
  Lightbulb,
  Info,
  ArrowRight,
  Flame,
  Crown
} from "lucide-react";

interface NavbarProps {
  totalCoins?: number;
  hasCrown?: boolean;
  hasFreeze?: boolean;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  accent?: "US" | "UK";
  onToggleAccent?: () => void;
  onOpenShop?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  totalCoins = 240,
  hasCrown = false,
  hasFreeze = false,
  isDarkMode = false,
  onToggleDarkMode,
  accent = "US",
  onToggleAccent,
  onOpenShop,
}) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/vocabulary", label: "Vocabulary" },
    { href: "/practice", label: "Practice" },
    { href: "/learn", label: "Learning Methods" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/ideas", label: "Student Ideas" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-surface/90 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand Identity & Custom Logo */}
        <BrandLogo variant="full" size="md" />

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "text-primary dark:text-sky-400 font-bold"
                    : "text-slateText-body dark:text-slate-300 hover:text-slateText-heading dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 bg-primary-light/80 dark:bg-sky-500/15 rounded-xl -z-10 border border-primary/20 dark:border-sky-400/30"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Audio Accent Switcher */}
          {onToggleAccent && (
            <button
              onClick={onToggleAccent}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 text-xs font-bold text-slateText-body dark:text-slate-300 hover:border-primary/40 transition-colors cursor-pointer"
              title={`Speech Accent: ${accent === "US" ? "American (US)" : "British (UK)"}`}
            >
              <Volume2 className="w-3.5 h-3.5 text-primary dark:text-sky-400" />
              <span>{accent === "US" ? "🇺🇸 US" : "🇬🇧 UK"}</span>
            </button>
          )}

          {/* Gamified Coins Counter */}
          {onOpenShop && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenShop}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300/40 dark:border-amber-600/30 rounded-full cursor-pointer shadow-xs transition-colors"
              title="Total Coins • Click to view Gift Shop"
            >
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-400">
                {totalCoins}
              </span>
            </motion.button>
          )}

          {/* Dark Mode Toggle */}
          {onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-xl text-slateText-body dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 transition-colors cursor-pointer"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>
          )}

          {/* Crown Avatar Badge if unlocked */}
          <div className="relative hidden sm:block">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 p-0.5 shadow-xs">
              <div className="w-full h-full rounded-full bg-surface dark:bg-slate-900 flex items-center justify-center font-bold text-xs text-primary dark:text-sky-300">
                I
              </div>
            </div>
            {hasCrown && (
              <div className="absolute -top-1.5 -right-1 bg-amber-400 text-white rounded-full p-0.5 shadow-sm">
                <Crown className="w-3 h-3" />
              </div>
            )}
          </div>

          {/* Primary CTA */}
          <Link
            href="/practice"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary-hover hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-soft hover:shadow-glow-blue transition-all"
          >
            <span>Start Learning</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 lg:hidden rounded-xl text-slateText-body dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-950 px-4 py-4 space-y-2 shadow-xl"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-slateText-body dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Active</span>}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              {onToggleAccent && (
                <button
                  onClick={onToggleAccent}
                  className="flex items-center space-x-2 text-xs font-semibold text-slateText-body dark:text-slate-300 p-2"
                >
                  <Volume2 className="w-4 h-4 text-primary" />
                  <span>Accent: {accent === "US" ? "American" : "British"}</span>
                </button>
              )}
              {onOpenShop && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenShop();
                  }}
                  className="text-xs font-bold text-amber-500 flex items-center gap-1.5 p-2"
                >
                  <Coins className="w-4 h-4" />
                  <span>Gift Shop ({totalCoins} Coins)</span>
                </button>
              )}
            </div>

            <div className="pt-2">
              <Link
                href="/practice"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm flex items-center justify-center gap-2 shadow-soft"
              >
                <span>Start Learning Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
