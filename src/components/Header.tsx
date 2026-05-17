export function Header() {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Stablecoin Flywheel Simulator
          </h1>
          <span className="text-sm text-indigo-600 font-medium">SC経済圏形成シミュレーター</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          B2B決済から、給与・AIエージェント・消費へ。ステーブルコイン残高が日本社会に滲み出し、貿易を通じて国際的に広がる条件を可視化する。
        </p>
        <div className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-1.5 inline-block">
          ⚠ This is a strategic scenario tool, not a precise forecast. BVNK data reflects a crypto-engaged survey population.
          Japan values and trade-diffusion weights are model assumptions.
        </div>
      </div>
    </header>
  );
}
