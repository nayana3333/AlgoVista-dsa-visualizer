export type CellStatus = 'trying' | 'placed' | 'rejected' | 'backtrack' | 'solution';

export interface NQueenStep {
  board: number[];
  row: number;
  col: number;
  status: CellStatus;
  solutions: number;
  message: string;
}

export function* nQueens(n: number): Generator<NQueenStep> {
  const board = Array(n).fill(-1);
  let solutions = 0;

  function isSafe(row: number, col: number): boolean {
    for (let r = 0; r < row; r++) {
      const c = board[r];
      if (c === col || Math.abs(c - col) === Math.abs(r - row)) return false;
    }
    return true;
  }

  function* solve(row: number): Generator<NQueenStep> {
    if (row === n) {
      solutions++;
      yield { board: [...board], row: -1, col: -1, status: 'solution', solutions, message: `Solution #${solutions} found — every queen is safe.` };
      return;
    }
    for (let col = 0; col < n; col++) {
      yield { board: [...board], row, col, status: 'trying', solutions, message: `Row ${row}: try column ${col}.` };
      if (isSafe(row, col)) {
        board[row] = col;
        yield { board: [...board], row, col, status: 'placed', solutions, message: `Safe — place queen at (${row}, ${col}).` };
        yield* solve(row + 1);
        board[row] = -1;
        yield { board: [...board], row, col, status: 'backtrack', solutions, message: `Backtrack — remove queen from (${row}, ${col}).` };
      } else {
        yield { board: [...board], row, col, status: 'rejected', solutions, message: `Column ${col} or a diagonal is already attacked — skip.` };
      }
    }
  }

  yield { board: [...board], row: -1, col: -1, status: 'trying', solutions, message: `Place queens one row at a time on an ${n}×${n} board.` };
  yield* solve(0);
}

export const NQUEENS_PSEUDOCODE = [
  'solve(row):',
  '  if row == n: record solution; return',
  '  for col in 0..n:',
  '    if isSafe(row, col):',
  '      board[row] = col',
  '      solve(row + 1)',
  '      board[row] = -1   // backtrack',
];
