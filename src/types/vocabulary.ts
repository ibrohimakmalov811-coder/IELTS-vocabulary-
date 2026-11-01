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

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  targetBand: string;
  avatarColor?: string;
  joinedAt: string;
}

export interface TestResultSession {
  id: string;
  date: string;
  mode: "quiz" | "recall" | "cloze";
  unit: number | "all";
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  timeSpentSeconds: number;
  coinsEarned: number;
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
  studyTimeSeconds?: number;
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

export interface IELTSTopic {
  id: string;
  slug: string;
  titleEn: string;
  titleUz: string;
  icon: string;
  descriptionEn: string;
  descriptionUz: string;
  speakingPrompt: string;
  writingPrompt: string;
  wordCount: number;
  wordIds?: string[];
}

export interface WeakWordRecord {
  wordId: string;
  word: string;
  phonetic: string;
  translationUz: string;
  definition: string;
  example: string;
  unit: number;
  mistakeCount: number;
  timesSeen: number;
  accuracyPct: number;
  lastMistakeDate: string;
  difficultyScore: number;
}

export interface UserSentenceRecord {
  id: string;
  userId?: string;
  wordId: string;
  word: string;
  sentenceEn: string;
  translationUz?: string;
  ieltsContext: "Speaking Part 2/3" | "Writing Task 2" | "General IELTS";
  feedbackNotes?: string;
  createdAt: string;
}

export interface LearningMission {
  id: string;
  titleEn: string;
  titleUz: string;
  descriptionEn: string;
  descriptionUz: string;
  missionType: "daily" | "weekly" | "achievement";
  targetCount: number;
  currentCount: number;
  targetMetric: "learn_words" | "review_words" | "complete_quiz" | "write_sentence" | "streak_days" | "master_words";
  coinReward: number;
  badgeReward?: string;
  isCompleted: boolean;
  isClaimed: boolean;
}

