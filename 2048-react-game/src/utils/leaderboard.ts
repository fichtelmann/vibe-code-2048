import type { LeaderboardEntry } from '../types/game';

const STORAGE_KEY = '2048-leaderboard';
const MAX_ENTRIES = 10;

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LeaderboardEntry[];
  } catch {
    return [];
  }
}

export function addLeaderboardEntry(score: number): LeaderboardEntry[] {
  const entries = getLeaderboard();
  const date = new Date().toLocaleDateString();
  const updated = [...entries, { rank: 0, score, date }]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_ENTRIES)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable — silently skip persistence
  }
  return updated;
}
