# Implementation: Score History Sidebar

**Mode**: default | **Date**: 2026-06-08 | **Status**: Complete

## 1. Changes (7 files created/modified, 3 deleted, +221 -62 lines, 33 tests passing)

**Created**:
- `src/utils/scoreHistory.ts` — `getScoreHistory` / `addScoreHistoryEntry` (reverse-chrono, cap 20, schema guard)
- `src/utils/scoreHistory.test.ts` — 11 unit tests covering empty, corrupt, old schema, cap, order, persistence
- `src/components/ScoreHistorySidebar.tsx` — persistent 220px panel with stone theme, empty state, scrollable list
- `src/components/ScoreHistorySidebar.test.tsx` — 6 component tests

**Modified**:
- `src/types/game.ts` — `LeaderboardEntry` → `ScoreHistoryEntry` (dropped `rank`)
- `src/components/Game.tsx` — removed popup/button state; wired sidebar and `addScoreHistoryEntry`
- `src/components/index.ts` — updated barrel exports
- `src/index.css` — added `.score-history-layout` + `@media (max-width: 640px)` responsive rule

**Deleted**: `LeaderboardButton.tsx/.test.tsx`, `LeaderboardPopup.tsx/.test.tsx`, `leaderboard.ts/.test.ts`

## 2. Quality (Tests 33/33 | Typecheck clean | Lint clean)

- **scoreHistory.ts**: 11 unit tests — empty state, JSON corruption, old ranked schema mismatch (auto-clears localStorage), 20-entry cap, newest-first ordering, date field presence
- **ScoreHistorySidebar.tsx**: 6 component tests — heading, empty state, scores rendered, dates rendered, no empty-state when entries present, 20-entry render without crash
- **gameLogic.ts** (pre-existing): 16 tests — all still passing, no regressions

## 3. Decisions

**Schema migration**: Old `LeaderboardEntry` records (which had a `rank` field) are auto-cleared on first read via the `valid` check in `getScoreHistory`. Clean start preferred over awkward migration of sorted-by-score data into reverse-chrono display.

**Responsive layout via CSS class**: Used `.score-history-layout` in `index.css` rather than a JS resize listener. Inline styles can't use `@media` queries; a single class rule is the minimal-complexity solution that keeps all responsive behavior declarative.

**Game-over overlay**: Removed the "Scores" button from the game-over overlay (it previously opened the leaderboard popup). The sidebar is always visible, so no shortcut is needed — the score appears there automatically on game over.

## 4. Handoff

**Run**: `/epcc-commit` when ready
**Blockers**: None
**TODOs**: None — all plan tasks complete
