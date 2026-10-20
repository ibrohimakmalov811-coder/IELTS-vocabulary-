"use client";

import React, { useState, useEffect } from "react";
import { useVocab } from "@/components/layout/ClientLayout";
import { sampleWords } from "@/data/vocabularyData";
import { submitStudyHack } from "@/lib/services/studyHackService";
import {
  Lightbulb,
  Sparkles,
  BookOpen,
  Brain,
  Plus,
  Trash2,
  Volume2,
  Check,
  Tag,
  ArrowRight,
  Bookmark,
  Share2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface MnemonicItem {
  id: string;
  word: string;
  pronunciation: string;
  definition: string;
  uzbekTranslation: string;
  mnemonic: string;
  tag: string;
  isUserCreated?: boolean;
}

const defaultMnemonics: MnemonicItem[] = [
  {
    id: "m-allot",
    word: "Allot",
    pronunciation: "/əˈlɒt/",
    definition: "To give something to someone as their share or task.",
    uzbekTranslation: "ajratmoq, taqsimlamoq",
    mnemonic: "Think: 'A LOT'. The government owns 'a lot' of resources, so they need to allot (allocate) equal portions to each school.",
    tag: "Visual Hook",
  },
  {
    id: "m-appall",
    word: "Appall",
    pronunciation: "/əˈpɔːl/",
    definition: "To shock, disgust, or horrify someone greatly.",
    uzbekTranslation: "dahshatga solmoq, lol qoldirmoq",
    mnemonic: "Think: 'PALE'. The horrific crime made the detective turn completely pale with shock. It appalled him.",
    tag: "Emotion Hook",
  },
  {
    id: "m-concur",
    word: "Concur",
    pronunciation: "/kənˈkɜːr/",
    definition: "To agree with someone or have the same opinion.",
    uzbekTranslation: "fikriga qo'shilmoq, hamfikr bo'lmoq",
    mnemonic: "Roots: Latin 'con' (together) + 'currere' (to run). Two people whose ideas run along the exact same path concur with each other.",
    tag: "Etymology",
  },
  {
    id: "m-cache",
    word: "Cache",
    pronunciation: "/kæʃ/",
    definition: "A hiding place for storing provisions, weapons, or treasures.",
    uzbekTranslation: "yashirin joy, xazina / zaxira",
    mnemonic: "Sounds identical to 'CASH'. Where do pirates hide their cash? In a secret underground cache!",
    tag: "Phonetic Hook",
  },
  {
    id: "m-bizarre",
    word: "Bizarre",
    pronunciation: "/bɪˈzɑːr/",
    definition: "Very strange, unusual, or unconventional.",
    uzbekTranslation: "g'alati, beo'xshov, ajib",
    mnemonic: "Imagine walking into a traditional eastern 'bazaar' and seeing a blue dancing giraffe. That would be completely bizarre!",
    tag: "Visual Hook",
  },
  {
    id: "m-deter",
    word: "Deter",
    pronunciation: "/dɪˈtɜːr/",
    definition: "To prevent someone from doing something by making them fear the consequences.",
    uzbekTranslation: "qaytarmoq, yo'ldan urmoq, to'smoq",
    mnemonic: "Think: 'DETOUR'. A huge security fence forces a burglar to take a detour, successfully deterring him from breaking in.",
    tag: "Visual Hook",
  },
];

export default function IdeasPage() {
  const { store, playAudio } = useVocab();

  // Local storage mnemonics list
  const [userMnemonics, setUserMnemonics] = useState<MnemonicItem[]>([]);
  const [selectedWordStr, setSelectedWordStr] = useState("");
  const [customMnemonicText, setCustomMnemonicText] = useState("");
  const [customTag, setCustomTag] = useState("Memory Hook");
  const [isSuccessToast, setIsSuccessToast] = useState(false);

  // Load custom mnemonics from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ielts_custom_mnemonics");
      if (saved) {
        setUserMnemonics(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const handleSaveMnemonic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWordStr || !customMnemonicText.trim()) return;

    const matchedWord = sampleWords.find(
      (w) => w.word.toLowerCase() === selectedWordStr.toLowerCase()
    );

    // Sync with backend if Supabase is active
    submitStudyHack(store.currentUser?.id, {
      title: selectedWordStr,
      content: customMnemonicText.trim(),
      tag: customTag,
      relatedWordId: matchedWord?.id,
    }).catch(() => {});

    const newItem: MnemonicItem = {
      id: "custom-" + Date.now(),
      word: matchedWord ? matchedWord.word : selectedWordStr,
      pronunciation: matchedWord ? matchedWord.phonetic : "/.../",
      definition: matchedWord ? matchedWord.definition : "Custom study term",
      uzbekTranslation: matchedWord ? matchedWord.translations.uzbek : "",
      mnemonic: customMnemonicText.trim(),
      tag: customTag,
      isUserCreated: true,
    };

    const updated = [newItem, ...userMnemonics];
    setUserMnemonics(updated);
    try {
      localStorage.setItem("ielts_custom_mnemonics", JSON.stringify(updated));
    } catch (e) {}

    // Reset inputs
    setSelectedWordStr("");
    setCustomMnemonicText("");
    setIsSuccessToast(true);
    setTimeout(() => setIsSuccessToast(false), 3000);
  };

  const handleDeleteMnemonic = (id: string) => {
    const updated = userMnemonics.filter((m) => m.id !== id);
    setUserMnemonics(updated);
    try {
      localStorage.setItem("ielts_custom_mnemonics", JSON.stringify(updated));
    } catch (e) {}
  };

  const combinedList = [...userMnemonics, ...defaultMnemonics];

  return (
    <div className="min-h-screen py-10 sm:py-16 space-y-12">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <Lightbulb className="w-4 h-4" />
          <span>Study Hacks & Memory Techniques</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slateText-heading dark:text-white tracking-tight">
          The IELTS Mnemonic Vault
        </h1>

        <p className="text-sm sm:text-base text-slateText-body dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Struggling to remember tricky Book 5 words? Cognitive psychology shows that associating new words with vivid images, phonetic puns, or etymological roots boosts recall speed by over 300%.
        </p>
      </div>

      {/* Interactive Creator Box */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-soft">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg sm:text-xl font-black text-slateText-heading dark:text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              <span>Create Your Personal Memory Trick</span>
            </h2>
            <span className="text-xs font-bold text-slateText-muted">Saved to your browser</span>
          </div>

          <form onSubmit={handleSaveMnemonic} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slateText-muted uppercase tracking-wider mb-1.5">
                  Choose Word from 301 Words
                </label>
                <select
                  value={selectedWordStr}
                  onChange={(e) => setSelectedWordStr(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-surface dark:bg-slate-900 text-slateText-heading dark:text-white text-sm font-bold focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="">-- Select a Word --</option>
                  {sampleWords.map((w) => (
                    <option key={w.id} value={w.word}>
                      {w.word} ({w.translations.uzbek}) • Unit {w.unit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slateText-muted uppercase tracking-wider mb-1.5">
                  Category Tag
                </label>
                <select
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-surface dark:bg-slate-900 text-slateText-heading dark:text-white text-sm font-bold focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="Visual Hook">Visual Hook (Mental Image)</option>
                  <option value="Phonetic Hook">Phonetic Hook (Sounds Like)</option>
                  <option value="Etymology">Etymology (Root Word)</option>
                  <option value="Uzbek Cognate">Uzbek Association</option>
                  <option value="Collocation Trick">Collocation Trick</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slateText-muted uppercase tracking-wider mb-1.5">
                Your Memory Trick / Story / Hook
              </label>
              <textarea
                rows={3}
                value={customMnemonicText}
                onChange={(e) => setCustomMnemonicText(e.target.value)}
                placeholder="E.g. Think of a vivid story, funny connection, or personal association that makes this word unforgettable..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-surface dark:bg-slate-900 text-slateText-heading dark:text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              {isSuccessToast ? (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Mnemonic saved to your personal vault!
                </span>
              ) : (
                <span className="text-xs text-slateText-muted">
                  Personalized associations improve long-term storage
                </span>
              )}

              <button
                type="submit"
                disabled={!selectedWordStr || !customMnemonicText.trim()}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-40 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-soft transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Save to Vault</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mnemonics Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slateText-heading dark:text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            <span>Curated Study Hacks & Mnemonics</span>
          </h2>
          <span className="text-xs font-bold text-slateText-muted">
            {combinedList.length} Memory Hacks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {combinedList.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -3 }}
              className="p-6 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4 shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary-light dark:bg-primary/20 text-primary">
                      {item.tag}
                    </span>
                    {item.isUserCreated && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        Custom User Hack
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => playAudio(item.word)}
                      className="p-1.5 rounded-lg text-slateText-muted hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Pronounce"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    {item.isUserCreated && (
                      <button
                        onClick={() => handleDeleteMnemonic(item.id)}
                        className="p-1.5 rounded-lg text-slateText-muted hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                        title="Delete Mnemonic"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-black text-slateText-heading dark:text-white capitalize">
                      {item.word}
                    </h3>
                    <span className="text-xs text-slateText-muted italic font-mono">
                      {item.pronunciation}
                    </span>
                  </div>
                  {item.uzbekTranslation && (
                    <p className="text-xs text-primary font-bold mt-0.5">
                      {item.uzbekTranslation}
                    </p>
                  )}
                  <p className="text-xs text-slateText-body dark:text-slate-300 mt-1 line-clamp-2">
                    &quot;{item.definition}&quot;
                  </p>
                </div>

                {/* The Mnemonic Box */}
                <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-xs text-slateText-heading dark:text-amber-200 leading-relaxed font-medium">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{item.mnemonic}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 text-xs">
                <Link
                  href={`/practice?word=${encodeURIComponent(item.word)}`}
                  className="font-bold text-primary dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Practice &quot;{item.word}&quot; in Quiz</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
