import { useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';
import { useSimStore } from '../store/simulationStore';

export function SimulationControls() {
  const { currentState, currentIndex, allStates, isPlaying, setIsPlaying, stepForward, reset, setCurrentIndex } = useSimStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        stepForward();
      }, 900);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, stepForward]);

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors cursor-pointer"
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={stepForward}
          className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-md transition-colors cursor-pointer"
        >
          <ChevronRight size={14} />
          Step
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-md transition-colors cursor-pointer"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      <div className="flex items-center gap-3 flex-1 min-w-[200px]">
        <span className="text-xs text-slate-500 whitespace-nowrap">2027</span>
        <input
          type="range"
          min={0}
          max={allStates.length - 1}
          value={currentIndex}
          onChange={e => setCurrentIndex(Number(e.target.value))}
          className="slider-custom flex-1"
        />
        <span className="text-xs text-slate-500 whitespace-nowrap">2037</span>
      </div>

      <div className="bg-indigo-600 text-white text-lg font-bold px-4 py-1.5 rounded-lg tabular-nums">
        {currentState.year}
      </div>
    </div>
  );
}
