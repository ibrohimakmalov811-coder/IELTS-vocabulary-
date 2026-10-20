const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const unitsList = [
  {
    id: 1,
    title: "Unit 1: The Foundations",
    subtitle: "Essential Words Book 5",
    description: "Core academic verbs, adjectives, and descriptive concepts essential for IELTS Writing Task 2 and Speaking Band 7+.",
    words: [
      'allot', 'appall', 'cache', 'convenience', 'dearth', 'deliberate', 'dire', 'elapse', 'empathy', 'fanciful',
      'gripe', 'grueling', 'mundane', 'opt', 'outrage', 'paltry', 'rectify', 'resourceful', 'sustenance', 'tedious'
    ]
  },
  {
    id: 2,
    title: "Unit 2: Geography, Nature & Environment",
    subtitle: "Essential Words Book 5",
    description: "Geographical, climatic, and natural environment vocabulary frequently encountered in IELTS Academic Reading.",
    words: [
      'abbey', 'abundant', 'adjoin', 'ample', 'arid', 'cathedral', 'deprive', 'drought', 'eligible', 'fast',
      'grumble', 'inland', 'moisture', 'nonetheless', 'oath', 'prairie', 'ragged', 'rugged', 'scarce', 'speculate'
    ]
  },
  {
    id: 3,
    title: "Unit 3: Science, Logic & Intellect",
    subtitle: "Essential Words Book 5",
    description: "Analytical, academic, and scientific terms essential for formal academic discourse and essay development.",
    words: [
      'analytic', 'assert', 'bachelor', 'calculus', 'celestial', 'cognitive', 'collision', 'competent', 'diploma', 'excel',
      'geology', 'harness', 'intellect', 'keen', 'mythology', 'physiology', 'radioactive', 'relativity', 'sociology', 'theoretical'
    ]
  },
  {
    id: 4,
    title: "Unit 4: Business, Economy & Governance",
    subtitle: "Essential Words Book 5",
    description: "Commerce, administration, corporate infrastructure, and financial law vocabulary.",
    words: [
      'administrator', 'affluent', 'audit', 'automate', 'bribe', 'corrupt', 'dispose', 'headquarters', 'incentive', 'infrastructure',
      'legislate', 'legitimate', 'manipulate', 'merchandise', 'retail', 'revenue', 'rubbish', 'subsidy', 'transaction', 'violate'
    ]
  },
  {
    id: 5,
    title: "Unit 5: Medicine, Chemistry & Discovery",
    subtitle: "Essential Words Book 5",
    description: "Pharmaceutical, clinical, and technological process terminology for IELTS Reading and Writing.",
    words: [
      'assess', 'astonish', 'commence', 'essence', 'extract', 'fabulous', 'haste', 'impulse', 'latter', 'molecule',
      'ongoing', 'pharmaceutical', 'precise', 'proximity', 'publicity', 'remedy', 'significance', 'subsequent', 'synthetic', 'terminal'
    ]
  },
  {
    id: 6,
    title: "Unit 6: Physiology, Health & Challenges",
    subtitle: "Essential Words Book 5",
    description: "Terms regarding anatomy, physical condition, overcoming medical hurdles, and exploration.",
    words: [
      'altitude', 'coastline', 'deter', 'devise', 'expertise', 'fracture', 'impair', 'implement', 'indigenous', 'insight',
      'limb', 'migraine', 'optimism', 'peculiar', 'proficient', 'quest', 'ridge', 'spouse', 'thrust', 'tolerate'
    ]
  },
  {
    id: 7,
    title: "Unit 7: Biosphere & Marine Biology",
    subtitle: "Essential Words Book 5",
    description: "Ecosystems, cellular biology, animal behavior, and organism survival vocabulary.",
    words: [
      'aquatic', 'biosphere', 'bizarre', 'Celsius', 'coarse', 'companion', 'digest', 'duration', 'ecology', 'feat',
      'infinite', 'nucleus', 'parasite', 'prominent', 'repetitive', 'reproductive', 'temperate', 'tolerance', 'undergo', 'vulnerable'
    ]
  },
  {
    id: 8,
    title: "Unit 8: Culinary Arts, Health & Nutrition",
    subtitle: "Essential Words Book 5",
    description: "Dietary science, agricultural yield, nutrition, and medical therapy terms.",
    words: [
      'adept', 'barren', 'ceramic', 'culinary', 'dense', 'dignity', 'dominate', 'edible', 'hostile', 'intake',
      'likewise', 'malnutrition', 'medication', 'misconception', 'obscure', 'oppress', 'peel', 'prescription', 'respirator', 'strive'
    ]
  },
  {
    id: 9,
    title: "Unit 9: History, Society & Heritage",
    subtitle: "Essential Words Book 5",
    description: "Historical eras, architectural monuments, economic structures, and cultural heritage.",
    words: [
      'archaic', 'benevolent', 'brass', 'capitalism', 'component', 'dependence', 'diminish', 'drawback', 'fad', 'impose',
      'managerial', 'medieval', 'obsolete', 'peninsula', 'prestige', 'proportion', 'radical', 'refute', 'spectacular', 'weave'
    ]
  },
  {
    id: 10,
    title: "Unit 10: Commerce, Agriculture & Finance",
    subtitle: "Essential Words Book 5",
    description: "Investment, agrarian technology, market mechanics, and resource management.",
    words: [
      'accountant', 'capitalist', 'contempt', 'dedicate', 'ditch', 'enterprise', 'exquisite', 'finance', 'indifferent', 'irrigate',
      'maximize', 'monetary', 'precaution', 'preliminary', 'saturate', 'simplicity', 'sow', 'soy', 'spade', 'upcoming'
    ]
  },
  {
    id: 11,
    title: "Unit 11: Arts, Human Behavior & Biography",
    subtitle: "Essential Words Book 5",
    description: "Creative masterworks, psychological drives, and historical personal narratives.",
    words: [
      'acute', 'aggression', 'banquet', 'biography', 'boost', 'clap', 'compel', 'dominance', 'gorgeous', 'inevitable',
      'legacy', 'masterpiece', 'multiple', 'narrate', 'notorious', 'outdated', 'overall', 'partiality', 'spontaneous', 'virtue'
    ]
  },
  {
    id: 12,
    title: "Unit 12: Anthropology, Culture & Physique",
    subtitle: "Essential Words Book 5",
    description: "Societal customs, physical aesthetics, professional ranks, and human heritage.",
    words: [
      'anthropology', 'applaud', 'appoint', 'compatible', 'competence', 'confer', 'consecutive', 'crude', 'cube', 'feedback',
      'ignorance', 'masculine', 'monument', 'muscular', 'posture', 'situate', 'supervise', 'symmetry', 'tattoo', 'undergraduate'
    ]
  },
  {
    id: 13,
    title: "Unit 13: Community, Architecture & Wildlife",
    subtitle: "Essential Words Book 5",
    description: "Urban infrastructure, biological kingdoms, considerate behavior, and protected sanctuaries.",
    words: [
      'brook', 'cater', 'considerate', 'consumption', 'criteria', 'crust', 'degrade', 'entitle', 'escort', 'external',
      'facility', 'faculty', 'heap', 'hemisphere', 'hound', 'impersonal', 'ornament', 'pedestrian', 'sanctuary', 'spectator'
    ]
  },
  {
    id: 14,
    title: "Unit 14: Perception, Science & Innovation",
    subtitle: "Essential Words Book 5",
    description: "Hypothesis testing, sensory science, academic skepticism, and historic renaissance innovations.",
    words: [
      'asset', 'aspect', 'Braille', 'bud', 'coordinate', 'disprove', 'humanitarian', 'hypothesis', 'imprint', 'informative',
      'optic', 'premise', 'rack', 'Renaissance', 'revere', 'simultaneous', 'skeptic', 'spatial', 'specify', 'wax'
    ]
  },
  {
    id: 15,
    title: "Unit 15: Logistics, Materials & Industry",
    subtitle: "Essential Words Book 5",
    description: "Maritime trade, supply chain networks, material properties, and manufacturing dilemmas.",
    words: [
      'accessory', 'acquisition', 'adequate', 'cardboard', 'dilemma', 'elaborate', 'facilitate', 'fleet', 'grid',
      'import', 'infer', 'inflate', 'innate', 'marble', 'mast', 'nausea', 'naval', 'pouch', 'saturated', 'updated'
    ]
  }
];

// Curated Uzbek vocabulary dictionary with Uzbek translation, uzbek definition, IPA, POS, and uzbek example translation
const uzbekDict = {
  // Unit 1
  allot: { uz: "Ajratmoq, bermoq", pos: "verb", ipa: "/əˈlɒt/", uzDef: "Biror narsani biror kishiga taqsimlab bermoq", uzEx: "Murabbiy har bir jamoaga strategiya tayyorlash uchun besh daqiqa ajratdi.", syn: ["allocate", "assign", "distribute"], coll: ["allot time", "allot resources"] },
  appall: { uz: "Dahshatga solmoq, lol qoldirmoq", pos: "verb", ipa: "/əˈpɔːl/", uzDef: "Kimnidir qattiq qo'rqitmoq yoki hayratda qoldirmoq", uzEx: "Halokatni ko'rgan bola qattiq dahshatga tushdi.", syn: ["horrify", "shock", "dismay"], coll: ["deeply appalled", "appall the public"] },
  cache: { uz: "Maxfiy ombor, yashirin joy", pos: "noun", ipa: "/kæʃ/", uzDef: "Qimmatbaho narsalarni saqlash uchun yashirin joy", uzEx: "Qaroqchilar o'z taqinchoqlarini g'orda yashirilgan maxfiy omborda saqlashgan.", syn: ["hoard", "hiding place", "stash"], coll: ["cache of weapons", "secret cache"] },
  convenience: { uz: "Qulaylik", pos: "noun", ipa: "/kənˈviː.ni.əns/", uzDef: "Ishni kam kuch bilan oson bajarish holati", uzEx: "Internet iste'molchilarga o'zlariga qulay vaqtda xarid qilish imkonini beradi.", syn: ["comfort", "handiness", "ease"], coll: ["at your convenience", "modern convenience"] },
  dearth: { uz: "Yetishmovchilik, tanqislik", pos: "noun", ipa: "/dɜːθ/", uzDef: "Biror narsaning yetarli miqdorda bo'lmasligi", uzEx: "Mening bank hisobimda pul tanqisligi bor.", syn: ["scarcity", "shortage", "lack"], coll: ["dearth of evidence", "dearth of resources"] },
  deliberate: { uz: "Qasddan qilingan, o'ylab qilingan", pos: "adjective", ipa: "/dɪˈlɪb.ər.ət/", uzDef: "Oldindan maqsad qilib, ataylab bajarilgan", uzEx: "U har oy pul tejashga ongli ravishda harakat qildi.", syn: ["intentional", "planned", "premeditated"], coll: ["deliberate action", "deliberate attempt"] },
  dire: { uz: "Dahshatli, o'ta og'ir", pos: "adjective", ipa: "/daɪər/", uzDef: "O'ta xavfli, jiddiy va salbiy oqibatlarga ega", uzEx: "Tornado kichik shaharcha uchun og'ir vaziyatni keltirib chiqardi.", syn: ["terrible", "dreadful", "critical"], coll: ["dire need", "dire consequences"] },
  elapse: { uz: "O'tmoq (vaqt haqida)", pos: "verb", ipa: "/ɪˈlæps/", uzDef: "Vaqt, daqiqalar yoki soatlarning o'tishi", uzEx: "Boshqa rasm olishingizdan oldin bir necha soniya o'tishi kerak.", syn: ["pass by", "slip away", "go by"], coll: ["time elapsed", "hours elapsed"] },
  empathy: { uz: "Hamdardlik, his-tuyg'uni tushunish", pos: "noun", ipa: "/ˈem.pə.θi/", uzDef: "Boshqa insonning his-tuyg'ularini tushunish va unga sherik bo'lish", uzEx: "G'amxo'r hamshira o'z bemorlariga samimiy hamdardlik bildirdi.", syn: ["compassion", "understanding", "sympathy"], coll: ["feel empathy", "deep empathy"] },
  fanciful: { uz: "Xayoliy, haqiqatdan uzoq", pos: "adjective", ipa: "/ˈfæn.sɪ.fəl/", uzDef: "G'ayrioddiy yoki haqiqatga to'g'ri kelmaydigan", uzEx: "Qiz o'qimasdan turib a'lochi bo'lish haqidagi xayoliy orzularga ega edi.", syn: ["unrealistic", "imaginary", "whimsical"], coll: ["fanciful idea", "fanciful notion"] },
  gripe: { uz: "Nolimoq, tinimsiz shikoyat qilmoq", pos: "verb", ipa: "/ɡraɪp/", uzDef: "Doimiy ravishda norozilik bildirib turish", uzEx: "Lourens uy yumushlarini bajarishi kerak bo'lganda doim nolirdi.", syn: ["complain", "grumble", "whine"], coll: ["constant gripes", "gripe about"] },
  grueling: { uz: "Mashaqqatli, holdan toydiruvchi", pos: "adjective", ipa: "/ˈɡruː.ə.lɪŋ/", uzDef: "Jismoniy yoki aqliy jihatdan juda og'ir va charchatuvchi", uzEx: "Tog'chi tik cho'qqiga chiqishdek mashaqqatli vazifaga duch keldi.", syn: ["exhausting", "strenuous", "demanding"], coll: ["grueling schedule", "grueling workout"] },
  mundane: { uz: "Oddiy, zerikarli, kundalik", pos: "adjective", ipa: "/mʌnˈdeɪn/", uzDef: "Juda oddiy, bir xil yoki kundalik odatiy", uzEx: "Erkak minglab to'kilgan barglarni yig'ishdek zerikarli yumushga ega edi.", syn: ["ordinary", "routine", "monotonous"], coll: ["mundane task", "mundane matters"] },
  opt: { uz: "Tanlamoq, ma'qul ko'rmoq", pos: "verb", ipa: "/ɒpt/", uzDef: "Biror narsaning foydasiga qaror qabul qilmoq", uzEx: "Akam shokoladli muzqaymoqni yoqtiradi, lekin men doim vanilni tanlayman.", syn: ["choose", "select", "decide on"], coll: ["opt for", "opt to do something"] },
  outrage: { uz: "G'azab, qattiq nafrat", pos: "noun", ipa: "/ˈaʊt.reɪdʒ/", uzDef: "Adolatsizlik yoki yomonlikka nisbatan juda kuchli g'azab", uzEx: "Ota-onasi ziyofatga borishga ruxsat bermaganda Tommi qattiq g'azablandi.", syn: ["fury", "indignation", "anger"], coll: ["public outrage", "spark outrage"] },
  paltry: { uz: "Juda kam, arzimas", pos: "adjective", ipa: "/ˈpɔːl.tri/", uzDef: "Miqdori yoki ahamiyati juda kichik bo'lgan", uzEx: "Kambag'al kishida juda ozgina arzimas pul bor edi.", syn: ["meager", "trivial", "insignificant"], coll: ["paltry sum", "paltry amount"] },
  rectify: { uz: "Tuzatmoq, to'g'irlamoq", pos: "verb", ipa: "/ˈrek.tɪ.faɪ/", uzDef: "Xato yoki noxush vaziyatni bartaraf etib to'g'rilamoq", uzEx: "Inshomda yo'l qo'ygan imlo xatolarimni tezda to'g'irladim.", syn: ["correct", "amend", "remedy"], coll: ["rectify mistakes", "rectify the situation"] },
  resourceful: { uz: "Topqir, uddaburon", pos: "adjective", ipa: "/rɪˈzɔː.sfəl/", uzDef: "Qiyin vaziyatlardan oson yo'l topa oladigan", uzEx: "Qayig'i cho'kib ketgach, Mett sol yasashga yetarlicha topqirlik ko'rsatdi.", syn: ["clever", "inventive", "capable"], coll: ["resourceful person", "resourceful mind"] },
  sustenance: { uz: "Ozuqa, tirikchilik manbai", pos: "noun", ipa: "/ˈsʌs.tɪ.nəns/", uzDef: "Tirik qolish uchun zarur bo'lgan oziq-ovqat va suv", uzEx: "Tegishli ozuqasiz inson ochlikdan nobud bo'ladi.", syn: ["nourishment", "food", "livelihood"], coll: ["basic sustenance", "source of sustenance"] },
  tedious: { uz: "Zerikarli, cho'zilgan", pos: "adjective", ipa: "/ˈtiː.di.əs/", uzDef: "Juda uzoq vaqt oladigan, bir xil va zerikarli", uzEx: "Uning ishi ko'plab zerikarli yozishmalar va saralashni talab qilardi.", syn: ["boring", "tiresome", "dull"], coll: ["tedious job", "tedious process"] },

  // Unit 2
  abbey: { uz: "Monastir, abbatlik", pos: "noun", ipa: "/ˈæb.i/", uzDef: "Rohiblar yoki rohibalar yashaydigan maskan", uzEx: "Rohib monastirga qaytgach, darhol o'z xonasiga kirdi.", syn: ["monastery", "convent"], coll: ["ancient abbey", "visit an abbey"] },
  abundant: { uz: "Mo'l-ko'l, serob", pos: "adjective", ipa: "/əˈbʌn.dənt/", uzDef: "Katta miqdorda mavjud bo'lgan", uzEx: "Pishiriqlar va shirinliklar shu qadar ko'p ediki, bola juda quvondi.", syn: ["plentiful", "bountiful", "ample"], coll: ["abundant supply", "abundant resources"] },
  adjoin: { uz: "Yondosh bo'lmoq, tutashmoq", pos: "verb", ipa: "/əˈdʒɔɪn/", uzDef: "Biror narsaga yopishgan yoki unga bevosita qo'shni bo'lmoq", uzEx: "Yangi ovqatlanish zali mehmonxonaga tutash qilib qurilgan.", syn: ["border", "neighbor", "abut"], coll: ["adjoining room", "adjoin the park"] },
  ample: { uz: "Yetarli darajada ko'p, keng", pos: "adjective", ipa: "/ˈæm.pəl/", uzDef: "Talab qilinganidan ko'proq bo'lgan, yetarli", uzEx: "Bizda loyihani tugatish uchun yetarli vaqt bor edi.", syn: ["sufficient", "plenty", "copious"], coll: ["ample opportunity", "ample evidence"] },
  arid: { uz: "Qurg'oqchil, quruq", pos: "adjective", ipa: "/ˈær.ɪd/", uzDef: "Yog'ingarchilik juda kam bo'ladigan issiq va quruq yer", uzEx: "Qurg'oqchil cho'lda ko'p o'simliklar o'smaydi.", syn: ["dry", "parched", "barren"], coll: ["arid climate", "arid zone"] },
  cathedral: { uz: "Bosh cherkov, sobor", pos: "noun", ipa: "/kəˈθiː.drəl/", uzDef: "Yirik va muhim diniy bino", uzEx: "Shahar markazidagi sobor ulkan va go'zal me'morchilikka ega.", syn: ["church", "basilica"], coll: ["gothic cathedral", "ancient cathedral"] },
  deprive: { uz: "Mahrum qilmoq", pos: "verb", ipa: "/dɪˈpraɪv/", uzDef: "Kimgadir kerakli narsani olishiga yo'l qo'ymaslik", uzEx: "Uyqusizlik odamning aqliy diqqatini pasaytiradi.", syn: ["strip", "rob", "deny"], coll: ["deprive of sleep", "deprived child"] },
  drought: { uz: "Qurg'oqchilik", pos: "noun", ipa: "/draʊt/", uzDef: "Uzoq vaqt yomg'ir yog'maslik davri", uzEx: "Kuchli qurg'oqchilik dehqonlarning hosilini nobud qildi.", syn: ["dry spell", "parchedness"], coll: ["severe drought", "suffer from drought"] },
  eligible: { uz: "Munosib, huquqiga ega", pos: "adjective", ipa: "/ˈel.ɪ.dʒə.bəl/", uzDef: "Talablarga to'liq javob beradigan", uzEx: "Faqat yuqori baho olgan talabalar grantga munosib hisoblanadi.", syn: ["qualified", "suitable", "entitled"], coll: ["eligible for scholarship", "eligible candidate"] },
  fast: { uz: "Ro'za tutmoq, ovqatdan tiyilmoq", pos: "verb", ipa: "/fɑːst/", uzDef: "Muayyan vaqt davomida ovqat yemay yurmoq", uzEx: "Tibbiy ko'rikdan oldin bemor 12 soat ovqat yemadi.", syn: ["abstain", "diet"], coll: ["fast for medical test", "religious fast"] },
  grumble: { uz: "G'o'ldiramoq, norozi ohangda gapirmoq", pos: "verb", ipa: "/ˈɡrʌm.bəl/", uzDef: "Past ovozda shikoyat qilmoq", uzEx: "Ishchilar past ish haqi haqida g'o'ldirashdi.", syn: ["mutter", "whine", "complain"], coll: ["grumble about", "grumble under one's breath"] },
  inland: { uz: "Ichki hudud, quruqlik ichkarisi", pos: "adverb", ipa: "/ˌɪn.lænd/", uzDef: "Dengiz qirg'og'idan uzoqdagi ichki qism", uzEx: "Bo'rondan saqlanish uchun ular mamlakat ichkarisiga qarab ketishdi.", syn: ["interior", "upcountry"], coll: ["travel inland", "inland lake"] },
  moisture: { uz: "Namlik, rutubat", pos: "noun", ipa: "/ˈmɔɪs.tʃər/", uzDef: "Havoda yoki sirtda joylashgan suv tomchilari", uzEx: "Tuproqdagi namlik o'simliklarning tez o'sishiga yordam beradi.", syn: ["humidity", "dampness", "wetness"], coll: ["retain moisture", "soil moisture"] },
  nonetheless: { uz: "Shunga qaramay", pos: "adverb", ipa: "/ˌnʌn.ðəˈles/", uzDef: "Aytilgan faktga qaramasdan", uzEx: "Yomg'ir yog'ayotgan edi, shunga qaramay biz piyoda sayrga chiqdik.", syn: ["nevertheless", "however", "still"], coll: ["hard, nonetheless rewarding", "nonetheless important"] },
  oath: { uz: "Qasamyod, ont", pos: "noun", ipa: "/əʊθ/", uzDef: "Tantanali ravishda berilgan va'da", uzEx: "Yangi prezident qasamyod qabul qildi.", syn: ["pledge", "vow", "promise"], coll: ["take an oath", "break an oath"] },
  prairie: { uz: "Dasht, preriy", pos: "noun", ipa: "/ˈpreə.ri/", uzDef: "Daraxtsiz, keng maysazor tekislik", uzEx: "Keng dasht fermerlik va chorvachilik uchun juda mos edi.", syn: ["grassland", "steppe", "plain"], coll: ["open prairie", "prairie landscape"] },
  ragged: { uz: "Yirtiq-yamoq, juldur", pos: "adjective", ipa: "/ˈræɡ.ɪd/", uzDef: "Eski, yirtilgan va eskirib ketgan", uzEx: "Uning ustidagi ko'ylak yirtiq-yamoq edi.", syn: ["tattered", "worn out", "frayed"], coll: ["ragged clothes", "ragged edges"] },
  rugged: { uz: "Notekis, qo'pol, toshloq", pos: "adjective", ipa: "/ˈrʌɡ.ɪd/", uzDef: "Qattiq, toshloq va harakatlanish qiyin bo'lgan yer", uzEx: "Tog'li hudud qo'pol va xavfli qoyalardan iborat edi.", syn: ["rough", "jagged", "rocky"], coll: ["rugged terrain", "rugged mountain"] },
  scarce: { uz: "Kam uchraydigan, tanqis", pos: "adjective", ipa: "/skeəs/", uzDef: "Juda oz miqdorda topiladigan", uzEx: "Urush paytida toza ichimlik suvi juda tanqis bo'lib qoldi.", syn: ["rare", "sparse", "insufficient"], coll: ["scarce resources", "become scarce"] },
  speculate: { uz: "Taxmin qilmoq", pos: "verb", ipa: "/ˈspek.jə.leɪt/", uzDef: "Aniq bilmasdan turib fikr bildirmoq", uzEx: "Olimlar bu kashfiyot kelajakka qanday ta'sir qilishini taxmin qilishdi.", syn: ["guess", "theorize", "conjecture"], coll: ["speculate on", "wildly speculate"] },

  // Preserved word from initial mock
  concur: { uz: "Fikrga qo'shilmoq, yakdillik bildirmoq", pos: "verb", ipa: "/kənˈkɜːr/", uzDef: "Boshqa kishining fikri bilan to'liq rozi bo'lmoq", uzEx: "Tadqiqot kengashining barcha a'zolari xulosaga qo'shildilar.", syn: ["agree", "accord", "concur with"], coll: ["concur with a decision", "strongly concur"] }
};

async function generate() {
  const pdfPath = 'C:\\Users\\user\\Desktop\\4000 Essential English Words  Book 5.pdf';
  const parser = new PDFParse({ data: fs.readFileSync(pdfPath) });
  const rawText = (await parser.getText()).text;

  // Clean rawText
  const lines = rawText.split('\n');

  function findWordInfo(word) {
    // Try to find the word in rawText
    const wLower = word.toLowerCase();
    const idx = rawText.toLowerCase().indexOf(wLower + ' [');
    if (idx !== -1) {
      const slice = rawText.substring(idx, idx + 450);
      const parts = slice.split('\n').map(s => s.trim()).filter(Boolean);
      
      let header = parts[0] || '';
      let def = parts[1] || '';
      let ex = parts[2] || '';

      // if def starts with phonetic or pos, adjust
      if (parts[2] && (parts[2].startsWith('—') || parts[2].startsWith('-*') || parts[2].startsWith('->') || parts[2].startsWith('-»') || parts[2].startsWith('—►'))) {
        ex = parts[2].replace(/^[—\-\>\*■►»•]+\s*/, '');
      } else if (parts[3] && (parts[3].startsWith('—') || parts[3].startsWith('-*') || parts[3].startsWith('->') || parts[3].startsWith('-»') || parts[3].startsWith('—►'))) {
        def = def + ' ' + parts[2];
        ex = parts[3].replace(/^[—\-\>\*■►»•]+\s*/, '');
      }

      return {
        def: def.replace(/^[a-zA-Z\s\.\/]+\.\s*/, '').trim(),
        ex: ex.replace(/^[—\-\>\*■►»•]+\s*/, '').trim()
      };
    }
    return null;
  }

  const allWords = [];
  let idCounter = 1;

  for (const u of unitsList) {
    for (const w of u.words) {
      const info = findWordInfo(w) || {};
      const dict = uzbekDict[w] || {};

      const capitalizedWord = w.charAt(0).toUpperCase() + w.slice(1);
      const cleanDef = info.def && info.def.length > 10 ? info.def : `To ${w} means to perform or exhibit ${w} in a given academic or social context.`;
      const cleanEx = info.ex && info.ex.length > 10 ? info.ex : `The researcher used the word ${w} to clarify the findings in the study.`;

      const uzbekWord = dict.uz || `${capitalizedWord} (o'zbekcha ma'nosi)`;
      const uzbekDef = dict.uzDef || `${capitalizedWord} so'zining ingliz tilidagi rasmiy ta'rifi: ${cleanDef}`;
      const uzbekEx = dict.uzEx || `Namuna gapning o'zbekcha tarjimasi: ${cleanEx}`;
      const ipa = dict.ipa || `/${w}/`;
      const pos = dict.pos || 'verb';

      allWords.push({
        id: `w${idCounter++}`,
        word: capitalizedWord,
        phonetic: ipa,
        partOfSpeech: pos,
        definition: cleanDef,
        uzbekDefinition: uzbekDef,
        example: cleanEx,
        uzbekExample: uzbekEx,
        translations: {
          uzbek: uzbekWord,
          russian: `${capitalizedWord} (русский перевод)`
        },
        unit: u.id,
        synonyms: dict.syn || [w, 'synonym'],
        collocations: dict.coll || [`use ${w}`, `academic ${w}`],
        audioText: `${capitalizedWord}. ${cleanDef}`,
        clozeSentence: cleanEx.replace(new RegExp(w, 'gi'), '______'),
        targetAnswer: w
      });
    }
  }

  // Also include 'concur' so it is guaranteed present from existing mock
  if (!allWords.some(x => x.word.toLowerCase() === 'concur')) {
    allWords.push({
      id: `w${idCounter++}`,
      word: 'Concur',
      phonetic: '/kənˈkɜːr/',
      partOfSpeech: 'verb',
      definition: 'To concur means to agree with someone or have the same opinion.',
      uzbekDefinition: "Boshqa kishining fikri bilan to'liq rozi bo'lmoq",
      example: 'All members of the research council concurred that the findings were groundbreaking.',
      uzbekExample: "Tadqiqot kengashining barcha a'zolari xulosaga qo'shildilar.",
      translations: {
        uzbek: "Fikrga qo'shilmoq, yakdillik bildirmoq",
        russian: "Соглашаться, сходиться во мнениях"
      },
      unit: 3,
      synonyms: ["agree", "accord", "concur with"],
      collocations: ["concur with a decision", "strongly concur"],
      audioText: "Concur. To concur means to agree with someone or have the same opinion.",
      clozeSentence: "All members of the research council ______ that the findings were groundbreaking.",
      targetAnswer: "concurred"
    });
  }

  // Create full 30 units list (1-15 unlocked/ready, 16-30 planned)
  const fullUnits = [
    ...unitsList.map(u => ({
      id: u.id,
      title: u.title,
      subtitle: u.subtitle,
      description: u.description,
      totalWords: 20,
      masteredWords: u.id === 1 ? 14 : (u.id === 2 ? 6 : 0),
      isLocked: false,
      category: u.id <= 5 ? "Foundation & Academic" : (u.id <= 10 ? "Nature & Society" : "Humanities & Sciences")
    }))
  ];

  for (let i = 16; i <= 30; i++) {
    fullUnits.push({
      id: i,
      title: `Unit ${i}: Advanced IELTS Lexicon Part ${i - 15}`,
      subtitle: "Essential Words Book 5 (Part 2)",
      description: `Official Unit ${i} from Paul Nation's 4000 Essential English Words Book 5. Roadmap expansion pack.`,
      totalWords: 20,
      masteredWords: 0,
      isLocked: true,
      category: "Roadmap Curriculum"
    });
  }

  const fileContent = `import { WordItem, Unit, UserStats, ShopItem } from "@/types/vocabulary";

export const initialUserStats: UserStats = {
  userName: "Ibrohim",
  streakDays: 5,
  totalCoins: 240,
  wordsMastered: 20,
  dailyGoalWords: 10,
  completedTodayWords: 6,
  hasStreakFreeze: false,
  isDarkModeUnlocked: false,
  hasGoldenCrown: false,
};

export const sampleUnits: Unit[] = ${JSON.stringify(fullUnits, null, 2)};

export const sampleWords: WordItem[] = ${JSON.stringify(allWords, null, 2)};

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
`;

  fs.writeFileSync('C:\\Users\\user\\Desktop\\ielts-vocab-master\\src\\data\\vocabularyData.ts', fileContent, 'utf-8');
  // Also keep mockVocabulary.ts in sync for backwards compatibility
  fs.writeFileSync('C:\\Users\\user\\Desktop\\ielts-vocab-master\\src\\data\\mockVocabulary.ts', fileContent, 'utf-8');
  console.log(`Generated ${allWords.length} words across ${unitsList.length} units into vocabularyData.ts!`);
}

generate().catch(console.error);
