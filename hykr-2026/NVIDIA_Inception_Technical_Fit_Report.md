# Finwiser × NVIDIA Inception — Technical Fit Report

> **Purpose:** Map Finwiser's four backend modules to NVIDIA Inception's *technical*
> resources (NIM, Triton, TensorRT-LLM, RAPIDS, DGX Cloud, DLI, Developer Forums),
> grounded in the actual production code — not the pitch briefs.
>
> **Method:** Four module-specialist passes read both the brief docs
> (`module{1..4}_*_features.md`) and verified them against
> `finwiser-production/Finwiser_backend/` (+ `shared_retirement_calc/`).
> Every claim below is tied to a file and, where useful, a line range.
>
> **Honesty principle:** NVIDIA reviewers grep for over-claiming. This report
> states plainly where GPU/ML genuinely fits *and* where it does not. The
> "does-not-fit" sections are deliberate — they read as engineering maturity.
>
> **Compiled:** 2026-05-27

---

## 0. Executive summary

### The single architectural fact that drives the whole strategy

Almost every "AI" feature in the product routes through **one OpenAI US-endpoint
client** — `utils/openai-client.js:39` (`new OpenAI({apiKey})`, no `baseURL`
override) — already wrapped by a **privacy gateway**, **per-feature circuit
breakers**, and **template fallbacks**.

**Consequence:** swapping external LLM calls for self-hosted **in-region NVIDIA NIM
endpoints is a configuration change (`baseURL`), not a rewrite** — and the
fallback machinery that makes self-hosting operationally safe *already exists in
production*. This is the spine of the NVIDIA fit.

### The positioning line for the application

> Finwiser is a regulated, Account-Aggregator-native AI financial decisioning
> system: transformer-based transaction categorisation, GPU-amenable analytics
> over ~14,000 fund time-series, and explainable financial reasoning — moving to
> privacy-preserving in-country inference for India's salaried middle class.

That maps directly onto Inception's stated pillars (sovereign inference,
NIM/Triton/RAPIDS, DLI training, cloud credits, GPU infra, VC/GTM) while staying
truthful about what is GPU-relevant versus honest plumbing.

### Top opportunities at a glance (ranked across all modules)

| Rank | Opportunity | Module | NVIDIA resource | Code evidence |
|---|---|---|---|---|
| 1 | Self-host advisor + diagnostic + categorisation LLMs in-region | M3 (+M1 email LLM) | **Llama-3.1-8B / Nemotron NIM** (OpenAI-compatible) | All `gpt-4o-mini` calls swap via one `baseURL`; raw bank-email PAN-adjacent text + financial PII stop crossing to the US |
| 2 | Move P2B zero-shot NLI off CPU | M3 (M1 shares it) | **Triton + TensorRT** (`bart-large-mnli` / `deberta-v3-mnli`) | Code self-throttles: `MEMORY_GUARD_RSS_MB=2200` silently skips the accurate model (`zero-shot-model.service.js:147-154`); ~8s CPU → tens of ms GPU |
| 3 | Batch nightly fund analytics over ~14K NAV series | M2 | **RAPIDS cuDF + cuPy** | Hand-rolled JS OLS run twice/fund × ~10K equity funds; cron wall-clock 10–30 min (`weekly-peer-ranking.job.js:16`) |
| 4 | GPU-parallel Monte Carlo SIP-confidence | M4 | **RAPIDS / CuPy** | Existing single-thread 1000-iter Box-Muller loop (`retirement-fund-planner.service.js:704`) |
| 5 | NL rationale renderer over structured decision codes | M4 | **Small NIM** | Next Best Rupee emits 8 discrete rationale codes; NIM renders, codes stay audit source-of-truth |

---

## 1. NVIDIA Inception technical benefits (with honest caveats)

Drawn from NVIDIA's public pages. None of the below is guaranteed to every member;
many are eligibility-, workload-, region-, or offer-dependent.

| Category | Benefit | Guaranteed to every member? |
|---|---|---|
| Portal | Inception portal access (workload recommendations, training codes, cloud-credit requests) | Yes, after acceptance |
| Training | Free self-paced DLI course codes | Yes; quantity not public |
| Training | Discounted instructor-led DLI workshops | Yes; offer terms vary |
| Technical | SDKs / model libraries / dev platforms (NIM, NGC, Triton, TensorRT-LLM, RAPIDS, NeMo) | Access/recommendation level; exact products vary |
| Support | NVIDIA Developer Forums | Yes |
| Cloud | Free cloud credits from NVIDIA + partners | Request/eligibility-based |
| Cloud | Up to $100K DGX Cloud credits (H100) | **Qualified members only — never claim as entitlement** |
| Hardware/SW | Preferred pricing on *select* products | Select products only; no guaranteed GPU allocation |
| Partners | Exclusive partner offers | Portal/offer-dependent |
| Investor | Inception Capital Connect / VC exposure | Eligibility-based |
| Events | Curated networking (GTC, etc.) | Selected/availability-based |
| GTM | Badges, co-branded assets, market reach | Engagement-based |
| Innovation Lab | 60-day DGX Cloud GPU program | **Selected members only**; reapply after 3 months |

**Branding guardrail.** Acceptable: *"Finwiser is a member of NVIDIA Inception."*
Avoid: "NVIDIA-backed," "NVIDIA-approved," "NVIDIA has validated our product"
unless co-marketing is explicitly granted.

---

## 2. Module 1 — Data Ingestion

### 2.1 What the module is

Ingests financial data from three sources into unified `UnifiedTransaction` records:

- **AA pipeline** (`services/ingestion/AA/`) — ReBIT 2.1.0 Account Aggregator fetch.
  Pure crypto + network: per-session X25519 keypairs (`aa-transport.js:211-229`),
  a BouncyCastle Curve25519 path via `execJava` for mutual-fund FIPs
  (`:236-272`), ECDH→AES-GCM decrypt of `encryptedFI` blobs
  (`fi-data-processor.js`), RFC 7797 detached-JWS verify (`aa-transport.js:329-356`).
  Webhook→fetch state machine with atomic `findOneAndUpdate` queue acquisition
  (`notification-handler.js`); request-scoped DI factory (`aa-factory.js`).
- **Email pipeline** (`services/email/`) — the AI-dense path: source-resolver →
  optional LightGBM ONNX domain classifier → LLM transaction extractor →
  self-learning regex templates → normalisation → ingestion.
- **PDF pipeline** (`pdf-password-resolver.js`, `pdf-statement-processor.js`) —
  bank-specific password candidates via `qpdf`, then `pdf-parse` + regex.
  **No OCR, no vision model.**
- **Credit bureau** (`services/ingestion/credit-bureau/`) — bulkhead → circuit
  breaker → cluster lock → idempotency. Pure HTTPS resilience, zero ML.
- **Cross-source dedup** — `utils/transaction-signatures.js` (SHA-256 + Levenshtein).

### 2.2 GPU/AI surface map — where compute actually lives

| Site | File | What | Today's hardware |
|---|---|---|---|
| Email transaction extraction | `services/email/llm-transaction-extractor.js:216` | `gpt-4o-mini`, batches of 10, temp 0, ~120 tok/email; logs to `email_extraction_training` | **Hosted OpenAI API** |
| Email domain classification | `services/email/source-resolver.js:264+` | second `gpt-4o-mini` call | Hosted OpenAI API |
| LightGBM sender classifier | `services/email/email-classifier.service.js:31-101` | ONNX model, 18-feature vector, sub-ms; cold-start optional (model file not always present; `onnxruntime-node` **not in `package.json`**) | CPU ONNX |
| Zero-shot NLI cascade | `services/analysis/zero-shot-model.service.js:30-34` | MobileBERT-MNLI → BART-large-MNLI (`@xenova/transformers`); used by P2B tier; exercised by the ingestion replay harness | **CPU** (~8s/inference accurate, 2.2 GB RSS guard) |
| Duplicate-prediction model | `services/analysis/duplicate-prediction-ml.js` | hand-rolled logistic regression, JS gradient descent | CPU (trivial) |

**Honest signal:** the only meaningfully GPU-amenable compute is (a) BART-large-MNLI
running on CPU at ~8s/inference with a guard that *skips the accurate model under
load*, and (b) self-hosting the email-extraction LLM. Everything else is hosted
API, a sub-ms tiny model, or pure crypto/network/regex plumbing.

### 2.3 Ranked NVIDIA opportunities for Module 1

1. **Triton + TensorRT for the BART-large-MNLI zero-shot cascade (highest, real).**
   `zero-shot-model.service.js:35` has `MEMORY_GUARD_RSS_MB = 2200` that *skips the
   accurate model* and downgrades to MobileBERT under memory pressure
   (`:146-154`, `layer2Skipped` stat). That is a model too heavy for the host —
   the textbook GPU-offload case. Triton dynamic batching fits the batch-oriented
   `evaluateZeroShot` path and removes the silent accuracy downgrade. Instrumentable
   day one via `getCascadeStats()` and `aa-replay-harness.js`.
2. **NIM to self-host the email extraction LLM (strong, privacy-driven).**
   `llm-transaction-extractor.js` and `source-resolver.js` send *unsanitised* email
   text (the code explicitly needs raw amounts/card numbers, `:181-189`) to hosted
   `gpt-4o-mini`. A Llama-3.1-8B / quantised-Mistral NIM is a drop-in
   OpenAI-compatible endpoint — swap `baseURL` in `utils/openai-client.js`. The win
   is **data residency** (raw PAN-adjacent content leaving India), not GPU need.
3. **RAPIDS / cuDF for the LightGBM retraining pipeline (moderate, offline).**
   The module is *built* for a LightGBM pipeline that doesn't exist yet:
   `email-classifier.service.js` loads an often-absent ONNX file;
   `llm-transaction-extractor.js:279-319` logs to `email_extraction_training` "for
   LightGBM training"; `email-features.js:113` exports `FEATURE_NAMES` "for Python
   training script compatibility." RAPIDS cuDF + GPU LightGBM fits the offline
   training job *when the corpus grows*.
4. **DLI self-paced codes (free, high-leverage):** *Building RAG Agents with LLMs*,
   *Sizing LLM Inference Systems*, *Deploying a Model for Inference at Production
   Scale (Triton)*.
5. **Developer Forums:** Triton (serving MNLI), TensorRT (converting `@xenova` ONNX
   graphs), NIM/NGC (endpoint swap).

### 2.4 Module 1 — where NVIDIA does NOT fit

- **AA crypto transport** (X25519/Curve25519 ECDH, AES-GCM, RSA-SHA256 JWS,
  `aa-transport.js:211-356`) — I/O- and CPU-crypto-bound. No NVIDIA resource.
- **Credit bureau resilience stack** — pure control-flow over MongoDB + HTTPS. Zero ML.
- **PDF password resolver + parsing** — bank-specific candidate strings via `qpdf`
  subprocess + `pdf-parse` regex. **No OCR/vision model** — do *not* claim a NIM-OCR
  fit (it would be a legitimate *future* opportunity only if scanned-image
  statements are added).
- **Transaction signatures + `email-features.js`** — SHA-256, regex, Levenshtein.
- **Self-learning extraction templates** — regex synthesis + degrade/expire state
  machine; their value is precisely that they *remove* LLM calls.
- **`duplicate-prediction-ml.js`** — JS logistic regression over ≤1000 pairs.

---

## 3. Module 2 — Ledger + Investment Intelligence

### 3.1 What the module is

The numerical/financial-compute core. Pure-math layer is DB-decoupled and
unit-tested.

- **Per-scheme NAV analytics engine** — `analytics-compute.service.js` (945 lines):
  trailing returns + CAGR via binary search (`computeReturns` L424); daily log
  returns with split guard `MAX_DAILY_LOG_RETURN=log(1.30)` (L90/L104); annualised
  vol `√248×σ` (note `TRADING_DAYS_PER_YEAR=248`, `financial-constants.js:17`);
  Beta `cov/var` (L178), Jensen's Alpha (L214), geometric-mean Sharpe (L572) +
  weekly-downsampled Sharpe (L580); Information Ratio raw + deflated `IR×(1−1/4N)`
  (L270); quarterly-stepped rolling beat rate (L314); separate debt-fund path (L602).
- **Returns-Based Style Analysis** — `style-analysis.service.js` (383 lines):
  hand-rolled 4-factor OLS `β=(XᵀX)⁻¹XᵀY` via Gaussian elimination + 5×5 inversion
  (`olsRegression` L93, `solveLinearSystem` L155, `invertMatrix` L195),
  floor-and-renormalise (L234), R²≥0.80 gate, drift via a second shifted-window
  regression (L324).
- **Peer-ranking cron** — `peer-ranking.service.js` (587 lines) +
  `weekly-peer-ranking.job.js` (cron `30 20 * * 6`). Iterates every SEBI category ×
  {direct, regular}; ranks, computes distribution stats, upserts to
  `analytics_cache` + `category_stats`; second pass = rolling beat rates;
  `computeImplicitExpenseRatios` (L471) re-pulls NAV per Direct/Regular pair.
  **Job header states ~20–30 min first run, ~10–15 min thereafter** (L16).
- **Dirty-flag analytics cache** — daily NAV append → `markDirty`; `getAnalytics`
  (L856) recomputes on read; concurrent callers deduped via `Map<amfiCode,Promise>`.
- **XIRR** — `xirr.service.js`: Newton-Raphson + bisection fallback over 2–50 cash
  flows; synthetic-remainder + coverage tiering + 80% portfolio gate.
- **Per-lot tax engine** — `lot-tax-computation.service.js`: FY 2025-26 three-regime
  (EOF/SMF/OMF), light arithmetic over a handful of lots/user.
- **5-pillar portfolio score** — `portfolio-score.service.js`: weighted aggregation
  + floor-cap-45; 30s in-flight cache.

### 3.2 Compute-intensity map

| Computation | Location | Heaviness | Batchable across schemes? |
|---|---|---|---|
| Daily log returns + vol + Sharpe | analytics-compute L104-169 | Medium × ~14K | **Yes** |
| Beta/Alpha (cov/var) | L178-216 | Medium × 14K | **Yes** |
| Information Ratio (3Y) | L270 | Light × subset | Yes |
| **Rolling beat rate** | L314-381 | **Heaviest inner loop** | **Yes** |
| **4-factor OLS per equity fund** | style-analysis L93-147 | **Heavy — runs twice/fund × ~10K funds** | **Yes (massively)** |
| **Peer-rank orchestration** | peer-ranking L269-440 | **10–30 min wall-clock** | **Yes** |
| Implicit expense ratio | peer-ranking L471-547 | Medium | Yes |
| Distribution stats | L105-137 | Light | Yes (cuDF groupby/quantile) |
| **XIRR** | xirr.service L82-153 | **Trivial (2–50 flows)** | No |
| Per-lot tax | lot-tax L96+ | **Trivial** | No |
| 5-pillar score | portfolio-score | **Trivial** | No |

**Key fact:** the nightly/weekly pipeline does the *same array math over ~14K
independent NAV series* — embarrassingly parallel, columnar, batchable. The single
best GPU-acceleration candidate in the product. Everything per-user (XIRR, tax,
score) is small-data and GPU-hostile.

### 3.3 Ranked NVIDIA opportunities for Module 2

1. **Batched OLS Style Analysis → cuPy / cuML.** `olsRegression` hand-rolls `XtX`,
   Gaussian elimination, and a 5×5 inversion in pure JS triple-nested loops
   (L102-108), run **twice per equity fund** across ~10K funds. Stack all funds into
   a 3-D tensor and solve every fund's normal equations in one batched
   `cupy.linalg.solve`/`lstsq`. ~20K tiny inverts = exactly where batched GPU linear
   algebra wins.
2. **Rolling beat-rate + per-scheme return/vol/beta as columnar batch → cuDF.**
   `computeRollingReturns` (L314-381) is the heaviest inner loop; `computeTrailingReturn`
   (L54) and `computeDistribution`/`percentile` (L105-137) are per-scheme JS. In cuDF
   the ~14K-scheme NAV table loads as columns; log returns, √248 vol, rolling windows,
   and `groupby().quantile([.25,.5,.75])` become single vectorised calls. Directly
   targets the 10–30 min cron.
3. **DGX Cloud Innovation Lab — 60-day batch-analytics benchmark** (see §6).
4. **DLI: *Accelerating Data Science Workflows with cuDF/cuML*.** Solo-founder
   upskilling; maps 1:1 onto the JS→cuDF/cuPy rewrite.
5. **Developer Forums (RAPIDS/cuDF):** ragged series lengths (NFOs vs 20-yr funds →
   padding/masking) and numerical parity (`√248`, deflation, split guards must pass
   golden-file tests).
6. **Portal workload recommendations + preferred pricing.** Describe the workload
   honestly ("nightly batch financial analytics over ~14K time-series, columnar, no
   deep learning") so the portal routes to RAPIDS/DGX Cloud, not LLM tooling.

**Deliberately NOT recommended:** NIM, Triton, TensorRT-LLM, NeMo — these are
LLM/inference-serving tools; M2 has zero neural-network inference. (`portfolio-score.service.js:32`
imports `LLMService` for *narrative generation*, not the numerical pillars.)

### 3.4 Module 2 — where NVIDIA does NOT fit

- **XIRR** — Newton-Raphson over 2–50 cash flows/holding, per-user, interactive.
  PCIe transfer alone dwarfs the compute. CPU.
- **Per-lot tax engine** — branch-heavy regime classification over a handful of
  lots; GPUs hate branches. CPU.
- **5-pillar score** — weighted sums + floor rule, 30s cache. CPU.
- **Caveat — the cron is partly I/O-bound.** `runFullPeerRanking` re-pulls NAV
  history per scheme *sequentially* from Mongo (L173/L182); backfill is gated by a
  300 ms politeness delay to mfapi.in. GPU accelerates math, not Mongo round-trips.
  The honest architecture is "bulk-load all NAV columns once → GPU batch →
  bulk-write," which also fixes the sequential-fetch antipattern.
- **Scale caveat.** ~14K schemes × ~5K points (~70M cells) fits in CPU RAM today; a
  well-vectorised CPU rewrite would already cut the 10–30 min. Frame the ask as
  *"headroom for daily recompute + richer analytics,"* not "we can't run today."

---

## 4. Module 3 — Categorisation, Cashflow & Advisor

### 4.1 What the module is — the most model-intensive module

Two model families with very different deployment characteristics:

- **In-process, in-region ML (already sovereign):** the P2B zero-shot NLI classifier
  runs *locally* on the OCI Mumbai box via `@xenova/transformers` (ONNX/WASM,
  CPU-bound) — `mobilebert-uncased-mnli` (fast) escalating to `bart-large-mnli`
  (accurate). No data leaves the server for this path.
- **External LLM API (egress to US):** every other "AI" feature — advisor streaming,
  AI diagnostic question generation, candidate questions, free-text classification,
  budget/narrative/question enhancement, the agentic orchestrator — calls OpenAI
  `gpt-4o-mini`/`gpt-4o` through the single US-endpoint client.

Categorisation is a deterministic short-circuit cascade: 8-state `classificationState`
machine → hard-match guard rail → P0 known-contact → P1 EWMA consensus → P2 lexicon →
**P2B zero-shot NLI (the only ML tier)** → P4 history → P5 cadence → P6 fallback.
A **privacy gateway** (`llm-privacy-gateway.js`) scrubs PII, drops blocked fields,
buckets amounts/dates, and explicitly exempts local BART (`:11`).

**Central fact:** the abstraction boundary that makes swapping external LLM → a
self-hosted in-region GPU endpoint a *config change* already exists.

### 4.2 Model / LLM touchpoint inventory

**A. Local zero-shot NLI (in-region today)**

| # | Touchpoint | File:line | Model |
|---|---|---|---|
| A1 | P2B two-layer cascade | `zero-shot-model.service.js:207` (`classify`), `:236`, `:276` | MobileBERT-MNLI → BART-large-MNLI |
| A2 | P2B dispatch / activation gate | `tier-orchestrator.js:602-619`, `:412-427` | same |
| A3 | Model load / RSS memory guard | `zero-shot-model.service.js:66-76`, `:137-172` | same (CPU/RAM constrained) |

**B. External LLM — advisor + diagnostic (egress)**

| # | Touchpoint | File:line | Model |
|---|---|---|---|
| B1 | Advisor SSE streaming | `advisor-streaming.service.js:96-106` | `gpt-4o-mini`, stream; breaker 3-fail/5-min, 12s abort, 5s first-token race, template fallback |
| B2 | AI diagnostic question gen | `diagnostic-ai.js:82-91` | `gpt-4o-mini`, JSON; 4s timeout, own breaker, static fallback |
| B3 | Pre-generated candidate questions | `candidate-question-generator.js:75-76` | `gpt-4o-mini` |
| B4 | **Agentic orchestrator (heaviest)** | `agent-orchestrator.service.js:95-96` | **`gpt-4o`** (env-overridable `:44`) |

**C. External LLM — categorisation / profile assist (egress)**

| # | Touchpoint | File:line | Model |
|---|---|---|---|
| C1 | Free-text answer → category | `llm.service.js:435` | `gpt-4o-mini`, temp 0.1 |
| C2 | Pattern + batched question gen | `llm.service.js:206`, `:341` | `gpt-4o-mini`, cached 7d |
| C3 | Question/budget/narrative enhance | `llm.service.js:73,125,152,484` | `gpt-4o-mini`, cached + fallback |
| C4 | Core OpenAI call (breaker, daily cap) | `llm.service.js:573` | `gpt-4o-mini` |
| C5 | Lexicon enrichment + `scrubPII` | `llm-lexicon-enrichment.service.js:45` | `gpt-4o-mini` |

**D. Privacy / egress control plane (no model, but the swap point)**

| # | Touchpoint | File:line | Role |
|---|---|---|---|
| D1 | Privacy gateway (`sanitizePayload`/`check`) | `llm-privacy-gateway.js:60,175` | defines "external"; local BART exempt `:11` |
| D2 | OpenAI client singleton (US, no `baseURL`) | `utils/openai-client.js:39` | the one line that sends every B/C call to the US |

**E. Eval harness (offline):** `scripts/eval-prompts.js:25-39` (5-axis rubric,
LLM-as-judge, golden fixtures).

**F. Deterministic — NOT models:** counterparty resolution is **exact-match**
(VPA → phone → 6-char name prefix → HMAC fingerprint,
`counterparty-identity.service.js:29-75`); P1 EWMA, ratio engine, coherence gate,
trait profile, P5 cadence are pure math.

### 4.3 Ranked NVIDIA opportunities for Module 3

1. **Self-host advisor + diagnostic + categorisation LLMs as a NIM (highest).**
   Covers B1–B4, C1–C5. **Llama-3.1-8B-Instruct** or **Nemotron-4 NIM** as a
   drop-in OpenAI-compatible `/v1/chat/completions` endpoint. The SSE loop
   (`advisor-streaming.service.js:117-123`), `response_format: json_object`
   (`diagnostic-ai.js:90`), and `_callOpenAI` (`llm.service.js:573`) all keep
   working; circuit breakers/fallbacks already absorb NIM warm-up. **Sovereign
   pitch:** today the privacy gateway *must* scrub PII and withhold amounts/dates
   (`advisor-streaming.service.js:171-183`, `llm-privacy-gateway.js:139`) *because
   data crosses to the US*; with an in-region NIM that stripping becomes
   defence-in-depth and the advisor can be given richer context → better answers.
2. **P2B zero-shot NLI: CPU `@xenova` → TensorRT on Triton (high, lowest risk).**
   P2B is the accuracy ceiling on novel merchants but is throttled: the 2200 MB
   guard *skips Layer 2 entirely* (`zero-shot-model.service.js:147-154`), lazy load,
   3s/10s timeouts (`:33-34`). On GPU, `bart-large-mnli` drops from ~8s to tens of
   ms, eliminating the fast→accurate cascade and the memory guard. Only call sites
   are `evaluateZeroShot` + `isReady()` (`tier-orchestrator.js:604-606`) — contained
   change. Already in-region → pure performance/accuracy win.
3. **DGX Cloud 60-day experiment (the concrete ask)** — see §6.
4. **Embedding NIM for counterparty/merchant resolution (medium, future, NOT
   current).** Today resolution is deterministic exact-match — no embeddings exist.
   **NV-Embed / embedding NIM** + vector index is a *roadmap* item (semantic
   near-miss dedup; semantic recall behind P2 lexicon before P2B). Net-new work;
   do not overstate.
5. **DLI codes:** *Building RAG Agents with LLMs* / LLM deployment (→ #1);
   *Deploying a Model with Triton* + inference optimisation (→ #2); NLP/transformers
   fundamentals (re-validate the NLI model choice).

### 4.4 Module 3 — where NVIDIA does NOT fit / keep as-is

- **Counterparty ledger + identity resolution** — exact VPA/phone/prefix/HMAC
  matching + atomic typed-entry ledger is deterministic, replayable bookkeeping.
  Embeddings/GPU would reduce auditability. No GPU.
- **P1 consensus, ratio engine, coherence gate, trait profile, P5 cadence** — pure
  functions. CPU.
- **Hard-match + P0 + P2 lexicon** — intentionally *not* ML; Guard Rail #1 isolates
  hard-match so models can't override it (`tier-orchestrator.js:53-65`). That
  isolation is a feature.
- **Eval harness** — offline tool; *uses* DGX Cloud during the benchmark but is not
  itself a serving workload.
- **Agentic orchestrator (`gpt-4o`, B4) is the hardest swap** — largest model +
  structured-output validation; an 8B NIM may not match it. Migrate *last*, behind
  `ADVISOR_AGENT_ORCHESTRATOR_MODEL` (`:44`); benchmark on DGX Cloud first. Do not
  promise parity.
- **Don't claim "fully in-country today."** P2B/local NLI is in-region; advisor +
  all LLM-assist paths currently egress to OpenAI (scrubbed). Sovereign inference is
  the *target state* NIM enables, not the current state.

---

## 5. Module 4 — Goals & Decisioning

### 5.1 What the module is — deliberately deterministic

A rule-based financial-math decisioning engine. **No neural network, no trained
model, no inference** in the decision paths. Seven components:

- **Next Best Rupee** (`next-best-rupee.service.js`) — multiplicative utility
  `delta × mustHave × emergencyBoost × urgency × stability × policy × progress ×
  priority` (L158); hardcoded factor constants (L134-249); clamped linear `delta`
  capped at 10pp (L186-201); deterministic tie-break sort (L83-89); emits 8
  structured rationale **codes** — `must_have_bias`, `emergency_underfunded`,
  `high_urgency`, `within_policy_bands`, `stable_surplus`, `high_priority`,
  `progress_momentum`, `default_recommendation` (L268-322).
- **42×7 suitability matrix** (`goalsync-suitability.service.js`) — `MF_SUITABILITY_MATRIX`
  (L115-176), hand-curated integer scores with inline panel adjustments (Credit Risk
  nerf L136-137, Arbitrage uplift L165); 4-step fallback chain (L212-225).
- **Dual-language calc parity** (`shared_retirement_calc/`) — Node & Dart line-for-line
  mirrors; same version/engineName, `_annuityFactor` with `r≈0` branch,
  `_calculateIncomePV` delay-discounting, `calculateMonthlySIP` FV-of-annuity solve.
- **Risk profiling** (`risk-profile.service.js` + `risk-allocation-bands.js`) —
  `Capacity=q3+c1+c2`, `Tolerance=q1+effectiveScene1+q5+q6+scene2`, each → 1-5 band,
  `final=min(capacityBand, toleranceBand)` (L140); divergence rule if
  `scene1-scene2≥2` (L126-127); C1/C2 auto-prefilled from `NetworthSnapshot` ÷
  `FinancialProfile` (L413-455).
- **Recommendation-stability snapshot** (`recommendation-stability.service.js`) —
  30/90/180-day lock by horizon; SHA-256-16 input hash short-circuit (L128-131);
  8-trigger allowlist with horizon-keyed drawdown thresholds 5/10/25% (L41-57);
  atomic `$setOnInsert` upsert.
- **Calc audit log** (`calculation-audit.service.js`) — Mongoose `expires:'90d'`
  TTL; `getCalculationStats` `$group`; `detectAnomalies` threshold logic;
  additive `calculateHealthScore`.
- **LTCG exemption + three-regime tax classifier** (`tax-regime-classifier.js`,
  `fy-gains-tracker.model.js`, `redemption-cost.service.js`) — `resolveTaxRegime`
  4-step fallback with documented `omf` safe default ("under-tax caught by CA,
  over-tax silently costs the user," L91-94); FY accumulator atomic `$inc`/`$push`;
  exemption `taxableGain = max(0, gain − max(0, 125000 − used))` (L138-141).

### 5.2 Honest classification per component

| Component | Classification | Why |
|---|---|---|
| Next Best Rupee utility | Deterministic — no GPU; ML-amenable at the *rationale layer only* | Multiplicative formula, hand-tuned constants; the 8 rationale codes are discrete tokens crying out for a NL layer |
| 42×7 suitability matrix | Deterministic — no GPU | Dictionary lookup; curated by design — a learned model would destroy auditability/SEBI defensibility |
| Dual-language calc parity | Deterministic — no GPU, never | Closed-form actuarial PV; the value *is* bit-for-bit determinism |
| Risk profiling | Deterministic — no GPU | Additive subscores + table lookups; SEBI-reproducible |
| Recommendation stability | Deterministic — no GPU | SHA-256 + set membership + date math |
| Calc audit log | Deterministic — no GPU | Aggregation + thresholds; **but it is the training-data substrate** for a future learned policy |
| LTCG / three-regime tax | Deterministic — no GPU, must stay rules | Statutory facts (Finance No.2 Act 2024); a "predictive" model would be a compliance defect |
| **Monte Carlo SIP-confidence** (`retirement-fund-planner.service.js:704-775`) | **Genuinely GPU/parallel-amenable** | Existing single-thread 1000-iter Box-Muller loop, independent per-iteration; embarrassingly parallel |

### 5.3 Ranked NVIDIA opportunities for Module 4 (quality over forcing — only 3 honest)

1. **NL rationale renderer over the structured codes → small NIM + DLI generative-AI
   codes.** Next Best Rupee emits 8 discrete codes (L274-321); feasibility emits its
   own `REASON_CODES` (`goal-feasibility.service.js:18-26`). A small instruction-tuned
   LLM via NIM expands codes + numeric context into one personalised Hindi/English
   sentence — **codes remain the source of truth and audit trail; the LLM only
   renders, never decides.** Preserves SEBI explainability, improves UX. Small (7–8B)
   footprint → credible cloud-credit / preferred-pricing ask.
2. **GPU-parallel Monte Carlo feasibility → RAPIDS / CuPy + candidate DGX Cloud
   experiment.** `runMonteCarloSimulation(params, 1000)` (L704) is a sequential loop
   with i.i.d. Box-Muller draws (L756-775), capped at 1000 because more blocks the
   Node event loop. On GPU, 10⁵–10⁶ paths/goal run in ms → real probability-of-success
   deltas replacing the clamped linear `confidenceDelta` heuristic (L186-201).
3. **DLI codes + Developer Forums for team upskilling.** The calc audit log is an
   append-only versioned `{params, results, reconciliation}` corpus (L34-54) — exactly
   what a future learned/RL allocation policy would train on. Stock the toolbox before
   that's viable.

**Deliberately NOT proposed:** NeMo, TensorRT-LLM, scaled Triton — naming them would
be forcing.

### 5.4 Module 4 — where NVIDIA does NOT fit

- **42×7 suitability matrix** — its differentiator is that it is *reviewed, not
  generated*. No GPU/ML.
- **Three-regime tax classifier + LTCG math** — statutory; a model that "predicts" a
  tax regime is a compliance bug. Rules only.
- **Dual-language calc libraries** — must stay bit-deterministic (Node↔Dart parity).
- **Risk profiling** — SEBI-facing, must be replayable from stored answers. No model.
- **Stability snapshots + audit log** — hashing, TTL indexes, `$group` — zero GPU
  benefit.

**Bottom line:** present M4 as *deliberately deterministic* — that is its strength.
The credible asks are narrow: a NIM rationale renderer, a scoped RAPIDS/DGX-Cloud
Monte-Carlo experiment with a real CPU baseline to beat, and DLI upskilling.

---

## 6. The DGX Cloud Innovation Lab ask (60-day H100)

A **single bundled experiment**, defensible because the benchmark harnesses already
exist in the repo. Frame as a *qualified-member request*, never an entitlement.

1. **Self-hosted LLM vs `gpt-4o-mini`** — stand up a Llama/Nemotron NIM, re-point
   `openai-client.js:39`, replay golden-prompt fixtures through the existing 5-axis
   eval harness (`scripts/eval-prompts.js:25-39`). Apples-to-apples, pre-built.
2. **TensorRT-compiled NLI on Triton** — replay the 21 golden profile fixtures
   (`test/fixtures/profiles/*.json`) + `aa-replay-harness.js`; measure removal of the
   `layer2Skipped` degradation via `getCascadeStats()`.
3. **RAPIDS batch analytics** — replay one full `runFullPeerRanking()` over the
   ~14K-scheme NAV table; target 10–30 min → low-single-digit minutes (→ daily, not
   weekly, recompute). Golden-file tests (±0.5% vs Value Research/Morningstar) are a
   ready-made GPU-vs-CPU parity check.
4. **GPU Monte Carlo** — 1k-iter CPU vs 1M-path GPU, with a clear kill/keep
   calibration criterion.

**Why every component is credible:** each maps to a benchmark harness, golden
fixture set, or CPU baseline that *already exists in the codebase* — so results are
defensible, not hypothetical.

---

## 7. Free / low-risk levers to claim immediately

- **DLI self-paced course codes** (no hardware approval needed):
  - *Deploying a Model with Triton Inference Server* + inference optimisation → M1/M3 #2
  - *Building RAG / Generative AI with LLMs* → M3 #1, M4 #1
  - *Accelerating Data Science with cuDF/cuML* → M2 #3, M4 #2
- **Developer Forums:** Triton/TensorRT ONNX conversion (BART graph), NIM deployment,
  RAPIDS ragged-series batching + numerical parity.
- **Portal:** describe workloads *concretely* (per the tables above) so personalised
  recommendations route to RAPIDS/NIM/Triton rather than generic tooling.

---

## 8. Corrections to fold back into the brief docs

Surfaced by the code passes — worth fixing in `module*.md` / the pitch deck:

1. **Agent orchestrator uses `gpt-4o`** (not just `gpt-4o-mini`) —
   `agent-orchestrator.service.js:95-96`. Matters for NIM sizing/parity.
2. **`onnxruntime-node` is `require`d but not in `package.json`** —
   `email-classifier.service.js`; the LightGBM ONNX path is cold-start/optional.
   (Consistent with the code's "cold start is normal" handling.)

---

## 9. Honest summary table — GPU/ML fit by module

| Module | Genuine GPU/ML fit | Honest "no-fit" majority |
|---|---|---|
| M1 Ingestion | BART-MNLI → Triton/TensorRT; email LLM → NIM (privacy) | AA crypto, bureau resilience, PDF/regex, signatures — plumbing |
| M2 Ledger | Batch NAV analytics + OLS → RAPIDS cuDF/cuPy (strongest GPU candidate) | XIRR, per-lot tax, 5-pillar score — small-data per-user |
| M3 Advisor | Self-hosted NIM (sovereign) + P2B on Triton (most model-intensive) | counterparty ledger, ratio/coherence/trait engines — deterministic |
| M4 Decisioning | NIM rationale renderer + GPU Monte Carlo (narrow, forward-looking) | suitability matrix, tax rules, calc parity, risk bands — deliberately rules |

**The strongest cross-cutting angle:** privacy-preserving **in-region inference**
(M1 email + M3 advisor) via NIM, plus a genuine batch-analytics GPU story (M2). The
strongest *credibility* move is stating clearly where GPU does not belong (most of
M4, the per-user math in M2, all the plumbing in M1).
