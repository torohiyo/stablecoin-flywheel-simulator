import { useSimStore } from '../store/simulationStore';
import { formatStepShort } from '../simulation/types';

export function TimelineEvents() {
  const { triggeredEventDetails, currentState } = useSimStore();

  const visible = triggeredEventDetails.filter(e => e.step <= currentState.step);

  return (
    <div>
      <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
        Threshold Events
      </div>
      {visible.length === 0 ? (
        <div className="text-xs text-slate-400 italic">No events triggered yet.</div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {visible.map(evt => (
            <div
              key={evt.id}
              className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span className="text-xs font-medium text-amber-800 tabular-nums">{formatStepShort(evt.step)}</span>
              <span className="text-xs text-amber-700">{evt.labelJa}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
