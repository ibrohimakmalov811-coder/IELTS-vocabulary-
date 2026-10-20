export interface WordItem {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  translations: {
    uzbek: string;
    russian: string;
  };
  audioText: string;
  clozeSentence: string;
  targetAnswer: string;
}

export interface Unit {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  totalWords: number;
  masteredWords: number;
  isLocked: boolean;
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
