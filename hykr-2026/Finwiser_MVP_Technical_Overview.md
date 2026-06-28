# Finwiser — MVP Technical Overview

> HyKr Build Challenge — MVP Submission · 2026-05-13
> Founder: Chandrachuda Sarma · chandrachudasarma@gmail.com

---

## 1. Product Summary

**Finwiser is a SEBI RIA-licensed, Account Aggregator-native financial advisory MVP for India.** It ingests consented financial data from banks, mutual funds, equities, NPS, and credit bureaus, normalises it into a unified ledger, analyses cashflow and portfolio state, and generates goal-linked allocation recommendations through a Flutter Android reference app.

This MVP is not a prototype UI. It is a working Android app on top of a production backend that:

- Pulls consented data from real Indian banks, MFs, equities, NPS, and credit bureaus via the Account Aggregator framework
- Normalises 25+ Indian account/asset types into a unified ledger
- Categorises transactions, computes net worth and cashflow, and surfaces actionable recommendations
- Operates entirely inside India under SEBI compliance

| Regulatory clearance | Value |
|---|---|
| SEBI RIA registration | **INA000021331** (publicly verifiable at `sebi.gov.in/intermediary`) |
| FIU-IND registration | Cleared (anti-money-laundering registration with the Financial Intelligence Unit-India — distinct from the AA-framework FIU role referenced in the row below) |
| ReBIT NBFC-AA certification | **Cert No. FIU/V2.0/0335** — Suma Soft (Sahamati-empaneled certifier), issued 2025-12-10 |
| Hosting & data residency | OCI Mumbai + MongoDB Atlas Mumbai — all compute, data, backups, replicas inside India per SEBI compliance |

---

## 2. MVP User Flow

1. **Install & log in** via mobile + OTP (test credentials in §6).
2. **Consent to data sharing** through a Sahamati-listed Account Aggregator (Saafe or Finvu) — covers deposits, mutual funds, equities, NPS.
3. **First ledger materialises** in ~30 seconds — net worth, accounts, transactions, this-month cashflow.
4. **View goals** — see active financial goals and the current Next Best Rupee™ recommendation.
5. **Ask the advisor** — natural-language questions stream back with diagnostic flow.

---

## 3. Architecture Overview

A single Node.js service decomposed into four modules with explicit data-flow boundaries.

```
┌──────────────┐    ┌──────────┐    ┌──────────────┐    ┌──────────────┐
│  MODULE 1    │    │ MODULE 2 │    │  MODULE 3    │    │  MODULE 4    │
│  Ingestion   │───▶│  Ledger  │───▶│ Categorise & │───▶│   Goals &    │
│              │    │ (balance │    │   Cashflow   │    │  Decisioning │
│ AA + Email + │    │  sheet)  │    │              │    │              │
│ PDF + Bureau │    │          │    │ V1+V2 pipe   │    │ Next Best    │
│              │    │ Net worth│    │ Budgets      │    │ Rupee™       │
│              │    │ Portfolio│    │ Surplus      │    │ engine       │
│              │    │ Protection│   │ Advisor      │    │ Suitability  │
└──────────────┘    └──────────┘    └──────────────┘    └──────────────┘

Boundary rule:  M2 = facts (what is, how it behaved)
                M4 = judgments (is it suitable, what should you do)
```

**Example — how one transaction flows end-to-end:**
A ₹5,200 ICICI debit lands via Saafe webhook. **M1** verifies the JWS signature, decrypts the FI payload (JWE / AES-GCM via X25519 / ECDH), and writes a unified transaction. **M2** updates net worth and the 5-bucket allocation. **M3** categorises (Stage 0 evidence → Stage 1 hard-match → intent classifier → P0 tier → *Discretionary / Dining*) and refreshes the monthly cashflow snapshot. **M4** recalibrates Next Best Rupee across active goals (Emergency Fund still 40% funded → remains top priority) and updates the in-app recommendation. End-to-end target: under 60 seconds.

---

## 4. Tech Stack

| Layer | Stack |
|---|---|
| Mobile | Flutter ≥ 3.0, Dart ≥ 3.0, Provider, Hive (offline), Firebase Messaging |
| Backend | Node.js 20.20 LTS, Express 4.21 |
| Database | MongoDB Atlas Mumbai (driver 6.19, Mongoose 8.9), CSFLE for sensitive fields |
| Cache & jobs | Redis 5.8, Bull, node-cron |
| Crypto | node-jose (JWE / JWS, X25519 / ECDH AES-GCM for AA), JWT auth, JWKS |
| AI / NLP | OpenAI (advisor + email extraction), `@xenova/transformers` (local ML) |
| Observability | Pino structured logs, Sentry, Prometheus, Datadog (optional) |
| Infra & deploy | OCI Mumbai (Ubuntu 22.04 LTS), PM2 fork mode, SSH + git-pull deploys |
| Data sources | Account Aggregator (Saafe + Finvu), Gmail (OAuth + Push), PDF statements, Credit Bureau (Experian via IDSPay) |
| Security | TLS 1.2+, mTLS for Sahamati, Helmet, rate-limit (Redis-backed), JWS-signed consent payloads |

---

## 5. Key Technical Highlights

- **ReBIT NBFC-AA certified integration** (Cert No. FIU/V2.0/0335) — multi-AA support (Saafe + Finvu) via request-scoped dependency injection.
- **Multi-source ingestion** — AA (banks, MFs, equities, NPS) + Gmail (OAuth + Push watch + self-learned regex templates with LLM fallback) + PDF statements + Experian credit bureau, reconciled through a `crossSignature` matching primitive.
- **Unified financial ledger** — 90 model-defined collections across 14 domains. AA raw payloads expire on a 30-day TTL; legal-retention artefacts are pre-save immutable with ~7-year retention for regulatory audit.
- **Multi-stage categorisation pipeline** — V1+V2 with evidence extraction → hard-match → intent classifier → tier pipeline (P0–P6) → ask-vs-classify policy; explicit `classificationState` machine per transaction.
- **Goal-linked recommendation engine** — Next Best Rupee™ recalibrates allocation across active goals after every transaction; per-(goal, asset) suitability scoring; SEBI-mandated risk profile (capacity + tolerance) drives recommendations.
- **Defensive-by-default encryption at rest** — CSFLE plugin refuses to no-op in production, closing the silent-plaintext failure class; JWS-signed consent payloads via single-authority builder.
- **Streaming AI advisor** — 16 financial ratios across 4 groups with coherence-gated diagnostic flow; context-aware severity tuned to 7 user traits; responses stream over SSE.

---

## 6. MVP Access & Reviewer Quickstart

**App access** — Google Play Closed Testing invite link is included in the submission form.

**Test account** — pre-seeded with a 6-month Saafe AA consent across HDFC + ICICI deposits, a CAMS RTA MF folio, and an Experian credit pull:

| Field | Value |
|---|---|
| Mobile | `[TBD — founder to fill before submission]` |
| OTP | `[TBD — founder to fill]` |
| PAN (if asked) | `[TBD — founder to fill]` |

**What to click, in order:**

1. Log in → home (net worth + this-month cashflow)
2. **Portfolio** → 5-bucket allocation + per-account suitability scores
3. **Goals** → active goals + current Next Best Rupee recommendation
4. **Advisor** → ask *"Why is my emergency fund recommendation set this way?"* → streamed response with diagnostic flow

**Deployment summary:**
Backend runs on a single Node.js service on OCI Mumbai (Ubuntu 22.04 LTS), supervised by PM2 in fork mode. Database is MongoDB Atlas Mumbai with CSFLE on sensitive fields. All compute, primary data, backups, and replicas reside inside India per SEBI compliance. Deploys via SSH + `git pull` + PM2 restart; full env-cycle restart documented in repo.

**For depth** — the GitHub repo (linked in the submission form) contains the canonical engineering documentation:

- `docs/platform/FOUR_MODULE_ARCHITECTURE.md` — module-by-module architecture reference
- `docs/platform/DATABASE_INFRASTRUCTURE.md` — full schema, indexes, TTL policies
- `certification-framework-2.1.0/` — ReBIT NBFC-AA certification artefacts (FIU/V2.0/0335)
- `Finwiser_Architecture_Appendix.md` (in this submission folder) — extended technical detail across all four modules

**Regulatory verification** — SEBI RIA registration `INA000021331` is publicly verifiable at `sebi.gov.in/intermediary`.

**Founder contact** — `chandrachudasarma@gmail.com`.

---

## 7. Scope & Known Limitations

| Area | Current state |
|---|---|
| App distribution | Google Play **Closed Testing** only — no public release yet |
| Platform coverage | Android only; iOS and web deferred |
| Region | Single region (OCI Mumbai); any multi-region expansion stays inside India per SEBI residency rules |
| Credit Bureau integration | Live since 2026-05-11 (Experian via IDSPay) — early-production volume |
| Out of scope for this MVP | iOS, web client, public API, multi-region, third-party app marketplace |
