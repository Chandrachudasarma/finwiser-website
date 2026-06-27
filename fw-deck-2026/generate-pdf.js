const puppeteer = require('puppeteer');
const path = require('path');

// ---------------------------------------------------------------------------
// Robust pitch-deck PDF generator (native print path).
//
// index.html has INFINITE looping animations (mascot flip-book + relay), CSS
// reveal/entrance animations, a typewriter, scroll-triggered fade-ins, and an
// <iframe> on slide 3 (chain-relay-composed.html).
//
// Why NOT screenshots: element.screenshot / captureBeyondViewport /
// page.screenshot all route through CDP Page.captureScreenshot, which on this
// deck times out (compositor never settles) or crashes the renderer (memory).
//
// Why page.pdf: it produces a single STATIC print rasterization and never
// waits on animation stability or a GPU surface, so it is immune to the
// looping-animation hang. The catch: the print snapshot evaluates CSS
// animations at t=0, so any element hidden by an entrance animation's
// `from` keyframe (e.g. `.wa-msg { animation: waMsgIn both }` -> opacity:0
// during its delay) prints INVISIBLE. The fix is to KILL animations entirely
// (`animation:none`) so those elements revert to their base computed style
// (opacity:1 = visible), and to explicitly reveal the elements whose BASE
// style is hidden (`.screenshot-card`, `.type-line`).
//
// Some slides have content taller than 720px; each is uniformly scaled with a
// transform to fit its 1280x720 page (the layout box stays 720px so one slide
// still maps to exactly one PDF page).
//
// Output goes to a TEMP file; the real deliverable is replaced only after an
// external 16-page / non-blank verification.
// ---------------------------------------------------------------------------

const WIDTH = 1280;
const HEIGHT = 720;

// Kill every animation + transition so nothing is stuck on an entrance/looping
// keyframe at the print snapshot's t=0. Elements fall back to base computed
// style (which for entrance-animated content is the visible state).
const KILL_MOTION_CSS =
  '*,*::before,*::after{animation:none !important;transition:none !important;}';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Runs in page (or iframe) context: stop motion + force base-hidden reveal
// elements to their visible end-state.
function revealAll(killCss) {
  const s = document.createElement('style');
  s.textContent = killCss;
  document.head.appendChild(s);

  // Scroll-triggered fade-ins: base opacity:0 -> .visible makes them opacity:1.
  document.querySelectorAll('.screenshot-card').forEach((c) => {
    c.classList.add('visible');
    c.style.opacity = '1';
    c.style.transform = 'translateY(0)';
  });
  // Typewriter lines: base width:0 -> animated to 100%.
  document.querySelectorAll('.type-line').forEach((el) => {
    el.style.width = '100%';
    el.style.borderRight = 'none';
  });
  // WhatsApp bubbles are only hidden by their entrance animation's fill; with
  // animation killed they are already visible, but force it for safety.
  document.querySelectorAll('.wa-msg').forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    protocolTimeout: 300000,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 });

  const filePath = 'file://' + path.resolve(__dirname, 'index.html');
  await page.goto(filePath, { waitUntil: 'networkidle0', timeout: 30000 });

  await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
  await sleep(2000);

  // Stop motion + reveal hidden content in the main document.
  await page.evaluate(revealAll, KILL_MOTION_CSS);

  // Lay out each slide as an exact 1280x720 page. To handle slides whose content
  // is taller than 720px, wrap each slide's content in an inner div: the OUTER
  // slide is a fixed 1280x720 clip box (overflow:hidden, keeps its background +
  // its one-page layout), and the INNER wrapper is scaled DOWN with a transform
  // so its full content fits. Clipping (outer) and scaling (inner) then compose
  // correctly, nothing spills onto an extra page, and the slide background
  // fills the frame behind centered, scaled content.
  const scaleInfo = await page.evaluate((W, H) => {
    document.documentElement.style.scrollSnapType = 'none';
    document.documentElement.style.overflow = 'visible';
    document.documentElement.style.height = 'auto';
    document.body.style.height = 'auto';
    document.body.style.margin = '0';

    const slides = Array.from(document.querySelectorAll('.slide'));
    const info = [];
    slides.forEach((s, i) => {
      const cs = getComputedStyle(s);

      // The corner logo must render at a CONSTANT size/position on every page,
      // so it must NOT live inside the scaled wrapper. Pull it out first and
      // re-attach it as an unscaled direct child of the page box (below).
      const logo = s.querySelector('.logo-bar');

      // Move the slide's own layout (flex column + padding) onto an inner wrapper.
      const wrap = document.createElement('div');
      wrap.className = '__pdfwrap';
      wrap.style.display = cs.display === 'block' ? 'block' : 'flex';
      wrap.style.flexDirection = cs.flexDirection || 'column';
      wrap.style.justifyContent = cs.justifyContent || 'flex-start';
      wrap.style.alignItems = cs.alignItems || 'stretch';
      wrap.style.padding = cs.padding;
      wrap.style.boxSizing = 'border-box';
      wrap.style.width = W + 'px';
      // Full page height so the slide's own vertical centering (justify-content)
      // still applies for content shorter than a page.
      wrap.style.minHeight = H + 'px';
      wrap.style.position = 'relative';
      // Move every child EXCEPT the logo-bar into the wrapper.
      Array.from(s.childNodes).forEach((child) => {
        if (child === logo) return;
        wrap.appendChild(child);
      });

      // Turn the slide into a clean fixed clip box (keeps its background class).
      s.style.display = 'block';
      s.style.padding = '0';
      s.style.margin = '0';
      s.style.width = W + 'px';
      s.style.minWidth = W + 'px';
      s.style.maxWidth = W + 'px';
      s.style.height = H + 'px';
      s.style.minHeight = H + 'px';
      s.style.maxHeight = H + 'px';
      s.style.overflow = 'hidden';
      s.style.position = 'relative';
      s.style.boxSizing = 'border-box';
      s.style.zoom = '';
      s.style.transform = '';
      s.style.breakAfter = 'page';
      s.style.pageBreakAfter = 'always';
      s.style.breakInside = 'avoid';
      s.style.pageBreakInside = 'avoid';

      // Append the scaled-content wrapper, then the unscaled logo. The logo's
      // absolute top:20/right:30 now resolves against the 1280x720 page box,
      // so it is identical (80px, same corner) on every page regardless of the
      // wrapper's per-slide scale.
      s.appendChild(wrap);
      if (logo) s.appendChild(logo);

      // Scale the wrapper down if its content exceeds the page height.
      const contentH = wrap.scrollHeight;
      let scale = 1;
      if (contentH > H + 1) {
        scale = H / contentH;
        wrap.style.transformOrigin = 'top center';
        wrap.style.transform = 'scale(' + scale + ')';
      }
      info.push({ n: i + 1, id: s.id, contentH, scale: Math.round(scale * 1000) / 1000 });
    });
    const last = slides[slides.length - 1];
    if (last) {
      last.style.pageBreakAfter = 'avoid';
      last.style.breakAfter = 'auto';
    }
    return info;
  }, WIDTH, HEIGHT);

  console.log(`Found ${scaleInfo.length} slides`);
  scaleInfo.forEach((s) => {
    console.log(
      `  slide ${s.n} (#${s.id}): contentH=${s.contentH}px` +
        (s.scale < 1 ? ` -> scaled ${s.scale}` : '')
    );
  });

  // Slide 3 embeds chain-relay-composed.html. Settle + stop its motion / reveal.
  const gapHandle = await page.$('#gapFrame');
  if (gapHandle) {
    try {
      await page.waitForFunction(() => {
        const f = document.querySelector('#gapFrame');
        if (!f) return true;
        try {
          const doc = f.contentDocument;
          return !!doc && doc.readyState === 'complete';
        } catch (e) {
          return true;
        }
      }, { timeout: 10000 });
    } catch (e) {
      console.warn(`  (iframe readyState wait: ${e.message} — continuing)`);
    }
    try {
      const gapFrame = await gapHandle.contentFrame();
      if (gapFrame) {
        await gapFrame.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
        await gapFrame.evaluate(revealAll, KILL_MOTION_CSS).catch(() => {});
        console.log('  Slide-3 iframe revealed + motion stopped');
      }
    } catch (e) {
      console.warn(`  (iframe reveal warning: ${e.message})`);
    }
  }

  // Render exactly like the live on-screen deck (not the print stylesheet).
  await page.emulateMediaType('screen');
  await sleep(1500);

  const outputPath = path.resolve(__dirname, 'Finwiser-Pitch-Deck-2026.pdf');
  await page.pdf({
    path: outputPath,
    width: `${WIDTH}px`,
    height: `${HEIGHT}px`,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  console.log(`\nPDF saved: ${outputPath}`);
  await browser.close();
})();
