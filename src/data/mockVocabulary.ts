import { WordItem, Unit, UserStats, ShopItem } from "@/types/vocabulary";

export const initialUserStats: UserStats = {
  userName: "Ibrohim",
  streakDays: 5,
  totalCoins: 160,
  wordsMastered: 38,
  dailyGoalWords: 10,
  completedTodayWords: 7,
  hasStreakFreeze: false,
  isDarkModeUnlocked: false,
  hasGoldenCrown: false,
};

export const sampleUnits: Unit[] = [
  {
    id: 1,
    title: "Unit 1: The Foundations",
    subtitle: "Essential Words Book 5",
    description: "Master academic and descriptive vocabulary essential for IELTS Task 2 essays and Speaking Band 7+.",
    totalWords: 20,
    masteredWords: 14,
    isLocked: false,
  },
  {
    id: 2,
    title: "Unit 2: Academic Explorations",
    subtitle: "Essential Words Book 5",
    description: "Advanced analytical terms commonly found in IELTS Academic Reading passages.",
    totalWords: 20,
    masteredWords: 6,
    isLocked: false,
  },
  {
    id: 3,
    title: "Unit 3: Society & Governance",
    subtitle: "Essential Words Book 5",
    description: "Formal terminology regarding institutions, social laws, and civic engagement.",
    totalWords: 20,
    masteredWords: 0,
    isLocked: true,
  },
  {
    id: 4,
    title: "Unit 4: Science & Global Impact",
    subtitle: "Essential Words Book 5",
    description: "Environmental and technological high-frequency words for IELTS Writing Task 1 and 2.",
    totalWords: 20,
    masteredWords: 0,
    isLocked: true,
  },
];

export const sampleWords: WordItem[] = [
  {
    id: "w1",
    word: "Allot",
    phonetic: "/əˈlɒt/",
    partOfSpeech: "verb",
    definition: "To allot something means to give it to someone.",
    example: "The coach allotted each team five minutes to prepare a strategy.",
    translations: {
      uzbek: "Ajratmoq, bermoq",
      russian: "Выделять, предоставлять",
    },
    audioText: "Allot. To allot something means to give it to someone. The coach allotted each team five minutes to prepare a strategy.",
    clozeSentence: "The coach ______ each team five minutes to prepare a strategy.",
    targetAnswer: "allotted",
  },
  {
    id: "w2",
    word: "Appall",
    phonetic: "/əˈpɔːl/",
    partOfSpeech: "verb",
    definition: "To appall someone means to cause disgust, shock, or dismay.",
    example: "The horrific news of the disaster appalled everyone across the world.",
    translations: {
      uzbek: "Dahshatga solmoq, lol qoldirmoq",
      russian: "Ужасать, потрясать",
    },
    audioText: "Appall. To appall someone means to cause disgust, shock, or dismay.",
    clozeSentence: "The horrific news of the disaster ______ everyone across the world.",
    targetAnswer: "appalled",
  },
  {
    id: "w3",
    word: "Cache",
    phonetic: "/kæʃ/",
    partOfSpeech: "noun",
    definition: "A cache is a hiding place for valuable things.",
    example: "The pirate hid his treasure in a secret cache inside the mountain cave.",
    translations: {
      uzbek: "Maxfiy ombor, yashirin joy",
      russian: "Тайник, скрытый склад",
    },
    audioText: "Cache. A cache is a hiding place for valuable things.",
    clozeSentence: "The pirate hid his treasure in a secret ______ inside the mountain cave.",
    targetAnswer: "cache",
  },
  {
    id: "w4",
    word: "Concur",
    phonetic: "/kənˈkɜːr/",
    partOfSpeech: "verb",
    definition: "To concur means to agree with someone or have the same opinion.",
    example: "All members of the research council concurred that the findings were groundbreaking.",
    translations: {
      uzbek: "Fikrga qo'shilmoq, yakdillik bildirmoq",
      russian: "Соглашаться, сходиться во мнениях",
    },
    audioText: "Concur. To concur means to agree with someone or have the same opinion.",
    clozeSentence: "All members of the research council ______ that the findings were groundbreaking.",
    targetAnswer: "concurred",
  },
];

export const giftShopItems: ShopItem[] = [
  {
    id: "freeze-streak",
    title: "Freeze Streak",
    cost: 50,
    description: "Keep your streak alive if you miss a day.",
    icon: "flame",
  },
  {
    id: "dark-mode",
    title: "Dark Mode Theme",
    cost: 100,
    description: "Unlock the sleek dark UI.",
    icon: "moon",
  },
  {
    id: "golden-crown",
    title: "Golden Crown Avatar",
    cost: 500,
    description: "Show off your mastery.",
    icon: "crown",
  },
];
