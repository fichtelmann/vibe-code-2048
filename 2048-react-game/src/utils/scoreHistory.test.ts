import { describe, it, expect, beforeEach } from 'vitest';
import { getScoreHistory, addScoreHistoryEntry } from './scoreHistory';

beforeEach(() => {
  localStorage.clear();
});

describe('getScoreHistory', () => {
  it('returns empty array when nothing stored', () => {
    expect(getScoreHistory()).toEqual([]);
  });

  it('returns stored entries in order', () => {
    const entries = [
      { score: 500, date: '6/1/2026' },
      { score: 200, date: '6/2/2026' },
    ];
    localStorage.setItem('2048-leaderboard', JSON.stringify(entries));
    expect(getScoreHistory()).toEqual(entries);
  });

  it('returns empty array on corrupted JSON', () => {
    localStorage.setItem('2048-leaderboard', 'not-json');
    expect(getScoreHistory()).toEqual([]);
  });

  it('clears and returns empty array on old ranked schema (has rank field)', () => {
    const oldSchema = [{ rank: 1, score: 500, date: '6/1/2026' }];
    localStorage.setItem('2048-leaderboard', JSON.stringify(oldSchema));
    const result = getScoreHistory();
    expect(result).toEqual([]);
    expect(localStorage.getItem('2048-leaderboard')).toBeNull();
  });

  it('returns empty array when stored value is not an array', () => {
    localStorage.setItem('2048-leaderboard', JSON.stringify({ score: 100 }));
    expect(getScoreHistory()).toEqual([]);
  });
});

describe('addScoreHistoryEntry', () => {
  it('adds an entry and returns it as the first element (newest first)', () => {
    const result = addScoreHistoryEntry(500);
    expect(result).toHaveLength(1);
    expect(result[0].score).toBe(500);
  });

  it('prepends new entries so newest is first', () => {
    addScoreHistoryEntry(100);
    addScoreHistoryEntry(500);
    const result = addScoreHistoryEntry(300);
    expect(result[0].score).toBe(300);
    expect(result[1].score).toBe(500);
    expect(result[2].score).toBe(100);
  });

  it('caps entries at 20', () => {
    for (let i = 0; i < 22; i++) {
      addScoreHistoryEntry(i * 100);
    }
    expect(getScoreHistory()).toHaveLength(20);
  });

  it('retains the 20 most recent entries when cap exceeded', () => {
    for (let i = 0; i < 22; i++) {
      addScoreHistoryEntry(i * 100);
    }
    const entries = getScoreHistory();
    // Most recent is score 2100 (i=21), oldest retained is score 200 (i=2)
    expect(entries[0].score).toBe(2100);
    expect(entries[19].score).toBe(200);
  });

  it('persists to localStorage', () => {
    addScoreHistoryEntry(999);
    const stored = getScoreHistory();
    expect(stored[0].score).toBe(999);
  });

  it('stores entries with a date string', () => {
    const result = addScoreHistoryEntry(42);
    expect(typeof result[0].date).toBe('string');
    expect(result[0].date.length).toBeGreaterThan(0);
  });
});
