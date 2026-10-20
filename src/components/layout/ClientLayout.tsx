"use client";

import React, { useState, createContext, useContext } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GiftShopModal } from "@/components/GiftShopModal";
import { WordDetailModal } from "@/components/WordDetailModal";
import { useVocabularyStore } from "@/hooks/useVocabularyStore";
import { audioPlayer } from "@/utils/audioPlayer";
import { sampleWords } from "@/data/vocabularyData";
import { WordItem } from "@/types/vocabulary";

interface VocabularyContextType {
  store: ReturnType<typeof useVocabularyStore>;
  openWordDetails: (word: WordItem) => void;
  playAudio: (text: string) => void;
  activePlayingWord: string | null;
  openShop: () => void;
}

const VocabularyContext = createContext<VocabularyContextType | null>(null);

export function useVocab() {
  const context = useContext(VocabularyContext);
  if (!context) {
    throw new Error("useVocab must be used within a ClientLayout");
  }
  return context;
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const store = useVocabularyStore();
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [selectedWord, setSelectedWord] = useState<WordItem | null>(null);
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);
  const [activePlayingWord, setActivePlayingWord] = useState<string | null>(null);

  const playAudio = (text: string) => {
    setActivePlayingWord(text);
    audioPlayer.playWord(text, {
      accent: store.accent,
      onEnd: () => setActivePlayingWord(null),
      onError: () => setActivePlayingWord(null),
    });
  };

  const openWordDetails = (word: WordItem) => {
    setSelectedWord(word);
    setIsWordModalOpen(true);
    store.addRecentlyStudied(word.id);
  };

  const currentModalIndex = selectedWord
    ? sampleWords.findIndex((w) => w.id === selectedWord.id)
    : -1;

  const handleModalPrev = () => {
    if (currentModalIndex > 0) {
      const prevWord = sampleWords[currentModalIndex - 1];
      setSelectedWord(prevWord);
      store.addRecentlyStudied(prevWord.id);
    }
  };

  const handleModalNext = () => {
    if (currentModalIndex < sampleWords.length - 1 && currentModalIndex !== -1) {
      const nextWord = sampleWords[currentModalIndex + 1];
      setSelectedWord(nextWord);
      store.addRecentlyStudied(nextWord.id);
    }
  };

  return (
    <VocabularyContext.Provider
      value={{
        store,
        openWordDetails,
        playAudio,
        activePlayingWord,
        openShop: () => setIsShopOpen(true),
      }}
    >
      <div className={`min-h-screen flex flex-col justify-between ${store.isDarkMode ? "dark bg-slate-950 text-slate-100" : "bg-background text-slateText-body"} font-sans transition-colors duration-200`}>
        {/* Persistent Sticky Navbar */}
        <Navbar
          totalCoins={store.stats.totalCoins}
          hasCrown={store.stats.hasGoldenCrown}
          hasFreeze={store.stats.hasStreakFreeze}
          isDarkMode={store.isDarkMode}
          onToggleDarkMode={store.toggleDarkMode}
          accent={store.accent}
          onToggleAccent={() => store.setAccent(store.accent === "US" ? "UK" : "US")}
          onOpenShop={() => setIsShopOpen(true)}
          currentUser={store.currentUser}
          onLogout={store.logout}
        />

        {/* Dynamic Route Content */}
        <div className="flex-1">
          {children}
        </div>

        {/* Professional Footer */}
        <Footer />

        {/* Global Word Details Modal */}
        <WordDetailModal
          word={selectedWord}
          isOpen={isWordModalOpen}
          onClose={() => setIsWordModalOpen(false)}
          onPrevWord={handleModalPrev}
          onNextWord={handleModalNext}
          hasPrev={currentModalIndex > 0}
          hasNext={currentModalIndex < sampleWords.length - 1 && currentModalIndex !== -1}
          isLearned={selectedWord ? store.learnedWordIds.includes(selectedWord.id) : false}
          isFavorite={selectedWord ? store.favoriteWordIds.includes(selectedWord.id) : false}
          onToggleLearned={store.toggleLearned}
          onToggleFavorite={store.toggleFavorite}
          onPlayAudio={playAudio}
          isPlayingAudio={activePlayingWord === selectedWord?.word}
          accent={store.accent}
        />

        {/* Global Gift Shop Modal */}
        <GiftShopModal
          isOpen={isShopOpen}
          totalCoins={store.stats.totalCoins}
          hasStreakFreeze={store.stats.hasStreakFreeze}
          isDarkModeUnlocked={store.stats.isDarkModeUnlocked}
          hasGoldenCrown={store.stats.hasGoldenCrown}
          onClose={() => setIsShopOpen(false)}
          onPurchase={store.purchaseItem}
        />
      </div>
    </VocabularyContext.Provider>
  );
}
