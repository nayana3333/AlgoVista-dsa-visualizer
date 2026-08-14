import { describe, expect, it } from 'vitest';
import { nQueens } from './nqueens';

function solve(n: number) {
  let last;
  let solutions = 0;
  const boards: number[][] = [];
  for (const step of nQueens(n)) {
    last = step;
    if (step.status === 'solution') {
      solutions++;
      boards.push(step.board);
    }
  }
  return { last: last!, solutions, boards };
}

function isValidBoard(board: number[]): boolean {
  const n = board.length;
  for (let r1 = 0; r1 < n; r1++) {
    for (let r2 = r1 + 1; r2 < n; r2++) {
      if (board[r1] === board[r2]) return false;
      if (Math.abs(board[r1] - board[r2]) === r2 - r1) return false;
    }
  }
  return true;
}

describe('nQueens', () => {
  // Known solution counts, OEIS A000170.
  const known: Record<number, number> = { 4: 2, 5: 10, 6: 4, 7: 40, 8: 92 };

  for (const [n, expected] of Object.entries(known)) {
    it(`finds exactly ${expected} solutions for n=${n}`, () => {
      const { solutions } = solve(Number(n));
      expect(solutions).toBe(expected);
    });
  }

  it('every reported solution is actually conflict-free', () => {
    const { boards } = solve(6);
    expect(boards.length).toBeGreaterThan(0);
    for (const board of boards) {
      expect(isValidBoard(board)).toBe(true);
    }
  });

  it('reports 0 solutions for the unsolvable n=3 case', () => {
    const { solutions } = solve(3);
    expect(solutions).toBe(0);
  });
});
