import { useEffect, useRef, useState } from 'react';

export function usePlayback<T>(steps: T[], defaultSpeed = 60) {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(defaultSpeed);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) return;
    if (index >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const delay = Math.max(4, 220 - speed * 2);
    timerRef.current = window.setTimeout(() => {
      setIndex((i) => Math.min(i + 1, steps.length - 1));
    }, delay);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [isPlaying, index, speed, steps.length]);

  function reset(toIndex = 0) {
    setIsPlaying(false);
    setIndex(toIndex);
  }

  function play() {
    if (index >= steps.length - 1) setIndex(0);
    setIsPlaying(true);
  }

  function pause() {
    setIsPlaying(false);
  }

  function stepForward() {
    setIsPlaying(false);
    setIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  function stepBack() {
    setIsPlaying(false);
    setIndex((i) => Math.max(i - 1, 0));
  }

  const current = steps[Math.min(index, Math.max(steps.length - 1, 0))];

  return {
    index,
    current,
    isPlaying,
    speed,
    setSpeed,
    setIndex,
    play,
    pause,
    reset,
    stepForward,
    stepBack,
    isDone: index >= steps.length - 1,
    total: steps.length,
  };
}
