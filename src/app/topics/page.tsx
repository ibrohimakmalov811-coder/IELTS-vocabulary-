"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useVocab } from "@/components/layout/ClientLayout";
import { IELTS_TOPICS, getWordsForTopic } from "@/data/topicsData";
import { IELTSTopic, WordItem } from "@/types/vocabulary";
import { WordCard } from "@/components/WordCard";
import {
  GraduationCap,
  TreePine,
  Cpu,
  HeartPulse,
  Users,
  Briefcase,
  FlaskConical,
  Palette,
  Scale,
  Globe,
  Newspaper,
  Building2,
  Sparkles,
  BookOpen,
  Volume2,
  Zap,
  ArrowRight,
  Filter,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const TOPIC_ICON_MAP: Record<string, any> = {
  GraduationCap,
  TreePine,
  Cpu,
  HeartPulse,
  Users,
  Briefcase,
  FlaskConical,
  Palette,
  Scale,
  Globe,
  Newspaper,
  Building2,
};

function TopicsContent() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("topic") || "education";

  const { store, playAudio, activePlayingWord, openWordDetails } = useVocab();
  const [selectedTopicSlug, setSelectedTopicSlug] = useState<string>(initialTopic);
  const [activeTab, setActiveTab] = useState<"words" | "speaking" | "writing">("words");

  const currentTopic = useMemo(() => {
    return IELTS_TOPICS.find((t) => t.slug === selectedTopicSlug) || IELTS_TOPICS[0];
  }, [selectedTopicSlug]);

  const topicWords = useMemo(() => {
    return getWordsForTopic(currentTopic.slug);
  }, [currentTopic]);

  const IconComponent = TOPIC_ICON_MAP[currentTopic.icon] || BookOpen;

  return (
    <div className="min-h-screen py-8 sm:py-12 space-y-10">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-tealAccent/15 text-teal-800 dark:text-tealAccent border border-tealAccent/30">
          <Globe className="w-4 h-4" />
          <span>IELTS Speaking &amp; Writing Topic Vault</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slateText-heading dark:text-white tracking-tight">
          IELTS Topic Explorer
        </h1>

        <p className="text-sm sm:text-base text-slateText-body dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          IELTS imtihonida so&apos;zlarni mavzulashtirilgan kontekstda o&apos;rganish Speaking Part 2/3 va Writing Task 2 da yuqori leksik ball (Band 7.5+) kafolatlaydi. 12 ta asosiy akademik mavzuni tanlang va chuqurlashtirilgan iboralarni o&apos;zlashtiring.
        </p>
      </div>

      {/* 12 Topic Selector Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {IELTS_TOPICS.map((topic) => {
            const isSelected = topic.slug === selectedTopicSlug;
            const TopicIcon = TOPIC_ICON_MAP[topic.icon] || BookOpen;

            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopicSlug(topic.slug)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 relative overflow-hidden ${
                  isSelected
                    ? "bg-primary text-white border-primary shadow-soft"
                    : "bg-surface dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 text-slateText-heading dark:text-slate-200 hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className={`p-2 rounded-xl ${
                      isSelected ? "bg-white/20 text-white" : "bg-primary-light/50 dark:bg-primary/20 text-primary"
                    }`}
                  >
                    <TopicIcon className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                      isSelected ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slateText-muted"
                    }`}
                  >
                    {topic.wordCount} ta
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-black line-clamp-1">{topic.titleUz}</h3>
                  <p className={`text-[10px] truncate ${isSelected ? "text-white/80" : "text-slateText-muted"}`}>
                    {topic.titleEn}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Topic Focused View */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <IconComponent className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-black text-slateText-heading dark:text-white">
                    {currentTopic.titleEn}
                  </h2>
                  <span className="text-xs font-bold text-tealAccent">({currentTopic.titleUz})</span>
                </div>
                <p className="text-xs sm:text-sm text-slateText-body dark:text-slate-300 max-w-2xl">
                  {currentTopic.descriptionUz}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href={`/practice?topic=${currentTopic.slug}`}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Ushbu mavzuda test topshirish</span>
              </Link>
            </div>
          </div>

          {/* Sub Navigation Tabs (Words / Speaking / Writing Context) */}
          <div className="flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-800/80 pb-3">
            <button
              onClick={() => setActiveTab("words")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "words"
                  ? "bg-primary text-white shadow-xs"
                  : "text-slateText-muted hover:text-slateText-heading dark:hover:text-white"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Mavzu So&apos;zlari ({topicWords.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("speaking")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "speaking"
                  ? "bg-primary text-white shadow-xs"
                  : "text-slateText-muted hover:text-slateText-heading dark:hover:text-white"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>IELTS Speaking Savoli</span>
            </button>

            <button
              onClick={() => setActiveTab("writing")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === "writing"
                  ? "bg-primary text-white shadow-xs"
                  : "text-slateText-muted hover:text-slateText-heading dark:hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>IELTS Writing Task 2 Savoli</span>
            </button>
          </div>

          {/* Tab 1: Topic Words */}
          {activeTab === "words" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {topicWords.map((word) => (
                  <WordCard
                    key={word.id}
                    word={word}
                    isLearned={store.isWordLearned(word.id)}
                    isFavorite={store.isWordFavorite(word.id)}
                    onToggleLearned={() => store.toggleLearned(word.id)}
                    onToggleFavorite={() => store.toggleFavorite(word.id)}
                    onPlayAudio={() => playAudio(word.word)}
                    isPlayingAudio={activePlayingWord === word.word}
                    onOpenDetails={() => openWordDetails(word)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Speaking Prompt & Strategy */}
          {activeTab === "speaking" && (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-tealAccent font-bold text-xs uppercase tracking-wider">
                <MessageSquare className="w-4 h-4" />
                <span>Speaking Part 2 / 3 Real Exam Prompt</span>
              </div>
              <blockquote className="text-base sm:text-lg font-black text-slateText-heading dark:text-white italic border-l-4 border-tealAccent pl-4">
                &ldquo;{currentTopic.speakingPrompt}&rdquo;
              </blockquote>
              <p className="text-xs text-slateText-body dark:text-slate-300 leading-relaxed">
                <strong>Imtihon maslahati:</strong> Javob berishda yuqoridagi {topicWords.length} ta mavzuga oid so&apos;zlardan kamida 4-5 tasini (masalan: <em>{topicWords.slice(0, 3).map((w) => w.word).join(", ")}</em>) tabiiy bog&apos;lovchilar bilan ishlating.
              </p>
            </div>
          )}

          {/* Tab 3: Writing Task 2 Essay Prompt */}
          {activeTab === "writing" && (
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>Academic Writing Task 2 Essay Prompt</span>
              </div>
              <blockquote className="text-base sm:text-lg font-black text-slateText-heading dark:text-white italic border-l-4 border-primary pl-4">
                &ldquo;{currentTopic.writingPrompt}&rdquo;
              </blockquote>
              <p className="text-xs text-slateText-body dark:text-slate-300 leading-relaxed">
                <strong>Insho tuzish bo&apos;yicha yo&apos;riqnoma:</strong> Ushbu inshoning tana paragraflarida mavzuli akademik kollokatsiyalardan foydalaning va keltirilgan dalillarni shu mavzudagi maxsus lug&apos;at bilan boyiting.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TopicsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TopicsContent />
    </Suspense>
  );
}
