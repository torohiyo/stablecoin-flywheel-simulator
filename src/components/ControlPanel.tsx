import { useState } from 'react';
import { useSimStore } from '../store/simulationStore';
import type { SliderParams } from '../simulation/types';

interface SliderRowProps {
  labelJa: string;
  paramKey: keyof SliderParams;
  min: number;
  max: number;
  step: number;
  format?: (v: number) => string;
}

function SliderRow({ labelJa, paramKey, min, max, step, format }: SliderRowProps) {
  const { params, setParams } = useSimStore();
  const value = params[paramKey] as number;
  const display = format ? format(value) : `${(value * 100).toFixed(1)}%`;

  return (
    <div className="mb-2">
      <div className="flex justify-between items-baseline mb-0.5">
        <span className="text-xs text-slate-600">{labelJa}</span>
        <span className="text-xs font-mono font-medium text-indigo-600">{display}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => setParams({ [paramKey]: Number(e.target.value) } as Partial<SliderParams>)}
        className="slider-custom w-full"
      />
    </div>
  );
}

type Tab = 'b2b' | 'agent' | 'incentives' | 'frictions';

export function ControlPanel() {
  const [tab, setTab] = useState<Tab>('b2b');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'b2b', label: 'B2B企業' },
    { key: 'agent', label: 'AIエージェント' },
    { key: 'incentives', label: 'インセンティブ' },
    { key: 'frictions', label: '摩擦・障壁' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Control Panel</div>
      <div className="flex gap-1 mb-3 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`text-xs px-2.5 py-1 rounded-full border cursor-pointer transition-colors ${
              tab === t.key
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        {tab === 'b2b' && (
          <div>
            <SliderRow labelJa="越境SC採用率" paramKey="crossBorderAdoptionRate" min={0} max={0.5} step={0.005} />
            <SliderRow labelJa="企業SC残高比率" paramKey="corporateBalanceRatio" min={0} max={0.5} step={0.005} />
            <SliderRow labelJa="B2B再利用率" paramKey="b2bReuseRate" min={0} max={0.8} step={0.005} />
            <SliderRow labelJa="SC給与採用率" paramKey="scPayrollAdoptionRate" min={0} max={0.3} step={0.005} />
            <SliderRow labelJa="給与SC比率" paramKey="payrollScShare" min={0} max={0.5} step={0.005} />
            <SliderRow labelJa="財務SC保有傾向" paramKey="treasuryRetentionBias" min={0} max={1} step={0.01} />
          </div>
        )}
        {tab === 'agent' && (
          <div>
            <SliderRow labelJa="AIエージェントユーザー成長率" paramKey="agentUserGrowthRate" min={0} max={0.8} step={0.01} />
            <SliderRow labelJa="エージェントウォレット開設率" paramKey="agentWalletOpenRate" min={0} max={0.5} step={0.005} />
            <SliderRow labelJa="SC入金率" paramKey="stablecoinTopupRate" min={0} max={1} step={0.01} />
            <SliderRow labelJa="ユーザー年間エージェント支出" paramKey="annualAgentSpendPerUser" min={1000} max={200000} step={1000} format={v => `¥${v.toLocaleString()}`} />
            <SliderRow labelJa="未使用残高保持率" paramKey="unspentBalanceRetention" min={0} max={1} step={0.01} />
            <SliderRow labelJa="残高スピルオーバー率" paramKey="agentBalanceSpilloverRate" min={0} max={0.5} step={0.005} />
          </div>
        )}
        {tab === 'incentives' && (
          <div>
            <SliderRow labelJa="取引所保有報酬" paramKey="exchangeHoldingReward" min={0} max={0.15} step={0.001} />
            <SliderRow labelJa="レンディングキャンペーンAPY" paramKey="lendingCampaignApy" min={0} max={0.15} step={0.001} />
            <SliderRow labelJa="カード還元率" paramKey="cardCashbackRate" min={0} max={0.1} step={0.001} />
            <SliderRow labelJa="加盟店割引率" paramKey="merchantDiscountRate" min={0} max={0.05} step={0.001} />
            <SliderRow labelJa="給与受取ボーナス" paramKey="salaryAcceptanceBonus" min={0} max={0.05} step={0.001} />
            <SliderRow labelJa="加盟店採用補助" paramKey="merchantAdoptionSubsidy" min={0} max={1} step={0.01} />
            <SliderRow labelJa="発行者インセンティブ強度" paramKey="issuerIncentiveIntensity" min={0} max={1} step={0.01} />
          </div>
        )}
        {tab === 'frictions' && (
          <div>
            <SliderRow labelJa="規制摩擦" paramKey="regulatoryFriction" min={0} max={1} step={0.01} />
            <SliderRow labelJa="UX摩擦" paramKey="uxFriction" min={0} max={1} step={0.01} />
            <SliderRow labelJa="円転しやすさ" paramKey="cashOutConvenience" min={0} max={1} step={0.01} />
            <SliderRow labelJa="ブランド信頼度" paramKey="brandTrust" min={0} max={1} step={0.01} />
            <SliderRow labelJa="消費者保護品質" paramKey="consumerProtectionQuality" min={0} max={1} step={0.01} />
            <SliderRow labelJa="準備金・安定性懸念" paramKey="volatilityConcern" min={0} max={1} step={0.01} />
          </div>
        )}
      </div>
    </div>
  );
}
