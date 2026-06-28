---
section: 12 — Security & Data
audience: users (salaried Indian middle class, 25–45)
background: --navy
voice: institutional ("Finwiser uses…")
---

# Section 12 — Security & Data

## 1. Spec

Trust section addressing the unspoken bank-data fear. Plain language, specific facts, four cards on `--navy`. Heading centred, sub-line muted, 2×2 card grid (1-col mobile), small Privacy Policy link below.

- Section padding: 110px desktop / 70px mobile
- Container max-width: 1100px
- Card: `--navy-deep` background, mint-tinted border, 28px padding, 14px radius
- Tone: factual, not legalese. Specific numbers (AES-256, TLS 1.3, 72 hours).

## 2. Copy

**Heading (chosen):** "Your data is yours. Here's what Finwiser sees, and what it never will."

**Alt heading variants:**
- A: "Built on bank-grade rails. Held to bank-grade standards."
- B: "Read-only access. Revocable any time. Encrypted end-to-end."

**Sub-line:** "Finwiser is built on the same encryption banks use, the consent rails the RBI built, and access you can switch off in seconds."

**Card 1 — Bank-grade encryption.**
All data — at rest and in transit — encrypted with AES-256 and TLS 1.3. The same standards your bank uses for online banking.

**Card 2 — Account Aggregator only. RBI-regulated.**
Finwiser doesn't ask for your bank password. It uses Account Aggregator — the consent-based, RBI-regulated rail. You authorise; we receive read-only data; no other path exists.

**Card 3 — Read-only access. Always.**
Finwiser can see your accounts. It cannot move money, place trades, or change anything. Even if Finwiser wanted to, the rails don't allow it.

**Card 4 — Revoke at any time.**
Withdraw consent in your Account Aggregator app. Finwiser loses access immediately. Your data is deleted from active systems within 72 hours.

**Footnote:** "More detail on what data we use, where it lives, and how long: read the [Privacy Policy](/privacy-policy.html)."

## 3. HTML scaffold

```html
<section class="sec-security" aria-labelledby="security-heading">
  <div class="sec-security__inner">
    <header class="sec-security__head">
      <h2 id="security-heading">Your data is yours. Here's what Finwiser sees, and what it never will.</h2>
      <p class="sec-security__sub">Finwiser is built on the same encryption banks use, the consent rails the RBI built, and access you can switch off in seconds.</p>
    </header>
    <div class="sec-security__grid" role="list">
      <article class="sec-card" role="listitem" style="--i:0">
        <span class="sec-card__icon" aria-hidden="true"><!-- icon-1 --></span>
        <h3>Bank-grade encryption.</h3>
        <p>All data — at rest and in transit — encrypted with AES-256 and TLS 1.3. The same standards your bank uses for online banking.</p>
      </article>
      <article class="sec-card" role="listitem" style="--i:1">
        <span class="sec-card__icon" aria-hidden="true"><!-- icon-2 --></span>
        <h3>Account Aggregator only. RBI-regulated.</h3>
        <p>Finwiser doesn't ask for your bank password. It uses Account Aggregator — the consent-based, RBI-regulated rail. You authorise; we receive read-only data; no other path exists.</p>
      </article>
      <article class="sec-card" role="listitem" style="--i:2">
        <span class="sec-card__icon" aria-hidden="true"><!-- icon-3 --></span>
        <h3>Read-only access. Always.</h3>
        <p>Finwiser can see your accounts. It cannot move money, place trades, or change anything. Even if Finwiser wanted to, the rails don't allow it.</p>
      </article>
      <article class="sec-card" role="listitem" style="--i:3">
        <span class="sec-card__icon" aria-hidden="true"><!-- icon-4 --></span>
        <h3>Revoke at any time.</h3>
        <p>Withdraw consent in your Account Aggregator app. Finwiser loses access immediately. Your data is deleted from active systems within 72 hours.</p>
      </article>
    </div>
    <p class="sec-security__note">More detail on what data we use, where it lives, and how long: read the <a href="/privacy-policy.html">Privacy Policy</a>.</p>
  </div>
</section>
```

## 4. CSS

```css
.sec-security{background:var(--navy);color:var(--text-on-dark);padding:110px 24px}
.sec-security__inner{max-width:1100px;margin:0 auto}
.sec-security__head{text-align:center;max-width:780px;margin:0 auto 56px}
.sec-security__head h2{font:700 clamp(28px,4vw,44px)/1.15 Inter,sans-serif;color:var(--text-on-dark);margin:0 0 16px;letter-spacing:-0.01em}
.sec-security__sub{font:400 17px/1.55 Inter,sans-serif;color:var(--text-on-dark-muted);margin:0}
.sec-security__grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.sec-card{background:var(--navy-deep);border:1px solid rgba(53,214,198,0.18);border-radius:14px;padding:28px;opacity:0;transform:translateY(8px);transition:opacity .3s cubic-bezier(0.16,1,0.3,1),transform .3s cubic-bezier(0.16,1,0.3,1);transition-delay:calc(var(--i) * 100ms)}
.sec-card.is-in{opacity:1;transform:none}
.sec-card__icon{display:inline-flex;width:32px;height:32px;margin-bottom:18px;color:var(--mint)}
.sec-card__icon svg{width:100%;height:100%;display:block}
.sec-card.is-pulse .sec-card__icon{animation:secPulse 200ms cubic-bezier(0.4,0,0.2,1)}
.sec-card h3{font:700 18px/1.35 Inter,sans-serif;color:var(--text-on-dark);margin:0 0 10px}
.sec-card p{font:400 15px/1.6 Inter,sans-serif;color:var(--text-on-dark-muted);margin:0}
.sec-security__note{margin:40px auto 0;text-align:center;font:400 14px/1.5 Inter,sans-serif;color:var(--text-on-dark-muted)}
.sec-security__note a{color:var(--mint);text-decoration:underline;text-underline-offset:3px}
.sec-security__note a:focus-visible,.sec-card a:focus-visible{outline:2px solid var(--mint);outline-offset:3px;border-radius:2px}
@keyframes secPulse{0%{transform:scale(1)}50%{transform:scale(1.1)}100%{transform:scale(1)}}
@media (max-width:760px){.sec-security{padding:70px 20px}.sec-security__grid{grid-template-columns:1fr}.sec-security__head{margin-bottom:40px}}
@media (prefers-reduced-motion:reduce){.sec-card{opacity:1;transform:none;transition:none}.sec-card.is-pulse .sec-card__icon{animation:none}}
```

## 5. Animation

```js
const secCards = document.querySelectorAll('.sec-security .sec-card');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduce && secCards.length) {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      secCards.forEach((c, i) => {
        setTimeout(() => {
          c.classList.add('is-in');
          setTimeout(() => c.classList.add('is-pulse'), 200);
        }, i * 100);
      });
      obs.disconnect();
    });
  }, { threshold: 0.3 });
  io.observe(document.querySelector('.sec-security'));
} else {
  secCards.forEach(c => c.classList.add('is-in'));
}
```

## 6. Accessibility

- `<section aria-labelledby="security-heading">`; single h2; cards as `<article>` with h3 inside.
- Icons `aria-hidden="true"`; meaning carried entirely by adjacent text.
- Privacy Policy is a real `<a href>` with `:focus-visible` mint outline (3px offset).
- Contrast on `--navy` (#002d56): white-94 body 14.6:1, white-74 muted 7.8:1, mint #35d6c6 link 8.1:1 — all pass AA.
- `prefers-reduced-motion: reduce`: cards visible instantly, no pulse, no transitions.
- `role="list"` / `role="listitem"` so SR announces "list of 4 items".
- Logical reading order matches visual order; keyboard tab reaches only the Privacy Policy link inside the section.

## 7. Iconography (32×32, `--mint` stroke 1.5, no fill)

Common attributes: `viewBox="0 0 32 32"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.5"`, `stroke-linecap="round"`, `stroke-linejoin="round"`.

**Icon 1 — Lock + shield (encryption)**
```svg
<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M16 3 L26 6 V15 C26 21 21.5 26 16 28 C10.5 26 6 21 6 15 V6 Z"/>
  <rect x="12" y="14" width="8" height="7" rx="1.2"/>
  <path d="M13.5 14 V12 a2.5 2.5 0 0 1 5 0 V14"/>
</svg>
```

**Icon 2 — Account Aggregator handshake/consent**
Two clasped hands inside a rounded consent dialog frame.
```svg
<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <rect x="3.5" y="6" width="25" height="17" rx="2.5"/>
  <path d="M9 16 l3-2.5 3 2 3-2 3 2.5"/>
  <path d="M9 16 v2.5 a1.5 1.5 0 0 0 1.5 1.5 h11 a1.5 1.5 0 0 0 1.5-1.5 V16"/>
  <path d="M11 26 h10"/>
</svg>
```

**Icon 3 — Eye with slash (read-only / no write)**
Open eye with a stop-stroke through it, signalling "look, don't touch".
```svg
<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M3 16 C6.5 10 11 7.5 16 7.5 C21 7.5 25.5 10 29 16 C25.5 22 21 24.5 16 24.5 C11 24.5 6.5 22 3 16 Z"/>
  <circle cx="16" cy="16" r="3.2"/>
  <line x1="6" y1="26" x2="26" y2="6"/>
</svg>
```

**Icon 4 — Refresh cycle with X (revocable)**
Circular arrow with a small X cutting the loop, suggesting "stop the cycle".
```svg
<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M26 12 A11 11 0 1 0 27 18"/>
  <polyline points="26,6 26,12 20,12"/>
  <line x1="13" y1="13" x2="19" y2="19"/>
  <line x1="19" y1="13" x2="13" y2="19"/>
</svg>
```

---
*Word count: ~690. Section deliverable complete.*
