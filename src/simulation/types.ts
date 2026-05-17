export interface SliderParams {
  // Corporate / B2B
  crossBorderAdoptionRate: number;    // 0-1
  corporateBalanceRatio: number;      // 0-1
  b2bReuseRate: number;               // 0-1
  scPayrollAdoptionRate: number;      // 0-1
  payrollScShare: number;             // 0-1
  treasuryRetentionBias: number;      // 0-1 (low=0, high=1)

  // AI agent
  agentUserGrowthRate: number;        // 0-1 annual
  agentWalletOpenRate: number;        // 0-1
  stablecoinTopupRate: number;        // 0-1
  annualAgentSpendPerUser: number;    // yen
  unspentBalanceRetention: number;    // 0-1
  agentBalanceSpilloverRate: number;  // 0-1

  // Incentives
  exchangeHoldingReward: number;      // 0-1
  lendingCampaignApy: number;         // 0-1
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
  timeline: number[];
}

export interface SimulationState {
  year: number;

  // Japan corporate and B2B
  activeCorporateAdopters: number;
  corporateScBalance: number;         // 億円
  annualB2BScPayments: number;        // 億円
  b2bReuseRatio: number;              // 0-1

  // Payroll / payouts
  scPayrollUsers: number;             // 人
  annualScPayrollVolume: number;      // 億円

  // AI agent route
  aiAgentUsers: number;               // 人
  agentWalletUsers: number;
  agentWalletScBalance: number;       // 億円
  annualAgentPaymentVolume: number;   // 億円

  // Consumers
  consumerScBalance: number;          // 億円
  consumerRetentionRate: number;      // 0-1
  cashOutRate: number;                // 0-1
  consumerScPaymentVolume: number;    // 億円

  // Merchants
  merchantAcceptanceCount: number;    // 店舗数
  merchantScBalance: number;          // 億円
  merchantReuseRatio: number;         // 0-1

  // Consumer positioning
  brandedJpyPenetration: number;      // 0-100

  // Global diffusion
  countryProgress: Record<string, CountryProgressState>;
  triggeredEvents: string[];
}

export interface ThresholdEvent {
  id: string;
  condition: (state: SimulationState) => boolean;
  label: string;
  labelJa: string;
  effect: (params: SliderParams) => Partial<SliderParams>;
  triggered: boolean;
  year?: number;
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
