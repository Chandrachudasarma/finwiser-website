# Finwiser — Technical Overview

> **HyKr Build Challenge 2026 · MVP Phase Submission**
> Last updated: 2026-05-13 · Author: Chandrachuda Sarma, Founder
> Detailed architecture, full data model, and operational runbook available in the linked appendix.

**SEBI Registered Investment Adviser** · **INA000021331**  ·  **FIU India** Registered  ·  **Sahamati ReBIT 2.1.0** Certified  ·  **OCI Mumbai + MongoDB Atlas Mumbai**  ·  **Flutter Android** in Google Play Closed Testing

---

## 1. Product Summary

Finwiser is a working Android reference app on top of a real backend that ingests consented financial data from Account Aggregator, Gmail, PDF statements, and credit bureaus; normalises it into a unified ledger; runs categorisation, cashflow analytics, and per-scheme mutual-fund analytics; and produces goal-linked allocation recommendations under the SEBI RIA suitability framework. All financial logic runs server-side in Mumbai.

---

## 2. Architecture

Four logical modules within a single Node.js service, with explicit data-flow boundaries. The monolith is a deliberate choice at current scale — DI-enforced module boundaries keep responsibilities sharp without distributed-system overhead — and logical decomposition is designed to support a future service split if traffic patterns warrant it.

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│    AA (Saafe + Finvu) ──┐                                            │
│    Gmail Push ──────────┤   ┌──────────────┐                         │
│    PDF statements ──────┼──→│   MODULE 1   │   Unified transactions  │
│    Credit Bureau ───────┘   │   Ingestion  ├────────────┐            │
│                             └──────────────┘            │            │
│                                                         ▼            │
│            ┌──────────────┐                 ┌──────────────┐         │
│            │   MODULE 2   │   ← surplus +   │   MODULE 3   │         │
│            │   Ledger +   │     cashflow    │ Categorisation│        │
│            │   MF Intel   │   ─────────────  │  + Cashflow  │        │
│            │              │   → assets +    │              │         │
│            │ Net worth    │     analytics   │ 6-tier class │         │
│            │ Portfolio    │                 │ Ratio engine │         │
│            │ MF analytics │                 │ Coherence    │         │
│            │ Peer rank    │                 │ Advisor chat │         │
│            └──────┬───────┘                 └──────┬───────┘         │
│                   │ Assets +                       │ Surplus +       │
│                   │ Analytics +                    │ Stability +     │
│                   │ Protection                     │ Traits          │
│                   ▼                                ▼                 │
│                   ┌─────────────────────────────────┐                │
│                   │         MODULE 4                │                │
│                   │     Goals & Decisioning         │                │
│                   │                                 │                │
│                   │ • 42-row SEBI suitability       │                │
│                   │ • Next Best Rupee engine        │                │
│                   │ • Risk profile + audit          │                │
│                   └─────────────────────────────────┘                │
│                                                                      │
│   Modules 1–3 produce facts. Module 4 produces judgments.            │
└──────────────────────────────────────────────────────────────────────┘
```

- **Module 1 — Data Ingestion.** Owns external acquisition: AA fetch lifecycle, Gmail Push, PDF statement parsing, credit-bureau pulls. Outputs a unified transaction stream.
- **Module 2 — Ledger + Investment Intelligence.** Holds the user's complete financial state — balance sheet (net worth, portfolio, liabilities, protection) *and* market-data layer (per-scheme MF analytics, peer ranking, XIRR with accuracy tiering) — that feeds M4 decisioning.
- **Module 3 — Categorisation & Cashflow.** Classifies every transaction through a six-tier pipeline, computes financial ratios, and runs the advisor-chat intelligence engine.
- **Module 4 — Goals & Decisioning.** Goal lifecycle, suitability scoring against a 42-row SEBI mutual-fund category matrix, Next Best Rupee allocation engine, calculation-audit trail.

**Deployment & data-flow view.**

```
┌────────────────────────────────────────────────────────────────────┐
│   CLIENT TIER                                                      │
│   ┌──────────────────┐  HTTPS + JWT (access + refresh)             │
│   │ Flutter Android  │  SSE downstream for advisor streaming       │
│   └────────┬─────────┘                                             │
└────────────┼───────────────────────────────────────────────────────┘
             │
┌────────────▼───────────────────────────────────────────────────────┐
│   APPLICATION TIER — OCI Mumbai · PM2 fork mode                    │
│                                                                    │
│   ┌─ Sync path ────────────────┐  ┌─ Async path ──────────────┐    │
│   │ Express + JWT middleware   │  │ Bull workers + cron jobs  │    │
│   │  → controllers → services  │  │  • AA fetch lifecycle     │    │
│   │  → models (M1–M4 logic)    │  │  • Categorisation tiers   │    │
│   │  → SSE for advisor stream  │  │  • NAV refresh + peer rank│    │
│   └───────────┬────────────────┘  │  • Daily / monthly snaps  │    │
│               │                   └─────────────┬─────────────┘    │
│               ▼                                 ▼                  │
│   ┌──────────────────────┐    ┌────────────────────────────┐       │
│   │ MongoDB Atlas Mumbai │    │ Redis (managed)            │       │
│   │  CSFLE: PAN, mobile, │    │  cache · queues · rate-    │       │
│   │  financial PII       │    │  limit · in-flight locks   │       │
│   └──────────────────────┘    └────────────────────────────┘       │
│                                                                    │
│   ┌─ Webhook ingress ─────────────────────────────────────────┐    │
│   │  • AA notifications (Sahamati, signed payloads, mTLS)     │    │
│   │  • Gmail Pub/Sub push (token-verified)                    │    │
│   │  → static + dynamic webhook validator                     │    │
│   │  → atomic state transitions → queue worker dispatch       │    │
│   └───────────────────────────────────────────────────────────┘    │
└────────────┬───────────────────────────────────────────────────────┘
             │ TLS 1.2+
┌────────────▼───────────────────────────────────────────────────────┐
│   EXTERNAL                                                         │
│   Saafe / Finvu AA · AMFI · mfapi.in · Experian via IDSPay ·       │
│   Gmail API · OpenAI                                               │
└────────────────────────────────────────────────────────────────────┘
```

**Data model — core entities.**

| Domain | Key collections | Relationships |
|---|---|---|
| User & auth | `User`, `RiskProfile`, `FinancialProfile` | User 1:N RiskProfile (versioned; `deactivateAll` on resubmit) |
| AA pipeline | `Consent`, `DataSession`, `RawFIData`, `DecryptedRawFIData` | User 1:N Consent 1:N DataSession 1:N FI artefacts (TTL-managed) |
| Ledger | `Transaction`, `AccountProfile`, `ManualAsset`, `NetWorthSnapshot`, `MonthlyCashflowSnapshot` | User 1:N Account 1:N Transaction; daily NetWorth + monthly Cashflow snapshots; user-added manual assets (real estate, gold, etc.) flow into the same intelligence layer |
| Market data | `InstrumentMaster`, `NavHistory`, `AnalyticsCache` | InstrumentMaster 1:N NavHistory; AnalyticsCache 1:1 InstrumentMaster (dirty-flagged) |
| Categorisation | `CanonicalTransaction`, `CategorizationVote`, `ExtractionTemplate` | Transaction 1:1 CanonicalTx; CT 1:N Vote (per-tier audit trail) |
| Counterparty | `CounterpartyEntity`, `CounterpartyLedgerEntry` | Entity 1:N Ledger entry (append-only, typed, atomic balance) |
| Goals & decisioning | `Goal`, `GoalSyncAsset`, `RecommendationSnapshot`, `FYGainsTracker` | User 1:N Goal; Goal N:M Asset via GoalSyncAsset (per-(goal, asset) suitability) |
| Audit | `CalculationAuditLog`, `OutgoingAPILog`, `LegalRetentionArtifact` | Append-only; version-stamped; tiered TTL (24h / 30d / 90d / ~7y) |

Full schema (~90 collections across 14 domains) lives under `models/` in the production repo.

---

## 3. Worked Example

One first connection, traced end to end. At each stop: the mechanisms that run — and what a naïve implementation gets wrong without them. A wrong number here isn't a bug; it's bad advice someone acts on with real money.

```
┌────────────────────────────────────────────────────────┐
│ Meera connects · 11 accounts · Gmail · 1 locked PDF    │
│ She believes:  net worth ~₹38L · surplus ~₹55k/mo      │
└────────────────────────────────────────────────────────┘
                            ▼
╔════════════════════════════════════════════════════════╗
║ M1 · INGESTION — get it in, intact and once            ║
║   dual-curve crypto · failedLinkRefs reconciler ·      ║
║   late-EXPIRED guard · SIG_V1 cross-source dedup       ║
║   naïve → loses a folio, triple-counts a ₹10k SIP      ║
╚════════════════════════════════════════════════════════╝
                  ▼  one clean, deduped ledger
╔════════════════════════════════════════════════════════╗
║ M2 · LEDGER — numbers that are honest                  ║
║   NAV risk/return math · split anomaly guard ·         ║
║   XIRR accuracy tiers + 80% gate · PAN-aware dedup     ║
║   naïve → a +38% split = "skill"; debt counted 2×      ║
╚════════════════════════════════════════════════════════╝
                  ▼  a true balance sheet
╔════════════════════════════════════════════════════════╗
║ M3 · CATEGORISATION — a surplus you can trust          ║
║   6-tier orchestrator · 9-intent classifier ·          ║
║   ask-don't-guess · coherence gate scores 0.81         ║
║   naïve → reads a ₹60k reimbursement as salary         ║
╚════════════════════════════════════════════════════════╝
                  ▼  a trustworthy monthly surplus
╔════════════════════════════════════════════════════════╗
║ M4 · DECISIONING — explainable, suitable, auditable    ║
║   Next Best Rupee utility · 42-row SEBI matrix ·       ║
║   input-hashed snapshot · 7-year audit trail           ║
║   naïve → splits evenly, can't say why, churns daily   ║
╚════════════════════════════════════════════════════════╝
                            ▼
┌────────────────────────────────────────────────────────┐
│              BELIEVED          FINWISER                │
│   net worth   ₹38.0 L    ──→   ₹31.2 L                 │
│   surplus/mo  ₹55 k      ──→   ₹41 k                   │
│   goals       4 active   ──→   3 fit, 1 not fit        │
└────────────────────────────────────────────────────────┘
```

Meera asked one question — *"where do I actually stand?"* — and every step between her tap and the answer had a dozen ways to be quietly, confidently wrong. Closing that gap is what the engineering is for.

---

## 4. Module 1 — Data Ingestion

**Account Aggregator client (ReBIT 2.1.0).**

- *Transport & crypto.* Per-session key material — X25519 via `crypto.generateKeyPairSync`, with a BouncyCastle Curve25519 fallback for FIPs that reject X25519 — combines with the FIP's `KeyMaterial` to derive a session key + IV; per-account `encryptedFI` blobs are decrypted with AES-GCM. Outbound requests carry detached JWS signatures (RFC 7797, `b64:false`); inbound responses are verified by resolving `kid` against a per-environment public-key cache. `failedLinkRefs` persisted separately from `decryptOk` so a reconciler can retry only the items that failed.
- *Fetch lifecycle & DI.* 8 focused services wired through request-scoped DI via `aa-factory.js`: a fresh dependency bag per AA provider (`AATransport`, `ConsentService`, `SessionService`, `FIDataProcessor`, `FIFetcher`, `SessionStatusService`, `NotificationHandler`), no circular dependencies, shared HTTPS agent capped at `maxSockets: 4`. The most recent decomposition pass replaced the 2,063-line `StatusCheckManager` with three of these services.
- *Webhook state machine.* Handles real-world AA pathology — late `EXPIRED` / `TIMEOUT` notifications cannot downgrade an already-fetched session — and atomic queue acquisition via `findOneAndUpdate({fiFetchState: {$nin: ["QUEUED","FETCHING"]}})` ensures only one worker ever begins a fetch under PM2 cluster mode.

Both Saafe and Finvu are wired as `active` in the AA registry; coverage spans DEPOSIT, MUTUAL_FUNDS, EQUITIES, and NPS asset classes. *Files:* `services/ingestion/AA/{aa-transport, aa-factory, notification-handler, fi-data-processor, aa-keystore.service}.js`.

**SIG_V1 cross-source transaction signatures.** Every transaction — AA, email, or PDF — is hashed into two SHA-256 signatures over a canonical form: amount in paise (minor units), UTC date, lowercased merchant with corporate suffixes (`pvt | ltd | inc | corp`) and payment terms (`payment | txn | transfer`) stripped, account key normalised to `CARD:1234:INR`. `localSignature` includes source for in-source idempotency; `crossSignature` omits source for AA ↔ Email ↔ PDF dedup. A V2 signature runs in shadow mode under feature flag for safe rollout. *Files:* `utils/transaction-signatures.js`, `services/ingestion/AA/unified-transaction-ingester.js`.

**Self-learning email extraction templates.** Email bodies are normalised to a structural fingerprint (amounts, dates, account/reference replaced with placeholders), SHA-256 hashed to a 16-character `templateHash`. On the first LLM success for a fingerprint, per-field regex rules for amount, direction, merchant, last-4, and reference are reverse-engineered from the body and cached in Redis (`tpl:{domain}:{hash}`, no TTL) and MongoDB. Templates degrade automatically — `active → degraded` at >30% failure rate over ≥5 uses, `expired` at >50% over ≥10. A burn-in sampling rate (50% until useCount<20, then 5%) shadow-validates new templates against the LLM to catch silent drift. The system gets cheaper per user over time without manual template authoring. *File:* `services/email/extraction-template.service.js`.

**Credit-bureau guard stack.** A bureau pull is gated by four sequential mechanisms: (1) bulkhead with concurrency=2 around the HTTPS call; (2) a process-wide circuit breaker that increments only on infrastructure codes (`HTTP_ERROR | NETWORK_ERROR | TIMEOUT | EMPTY_RESPONSE | BUREAU_IP_NOT_WHITELISTED`) and *not* on per-user codes (`API_REJECTED | IDENTITY_NO_MATCH | PARSER_ERROR`), so one wrong PAN cannot trip the breaker for everyone; (3) a MongoDB-backed cluster lock at `bureau-pull:${userId}` with 90s TTL that fails fast (`BUREAU_LOCK_HELD`) rather than silently skipping; (4) an idempotency key `${userId}:${consentVersion}:${YYYYMMDD-IST}` checked both pre-call and on the unique-index race (E11000). Transport retries use jittered exponential backoff; timeouts are not retried because the vendor still bills. *Files:* `services/ingestion/credit-bureau/{bureau-circuit-breaker,bureau-cluster-lock,credit-bureau.service,experian-idspay.client}.js`.

---

## 5. Module 2 — Ledger + Investment Intelligence

**Per-scheme mutual-fund analytics engine.** Computes the full risk/return surface for every tracked scheme directly from the raw daily NAV series: trailing returns (1M/3M/6M/1Y absolute, 2Y/3Y/5Y CAGR via binary search on a date-indexed array with 30-day slippage tolerance), annualised volatility (√252 × σ of daily log returns), Beta and Jensen's Alpha against a per-scheme benchmark proxy on a 3-year window, Sharpe ratio (daily *and* a weekly-downsampled variant per López de Prado to reduce microstructure noise), maximum drawdown over full history, and Information Ratio with small-sample bias correction `IR × (1 − 1/4N)` on a fixed 3-year window — applying the Jobson–Korkie / Memmel adjustment so the IR is comparable across funds. Anomaly guards skip suspected splits at the log-return level (daily > log(1.30), weekly > log(1.50)). Debt funds take an alternative path that skips the equity benchmark entirely and emits a SEBI-category-derived duration bucket plus a credit-risk flag, because beta/alpha vs an equity index is mathematically meaningless for a gilt fund. Golden-file accuracy tests verify computed returns match Value Research and Morningstar within ±0.5%. *Files:* `services/ledger/market-data/analytics-compute.service.js`; 80 unit tests in `analytics-compute.test.js` alone (incl. the golden-file return-accuracy suite), plus 10 sibling test files across the `test/ledger/market-data/` directory.

**Peer-ranking engine with category distribution.** A weekly cron iterates every SEBI category × planType (Direct ranked separately from Regular — the 0.5–1.5% structural expense-ratio gap makes cross-plan ranks unfair), computes 1Y/3Y/5Y trailing returns from NAV history, sorts descending, assigns rank and `percentile = round((n−1−i)/(n−1) × 100)`, and upserts both per-scheme percentile fields *and* a per-category distribution document (median, mean, p25, p75, min, max via linear-interpolation percentile matching Excel `PERCENTILE.INC`). A minimum-10-scheme rule before "reliable ranking" is shown; NFOs with <1Y history get an explicit `null` rather than silent exclusion; for ELSS the design treats 3Y as the primary display metric (3-year lock-in). A bounded in-memory benchmark-NAV cache prevents re-fetching the ~30 unique benchmarks during the cross-category batch. *File:* `services/ledger/market-data/peer-ranking.service.js`.

**XIRR with accuracy tiering.** Newton-Raphson solver for the NPV root with a mathematically-guaranteed bisection fallback whenever one negative and one positive cash flow exist. When AA-supplied transaction history doesn't cover the user's full cost basis (common for older folios where the FIP only returns the last 6–12 months), the engine fills the gap with a *synthetic* lump-sum cash flow dated to the earliest available transaction and returns an accuracy tier — `full` (≥95% coverage), `partial` (10–95%), `synthetic` (<10%) — so the UI can disclose what it's looking at. A portfolio-level 80% gate suppresses XIRR and benchmark comparison entirely when synthetic dates dominate, rather than silently presenting a misleading IRR. Cash-flow date uses `transactionDate` (allotment date) to reconcile with CAMS/KFintech CAS statements. *File:* `services/ledger/portfolio/xirr.service.js`.

---

## 6. Module 3 — Categorisation, Cashflow & Advisor

**Six-tier categorisation orchestrator (P0–P6).** After hard-match misses, transactions flow through a deterministic priority cascade: P0 scoped Known-Contact memory → P1 EWMA cross-user consensus (`userWeight × timeDecay` per vote; activation requires `totalWeightedVotes ≥ 20 ∧ agreement ≥ 0.70 ∧ ¬pivotDetected`) → P2 merchant lexicon → P2B zero-shot NLI *(P3 retired; subsumed by P2B — numbering preserved for log-trail compatibility)* → P4 user history → P5 cadence detection (CV ≤ 0.20) → P6 fallback. Each tier has its own activation predicate, its own `confidenceCap` (P1: 0.95, P2B: 0.80, P5: 0.80, P6: 0.0) that prevents a weak signal in a high-priority tier from masquerading as a strong result, and writes a `decisionPath` audit string (`P1→P2→P2B:win@P2B`) to every classification. Every threshold lives in `process.env`, so policy changes ship without code changes. *Files:* `services/categorization/tiers/tier-orchestrator.js`, `utils/categorization-config.js`, `services/analysis/categorization-reputation.service.js`.

**Ratio engine + two-layer coherence gate.** A pure-function ratio engine computes 13 financial ratios in 3 groups from a single MongoDB facet aggregation — **Core Health** (income coverage, essential burden, rigidity, savings rate, debt burden, investing habit), **Drift** (outflow spike, category drift, largest-debit shock, new-counterparty %), **Data Quality** (explainability, transfer confidence, account coverage) — plus a separate temporal-consistency sub-score. The coherence gate runs three checks in order: validity (≥5 computable ratios including load-bearing income_coverage / savings_rate), hard blockers (`income_coverage < 0.3 ∨ > 2.5`, `explainability < 0.6`), and a weighted in-range score (Core 60% / Data Quality 30% / Drift 10%). Coherence ≥ 0.75 + coverage ≥ 0.80 + no blockers is the explicit exit condition for an advisor session. *File:* `services/analysis/financial-ratio.service.js`.

**7-trait context profile with cross-session memory.** The trait detector emits continuous 0–1 scores for 7 user traits — `salaried`, `family_hub`, `irregular_income`, `incomplete_account`, `investor`, `transfer_heavy`, `reimbursement_heavy` — from observed signals (counterparty concentration, monthly-income CV, essential-counterparty count) and declared evidence (advisor diagnostic answers). A `TRAIT_RELEVANCE` matrix maps `(ratio, direction) → [{trait, weight, reason}]` across 5 anomaly-bearing ratios; per-`(ratio, direction, trait)` insight templates swap between `assert` phrasing when declared evidence exists and `soften` phrasing when only inferred. Traits confirmed in one session persist to `user.confirmedTraits` and are re-applied as declared evidence in the next — the advisor doesn't re-ask "do you support family?" every visit. *Files:* `services/analysis/{context-profile,interpretation-policy}.js`.

---

## 7. Module 4 — Goals & Decisioning

**Next Best Rupee allocation engine.** Per-user goal allocation ranked by an explicit multiplicative utility score:

> `utility = delta × mustHave × emergencyBoost × urgency × stability × policy × progress × priority`

where `delta` is the marginal SIP-confidence improvement of allocating ₹X to that goal. Results are sorted deterministically (utility desc → mandatory → months-to-target asc → priority rank → gap desc) and emit structured rationale codes (`must_have_bias`, `emergency_underfunded`, `high_urgency`, `within_policy_bands`, `stable_surplus`, `progress_momentum`) that are consumable by both UI and audit log. Every coefficient is named and individually tunable, and the per-decision log line dumps each factor value alongside the goal — the audit trail is the factor breakdown itself. Coefficients are curated via finance-panel review; surplus exhaustion is the only hard zero (`surplus.amount ≤ 0 → utility = 0`), with policy-band violation halving utility and unstable surplus / non-mandatory status reducing it multiplicatively. *Files:* `services/goals/next-best-rupee.service.js`, `services/goals/goal-feasibility.service.js`.

**42-row SEBI mutual-fund suitability matrix.** Suitability scoring (0–100) per `(goal, asset)` keyed by SEBI MF sub-category — 42 distinct category rows (Overnight, Liquid, Money Market; Ultra/Low/Short/Med/Long Duration, Floater, Banking & PSU, Corporate Bond, Dynamic Bond, Gilt (incl. 10-yr constant duration), **Credit Risk** (deliberately nerfed for goal allocation per panel review of side-pocketing exposure); Large Cap, Large & Mid, Index, Other ETFs, Dividend Yield; Multi/Flexi/Focused/Value/Contra Cap, ELSS; Mid Cap, Small Cap, Sectoral/Thematic; Conservative/Balanced/Aggressive Hybrid, Dynamic Asset Allocation, Multi Asset, **Arbitrage** (uplifted for short-horizon goals — debt-like returns, equity taxation), Equity Savings; Solution-oriented Retirement/Children, FoF Domestic/Overseas, Gold ETF) crossed with 7 goal types. Inline panel-review comments record the curation rationale; fallback chain `MF_SUITABILITY_MATRIX[category] → DEFAULT_MF_SCORES → GENERIC_SUITABILITY_MATRIX[displayType] → DEFAULT_SCORES`. *File:* `services/goals/goalsync/goalsync-suitability.service.js`.

**Dual-language calculation libraries with operational parity.** Retirement-corpus and emergency-fund math live in two internal versioned packages — `@finwiser/retirement-calc` v2.0.0 (Node) / `retirement_calc` 2.0.0 (Dart) and `@finwiser/emergency-calc` / `emergency_calc` v1.0.0 — with line-by-line mirrored algorithms (real-return rate conversion, annuity-PV factor with `r ≈ 0` branch, deferred-income discounting, SIP solved from FV-of-annuity), identical version + engine-name strings stamped into every result object (`retirement_calc_v2 2.0.0`), and mirrored test cases on each side (same `test(...)` names and inputs — 18/18 for emergency-calc; retirement-calc shares the core cases). The backend installs the Node package as a monorepo `file:` dependency and the Flutter client consumes the Dart package via path dependency, so server and client are sourced from the same files and cannot drift. *Files:* `shared_retirement_calc/{nodejs,dart}/`, `shared_emergency_calc/{nodejs,dart}/`.

---

## 8. Cross-Cutting Engineering

**Idempotency at every boundary.** SIG_V1 transaction signatures (M1), dirty-flag analytics cache (M2), eight-state classification machine (M3), and SHA-256 input-hashed recommendation snapshots (M4) — every write path is replayable.

**Anti-stampede patterns.** In-flight Promise dedup on the AA keystore and the analytics-cache compute path; atomic `findOneAndUpdate` upserts on snapshots and the FY-gains tracker; MongoDB-backed distributed locks (`utils/distributed-lock.js`) coordinate cron jobs under PM2 cluster mode.

**Three-layer testing.** 230+ Jest unit/integration suites; 21 golden profile fixtures (`family_hub.coherent_exit`, `stable_salaried.persistent_blocker`, `freelancer_dry_month`, …) replayed through the full ratio + diagnostic engine with regression, behavioural, and semantic assertions; an LLM prompt-evaluation harness (`scripts/eval-prompts.js`) scores advisor outputs on a 5-axis rubric with hard-fail thresholds.

**Append-only audit + replay (two-tier).** Operational tier: `calculationauditlogs` (90-day TTL) records `{engine, version, params, results, performance, reconciliation}` for every M4 decision and powers anomaly detection (sudden value change, slow calc, frequent reconciliations). Regulatory tier: `legalretentionartifacts` (~7-year retention, pre-save immutable) holds the snapshot required for SEBI RIA record-keeping under Reg. 19. `OutgoingAPILog` redacts secrets but captures every AA round-trip with JWS-signature length-stamping; the AA replay harness re-runs real sandbox sessions through the categorisation tier orchestrator and emits per-tier accuracy + confidence-distribution metrics.

**Security posture.** TLS 1.2+ end-to-end with mTLS via SahamatiNet for inter-entity AA traffic; JWE/JWS via `node-jose` (X25519/ECDH, AES-GCM) on the AA payload contract; MongoDB CSFLE for PAN, mobile, and financial PII at rest, with a plugin that refuses to no-op in production; JWT short-lived access + refresh tokens validated against JWKS; Helmet, CORS, and `express-rate-limit` (Redis-backed) on the public API; a PII-access middleware logs every sensitive read. The Sahamati ReBIT 2.1.0 certification (72 / 72 scenarios) is the audited baseline behind these controls; the certification harness runs in CI via `npm run cert:validate`.

---

## 9. Tech Stack

| Layer | Stack |
|---|---|
| Mobile | Flutter ≥ 3.0 / Dart ≥ 3.0 · `provider` (state) · `get_it` (DI) · `dio` + `http` (networking) · `hive` + `hive_flutter` (offline cache, pending-categorisation queue) · `flutter_secure_storage` (tokens, AA refs) · `eventsource` (SSE for advisor) · `firebase_messaging` (push) · `smart_auth` (SMS OTP autofill via Google Consent + Retriever APIs) · `fl_chart` · Rive · versionCode auto-derived from `git rev-list --count HEAD` in CI |
| Backend | Node.js 20 LTS · Express 4.21 · Mongoose 8.9 · Bull (queues) · Redis (managed — cache, rate-limit, queue backing) |
| Database | MongoDB Atlas (Mumbai) · CSFLE field-level encryption for PAN / mobile / PII |
| Data sources | Account Aggregator (Saafe + Finvu) · Gmail Push via Pub/Sub · PDF (`pdf-parse` + `cheerio`) · Experian via IDSPay |
| Market data | AMFI instrument master · `mfapi.in` NAV history |
| Infrastructure | OCI Mumbai (Ubuntu 22.04 LTS) · PM2 supervisor · Cloudflared (UAT only) |
| Security | TLS 1.2+ · mTLS via SahamatiNet · JWE/JWS via `node-jose` (X25519/ECDH, AES-GCM) · JWT with JWKS · Helmet · `express-rate-limit` + Redis store |
| Observability | Pino structured JSON · Sentry · Prometheus (`/metrics`) · Datadog APM · Slack + PagerDuty alerting |

**Why these picks (non-obvious choices).**

- **MongoDB Atlas over Postgres.** FI data shapes evolve frequently across AA versions; document-oriented schema absorbs this without migrations. CSFLE is a first-class primitive for PAN, mobile, and financial PII at rest.
- **OCI Mumbai over AWS Mumbai.** Data residency for SEBI / RBI alignment, predictable egress pricing, and free-tier compute that meets the workload at current MAU.
- **Bull + Redis over a managed cloud queue.** Single-tenant control of dead-letter handling and retry semantics; Redis is already in the stack for cache and rate-limit, so the operational surface stays small.
- **PM2 fork mode over containers.** Single-service single-region deployment; container orchestration overhead is unjustified at current scale and would slow boot (currently 3.5–8.5 s). Deferred until horizontal scaling is needed.

---

## 10. Deployment & Reviewer Access

**Production.** Single Node.js service supervised by PM2 on Oracle Cloud Infrastructure (Mumbai, Ubuntu 22.04 LTS). TLS terminates at the OCI infrastructure layer; the Node process listens on the internal interface only. MongoDB Atlas (Mumbai) with CSFLE for PII fields. Redis (managed) for cache, queues, and rate-limit state. Deployment via SSH + `git pull` + `pm2 restart`; health endpoint `GET /health`. Boot time 3.5–8.5 s. Latencies are tracked in Datadog with per-endpoint dashboards (available to reviewers on request); representative ballpark — API responses < 500 ms p95, AA fetch end-to-end 8–25 s depending on FIP, weekly peer-ranking cron ~10–15 min for ~14K schemes.

**Environments.** Three tiers — local dev (Cloudflared exposes the dev host to AA sandbox callbacks), UAT / sandbox (Saafe + Finvu sandbox, IDSPay sandbox mode, isolated database), and production. Database isolation is enforced by the `DB_NAME` env var (allowed: `main | finvu | saafe`); AA flows are validated end-to-end against sandbox before any production promotion.

**CI/CD.** Honest state: pre-commit hooks (lint, format), manual UAT smoke pass, then SSH + `git pull` + `pm2 restart`. Rollback is `git revert` + redeploy (sub-10 s boot makes this practical). A migration runner under `scripts/migrations/` gates breaking schema changes via an explicit checklist. Container build pipeline and blue/green deploys are deferred until horizontal scaling is in play.

**Secrets.** ~80 environment variables in a single gitignored `.env` on the OCI host; PM2 ecosystem config carries only `NODE_ENV / PORT / HOST`. Mock credentials refuse to boot in production via `assertSafeBureauConfig` and an `EXPERIAN_USE_MOCK × NODE_ENV` guard. CSFLE master key managed by `mongodb-client-encryption`; rotation procedure documented in the appendix but not yet exercised.

**Scaling posture.** Single-node by design at current MAU. First choke points under a 10× traffic spike: (a) Bull worker concurrency on the AA decrypt path (CPU-bound), (b) MongoDB Atlas connection pool sized for one Node process, (c) Sahamati AA fair-use throttle of 45 calls/FIP/month, which limits regardless of compute. Horizontal scaling — a second OCI instance behind a load balancer sharing Bull/Redis — is a deferred operational change, not an architectural one: distributed locks are already MongoDB-backed for the multi-process case.

**Reviewer access.**
- **Android app:** Google Play Closed Testing → link in the submission form.
- **Test login:** mobile `9876543210` · OTP `123456`. The seeded test account bypasses the production onboarding flow (mobile OTP → SEBI-mandated risk-profile questionnaire → AA consent) so reviewers land directly on a populated ledger.
- **Pre-seeded ledger.** The test account is pre-loaded with representative AA / email / portfolio data — step 1 below lands on a fully materialised dashboard. To see a live ingestion path, use the **Fresh AA fetch** action on the home screen (~60 s end-to-end).
- **Three steps after login:**
  1. **Net Worth tab** → balance sheet, 5-bucket allocation, MF holdings with peer-percentile rank and XIRR accuracy tier
  2. **Goals tab** → tap any goal to see the Next Best Rupee rationale and structured factor breakdown
  3. **Advisor tab** → ask *"where am I spending the most?"* or *"should I increase my emergency fund?"* — responses stream via SSE
- **Technical questions:** `chandrachudasarma@gmail.com`

---

## 11. Limitations

- **Android only.** iOS deferred.
- **Closed Testing.** Not yet a public Play Store release.
- **Single region.** OCI Mumbai. Disaster-recovery is documented but the production deployment is not multi-region.
- **Credit Bureau** (Experian via IDSPay) went live 2026-05-11 — early production data volume.
- **AA throttle** of 45 calls per FIP per month applies under Sahamati fair-use during onboarding.
- Detailed architecture, full data model, cron schedule, retention tiers, security implementation, and decomposition history are in the linked **Detailed Architecture Appendix** (`TECHNICAL_DOCUMENTATION.md` in the production repo).

---

*Registration granted by SEBI, certification by Sahamati, and registration with FIU India in no way guarantee the performance of the intermediary or provide any assurance of returns to investors. SEBI RIA registration is mandatory for advisory services; it is not an endorsement of the platform.*
