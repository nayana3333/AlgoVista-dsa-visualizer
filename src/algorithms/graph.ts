export interface GNode {
  id: number;
  x: number;
  y: number;
  label: string;
}

export interface GEdge {
  id: string;
  u: number;
  v: number;
  w: number;
}

export interface GraphStep {
  visited: number[];
  active: number[];
  consideredEdge: string | null;
  acceptedEdges: string[];
  rejectedEdges: string[];
  dist: Record<number, number>;
  order: number[];
  matrix?: number[][];
  pivot?: number;
  message: string;
}

const INF = Infinity;

function baseStep(nodeIds: number[]): GraphStep {
  return {
    visited: [],
    active: [],
    consideredEdge: null,
    acceptedEdges: [],
    rejectedEdges: [],
    dist: Object.fromEntries(nodeIds.map((id) => [id, INF])),
    order: [],
    message: '',
  };
}

function buildAdjacency(nodes: GNode[], edges: GEdge[]) {
  const adj = new Map<number, { to: number; w: number; edgeId: string }[]>();
  nodes.forEach((n) => adj.set(n.id, []));
  for (const e of edges) {
    adj.get(e.u)!.push({ to: e.v, w: e.w, edgeId: e.id });
    adj.get(e.v)!.push({ to: e.u, w: e.w, edgeId: e.id });
  }
  return adj;
}

export function* dijkstra(nodes: GNode[], edges: GEdge[], source: number): Generator<GraphStep> {
  const ids = nodes.map((n) => n.id);
  const adj = buildAdjacency(nodes, edges);
  const dist: Record<number, number> = Object.fromEntries(ids.map((id) => [id, INF]));
  const visited = new Set<number>();
  dist[source] = 0;

  const s = baseStep(ids);
  s.dist = { ...dist };
  s.message = `Start at node ${labelOf(nodes, source)}. Distance to itself is 0.`;
  yield s;

  for (let iter = 0; iter < ids.length; iter++) {
    let u = -1;
    let best = INF;
    for (const id of ids) {
      if (!visited.has(id) && dist[id] < best) {
        best = dist[id];
        u = id;
      }
    }
    if (u === -1) break;
    visited.add(u);

    yield {
      ...baseStep(ids),
      dist: { ...dist },
      visited: [...visited],
      active: [u],
      order: [],
      acceptedEdges: [],
      rejectedEdges: [],
      consideredEdge: null,
      message: `Pick unvisited node ${labelOf(nodes, u)} with smallest known distance (${fmt(dist[u])}).`,
    };

    for (const { to, w, edgeId } of adj.get(u) ?? []) {
      if (visited.has(to)) continue;
      const alt = dist[u] + w;
      const improved = alt < dist[to];
      yield {
        ...baseStep(ids),
        dist: { ...dist },
        visited: [...visited],
        active: [u, to],
        consideredEdge: edgeId,
        acceptedEdges: [],
        rejectedEdges: [],
        order: [],
        message: improved
          ? `Relax edge ${labelOf(nodes, u)}→${labelOf(nodes, to)}: ${fmt(dist[u])} + ${w} = ${alt} < ${fmt(dist[to])}, update.`
          : `Edge ${labelOf(nodes, u)}→${labelOf(nodes, to)}: ${fmt(dist[u])} + ${w} = ${alt} ≥ ${fmt(dist[to])}, no change.`,
      };
      if (improved) dist[to] = alt;
    }
  }

  yield {
    ...baseStep(ids),
    dist: { ...dist },
    visited: [...visited],
    message: 'All reachable nodes visited. Shortest distances finalized.',
  };
}

export function* prim(nodes: GNode[], edges: GEdge[], source: number): Generator<GraphStep> {
  const ids = nodes.map((n) => n.id);
  const adj = buildAdjacency(nodes, edges);
  const inMst = new Set<number>([source]);
  const accepted: string[] = [];

  yield {
    ...baseStep(ids),
    active: [source],
    visited: [source],
    message: `Start the MST at node ${labelOf(nodes, source)}.`,
  };

  while (inMst.size < ids.length) {
    let bestEdge: { to: number; w: number; edgeId: string; from: number } | null = null;
    for (const from of inMst) {
      for (const { to, w, edgeId } of adj.get(from) ?? []) {
        if (inMst.has(to)) continue;
        if (!bestEdge || w < bestEdge.w) bestEdge = { to, w, edgeId, from };
      }
    }
    if (!bestEdge) break;

    yield {
      ...baseStep(ids),
      visited: [...inMst],
      active: [bestEdge.from, bestEdge.to],
      consideredEdge: bestEdge.edgeId,
      acceptedEdges: [...accepted],
      message: `Cheapest edge leaving the tree: ${labelOf(nodes, bestEdge.from)}–${labelOf(nodes, bestEdge.to)} (weight ${bestEdge.w}).`,
    };

    inMst.add(bestEdge.to);
    accepted.push(bestEdge.edgeId);

    yield {
      ...baseStep(ids),
      visited: [...inMst],
      active: [bestEdge.to],
      acceptedEdges: [...accepted],
      message: `Add node ${labelOf(nodes, bestEdge.to)} to the MST.`,
    };
  }

  yield {
    ...baseStep(ids),
    visited: [...inMst],
    acceptedEdges: [...accepted],
    message: `Minimum spanning tree complete with ${accepted.length} edges.`,
  };
}

class DSU {
  parent: Map<number, number>;
  constructor(ids: number[]) {
    this.parent = new Map(ids.map((id) => [id, id]));
  }
  find(x: number): number {
    while (this.parent.get(x) !== x) {
      this.parent.set(x, this.parent.get(this.parent.get(x)!)!);
      x = this.parent.get(x)!;
    }
    return x;
  }
  union(a: number, b: number): boolean {
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra === rb) return false;
    this.parent.set(ra, rb);
    return true;
  }
}

export function* kruskal(nodes: GNode[], edges: GEdge[]): Generator<GraphStep> {
  const ids = nodes.map((n) => n.id);
  const sorted = [...edges].sort((a, b) => a.w - b.w);
  const dsu = new DSU(ids);
  const accepted: string[] = [];
  const rejected: string[] = [];

  yield {
    ...baseStep(ids),
    message: `Sort all ${edges.length} edges by weight ascending.`,
  };

  for (const e of sorted) {
    yield {
      ...baseStep(ids),
      active: [e.u, e.v],
      consideredEdge: e.id,
      acceptedEdges: [...accepted],
      rejectedEdges: [...rejected],
      message: `Consider edge ${labelOf(nodes, e.u)}–${labelOf(nodes, e.v)} (weight ${e.w}).`,
    };

    if (dsu.union(e.u, e.v)) {
      accepted.push(e.id);
      yield {
        ...baseStep(ids),
        active: [e.u, e.v],
        acceptedEdges: [...accepted],
        rejectedEdges: [...rejected],
        message: `No cycle formed — accept edge ${labelOf(nodes, e.u)}–${labelOf(nodes, e.v)}.`,
      };
    } else {
      rejected.push(e.id);
      yield {
        ...baseStep(ids),
        active: [e.u, e.v],
        acceptedEdges: [...accepted],
        rejectedEdges: [...rejected],
        message: `${labelOf(nodes, e.u)} and ${labelOf(nodes, e.v)} are already connected — reject to avoid a cycle.`,
      };
    }
    if (accepted.length === ids.length - 1) break;
  }

  yield {
    ...baseStep(ids),
    acceptedEdges: [...accepted],
    rejectedEdges: [...rejected],
    message: `Minimum spanning tree complete with ${accepted.length} edges.`,
  };
}

export function* floydWarshall(nodes: GNode[], edges: GEdge[]): Generator<GraphStep> {
  const ids = nodes.map((n) => n.id);
  const n = ids.length;
  const idx = new Map(ids.map((id, i) => [id, i]));
  const dist: number[][] = Array.from({ length: n }, () => Array(n).fill(INF));
  for (let i = 0; i < n; i++) dist[i][i] = 0;
  for (const e of edges) {
    const i = idx.get(e.u)!;
    const j = idx.get(e.v)!;
    dist[i][j] = Math.min(dist[i][j], e.w);
    dist[j][i] = Math.min(dist[j][i], e.w);
  }

  yield {
    ...baseStep(ids),
    matrix: dist.map((r) => [...r]),
    message: 'Initialize distance matrix from direct edges (∞ where no edge exists).',
  };

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const through = dist[i][k] + dist[k][j];
        const improved = through < dist[i][j];
        yield {
          ...baseStep(ids),
          matrix: dist.map((r) => [...r]),
          pivot: ids[k],
          active: [ids[i], ids[j]],
          message: improved
            ? `Via ${labelOf(nodes, ids[k])}: dist[${labelOf(nodes, ids[i])}][${labelOf(nodes, ids[j])}] improves to ${fmt(through)}.`
            : `Via ${labelOf(nodes, ids[k])}: no improvement for ${labelOf(nodes, ids[i])}→${labelOf(nodes, ids[j])}.`,
        };
        if (improved) dist[i][j] = through;
      }
    }
  }

  yield {
    ...baseStep(ids),
    matrix: dist.map((r) => [...r]),
    message: 'All-pairs shortest paths computed.',
  };
}

export function* topologicalSort(nodes: GNode[], edges: GEdge[]): Generator<GraphStep> {
  const ids = nodes.map((n) => n.id);
  const adj = new Map<number, number[]>(ids.map((id) => [id, []]));
  const indeg = new Map<number, number>(ids.map((id) => [id, 0]));
  for (const e of edges) {
    adj.get(e.u)!.push(e.v);
    indeg.set(e.v, (indeg.get(e.v) ?? 0) + 1);
  }
  const queue: number[] = ids.filter((id) => indeg.get(id) === 0);
  const order: number[] = [];

  yield {
    ...baseStep(ids),
    message: `Initial in-degree 0 nodes: ${queue.map((id) => labelOf(nodes, id)).join(', ') || 'none'}.`,
  };

  while (queue.length) {
    const u = queue.shift()!;
    order.push(u);
    yield {
      ...baseStep(ids),
      order: [...order],
      active: [u],
      visited: [...order],
      message: `Remove ${labelOf(nodes, u)} (in-degree 0) and append to the ordering.`,
    };
    for (const v of adj.get(u) ?? []) {
      indeg.set(v, (indeg.get(v) ?? 0) - 1);
      yield {
        ...baseStep(ids),
        order: [...order],
        active: [u, v],
        visited: [...order],
        message: `Decrease in-degree of ${labelOf(nodes, v)} to ${indeg.get(v)}.`,
      };
      if (indeg.get(v) === 0) queue.push(v);
    }
  }

  const cyclic = order.length < ids.length;
  yield {
    ...baseStep(ids),
    order: [...order],
    visited: [...order],
    message: cyclic
      ? 'Cycle detected — a full topological order does not exist.'
      : `Topological order complete: ${order.map((id) => labelOf(nodes, id)).join(' → ')}.`,
  };
}

function labelOf(nodes: GNode[], id: number): string {
  return nodes.find((n) => n.id === id)?.label ?? String(id);
}

function fmt(v: number): string {
  return v === INF ? '∞' : String(v);
}

export interface GraphAlgoMeta {
  id: string;
  name: string;
  directed: boolean;
  needsSource: boolean;
  time: string;
  space: string;
  pseudocode: string[];
}

export const GRAPH_ALGORITHMS: GraphAlgoMeta[] = [
  {
    id: 'dijkstra',
    name: "Dijkstra's Shortest Path",
    directed: false,
    needsSource: true,
    time: 'O(E log V)',
    space: 'O(V)',
    pseudocode: [
      'dist[src] = 0, others = ∞',
      'while unvisited nodes remain:',
      '  u = unvisited node with min dist',
      '  for each neighbor v of u:',
      '    if dist[u]+w(u,v) < dist[v]:',
      '      dist[v] = dist[u]+w(u,v)',
    ],
  },
  {
    id: 'prim',
    name: "Prim's MST",
    directed: false,
    needsSource: true,
    time: 'O(E log V)',
    space: 'O(V)',
    pseudocode: [
      'MST = {src}',
      'while MST does not span all nodes:',
      '  pick cheapest edge (u,v)',
      '  with u in MST, v not in MST',
      '  add v and edge (u,v) to MST',
    ],
  },
  {
    id: 'kruskal',
    name: "Kruskal's MST",
    directed: false,
    needsSource: false,
    time: 'O(E log E)',
    space: 'O(V)',
    pseudocode: [
      'sort edges by weight ascending',
      'for each edge (u,v):',
      '  if find(u) != find(v):',
      '    union(u, v)',
      '    add edge to MST',
    ],
  },
  {
    id: 'floyd',
    name: 'Floyd–Warshall',
    directed: false,
    needsSource: false,
    time: 'O(V³)',
    space: 'O(V²)',
    pseudocode: [
      'dist = adjacency matrix (∞ if no edge)',
      'for k in nodes:',
      '  for i in nodes:',
      '    for j in nodes:',
      '      dist[i][j] = min(dist[i][j],',
      '                       dist[i][k]+dist[k][j])',
    ],
  },
  {
    id: 'topo',
    name: 'Topological Sort',
    directed: true,
    needsSource: false,
    time: 'O(V + E)',
    space: 'O(V)',
    pseudocode: [
      "compute in-degree of every node",
      'queue = nodes with in-degree 0',
      'while queue is not empty:',
      '  u = queue.pop()',
      '  order.append(u)',
      '  for each neighbor v of u:',
      '    in-degree[v] -= 1',
      '    if in-degree[v] == 0: queue.push(v)',
    ],
  },
];
