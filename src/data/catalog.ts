export interface CatalogEntry {
  id: string;
  path: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  tint: string;
  ink: string;
  glyph: string;
}

export const CATALOG: CatalogEntry[] = [
  {
    id: 'sorting',
    path: '/sorting',
    title: 'Sorting Algorithms',
    tagline: 'Bubble · Selection · Insertion · Merge · Quick',
    description:
      'Watch comparisons and swaps unfold bar-by-bar. Compare best/average/worst case complexity and stability across five classic sorting algorithms.',
    tags: ['O(n log n)', 'Divide & Conquer', 'In-place'],
    tint: 'bg-primary-soft',
    ink: 'text-primary',
    glyph: 'sort',
  },
  {
    id: 'graph',
    path: '/graph',
    title: 'Graph Algorithms',
    tagline: "Dijkstra · Prim's · Kruskal's · Floyd–Warshall · Topological Sort",
    description:
      'Build your own weighted graph and step through shortest-path, minimum spanning tree, all-pairs, and DAG-ordering algorithms in real time.',
    tags: ['Greedy', 'Shortest Path', 'MST'],
    tint: 'bg-primary-2-soft',
    ink: 'text-primary-2',
    glyph: 'graph',
  },
  {
    id: 'knapsack',
    path: '/knapsack',
    title: '0/1 Knapsack',
    tagline: 'Dynamic Programming',
    description:
      'Fill your own item list, watch the DP table populate cell by cell, and trace back the optimal subset that maximizes value under a weight limit.',
    tags: ['O(n·W)', 'Optimal Substructure', 'Tabulation'],
    tint: 'bg-accent-soft',
    ink: 'text-accent',
    glyph: 'grid',
  },
  {
    id: 'nqueens',
    path: '/nqueens',
    title: 'N-Queens',
    tagline: 'Backtracking',
    description:
      'Place queens one row at a time, backtrack the moment a conflict appears, and count every valid arrangement for boards up to 9×9.',
    tags: ['O(N!)', 'Constraint Satisfaction', 'Recursion'],
    tint: 'bg-plum-soft',
    ink: 'text-plum',
    glyph: 'queen',
  },
];
