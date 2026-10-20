"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BrandLogo } from "./brand/BrandLogo";
import { UserProfile } from "@/types/vocabulary";
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
  Crown,
  User,
  LogOut,
  ChevronDown,
  UserPlus,
  LogIn,
  ShieldCheck,
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
  currentUser?: UserProfile | null;
  onLogout?: () => void;
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
  currentUser,
  onLogout,
}) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/vocabulary", label: "Vocabulary" },
    { href: "/practice", label: "Practice" },
    { href: "/learn", label: "Methods" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/ideas", label: "Study Hacks" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-surface/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Brand Identity & Custom Logo */}
        <div className="shrink-0">
          <BrandLogo variant="full" size="md" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center space-x-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all ${
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
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          {/* Audio Accent Switcher */}
          {onToggleAccent && (
            <button
              onClick={onToggleAccent}
              className="hidden md:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-900 text-xs font-bold text-slateText-body dark:text-slate-300 hover:border-primary/40 transition-colors cursor-pointer"
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
                <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              )}
            </button>
          )}

          {/* Student Profile or Auth Buttons (Desktop) */}
          {currentUser ? (
            <div className="relative hidden md:block" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/80 dark:border-slate-800 transition-colors cursor-pointer"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  {hasCrown && (
                    <div className="absolute -top-1 -right-1 bg-amber-400 text-white rounded-full p-0.5 shadow-xs">
                      <Crown className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <div className="text-left hidden lg:block pr-1">
                  <p className="text-xs font-bold text-slateText-heading dark:text-white leading-tight">
                    {currentUser.name.split(" ")[0]}
                  </p>
                  <p className="text-[10px] font-extrabold text-tealAccent leading-tight">
                    {currentUser.targetBand}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slateText-muted hidden lg:block" />
              </button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 space-y-1"
                  >
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slateText-heading dark:text-white">
                        {currentUser.name}
                      </p>
                      <p className="text-[11px] text-slateText-muted truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-tealAccent/20 text-teal-800 dark:text-tealAccent">
                        Target: {currentUser.targetBand}
                      </span>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slateText-heading dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-primary" />
                      <span>Student Dashboard</span>
                    </Link>

                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-indigo-500" />
                      <span>Admin Panel</span>
                    </Link>

                    <Link
                      href="/practice"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slateText-heading dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>Take Practice Test</span>
                    </Link>

                    {onLogout && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Chiqish (Log Out)</span>
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slateText-heading dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
              >
                Kirish
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-hover shadow-soft transition-all"
              >
                Ro&apos;yxatdan o&apos;tish
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 xl:hidden rounded-xl text-slateText-body dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slateText-heading dark:text-white" />}
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
            className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-surface dark:bg-slate-950 px-4 py-5 space-y-3 shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            {/* Student Account Bar in Mobile Drawer */}
            {currentUser ? (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-black text-sm flex items-center justify-center">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slateText-heading dark:text-white">
                      {currentUser.name}
                    </p>
                    <p className="text-[10px] text-tealAccent font-extrabold">{currentUser.targetBand}</p>
                  </div>
                </div>

                {onLogout && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Log Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-xs font-bold text-slateText-heading dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  Kirish
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 rounded-xl bg-primary text-center text-xs font-bold text-white shadow-soft"
                >
                  Ro&apos;yxatdan o&apos;tish
                </Link>
              </div>
            )}

            {/* Navigation Links */}
            <div className="space-y-1 pt-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                      isActive
                        ? "bg-primary text-white shadow-soft"
                        : "text-slateText-body dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="text-[10px] uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">Faol</span>}
                  </Link>
                );
              })}

              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-800/40"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  <span>Admin Boshqaruv Paneli</span>
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-500 text-white">Staff</span>
              </Link>
            </div>

            {/* Accent and Gift Shop */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              {onToggleAccent && (
                <button
                  onClick={onToggleAccent}
                  className="flex items-center space-x-2 text-xs font-bold text-slateText-body dark:text-slate-300 p-2 rounded-xl bg-slate-100 dark:bg-slate-900"
                >
                  <Volume2 className="w-4 h-4 text-primary" />
                  <span>Talaffuz: {accent === "US" ? "🇺🇸 US" : "🇬🇧 UK"}</span>
                </button>
              )}
              {onOpenShop && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenShop();
                  }}
                  className="text-xs font-bold text-amber-500 flex items-center gap-1.5 p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40"
                >
                  <Coins className="w-4 h-4" />
                  <span>Do&apos;kon ({totalCoins} 🪙)</span>
                </button>
              )}
            </div>

            <div className="pt-2">
              <Link
                href="/practice"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-primary to-indigo-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-soft"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Test va Mashqlarni Boshlash</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
