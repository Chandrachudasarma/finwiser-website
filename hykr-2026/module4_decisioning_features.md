# Module 4 — Goals & Decisioning — Brief-Ready Features

> Scope: pure-engineering features of M4 (Goals, Suitability, Next Best Rupee, Tax,
> Nudges, Audit, Risk Profile, Shared Calc Libs). Ranked by engineering depth.

## Strongest features (7, ranked)

### 1. Next Best Rupee — utility-based goal allocation engine

**Brief-ready one-liner:** Per-user goal allocation engine that ranks all active goals by an explicit multiplicative utility score — `delta × mustHave × emergencyBoost × urgency × stability × policy × progress × priority` — where `delta` is the marginal SIP-confidence improvement of allocating ₹X to that goal; result is sorted deterministically (utility desc → mandatory → months-to-target asc → priority rank → gap desc) and emits a structured rationale (`must_have_bias`, `emergency_underfunded`, `high_urgency`, `within_policy_bands`, `stable_surplus`, `progress_momentum`, …) that is consumable by both UI and audit log.

**Evidence:**
- `Finwiser_backend/services/goals/next-best-rupee.service.js` (the full engine — `calculateUtility`, `calculateSIPConfidenceDelta`, `calculateUrgencyScore`, deterministic sort, rationale generator)
- `Finwiser_backend/services/goals/goal-feasibility.service.js` (the per-goal feasibility input it consumes; surplus stability flag, policy bands status)
- `Finwiser_backend/services/goals/goalsync/goalsync-allocation.service.js` (allocation normalization rules — never scale below 100%, only over)

**Why this signals real engineering:** Multiplicative factor model with named, individually-tunable terms and a deterministic tie-breaker — not a black-box score; every coefficient is auditable and changeable in isolation.

---

### 2. Per-SEBI-category suitability matrix (42 MF sub-categories × 7 goal types)

**Brief-ready one-liner:** Suitability scoring (0–100) per `(goal, asset)` keyed by SEBI mutual-fund sub-category — 42 distinct category rows (Overnight, Liquid, Money Market; Ultra/Low/Short/Med/Long Duration, Floater, Banking & PSU, Corporate Bond, Dynamic Bond, Gilt (incl. 10-yr constant duration), **Credit Risk** (deliberately nerfed for goal allocation per panel review of side-pocketing/below-AA exposure); Large Cap, Large & Mid, Index, Other ETFs, Dividend Yield; Multi/Flexi/Focused/Value/Contra Cap, ELSS; Mid Cap, Small Cap, Sectoral/Thematic; Conservative/Balanced/Aggressive Hybrid, Dynamic Asset Allocation, Multi Asset, Arbitrage (high score for short-horizon goals — debt-like returns, equity taxation), Equity Savings; Solution-oriented Retirement/Children, FoF Domestic/Overseas, Gold ETF) crossed with 7 goal types; fallback chain is `MF_SUITABILITY_MATRIX[category] → DEFAULT_MF_SCORES → GENERIC_SUITABILITY_MATRIX[displayType] → DEFAULT_SCORES`; liquidity score is decoupled and looked up by raw AA `accountType`.

**Evidence:**
- `Finwiser_backend/services/goals/goalsync/goalsync-suitability.service.js` — `MF_SUITABILITY_MATRIX`, `getAssetSuitabilityScores`, `getLiquidityScoreFromType`, `categorizeAssetForGoalLinking`
- `Finwiser_backend/models/goalsync-asset.model.js` — persistence of per-goal suitability scores per linked asset
- `Finwiser_backend/services/goals/goalsync/goalsync-smart-recommendations.service.js` — consumer pipeline (kill-switch → flags → suitability → tier → emergency-fund constraints → surplus check → stability snapshot)

**Why this signals real engineering:** Most "robo" platforms collapse mutual funds into a single asset class. This treats 42 SEBI categories as distinct decision objects, with the embedded review trail (Credit Risk nerf, Arbitrage uplift) showing the matrix is curated, not generated.

---

### 3. Dual-language calc libraries — Node + Dart, version-stamped, test-mirrored

**Brief-ready one-liner:** Retirement-corpus and emergency-fund math live in two internal versioned packages — `@finwiser/retirement-calc` v2.0.0 (Node) / `retirement_calc` 2.0.0 (Dart) and `@finwiser/emergency-calc` / `emergency_calc` v1.0.0 — with identical algorithms (real-return rate conversion, annuity-PV factor with `r ≈ 0` branch, deferred-income discounting, SIP solved from FV-of-annuity), identical version + engine-name strings stamped into every result (`retirement_calc_v2 2.0.0`), and mirrored test cases on each side (same case names and inputs — 18/18 for emergency-calc; retirement-calc shares the core cases); the backend installs the Node package as a monorepo `file:` dependency (and the Flutter client consumes the Dart package via path dependency), so server and client are sourced from the same files and cannot drift.

**Evidence:**
- `shared_retirement_calc/nodejs/lib/retirement-calculator.js` and `shared_retirement_calc/dart/lib/src/retirement_calculator.dart` (line-by-line mirror — same 7 steps, same `_annuityFactor`, same `_calculateIncomePV` with delay-discounting)
- `shared_retirement_calc/nodejs/test/retirement-calculator.test.js` (7 cases) and `shared_retirement_calc/dart/test/retirement_calculator_test.dart` (5 cases) — overlapping on the core scenarios including the "earlier retirement needs more corpus" regression; emergency-calc tests are strictly 18/18
- `Finwiser_backend/services/goals/retirement-calc-adapter.js` (server consumes the package — `const { RetirementCalculator } = require('@finwiser/retirement-calc')`; `Finwiser_backend/package.json` declares `"@finwiser/retirement-calc": "file:../shared_retirement_calc/nodejs"`)

**Why this signals real engineering:** Two-language parity is genuinely hard. The version string is the contract, the mirrored test file is the enforcement, and the monorepo `file:` / path-dependency installation is the operational guarantee — three independent mechanisms.

---

### 4. Risk-profile scoring — capacity × tolerance with AA-prefilled inputs and divergence rule

**Brief-ready one-liner:** Risk profile composed of `Capacity = Q3 + C1 + C2` (range 3–15) and `Tolerance = Q1 + effective(scene1) + Q5 + Q6 + scene2` (range 5–25); each subscore mapped to a 1–5 band, **final = `min(capacityBand, toleranceBand)`** (conservative-by-construction) yielding 5 categories tied to explicit `{equity, debt, gold, cash}` min/max bands; `C1` (emergency-fund months) and `C2` (EMI-to-income ratio) are auto-derived from `NetworthSnapshot` deposits ÷ `FinancialProfile.expenses.monthlyAverage` and `FinancialProfile.emiLoanBurden.emiToIncomeRatio` (with manual fallback); the **divergence rule** — if the initial-shock answer (`scene1`, "portfolio down 20%") is ≥2 braver than the sustained-stress answer (`scene2`, "now down 35%, 6 months in"), the stressed answer replaces `scene1` — captures the gap between self-reported and revealed tolerance; stability rule keeps the previous category if a re-profile lands within ±3 total points.

**Evidence:**
- `Finwiser_backend/services/platform/risk-profile.service.js` — `computeRiskScore`, `getCapacityPrefill`, `submitRiskProfile`
- `Finwiser_backend/config/ledger/risk-allocation-bands.js` — the 5×4 allocation bands and the `CAPACITY_BANDS`/`TOLERANCE_BANDS` lookup tables
- `Finwiser_backend/models/platform/risk-profile.model.js` — versioned profiles with `deactivateAll` on resubmit, `acknowledged`/`consentMethod` for audit

**Why this signals real engineering:** Most risk questionnaires sum points; this separates capacity from tolerance, picks the conservative of the two, models the difference between gut-reaction and sustained-stress answers, and prefills two of the inputs deterministically from AA data so the user answers strictly fewer questions.

---

### 5. Recommendation-stability snapshot — input-hashed commitment lock

**Brief-ready one-liner:** Every recommendation run produces a `RecommendationSnapshot` locked for **30/90/180 days** depending on the goal's horizon (`<12 / 12–60 / 60+` months), with a 16-char SHA-256 hash of the engine inputs so a re-run can short-circuit on identical state; only a fixed allowlist of triggers bypasses the lock — `user_changed_goal`, `new_asset_added`, `fund_deteriorated` (REVIEW/DRIFT only), `surplus_changed` (>20%), `portfolio_drawdown` (horizon-keyed thresholds 5%/10%/25% from finance panel), `user_requested_refresh`, `goal_completed`, `lump_sum_available`; persistence is a single `findOneAndUpdate` with `$setOnInsert`, so concurrent re-runs converge on one snapshot.

**Evidence:**
- `Finwiser_backend/services/goals/recommendation-stability.service.js` — `getCommitmentDays`, `shouldReEvaluate`, `computeInputHash`, `storeSnapshot` (atomic upsert), `DRAWDOWN_THRESHOLDS`
- `Finwiser_backend/services/goals/goalsync/goalsync-smart-recommendations.service.js` — the smart-recs pipeline that checks the snapshot before running and returns it when locked
- `Finwiser_backend/models/recommendation-snapshot.model.js` — the persisted snapshot with `inputHash`, `lockedUntil`, `status`, `supersededReason`

**Why this signals real engineering:** Fights recommendation churn with three orthogonal mechanisms — time-based commitment, content-hash short-circuit, explicit trigger allowlist — instead of one fuzzy heuristic.

---

### 6. Calculation audit log — append-only, version-stamped, anomaly-aware

**Brief-ready one-liner:** Every goal calculation writes to `calculationauditlogs` (Mongoose-defined collection with **TTL `expires: '90d'`**), recording `{ userId, goalType, operation, calculationEngine, parameters, results, performance, reconciliation, metadata }` — enough to deterministically replay any prior decision against the same calc-engine version; aggregation queries derive a per-user health score that penalises reconciliation rate >5%/10%, calc time >500/1000ms, and detects `sudden_value_change` (>20% corpus delta), `slow_calculation`, and `frequent_reconciliations` (≥3 in a 5-call window).

**Evidence:**
- `Finwiser_backend/services/platform/calculation-audit.service.js` — schema with `expires: '90d'`, `logCalculation`, `getCalculationStats` ($group pipeline), `detectAnomalies`, `calculateHealthScore`
- Consumed by `services/goals/retirement-calc-adapter.js` and the emergency-fund planner — engine name stamped from `RetirementCalculator.engineName` so the audit row carries the exact algorithm version that produced the result
- `Finwiser_backend/models/recommendation-snapshot.model.js` complements it for the snapshot-level audit trail

**Why this signals real engineering:** A "we log every decision" claim is cheap. Logging *with version + parameters + performance + reconciliation diff* is what makes deterministic replay actually possible.

---

### 7. LTCG ₹1.25L exemption tracker + three-regime tax classifier

**Brief-ready one-liner:** Per-`(userId, financialYear)` accumulator in `fy_gains_tracker` (composite unique index) with `$inc`-driven running totals for `ltcgRealizedINR`, `stcgRealizedINR`, `debtGainsRealizedINR`, `omfLtcgRealizedINR` plus an append-only `events[]` audit trail; downstream `redemption-cost.service.js` consumes `ytdLTCGRealizedFY` and applies `taxableGain = max(0, gain − max(0, 125000 − used))` for equity LTCG only — Section 50AA SMF gains route to slab rate, OMF LTCG routes to flat 12.5% (Section 112, no ₹1.25L exemption), governed by an explicit three-regime classifier (`equity / smf / omf`) sourced from `mf-category-registry` with a documented `omf` safe-default fallback (under-tax is caught by a CA, over-tax silently costs the user money).

**Evidence:**
- `Finwiser_backend/models/platform/fy-gains-tracker.model.js` — `currentFY()` (Apr–Mar boundary), `getOrCreate`, `recordGain` (single atomic `findOneAndUpdate` with `$inc` + `$push` + `$setOnInsert`)
- `Finwiser_backend/config/ledger/tax-regime-classifier.js` — `resolveTaxRegime` with 4-step fallback chain; Budget 2024 / Finance (No.2) Act 2024 references
- `Finwiser_backend/services/ledger/portfolio/redemption-cost.service.js` lines 109–142 — exemption arithmetic on the redemption side; ELSS 3-year per-installment lock-in check is in the same file (`checkLockIn`)

**Why this signals real engineering:** The exemption math is portfolio-wide and stateful (consumes across redemptions in the same FY), not per-transaction; combined with three tax regimes and an explicitly-conservative classifier default, this is real Indian-tax engineering, not a textbook formula.

---

## Anti-features — DROP from current doc

- **"SEBI-aligned suitability scoring"** — frames a 42×7 category matrix as a regulatory checkbox; reviewers won't be impressed by alignment, they'll be impressed by the matrix itself. Lead with the matrix.
- **"SEBI-mandated risk questionnaire results"** in the M4 components table — reframe as "capacity-vs-tolerance scoring with AA-prefilled inputs and divergence rule." The mandate is the trigger; the design is the substance.
- **"YTD LTCG realised per FY (₹1.25 L exemption tracking)"** is undersold — the FY-accumulator + three-regime classifier + section-50AA-aware redemption math is one of the strongest pieces and currently reads like a row in a config table.
- **"Smart goal recommendations"** (if used anywhere) — replace with "Next Best Rupee utility ranking" and quote the actual formula.
- Bare "Compliance-grade audit log" framing — say "append-only 90-day TTL log, every calc carries `{engine, version, params, results, performance, reconciliation}` → deterministic replay."

## Hidden differentiators — in code but NOT in current doc

- **The Next Best Rupee utility formula is explicit and named** (`delta × mustHave × emergencyBoost × urgency × stability × policy × progress × priority`) with deterministic tie-breakers and **structured rationale codes** (`must_have_bias`, `emergency_underfunded`, `within_policy_bands`, `progress_momentum`, …). The §7 table only says "utility-based ranking" — quote the formula.
- **Dual-language calc parity is real and operational**: identical version strings + engine names embedded in every result object (`retirement_calc_v2 2.0.0`), mirrored test files (same `test(...)` names on both sides — verified: 7 Node + 5 Dart for retirement, 18 + 18 for emergency), and **monorepo `file:`/path-dependency installation** so server and Flutter client are sourced from the same files (not vendored copies). The §7 description just says "versioned, dual-language for parity."
- **Recommendation stability snapshots with SHA-256 input hash** (`computeInputHash`) — cheap "has anything changed?" gate that avoids re-running the whole engine when inputs are byte-identical; horizon-dependent drawdown thresholds (5/10/25%) per finance-panel review.
- **42-row MF category matrix with documented panel adjustments** — the inline comments (`// Credit Risk Fund: nerfed scores — panel D-1`, `// Arbitrage Fund high for emergency/car (debt-like returns, equity taxation)`) prove the matrix is curated and reviewed, not auto-generated.
- **Risk profile divergence rule** (initial-shock vs sustained-stress) and **AA-prefilled C1/C2 capacity inputs** — currently invisible in the doc; both are non-obvious design choices a technical reviewer will recognise.
- **Three-tax-regime classifier with documented `omf` safe-default fallback** — the "under-tax is caught by CA, over-tax silently costs the user money" comment in `tax-regime-classifier.js` is the kind of reasoning that signals real engineering judgement.
- **Nudge selector pacing system**: global `MIN_DAYS_BETWEEN_NUDGES=3`, `MAX_PER_WEEK=2`, `MAX_PER_MONTH=5`, `COHERENCE_GRACE_DAYS=7`, `CONSECUTIVE_DISMISS_LIMIT=2` plus per-nudge `cooldownDays`/`maxShows`/`suppressUntil`, evaluated against signal-derived `trigger`/`requires`/`suppress` predicates and priority-sorted — multi-tier rate limiting, not a single throttle.
- **Calculation-audit anomaly detector** computes `sudden_value_change` (>20%), `slow_calculation` (>1000ms), `frequent_reconciliations` (≥3 in 5) and folds them into a per-user `healthScore` — observability beyond plain logging.
- **ELSS lock-in is per-SIP-installment**, not per-holding (`checkLockIn` in `redemption-cost.service.js`) — captures the actual 3-year-from-each-purchase rule that AMCs apply.
