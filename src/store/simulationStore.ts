import { create } from 'zustand';
import type { SimulationState, SliderParams, ScenarioKey } from '../simulation/types';
import { DEFAULT_PARAMS } from '../data/defaults';
import { runFullSimulation } from '../simulation/model';
import { SCENARIOS } from '../simulation/scenarios';
import { THRESHOLD_EVENTS } from '../simulation/thresholds';

interface SimStore {
  params: SliderParams;
  scenario: ScenarioKey;
  allStates: SimulationState[];
  currentIndex: number;
  isPlaying: boolean;

  currentState: SimulationState;
  triggeredEventDetails: Array<{ id: string; year: number; label: string; labelJa: string }>;

  setParams: (p: Partial<SliderParams>) => void;
  setScenario: (key: ScenarioKey) => void;
  setCurrentIndex: (i: number) => void;
  stepForward: () => void;
  reset: () => void;
  setIsPlaying: (v: boolean) => void;
}

function rebuildStates(params: SliderParams) {
  return runFullSimulation(params);
}

function extractEvents(states: SimulationState[]) {
  const lastState = states[states.length - 1];
  return lastState.triggeredEvents.map(raw => {
    const [id, yearStr] = raw.split('|');
    const evt = THRESHOLD_EVENTS.find(e => e.id === id);
    return {
      id,
      year: parseInt(yearStr),
      label: evt?.label ?? id,
      labelJa: evt?.labelJa ?? id,
    };
  });
}

const initialStates = rebuildStates(DEFAULT_PARAMS);

export const useSimStore = create<SimStore>((set, get) => ({
  params: DEFAULT_PARAMS,
  scenario: 'base',
  allStates: initialStates,
  currentIndex: 0,
  isPlaying: false,
  currentState: initialStates[0],
  triggeredEventDetails: extractEvents(initialStates),

  setParams: (p) => {
    const newParams = { ...get().params, ...p };
    const states = rebuildStates(newParams);
    const idx = Math.min(get().currentIndex, states.length - 1);
    set({
      params: newParams,
      allStates: states,
      currentState: states[idx],
      triggeredEventDetails: extractEvents(states),
    });
  },

  setScenario: (key) => {
    const scenario = SCENARIOS.find(s => s.key === key);
    if (!scenario) return;
    const newParams = { ...DEFAULT_PARAMS, ...scenario.params } as SliderParams;
    const states = rebuildStates(newParams);
    set({
      scenario: key,
      params: newParams,
      allStates: states,
      currentIndex: 0,
      currentState: states[0],
      triggeredEventDetails: extractEvents(states),
    });
  },

  setCurrentIndex: (i) => {
    const states = get().allStates;
    const idx = Math.max(0, Math.min(i, states.length - 1));
    set({ currentIndex: idx, currentState: states[idx] });
  },

  stepForward: () => {
    const { currentIndex, allStates } = get();
    if (currentIndex < allStates.length - 1) {
      const idx = currentIndex + 1;
      set({ currentIndex: idx, currentState: allStates[idx] });
    } else {
      set({ isPlaying: false });
    }
  },

  reset: () => {
    const states = rebuildStates(get().params);
    set({
      allStates: states,
      currentIndex: 0,
      currentState: states[0],
      isPlaying: false,
      triggeredEventDetails: extractEvents(states),
    });
  },

  setIsPlaying: (v) => set({ isPlaying: v }),
}));
