# HyKr Build Challenge 2026 — MVP Submission Record

> Submitted: **2026-05-18 (Mon, IST)** — final day of the Build Phase per HyKr's reminder email.
> Form: *HyKr Build Phase MVP Submission* — confirmation checkboxes acknowledged.

---

## 1. Submitted Form Answers

### Page 1 · Team Details

| Field | Value |
|---|---|
| Primary Contact | Chandrachuda Y |
| Email | chandrachudasarma@finwiser.org |
| Phone | 8801294657 |

### Page 2 · MVP Status

| Field | Value |
|---|---|
| Current MVP Status | MVP developed, can be used by beta users |
| Platform | Android |

**"In 3–4 lines, describe what your MVP can do today"** (submitted version — 6 paragraphs, 238 words):

> Finwiser is a SEBI-registered financial advisory MVP for India's salaried middle class, built to turn scattered financial data into clear, regulated, goal-based advice.
>
> The Android app connects consented financial data from the Account Aggregator framework, email statements, PDFs, and credit bureau, then creates a unified financial picture across net worth, investments, liabilities, cashflow, monthly surplus, insurance protection, and financial goals.
>
> Today, users can connect accounts without password sharing or screen scraping, view their complete financial snapshot, analyse mutual funds by peer rank, risk, suitability and return quality, and understand whether each holding should be kept, reviewed, or replaced.
>
> For cashflow, Finwiser does not blindly guess. If a transaction is unclear, the advisor asks targeted questions, such as whether a credit was salary or reimbursement. Once the cashflow picture is stable, the user confirms monthly surplus on a slider, and that becomes the authoritative planning number.
>
> Users can then plan mandatory goals like Emergency Fund and Retirement, and also add custom goals with target amount, priority, and deadline. Finwiser auto-calculates goal-wise SIPs and recommends suitable funds using a 42-row suitability matrix built around SEBI mutual-fund categories, matched to the user's risk profile and goal timeline.
>
> The advisory engine runs server-side on OCI Mumbai, with SEBI RIA registration, ReBIT 2.1.0-certified AA integration, and explainable recommendation logic. Every recommendation carries a readable rationale, such as emergency underfunded, must-have goal, stable surplus, within policy bands, or better fit for the goal horizon.

**"Main user flow"** (7-step, 273 words):

1. **Mobile login** — The user enters the Android app and begins the advisory journey.
2. **Risk profile** — Finwiser captures risk suitability through a 5-question flow, including a sustained-stress scenario. Capacity is derived where available from financial data such as emergency-fund months and EMI-to-income ratio, while tolerance comes from the questionnaire. The conservative category drives downstream recommendations.
3. **Guided data connection** — The user connects financial data through the Account Aggregator framework for banks, mutual funds, equities, NPS, and credit-bureau data where available. No password sharing or screen scraping is used. The first ledger materialises in about 30 seconds.
4. **Snapshot** — The user sees net worth across liquidity, fixed income, growth, retirement, and protection buckets. Mutual funds show peer-percentile rank, suitability against the user's risk profile, and XIRR with an explicit accuracy tier.
5. **Cashflow advisor** — The user sees income, expenses, and surplus. When Finwiser cannot confidently classify a transaction, the advisor asks targeted questions, such as whether a ₹60,000 credit was salary or reimbursement. Once stable, the user confirms monthly surplus on a slider. This becomes the authoritative planning number.
6. **Goals and SIP planning** — Emergency Fund and Retirement are default goals. Users can add custom goals with target amount, priority, and deadline. Finwiser allocates locked surplus, auto-calculates goal-wise SIPs, and recommends suitable funds using a 42-row suitability matrix built around SEBI mutual-fund categories.
7. **Explainable recommendations** — Each recommendation carries a readable rationale, such as emergency underfunded, must-have goal, stable surplus, within policy bands, or better fit for the goal horizon. Manual assets like real estate, gold, or private investments can also flow into the advisory layer.

### Page 3 · Artifacts (Links & Demos)

| Field | Value |
|---|---|
| GitHub Repository | `Not sharing – see technical overview. The Codebase Explorer at https://finwiser.org/codebase/ provides reviewer access to the full production backend (modules, services, models, routes) and the engineering appendix.` |
| Technical Documentation | https://finwiser.org/hykr-2026/Finwiser_Technical_Documentation_HyKr_MVP.pdf |
| 2-Minute Demo Video | https://finwiser.org/hykr-2026/Finwiser-HyKr-MVP-Demo.mp4 |
| Prototype / Product | https://play.google.com/apps/internaltest/4701327181634726921 |
| Test Credentials | Mobile `9876543210` · OTP `123456` (+ 140-word reviewer-path block) |
| Codebase Explorer | https://finwiser.org/codebase/ |

**Test Credentials block (full submitted text):**

```
Mobile: 9876543210
OTP: 123456

The seeded test account bypasses the full production onboarding flow — mobile OTP, suitability risk-profile questionnaire, and AA consent — so reviewers land directly on a populated ledger with six months of pre-fetched financial data across HDFC and ICICI deposits, CAMS RTA mutual-fund folios, Experian credit-bureau data, and pre-set goals.

Suggested review path:

1. Snapshot tab — review net worth, 5-bucket allocation, mutual-fund holdings, peer-percentile rank, suitability score, and XIRR accuracy tier.

2. Cash-Flow tab — review income, expenses, and confirmed monthly surplus on the slider. The seeded account already has surplus locked. On a fresh account, use "Start quick chat" to see advisor-led cashflow clarification.

3. Goals tab — open any goal to see the SIP calculation, recommended funds, and Next Best Rupee rationale with structured factors such as emergency underfunded, must-have goal, stable surplus, policy bands, and goal timeline fit.

To see live ingestion, use the "Fresh AA fetch" action on the home screen. It takes approximately 60 seconds end-to-end.
```

### Page 4 · Quality & Progress

| Field | Value |
|---|---|
| Tested with users | 6–20 users |
| User interviews | 12 |

**Key learning (95 words):**

> A key learning was that users do not want another dashboard that only shows balances and charts. They want the product to tell them what to do next with their money.
>
> This influenced the MVP in three ways: first, we made monthly surplus user-authoritative through a confirmation slider; second, we moved from generic portfolio views to goal-linked SIP recommendations; and third, we added advisor-led clarification for unclear cashflows instead of silently guessing transaction categories.
>
> The result is that Finwiser now focuses less on "tracking" and more on converting financial data into specific, explainable next actions.

**Build phase work (114 words):**

> During the Build phase, we moved Finwiser from a financial-data ingestion product to an end-to-end advisory MVP.
>
> We built and stabilised the onboarding-to-advice journey: Account Aggregator data ingestion, unified ledger creation, mutual-fund intelligence, risk-profile capture, cashflow categorisation, advisor-led transaction clarification, surplus confirmation, and goal-wise SIP recommendations.
>
> We also improved the goal-planning layer by making Emergency Fund and Retirement default goals, adding support for custom goals with target amount, priority and deadline, and connecting locked surplus to goal-wise recommendations through the Next Best Rupee engine.
>
> On the engineering side, we strengthened ReBIT 2.1.0 AA flows, live ledger refresh, seeded reviewer accounts, server-side advisory logic, XIRR accuracy tiering, peer-rank based fund analysis, and explainable recommendation rationales.

**Next 2–3 milestones (86 words):**

> 1. Public beta launch: move from Google Play Closed Testing to a wider beta with 100–300 users, improve onboarding completion, and measure activation from account linking to first recommendation.
>
> 2. Advisory depth: expand goal-planning and recommendation coverage across insurance gap analysis, tax-aware redemption insights, emergency-fund completion, retirement readiness, and custom goal optimisation.
>
> 3. Paid readiness: launch the first paid advisory cohort, improve reliability of AA refreshes and cashflow classification, add more explainability around recommendations, and prepare the operating processes required for a SEBI RIA-led paid product.

**Anything else for the panel (96 words):**

> Finwiser is built by a solo founder and is already a regulated advisory product, not just a prototype UI. The MVP combines SEBI RIA registration, ReBIT 2.1.0-certified Account Aggregator integration, server-side advisory logic, and a working Android app in Google Play Closed Testing.
>
> The main thing to evaluate is not only whether data is displayed, but whether the system can convert that data into suitable, explainable, goal-linked financial actions for the user.
>
> The seeded reviewer account is intentionally pre-populated so the panel can evaluate the advisory journey quickly without waiting for a full production consent flow.

---

## 2. Artifact Hosting

| Asset | Path | Repo / Commit |
|---|---|---|
| Technical Documentation PDF | `hykr-2026/Finwiser_Technical_Documentation_HyKr_MVP.pdf` | `finwiser-website` · `97b9caf` |
| Demo video v1 (initial placeholder, replaced) | — | `finwiser-website` · `bda2073` |
| Demo video v2 (audio + 1:53 cut, live) | `hykr-2026/Finwiser-HyKr-MVP-Demo.mp4` | `finwiser-website` · `4bbcf48` |
| HyKr deck (already published earlier) | `hykr-2026/Finwiser-HyKr-Deck-2026.pdf` | `finwiser-website` · `21ced6f` |

**Hosting infrastructure:** GitHub Pages (master branch of `finwiser-website` repo) fronted by Cloudflare. CNAME → `finwiser.org`. Folder `hykr-2026/` is unlinked from the public Coming Soon homepage — URLs themselves are the access control.

**Cache-purge note (2026-05-18):** v2 video swap required a manual Cloudflare Development Mode toggle to flip the edge cache (auto-disables after 3 hours). For future swaps, either toggle Development Mode again or set up a GitHub Action with Cloudflare API token (`Zone.Cache Purge` scope) to auto-purge on push.

---

## 3. Demo Video v2 Specs (Final Submitted)

| Property | Value |
|---|---|
| Duration | 1:52.5 (well within HyKr's 2:00 cap) |
| Resolution | 1080 × 2424 (portrait, matches Android phone) |
| Video codec | H.264 |
| Audio codec | AAC mono 44.1 kHz, 155 kbps (voice-over narration) |
| File size | 11.1 MB |
| Local source | `hykr-2026/Finwiser_HyKr_Demo_v2_with_VO.mp4` (editor's untrimmed master, 2:07) |
| Trim used | `ffmpeg -t 120 -c:v libx264 -preset fast -crf 22 -c:a aac -b:a 128k` |

**Beats covered (per editor's cut sheet):**

1. Title — Finwiser logo + mascot
2. Onboard — phone OTP entry
3. AA consent — Saafe + Finvu providers
4. Track all — Portfolio Score, Net Worth, What We Track breakdown
5. Risk Q + Result — sustained-stress scenario, "Moderately Aggressive"
6. Portfolio advice — Keep / Worth Reviewing fund verdicts
7. Advisor asks — transaction clarification questions
8. Surplus locked — Planning Surplus slider ₹1.07L/mo
9. Goals + SIPs — Emergency Fund ₹56.4K/mo + Retirement Fund ₹43.9K/mo + Add a goal CTA
10. Outro — brand fade

---

## 4. Tester / Access Setup

**Google Play Console — Internal Testing track:**

- Track ID: `4701327181634726921`
- Active release: `1.3.0+d4f2f68`
- Opt-in URL (same for all testers): `https://play.google.com/apps/internaltest/4701327181634726921`

**Testers (4 of 100 max):**

1. chandrachudasarma@gmail.com (founder)
2. finwiser.technologies@gmail.com (company)
3. gayathrikambaluru@gmail.com
4. **info@hykr.studio** (HyKr reviewers — added for this submission)

**Backend access:** OCI Mumbai. SSH + `git pull` + `pm2 restart` deploy. Latest backend deploy includes `d0d84c82` (single-writer surplus contract) and the full day-3 advisor iteration.

**Test login flow:**
- Mobile `9876543210` / OTP `123456` → seeded ledger, 6-month AA window, pre-set Emergency + Retirement goals
- Internal test user `9182227682` is for founder debugging only — **do not share with reviewers**

---

## 5. Cloudflare Reference

| Property | Value |
|---|---|
| Zone | finwiser.org |
| Zone ID | `dcf028412265c223975c79de80774dad` |
| Account ID | `94998dd62e776afdc01aa0d8dd85968d` |
| Plan | Free |
| Registrar | NameCheap |
| DNS Setup | Full |

API token for cache purge: not yet created. To create — Cloudflare dashboard → My Profile → API Tokens → Create with `Zone.Cache Purge` scoped to finwiser.org.

---

## 6. Outstanding Items (Post-Submission)

| Priority | Item | Why |
|---|---|---|
| Soon | Build & upload new Flutter APK to Internal Testing track | Current APK `1.3.0+d4f2f68` predates today's frontend commits (`20766896` unified slider hero, Goals→Cash-Flow redirect). Reviewers on the old APK see old surplus UI talking to new single-writer backend — works but not the cleanest experience. |
| Cosmetic | Update tech doc "Closed Testing" → "Internal Testing" | The published doc says Closed Testing; actual Play Console track is Internal. Minor consistency fix. |
| Cosmetic | Step 7 rationale code "better fit for the goal horizon" | Not in actual engine codes (`must_have_bias`, `emergency_underfunded`, `high_urgency`, `within_policy_bands`, `stable_surplus`, `progress_momentum`). Submitted as-is in this draft; fix in next doc revision. |
| Nice-to-have | GitHub Action for auto Cloudflare cache purge on push to `finwiser-website` | Removes the manual Development Mode toggle step for future asset swaps. Needs CF API token + zone ID in GitHub Secrets. |
| Nice-to-have | Push backend `portfolio-development` branch state into a tag for the SEBI/audit trail | Branch is current dev source-of-truth; tagging the submission-time HEAD gives a stable reference. |

---

## 7. Reference — What HyKr Asked For

From HyKr submission email (2026-05-12) and reminder (2026-05-18):

- **GitHub repository link** — or "Not sharing – see technical overview"
- **2-minute demo video** — clear audio, end-to-end flow, ≤2:00
- **Concise technical documentation** — architecture, tech stack, key components, deployment
- **MVP link** — working prototype access
- **Test credentials** — login, password, setup steps
- **Final deadline**: Monday, 18 May 2026 (with informal back-channel via simran@hykr.studio if late)
- **Evaluation timeline**: HyKr will review within 2 weeks. Selected teams get a 1:1 with the panel. Top 10 go to Demo Day.

---

## 8. Submission Confirmation Trail

- **Form submitted**: 2026-05-18, both confirmation checkboxes ticked ("information accurate" + "authorized to submit + read confidentiality statement")
- **No submission ID captured** during submit (form may not have issued one) — watch for HyKr confirmation email from `info@hykr.studio`

---

## 9. Evaluation Update

- **"HyKr Build Challenge 2026 – Evaluation Update"** email from `info@hykr.studio`:
  - **400+ applications** received nationally; "highly competitive."
  - Finwiser's application has **advanced to the next stage of evaluation** — jury "saw strong potential."
  - **Top 20 NOT yet selected** — final results to be shared by **23 June 2026**.
  - Jury may reach out for additional information / clarifications / supporting materials during this stage.
- **Safe external phrasing** (used in the Antler application): *"shortlisted in the HyKr Build Challenge 2026, advancing past 400+ teams into the final evaluation round."* Do **not** claim "Top 20" or "won" until the result confirms it.
- **Follow-up:** if Finwiser advances further, that's a materially stronger update worth sending to EWOR (still in review) and mentioning to Antler.

### Update 1b — Timeline slip to 1 Jul (email 2026-06-24, from `info@hykr.studio`, "Update on HyKr Build Challenge 2026 Selection Timeline")

- Pure timeline-slip notice: "due to the volume and quality of applications," HyKr needs more time to finalise the **Top 20**.
- The **23 Jun** date (from Update 1) **slipped to 1 July 2026**. No status change for Finwiser — still mid-evaluation, no shortlist decision yet.
- (This date, in turn, slipped again in Update 2 below.)

### Update 2 — Additional evaluation stage (email 2026-07-01, from `info@hykr.studio`, "Update on Your HyKr Build Challenge Application")

- The **23 Jun** result date **slipped**. HyKr has **introduced an additional evaluation stage** before moving startups to the next phase.
- Finwiser has been **selected to move forward into this additional evaluation stage** ("extra step to help the jury validate the strongest opportunities before announcing the startups advancing to the next phase").
- **New outcome date: by 10 July 2026.**
- HyKr may **reach out directly** for additional information / clarification during this stage — watch for a `@hykr.studio` email and be ready to respond fast (the 1:1 panel prep in `claudedocs/prep_hykr_1on1_*_20260603.md` is the material to lean on).
- **Net status as of 2026-07-02:** still in the running, one round deeper, no rejection — advanced through every gate so far (400+ → still standing). Not yet "Top N" or "selected for next phase"; keep external phrasing conservative until 10 Jul.
