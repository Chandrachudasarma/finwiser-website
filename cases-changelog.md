# §7 Cases — version changelog

A log of how the §7 redesign progressed from the original tile-and-bubble pattern to the final glide-track design.

| File | What it explored | Why moved on |
|---|---|---|
| `cases-preview.html` (v1) | Sherlock-style case-file pairs, three pairs side-by-side | Too dense; hidden content behind chip switcher; readers wouldn't engage with all three |
| `cases-preview-v2.html` | Carousel + diff-glow + visual divergence strip per pair | Threads disconnected; chip switcher hid 2/3 content; still text-heavy |
| `cases-preview-v3.html` | Typographic / editorial — type-as-data, massive numbers, no cards | Ambition piece; very clean but lost the "Finwy reasoning" story |
| `cases-preview-v4-p1.html` | Phase 1: static skeleton — orbital hex Finwy with 6 factor badges around | Locked visual hierarchy |
| `cases-preview-v4-p2.html` | Phase 2: choreography — staggered card reveals, thread draw, factor scan, six-beat caption narrator | Validated pacing slow→medium→fast |
| `cases-preview-v4-p3.html` | Phase 3: microinteractions — tick-complete on factors, anticipation wind-up, halo breathing | Saffer + Disney polish |
| `cases-preview-v4-p4.html` | Phase 4: a11y + perf — visually-hidden screen reader summaries, will-change hints, show-all button | Accessibility pass |
| `cases-preview-v4.html` | Phase 5: emotional polish — Finwy nod after each pair, verdict-land highlight | All-five-phase consolidation. v4 final. |
| `cases-preview-v5.html` | Restructured — heading-led pair, "What would Finwy say about you?", trigger lines on input cards, six-beat narrator beats refined | Reader-centric framing (Miller); panel critiques applied |
| `cases-preview-v6.html` | Hero verbs (STOP/START etc.), character-colour tint on inputs, dropped curved threads, Pair 2 reframed as "same portfolio, different goals", new closer copy "Finwy keeps watching" | Visual balance L↔R achieved |
| `cases-preview-v7.html` | **Current.** Vertical layout: input row → factor track → output row. Finwy walks linearly through 6 factors. Family→Priorities rename. JS-measured glider positioning. Disney arc per step. | Final design |

## Decisions worth remembering

- **Family → Priorities** — the badge renamed in v7 because "Family" is too narrow; the factor encompasses all priority-of-spending decisions (medical care for parents, kids' needs, lifestyle, etc.).
- **Hero verbs** — output cards carry a single bold verb (STOP, START, SHIFT, HOLD, EASE, PROTECT) to balance the visual weight of input hero numbers. Five experts converged on this: Tidwell, Krug, Heath, Walter, Tufte.
- **Threads dropped** — the v4 SVG curved threads connecting cards to Finwy never aligned to actual card positions. v7 dropped them entirely; the convergence/glide animation is the visual story of inflow and outflow.
- **Linear glide vs. orbital convergence** — v4 had factors flying in from outside Finwy's hex. v7 changed to a horizontal track Finwy walks through. Reader watches Finwy literally read each factor in sequence.
- **JS measurement-based glider position** — CSS `calc()` percentages didn't reliably align Finwy under each factor (issue: the .stage-track padding and glider's own width made the math brittle). v7 uses `getBoundingClientRect` to measure each factor and align Finwy precisely.
- **Per-pair pacing** — slow (700ms/factor), medium (450ms), fast (300ms). Decelerando→accelerando across the section. The reader learns the visual grammar in Pair 1; by Pair 3 they read fast. Karan's strikethrough deliberately holds for 1500ms even within the fast pair (Walter STAR moment).

## Closer copy (final)

> Six 35-year-olds. Six recommendations — and they keep changing.
> *Finwy keeps watching.*
> Get yours →

The "they keep changing" is load-bearing — names continuous recalibration as a product differentiator without claiming the engine itself changes.

## Open work for next session

1. **Port v7 into `index-staging.html`** — replace the existing §7 block:
   - CSS: lines ~1237–1313
   - Markup: lines ~3320–3360
   - JS: lines ~4415–4470
2. **Remove the python http.server background process** running on port 8765 (started during this session for Playwright testing).
3. **Test on real device + browser** — Playwright was good for layout verification but real-scroll feel matters.
4. **Optionally archive intermediate phase files** — `cases-preview-v4-p1` through `-p4` could be moved to a `legacy/` folder once v7 is ported.
