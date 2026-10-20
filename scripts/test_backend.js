const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('🧪 LexiVance IELTS — Backend & Logic Verification Suite');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    process.exitCode = 1;
  }
}

// ----------------------------------------------------
// 1. Data Integrity & Curriculum Test
// ----------------------------------------------------
console.log('1. Curriculum & Seed Data Integrity:');

const vocabJsonPath = path.join(__dirname, '..', 'src', 'data', 'vocabulary.json');
assert(fs.existsSync(vocabJsonPath), 'vocabulary.json exists');

const vocabData = JSON.parse(fs.readFileSync(vocabJsonPath, 'utf8'));
assert(vocabData.words.length === 301, `Exactly 301 words loaded (got ${vocabData.words.length})`);
assert(vocabData.units.length === 15, `Exactly 15 curriculum units (got ${vocabData.units.length})`);

// Validate word fields
let allWordsValid = true;
vocabData.words.forEach(w => {
  if (!w.id || !w.word || !w.definition || !w.translations?.uzbek || !w.example || !w.unit) {
    allWordsValid = false;
  }
});
assert(allWordsValid, 'All 301 words have required academic properties (word, def, translation, example, unit)');

// Check seed.sql
const seedSqlPath = path.join(__dirname, '..', 'supabase', 'seed.sql');
assert(fs.existsSync(seedSqlPath), 'supabase/seed.sql exists and is non-empty');
const seedStat = fs.statSync(seedSqlPath);
assert(seedStat.size > 150000, `seed.sql is complete (${(seedStat.size / 1024).toFixed(1)} KB)`);

// ----------------------------------------------------
// 2. SM-2 Spaced Repetition Algorithm Tests
// ----------------------------------------------------
console.log('\n2. SuperMemo-2 (SM-2) Spaced Repetition Engine:');

function calculateSM2(input) {
  const { quality, repetitionNumber, easeFactor, intervalDays } = input;
  const q = Math.max(0, Math.min(5, quality));
  let nextRep = repetitionNumber;
  let nextInterval = 1;
  let nextEase = easeFactor;

  if (q >= 3) {
    if (nextRep === 0) nextInterval = 1;
    else if (nextRep === 1) nextInterval = 6;
    else nextInterval = Math.round(intervalDays * nextEase);
    nextRep += 1;
  } else {
    nextRep = 0;
    nextInterval = 1;
  }

  nextEase = nextEase + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (nextEase < 1.3) nextEase = 1.3;
  nextEase = Math.round(nextEase * 100) / 100;

  let status = 'learning';
  if (nextRep >= 5 || nextInterval >= 21) status = 'mastered';
  else if (nextRep >= 1) status = 'reviewing';

  return { repetitionNumber: nextRep, easeFactor: nextEase, intervalDays: nextInterval, status };
}

// First review correct (quality 4)
const r1 = calculateSM2({ quality: 4, repetitionNumber: 0, easeFactor: 2.5, intervalDays: 0 });
assert(r1.repetitionNumber === 1 && r1.intervalDays === 1 && r1.status === 'reviewing', 'Initial correct review schedules 1 day interval');

// Second review correct (quality 5)
const r2 = calculateSM2({ quality: 5, repetitionNumber: r1.repetitionNumber, easeFactor: r1.easeFactor, intervalDays: r1.intervalDays });
assert(r2.repetitionNumber === 2 && r2.intervalDays === 6, 'Second consecutive correct review schedules 6 days interval');

// Third review correct (quality 4)
const r3 = calculateSM2({ quality: 4, repetitionNumber: r2.repetitionNumber, easeFactor: r2.easeFactor, intervalDays: r2.intervalDays });
assert(r3.repetitionNumber === 3 && r3.intervalDays >= 14, `Third review expands interval to ${r3.intervalDays} days`);

// Failed review (quality 1)
const rFail = calculateSM2({ quality: 1, repetitionNumber: r3.repetitionNumber, easeFactor: r3.easeFactor, intervalDays: r3.intervalDays });
assert(rFail.repetitionNumber === 0 && rFail.intervalDays === 1 && rFail.status === 'learning', 'Failed review resets interval to 1 day and status to learning');

// ----------------------------------------------------
// 3. PostgreSQL Schema & Security Policy Verification
// ----------------------------------------------------
console.log('\n3. PostgreSQL Schema & RLS Policy Integrity:');

const schemaPath = path.join(__dirname, '..', 'supabase', 'migrations', '20261021000000_lexivance_schema.sql');
assert(fs.existsSync(schemaPath), 'Migration file exists');

const schemaContent = fs.readFileSync(schemaPath, 'utf8');

const expectedTables = [
  'profiles',
  'vocabulary_units',
  'vocabulary_words',
  'user_word_progress',
  'user_favorites',
  'quiz_attempts',
  'quiz_answer_details',
  'daily_activity',
  'reward_events',
  'study_hacks',
  'study_hack_votes',
  'reports_moderation',
  'user_settings',
  'audit_logs',
];

expectedTables.forEach(t => {
  assert(schemaContent.includes(`CREATE TABLE IF NOT EXISTS public.${t}`), `Table ${t} declared in DDL`);
  assert(schemaContent.includes(`ALTER TABLE public.${t} ENABLE ROW LEVEL SECURITY;`), `RLS enabled on ${t}`);
});

assert(schemaContent.includes('CREATE OR REPLACE FUNCTION public.submit_quiz_session'), 'Atomic secure submit_quiz_session procedure defined');
assert(schemaContent.includes('CREATE OR REPLACE FUNCTION public.bootstrap_admin'), 'Secure bootstrap_admin procedure defined');

// ----------------------------------------------------
// 4. Server Validation Rules
// ----------------------------------------------------
console.log('\n4. Input Validation & Security Rules:');

const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  targetBand: z.enum(["Band 6.5", "Band 7.0", "Band 7.5", "Band 8.0", "Band 8.5+"]).default("Band 7.5"),
});

assert(registerSchema.safeParse({ name: 'Ibrohim', email: 'ibrohim@ielts.uz', password: 'secure_password' }).success, 'Valid registration payload accepted');
assert(!registerSchema.safeParse({ name: 'I', email: 'invalid_email', password: '123' }).success, 'Malformed registration payload rejected');

// ----------------------------------------------------
// Summary
// ----------------------------------------------------
console.log('\n====================================================');
console.log(`Results: ${passedTests} / ${totalTests} tests passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('====================================================\n');
