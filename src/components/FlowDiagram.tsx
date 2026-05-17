import { useSimStore } from '../store/simulationStore';

interface NodeProps {
  x: number;
  y: number;
  labelJa: string;
  value?: string;
  size?: number;
  color: string;
  textColor?: string;
}

function Node({ x, y, labelJa, value, size = 48, color, textColor = 'white' }: NodeProps) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle r={size / 2} fill={color} opacity={0.92} />
      <text textAnchor="middle" dy="-6" fill={textColor} fontSize="8" fontWeight="600">
        {labelJa}
      </text>
      {value && (
        <text textAnchor="middle" dy="6" fill={textColor} fontSize="7" opacity={0.85}>
          {value}
        </text>
      )}
    </g>
  );
}

interface ArrowProps {
  x1: number; y1: number;
  x2: number; y2: number;
  weight?: number;
  color?: string;
  animated?: boolean;
}

function Arrow({ x1, y1, x2, y2, weight = 1, color = '#94a3b8', animated = false }: ArrowProps) {
  const sw = Math.max(1, Math.min(6, weight * 3));
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const d = `M ${x1} ${y1} Q ${mx} ${my - 20} ${x2} ${y2}`;
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={sw}
      strokeDasharray={animated ? '6 3' : undefined}
      className={animated ? 'flow-particle' : undefined}
      opacity={0.7}
      markerEnd="url(#arrow)"
    />
  );
}

function fmt(v: number): string {
  if (v >= 10000) return `${(v / 10000).toFixed(1)}兆`;
  if (v >= 1000) return `${(v / 1000).toFixed(0)}千億`;
  return `${v.toFixed(0)}億`;
}
function fmtPeople(v: number): string {
  if (v >= 1e6) return `${(v / 1e4).toFixed(0)}万人`;
  return `${Math.round(v / 1000)}千人`;
}

export function FlowDiagram() {
  const { currentState: s } = useSimStore();

  const corpW = Math.min(3, s.corporateScBalance / 2000 + 0.5);
  const payrollW = Math.min(3, s.annualScPayrollVolume / 100 + 0.3);
  const agentW = Math.min(3, s.agentWalletScBalance / 500 + 0.3);
  const merchantW = Math.min(3, s.merchantScBalance / 500 + 0.3);

  return (
    <div className="h-full flex flex-col">
      <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Flywheel Flow</div>
      <div className="flex-1 relative">
        <svg viewBox="0 0 560 460" className="w-full h-full" style={{ maxHeight: '460px' }}>
          <defs>
            <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 Z" fill="#94a3b8" />
            </marker>
          </defs>

          {/* Lane backgrounds */}
          <rect x="10" y="10" width="165" height="430" rx="8" fill="#eff6ff" opacity="0.6" />
          <rect x="185" y="10" width="165" height="430" rx="8" fill="#f5f3ff" opacity="0.6" />
          <rect x="360" y="10" width="185" height="430" rx="8" fill="#f0fdf4" opacity="0.6" />

          {/* Lane labels */}
          <text x="92" y="26" textAnchor="middle" fontSize="9" fill="#3b82f6" fontWeight="700">Corporate / B2B</text>
          <text x="268" y="26" textAnchor="middle" fontSize="9" fill="#7c3aed" fontWeight="700">AI Agent</text>
          <text x="452" y="26" textAnchor="middle" fontSize="9" fill="#16a34a" fontWeight="700">Consumer / Merchant</text>

          {/* Arrows */}
          <Arrow x1={92} y1={90} x2={92} y2={150} weight={corpW} color="#3b82f6" animated />
          <Arrow x1={92} y1={205} x2={92} y2={265} weight={payrollW} color="#3b82f6" animated />
          <Arrow x1={268} y1={90} x2={268} y2={160} weight={agentW} color="#7c3aed" animated />
          <Arrow x1={268} y1={220} x2={268} y2={285} weight={agentW * 0.4} color="#7c3aed" animated />

          {/* B2B → Consumer */}
          <Arrow x1={130} y1={290} x2={400} y2={330} weight={payrollW} color="#6366f1" animated />
          {/* Agent → Consumer */}
          <Arrow x1={310} y1={300} x2={400} y2={330} weight={agentW * 0.5} color="#8b5cf6" animated />

          <Arrow x1={452} y1={370} x2={452} y2={420} weight={merchantW} color="#16a34a" animated />

          {/* Nodes */}
          {/* Corporate lane */}
          <Node x={92} y={60} labelJa="越境企業" value={`${Math.round(s.activeCorporateAdopters / 1000)}千社`} size={50} color="#3b82f6" />
          <Node x={92} y={175} labelJa="企業SC残高" value={`¥${fmt(s.corporateScBalance)}`} size={55} color="#1d4ed8" />
          <Node x={92} y={290} labelJa="SC給与・委託費" value={fmtPeople(s.scPayrollUsers)} size={46} color="#60a5fa" />

          {/* AI Agent lane */}
          <Node x={268} y={60} labelJa="AIユーザー" value={fmtPeople(s.aiAgentUsers)} size={50} color="#7c3aed" />
          <Node x={268} y={190} labelJa="エージェントWL" value={`¥${fmt(s.agentWalletScBalance)}`} size={52} color="#5b21b6" />
          <Node x={268} y={310} labelJa="API/MCPツール" size={40} color="#a78bfa" />

          {/* Consumer lane */}
          <Node x={452} y={345} labelJa="個人SC残高" value={`¥${fmt(s.consumerScBalance)}`} size={60} color="#16a34a" />
          <Node x={452} y={430} labelJa="加盟店SC残高" value={`¥${fmt(s.merchantScBalance)}`} size={46} color="#15803d" />

          {/* Branded JPY overlay */}
          {s.brandedJpyPenetration > 40 && (
            <>
              <rect x="360" y="295" width="185" height="50" rx="6" fill="#f59e0b" opacity="0.12" />
              <text x="452" y="325" textAnchor="middle" fontSize="8" fill="#b45309" fontWeight="700">
                Branded JPY {s.brandedJpyPenetration.toFixed(0)}%
              </text>
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
