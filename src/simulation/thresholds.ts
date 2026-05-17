import type { ThresholdEvent } from './types';

export const THRESHOLD_EVENTS: Omit<ThresholdEvent, 'triggered' | 'year'>[] = [
  {
    id: 'corporate_treasury_saas',
    condition: s => s.corporateScBalance > 5000,
    label: 'Corporate treasury management SaaS appears',
    labelJa: '企業SC財務管理SaaSが登場',
    effect: p => ({ b2bReuseRate: Math.min(0.9, p.b2bReuseRate * 1.3) }),
  },
  {
    id: 'erp_sc_modules',
    condition: s => s.b2bReuseRatio > 0.20,
    label: 'ERP / accounting SaaS adds SC settlement modules',
    labelJa: 'ERP・会計SaaSがSC決済モジュールを追加',
    effect: p => ({ crossBorderAdoptionRate: Math.min(0.8, p.crossBorderAdoptionRate * 1.4) }),
  },
  {
    id: 'major_payment_player',
    condition: s => s.annualB2BScPayments > 30000,
    label: 'Major Japanese payment player enters at scale',
    labelJa: '大手決済事業者が本格参入',
    effect: p => ({
      crossBorderAdoptionRate: Math.min(0.9, p.crossBorderAdoptionRate * 1.5),
      merchantAdoptionSubsidy: Math.min(1, p.merchantAdoptionSubsidy + 0.2),
    }),
  },
  {
    id: 'payroll_campaign_expand',
    condition: s => s.scPayrollUsers > 500000,
    label: 'Payroll acceptance campaigns expand',
    labelJa: '給与受け取りキャンペーン拡大',
    effect: p => ({
      scPayrollAdoptionRate: Math.min(0.8, p.scPayrollAdoptionRate * 1.5),
      salaryAcceptanceBonus: Math.min(0.1, p.salaryAcceptanceBonus + 0.01),
    }),
  },
  {
    id: 'exchange_holding_reward_campaign',
    condition: s => s.consumerScBalance > 3000,
    label: 'Major exchange strengthens holding reward campaign',
    labelJa: '大手取引所が保有報酬キャンペーンを強化',
    effect: p => ({ exchangeHoldingReward: Math.min(0.1, p.exchangeHoldingReward + 0.01) }),
  },
  {
    id: 'highreward_sc_card',
    condition: s => s.consumerScBalance > 5000,
    label: 'Card company launches high-reward SC-linked card',
    labelJa: 'カード会社が高還元SC連携カードを発行',
    effect: p => ({ cardCashbackRate: Math.min(0.1, p.cardCashbackRate + 0.015) }),
  },
  {
    id: 'merchant_cluster_adoption',
    condition: s => s.merchantAcceptanceCount > 50000,
    label: 'EC and tourism operators adopt in clusters',
    labelJa: 'ECと観光業者がクラスター採用',
    effect: p => ({ merchantDiscountRate: Math.min(0.1, p.merchantDiscountRate + 0.005) }),
  },
  {
    id: 'agent_wallet_standard',
    condition: s => s.agentWalletScBalance > 1000,
    label: 'Agent wallet becomes standard in fintech apps',
    labelJa: 'エージェントウォレットがフィンテックアプリの標準機能に',
    effect: p => ({ agentWalletOpenRate: Math.min(0.5, p.agentWalletOpenRate * 1.4) }),
  },
  {
    id: 'usdc_agent_standard',
    condition: s => s.agentWalletUsers > 1000000,
    label: 'USDC / SC becomes common agent payment standard',
    labelJa: 'USDC/SCがエージェント決済の標準になる',
    effect: p => ({ stablecoinTopupRate: Math.min(0.8, p.stablecoinTopupRate * 1.3) }),
  },
  {
    id: 'branded_jpy_messaging',
    condition: s => s.consumerScPaymentVolume > 10000,
    label: 'Public messaging shifts: "stablecoin" → "branded JPY balance"',
    labelJa: '「ステーブルコイン」→「ブランドJPY残高」へ言葉が変わる',
    effect: p => ({ brandTrust: Math.min(1, p.brandTrust + 0.15) }),
  },
  {
    id: 'japan_asia_corridors',
    condition: s => s.annualB2BScPayments > 30000,
    label: 'Japan–Asia stablecoin settlement corridors emerge',
    labelJa: '日本・アジア間SC決済回廊が形成',
    effect: p => p,
  },
];
