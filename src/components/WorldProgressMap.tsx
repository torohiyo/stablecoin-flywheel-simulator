import { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line as MapLine,
} from 'react-simple-maps';
import { useSimStore } from '../store/simulationStore';
import { COUNTRIES, getAdoptionStageLabelJa, getReadinessCategory, computeReadinessScore } from '../simulation/countryData';
import { TRADE_EDGES } from '../simulation/tradeNetwork';
import { formatStepShort } from '../simulation/types';
import type { CountryData } from '../simulation/types';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

type MapMode = 'progress' | 'readiness' | 'diffusion';

function progressColor(score: number): string {
  if (score < 10) return '#e2e8f0';
  if (score < 25) return '#bfdbfe';
  if (score < 40) return '#93c5fd';
  if (score < 55) return '#60a5fa';
  if (score < 70) return '#3b82f6';
  if (score < 85) return '#2563eb';
  return '#1d4ed8';
}

function readinessColor(score: number): string {
  if (score < 20) return '#e2e8f0';
  if (score < 40) return '#d9f99d';
  if (score < 60) return '#86efac';
  if (score < 80) return '#22c55e';
  return '#15803d';
}

function diffusionColor(score: number): string {
  if (score < 0.5) return '#e2e8f0';
  if (score < 2) return '#fde68a';
  if (score < 5) return '#fbbf24';
  if (score < 10) return '#f59e0b';
  return '#d97706';
}

const ISO3_TO_NUMERIC: Record<string, string> = {
  JPN: '392', GBR: '826', FRA: '250', DEU: '276', USA: '840',
  AUS: '036', BRA: '076', ARG: '032', COL: '170', MEX: '484',
  PHL: '608', SGP: '702', THA: '764', IND: '356', NGA: '566', ZAF: '710',
};

interface CountryDetailProps {
  country: CountryData;
  onClose: () => void;
}

function CountryDetailDrawer({ country, onClose }: CountryDetailProps) {
  const { currentState, allStates, currentIndex } = useSimStore();
  const cp = currentState.countryProgress[country.iso3];
  if (!cp) return null;

  // Sample country progress over time (monthly samples up to current step)
  const timeline: number[] = [];
  for (let i = 0; i <= currentIndex; i += 4) {
    timeline.push(allStates[i]?.countryProgress[country.iso3]?.progressScore ?? 0);
  }
  if (timeline.length === 0) timeline.push(cp.progressScore);

  const spendGap = country.hasBvnkData && country.desiredSpend && country.currentSpend
    ? (country.desiredSpend - country.currentSpend) * 100
    : null;

  return (
    <div className="absolute top-0 right-0 h-full w-72 bg-white border-l border-slate-200 shadow-xl z-10 overflow-y-auto p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-base font-bold text-slate-900">{country.nameJa}</div>
          <div className="text-xs text-slate-500">{country.name} · {country.region}</div>
          {!country.hasBvnkData && (
            <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 mt-1 inline-block">
              モデル仮定値
            </span>
          )}
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none cursor-pointer">×</button>
      </div>

      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">BVNK データ</div>
      <div className="space-y-1 mb-4">
        {country.hasBvnkData ? (
          <>
            <Row label="SC保有率（サンプル）" value={`${((country.ownership ?? 0) * 100).toFixed(0)}%`} />
            <Row label="取得意向" value={`${((country.intentToAcquire ?? 0) * 100).toFixed(0)}%`} />
            <Row label="現在の支出割合" value={`${((country.currentSpend ?? 0) * 100).toFixed(0)}%`} />
            <Row label="支出希望割合" value={`${((country.desiredSpend ?? 0) * 100).toFixed(0)}%`} />
            {spendGap !== null && (
              <Row label="支出ギャップ（潜在需要）" value={`+${spendGap.toFixed(0)}pp`} highlight />
            )}
            <Row label="地域別ペイアウト関心" value={`${(country.payoutInterestRegion * 100).toFixed(0)}%`} />
            <Row label="地域別手数料節約" value={`${(country.feeSavingsRegion * 100).toFixed(0)}%`} />
            <Row label="準備スコア" value={getReadinessCategory(computeReadinessScore(country))} />
          </>
        ) : (
          <div className="text-xs text-slate-400">BVNKデータなし（日本はモデル仮定値）</div>
        )}
      </div>

      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">シミュレーション ({formatStepShort(currentState.step)})</div>
      <div className="space-y-1">
        <Row label="進捗スコア" value={`${cp.progressScore.toFixed(1)} / 100`} />
        <Row label="採用ステージ" value={getAdoptionStageLabelJa(cp.adoptionStage)} />
        <Row label="貿易拡散受信量" value={`${cp.tradeDiffusionReceived.toFixed(2)}`} />
        <Row label="ペイアウト受容性" value={`${(cp.payoutReceptivity * 100).toFixed(0)}%`} />
        <Row label="支払受容性" value={`${(cp.spendingReceptivity * 100).toFixed(0)}%`} />
      </div>

      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-4 mb-2">進捗推移</div>
      <div className="flex items-end gap-0.5 h-12">
        {timeline.map((v, i) => (
          <div
            key={i}
            className="flex-1 bg-indigo-400 rounded-sm"
            style={{ height: `${Math.max(2, (v / 100) * 48)}px` }}
            title={`${formatStepShort(i * 4)}: ${v.toFixed(1)}`}
          />
        ))}
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-slate-500">{label}</span>
      <span className={`font-medium ${highlight ? 'text-amber-600' : 'text-slate-700'}`}>{value}</span>
    </div>
  );
}

export function WorldProgressMap() {
  const { currentState } = useSimStore();
  const [mode, setMode] = useState<MapMode>('progress');
  const [selected, setSelected] = useState<CountryData | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  const modes: { key: MapMode; label: string }[] = [
    { key: 'progress', label: 'シミュレーション進捗' },
    { key: 'readiness', label: 'SC準備スコア' },
    { key: 'diffusion', label: '貿易拡散量' },
  ];

  function getColor(iso3: string): string {
    const cp = currentState.countryProgress[iso3];
    if (!cp) return '#f1f5f9';
    if (mode === 'progress') return progressColor(cp.progressScore);
    if (mode === 'readiness') return readinessColor(cp.domesticReadinessScore);
    return diffusionColor(cp.tradeDiffusionReceived);
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">World Progress Map</div>
        <div className="flex gap-1">
          {modes.map(m => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`text-xs px-2.5 py-1 rounded-full border cursor-pointer transition-colors ${
                mode === m.key
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
        <ComposableMap
          projectionConfig={{ scale: 140, center: [20, 10] }}
          style={{ width: '100%', height: 'auto' }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => {
                const numericId = geo.id;
                const iso3 = Object.entries(ISO3_TO_NUMERIC).find(([, n]) => n === numericId)?.[0];
                const color = iso3 ? getColor(iso3) : '#f1f5f9';
                const countryData = iso3 ? COUNTRIES.find(c => c.iso3 === iso3) : null;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={color}
                    stroke="#fff"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none', fill: color, filter: 'brightness(0.85)', cursor: 'pointer' },
                      pressed: { outline: 'none' },
                    }}
                    onClick={() => { if (countryData) setSelected(countryData); }}
                    onMouseEnter={(e: MouseEvent) => {
                      if (countryData) {
                        const cp = currentState.countryProgress[countryData.iso3];
                        const score = cp ? cp.progressScore.toFixed(1) : '—';
                        setTooltip({
                          x: e.clientX,
                          y: e.clientY,
                          text: `${countryData.nameJa} (${countryData.iso3}) — スコア: ${score}`,
                        });
                      }
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })
            }
          </Geographies>

          {/* Trade diffusion arcs */}
          {TRADE_EDGES.slice(0, 12).map((edge, i) => {
            const from = COUNTRIES.find(c => c.iso3 === edge.from);
            const to = COUNTRIES.find(c => c.iso3 === edge.to);
            if (!from || !to) return null;
            const senderProgress = currentState.countryProgress[edge.from]?.progressScore ?? 0;
            if (senderProgress < 5) return null;

            return (
              <MapLine
                key={i}
                from={[from.lon, from.lat]}
                to={[to.lon, to.lat]}
                stroke="#6366f1"
                strokeWidth={Math.max(0.3, edge.weight * senderProgress * 0.03)}
                strokeOpacity={0.35}
                strokeLinecap="round"
              />
            );
          })}

          {/* Country markers */}
          {COUNTRIES.map(c => {
            const cp = currentState.countryProgress[c.iso3];
            if (!cp || cp.progressScore < 20) return null;
            return (
              <Marker key={c.iso3} coordinates={[c.lon, c.lat]}>
                <circle
                  r={Math.max(3, cp.progressScore * 0.06)}
                  fill={c.iso3 === 'JPN' ? '#f59e0b' : '#6366f1'}
                  opacity={0.7}
                  onClick={() => setSelected(c)}
                  style={{ cursor: 'pointer' }}
                />
              </Marker>
            );
          })}
        </ComposableMap>

        {/* Legend */}
        <div className="absolute bottom-2 left-2 bg-white/90 rounded-lg border border-slate-200 p-2">
          <div className="text-xs text-slate-500 mb-1 font-medium">
            {mode === 'progress' && '採用進捗スコア'}
            {mode === 'readiness' && 'SC準備度'}
            {mode === 'diffusion' && '貿易拡散量'}
          </div>
          <div className="flex gap-1 items-center">
            {mode === 'progress' && (['#e2e8f0', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8']).map((c, i) => (
              <div key={i} className="w-5 h-3 rounded-sm" style={{ background: c }} />
            ))}
            {mode === 'readiness' && (['#e2e8f0', '#d9f99d', '#86efac', '#22c55e', '#15803d']).map((c, i) => (
              <div key={i} className="w-5 h-3 rounded-sm" style={{ background: c }} />
            ))}
            {mode === 'diffusion' && (['#e2e8f0', '#fde68a', '#fbbf24', '#f59e0b', '#d97706']).map((c, i) => (
              <div key={i} className="w-5 h-3 rounded-sm" style={{ background: c }} />
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-0.5">
            <span>低</span><span>高</span>
          </div>
        </div>

        {selected && (
          <CountryDetailDrawer country={selected} onClose={() => setSelected(null)} />
        )}
      </div>

      {tooltip && (
        <div
          className="fixed z-50 bg-slate-900 text-white text-xs rounded px-2 py-1 pointer-events-none"
          style={{ left: tooltip.x + 10, top: tooltip.y - 10 }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
