// Finwiser Revenue Model — Month-by-Month Projection (36 months)
// Assumptions validated in VC prep session

const ASSUMPTIONS = {
  cac: 50,                    // ₹50 per paid-acquired user
  free_to_49: 0.15,           // 15% of new free users buy ₹49 insight
  conv_49_to_199: 0.15,       // 15% of ₹49 buyers → ₹199 subscriber
  monthly_retention: 0.945,   // 94.5% monthly retention (≈18 month avg lifetime)
  k_factor: 0.3,              // each user refers 0.3 new users
  insight_price: 49,
  sub_price: 199,
  avg_insights_bought: 2,     // avg insights per ₹49 buyer over lifetime
  client_cap: 150,            // Individual RIA cap M1-M6
  corp_ia_month: 7,           // Corporate IA approved at M7

  // Free user churn — not all signups stay active
  free_user_retention_m1: 0.60,   // 60% still active after 1 month
  free_user_retention_m3: 0.30,   // 30% after 3 months
  free_user_retention_m6: 0.15,   // 15% after 6 months
  free_user_retention_m12: 0.05,  // 5% after 12 months

  // Cost items (per pull/per unit, not per user)
  // AA cost: 5 paise/fetch × 100 fetches/active user = ₹5/user in Y1
  // Volume discount: 4 paise in Y2, 3 paise in Y3
  // Inactive users don't renew consent = ₹0
  aa_cost_per_active_user_y1: 5,    // 100 × ₹0.05
  aa_cost_per_active_user_y2: 4,    // 100 × ₹0.04
  aa_cost_per_active_user_y3: 3,    // 100 × ₹0.03
  liability_report_cost: 25,      // ₹25 per liability pull (paid users only)
  llm_cost_per_conversation: 8,   // ₹8 per chatbot conversation

  // Marketing budget — ₹80L total distribution
  total_marketing_budget: 8000000, // ₹80L total
  phase1_marketing: 500000,        // ₹5L Phase 1 (light)
};

// Organic user growth curve (content + word of mouth + WhatsApp)
function getOrganic(m) {
  if (m === 1) return 30;
  if (m === 2) return 100;
  if (m === 3) return 150;
  if (m === 4) return 200;
  if (m === 5) return 250;
  if (m === 6) return 300;
  if (m <= 9) return 350 + (m - 7) * 50;    // 350, 400, 450
  if (m <= 12) return 500 + (m - 10) * 50;   // 500, 550, 600
  if (m <= 18) return 650 + (m - 13) * 30;   // 650 → 800
  if (m <= 24) return 800 + (m - 18) * 20;   // 800 → 920
  if (m <= 30) return 920 + (m - 24) * 15;   // 920 → 1010
  return 1010 + (m - 30) * 10;               // 1010 → 1070
}

// Paid acquisition (blended: paid ads + content + community)
// Total budget: ₹80L. Phase 1: ₹5L. Phase 2: ₹75L over 30 months.
// At ₹50 blended CAC:
//   Phase 1: ₹5L / ₹50 = 1,000 users over 6 months = ~167/month
//   Phase 2: ₹75L / ₹50 = 1,50,000 users over 30 months = 5,000/month
function getPaid(m) {
  if (m <= 6) {
    // Phase 1: light spend, ramp from 100 to 200/month
    return Math.round(100 + (m - 1) * 20); // 100,120,140,160,180,200 = 900 users, ₹0.45L
  }
  // Phase 2: ramp from 3,000 to 5,500/month
  if (m <= 9) return 3000 + (m - 7) * 500;    // 3000, 3500, 4000
  if (m <= 12) return 4500 + (m - 10) * 250;  // 4500, 4750, 5000
  if (m <= 24) return 5000;                     // steady 5,000/month
  return 5500;                                  // slight increase as channels mature
}

// Compute month by month
const data = [];
let cumFree = 0;
let cumPaidClients = 0;   // total ever-paid (₹49 + ₹199)
let activeSubs = 0;
let prevNew = 0;
let prevNew49 = 0;
let totalPaidSpend = 0;
let totalRevenue = 0;

for (let m = 1; m <= 36; m++) {
  const organic = getOrganic(m);
  const paid = getPaid(m);
  const referrals = m === 1 ? 0 : Math.round(prevNew * ASSUMPTIONS.k_factor);
  const totalNew = organic + paid + referrals;
  cumFree += totalNew;

  // Paid acquisition cost
  const paidCost = paid * ASSUMPTIONS.cac;
  totalPaidSpend += paidCost;

  // New ₹49 buyers: 15% of new users
  let new49 = Math.round(totalNew * ASSUMPTIONS.free_to_49);

  // Apply 150 client cap for M1-M6
  if (m < ASSUMPTIONS.corp_ia_month) {
    const remaining = Math.max(0, ASSUMPTIONS.client_cap - cumPaidClients);
    new49 = Math.min(new49, remaining);
  }

  cumPaidClients += new49;

  // New ₹199 subscribers: 15% of PREVIOUS month's ₹49 buyers
  const new199 = m === 1 ? 0 : Math.round(prevNew49 * ASSUMPTIONS.conv_49_to_199);
  activeSubs = Math.round(activeSubs * ASSUMPTIONS.monthly_retention) + new199;

  // Revenue
  // ₹49 revenue: new buyers × ₹49 (1st insight) + 50% of last month's buyers buy 2nd insight
  const returning49 = m === 1 ? 0 : Math.round(prevNew49 * 0.5);
  const rev49 = (new49 + returning49) * ASSUMPTIONS.insight_price;
  const rev199 = activeSubs * ASSUMPTIONS.sub_price;

  // ============================================================
  // FINWISER INVESTMENTS — Separate entity, clean revenue
  // Unlocked at M18 (1000+ subs + integration time)
  // All direct plan execution — NO trail commission
  // ============================================================
  let revMFPlatformFee = 0;
  let revEquityBrokerage = 0;
  let revAlgoTrading = 0;
  let revInsurance = 0;
  let revTaxFiling = 0;

  if (m >= 18) {
    const execMonths = m - 17;

    // 1. MF Platform Fee (direct plan execution via BSE StarMF)
    //    1% of transaction or ₹99, whichever is lower
    //    Blended avg: ₹80/transaction (most subs invest ₹10-15K)
    //    Avg 2 transactions/month per active user
    //    Adoption: 20% of subs at M18, grows 3%/month, caps at 55%
    const mfAdoptionRate = Math.min(0.55, 0.20 + (execMonths - 1) * 0.03);
    const subsUsingMF = Math.round(activeSubs * mfAdoptionRate);
    const mfTxnPerMonth = 2;
    const blendedPlatformFee = 80; // avg of 1% or ₹99 cap across transaction sizes
    revMFPlatformFee = subsUsingMF * mfTxnPerMonth * blendedPlatformFee;

    // 2. Equity Brokerage (via AP partnership with existing broker)
    //    Starts M21 (3 months after MF execution, needs AP setup)
    //    Revised per expert panel: 12.5% adoption, 3 trades/month (buy & hold advisory users)
    //    ₹20/order, Revenue share as AP: 60%
    //    F&O removed per panel recommendation — doesn't fit user profile
    if (m >= 21) {
      const eqMonths = m - 20;
      // Equity traders: 5% of subs at M21, grows 1%/month, caps at 15%
      const eqAdoptionRate = Math.min(0.15, 0.05 + (eqMonths - 1) * 0.01);
      const eqTraders = Math.round(activeSubs * eqAdoptionRate);
      const eqRevenue = eqTraders * 3 * 20 * 0.60; // 3 orders × ₹20 × 60% share

      revEquityBrokerage = Math.round(eqRevenue);
    }

    // 2b. Algo Trading Subscription (via Finwiser Investments)
    //     Starts M21, ₹1,999/month flat fee
    //     3% of subscribers adopt, grows 0.5%/month, caps at 8%
    if (m >= 21) {
      const algoMonths = m - 20;
      const algoAdoptionRate = Math.min(0.08, 0.03 + (algoMonths - 1) * 0.005);
      const algoUsers = Math.round(activeSubs * algoAdoptionRate);
      revAlgoTrading = algoUsers * 1999;
    }

    // 3. Insurance Referral (pure referral to IRDAI partner)
    //    10% of subs buy a policy per YEAR = 0.83%/month
    //    Avg first-year premium: ₹15K, referral fee: 15% = ₹2,250/policy
    const policyBuyersPerMonth = Math.round(activeSubs * 0.0083);
    revInsurance = policyBuyersPerMonth * 2250;
  }

  // 4. Tax Filing — computed AFTER cost model (needs activeFreeUsers)
  //    Placeholder — will be filled after activeRate is computed below

  // 5. B2B Corporate Financial Wellness (Finwiser Advisory — advisory fee)
  //    Conservative model (validated by fintech founders panel):
  //    Year 1: warm intros only, 500 employees by M12
  //    Year 2: Series A funded sales, ramp to 3,000 by M24
  //    Year 3: dedicated sales team, ramp to 10,000 by M36
  //    Revenue: mix of company-pays (₹99/emp) and employee-pays (₹199/emp)
  //    Blended: ₹99/emp/month (some companies pay less, some employees pay more)
  let revB2B = 0;
  if (m >= 6) {  // first pilot at M6 from warm intros
    let b2bEmployees;
    if (m <= 9) b2bEmployees = 50 + (m - 6) * 50;           // 50, 100, 150, 200
    else if (m <= 12) b2bEmployees = 200 + (m - 9) * 100;    // 300, 400, 500
    else if (m <= 18) b2bEmployees = 500 + (m - 12) * 167;   // ramp to ~1500
    else if (m <= 24) b2bEmployees = 1500 + (m - 18) * 250;  // ramp to ~3000
    else if (m <= 30) b2bEmployees = 3000 + (m - 24) * 500;  // ramp to ~6000
    else b2bEmployees = 6000 + (m - 30) * 667;               // ramp to ~10000
    revB2B = b2bEmployees * 99;
  }

  // Total revenue — will be recomputed after tax filing
  let revAdvisory = rev49 + rev199 + revB2B;  // B2B is advisory revenue (SEBI compliant)
  let revInvestments = revMFPlatformFee + revEquityBrokerage + revAlgoTrading + revInsurance;
  let totalRev = 0; // computed after tax filing

  // ============================================================
  // COSTS — realistic infra model
  // ============================================================

  // 1. Active free users (churned users cost ₹0)
  //    Decay: each month's cohort retains at ~70% monthly rate
  //    Active free = sum of (each month's new users × retention factor)
  //    Simplified: ~30% of cumulative are active at any time (weighted avg)
  let activeRate;
  if (m <= 6) activeRate = 0.55;       // early: most users are recent
  else if (m <= 12) activeRate = 0.40; // mix of recent + older
  else if (m <= 24) activeRate = 0.30; // more churn accumulates
  else activeRate = 0.25;              // steady state

  const activeFreeUsers = Math.round((cumFree - cumPaidClients) * activeRate);

  // 2. Fixed costs (server + MongoDB)
  //    With cloud credits: ₹0 for Y1-Y2, partial Y3
  //    Without credits: ₹10K/mo Y1, scales with users
  let fixedCost;
  if (m <= 12) fixedCost = 0;                     // Y1: cloud credits cover fully
  else if (m <= 24) fixedCost = 0;                // Y2: cloud credits still active
  else if (cumFree <= 200000) fixedCost = 50000;  // Y3: credits exhausting, ₹50K/mo
  else fixedCost = 75000;                         // Y3 late: ₹75K/mo at 2L+ users

  // 3. Variable costs
  const aaActiveUsers = activeFreeUsers + activeSubs;
  const aaRate = m <= 12 ? ASSUMPTIONS.aa_cost_per_active_user_y1
               : m <= 24 ? ASSUMPTIONS.aa_cost_per_active_user_y2
               : ASSUMPTIONS.aa_cost_per_active_user_y3;
  const aaCost = aaActiveUsers * aaRate;

  // Liability reports: ₹25 Y1, volume discount Y2-Y3
  const liabRate = m <= 12 ? 25 : m <= 24 ? 20 : 15;
  const liabilityCost = activeSubs * liabRate;

  // LLM: blended ₹1/conversation (GPT-4o-mini + templates + caching)
  // 30% of active users have a conversation/month
  // Y3: even cheaper with model improvements
  const llmRate = m <= 12 ? 1 : m <= 24 ? 0.75 : 0.50;
  const llmConversations = Math.round((activeFreeUsers + activeSubs) * 0.3);
  const llmCost = Math.round(llmConversations * llmRate);

  // Notifications: push is free, WhatsApp only for critical (2-3/month)
  // Blended ₹0.20 per active user per month
  const notifCost = Math.round((activeFreeUsers + activeSubs) * 0.20);

  const infraCost = fixedCost + aaCost + liabilityCost + llmCost + notifCost;

  // ============================================================
  // TAX FILING — now computed (activeFreeUsers is available)
  // ============================================================
  // M1 = March 2026. Filing season = Feb & Mar each year
  // M1 = April 2026. Feb = M11, M23, M35. Mar = M12, M24, M36.
  // Tiered: Active free 20% @ ₹199, ₹49 buyers 50% @ ₹99, subs 80% @ ₹49
  // Split 50-50 across Feb and March
  const taxFilingMonths = [11, 12, 23, 24, 35, 36];
  if (taxFilingMonths.includes(m)) {
    const activeFreeForTax = activeFreeUsers;
    const activeInsightBuyers = Math.round((cumPaidClients - activeSubs) * 0.60);

    const taxFreeRev = Math.round(activeFreeForTax * 0.20) * 199;
    const tax49Rev = Math.round(activeInsightBuyers * 0.50) * 99;
    const taxSubRev = Math.round(activeSubs * 0.80) * 49;

    revTaxFiling = Math.round((taxFreeRev + tax49Rev + taxSubRev) / 2);
  }

  // Final revenue computation
  revInvestments += revTaxFiling;
  totalRev = revAdvisory + revInvestments;
  totalRevenue += totalRev;

  data.push({
    month: m,
    phase: m <= 6 ? 'Phase 1 (Individual RIA)' : 'Phase 2 (Corporate IA)',
    new_organic: organic,
    new_paid: paid,
    new_referrals: referrals,
    total_new_users: totalNew,
    cumulative_free: cumFree,
    active_free: activeFreeUsers,
    new_49_buyers: new49,
    cumulative_paid_clients: cumPaidClients,
    new_199_subs: new199,
    active_subscribers: activeSubs,
    revenue_49: rev49,
    revenue_199: rev199,
    rev_advisory: revAdvisory,
    rev_b2b: revB2B,
    rev_mf_platform: revMFPlatformFee,
    rev_equity: revEquityBrokerage,
    rev_algo: revAlgoTrading,
    rev_insurance: revInsurance,
    rev_tax: revTaxFiling,
    rev_investments: revInvestments,
    total_revenue: totalRev,
    fixed_cost: fixedCost,
    aa_cost: aaCost,
    liability_cost: liabilityCost,
    llm_cost: llmCost,
    notif_cost: notifCost,
    infra_cost: infraCost,
    marketing_spend: paidCost,
    net_margin: totalRev - infraCost,
    arr: totalRev * 12,
  });

  prevNew = totalNew;
  prevNew49 = new49;
}

// Output CSV
const headers = [
  'Month', 'Phase',
  'Cum Users', 'Active Subs',
  'Advisory Rev', 'MF Platform', 'Equity/F&O', 'Insurance', 'Investments Rev', 'Total Revenue',
  'Total Infra', 'Net Margin', 'ARR'
];

console.log(headers.join(','));
data.forEach(d => {
  console.log([
    d.month, `"${d.phase}"`,
    d.cumulative_free, d.active_subscribers,
    d.rev_advisory, d.rev_mf_platform, d.rev_equity, d.rev_insurance, d.rev_investments, d.total_revenue,
    d.infra_cost, d.net_margin, d.arr
  ].join(','));
});

// Summary
console.log('\n--- SUMMARY ---');
console.log(`Total users at M36: ${data[35].cumulative_free.toLocaleString()}`);
console.log(`Total ever-paid: ${data[35].cumulative_paid_clients.toLocaleString()}`);
console.log(`Active subscribers at M36: ${data[35].active_subscribers}`);
console.log(`MRR at M36: ₹${data[35].total_revenue.toLocaleString()}`);
console.log(`ARR at M36: ₹${data[35].arr.toLocaleString()}`);
console.log(`Net margin at M36: ₹${data[35].net_margin.toLocaleString()}`);
console.log(`Total revenue (36 months): ₹${totalRevenue.toLocaleString()}`);
console.log(`Total marketing spend: ₹${totalPaidSpend.toLocaleString()}`);

// Key milestones
console.log('\n--- KEY MILESTONES ---');
console.log('Month | Users    | Subs | Advisory  | MF Platfm | Eq/F&O   | Insurance | FW Invest | Total MRR | Infra     | Net       | ARR');
console.log('------|----------|------|-----------|-----------|----------|-----------|-----------|-----------|-----------|-----------|----------');
[6, 12, 15, 18, 21, 24, 30, 36].forEach(m => {
  const d = data[m - 1];
  const fmt = n => ('₹' + n.toLocaleString()).padStart(10);
  console.log(
    `M${String(m).padStart(2)}   | ${String(d.cumulative_free.toLocaleString()).padStart(8)} | ${String(d.active_subscribers).padStart(4)} | ${fmt(d.rev_advisory)} | ${fmt(d.rev_mf_platform)} | ${fmt(d.rev_equity)} | ${fmt(d.rev_insurance)} | ${fmt(d.rev_investments)} | ${fmt(d.total_revenue)} | ${fmt(d.infra_cost)} | ${fmt(d.net_margin)} | ${fmt(d.arr)}`
  );
});

// Revenue split at M36
const d36 = data[35];
const totalM36 = d36.total_revenue;
const advPct = Math.round(d36.rev_advisory/totalM36*100);
const invPct = Math.round(d36.rev_investments/totalM36*100);
console.log('\n--- M36 REVENUE SPLIT ---');
console.log(`\nFINWISER ADVISORY (SEBI RIA — fee only):`);
console.log(`  ₹49 Insights:     ₹${d36.revenue_49.toLocaleString()}`);
console.log(`  ₹199 Subscriptions: ₹${d36.revenue_199.toLocaleString()}`);
console.log(`  Subtotal:         ₹${d36.rev_advisory.toLocaleString()} (${advPct}%)`);
console.log(`\nFINWISER INVESTMENTS (AMFI/AP — execution):`);
console.log(`  MF Platform Fee:  ₹${d36.rev_mf_platform.toLocaleString()}`);
console.log(`  Equity Brokerage: ₹${d36.rev_equity.toLocaleString()}`);
console.log(`  Algo Trading:     ₹${d36.rev_algo.toLocaleString()}`);
console.log(`  Insurance Referral: ₹${d36.rev_insurance.toLocaleString()}`);
console.log(`  Tax Filing:       ₹${d36.rev_tax.toLocaleString()} (seasonal — Feb/Mar only)`);
console.log(`  Subtotal:         ₹${d36.rev_investments.toLocaleString()} (${invPct}%)`);
console.log(`\nCOMBINED:`);
console.log(`  Total MRR:        ₹${totalM36.toLocaleString()}`);
console.log(`  Total ARR:        ₹${d36.arr.toLocaleString()}`);
console.log(`  Net Margin:       ₹${d36.net_margin.toLocaleString()}/month`);
console.log(`\n  Advisory:Investments ratio = ${advPct}:${invPct} ${advPct > 50 ? '✓ SEBI compliant' : '⚠ Advisory must exceed 50%'}`);
