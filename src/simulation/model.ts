import type { SimulationState, SliderParams, CountryProgressState } from './types';
import { TOTAL_STEPS, stepToDateMs, START_DATE_MS } from './types';
import { COUNTRIES, computeReadinessScore } from './countryData';
import { TRADE_EDGES } from './tradeNetwork';
import { THRESHOLD_EVENTS } from './thresholds';
import { JAPAN_BASELINE } from '../data/defaults';

const WEEKS_PER_YEAR = 52;

function clamp(v: number, min = 0, max = Infinity): number {
  return Math.max(min, Math.min(max, v));
}

function frictionFactor(friction: number): number {
  return 1 - friction * 0.6;
}

function trustFactor(trust: number): number {
  return 0.3 + trust * 0.7;
}

// Convert an annual rate (fraction adopting/converting per year) to weekly.
// Uses compound conversion so the annual effect matches.
function weeklyFromAnnualRate(annualRate: number): number {
  if (annualRate <= 0) return 0;
  if (annualRate >= 1) return 1 - Math.pow(0.0001, 1 / WEEKS_PER_YEAR);
  return 1 - Math.pow(1 - annualRate, 1 / WEEKS_PER_YEAR);
}

// Convert an annual growth rate (e.g., user growth) to weekly compounded.
function weeklyGrowthFactor(annualGrowth: number): number {
  return Math.pow(1 + annualGrowth, 1 / WEEKS_PER_YEAR) - 1;
}

export function buildInitialState(params: SliderParams): SimulationState {
  const countryProgress: Record<string, CountryProgressState> = {};
  for (const c of COUNTRIES) {
    const readiness = computeReadinessScore(c);
    countryProgress[c.iso3] = {
      iso3: c.iso3,
      progressScore: c.iso3 === 'JPN' ? 5 : readiness * 0.08,
      adoptionStage: 0,
      domesticReadinessScore: readiness,
      tradeDiffusionReceived: 0,
      payoutReceptivity: c.payoutInterestRegion,
      spendingReceptivity: (c.currentSpend ?? 0.1) * 0.5 + (c.desiredSpend ?? 0.1) * 0.5,
    };
  }

  return {
    step: 0,
    weekIndex: 0,
    dateMs: START_DATE_MS,
    activeCorporateAdopters: Math.round(JAPAN_BASELINE.crossBorderCorporates * params.crossBorderAdoptionRate * 0.1),
    corporateScBalance: 200,
    weeklyB2BScPayments: 150 / WEEKS_PER_YEAR,
    annualB2BScPayments: 150,
    b2bReuseRatio: params.b2bReuseRate,
    scPayrollUsers: 5000,
    weeklyScPayrollVolume: 5 / WEEKS_PER_YEAR,
    annualScPayrollVolume: 5,
    aiAgentUsers: JAPAN_BASELINE.initialAiAgentUsers,
    agentWalletUsers: Math.round(JAPAN_BASELINE.initialAiAgentUsers * params.agentWalletOpenRate),
    agentWalletScBalance: 10,
    weeklyAgentPaymentVolume: 5 / WEEKS_PER_YEAR,
    annualAgentPaymentVolume: 5,
    consumerScBalance: 50,
    consumerRetentionRate: 0.3,
    cashOutRate: 0.7,
    weeklyConsumerScPaymentVolume: 10 / WEEKS_PER_YEAR,
    consumerScPaymentVolume: 10,
    merchantAcceptanceCount: 1000,
    merchantScBalance: 5,
    merchantReuseRatio: 0.05,
    brandedJpyPenetration: 0,
    countryProgress,
    triggeredEvents: [],
  };
}

export function stepSimulation(
  prev: SimulationState,
  params: SliderParams,
  triggeredEventIds: Set<string>,
): SimulationState {
  const nextStep = prev.step + 1;

  // --- Rate conversions ---
  const wAdoptRate = weeklyFromAnnualRate(params.crossBorderAdoptionRate);
  const wScPayrollAdopt = weeklyFromAnnualRate(params.scPayrollAdoptionRate);
  const wB2BReuse = weeklyFromAnnualRate(params.b2bReuseRate);
  const wSpilloverRate = weeklyFromAnnualRate(params.agentBalanceSpilloverRate);
  const wAgentUserGrowth = weeklyGrowthFactor(params.agentUserGrowthRate);
  const wExchangeReward = params.exchangeHoldingReward / WEEKS_PER_YEAR;
  const wLendingApy = params.lendingCampaignApy / WEEKS_PER_YEAR;

  const next: SimulationState = {
    ...prev,
    step: nextStep,
    weekIndex: nextStep,
    dateMs: stepToDateMs(nextStep),
  };
  const newTriggered = [...prev.triggeredEvents];

  // --- Corporate / B2B ---
  const nonAdopters = JAPAN_BASELINE.crossBorderCorporates - prev.activeCorporateAdopters;
  const networkEffect = Math.min(2, 1 + prev.activeCorporateAdopters / 50000);
  const newAdopters = clamp(
    nonAdopters
      * wAdoptRate
      * frictionFactor(params.regulatoryFriction)
      * trustFactor(params.brandTrust)
      * networkEffect
      * (1 + params.issuerIncentiveIntensity * 0.3)
  );
  next.activeCorporateAdopters = clamp(
    prev.activeCorporateAdopters + newAdopters,
    0,
    JAPAN_BASELINE.crossBorderCorporates,
  );

  // Weekly stock changes (procurement, cash out, payroll, B2B routing)
  const scProcurementPerYear = next.activeCorporateAdopters * params.corporateBalanceRatio * 5;
  const wScProcurement = scProcurementPerYear / WEEKS_PER_YEAR;
  const wCashOutCorp = prev.corporateScBalance * (1 - params.treasuryRetentionBias) * 0.15 / WEEKS_PER_YEAR;
  const wScForPayroll = prev.corporateScBalance * wScPayrollAdopt * params.payrollScShare;
  // Routing weekly fraction equal to (annual b2bReuse * 0.3) / 52 used to drain stock
  const wScForB2B = prev.corporateScBalance * wB2BReuse * 0.3;
  next.corporateScBalance = clamp(
    prev.corporateScBalance + wScProcurement - wCashOutCorp - wScForPayroll - wScForB2B,
  );

  next.weeklyB2BScPayments = clamp(
    prev.corporateScBalance * wB2BReuse
      * (1 + params.issuerIncentiveIntensity * 0.2)
      * frictionFactor(params.regulatoryFriction),
  );
  next.annualB2BScPayments = next.weeklyB2BScPayments * WEEKS_PER_YEAR;
  next.b2bReuseRatio = clamp(
    params.b2bReuseRate
      * (1 + (next.activeCorporateAdopters / JAPAN_BASELINE.crossBorderCorporates) * 0.5),
    0,
    0.8,
  );

  // --- Payroll ---
  next.weeklyScPayrollVolume = clamp(
    next.corporateScBalance
      * wScPayrollAdopt
      * params.payrollScShare
      * (1 + params.salaryAcceptanceBonus * 5)
      * frictionFactor(params.regulatoryFriction),
  );
  next.annualScPayrollVolume = next.weeklyScPayrollVolume * WEEKS_PER_YEAR;
  next.scPayrollUsers = clamp(
    (next.annualScPayrollVolume * 1e8) / JAPAN_BASELINE.avgAnnualScReceiptPerUser,
  );

  // --- AI Agent ---
  next.aiAgentUsers = clamp(prev.aiAgentUsers * (1 + wAgentUserGrowth));
  next.agentWalletUsers = clamp(next.aiAgentUsers * params.agentWalletOpenRate);

  const wAgentSpendPerUser = params.annualAgentSpendPerUser / WEEKS_PER_YEAR;
  const wAgentTopUps =
    (next.agentWalletUsers * wAgentSpendPerUser * params.stablecoinTopupRate) / 1e8; // 億円/week
  next.weeklyAgentPaymentVolume = wAgentTopUps; // weekly spend in 億円
  next.annualAgentPaymentVolume = next.weeklyAgentPaymentVolume * WEEKS_PER_YEAR;

  const wAgentUnspent = wAgentTopUps * params.unspentBalanceRetention;
  next.agentWalletScBalance = clamp(
    prev.agentWalletScBalance + wAgentTopUps - next.weeklyAgentPaymentVolume + wAgentUnspent * 0.3,
  );

  // --- Consumer balance ---
  const wAgentSpillover = prev.agentWalletScBalance * wSpilloverRate;
  const wIncentiveDriven = clamp(
    prev.consumerScBalance * (wExchangeReward + wLendingApy * 0.3) * (1 - params.regulatoryFriction * 0.5),
  );

  const annualRetention = clamp(
    0.2
      + params.exchangeHoldingReward * 3
      + params.cardCashbackRate * 2
      + params.merchantDiscountRate * 1.5
      + trustFactor(params.brandTrust) * 0.2
      + (next.merchantAcceptanceCount / 500000) * 0.15
      - params.uxFriction * 0.2
      - params.cashOutConvenience * 0.2,
    0.05,
    0.95,
  );
  next.consumerRetentionRate = annualRetention;
  next.cashOutRate = 1 - annualRetention;

  // Weekly cash-out from compounding the annual retention
  const wKeep = Math.pow(annualRetention, 1 / WEEKS_PER_YEAR);
  const wCashOutFraction = 1 - wKeep;
  const wCashOut = prev.consumerScBalance * wCashOutFraction;

  const merchantRate = clamp(
    next.merchantAcceptanceCount / JAPAN_BASELINE.initialMerchantUniverse,
    0,
    1,
  );
  const wSpend =
    (prev.consumerScBalance * 0.15 * (1 - params.uxFriction * 0.3)
      * (next.merchantAcceptanceCount / 200000)) / WEEKS_PER_YEAR;

  // Payroll inflow per week (already weekly)
  next.consumerScBalance = clamp(
    prev.consumerScBalance + next.weeklyScPayrollVolume + wAgentSpillover + wIncentiveDriven - wCashOut - wSpend,
  );

  // --- Consumer payment volume (weekly + annualized) ---
  next.weeklyConsumerScPaymentVolume = clamp(
    (next.consumerScBalance * 0.25 * merchantRate
      * (1 + params.cardCashbackRate * 5 + params.merchantDiscountRate * 4)
      * frictionFactor(params.uxFriction)) / WEEKS_PER_YEAR,
  );
  next.consumerScPaymentVolume = next.weeklyConsumerScPaymentVolume * WEEKS_PER_YEAR;

  // --- Merchant ---
  const wMerchantGrowth = clamp(
    (JAPAN_BASELINE.initialMerchantUniverse - prev.merchantAcceptanceCount)
      * (next.consumerScBalance / 20000)
      * (1 + params.merchantAdoptionSubsidy * 0.5)
      * (1 + params.merchantDiscountRate * 5)
      * frictionFactor(params.regulatoryFriction)
      * (0.08 / WEEKS_PER_YEAR),
  );
  next.merchantAcceptanceCount = clamp(
    prev.merchantAcceptanceCount + wMerchantGrowth,
    0,
    JAPAN_BASELINE.initialMerchantUniverse,
  );

  const wMerchantCashOut = prev.merchantScBalance * params.cashOutConvenience * 0.3 / WEEKS_PER_YEAR;
  const wMerchantReuse = prev.merchantScBalance * next.merchantReuseRatio / WEEKS_PER_YEAR;
  next.merchantScBalance = clamp(
    prev.merchantScBalance + next.weeklyConsumerScPaymentVolume * 0.8 - wMerchantCashOut - wMerchantReuse,
  );
  next.merchantReuseRatio = clamp(
    0.05 + (next.merchantAcceptanceCount / JAPAN_BASELINE.initialMerchantUniverse) * 0.2,
    0,
    0.5,
  );

  // --- Branded JPY penetration (stock, smoothed) ---
  const targetBrandedJpy = clamp(
    (next.consumerScBalance / 500) * 20
      + (next.consumerScPaymentVolume / 20000) * 30
      + trustFactor(params.brandTrust) * 20
      + (next.merchantAcceptanceCount / JAPAN_BASELINE.initialMerchantUniverse) * 20
      + (next.scPayrollUsers / 5000000) * 10,
    0,
    100,
  );
  // Smooth toward target weekly (1/26 per week ≈ 6 month time-constant)
  next.brandedJpyPenetration = prev.brandedJpyPenetration + (targetBrandedJpy - prev.brandedJpyPenetration) / 26;

  // --- Country diffusion (weekly) ---
  const newCountryProgress: Record<string, CountryProgressState> = {};
  for (const iso3 of Object.keys(prev.countryProgress)) {
    const cp = prev.countryProgress[iso3];

    let tradeDiffusion = 0;
    for (const edge of TRADE_EDGES) {
      if (edge.to !== iso3) continue;
      const sender = prev.countryProgress[edge.from];
      if (sender) {
        tradeDiffusion += edge.weight * sender.progressScore * 0.05;
      }
    }

    const domesticGrowthAnnual =
      (cp.domesticReadinessScore / 100) * 1.5 * (1 + cp.payoutReceptivity * 0.3);
    const domesticGrowth = iso3 === 'JPN' ? 0 : domesticGrowthAnnual / WEEKS_PER_YEAR;

    const globalEffectAnnual =
      (next.annualB2BScPayments > 10000 ? 0.3 : 0)
      + (next.merchantAcceptanceCount > 100000 ? 0.5 : 0);
    const globalEffect = globalEffectAnnual / WEEKS_PER_YEAR;

    const tradeDiffusionWeekly = tradeDiffusion / WEEKS_PER_YEAR;

    const jpnProgress = iso3 === 'JPN'
      ? clamp(
          (next.corporateScBalance / 500) * 15
            + (next.consumerScBalance / 1000) * 20
            + (next.annualB2BScPayments / 50000) * 25
            + (next.brandedJpyPenetration / 100) * 40,
          0,
          100,
        )
      : clamp(
          cp.progressScore + domesticGrowth + tradeDiffusionWeekly + globalEffect - (cp.progressScore > 50 ? 0.3 / WEEKS_PER_YEAR : 0),
          0,
          100,
        );

    const stage = jpnProgress < 10 ? 0
      : jpnProgress < 25 ? 1
      : jpnProgress < 40 ? 2
      : jpnProgress < 55 ? 3
      : jpnProgress < 70 ? 4
      : jpnProgress < 85 ? 5
      : 6;

    newCountryProgress[iso3] = {
      ...cp,
      progressScore: jpnProgress,
      adoptionStage: stage,
      tradeDiffusionReceived: tradeDiffusion,
    };
  }
  next.countryProgress = newCountryProgress;

  // --- Threshold events ---
  for (const evt of THRESHOLD_EVENTS) {
    if (!triggeredEventIds.has(evt.id) && evt.condition(next)) {
      newTriggered.push(`${evt.id}|${next.step}`);
      triggeredEventIds.add(evt.id);
    }
  }
  next.triggeredEvents = newTriggered;

  return next;
}

export function runFullSimulation(params: SliderParams): SimulationState[] {
  const states: SimulationState[] = [];
  let state = buildInitialState(params);
  states.push(state);

  const triggered = new Set<string>();
  let effectiveParams = { ...params };

  for (let s = 1; s <= TOTAL_STEPS; s++) {
    // Apply threshold effects from already-triggered events
    if (triggered.size > 0) {
      effectiveParams = { ...params };
      for (const evt of THRESHOLD_EVENTS) {
        if (triggered.has(evt.id)) {
          const effect = evt.effect(effectiveParams);
          effectiveParams = { ...effectiveParams, ...effect };
        }
      }
    }
    state = stepSimulation(state, effectiveParams, triggered);
    states.push(state);
  }

  return states;
}
