# Section #6 — How It Works (3-Step Scroll-Driven Stepper)

**Role:** Signature visual moment of the homepage. Premium, restrained, scroll-choreographed.
**Background:** `--navy` `#002d56`. **Height:** ~250vh desktop. **Voice:** institutional ("Finwiser…").

---

## 1. Spec

Two-column layout (≥900px). Left column (40%) holds a 3px vertical mint progress line over a low-opacity teal track plus three Lora-italic step indicators (`01` / `02` / `03`). Right column (60%) holds three sticky concept cards that cross-fade in place. The progress line draws as the section scrolls past; each step indicator activates when the line crosses its Y; each concept card fades in over the previous as its anchor enters the viewport.

Mobile (<900px): single column, no pin, no scroll-line drawing — line collapses to small inline indicators on each card.

Reduced motion: line static at 100%, all indicators active, cards stacked.

---

## 2. Copy

**Eyebrow:** `How it works`
**H2:** `Three minutes. Three steps. One complete picture.`
**Sub:** `Finwiser turns disconnected accounts into a measured, prioritised plan — automatically.`

| # | Heading | Body |
|---|---|---|
| 01 | **Few taps. Connect every account you have.** | You approve each connection on your bank's own RBI-regulated rail. Finwy does the rest — and you can disconnect anytime. *(Tags: Account Aggregator · Email statements · Credit bureau)* |
| 02 | **What Finwy notices that you don't.** | Once you connect, Finwy reads every transaction across your accounts — through the RBI-regulated consent rail. Sorts every rupee into income, fixed, variable. Measures what's actually left. And points out what you'd otherwise miss. *(Tags: Account Aggregator · Categorises automatically · Surfaces what matters)* |
| 03 | **Some of your goals don't fit. We tell you which.** | Six goals. ₹41,300 surplus. Four fit. Two don't — Finwiser says so up front, with the math visible. *(Tags: Next Best Rupee™ · Reads your portfolio · Tells you which goals fit)* |

---

## 3. HTML scaffold

```html
<section id="how" class="how" aria-labelledby="how-heading">
  <div class="how__intro">
    <p class="how__eyebrow">How it works</p>
    <h2 id="how-heading">Three minutes. Three steps. One complete picture.</h2>
    <p class="how__sub">Finwiser turns disconnected accounts into a measured, prioritised plan — automatically.</p>
  </div>

  <ol class="stepper" role="list">
    <!-- Left rail: progress line + step indicators -->
    <div class="stepper__rail" aria-hidden="true">
      <span class="stepper__track"></span>
      <span class="stepper__line"></span>
      <span class="stepper__node" data-step="1"><span class="num">01</span></span>
      <span class="stepper__node" data-step="2"><span class="num">02</span></span>
      <span class="stepper__node" data-step="3"><span class="num">03</span></span>
    </div>

    <!-- Right column: anchors + sticky cards -->
    <li class="step" data-step="1">
      <article class="step__card" aria-labelledby="step-1-h">
        <p class="step__num" aria-hidden="true">01</p>
        <h3 id="step-1-h">Few taps. Connect every account you have.</h3>
        <p>You approve each connection on your bank's own RBI-regulated rail. Finwy does the rest — and you can disconnect anytime.</p>
        <ul class="steps__tags" role="list">
          <li>Account Aggregator</li>
          <li>Email statements</li>
          <li>Credit bureau</li>
        </ul>
        <figure class="concept concept--connect" aria-hidden="true">
          <!-- Cards approve sequentially in a centred "active" slot, then settle
               into a left-side fanned deck. Sidebar tallies (Assets, Liabilities,
               Protection, Credit Score) update live as each card is approved.
               After the last card settles, an "All connected" badge appears
               in the active slot. See §7 for cards/sidebar/timing details. -->
        </figure>
      </article>
    </li>

    <li class="step" data-step="2">
      <article class="step__card" aria-labelledby="step-2-h"> ... waterfall SVG ... </article>
    </li>

    <li class="step" data-step="3">
      <article class="step__card" aria-labelledby="step-3-h"> ... goal allocation SVG ... </article>
    </li>
  </ol>
</section>
```

---

## 4. CSS (tokens only)

```css
.how{ background: var(--navy); color: var(--text-on-dark);
      padding: 110px 24px; position: relative; }
.how__intro{ max-width: 720px; margin: 0 auto 80px; text-align: center; }
.how__eyebrow{ font: 500 13px/1 ui-monospace,"SF Mono",monospace;
               letter-spacing: .12em; text-transform: uppercase;
               color: var(--mint); margin: 0 0 16px; }
.how__intro h2{ font: 600 clamp(32px,4vw,48px)/1.15 Inter,sans-serif;
                margin: 0 0 16px; letter-spacing: -0.01em; }
.how__sub{ color: var(--text-on-dark-muted); font-size: 18px; margin: 0; }

.stepper{ position: relative; max-width: 1180px; margin: 0 auto;
          display: grid; grid-template-columns: 40% 60%;
          gap: 0; list-style: none; padding: 0; }

/* LEFT RAIL — sticky for full section duration */
.stepper__rail{ position: sticky; top: 50%; transform: translateY(-50%);
                height: 60vh; align-self: start;
                display: grid; grid-template-rows: 1fr 1fr 1fr;
                justify-items: center; }
.stepper__track,.stepper__line{
  position: absolute; left: 50%; top: 0; bottom: 0;
  width: 3px; transform: translateX(-50%); border-radius: 2px;
}
.stepper__track{ background: rgba(0,182,173,0.18); }      /* --teal @ 18% */
.stepper__line{ background: var(--mint); transform-origin: top center;
                transform: translateX(-50%) scaleY(0); }

.stepper__node{ position: relative; z-index: 1;
  font: italic 600 56px/1 Lora,Georgia,serif;
  color: var(--text-on-dark-muted);
  background: var(--navy); padding: 8px 16px;
  transition: color 300ms cubic-bezier(0.4,0,0.2,1),
              transform 300ms cubic-bezier(0.4,0,0.2,1),
              text-shadow 300ms cubic-bezier(0.4,0,0.2,1);
}
.stepper__node.is-active{ color: var(--mint); transform: scale(1.05);
  text-shadow: 0 0 24px rgba(53,214,198,0.35); }

/* RIGHT COLUMN — sticky cards */
.step{ min-height: 80vh; display: flex; align-items: center; }
.step__card{ position: sticky; top: 20vh;
             opacity: 0; transform: translateY(12px);
             transition: opacity 200ms cubic-bezier(0.16,1,0.3,1),
                         transform 600ms cubic-bezier(0.16,1,0.3,1); }
.step__card.is-visible{ opacity: 1; transform: translateY(0); }

.step__num{ font: italic 600 14px/1 Lora,serif; color: var(--mint);
            letter-spacing: .04em; margin: 0 0 12px; }
.step__card h3{ font: 600 clamp(24px,2.4vw,32px)/1.25 Inter,sans-serif;
                margin: 0 0 16px; letter-spacing: -0.01em; }
.step__card p{ color: var(--text-on-dark-muted); font-size: 17px;
               line-height: 1.6; max-width: 56ch; margin: 0 0 32px; }

.concept{ margin: 0; padding: 32px; border-radius: 16px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(53,214,198,0.16); }
.concept svg{ width: 100%; height: auto; display: block; }
.concept [data-anim]{ opacity: 0; transform: translateY(8px);
   transition: opacity 400ms cubic-bezier(0.16,1,0.3,1),
               transform 400ms cubic-bezier(0.16,1,0.3,1); }
.step__card.is-visible .concept [data-anim]{
   opacity: 1; transform: translateY(0); }
.step__card.is-visible .concept [data-anim="1"]{ transition-delay: 80ms; }
.step__card.is-visible .concept [data-anim="2"]{ transition-delay: 160ms; }
.step__card.is-visible .concept [data-anim="3"]{ transition-delay: 240ms; }
.step__card.is-visible .concept [data-anim="4"]{ transition-delay: 320ms; }

/* SCROLL-TIMELINE — modern path */
@supports (animation-timeline: scroll()) {
  .stepper{ view-timeline-name: --how; view-timeline-axis: block; }
  .stepper__line{
    animation: drawLine linear both;
    animation-timeline: --how;
    animation-range: cover 8% cover 92%;
  }
  @keyframes drawLine{ from{ transform: translateX(-50%) scaleY(0); }
                       to  { transform: translateX(-50%) scaleY(1); } }
}

/* MOBILE */
@media (max-width: 900px){
  .stepper{ grid-template-columns: 1fr; }
  .stepper__rail{ display: none; }
  .step{ min-height: auto; margin-bottom: 64px; }
  .step__card{ position: static; opacity: 1; transform: none; }
  .step__num{ font-size: 36px; display: block; margin-bottom: 8px; }
}

/* REDUCED MOTION */
@media (prefers-reduced-motion: reduce){
  .stepper__line{ transform: translateX(-50%) scaleY(1) !important;
                  animation: none !important; }
  .stepper__node{ color: var(--mint) !important; transform: none !important;
                  text-shadow: none !important; transition: none !important; }
  .step__card,.concept [data-anim]{
    opacity: 1 !important; transform: none !important; transition: none !important; }
  .stepper__rail{ position: static; transform: none; height: auto; }
  .step__card{ position: static; }
}
```

---

## 5. Animation choreography (the heart of this section)

**Timeline mental model.** Section is 250vh tall. Imagine a vertical "playhead" at the centre of the viewport sweeping from the section's top to its bottom. The progress line *is* that playhead made visible. Each step indicator and concept card is a beat that the playhead passes through.

**A. Vertical progress line (signature primitive)**
- Track: `rgba(0,182,173,0.18)` — `--teal` at 18% on `--navy`. Always visible.
- Line: `--mint`, 3px, `transform-origin: top`. Animates `scaleY` from 0 → 1.
- Modern engine: `animation-timeline: scroll()` driven by a `view-timeline` named `--how`, ranged `cover 8% cover 92%` so the line is empty when the section first enters viewport and full just before it exits. Linear easing — no ease on a scroll-driven primitive (the user's scroll *is* the easing).
- Fallback (`@supports not (animation-timeline: scroll())`): one IntersectionObserver registers the section; one `scroll` listener throttled via `requestAnimationFrame` computes `progress = clamp((vpCentre − sectionTop) / (sectionHeight − vh), 0, 1)` and writes `el.style.transform = 'translateX(-50%) scaleY(' + progress + ')'`. Single rAF loop, single layout read per frame. Detaches when the section is out of viewport.

**B. Step indicators (`01` / `02` / `03`)**
- Default: Lora italic 56px, `--text-on-dark-muted`, no shadow.
- Activate when their bounding box centre is above the viewport centre (each gets one IntersectionObserver with `rootMargin: '-50% 0% -50% 0%'`, `threshold: 0`).
- On activation: add `.is-active` → color → `--mint`, `transform: scale(1.05)`, `text-shadow: 0 0 24px rgba(53,214,198,0.35)`. Transition: 300ms `cubic-bezier(0.4,0,0.2,1)`.
- No bounce. No rotation. `scale` stays ≤1.05 (per §15.4 hover discipline applied to state changes).

**C. Concept cards — sticky cross-fade**
- Each `.step` row is 80vh tall; its `.step__card` is `position: sticky; top: 20vh`. When step 2's row begins, step 1's row scrolls away and the next sticky card naturally takes over.
- Card visibility is controlled by IntersectionObserver (same `rootMargin: '-50% 0% -50% 0%'`). When its anchor crosses the viewport centre, `.is-visible` is added.
- Entry: `opacity 0 → 1` over 200ms (cross-fade window) and `translateY(12px → 0)` over 600ms with `cubic-bezier(0.16,1,0.3,1)` (expo decelerate). The longer transform finishes after the opacity, producing a settled feel rather than a snap.
- Cards never slide horizontally. Never rotate. Never scale on entry.

**D. Concept-card iconography reveal**
- Each SVG has elements tagged `data-anim="1"` through `"4"` (chips for step 1, three waterfall bars for step 2, four goal arrows for step 3).
- When the parent card gets `.is-visible`, each tagged element transitions `opacity 0→1` + `translateY(8px→0)` over 400ms, expo decelerate, with 80ms staggered delays. Total icon sequence: ~640ms.
- No path-drawing animations. No SMIL. No staggered scaling. Connecting lines in the SVG fade in along with the chips — they do not animate `stroke-dashoffset` (would feel theatrical).

**E. Choreography summary (single-step pass-through, scroll forward)**
1. `t=0` — line height begins increasing as section enters.
2. `t≈section-progress 0.2` — line crosses node `01`. Indicator activates (300ms). Card 1 anchor enters viewport centre → fades in (200ms opacity / 600ms rise). Concept SVG icons stagger in (4 × 80ms = 320ms after card visible, total ~720ms).
3. `t≈0.5` — line crosses `02`. Indicator 2 activates. Card 2 cross-fades over card 1 (200ms opacity overlap). Card 1 stays composited until it scrolls out of its sticky row.
4. `t≈0.8` — line crosses `03`. Indicator 3 activates. Card 3 cross-fades.
5. `t=1` — line reaches 100%. Section exits.

**F. Reverse scroll** — every CSS transition is symmetric; classes are removed by the same observer; the line follows scroll position natively. No "play once" flag.

**G. Frame budget** — only `transform` and `opacity` mutate. Line, indicators and cards each get `will-change: transform` *only while* `.is-active`/`.is-visible`; cleared on exit (set inline by JS to avoid forcing layers permanently). Target: 60fps on a 2018 mid-range Android.

---

## 6. Accessibility notes

- `<section aria-labelledby="how-heading">`; single H2; one H3 per step.
- Stepper is an `<ol>` with an explicit `role="list"` (Safari strips list semantics from styled lists). Each step is an `<li>`.
- Numerals `01/02/03` appear twice: once in the **rail** (decorative — wrapped in `aria-hidden="true"` rail container) and once inside each card's `<p class="step__num" aria-hidden="true">`. The H3 carries the meaning; screen readers announce "Heading level 3, Few taps. Connect every account you have." without doubled numerals.
- Step 01's concept block (`.steps__concept--connect`) and Step 02's (`.steps__concept--surplus`) are both `aria-hidden="true"` — they're purely illustrative animations and the body paragraph + tags above carry the same information textually. Step 03's concept SVG uses `role="img"` with a descriptive `aria-label`; inner shapes are `aria-hidden`.
- Sticky pinning never traps focus: tab order flows H2 → step 1 H3 → (no interactive children) → step 2 H3 → step 3 H3. No `tabindex` overrides.
- `:focus-visible` on the section's only interactive descendant (none in this section by default) would inherit the global focus ring — `outline: 2px solid var(--mint); outline-offset: 3px`.
- Contrast: `--mint` `#35d6c6` on `--navy` `#002d56` = 8.6:1 (AAA); `--text-on-dark-muted` rgba(255,255,255,0.74) on `--navy` = 9.2:1 — body and accent both clear AA at any size.
- Reduced motion: line static full, indicators all mint, cards stacked, no sticky, no transitions.
- Keyboard zoom 200%: layout collapses to mobile single-column at the 900px breakpoint (uses `clamp` and `%` units, no fixed widths).
- 320px reflow: no horizontal scroll — `padding: 110px 24px` and `.concept` is `width: 100%`.

---

## 7. Iconography specs (CSS/SVG only — no app UI)

All SVGs: `viewBox="0 0 480 320"`, stroke `1.5`, no fills outside palette, all strokes `--mint` or `--teal`, all chip backgrounds `rgba(255,255,255,0.04)` with `1px` `rgba(53,214,198,0.24)` border.

**Step 01 — Approval feed → fanned deck.** *(Replaces the earlier "account hub" spec.)*

Three-zone stage inside the concept block: stack zone (left, 220px) | active zone (centre, 1fr) | sidebar (right, 220px). Stage `min-height: 300px`; stack and active zones each `height: 280px`.

- **Active zone.** Single card slot at top centre (`top: 14px; left: 50%`). A `1px dashed rgba(255,255,255,0.06)` rounded outline marks the slot when empty. The "currently approving" card lands here at full size (no scale, no rotation), with an animated mint **Approve** pill at the bottom-right that breathes (`approve-glow` 1.2s loop) until the approval flip.
- **Stack zone.** When a card is approved it slides left and scales to `0.78`. Two layered transforms drive position:
  - `--vi-pos` (clamped 0–4) = waterfall index. Each step adds **30px translateY**, **5px left**, **3.4° rotation** (range −13° → +0.6°). The first 5 cards' headers (logo + brand + masked num) peek above each other.
  - `--vi-deep` (max(0, --si−4)) = deck-depth index for cards 6–10. Each step adds 4px translateY, 1.4px left, 0.3° rotation. Cards 6–10 stack tightly behind the front card so the deck reads as 10 cards thick, not 5 visible + 5 hidden.
- **Sidebar.** Four equal stat tiles stacked vertically: Assets, Liabilities, Protection, Credit Score. Padding 14×16, label 10px uppercase tracked, value 17px monospace. Each tile flashes mint (gold for Protection) for ~1s when its category receives a value, with a smooth ease-out counter animation (~750ms) from previous to new total.
- **End state.** When all 10 cards settle, an "✓ All connected" badge appears in the active slot — vertical layout, 38px mint check disc with mint glow, 16px headline, 11px subtext "10 of 30+ types · picture ready". Mint linear-gradient bg with 4px outer glow ring. Driven by `.is-done` on the feed.

**Card content.** Brand mark (22×22 white rounded chip with logo, or mint mono badge with 2-letter monogram for unbranded entries — `MF`, `NPS`, `LIC`, `HL`, `CL`, `CC`, `CR`); brand name (13px); masked number (10.5px monospace); amount (18px monospace, mint when approved); Approve button (active) or "Approved" check pill (settled).

**Card lineup (10 in approval order).** ICICI Bank · xxxx 1234 → ₹4.80 L (Asset). Mutual Funds · 8 folios → ₹28.40 L (Asset). Home Loan · ··3344 → ₹35.00 L (Liability). LIC · Policy ··5555 → Protection ₹12.00 L. Credit Score · Credit report → 782 (meta — no sidebar bucket). HDFC Bank · xxxx 5678 → ₹1.40 L (Asset). SBI · xxxx 9012 → ₹2.20 L (Asset). NPS · PRAN ··7890 → ₹11.80 L (Asset). Credit Card · ··0911 → ₹38,400 due (Liability). Car Loan · ··2211 → ₹8.00 L (Liability). The first 5 cover all four categories so each sidebar tile lights up early; the last 5 add depth without changing the category mix.

**Pacing (geometric → brisk).** First 5 cards deliberate; last 5 brisk.
- `GAP` (ms between successive card starts): `1300, 1200, 1100, 1050, 1000, 720, 660, 620, 600, 580`
- `DWELL` (ms in active state before approval flip): `820, 760, 700, 660, 620, 430, 400, 380, 360, 340`
- `TAP_MS` 140 (button-press visual fires 140ms before approval).
- `SETTLE_PAUSE_MS` 380 (after approval, card holds with "✓ Approved" before sliding to stack).
- Total runtime ~9.5s. Reduced motion: skip animation, settle all cards immediately, fill sidebar synchronously.

**Step 02 — Surplus flow.** Three vertical bands left → centre → right, with a 4-up insights strip below. The narrative: transactions stream into Finwy's aura, get categorised, ledger fills, surplus reveals as the bottom-line, insights generate. AA-accurate framing — bank-statement transaction records, not SMS. Markup root: `.steps__concept--surplus > .flow`. State classes on `.flow`: `is-streaming-active` · `is-reading` · `is-revealed` · `is-insighting` · `is-done`.

- **Left band — Inflow (220px).** A counter group centred in the lane: big mint `flow__counter-num` (Inter 800 44px, tabular-nums) above a `flow__counter-label` (categorised) and a soft `flow__counter-sub` (this month, fades in at done). Below: a 3-segment `flow__counter-bar` (mint=income, teal=fixed, gold=variable) with `flex-basis` set proportionally; a `flow__counter-breakdown` line — `<n> income · <n> fixed · <n> variable` — and an `as of <month>` stamp (claims-discipline timestamp). Top of lane has a `linear-gradient` mask to fade chips disappearing above the counter.

- **Centre band — Finwy.** 124px `finwy-allocating.png` mascot anchored on a 240px radial-gradient `flow__aura` that breathes (4.5s · scale 1.00→1.06 · opacity 0.92→1.00). On `.is-reading` the breathe accelerates to 1.6s. A `::after` pseudo-element layers a brighter ripple — fired with `.is-pulse` (one-shot `aura-ripple` 620ms · scale 0.55 → 1.00 → 1.30 · opacity 0 → 1 → 0) each time a chip is mid-flight over Finwy. Caption "Reading. Sorting. Noticing." in italic Lora 12px below the mascot.

- **Right band — Income statement (280px).** A `.ledger` block with three small rows (`Income` / `Fixed` / `Variable`, label-left + value-right; values tabular-nums 20px) and a hero `ledger-row--surplus` block at the bottom — full-width tinted background, mint top-border, label "SURPLUS" 14px tracked, value 36px Inter 800 with `/ mo` suffix. Surplus value pulses placeholder `₹ ———` (animation `surplus-blank`) until reveal; on `.is-revealed` the bg gradient saturates, mint glow box-shadow lands, and the value snaps via `animateNumber(0 → 41,300)`.

- **Transaction chip (`.txn`, 200px).** Bank-statement format — date · narration · amount · account ref. *Not* SMS. No bank-name sender chip, no time-of-day, no "Avl Bal". States: `.is-streaming` (fades in at top of lane), `.is-classified` (border-color tints by category — mint/teal/gold), `.is-routed` (translates via CSS variables `--route-x` / `--route-y` to the corresponding ledger row, scales 0.42, fades). 12 chips total with geometric pacing — first 5 deliberate (`GAP` 1500→900ms, `DWELL` 900→560ms), last 7 brisk (down to 450/310ms). `ROUTE_DELAY` 220ms between classify and route. Aura pulse fires at `routeAt + 140ms` (peak coincides with chip mid-flight at Finwy).

- **Insights strip (4 chips, equal width).** Typography-led — no icons. Each `.insight` is a flex column with `.insight__num` (Inter 800 48px, tabular-nums, severity-coloured) and `.insight__label` (Inter 600 11px tracked uppercase). Severity carried by border-left + tinted background + number color — *not* by icon glyphs. Variants: `--score` (rose), `--shield` (rose), `--runway` (gold), `--idle` (mint). Final 4 chips: **32% · Limit used** · **1.4× · Insurance** · **4.2 mo · Emergency fund** · **₹1.4L · Idle money**. Reveal on `.is-insighting` with 140ms stagger.

- **Counter rolling.** Per-chip route increments counter 1, 2, … 12 paced with the stream. After last chip routes, `requestAnimationFrame` rolls counter 12 → 87 over 1500ms with `eased = 1 − (1−p)^2.4` (decelerating). Breakdown numbers and bar segments roll proportionally to `BREAKDOWN_FINAL = { income: 7, fixed: 36, variable: 44 }`. Total runtime ~13s.

- **Reduced motion.** Skip stream animations, hide `.txn` chips entirely (`display: none`), settle ledger and counter to final values synchronously, set `is-revealed is-insighting is-done is-streaming-active` on `.flow`. Surplus, insights, and breakdown all visible immediately. No `aura-ripple`. No `surplus-blank` pulse.

**Step 03 — Cascade allocator with floating balance.** *(Final — supersedes the rupee-glyph-with-fanning-arrows sketch.)* Markup root: `.steps__concept--allocate` containing **Act 1** (source strip → Finwy mark) followed by **Act 2** (top banner + cascade table + caption). State classes on the concept block: `is-act2 · is-starred · is-caption`. State classes on the source strip: `is-act1-in · is-dissolving · is-replaced`. Total runtime ~9 s.

- **Act 1 — `.src-stage`.** Five `.src-chip` chips (`Random YouTubers · Random influencers · Cousin's WhatsApp · Office hot tips · Bank RM (commission-driven)`) fade in left-to-right with 80 ms stagger inside a flex row, followed by a thin `.src-arrow` and a 36 px circular `.src-finwy` mark (mint zigzag SVG). At t≈1.1 s the chips animate out via `chip-dissolve` (translateX 40 px + scale 0.78 + opacity 0) with 220 ms stagger; Finwy emits a 6 px mint box-shadow pulse on each landing. At t=2.5 s `is-replaced` fades the row out and reveals an absolute-positioned `.src-replace` paragraph centred in the strip — *"**No** random tips. **No** random influencers. **No** commission-driven advice."* (16 px Inter 500, mint bold on each "No"). The strip retains a `min-height: 60px` so the layout never jumps.

- **Act 2 — top banner (`.topbanner`).** Two cells flexed left/right above the table: **Surplus** (left, static `₹41,300/mo`) and **Balance** (right, dynamic counter starting at `₹41,300`). Both at 26 px Inter 800, mint, tabular-nums, with a 24 px text-shadow glow. Reveals via `is-act2` (opacity + 4 px translateY).

- **Act 2 — cascade table (`.cascade`).** Five-column grid: `48px 1fr 130px 110px 130px` for Pri / Goal / Fund / Required / Allocated. Column heads in 10 px uppercase tracked muted. Six rows total, each `.cascade__row` with 10 px radius, 1 px subtle border, 12×14 px padding.

  Goals (`Aman, 32` example):

  | Pri | Goal | Fund | Required | Allocated |
  |---|---|---|---|---|
  | P0 | ★ Retirement [`Next Best Rupee™` pill] · sub: *"₹30L PPF, ₹0 equity"* | Equity index fund | ₹15,000 | ₹15,000 |
  | P0 | Emergency fund | Liquid debt fund | ₹2,000 | ₹2,000 |
  | P1 | First flat (2031) | Balanced advantage fund | ₹16,000 | ₹16,000 |
  | P2 | Wedding (2029) | Short-duration debt | ₹8,300 | ₹8,300 *(cutoff)* |
  | P3 | Bike (this year) | *Push 18 months* (italic Lora) | ₹6,000 | Not feasible |
  | P3 | Foreign trip (2027) | *Push 3 years* (italic Lora) | ₹8,000 | Not feasible |

  Funded sums to ₹41,300 exactly; surplus is exhausted at the P2 cutoff.

- **Priority pills (`.pri`).** P0 = solid mint on navy-deep. P1 = solid teal on white. P2 = mint outlined. P3 = muted-white outlined.

- **Cascade animation.** Rows reveal top-down with 720 ms stagger from t=3.3 s. For each funded row at reveal: `.cascade__required` text fades in at +0 ms; at +80 ms `.cascade__allocated` counter ticks 0 → required and the floating `.topbanner__cell--balance` counter ticks down by the same amount, both over 420 ms (cubic-bezier(0.16,1,0.3,1) ease-out via `1 − (1−t)^3`). When the Balance counter hits ₹0 (after Wedding's allocation), `.is-zeroed` fires `balance-zero-pulse` (540 ms scale 1 → 1.22 → 1, mint glow) and `.cascade__cutoff` draws via 480 ms `transform: scaleX(0 → 1)`. For deferred rows: Required fades in normally; Allocated cell renders `₹0` then 280 ms later swaps to `Not feasible` (gold, 11.5 px Inter 500). Row also gains `.is-fallen` (opacity 0.55, translateY 4 px, dashed 1 px white-18% border).

- **Star intensify (`is-starred`).** Retirement row gains a mint border-color pulse + 22 px outer mint shadow + 1 px inset mint highlight. The `★` glyph scales to 1.15 with 12 px mint text-shadow.

- **Closing caption (`.alloc__caption`).** 1 px solid white-8% border-top divider; 14 px padding-top; 10 px margin-top. Single line: *"Fits your goals. Fits your priorities."* in italic Lora 500 mint at clamp(20 px, 2.6 vw, 26 px) with a 28 px mint text-shadow.

- **Mobile (≤720 px).** Source chips wrap to 2 rows. `.src-replace` switches to `position: static`. Top banner stacks vertically; each cell becomes a label-value flex row. Fund column hides; `.name__fund-mobile` shows the fund text as a subline under the goal name (deferred rows render in italic Lora). Cascade grid drops to 4 columns: `42px 1fr 88px 110px`.

- **Reduced motion.** All animations and transitions zeroed. Settle to final state: Act 1 replaced, all rows revealed with terminal values, deferred rows fallen, Balance at ₹0 with pulse class set, cutoff drawn, caption visible.

- **JS hook.** `IntersectionObserver` on `#s3-row` with `threshold: 0.20` and `rootMargin: '-5% 0px -5% 0px'` (matches the §6.02 surplus pattern). Fires once. Counter animations use `requestAnimationFrame` with arrays `allocTimers` / `allocRafs` for clean reset on Replay (in preview only).

The three concept frames remain visually consistent: same border-radius, same internal padding, same calm navy-deep ground. Step 01 fans cards in. Step 02 streams transactions through Finwy. Step 03 cascades the surplus through priorities and visibly cuts the goals that don't fit. Trilogy verb: **see → notice → choose**.

---

*Spec ends. ~990 words excluding code.*
File: `/Volumes/FinwiserDev/finwiser-projects/finwiser-website/claudedocs/section_06_how_it_works_stepper.md`
