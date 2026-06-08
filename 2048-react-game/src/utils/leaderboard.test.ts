import { describe, it, expect, beforeEach } from 'vitest';
import { getLeaderboard, addLeaderboardEntry } from './leaderboard';

beforeEach(() => {
  localStorage.clear();
});

describe('getLeaderboard', () => {
  it('returns empty array when nothing stored', () => {
    expect(getLeaderboard()).toEqual([]);
  });

  it('returns stored entries', () => {
    const entry = [{ rank: 1, score: 100, date: '6/1/2026' }];
    localStorage.setItem('2048-leaderboard', JSON.stringify(entry));
    expect(getLeaderboard()).toEqual(entry);
  });

  it('returns empty array on corrupted data', () => {
    localStorage.setItem('2048-leaderboard', 'not-json');
    expect(getLeaderboard()).toEqual([]);
  });
});

describe('addLeaderboardEntry', () => {
  it('adds an entry and returns sorted list with ranks', () => {
    const result = addLeaderboardEntry(500);
    expect(result).toHaveLength(1);
    expect(result[0].score).toBe(500);
    expect(result[0].rank).toBe(1);
  });

  it('sorts entries by score descending', () => {
    addLeaderboardEntry(100);
    addLeaderboardEntry(500);
    const result = addLeaderboardEntry(300);
    expect(result[0].score).toBe(500);
    expect(result[1].score).toBe(300);
    expect(result[2].score).toBe(100);
  });

  it('caps entries at 10', () => {
    for (let i = 0; i < 12; i++) {
      addLeaderboardEntry(i * 100);
    }
    expect(getLeaderboard()).toHaveLength(10);
  });

  it('persists to localStorage', () => {
    addLeaderboardEntry(999);
    const stored = getLeaderboard();
    expect(stored[0].score).toBe(999);
  });
});
