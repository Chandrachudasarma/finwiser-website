# Finwiser — Narrative Spine & Brand Guidelines

**Status:** Living document. Source of truth for content, voice, and per-page intent across the entire Finwiser web surface — marketing site, deck, demo, legal pages.
**Owner:** Chandrachuda
**Last updated:** 2026-05-10

---

## How to use this document

If you're writing or reviewing any Finwiser copy — a headline, a tooltip, an FAQ answer, a deck slide, a Play Store description — open this first. The four parts are sequential:

1. **Narrative Spine** — the story that runs through every page. Read this first; if your copy doesn't connect to it, rewrite.
2. **Brand Guidelines** — voice, vocabulary, mascot, content patterns. Read this second; if your copy doesn't sound like this, rewrite.
3. **Page Slots** — what each page's role is in the spine, and what its headline / lead / CTA should do. Use this to scope a page rewrite.
4. **Open Decisions** — calls only the founder makes. If you hit one of these, stop and ask.

The spine and voice are derived from a multi-round review by spec-quality experts (Wiegers, Adzic, Fowler, Crispin, Gregory), business-strategy experts (Christensen, Porter, Godin, Doumont, Taleb, Meadows, Collins), and five user personas walking through the staging site (Rahul/Mr. Sharma/Aditi & Karan/Priya/Vikram). Where a guideline is load-bearing, the source is cited so future contributors can audit the call.

---

# PART 1 — NARRATIVE SPINE

## 1.1 North-star sentence

> **Real financial advice, for the salaried Indian who's never had any.**

Every section, page, and headline must support this line. It encodes:

- **Real** — not algorithmic theatre, not sales theatre, not a dashboard.
- **Advice** — not data, not graphs, not a product catalogue. A recommendation.
- **Salaried Indian** — the tribe, not "middle class" (Godin: middle class is a media-buy slice, not a tribe).
- **Never had any** — non-consumption framing (Christensen): we're not displacing existing advisers; we're serving 80M Indians who never had one.

If a sentence on the site doesn't trace back to this one, it's furniture.

## 1.2 Tribe

**Sweet spot: 26–32, salaried, ₹12–40L p.a., urban (metros + Tier 1).** First or second job. Surplus growing. Increasingly anxious about whether they're "doing enough."

**Why narrower than 25–40:** the 26–32 band has the highest job-to-be-done intensity — earning enough to invest, not enough to hire a human RIA, no template from family, decisions being made wrong *now*. Older readers (38+, like Mr. Sharma persona at 51) are welcome and respected — they are not who we write *for*.

**Common tribe attributes:**

- **Surplus**: ₹20K–₹80K/month (the engine's "next best rupee" matters here)
- **Goal stack**: 2–4 active goals (emergency, house EMI, retirement, kids someday)
- **Already invests**: one ELSS, one index SIP, an FD, maybe survived a PMS pitch
- **Already burned**: by an RM, an LIC agent, a "tip" from a friend, or all three
- **Already skeptical**: of "free advice," of "best mutual funds 2026," of robo-advisers selling regular plans

**Critical non-attribute: net worth.** Don't gate on AUM. Finwiser is the first fee-only RIA where ₹0 net worth is welcome — Priya (26, ₹12L, one ELSS) must feel as included as Vikram (38, ₹60L). The current site's case studies skew older/wealthier; **add a ₹12L–₹18L early-career persona** so Priya doesn't bounce thinking *"this is for richer people."*

**Secondary audiences (must not bounce):**

- DINK couples 30–35 with shared finances (Aditi & Karan persona) — they fixate on *"per family"* pricing.
- Mid-career engineers 35–42 with vested RSUs (Vikram persona) — comparison-shopping vs INDmoney/Kuvera.
- Older salaried readers 45+ (Mr. Sharma persona) — must feel respected, never patronized.

## 1.3 Voice & tone

**The voice is a senior friend who's read the SEBI Act and the Reddit thread.** Takes your money seriously and your jargon not at all.

**Language rules:**

- **Indian-English, baseline.** Pan-Indian words allowed: *bhaiya, paisa, EMI, SIP, RM, FD, lakh, crore.* No regional slang — never *yaar* (north-coded), never *anna/akka/macha* (south-coded).
- **Hindi for emotional emphasis only, never as a punchline.** *"Your bank's RM is not your bhaiya"* works. *"Yaar, this is so confusing"* doesn't.
- **Active voice.** *"Finwy reads your transactions"* — not *"Transactions are categorised by Finwy."*
- **Specific numbers > round claims.** *"₹41,300 surplus"* beats *"a healthy surplus."* If a number can't be justified (e.g. *"16 financial ratios"*), drop it or footnote it.
- **Define jargon at first appearance.** *"Fiduciary"* gets one plain sentence the first time it shows up. *"Account Aggregator"* gets one plain sentence at first appearance — currently mentioned 5+ times before it's defined, which is the #1 confusion point in user testing.

**What Finwiser is funny about:**

- Banks and their RMs (*"the man whose bonus depends on selling you the ULIP"*)
- Influencers (*"the guy in front of a Lambo telling you to buy small-caps"*)
- Tips from friends (*"your cousin's WhatsApp forward is not financial advice"*)
- AUM advisers (*"1% of your portfolio is more than ₹199"*)
- The reader's own avoidance (*"yes, you have been meaning to start that NPS"*)

**What Finwiser is NEVER funny about:**

- Money lost
- Kids' education shortfalls
- Retirement gaps
- Parents' health expenses
- Layoffs, salary cuts, job loss
- The reader's own numbers, however small (*never frame ₹4,000 surplus as inadequate; reframe as "starting point"*)

## 1.4 Moat framing — fee-only as organising principle

Per Porter and Kim & Mauborgne: **fee-only is the only structurally defensible moat.** Zerodha and Groww cannot copy it without blowing up their distribution P&L. Therefore fee-only is not a feature bullet — it is the logic the entire site is organised around.

**Where fee-only must show up:**

- **Hero eyebrow or sub:** *"Fee-only. No commissions, ever."*
- **Pricing block:** dedicated frame, not a footnote
- **Comparison table:** the *headline*, not a row (*"Most apps stop at the dashboard. Finwiser starts at the conflict."*)
- **Security section:** *"We don't see your password — and we don't sell your data."* Privacy + no-conflict combined.
- **Footer:** founder commitment line — *"I will never earn from selling you a product."*
- **FAQ:** *"What does fee-only mean?"* must be the **first** question.

**What we tone DOWN:**

- *"AI-led"* — once on the page, max. Vague + regulatory exposure (Taleb) + Vikram-persona eye-roll. Define what the AI does (categorises transactions + reasons over goals) once; thereafter just say *"Finwy."*
- *"30+ account types / 7 buckets"* — twice maximum (Discovery + Capabilities). Currently appears in 4 places.

## 1.5 Proof discipline

**Claim with hard proof:**

- SEBI INA000021331 (verifiable, link to sebi.gov.in)
- BSE enlistment 2408
- NISM certification
- AA security architecture (RBI-regulated rail, no password storage)
- Demo credentials (anyone can verify the app works)

**Show, don't claim:**

- Personalisation → engine case study (one pair is enough; three blurs — see 1.6)
- Speed → 3-minute demo path, instrumented
- Categorisation → live transaction stream visualisation
- Goal feasibility → math visible (*"₹41,300 → 4 fit, 2 don't"*)

**Don't claim until real users opt in:**

- AUA / AUM
- User counts
- Testimonial quotes (*even paraphrased*)
- Outcomes (*"grew net worth by X%"*)

The current empty-testimonials section ("real testimonial — coming soon, we don't fake it") is integrity-positive but lands **after** the pricing ask, which is the wrong order. **Recommendation: hide the section entirely until real testimonials exist.** Replace with a single line in the founder bio: *"First ten families on board. Their stories will live here when they're ready."*

## 1.6 The 5-act arc + handoffs

The marketing site (`index-staging.html`) tells one story in five acts. Each act has a job, a promise, and a handoff line into the next.

### Act 1 — Hero: grab and ground
**Job:** earn 5 seconds of attention.
**Content:** SEBI eyebrow → short H1 (4–7 words) → plain sub → one primary CTA (deck as quieter secondary).
**Promise:** *"Three minutes. Your full picture."*
**Handoff:** *"But first, why three minutes matters."*

### Act 2 — Problem: stake the pain
**Job:** make the reader nod once, hard.
**Content:** ONE cutting question (not five), externalised blame, specific stake.
**Current copy is too many questions** (5 rhetoricals stacked) — collapse to one or two.
**Promise:** *"Your money is hiding from you. We can find it."*
**Handoff:** *"Here's what you'll see when we do."*

### Act 3 — Discovery + Engine: show the goods
**Job:** prove the personalisation claim.
**Content:** composite picture (positioned **after** the steps, as payoff — the panel's order fix). Then the engine: **ONE case-study pair, not three.** Riya/Aman is the strongest per personas; the other two dilute. Keep the others as a *"see two more"* expander, not three full pages.
**Promise:** *"We don't just dashboard. We reason."*
**Handoff:** *"Here's exactly how that works for your money."*

### Act 4 — How (mechanics) + Capabilities: earn belief
**Job:** make the mechanic concrete.
**Content:** 3 steps (connect → notice → allocate). **The Step 02 → Step 03 bridge MUST say** *"that ₹41,300 surplus you just saw — here's where it should go first."* Currently the seam is silent.
Capabilities = what works in the app *today* (not what we'll build).
**Promise:** *"Software, not a service. You don't book a call. You connect."*
**Handoff:** *"And here's what it costs."*

### Act 5 — Ask: price + close
**Job:** convert.
**Content:** ₹199 (loud, specific), comparison table (immediately *before* pricing — *"here's why ₹199 is the answer"*), security, FAQ, final CTA.
The current order asks for the sale, **then** admits no testimonials. **Fix:** testimonials section disappears until real (per 1.5); comparison moves to immediately precede pricing.

### Sections to remove or relocate (currently dragging the arc)

- **Empty testimonials section** — hide until real.
- **"16 financial ratios"** as a claim — list them in a tooltip or delete.
- **"Always-on AI"** comparison-table row — delete; vague.
- **Trust strip immediately after hero** — merge into Security section; the hero eyebrow already carries SEBI.

---

# PART 2 — BRAND GUIDELINES

## 2.1 Personality dial

Finwiser is **the funky senior friend who became a SEBI RIA — and now wants you to stop losing money to your bank.**

- Plain-spoken, never preachy.
- Curious about your numbers, never judgmental.
- Will tell you something hard if you need to hear it.
- Cracks jokes about institutions, never about you.
- Knows the regulations cold but doesn't lead with them.
- Is your friend, not your authority figure.

## 2.2 Voice dimensions (the four dials)

| Dial | Setting | Why |
|---|---|---|
| **Funny ←→ Serious** | 70/30 funny | Banks/RMs/influencers fair game. The reader's actual money — serious. |
| **Formal ←→ Casual** | 80/20 casual | *"Hey," "look," "real talk"* welcome. *"Pursuant to," "esteemed customer"* never. |
| **Respectful ←→ Irreverent** | Respectful TOWARD users, irreverent TOWARD institutions. Reverse this and the brand dies. |
| **Enthusiastic ←→ Matter-of-fact** | Matter-of-fact about money math; enthusiastic about the user winning. |

## 2.3 Vocabulary

**Use:**
*surplus · real picture · next move · fee-only · no commissions, ever · what's actually happening · three minutes · your money / your goals · show the math · Finwy noticed · connect once · bhaiya (sparingly) · paisa (sparingly) · lakh · crore*

**Avoid:**
*AI-led / AI-powered (vague + regulatory) · wealth (sounds elite) · wealth journey, financial wellness, financial empowerment (cliché) · best-in-class, world-class, industry-leading (corporate) · synergy, leverage, ecosystem, holistic (corporate) · disrupting, revolutionizing, transforming (founder-speak) · cutting-edge, state-of-the-art (1990s) · solution (it's an app or a recommendation) · "we're committed to..." (commitments are shown, not stated) · regional slang beyond bhaiya/paisa*

**Indian conventions:**
- ₹ symbol, never *Rs.* or *INR*
- *Lakh* and *crore* welcome: *"₹1.6 lakh / month"* beats *"₹160,000 / month"*
- *6 PM* beats *18:00*
- *Bengaluru, Mumbai, Pune, Hyderabad, Chennai, Delhi* — never *Bangalore, Bombay, Madras*

## 2.4 Finwy mascot personality

Finwy is a teal wallet with a banknote sticking out. Big eyes, expressive eyebrows, animated.

**Personality:** curious, observant, friendly, sometimes blunt, always on the user's side — never on the bank's.

**Finwy says:**
- *"I noticed something."*
- *"Hey — your surplus is bigger than you think."*
- *"STOP. Buy term insurance first."*
- *"Keep going. You're on track."*
- *"Bhaiya, that ULIP your RM sold you? Let's talk."*

**Finwy does NOT say:**
- *"As your AI advisor..."*
- *"I'm here to help you achieve your financial dreams!"*
- *"Let's optimise your portfolio."*
- Anything that sounds like a corporate chatbot.

**Finwy across the site:**
- **Hero:** sleeps, wakes, waves (current 15-frame animation — keep)
- **Problem:** worried mascot variants (the persona PNGs in `/fw-deck-2026/slides/`)
- **Discovery:** holds the composite picture
- **Engine:** sparkles point at the decisive factor (Risk / Goals / Priorities)
- **Pricing:** relaxed, confident
- **Final CTA:** waving again

## 2.5 Visual system (formalising existing tokens)

**Color (already in `:root`):**
- `--mint #35d6c6` — primary brand accent. CTAs, mascot tinting, halo glow.
- `--navy-deep #001f3d` — primary brand dark. Hero, deck, dark sections.
- `--navy #002d56` — mid-surface dark. Secondary frames.
- Off-white / `--text-on-light` — body backgrounds, legal pages.

**Type:** confirm primary font from existing CSS and document here. Headlines: bold, tight leading. Body: regular, comfortable leading (1.5–1.6). Numbers: tabular figures in math sections.

**Motion:**
- Mascot: 15-frame sleep → wake → wave is the hero pattern.
- Snap-anim: scroll-driven section entries (already implemented).
- Reduced-motion: always honoured (already implemented).

## 2.6 Content patterns

**Headlines:** 4–7 words. Examples that work — *"Three minutes. Your full picture." (5) · "Real financial advice, for ₹199 a month." (6) · "Same data. Different answers." (4)*. The current 14-word hero H1 fails this — first 4 words are wasted on category framing.

**Subheads:** one sentence, max 25 words. The current *"Connect once. See every account in one place. Get real, fee-only advice in three minutes."* is 16 words across three short clauses — good rhythm, keep.

**Body:** one idea per line. Use line breaks for emphasis.

**Math:** always shown, never asserted. *"₹41,300 surplus → 4 goals fit, 2 don't"* beats *"We help you prioritise."*

**Indian context everywhere:** every numeric example uses ₹, lakh/crore, Indian banks (HDFC, ICICI, SBI, Axis), Indian goals (kids' education, parents' health, daughter's wedding, retirement, house EMI), Indian financial products (PPF, ELSS, NPS, FD, MF, ULIP).

---

# PART 3 — PAGE SLOTS

For each page: role + headline direction + lead promise + primary CTA. **Not full copy** — the copy hangs off the spine once the spine is agreed.

## 3.1 `index.html` — currently live (Coming Soon)

- **Role:** waitlist capture + minimal-friction signal that the real product is coming
- **Current state:** generic PFM language (*"Smart Tracking, Bank Integration, AI Insights, Secure & Private"*) — does NOT signal SEBI RIA, fee-only, or AA-led advice. **Mismatched with the marketing story.**
- **Headline direction:** align with marketing-site eventual hero. *"Real financial advice, for the salaried Indian who's never had any."* with *"Coming soon to Google Play"* eyebrow.
- **Lead promise:** SEBI-licensed, fee-only, three-minute experience.
- **Primary CTA:** Notify me. Secondary: *See the demo* (we already have one).

## 3.2 `index-staging.html` — marketing site (currently parked)

- **Role:** full sales narrative — the canonical story.
- **Headline direction:** short (4–7 words), job-led not category-led. Drop the regulator-shaped 14-word H1.
- **Lead promise:** three-minute full picture, fee-only forever.
- **Primary CTA:** *Try the demo →* . Secondary (quieter): *Read the deck.*

## 3.3 `fw-deck-2026/` — investor + design-partner pitch

- **Role:** investor narrative (different audience than retail).
- **Current state:** Slide 1 already strong (Finwy waves, *"₹1–2 lakh/year for a human advisor. ₹199/month for me."* slide-bar). Keep the mascot intro.
- **Headline direction:** keep current opener; investor tone allows more strategic framing.
- **Lead promise:** 80M underserved salaried Indians × fee-only software × SEBI moat.
- **Primary CTA:** founder contact.

## 3.4 `/demo-app` — hands-on proof

- **Role:** lets a stranger verify in 3 minutes that the app does what the site claims.
- **Headline direction:** minimal. Let the product speak.
- **Lead promise:** synthetic data, real flow.
- **Primary CTA:** *Connect a sample account.*

## 3.5 Legal pages — SEBI-mandated transparency

`privacy-policy.html · terms.html · investment-advisory-agreement.html · disclosures.html · complaints.html · investor-charter.html · accessibility.html · delete-account.html`

- **Role:** regulatory truth, plus reader translation.
- **Pattern for each:** keep regulatory language intact (compliance non-negotiable). **Add a one-paragraph plain-English preamble** at the top of each page summarising what's in this document and why it exists. Title pattern: *"What this means in plain language."*
- **CTA on every legal page:** helpdesk contact + escalation path (already present in footer; surface at top of page too).

---

# PART 4 — OPEN DECISIONS

These are calls only the founder makes. Don't make them on autopilot — they shape the spine.

1. **Tribe specificity.** Spine assumes 26–32 sweet spot inside 25–40 outer band. Business panel pushed for narrower (e.g., tech ICs with vested RSUs, or DINK couples). **Decide:** stay broad with *"salaried Indian"* + sweet-spot voice, or pick a narrow tribe and ship for them for 90 days. The latter is higher-conversion + faster referral; the former is higher TAM + slower flywheel.

2. **"AI-led" compliance review.** SEBI advertising regulations constrain claims about automated advice. **Decide:** keep *"AI-led,"* soften to *"AI-categorised + fiduciary-reviewed,"* or drop entirely and let *"Finwy"* carry the AI signal implicitly.

3. **Real testimonial pipeline.** When the first 10 families opt in, the placeholder section gets replaced. **Decide:** who runs the consent + paraphrase-free + SEBI-compliant testimonial pipeline (founder, designer, third party).

4. **Beta status messaging.** Currently *"Currently in private beta on Google Play."* **Decide:** keeps appearing through public launch, or switches to *"Live"* / *"Open"* at GA. Affects hero eyebrow and final CTA.

5. **Pricing elasticity.** ₹199/month is the spine — visible, transparent, low-friction (TheFinancialist hides their price; we beat them by showing it). **Decide:** stays flat for first 12 months (transparency wins, foundational moment for the brand) or A/B against ₹299 with a price-locked badge.

6. **Engine triptych pruning.** Three case-study pairs blurs (every persona except Mr. Sharma said some version of *"we get it"* by pair 2). **Decide:** which pair is canonical? Riya/Aman (risk) tested strongest in personas. Arjun/Suresh (time horizon) maps to Aditi/Karan's actual question (home loan vs retirement). Vivek/Karan (priorities) is the most narratively rich but the densest cognitive load.

7. **Empty testimonials removal.** Hide entirely until real, or keep the integrity statement with no cards. **Recommendation:** hide; restore when real.

8. **Add an early-career persona.** Engine cases skew older/wealthier. Priya (26, ₹12L, one ELSS) bounced thinking *"this is for richer people."* **Decide:** add a 4th case showing a ₹12–18L early-career profile, or accept that the site doesn't speak to them yet.

---

**End of document.** Update this file when a guideline changes — don't update copy without updating the spine first.
