"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useVocab } from "@/components/layout/ClientLayout";
import { motion } from "framer-motion";
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Target,
  Sparkles,
  AlertCircle,
  GraduationCap,
} from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";

export default function RegisterPage() {
  const router = useRouter();
  const { store } = useVocab();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [targetBand, setTargetBand] = useState("Band 7.5");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Iltimos, ismingizni kiriting.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Iltimos, haqiqiy email manzilini kiriting.");
      return;
    }
    if (password.length < 4) {
      setError("Parol kamida 4 ta belgidan iborat bo'lishi kerak.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Register and save to browser localStorage
      store.register(name.trim(), email.trim(), targetBand);
      setIsLoading(false);
      router.push("/dashboard");
    }, 600);
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
            Student Ro&apos;yxatdan O&apos;tish
          </h1>
          <p className="text-xs sm:text-sm text-slateText-muted">
            Shaxsiy statistika, test natijalari va diagrammalarni saqlab borish uchun
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

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slateText-muted uppercase tracking-wider">
              Ism va Familiya
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masalan: Ibrohim Akmalov"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-surface dark:bg-slate-900 text-slateText-heading dark:text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <User className="w-4 h-4 text-slateText-muted absolute left-3.5 top-3.5" />
            </div>
          </div>

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
            <label className="block text-xs font-bold text-slateText-muted uppercase tracking-wider">
              Maxfiy Parol
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kamida 4 ta belgi"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-surface dark:bg-slate-900 text-slateText-heading dark:text-white text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <Lock className="w-4 h-4 text-slateText-muted absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slateText-muted uppercase tracking-wider">
              Maqsad Qilingan IELTS Balli
            </label>
            <div className="relative">
              <select
                value={targetBand}
                onChange={(e) => setTargetBand(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-surface dark:bg-slate-900 text-slateText-heading dark:text-white text-sm font-bold focus:outline-none focus:border-primary transition-colors cursor-pointer"
              >
                <option value="Band 6.5">Band 6.5 — Competent Academic</option>
                <option value="Band 7.0">Band 7.0 — Good User</option>
                <option value="Band 7.5">Band 7.5 — Advanced Lexical Range</option>
                <option value="Band 8.0">Band 8.0 — Very Good User</option>
                <option value="Band 8.5+">Band 8.5+ — Expert Academic Master</option>
              </select>
              <Target className="w-4 h-4 text-tealAccent absolute left-3.5 top-3.5" />
            </div>
          </div>

          <p className="text-[11px] text-slateText-muted leading-relaxed">
            * Profilingiz brauzeringiz xotirasiga (Chrome LocalStorage) to&apos;liq saqlanadi. Ma&apos;lumotlaringiz o&apos;chib ketmaydi.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-soft transition-all cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Profilni Saqlash &amp; Boshlash</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-xs text-slateText-muted">
            Allaqachon profilingiz bormi?{" "}
            <Link
              href="/login"
              className="text-primary dark:text-sky-400 font-bold hover:underline"
            >
              Akkauntga kirish
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
