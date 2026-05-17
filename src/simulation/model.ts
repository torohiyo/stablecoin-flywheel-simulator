import type { SimulationState, SliderParams, CountryProgressState } from './types';
import { COUNTRIES, computeReadinessScore } from './countryData';
import { TRADE_EDGES } from './tradeNetwork';
import { THRESHOLD_EVENTS } from './thresholds';
import { JAPAN_BASELINE } from '../data/defaults';

const START_YEAR = 2027;

function clamp(v: number, min = 0, max = Infinity): number {
  return Math.max(min, Math.min(max, v));
}

function frictionFactor(friction: number): number {
  return 1 - friction * 0.6;
}

function trustFactor(trust: number): number {
  return 0.3 + trust * 0.7;
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
      timeline: [c.iso3 === 'JPN' ? 5 : readiness * 0.08],
    };
  }

  return {
    year: START_YEAR,
    activeCorporateAdopters: Math.round(JAPAN_BASELINE.crossBorderCorporates * params.crossBorderAdoptionRate),
    corporateScBalance: 200,
    annualB2BScPayments: 150,
    b2bReuseRatio: params.b2bReuseRate,
    scPayrollUsers: 5000,
    annualScPayrollVolume: 5,
    aiAgentUsers: JAPAN_BASELINE.initialAiAgentUsers,
    agentWalletUsers: Math.round(JAPAN_BASELINE.initialAiAgentUsers * params.agentWalletOpenRate),
    agentWalletScBalance: 10,
    annualAgentPaymentVolume: 5,
    consumerScBalance: 50,
    consumerRetentionRate: 0.3,
    cashOutRate: 0.7,
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
  const next = { ...prev, year: prev.year + 1 };
  const newTriggered = [...prev.triggeredEvents];

  // --- Corporate / B2B ---
  const networkEffect = Math.min(2, 1 + prev.activeCorporateAdopters / 50000);
  const newAdopters = clamp(
    (JAPAN_BASELINE.crossBorderCorporates - prev.activeCorporateAdopters)
      * params.crossBorderAdoptionRate
      * frictionFactor(params.regulatoryFriction)
      * trustFactor(params.brandTrust)
      * networkEffect
      * (1 + params.issuerIncentiveIntensity * 0.3)
  );
  next.activeCorporateAdopters = clamp(prev.activeCorporateAdopters + newAdopters, 0, JAPAN_BASELINE.crossBorderCorporates);

  const scProcurement = next.activeCorporateAdopters * params.corporateBalanceRatio * 5;
  const cashOutCorp = prev.corporateScBalance * (1 - params.treasuryRetentionBias) * 0.15;
  const scForPayroll = prev.corporateScBalance * params.scPayrollAdoptionRate * params.payrollScShare;
  const scForB2B = prev.corporateScBalance * params.b2bReuseRate;
  next.corporateScBalance = clamp(prev.corporateScBalance + scProcurement - cashOutCorp - scForPayroll - scForB2B * 0.3);

  next.annualB2BScPayments = clamp(
    prev.corporateScBalance * params.b2bReuseRate
    * (1 + params.issuerIncentiveIntensity * 0.2)
    * frictionFactor(params.regulatoryFriction)
  );
  next.b2bReuseRatio = clamp(
    params.b2bReuseRate * (1 + (next.activeCorporateAdopters / JAPAN_BASELINE.crossBorderCorporates) * 0.5),
    0, 0.8
  );

  // --- Payroll ---
  next.annualScPayrollVolume = clamp(
    next.corporateScBalance
    * params.scPayrollAdoptionRate
    * params.payrollScShare
    * (1 + params.salaryAcceptanceBonus * 5)
    * frictionFactor(params.regulatoryFriction)
  );
  next.scPayrollUsers = clamp(
    next.annualScPayrollVolume * 1e8 / JAPAN_BASELINE.avgAnnualScReceiptPerUser
  );

  // --- AI Agent ---
  next.aiAgentUsers = clamp(prev.aiAgentUsers * (1 + params.agentUserGrowthRate));
  next.agentWalletUsers = clamp(next.aiAgentUsers * params.agentWalletOpenRate);
  next.annualAgentPaymentVolume = clamp(
    next.agentWalletUsers * params.annualAgentSpendPerUser * params.stablecoinTopupRate / 1e8
  );
  const agentTopUps = next.agentWalletUsers * params.annualAgentSpendPerUser * params.stablecoinTopupRate / 1e8;
  const agentUnspent = agentTopUps * params.unspentBalanceRetention;
  next.agentWalletScBalance = clamp(prev.agentWalletScBalance + agentTopUps - next.annualAgentPaymentVolume + agentUnspent * 0.3);

  // --- Consumer balance ---
  const agentSpillover = prev.agentWalletScBalance * params.agentBalanceSpilloverRate;
  const incentiveDrivenAcquisition = clamp(
    next.consumerScBalance * (params.exchangeHoldingReward + params.lendingCampaignApy * 0.3)
    * (1 - params.regulatoryFriction * 0.5)
  );
  const retentionRate = clamp(
    0.2
    + params.exchangeHoldingReward * 3
    + params.cardCashbackRate * 2
    + params.merchantDiscountRate * 1.5
    + trustFactor(params.brandTrust) * 0.2
    + (next.merchantAcceptanceCount / 500000) * 0.15
    - params.uxFriction * 0.2
    - params.cashOutConvenience * 0.2,
    0.05, 0.95
  );
  next.consumerRetentionRate = retentionRate;
  next.cashOutRate = 1 - retentionRate;

  const cashOut = prev.consumerScBalance * (1 - retentionRate) * 0.4;
  const spending = prev.consumerScBalance * 0.15 * (1 - params.uxFriction * 0.3) * (next.merchantAcceptanceCount / 200000);
  next.consumerScBalance = clamp(
    prev.consumerScBalance
    + next.annualScPayrollVolume
    + agentSpillover
    + incentiveDrivenAcquisition
    - cashOut
    - spending
  );

  // --- Consumer payment volume ---
  const merchantRate = clamp(next.merchantAcceptanceCount / JAPAN_BASELINE.initialMerchantUniverse, 0, 1);
  next.consumerScPaymentVolume = clamp(
    next.consumerScBalance * 0.25
    * merchantRate
    * (1 + params.cardCashbackRate * 5 + params.merchantDiscountRate * 4)
    * frictionFactor(params.uxFriction)
  );

  // --- Merchant ---
  const merchantGrowth = clamp(
    (JAPAN_BASELINE.initialMerchantUniverse - prev.merchantAcceptanceCount)
    * (next.consumerScBalance / 20000)
    * (1 + params.merchantAdoptionSubsidy * 0.5)
    * (1 + params.merchantDiscountRate * 5)
    * frictionFactor(params.regulatoryFriction)
    * 0.08
  );
  next.merchantAcceptanceCount = clamp(
    prev.merchantAcceptanceCount + merchantGrowth,
    0,
    JAPAN_BASELINE.initialMerchantUniverse
  );

  const merchantCashOut = prev.merchantScBalance * params.cashOutConvenience * 0.3;
  const merchantReuse = prev.merchantScBalance * next.merchantReuseRatio;
  next.merchantScBalance = clamp(
    prev.merchantScBalance
    + next.consumerScPaymentVolume * 0.8
    - merchantCashOut
    - merchantReuse
  );
  next.merchantReuseRatio = clamp(
    0.05 + (next.merchantAcceptanceCount / JAPAN_BASELINE.initialMerchantUniverse) * 0.2,
    0, 0.5
  );

  // --- Branded JPY penetration ---
  next.brandedJpyPenetration = clamp(
    (next.consumerScBalance / 500) * 20
    + (next.consumerScPaymentVolume / 20000) * 30
    + trustFactor(params.brandTrust) * 20
    + (next.merchantAcceptanceCount / JAPAN_BASELINE.initialMerchantUniverse) * 20
    + (next.scPayrollUsers / 5000000) * 10,
    0, 100
  );

  // --- Country diffusion ---
  const newCountryProgress = { ...prev.countryProgress };
  for (const iso3 of Object.keys(newCountryProgress)) {
    const cp = newCountryProgress[iso3];
    const inbound = TRADE_EDGES.filter(e => e.to === iso3);

    let tradeDiffusion = 0;
    for (const edge of inbound) {
      const sender = newCountryProgress[edge.from];
      if (sender) {
        tradeDiffusion += edge.weight * sender.progressScore * 0.05;
      }
    }

    const domesticGrowth = (cp.domesticReadinessScore / 100) * 1.5
      * (1 + cp.payoutReceptivity * 0.3)
      * (iso3 === 'JPN' ? 0 : 1); // Japan driven by main model

    const globalEffect = (next.annualB2BScPayments > 10000 ? 0.3 : 0)
      + (next.merchantAcceptanceCount > 100000 ? 0.5 : 0);

    const jpnProgress = iso3 === 'JPN'
      ? clamp(
          (next.corporateScBalance / 500) * 15
          + (next.consumerScBalance / 1000) * 20
          + (next.annualB2BScPayments / 50000) * 25
          + (next.brandedJpyPenetration / 100) * 40,
          0, 100
        )
      : clamp(
          cp.progressScore
          + domesticGrowth
          + tradeDiffusion
          + globalEffect
          - (cp.progressScore > 50 ? 0.3 : 0),
          0, 100
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
      timeline: [...cp.timeline, jpnProgress],
    };
  }
  next.countryProgress = newCountryProgress;

  // --- Threshold events ---
  for (const evt of THRESHOLD_EVENTS) {
    if (!triggeredEventIds.has(evt.id) && evt.condition(next)) {
      newTriggered.push(`${evt.id}|${next.year}`);
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

  for (let y = 1; y <= 10; y++) {
    // Apply threshold effects
    for (const evt of THRESHOLD_EVENTS) {
      if (triggered.has(evt.id)) {
        const effect = evt.effect(effectiveParams);
        effectiveParams = { ...effectiveParams, ...effect };
      }
    }
    state = stepSimulation(state, effectiveParams, triggered);
    states.push(state);
  }

  return states;
}
