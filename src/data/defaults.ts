import type { SliderParams } from '../simulation/types';

export const DEFAULT_PARAMS: SliderParams = {
  // Corporate / B2B
  crossBorderAdoptionRate: 0.05,
  corporateBalanceRatio: 0.08,
  b2bReuseRate: 0.15,
  scPayrollAdoptionRate: 0.01,
  payrollScShare: 0.05,
  treasuryRetentionBias: 0.5,

  // AI agent
  agentUserGrowthRate: 0.20,
  agentWalletOpenRate: 0.05,
  stablecoinTopupRate: 0.20,
  annualAgentSpendPerUser: 18000,
  unspentBalanceRetention: 0.25,
  agentBalanceSpilloverRate: 0.10,

  // Incentives
  exchangeHoldingReward: 0.015,
  lendingCampaignApy: 0.030,
  cardCashbackRate: 0.010,
  merchantDiscountRate: 0.005,
  salaryAcceptanceBonus: 0.005,
  merchantAdoptionSubsidy: 0.5,
  issuerIncentiveIntensity: 0.5,

  // Frictions
  regulatoryFriction: 0.5,
  uxFriction: 0.7,
  cashOutConvenience: 0.7,
  brandTrust: 0.5,
  consumerProtectionQuality: 0.4,
  volatilityConcern: 0.5,
};

// Japan baseline (model assumption — not from BVNK)
export const JAPAN_BASELINE = {
  crossBorderTradeVolume: 100_000, // 億円
  totalCorporates: 4_000_000,
  crossBorderCorporates: 80_000,
  totalPopulation: 125_000_000,
  smartphoneUsers: 90_000_000,
  initialAiAgentUsers: 500_000,
  initialMerchantUniverse: 5_000_000,
  avgAnnualScReceiptPerUser: 300_000, // yen
};
