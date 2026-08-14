import { describe, expect, it } from 'vitest';
import { knapsack, type KnapItem } from './knapsack';

function lastStep(items: KnapItem[], capacity: number) {
  let last;
  for (const step of knapsack(items, capacity)) last = step;
  return last!;
}

describe('knapsack', () => {
  it('finds the known optimal value for a classic small instance', () => {
    const items: KnapItem[] = [
      { id: 1, name: 'Item 1', weight: 2, value: 3 },
      { id: 2, name: 'Item 2', weight: 3, value: 4 },
      { id: 3, name: 'Item 3', weight: 4, value: 5 },
      { id: 4, name: 'Item 4', weight: 5, value: 8 },
    ];
    const result = lastStep(items, 10);
    expect(result.table[items.length][10]).toBe(15);
  });

  it('the traced-back selection never exceeds capacity and sums to the optimal value', () => {
    const items: KnapItem[] = [
      { id: 1, name: 'Item 1', weight: 2, value: 3 },
      { id: 2, name: 'Item 2', weight: 3, value: 4 },
      { id: 3, name: 'Item 3', weight: 4, value: 5 },
      { id: 4, name: 'Item 4', weight: 5, value: 8 },
    ];
    const capacity = 10;
    const result = lastStep(items, capacity);
    const chosen = items.filter((it) => result.selected.includes(it.id));
    const totalWeight = chosen.reduce((s, it) => s + it.weight, 0);
    const totalValue = chosen.reduce((s, it) => s + it.value, 0);
    expect(totalWeight).toBeLessThanOrEqual(capacity);
    expect(totalValue).toBe(result.table[items.length][capacity]);
  });

  it('returns 0 when capacity is 0', () => {
    const items: KnapItem[] = [{ id: 1, name: 'Item 1', weight: 2, value: 3 }];
    const result = lastStep(items, 0);
    expect(result.table[1][0]).toBe(0);
  });

  it('skips an item heavier than the capacity', () => {
    const items: KnapItem[] = [{ id: 1, name: 'Item 1', weight: 20, value: 100 }];
    const result = lastStep(items, 5);
    expect(result.table[1][5]).toBe(0);
  });
});
