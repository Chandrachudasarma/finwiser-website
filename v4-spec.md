# §7 v4 — The Engine  *(superseded by v7)*

> **⚠️ This spec describes v4** (orbital hex layout, factors converging into Finwy at center).
> **Current implementation is v7** — `cases-preview-v7.html`.
>
> **v7 architecture** (what actually shipped):
> - **Layout**: heading-led per pair (tagline as h3) → input row (top) → factor track (middle) → output row (bottom). Vertical narrative arc, not the v4 horizontal three-column.
> - **Factor reasoning**: Finwy walks horizontally through six factor badges arranged in a line; each factor lights up + tick checkmark as Finwy passes; the decisive one stays bright with a DECISIVE label. **Not** the v4 orbital convergence.
> - **Six factors**: Age · Goals · Surplus · Portfolio · Risk · **Priorities** (renamed from Family in v6→v7).
> - **Output cards**: each carries a **hero verb** (STOP / START · SHIFT / HOLD · EASE / PROTECT) — counterweight to the input hero number/percentage.
> - **Three pair headings**:
>   1. *Same surplus. Opposite portfolios.* (Risk decisive)
>   2. *Same portfolio. Different goals.* (Goals decisive)
>   3. *Same income. Different expenses.* (Priorities decisive)
> - **Pacing**: Pair 1 slow (700ms per factor) → Pair 2 medium (450ms) → Pair 3 fast (300ms).
> - **Closer**: *"Six 35-year-olds. Six recommendations — and they keep changing. Finwy keeps watching. Get yours →"*
> - **Character coding**: Riya/Arjun/Vivek = mint family. Aman/Suresh/Karan = teal family. Same colour across input + output cards per character.
> - **Glider position**: JS measures factor positions via `getBoundingClientRect` and aligns Finwy precisely under each. Settles at rightmost (Priorities) when glide completes.
> - **Disney arc**: Finwy hops 8px Y per step (per-step keyframe, not infinite bob).
>
> Sections below are kept for historical reference of the v4 design exploration. The principles (story-spine narrator, six-factor reasoning, decisive-factor highlight, character colour-coding) survive into v7; the **layout and animation specifics** were rebuilt.
>
> See also: `cases-changelog.md` for the v1→v7 progression.

---

*Two inputs converge on Finwy. Finwy visibly considers six factors. Two divergent verdicts emerge. Same surplus, opposite verdicts — proven, not claimed.*

> **Updated 2026-05-09** — eight upgrades from the storytelling panel (McKee · Miller · Simmons · Duarte · Heath · Cron · Stanton · Berger):
> 1. Reader-centric heading (Miller)
> 2. Trigger lines back on input cards (Simmons)
> 3. Caption rewritten as a six-beat story-spine narrator (Stanton + Cron)
> 4. Surprise-first verdict ordering on Pair 1 (Cron — gap of expectation)
> 5. Credibility note about scale (Heath)
> 6. Pair 2 tagline rewrite (Berger)
> 7. Prediction beat between Pairs 2 and 3 (McKee — protagonist agency)
> 8. Section-level progress indicator (Duarte — cumulative depth)

---

## 0. Premise

The brief that survives v3:
> *"The inputs are yours, not your category's."*

v4 makes that argument **visible by structure**, not by prose. Two compressed input cards on the left. Finwy in the middle, openly considering six factors. Two divergent verdict cards on the right. The page itself becomes a diagram of Finwy's reasoning.

This pattern mirrors §5 ("What Finwy sees") — the page already establishes inputs → Finwy → outputs as its visual grammar. v4 reuses and evolves that grammar to argue *personalisation* instead of *integration*.

**Section job:** prove that two demographically similar people get different answers because Finwy reasons over multiple inputs, with the *decisive* input changing per pair.

---

## 1. Section anatomy

```
Heading (reader-centric) + sub
   ↓
Progress indicator: ●○○ Pair 1 of 3 — Risk
   ↓
Pair 1 — Risk appetite (slow, ~7s, the teaching beat)
  ┌─────────────┬─────────┬─────────────┐
  │ Riya input  │  FINWY  │ Riya verdict│
  │ Aman input  │ (centre)│ Aman verdict│
  └─────────────┴─────────┴─────────────┘
        Tagline: "Same surplus. Opposite portfolios."
        Credibility (one-time): "Six factors here. Finwy reads thirty-plus inside the app."
   ↓
Progress indicator: ●●○ Pair 2 of 3 — Goal
   ↓
Pair 2 — Goal feasibility (medium, ~4s)
        Tagline: "The math depends on what you have, not what you want."
   ↓
Prediction beat: "Now meet two ₹1.6L payslips. Predict the divergence?"  ← ~800ms hold
   ↓
Progress indicator: ●●● Pair 3 of 3 — Family
   ↓
Pair 3 — Family load (fast, ~3s)
        Tagline: "Same payslip. Different floor."
   ↓
Section closer + CTA + footnote
```

Three pair-stages stack vertically. Each is self-contained — own input cards, own Finwy moment, own output cards, own tagline. Animation triggers on viewport entry.

A **section-level progress indicator** sits above each pair (or once at top, sticky on scroll — see open decisions). Format: three dots + labels in a row. Active dot is `--mint` filled; passed dots are `--mint-32`; upcoming dots are `--border-on-light`. Creates Duarte's cumulative-depth signal.

A **prediction beat** sits between Pair 2 and Pair 3. After Pair 2's tagline lands, the centre stage clears for ~800ms while one italic line in Lora appears centred: *"Now meet two ₹1.6L payslips. Predict the divergence?"* Then Pair 3's stage assembles. McKee's protagonist-agency moment.

---

## 2. Per-pair stage layout

### Desktop (≥ 880 px)

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   ┌───────────────┐     ┌─────────────┐     ┌───────────────┐     │
│   │  Riya M.      │     │             │     │  Verdict for  │     │
│   │  ₹52K surplus │ ╲   │   FINWY     │   ╱ │  Riya         │     │
│   │  83% equity   │   ╲ │     🐤      │ ╱   │ "Stop adding  │     │
│   │  Conservative │     │             │     │  equity..."   │     │
│   └───────────────┘     │  ◯ ◯ ◯       │     └───────────────┘     │
│                         │  ◯ ◯ ◯       │                           │
│                         │  factors      │                           │
│                         │  considered   │                           │
│   ┌───────────────┐     │              │     ┌───────────────┐     │
│   │  Aman K.      │   ╱ │              │ ╲   │  Verdict for  │     │
│   │  ₹52K surplus │ ╱   │              │   ╲ │  Aman         │     │
│   │  0% equity    │     └─────────────┘     │ "Start equity"│     │
│   │  Aggressive   │                          │               │     │
│   └───────────────┘                          └───────────────┘     │
│                                                                     │
│              Same surplus. Opposite portfolios.                     │
└────────────────────────────────────────────────────────────────────┘
```

Three-column grid: `1fr 1.4fr 1fr` — Finwy gets a wider column to hold the consideration animation comfortably.

### Mobile (< 880 px)

Stacks vertically in this order:
1. Riya input
2. Aman input
3. Finwy stage (full width)
4. Riya verdict
5. Aman verdict
6. Tagline

Threads connecting them become vertical curves. The visual metaphor (inputs → Finwy → outputs) survives.

---

## 3. Input card spec

Compressed. Three lines of content max.

| Field | Visual treatment |
|---|---|
| Name + age + city | `--fs-body` 700, navy. One line, e.g. *"Riya M. · 35 · Bengaluru"* |
| Surplus | `--fs-h3` 700, mint colour. Stamped large. *"₹52K / mo"* |
| Divergent metric | `--fs-micro` 500, muted. *"83% in equity · Conservative"* |
| Trigger line | `--fs-nano` italic, muted. One sentence anchoring why this person came to Finwy. (Simmons' Why-I'm-Here) |

Card is `--white` on `--off-white`, `--shadow-soft`, `12px` radius, padding `16px 20px`. Height grows slightly with the trigger line — ~135 px height, ~220 px width.

Riya and Aman cards stack vertically with `16px` gap inside the left column.

### Pair-specific card content

**Pair 1 — Risk**
- Riya: ₹52K surplus / 83% equity · Conservative
  *Trigger:* "Opened Finwy after a colleague's heart attack at 38."
- Aman: ₹52K surplus / 0% equity · Aggressive
  *Trigger:* "Opened Finwy after his crypto-friend's third disaster."

**Pair 2 — Goal**
- Arjun: ₹62K surplus / ₹14L saved · ₹27K SIPs
  *Trigger:* "Opened Finwy after a builder's sales-pitch dinner."
- Suresh: ₹62K surplus / ₹4L saved · ₹8K SIPs
  *Trigger:* "Opened Finwy after the salary hike that didn't feel like one."

**Pair 3 — Family**
- Vivek: ₹65K real surplus / parents healthy
  *Trigger:* "Opened Finwy after his daughter's third birthday."
- Karan: ₹30K real surplus / father on dialysis (₹35K/mo)
  *Trigger:* "Opened Finwy after his father's second dialysis bill."

The numbers that drive divergence are styled `--mint` for the heroes and `--rose` for losses (Karan's struck-through ₹35K appears here, with the deduction shown).

---

## 4. Finwy stage spec — the consideration moment

This is the central UX bet. Finwy must visibly *reason*, not just animate decoratively.

### Layout inside the Finwy column

```
            ┌─────────────────┐
            │                  │
            │   ◯ Age          │
            │      ◯ Goals     │
            │                  │
            │       🐤  FINWY  │
            │                  │
            │   ◯ Risk         │
            │      ◯ Family    │
            │   ◯ Surplus      │
            │      ◯ Portfolio │
            │                  │
            │  reading inputs… │  ← caption beneath
            └─────────────────┘
```

Six factor badges arranged in a hex around Finwy at varying distances and angles. Each badge is a circular ~36px chip with:
- Icon (8px, mint stroke)
- Label (10px, navy, single word)

Badges:
1. **Age** — calendar/clock icon
2. **Surplus** — coins icon
3. **Portfolio** — bar-chart icon
4. **Goals** — target icon
5. **Risk** — shield/balance icon
6. **Family** — people icon

Below Finwy: a small caption line in italic mint, ~`--fs-micro`. Default text: *"reading inputs…"*

### Animation choreography (Pair 1, the teaching beat)

| t | Layer | What happens |
|---|---|---|
| **0** | Stage | All input cards empty. Finwy idle, small (~64px), grey-tinted. Factor badges all dim. Caption hidden. |
| **200ms** | Caption | **Beat 1** — *"Two 35-year-olds. Same income."* fades in beneath stage. |
| **400ms** | Inputs | Riya's card populates with stagger (name → surplus → divergent metric → trigger line). |
| **800ms** | Inputs | Aman's card populates same pattern. |
| **1200ms** | Threads | Two thin mint threads draw from each input card → toward Finwy. Each thread takes 300ms. |
| **1500ms** | Comets | Pulse comets travel along threads from cards to Finwy. ~600ms travel time. |
| **2100ms** | Finwy | Finwy lights up — `--mint` halo grows around him (200ms scale-up). |
| **2200ms** | Caption | **Beat 2** — *"Reading their data."* |
| **2300ms** | Factors | **Age** badge pulses on: mint glow, label highlights, ~250ms hold, then dims back. |
| **2550ms** | Factors | **Surplus** badge pulses on. Hold, dim. |
| **2800ms** | Factors | **Portfolio** badge pulses on. Hold, dim. |
| **2900ms** | Caption | **Beat 3** — *"Six factors. One is decisive."* |
| **3050ms** | Factors | **Goals** badge pulses on. Hold, dim. |
| **3300ms** | Factors | **Risk** badge pulses on — and stays on (decisive for Pair 1). |
| **3550ms** | Factors | **Family** badge pulses on. Hold, dim. |
| **3700ms** | Caption | **Beat 4** — *"Risk is what data can absorb."* (slightly emphasised — `--text-on-light`) |
| **3900ms** | Finwy | Halo intensifies briefly. Finwy bobs once (small scale 1.0 → 1.06 → 1.0). |
| **4100ms** | Threads | Two threads draw from Finwy → toward each output card slot. ~300ms draw each. |
| **4400ms** | Comets | Output comets travel — Riya's `--mint`, Aman's `--teal`. Different shades signal different verdicts coming. |
| **4400ms** | Caption | **Beat 5** — *"Because of that…"* (emphasised) |
| **4900ms** | Outputs | **Riya's verdict populates first** — the counter-intuitive one (Cron's gap of expectation: *"the conservative one gets told to STOP?"*). Stagger reveal. |
| **5300ms** | Outputs | Aman's verdict card populates. |
| **5700ms** | Caption | **Beat 6** — *"Two different answers."* |
| **5800ms** | Tagline | *"Same surplus. Opposite portfolios."* fades in centred below. |
| **6500ms** | Credibility | One-time italic line below stage: *"Six factors here. Finwy reads thirty-plus inside the app."* |
| **7000ms** | Stage | Stable. Reader absorbs. |

Total: ~7 seconds. The reader has *watched Finwy think.*

### Animation choreography (Pair 2, medium)

Same structure, compressed timing. ~4 seconds total. Factor scan goes faster — 120ms per badge instead of 250ms. Decisive factor for Pair 2 is **Goals** (Suresh's goal doesn't fit his timeline). The Goals badge stays on after the scan; others dim.

Caption six-beat spine for Pair 2:
1. *"Two 35-year-olds. Same income. Same goal."*
2. *"Reading their plans."*
3. *"One started earlier. One didn't."*
4. *"Goals is what tips the math."*
5. *"Because of that…"*
6. *"Different timelines."*

Outputs in **natural order** (Arjun, then Suresh) — surprise-first ordering reserved for Pair 1 only, to avoid formula.

After Pair 2's tagline lands, a **prediction beat** triggers:
- Centre stage clears briefly.
- Italic line in Lora, max-width 540px, centred: *"Now meet two ₹1.6L payslips. Predict the divergence?"*
- Holds ~800ms.
- Then Pair 3's stage assembles.

### Animation choreography (Pair 3, fast)

~3 seconds total. Factor scan compressed further — 70ms per badge. Decisive factor: **Family**. The Family badge stays on.

Caption six-beat spine for Pair 3:
1. *"Two senior engineers. Same payslip."*
2. *"Reading what's beneath the payslip."*
3. *"Six factors. One eats the rest."*
4. *"Family is what's left after life."*
5. *"Because of that…"*
6. *"Different floors."*

The **dialysis strikethrough** on Karan's input card animates *during* the input populate phase — the strongest visual moment in Pair 3 and shouldn't be rushed. Strike line takes a deliberate 750ms while the rest of the animation runs at fast tempo. Controlled deceleration (Duarte's STAR moment) inside the fastest pair.

Outputs in natural order (Vivek, then Karan).

---

## 5. Pacing rationale

| Pair | Total | Factor scan per badge | Why |
|---|---|---|---|
| 1 — Risk | ~7s | 250ms | Reader is learning the visual grammar. Slow tempo lets them build the mental model. |
| 2 — Goal | ~4s | 120ms | Reader is fluent. Half the time. New axis, same logic. |
| 3 — Family | ~3s | 70ms | Reader is anticipating. The *strikethrough* moment slows things back down briefly — controlled deceleration in the fastest pair. |

Pacing = decelerando → accelerando, with a final ritardando on Karan's strikethrough. This is how documentaries pace their first three case studies. It works because the reader's cognitive load decreases as they internalise the pattern; tempo can rise to match.

---

## 6. Output card spec

Even more compressed than input cards.

| Field | Visual treatment |
|---|---|
| Verdict sentence | `--fs-body` 700, navy text on `--mint` background, full card width. Single line if possible, two max. |
| Stake or supporting | `--fs-micro` 500, muted, italic. Optional one-line. *e.g., "Skip the side bets."* |

Card width matches input card. Same `--shadow-soft`, same radius, but the body of the card IS the mint verdict bar — not navy text on white.

### Pair-specific verdicts

**Pair 1 — Risk**
- Riya verdict: *Stop adding equity. Buy term. Build liquidity.*
- Aman verdict: *Start equity. Today. Skip the side bets.*

**Pair 2 — Goal**
- Arjun verdict: *On track. Don't pause SIPs. The flat fits.*
- Suresh verdict: *Push 18 months. Drop ceiling to ₹68L.*

**Pair 3 — Family**
- Vivek verdict: *Light touch. Top up health. Fortify emergency.*
- Karan verdict: *Family first. Retirement second. Order matters.*

---

## 7. Thread + comet vocabulary

Reuse §5's SVG path technique (lines 2670–2720 of `index-staging.html`).

### Threads

Inbound (input → Finwy):
- Two cubic Bezier curves from each input card's right edge to Finwy's halo perimeter.
- `stroke="var(--mint)"`, `stroke-width="2"`, `stroke-linecap="round"`.
- Animated draw via `stroke-dasharray` + `stroke-dashoffset` transition over 300ms.

Outbound (Finwy → output):
- Two cubic Bezier curves from Finwy's halo perimeter to each output card's left edge.
- *Different colour* per thread to signal divergence: top thread `--mint`, bottom thread `--teal`. Reader subliminally registers "different signals coming out."

### Comets

Pulse comets travel along each thread.
- 12px-diameter `<circle>` with `--mint` fill and white inner dot.
- Animated via `<animateMotion>` along each path.
- Inbound comets: 600ms travel, ease-in-out.
- Outbound comets: 700ms travel, ease-out (slight emphasis on landing).
- Trail effect: comet leaves a brief glow in its wake (~150ms fade).

### Z-stacking

- Layer 1 (z-index 1): static thread lines.
- Layer 2 (z-index 2): input cards & output cards.
- Layer 3 (z-index 3): pulse comets (above threads, below cards).
- Layer 4 (z-index 4): Finwy mascot + halo + factor badges.

This matches §5's stacking exactly.

---

## 8. Caption — the six-beat narrator

The caption beneath Finwy is no longer status text. It's a **story-spine narrator** (Stanton + McKee + Cron). Six beats per pair, ~3 words each, replacing the earlier generic *"reading inputs…"*.

### Pair 1 — Risk

| Beat | Caption | Triggered at |
|---|---|---|
| 1. Setup       | *"Two 35-year-olds. Same income."* | input cards populating |
| 2. Disruption  | *"Reading their data."* | threads arrive at Finwy |
| 3. Tension     | *"Six factors. One is decisive."* | mid-factor scan |
| 4. Reveal      | *"Risk is what data can absorb."* | decisive factor highlighted |
| 5. Resolution  | *"Because of that…"* | outbound threads drawing |
| 6. Punchline   | *"Two different answers."* | tagline lands |

### Pair 2 — Goal

| Beat | Caption |
|---|---|
| 1 | *"Two 35-year-olds. Same income. Same goal."* |
| 2 | *"Reading their plans."* |
| 3 | *"One started earlier. One didn't."* |
| 4 | *"Goals is what tips the math."* |
| 5 | *"Because of that…"* |
| 6 | *"Different timelines."* |

### Pair 3 — Family

| Beat | Caption |
|---|---|
| 1 | *"Two senior engineers. Same payslip."* |
| 2 | *"Reading what's beneath the payslip."* |
| 3 | *"Six factors. One eats the rest."* |
| 4 | *"Family is what's left after life."* |
| 5 | *"Because of that…"* |
| 6 | *"Different floors."* |

### Visual treatment

- Caption is `--fs-micro` 500, italic, `--text-on-light-muted`.
- Smooth crossfade between beats (200ms each).
- **Beats 4 and 5** use `--text-on-light` (slightly emphasised) — they mark the reveal and resolution.
- Beats 5 and 6 may share the screen briefly during outbound thread → output landing — feels like a single thought completing.

---

## 9. Section copy (every word)

```
Heading        What would Finwy say about you?

Sub            Watch how it reasons. Then plug in your data.

[Progress]     Pair 1 of 3 — Risk
               Pair 2 of 3 — Goal
               Pair 3 of 3 — Family

[Pair 1]
Trigger Riya   Opened Finwy after a colleague's heart attack at 38.
Trigger Aman   Opened Finwy after his crypto-friend's third disaster.
Tagline        Same surplus. Opposite portfolios.
Credibility    Six factors here. Finwy reads thirty-plus inside the app.

[Pair 2]
Trigger Arjun  Opened Finwy after a builder's sales-pitch dinner.
Trigger Suresh Opened Finwy after the salary hike that didn't feel like one.
Tagline        The math depends on what you have, not what you want.

[Prediction]   Now meet two ₹1.6L payslips. Predict the divergence?

[Pair 3]
Trigger Vivek  Opened Finwy after his daughter's third birthday.
Trigger Karan  Opened Finwy after his father's second dialysis bill.
Tagline        Same payslip. Different floor.

Closer         Three pairs. Six 35-year-olds. Six verdicts.
               Yours will be different too — because the inputs
               are yours, not your category's.

CTA            See your verdict →

Footnote       Illustrative cases. Names changed; details composed.
               Your data drives your verdict, not these.

Captions       (see §8 — six-beat narrator per pair)
```

Total prose: ~150 words across the section. Still tight. The visual carries the rest.

---

## 10. Color tokens (existing, reused)

- `--mint` — primary positive / verdict / "yours"
- `--teal` — secondary positive / contrast / "twin"
- `--rose` — negative / loss (Karan's deduction)
- `--gold` — accent / "FD" colour in input cards
- `--navy`, `--text-on-light`, `--text-on-light-muted` — text
- `--mint-08`, `--mint-16`, `--mint-32` — halo and badge fills
- `--rose-05` — Karan's deduction fill

No new tokens needed. Section honours the existing brand system.

---

## 11. Accessibility

### ARIA

- Each pair-stage: `<section role="region" aria-labelledby="pair-{n}-label">` with the tagline as the label.
- Input cards: `<article aria-label="Input data for {name}">`.
- Output cards: `<article role="note" aria-live="polite">`.
- Finwy stage: `<div role="img" aria-label="Finwy considering six factors: age, surplus, portfolio, goals, risk, family">`.
- Caption: `<p aria-live="polite">` so screen readers announce the consideration phase.

### Reduced motion

If `prefers-reduced-motion: reduce`:
- All threads draw instantly.
- No pulse comets.
- No factor-badge sequence — all six light up at once and stay lit.
- Finwy still sits in the middle, halo at full opacity.
- Caption shows final state directly: *"verdict ready."*
- Output cards appear immediately.

The argument structurally still works for reduced-motion users — they see the inputs, Finwy, and outputs simultaneously.

### Keyboard

- Tab order: input cards → Finwy stage (focusable for screen reader description) → output cards → tagline.
- No keyboard interaction needed beyond reading.
- The section is read-only.

---

## 12. Mobile

Single column flow. Stack order:
1. Pair label (small caps centred)
2. Riya input card
3. Aman input card
4. Finwy stage (full width)
5. Riya verdict card
6. Aman verdict card
7. Tagline

Threads adapt to vertical curves. Factor badges arrange in a 2×3 grid around Finwy. Total mobile pair height: ~720 px on a 390 px-wide viewport.

The pacing (slow → medium → fast) stays the same; mobile readers experience the same tempo.

---

## 13. Compliance

- Footnote (always visible): *"Illustrative cases. Names changed; details composed. Your data drives your verdict, not these."*
- No claim that this section is advisory output — it's a marketing illustration of Finwy's reasoning.
- Karan's case touches a sensitive topic (medical dependence). Treat with restraint — no melodrama, just data.

---

## 14. Build phases

**Phase 1 — Static skeleton.**
Three pair-stages laid out, no animation. Hard-coded values, threads as static SVG paths. `cases-preview-v4-p1.html`. Goal: lock the visual.

**Phase 2 — Input/output reveals.**
Add stagger animations on cards entering. Add thread draw + comet travel. Skip Finwy's consideration animation. Pacing shells in place. `cases-preview-v4-p2.html`.

**Phase 3 — Finwy's consideration.**
Build the six factor badges. Sequence the scan. Add caption text. Make this beat work in isolation before integrating with rest. `cases-preview-v4-p3.html`.

**Phase 4 — Pair-pacing differentiation.**
Tune slow → medium → fast across the three pairs. Tighten transitions. Add the Karan strikethrough as a special case in Pair 3.

**Phase 5 — Polish.**
Mobile responsive. Reduced-motion fallback. Accessibility audit. CTA lands cleanly. Mascot wave at section close (carry over from v3).

Each phase ships as its own preview file, comparable side-by-side with v1/v2/v3.

---

## 15. File outputs

- `cases-preview-v4.html` — final preview file with all phases
- (intermediate phase files optional)
- Once approved, the markup, styles, and JS get ported into `index-staging.html` replacing the existing §7 block (lines 1237–1313 CSS, 3320–3360 markup, 4415–4470 JS).

---

## 16. Decisions log (after panel review)

Decisions confirmed by the storytelling panel are marked **decided**; remaining are still open.

1. **Caption — generic status or six-beat narrator?** *Decided (Stanton + McKee + Cron):* six-beat narrator. Each pair has six ~3-word captions matching its animation phases. See §8.
2. **Decisive badge stays lit after scan?** *Decided:* yes. Reinforces "this is what tipped it" — supports the caption's reveal beat.
3. **Auto-play on viewport entry, or a play button?** *Decided:* auto on viewport entry. Marketing pages don't get play-clicks; they demonstrate.
4. **Karan's strikethrough — when does it animate?** *Decided:* during input populate, with a deliberate 750ms strike-line draw even within Pair 3's fast tempo. Controlled deceleration on the section's STAR moment (Duarte).
5. **Total section height (desktop)** — three pairs + framing + closer = ~2000 px. Acceptable. No mini-pager needed; linear scroll is the right experience.
6. **Finwy idle vs active state.** Same mascot asset as §5/§6. Idle = grayscale-tinted, ~64px. Active = full colour, ~80px with halo. No expression change needed.
7. **Sound?** *Decided:* silent. No audio — accessibility risk and would need a permission gesture.
8. **Verdict-card populate order — natural or surprise-first?** *Decided (Cron):* surprise-first for **Pair 1 only**. Riya's "stop equity" verdict — the counter-intuitive one — populates BEFORE Aman's. Pairs 2 and 3 use natural order to avoid formula.
9. **Pair input populate — left-to-right or top-to-bottom?** *Decided:* top-to-bottom. Stronger signal that the two are stacked alternatives, not sequential characters.
10. **Trigger lines on input cards** — *Decided (Simmons):* keep. One italic line per card with the why-I-came moment. Adds humanity without bulk.
11. **Section progress indicator (Pair X of 3)** — *Decided (Duarte):* yes. Three labelled dots above each pair (or sticky at section top — see #15 below). Fills mint as reader advances. Cumulative-depth signal.
12. **Prediction beat between Pair 2 and Pair 3** — *Decided (McKee):* yes. ~800ms italic line *"Now meet two ₹1.6L payslips. Predict the divergence?"* Reader-agency moment. Karan's strikethrough lands harder when prediction confirms.
13. **Credibility note about scale** — *Decided (Heath):* yes, one-time below Pair 1's stage. *"Six factors here. Finwy reads thirty-plus inside the app."* Establishes ceiling and dodges cannibalisation.
14. **Heading rewrite** — *Decided (Miller):* *"What would Finwy say about you?"* (reader-centric). Sub: *"Watch how it reasons. Then plug in your data."*
15. **Progress indicator placement — sticky-top, or per-pair inline?** *Open.* Sticky-top keeps it visible during scroll; per-pair-inline avoids chrome. *Recommend: per-pair inline (above each pair's stage). Cleaner; the indicator naturally enters view with each pair.*
16. **Pair 2 & 3 verdict order** — *Decided:* natural order (Arjun then Suresh; Vivek then Karan). Surprise-first reserved for Pair 1 only.

---

## Closing

This is the most ambitious §7 yet — and the one that best honors the page's existing visual grammar. v3 used type-as-data; v4 uses **Finwy-as-reasoner**. The reader doesn't just see the divergence; they see the *reasoning that produced it*. That's the only marketing page in Indian fintech that demonstrates how its engine thinks, in real time, on a sample case.

Once you bless this spec, I'll start with Phase 1 — static skeleton — so we can lock the visual before adding the choreography. Each phase ships as a standalone preview for review.
