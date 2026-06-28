const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });

  const filePath = 'file://' + path.resolve(__dirname, 'index.html');
  await page.goto(filePath, { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for fonts + mascot animation
  await page.waitForFunction(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 3000));

  // Disable scroll-snap, force slides to 1280×720, and make all animated elements visible
  await page.evaluate(() => {
    document.documentElement.style.scrollSnapType = 'none';
    document.querySelectorAll('.slide').forEach(s => {
      s.style.zoom = '';
      s.style.width = '1280px';
      s.style.height = '720px';
      s.style.minHeight = '720px';
      s.style.maxHeight = '720px';
      s.style.overflow = 'hidden';
    });
    // Force all scroll-triggered animations to visible state
    document.querySelectorAll('.screenshot-card').forEach(c => {
      c.classList.add('visible');
      c.style.opacity = '1';
      c.style.transform = 'translateY(0)';
    });
    // Force the typewriter lines (slide 1) to their completed state — the
    // typeIn animation only finishes at ~9.3s, so a fixed wait freezes it mid-reveal.
    document.querySelectorAll('.type-line').forEach(el => {
      el.style.setProperty('animation', 'none', 'important');
      el.style.setProperty('width', '100%', 'important');
      el.style.setProperty('border-right', 'none', 'important'); // kill blinking cursor
    });
    // Pin each mascot animation to a single clean frame (no cross-fade ghosting).
    document.querySelectorAll('.mascot-anim').forEach(m => {
      const imgs = m.querySelectorAll('img');
      imgs.forEach(img => img.style.setProperty('transition', 'none', 'important'));
      const active = m.querySelector('img.mascot-active') || imgs[0];
      imgs.forEach(img => img.style.setProperty('opacity', img === active ? '1' : '0', 'important'));
    });
  });

  const slides = await page.$$('.slide');
  console.log(`Found ${slides.length} slides`);

  // Screenshot each slide element directly
  const screenshots = [];
  for (let i = 0; i < slides.length; i++) {
    const buf = await slides[i].screenshot({ type: 'png' });
    screenshots.push(buf);
    console.log(`  Captured slide ${i + 1}/${slides.length}`);
  }

  // Build PDF from screenshots
  const pdfPage = await browser.newPage();
  const imgTags = screenshots.map(buf => {
    return `<div class="page"><img src="data:image/png;base64,${buf.toString('base64')}"></div>`;
  }).join('\n');

  await pdfPage.setContent(`<!DOCTYPE html>
<html><head><style>
  * { margin: 0; padding: 0; }
  @page { size: 1280px 720px; margin: 0; }
  .page { width: 1280px; height: 720px; page-break-after: always; overflow: hidden; }
  .page:last-child { page-break-after: avoid; }
  .page img { width: 100%; height: 100%; display: block; }
</style></head>
<body>${imgTags}</body></html>`, { waitUntil: 'networkidle0' });

  const outputPath = path.resolve(__dirname, 'Finwiser-HyKr-Deck-2026.pdf');
  await pdfPage.pdf({
    path: outputPath,
    width: '1280px',
    height: '720px',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
  });

  console.log(`\nPDF saved: ${outputPath}`);
  await browser.close();
})();
