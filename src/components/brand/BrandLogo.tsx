"use client";

import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  variant?: "full" | "icon-only" | "compact";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = "full",
  className = "",
  size = "md",
}) => {
  const iconSize = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-12 h-12" : "w-10 h-10";
  const textSize = size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-lg";

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group cursor-pointer ${className}`}>
      {/* Custom Original Brand Mark SVG */}
      <div
        className={`${iconSize} rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 p-0.5 shadow-soft border border-indigo-500/30 group-hover:border-sky-400/50 group-hover:shadow-glow transition-all duration-300 relative shrink-0`}
      >
        <div className="w-full h-full rounded-[14px] bg-slate-950/80 flex items-center justify-center overflow-hidden relative">
          {/* Ambient inner glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-sky-500/20 to-tealAccent/20 opacity-70 group-hover:opacity-100 transition-opacity" />

          {/* Original Geometric Icon: Open Book + Ascending Progress Bars + Audio Wave */}
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 relative z-10"
          >
            {/* Left page / foundation */}
            <path
              d="M7 23C7 20.7909 8.79086 19 11 19H16V9C13.5 9 10 10.2 8 11.5V22.5C8 22.8 7.6 23 7 23Z"
              fill="url(#brand-grad-1)"
              className="group-hover:opacity-90 transition-opacity"
            />
            {/* Right page / rising apex */}
            <path
              d="M25 23C25 20.7909 23.2091 19 21 19H16V6C19 6 22.5 7.5 24.5 9V22.5C24.5 22.8 24.8 23 25 23Z"
              fill="url(#brand-grad-2)"
              className="group-hover:opacity-90 transition-opacity"
            />
            {/* Center bookmark / apex diamond */}
            <path
              d="M16 5L17.5 7.5L16 10L14.5 7.5L16 5Z"
              fill="#50E3C2"
              className="animate-pulse"
            />
            {/* Audio pronunciation pulse dots */}
            <circle cx="21" cy="11" r="1" fill="#38BDF8" />
            <circle cx="23.5" cy="12.5" r="1" fill="#818CF8" />

            <defs>
              <linearGradient id="brand-grad-1" x1="7" y1="9" x2="16" y2="23" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366F1" />
                <stop offset="1" stopColor="#38BDF8" />
              </linearGradient>
              <linearGradient id="brand-grad-2" x1="16" y1="6" x2="25" y2="23" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38BDF8" />
                <stop offset="1" stopColor="#50E3C2" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Typography & Brand Slogan */}
      {variant !== "icon-only" && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-black ${textSize} tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-sky-100 dark:to-indigo-200 bg-clip-text text-transparent`}
            >
              LexiVance
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-sky-400 border border-indigo-500/20">
              IELTS
            </span>
          </div>

          {variant === "full" && (
            <span className="text-[11px] font-semibold text-slateText-muted dark:text-slate-400 tracking-tight mt-0.5">
              Essential 5 Vocabulary System
            </span>
          )}
        </div>
      )}
    </Link>
  );
};
