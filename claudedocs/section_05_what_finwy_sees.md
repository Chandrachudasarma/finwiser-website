# Section 5 — What Finwy Sees

Dark navy section. Conveys "Finwiser ingests your full financial life and assembles one picture" with brand-controlled iconography only. Zero app UI.

## 1. Spec

- Background: `--navy` (high contrast against neighbouring light sections).
- Heading + sub-line, then a centred CSS/SVG diagram (max-width 900px, ~60% of section height).
- Six iconographic blocks in a flowing 3-2-3 / hex-style arrangement (not a phone). Dashed mint connectors imply Finwiser stitching the picture together. Mascot anchors the right side, "looking at" the dashboard.
- Padding: 110px vertical desktop, 70px mobile. Mobile: 2-col grid, connectors hidden.

## 2. Copy

Heading (chosen): **"What Finwiser sees the moment you connect."**

Alternates:
- *"One connection. Your entire financial life, in focus."*
- *"This is the picture Finwiser assembles for you."*

Sub-line: *Income, fixed costs, variable spend, goals, surplus, risk — joined into one view, not six tabs.*

Block labels: `Income · ₹ —` · `Fixed costs · monthly` · `Variable spend · trends` · `Goals · ranked` · `Surplus · allocated` · `Risk · covered`.

## 3. HTML scaffold

```html
<section id="what-finwy-sees" class="wfs" aria-labelledby="wfs-heading">
  <div class="wfs__inner">
    <p class="wfs__eyebrow">Section 05</p>
    <h2 id="wfs-heading" class="wfs__heading">What Finwiser sees the moment you connect.</h2>
    <p class="wfs__sub">Income, fixed costs, variable spend, goals, surplus, risk — joined into one view, not six tabs.</p>

    <figure class="wfs__figure">
      <div class="wfs__diagram" data-reveal>
        <svg class="wfs__lines" viewBox="0 0 900 480" aria-hidden="true" focusable="false">
          <path d="M150 120 L450 240" /><path d="M450 240 L750 120" />
          <path d="M150 360 L450 240" /><path d="M450 240 L750 360" />
          <path d="M450 90  L450 240" /><path d="M450 240 L450 400" />
        </svg>

        <div class="wfs__block" style="--i:0" data-pos="tl">
          <span class="wfs__icon" aria-hidden="true"><!-- income SVG --></span>
          <span class="wfs__label">Income</span><span class="wfs__meta">₹ —</span>
        </div>
        <div class="wfs__block" style="--i:1" data-pos="tr">…Fixed costs…</div>
        <div class="wfs__block" style="--i:2" data-pos="ml">…Variable spend…</div>
        <div class="wfs__block" style="--i:3" data-pos="mr">…Goals…</div>
        <div class="wfs__block" style="--i:4" data-pos="bl">…Surplus…</div>
        <div class="wfs__block" style="--i:5" data-pos="br">…Risk…</div>

        <img class="wfs__mascot" src="/fw-deck-2026/slides/finwy-allocating.png" alt="" aria-hidden="true" width="180" height="180" loading="lazy" />
      </div>
      <figcaption class="wfs__caption">A diagram showing Finwiser connecting income, expenses, goals, surplus and risk into one financial picture.</figcaption>
    </figure>
  </div>
</section>
```

## 4. CSS (tokens only)

```css
.wfs{background:var(--navy);color:var(--text-on-dark);padding:110px 24px}
@media (max-width:720px){.wfs{padding:70px 20px}}
.wfs__inner{max-width:1080px;margin:0 auto;text-align:center}
.wfs__eyebrow{font:500 12px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.16em;text-transform:uppercase;color:var(--mint);margin:0 0 16px}
.wfs__heading{font:700 clamp(28px,4vw,44px)/1.15 Inter,system-ui,sans-serif;color:var(--text-on-dark);margin:0 auto;max-width:18ch}
.wfs__sub{font:400 16px/1.55 Inter,system-ui,sans-serif;color:var(--text-on-dark-muted);margin:16px auto 56px;max-width:60ch}

.wfs__figure{margin:0 auto;max-width:900px}
.wfs__diagram{position:relative;aspect-ratio:9/5;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,1fr);gap:24px}
.wfs__lines{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.wfs__lines path{fill:none;stroke:var(--mint);stroke-width:1;stroke-dasharray:4 6;stroke-dashoffset:240;opacity:.55}
.wfs__block{background:rgba(255,255,255,.04);border:1px solid rgba(53,214,198,.18);border-radius:14px;padding:18px 20px;display:flex;flex-direction:column;align-items:flex-start;gap:8px;clip-path:inset(0 100% 0 0);will-change:clip-path,transform}
.wfs__icon{width:32px;height:32px;display:grid;place-items:center;border-radius:8px;background:rgba(53,214,198,.10)}
.wfs__label{font:600 14px/1.2 Inter,system-ui,sans-serif;color:var(--text-on-dark)}
.wfs__meta{font:400 12px/1 ui-monospace,SFMono-Regular,Menlo,monospace;color:var(--text-on-dark-muted);letter-spacing:.04em}
.wfs__mascot{position:absolute;right:-32px;bottom:-20px;width:180px;height:auto;opacity:0;transform:translateY(8px)}
.wfs__caption{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}

[data-reveal].is-in .wfs__block{animation:wfsWipe 520ms cubic-bezier(.16,1,.3,1) forwards;animation-delay:calc(var(--i) * 120ms)}
[data-reveal].is-in .wfs__lines path{animation:wfsDraw 600ms cubic-bezier(.4,0,.2,1) forwards;animation-delay:840ms}
[data-reveal].is-in .wfs__mascot{animation:wfsRise 480ms cubic-bezier(.16,1,.3,1) forwards;animation-delay:1400ms}

@keyframes wfsWipe{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes wfsDraw{to{stroke-dashoffset:0}}
@keyframes wfsRise{to{opacity:1;transform:translateY(0)}}

@media (max-width:720px){.wfs__diagram{grid-template-columns:1fr 1fr;grid-template-rows:auto;aspect-ratio:auto}.wfs__lines,.wfs__mascot{display:none}}

@media (prefers-reduced-motion:reduce){
  .wfs__block{clip-path:none;animation:none}
  .wfs__lines path{stroke-dashoffset:0;animation:none}
  .wfs__mascot{opacity:1;transform:none;animation:none}
}
.wfs :focus-visible{outline:2px solid var(--mint);outline-offset:3px;border-radius:6px}
```

## 5. Animation (IntersectionObserver)

```js
const fig=document.querySelector('.wfs [data-reveal]');
if(fig&&'IntersectionObserver'in window){
  new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');o.unobserve(e.target)}}),{threshold:.3}).observe(fig);
}else{fig&&fig.classList.add('is-in')}
```

Sequence: blocks wipe L→R at 120 ms stagger (0–720 ms), connector lines draw via `stroke-dashoffset` (840–1440 ms), mascot fades + 8 px rise (1400–1880 ms). Total ~1.6 s. Transform / opacity / clip-path / stroke-dashoffset only.

## 6. Accessibility

- `<section aria-labelledby="wfs-heading">`, single `<h2>`.
- `<figure>` + visually-hidden `<figcaption>` carries the meaning for screen readers; SVG + decorative dots `aria-hidden="true"`; mascot `alt=""`.
- Labels are real text nodes — never background images.
- `prefers-reduced-motion: reduce` → all blocks, lines, mascot visible immediately.
- Contrast: `--text-on-dark` (≈15:1) and `--text-on-dark-muted` (≈6.4:1) on `--navy`. Mint accents are decorative, not load-bearing for meaning.
- `:focus-visible` mint ring; section is non-interactive otherwise.

## 7. Iconography (inline SVG, 24×24, `stroke="currentColor"` on tinted parent)

- **Income** — `--mint` accent. Rounded square `<rect x="3" y="3" width="18" height="18" rx="4">` + arrow `<path d="M12 17V8 M8 12l4-4 4 4">`.
- **Fixed costs** — `--teal`. Calendar: `<rect x="3" y="5" width="18" height="16" rx="2"><line x1="3" y1="10" x2="21" y2="10">` + 4 day-cells `<rect x="6" y="13" width="3" height="3">` repeated at (11,13),(15,13),(6,17).
- **Variable spend** — `rgba(0,182,173,.55)` (teal-muted). Three dots `<circle cx="6" cy="12" r="1.5"><circle cx="12" cy="12" r="1.5"><circle cx="18" cy="12" r="1.5">`.
- **Goals** — `--mint`. Bullseye: `<circle cx="12" cy="12" r="9"><circle cx="12" cy="12" r="5"><circle cx="12" cy="12" r="1.5" fill="currentColor">`.
- **Surplus** — `--mint` accent. Delta + slice: `<path d="M12 4l8 14H4z"/>` outlined, plus `<path d="M12 12 L20 18 A9 9 0 0 0 12 4 Z" opacity=".25" fill="currentColor"/>`.
- **Risk** — `--teal`. Shield: `<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>` + tick `<path d="M9 12l2 2 4-4">`.

Connector geometry (decorative): six dashed mint paths originating at the centre node `(450,240)`, fanning to the six block anchors. `stroke-dasharray:4 6; stroke-dashoffset:240` animated to `0`.

Mascot: `finwy-allocating.png` from `/fw-deck-2026/slides/`, bottom-right, decorative (`alt=""`). Hidden on mobile to preserve grid balance.
