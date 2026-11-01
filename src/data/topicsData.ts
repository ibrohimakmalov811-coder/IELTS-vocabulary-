import { IELTSTopic, WordItem } from "@/types/vocabulary";
import { sampleWords } from "@/data/vocabularyData";

export const IELTS_TOPICS: IELTSTopic[] = [
  {
    id: "top_1",
    slug: "education",
    titleEn: "Education & Academia",
    titleUz: "Ta'lim va Ilm-fan",
    icon: "GraduationCap",
    descriptionEn: "Academic vocabulary for higher education, universities, curriculum, and research methods.",
    descriptionUz: "Oliy ta'lim, universitetlar, o'quv dasturlari va tadqiqot usullari uchun akademik so'zlar.",
    speakingPrompt: "Describe an educational experience or teacher that had a profound impact on your academic career.",
    writingPrompt: "Some people believe that universities should focus exclusively on job training rather than general academic knowledge. To what extent do you agree?",
    wordCount: 0,
  },
  {
    id: "top_2",
    slug: "environment",
    titleEn: "Environment & Climate",
    titleUz: "Atrof-muhit va Iqlim",
    icon: "TreePine",
    descriptionEn: "Critical vocabulary for global warming, ecosystem conservation, renewable energy, and biodiversity.",
    descriptionUz: "Global isish, ekotizimlarni asrash, qayta tiklanuvchi energiya va bioxilma-xillik uchun muhim so'zlar.",
    speakingPrompt: "Do you think individual actions or government regulations are more effective in curbing environmental pollution?",
    writingPrompt: "Many natural habitats are being destroyed due to human development. Discuss the causes and evaluate potential long-term solutions.",
    wordCount: 0,
  },
  {
    id: "top_3",
    slug: "technology",
    titleEn: "Technology & AI",
    titleUz: "Texnologiya va Sun'iy Intellekt",
    icon: "Cpu",
    descriptionEn: "Advanced terms for artificial intelligence, automation, digital literacy, and data privacy.",
    descriptionUz: "Sun'iy intellekt, avtomatlashtirish, raqamli savodxonlik va ma'lumotlar xavfsizligi bo'yicha ilg'or atamalar.",
    speakingPrompt: "How has modern digital technology altered the way people communicate with their colleagues and friends?",
    writingPrompt: "The rise of artificial intelligence will lead to the elimination of millions of routine jobs. Do the advantages of AI outweigh its risks?",
    wordCount: 0,
  },
  {
    id: "top_4",
    slug: "health",
    titleEn: "Health & Well-being",
    titleUz: "Salomatlik va Tibbiyot",
    icon: "HeartPulse",
    descriptionEn: "High-band vocabulary for public healthcare, nutrition, chronic diseases, and mental wellness.",
    descriptionUz: "Aholi salomatligi, to'g'ri ovqatlanish, surunkali kasalliklar va ruhiy tetiklik uchun yuqori band so'zlari.",
    speakingPrompt: "What lifestyle adjustments should modern urban dwellers adopt to preserve their long-term cardiovascular health?",
    writingPrompt: "Governments should impose heavy taxes on fast food and sugary beverages to discourage unhealthy consumption. Discuss both views.",
    wordCount: 0,
  },
  {
    id: "top_5",
    slug: "society",
    titleEn: "Society & Community",
    titleUz: "Jamiyat va Oilaviy Hayot",
    icon: "Users",
    descriptionEn: "Sociological vocabulary covering demographic changes, inequality, family dynamics, and social cohesion.",
    descriptionUz: "Demografik o'zgarishlar, tengsizlik, oilaviy munosabatlar va ijtimoiy hamjihatlikni ifodalovchi so'zlar.",
    speakingPrompt: "How has the structure of the traditional nuclear and extended family evolved in your country over recent decades?",
    writingPrompt: "In many countries, the elderly population is growing rapidly. What social and economic challenges does this pose for society?",
    wordCount: 0,
  },
  {
    id: "top_6",
    slug: "business",
    titleEn: "Business & Economy",
    titleUz: "Biznes, Mehnat va Iqtisodiyot",
    icon: "Briefcase",
    descriptionEn: "Essential terms for international commerce, macroeconomic policy, employment markets, and fiscal investment.",
    descriptionUz: "Xalqaro savdo, makroiqtisodiy siyosat, mehnat bozori va moliyaviy investitsiyalar uchun muhim atamalar.",
    speakingPrompt: "What qualities make an entrepreneur capable of surviving intense competition in a saturated market?",
    writingPrompt: "Some argue that economic growth is the ultimate indicator of national success. Others insist other factors like happiness matter more. Discuss.",
    wordCount: 0,
  },
  {
    id: "top_7",
    slug: "science",
    titleEn: "Science & Innovation",
    titleUz: "Fan va Ilmiy Tadqiqot",
    icon: "FlaskConical",
    descriptionEn: "Vocabulary for scientific discoveries, empirical testing, laboratory research, and medical breakthroughs.",
    descriptionUz: "Ilmiy kashfiyotlar, empirik tajribalar, laboratoriya izlanishlari va tibbiy yutuqlarni yorituvchi so'zlar.",
    speakingPrompt: "Should state funding prioritize pure scientific research, or should funds only support research with immediate practical utility?",
    writingPrompt: "Space exploration requires billions in capital investment. Some believe this budget would be better spent alleviating terrestrial poverty. Discuss.",
    wordCount: 0,
  },
  {
    id: "top_8",
    slug: "culture",
    titleEn: "Culture & Heritage",
    titleUz: "Madaniyat, San'at va Meros",
    icon: "Palette",
    descriptionEn: "High-level vocabulary for historical preservation, traditional arts, linguistics, and cultural assimilation.",
    descriptionUz: "Tarixiy yodgorliklarni saqlash, an'anaviy san'at, tilshunoslik va madaniy uyg'unlashuv so'zlari.",
    speakingPrompt: "Why is it essential for younger generations to understand and celebrate their nation's intangible cultural heritage?",
    writingPrompt: "Global mass media is eroding indigenous traditions and local cultural identities. Do you agree or disagree with this perspective?",
    wordCount: 0,
  },
  {
    id: "top_9",
    slug: "crime",
    titleEn: "Crime & Justice",
    titleUz: "Jinoyat, Qonun va Adliya",
    icon: "Scale",
    descriptionEn: "Legal and criminological vocabulary for penal systems, rehabilitation, juvenile delinquency, and legislation.",
    descriptionUz: "Jazo tizimi, mahbuslarni reabilitatsiya qilish, yoshlar jinoyatchiligi va qonunchilikka oid yuridik so'zlar.",
    speakingPrompt: "Do punitive custodial sentences effectively deter criminals from re-offending, or does educational rehabilitation work better?",
    writingPrompt: "Some believe that installing surveillance cameras in public places is necessary to maintain civil order, while others fear a loss of personal privacy. Discuss.",
    wordCount: 0,
  },
  {
    id: "top_10",
    slug: "globalization",
    titleEn: "Globalization & Tourism",
    titleUz: "Globallashuv va Turizm",
    icon: "Globe",
    descriptionEn: "Vocabulary for international integration, multinational corporations, cultural exchange, and eco-tourism.",
    descriptionUz: "Xalqaro integratsiya, transmilliy korporatsiyalar, madaniyatlar almashinuvi va eko-turizm atamalari.",
    speakingPrompt: "What are the main cultural advantages that international tourism brings to historic tourist destinations?",
    writingPrompt: "International tourism often places unsustainable strain on local environmental resources and historical infrastructure. What measures can be taken?",
    wordCount: 0,
  },
  {
    id: "top_11",
    slug: "media",
    titleEn: "Media & Information",
    titleUz: "OAV, Axborot va Reklama",
    icon: "Newspaper",
    descriptionEn: "Journalistic vocabulary for mass communication, digital news, misinformation, censorship, and advertising impact.",
    descriptionUz: "Ommaviy axborot vositalari, raqamli yangiliklar, yolg'on axborotlar, tsenzura va reklama ta'siri so'zlari.",
    speakingPrompt: "How can internet users reliably verify the credibility and authenticity of sensationalist news stories on social media?",
    writingPrompt: "Modern advertising manipulates vulnerable consumers into buying unnecessary luxury commodities. To what extent do you agree?",
    wordCount: 0,
  },
  {
    id: "top_12",
    slug: "cities",
    titleEn: "Cities & Urbanization",
    titleUz: "Shaharlar, Qurilish va Transport",
    icon: "Building2",
    descriptionEn: "Urban planning vocabulary for infrastructure, congestion, mass transit, suburban sprawl, and public housing.",
    descriptionUz: "Shaharsozlik, transport tirbandligi, jamoat transporti, shahar kengayishi va arzon uy-joylar so'zlari.",
    speakingPrompt: "What public transport interventions can metropolitan authorities adopt to significantly alleviate severe vehicular gridlock?",
    writingPrompt: "More people are abandoning rural agricultural regions to seek employment in overcrowded urban centers. Discuss the consequences.",
    wordCount: 0,
  },
];

// Helper to get words associated with a topic
export function getWordsForTopic(slug: string): WordItem[] {
  // Deterministic mapping by hash/index distribution across the 301 academic words
  const topicIndex = IELTS_TOPICS.findIndex((t) => t.slug === slug);
  if (topicIndex === -1) return [];

  // Group 25 distinct words per topic from the 301 vocabulary entries
  return sampleWords.filter((_, idx) => (idx % 12) === topicIndex);
}

// Populate word counts
IELTS_TOPICS.forEach((topic) => {
  topic.wordCount = getWordsForTopic(topic.slug).length;
});
