const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

async function main() {
  const pdfPath = 'C:\\Users\\user\\Desktop\\4000 Essential English Words  Book 5.pdf';
  const parser = new PDFParse({ data: fs.readFileSync(pdfPath) });
  const res = await parser.getText();
  const text = res.text;

  console.log('PDF parsed successfully, text length:', text.length);
}

main().catch(console.error);
