---
section: 6 — How It Works (Step 03 only)
status: HISTORICAL — superseded by the cascade-allocator implementation in `index.html` and `section_06_how_it_works_stepper.md` § 7
audience: salaried Indian middle class, 25–45, post-Step-02 (they've just seen ₹41,300/mo surplus reveal)
voice: institutional ("Finwiser…")
generated: 2026-05-08
implementation merged: 2026-05-08
---

# Step 03 — Concept Exploration *(historical)*

> **What shipped is none of these four.** After two more storytelling-panel rounds and several founder-driven pivots, the section landed on a **two-act cascade allocator** — see *"What was actually built"* at the end of this doc, and the canonical spec in `section_06_how_it_works_stepper.md` § 7 (Step 03 block).
>
> This doc is preserved as the reasoning trail: how we got from a generic four-row dashboard, through an arc, to the cascade with floating Balance counter and visible infeasibility. Useful if a future iteration wants to revisit one of the abandoned directions.

The original Step 03 was a stub (mascot + 3 static icons). This doc captures four drastic alternatives, surfaces the storytelling-panel debate that produced them, and recommends a path forward.

The locked copy doesn't change in any of these:

- H3: *"We tell you where every rupee should go."*
- Body: *"Goals get ranked — emergency, retirement, education, lifestyle. Surplus gets allocated where it matters most. As your income, spending, or the markets move, the plan recalibrates automatically."*
- Tags: *Next Best Rupee™ · Goal feasibility · Dynamic rebalancing*

What changes is **what's inside the concept block** under that copy.

---

## Why the dashboard draft fell short

A four-row goal-allocator with priority pills, feasibility bars, and a recalibration banner. Competent. Also generic.

The panel's collective verdict, synthesised:

- **Red-ocean execution.** Every Indian fintech (Groww, ET Money, Cube, Scripbox, Jar, INDmoney) shows some version of a goal-tracker dashboard. A better one is still inside the same competitive frame.
- **Cognitive load.** ~21 independent data points (4 labels × 4 amounts × 4 bars × 4 captions + header + banner) in a section that gets ~7 seconds of attention.
- **Inverted system.** The product is *a controller* (continuous recalibration). The dashboard frames it as *a document* (a static plan with a rare update). The recalibration banner is the most remarkable thing on screen and it's a footnote.
- **Wrong protagonist.** The rupee is in the lead role. The reader's *life* should be.

---

## Concept A — The 30-Year Arc *(recommended lead)*

**Thesis.** Change the time horizon from one month to thirty years. Drop Finwy. Drop the four-row table. Show the reader something they have never seen on any fintech homepage in India: their own life, on one screen, bending when their income does.

**The one feeling.** *"That's me. That's the next thirty years of me."*

**The climactic beat.** At ~t=5s, a small marker drops on the arc at age 45 — *"Salary +₹4,500."* The retirement band visibly steepens from that point onward. The right-edge net-worth number ticks from **₹4.3 Cr → ₹4.6 Cr** in one live increment. That single visible kink is the "recalibrates automatically" promise made structural — not described, demonstrated.

### Layout

```
┌──── Allocating ₹41,300/mo                  Live · ranked daily ────┐
│                                                                     │
│  Net worth                                                ₹4.6 Cr  │
│         ╱──────────────────────  ← retirement (dominant band)      │
│       ╱                                                             │
│     ╱  ◢ ╲    ←── education (rises ~40, peaks ~50, drops ~58)      │
│   ╱      ╲╱                                                         │
│  ─────────────────────────────────  ← lifestyle (thin steady band) │
│  ▬                                                                  │
│  └ emergency (fills age 32–33, stays flat)                         │
│                                                                     │
│  Age 32 ─── 38 ─── 45 ─── 52 ─── 58 ─── 62                        │
│                    ▲                                                │
│              Salary +₹4,500 (t=5s — kink visible)                  │
│                                                                     │
│  Your plan, the next 30 years. It moves when you do.               │
│                                                                     │
│  Next Best Rupee™ · Goal feasibility · Dynamic rebalancing         │
└─────────────────────────────────────────────────────────────────────┘
```

### What's on screen

- **Title row**: small caption *Allocating ₹41,300/mo · Live · ranked daily* — same pulsing dot as Steps 01/02 for visual rhyme.
- **The arc**: a wide SVG, ~100px tall on desktop. Four stacked translucent bands, each one a goal's projected value over time. Mint primary band (retirement, dominant). Teal secondary band (education, peaks mid-life). A hairline mint band hugging the bottom (emergency, flat). A thin teal-muted ribbon throughout (lifestyle).
- **Right edge**: a single bold number — net worth at age 62, the only number in the visualisation. Mint, mono, tabular. *₹4.3 Cr → ₹4.6 Cr* during the recalibration beat.
- **Y-axis**: deliberately absent. The reader doesn't need axis labels — the bands and the terminal number carry the meaning.
- **X-axis**: thin, with sparse age markers (32, 38, 45, 52, 58, 62) — five anchors, not twelve.
- **The marker**: small mint dot with a thin vertical guideline at age 45, label *Salary +₹4,500* in 11px italic Lora. Drops at t=5s.
- **The sentence**: *"Your plan, the next 30 years. It moves when you do."* in 14px Inter, muted-on-dark, single line.
- **The tags** (Next Best Rupee™ etc) sit below as the existing chip row.

### Animation choreography (~8s total)

1. **t=0–0.6s** — Card fades in (200ms), pulsing dot starts (matches §6.01/§6.02 visual rhyme), title and the sentence below the arc enter together.
2. **t=0.6–4.5s** — Arc draws left to right at steady linear pace (`stroke-dashoffset` on the four band paths drawing in sync, same timeline). Right-edge number animates from `₹—` to `₹4.3 Cr` arriving at t=4.5s.
3. **t=4.5–5.0s** — Settle pause. Arc complete, number resting at ₹4.3 Cr.
4. **t=5.0s — the beat.** Salary marker drops in at age-45 position (250ms ease-out, 8px translateY + opacity). 100ms after it lands, the retirement band's *post-age-45 segment* steepens (path `d` interpolates over 600ms cubic-bezier(0.16,1,0.3,1)). Right-edge number `animateNumber(4.3 → 4.6, 700ms)`. Final sentence holds.
5. **t=6.6s** — All motion stops. Arc + kink + new terminal number visible. State `.is-recalibrated` persists.

Reverse scroll: the kink stays. We never animate "back to ₹4.3 Cr" because the recalibration is the truth, not a temporary effect. (Per Meadows: the system *is* the post-recalibration state.)

### Reduced motion

Drop the arc animation. Render the final state immediately: arc complete, kink in place, number at ₹4.6 Cr, marker visible, sentence visible. The static composition still tells the whole story — the time axis, the bands, the kink, the terminal number — without any motion.

### Mobile (<720px)

The horizontal arc fails at narrow widths. Two options:

- **A1** — *Rotate the chart.* Arc becomes vertical, age axis runs top-to-bottom, bands run left-to-right, terminal number at the bottom. Functional but inverts the metaphor (life as a vertical column reads less natural than life as a horizon).
- **A2** — *Drop to Concept B (Godin's "The Decision").* Below 720px, swap to the single-card "Your next ₹41,300 goes here" panel. Same data-driven content, different metaphor. Recommended.

### Data model

Four time-series, age 32 → 62, one value per year. All values are rough projections (the exact maths is not the point — the *shape* of each band is).

| Goal | Initial | Trajectory | Age-62 value |
|---|---|---|---|
| Emergency | ₹0.5 L at 32 | Reaches ₹3 L by age 33, flat thereafter. | ₹3 L |
| Education | ₹0 at 32 | Sips ₹8K/mo. Compounds to ~₹15 L by age 50 (kid's college). Drops to ~₹2 L by 58. | ₹2 L |
| Retirement | ₹0 at 32 | Sips ₹14,300/mo, 11% real return. Reaches ~₹3.4 Cr by 60. **After kink at 45, sips become ₹16,300/mo → ~₹3.7 Cr by 62.** | ₹3.7 Cr |
| Lifestyle | flat ribbon | Discretionary slack, treated as a steady ~₹1 L float. | ~₹1 L |

Sum at 62 (initial): ~3.4 + 0.15 + 0.03 + 0.01 = **~₹4.3 Cr**.
Sum at 62 (after recalibration kink): ~3.7 + 0.15 + 0.03 + 0.01 = **~₹4.6 Cr**.

The sums are illustrative. The headline number rounds. We don't show ratios that don't add up.

### What makes this drastic

It changes:

- **The protagonist** — from rupee → life
- **The time horizon** — from this month → thirty years
- **The metaphor** — from dashboard → arc
- **The mascot** — from present → absent
- **The recalibration** — from banner-as-event → kink-in-the-line-as-evidence

This is the only concept the panel agreed a salaried 32-year-old might *screenshot and send to a friend.* That was Godin's tiebreaker.

---

## Concept B — "Your next ₹41,300 goes here." *(strong mobile fallback)*

**Thesis.** Withhold information. Show ONE goal, not four. The "Next Best Rupee™" tag stops being marketing copy and becomes the literal product behaviour: we tell you the next decision, not all four at once.

**The one feeling.** *"I don't have to figure this out anymore."*

### Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│         Your next ₹41,300 goes here.                                │
│                                                                     │
│         ┌──────────────────────────────────────┐                    │
│         │  [shield] Emergency fund             │                    │
│         │  4.2 → 6 months · ₹15,000           │                    │
│         └──────────────────────────────────────┘                    │
│                                                                     │
│         Three more after this.                                      │
│         We'll tell you each one as it comes.                        │
│                                                                     │
│  Next Best Rupee™ · Goal feasibility · Dynamic rebalancing         │
└─────────────────────────────────────────────────────────────────────┘
```

### Animation (~6s)

1. **t=0–0.4s** — Headline fades in.
2. **t=0.6–1.4s** — Single emergency-fund card slides up from below with a soft settle (translateY 16px → 0, 800ms cubic-bezier(0.16,1,0.3,1)).
3. **t=2.0–2.4s** — Subtitle below fades in.
4. **t=4.5s** — Optional micro-beat: a faint *"checking back tomorrow"* dot pulses at the bottom of the card.

No four-row table. No bars. No mascot in the panel. Finwy may stay as a tiny watcher at the corner — or be dropped (Godin conceded the mascot drop).

### Why it works

- Kills the cognitive load problem (3 numbers on screen, not 21).
- Lands the emotional payoff: someone has taken the steering wheel.
- Survives at 320px without modification.

### Why it doesn't lead

Meadows's pushback held: it hides the proof of comprehensiveness. The reader who is sophisticated enough to be the customer asks *"what about the other three?"* and the panel has no answer.

It is, however, the strongest mobile/reduced-motion fallback because it works *without* the chart that the lead concept depends on.

---

## Concept C — One Sentence, Then Proof *(typography-only)*

**Thesis.** No chart, no bars, no icons. Typography is the visualisation. Words and numbers outperform charts at this size and duration for a numerate audience.

**The one feeling.** *Resolve. Tension to chord.*

### Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ₹15,000 emergency.                                                 │
│  ₹14,300 retirement.                                                │
│  ₹8,000  education.                                                 │
│  ₹4,000  lifestyle.                                                 │
│                                                                     │
│  Ranked, allocated, and adjusted as your life moves.                │
│                                                                     │
│  ─────────────────────────────────────────────────────              │
│  Salary +₹4,500 last month — retirement now ₹14,300, was ₹12,800.   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Animation (~5s)

- **t=0–0.6s** — Four-line block fades in as a single unit. The rupee tokens are highlighted (mint, bold, mono).
- **t=0.6–4.0s** — Hold. Reader actually reads.
- **t=4.0s** — Thin separator slides up from below; recalibration line appears.
- **t=4.5s** — The retirement number in the original block animates in place from `₹12,800` → `₹14,300`. The original sentence updates itself.

### Why it works

- Lowest cognitive load of the four concepts.
- Rejects visualisation entirely — a defensible move for an institutional brand voice.
- Builds the recalibration moment into the prose itself: the sentence the reader just read updates.

### Why it doesn't lead

Kim & Mauborgne's pushback held: forgettable clarity loses to memorable ambition on a homepage. The reader will understand it perfectly and not remember it ten minutes later. Homepage's job is to be remembered until they open the app.

This concept is the strongest **`prefers-reduced-motion` fallback** because it carries the full message in pure text.

---

## Concept D — The Living Plan *(deferred — wrong place)*

**Thesis.** The product is a controller; show it controlling. Four horizontal flow-streams running continuously, with system events firing as small blips that visibly perturb and re-stabilise the streams.

### Sketch

Four horizontal streams running L→R, each carrying small rupee tokens flowing into a goal-pool on the right. Widths proportional to allocation. The streams never stop animating — this is the steady state.

Three system events fire over 7s:

1. **t=1s** — *Salary +₹4,500* enters from off-card top-left. Retirement stream thickens.
2. **t=3.5s** — *Nifty −2.1%* hits the retirement pool. Pool drops; stream auto-thickens to compensate.
3. **t=6s** — *Diwali spend +₹18K* hits lifestyle stream. Stream narrows; emergency briefly widens to absorb shock.

Bottom caption: *"Plan recalculates ~40 times a month. You don't have to."*

### Why we're not building this here

Godin's screensaver critique landed. Continuous ambient motion on a homepage reads as wallpaper — viewers watch it the way they'd watch an aquarium and scroll. The concept is structurally correct for the *product's interior dashboard* (post-signup home screen), where dwell time and ambient motion are appropriate. **Park this concept for the app, not the homepage.**

---

## The debate, distilled

| Round | Push | Counter |
|---|---|---|
| Godin → Meadows | Living-plan = screensaver. Need a stop, not motion. | Meadows: but a stop is what the dashboard already is — and it failed. |
| Meadows → Godin | Single-card hides comprehensiveness. Sophisticated reader asks "what about the others?" | Godin (later): conceded. Repositioned as mobile fallback. |
| Doumont → K&M | 30-year arc is unreadable on mobile in 8s. Six simultaneous readings. | K&M: solve mobile with rotation or fallback, don't retreat to typography. |
| K&M → Doumont | Forgettable clarity loses to memorable ambition. Homepage's job is to be remembered. | Doumont (preserved): correct for `prefers-reduced-motion` and for accessibility. |
| Godin → K&M | Concede. The arc is the only concept a viewer would screenshot and send. | — |
| Meadows → Doumont | Sentence is the right *static layer* under the arc, not a competing concept. | Agreed — sentence sits below the arc as the anchoring caption. |

**What survives:** the arc as lead, with Doumont's sentence as the caption beneath it, Godin's single-card as the mobile fallback, Doumont's full-typography panel as the reduced-motion fallback, and Meadows's living-plan as a future product screen.

---

## Recommendation

**Build Concept A (the arc).** The other three concepts become its variants:

| Variant | When |
|---|---|
| Arc | Default. Desktop, tablet, motion-OK, ≥720px wide. |
| Concept B (single card) | <720px (mobile). |
| Concept C (typography) | `prefers-reduced-motion: reduce`. Both desktop and mobile. |
| Concept D (living plan) | Not in homepage. Future internal app screen. |

Finwy is dropped from this panel entirely. Steps 01 and 02 are Finwy's. Step 03 is the user's life.

---

## Open questions before build

1. **Net-worth number realism.** ₹4.3 Cr at 62 from the SIP profile in this section is rough. Do you want me to (a) leave the number as illustrative-but-plausible, (b) tighten it with your real assumptions, or (c) drop the number and end the arc with a non-numeric "ready to retire" callout?

2. **The salary-bump amount.** ₹4,500/mo creates a clean, visible kink. Would you prefer a different recalibration trigger? Options the panel raised:
   - "Salary +₹4,500" (positive, clean — current default)
   - "Nifty −2.1%" (market shock — shows defensive recalibration)
   - "New car EMI ₹6,500" (negative, realistic — but kink goes the wrong way)
   - "Bonus ₹1L received" (one-shot vs. monthly — cleaner story but rarer event)

3. **Y-axis labels.** The lead concept omits them. If you want them, where: left edge ticks, or a single "₹0 — ₹4.6 Cr" range note? My instinct says omit; the right-edge terminal number does the work.

4. **Mobile fallback choice.** Concept B (single card) or A1 (rotated arc)? My recommendation is B — different metaphor on mobile is fine because mobile readers won't see the desktop version side-by-side. A1 is buildable but inverts the horizon metaphor.

5. **Do we keep the small "Allocating ₹41,300/mo" header**? It echoes Steps 01/02's header pattern (mint pulsing dot + monospace count) and ties Step 03 to the same family. The arc also works without it — would be cleaner — but loses the visual rhyme.

6. **Tags row** (`Next Best Rupee™ · Goal feasibility · Dynamic rebalancing`) — keep, drop, or move under the arc as small labels?

---

## What was actually built *(decisive section — read this if you want the truth on the ground)*

None of the four concepts above shipped. Two further panel rounds and several founder corrections produced a **fifth direction** that combines the strongest critiques from each round:

**Concept E — Two-act cascade allocator with floating Balance.**

- **Act 1 (sources collapse).** Five chips — `Random YouTubers · Random influencers · Cousin's WhatsApp · Office hot tips · Bank RM (commission-driven)` — fade in, then dissolve right into a small Finwy mark. A centered replacement line emerges: ***"No** random tips. **No** random influencers. **No** commission-driven advice."* (each *No* in mint bold). Replaces the "five things you currently ask" workflow without the originally-tried "→ One source. Fee-only. SEBI-registered." resolution line, which the founder rejected as awkward.
- **Act 2 (cascade table with floating balance).** Top banner with two cells: **Surplus** (left, static `₹41,300/mo`) and **Balance** (right, dynamic — counts down as each row allocates). Below: a five-column cascade — `Pri / Goal / Fund / Required / Allocated` — with six goals (4 funded P0/P0/P1/P2, 2 deferred P3/P3). Each row reveals top-down; Allocated counts up, Balance counts down simultaneously over 420 ms. When Balance hits ₹0 at the Wedding row, the floating counter mint-pulses and a hairline cutoff line draws between the funded and deferred rows. Deferred rows show their Required (₹6,000 / ₹8,000) but the Allocated cell renders **Not feasible** (gold), and the Fund column shows the deferral instruction (*"Push 18 months"* / *"Push 3 years"*) in italic Lora.
- **Closing caption.** *"Fits your goals. Fits your priorities."* — italic Lora mint, centered, divider above, 14 px padding.

**Why this beat the four originals:**

| Concept | Why it didn't ship |
|---|---|
| A — 30-Year Arc | Body copy promised "where every rupee should go" (a *this-month* allocation question); arc answered "what does my life look like in 30 years" (a *life-trajectory* question). They rhymed but didn't speak to each other. The founder caught this. |
| B — Single decision card | Hid three of four goals; sophisticated readers ask "what about the others?" — Meadows's pushback held in subsequent panels. |
| C — Typography only | Forgettable on a homepage; Kim & Mauborgne's "memorability over clarity" critique held. |
| D — Living Plan streams | Reads as wallpaper / aquarium on a homepage. Right concept for the *post-signup app dashboard*, wrong place here. |

**The decisive insight from the panel rounds 2 and 3:**

- The original premise ("we rank goals: emergency > retirement > education > lifestyle") was **wrong**. The plan is bespoke — *"different goals, different number, different next rupee"* (the founder's words) — and the section had to prove that.
- *Showing infeasibility is the blue ocean*. Every other Indian fintech competes on "more goals fundable, more optimism." Saying *"the bike doesn't fit"* is a move no incumbent can copy because their commission models forbid it. (Kim & Mauborgne, panel round 3.)
- *Truth-telling under constraint* became the section's actual claim, replacing the original "we tell you where every rupee should go" framing. The H3 evolved to *"Some of your goals don't fit. We tell you which."*
- *Lifestyle isn't a goal* — it's residual current consumption. The two P3 goals (Bike + Foreign trip) collectively represent lifestyle and are deferred when surplus runs out.

**Trilogy verbs:** Step 01 *see* → Step 02 *notice* → Step 03 *choose*.

---

## Files & where to find the canonical spec

- **Canonical spec (current):** `claudedocs/section_06_how_it_works_stepper.md` § 7 — *Step 03 — Cascade allocator with floating balance*. That's the as-shipped truth.
- **Implementation:** `index.html` — `.steps__concept--allocate` block (HTML), §6.03 CSS block, §6.03 JS block in the script IIFE.
- **Standalone preview:** `step03-preview.html` — kept at the project root as an iteration sandbox; works without the rest of the site. Final state mirrors the index.html implementation but adds a Replay button and View-mobile toggle.
- **This doc:** `claudedocs/section_06_step_03_concepts.md` — historical concept-exploration trail.
- **Sibling specs:** `section_06_how_it_works_stepper.md` (parent stepper), `section_05_what_finwy_sees.md`, `section_04_the_problem_20260507.md`.

*Concept exploration ends. ~2700 words including the post-build addendum.*
