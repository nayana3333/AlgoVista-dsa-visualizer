import { describe, expect, it } from 'vitest';
import { dijkstra, prim, kruskal, floydWarshall, topologicalSort } from './graph';
import { makePreset } from '../data/graphPresets';

function lastStep<T>(gen: Generator<T>): T {
  let last: T;
  for (const step of gen) last = step;
  return last!;
}

describe('dijkstra', () => {
  const { nodes, edges } = makePreset('undirected');

  it('computes correct shortest distances from A', () => {
    const result = lastStep(dijkstra(nodes, edges, 1));
    expect(result.dist).toEqual({ 1: 0, 2: 3, 3: 2, 4: 8, 5: 13, 6: 11 });
  });
});

describe('prim', () => {
  const { nodes, edges } = makePreset('undirected');

  it('builds a spanning tree with n-1 edges and minimum total weight', () => {
    const result = lastStep(prim(nodes, edges, 1));
    expect(result.acceptedEdges).toHaveLength(nodes.length - 1);
    const total = result.acceptedEdges.reduce((sum, id) => sum + edges.find((e) => e.id === id)!.w, 0);
    expect(total).toBe(13);
  });
});

describe('kruskal', () => {
  const { nodes, edges } = makePreset('undirected');

  it('builds a spanning tree with the same minimum weight as prim', () => {
    const result = lastStep(kruskal(nodes, edges));
    expect(result.acceptedEdges).toHaveLength(nodes.length - 1);
    const total = result.acceptedEdges.reduce((sum, id) => sum + edges.find((e) => e.id === id)!.w, 0);
    expect(total).toBe(13);
  });
});

describe('floydWarshall', () => {
  const { nodes, edges } = makePreset('undirected');

  it('agrees with dijkstra on shortest distances from A', () => {
    const result = lastStep(floydWarshall(nodes, edges));
    const rowA = result.matrix![0];
    expect(rowA).toEqual([0, 3, 2, 8, 13, 11]);
  });

  it('produces a symmetric matrix with a zero diagonal', () => {
    const result = lastStep(floydWarshall(nodes, edges));
    const m = result.matrix!;
    for (let i = 0; i < m.length; i++) {
      expect(m[i][i]).toBe(0);
      for (let j = 0; j < m.length; j++) {
        expect(m[i][j]).toBe(m[j][i]);
      }
    }
  });
});

describe('topologicalSort', () => {
  const { nodes, edges } = makePreset('dag');

  it('produces an order where every edge points forward', () => {
    const result = lastStep(topologicalSort(nodes, edges));
    expect(result.order).toHaveLength(nodes.length);
    const position = new Map(result.order.map((id, i) => [id, i]));
    for (const e of edges) {
      expect(position.get(e.u)!).toBeLessThan(position.get(e.v)!);
    }
  });
});
