# AlgoVista

An interactive algorithm visualizer covering sorting, graph algorithms, dynamic programming, and backtracking. Built to turn textbook pseudocode into something you can actually watch happen, step by step.

**Live areas:**

- **Sorting** — Bubble, Selection, Insertion, Merge, Quick Sort with comparison/swap counters
- **Graph** — Dijkstra's, Prim's, Kruskal's, Floyd–Warshall, Topological Sort on a graph you build yourself (add nodes, connect weighted edges, drag to rearrange)
- **0/1 Knapsack** — animated DP table fill with traceback to the optimal item set
- **N-Queens** — animated backtracking with live solution count

Every visualizer includes playback controls (play/pause/step/scrub/speed), pseudocode, and time/space complexity.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Framer Motion · React Router

Algorithm logic lives in `src/algorithms/*.ts` as plain generator functions decoupled from the UI — each `yield` is one animation frame, so the same code that implements the algorithm also drives the visualization.

## Getting started

```bash
npm install
npm run dev
```

## Project structure

```
src/
  algorithms/   pure algorithm implementations (generator-based step producers)
  components/   shared UI (canvas, playback controls, buttons, panels)
  data/         catalog metadata, graph presets
  hooks/        usePlayback — generic play/pause/step/scrub controller
  pages/        one page per visualizer
```
