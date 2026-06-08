# Commit: Score History Sidebar

**SHA**: 45e1ff7 | **Branch**: main | **Status**: Committed

## 1. Summary (8 files changed, 7 new/modified, 6 deleted)

Replaced the leaderboard popup and floating button with a persistent score history sidebar that shows all completed games in reverse-chronological order (newest first, capped at 20 entries).

**Files created**:
- `src/utils/scoreHistory.ts` — `getScoreHistory` / `addScoreHistoryEntry` with schema guard
- `src/utils/scoreHistory.test.ts` — 11 unit tests
- `src/components/ScoreHistorySidebar.tsx` — persistent sidebar panel
- `src/components/ScoreHistorySidebar.test.tsx` — 6 component tests

**Files modified**:
- `src/types/game.ts` — `LeaderboardEntry` → `ScoreHistoryEntry` (dropped `rank`)
- `src/components/Game.tsx` — removed popup/button, integrated sidebar
- `src/components/index.ts` — updated barrel exports
- `src/index.css` — added `.score-history-layout` + responsive media query

**Files deleted**: `LeaderboardButton.tsx/.test.tsx`, `LeaderboardPopup.tsx/.test.tsx`, `leaderboard.ts/.test.ts`

**Commit**: `feat: replace leaderboard popup with persistent score history sidebar`

## 2. Validation (Tests 33/33 | Quality Clean | Security Clean)

- **Tests**: 33/33 passing — 17 new (scoreHistory + ScoreHistorySidebar), 16 pre-existing (gameLogic)
- **Quality**: TypeScript strict clean, ESLint clean, no warnings
- **Security**: localStorage only; schema mismatch guard prevents injection of old data format

## 3. Changes Detail

**Behavioral changes**:
- Score history is always visible beside the board — no button click required
- History persists across page reloads via localStorage
- Old ranked leaderboard data (from prior sessions) is auto-cleared on first read due to schema change
- Game-over overlay no longer has a "Scores" button (sidebar is always visible)
- Sidebar stacks below the board on screens ≤640px

**Breaking changes**: localStorage key `2048-leaderboard` reused but format changed — existing saved scores are cleared on first load after upgrade

## 4. Completion

**PR**: Local commit only (on main)
**Next**: Ready to deploy / push to remote
