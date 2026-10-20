"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { LandingHero } from "@/components/LandingHero";
import { UserDashboard } from "@/components/UserDashboard";
import { VocabularyLibrary } from "@/components/VocabularyLibrary";
import { FlashcardReview } from "@/components/FlashcardReview";
import { WordCardInterface } from "@/components/WordCardInterface";
import { WordDetailModal } from "@/components/WordDetailModal";
import { GiftShopModal } from "@/components/GiftShopModal";
import { sampleWords, sampleUnits } from "@/data/vocabularyData";
import { useVocabularyStore } from "@/hooks/useVocabularyStore";
import { audioPlayer } from "@/utils/audioPlayer";
import { ViewTab, WordItem } from "@/types/vocabulary";

export default function Home() {
  const {
    isLoaded,
    learnedWordIds,
    favoriteWordIds,
    recentlyStudiedIds,
    stats,
    accent,
    isDarkMode,
    toggleLearned,
    toggleFavorite,
    addRecentlyStudied,
    addCoins,
    purchaseItem,
    toggleDarkMode,
    setAccent,
  } = useVocabularyStore();

  const [activeTab, setActiveTab] = useState<ViewTab>("dashboard");
  const [activeUnitForPractice, setActiveUnitForPractice] = useState<number>(1);
  const [selectedWordForModal, setSelectedWordForModal] = useState<WordItem | null>(null);
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [activePlayingWord, setActivePlayingWord] = useState<string | null>(null);

  // Audio Playback Handler
  const handlePlayAudio = (textToPlay: string) => {
    setActivePlayingWord(textToPlay);
    audioPlayer.playWord(textToPlay, {
      accent,
      onEnd: () => setActivePlayingWord(null),
      onError: () => setActivePlayingWord(null),
    });
  };

  // Open Word Details Modal
  const handleOpenWordDetails = (word: WordItem) => {
    setSelectedWordForModal(word);
    setIsWordModalOpen(true);
    addRecentlyStudied(word.id);
  };

  // Recently studied words objects
  const recentlyStudiedWords = recentlyStudiedIds
    .map((id) => sampleWords.find((w) => w.id === id))
    .filter(Boolean) as WordItem[];

  // Start learning a unit -> launches Practice Tasks view with words from that unit
  const handleStartUnit = (unitId: number) => {
    setActiveUnitForPractice(unitId);
    setActiveTab("tasks");
  };

  // Words for the active practice unit
  const activeUnitWords = sampleWords.filter((w) => w.unit === activeUnitForPractice);
  const practiceWords = activeUnitWords.length > 0 ? activeUnitWords : sampleWords.slice(0, 20);

  // Modal navigation index
  const currentModalIndex = selectedWordForModal
    ? sampleWords.findIndex((w) => w.id === selectedWordForModal.id)
    : -1;

  const handleModalPrev = () => {
    if (currentModalIndex > 0) {
      const prevWord = sampleWords[currentModalIndex - 1];
      setSelectedWordForModal(prevWord);
      addRecentlyStudied(prevWord.id);
    }
  };

  const handleModalNext = () => {
    if (currentModalIndex < sampleWords.length - 1 && currentModalIndex !== -1) {
      const nextWord = sampleWords[currentModalIndex + 1];
      setSelectedWordForModal(nextWord);
      addRecentlyStudied(nextWord.id);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-tealAccent animate-spin flex items-center justify-center shadow-soft">
            <span className="text-white font-bold text-sm">E5</span>
          </div>
          <span className="text-xs font-bold text-slateText-muted uppercase tracking-wider">
            Loading Essential 5...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-slate-950 text-slate-100" : "bg-background text-slateText-body"} font-sans transition-colors`}>
      {/* Universal Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        totalCoins={stats.totalCoins}
        hasCrown={stats.hasGoldenCrown}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        accent={accent}
        onToggleAccent={() => setAccent(accent === "US" ? "UK" : "US")}
        onOpenShop={() => setIsShopModalOpen(true)}
      />

      {/* Main Dynamic View Content */}
      <main>
        {activeTab === "landing" && (
          <LandingHero
            onStart={() => setActiveTab("dashboard")}
            onBrowseLibrary={() => setActiveTab("library")}
          />
        )}

        {activeTab === "dashboard" && (
          <UserDashboard
            stats={stats}
            units={sampleUnits}
            allWords={sampleWords}
            learnedWordIds={learnedWordIds}
            favoriteWordIds={favoriteWordIds}
            recentlyStudiedWords={recentlyStudiedWords}
            onStartUnit={handleStartUnit}
            onOpenWordDetails={handleOpenWordDetails}
            onOpenShop={() => setIsShopModalOpen(true)}
            onGoToLibrary={(unitId) => {
              setActiveTab("library");
            }}
            onGoToFlashcards={() => setActiveTab("flashcards")}
            onGoToTasks={() => setActiveTab("tasks")}
          />
        )}

        {activeTab === "library" && (
          <VocabularyLibrary
            words={sampleWords}
            units={sampleUnits}
            learnedWordIds={learnedWordIds}
            favoriteWordIds={favoriteWordIds}
            onToggleLearned={toggleLearned}
            onToggleFavorite={toggleFavorite}
            onOpenDetails={handleOpenWordDetails}
            onPlayAudio={handlePlayAudio}
            activePlayingWord={activePlayingWord}
          />
        )}

        {activeTab === "flashcards" && (
          <FlashcardReview
            words={sampleWords}
            units={sampleUnits}
            learnedWordIds={learnedWordIds}
            onToggleLearned={toggleLearned}
            onPlayAudio={handlePlayAudio}
            isPlayingAudio={activePlayingWord !== null}
            onEarnCoins={addCoins}
          />
        )}

        {activeTab === "tasks" && (
          <div className="py-4">
            <WordCardInterface
              words={practiceWords}
              currentWordIndex={0}
              totalCoins={stats.totalCoins}
              onNextWord={() => {}}
              onPrevWord={() => {}}
              onBackToDashboard={() => setActiveTab("dashboard")}
              onEarnCoins={addCoins}
            />
          </div>
        )}
      </main>

      {/* Word Details Modal */}
      <WordDetailModal
        word={selectedWordForModal}
        isOpen={isWordModalOpen}
        onClose={() => setIsWordModalOpen(false)}
        onPrevWord={handleModalPrev}
        onNextWord={handleModalNext}
        hasPrev={currentModalIndex > 0}
        hasNext={currentModalIndex < sampleWords.length - 1 && currentModalIndex !== -1}
        isLearned={selectedWordForModal ? learnedWordIds.includes(selectedWordForModal.id) : false}
        isFavorite={selectedWordForModal ? favoriteWordIds.includes(selectedWordForModal.id) : false}
        onToggleLearned={toggleLearned}
        onToggleFavorite={toggleFavorite}
        onPlayAudio={handlePlayAudio}
        isPlayingAudio={activePlayingWord === selectedWordForModal?.word}
        accent={accent}
      />

      {/* Gift Shop Rewards Modal */}
      <GiftShopModal
        isOpen={isShopModalOpen}
        totalCoins={stats.totalCoins}
        hasStreakFreeze={stats.hasStreakFreeze}
        isDarkModeUnlocked={stats.isDarkModeUnlocked}
        hasGoldenCrown={stats.hasGoldenCrown}
        onClose={() => setIsShopModalOpen(false)}
        onPurchase={purchaseItem}
      />
    </div>
  );
}
