import { Button, Slider } from './ui';

export function PlaybackControls({
  isPlaying,
  index,
  total,
  speed,
  onPlay,
  onPause,
  onStepBack,
  onStepForward,
  onReset,
  onSpeedChange,
  onScrub,
  disabled = false,
}: {
  isPlaying: boolean;
  index: number;
  total: number;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onReset: () => void;
  onSpeedChange: (v: number) => void;
  onScrub: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4">
      <input
        type="range"
        min={0}
        max={Math.max(total - 1, 0)}
        value={index}
        onChange={(e) => onScrub(Number(e.target.value))}
        disabled={disabled}
        aria-label="Scrub to step"
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary disabled:opacity-40"
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={onReset} disabled={disabled} title="Reset" aria-label="Reset to start">
            ⟲
          </Button>
          <Button
            variant="secondary"
            onClick={onStepBack}
            disabled={disabled || index === 0}
            title="Step back"
            aria-label="Step back"
          >
            ◀
          </Button>
          {isPlaying ? (
            <Button variant="primary" onClick={onPause} disabled={disabled} aria-label="Pause">
              ❚❚ Pause
            </Button>
          ) : (
            <Button variant="primary" onClick={onPlay} disabled={disabled} aria-label="Play">
              ▶ Play
            </Button>
          )}
          <Button
            variant="secondary"
            onClick={onStepForward}
            disabled={disabled || index >= total - 1}
            title="Step forward"
            aria-label="Step forward"
          >
            ▶|
          </Button>
        </div>
        <Slider
          label="Speed"
          valueLabel={`${speed}%`}
          min={1}
          max={100}
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          disabled={disabled}
          className="w-40"
        />
        <span className="font-mono text-xs text-muted">
          step {Math.min(index + 1, total)} / {total || 0}
        </span>
      </div>
    </div>
  );
}
