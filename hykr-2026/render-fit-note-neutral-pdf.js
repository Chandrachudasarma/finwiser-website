// Renders Technical_Fit_Note.md → Finwiser-Technical-Fit-Note-2026.pdf (vendor-neutral)
// Same style as render-fit-note-pdf.js but vendor-neutral header + Finwiser-red accent.

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { marked } = require('marked');

const SRC = path.join(__dirname, 'Technical_Fit_Note.md');
const OUT = path.join(__dirname, 'Finwiser-Technical-Fit-Note-2026.pdf');

function buildHtml(bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Finwiser — Technical Fit Note</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
<style>
:root {
  --primary: #1a1a2e;
  --accent: #e94560;          /* Finwiser brand red */
  --ink: #0f172a;
  --muted: #475569;
  --rule: #e2e8f0;
  --bg-soft: #f8fafc;
}
@page { size: A4; margin: 16mm 14mm; }
* { box-sizing: border-box; }
html, body {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 10pt;
  line-height: 1.55;
  color: var(--ink);
  margin: 0;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.doc { max-width: 100%; }

h1 {
  font-size: 22pt;
  font-weight: 700;
  color: var(--primary);
  margin: 0 0 10px 0;
  line-height: 1.15;
  letter-spacing: -0.4px;
}
h1::after {
  content: "";
  display: block;
  width: 56px;
  height: 3px;
  background: var(--accent);
  margin-top: 10px;
  border-radius: 2px;
}
h2 {
  font-size: 13pt;
  font-weight: 700;
  color: var(--primary);
  margin: 18px 0 8px 0;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--rule);
  page-break-after: avoid;
}
h3 {
  font-size: 11pt;
  font-weight: 700;
  color: var(--primary);
  margin: 12px 0 6px 0;
  page-break-after: avoid;
}

h1 + p strong { color: var(--primary); font-weight: 600; }
h1 + p {
  font-size: 9.5pt;
  color: var(--muted);
  margin: 6px 0 14px 0;
}

blockquote {
  border-left: 3px solid var(--accent);
  background: var(--bg-soft);
  padding: 8px 14px;
  margin: 10px 0 14px 0;
  font-style: italic;
  color: var(--primary);
  border-radius: 0 4px 4px 0;
  page-break-inside: avoid;
}
blockquote p { margin: 0; }

p { margin: 0 0 7px 0; }
strong { color: var(--primary); font-weight: 600; }
em { font-style: italic; color: var(--muted); }

ul, ol { margin: 4px 0 9px 22px; padding: 0; }
li { margin: 3px 0; }
li > strong:first-child { color: var(--primary); }

code {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  background: var(--bg-soft);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 8.5pt;
  word-break: break-all;
}

hr {
  border: none;
  border-top: 1px solid var(--rule);
  margin: 16px 0;
}

h2 + p, h2 + ul, h3 + p, h3 + ul { page-break-before: avoid; }
</style>
</head>
<body>
<div class="doc">
${bodyHtml}
</div>
</body>
</html>`;
}

(async () => {
  console.log('[1/3] Reading markdown source...');
  const md = fs.readFileSync(SRC, 'utf8');

  console.log('[2/3] Converting markdown → HTML...');
  marked.setOptions({ gfm: true, breaks: false });
  const bodyHtml = marked.parse(md);
  const html = buildHtml(bodyHtml);
  fs.writeFileSync(path.join(__dirname, '.fit-note-neutral-rendered.html'), html);

  console.log('[3/3] Rendering PDF via puppeteer...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.evaluateHandle('document.fonts.ready');

  await page.pdf({
    path: OUT,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: `<div style="font-family:Inter,sans-serif;font-size:8pt;color:#94a3b8;width:100%;padding:0 14mm;display:flex;justify-content:space-between;">
       <span><b style="color:#1a1a2e">Finwiser</b> · Technical Fit Note</span>
       <span>28 May 2026</span>
     </div>`,
    footerTemplate: `<div style="font-family:Inter,sans-serif;font-size:8pt;color:#94a3b8;width:100%;padding:0 14mm;display:flex;justify-content:space-between;">
       <span>Finwiser Technologies LLP · LLPIN ACT-7598 · DPIIT DIPP240313</span>
       <span>Page <span class="pageNumber"></span> / <span class="totalPages"></span></span>
     </div>`,
    margin: { top: '16mm', right: '14mm', bottom: '16mm', left: '14mm' }
  });

  await browser.close();
  const sizeKB = (fs.statSync(OUT).size / 1024).toFixed(1);
  console.log(`\n[OK] PDF saved: ${OUT}`);
  console.log(`     Size: ${sizeKB} KB`);
})().catch(err => {
  console.error('Render failed:', err);
  process.exit(1);
});
