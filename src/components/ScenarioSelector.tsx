import { useSimStore } from '../store/simulationStore';
import { SCENARIOS } from '../simulation/scenarios';
import type { ScenarioKey } from '../simulation/types';

const COLORS: Record<ScenarioKey, string> = {
  conservative: 'bg-slate-100 border-slate-300 text-slate-700 data-[active=true]:bg-slate-700 data-[active=true]:text-white',
  base: 'bg-blue-50 border-blue-300 text-blue-700 data-[active=true]:bg-blue-600 data-[active=true]:text-white',
  bull: 'bg-indigo-50 border-indigo-300 text-indigo-700 data-[active=true]:bg-indigo-600 data-[active=true]:text-white',
};

export function ScenarioSelector() {
  const { scenario, setScenario } = useSimStore();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Scenario</span>
      {SCENARIOS.map(s => (
        <button
          key={s.key}
          data-active={scenario === s.key}
          onClick={() => setScenario(s.key)}
          className={`px-3 py-1 text-xs font-medium border rounded-full transition-all cursor-pointer ${COLORS[s.key]}`}
        >
          {s.labelJa}
        </button>
      ))}
    </div>
  );
}
