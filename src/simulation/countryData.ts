import type { CountryData } from './types';

// Region-level multipliers from BVNK 2026
export const REGION_PAYOUT_INTEREST: Record<string, number> = {
  Africa: 0.95,
  APAC: 0.87,
  'South Asia': 0.83,
  'Southeast Asia': 0.81,
  'Latin America': 0.70,
  'North America': 0.63,
  Europe: 0.60,
};

export const REGION_FEE_SAVINGS: Record<string, number> = {
  Africa: 0.41,
  APAC: 0.37,
  'South Asia': 0.45,
  'Southeast Asia': 0.41,
  'Latin America': 0.38,
  'North America': 0.35,
  Europe: 0.35,
};

export const COUNTRIES: CountryData[] = [
  // Japan — model assumption (not BVNK)
  {
    iso3: 'JPN', name: 'Japan', nameJa: '日本',
    region: 'APAC', hasBvnkData: false,
    ownership: 0.08, intentToAcquire: 0.12, currentSpend: 0.05, desiredSpend: 0.18,
    payoutInterestRegion: REGION_PAYOUT_INTEREST['APAC'],
    feeSavingsRegion: REGION_FEE_SAVINGS['APAC'],
    lat: 36.2, lon: 138.2,
  },
  // BVNK-covered countries
  {
    iso3: 'GBR', name: 'United Kingdom', nameJa: 'イギリス',
    region: 'Europe', hasBvnkData: true,
    ownership: 0.32, intentToAcquire: 0.40, currentSpend: 0.43, desiredSpend: 0.57,
    payoutInterestRegion: REGION_PAYOUT_INTEREST['Europe'],
    feeSavingsRegion: REGION_FEE_SAVINGS['Europe'],
    lat: 55.4, lon: -3.4,
  },
  {
    iso3: 'FRA', name: 'France', nameJa: 'フランス',
    region: 'Europe', hasBvnkData: true,
    ownership: 0.40, intentToAcquire: 0.39, currentSpend: 0.65, desiredSpend: 0.75,
    payoutInterestRegion: REGION_PAYOUT_INTEREST['Europe'],
    feeSavingsRegion: REGION_FEE_SAVINGS['Europe'],
    lat: 46.2, lon: 2.2,
  },
  {
    iso3: 'DEU', name: 'Germany', nameJa: 'ドイツ',
    region: 'Europe', hasBvnkData: true,
    ownership: 0.38, intentToAcquire: 0.40, currentSpend: 0.51, desiredSpend: 0.65,
    payoutInterestRegion: REGION_PAYOUT_INTEREST['Europe'],
    feeSavingsRegion: REGION_FEE_SAVINGS['Europe'],
    lat: 51.2, lon: 10.4,
  },
  {
    iso3: 'USA', name: 'United States', nameJa: 'アメリカ',
    region: 'North America', hasBvnkData: true,
    ownership: 0.52, intentToAcquire: 0.55, currentSpend: 0.58, desiredSpend: 0.69,
    payoutInterestRegion: REGION_PAYOUT_INTEREST['North America'],
    feeSavingsRegion: REGION_FEE_SAVINGS['North America'],
    lat: 37.1, lon: -95.7,
  },
  {
    iso3: 'AUS', name: 'Australia', nameJa: 'オーストラリア',
    region: 'APAC', hasBvnkData: true,
    ownership: 0.62, intentToAcquire: 0.61, currentSpend: 0.77, desiredSpend: 0.86,
    payoutInterestRegion: REGION_PAYOUT_INTEREST['APAC'],
    feeSavingsRegion: REGION_FEE_SAVINGS['APAC'],
    lat: -25.3, lon: 133.8,
  },
  {
    iso3: 'BRA', name: 'Brazil', nameJa: 'ブラジル',
    region: 'Latin America', hasBvnkData: true,
    ownership: 0.47, intentToAcquire: 0.50, currentSpend: 0.72, desiredSpend: 0.77,
    payoutInterestRegion: REGION_PAYOUT_INTEREST['Latin America'],
    feeSavingsRegion: REGION_FEE_SAVINGS['Latin America'],
    lat: -14.2, lon: -51.9,
  },
  {
    iso3: 'ARG', name: 'Argentina', nameJa: 'アルゼンチン',
    region: 'Latin America', hasBvnkData: true,
    ownership: 0.56, intentToAcquire: 0.56, currentSpend: 0.69, desiredSpend: 0.77,
    payoutInterestRegion: REGION_PAYOUT_INTEREST['Latin America'],
    feeSavingsRegion: REGION_FEE_SAVINGS['Latin America'],
    lat: -38.4, lon: -63.6,
  },
  {
    iso3: 'COL', name: 'Colombia', nameJa: 'コロンビア',
    region: 'Latin America', hasBvnkData: true,
    ownership: 0.67, intentToAcquire: 0.55, currentSpend: 0.76, desiredSpend: 0.79,
    payoutInterestRegion: REGION_PAYOUT_INTEREST['Latin America'],
    feeSavingsRegion: REGION_FEE_SAVINGS['Latin America'],
    lat: 4.6, lon: -74.3,
  },
  {
    iso3: 'MEX', name: 'Mexico', nameJa: 'メキシコ',
    region: 'Latin America', hasBvnkData: true,
    ownership: 0.47, intentToAcquire: 0.49, currentSpend: 0.75, desiredSpend: 0.87,
    payoutInterestRegion: REGION_PAYOUT_INTEREST['Latin America'],
    feeSavingsRegion: REGION_FEE_SAVINGS['Latin America'],
    lat: 23.6, lon: -102.5,
  },
  {
    iso3: 'PHL', name: 'Philippines', nameJa: 'フィリピン',
    region: 'Southeast Asia', hasBvnkData: true,
    ownership: 0.54, intentToAcquire: 0.57, currentSpend: 0.71, desiredSpend: 0.80,
    payoutInterestRegion: REGION_PAYOUT_INTEREST['Southeast Asia'],
    feeSavingsRegion: REGION_FEE_SAVINGS['Southeast Asia'],
    lat: 12.9, lon: 121.8,
  },
  {
    iso3: 'SGP', name: 'Singapore', nameJa: 'シンガポール',
    region: 'Southeast Asia', hasBvnkData: true,
    ownership: 0.44, intentToAcquire: 0.49, currentSpend: 0.66, desiredSpend: 0.79,
    payoutInterestRegion: REGION_PAYOUT_INTEREST['Southeast Asia'],
    feeSavingsRegion: REGION_FEE_SAVINGS['Southeast Asia'],
    lat: 1.4, lon: 103.8,
  },
  {
    iso3: 'THA', name: 'Thailand', nameJa: 'タイ',
    region: 'Southeast Asia', hasBvnkData: true,
    ownership: 0.46, intentToAcquire: 0.47, currentSpend: 0.68, desiredSpend: 0.77,
    payoutInterestRegion: REGION_PAYOUT_INTEREST['Southeast Asia'],
    feeSavingsRegion: REGION_FEE_SAVINGS['Southeast Asia'],
    lat: 15.9, lon: 100.9,
  },
  {
    iso3: 'IND', name: 'India', nameJa: 'インド',
    region: 'South Asia', hasBvnkData: true,
    ownership: 0.65, intentToAcquire: 0.65, currentSpend: 0.84, desiredSpend: 0.88,
    payoutInterestRegion: REGION_PAYOUT_INTEREST['South Asia'],
    feeSavingsRegion: REGION_FEE_SAVINGS['South Asia'],
    lat: 20.6, lon: 78.9,
  },
  {
    iso3: 'NGA', name: 'Nigeria', nameJa: 'ナイジェリア',
    region: 'Africa', hasBvnkData: true,
    ownership: 0.87, intentToAcquire: 0.80, currentSpend: 0.92, desiredSpend: 0.96,
    payoutInterestRegion: REGION_PAYOUT_INTEREST['Africa'],
    feeSavingsRegion: REGION_FEE_SAVINGS['Africa'],
    lat: 9.1, lon: 8.7,
  },
  {
    iso3: 'ZAF', name: 'South Africa', nameJa: '南アフリカ',
    region: 'Africa', hasBvnkData: true,
    ownership: 0.70, intentToAcquire: 0.72, currentSpend: 0.80, desiredSpend: 0.88,
    payoutInterestRegion: REGION_PAYOUT_INTEREST['Africa'],
    feeSavingsRegion: REGION_FEE_SAVINGS['Africa'],
    lat: -30.6, lon: 22.9,
  },
];

export function computeReadinessScore(c: CountryData): number {
  if (!c.hasBvnkData) return 10; // Japan: model-assumed low start
  const ownership = c.ownership ?? 0;
  const intent = c.intentToAcquire ?? 0;
  const currentSpend = c.currentSpend ?? 0;
  const desiredSpend = c.desiredSpend ?? 0;
  const payout = c.payoutInterestRegion;

  // Normalize each to 0-1 (they're already 0-1)
  const base =
    0.30 * ownership +
    0.20 * intent +
    0.20 * currentSpend +
    0.15 * desiredSpend +
    0.15 * payout;

  const modifier = 1 + c.feeSavingsRegion * 0.10;
  return Math.min(100, base * modifier * 100);
}

export function getAdoptionStageLabel(stage: number): string {
  const labels = [
    'No visible adoption',
    'Latent consumer demand',
    'Cross-border payout adoption',
    'B2B trade corridor adoption',
    'Local wallet / card integration',
    'Consumer ecosystem formation',
    'Branded money layer',
  ];
  return labels[stage] ?? labels[0];
}

export function getAdoptionStageLabelJa(stage: number): string {
  const labels = [
    '採用なし',
    '潜在的需要あり',
    '越境ペイアウト採用',
    'B2B貿易回廊採用',
    'ウォレット・カード統合',
    '消費者エコシステム形成',
    'ブランド通貨レイヤー',
  ];
  return labels[stage] ?? labels[0];
}

export function getReadinessCategory(score: number): string {
  if (score < 20) return 'Nascent';
  if (score < 40) return 'Emerging';
  if (score < 60) return 'Developing';
  if (score < 80) return 'Advanced';
  return 'Frontier';
}
