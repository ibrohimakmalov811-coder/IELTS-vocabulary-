export type PartOfSpeech = "verb" | "noun" | "adjective" | "adverb" | "other";

export interface WordItem {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: PartOfSpeech;
  definition: string;
  uzbekDefinition?: string;
  example: string;
  uzbekExample?: string;
  translations: {
    uzbek: string;
    russian: string;
  };
  unit: number;
  synonyms?: string[];
  collocations?: string[];
  audioText: string;
  clozeSentence?: string;
  targetAnswer?: string;
}

export interface Unit {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  totalWords: number;
  masteredWords: number;
  isLocked: boolean;
  category?: string;
}

export interface UserStats {
  userName: string;
  streakDays: number;
  totalCoins: number;
  wordsMastered: number;
  dailyGoalWords: number;
  completedTodayWords: number;
  hasStreakFreeze: boolean;
  isDarkModeUnlocked: boolean;
  hasGoldenCrown: boolean;
}

export interface ShopItem {
  id: string;
  title: string;
  cost: number;
  description: string;
  icon: string;
}

export type ViewTab = "landing" | "dashboard" | "library" | "flashcards" | "tasks";

export interface VocabularyFilterState {
  searchQuery: string;
  unit: number | "all";
  partOfSpeech: PartOfSpeech | "all";
  status: "all" | "learned" | "unlearned" | "favorites";
  sortBy: "az" | "za" | "unit" | "random";
}
