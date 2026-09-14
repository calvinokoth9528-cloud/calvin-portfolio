const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const bookDir = path.join(__dirname);
const chaptersDir = path.join(bookDir, 'chapters');
const outputFile = path.join(bookDir, 'calvin-ubuntu-book.html');

const orderedFiles = [
  'README.md',
  'chapters/chapter1.md',
  'chapters/chapter2.md',
  'chapters/chapter3.md',
  'chapters/chapter4.md',
  'chapters/chapter5.md',
  'chapters/chapter6.md',
  'chapters/chapter7.md',
  'chapters/chapter8.md',
  'chapters/chapter9.md',
  'chapters/chapter10.md',
  'chapters/chapter11.md',
];

let allHtml = '';

for (const relPath of orderedFiles) {
  const fullPath = path.join(bookDir, relPath);
  const mdContent = fs.readFileSync(fullPath, 'utf8');
  const htmlContent = marked.parse(mdContent, { breaks: true, gfm: true });
  allHtml += `<section class="chapter">${htmlContent}</section>\n`;
}

const finalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Calvin's Guide to Ubuntu</title>
<style>
  body {
    font-family: 'Segoe UI', 'San Francisco', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    line-height: 1.6;
    color: #242929;
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
    background: #fff;
  }
  body.dark { background: #1a1a1a; color: #d0d0d0; }
  h1 { border-bottom: 3px solid #333; padding-bottom: 0.3rem; margin-top: 2rem; }
  body.dark h1 { border-color: #888; }
  h2 { border-bottom: 1px solid #ccc; padding-bottom: 0.2rem; margin-top: 1.5rem; margin-top: 2rem; }
  body.dark h2 { border-color: #555; }
  h3 { margin-top: 1.2rem; }
  code { background: #f4f4f4; padding: 0.1rem 0.3rem; border-radius: 3px; font-family: 'Fira Code', 'Courier New', monospace; font-size: 0.9em; }
  body.dark code { background: #2d2d2d; }
  pre {
    background: #f4f4f4;
    border-left: 3px solid #333;
    padding: 1rem;
    overflow-x: auto;
    border-radius: 4px;
    margin: 1rem 0;
  }
  body.dark pre { background: #2d2d2d; border-left-color: #666; }
  pre code { background: none; padding: 0; }
  table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
  th, td { border: 1px solid #ddd; padding: 0.5rem; text-align: left; }
  th { background: #f4f4f4; }
  body.dark th { background: #2d2d2d; }
  blockquote { border-left: 4px solid #3498db; margin: 1rem 0; padding: 0.5rem 1rem; background: #f9f9f9; }
  body.dark blockquote { background: #2a2a2a; }
  .chapter { page-break-before: auto; }
  .chapter h1 { page-break-after: avoid; }
  ul, ol { margin-top: 0.3rem; }
  .nav { position: sticky; top: 0; background: #fff; padding: 0.5rem 0; border-bottom: 1px solid #ddd; z-index: 100; margin-bottom: 1rem; }
  body.dark .nav { background: #1a1a1a; border-color: #333; }
  .nav h1 { margin: 0; font-size: 1.2rem; }
  .toc { background: #f9f9f9; padding: 1rem; border-radius: 4px; margin: 1rem 0; }
  body.dark .toc { background: #222; }
  .toc ol { margin: 0.5rem 0; }
  a { color: #2980b9; }
  body.dark a { color: #4da6ff; }
  .theme-toggle { position: fixed; top: 10px; right: 10px; background: #eee; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; }
  body.dark .theme-toggle { background: #444; color: #ddd; }
  .review-q { font-weight: bold; }
  .quick-ref { background: #fff3cd; border-left: 4px solid #ffc107; padding: 0.5rem 1rem; margin: 1rem 0; }
</style>
</head>
<body>
<button class="theme-toggle" onclick="toggleTheme()">Toggle Dark/Light</button>
${allHtml}
<script>
marked.setOptions({ breaks: true, gfm: true });
function toggleTheme() {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
}
</script>
</body>
</html>`;

fs.writeFileSync(outputFile, finalHtml);
console.log('Book HTML created at: ' + outputFile);
console.log('Size: ' + (fs.statSync(outputFile).size) + ' bytes');
