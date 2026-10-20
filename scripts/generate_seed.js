const fs = require('fs');
const path = require('path');

const vocabDataPath = path.join(__dirname, '..', 'src', 'data', 'vocabularyData.ts');
const content = fs.readFileSync(vocabDataPath, 'utf8');

// Parse sampleUnits
const unitsMatch = content.match(/export const sampleUnits:\s*Unit\[\]\s*=\s*(\[[\s\S]*?\]);/);
if (!unitsMatch) {
  console.error('Could not find sampleUnits');
  process.exit(1);
}
const sampleUnits = JSON.parse(unitsMatch[1]);

// Parse sampleWords
const wordsMatch = content.match(/export const sampleWords:\s*WordItem\[\]\s*=\s*(\[[\s\S]*?\]);/);
if (!wordsMatch) {
  console.error('Could not find sampleWords');
  process.exit(1);
}
const sampleWords = JSON.parse(wordsMatch[1]);

console.log(`Parsed ${sampleUnits.length} units and ${sampleWords.length} words.`);

// Helper for SQL string escaping
function sqlEscape(val) {
  if (val === null || val === undefined) return 'NULL';
  return `'${String(val).replace(/'/g, "''")}'`;
}

function sqlArrayEscape(arr) {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return "'{}'::TEXT[]";
  const elements = arr.map(item => `"${String(item).replace(/"/g, '\\"')}"`).join(',');
  return `'${String(elements).replace(/'/g, "''")}'::TEXT[]`;
}

// Generate SQL
let sql = `-- =====================================================================\n`;
sql += `-- LexiVance IELTS Seed Data: Units 1-15 & 301 Verified Words\n`;
sql += `-- Source: 4000 Essential English Words Book 5 Curriculum\n`;
sql += `-- Generated on ${new Date().toISOString()}\n`;
sql += `-- =====================================================================\n\n`;

// 1. Insert Units
sql += `-- 1. Insert Units\n`;
sql += `INSERT INTO public.vocabulary_units (id, title, slug, subtitle, description, unit_number, total_words, category, display_order, is_published)\nVALUES\n`;

const unitValues = sampleUnits.slice(0, 15).map(u => {
  const slug = `unit-${u.id}`;
  return `  (${u.id}, ${sqlEscape(u.title)}, ${sqlEscape(slug)}, ${sqlEscape(u.subtitle)}, ${sqlEscape(u.description)}, ${u.id}, ${u.totalWords || 20}, ${sqlEscape(u.category || 'Foundation & Academic')}, ${u.id}, TRUE)`;
});

sql += unitValues.join(',\n') + '\n';
sql += `ON CONFLICT (id) DO UPDATE SET\n`;
sql += `  title = EXCLUDED.title,\n  slug = EXCLUDED.slug,\n  subtitle = EXCLUDED.subtitle,\n  description = EXCLUDED.description,\n  total_words = EXCLUDED.total_words,\n  category = EXCLUDED.category,\n  updated_at = NOW();\n\n`;

// 2. Insert Words in batches
sql += `-- 2. Insert 301 Words\n`;
sql += `INSERT INTO public.vocabulary_words (\n`;
sql += `  id, word, normalized_word, unit_id, part_of_speech, ipa_us, ipa_uk,\n`;
sql += `  definition_en, definition_uz, translation_uz, translation_ru,\n`;
sql += `  example_sentence_en, example_translation_uz, cloze_sentence, target_answer,\n`;
sql += `  synonyms, collocations, difficulty_level, display_order, is_published\n`;
sql += `)\nVALUES\n`;

const wordValues = sampleWords.map((w, index) => {
  const norm = w.word.toLowerCase().trim();
  const cloze = w.clozeSentence || w.example.replace(new RegExp(`\\b${w.word}\\b`, 'gi'), '__________');
  const targetAns = w.targetAnswer || w.word;
  const pos = w.partOfSpeech || 'noun';
  const ipa = w.phonetic || '';
  const diff = w.unit <= 5 ? 'B2' : (w.unit <= 10 ? 'C1' : 'C2');

  return `  (${sqlEscape(w.id)}, ${sqlEscape(w.word)}, ${sqlEscape(norm)}, ${w.unit}, ${sqlEscape(pos)}, ${sqlEscape(ipa)}, ${sqlEscape(ipa)}, ` +
    `${sqlEscape(w.definition)}, ${sqlEscape(w.uzbekDefinition || '')}, ${sqlEscape(w.translations.uzbek)}, ${sqlEscape(w.translations.russian || '')}, ` +
    `${sqlEscape(w.example)}, ${sqlEscape(w.uzbekExample || '')}, ${sqlEscape(cloze)}, ${sqlEscape(targetAns)}, ` +
    `${sqlArrayEscape(w.synonyms)}, ${sqlArrayEscape(w.collocations)}, ${sqlEscape(diff)}, ${index + 1}, TRUE)`;
});

sql += wordValues.join(',\n') + '\n';
sql += `ON CONFLICT (id) DO UPDATE SET\n`;
sql += `  word = EXCLUDED.word,\n  normalized_word = EXCLUDED.normalized_word,\n  unit_id = EXCLUDED.unit_id,\n`;
sql += `  part_of_speech = EXCLUDED.part_of_speech,\n  ipa_us = EXCLUDED.ipa_us,\n  ipa_uk = EXCLUDED.ipa_uk,\n`;
sql += `  definition_en = EXCLUDED.definition_en,\n  definition_uz = EXCLUDED.definition_uz,\n  translation_uz = EXCLUDED.translation_uz,\n`;
sql += `  example_sentence_en = EXCLUDED.example_sentence_en,\n  example_translation_uz = EXCLUDED.example_translation_uz,\n`;
sql += `  synonyms = EXCLUDED.synonyms,\n  collocations = EXCLUDED.collocations,\n  updated_at = NOW();\n\n`;

// 3. Insert Default Study Hacks / Mnemonics
sql += `-- 3. Default Curated Study Hacks\n`;
sql += `-- Note: Authors can be linked to bootstrap admin or system user\n`;

const seedSqlPath = path.join(__dirname, '..', 'supabase', 'seed.sql');
fs.writeFileSync(seedSqlPath, sql, 'utf8');
console.log(`Generated seed SQL at: ${seedSqlPath} (${(sql.length / 1024).toFixed(1)} KB)`);

// Also save json for easy API/service consumption
const jsonPath = path.join(__dirname, '..', 'src', 'data', 'vocabulary.json');
fs.writeFileSync(jsonPath, JSON.stringify({ units: sampleUnits.slice(0, 15), words: sampleWords }, null, 2), 'utf8');
console.log(`Saved structured JSON at: ${jsonPath}`);
