# AlgoVista

[![CI](https://github.com/nayana3333/AlgoVista-dsa-visualizer/actions/workflows/ci.yml/badge.svg)](https://github.com/nayana3333/AlgoVista-dsa-visualizer/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Live demo: https://nayana3333.github.io/AlgoVista-dsa-visualizer/**

An interactive algorithm visualizer covering sorting, graph algorithms, dynamic programming, and backtracking. Built to turn textbook pseudocode into something you can actually watch happen, step by step.

**Live areas:**

- **Sorting** — Bubble, Selection, Insertion, Merge, Quick Sort with comparison/swap counters
- **Graph** — Dijkstra's, Prim's, Kruskal's, Floyd–Warshall, Topological Sort on a graph you build yourself (add nodes, connect weighted edges, drag to rearrange)
- **0/1 Knapsack** — animated DP table fill with traceback to the optimal item set
- **N-Queens** — animated backtracking with live solution count

Every visualizer includes playback controls (play/pause/step/scrub/speed), pseudocode, and time/space complexity.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Framer Motion · React Router · Vitest

Algorithm logic lives in `src/algorithms/*.ts` as plain generator functions decoupled from the UI — each `yield` is one animation frame, so the same code that implements the algorithm also drives the visualization. That separation is also what makes the algorithms unit-testable in isolation from any rendering.

## Getting started

```bash
npm install
npm run dev
```

## Testing

```bash
npm test          # run once
npm run test:watch
```

57 tests cover the algorithm layer: sortedness/permutation invariants across random, sorted, reverse-sorted, and duplicate-heavy inputs for every sort; Dijkstra/Prim/Kruskal/Floyd–Warshall checked against hand-computed shortest paths and MST weight on a fixed reference graph; topological sort validated against every edge constraint; knapsack checked against a known-optimal instance; N-Queens solution counts checked against [OEIS A000170](https://oeis.org/A000170) for n = 4…8.

## CI/CD

Every push runs typecheck → lint → test → build via GitHub Actions ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)); pushes to `main` that pass all checks deploy automatically to GitHub Pages.

## Project structure

```
src/
  algorithms/   pure algorithm implementations (generator-based step producers) + their tests
  components/   shared UI (canvas, playback controls, buttons, panels)
  data/         catalog metadata, graph presets
  hooks/        usePlayback — generic play/pause/step/scrub controller
  pages/        one page per visualizer
```

## License

[MIT](LICENSE)
