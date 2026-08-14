import { describe, expect, it } from 'vitest';
import { SORT_ALGORITHMS } from './sorting';

function finalArray(algoId: string, input: number[]): number[] {
  const algo = SORT_ALGORITHMS.find((a) => a.id === algoId)!;
  let last = { array: [...input] };
  for (const step of algo.run(input)) last = step;
  return last.array;
}

function isSorted(arr: number[]): boolean {
  return arr.every((v, i) => i === 0 || arr[i - 1] <= v);
}

function sameMultiset(a: number[], b: number[]): boolean {
  return [...a].sort((x, y) => x - y).join(',') === [...b].sort((x, y) => x - y).join(',');
}

const sizes = [0, 1, 2, 5, 30];

describe.each(SORT_ALGORITHMS.map((a) => a.id))('%s', (algoId) => {
  it.each(sizes)('sorts a random array of size %i', (size) => {
    const input = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
    const result = finalArray(algoId, input);
    expect(result).toHaveLength(input.length);
    expect(isSorted(result)).toBe(true);
    expect(sameMultiset(result, input)).toBe(true);
  });

  it('sorts an already-sorted array without losing elements', () => {
    const input = [1, 2, 3, 4, 5];
    const result = finalArray(algoId, input);
    expect(result).toEqual(input);
  });

  it('sorts a reverse-sorted array', () => {
    const input = [9, 7, 5, 3, 1];
    const result = finalArray(algoId, input);
    expect(result).toEqual([1, 3, 5, 7, 9]);
  });

  it('handles duplicate values', () => {
    const input = [4, 2, 4, 1, 2, 4];
    const result = finalArray(algoId, input);
    expect(isSorted(result)).toBe(true);
    expect(sameMultiset(result, input)).toBe(true);
  });
});
