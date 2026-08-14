import { useEffect, useMemo, useState } from 'react';
import {
  GRAPH_ALGORITHMS,
  dijkstra,
  prim,
  kruskal,
  floydWarshall,
  topologicalSort,
  type GEdge,
  type GNode,
  type GraphStep,
} from '../algorithms/graph';
import { makePreset } from '../data/graphPresets';
import { GraphCanvas, type CanvasMode } from '../components/GraphCanvas';
import { PageHeader, Panel, Button, Select, ComplexityPanel, PseudocodePanel } from '../components/ui';
import { PlaybackControls } from '../components/PlaybackControls';
import { usePlayback } from '../hooks/usePlayback';

const emptyStep = (nodes: GNode[]): GraphStep => ({
  visited: [],
  active: [],
  consideredEdge: null,
  acceptedEdges: [],
  rejectedEdges: [],
  dist: Object.fromEntries(nodes.map((n) => [n.id, Infinity])),
  order: [],
  message: 'Ready. Press play to begin.',
});

let nodeCounter = 100;
let edgeCounter = 100;

export function GraphPage() {
  const [algoId, setAlgoId] = useState('dijkstra');
  const algo = GRAPH_ALGORITHMS.find((a) => a.id === algoId)!;

  const [directed, setDirected] = useState(false);
  const [nodes, setNodes] = useState<GNode[]>(() => makePreset('undirected').nodes);
  const [edges, setEdges] = useState<GEdge[]>(() => makePreset('undirected').edges);
  const [source, setSource] = useState<number | null>(nodes[0]?.id ?? null);
  const [mode, setMode] = useState<CanvasMode>('connect');

  useEffect(() => {
    if (algo.directed !== directed) {
      const preset = algo.directed ? makePreset('dag') : makePreset('undirected');
      setNodes(preset.nodes);
      setEdges(preset.edges);
      setDirected(algo.directed);
      setSource(preset.nodes[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algoId]);

  const steps = useMemo<GraphStep[]>(() => {
    const result: GraphStep[] = [emptyStep(nodes)];
    if (nodes.length === 0) return result;
    const src = source ?? nodes[0].id;
    let gen: Generator<GraphStep>;
    switch (algo.id) {
      case 'dijkstra':
        gen = dijkstra(nodes, edges, src);
        break;
      case 'prim':
        gen = prim(nodes, edges, src);
        break;
      case 'kruskal':
        gen = kruskal(nodes, edges);
        break;
      case 'floyd':
        gen = floydWarshall(nodes, edges);
        break;
      default:
        gen = topologicalSort(nodes, edges);
    }
    for (const s of gen) result.push(s);
    return result;
  }, [algo.id, nodes, edges, source]);

  const playback = usePlayback(steps, 55);

  useEffect(() => {
    playback.reset(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algo.id, nodes, edges, source]);

  const step = playback.current ?? steps[0];

  function resetPreset() {
    const preset = algo.directed ? makePreset('dag') : makePreset('undirected');
    setNodes(preset.nodes);
    setEdges(preset.edges);
    setSource(preset.nodes[0].id);
  }

  function addNode(x: number, y: number) {
    nodeCounter++;
    const label = String.fromCharCode(65 + (nodes.length % 26));
    setNodes((prev) => [...prev, { id: nodeCounter, x, y, label }]);
  }

  function addEdge(u: number, v: number) {
    if (u === v) return;
    if (edges.some((e) => (e.u === u && e.v === v) || (!directed && e.u === v && e.v === u))) return;
    edgeCounter++;
    const w = Math.floor(Math.random() * 12) + 1;
    setEdges((prev) => [...prev, { id: `e${edgeCounter}`, u, v, w }]);
  }

  function removeNode(id: number) {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.u !== id && e.v !== id));
    if (source === id) setSource(null);
  }

  function removeEdge(id: string) {
    setEdges((prev) => prev.filter((e) => e.id !== id));
  }

  function moveNode(id: number, x: number, y: number) {
    setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, x, y } : n)));
  }

  function setWeight(id: string, w: number) {
    setEdges((prev) => prev.map((e) => (e.id === id ? { ...e, w } : e)));
  }

  return (
    <div>
      <PageHeader
        eyebrow="Graphs & greedy algorithms"
        title="Graph Algorithms"
        description="Build your own weighted graph — add nodes, connect edges, drag to rearrange — then watch shortest-path, spanning-tree, and ordering algorithms run on it."
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 pb-24 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Panel className="p-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <ToolButton active={mode === 'connect'} onClick={() => setMode('connect')} label="🔗 Connect / Drag" />
              <ToolButton active={mode === 'add'} onClick={() => setMode('add')} label="➕ Add Node" />
              <ToolButton active={mode === 'erase'} onClick={() => setMode('erase')} label="🗑 Erase" />
              <div className="ml-auto flex gap-2">
                <Button variant="secondary" onClick={resetPreset}>
                  ↺ Reset graph
                </Button>
              </div>
            </div>
            <GraphCanvas
              nodes={nodes}
              edges={edges}
              directed={directed}
              step={step}
              mode={mode}
              source={algo.needsSource ? source : null}
              onAddNode={addNode}
              onAddEdge={addEdge}
              onRemoveNode={removeNode}
              onRemoveEdge={removeEdge}
              onMoveNode={moveNode}
              onSetWeight={setWeight}
            />
            <p className="mt-3 text-xs text-muted">
              {mode === 'connect' && 'Click a node then another to connect them (double-click an edge weight to edit it). Drag nodes to rearrange.'}
              {mode === 'add' && 'Click anywhere on empty canvas to place a new node.'}
              {mode === 'erase' && 'Click a node or edge to remove it.'}
            </p>
          </Panel>

          <Panel className="p-5">
            <PlaybackControls
              isPlaying={playback.isPlaying}
              index={playback.index}
              total={playback.total}
              speed={playback.speed}
              onPlay={playback.play}
              onPause={playback.pause}
              onStepBack={playback.stepBack}
              onStepForward={playback.stepForward}
              onReset={() => playback.reset(0)}
              onSpeedChange={playback.setSpeed}
              onScrub={playback.setIndex}
            />
          </Panel>

          <Panel className="p-4 font-mono text-sm text-primary-2">{step.message}</Panel>

          <ResultsPanel algoId={algo.id} nodes={nodes} step={step} edges={edges} />
        </div>

        <div className="space-y-4">
          <Panel className="p-5">
            <Select label="Algorithm" value={algoId} onChange={(e) => setAlgoId(e.target.value)}>
              {GRAPH_ALGORITHMS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </Select>

            {algo.needsSource && (
              <Select
                label="Start node"
                className="mt-4"
                value={source ?? ''}
                onChange={(e) => setSource(Number(e.target.value))}
              >
                {nodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label}
                  </option>
                ))}
              </Select>
            )}

            <p className="mt-4 text-xs text-muted">
              {directed ? 'Directed graph mode' : 'Undirected graph mode'} · {nodes.length} nodes · {edges.length} edges
            </p>
          </Panel>

          <ComplexityPanel rows={[{ label: 'Time', value: algo.time }, { label: 'Space', value: algo.space }]} />
          <PseudocodePanel title="Pseudocode" lines={algo.pseudocode} />
        </div>
      </div>
    </div>
  );
}

function ToolButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
        active ? 'bg-primary text-white' : 'border border-border bg-surface-2 text-muted hover:text-ink'
      }`}
    >
      {label}
    </button>
  );
}

function ResultsPanel({
  algoId,
  nodes,
  step,
  edges,
}: {
  algoId: string;
  nodes: GNode[];
  step: GraphStep;
  edges: GEdge[];
}) {
  if (algoId === 'dijkstra') {
    return (
      <Panel className="p-5">
        <h3 className="mb-3 text-sm font-semibold text-ink">Shortest distances</h3>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {nodes.map((n) => (
            <div key={n.id} className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-center">
              <div className="text-xs text-muted">{n.label}</div>
              <div className="font-mono text-sm font-semibold text-ink">
                {step.dist[n.id] === Infinity ? '∞' : step.dist[n.id]}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    );
  }

  if (algoId === 'prim' || algoId === 'kruskal') {
    const accepted = edges.filter((e) => step.acceptedEdges.includes(e.id));
    const total = accepted.reduce((s, e) => s + e.w, 0);
    return (
      <Panel className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink">MST edges</h3>
          <span className="font-mono text-xs text-primary-2">total weight: {total}</span>
        </div>
        {accepted.length === 0 ? (
          <p className="text-sm text-muted">No edges accepted yet.</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {accepted.map((e) => {
              const u = nodes.find((n) => n.id === e.u)?.label;
              const v = nodes.find((n) => n.id === e.v)?.label;
              return (
                <li key={e.id} className="rounded-full border border-success/30 bg-success/10 px-3 py-1 font-mono text-xs text-success">
                  {u}–{v} ({e.w})
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    );
  }

  if (algoId === 'floyd') {
    const matrix = step.matrix ?? [];
    return (
      <Panel className="p-5">
        <h3 className="mb-3 text-sm font-semibold text-ink">All-pairs distance matrix</h3>
        <div className="overflow-x-auto">
          <table className="border-collapse font-mono text-xs">
            <thead>
              <tr>
                <th className="w-8 p-1.5" />
                {nodes.map((n) => (
                  <th key={n.id} className="w-9 p-1.5 text-center text-muted">
                    {n.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, i) => (
                <tr key={nodes[i]?.id ?? i}>
                  <td className="p-1.5 text-center text-muted">{nodes[i]?.label}</td>
                  {row.map((v, j) => (
                    <td
                      key={j}
                      className={`w-9 rounded p-1.5 text-center ${
                        i === j ? 'text-muted' : 'text-ink'
                      } ${step.active?.[0] === nodes[i]?.id && step.active?.[1] === nodes[j]?.id ? 'bg-primary/20' : ''}`}
                    >
                      {v === Infinity ? '∞' : v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    );
  }

  return (
    <Panel className="p-5">
      <h3 className="mb-3 text-sm font-semibold text-ink">Topological order</h3>
      {step.order.length === 0 ? (
        <p className="text-sm text-muted">No nodes ordered yet.</p>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          {step.order.map((id, i) => (
            <span key={id} className="flex items-center gap-2">
              <span className="rounded-full border border-primary-2/30 bg-primary-2/10 px-3 py-1 font-mono text-xs text-primary-2">
                {nodes.find((n) => n.id === id)?.label}
              </span>
              {i < step.order.length - 1 && <span className="text-muted">→</span>}
            </span>
          ))}
        </div>
      )}
    </Panel>
  );
}
