export interface SliderParams {
  // Corporate / B2B (annual rates / shares)
  crossBorderAdoptionRate: number;    // 0-1 annual
  corporateBalanceRatio: number;      // 0-1
  b2bReuseRate: number;               // 0-1 annual share
  scPayrollAdoptionRate: number;      // 0-1
  payrollScShare: number;             // 0-1
  treasuryRetentionBias: number;      // 0-1 (low=0, high=1)

  // AI agent
  agentUserGrowthRate: number;        // 0-1 annual compounded
  agentWalletOpenRate: number;        // 0-1
  stablecoinTopupRate: number;        // 0-1
  annualAgentSpendPerUser: number;    // yen / year
  unspentBalanceRetention: number;    // 0-1
  agentBalanceSpilloverRate: number;  // 0-1 annual share

  // Incentives
  exchangeHoldingReward: number;      // 0-1 annual
  lendingCampaignApy: number;         // 0-1 annual
  cardCashbackRate: number;           // 0-1
  merchantDiscountRate: number;       // 0-1
  salaryAcceptanceBonus: number;      // 0-1
  merchantAdoptionSubsidy: number;    // 0-1
  issuerIncentiveIntensity: number;   // 0-1

  // Frictions
  regulatoryFriction: number;         // 0-1 (low=good)
  uxFriction: number;
  cashOutConvenience: number;
  brandTrust: number;                 // 0-1 (high=good)
  consumerProtectionQuality: number;
  volatilityConcern: number;
}

export interface CountryProgressState {
  iso3: string;
  progressScore: number;    // 0-100
  adoptionStage: number;    // 0-6
  domesticReadinessScore: number;
  tradeDiffusionReceived: number;
  payoutReceptivity: number;
  spendingReceptivity: number;
}

export interface SimulationState {
  step: number;        // 0..TOTAL_STEPS
  weekIndex: number;   // same as step (alias for clarity)
  dateMs: number;      // absolute ms timestamp

  // Japan corporate and B2B
  activeCorporateAdopters: number;
  corporateScBalance: number;         // 億円 stock
  weeklyB2BScPayments: number;        // 億円 / week (flow)
  annualB2BScPayments: number;        // 億円 / year (annualized)
  b2bReuseRatio: number;              // 0-1

  // Payroll / payouts
  scPayrollUsers: number;             // 人 (cumulative recipients)
  weeklyScPayrollVolume: number;      // 億円 / week
  annualScPayrollVolume: number;      // 億円 / year (annualized)

  // AI agent route
  aiAgentUsers: number;               // 人
  agentWalletUsers: number;
  agentWalletScBalance: number;       // 億円 stock
  weeklyAgentPaymentVolume: number;   // 億円 / week
  annualAgentPaymentVolume: number;   // 億円 / year (annualized)

  // Consumers
  consumerScBalance: number;          // 億円 stock
  consumerRetentionRate: number;      // 0-1 annualized
  cashOutRate: number;                // 0-1 annualized
  weeklyConsumerScPaymentVolume: number;  // 億円 / week
  consumerScPaymentVolume: number;    // 億円 / year (annualized)

  // Merchants
  merchantAcceptanceCount: number;    // 店舗数
  merchantScBalance: number;          // 億円 stock
  merchantReuseRatio: number;         // 0-1

  // Consumer positioning
  brandedJpyPenetration: number;      // 0-100

  // Global diffusion
  countryProgress: Record<string, CountryProgressState>;
  triggeredEvents: string[];          // each: `${id}|${step}`
}

export interface ThresholdEvent {
  id: string;
  condition: (state: SimulationState) => boolean;
  label: string;
  labelJa: string;
  effect: (params: SliderParams) => Partial<SliderParams>;
  triggered: boolean;
  step?: number;
}

export interface CountryData {
  iso3: string;
  name: string;
  nameJa: string;
  region: string;
  hasBvnkData: boolean;
  ownership?: number;
  intentToAcquire?: number;
  currentSpend?: number;
  desiredSpend?: number;
  payoutInterestRegion: number;
  feeSavingsRegion: number;
  lat: number;
  lon: number;
}

export interface TradeEdge {
  from: string;
  to: string;
  weight: number;
  label?: string;
}

export type ScenarioKey = 'conservative' | 'base' | 'bull';

export interface Scenario {
  key: ScenarioKey;
  label: string;
  labelJa: string;
  description: string;
  params: Partial<SliderParams>;
}

// --- Time helpers ---

export const START_DATE_MS = new Date(2027, 0, 1).getTime();
export const WEEK_MS = 7 * 24 * 3600 * 1000;
export const TOTAL_STEPS = 520; // 10 years × 52 weeks

export function stepToDateMs(step: number): number {
  return START_DATE_MS + step * WEEK_MS;
}

export function stepToDate(step: number): Date {
  return new Date(stepToDateMs(step));
}

export function formatStepShort(step: number): string {
  const d = stepToDate(step);
  return `${d.getFullYear()}年${d.getMonth() + 1}月`;
}

export function formatStepFull(step: number): string {
  const d = stepToDate(step);
  const week = (step % 52) + 1;
  return `${d.getFullYear()}年${d.getMonth() + 1}月 (W${week})`;
}

export function stepToYear(step: number): number {
  return stepToDate(step).getFullYear();
}
