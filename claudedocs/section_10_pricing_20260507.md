---
section: 10 — Pricing
audience: Users only (salaried Indian middle class, 25–45)
background: --white
generated: 2026-05-07
---

# Section 10 — Pricing

## 1. Spec

The transparent moment. Single tier. ₹199/month, fee-only, no commissions. Bright white background to feel honest and uncluttered. One centered card (max-width 480px) with price, included list, and a "what's not in the price" callout that directly addresses the unspoken worry: *"is this another app that earns from selling me products?"*

- Section padding: 100px vertical desktop, 64px mobile.
- Card: white, 1px low-opacity teal border, 16px radius, 36px padding, subtle inset mint glow.
- Animations: card fade + 12px rise, price scale 0.96→1, check items 80ms stagger; reduced-motion all visible immediately.

## 2. Copy

**Heading (primary):** ₹199 a month. That's it.
**Alt A:** One price. No commissions. No catch.
**Alt B:** ₹199 a month. The whole thing.

**Sub-line:** Fee-only advice. Cancel any time. Your subscription is the only thing Finwiser earns from.

**Card price:** ₹199 / month
**Below price:** Per family. All inclusive. Cancel any time.

**Included (5 lines, mint check):**
- See every account in one place
- Daily-updated financial picture
- Fee-only, SEBI RIA-licensed advice
- Goal planning + dynamic recalibration
- Always-on Finwy AI advisor

**What's not in the price (3 lines, muted):**
- Finwiser does not earn from selling you mutual funds, insurance, or any product.
- No commissions. Ever.
- Your fee is the only revenue.

**CTA:** Try the demo →  →  /demo-app
**Microcopy:** Free during private beta. Pricing kicks in when the app moves to public release. Cancel before that — no charge.

## 3. HTML scaffold

```html
<section id="pricing" class="pricing" aria-labelledby="pricing-heading">
  <div class="pricing__inner">
    <header class="pricing__head">
      <h2 id="pricing-heading" class="pricing__heading">&#8377;199 a month. That&rsquo;s it.</h2>
      <p class="pricing__sub">Fee-only advice. Cancel any time. Your subscription is the only thing Finwiser earns from.</p>
    </header>

    <article class="pricing__card" data-reveal>
      <p class="pricing__price"><span class="mono">&#8377;199</span> <span class="pricing__per">/ month</span></p>
      <p class="pricing__price-meta">Per family. All inclusive. Cancel any time.</p>

      <hr class="pricing__div" aria-hidden="true" />

      <ul class="pricing__list" role="list">
        <li><svg class="ico-check" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>See every account in one place</li>
        <li><svg class="ico-check" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Daily-updated financial picture</li>
        <li><svg class="ico-check" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Fee-only, SEBI RIA-licensed advice</li>
        <li><svg class="ico-check" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Goal planning + dynamic recalibration</li>
        <li><svg class="ico-check" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>Always-on Finwy AI advisor</li>
      </ul>

      <hr class="pricing__div" aria-hidden="true" />

      <div class="pricing__not">
        <p class="pricing__not-label">What&rsquo;s not in the price</p>
        <ul role="list">
          <li><span class="dot" aria-hidden="true"></span>Finwiser does not earn from selling you mutual funds, insurance, or any product.</li>
          <li><span class="dot" aria-hidden="true"></span>No commissions. Ever.</li>
          <li><span class="dot" aria-hidden="true"></span>Your fee is the only revenue.</li>
        </ul>
      </div>

      <a class="pricing__cta" href="/demo-app">Try the demo <span aria-hidden="true">&rarr;</span></a>
    </article>

    <p class="pricing__micro">Free during private beta. Pricing kicks in when the app moves to public release. Cancel before that &mdash; no charge.</p>
  </div>
</section>
```

## 4. CSS

```css
.pricing{background:var(--white);padding:100px 24px;color:var(--text-on-light)}
.pricing__inner{max-width:780px;margin:0 auto;text-align:center}
.pricing__heading{font:700 clamp(28px,4vw,44px)/1.15 Inter,sans-serif;color:var(--text-on-light);margin:0 0 12px}
.pricing__sub{font:400 16px/1.55 Inter,sans-serif;color:var(--text-on-light-muted);margin:0 auto 40px;max-width:560px}
.pricing__card{max-width:480px;margin:0 auto;background:var(--white);border:1px solid rgba(0,182,173,.22);border-radius:16px;padding:36px;text-align:left;box-shadow:inset 0 0 0 1px rgba(53,214,198,.06),0 1px 2px rgba(0,45,86,.04);transition:transform .2s ease-out,box-shadow .2s ease-out}
@media(hover:hover){.pricing__card:hover{transform:translateY(-2px);box-shadow:inset 0 0 0 1px rgba(53,214,198,.10),0 8px 24px rgba(0,45,86,.08)}}
.pricing__price{font:800 clamp(48px,7vw,72px)/1 Inter,sans-serif;color:var(--navy);margin:0;letter-spacing:-.02em}
.mono{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-weight:800}
.pricing__per{font:600 18px/1 Inter,sans-serif;color:var(--text-on-light-muted);letter-spacing:0}
.pricing__price-meta{font:400 14px/1.5 Inter,sans-serif;color:var(--text-on-light-muted);margin:8px 0 0}
.pricing__div{border:0;border-top:1px solid rgba(0,45,86,.08);margin:24px 0}
.pricing__list{list-style:none;padding:0;margin:0;display:grid;gap:12px}
.pricing__list li{display:flex;gap:10px;align-items:flex-start;font:500 15px/1.45 Inter,sans-serif;color:var(--text-on-light)}
.ico-check{flex:0 0 16px;width:16px;height:16px;color:var(--mint);margin-top:3px}
.pricing__not-label{font:600 13px/1 Inter,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:var(--text-on-light-muted);margin:0 0 10px}
.pricing__not ul{list-style:none;padding:0;margin:0;display:grid;gap:8px}
.pricing__not li{display:flex;gap:10px;align-items:flex-start;font:400 14px/1.5 Inter,sans-serif;color:var(--text-on-light-muted)}
.pricing__not .dot{flex:0 0 6px;width:6px;height:6px;border-radius:50%;background:var(--text-on-light-muted);opacity:.55;margin-top:8px}
.pricing__cta{display:inline-flex;align-items:center;justify-content:center;gap:8px;width:100%;margin-top:24px;padding:14px 20px;background:var(--navy);color:var(--white);border-radius:10px;font:600 15px/1 Inter,sans-serif;text-decoration:none;transition:transform .2s ease-out,background .2s ease-out}
.pricing__cta:hover{background:var(--navy-deep);transform:scale(1.01)}
.pricing__cta:focus-visible{outline:2px solid var(--mint);outline-offset:3px}
.pricing__micro{font:400 14px/1.55 Inter,sans-serif;color:var(--text-on-light-muted);margin:24px auto 0;max-width:520px}
@media(max-width:640px){.pricing{padding:64px 20px}.pricing__card{padding:28px}}
```

## 5. Animation

```css
[data-reveal]{opacity:0;transform:translateY(12px);transition:opacity .4s cubic-bezier(0.16,1,0.3,1),transform .4s cubic-bezier(0.16,1,0.3,1)}
[data-reveal].is-in{opacity:1;transform:none}
[data-reveal].is-in .pricing__price{animation:priceIn .4s cubic-bezier(0.16,1,0.3,1) .1s both}
[data-reveal].is-in .pricing__list li{opacity:0;animation:itemIn .4s cubic-bezier(0.16,1,0.3,1) forwards}
[data-reveal].is-in .pricing__list li:nth-child(1){animation-delay:.55s}
[data-reveal].is-in .pricing__list li:nth-child(2){animation-delay:.63s}
[data-reveal].is-in .pricing__list li:nth-child(3){animation-delay:.71s}
[data-reveal].is-in .pricing__list li:nth-child(4){animation-delay:.79s}
[data-reveal].is-in .pricing__list li:nth-child(5){animation-delay:.87s}
@keyframes priceIn{from{transform:scale(.96)}to{transform:scale(1)}}
@keyframes itemIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){[data-reveal],[data-reveal] *{opacity:1!important;transform:none!important;animation:none!important;transition:none!important}}
```

```js
// Shared IO; threshold 0.4
const io=new IntersectionObserver((es)=>es.forEach(e=>e.isIntersecting&&(e.target.classList.add('is-in'),io.unobserve(e.target))),{threshold:.4});
document.querySelectorAll('.pricing [data-reveal]').forEach(el=>io.observe(el));
```

## 6. Accessibility

- `<section aria-labelledby="pricing-heading">`; single h2.
- Card is a `<article>` (styled div semantics), not interactive; the only interactive element is the `<a>` CTA with visible `:focus-visible` ring (mint, 2px, 3px offset).
- All check + dot icons `aria-hidden="true"` and `focusable="false"`.
- "What's not in the price" is real text — readable by SR; not a background image.
- Contrast on white: navy `#002d56` 14.4:1, muted `#5a6b7d` 4.7:1, mint check 3.0:1 (decorative, AA-OK as non-text). Navy CTA bg vs white text 14.4:1.
- `prefers-reduced-motion: reduce` → all content visible, no transforms/animations.
- Logical tab order: heading region → CTA → next section. No keyboard traps.
- ₹ symbol kept in Inter for the heading; the card price uses `ui-monospace` for the numeral so the figure feels precise.

## 7. Iconography

- **Check (×5):** 16×16 SVG, `--mint` stroke 1.5px, rounded line caps/joins, single path `M3 8.5l3 3 7-7`. Inline SVG, `aria-hidden="true"`.
- **"Not in price" bullet:** muted dot — 6×6 circle, `--text-on-light-muted` at 0.55 opacity. Chosen over a cross icon to avoid an aggressive negation tone; the copy carries the message, the dot is a quiet bullet.
- No third-party icon font; ~120 bytes total per check, ~40 bytes per dot.

---

**Word count:** ~580.
**File:** `/Volumes/FinwiserDev/finwiser-projects/finwiser-website/claudedocs/section_10_pricing_20260507.md`
