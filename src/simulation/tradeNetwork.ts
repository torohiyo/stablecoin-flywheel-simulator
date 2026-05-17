import type { TradeEdge } from './types';

// Illustrative trade diffusion weights — not empirical trade values.
// Replace with actual bilateral trade data for production use.
export const TRADE_EDGES: TradeEdge[] = [
  // Japan → primary Asian corridors
  { from: 'JPN', to: 'SGP', weight: 0.30, label: 'Japan→Singapore (hub)' },
  { from: 'JPN', to: 'THA', weight: 0.22, label: 'Japan→Thailand (manufacturing)' },
  { from: 'JPN', to: 'PHL', weight: 0.18, label: 'Japan→Philippines (remittance/BPO)' },
  { from: 'JPN', to: 'IND', weight: 0.15, label: 'Japan→India (IT/services)' },
  { from: 'JPN', to: 'AUS', weight: 0.20, label: 'Japan→Australia (resources/tourism)' },
  { from: 'JPN', to: 'USA', weight: 0.28, label: 'Japan→USA (enterprise/card)' },
  { from: 'JPN', to: 'DEU', weight: 0.12, label: 'Japan→Germany (manufacturing)' },
  { from: 'JPN', to: 'GBR', weight: 0.10, label: 'Japan→UK (finance)' },
  { from: 'JPN', to: 'MEX', weight: 0.08, label: 'Japan→Mexico (auto/mfg)' },
  { from: 'JPN', to: 'BRA', weight: 0.07, label: 'Japan→Brazil (diaspora)' },

  // Singapore as secondary hub → Southeast Asia
  { from: 'SGP', to: 'THA', weight: 0.25, label: 'Singapore→Thailand' },
  { from: 'SGP', to: 'PHL', weight: 0.22, label: 'Singapore→Philippines' },
  { from: 'SGP', to: 'IND', weight: 0.20, label: 'Singapore→India' },
  { from: 'SGP', to: 'AUS', weight: 0.18, label: 'Singapore→Australia' },

  // India → South Asia / Africa
  { from: 'IND', to: 'ZAF', weight: 0.10, label: 'India→South Africa (diaspora)' },
  { from: 'IND', to: 'NGA', weight: 0.08, label: 'India→Nigeria (tech/services)' },

  // USA → Latin America
  { from: 'USA', to: 'MEX', weight: 0.30, label: 'USA→Mexico (remittance)' },
  { from: 'USA', to: 'COL', weight: 0.18, label: 'USA→Colombia (remittance)' },
  { from: 'USA', to: 'BRA', weight: 0.15, label: 'USA→Brazil (fintech)' },
  { from: 'USA', to: 'ARG', weight: 0.12, label: 'USA→Argentina' },

  // Europe → Africa
  { from: 'GBR', to: 'NGA', weight: 0.15, label: 'UK→Nigeria (diaspora/finance)' },
  { from: 'GBR', to: 'ZAF', weight: 0.12, label: 'UK→South Africa' },
  { from: 'FRA', to: 'NGA', weight: 0.10, label: 'France→Nigeria' },

  // Nigeria → Africa spillover
  { from: 'NGA', to: 'ZAF', weight: 0.15, label: 'Nigeria→South Africa' },
];

export function getInboundEdges(iso3: string): TradeEdge[] {
  return TRADE_EDGES.filter(e => e.to === iso3);
}

export function getOutboundEdges(iso3: string): TradeEdge[] {
  return TRADE_EDGES.filter(e => e.from === iso3);
}
