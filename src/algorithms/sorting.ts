export interface SortStep {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  pivot?: number;
  message?: string;
}

export interface SortAlgo {
  id: string;
  name: string;
  timeBest: string;
  timeAvg: string;
  timeWorst: string;
  space: string;
  stable: boolean;
  pseudocode: string[];
  run: (arr: number[]) => Generator<SortStep>;
}

function snapshot(array: number[], comparing: number[], swapping: number[], sorted: number[], pivot?: number): SortStep {
  return { array: [...array], comparing, swapping, sorted: [...sorted], pivot };
}

function* bubbleSort(arr: number[]): Generator<SortStep> {
  const a = [...arr];
  const n = a.length;
  const sorted: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      yield snapshot(a, [j, j + 1], [], sorted);
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
        yield snapshot(a, [], [j, j + 1], sorted);
      }
    }
    sorted.unshift(n - i - 1);
    if (!swapped) break;
  }
  const remaining = [...Array(n).keys()].filter((i) => !sorted.includes(i));
  sorted.unshift(...remaining);
  yield snapshot(a, [], [], sorted);
}

function* selectionSort(arr: number[]): Generator<SortStep> {
  const a = [...arr];
  const n = a.length;
  const sorted: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      yield snapshot(a, [minIdx, j], [], sorted);
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      yield snapshot(a, [], [i, minIdx], sorted);
    }
    sorted.push(i);
  }
  sorted.push(n - 1);
  yield snapshot(a, [], [], sorted);
}

function* insertionSort(arr: number[]): Generator<SortStep> {
  const a = [...arr];
  const n = a.length;
  const sorted: number[] = [0];
  for (let i = 1; i < n; i++) {
    let j = i;
    yield snapshot(a, [i], [], sorted);
    while (j > 0 && a[j - 1] > a[j]) {
      [a[j - 1], a[j]] = [a[j], a[j - 1]];
      yield snapshot(a, [], [j - 1, j], sorted);
      j--;
    }
    sorted.push(i);
    sorted.sort((x, y) => x - y);
  }
  yield snapshot(a, [], [], sorted);
}

function* mergeSortHelper(a: number[], lo: number, hi: number, sorted: number[]): Generator<SortStep> {
  if (hi - lo <= 1) return;
  const mid = Math.floor((lo + hi) / 2);
  yield* mergeSortHelper(a, lo, mid, sorted);
  yield* mergeSortHelper(a, mid, hi, sorted);

  const left = a.slice(lo, mid);
  const right = a.slice(mid, hi);
  let i = 0, j = 0, k = lo;
  while (i < left.length && j < right.length) {
    yield snapshot(a, [lo + i, mid + j], [], sorted);
    if (left[i] <= right[j]) {
      a[k] = left[i++];
    } else {
      a[k] = right[j++];
    }
    yield snapshot(a, [], [k], sorted);
    k++;
  }
  while (i < left.length) {
    a[k] = left[i++];
    yield snapshot(a, [], [k], sorted);
    k++;
  }
  while (j < right.length) {
    a[k] = right[j++];
    yield snapshot(a, [], [k], sorted);
    k++;
  }
  if (hi - lo === a.length) {
    for (let x = lo; x < hi; x++) sorted.push(x);
  }
}

function* mergeSort(arr: number[]): Generator<SortStep> {
  const a = [...arr];
  const sorted: number[] = [];
  yield* mergeSortHelper(a, 0, a.length, sorted);
  yield snapshot(a, [], [], [...Array(a.length).keys()]);
}

function* quickSortHelper(a: number[], lo: number, hi: number, sorted: number[]): Generator<SortStep> {
  if (lo >= hi) {
    if (lo === hi) sorted.push(lo);
    return;
  }
  const pivotVal = a[hi];
  let i = lo - 1;
  for (let j = lo; j < hi; j++) {
    yield snapshot(a, [j, hi], [], sorted, hi);
    if (a[j] < pivotVal) {
      i++;
      [a[i], a[j]] = [a[j], a[i]];
      yield snapshot(a, [], [i, j], sorted, hi);
    }
  }
  [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
  yield snapshot(a, [], [i + 1, hi], sorted, i + 1);
  sorted.push(i + 1);
  yield* quickSortHelper(a, lo, i, sorted);
  yield* quickSortHelper(a, i + 2, hi, sorted);
}

function* quickSort(arr: number[]): Generator<SortStep> {
  const a = [...arr];
  const sorted: number[] = [];
  yield* quickSortHelper(a, 0, a.length - 1, sorted);
  yield snapshot(a, [], [], [...Array(a.length).keys()]);
}

export const SORT_ALGORITHMS: SortAlgo[] = [
  {
    id: "bubble",
    name: "Bubble Sort",
    timeBest: "O(n)",
    timeAvg: "O(n²)",
    timeWorst: "O(n²)",
    space: "O(1)",
    stable: true,
    pseudocode: [
      "for i in 0..n-1",
      "  for j in 0..n-i-1",
      "    if a[j] > a[j+1]",
      "      swap(a[j], a[j+1])",
    ],
    run: bubbleSort,
  },
  {
    id: "selection",
    name: "Selection Sort",
    timeBest: "O(n²)",
    timeAvg: "O(n²)",
    timeWorst: "O(n²)",
    space: "O(1)",
    stable: false,
    pseudocode: [
      "for i in 0..n-1",
      "  min = i",
      "  for j in i+1..n",
      "    if a[j] < a[min]: min = j",
      "  swap(a[i], a[min])",
    ],
    run: selectionSort,
  },
  {
    id: "insertion",
    name: "Insertion Sort",
    timeBest: "O(n)",
    timeAvg: "O(n²)",
    timeWorst: "O(n²)",
    space: "O(1)",
    stable: true,
    pseudocode: [
      "for i in 1..n",
      "  j = i",
      "  while j > 0 and a[j-1] > a[j]",
      "    swap(a[j-1], a[j]); j--",
    ],
    run: insertionSort,
  },
  {
    id: "merge",
    name: "Merge Sort",
    timeBest: "O(n log n)",
    timeAvg: "O(n log n)",
    timeWorst: "O(n log n)",
    space: "O(n)",
    stable: true,
    pseudocode: [
      "mergeSort(a, lo, hi):",
      "  if hi - lo <= 1: return",
      "  mid = (lo+hi)/2",
      "  mergeSort(a, lo, mid)",
      "  mergeSort(a, mid, hi)",
      "  merge(a, lo, mid, hi)",
    ],
    run: mergeSort,
  },
  {
    id: "quick",
    name: "Quick Sort",
    timeBest: "O(n log n)",
    timeAvg: "O(n log n)",
    timeWorst: "O(n²)",
    space: "O(log n)",
    stable: false,
    pseudocode: [
      "quickSort(a, lo, hi):",
      "  if lo >= hi: return",
      "  p = partition(a, lo, hi)",
      "  quickSort(a, lo, p-1)",
      "  quickSort(a, p+1, hi)",
    ],
    run: quickSort,
  },
];
