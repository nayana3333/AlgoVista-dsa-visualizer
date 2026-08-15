import type { SVGProps } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CATALOG } from '../data/catalog';
import { SortGlyph, GraphGlyph, GridGlyph, QueenGlyph } from '../components/Icons';

const GLYPHS: Record<string, (props: SVGProps<SVGSVGElement>) => React.ReactElement> = {
  sort: SortGlyph,
  graph: GraphGlyph,
  grid: GridGlyph,
  queen: QueenGlyph,
};

const STATS = [
  { value: '11', label: 'Algorithms' },
  { value: '4', label: 'Paradigms' },
  { value: '100%', label: 'Client-side' },
];

const COMPLEXITY_ROWS = [
  { name: 'Bubble Sort', category: 'Sorting', time: 'O(n²)', space: 'O(1)' },
  { name: 'Selection Sort', category: 'Sorting', time: 'O(n²)', space: 'O(1)' },
  { name: 'Insertion Sort', category: 'Sorting', time: 'O(n²)', space: 'O(1)' },
  { name: 'Merge Sort', category: 'Sorting', time: 'O(n log n)', space: 'O(n)' },
  { name: 'Quick Sort', category: 'Sorting', time: 'O(n log n)*', space: 'O(log n)' },
  { name: "Dijkstra's", category: 'Graph', time: 'O(E log V)', space: 'O(V)' },
  { name: "Prim's MST", category: 'Graph', time: 'O(E log V)', space: 'O(V)' },
  { name: "Kruskal's MST", category: 'Graph', time: 'O(E log E)', space: 'O(V)' },
  { name: 'Floyd–Warshall', category: 'Graph', time: 'O(V³)', space: 'O(V²)' },
  { name: 'Topological Sort', category: 'Graph', time: 'O(V + E)', space: 'O(V)' },
  { name: '0/1 Knapsack', category: 'DP', time: 'O(n·W)', space: 'O(n·W)' },
  { name: 'N-Queens', category: 'Backtracking', time: 'O(N!)', space: 'O(N²)' },
];

export function Home() {
  return (
    <div>
      <section className="px-6 pb-24 pt-20 sm:pt-28">
        <div className="mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted"
          >
            Algorithm Design &amp; Analysis · visualized
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display text-balance text-5xl font-semibold tracking-tight text-ink sm:text-6xl"
          >
            Watch algorithms
            <br />
            <span className="italic text-primary">think, step by step.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted"
          >
            An interactive playground covering sorting, graph traversal, dynamic
            programming, and backtracking — built to turn textbook pseudocode
            into something you can actually see happen.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/sorting"
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_14px_-4px_rgba(176,79,111,0.55)] transition-transform hover:scale-[1.02]"
            >
              Start Visualizing
            </Link>
            <button
              type="button"
              onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-surface-2"
            >
              Browse Algorithms
            </button>
          </motion.div>

          <div className="mx-auto mt-16 flex max-w-md items-center justify-center divide-x divide-border">
            {STATS.map((s) => (
              <div key={s.label} className="flex-1 px-4">
                <div className="font-display text-2xl font-semibold text-ink">{s.value}</div>
                <div className="text-xs text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="catalog" className="mx-auto max-w-7xl px-6 pb-24">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">Explore by paradigm</h2>
            <p className="mt-1 text-sm text-muted">
              Each visualizer includes pseudocode, complexity analysis, and full playback controls.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {CATALOG.map((entry, i) => {
            const Glyph = GLYPHS[entry.glyph];
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <Link
                  to={entry.path}
                  className="group relative block rounded-2xl border border-border bg-surface p-7 shadow-[0_2px_10px_-4px_rgba(54,42,38,0.08)] transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_10px_30px_-12px_rgba(54,42,38,0.18)]"
                >
                  <div className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl ${entry.tint} p-2.5 ${entry.ink}`}>
                    <Glyph className="h-full w-full" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-ink">{entry.title}</h3>
                  <p className="mt-1 font-mono text-xs text-muted">{entry.tagline}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{entry.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {entry.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-border bg-surface-2 px-2.5 py-1 font-mono text-[11px] text-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center gap-1.5 text-sm font-medium text-ink opacity-0 transition-opacity group-hover:opacity-100">
                    Open visualizer
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-28">
        <div className="rounded-3xl border border-border bg-surface p-8 shadow-[0_2px_10px_-4px_rgba(54,42,38,0.08)] sm:p-10">
          <h2 className="font-display text-2xl font-semibold text-ink">Complexity cheat sheet</h2>
          <p className="mt-1 text-sm text-muted">
            Every algorithm covered in this project, side by side.
          </p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
                  <th className="py-3 pr-4 font-medium">Algorithm</th>
                  <th className="py-3 pr-4 font-medium">Paradigm</th>
                  <th className="py-3 pr-4 font-medium">Time</th>
                  <th className="py-3 font-medium">Space</th>
                </tr>
              </thead>
              <tbody>
                {COMPLEXITY_ROWS.map((row) => (
                  <tr key={row.name} className="border-b border-border/70 last:border-0">
                    <td className="py-3 pr-4 font-medium text-ink">{row.name}</td>
                    <td className="py-3 pr-4 text-muted">{row.category}</td>
                    <td className="py-3 pr-4 font-mono text-primary-2">{row.time}</td>
                    <td className="py-3 font-mono text-accent">{row.space}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-muted">* Quick Sort worst case is O(n²); shown is the practical average case.</p>
        </div>
      </section>
    </div>
  );
}
