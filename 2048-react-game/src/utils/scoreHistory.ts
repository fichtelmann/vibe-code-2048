import type { ScoreHistoryEntry } from '../types/game';

const STORAGE_KEY = '2048-leaderboard';
const MAX_ENTRIES = 20;

export const getScoreHistory = (): ScoreHistoryEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown[];
    if (!Array.isArray(parsed)) return [];
    // Validate each entry has the expected shape; clear on schema mismatch
    const valid = parsed.every(
      (e) =>
        e !== null &&
        typeof e === 'object' &&
        typeof (e as Record<string, unknown>).score === 'number' &&
        typeof (e as Record<string, unknown>).date === 'string' &&
        !('rank' in (e as Record<string, unknown>))
    );
    if (!valid) {
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }
    return parsed as ScoreHistoryEntry[];
  } catch {
    return [];
  }
};

export const addScoreHistoryEntry = (score: number): ScoreHistoryEntry[] => {
  const entries = getScoreHistory();
  const date = new Date().toLocaleDateString();
  const updated = [{ score, date }, ...entries].slice(0, MAX_ENTRIES);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable — silently skip persistence
  }
  return updated;
};
