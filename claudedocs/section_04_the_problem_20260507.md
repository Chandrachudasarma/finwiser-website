---
section: 4 — The Problem
generated: 2026-05-07
audience: salaried Indian middle class, 25–45, ₹8L–50L/yr
voice: institutional; visitor-mirror (concrete consumer language, not advisor-talk)
binding: §15 of design_finwiser_homepage_20260507.md
---

# Section 4 — The Problem

## 1. Spec

A transition moment, not a deep dive. Visitor reads the headline, recognises themselves in the bullets, and concedes "this page is for me." Background `--off-white` differentiates from any pure-white neighbour without breaking the calm. Single column, max-width 1100px, centered. ~70–80vh. Mascot anchors the emotional tone (thoughtful, not cheerful); CSS-drawn account chips would compete with the bullets and are deferred — chosen visual is **Finwy in a thoughtful pose, top-centered, small (140px), slow-breathing scale**. Headline → bullets → closing line, with the bullets in a 2-column rhythm so the eye moves laterally and the section never feels like a vertical complaint list.

## 2. Copy + alts

**Headline (default):**
> Your money is in 11 places. You don't know what's actually happening.

**Headline alternates (data-attribute, A/B-ready):**
- "Bank, MFs, FDs, NPS, EPF, gold, that LIC policy. When did you last see it all together?"
- "Eleven apps. Three banks. Two MF distributors. One CA your dad uses. And no clear picture."

**Bullets (5, 2-column grid):**
1. Where is my surplus actually going each month?
2. Are my SIPs on track? Or am I just hoping they are?
3. Can I afford the house EMI without breaking my retirement plan?
4. Is my emergency fund enough for *this* salary, today?
5. If I switch jobs tomorrow — am I OK?

**Closing line:**
> *These are not advanced questions. But nobody answers them — because nobody sees the whole picture.*

**Image alt:** `""` (decorative — Finwy is emotional anchor, not informational)

## 3. HTML scaffold

```html
<section id="problem" class="fw-problem" aria-labelledby="problem-heading">
  <div class="fw-problem__inner">
    <img class="fw-problem__mascot" src="/fw-deck-2026/slides/finny-3d.png" alt="" width="140" height="140" loading="lazy" decoding="async" aria-hidden="true">

    <h2 id="problem-heading" class="fw-problem__heading" data-reveal="heading">
      Your money is in 11 places. <span class="fw-problem__heading-em">You don't know what's actually happening.</span>
    </h2>

    <ul class="fw-problem__list" role="list" data-reveal="list">
      <li class="fw-problem__item"><span class="fw-problem__q">Where is my surplus actually going each month?</span></li>
      <li class="fw-problem__item"><span class="fw-problem__q">Are my SIPs on track? Or am I just hoping they are?</span></li>
      <li class="fw-problem__item"><span class="fw-problem__q">Can I afford the house EMI without breaking my retirement plan?</span></li>
      <li class="fw-problem__item"><span class="fw-problem__q">Is my emergency fund enough for <em>this</em> salary, today?</span></li>
      <li class="fw-problem__item"><span class="fw-problem__q">If I switch jobs tomorrow — am I OK?</span></li>
    </ul>

    <p class="fw-problem__close" data-reveal="close">
      These are not advanced questions. But nobody answers them — because nobody sees the whole picture.
    </p>
  </div>
</section>
```

## 4. CSS (uses tokens only)

```css
.fw-problem{background:var(--off-white);padding:100px 24px;color:var(--text-on-light)}
.fw-problem__inner{max-width:1100px;margin:0 auto;text-align:center}
.fw-problem__mascot{display:block;margin:0 auto 28px;width:140px;height:140px;opacity:.95;will-change:transform;animation:fwBreathe 6s cubic-bezier(.4,0,.2,1) infinite}
.fw-problem__heading{font-family:Inter,system-ui,sans-serif;font-size:clamp(28px,4vw,44px);font-weight:700;letter-spacing:-.4px;line-height:1.18;margin:0 auto 40px;max-width:860px;color:var(--text-on-light)}
.fw-problem__heading-em{display:block;color:var(--navy-deep)}
.fw-problem__list{list-style:none;padding:0;margin:0 0 36px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px 40px;text-align:left;max-width:920px;margin-inline:auto}
.fw-problem__item{position:relative;padding:14px 0 14px 28px;font-size:18px;line-height:1.5;color:var(--text-on-light)}
.fw-problem__item::before{content:"";position:absolute;left:0;top:22px;width:8px;height:8px;border-radius:50%;background:var(--mint);box-shadow:0 0 0 4px rgba(53,214,198,.18)}
.fw-problem__item:nth-child(5){grid-column:1/-1;text-align:center;padding-left:0}
.fw-problem__item:nth-child(5)::before{position:static;display:inline-block;margin-right:10px;vertical-align:middle}
.fw-problem__q em{font-style:italic;color:var(--teal)}
.fw-problem__close{font-size:16px;font-style:italic;color:var(--text-on-light-muted);max-width:680px;margin:32px auto 0;line-height:1.55}
@media (max-width:720px){
  .fw-problem{padding:64px 20px}
  .fw-problem__list{grid-template-columns:1fr;gap:14px;text-align:left}
  .fw-problem__item:nth-child(5){grid-column:auto;text-align:left;padding-left:28px}
  .fw-problem__item:nth-child(5)::before{position:absolute;left:0;top:22px;display:block;margin:0}
}
@keyframes fwBreathe{0%,100%{transform:scale(1)}50%{transform:scale(1.025)}}
```

## 5. Animation

Reveal-on-scroll, IntersectionObserver, `threshold: 0.3`, fires once.

```css
[data-reveal]{opacity:0;transform:translateY(12px);transition:opacity 400ms cubic-bezier(.16,1,.3,1),transform 400ms cubic-bezier(.16,1,.3,1)}
[data-reveal="list"] .fw-problem__item{opacity:0;transform:translateY(8px);transition:opacity 300ms cubic-bezier(.16,1,.3,1),transform 300ms cubic-bezier(.16,1,.3,1)}
.fw-problem.is-in [data-reveal="heading"]{opacity:1;transform:none}
.fw-problem.is-in [data-reveal="list"] .fw-problem__item{opacity:1;transform:none}
.fw-problem.is-in [data-reveal="list"] .fw-problem__item:nth-child(1){transition-delay:300ms}
.fw-problem.is-in [data-reveal="list"] .fw-problem__item:nth-child(2){transition-delay:380ms}
.fw-problem.is-in [data-reveal="list"] .fw-problem__item:nth-child(3){transition-delay:460ms}
.fw-problem.is-in [data-reveal="list"] .fw-problem__item:nth-child(4){transition-delay:540ms}
.fw-problem.is-in [data-reveal="list"] .fw-problem__item:nth-child(5){transition-delay:620ms}
.fw-problem.is-in [data-reveal="close"]{opacity:1;transform:none;transition-delay:900ms}
@media (prefers-reduced-motion:reduce){
  .fw-problem__mascot{animation:none}
  [data-reveal],[data-reveal="list"] .fw-problem__item{opacity:1!important;transform:none!important;transition:none!important}
}
```

```js
(()=>{const s=document.querySelector('.fw-problem');if(!s)return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){s.classList.add('is-in');return}
  new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){s.classList.add('is-in');o.disconnect()}}),{threshold:.3}).observe(s)})();
```

Headline 400ms; bullets stagger 80ms each starting at 300ms; closing line at 900ms (≈600ms after first bullet). All transform/opacity. Mascot has a 6s breathing scale (1 → 1.025) — disabled under reduced motion.

## 6. Accessibility

- `<section aria-labelledby="problem-heading">` landmark.
- `<h2>` is the section heading (assumes hero owns `<h1>`).
- Bullets are a real `<ul role="list">` so Safari/VoiceOver announce list semantics even with `list-style:none`.
- Mascot is decorative: empty `alt`, `aria-hidden="true"`. No emotional/informational content depends on the image.
- Contrast on `--off-white #f7f9fb`:
  - `--text-on-light #002d56` = ~14.5:1 (AAA)
  - `--text-on-light-muted #5a6b7d` = ~5.6:1 (AA pass)
  - `--teal #00b6ad` only on em-emphasis inside body text (decorative); never sole carrier of meaning.
- `:focus-visible` inherited from global stylesheet; no interactive elements introduced.
- All motion respects `prefers-reduced-motion: reduce` — content visible immediately, mascot static.
- No flashing, no parallax, no auto-rotating content.

## 7. Iconography

- **Mascot:** `finny-3d.png` (thoughtful pose). 140×140 px, `loading="lazy"`, `decoding="async"`, `width`/`height` set to prevent CLS. Subtle 6s breathing scale conveys "thinking with you" without animation noise.
- **Bullet markers:** CSS-drawn 8px mint discs with a 4px translucent mint halo (`box-shadow: 0 0 0 4px rgba(53,214,198,.18)`). Brand-only; no emoji, no SVG icons; readable at any zoom; no extra HTTP requests.
- **No account chips here** — that visualization belongs to Section 5 ("What Finwy sees"). This section stays text-led so the bullets land hardest.
- **Em-tag accent** (`*this*` salary) renders italic in `--teal` — single point of color emphasis, brand-controlled.

---

**Files referenced (absolute):**
- Spec: `/Volumes/FinwiserDev/finwiser-projects/finwiser-website/claudedocs/section_04_the_problem_20260507.md`
- Mascot: `/Volumes/FinwiserDev/finwiser-projects/finwiser-website/fw-deck-2026/slides/finny-3d.png`
- Design doc §15: `/Volumes/FinwiserDev/finwiser-projects/claudedocs/design_finwiser_homepage_20260507.md`
