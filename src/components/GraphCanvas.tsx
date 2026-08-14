import { useRef, useState } from 'react';
import type { GEdge, GNode, GraphStep } from '../algorithms/graph';

export type CanvasMode = 'connect' | 'add' | 'erase';

const VB_W = 640;
const VB_H = 380;

export function GraphCanvas({
  nodes,
  edges,
  directed,
  step,
  mode,
  source,
  onAddNode,
  onAddEdge,
  onRemoveNode,
  onRemoveEdge,
  onMoveNode,
  onSetWeight,
}: {
  nodes: GNode[];
  edges: GEdge[];
  directed: boolean;
  step: GraphStep;
  mode: CanvasMode;
  source: number | null;
  onAddNode: (x: number, y: number) => void;
  onAddEdge: (u: number, v: number) => void;
  onRemoveNode: (id: number) => void;
  onRemoveEdge: (id: string) => void;
  onMoveNode: (id: number, x: number, y: number) => void;
  onSetWeight: (id: string, w: number) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pending, setPending] = useState<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [editingEdge, setEditingEdge] = useState<string | null>(null);

  function toSvgPoint(clientX: number, clientY: number) {
    const svg = svgRef.current!;
    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * VB_W;
    const y = ((clientY - rect.top) / rect.height) * VB_H;
    return { x, y };
  }

  function handleCanvasClick(e: React.MouseEvent<SVGSVGElement>) {
    if (mode !== 'add') return;
    if ((e.target as SVGElement).dataset.hit) return;
    const { x, y } = toSvgPoint(e.clientX, e.clientY);
    onAddNode(Math.min(Math.max(x, 30), VB_W - 30), Math.min(Math.max(y, 30), VB_H - 30));
  }

  function handleNodeClick(id: number) {
    if (mode === 'erase') {
      onRemoveNode(id);
      return;
    }
    if (mode !== 'connect') return;
    if (pending === null) {
      setPending(id);
    } else if (pending === id) {
      setPending(null);
    } else {
      onAddEdge(pending, id);
      setPending(null);
    }
  }

  function handlePointerDown(id: number, e: React.PointerEvent) {
    if (mode !== 'connect') return;
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    setDragging(id);
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (dragging === null) return;
    const { x, y } = toSvgPoint(e.clientX, e.clientY);
    onMoveNode(dragging, Math.min(Math.max(x, 24), VB_W - 24), Math.min(Math.max(y, 24), VB_H - 24));
  }

  function handlePointerUp() {
    setDragging(null);
  }

  const isAccepted = (id: string) => step.acceptedEdges.includes(id);
  const isRejected = (id: string) => step.rejectedEdges.includes(id);
  const isConsidered = (id: string) => step.consideredEdge === id;

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className={`w-full select-none rounded-xl bg-[#f5e8de] ${mode === 'add' ? 'cursor-crosshair' : 'cursor-default'}`}
        onClick={handleCanvasClick}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#a4897d" />
          </marker>
          <marker id="arrow-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#4f7d72" />
          </marker>
        </defs>

        {edges.map((e) => {
          const u = nodes.find((n) => n.id === e.u)!;
          const v = nodes.find((n) => n.id === e.v)!;
          if (!u || !v) return null;
          const dx = v.x - u.x;
          const dy = v.y - u.y;
          const len = Math.hypot(dx, dy) || 1;
          const nx = u.x + (dx / len) * 24;
          const ny = u.y + (dy / len) * 24;
          const fx = v.x - (dx / len) * 26;
          const fy = v.y - (dy / len) * 26;
          const mx = (u.x + v.x) / 2;
          const my = (u.y + v.y) / 2;

          const color = isAccepted(e.id)
            ? '#437a52'
            : isConsidered(e.id)
              ? '#4f7d72'
              : isRejected(e.id)
                ? '#af4834'
                : 'rgba(54,42,38,0.28)';
          const width = isAccepted(e.id) || isConsidered(e.id) ? 3 : 1.75;

          return (
            <g key={e.id}>
              <line
                data-hit="1"
                x1={nx}
                y1={ny}
                x2={fx}
                y2={fy}
                stroke={color}
                strokeWidth={width}
                strokeDasharray={isRejected(e.id) ? '5 4' : undefined}
                markerEnd={directed ? (isConsidered(e.id) || isAccepted(e.id) ? 'url(#arrow-accent)' : 'url(#arrow)') : undefined}
                className={mode === 'erase' ? 'cursor-pointer' : ''}
                onClick={(ev) => {
                  if (mode === 'erase') {
                    ev.stopPropagation();
                    onRemoveEdge(e.id);
                  }
                }}
              />
              <line data-hit="1" x1={nx} y1={ny} x2={fx} y2={fy} stroke="transparent" strokeWidth={14} className={mode === 'erase' ? 'cursor-pointer' : ''} onClick={(ev) => {
                if (mode === 'erase') {
                  ev.stopPropagation();
                  onRemoveEdge(e.id);
                }
              }} />
              {!directed && (
                <g
                  transform={`translate(${mx}, ${my})`}
                  onDoubleClick={(ev) => {
                    ev.stopPropagation();
                    setEditingEdge(e.id);
                  }}
                  className="cursor-pointer"
                >
                  <rect x={-14} y={-11} width={28} height={20} rx={6} fill="#fffbf8" stroke="#ecdcd3" />
                  <text textAnchor="middle" dy="4" fontSize="11" fontFamily="ui-monospace, monospace" fill="#362a26">
                    {e.w}
                  </text>
                </g>
              )}
              {editingEdge === e.id && (
                <foreignObject x={mx - 22} y={my - 14} width={44} height={28}>
                  <input
                    autoFocus
                    type="number"
                    defaultValue={e.w}
                    className="h-full w-full rounded border border-primary bg-white text-center text-xs text-ink outline-none"
                    onBlur={(ev) => {
                      onSetWeight(e.id, Number(ev.target.value) || 1);
                      setEditingEdge(null);
                    }}
                    onKeyDown={(ev) => {
                      if (ev.key === 'Enter') (ev.target as HTMLInputElement).blur();
                    }}
                  />
                </foreignObject>
              )}
            </g>
          );
        })}

        {nodes.map((n) => {
          const isVisited = step.visited.includes(n.id);
          const isActive = step.active.includes(n.id);
          const isPivot = step.pivot === n.id;
          const isSource = source === n.id;
          const isPending = pending === n.id;

          const fill = isActive
            ? '#b04f6f'
            : isPivot
              ? '#946820'
              : isVisited
                ? '#437a52'
                : isSource
                  ? '#8b5d7a'
                  : '#fffbf8';
          const stroke = isPending ? '#4f7d72' : '#c9b2a4';

          return (
            <g
              key={n.id}
              transform={`translate(${n.x}, ${n.y})`}
              onPointerDown={(e) => handlePointerDown(n.id, e)}
              onClick={(e) => {
                e.stopPropagation();
                handleNodeClick(n.id);
              }}
              className="cursor-pointer"
            >
              {isActive && <circle r={24} fill="none" stroke="#c15b7c" strokeWidth={2} opacity={0.45} />}
              <circle r={20} fill={fill} stroke={stroke} strokeWidth={isPending ? 2.5 : 1.5} />
              <text
                textAnchor="middle"
                dy="5"
                fontSize="13"
                fontWeight={600}
                fontFamily="ui-monospace, monospace"
                fill={isActive || isVisited || isSource || isPivot ? '#fffbf8' : '#362a26'}
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
