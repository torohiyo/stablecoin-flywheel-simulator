import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
  AreaChart, Area,
} from 'recharts';
import { useSimStore } from '../store/simulationStore';

type ChartTab = 'corporate' | 'agent' | 'consumer' | 'global';

function formatYen(v: number) {
  if (v >= 10000) return `${(v / 10000).toFixed(1)}兆`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}千億`;
  return `${v.toFixed(0)}億`;
}

export function ChartsSection() {
  const [tab, setTab] = useState<ChartTab>('corporate');
  const { allStates, currentIndex } = useSimStore();

  const data = allStates.map(s => ({
    year: s.year,
    corpBalance: s.corporateScBalance,
    b2bPayments: s.annualB2BScPayments,
    b2bReuse: +(s.b2bReuseRatio * 100).toFixed(1),
    payrollUsers: Math.round(s.scPayrollUsers / 1000),
    payrollVol: s.annualScPayrollVolume,
    agentUsers: Math.round(s.aiAgentUsers / 10000),
    agentBalance: s.agentWalletScBalance,
    consumerBalance: s.consumerScBalance,
    retention: +(s.consumerRetentionRate * 100).toFixed(1),
    cashOut: +(s.cashOutRate * 100).toFixed(1),
    merchantCount: Math.round(s.merchantAcceptanceCount / 1000),
    consumerPayments: s.consumerScPaymentVolume,
    merchantBalance: s.merchantScBalance,
    merchantReuse: +(s.merchantReuseRatio * 100).toFixed(1),
    brandedJpy: +s.brandedJpyPenetration.toFixed(1),
  }));

  const tabs: { key: ChartTab; label: string }[] = [
    { key: 'corporate', label: '企業・B2B' },
    { key: 'agent', label: 'AIエージェント' },
    { key: 'consumer', label: '消費者・加盟店' },
    { key: 'global', label: 'グローバル' },
  ];

  const refLine = data[currentIndex]?.year;

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
              <XAxis dataKey="year" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={formatYen} tick={{ fontSize: 10 }} width={55} />
              <Tooltip formatter={(v) => formatYen(Number(v))} />
              <Area type="monotone" dataKey="corpBalance" stroke="#3b82f6" fill="#bfdbfe" strokeWidth={2} name="企業SC残高" />
              {refLine && <line x1={refLine} stroke="#ef4444" strokeDasharray="4 2" />}
            </AreaChart>
          </ChartCard>
          <ChartCard title="年間B2B SC決済量 (億円)">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={formatYen} tick={{ fontSize: 10 }} width={55} />
              <Tooltip formatter={(v) => formatYen(Number(v))} />
              <Area type="monotone" dataKey="b2bPayments" stroke="#1d4ed8" fill="#dbeafe" strokeWidth={2} name="B2B決済量" />
            </AreaChart>
          </ChartCard>
          <ChartCard title="B2B再利用率 (%)">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Line type="monotone" dataKey="b2bReuse" stroke="#6366f1" strokeWidth={2} dot={false} name="B2B再利用率" />
            </LineChart>
          </ChartCard>
          <ChartCard title="SC給与ユーザー数 (千人)">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => `${v}千人`} />
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
              <XAxis dataKey="year" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => `${v}万人`} />
              <Area type="monotone" dataKey="agentUsers" stroke="#7c3aed" fill="#ede9fe" strokeWidth={2} name="AIエージェント" />
            </AreaChart>
          </ChartCard>
          <ChartCard title="エージェントウォレットSC残高 (億円)">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={formatYen} tick={{ fontSize: 10 }} width={55} />
              <Tooltip formatter={(v) => formatYen(Number(v))} />
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
              <XAxis dataKey="year" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={formatYen} tick={{ fontSize: 10 }} width={55} />
              <Tooltip formatter={(v) => formatYen(Number(v))} />
              <Area type="monotone" dataKey="consumerBalance" stroke="#16a34a" fill="#bbf7d0" strokeWidth={2} name="個人SC残高" />
            </AreaChart>
          </ChartCard>
          <ChartCard title="保持率 vs 円転率 (%)">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="retention" stroke="#16a34a" strokeWidth={2} dot={false} name="保持率" />
              <Line type="monotone" dataKey="cashOut" stroke="#ef4444" strokeWidth={2} dot={false} name="円転率" />
            </LineChart>
          </ChartCard>
          <ChartCard title="SC対応加盟店数 (千店)">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => `${v}千店`} />
              <Area type="monotone" dataKey="merchantCount" stroke="#0d9488" fill="#ccfbf1" strokeWidth={2} name="加盟店" />
            </AreaChart>
          </ChartCard>
          <ChartCard title="ブランドJPY浸透度">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Area type="monotone" dataKey="brandedJpy" stroke="#d97706" fill="#fef3c7" strokeWidth={2} name="Branded JPY" />
            </AreaChart>
          </ChartCard>
        </div>
      )}

      {tab === 'global' && (
        <div className="grid grid-cols-2 gap-4">
          <ChartCard title="国別採用ステージ分布">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="year" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              {['JPN', 'SGP', 'IND', 'NGA', 'USA'].map((iso, i) => {
                const colors = ['#6366f1', '#0ea5e9', '#16a34a', '#dc2626', '#f59e0b'];
                return (
                  <Line
                    key={iso}
                    type="monotone"
                    dataKey={d => (d as { year: number }[]).length > 0 ? 0 : 0}
                    stroke={colors[i]}
                    dot={false}
                    name={iso}
                  />
                );
              })}
            </LineChart>
          </ChartCard>
        </div>
      )}
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3">
      <div className="text-xs font-medium text-slate-600 mb-2">{title}</div>
      <ResponsiveContainer width="100%" height={160}>
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
}
