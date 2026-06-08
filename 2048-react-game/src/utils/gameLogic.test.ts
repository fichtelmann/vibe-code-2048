import { describe, it, expect } from 'vitest';
import {
  createEmptyBoard,
  addRandomTile,
  initBoard,
  move,
  hasWon,
  isGameOver,
} from './gameLogic';

describe('createEmptyBoard', () => {
  it('creates a 4x4 board of nulls', () => {
    const board = createEmptyBoard();
    expect(board).toHaveLength(4);
    board.forEach((row) => {
      expect(row).toHaveLength(4);
      row.forEach((cell) => expect(cell).toBeNull());
    });
  });
});

describe('addRandomTile', () => {
  it('adds exactly one tile to an empty board', () => {
    const board = addRandomTile(createEmptyBoard());
    const filled = board.flat().filter((v) => v !== null);
    expect(filled).toHaveLength(1);
    expect([2, 4]).toContain(filled[0]);
  });

  it('does not modify a full board', () => {
    const full = Array.from({ length: 4 }, () => Array(4).fill(2));
    const result = addRandomTile(full);
    expect(result).toEqual(full);
  });
});

describe('initBoard', () => {
  it('starts with exactly 2 tiles', () => {
    const board = initBoard();
    const count = board.flat().filter((v) => v !== null).length;
    expect(count).toBe(2);
  });
});

describe('move', () => {
  it('slides tiles left correctly', () => {
    const board = [
      [null, null, 2, 2],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const { board: result, score, moved } = move(board, 'left');
    expect(result[0][0]).toBe(4);
    expect(result[0][1]).toBeNull();
    expect(score).toBe(4);
    expect(moved).toBe(true);
  });

  it('slides tiles right correctly', () => {
    const board = [
      [2, 2, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const { board: result, score } = move(board, 'right');
    expect(result[0][3]).toBe(4);
    expect(result[0][2]).toBeNull();
    expect(score).toBe(4);
  });

  it('slides tiles up correctly', () => {
    const board = [
      [2, null, null, null],
      [2, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const { board: result, score } = move(board, 'up');
    expect(result[0][0]).toBe(4);
    expect(result[1][0]).toBeNull();
    expect(score).toBe(4);
  });

  it('slides tiles down correctly', () => {
    const board = [
      [null, null, null, null],
      [null, null, null, null],
      [2, null, null, null],
      [2, null, null, null],
    ];
    const { board: result, score } = move(board, 'down');
    expect(result[3][0]).toBe(4);
    expect(result[2][0]).toBeNull();
    expect(score).toBe(4);
  });

  it('does not merge tiles that already merged in the same move', () => {
    const board = [
      [2, 2, 2, 2],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const { board: result, score } = move(board, 'left');
    expect(result[0]).toEqual([4, 4, null, null]);
    expect(score).toBe(8);
  });

  it('returns moved=false when no tiles moved', () => {
    const board = [
      [2, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const { moved } = move(board, 'left');
    expect(moved).toBe(false);
  });

  it('accumulates score across multiple merges', () => {
    const board = [
      [2, 2, null, null],
      [4, 4, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    const { score } = move(board, 'left');
    expect(score).toBe(12);
  });
});

describe('hasWon', () => {
  it('returns true when 2048 tile exists', () => {
    const board = createEmptyBoard();
    board[0][0] = 2048;
    expect(hasWon(board)).toBe(true);
  });

  it('returns false when no 2048 tile', () => {
    const board = createEmptyBoard();
    board[0][0] = 1024;
    expect(hasWon(board)).toBe(false);
  });
});

describe('isGameOver', () => {
  it('returns false when empty cells exist', () => {
    expect(isGameOver(createEmptyBoard())).toBe(false);
  });

  it('returns false when merges are possible', () => {
    const board = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];
    board[3][3] = 2;
    board[3][2] = 2;
    expect(isGameOver(board)).toBe(false);
  });

  it('returns true when board is full with no merges possible', () => {
    const board = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];
    expect(isGameOver(board)).toBe(true);
  });
});
