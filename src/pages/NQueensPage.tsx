import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { nQueens, NQUEENS_PSEUDOCODE, type NQueenStep } from '../algorithms/nqueens';
import { PageHeader, Panel, ComplexityPanel, PseudocodePanel, StatPill } from '../components/ui';
import { PlaybackControls } from '../components/PlaybackControls';
import { usePlayback } from '../hooks/usePlayback';

const MAX_N = 9;

export function NQueensPage() {
  const [n, setN] = useState(8);

  const steps = useMemo<NQueenStep[]>(() => {
    const result: NQueenStep[] = [];
    for (const s of nQueens(n)) result.push(s);
    return result;
  }, [n]);

  const playback = usePlayback(steps, 90);

  useEffect(() => {
    playback.reset(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  const step = playback.current ?? steps[0];

  return (
    <div>
      <PageHeader
        eyebrow="Constraint satisfaction"
        title="N-Queens"
        description="Place N queens on an N×N board so that no two share a row, column, or diagonal — one row at a time, backtracking the instant a placement fails."
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 pb-24 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Panel className="flex flex-col items-center p-6">
            <div
              className="grid aspect-square w-full max-w-[440px] overflow-hidden rounded-xl border border-border"
              style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}
            >
              {Array.from({ length: n * n }, (_, idx) => {
                const row = Math.floor(idx / n);
                const col = idx % n;
                const dark = (row + col) % 2 === 1;
                const hasQueen = step.board[row] === col;
                const isCursor = step.row === row && step.col === col;
                const isRejected = isCursor && step.status === 'rejected';
                const isTrying = isCursor && step.status === 'trying';

                return (
                  <div
                    key={idx}
                    className={`relative flex items-center justify-center ${dark ? 'bg-[#e8d3c3]' : 'bg-[#fbf3ec]'}`}
                  >
                    {isTrying && <div className="absolute inset-1 rounded-md border-2 border-primary-2/70" />}
                    {isRejected && <div className="absolute inset-1 rounded-md border-2 border-danger/80 bg-danger/10" />}
                    {hasQueen && (
                      <motion.span
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                        className="select-none text-[min(6vw,26px)] text-primary drop-shadow-[0_1px_1px_rgba(54,42,38,0.35)]"
                      >
                        ♛
                      </motion.span>
                    )}
                  </div>
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

          <Panel className="p-4 font-mono text-sm text-primary-2">{step.message}</Panel>

          <div className="grid grid-cols-2 gap-3">
            <StatPill label="Solutions found" value={step.solutions} tone="primary" />
            <StatPill label="Nodes explored" value={playback.index + 1} tone="accent" />
          </div>
        </div>

        <div className="space-y-4">
          <Panel className="p-5">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted">Board size: {n} × {n}</span>
              <input
                type="range"
                min={4}
                max={MAX_N}
                value={n}
                onChange={(e) => setN(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
              />
            </div>
            <p className="mt-3 text-xs text-muted">
              Capped at {MAX_N}×{MAX_N} so every backtracking step can be recorded and scrubbed smoothly — larger boards explode past millions of search nodes.
            </p>
          </Panel>

          <ComplexityPanel rows={[{ label: 'Time', value: 'O(N!)' }, { label: 'Space', value: 'O(N²)' }]} />
          <PseudocodePanel title="Pseudocode" lines={NQUEENS_PSEUDOCODE} />
        </div>
      </div>
    </div>
  );
}
