export type Board = (number | null)[][];

export interface AnimatedTile {
  id: number;
  value: number;
  row: number;
  col: number;
  isNew: boolean;
  isMerged: boolean;
}

export interface ScoreHistoryEntry {
  score: number;
  date: string;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface GameState {
  board: Board;
  tiles: AnimatedTile[];
  score: number;
  bestScore: number;
  gameOver: boolean;
  won: boolean;
  continueAfterWin: boolean;
}
