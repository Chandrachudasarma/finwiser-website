// Analyze diagrams in render-doc-pdf.js
// 1. Extract the three SVG constants
// 2. Render each to PNG at high DPI
// 3. Compute per-box whitespace metrics

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const SRC = path.join(__dirname, 'render-doc-pdf.js');
const source = fs.readFileSync(SRC, 'utf8');

function extractSvg(constName) {
  const re = new RegExp(`const ${constName} = \`([\\s\\S]*?)\`;`);
  const m = source.match(re);
  if (!m) throw new Error(`Could not find ${constName}`);
  return m[1].trim();
}

const figures = [
  { name: 'fig1', label: 'Four-Module Architecture', svg: extractSvg('SVG_MODULES') },
  { name: 'fig2', label: 'Deployment & Data Flow',   svg: extractSvg('SVG_DEPLOY') },
  { name: 'fig3', label: 'Worked Example',           svg: extractSvg('SVG_WORKED') },
];

function fmtPct(v) { return (v * 100).toFixed(1) + '%'; }

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1800, height: 2400, deviceScaleFactor: 2 });

  const allMetrics = {};

  for (const fig of figures) {
    // Inject the SVG into a minimal page with proper Inter font
    const svg = fig.svg.replace(/<svg /, '<svg width="1600" ');
    const html = `<!doctype html>
<html><head>
<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>body{margin:0;padding:20px;background:#fff;font-family:Inter,system-ui,sans-serif}</style>
</head><body>${svg}</body></html>`;
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.evaluateHandle('document.fonts.ready');

    // Screenshot
    const el = await page.$('svg');
    const pngPath = path.join(__dirname, `.diag-${fig.name}.png`);
    await el.screenshot({ path: pngPath });

    // Compute metrics inside the page
    const metrics = await page.evaluate(() => {
      const svg = document.querySelector('svg');

      const rects = [...svg.querySelectorAll('rect')].map((r, i) => {
        const x = parseFloat(r.getAttribute('x'));
        const y = parseFloat(r.getAttribute('y'));
        const w = parseFloat(r.getAttribute('width'));
        const h = parseFloat(r.getAttribute('height'));
        const fill = r.getAttribute('fill') || '';
        const stroke = r.getAttribute('stroke') || '';
        return { i, x, y, w, h, fill, stroke, area: w * h };
      }).filter(r => !isNaN(r.x));

      const texts = [...svg.querySelectorAll('text')].map(t => {
        const bb = t.getBBox();
        const fs = parseFloat(getComputedStyle(t).fontSize);
        return {
          content: (t.textContent || '').trim().slice(0, 90),
          x: bb.x, y: bb.y, w: bb.width, h: bb.height,
          cx: bb.x + bb.width / 2,
          cy: bb.y + bb.height / 2,
          fontSize: fs,
        };
      });

      // Assign each text to the SMALLEST rect whose box contains its center.
      // This prevents big outer rects from claiming text that belongs to nested sub-rects.
      const assignments = new Map(); // rect index -> [text]
      for (const t of texts) {
        const containing = rects
          .filter(r => t.cx >= r.x && t.cx <= r.x + r.w && t.cy >= r.y && t.cy <= r.y + r.h)
          .sort((a, b) => a.area - b.area);
        if (containing.length === 0) continue;
        const r = containing[0];
        if (!assignments.has(r.i)) assignments.set(r.i, []);
        assignments.get(r.i).push(t);
      }

      const results = [];
      for (const r of rects) {
        const inside = assignments.get(r.i) || [];
        if (inside.length === 0) continue;
        const minX = Math.min(...inside.map(t => t.x));
        const maxX = Math.max(...inside.map(t => t.x + t.w));
        const minY = Math.min(...inside.map(t => t.y));
        const maxY = Math.max(...inside.map(t => t.y + t.h));
        const textBlockW = maxX - minX;
        const textBlockH = maxY - minY;
        const sumTextArea = inside.reduce((s, t) => s + t.w * t.h, 0);
        const maxFontSize = Math.max(...inside.map(t => t.fontSize));

        results.push({
          rectIdx: r.i,
          rect: { x: r.x, y: r.y, w: r.w, h: r.h, fill: r.fill, stroke: r.stroke },
          textCount: inside.length,
          firstText: inside[0].content,
          // padding in SVG units
          padLeft:   +(minX - r.x).toFixed(1),
          padRight:  +(r.x + r.w - maxX).toFixed(1),
          padTop:    +(minY - r.y).toFixed(1),
          padBottom: +(r.y + r.h - maxY).toFixed(1),
          // ratios (0..1)
          hPadRatio:  (r.w - textBlockW) / r.w,
          vPadRatio:  (r.h - textBlockH) / r.h,
          textFillRatio: sumTextArea / (r.w * r.h),
          capHeightRatio: maxFontSize / r.h,
          maxFontSize,
        });
      }
      return { viewBox: svg.getAttribute('viewBox'), boxes: results };
    });

    allMetrics[fig.name] = { label: fig.label, ...metrics };
    fs.writeFileSync(
      path.join(__dirname, `.diag-${fig.name}.json`),
      JSON.stringify(metrics, null, 2)
    );

    console.log(`\n=== ${fig.label}  (viewBox ${metrics.viewBox}) ===`);
    console.log(
      ['#', 'pos (x,y,w×h)', 'text', 'pad L/R/T/B', 'hPad%', 'vPad%', 'fill%', 'cap%', 'maxFS']
        .map(s => s.padEnd(8)).join(' ')
    );
    for (const b of metrics.boxes) {
      const pos = `${b.rect.x},${b.rect.y},${b.rect.w}×${b.rect.h}`;
      const pad = `${b.padLeft}/${b.padRight}/${b.padTop}/${b.padBottom}`;
      console.log(
        [
          String(b.rectIdx).padEnd(3),
          pos.padEnd(18),
          (b.firstText || '').slice(0, 30).padEnd(32),
          pad.padEnd(18),
          fmtPct(b.hPadRatio).padEnd(7),
          fmtPct(b.vPadRatio).padEnd(7),
          fmtPct(b.textFillRatio).padEnd(7),
          fmtPct(b.capHeightRatio).padEnd(7),
          b.maxFontSize.toFixed(1),
        ].join(' ')
      );
    }
  }

  fs.writeFileSync(path.join(__dirname, '.diag-all.json'), JSON.stringify(allMetrics, null, 2));
  console.log('\n✓ PNGs: .diag-fig1.png .diag-fig2.png .diag-fig3.png');
  console.log('✓ Metrics: .diag-fig1.json etc, plus .diag-all.json');
  await browser.close();
})();
