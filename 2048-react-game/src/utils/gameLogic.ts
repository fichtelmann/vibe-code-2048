import type { Board, Direction, AnimatedTile } from '../types/game';

const SIZE = 4;

export function createEmptyBoard(): Board {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
}

export function addRandomTile(board: Board): Board {
  const empty: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === null) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return board;

  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const newBoard = board.map((row) => [...row]);
  newBoard[r][c] = Math.random() < 0.9 ? 2 : 4;
  return newBoard;
}

export function initBoard(): Board {
  let board = createEmptyBoard();
  board = addRandomTile(board);
  board = addRandomTile(board);
  return board;
}

function slideRow(row: (number | null)[]): { row: (number | null)[]; score: number } {
  const tiles = row.filter((v): v is number => v !== null);
  let score = 0;
  const merged: (number | null)[] = [];

  let i = 0;
  while (i < tiles.length) {
    if (i + 1 < tiles.length && tiles[i] === tiles[i + 1]) {
      const val = tiles[i] * 2;
      merged.push(val);
      score += val;
      i += 2;
    } else {
      merged.push(tiles[i]);
      i++;
    }
  }

  while (merged.length < SIZE) merged.push(null);
  return { row: merged, score };
}

export function move(board: Board, direction: Direction): { board: Board; score: number; moved: boolean } {
  let totalScore = 0;
  let newBoard = board.map((row) => [...row]);

  const rotateClockwise = (b: Board): Board =>
    Array.from({ length: SIZE }, (_, r) =>
      Array.from({ length: SIZE }, (__, c) => b[SIZE - 1 - c][r])
    );

  const rotateCounterClockwise = (b: Board): Board =>
    Array.from({ length: SIZE }, (_, r) =>
      Array.from({ length: SIZE }, (__, c) => b[c][SIZE - 1 - r])
    );

  if (direction === 'right') {
    newBoard = newBoard.map((row) => [...row].reverse());
  } else if (direction === 'up') {
    newBoard = rotateCounterClockwise(newBoard);
  } else if (direction === 'down') {
    newBoard = rotateClockwise(newBoard);
  }

  const resultBoard: Board = newBoard.map((row) => {
    const { row: slid, score } = slideRow(row);
    totalScore += score;
    return slid;
  });

  let finalBoard: Board = resultBoard;
  if (direction === 'right') {
    finalBoard = resultBoard.map((row) => [...row].reverse());
  } else if (direction === 'up') {
    finalBoard = rotateClockwise(resultBoard);
  } else if (direction === 'down') {
    finalBoard = rotateCounterClockwise(resultBoard);
  }

  const moved = JSON.stringify(finalBoard) !== JSON.stringify(board);
  return { board: finalBoard, score: totalScore, moved };
}

let nextId = 1;

/** Build an animated tile list from a board, marking all as new (for initial spawn). */
export function boardToAnimatedTiles(board: Board): AnimatedTile[] {
  const tiles: AnimatedTile[] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = board[r][c];
      if (v !== null) {
        tiles.push({ id: nextId++, value: v, row: r, col: c, isNew: true, isMerged: false });
      }
    }
  }
  return tiles;
}

/**
 * Compute the next animated tile list from the current tiles and move direction.
 * Returns null if no tile moved.
 */
export function computeAnimatedMove(
  tiles: AnimatedTile[],
  direction: Direction
): { tiles: AnimatedTile[]; score: number; newBoard: Board } | null {
  // Reconstruct board from tiles
  const board: Board = createEmptyBoard();
  for (const t of tiles) board[t.row][t.col] = t.value;

  const { board: movedBoard, score, moved } = move(board, direction);
  if (!moved) return null;

  // Build a map: position -> tile id (before move)
  const posToTile = new Map<string, AnimatedTile>();
  for (const t of tiles) posToTile.set(`${t.row},${t.col}`, t);

  // Track which source tiles have been consumed
  const consumed = new Set<number>();
  const nextTiles: AnimatedTile[] = [];

  // For each direction, we know how tiles slide. We replay the slide logic
  // per row/column to figure out source→destination mapping.
  const lineIndices = getLineIndices(direction);

  for (const line of lineIndices) {
    // Collect tiles along this line in slide order
    const lineTiles = line
      .map(([r, c]) => posToTile.get(`${r},${c}`) ?? null)
      .filter((t): t is AnimatedTile => t !== null);

    // Slide: merge pairs
    let i = 0;
    const destLine = getDestLine(direction, line);
    let destIdx = 0;

    while (i < lineTiles.length) {
      const dest = destLine[destIdx];
      if (i + 1 < lineTiles.length && lineTiles[i].value === lineTiles[i + 1].value) {
        // Merge: move both sources to dest, emit a merged tile with new id
        const merged: AnimatedTile = {
          id: nextId++,
          value: lineTiles[i].value * 2,
          row: dest[0],
          col: dest[1],
          isNew: false,
          isMerged: true,
        };
        // The two source tiles slide to dest first (they get overwritten by merged)
        consumed.add(lineTiles[i].id);
        consumed.add(lineTiles[i + 1].id);
        nextTiles.push(
          { ...lineTiles[i], row: dest[0], col: dest[1], isMerged: false, isNew: false },
          { ...lineTiles[i + 1], row: dest[0], col: dest[1], isMerged: false, isNew: false },
          merged,
        );
        i += 2;
      } else {
        nextTiles.push({ ...lineTiles[i], row: dest[0], col: dest[1], isMerged: false, isNew: false });
        consumed.add(lineTiles[i].id);
        i++;
      }
      destIdx++;
    }
  }

  // Add the new random tile
  const newBoard = addRandomTile(movedBoard);
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (movedBoard[r][c] === null && newBoard[r][c] !== null) {
        nextTiles.push({ id: nextId++, value: newBoard[r][c]!, row: r, col: c, isNew: true, isMerged: false });
      }
    }
  }

  return { tiles: nextTiles, score, newBoard };
}

/** Returns groups of [row,col] indices for each line in slide order (toward destination). */
function getLineIndices(direction: Direction): [number, number][][] {
  const lines: [number, number][][] = [];
  if (direction === 'left') {
    for (let r = 0; r < SIZE; r++) {
      lines.push(Array.from({ length: SIZE }, (_, c) => [r, c]));
    }
  } else if (direction === 'right') {
    for (let r = 0; r < SIZE; r++) {
      lines.push(Array.from({ length: SIZE }, (_, c) => [r, SIZE - 1 - c]));
    }
  } else if (direction === 'up') {
    for (let c = 0; c < SIZE; c++) {
      lines.push(Array.from({ length: SIZE }, (_, r) => [r, c]));
    }
  } else {
    for (let c = 0; c < SIZE; c++) {
      lines.push(Array.from({ length: SIZE }, (_, r) => [SIZE - 1 - r, c]));
    }
  }
  return lines;
}

/** Returns the destination positions for a line in order (first tile slot, second, ...). */
function getDestLine(direction: Direction, line: [number, number][]): [number, number][] {
  if (direction === 'left') {
    const r = line[0][0];
    return Array.from({ length: SIZE }, (_, c) => [r, c]);
  } else if (direction === 'right') {
    const r = line[0][0];
    return Array.from({ length: SIZE }, (_, c) => [r, SIZE - 1 - c]);
  } else if (direction === 'up') {
    const col = line[0][1];
    return Array.from({ length: SIZE }, (_, r) => [r, col]);
  } else {
    const col = line[0][1];
    return Array.from({ length: SIZE }, (_, r) => [SIZE - 1 - r, col]);
  }
}

export function hasWon(board: Board): boolean {
  return board.some((row) => row.some((cell) => cell === 2048));
}

export function isGameOver(board: Board): boolean {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === null) return false;
      if (c + 1 < SIZE && board[r][c] === board[r][c + 1]) return false;
      if (r + 1 < SIZE && board[r][c] === board[r + 1][c]) return false;
    }
  }
  return true;
}
