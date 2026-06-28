// Renders Finwiser_Technical_Overview.md → Finwiser_Technical_Documentation_HyKr_MVP.pdf
// - Replaces the ASCII diagrams in §2–§3 with proper inline SVGs
// - Branded A4 layout (Finwiser tokens), print-optimised

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { marked } = require('marked');

const SRC = path.join(__dirname, 'Finwiser_Tech_Doc_Submission.md');
const OUT = path.join(__dirname, 'Finwiser_Technical_Documentation_HyKr_MVP.pdf');

// ──────────────────────────────────────────────────────────────────────────────
//  SVG 1 — Four-Module Architecture
// ──────────────────────────────────────────────────────────────────────────────
const SVG_MODULES = `
<svg class="arch-svg" viewBox="0 0 820 540" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Four-module architecture">
  <defs>
    <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 Z" fill="#1a1a2e"/>
    </marker>
    <marker id="arr2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 Z" fill="#e94560"/>
    </marker>
    <linearGradient id="grad-m1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1a1a2e"/>
      <stop offset="1" stop-color="#0f3460"/>
    </linearGradient>
    <linearGradient id="grad-m4" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#e94560"/>
      <stop offset="1" stop-color="#c0354e"/>
    </linearGradient>
  </defs>

  <text x="410" y="20" text-anchor="middle" font-size="12" font-weight="700" fill="#64748b" letter-spacing="2.5">FOUR-MODULE ARCHITECTURE</text>

  <!-- Sources row -->
  <g font-family="Inter, system-ui, sans-serif">
    <rect x="10"  y="40" width="190" height="56" rx="7" fill="#fff" stroke="#0f3460" stroke-width="1.5"/>
    <text x="105" y="62" text-anchor="middle" font-size="13" font-weight="700" fill="#0f3460">ACCOUNT AGGREGATOR</text>
    <text x="105" y="80" text-anchor="middle" font-size="11.5" fill="#475569">Saafe + Finvu · ReBIT 2.1.0</text>

    <rect x="215" y="40" width="180" height="56" rx="7" fill="#fff" stroke="#0f3460" stroke-width="1.5"/>
    <text x="305" y="62" text-anchor="middle" font-size="13" font-weight="700" fill="#0f3460">GMAIL PUSH</text>
    <text x="305" y="80" text-anchor="middle" font-size="11.5" fill="#475569">Pub/Sub · template extract</text>

    <rect x="410" y="40" width="170" height="56" rx="7" fill="#fff" stroke="#0f3460" stroke-width="1.5"/>
    <text x="495" y="62" text-anchor="middle" font-size="13" font-weight="700" fill="#0f3460">PDF STATEMENTS</text>
    <text x="495" y="80" text-anchor="middle" font-size="11.5" fill="#475569">pdf-parse + cheerio</text>

    <rect x="595" y="40" width="215" height="56" rx="7" fill="#fff" stroke="#0f3460" stroke-width="1.5"/>
    <text x="702" y="62" text-anchor="middle" font-size="13" font-weight="700" fill="#0f3460">CREDIT BUREAU</text>
    <text x="702" y="80" text-anchor="middle" font-size="11.5" fill="#475569">Experian via IDSPay</text>

    <!-- Arrows from sources to M1 -->
    <line x1="105" y1="96"  x2="105" y2="120" stroke="#1a1a2e" stroke-width="1.4" marker-end="url(#arr)"/>
    <line x1="305" y1="96"  x2="305" y2="120" stroke="#1a1a2e" stroke-width="1.4" marker-end="url(#arr)"/>
    <line x1="495" y1="96"  x2="495" y2="120" stroke="#1a1a2e" stroke-width="1.4" marker-end="url(#arr)"/>
    <line x1="702" y1="96"  x2="702" y2="120" stroke="#1a1a2e" stroke-width="1.4" marker-end="url(#arr)"/>
  </g>

  <!-- Module 1 -->
  <g font-family="Inter, system-ui, sans-serif">
    <rect x="40" y="120" width="740" height="62" rx="10" fill="url(#grad-m1)" stroke="#e94560" stroke-width="1.5"/>
    <text x="410" y="146" text-anchor="middle" font-size="15" font-weight="800" fill="#fff" letter-spacing="1">MODULE 1 — DATA INGESTION</text>
    <text x="410" y="167" text-anchor="middle" font-size="12" fill="#cbd5e0">Consent lifecycle · AA decrypt (X25519 / ECDH · AES-GCM) · JWS sign · webhook state machine · SIG_V1 unified transactions</text>

    <!-- Arrow + label down to M2/M3 -->
    <line x1="410" y1="182" x2="410" y2="215" stroke="#1a1a2e" stroke-width="1.4" marker-end="url(#arr)"/>
    <rect x="282" y="190" width="256" height="20" rx="4" fill="#fff" stroke="#cbd5e0"/>
    <text x="410" y="205" text-anchor="middle" font-size="10.5" font-style="italic" fill="#1a1a2e">unified transactions + canonical signatures</text>
  </g>

  <!-- Module 2 + Module 3 -->
  <g font-family="Inter, system-ui, sans-serif">
    <!-- M2 -->
    <rect x="10"  y="225" width="395" height="170" rx="10" fill="#fff" stroke="#1a1a2e" stroke-width="1.8"/>
    <path d="M10 235 q0 -10 10 -10 h375 q10 0 10 10 v22 h-395 z" fill="#1a1a2e"/>
    <text x="207" y="248" text-anchor="middle" font-size="13.5" font-weight="800" fill="#fff" letter-spacing="0.6">MODULE 2 — LEDGER + INVESTMENT INTELLIGENCE</text>
    <g font-size="12" fill="#1a1a2e">
      <text x="25" y="278">• Net worth + 5-bucket allocation (HHI)</text>
      <text x="25" y="298">• Portfolio · Liabilities · Protection</text>
      <text x="25" y="318">• Per-scheme MF analytics: returns, β, α, Sharpe, IR</text>
      <text x="25" y="338">• Peer-rank with category distribution (Direct vs Regular)</text>
      <text x="25" y="358">• XIRR with accuracy tier (full / partial / synthetic)</text>
      <text x="25" y="378">• Counterparty ledger · manual assets</text>
    </g>

    <!-- M3 -->
    <rect x="415" y="225" width="395" height="170" rx="10" fill="#fff" stroke="#1a1a2e" stroke-width="1.8"/>
    <path d="M415 235 q0 -10 10 -10 h375 q10 0 10 10 v22 h-395 z" fill="#1a1a2e"/>
    <text x="612" y="248" text-anchor="middle" font-size="13.5" font-weight="800" fill="#fff" letter-spacing="0.6">MODULE 3 — CATEGORISATION &amp; CASHFLOW</text>
    <g font-size="12" fill="#1a1a2e">
      <text x="430" y="278">• Six-tier orchestrator (P0 · P1 · P2 · P2B · P4 · P5 · P6)</text>
      <text x="430" y="298">• 13 ratios in 3 groups · two-layer coherence gate</text>
      <text x="430" y="318">• 7-trait context profile (cross-session memory)</text>
      <text x="430" y="338">• Monthly cashflow + surplus + stability (CoV)</text>
      <text x="430" y="358">• Self-learning email extraction templates</text>
      <text x="430" y="378">• Advisor chat with SSE streaming</text>
    </g>

    <!-- Bi-directional flow between M2 and M3 -->
    <rect x="406" y="298" width="8" height="24" rx="2" fill="#f8f9fa" stroke="#e94560" stroke-width="0.8"/>
    <text x="410" y="290" text-anchor="middle" font-size="9" font-weight="700" fill="#e94560" letter-spacing="0.5">↔</text>
  </g>

  <!-- Arrows from M2/M3 down to M4 -->
  <g font-family="Inter, system-ui, sans-serif">
    <line x1="207" y1="395" x2="280" y2="445" stroke="#1a1a2e" stroke-width="1.4" marker-end="url(#arr)"/>
    <line x1="612" y1="395" x2="540" y2="445" stroke="#1a1a2e" stroke-width="1.4" marker-end="url(#arr)"/>
    <text x="155" y="425" font-size="10" font-style="italic" fill="#1a1a2e">assets · analytics · protection</text>
    <text x="555" y="425" font-size="10" font-style="italic" fill="#1a1a2e">surplus · stability · traits</text>
  </g>

  <!-- Module 4 -->
  <g font-family="Inter, system-ui, sans-serif">
    <rect x="100" y="450" width="620" height="60" rx="10" fill="url(#grad-m4)" stroke="#1a1a2e" stroke-width="1.5"/>
    <text x="410" y="476" text-anchor="middle" font-size="15" font-weight="800" fill="#fff" letter-spacing="1">MODULE 4 — GOALS &amp; DECISIONING</text>
    <text x="410" y="497" text-anchor="middle" font-size="12" fill="#fff" opacity="0.95">42-row SEBI suitability matrix · Next Best Rupee™ utility engine · Risk profile + append-only audit</text>
  </g>

  <!-- Footer annotation -->
  <text x="410" y="530" text-anchor="middle" font-size="10.5" font-weight="600" fill="#475569" letter-spacing="0.4">Modules 1 – 3 produce <tspan font-weight="800" fill="#1a1a2e">facts</tspan>. Module 4 produces <tspan font-weight="800" fill="#e94560">judgments</tspan>.</text>
</svg>
`;

// ──────────────────────────────────────────────────────────────────────────────
//  SVG 2 — Deployment & Data Flow
// ──────────────────────────────────────────────────────────────────────────────
const SVG_DEPLOY = `
<svg class="arch-svg" viewBox="0 0 820 580" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Deployment and data flow">
  <defs>
    <marker id="arrd" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 Z" fill="#1a1a2e"/>
    </marker>
  </defs>

  <text x="410" y="18" text-anchor="middle" font-size="12" font-weight="700" fill="#64748b" letter-spacing="2.5">DEPLOYMENT &amp; DATA FLOW</text>

  <!-- Section: CLIENT TIER -->
  <g font-family="Inter, system-ui, sans-serif">
    <rect x="10" y="32" width="800" height="66" rx="10" fill="#f8f9fa" stroke="#cbd5e0" stroke-width="1.2"/>
    <text x="22" y="50" font-size="10" font-weight="700" fill="#64748b" letter-spacing="2">CLIENT TIER</text>
    <rect x="270" y="54" width="280" height="34" rx="8" fill="#1a1a2e"/>
    <text x="410" y="72" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">FLUTTER ANDROID</text>
    <text x="410" y="86" text-anchor="middle" font-size="10" fill="#cbd5e0">Closed Testing · HTTPS + JWT · SSE for advisor stream</text>
  </g>

  <!-- Arrow CLIENT → APP -->
  <line x1="410" y1="100" x2="410" y2="122" stroke="#1a1a2e" stroke-width="1.4" marker-end="url(#arrd)"/>
  <text x="416" y="114" font-size="9.5" font-style="italic" fill="#475569">TLS · JWT · SSE</text>

  <!-- Section: APPLICATION TIER -->
  <g font-family="Inter, system-ui, sans-serif">
    <rect x="10" y="124" width="800" height="312" rx="10" fill="#fff" stroke="#1a1a2e" stroke-width="1.6"/>
    <path d="M10 134 q0 -10 10 -10 h780 q10 0 10 10 v24 h-800 z" fill="#1a1a2e"/>
    <text x="22" y="150" font-size="10.5" font-weight="700" fill="#fff" letter-spacing="2">APPLICATION TIER</text>
    <text x="798" y="150" text-anchor="end" font-size="10" font-weight="600" fill="#cbd5e0" letter-spacing="0.5">OCI Mumbai · Ubuntu 22.04 · PM2 fork mode · Node 20 LTS</text>

    <!-- Sync path -->
    <rect x="25" y="172" width="380" height="86" rx="8" fill="#f8f9fa" stroke="#0f3460" stroke-width="1.2"/>
    <text x="40" y="190" font-size="12" font-weight="800" fill="#0f3460" letter-spacing="1.2">SYNC PATH</text>
    <g font-size="12" fill="#1a1a2e">
      <text x="40" y="210">Express + JWT middleware</text>
      <text x="40" y="228">→ Controllers → services</text>
      <text x="40" y="246">→ Models (M1–M4 logic) → SSE</text>
    </g>

    <!-- Async path -->
    <rect x="415" y="172" width="380" height="86" rx="8" fill="#f8f9fa" stroke="#0f3460" stroke-width="1.2"/>
    <text x="430" y="190" font-size="12" font-weight="800" fill="#0f3460" letter-spacing="1.2">ASYNC PATH</text>
    <g font-size="12" fill="#1a1a2e">
      <text x="430" y="210">Bull workers + node-cron</text>
      <text x="430" y="228">AA fetch · Categorisation tiers</text>
      <text x="430" y="246">NAV refresh + peer rank · Daily / monthly snapshots</text>
    </g>

    <!-- Connecting arrows down to stores -->
    <line x1="215" y1="260" x2="215" y2="286" stroke="#1a1a2e" stroke-width="1.4" marker-end="url(#arrd)"/>
    <line x1="605" y1="260" x2="605" y2="286" stroke="#1a1a2e" stroke-width="1.4" marker-end="url(#arrd)"/>

    <!-- MongoDB -->
    <rect x="25" y="290" width="380" height="64" rx="8" fill="#fff" stroke="#1a1a2e" stroke-width="1.4"/>
    <text x="40" y="308" font-size="12" font-weight="800" fill="#1a1a2e" letter-spacing="1.2">MONGODB ATLAS · MUMBAI</text>
    <text x="40" y="326" font-size="12" fill="#475569">90 collections · 14 domains · M10+</text>
    <text x="40" y="344" font-size="12" font-weight="700" fill="#e94560">CSFLE: PAN · mobile · financial PII</text>

    <!-- Redis -->
    <rect x="415" y="290" width="380" height="64" rx="8" fill="#fff" stroke="#1a1a2e" stroke-width="1.4"/>
    <text x="430" y="308" font-size="12" font-weight="800" fill="#1a1a2e" letter-spacing="1.2">REDIS (MANAGED)</text>
    <text x="430" y="326" font-size="12" fill="#475569">Cache · queues · rate-limit · in-flight locks</text>
    <text x="430" y="344" font-size="12" font-weight="700" fill="#0f3460">Bull queue backing · token-bucket store</text>

    <!-- Webhook ingress band -->
    <rect x="25" y="364" width="770" height="64" rx="8" fill="#fff3f5" stroke="#e94560" stroke-width="1.2"/>
    <text x="40" y="382" font-size="12" font-weight="800" fill="#e94560" letter-spacing="1.2">WEBHOOK INGRESS</text>
    <text x="40" y="400" font-size="12" fill="#1a1a2e">AA notifications (Sahamati · signed payloads · mTLS via SahamatiNet)</text>
    <text x="40" y="418" font-size="12" fill="#1a1a2e">Gmail Pub/Sub push (token-verified) · webhook validator → queue worker dispatch</text>
  </g>

  <!-- Arrow APP → EXTERNAL -->
  <line x1="410" y1="438" x2="410" y2="460" stroke="#1a1a2e" stroke-width="1.4" marker-end="url(#arrd)"/>
  <text x="416" y="452" font-size="9.5" font-style="italic" fill="#475569">TLS 1.2+ · mTLS · OAuth</text>

  <!-- Section: EXTERNAL -->
  <g font-family="Inter, system-ui, sans-serif">
    <rect x="10" y="462" width="800" height="98" rx="10" fill="#f8f9fa" stroke="#cbd5e0" stroke-width="1.2"/>
    <text x="22" y="482" font-size="10" font-weight="700" fill="#64748b" letter-spacing="2">EXTERNAL</text>

    <g font-size="10.5" font-weight="700">
      <rect x="25"  y="496" width="125" height="28" rx="14" fill="#fff" stroke="#0f3460" stroke-width="1.2"/>
      <text x="87.5" y="515" text-anchor="middle" fill="#0f3460">Saafe / Finvu</text>
      <rect x="158" y="496" width="80"  height="28" rx="14" fill="#fff" stroke="#0f3460" stroke-width="1.2"/>
      <text x="198" y="515" text-anchor="middle" fill="#0f3460">AMFI</text>
      <rect x="246" y="496" width="95"  height="28" rx="14" fill="#fff" stroke="#0f3460" stroke-width="1.2"/>
      <text x="293.5" y="515" text-anchor="middle" fill="#0f3460">mfapi.in</text>
      <rect x="349" y="496" width="170" height="28" rx="14" fill="#fff" stroke="#0f3460" stroke-width="1.2"/>
      <text x="434" y="515" text-anchor="middle" fill="#0f3460">Experian via IDSPay</text>
      <rect x="527" y="496" width="115" height="28" rx="14" fill="#fff" stroke="#0f3460" stroke-width="1.2"/>
      <text x="584.5" y="515" text-anchor="middle" fill="#0f3460">Gmail API</text>
      <rect x="650" y="496" width="95"  height="28" rx="14" fill="#fff" stroke="#0f3460" stroke-width="1.2"/>
      <text x="697.5" y="515" text-anchor="middle" fill="#0f3460">OpenAI</text>
    </g>

    <text x="410" y="544" text-anchor="middle" font-size="10" fill="#475569" font-style="italic">All financial logic runs server-side · all data resident in India (OCI Mumbai + Atlas Mumbai)</text>
  </g>
</svg>
`;

// ──────────────────────────────────────────────────────────────────────────────
//  SVG 3 — Worked Example (one first connection, traced through all four modules)
// ──────────────────────────────────────────────────────────────────────────────
const SVG_WORKED = `
<svg class="arch-svg" viewBox="0 0 820 760" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Worked example — one first connection traced through four modules">
  <defs>
    <marker id="warr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 Z" fill="#1a1a2e"/>
    </marker>
    <marker id="warr-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 Z" fill="#e94560"/>
    </marker>
  </defs>

  <text x="410" y="22" text-anchor="middle" font-size="13" font-weight="700" fill="#64748b" letter-spacing="2.5">WORKED EXAMPLE — ONE FIRST CONNECTION</text>

  <g font-family="Inter, system-ui, sans-serif">
    <!-- Input -->
    <rect x="90" y="40" width="640" height="70" rx="9" fill="#f8f9fa" stroke="#cbd5e0" stroke-width="1.3"/>
    <text x="410" y="68" text-anchor="middle" font-size="14" font-weight="700" fill="#1a1a2e">Meera connects · 11 accounts · Gmail · 1 locked PDF</text>
    <text x="410" y="90" text-anchor="middle" font-size="13" fill="#475569">She believes:  net worth ~₹38L · surplus ~₹55k/mo</text>
    <line x1="410" y1="114" x2="410" y2="158" stroke="#1a1a2e" stroke-width="1.6" marker-end="url(#warr)"/>

    <!-- M1 -->
    <rect x="90" y="162" width="640" height="76" rx="9" fill="#fff" stroke="#1a1a2e" stroke-width="1.6"/>
    <path d="M90 176 q0 -14 14 -14 h612 q14 0 14 14 v16 h-640 z" fill="#1a1a2e"/>
    <text x="410" y="180" text-anchor="middle" font-size="13" font-weight="800" fill="#fff" letter-spacing="0.8">M1 · INGESTION — Get it in, intact and once</text>
    <text x="108" y="208" font-size="12" fill="#1a1a2e">Dual-curve crypto · failedLinkRefs reconciler · late-EXPIRED guard · SIG_V1 cross-source dedup</text>
    <text x="108" y="228" font-size="12" fill="#475569"><tspan font-weight="700" fill="#e94560">Naïve →</tspan> loses a folio, triple-counts a ₹10k SIP</text>
    <line x1="410" y1="242" x2="410" y2="280" stroke="#1a1a2e" stroke-width="1.6" marker-end="url(#warr)"/>
    <text x="424" y="264" font-size="10" font-style="italic" fill="#475569">One clean, deduped ledger</text>

    <!-- M2 -->
    <rect x="90" y="284" width="640" height="76" rx="9" fill="#fff" stroke="#1a1a2e" stroke-width="1.6"/>
    <path d="M90 298 q0 -14 14 -14 h612 q14 0 14 14 v16 h-640 z" fill="#1a1a2e"/>
    <text x="410" y="302" text-anchor="middle" font-size="13" font-weight="800" fill="#fff" letter-spacing="0.8">M2 · LEDGER — Numbers that are honest</text>
    <text x="108" y="330" font-size="12" fill="#1a1a2e">NAV risk/return math · split anomaly guard · XIRR accuracy tiers + 80% gate · PAN-aware dedup</text>
    <text x="108" y="350" font-size="12" fill="#475569"><tspan font-weight="700" fill="#e94560">Naïve →</tspan> a +38% split = "skill"; debt counted 2×</text>
    <line x1="410" y1="364" x2="410" y2="402" stroke="#1a1a2e" stroke-width="1.6" marker-end="url(#warr)"/>
    <text x="424" y="386" font-size="10" font-style="italic" fill="#475569">A true balance sheet</text>

    <!-- M3 -->
    <rect x="90" y="406" width="640" height="76" rx="9" fill="#fff" stroke="#1a1a2e" stroke-width="1.6"/>
    <path d="M90 420 q0 -14 14 -14 h612 q14 0 14 14 v16 h-640 z" fill="#1a1a2e"/>
    <text x="410" y="424" text-anchor="middle" font-size="13" font-weight="800" fill="#fff" letter-spacing="0.8">M3 · CATEGORISATION — A surplus you can trust</text>
    <text x="108" y="452" font-size="12" fill="#1a1a2e">6-tier orchestrator · 9-intent classifier · ask-don't-guess · coherence gate scores 0.81</text>
    <text x="108" y="472" font-size="12" fill="#475569"><tspan font-weight="700" fill="#e94560">Naïve →</tspan> reads a ₹60k reimbursement as salary</text>
    <line x1="410" y1="486" x2="410" y2="524" stroke="#1a1a2e" stroke-width="1.6" marker-end="url(#warr)"/>
    <text x="424" y="508" font-size="10" font-style="italic" fill="#475569">A trustworthy monthly surplus</text>

    <!-- M4 -->
    <rect x="90" y="528" width="640" height="76" rx="9" fill="#fff" stroke="#1a1a2e" stroke-width="1.6"/>
    <path d="M90 542 q0 -14 14 -14 h612 q14 0 14 14 v16 h-640 z" fill="#1a1a2e"/>
    <text x="410" y="546" text-anchor="middle" font-size="13" font-weight="800" fill="#fff" letter-spacing="0.8">M4 · DECISIONING — Explainable, suitable, auditable</text>
    <text x="108" y="574" font-size="12" fill="#1a1a2e">Next Best Rupee utility · 42-row SEBI matrix · input-hashed snapshot · 7-year audit trail</text>
    <text x="108" y="594" font-size="12" fill="#475569"><tspan font-weight="700" fill="#e94560">Naïve →</tspan> splits evenly, can't say why, churns daily</text>
    <line x1="410" y1="608" x2="410" y2="646" stroke="#e94560" stroke-width="1.8" marker-end="url(#warr-a)"/>

    <!-- Result -->
    <rect x="90" y="650" width="640" height="96" rx="9" fill="#fff3f5" stroke="#e94560" stroke-width="1.4"/>
    <text x="370" y="672" text-anchor="middle" font-size="12" font-weight="700" fill="#64748b" letter-spacing="1.5">BELIEVED</text>
    <text x="540" y="672" text-anchor="middle" font-size="12" font-weight="700" fill="#e94560" letter-spacing="1.5">FINWISER</text>
    <g font-size="12">
      <text x="120" y="696" font-weight="600" fill="#1a1a2e">Net worth</text>
      <text x="370" y="696" text-anchor="middle" font-size="14" fill="#475569">₹38.0 L</text>
      <line x1="418" y1="692" x2="450" y2="692" stroke="#e94560" stroke-width="1.4" marker-end="url(#warr-a)"/>
      <text x="540" y="696" text-anchor="middle" font-size="14" font-weight="700" fill="#1a1a2e">₹31.2 L</text>
      <text x="120" y="718" font-weight="600" fill="#1a1a2e">Surplus / mo</text>
      <text x="370" y="718" text-anchor="middle" font-size="14" fill="#475569">₹55 k</text>
      <line x1="418" y1="714" x2="450" y2="714" stroke="#e94560" stroke-width="1.4" marker-end="url(#warr-a)"/>
      <text x="540" y="718" text-anchor="middle" font-size="14" font-weight="700" fill="#1a1a2e">₹41 k</text>
      <text x="120" y="740" font-weight="600" fill="#1a1a2e">Goals</text>
      <text x="370" y="740" text-anchor="middle" font-size="14" fill="#475569">4 active</text>
      <line x1="418" y1="736" x2="450" y2="736" stroke="#e94560" stroke-width="1.4" marker-end="url(#warr-a)"/>
      <text x="540" y="740" text-anchor="middle" font-size="14" font-weight="700" fill="#1a1a2e">3 fit, 1 not fit</text>
    </g>
  </g>
</svg>
`;

// ──────────────────────────────────────────────────────────────────────────────
//  Preprocess markdown: replace the two ASCII diagram code fences with SVGs
// ──────────────────────────────────────────────────────────────────────────────
// Marker tokens survive markdown parsing intact (HTML comments are passed
// through verbatim by marked). After parsing we substitute them with the
// real <figure>...<svg>... HTML — parsing the SVG markup through marked
// produces stray <p> wrappers inside the SVG and corrupts it.
const FIG_TOKEN_MODULES = '<!--SVG_FIGURE_MODULES-->';
const FIG_TOKEN_DEPLOY  = '<!--SVG_FIGURE_DEPLOY-->';
const FIG_TOKEN_WORKED  = '<!--SVG_FIGURE_WORKED-->';

function svgFigureModules() {
  return `<figure class="arch-figure">${SVG_MODULES}<figcaption>Figure 1 — Four-module architecture. Ingestion → Ledger × Categorisation → Decisioning.</figcaption></figure>`;
}
function svgFigureDeploy() {
  return `<figure class="arch-figure">${SVG_DEPLOY}<figcaption>Figure 2 — Deployment topology and request paths (sync vs async, webhook ingress, external dependencies).</figcaption></figure>`;
}
function svgFigureWorked() {
  return `<figure class="arch-figure">${SVG_WORKED}<figcaption>Figure 3 — One first connection, traced through all four modules: the mechanism at each stop, and what a naïve build gets wrong without it.</figcaption></figure>`;
}

function swapDiagrams(md) {
  // Match all triple-backtick fenced blocks (no language specifier),
  // then identify them by content.
  const fence = /```\n([\s\S]*?)```/g;
  return md.replace(fence, (match, body) => {
    if (body.includes('MODULE 1') && body.includes('Ingestion') && body.includes('MODULE 4')) {
      return FIG_TOKEN_MODULES;
    }
    if (body.includes('CLIENT TIER') && body.includes('APPLICATION TIER')) {
      return FIG_TOKEN_DEPLOY;
    }
    if (body.includes('M1 · INGESTION') && body.includes('M4 · DECISIONING')) {
      return FIG_TOKEN_WORKED;
    }
    return match;
  });
}

function injectSvgFigures(html) {
  return html
    .replace(FIG_TOKEN_MODULES, svgFigureModules())
    .replace(FIG_TOKEN_DEPLOY,  svgFigureDeploy())
    .replace(FIG_TOKEN_WORKED,  svgFigureWorked());
}

// Move "page-break-before" off the empty marker <div> and onto the real element
// that follows it. An empty block carrying page-break-before is a Chromium quirk
// that can strand a blank page (the break fires, then the next block's
// break-inside/after:avoid rules force a second break). Attaching the break to the
// heading/element itself breaks cleanly with no orphan page.
function hoistPageBreaks(html) {
  return html.replace(
    /<div style="page-break-before:\s*always"><\/div>\s*<([a-z0-9]+)([^>]*)>/gi,
    (_m, tag, attrs) => `<${tag} style="page-break-before: always"${attrs}>`
  );
}

// ──────────────────────────────────────────────────────────────────────────────
//  HTML template
// ──────────────────────────────────────────────────────────────────────────────
function buildHtml(bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Finwiser — Technical Documentation</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
<style>
/* ────────────────────────────────────────────────────────────────────
   Typography system — kept deliberately tight
   Sizes: 24 / 14 / 11 / 10 / 9 / 8 pt   (6 total)
   Weights: 400 / 600 / 700              (3 total)
   Fonts: Inter (body) · JetBrains Mono (code only)
   ──────────────────────────────────────────────────────────────────── */
:root {
  --primary: #1a1a2e;
  --accent: #e94560;
  --ink: #0f172a;
  --muted: #475569;
  --rule: #e2e8f0;
  --bg-soft: #f8fafc;
}
@page { size: A4; margin: 15mm 14mm; }
* { box-sizing: border-box; }
html, body {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 10pt;
  line-height: 1.55;
  color: var(--ink);
  margin: 0;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.doc { max-width: 100%; }

/* Headings */
h1 {
  font-size: 24pt;
  font-weight: 700;
  color: var(--primary);
  margin: 0 0 12px 0;
  line-height: 1.15;
  letter-spacing: -0.5px;
}
h1::after {
  content: "";
  display: block;
  width: 48px;
  height: 3px;
  background: var(--accent);
  margin-top: 10px;
  border-radius: 2px;
}
h2 {
  font-size: 14pt;
  font-weight: 700;
  color: var(--primary);
  margin: 22px 0 10px 0;
  padding-bottom: 5px;
  border-bottom: 1px solid var(--rule);
  page-break-after: avoid;
}
h3 {
  font-size: 11pt;
  font-weight: 700;
  color: var(--primary);
  margin: 14px 0 6px 0;
  page-break-after: avoid;
}

/* Title meta-blockquote (under h1) */
h1 + blockquote {
  border-left: 3px solid var(--accent);
  padding: 8px 12px;
  margin: 10px 0;
  background: var(--bg-soft);
  color: var(--muted);
  font-size: 9pt;
  font-style: normal;
  line-height: 1.55;
  border-radius: 0 3px 3px 0;
}
h1 + blockquote p { margin: 2px 0; }
h1 + blockquote strong { color: var(--primary); font-weight: 600; }

/* Regulatory banner (paragraph right after the title blockquote) */
h1 + blockquote + p {
  background: var(--primary);
  color: #fff;
  padding: 11px 16px;
  border-radius: 6px;
  font-size: 9pt;
  line-height: 1.6;
  margin: 12px 0 20px 0;
  text-align: center;
}
h1 + blockquote + p strong { color: #fff; font-weight: 600; }

/* Body */
p { margin: 0 0 8px 0; }
strong { color: var(--primary); font-weight: 600; }
em { font-style: italic; color: var(--muted); }

/* Lists */
ul, ol { margin: 4px 0 10px 22px; padding: 0; }
li { margin: 3px 0; }
li > strong:first-child { color: var(--primary); }

/* Code */
code {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  background: var(--bg-soft);
  color: var(--primary);
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 9pt;
  word-break: break-all;
}
pre {
  background: var(--bg-soft);
  border-radius: 5px;
  padding: 10px 12px;
  font-size: 9pt;
  line-height: 1.45;
  overflow-x: auto;
  page-break-inside: avoid;
  margin: 8px 0;
}
pre code { background: transparent; padding: 0; font-size: inherit; }

/* Body blockquote (in-body, not the title meta) */
.doc h2 ~ blockquote {
  border-left: 3px solid var(--accent);
  background: var(--bg-soft);
  padding: 8px 14px;
  margin: 10px 0;
  font-style: italic;
  color: var(--muted);
  border-radius: 0 3px 3px 0;
}

/* Tables */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0 14px 0;
  font-size: 10pt;
  page-break-inside: avoid;
}
thead th {
  background: var(--primary);
  color: #fff;
  font-weight: 700;
  text-align: left;
  padding: 5px 10px;
}
tbody td {
  padding: 4px 10px;
  border-bottom: 1px solid var(--rule);
  vertical-align: top;
}
tbody tr:nth-child(even) { background: var(--bg-soft); }
tbody tr:last-child td { border-bottom: none; }
tbody td code { font-size: 9pt; }

/* SVG figures */
.arch-figure {
  margin: 12px 0 14px 0;
  page-break-inside: avoid;
  text-align: center;
}
.arch-figure .arch-svg {
  width: 100%;
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
  border: 1px solid var(--rule);
  border-radius: 8px;
  background: #fff;
  padding: 8px;
}
.arch-figure figcaption {
  font-size: 9pt;
  color: var(--muted);
  margin-top: 6px;
  font-style: italic;
}

/* Disclaimer (final italic block at end of doc) */
.doc > *:last-child em {
  display: block;
  border-top: 1px solid var(--rule);
  padding-top: 10px;
  margin-top: 14px;
  font-size: 9pt;
  color: var(--muted);
  font-style: italic;
  text-align: center;
  line-height: 1.55;
}

hr {
  border: none;
  border-top: 1px solid var(--rule);
  margin: 16px 0;
}
</style>
</head>
<body>
<div class="doc">
${bodyHtml}
</div>
</body>
</html>`;
}

// ──────────────────────────────────────────────────────────────────────────────
//  Main
// ──────────────────────────────────────────────────────────────────────────────
(async () => {
  console.log('[1/4] Reading markdown source...');
  const md = fs.readFileSync(SRC, 'utf8');

  console.log('[2/4] Swapping ASCII diagrams for SVGs...');
  const swapped = swapDiagrams(md);

  console.log('[3/4] Converting markdown → HTML...');
  marked.setOptions({ gfm: true, breaks: false });
  const parsedHtml = marked.parse(swapped);
  const bodyHtml = hoistPageBreaks(injectSvgFigures(parsedHtml));
  console.log('  bodyHtml type:', typeof bodyHtml, 'length:', bodyHtml && bodyHtml.length);
  const html = buildHtml(bodyHtml);
  console.log('  html type:', typeof html, 'length:', html && html.length);

  // Optional: write intermediate HTML for inspection
  fs.writeFileSync(path.join(__dirname, '.tech-doc-rendered.html'), String(html));

  console.log('[4/4] Rendering to PDF via puppeteer...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.evaluateHandle('document.fonts.ready');

  await page.pdf({
    path: OUT,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: `<div style="font-family:Inter,sans-serif;font-size:8pt;color:#94a3b8;width:100%;padding:0 14mm;display:flex;justify-content:space-between;">
       <span><b style="color:#1a1a2e">Finwiser</b> · Technical Documentation</span>
       <span>HyKr Build Challenge 2026 · MVP Submission</span>
     </div>`,
    footerTemplate: `<div style="font-family:Inter,sans-serif;font-size:8pt;color:#94a3b8;width:100%;padding:0 14mm;display:flex;justify-content:space-between;">
       <span>SEBI RIA INA000021331 · OCI Mumbai · MongoDB Atlas Mumbai</span>
       <span>Page <span class="pageNumber"></span> / <span class="totalPages"></span></span>
     </div>`,
    margin: { top: '15mm', right: '14mm', bottom: '15mm', left: '14mm' }
  });

  await browser.close();
  const sizeKB = (fs.statSync(OUT).size / 1024).toFixed(1);
  console.log(`\n✓ PDF saved: ${OUT}`);
  console.log(`  Size: ${sizeKB} KB`);
})().catch(err => {
  console.error('Render failed:', err);
  process.exit(1);
});
