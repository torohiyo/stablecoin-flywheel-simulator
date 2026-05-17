import { useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';
import { useSimStore } from '../store/simulationStore';
import { formatStepShort, stepToDate, TOTAL_STEPS } from '../simulation/types';

const SPEED_OPTIONS: { label: string; weeksPerTick: number; tickMs: number }[] = [
  { label: '1週/tick', weeksPerTick: 1, tickMs: 80 },
  { label: '1ヶ月/tick', weeksPerTick: 4, tickMs: 120 },
  { label: '四半期/tick', weeksPerTick: 13, tickMs: 200 },
  { label: '半年/tick', weeksPerTick: 26, tickMs: 280 },
];

export function SimulationControls() {
  const {
    currentState, currentIndex, allStates, isPlaying,
    setIsPlaying, stepForward, reset, setCurrentIndex,
    playSpeed, setPlaySpeed,
  } = useSimStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const speedConfig = SPEED_OPTIONS.find(s => s.weeksPerTick === playSpeed) ?? SPEED_OPTIONS[1];

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        stepForward(speedConfig.weeksPerTick);
      }, speedConfig.tickMs);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, stepForward, speedConfig.weeksPerTick, speedConfig.tickMs]);

  const startDate = stepToDate(0);
  const endDate = stepToDate(TOTAL_STEPS);

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors cursor-pointer"
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={() => stepForward(speedConfig.weeksPerTick)}
          className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-md transition-colors cursor-pointer"
          title={`${speedConfig.weeksPerTick}週進む`}
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

      <select
        value={playSpeed}
        onChange={e => setPlaySpeed(Number(e.target.value))}
        className="text-xs px-2 py-1.5 border border-slate-300 rounded-md bg-white text-slate-700 cursor-pointer"
      >
        {SPEED_OPTIONS.map(o => (
          <option key={o.weeksPerTick} value={o.weeksPerTick}>{o.label}</option>
        ))}
      </select>

      <div className="flex items-center gap-2 flex-1 min-w-[260px]">
        <span className="text-xs text-slate-500 whitespace-nowrap tabular-nums">
          {startDate.getFullYear()}.{startDate.getMonth() + 1}
        </span>
        <input
          type="range"
          min={0}
          max={allStates.length - 1}
          value={currentIndex}
          onChange={e => setCurrentIndex(Number(e.target.value))}
          className="slider-custom flex-1"
        />
        <span className="text-xs text-slate-500 whitespace-nowrap tabular-nums">
          {endDate.getFullYear()}.{endDate.getMonth() + 1}
        </span>
      </div>

      <div className="bg-indigo-600 text-white text-sm font-bold px-3 py-1.5 rounded-lg tabular-nums whitespace-nowrap">
        {formatStepShort(currentState.step)}
      </div>
    </div>
  );
}
