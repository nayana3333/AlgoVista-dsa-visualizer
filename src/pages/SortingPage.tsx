import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader, Panel, Button, Select, ComplexityPanel, PseudocodePanel, StatPill } from '../components/ui';
import { PlaybackControls } from '../components/PlaybackControls';
import { usePlayback } from '../hooks/usePlayback';
import { SORT_ALGORITHMS, type SortStep } from '../algorithms/sorting';

function randomArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 96) + 4);
}

export function SortingPage() {
  const [algoId, setAlgoId] = useState(SORT_ALGORITHMS[0].id);
  const [size, setSize] = useState(28);
  const [seedArray, setSeedArray] = useState<number[]>(() => randomArray(28));

  const algo = SORT_ALGORITHMS.find((a) => a.id === algoId)!;

  const steps = useMemo<SortStep[]>(() => {
    const result: SortStep[] = [{ array: [...seedArray], comparing: [], swapping: [], sorted: [] }];
    for (const step of algo.run(seedArray)) result.push(step);
    return result;
  }, [algo, seedArray]);

  const playback = usePlayback(steps, 65);

  useEffect(() => {
    playback.reset(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algoId, seedArray]);

  const step = playback.current ?? steps[0];
  const max = Math.max(...seedArray, 1);

  let comparisons = 0;
  let swaps = 0;
  for (let i = 0; i <= playback.index && i < steps.length; i++) {
    if (steps[i].comparing.length) comparisons++;
    if (steps[i].swapping.length) swaps++;
  }

  function shuffle() {
    setSeedArray(randomArray(size));
  }

  return (
    <div>
      <PageHeader
        eyebrow="Comparison-based sorting"
        title="Sorting Algorithms"
        description="Step through five classic sorting algorithms bar by bar. Toggle between them on the same array to compare how many comparisons and swaps each one really takes."
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 pb-24 lg:grid-cols-[280px_1fr]">
        <div className="space-y-4 lg:order-2">
          <Panel className="p-5">
            <Select label="Algorithm" value={algoId} onChange={(e) => setAlgoId(e.target.value)}>
              {SORT_ALGORITHMS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </Select>

            <div className="mt-4 flex flex-col gap-2">
              <span className="text-xs font-medium text-muted">Array size: {size}</span>
              <input
                type="range"
                min={6}
                max={70}
                value={size}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  setSize(n);
                  setSeedArray(randomArray(n));
                }}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
              />
            </div>

            <Button variant="secondary" className="mt-4 w-full" onClick={shuffle}>
              🔀 New random array
            </Button>
          </Panel>

          <div className="grid grid-cols-2 gap-3">
            <StatPill label="Comparisons" value={comparisons} tone="primary" />
            <StatPill label="Swaps" value={swaps} tone="accent" />
          </div>

          <ComplexityPanel
            rows={[
              { label: 'Best', value: algo.timeBest },
              { label: 'Average', value: algo.timeAvg },
              { label: 'Worst', value: algo.timeWorst },
              { label: 'Space', value: algo.space },
              { label: 'Stable', value: algo.stable ? 'Yes' : 'No' },
            ]}
          />

          <PseudocodePanel title="Pseudocode" lines={algo.pseudocode} />
        </div>

        <div className="space-y-4 lg:order-1">
          <Panel className="p-6">
            <div className="flex h-[380px] items-end justify-center gap-[3px]">
              {step.array.map((value, i) => {
                const isComparing = step.comparing.includes(i);
                const isSwapping = step.swapping.includes(i);
                const isSorted = step.sorted.includes(i);
                const isPivot = step.pivot === i;
                return (
                  <motion.div
                    key={i}
                    layout
                    transition={{ duration: 0.18 }}
                    className={`w-full min-w-[3px] rounded-t-sm ${
                      isPivot
                        ? 'bg-warning'
                        : isSwapping
                          ? 'bg-accent'
                          : isComparing
                            ? 'bg-primary-2'
                            : isSorted
                              ? 'bg-success'
                              : 'bg-[#dfcabb]'
                    }`}
                    style={{ height: `${(value / max) * 100}%` }}
                  />
                );
              })}
            </div>
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

          <div className="flex flex-wrap gap-4 px-1 text-xs text-muted">
            <LegendDot className="bg-[#dfcabb]" label="Unsorted" />
            <LegendDot className="bg-primary-2" label="Comparing" />
            <LegendDot className="bg-accent" label="Swapping" />
            <LegendDot className="bg-warning" label="Pivot" />
            <LegendDot className="bg-success" label="Sorted" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-sm ${className}`} />
      {label}
    </span>
  );
}
