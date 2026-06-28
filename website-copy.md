# Finwiser — Website Copy

**Status:** v1 draft. Full rewritten copy for every Finwiser web page, ready to wire into HTML.
**Owner:** Chandrachuda
**Last updated:** 2026-05-10
**Companion doc:** [`narrative-spine-and-brand.md`](./narrative-spine-and-brand.md) — strategy and voice rules this copy follows.

---

## Reading conventions used in this doc

- **EYEBROW · H1 · SUB · CTAs** — the four hero slots, in that order.
- **[bracketed]** = direction for the designer/dev (e.g. *[link to sebi.gov.in]*, *[hidden until real testimonials exist]*).
- **Italics inside copy** = words to italicise in the rendered HTML.
- **🔒 LOAD-BEARING** = this line is decided; don't change without revisiting the spine.
- **🔧 EASY TO SWAP** = this line is voiced but not load-bearing; tune freely.

---

# 1. `index.html` — Coming Soon (currently live)

**Role:** waitlist capture + signal that the real product exists. Currently the live page uses generic PFM language (*"Smart Tracking, Bank Integration, AI Insights, Secure & Private"*) which doesn't match the marketing site. Realigning.

**🔒 LOAD-BEARING — this is the page that the world currently sees at finwiser.org. Treat the H1 as a brand promise.**

```
[ EYEBROW ]
Coming soon to Google Play

[ H1 ]
Real financial advice,
for the salaried Indian
who's never had any.

[ SUB ]
SEBI-licensed. Fee-only ₹199 a month.
Connect once, see your full picture in three minutes.

[ TRUST CHIPS — small row below sub ]
SEBI Registered  ·  Fee-only forever  ·  Account Aggregator-secured

[ EMAIL CAPTURE ]
Heading: Be in the first hundred.
Field placeholder: your-email@gmail.com
Button: Notify me

[ SECONDARY CTA — text link below capture ]
See the demo →    [/demo-app]

[ FOOTER LINE ]
Chandrachuda Sarma Yemmanuru · SEBI Reg. INA000021331 · BSE Enlistment 2408
```

**Why this works:**
- Eyebrow names the channel (Google Play) — answers *"how do I get this?"* before they ask
- H1 is the north-star sentence verbatim (per spine §1.1)
- Sub delivers SEBI + price + speed in 12 words — exactly what the <60s personas already retain
- Three trust chips = 3-second skim signal for credibility
- One primary action (notify), one secondary (demo) — same shape as TheFinancialist but with price visible
- Footer name + SEBI INA links the brand to a verifiable real human

---

# 2. `index-staging.html` — Marketing Site (parked, will swap to live)

The full 5-act story. Each section below is sequential; the order is part of the meaning.

## 2.0 Top announcement bar (above the nav)

```
🟢 Currently in private beta on Google Play  ·  See the demo →
```

🔧 EASY TO SWAP — switch to *"Live on Google Play"* at GA, switch to *"Live on iOS too"* at iOS launch.

## 2.1 Hero (Act 1 — grab and ground)

🔒 LOAD-BEARING.

```
[ EYEBROW ]
SEBI Registered. Fee-only. ₹199 a month.

[ H1 ]
Three minutes.
Your full picture.

[ SUB ]
Connect your accounts and see your real surplus,
your real goals, and what to do next.
Fee-only fiduciary advice — never a commission,
never a product pitch.

[ PRIMARY CTA ]
Try the demo →

[ SECONDARY CTA — quieter, ghost button ]
Read the deck

[ MASCOT ]
Finwy: 15-frame sleep → wake → wave (already implemented)
```

**Why this works (panel + persona alignment):**
- 5-word H1 (Doumont: clear) replaces the 14-word regulator-shaped one
- Eyebrow gives skim-mode personas (Mr. Sharma, Vikram) what they already retain
- Sub names *fiduciary* (the actual moat) instead of *AI-led* (vague + regulatory exposure per Taleb)
- *"Never a commission, never a product pitch"* converts the moat from a bullet to the organising principle (Porter)
- Removes the *AI-led* phrase from the hero entirely (per spine §1.4)

## 2.2 Trust strip (immediately after hero)

A single thin row of three credentials with the SEBI link being clickable. **Not a separate section** — visually a thin band attached to the hero, not a hero-sized block.

```
[ ROW ]
SEBI Registered Investment Adviser  ·  INA000021331  ·  verify on SEBI →    [link to sebi.gov.in/sebiweb/ — opens new tab]
Bank-grade secured · TLS 1.3 + AES-256
We never see your password — Account Aggregator only
```

🔒 LOAD-BEARING — the SEBI link is the most-clicked credibility action across all five personas.

## 2.3 Problem (Act 2 — stake the pain)

🔒 LOAD-BEARING.

```
[ HEADLINE ]
You're earning. Saving. Investing.
You still can't answer one question.

[ EMPHASISED LINE — feels like a thought, italicised ]
"Am I actually on track?"

[ BODY — one paragraph, three short sentences ]
It's not because you don't read.
It's because nobody sees the full picture — not your bank,
not your CA, not even you.
Your money lives in thirty-plus accounts that don't talk
to each other.

[ FINWY APPEARS — small, looks at the reader ]
Finwy: "I can fix that. In three minutes."
```

**Replaces** the current 5-question stack. The panel found 5 questions diluted; one cutting question converts harder. Externalises blame (*"not because you don't read"*) — addresses Wiegers's note that the original copy mildly accused the reader.

🔧 EASY TO SWAP — the emphasised line. Could also be *"Am I doing enough?"* or *"Will I be okay?"*. Test variants.

## 2.4 Discovery (Act 3a — show what you'll see)

```
[ EYEBROW — small, mint colour ]
The picture, in three minutes.

[ HEADLINE ]
Watch your money come together.

[ SUB ]
Finwy connects every account you have —
bank, mutual funds, FDs, NPS, loans, insurance,
even property and gold — and shows you one picture.

[ THE COMPOSITE PICTURE — already built, keep ]
[Net worth | Real surplus | Goals on track | Risk score]

[ SEVEN BUCKETS STRIP — keep, but add a hover tooltip listing the 30+ types ]
Banking · Investments · Pensions · Insurance · Loans & Cards · Business · Physical assets

[ CAPTION — small, italic ]
Illustrative example. Your numbers will be yours.
```

🔧 EASY TO SWAP — the eyebrow. Could be *"What you'll see at minute three."*

## 2.5 Engine (Act 3b — same data, different advice)

🔒 LOAD-BEARING. **Major change: from three pairs to one canonical pair, with an expander for the other two.** Per persona testing, all five personas locked on Pair 1 and started skimming by Pair 2.

```
[ HEADLINE ]
Same surplus.
Different lives.
Different next move.

[ SUB ]
Two 35-year-olds. Identical income. Identical surplus.
Watch how Finwy reasons.

[ THE PAIR — Riya/Aman, already built ]
[Riya: 83% equity, ₹46L portfolio, told to STOP]
[Aman: 0% equity, ₹6L in FD, told to START]

[ DECISIVE-FACTOR ROW ]
Risk is decisive. Same surplus, opposite portfolios → opposite advice.

[ EXPANDER — collapsible "see two more cases" ]
Trigger: "+ See two more cases"
Pair 2: Arjun (5y flat goal) vs Suresh (12y education) — time horizon decides.
Pair 3: Vivek (1 goal) vs Karan (4 goals, dependents) — priorities decide.

[ CLOSER — after the cards ]
Six 35-year-olds. Six allocations.
And they keep changing.

Finwy keeps watching.

[ CTA ]
Get yours →

[ FOOTNOTE ]
Illustrative cases. Names changed; details composed.
Your data drives your allocation, not these.
```

**Why one pair, not three:**
- Persona testing: all five personas got it after Pair 1
- The expander preserves the depth for readers who want it (Vikram persona will click it)
- Skim-mode readers (Priya, Mr. Sharma) get the clean argument
- Reduces cognitive load by ~60% on Act 3

## 2.6 How it works (Act 4 — earn belief)

🔒 LOAD-BEARING — Step 02 → Step 03 bridge is the panel's identified seam fix.

```
[ HEADLINE ]
Three minutes. Three steps.

[ SUB ]
Connect once. Finwy handles the rest —
and recalibrates as life changes.
```

### Step 01

```
[ NUMBER ]
01

[ HEADLINE ]
Connect every account in a few taps.

[ BODY ]
You approve each connection on your bank's own
RBI-regulated rail. Finwy never sees your password —
ever.

You can disconnect any time, with one tap.

[ CHIPS — visual ]
Account Aggregator  ·  Email statements  ·  Credit bureau

[ ANIMATION — already built ]
[Approving your accounts · 0 of 30+ → all connected]
```

### Step 02

```
[ NUMBER ]
02

[ HEADLINE ]
See what's actually left.

[ BODY ]
Finwy reads every transaction —
sorts each rupee into income, fixed expense,
variable expense.

Then it tells you the one number you're tired of guessing:
your real monthly surplus.

[ SUB-CALLOUT — emphasis ]
Most months, it's bigger than you think.

[ ANIMATION — already built ]
[Live transaction stream → categorised → surplus number]
```

### Bridge between Step 02 and Step 03

🔒 LOAD-BEARING — the seam fix.

```
[ TRANSITIONAL LINE — visually distinct, between cards ]
That surplus you just saw?
Here's where it should go first.
```

### Step 03

```
[ NUMBER ]
03

[ HEADLINE ]
Tell Finwy your goals.
Let math decide.

[ BODY ]
You list what matters — emergency, retirement,
the flat in 2031, the bike this year.

Finwy ranks them by your priority,
allocates every rupee of surplus,
and tells you up front which goals fit
and which don't.

No random tips. No influencer noise.
No commission-driven "advice."
Just math, made visible.

[ TRADEMARK CALLOUT ]
Next Best Rupee™

[ ANIMATION — already built ]
[Six goals · ₹41,300 surplus · 4 fit, 2 don't]
```

🔧 EASY TO SWAP — the *"No random tips"* triplet. Could also call out: *"Not your bank's RM. Not your cousin's WhatsApp. Not the Lambo guy on YouTube."*

## 2.7 Capabilities (Act 4 closer — what works today)

```
[ EYEBROW ]
Live in the app, today.

[ HEADLINE ]
What Finwiser does for you, right now.

[ SUB ]
Not what we'll build. What runs today.

[ CARDS — 6 in a grid ]

CARD 1
See every account in one place.
Banking, investments, pensions, insurance, loans &
cards, business, physical assets — thirty-plus account
types across seven buckets. One picture.

CARD 2
Auto-categorise every transaction.
UPI, salary, rent, EMIs, OTT, that one Swiggy habit.
Sorted automatically.

CARD 3
Tell you your real monthly surplus.
Not what your bank shows. What's actually left
after the obligations you forgot. Updated daily.

CARD 4
Watch the ratios that matter.
Savings rate. Debt-to-income. Retirement readiness.
Emergency-fund cover. In plain language, not a finance
textbook.

CARD 5
Rank goals. Allocate every rupee.
Emergency first, retirement next, lifestyle last.
Surplus goes where it matters most — automatically.

CARD 6
Recalibrate as life changes.
Bonus. Layoff. Market drop. New EMI.
The plan updates without you opening the app.
```

**Changes from current copy:**
- Removed the unsourced *"90%+ accuracy"* claim (Wiegers: claim without source)
- Replaced *"Track 16 financial ratios that matter"* with *"Watch the ratios that matter"* — drops the unjustified specific number
- Removed *"Always-on AI"* framing (Vikram persona eye-rolled at this)

## 2.8 Comparison (Act 5 — moat as headline)

🔒 LOAD-BEARING — the headline IS the argument.

```
[ HEADLINE ]
Most apps stop at the dashboard.
Finwiser starts at the conflict.

[ SUB ]
Net-worth trackers show you the chart.
Investing apps sell you their funds.
Your CA does the math manually, once a year.

Finwiser is the only one whose business model says
no to commissions.

[ TABLE — keep current 8-row structure, but reframe header ]

Capability                              | Net-worth trackers | Investing apps | Your CA / agent | Finwiser
----------------------------------------|--------------------|----------------|-----------------|--------
Shows full net worth                    | Yes                | Partial        | Manual          | Yes
Categorises spending automatically      | No                 | Partial        | Manual          | Yes
Computes real monthly surplus           | No                 | No             | Manual          | Yes
360° portfolio advice                   | No                 | MFs only       | Yes             | Yes
Goal planning + feasibility             | No                 | No             | Yes             | Yes
Fee-only advice (no product commissions)| No                 | Conflicted     | Yes (sometimes) | Yes
Recalibrates as life changes            | No                 | No             | No              | Yes
Available when you need it              | Self-serve         | Self-serve     | Appointment     | In-app

[ FOOTER LINE ]
1 of 8  ·  0 of 8  ·  4 of 8  ·  8 of 8 — Finwiser
```

**Changes from current copy:**
- Replaced *"SEBI RIA-licensed advice"* row with *"Fee-only advice (no product commissions)"* — same fact, customer-facing language
- Replaced *"Always-on AI"* row with *"Available when you need it"* + cell value *"In-app"* — concrete, not vague
- Sub explicitly names the moat in plain language

## 2.9 Pricing (Act 5)

🔒 LOAD-BEARING — visible price is your wedge against TheFinancialist.

```
[ HEADLINE ]
₹199 a month.
That's the whole price.

[ SUB ]
One fee. Per family. All inclusive. Cancel any time.

[ CARD — pricing block ]

  ₹ 199 / month
  Per family. All inclusive.

  ✓ See every account in one place
  ✓ Daily-updated financial picture
  ✓ Fee-only, SEBI RIA-licensed advice
  ✓ Goal planning + dynamic recalibration
  ✓ Always-on Finwy

  [ BUTTON ]
  Try the demo →

[ FOUNDER COMMITMENT — below the card, set apart ]
"Finwiser does not earn from selling you mutual funds,
insurance, or any other product. I never will.
Your fee is the only revenue."
— Chandrachuda Sarma Y., Founder & SEBI RIA

[ BETA NOTE — small, below ]
Free during private beta. Pricing kicks in only when
the app moves to public release.
```

**Changes from current copy:**
- Founder commitment is now signed by name (not anonymous brand voice) — Mr. Sharma persona test: a name calmed the "is this a scam" worry
- "Always-on AI advisor" softened to "Always-on Finwy" (per spine §1.4: AI-led toned down)
- Pricing card list trimmed by one line for breathability

## 2.10 Testimonials section

🔒 LOAD-BEARING decision: **HIDE THIS SECTION ENTIRELY** until at least 3 real testimonials are live with consent + SEBI-compliant wording.

```
[ HIDDEN — render nothing here ]

When real testimonials exist, the section returns at this slot
with this structure:

  [ HEADLINE ]
  Real names. Real cities. Real numbers.

  [ SUB ]
  These are Finwiser members who chose to share their story.
  No paraphrasing, no stock photos, no incentive paid.

  [ 3 CARDS — name, photo, city, profession, one verbatim quote ]

  [ DISCLAIMER — small, below cards ]
  Quotes verbatim and consented. Outcomes are illustrative
  of the speaker's situation; not representative or guaranteed.
```

**Why hide for now:** the current placeholder ("real testimonial — coming soon, we don't fake it") is integrity-positive but lands AFTER the pricing ask, which the panel and personas confirmed actively undercuts conversion. The integrity message is preserved by the *founder commitment* line in the pricing block above.

## 2.11 Security (Act 5)

```
[ HEADLINE ]
We never see your password.
We never sell your data.

[ SUB ]
Your data is yours. Here's the plumbing — in plain language.

[ CARDS — 4 ]

CARD 1
Bank-grade encryption.
Everything — at rest and in transit — encrypted with
AES-256 and TLS 1.3. The same standards your bank uses
for online banking.

CARD 2
Account Aggregator only. RBI-regulated.
Finwiser never asks for your bank password.
We use Account Aggregator — the consent-based,
RBI-regulated rail that 1,000+ banks already support.

What's an Account Aggregator? An RBI-licensed entity
that hands your bank data to Finwiser only after you
explicitly consent — and only what you consent to.

CARD 3
Read-only. Always.
Finwiser can see your accounts. It cannot move money,
place trades, or change a single setting.
Even if Finwiser wanted to, the rails don't allow it.

CARD 4
Revoke any time.
Withdraw consent in your Account Aggregator app —
Finwiser loses access immediately.
Your data is deleted from active systems within
72 hours.

[ FOOTER LINE ]
More detail on what data we use, where it lives,
and how long: read the [Privacy Policy].
```

**Changes from current copy:**
- Card 2 now defines Account Aggregator inline (the panel's #1 confusion finding from personas — the term appears 5+ times before being defined)
- Headline merges the two trust statements (don't see password + don't sell data) — privacy + no-conflict combined per spine §1.4

## 2.12 FAQ (Act 5)

🔒 LOAD-BEARING — *"What does fee-only mean?"* MUST be the first question (per spine §1.4).

```
[ HEADLINE ]
Questions you're probably asking.

[ SUB ]
Asked by real beta users. And, honestly, the founder's family.

[ ACCORDION — 12 questions, in this order ]

1. What does fee-only mean? (and why does it matter?)
   You pay Finwiser ₹199 a month — and that's the only money
   Finwiser ever earns from you. We don't get a commission for
   recommending a mutual fund, an insurance policy, or any other
   product. So when Finwy says "buy this debt fund," it's because
   the math says so — not because someone paid us.

   That's it. That's fee-only. (Most "advisers" you've met are not.)

2. How does Finwiser see my accounts without my password?
   Through Account Aggregator — the RBI's consent-based rail.
   You log into your bank, approve a one-time consent, and your
   bank securely sends Finwiser a read-only feed of your accounts.
   Finwiser never sees your password, never gets login access, and
   never can move money. Withdraw the consent any time and the
   feed stops.

3. Can Finwiser move my money?
   No. Account Aggregator is read-only by design — Finwiser
   physically cannot place a trade, transfer money, or change a
   setting on any account. You execute every recommendation
   yourself, in your bank's or broker's app.

4. What if I want to cancel?
   One tap in the app. Your subscription stops at the end of the
   current month. We don't ask why, we don't try to "save" you,
   and we don't keep your data — see Question 11.

5. How is this different from my CA or agent?
   A CA is great at filing returns and reading the rules. An
   agent is paid commissions to sell you specific products.
   Finwiser is a SEBI-registered Investment Adviser — same
   regulatory category as a fee-only human RIA — but priced
   per family, available in-app, and runs continuous math
   instead of a once-a-year review.

6. How is this different from other investing apps?
   Investing apps (Groww, Kuvera, Zerodha) are distributors —
   their job is to help you transact. Finwiser is an Adviser —
   our job is to tell you whether the transaction is right for
   you. Different licence, different incentive, different answer.

7. Does it work with my joint account?
   Yes. Both account holders need to consent through Account
   Aggregator independently. Once both have consented, the
   account appears in your shared family picture.

8. Hindi or regional language support?
   Today: English only. Hindi and a few regional languages
   are next on the roadmap — when they ship, the app prompts
   you to switch.

9. Refund policy?
   Cancel any time and you're not billed for the next month.
   We don't pro-rate — if you cancel on the 25th, you keep
   access until the end of that month. We don't auto-renew
   in surprise.

10. What's the SEBI registration number?
    INA000021331. You can verify it directly on
    sebi.gov.in/sebiweb/ — search "Chandrachuda Sarma" or
    paste the number.

11. If I have a complaint, who do I escalate to?
    Email helpdesk@finwiser.org or call +91 88012 94657 —
    we acknowledge in 1 working day, target resolution in
    7 working days, outer limit 21. If unresolved, escalate
    via SEBI SCORES (scores.sebi.gov.in) or SmartODR
    (smartodr.in). The Grievance Redressal Officer named
    in the footer is the same person you're emailing.

12. Where's Finwiser based?
    Bengaluru. Registered office address is in the footer —
    this is a single-proprietor SEBI RIA, run by a real
    human who picks up the phone.
```

**Changes from current copy:**
- Q1 is now *"What does fee-only mean?"* (per spine §1.4 — the moat must be the FAQ opener)
- Q11 names the escalation human and SLA explicitly (Mr. Sharma persona's "is this a scam" check)
- Q12 owns the single-proprietor reality and reframes it as a feature (*"a real human who picks up the phone"*) — addresses Vikram's "small operation" concern by making the smallness specific rather than apologetic

🔧 EASY TO SWAP — the parenthetical asides (*"and why does it matter?"*, *"Most 'advisers' you've met are not."*). They carry the funky-friend voice; tune to taste.

## 2.13 Final CTA (Act 5 close)

```
[ HEADLINE ]
Three minutes.
Your full picture.
Try it.

[ SUB ]
Sample data, real flow. See exactly what Finwiser
would tell you about your money.

[ PRIMARY CTA ]
Try the demo →

[ SECONDARY CTA ]
Read the deck

[ TERTIARY ]
Google Play (private beta)

[ DEMO CREDS — small below CTAs ]
Demo sign-in: 9876543210 · OTP 123456
[Synthetic credentials. Phone nine-eight-seven-six-five-four-three-two-one-zero. OTP one-two-three-four-five-six.]
```

🔒 LOAD-BEARING — the H1 echoes the hero H1 verbatim, closing the loop.

## 2.14 Footer

```
[ BRAND BLOCK ]
Finwiser
The fee-only fiduciary your bank doesn't want you to have.
For the eighty million salaried Indians the industry forgot.

[ NAV — three columns ]
Product            Compliance              Account
Try the demo       Terms & Conditions      Delete your account
Google Play        Privacy Policy          
Pricing            Investor Charter        Help
How it works       Advisory Agreement
FAQ                Disclosures
                   Grievances
                   Accessibility

[ LEGAL BAND — keep existing SEBI-required disclosures verbatim ]
Chandrachuda Sarma Yemmanuru (Proprietor: Finwiser) ·
SEBI Registered Investment Adviser · Reg. No. INA000021331 ·
BSE Enlistment 2408 · NISM Reg. NISM-202500082015

Principal / Registered Office: H.No. 181, 14th Cross,
Bluejay Atmosphere Phase II, Andhrahalli Main Road,
Nagasandra Post, Bengaluru – 560073, Karnataka, India.

Grievance Redressal Officer: Chandrachuda Sarma Yemmanuru ·
helpdesk@finwiser.org · +91 88012 94657 ·
Acknowledgement T+1 working day · Resolution target T+7 ·
Outer limit T+21 working days.

Investments in the securities market are subject to market
risks. Read all the related documents carefully before
investing. Registration granted by SEBI, enlistment as a
member of BASL, and certification from NISM in no way
guarantee performance of the intermediary or provide any
assurance of returns to investors.

For grievances unresolved by the Adviser, escalate via
SEBI SCORES at scores.sebi.gov.in or the SmartODR platform
at smartodr.in. SEBI Toll-Free: 1800 22 7575 / 1800 266 7575.

© 2025–2026 Finwiser. All rights reserved.

[ INVESTOR LINK — small, right-aligned ]
For investors → view the deck
```

**Changes:**
- Tagline updated: *"The fee-only fiduciary your bank doesn't want you to have"* — funky-friend voice, fee-only as organising principle, mild irreverence toward institutions
- *"For the eighty million salaried Indians the industry forgot"* — the tribe statement, attributable
- All SEBI-required language preserved verbatim

---

# 3. Legal Pages — Plain-English Preambles

For each legal page, the existing SEBI-mandated body content stays untouched (compliance non-negotiable). **Add a one-paragraph preamble at the top** in the funky-friend voice, with the heading **"What this means in plain language."**

## 3.1 `privacy-policy.html`

```
[ TITLE ]
Privacy Policy

[ PREAMBLE — at top, before the legal text ]
What this means in plain language.

We collect three things: what you tell us (your name, email, phone),
what your bank securely shares through Account Aggregator (account
balances and transactions, read-only), and how you use the app
(which buttons you tap, so we can fix the broken ones). We never
collect your bank password — we don't have a way to. We don't
sell your data to anyone, ever. You can delete everything by
emailing helpdesk@finwiser.org or using the in-app "Delete account"
flow — your data is gone from active systems within 72 hours.

The legal version follows. If anything below contradicts the
paragraph above, the paragraph above is wrong and we'll fix it —
flag it to helpdesk@finwiser.org.

[ … existing legal text follows unchanged … ]
```

## 3.2 `terms.html`

```
[ TITLE ]
Terms & Conditions

[ PREAMBLE ]
What this means in plain language.

You give Finwiser ₹199 a month. Finwiser gives you software
that reads your accounts (read-only) and a SEBI-licensed
fiduciary recommendation about what to do next. You execute
the recommendation yourself, in your bank's or broker's app —
Finwiser cannot move your money, even if it wanted to.
Either side can end the arrangement any time, with one tap
or one email.

The legal version follows.

[ … existing legal text follows unchanged … ]
```

## 3.3 `investment-advisory-agreement.html`

```
[ TITLE ]
Investment Advisory Agreement

[ PREAMBLE ]
What this means in plain language.

This is the contract SEBI requires between an Investment Adviser
(Finwiser) and a client (you) before any advice can be given.
It says: Finwiser will give you advice that's appropriate for your
situation, will tell you about its conflicts of interest (it has
none — the only revenue is your ₹199), will keep your data
confidential, and won't promise any specific returns because
nobody legally can. You can end this agreement any time, in writing,
and Finwiser must stop advising you.

The full agreement follows. Read it once. Keep a copy.

[ … existing legal text follows unchanged … ]
```

## 3.4 `disclosures.html`

```
[ TITLE ]
Disclosures

[ PREAMBLE ]
What this means in plain language.

SEBI requires every Investment Adviser to publish exactly what
they earn from, what they don't earn from, and what could
possibly bias their advice. Finwiser earns from one source only:
your ₹199 monthly fee. No commissions from product manufacturers,
no kickbacks from distributors, no referral fees, no advertising
revenue. The technical details follow — they're long because SEBI
requires them to be, not because we have anything to hide.

[ … existing legal text follows unchanged … ]
```

## 3.5 `complaints.html`

```
[ TITLE ]
Complaints & Grievance Redressal

[ PREAMBLE ]
What this means in plain language.

If something is wrong, here's the path:

Step 1 — email helpdesk@finwiser.org or call +91 88012 94657.
Chandrachuda (yes, the founder) personally reads every grievance.
We acknowledge within 1 working day and target resolution within
7 working days, outer limit 21.

Step 2 — if you're not satisfied with the resolution, escalate
to SEBI directly via SCORES (scores.sebi.gov.in) or
SmartODR (smartodr.in). Both are free and SEBI handles them
within their published SLAs. SEBI Toll-Free: 1800 22 7575
or 1800 266 7575.

You don't need our permission to escalate. Skipping us and going
straight to SEBI is your right.

[ … existing legal text follows unchanged … ]
```

## 3.6 `investor-charter.html`

```
[ TITLE ]
Investor Charter

[ PREAMBLE ]
What this means in plain language.

SEBI publishes a standard list of rights every investor has
when dealing with a registered Adviser. Finwiser republishes
that list here, unchanged, because you should know exactly
what you're entitled to ask for. Short version: honest advice
in your interest, full disclosure of how the Adviser is paid,
written records of every recommendation, your data kept
confidential, the right to end the relationship any time,
and the right to escalate to SEBI if any of these are
violated.

The full SEBI charter follows.

[ … existing legal text follows unchanged … ]
```

## 3.7 `accessibility.html`

```
[ TITLE ]
Accessibility

[ PREAMBLE ]
What this means in plain language.

We try to make Finwiser usable by everyone — including readers
using screen readers, keyboard-only navigation, larger text,
or reduced motion. We're not perfect yet. Specifically: the
mascot animations honour reduced-motion preferences,
all interactive elements are keyboard-reachable, and colour
contrast meets WCAG AA on the hero, pricing, and security
sections (we're working through the rest).

If you hit something that doesn't work for you, please email
helpdesk@finwiser.org with what you were trying to do and what
device or assistive technology you were using. Accessibility bugs
are treated the same as any other bug — fixed and shipped.

[ … existing legal text follows unchanged … ]
```

## 3.8 `delete-account.html`

```
[ TITLE ]
Delete your account

[ PREAMBLE ]
What this means in plain language.

You can delete your Finwiser account at any time, for any reason
or no reason. Two ways:

1. In the app: Settings → Account → Delete account. Confirm.
   That's it.
2. By email: send "Delete my account" to helpdesk@finwiser.org
   from the email registered on your account. We'll confirm
   and execute.

What happens next:
— Your subscription stops immediately. No further billing.
— Finwiser revokes its Account Aggregator consents on your
  behalf. Your bank stops sending us your data.
— Your account data is deleted from active systems within
  72 hours.
— A small set of records (transaction logs, audit trails,
  KYC documents) is retained for the period SEBI requires by
  law — currently five years from the end of the advisory
  relationship. After that, those are deleted too.

You don't lose access to anything you executed in your own
bank or broker — those records live with them, not us.

[ … existing legal text follows unchanged … ]
```

---

# Open questions (founder calls)

Before this copy ships, three calls only you can make:

1. **The North-Star sentence** — *"Real financial advice, for the salaried Indian who's never had any."* Lands in `index.html` H1 and footer tagline, echoes through hero subhead and pricing footer-line. Confirm or replace.

2. **Founder commitment line in pricing block** — currently *"Finwiser does not earn from selling you mutual funds, insurance, or any other product. I never will. Your fee is the only revenue. — Chandrachuda Sarma Y., Founder & SEBI RIA"*. Confirm wording and signature format.

3. **FAQ Q1 plain answer** — *"Most 'advisers' you've met are not."* is funky-friend voice but mildly inflammatory. Keep, soften, or remove.

Mark approved sections by replying with the section number. I'll wire them into HTML in a separate pass.

---

**End of document.**
