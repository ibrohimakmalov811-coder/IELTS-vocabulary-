const fs = require('fs');
const { PDFParse } = require('pdf-parse');

(async () => {
  const parser = new PDFParse({ data: fs.readFileSync('C:\\Users\\user\\Desktop\\4000 Essential English Words  Book 5.pdf') });
  const text = (await parser.getText()).text;

  function findWordBlock(word) {
    const idx = text.toLowerCase().indexOf(word.toLowerCase() + ' [');
    if (idx === -1) {
      // try without bracket
      const idx2 = text.toLowerCase().indexOf('\n' + word.toLowerCase());
      if (idx2 === -1) return null;
      return text.substring(idx2, idx2 + 400);
    }
    return text.substring(idx, idx + 400);
  }

  const testWords = ['allot', 'cache', 'dire', 'abbey', 'arid', 'prairie', 'analytic', 'cognitive', 'geology'];
  testWords.forEach(w => {
    const block = findWordBlock(w);
    console.log('===', w, '===');
    console.log(block ? block.substring(0, 150).replace(/\n/g, ' ') : 'NOT FOUND');
  });
})();
