import './index.css';
import { Header } from './components/Header';
import { ScenarioSelector } from './components/ScenarioSelector';
import { SimulationControls } from './components/SimulationControls';
import { ControlPanel } from './components/ControlPanel';
import { FlowDiagram } from './components/FlowDiagram';
import { KpiPanel } from './components/KpiPanel';
import { WorldProgressMap } from './components/WorldProgressMap';
import { TimelineEvents } from './components/TimelineEvents';
import { ChartsSection } from './components/ChartsSection';
import { NarrativePanel } from './components/NarrativePanel';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="max-w-[1800px] mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <ScenarioSelector />
          <SimulationControls />
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 py-4 space-y-4">

        {/* Row 1: Strategy dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_260px] gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 min-h-[480px]">
            <ControlPanel />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 min-h-[480px]">
            <FlowDiagram />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 min-h-[480px] overflow-hidden">
            <KpiPanel />
          </div>
        </div>

        {/* Row 2: World map */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <WorldProgressMap />
        </div>

        {/* Threshold events */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <TimelineEvents />
        </div>

        {/* Charts */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <ChartsSection />
        </div>

        {/* Narrative */}
        <NarrativePanel />

        <div className="pb-8" />
      </div>
    </div>
  );
}
