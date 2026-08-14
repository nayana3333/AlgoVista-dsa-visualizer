export interface KnapItem {
  id: number;
  name: string;
  weight: number;
  value: number;
}

export interface KnapStep {
  table: number[][];
  i: number;
  j: number;
  selected: number[];
  message: string;
}

export function* knapsack(items: KnapItem[], capacity: number): Generator<KnapStep> {
  const n = items.length;
  const table: number[][] = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

  yield { table: clone(table), i: 0, j: 0, selected: [], message: 'Base case: 0 items or 0 capacity → value is always 0.' };

  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];
    for (let w = 0; w <= capacity; w++) {
      if (item.weight > w) {
        table[i][w] = table[i - 1][w];
        yield {
          table: clone(table),
          i,
          j: w,
          selected: [],
          message: `${item.name} (w=${item.weight}) doesn't fit in capacity ${w}. Carry over dp[${i - 1}][${w}] = ${table[i][w]}.`,
        };
      } else {
        const withoutItem = table[i - 1][w];
        const withItem = item.value + table[i - 1][w - item.weight];
        table[i][w] = Math.max(withoutItem, withItem);
        yield {
          table: clone(table),
          i,
          j: w,
          selected: [],
          message: `${item.name}: max(skip=${withoutItem}, take=${item.value}+dp[${i - 1}][${w - item.weight}]=${withItem}) = ${table[i][w]}.`,
        };
      }
    }
  }

  const selected: number[] = [];
  let w = capacity;
  for (let i = n; i > 0; i--) {
    if (table[i][w] !== table[i - 1][w]) {
      selected.push(items[i - 1].id);
      w -= items[i - 1].weight;
    }
  }

  yield {
    table: clone(table),
    i: n,
    j: capacity,
    selected,
    message: `Optimal value ${table[n][capacity]}. Traced back ${selected.length} item(s) that make up the solution.`,
  };
}

function clone(t: number[][]): number[][] {
  return t.map((r) => [...r]);
}
