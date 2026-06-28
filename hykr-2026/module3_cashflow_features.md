# Module 3 — Categorisation, Cashflow & Advisor — Brief-Ready Features

> Investigation date: 2026-05-13 — verified directly against `finwiser-production/Finwiser_backend/`.

## Strongest features (7, ranked by engineering depth)

### 1. Multi-stage categorisation pipeline with an 8-state `classificationState` machine

**Brief-ready one-liner:** Every transaction moves through a persisted state machine — `raw → evidence_extracted → hard_matched | auto_classified | question_pending → user_corrected | llm_enriched | consensus_locked` — enforced by guard rails (hard-matched and question-pending transactions never re-enter tier evaluation), so categorisation outcomes are auditable as state transitions rather than overwritten fields.

**Evidence:**
- `models/transaction.model.js:91-96` (enum definition, persisted per-txn)
- `services/categorization/tiers/tier-orchestrator.js:53-79` (Guard Rail #1: hard-matched and question-pending txns short-circuit)
- `services/categorization/hard-match/hard-match.service.js:273` (sets `classificationState: 'hard_matched'`)

**Why this signals real engineering:** A typed state machine on the canonical record makes the pipeline replayable and reversible; competing apps treat categorisation as a single mutable string.

---

### 2. Six-tier short-circuit orchestrator (P0–P6) with per-tier activation predicates and env-tunable thresholds

**Brief-ready one-liner:** After hard-match misses, transactions flow through a deterministic priority cascade — P0 scoped Known-Contact memory → P1 EWMA cross-user consensus → P2 merchant lexicon → P2B zero-shot NLI → P4 user history → P5 cadence detection (CV ≤ 0.20) → P6 fallback — where each tier has its own activation predicate (e.g. P1 requires `totalWeightedVotes ≥ 20 ∧ agreement ≥ 0.70 ∧ ¬pivotDetected`), its own `confidenceCap`, and a `decisionPath` audit string (`P1→P2→P2B:win@P2B`) written to every classification.

**Evidence:**
- `services/categorization/tiers/tier-orchestrator.js:202-456` (tier loop, `checkTierActivation` switch, `decisionExplanation` payload)
- `utils/categorization-config.js:15-56` (`TIER_CONFIG` — every threshold env-overridable: `P1_MIN_WEIGHTED_VOTES`, `P2B_MIN_MODEL_SCORE`, `P5_MAX_CV`, …)
- `services/analysis/categorization-reputation.service.js:99-150` (P1 weighted consensus via EWMA: `userWeight × timeDecay` per vote)

**Why this signals real engineering:** Short-circuit priority + per-tier activation predicates is how a classifier stays explainable under load; max-confidence-wins (the alternative) is opaque. Every threshold lives in `process.env`, so policy changes ship without code changes.

---

### 3. Probabilistic 9-intent classifier + ask-vs-classify policy + 7 structured question types

**Brief-ready one-liner:** A standalone intent classifier emits `{intentType, intentConfidence, intentAmbiguity, intentAlternatives}` over 9 intents (`CASH_WITHDRAWAL`, `SELF_TRANSFER`, `CREDIT_CARD_PMT`, `P2P_OUTGOING`, `P2P_INCOMING`, `INVESTMENT`, `LOAN_EMI`, `ORG_PAYMENT`, `MERCHANT_PURCHASE`) using a 50+ UPI PSP domain table; the ask-vs-classify policy then routes to `AUTO_CLASSIFY | ASK_USER | DEFER` based on ambiguity + amount thresholds, and the question orchestrator emits one of 7 structured question payloads (e.g. `P2P_OUTGOING_MEANING`, `CASH_USE`, `RECURRING_COUNTERPARTY_RESOLUTION`) with direction-aware (DEBIT/CREDIT) option sets and `allowSplit` semantics for multi-category allocation.

**Evidence:**
- `services/categorization/intent/intent-classifier.js:83-194` (probabilistic output, ambiguity rules, `requiresReview()` threshold-driven)
- `services/categorization/policy/ask-vs-classify-policy.js:38-90` (cash-withdrawal always asks; ₹500 noise floor; ambiguity bands)
- `services/categorization/questions/question-orchestrator.service.js:33-180` (7 types, `optionsByDirection`, `allowSplit`, no raw PII in payloads)

**Why this signals real engineering:** Most apps treat UPI as a single channel; we split channel from intent and turn ambiguity into a question-flow contract instead of a misclassification.

---

### 4. Ratio engine + two-layer coherence gate (validity → hard blockers → weighted score)

**Brief-ready one-liner:** A pure-function ratio engine computes 13 financial ratios across 3 groups (Core Health: `income_coverage`, `essential_burden`, `rigidity`, `savings_rate`, `debt_burden`, `investing_habit`; Drift: `outflow_spike`, `category_drift`, `largest_debit_shock`, `new_counterparty_pct`; Data Quality: `explainability`, `transfer_confidence`, `account_coverage`) from a single MongoDB facet aggregation; the coherence gate then runs three checks in order — validity (≥5 computable ratios, at least one load-bearing — `income_coverage` or `savings_rate` — at least one data-quality ratio, and ≥3 non-drift ratios), hard blockers (`income_coverage < 0.3 ∨ > 2.5`, `explainability < 0.6`), and a weighted in-range score (Core 60% / DQ 30% / Drift 10%) — and only emits a coherence score when validity holds.

**Evidence:**
- `services/analysis/financial-ratio.service.js:22-56` (`ANOMALY_THRESHOLDS`, `HARD_BLOCKERS`, `WEIGHTS`, `CORE_HEALTH`, `DATA_QUALITY`, `DRIFT_RATIOS`, `LOAD_BEARING`)
- `services/analysis/financial-ratio.service.js:212-431` (`computeRatios`, `detectAnomalies`, `computeCoherence` — two-layer)
- `services/analysis/financial-ratio.service.js:507-541` (`computeTemporalConsistency` — counterparty-level consistency score)

**Why this signals real engineering:** Single-metric gates are noisy; a validity check + load-bearing requirement + weighted aggregation is the difference between a real diagnostic and a number on a dashboard. Coherence ≥ 0.75 + coverage ≥ 0.80 + no blockers is the explicit exit condition for an advisor session (`shouldCompleteSession`, lines 555-593).

**Doc correction:** the current §6.3 says "16 ratios in 4 groups" — actual code is **13 ratios in 3 groups** (plus a separate temporal-consistency sub-score). The brief should match the code.

---

### 5. 7-trait context profile × 5-ratio insight matrix with cross-session memory

**Brief-ready one-liner:** The trait detector computes continuous 0–1 scores for 7 traits — `salaried`, `family_hub`, `irregular_income`, `incomplete_account`, `investor`, `transfer_heavy`, `reimbursement_heavy` — from both observed signals (counterparty concentration, monthly-income CV, essential-counterparty count) and declared evidence (advisor diagnostic answers, `moneyFlowPattern`), with a `TRAIT_RELEVANCE` table mapping `(ratio, direction)` → `[{trait, weight, reason}]` across 5 anomaly-bearing ratios, and per-`(ratio, direction, trait)` insight templates that swap between `assert` (declared evidence — confident phrasing) and `soften` (inferred only — hedged phrasing). Traits confirmed in one session persist to `user.confirmedTraits` and are re-applied as declared evidence in the next.

**Evidence:**
- `services/analysis/context-profile.js:54-378` (seven `_detect…Signal` functions, each emitting `{score, observed, declared}`)
- `services/analysis/context-profile.js:392-467` (`computeContextProfile`, `_applyConfirmedTraits` — cross-session memory)
- `services/analysis/interpretation-policy.js:28-72` (`TRAIT_RELEVANCE` — 5 ratios × 7 traits)
- `services/analysis/interpretation-policy.js:79-200+` (`CONTEXT_INSIGHT_TEMPLATES` — assert/soften pair per `(ratio, direction, trait)`)
- `services/advisor/diagnostic-constants.js:19-43` (`REASON_TO_TRAIT` — diagnostic answer → confirmed trait)

**Why this signals real engineering:** Trait inference + cross-session persistence is the difference between an advisor that re-asks you "do you support family?" every visit and one that doesn't. The `assert`/`soften` split is verbal calibration — the model commits to a fact only when declared evidence exists.

---

### 6. Diagnostic engine — context-aware suppression, persistent-blocker promotion, AI-with-structured-fallback

**Brief-ready one-liner:** After every advisor answer, `shouldAskDiagnostic` compares before/after coherence and decides whether to ask a follow-up — but it also tracks (a) **new** hard-blocker crossings (which bypass the "coherence improved" gate), (b) **persistent** blockers from session start that have survived ≥3 answers, and (c) 5 severity levels (`genuine`, `softened`, `expected`, `fully_explained`, `acknowledged_unusual`) that suppress anomalies the user has already explained — and even when suppressing, never lets a user's "explanation" override an *active* hard blocker because data unusability is independent of cause; the question itself is generated AI-first with a guaranteed structured-options fallback so the option contract holds even when the LLM fails.

**Evidence:**
- `services/advisor/diagnostic-engine.js:32-123` (coherence-improved gate, new vs persistent blockers, severity suppression with `activeBlockerSet` override)
- `services/advisor/diagnostic-engine.js:137-216` (AI path → static fallback, both paths log option arrays for measurement)
- `services/advisor/diagnostic-engine.js:231-298` (`applyDiagnosticAction` — `EXPLANATION_ACTIONS` vs `DATA_CHANGE_ACTIONS` split → confirmed-trait promotion)

**Why this signals real engineering:** Saying "I have high EMIs" should make a debt-burden alert stop nagging, but should not make a broken income-coverage blocker disappear. Encoding that distinction in code (and shipping it with a fallback path) is the kind of thinking quality reviewers look for.

---

### 7. Counterparty entity ledger — fingerprinted identity resolution + atomic running-balance accumulation

**Brief-ready one-liner:** Transactions are resolved to a stable `CounterpartyEntity` via a cascade — VPA alias → phone alias → name prefix (6-char) → HMAC identity fingerprint — with merge-conflict detection (VPA→A and phone→B as distinct entities triggers a surfaced conflict), additive alias growth across observations, and an append-only ledger of 10 typed entries (`reimbursable_debit`, `loan_credit`, `sorted_credit`, `reversal_credit`, `merge_adjustment`, …) where balance and aggregate stats (`runningBalance`, `totalOutgoing`, `totalIncoming`, `txnCount`) are updated atomically inside a MongoDB multi-document transaction with WriteConflict retry.

**Evidence:**
- `services/counterparty/counterparty-identity.service.js:29-172` (`extractSignals`, `findByAliasMatch | findByNamePrefix | findByFingerprint`, `detectMergeConflict`, `growAliases`)
- `services/counterparty/counterparty-ledger.service.js:19-58` (`ENTRY_SIGNS`, `AGGREGATE_DELTAS`, reversal-pair table — write-offs ≠ income, reversal-debit ⇒ −totalIncoming)
- `services/counterparty/counterparty-ledger.service.js:82-160` (`withTransaction(fn)` wrapper, `createEntry` atomic write of entry + entity update)

**Why this signals real engineering:** Most personal-finance apps store payee names as freeform strings and recompute balances by re-summing the full table. A typed-entry ledger with atomic balance accumulation is bookkeeping discipline applied to a graph of resolved entities — and it survives renames, account changes, and merges without losing history.

---

## Bonus engineering signals to mention in passing

- **CoV-based surplus stability inside MongoDB.** `MonthlyCashFlowSnapshot.getStabilityMetrics` runs `$stdDevPop` over `computedSurplus` and divides by the mean in the same `$project` stage to compute the coefficient of variation; `isStable` is then a thresholded boolean (`stdDevPct < 0.20`). The application never touches the values. (`models/monthly-cashflow-snapshot.model.js:211-258`)
- **Three-layer test discipline.** Layer 1: ~230 Jest unit/integration suites. Layer 2: 21 golden profile fixtures (`test/fixtures/profiles/*.json`, e.g. `family_hub.coherent_exit`, `stable_salaried.persistent_blocker`, `freelancer_dry_month`) replayed through the full ratio + diagnostic engine and asserted across three categories — regression (ratio bands), behavioural (exit type, diagnostic count), and semantic (load-bearing ratio relations). Layer 3: prompt evaluation harness (`scripts/eval-prompts.js`) scores LLM outputs against golden examples with a 5-axis rubric (intent match, tone, conciseness, option alignment, empathy) and pass / hard-fail thresholds. (`test/intelligence-engine/profile-simulation.test.js`, `scripts/eval-prompts.js:25-39`)
- **SSE streaming with its own circuit breaker.** A `CircuitBreaker` instance (3 failures / 5-min cooldown) lives entirely separate from the batch LLM pipeline; a master `AbortController` enforces a 12-s ceiling; `Promise.race` enforces a 5-s first-token timeout; tokens are dispatched as `advisor_token` events until completion. On any failure path — circuit open, missing SSE connection, first-token timeout, mid-stream abort — a template `advisor_fallback` event is dispatched and the message is persisted to the session. (`services/advisor/advisor-streaming.service.js:34-149`)

---

## Anti-features — DROP or REWRITE in current doc

- **"AI‑powered transaction categorisation"** — replace with the multi-stage pipeline framing above (state machine + 6 tiers + intent classifier + ask-vs-classify policy + question orchestrator).
- **"Smart financial advisor"** — replace with the ratio + trait + coherence + diagnostic framing.
- **"16 ratios in 4 groups"** — INACCURATE. Code has **13 ratios in 3 groups** (Core Health 6, Drift 4, Data Quality 3) plus a separate temporal-consistency score. Either fix the count or list the ratios explicitly.
- **"P3 removed"** — partially true: P3 is no longer in `tierPriority`, but `checkTierActivation` still has a P3 branch. Worth a one-line footnote: "P3 (amount-context heuristic) retired from the priority list as P2B zero-shot subsumed it."
- **"264 tests"** — the current doc cites this without structure. Replace with the three-layer testing description above; it tells a reviewer something the bare count doesn't.
- **"Streaming responses via Server-Sent Events (SSE)"** — true but undersells. Mention the dedicated circuit breaker, master abort, first-token timeout race, and template fallback.

## Hidden differentiators — in code but NOT in current doc

- **Cross-user EWMA consensus with pivot detection.** P1 weights every vote by `userWeight × timeDecay`, computes agreement share, and flags `pivotDetected` when a merchant's category mass shifts — at which point P1 stands down and lets lower tiers re-decide. (`services/analysis/categorization-reputation.service.js:99-160`)
- **Per-tier confidence caps.** P1 caps at 0.95, P2B at 0.80, P5 at 0.80, P6 at 0.0 — preventing a weak signal in a high-priority tier from masquerading as a strong result. (`utils/categorization-config.js:15-56`)
- **Safety-net auto-conversion at P6.** If the fallback tier still produces `unclassified`, the orchestrator rewrites the state to `question_pending` instead of leaving it silently un-categorised — meaning the system can never lose a transaction by default. (`tier-orchestrator.js:280-290`)
- **Direction-aware question option sets with split allocation.** `TRANSACTION_PURPOSE` and `RECURRING_COUNTERPARTY_RESOLUTION` switch their option list based on whether the txn is CREDIT or DEBIT; `P2P_OUTGOING_MEANING` and `CASH_USE` allow the user to split one transaction across multiple categories. (`question-orchestrator.service.js:129-180`)
- **HMAC identity fingerprints over PII.** Counterparty resolution uses `generateIdentityFingerprints` over names/VPAs/phone/maskedSuffix so cross-account joins never persist raw identifiers. (`services/counterparty/counterparty-identity.service.js:36-44`)
- **Hard-Match Guard Rail #1.** Transactions that hard-match (CC autopay, salary, EMI, SIP, self-transfer, BNPL, …) are isolated from the tier pipeline entirely — no ML tier can override them. The brief should explicitly call out this isolation property; it's what makes the system robust to model drift. (`tier-orchestrator.js:53-65`, `hard-match.service.js:1-26`)
- **Override beats all.** Once a user corrects a category, `getActiveOverride` short-circuits the entire orchestrator (when `ICS_OVERRIDE_BEATS_ALL` is on) — and the override is scoped (`txnUID` for single, `merchantFp` for similar). (`tier-orchestrator.js:296-334`)
- **`REASON_TO_TRAIT` mapping from diagnostic answers to persistent traits.** When the user picks "I save most of my income," the system not only accepts the anomaly but writes `investor` to `user.confirmedTraits`, which biases the next session's interpretation. Cross-session learning from individual answers. (`services/advisor/diagnostic-constants.js:19-43`)
- **CC bill netting is a calculation-time decision, not a categorisation decision.** `credit_card_bill_payment` is always assigned by hard-match — but `buildTotals` decides at calculation time whether to count it as a transfer (CC data linked → CC line items are the real expenses) or an expense (no CC data → bill is the only signal). Two sources of truth never collide because routing happens after categorisation. (`financial-ratio.service.js:124-139`, `hard-match.service.js:63-103`)
