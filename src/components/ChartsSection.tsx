import { useMemo, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
  AreaChart, Area, ReferenceLine,
} from 'recharts';
import { useSimStore } from '../store/simulationStore';
import { stepToYear, TOTAL_STEPS, formatStepShort } from '../simulation/types';

type ChartTab = 'corporate' | 'agent' | 'consumer' | 'global';

const MONTHLY_SAMPLE = 4; // every 4 weeks

function formatYen(v: number) {
  if (v >= 10000) return `${(v / 10000).toFixed(1)}兆`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}千億`;
  return `${v.toFixed(0)}億`;
}

const YEAR_TICKS: number[] = [];
for (let y = 0; y <= TOTAL_STEPS; y += 52) YEAR_TICKS.push(y);

function yearTick(step: number): string {
  return `${stepToYear(step)}`;
}

export function ChartsSection() {
  const [tab, setTab] = useState<ChartTab>('corporate');
  const { allStates, currentIndex } = useSimStore();

  const data = useMemo(() =>
    allStates
      .filter((_, i) => i % MONTHLY_SAMPLE === 0 || i === allStates.length - 1)
      .map(s => ({
        step: s.step,
        corpBalance: s.corporateScBalance,
        b2bPayments: s.annualB2BScPayments,
        b2bReuse: +(s.b2bReuseRatio * 100).toFixed(2),
        payrollUsers: Math.round(s.scPayrollUsers / 1000),
        payrollVol: s.annualScPayrollVolume,
        agentUsers: Math.round(s.aiAgentUsers / 10000),
        agentBalance: s.agentWalletScBalance,
        consumerBalance: s.consumerScBalance,
        retention: +(s.consumerRetentionRate * 100).toFixed(2),
        cashOut: +(s.cashOutRate * 100).toFixed(2),
        merchantCount: Math.round(s.merchantAcceptanceCount / 1000),
        consumerPayments: s.consumerScPaymentVolume,
        merchantBalance: s.merchantScBalance,
        merchantReuse: +(s.merchantReuseRatio * 100).toFixed(2),
        brandedJpy: +s.brandedJpyPenetration.toFixed(2),
      })), [allStates]);

  const globalData = useMemo(() =>
    allStates
      .filter((_, i) => i % MONTHLY_SAMPLE === 0 || i === allStates.length - 1)
      .map(s => ({
        step: s.step,
        JPN: +(s.countryProgress.JPN?.progressScore ?? 0).toFixed(1),
        SGP: +(s.countryProgress.SGP?.progressScore ?? 0).toFixed(1),
        IND: +(s.countryProgress.IND?.progressScore ?? 0).toFixed(1),
        NGA: +(s.countryProgress.NGA?.progressScore ?? 0).toFixed(1),
        USA: +(s.countryProgress.USA?.progressScore ?? 0).toFixed(1),
        THA: +(s.countryProgress.THA?.progressScore ?? 0).toFixed(1),
      })), [allStates]);

  const tabs: { key: ChartTab; label: string }[] = [
    { key: 'corporate', label: '企業・B2B' },
    { key: 'agent', label: 'AIエージェント' },
    { key: 'consumer', label: '消費者・加盟店' },
    { key: 'global', label: 'グローバル' },
  ];

  const currentStep = allStates[currentIndex]?.step ?? 0;

  const xAxisProps = {
    dataKey: 'step',
    tick: { fontSize: 10 },
    ticks: YEAR_TICKS,
    tickFormatter: yearTick,
    type: 'number' as const,
    domain: [0, TOTAL_STEPS],
  };

  const labelFormatter = (step: unknown) => formatStepShort(Number(step));

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Time-Series Charts</div>
        <div className="flex gap-1">
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
      </div>

      {tab === 'corporate' && (
        <div className="grid grid-cols-2 gap-4">
          <ChartCard title="企業SC残高 (億円)">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis {...xAxisProps} />
              <YAxis tickFormatter={formatYen} tick={{ fontSize: 10 }} width={55} />
              <Tooltip formatter={(v) => formatYen(Number(v))} labelFormatter={labelFormatter} />
              <ReferenceLine x={currentStep} stroke="#ef4444" strokeDasharray="4 2" />
              <Area type="monotone" dataKey="corpBalance" stroke="#3b82f6" fill="#bfdbfe" strokeWidth={2} name="企業SC残高" />
            </AreaChart>
          </ChartCard>
          <ChartCard title="B2B SC決済量 年率換算 (億円)">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis {...xAxisProps} />
              <YAxis tickFormatter={formatYen} tick={{ fontSize: 10 }} width={55} />
              <Tooltip formatter={(v) => formatYen(Number(v))} labelFormatter={labelFormatter} />
              <ReferenceLine x={currentStep} stroke="#ef4444" strokeDasharray="4 2" />
              <Area type="monotone" dataKey="b2bPayments" stroke="#1d4ed8" fill="#dbeafe" strokeWidth={2} name="B2B決済量(年率)" />
            </AreaChart>
          </ChartCard>
          <ChartCard title="B2B再利用率 (%)">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis {...xAxisProps} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => `${v}%`} labelFormatter={labelFormatter} />
              <ReferenceLine x={currentStep} stroke="#ef4444" strokeDasharray="4 2" />
              <Line type="monotone" dataKey="b2bReuse" stroke="#6366f1" strokeWidth={2} dot={false} name="B2B再利用率" />
            </LineChart>
          </ChartCard>
          <ChartCard title="SC給与ユーザー数 (千人)">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis {...xAxisProps} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => `${v}千人`} labelFormatter={labelFormatter} />
              <ReferenceLine x={currentStep} stroke="#ef4444" strokeDasharray="4 2" />
              <Area type="monotone" dataKey="payrollUsers" stroke="#60a5fa" fill="#dbeafe" strokeWidth={2} name="SC給与ユーザー" />
            </AreaChart>
          </ChartCard>
        </div>
      )}

      {tab === 'agent' && (
        <div className="grid grid-cols-2 gap-4">
          <ChartCard title="AIエージェントユーザー (万人)">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis {...xAxisProps} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => `${v}万人`} labelFormatter={labelFormatter} />
              <ReferenceLine x={currentStep} stroke="#ef4444" strokeDasharray="4 2" />
              <Area type="monotone" dataKey="agentUsers" stroke="#7c3aed" fill="#ede9fe" strokeWidth={2} name="AIエージェント" />
            </AreaChart>
          </ChartCard>
          <ChartCard title="エージェントウォレットSC残高 (億円)">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis {...xAxisProps} />
              <YAxis tickFormatter={formatYen} tick={{ fontSize: 10 }} width={55} />
              <Tooltip formatter={(v) => formatYen(Number(v))} labelFormatter={labelFormatter} />
              <ReferenceLine x={currentStep} stroke="#ef4444" strokeDasharray="4 2" />
              <Area type="monotone" dataKey="agentBalance" stroke="#5b21b6" fill="#ddd6fe" strokeWidth={2} name="WL残高" />
            </AreaChart>
          </ChartCard>
        </div>
      )}

      {tab === 'consumer' && (
        <div className="grid grid-cols-2 gap-4">
          <ChartCard title="個人SC残高 (億円)">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis {...xAxisProps} />
              <YAxis tickFormatter={formatYen} tick={{ fontSize: 10 }} width={55} />
              <Tooltip formatter={(v) => formatYen(Number(v))} labelFormatter={labelFormatter} />
              <ReferenceLine x={currentStep} stroke="#ef4444" strokeDasharray="4 2" />
              <Area type="monotone" dataKey="consumerBalance" stroke="#16a34a" fill="#bbf7d0" strokeWidth={2} name="個人SC残高" />
            </AreaChart>
          </ChartCard>
          <ChartCard title="保持率 vs 円転率 (%)">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis {...xAxisProps} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => `${v}%`} labelFormatter={labelFormatter} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <ReferenceLine x={currentStep} stroke="#ef4444" strokeDasharray="4 2" />
              <Line type="monotone" dataKey="retention" stroke="#16a34a" strokeWidth={2} dot={false} name="保持率" />
              <Line type="monotone" dataKey="cashOut" stroke="#ef4444" strokeWidth={2} dot={false} name="円転率" />
            </LineChart>
          </ChartCard>
          <ChartCard title="SC対応加盟店数 (千店)">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis {...xAxisProps} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => `${v}千店`} labelFormatter={labelFormatter} />
              <ReferenceLine x={currentStep} stroke="#ef4444" strokeDasharray="4 2" />
              <Area type="monotone" dataKey="merchantCount" stroke="#0d9488" fill="#ccfbf1" strokeWidth={2} name="加盟店" />
            </AreaChart>
          </ChartCard>
          <ChartCard title="ブランドJPY浸透度">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis {...xAxisProps} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip labelFormatter={labelFormatter} />
              <ReferenceLine x={currentStep} stroke="#ef4444" strokeDasharray="4 2" />
              <Area type="monotone" dataKey="brandedJpy" stroke="#d97706" fill="#fef3c7" strokeWidth={2} name="Branded JPY" />
            </AreaChart>
          </ChartCard>
        </div>
      )}

      {tab === 'global' && (
        <div className="grid grid-cols-1 gap-4">
          <ChartCard title="国別採用進捗スコア (0-100)" height={300}>
            <LineChart data={globalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis {...xAxisProps} />
              <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
              <Tooltip labelFormatter={labelFormatter} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <ReferenceLine x={currentStep} stroke="#ef4444" strokeDasharray="4 2" />
              <Line type="monotone" dataKey="JPN" stroke="#f59e0b" strokeWidth={2} dot={false} name="日本" />
              <Line type="monotone" dataKey="SGP" stroke="#0ea5e9" strokeWidth={2} dot={false} name="シンガポール" />
              <Line type="monotone" dataKey="IND" stroke="#16a34a" strokeWidth={2} dot={false} name="インド" />
              <Line type="monotone" dataKey="THA" stroke="#8b5cf6" strokeWidth={2} dot={false} name="タイ" />
              <Line type="monotone" dataKey="NGA" stroke="#dc2626" strokeWidth={2} dot={false} name="ナイジェリア" />
              <Line type="monotone" dataKey="USA" stroke="#6366f1" strokeWidth={2} dot={false} name="アメリカ" />
            </LineChart>
          </ChartCard>
        </div>
      )}
    </div>
  );
}

function ChartCard({ title, children, height = 160 }: { title: string; children: React.ReactNode; height?: number }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3">
      <div className="text-xs font-medium text-slate-600 mb-2">{title}</div>
      <ResponsiveContainer width="100%" height={height}>
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
}
