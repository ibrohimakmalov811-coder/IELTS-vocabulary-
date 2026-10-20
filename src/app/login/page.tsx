"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useVocab } from "@/components/layout/ClientLayout";
import { motion } from "framer-motion";
import {
  LogIn,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  AlertCircle,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";

export default function LoginPage() {
  const router = useRouter();
  const { store } = useVocab();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Iltimos, email va parolni to'liq kiriting.");
      return;
    }

    if (!email.includes("@")) {
      setError("Iltimos, to'g'ri email manzilini kiriting.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Login student and persist in localStorage
      store.login(email);
      setIsLoading(false);
      router.push("/dashboard");
    }, 600);
  };

  const handleDemoLogin = () => {
    setEmail("ibrohim@ielts.uz");
    setPassword("ielts2026");
    setIsLoading(true);
    setTimeout(() => {
      store.login("ibrohim@ielts.uz", "Ibrohim Akmalov");
      setIsLoading(false);
      router.push("/dashboard");
    }, 400);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md p-6 sm:p-8 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center pb-2">
            <BrandLogo variant="compact" size="md" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slateText-heading dark:text-white tracking-tight">
            Platformaga Kirish
          </h1>
          <p className="text-xs sm:text-sm text-slateText-muted">
            IELTS so&apos;z boyligingiz va test natijalaringizni davom ettiring
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slateText-muted uppercase tracking-wider">
              Email Manzil
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="talaba@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-surface dark:bg-slate-900 text-slateText-heading dark:text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <Mail className="w-4 h-4 text-slateText-muted absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slateText-muted uppercase tracking-wider">
                Maxfiy Parol
              </label>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-surface dark:bg-slate-900 text-slateText-heading dark:text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <Lock className="w-4 h-4 text-slateText-muted absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-slateText-muted">
              <input
                type="checkbox"
                defaultChecked
                className="rounded text-primary focus:ring-primary w-4 h-4"
              />
              <span>Brauzerda eslab qolish</span>
            </label>
            <span className="text-[11px] text-tealAccent font-bold">Xavfsiz LocalStorage</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-soft transition-all cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Akkauntga Kirish</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center space-y-3">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary/40 text-xs font-bold text-slateText-body dark:text-slate-300 hover:text-primary transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Demo Student Profilida Kirish</span>
          </button>

          <p className="text-xs text-slateText-muted">
            Hali akkauntingiz yo&apos;qmi?{" "}
            <Link
              href="/register"
              className="text-primary dark:text-sky-400 font-bold hover:underline"
            >
              Ro&apos;yxatdan o&apos;tish
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
