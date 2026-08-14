import type { GEdge, GNode } from '../algorithms/graph';

export function makePreset(kind: 'undirected' | 'dag'): { nodes: GNode[]; edges: GEdge[] } {
  const nodes: GNode[] = [
    { id: 1, x: 90, y: 200, label: 'A' },
    { id: 2, x: 230, y: 90, label: 'B' },
    { id: 3, x: 230, y: 310, label: 'C' },
    { id: 4, x: 390, y: 200, label: 'D' },
    { id: 5, x: 540, y: 90, label: 'E' },
    { id: 6, x: 540, y: 310, label: 'F' },
  ];

  if (kind === 'dag') {
    const edges: GEdge[] = [
      { id: 'e1', u: 1, v: 2, w: 1 },
      { id: 'e2', u: 1, v: 3, w: 1 },
      { id: 'e3', u: 2, v: 4, w: 1 },
      { id: 'e4', u: 3, v: 4, w: 1 },
      { id: 'e5', u: 4, v: 5, w: 1 },
      { id: 'e6', u: 4, v: 6, w: 1 },
      { id: 'e7', u: 3, v: 6, w: 1 },
    ];
    return { nodes, edges };
  }

  const edges: GEdge[] = [
    { id: 'e1', u: 1, v: 2, w: 4 },
    { id: 'e2', u: 1, v: 3, w: 2 },
    { id: 'e3', u: 2, v: 3, w: 1 },
    { id: 'e4', u: 2, v: 4, w: 5 },
    { id: 'e5', u: 3, v: 4, w: 8 },
    { id: 'e6', u: 3, v: 6, w: 10 },
    { id: 'e7', u: 4, v: 5, w: 6 },
    { id: 'e8', u: 4, v: 6, w: 3 },
    { id: 'e9', u: 5, v: 6, w: 2 },
  ];
  return { nodes, edges };
}
