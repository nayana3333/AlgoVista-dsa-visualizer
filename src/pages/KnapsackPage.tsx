import { useEffect, useMemo, useState } from 'react';
import { knapsack, type KnapItem, type KnapStep } from '../algorithms/knapsack';
import { PageHeader, Panel, Button, ComplexityPanel, PseudocodePanel, StatPill } from '../components/ui';
import { PlaybackControls } from '../components/PlaybackControls';
import { usePlayback } from '../hooks/usePlayback';

let itemId = 100;

const DEFAULT_ITEMS: KnapItem[] = [
  { id: 1, name: 'Item 1', weight: 2, value: 3 },
  { id: 2, name: 'Item 2', weight: 3, value: 4 },
  { id: 3, name: 'Item 3', weight: 4, value: 5 },
  { id: 4, name: 'Item 4', weight: 5, value: 8 },
];

const PSEUDOCODE = [
  'dp[0][w] = 0 for all w',
  'for i in 1..n:',
  '  for w in 0..capacity:',
  '    if weight[i] > w:',
  '      dp[i][w] = dp[i-1][w]',
  '    else:',
  '      dp[i][w] = max(dp[i-1][w],',
  '        value[i] + dp[i-1][w-weight[i]])',
  'return dp[n][capacity]',
];

export function KnapsackPage() {
  const [items, setItems] = useState<KnapItem[]>(DEFAULT_ITEMS);
  const [capacity, setCapacity] = useState(10);

  const steps = useMemo<KnapStep[]>(() => {
    const result: KnapStep[] = [];
    for (const s of knapsack(items, capacity)) result.push(s);
    return result;
  }, [items, capacity]);

  const playback = usePlayback(steps, 70);

  useEffect(() => {
    playback.reset(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, capacity]);

  const step = playback.current ?? steps[0];

  function addItem() {
    if (items.length >= 6) return;
    itemId++;
    setItems((prev) => [...prev, { id: itemId, name: `Item ${prev.length + 1}`, weight: 2, value: 3 }]);
  }

  function removeItem(id: number) {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  function updateItem(id: number, patch: Partial<KnapItem>) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  const selectedItems = items.filter((it) => step.selected.includes(it.id));
  const totalWeight = selectedItems.reduce((s, it) => s + it.weight, 0);
  const totalValue = selectedItems.reduce((s, it) => s + it.value, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Dynamic Programming"
        title="0/1 Knapsack"
        description="Pick items to maximize total value without exceeding the weight capacity — each item is either taken whole or left behind. Watch the DP table fill in and trace back the optimal choice."
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 pb-24 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Panel className="overflow-x-auto p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink">DP table — rows: items, columns: capacity 0…{capacity}</h3>
            </div>
            <table className="border-collapse font-mono text-xs">
              <thead>
                <tr>
                  <th className="w-16 p-1.5 text-left text-muted">item \ w</th>
                  {Array.from({ length: capacity + 1 }, (_, w) => (
                    <th key={w} className="w-8 p-1.5 text-center text-muted">
                      {w}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {step.table.map((row, i) => (
                  <tr key={i}>
                    <td className="p-1.5 text-muted">{i === 0 ? '∅' : items[i - 1]?.name}</td>
                    {row.map((v, w) => {
                      const isCurrent = step.i === i && step.j === w;
                      return (
                        <td
                          key={w}
                          className={`w-8 rounded p-1.5 text-center transition-colors ${
                            isCurrent ? 'bg-primary text-white font-semibold' : 'text-ink'
                          }`}
                        >
                          {v}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <Panel className="p-5">
            <PlaybackControls
              isPlaying={playback.isPlaying}
              index={playback.index}
              total={playback.total}
              speed={playback.speed}
              onPlay={playback.play}
              onPause={playback.pause}
              onStepBack={playback.stepBack}
              onStepForward={playback.stepForward}
              onReset={() => playback.reset(0)}
              onSpeedChange={playback.setSpeed}
              onScrub={playback.setIndex}
            />
          </Panel>

          <Panel className="p-4 font-mono text-sm text-primary-2">{step.message}</Panel>

          <div className="grid grid-cols-3 gap-3">
            <StatPill label="Optimal value" value={step.table[items.length]?.[capacity] ?? 0} tone="primary" />
            <StatPill label="Selected weight" value={`${totalWeight}/${capacity}`} tone="accent" />
            <StatPill label="Items chosen" value={selectedItems.length} />
          </div>

          {selectedItems.length > 0 && (
            <Panel className="p-5">
              <h3 className="mb-3 text-sm font-semibold text-ink">Chosen items</h3>
              <ul className="flex flex-wrap gap-2">
                {selectedItems.map((it) => (
                  <li key={it.id} className="rounded-full border border-success/30 bg-success/10 px-3 py-1 font-mono text-xs text-success">
                    {it.name} (w{it.weight}, v{it.value})
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted">Total value {totalValue} for total weight {totalWeight}.</p>
            </Panel>
          )}
        </div>

        <div className="space-y-4">
          <Panel className="p-5">
            <h3 className="mb-3 text-sm font-semibold text-ink">Items</h3>
            <div className="space-y-3">
              {items.map((it) => (
                <div key={it.id} className="rounded-xl border border-border bg-surface-2 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <input
                      value={it.name}
                      onChange={(e) => updateItem(it.id, { name: e.target.value })}
                      aria-label="Item name"
                      className="w-24 bg-transparent text-sm font-medium text-ink outline-none"
                    />
                    <button
                      onClick={() => removeItem(it.id)}
                      className="text-xs text-muted hover:text-danger"
                      disabled={items.length <= 1}
                      aria-label={`Remove ${it.name}`}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex flex-col gap-1">
                      <span className="text-[10px] text-muted">Weight</span>
                      <input
                        type="number"
                        min={1}
                        max={capacity}
                        value={it.weight}
                        onChange={(e) => updateItem(it.id, { weight: Math.max(1, Number(e.target.value)) })}
                        className="rounded-lg border border-border bg-surface px-2 py-1 text-sm text-ink outline-none"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-[10px] text-muted">Value</span>
                      <input
                        type="number"
                        min={1}
                        value={it.value}
                        onChange={(e) => updateItem(it.id, { value: Math.max(1, Number(e.target.value)) })}
                        className="rounded-lg border border-border bg-surface px-2 py-1 text-sm text-ink outline-none"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="secondary" className="mt-3 w-full" onClick={addItem} disabled={items.length >= 6}>
              + Add item
            </Button>

            <div className="mt-4 flex flex-col gap-2">
              <span className="text-xs font-medium text-muted">Capacity: {capacity}</span>
              <input
                type="range"
                min={4}
                max={20}
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
              />
            </div>
          </Panel>

          <ComplexityPanel
            rows={[
              { label: 'Time', value: 'O(n · W)' },
              { label: 'Space', value: 'O(n · W)' },
            ]}
          />
          <PseudocodePanel title="Pseudocode" lines={PSEUDOCODE} />
        </div>
      </div>
    </div>
  );
}
