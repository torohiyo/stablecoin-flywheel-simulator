import { useSimStore } from '../store/simulationStore';
import { formatStepShort, stepToYear } from '../simulation/types';

function generateNarrative(s: ReturnType<typeof useSimStore.getState>['currentState']): string[] {
  const notes: string[] = [];
  const y = stepToYear(s.step);
  const label = formatStepShort(s.step);

  if (s.corporateScBalance > 5000) {
    notes.push(`${label}時点で企業SC残高が${(s.corporateScBalance / 10000).toFixed(1)}兆円に達した。B2B再利用率は${(s.b2bReuseRatio * 100).toFixed(0)}%。ステーブルコインは越境送金レールを超え、企業財務の中で再利用される決済性残高へと進化しつつある。`);
  } else if (s.corporateScBalance > 500) {
    notes.push(`${label}時点で企業SC残高は${s.corporateScBalance.toFixed(0)}億円。越境決済を中心に採用が進んでいるが、B2Bでの再利用はまだ限定的（${(s.b2bReuseRatio * 100).toFixed(0)}%）。`);
  }

  if (s.agentWalletScBalance > 1000) {
    notes.push(`AIエージェント向けウォレット残高が${s.agentWalletScBalance.toFixed(0)}億円を超えた。ユーザーが"AIに使わせるためのお金"としてSCを持つ動機が生まれており、給与経由とは異なる消費者保有ルートが形成されつつある。`);
  } else if (s.agentWalletUsers > 100000) {
    notes.push(`${(s.agentWalletUsers / 10000).toFixed(0)}万人がエージェントウォレットを保有。年率換算決済量${s.annualAgentPaymentVolume.toFixed(0)}億円のAIエージェント経済圏が静かに拡大している。`);
  }

  if (s.consumerScBalance > 500) {
    const retain = (s.consumerRetentionRate * 100).toFixed(0);
    if (s.consumerRetentionRate < 0.4) {
      notes.push(`個人SC残高は${s.consumerScBalance.toFixed(0)}億円だが、保持率が${retain}%と低い。カード還元や加盟店割引が不十分な場合、SCは受け取り資産にはなっても支払い手段として定着しにくい。`);
    } else {
      notes.push(`個人SC残高${s.consumerScBalance.toFixed(0)}億円、保持率${retain}%。インセンティブが効いており、SCが単なる一時的受け取り手段を超えて「持ち続ける資産」になりつつある。`);
    }
  }

  if (s.merchantAcceptanceCount > 50000) {
    notes.push(`SC対応加盟店が${(s.merchantAcceptanceCount / 10000).toFixed(1)}万店を突破。EC・観光・デジタルサービスでの採用が集積し、消費者にとっての支払い有用性が高まっている。`);
  }

  const tradingPartners = ['SGP', 'THA', 'PHL', 'IND'];
  const risingPartners = tradingPartners.filter(iso => {
    const cp = s.countryProgress[iso];
    return cp && cp.progressScore > 20;
  });
  if (risingPartners.length >= 2) {
    notes.push(`日本のB2B導入が進むにつれ、${risingPartners.join('・')}などの貿易接続先で進捗スコアが上昇している。企業間精算の標準化が国際的な採用圧力を生むというシミュレーション仮説が現れ始めている。`);
  }

  if (s.brandedJpyPenetration > 60) {
    notes.push(`ブランドJPY浸透度が${s.brandedJpyPenetration.toFixed(0)}%を超えた。消費者の体験は「ステーブルコイン」から「信頼できるブランドJPY残高」へとシフトしつつある。`);
  }

  if (notes.length === 0) {
    notes.push(`${label}時点ではシミュレーションが初期フェーズにある（${y}年）。B2B決済での採用拡大と規制環境の整備が、次フェーズへの鍵となる。`);
  }

  return notes;
}

export function NarrativePanel() {
  const { currentState } = useSimStore();
  const notes = generateNarrative(currentState);

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
        Narrative Analysis — {formatStepShort(currentState.step)}
      </div>
      <div className="space-y-3">
        {notes.map((note, i) => (
          <div key={i} className="flex gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
            <p className="text-sm text-slate-700 leading-relaxed">{note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
