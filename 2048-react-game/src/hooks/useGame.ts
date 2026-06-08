import { useCallback, useEffect, useState } from 'react';
import type { GameState, Direction } from '../types/game';
import {
  initBoard,
  boardToAnimatedTiles,
  computeAnimatedMove,
  hasWon,
  isGameOver,
} from '../utils/gameLogic';

const BEST_SCORE_KEY = '2048-best-score';

function loadBestScore(): number {
  return parseInt(localStorage.getItem(BEST_SCORE_KEY) ?? '0', 10);
}

function saveBestScore(score: number): void {
  localStorage.setItem(BEST_SCORE_KEY, String(score));
}

function createInitialState(): GameState {
  const board = initBoard();
  return {
    board,
    tiles: boardToAnimatedTiles(board),
    score: 0,
    bestScore: loadBestScore(),
    gameOver: false,
    won: false,
    continueAfterWin: false,
  };
}

export function useGame() {
  const [state, setState] = useState<GameState>(createInitialState);

  const handleMove = useCallback((direction: Direction) => {
    setState((prev) => {
      if (prev.gameOver || (prev.won && !prev.continueAfterWin)) return prev;

      const result = computeAnimatedMove(prev.tiles, direction);
      if (!result) return prev;

      const { tiles, score: gained, newBoard } = result;
      const newScore = prev.score + gained;
      const newBest = Math.max(newScore, prev.bestScore);
      if (newBest > prev.bestScore) saveBestScore(newBest);

      const won = !prev.won && hasWon(newBoard);
      const gameOver = isGameOver(newBoard);

      return {
        ...prev,
        board: newBoard,
        tiles,
        score: newScore,
        bestScore: newBest,
        won: prev.won || won,
        gameOver,
      };
    });
  }, []);

  const newGame = useCallback(() => {
    setState((prev) => ({
      ...createInitialState(),
      bestScore: prev.bestScore,
    }));
  }, []);

  const continueGame = useCallback(() => {
    setState((prev) => ({ ...prev, continueAfterWin: true }));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        s: 'down',
        a: 'left',
        d: 'right',
      };
      const dir = map[e.key];
      if (dir) {
        e.preventDefault();
        handleMove(dir);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleMove]);

  return { state, handleMove, newGame, continueGame };
}
