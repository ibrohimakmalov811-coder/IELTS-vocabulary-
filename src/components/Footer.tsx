"use client";

import React from "react";
import Link from "next/link";
import { BrandLogo } from "./brand/BrandLogo";
import { BookOpen, Sparkles, Heart, ShieldCheck, ArrowUpRight } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-surface dark:bg-slate-950 font-sans transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column (2 cols wide) */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo variant="full" size="md" />
            <p className="text-xs sm:text-sm text-slateText-body dark:text-slate-400 max-w-sm leading-relaxed">
              Premium, interactive vocabulary learning platform engineered for Pre-IELTS &amp; IELTS academic students. 
              Master the official 4000 Essential English Words Book 5 curriculum through active recall, native pronunciation, and collocations.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                301 Active Verified Words
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slateText-muted text-xs font-semibold">
                Book 5 Edition
              </span>
            </div>
          </div>

          {/* Col 1: Curriculum */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slateText-heading dark:text-white">
              Curriculum (Book 5)
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slateText-body dark:text-slate-400">
              <li>
                <Link href="/vocabulary?unit=1" className="hover:text-primary dark:hover:text-sky-400 transition-colors">
                  Unit 1: The Foundations
                </Link>
              </li>
              <li>
                <Link href="/vocabulary?unit=2" className="hover:text-primary dark:hover:text-sky-400 transition-colors">
                  Unit 2: Nature &amp; Climate
                </Link>
              </li>
              <li>
                <Link href="/vocabulary?unit=3" className="hover:text-primary dark:hover:text-sky-400 transition-colors">
                  Unit 3: Logic &amp; Science
                </Link>
              </li>
              <li>
                <Link href="/vocabulary?unit=4" className="hover:text-primary dark:hover:text-sky-400 transition-colors">
                  Unit 4: Economy &amp; Law
                </Link>
              </li>
              <li>
                <Link href="/vocabulary" className="text-primary dark:text-sky-400 font-bold flex items-center gap-1">
                  <span>View All 15 Units</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Learning Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slateText-heading dark:text-white">
              Interactive Tools
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slateText-body dark:text-slate-400">
              <li>
                <Link href="/vocabulary" className="hover:text-primary dark:hover:text-sky-400 transition-colors">
                  Vocabulary Library (Search &amp; Filter)
                </Link>
              </li>
              <li>
                <Link href="/practice" className="hover:text-primary dark:hover:text-sky-400 transition-colors">
                  Practice Center &amp; Quizzes
                </Link>
              </li>
              <li>
                <Link href="/learn" className="hover:text-primary dark:hover:text-sky-400 transition-colors">
                  Learning Methods &amp; Spaced Repetition
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary dark:hover:text-sky-400 transition-colors">
                  Personal Progress Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Community & Insights */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slateText-heading dark:text-white">
              Platform &amp; Ideas
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slateText-body dark:text-slate-400">
              <li>
                <Link href="/ideas" className="hover:text-primary dark:hover:text-sky-400 transition-colors">
                  Student Ideas &amp; Study Hacks
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary dark:hover:text-sky-400 transition-colors">
                  About Methodology
                </Link>
              </li>
              <li>
                <span className="text-slateText-muted flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-tealAccent" />
                  No Ads • 100% Free Educational Project
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slateText-muted gap-4">
          <p>
            © {new Date().getFullYear()} LexiVance IELTS. Based on Paul Nation&apos;s &ldquo;4000 Essential English Words Book 5&rdquo;.
          </p>

          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for ambitious IELTS &amp; Pre-IELTS students.
          </p>
        </div>
      </div>
    </footer>
  );
};
