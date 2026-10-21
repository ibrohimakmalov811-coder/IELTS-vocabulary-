// scripts/compile_all_data.js
const fs = require('fs');
const path = require('path');

const p1 = require('./units_data_part1.js');
const p2 = require('./units_data_part2.js');
const p3 = require('./units_data_part3.js');
const p4 = require('./units_data_part4.js');
const p5 = require('./units_data_part5.js');

const rawWords = [...p1, ...p2, ...p3, ...p4, ...p5];
console.log(`Loaded ${rawWords.length} raw words.`);

// Read existing units
const vjsonPath = path.join(__dirname, '../src/data/vocabulary.json');
const existingVjson = JSON.parse(fs.readFileSync(vjsonPath, 'utf8'));
const units = existingVjson.units;

// Transform words into full WordItem structure
const formattedWords = rawWords.map((item, idx) => {
  return {
    id: `w${idx + 1}`,
    word: item.word,
    phonetic: item.phonetic,
    partOfSpeech: item.partOfSpeech,
    definition: item.definition,
    uzbekDefinition: item.uzbekDefinition,
    example: item.example,
    uzbekExample: item.uzbekExample,
    translations: {
      uzbek: item.uzbek,
      russian: item.russian,
    },
    unit: item.unit,
    synonyms: item.synonyms,
    collocations: item.collocations,
    audioText: item.audioText,
    clozeSentence: item.clozeSentence,
    targetAnswer: item.targetAnswer,
  };
});

// 1. Update src/data/vocabulary.json
const updatedVjson = {
  units,
  words: formattedWords,
};
fs.writeFileSync(vjsonPath, JSON.stringify(updatedVjson, null, 2), 'utf8');
console.log(`Updated ${vjsonPath}`);

// 2. Generate src/data/vocabularyData.ts
const vocabDataTs = `import { WordItem, Unit, UserStats } from "@/types/vocabulary";

export const initialUserStats: UserStats = {
  userName: "O'quvchi",
  streakDays: 0,
  totalCoins: 0,
  wordsMastered: 0,
  dailyGoalWords: 10,
  completedTodayWords: 0,
  hasStreakFreeze: false,
  isDarkModeUnlocked: false,
  hasGoldenCrown: false,
};

export const sampleUnits: Unit[] = ${JSON.stringify(units, null, 2)};

export const sampleWords: WordItem[] = ${JSON.stringify(formattedWords, null, 2)};
`;

const vocabDataTsPath = path.join(__dirname, '../src/data/vocabularyData.ts');
fs.writeFileSync(vocabDataTsPath, vocabDataTs, 'utf8');
console.log(`Updated ${vocabDataTsPath}`);

// 3. Update src/data/mockVocabulary.ts
const mockVocabPath = path.join(__dirname, '../src/data/mockVocabulary.ts');
fs.writeFileSync(mockVocabPath, vocabDataTs, 'utf8');
console.log(`Updated ${mockVocabPath}`);

// 4. Update supabase/seed.sql
const seedSqlPath = path.join(__dirname, '../supabase/seed.sql');
let seedSql = `-- ============================================================================
-- LexiVance IELTS - Essential 5 Complete Seed Data
-- 15 Units & 301 Academic Vocabulary Words
-- ============================================================================

-- Insert Units
INSERT INTO vocabulary_units (unit_number, title, subtitle, description, display_order)
VALUES
`;

const unitValues = units.map(u => {
  const esc = (s) => (s ? s.replace(/'/g, "''") : "");
  return `  (${u.id}, '${esc(u.title)}', '${esc(u.subtitle)}', '${esc(u.description)}', ${u.id})`;
}).join(',\n') + `
ON CONFLICT (unit_number) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description;
`;

seedSql += unitValues;

seedSql += `
-- Insert 301 Vocabulary Words with Authentic Uzbek Translations
INSERT INTO vocabulary_words (
  word, normalized_word, unit_id, part_of_speech, ipa_us,
  definition_en, translation_uz, translation_ru,
  example_sentence_en, example_translation_uz,
  collocations, synonyms, display_order, is_published
)
SELECT
  w.word,
  LOWER(w.word),
  u.id,
  w.part_of_speech,
  w.ipa_us,
  w.definition_en,
  w.translation_uz,
  w.translation_ru,
  w.example_sentence_en,
  w.example_translation_uz,
  w.collocations,
  w.synonyms,
  w.display_order,
  TRUE
FROM (VALUES
`;

const wordValues = formattedWords.map((w, i) => {
  const esc = (s) => (s ? s.replace(/'/g, "''") : "");
  const collJson = JSON.stringify(w.collocations).replace(/'/g, "''");
  const synJson = JSON.stringify(w.synonyms).replace(/'/g, "''");
  return `  ('${esc(w.word)}', ${w.unit}, '${esc(w.partOfSpeech)}', '${esc(w.phonetic)}', '${esc(w.definition)}', '${esc(w.translations.uzbek)}', '${esc(w.translations.russian)}', '${esc(w.example)}', '${esc(w.uzbekExample)}', '${collJson}'::jsonb, '${synJson}'::jsonb, ${i + 1})`;
}).join(',\n');

seedSql += wordValues;
seedSql += `
) AS w(word, unit_number, part_of_speech, ipa_us, definition_en, translation_uz, translation_ru, example_sentence_en, example_translation_uz, collocations, synonyms, display_order)
JOIN vocabulary_units u ON u.unit_number = w.unit_number
ON CONFLICT (normalized_word) DO UPDATE SET
  definition_en = EXCLUDED.definition_en,
  translation_uz = EXCLUDED.translation_uz,
  example_sentence_en = EXCLUDED.example_sentence_en,
  example_translation_uz = EXCLUDED.example_translation_uz,
  collocations = EXCLUDED.collocations,
  synonyms = EXCLUDED.synonyms;
`;

fs.writeFileSync(seedSqlPath, seedSql, 'utf8');
console.log(`Updated ${seedSqlPath}`);
console.log('All compilation completed successfully!');
