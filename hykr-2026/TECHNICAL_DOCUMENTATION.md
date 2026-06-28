# Finwiser — Technical Documentation

> Submitted for HyKr Build Challenge — MVP Phase
> Last updated: 2026-05-13
> Author: Chandrachuda Sarma, Founder

---

## 1. Product Summary

**Finwiser** is a financial data infrastructure and decisioning engine for India, with a SEBI RIA‑licensed AI advisor as its reference interface. The platform ingests consented multi‑source financial data, normalises it into a unified ledger, runs analytics and categorisation, and produces goal‑linked allocation recommendations — all on infrastructure that operates in Mumbai, India.

| Regulatory clearance | Value |
|---|---|
| SEBI RIA registration | **INA000021331** |
| FIU registration | Cleared |
| ReBIT NBFC-AA certification | Cert No. FIU/V2.0/0335 — Suma Soft (Sahamati-empaneled certifier), 2025-12-10 |
| Production region | OCI Mumbai + MongoDB Atlas Mumbai |
| Reference app | Flutter Android (Google Play Closed Testing) |

---

## 2. Architecture Overview

Finwiser's backend is a single Node.js service decomposed into **four logical modules** with explicit data‑flow boundaries. The Flutter app is a thin reference interface — all financial logic lives server‑side.

```
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  ┌───────────────────────┐     Raw Financial Data                  │
│  │     MODULE 1          │──────────────────────┐                  │
│  │   Data Ingestion      │                      │                  │
│  │                       │                      ▼                  │
│  │ • Account Aggregator  │     ┌──────────────┐   ┌──────────────┐ │
│  │   (Saafe + Finvu)     │     │  MODULE 2    │   │  MODULE 3    │ │
│  │ • Gmail OAuth + Push  │     │   Ledger     │   │ Categorisation│ │
│  │ • PDF statement parse │     │ (balance     │   │  & Cashflow  │ │
│  │ • Credit Bureau       │     │  sheet)      │   │  (P&L)       │ │
│  │   (Experian / IDSPay) │     │              │   │              │ │
│  └───────────────────────┘     │ Net worth    │   │ V1+V2 multi- │ │
│                                │ Portfolio    │   │ stage pipeline│ │
│                                │ Protection   │   │ Budgets       │ │
│                                │ Analytics    │   │ Surplus       │ │
│                                │              │   │ Advisor chat  │ │
│                                └──────┬───────┘   └──────┬───────┘ │
│                                       │                  │         │
│                                       │ Assets +         │ Surplus │
│                                       │ Analytics +      │ + Income│
│                                       │ Protection Gaps  │         │
│                                       ▼                  ▼         │
│                                ┌──────────────────────────┐        │
│                                │       MODULE 4            │        │
│                                │   Goals & Decisioning     │        │
│                                │                           │        │
│                                │ • Goal definition          │       │
│                                │ • Suitability scoring      │       │
│                                │ • Next Best Rupee™        │        │
│                                │   allocation engine        │       │
│                                │ • Recommendations          │       │
│                                └───────────────────────────┘        │
│                                                                    │
│  Module boundary rule:                                             │
│    M2 = facts (what is it, how did it behave)                      │
│    M4 = judgments (is it suitable, what should you do)             │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Why this shape.** The product's differentiation is the combination of (a) consented multi‑source ingestion under the AA framework with a ReBIT NBFC-AA certified integration (Cert No. FIU/V2.0/0335), (b) a unified ledger that survives merges, dedup, and re‑classification, and (c) SEBI RIA‑licensed decisioning. Each module has a single responsibility and well‑defined inputs/outputs so each layer can be hardened independently.

### 2.1 End‑to‑end example — one transaction's path

A ₹5,200 ICICI debit lands via Saafe webhook.

1. **Module 1** verifies the JWS signature, decrypts the FI payload (JWE / AES‑GCM via X25519 / ECDH), writes a `RawFIData` document, parses to `DecryptedRawFIData`, and emits a unified transaction into `transactions`.
2. **Module 2** updates the user's `NetWorthSnapshot` (deposit allocation decreases by ₹5,200) and refreshes the 5‑bucket allocation.
3. **Module 3** runs the transaction through the categorisation pipeline (Stage 0 evidence extraction → Stage 1 hard‑match → intent classifier → P0 tier → category: *Discretionary / Dining*), updates the `MonthlyCashflowSnapshot`, and recomputes the user's surplus.
4. **Module 4** recalibrates the **Next Best Rupee™** allocation across active goals (Emergency Fund still 40% funded → remains top priority over Retirement SIP) and surfaces the updated recommendation in the app.

End‑to‑end latency target: under 60 seconds from webhook arrival to user‑visible recommendation refresh.

### 2.2 Key technical decisions

| Decision | Rationale |
|---|---|
| **Single Node.js service, not microservices** | Solo‑founder operations. Logical module boundaries enforce single responsibility without distributed‑system overhead. Service split deferred until on‑call rotation and traffic justify it. |
| **MongoDB + Mongoose, not Postgres** | Schema flexibility for evolving multi‑source FI data (AA payloads, email‑extracted fields, manual entries). CSFLE field‑level encryption is first‑class. Familiarity reduces ops surface for a solo team. |
| **OCI Mumbai — all data resident in India** | SEBI compliance for RIA‑held financial data requires resident data storage and processing inside India. Compute (OCI Mumbai region) and primary database (MongoDB Atlas Mumbai region) are both in‑country, as are backups and replicas. Predictable egress; ReBIT NBFC-AA certification was audited on this exact stack. |
| **PM2 + git‑pull deploys, not containers** | Single‑service, single‑region today. Container orchestration overhead unjustified at current scale. Documented `pm2 delete` + `pm2 start` cycle handles `.env` rotation. Containerisation planned with multi‑region. |
| **Distributed locks defensive, not load‑driven** | PM2 runs fork mode (single process) today. MongoDB‑backed locks (`utils/distributed-lock.js`) keep cron jobs single‑execution if/when a second instance is added for blue‑green deploys or warm standby. |
| **Strict Mongoose schemas + thin controllers** | Models authoritative, controllers transport‑only. Reduces input‑handling surface area in a regulated context. `strict: false` reserved for AA landing collections where the schema is upstream‑defined. |
| **Shared calc libraries in two languages** | `@finwiser/emergency-calc` and `@finwiser/retirement-calc` published as Node + Dart packages so server (source of truth) and client (instant previews) produce identical numbers. |

---

## 3. Tech Stack

### 3.1 Backend (Node.js)

| Concern | Technology | Version |
|---|---|---|
| Runtime | Node.js | 20.20.0 LTS |
| HTTP framework | Express | 4.21 |
| ODM | Mongoose | 8.9 |
| Database | MongoDB Atlas (Mumbai) | M10+, driver 6.19 |
| Field‑level encryption | `mongodb-client-encryption` (CSFLE) | 6.5 |
| Cache + rate‑limit store | Redis | 5.8 |
| Background jobs | Bull (Redis‑backed queues) | 4.16 |
| Cron scheduling | `node-cron` | 3.0 |
| Process manager | PM2 (fork mode) | latest |
| Validation | Joi + Zod + `express-validator` + Ajv | — |
| Structured logging | Pino + pino‑pretty (dev) | 9.10 |
| Metrics | `prom-client` (Prometheus) | 15.1 |
| Error monitoring | Sentry | 10.8 |
| APM | Datadog (optional middleware) | — |
| Auth | JWT (`jsonwebtoken`) + JWKS RSA | — |
| AA crypto | `node-jose` (JWE, JWS, X25519/ECDH AES‑GCM) | 2.2 |
| AI / NLP | OpenAI 6.27, `@xenova/transformers` (local), wink‑nlp, compromise | — |
| Email pipeline | `googleapis` (Gmail API), Gmail Push via Pub/Sub | 159 |
| PDF parsing | `pdf-parse` + `cheerio` | — |
| Push notifications | `firebase-admin` (FCM) | 13.7 |
| Security | Helmet, CORS, `express-rate-limit`, `rate-limit-redis` | — |

### 3.2 Frontend — Flutter Android Reference App

| Concern | Technology |
|---|---|
| Framework | Flutter ≥ 3.0 (Dart ≥ 3.0) |
| State management | `provider` |
| Dependency injection | `get_it` |
| Networking | `dio` + `http` |
| Offline / cache | `hive`, `hive_flutter` |
| Secure storage | `flutter_secure_storage` |
| Real‑time | `eventsource` (SSE for advisor streaming) |
| Charts | `fl_chart` |
| Animations | Rive (Finny mascot) |
| Push | `firebase_core` + `firebase_messaging` |
| Auth UX | `smart_auth` (SMS OTP autofill — User Consent + Retriever APIs) |
| Versioning | versionCode auto‑derived from `git rev-list --count HEAD` in CI |

### 3.3 Infrastructure

| Concern | Technology |
|---|---|
| Compute | Oracle Cloud Infrastructure (OCI), Mumbai region, Ubuntu 22.04 LTS |
| Database | MongoDB Atlas, `finwiserproduction.uf21tpu.mongodb.net` (M10+) |
| Cache / queue backing | Redis (managed) |
| Tunnel (UAT only) | Cloudflared |
| Source control | GitHub (`Chandrachudasarma/finwiser-production`) |
| Process supervision | PM2 with ecosystem config |
| Deployment | SSH + `git pull` + `pm2 restart` (no container layer) |

---

## 4. Module 1 — Data Ingestion

**Responsibility:** Get consented financial data from external sources into our database. Owns consent lifecycle, fetch lifecycle, decryption, archival, and scheduled maintenance.

### 4.1 Account Aggregator (ReBIT NBFC-AA)

Decomposed (Feb 2026) from a 2,948‑line monolith into focused services with no circular dependencies, using request‑scoped dependency injection via `aa-factory.js`.

| Service | Responsibility |
|---|---|
| `aa-transport.js` | Pure HTTP + crypto: X25519 key material, JWS signing, per‑provider axios clients |
| `consent.service.js` | Consent lifecycle: create, fetch, revoke, webhook handling |
| `session.service.js` | Session CRUD, date‑range calculation, FI/request posting |
| `notification-handler.js` | Webhook DB ops (FI_DATA_READY, SESSION_STATUS, FI_DATA_FAILED) |
| `status-check.manager.js` | Session monitoring, decryption, processing pipeline |
| `data-session-manager.service.js` | Daily session creation, adoption, stale‑PENDING escalation, coverage tracking |
| `gap-detection.service.js` | Detects data gaps across sessions/FIPs (3‑tier completeness) |
| `unified-transaction-ingester.js` | Converts raw AA data into unified format |

**Highlights:**

- **Multi‑AA aware:** Each consent gets its own AA‑scoped service via `createAADepsFromAAId(consent.aaId)`. Currently live with Saafe (active) and Finvu (tested).
- **Three‑lane fetch:** *Bootstrap* (`ONBOARD_L6M`, on consent activation), *Freshness* (`DELTA`, daily scheduler + login refresh), *Completeness* (`GAP_FILL`, gap detection).
- **ReBIT NBFC-AA compliance:** Replaced 6 Setu‑proprietary endpoints with local DB queries; status updates come via webhooks; `KeyMaterial.params = "cipher=AES/GCM/NoPadding;KeyPairGenerator=ECDH"`.
- **Linked FIPs (active consent):** Axis, HDFC, ICICI, Union Bank (DEPOSIT); CAMS RTA, KFintech (MUTUAL_FUNDS); CDSL (EQUITIES); NPS_PROD (NPS).

### 4.2 Email Ingestion (Gmail)

| Stage | Service |
|---|---|
| OAuth + Push watch | `services/gmail/*`, `startup/gmail-webhook.js` |
| Source resolver | Domain → source‑type classifier (Redis‑cached, audited) |
| Template extractor | Self‑learned regex templates per `{domain, templateHash}`, cached in Redis (`tpl:{domain}:{hash}`) |
| LLM fallback | OpenAI extraction when templates fail; result cached in `email_extraction_training` |
| Cross‑source reconciliation | AA ↔ email match via `crossSignature` |

### 4.3 PDF Statement Parser

Captures CC/bank statements, decrypts user‑submitted password (DOB, name parts) via `pdf_password_configs` (per‑bank brute‑force rules), extracts transactions via `pdf-parse` + `cheerio`.

### 4.4 Credit Bureau (Experian via IDSPay)

`services/ingestion/credit-bureau/` — Live since 2026‑05‑11. Replaces dormant Equifax integration. Split‑name + DOB payload, structured‑error parsing, `unified-portfolio.service.js` reads liabilities post‑pull. Real vendor pricing wired: ₹29.50 per Credit Report, ₹4.72 per MTP lookup.

---

## 5. Module 2 — Ledger (Balance Sheet)

**Responsibility:** Hold the complete financial state — what the user owns, owes, and is protected against. M2 produces *facts*; M4 produces *judgments*.

| Sub‑module | Outputs |
|---|---|
| **Portfolio** | Net worth, 5‑bucket allocation (LIQUIDITY, FIXED, GROWTH, RETIREMENT, PROTECTION), diversification (HHI), health score |
| **Liabilities** | AA + Credit Bureau (deduped), EMI‑to‑income, debt payoff timeline |
| **Protection** | Insurance coverage assessment, protection gaps, composite protection score |
| **Market Data** | Instrument master (AMFI), NAV history (mfapi.in), analytics (returns 1Y/3Y/5Y, beta, alpha, Sharpe, IR, peer percentile) |

Key services: `networth-calculator.service.js`, `unified-networth.service.js`, `unified-portfolio.service.js`, `portfolioTransformServiceBuckets.js`, `financial-ratios.service.js`, `services/ledger/*`.

---

## 6. Module 3 — Categorisation & Cashflow

**Responsibility:** Categorise all transactions and produce income/expense analysis.

### 6.1 Categorisation Pipeline (V1 + V2)

Multi‑stage with an explicit `classificationState` state machine per transaction:

```
Stage 0  Evidence Extraction       (narration → signals)
Stage 1  Hard-Match                 (7 types: cc_bill, self_transfer, salary,
                                     emi_nach, bnpl_emi, sip_investment, exact)
         ↓
         Intent Classifier          (9 intents)
         ↓
         Ask-vs-Classify Policy     (auto-classify or ask user)
         ↓
Tier Pipeline  P0 → P1 → P2 → P2B → P4 → P5 → P6   (P3 removed)
         ↓
Question Orchestrator               (advisor candidates with priority + coverage impact)
```

### 6.2 Cashflow + Budget + Surplus

| Component | File |
|---|---|
| Cashflow controller (fast path) | `controllers/cashFlowControllerFast.js` |
| Breakdown | `controllers/cashFlowBreakdownController.js` |
| Budget | `controllers/budgetController.js` (leanCategory, real adherence, LLM suggestions) |
| Surplus | `controllers/surplus-cashflow.controller.js` (real CoV‑based stability) |

### 6.3 Financial Advisor Chat (Intelligence Engine)

- **16 ratios in 4 groups** with coherence gate and diagnostic flow
- **7 user traits × 5 ratios** for context‑aware severity (e.g., `family_hub`, `irregular_income`, `investor`)
- **Streaming responses** via Server‑Sent Events (SSE)
- **Three‑layer testing:** unit + simulation + prompt evaluation (264 tests)

---

## 7. Module 4 — Goals & Decisioning

**Responsibility:** Goal definition, suitability scoring, and the **Next Best Rupee™** allocation engine that recalibrates after every transaction.

| Component | Purpose |
|---|---|
| `models/goal.model.js` | Goal lifecycle (emergency, retirement, home, car, education, vacation, etc.) |
| `models/goalsync-asset.model.js` | Assets linked to goals with per‑goal suitability scores (0–100) |
| `services/goalsync/goalsync-suitability.service.js` | Computes per‑(goal, asset) suitability |
| `controllers/goalController.js`, `goalSyncController.js` | API surface |
| `services/calculation-audit.service.js` | Append‑only audit log (90‑day TTL) |
| `models/platform/fy-gains-tracker.model.js` | YTD LTCG realised per FY (₹1.25 L exemption tracking) |
| `models/platform/risk-profile.model.js` | SEBI‑mandated risk questionnaire results (capacity + tolerance → 5 risk categories) |
| `models/platform/nudge-history.model.js` | Per‑user nudge delivery log (cooldown + maxShows enforcement) |

Shared calc libraries (versioned, dual‑language for parity between server and client): `@finwiser/emergency-calc` (`/shared_emergency_calc/{nodejs,dart}`), `@finwiser/retirement-calc` (`/shared_retirement_calc/{nodejs,dart}`).

---

## 8. Data Layer

| Property | Value |
|---|---|
| Engine | MongoDB Atlas (M10+), Mumbai region |
| Driver | Mongoose 8.x ODM |
| Active DB | Controlled by `DB_NAME` env var (allowed: `main`, `finvu`, `saafe`) |
| Total collections | **90 model‑defined**, across 14 domains |
| TTL‑managed | 11 collections with automatic expiry |
| Soft‑delete | `RawFIData`, `DecryptedRawFIData` (via `softDeletePlugin`) |
| Immutable | `LegalRetentionArtifacts` (pre‑save throws on update) |
| Encryption at rest | CSFLE (`mongodb-client-encryption`) for sensitive fields; refuses to no‑op in production |

### 8.1 Domain Overview

| Domain | Collections | Examples |
|---|---|---|
| AA Pipeline | 13 | `consents`, `datasessions`, `rawfidatas`, `decryptedrawfidatas`, `incomingwebhooks`, `outgoingapilogs`, `legalretentionartifacts` |
| User & Auth | 2 | `users`, `loginlogs` |
| FI Data (AA) | 3 | `transactions`, `summaries`, `accountprofiles` |
| Financial Planning | 16 | `goals`, `networthsnapshots`, `monthlycashflowsnapshots`, `budgets`, `insurancepolicies` |
| Tax | 5 | `taxprofiles`, `taxslabs`, `elssfunds` |
| Insights | 4 | `financialhealthscores`, `predictiveanalyses`, `spendingpatterns` |
| Transaction Intelligence | 4 | `unified_transactions`, `sourceobservations`, `canonicaltransactions`, `accountaliases` |
| Categorisation & Reputation | 6 | `merchantconsensus`, `categoryrules`, `categorizationvotes`, `reputations` |
| Counterparty Ledger | 3 | `knowncontacts`, `counterpartyentities`, `counterpartyledgerentries` |
| Email Ingestion | 10 | `domain_reputation`, `processed_emails`, `email_extraction_templates` |
| PDF Parser | 2 | `pdf_user_credentials`, `pdf_password_configs` |
| Investment Intelligence | 9¹ | `instrument_master`, `nav_history`, `analytics_cache`, `manual_assets`, `risk_profiles` |
| Operational | 13 | `distributed_locks`, `migrations`, `equifaxreports`, `operationlogs` (24h TTL), `urgentalertlogs` (24h TTL) |

¹ Plus `networthsnapshots`, which is shared with the Financial Planning domain and counted there.

### 8.2 Retention Tiers

| Tier | TTL | Example collections |
|---|---|---|
| Ephemeral | 24 h | `operationlogs`, `urgentalertlogs` |
| Short | 2 days | `bulksynclogs` |
| Standard | 30 days | `rawfidatas`, `decryptedrawfidatas`, `incomingwebhooks`, `outgoingapilogs`, `webhookqueues` |
| Extended | 90 days | `deletionjobs` (completed only), `calculationauditlogs` |
| Long‑term | ~7 years | `legalretentionartifacts` |
| Permanent | — | `consents`, `datasessions`, `users`, `goals`, `holdings`, ledger collections |

### 8.3 AA Data Lifecycle

```
Consent ACTIVE
  → DataSession created (PENDING)
    → FI/request sent       (logged in OutgoingAPILog)
      → FI notifications    (IncomingWebhook + DataSessionLog)
        → FI/fetch sent     (OutgoingAPILog)
          → RawFIData stored (encrypted)
            → DecryptedRawFIData (parsed JSON)
              → AccountProfile / Transaction / Summary (normalised)
                → NetWorthSnapshot (M2 — calculated)
                  → MonthlyCashflowSnapshot (M3 — derived)
                    → Goal recalculation (M4 — Next Best Rupee™)
```

---

## 9. Cron & Scheduled Jobs

The **Unified FI Fetch Scheduler** runs 5 cron jobs in fork mode, coordinated by MongoDB‑backed distributed locks (`utils/distributed-lock.js`) for PM2 cluster safety.

| Job | IST | UTC | Cron |
|---|---|---|---|
| Morning fetch | 05:00 | 23:30 prev day | `30 23 * * *` |
| Afternoon retry | 14:00 | 08:30 | `30 8 * * *` |
| Gap detection | 06:00 | 00:30 | `30 0 * * *` |
| Reconciler | every 30 min | every 30 min | `*/30 * * * *` |
| Monthly snapshot | ~03:00 (last day of month) | 21:30 (28–31st) | `30 21 28-31 * *` |

Background categorisation also runs continuously off the Bull queue.

---

## 10. Security & Compliance

| Concern | Implementation |
|---|---|
| **In‑transit** | TLS 1.2+ for all AA/Sahamati traffic; mTLS via SahamatiNet for inter‑entity calls |
| **JWE / JWS** | `node-jose` — X25519/ECDH, AES‑GCM, JWS signing of all consent payloads via `rebit-consent-builder.js` (sole authority for CT008 params) |
| **CSFLE** | MongoDB Client‑Side Field‑Level Encryption for PAN, mobile, financial PII; plugin **refuses to no‑op in production** (closes silent‑plaintext‑at‑rest class) |
| **JWT auth** | Short‑lived access tokens + refresh; JWKS‑backed validation |
| **Secret hygiene** | `.env` gitignored; PM2 ecosystem config carries only `NODE_ENV`/`PORT`/`HOST`; never committed |
| **Rate limiting** | `express-rate-limit` + Redis store; AA outbound throttle (45 calls/FIP/month per fair‑use) |
| **PII audit** | `pii-audit.middleware.js` logs every PII access |
| **Webhook validation** | `aa-webhook-validator.js` (static + dynamic) verifies signatures before any DB write |
| **Idempotency** | `operationlogs` (24 h TTL); `dedupKey` on every webhook |
| **Legal retention** | `legalretentionartifacts` collection is pre‑save immutable (~7‑year retention) |
| **Soft delete** | `rawfidatas` / `decryptedrawfidatas` for compliance‑driven deletion jobs |
| **Regulatory** | SEBI RIA INA000021331; FIU-IND registered; ReBIT NBFC-AA certified (Cert No. FIU/V2.0/0335, Suma Soft, 2025-12-10) |

---

## 11. Deployment

### 11.1 Topology

```
GitHub origin/main
   │
   │ git pull
   ▼
OCI Mumbai (Ubuntu 22.04 LTS)
   /srv/finwiser/platform
     └── Finwiser_backend/
           ├── server.js              (thin orchestrator ~120 lines)
           ├── startup/               (middleware, routes, post-boot, lifecycle,
           │                          gmail-webhook)
           ├── ecosystem.config.js    (PM2 fork mode — no secrets)
           └── .env                   (single source of truth, gitignored)
   │
   ▼ TLS
MongoDB Atlas (Mumbai)        Redis (managed)        Sentry / Datadog
```

### 11.2 Boot Order

```
server.js
  → setupMiddleware(app)       (helmet, rate-limit, CORS, body parse, compression)
  → setupRoutes(app, sentryMw) (JWT middleware, public/private mounts, Swagger)
  → connectDB()                (MongoDB Atlas, DB_NAME enforced: main | finvu | saafe)
  → app.listen()
  → postBoot(app)              (Prometheus, queues, FI fetch scheduler, Lexicon OTA,
                               zero-shot model warm-up)
  → setupGracefulShutdown()    (SIGTERM/SIGINT, log flush, queue drain)
```

Boot time: 3.5–8.5 s (varies with MongoDB cold/warm connection).

### 11.3 Deploy Workflow

```bash
# Standard deploy (code changes only)
ssh finwiser-prod "cd /srv/finwiser/platform && \
                   git pull && pm2 restart finwiser-prod"

# Full restart (when .env or ecosystem config changes)
ssh finwiser-prod "cd /srv/finwiser/platform/Finwiser_backend && \
                   pm2 delete finwiser-prod && \
                   pm2 start ecosystem.config.js --env production && \
                   pm2 save"
```

`pm2 restart` preserves the old env from the PM2 dump — `.env` changes need `pm2 delete` + `pm2 start`. Health endpoint: `GET /health`.

### 11.4 Environment Files

| File | Tracked | Has secrets | Purpose |
|---|:---:|:---:|---|
| `.env` | No | Yes | All secrets (≈ 80 vars) — single source of truth |
| `.env.uat` | No | Yes | Local cloudflared UAT testing |
| `.env.example` | Yes | No | Template — all var names, no values |
| `ecosystem.config.js` | Yes | No | PM2 prod config (`NODE_ENV`, `PORT`, `HOST` only) |
| `ecosystem.uat.config.js` | No | No | Local UAT PM2 config |

### 11.5 Observability

| Signal | Tool |
|---|---|
| Logs | Pino structured JSON → PM2 log files (`server.log`, `pm2-combined-0.log`, `pm2-error-0.log`, `pm2-out-0.log`); LogGrouper batches noisy events |
| Errors | Sentry |
| APM / traces | Datadog (optional middleware) |
| Metrics | Prometheus via `prom-client` on `/metrics` |
| Alerts | `alerting.service.js` → Slack + Datadog + PagerDuty |

### 11.6 Flutter App Release

- **versionName** owned by humans in `pubspec.yaml`; **versionCode** computed in CI from `git rev-list --count HEAD`
- Distribution: Google Play Closed Testing (Android only)
- OAuth and CTA links open via `webview_flutter`
- Real‑time advisor streaming via SSE (`eventsource`)
- Offline pending categorisations stored in Hive

---

## 12. Local Development

```bash
# Backend
cd Finwiser_backend
npm install
npm run dev                 # nodemon, .env

# Sandbox / UAT
npm run dev:sandbox         # .env.sandbox

# Tests
npm test                    # jest --runInBand
npm run aa:adapter:verify   # AA contract tests + replay harness
npm run aa:golden           # golden-file integration tests

# Security audit
npm run security:audit:sandbox
npm run cert:validate       # Sahamati certification harness

# Flutter (reference app)
cd Finwiser_frontend
flutter pub get
flutter run
```

API documentation is auto‑generated from JSDoc into Swagger UI at `http://localhost:5001/api-docs`.

---

## 13. Repository Layout

```
finwiser-production/
  ├── Finwiser_backend/          Node.js + Express service (all four modules)
  │   ├── server.js              Thin orchestrator
  │   ├── startup/               middleware, routes, post-boot, lifecycle, gmail-webhook
  │   ├── controllers/           AA, portfolio, cashflow, goals, advisor, tax, …
  │   ├── services/              AA/, ledger/, goalsync/, ingestion/credit-bureau/, …
  │   ├── models/                90 Mongoose schemas across 14 domains
  │   ├── middleware/            JWT, AA validation, PII audit, error monitoring
  │   ├── config/                AA registry, feature flags, environment guards
  │   ├── utils/                 fi-decryption, jws-signer, distributed-lock, …
  │   ├── validators/            aa-response-validator (1,900+ lines)
  │   ├── cli/                   lexicon sign/verify
  │   ├── scripts/               security-audit, certification, swagger-gen
  │   └── test/                  jest unit + simulation + prompt eval (264 tests)
  ├── Finwiser_frontend/         Flutter Android reference app
  ├── Finwiser_admin/            Internal admin UI (React + Vite)
  ├── shared_emergency_calc/     Dual-language calc lib (nodejs + dart)
  ├── shared_retirement_calc/    Dual-language calc lib (nodejs + dart)
  ├── docs/                      Living architecture + decision records
  └── certification-framework-2.1.0/  Sahamati certification artefacts
```

---

## 14. Scope, Limitations & Reviewer Quickstart

### 14.1 What is and isn't shipped

| Area | Current state |
|---|---|
| **App distribution** | Google Play **Closed Testing** only. No public Play Store release yet. |
| **Platform coverage** | Android only. iOS deferred to post‑Closed‑Testing. No web client. |
| **Hosting region** | Single region (OCI Mumbai). Atlas backups in‑region with point‑in‑time recovery. Multi‑region deferred — but any multi‑region plan must keep all replicas inside India per SEBI residency rules. |
| **Credit Bureau integration** | Live since 2026‑05‑11 (Experian via IDSPay). Early‑production volume; structured‑error parser hardened over founder pulls, broader edge‑case distribution not yet observed at scale. |
| **Categorisation pipeline** | V1+V2 live across P0/P1/P2/P2B/P4/P5/P6 tiers. P3 removed as redundant after V2 redesign. |
| **Solo‑founder operations** | Single‑maintainer codebase. Designated successor named in regulatory filings. PagerDuty routing currently delivers to founder. |
| **Test signal** | ReBIT NBFC-AA certification test suite gated in CI via `npm run cert:validate`. AA replay harness against captured FI sessions on every backend PR. Unit + simulation + prompt‑evaluation suites under `Finwiser_backend/test/`. |
| **Out of scope for this MVP** | iOS, web client, public API, multi‑region, third‑party app marketplace. |

### 14.2 Quickstart for reviewers

**Five minutes to first value:**

1. **Demo video** (≤ 2 min, bundled with this submission) — install → AA consent → first ledger materialisation → first Next Best Rupee recommendation.

2. **Try the app yourself** — Google Play Closed Testing invite link is included in the submission form.
   Test account, pre‑seeded with a 6‑month Saafe AA consent across HDFC + ICICI deposits, a CAMS RTA MF folio, and an Experian credit pull:
   - Mobile: `[TBD — founder to fill before submission]`
   - OTP: `[TBD — founder to fill]`
   - PAN (if asked): `[TBD — founder to fill]`

3. **What to click, in order:**
   1. Log in with the test credentials → land on home (net worth + this‑month cashflow)
   2. Tap **Portfolio** → 5‑bucket allocation + per‑account suitability scores
   3. Tap **Goals** → active goals + current Next Best Rupee recommendation
   4. Tap **Advisor** → ask *"Why is my emergency fund recommendation set this way?"* → streamed response with the diagnostic flow

4. **Where to look for depth** (in the submission GitHub repo):
   - `docs/platform/FOUR_MODULE_ARCHITECTURE.md` — canonical engineering reference
   - `docs/platform/DATABASE_INFRASTRUCTURE.md` — full schema, indexes, TTL policies
   - `docs/aa/` — AA lifecycle, consent flow, FIP integrations
   - `certification-framework-2.1.0/` — ReBIT NBFC-AA certification artefacts (FIU/V2.0/0335)

5. **Regulatory verification** — SEBI RIA registration `INA000021331` is publicly verifiable at `sebi.gov.in/intermediary`.

6. **If something is broken** — `chandrachudasarma@gmail.com` (founder, on call).
