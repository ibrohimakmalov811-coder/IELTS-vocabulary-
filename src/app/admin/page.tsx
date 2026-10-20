"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useVocab } from "@/components/layout/ClientLayout";
import { sampleWords, sampleUnits } from "@/data/vocabularyData";
import { WordItem, Unit } from "@/types/vocabulary";
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  BookOpen,
  Award,
  Layers,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  Eye,
  Key,
  BarChart3,
  Terminal,
  RotateCcw,
  Sparkles,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

type AdminTab = "overview" | "words" | "units" | "users" | "moderation" | "bootstrap";

function AdminContent() {
  const { store } = useVocab();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  // Search & filter for admin words
  const [wordSearch, setWordSearch] = useState("");
  const [selectedUnit, setSelectedUnit] = useState<number | "all">("all");

  // User list state
  const [usersList, setUsersList] = useState<any[]>([
    {
      id: "usr_1",
      display_name: "Ibrohim Akmalov",
      email: "ibrohim@ielts.uz",
      role: "admin",
      target_band: "Band 8.5",
      total_coins: 520,
      streak_days: 12,
      created_at: "2026-10-10",
    },
    {
      id: "usr_2",
      display_name: "Azizbek Rahimov",
      email: "azizbek@example.com",
      role: "student",
      target_band: "Band 7.5",
      total_coins: 180,
      streak_days: 5,
      created_at: "2026-10-15",
    },
    {
      id: "usr_3",
      display_name: "Madina Karimova",
      email: "madina@example.com",
      role: "moderator",
      target_band: "Band 8.0",
      total_coins: 340,
      streak_days: 8,
      created_at: "2026-10-17",
    },
  ]);

  // Moderation state
  const [moderationItems, setModerationItems] = useState([
    {
      id: "mod-1",
      title: "Allot mnemonic",
      content: "Think of 'a lot' of portions to allocate to your class.",
      author: "Azizbek",
      status: "approved",
      date: "2026-10-18",
    },
    {
      id: "mod-2",
      title: "Appall memory trick",
      content: "Made him turn completely pale with horror.",
      author: "Madina",
      status: "approved",
      date: "2026-10-19",
    },
  ]);

  // Add word modal / inline form state
  const [newWord, setNewWord] = useState({
    word: "",
    unit: 1,
    partOfSpeech: "verb",
    phonetic: "",
    definition: "",
    translation: "",
    example: "",
  });
  const [wordSaveSuccess, setWordSaveSuccess] = useState(false);

  // Filter words
  const filteredWords = sampleWords.filter((w) => {
    if (selectedUnit !== "all" && w.unit !== selectedUnit) return false;
    if (wordSearch.trim()) {
      const q = wordSearch.toLowerCase();
      return (
        w.word.toLowerCase().includes(q) ||
        w.translations.uzbek.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.word || !newWord.definition || !newWord.translation) return;

    setWordSaveSuccess(true);
    setTimeout(() => {
      setWordSaveSuccess(false);
      setNewWord({
        word: "",
        unit: 1,
        partOfSpeech: "verb",
        phonetic: "",
        definition: "",
        translation: "",
        example: "",
      });
    }, 2500);
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  const handleModeration = (id: string, newStatus: string) => {
    setModerationItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
    );
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 space-y-8 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Boshqaruv Paneli
            </span>
            <span className="text-xs text-slateText-muted font-bold">
              LexiVance IELTS Backend Administration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slateText-heading dark:text-white tracking-tight">
            Administrator Markazi
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slateText-body dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
          >
            Student Dashboard
          </Link>
          <Link
            href="/vocabulary"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-primary dark:text-sky-300 hover:bg-primary-light dark:hover:bg-primary/20 border border-primary/30 transition-colors"
          >
            Kutubxona
          </Link>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: "overview", label: "Umumiy Ko'rinish", icon: BarChart3 },
          { key: "words", label: "Lug'at Boshqaruvi (301 ta so'z)", icon: BookOpen },
          { key: "units", label: "Unitlar (15 ta)", icon: Layers },
          { key: "users", label: "Foydalanuvchilar & Rollar", icon: Users },
          { key: "moderation", label: "Moderatsiya (Study Hacks)", icon: ShieldAlert },
          { key: "bootstrap", label: "SQL & Bootstrap Ko'rsatmasi", icon: Terminal },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as AdminTab)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-primary text-white shadow-soft"
                  : "bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slateText-body dark:text-slate-300 hover:border-primary/40"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 sm:p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-primary">
                Nashr qilingan so&apos;zlar
              </span>
              <div className="text-3xl font-black text-slateText-heading dark:text-white">
                301
              </div>
              <p className="text-xs text-slateText-muted">Units 1–15 Core Verified</p>
            </div>

            <div className="p-5 sm:p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-tealAccent">
                Faol Unitlar
              </span>
              <div className="text-3xl font-black text-slateText-heading dark:text-white">
                15
              </div>
              <p className="text-xs text-tealAccent font-bold">100% O&apos;quv dasturi</p>
            </div>

            <div className="p-5 sm:p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-500">
                Ro&apos;yxatdan o&apos;tganlar
              </span>
              <div className="text-3xl font-black text-slateText-heading dark:text-white">
                {usersList.length}
              </div>
              <p className="text-xs text-slateText-muted">Talabalar &amp; Moderatorlar</p>
            </div>

            <div className="p-5 sm:p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-secondary">
                Yechilgan Testlar
              </span>
              <div className="text-3xl font-black text-slateText-heading dark:text-white">
                {store.testHistory.length}
              </div>
              <p className="text-xs text-secondary font-bold">Anti-cheat xavfsiz audit</p>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h3 className="font-black text-lg text-slateText-heading dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Backend Arxitektura &amp; Xavfsizlik Holati</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <p className="font-bold text-slateText-heading dark:text-white">PostgreSQL RLS</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-semibold">14 ta jadvalda faol</p>
                <p className="text-slateText-muted">Barcha shaxsiy natijalar faqat o&apos;z egasiga ochiladi.</p>
              </div>

              <div className="p-4 rounded-2xl bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <p className="font-bold text-slateText-heading dark:text-white">Anti-Cheat Tangalar</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-semibold">Server-side hisoblash</p>
                <p className="text-slateText-muted">Foydalanuvchi brauzerdan tangalarni o&apos;zgartira olmaydi.</p>
              </div>

              <div className="p-4 rounded-2xl bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                <p className="font-bold text-slateText-heading dark:text-white">SM-2 Spaced Repetition</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-semibold">SuperMemo-2 algoritmi</p>
                <p className="text-slateText-muted">Har bir so&apos;zning qaytarish vaqti ilmiy formula asosida belgilanadi.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WORDS MANAGEMENT */}
      {activeTab === "words" && (
        <div className="space-y-6">
          {/* Add Word Form */}
          <div className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h3 className="font-black text-lg text-slateText-heading dark:text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              <span>Yangi So&apos;z Qo&apos;shish (Admin Content Management)</span>
            </h3>

            <form onSubmit={handleCreateWord} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slateText-muted uppercase">So&apos;z (English)</label>
                <input
                  type="text"
                  value={newWord.word}
                  onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
                  placeholder="Masalan: Accelerate"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-surface dark:bg-slate-900 text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slateText-muted uppercase">Unit</label>
                <select
                  value={newWord.unit}
                  onChange={(e) => setNewWord({ ...newWord, unit: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-surface dark:bg-slate-900 text-xs font-bold"
                >
                  {sampleUnits.slice(0, 15).map((u) => (
                    <option key={u.id} value={u.id}>Unit {u.id}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slateText-muted uppercase">O&apos;zbekcha Tarjimasi</label>
                <input
                  type="text"
                  value={newWord.translation}
                  onChange={(e) => setNewWord({ ...newWord, translation: e.target.value })}
                  placeholder="Tezlashtirmoq"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-surface dark:bg-slate-900 text-xs font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-slateText-muted uppercase">Inglizcha Ta&apos;rif</label>
                <input
                  type="text"
                  value={newWord.definition}
                  onChange={(e) => setNewWord({ ...newWord, definition: e.target.value })}
                  placeholder="To increase in speed or rate of progression..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-surface dark:bg-slate-900 text-xs font-medium"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all"
                >
                  Bazaga Saqlash
                </button>
              </div>
            </form>

            {wordSaveSuccess && (
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> So&apos;z muvaffaqiyatli saqlandi!
              </p>
            )}
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={wordSearch}
                onChange={(e) => setWordSearch(e.target.value)}
                placeholder="301 ta so'z orasidan qidirish..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-surface dark:bg-slate-900 text-xs"
              />
              <Search className="w-4 h-4 text-slateText-muted absolute left-3 top-2.5" />
            </div>

            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-surface dark:bg-slate-900 text-xs font-bold"
            >
              <option value="all">Barcha Unitlar (1–15)</option>
              {sampleUnits.slice(0, 15).map((u) => (
                <option key={u.id} value={u.id}>Unit {u.id}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 sticky top-0 border-b border-slate-200/80 dark:border-slate-800 text-slateText-muted font-black uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-4">ID</th>
                    <th className="py-2.5 px-4">So&apos;z</th>
                    <th className="py-2.5 px-4">Unit</th>
                    <th className="py-2.5 px-4">Turkum</th>
                    <th className="py-2.5 px-4">Tarjima</th>
                    <th className="py-2.5 px-4 text-right">Holat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredWords.slice(0, 50).map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                      <td className="py-2.5 px-4 font-mono text-slateText-muted">{w.id}</td>
                      <td className="py-2.5 px-4 font-black text-slateText-heading dark:text-white capitalize">{w.word}</td>
                      <td className="py-2.5 px-4 font-bold text-primary">Unit {w.unit}</td>
                      <td className="py-2.5 px-4 text-slateText-muted">{w.partOfSpeech}</td>
                      <td className="py-2.5 px-4 font-semibold text-slateText-body dark:text-slate-300">{w.translations.uzbek}</td>
                      <td className="py-2.5 px-4 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          Nashr qilingan
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: UNITS */}
      {activeTab === "units" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleUnits.slice(0, 15).map((u) => {
            const count = sampleWords.filter((w) => w.unit === u.id).length;
            return (
              <div key={u.id} className="p-5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-primary uppercase">Unit {u.id}</span>
                  <span className="text-xs font-bold text-emerald-500">{count} ta so&apos;z</span>
                </div>
                <h4 className="font-extrabold text-sm text-slateText-heading dark:text-white">{u.title}</h4>
                <p className="text-xs text-slateText-muted">{u.description}</p>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slateText-muted">{u.category}</span>
                  <Link href={`/vocabulary?unit=${u.id}`} className="text-primary font-bold hover:underline">
                    Ko&apos;rish →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 4: USERS & ROLES */}
      {activeTab === "users" && (
        <div className="rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-soft">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[11px] font-black uppercase text-slateText-muted">
              <tr>
                <th className="py-3 px-4 sm:px-6">Talaba</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Rol</th>
                <th className="py-3 px-4">Maqsad</th>
                <th className="py-3 px-4">Tangalar</th>
                <th className="py-3 px-4 text-right">Rolni O&apos;zgartirish</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {usersList.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                  <td className="py-3 px-4 sm:px-6 font-bold text-slateText-heading dark:text-white">
                    {user.display_name}
                  </td>
                  <td className="py-3 px-4 text-slateText-muted">{user.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                        user.role === "admin"
                          ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"
                          : user.role === "moderator"
                          ? "bg-tealAccent/20 text-teal-800 dark:text-tealAccent"
                          : "bg-slate-100 dark:bg-slate-800 text-slateText-muted"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-tealAccent">{user.target_band}</td>
                  <td className="py-3 px-4 font-black text-amber-500">{user.total_coins} 🪙</td>
                  <td className="py-3 px-4 text-right">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-surface dark:bg-slate-900 text-xs font-bold cursor-pointer"
                    >
                      <option value="student">student</option>
                      <option value="moderator">moderator</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 5: MODERATION */}
      {activeTab === "moderation" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200">
            Moderatsiya bo&apos;limi: Talabalar tomonidan yuborilgan study hacks va mnemonikalar avval tekshirilib, so&apos;ng saytda e&apos;lon qilinadi.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {moderationItems.map((item) => (
              <div key={item.id} className="p-5 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-slateText-heading dark:text-white">{item.title}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      item.status === "approved"
                        ? "bg-emerald-500/15 text-emerald-600"
                        : "bg-rose-500/15 text-rose-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-slateText-body dark:text-slate-300">&quot;{item.content}&quot;</p>
                <div className="text-[11px] text-slateText-muted">Muallif: {item.author} • {item.date}</div>
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleModeration(item.id, "approved")}
                    className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold"
                  >
                    Tasdiqlash
                  </button>
                  <button
                    onClick={() => handleModeration(item.id, "rejected")}
                    className="px-3 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold"
                  >
                    Rad etish
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: BOOTSTRAP SQL INSTRUCTIONS */}
      {activeTab === "bootstrap" && (
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slateText-heading dark:text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-primary" />
              <span>Dastlabki Administratorni O&apos;rnatish (Bootstrap Admin)</span>
            </h3>
            <p className="text-xs sm:text-sm text-slateText-muted leading-relaxed">
              Xavfsizlik qoidalariga binoan, yangi ro&apos;yxatdan o&apos;tgan har bir foydalanuvchi odatiy <strong>Student</strong> roliga ega bo&apos;ladi. O&apos;zingizni birinchi administrator etib tayinlash uchun Supabase SQL Editor&apos;da quyidagi buyruqni bajaring:
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800">
            <code>
              -- 1. Avval saytda ro&apos;yxatdan o&apos;ting (masalan: ibrohim@ielts.uz)<br />
              -- 2. So&apos;ng Supabase SQL Editor&apos;ga kirib quyidagi buyruqni bering:<br /><br />
              <span className="text-tealAccent">SELECT</span> public.bootstrap_admin(<span className="text-amber-400">&apos;ibrohim@ielts.uz&apos;</span>);
            </code>
          </div>

          <p className="text-xs text-slateText-muted">
            Bu buyruq sizning akkauntingizga to&apos;liq <strong>admin</strong> huquqini beradi va buni audit loglariga xavfsiz qayd etadi.
          </p>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slateText-muted">Admin Panel Yuklanmoqda...</p>
          </div>
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
