import { useSimStore } from '../store/simulationStore';

function fmt(v: number, decimals = 1): string {
  if (v >= 10000) return `¥${(v / 10000).toFixed(decimals)}兆`;
  if (v >= 1000) return `¥${(v / 1000).toFixed(decimals)}千億`;
  if (v >= 100) return `¥${v.toFixed(0)}億`;
  return `¥${v.toFixed(1)}億`;
}
function fmtPeople(v: number): string {
  if (v >= 1e7) return `${(v / 1e8).toFixed(1)}億人`;
  if (v >= 1e6) return `${(v / 1e4).toFixed(0)}万人`;
  if (v >= 1000) return `${(v / 1000).toFixed(1)}千人`;
  return `${Math.round(v)}人`;
}
function fmtMerchant(v: number): string {
  if (v >= 1e6) return `${(v / 1e4).toFixed(1)}万店`;
  if (v >= 1000) return `${(v / 1000).toFixed(1)}千店`;
  return `${Math.round(v)}店`;
}

interface KpiItemProps {
  label: string;
  labelJa: string;
  value: string;
  color?: string;
}

function KpiItem({ label, labelJa, value, color = 'text-indigo-700' }: KpiItemProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3">
      <div className="text-xs text-slate-500 leading-tight">{labelJa}</div>
      <div className="text-xs text-slate-400 leading-tight mb-1">{label}</div>
      <div className={`text-base font-bold tabular-nums ${color}`}>{value}</div>
    </div>
  );
}

export function KpiPanel() {
  const { currentState } = useSimStore();
  const s = currentState;

  const brandedJpy = s.brandedJpyPenetration > 60;

  return (
    <div className="h-full overflow-y-auto">
      <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">KPI Panel — {s.year}</div>
      <div className="grid grid-cols-1 gap-2">
        <div className="text-xs font-medium text-blue-700 uppercase tracking-wider mt-1">Corporate / B2B</div>
        <KpiItem label="Corporate SC Balance" labelJa="企業SC残高" value={fmt(s.corporateScBalance)} />
        <KpiItem label="Annual B2B SC Payment Volume" labelJa="年間B2B SC決済量" value={fmt(s.annualB2BScPayments)} />
        <KpiItem label="B2B Reuse Ratio" labelJa="B2B再利用率" value={`${(s.b2bReuseRatio * 100).toFixed(1)}%`} />
        <KpiItem label="SC Payroll Users" labelJa="SC給与・ペイアウト受取人数" value={fmtPeople(s.scPayrollUsers)} />
        <KpiItem label="Annual SC Payroll Volume" labelJa="年間SC給与・ペイアウト量" value={fmt(s.annualScPayrollVolume)} />

        <div className="text-xs font-medium text-purple-700 uppercase tracking-wider mt-1">AI Agent</div>
        <KpiItem label="AI Agent Users" labelJa="AIエージェントユーザー数" value={fmtPeople(s.aiAgentUsers)} color="text-purple-700" />
        <KpiItem label="Agent Wallet Users" labelJa="エージェントウォレット保有者" value={fmtPeople(s.agentWalletUsers)} color="text-purple-700" />
        <KpiItem label="Agent Wallet SC Balance" labelJa="エージェントウォレットSC残高" value={fmt(s.agentWalletScBalance)} color="text-purple-700" />
        <KpiItem label="Annual AI Agent Payment Volume" labelJa="年間AIエージェント決済量" value={fmt(s.annualAgentPaymentVolume)} color="text-purple-700" />

        <div className="text-xs font-medium text-green-700 uppercase tracking-wider mt-1">Consumer</div>
        <KpiItem label="Consumer SC Balance" labelJa="個人SC残高" value={fmt(s.consumerScBalance)} color="text-green-700" />
        <KpiItem label="Consumer Retention Rate" labelJa="個人SC保持率" value={`${(s.consumerRetentionRate * 100).toFixed(1)}%`} color="text-green-700" />
        <KpiItem label="Consumer SC Payment Volume" labelJa="個人SC決済量" value={fmt(s.consumerScPaymentVolume)} color="text-green-700" />
        <KpiItem label="Merchant Acceptance Count" labelJa="SC対応加盟店数" value={fmtMerchant(s.merchantAcceptanceCount)} color="text-green-700" />
        <KpiItem label="Merchant SC Balance" labelJa="加盟店SC残高" value={fmt(s.merchantScBalance)} color="text-green-700" />
        <KpiItem label="Merchant Reuse Ratio" labelJa="加盟店再利用率" value={`${(s.merchantReuseRatio * 100).toFixed(1)}%`} color="text-green-700" />

        <div className="text-xs font-medium text-amber-700 uppercase tracking-wider mt-1">Brand</div>
        <KpiItem
          label={brandedJpy ? "Branded JPY Penetration" : "Branded JPY Penetration"}
          labelJa={brandedJpy ? "ブランドJPY浸透度" : "ブランドJPY浸透度"}
          value={`${s.brandedJpyPenetration.toFixed(1)}`}
          color={s.brandedJpyPenetration > 60 ? 'text-amber-600' : 'text-slate-600'}
        />
      </div>
    </div>
  );
}
