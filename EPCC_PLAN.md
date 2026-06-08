# Plan: Score History Sidebar

**Created**: 2026-06-08 | **Effort**: ~4.5h | **Complexity**: Medium

## 1. Objective

**Goal**: Replace the existing leaderboard popup with a persistent sidebar panel that shows all previous game scores in reverse-chronological order.

**Why**: The popup required explicit user action to view scores; a persistent sidebar makes history glanceable without interrupting play.

**Success**:
- Sidebar is always visible beside the game board (responsive: stacks below on mobile)
- Every completed game (score > 0, game-over state) is recorded and shown in the sidebar
- Previous leaderboard popup and floating button are fully removed

---

## 2. Approach

**From EPCC_EXPLORE.md constraints to respect**:
- Inline styles only — no external CSS classes
- Arrow function components: `export const X = () => ...`
- Destructured imports
- localStorage for persistence (existing pattern)
- No router, no context, no state management library

**Data model change**: Current `leaderboard.ts` sorts by score descending, caps at 10. Score history needs reverse-chronological order, higher cap (20 entries), and no `rank` field.

- Rename type: `LeaderboardEntry` → `ScoreHistoryEntry` with fields `{ score: number; date: string }` (drop `rank`, it's derived from array index in the sidebar)
- Rename utility: `leaderboard.ts` → `scoreHistory.ts`, functions `getLeaderboard/addLeaderboardEntry` → `getScoreHistory/addScoreHistoryEntry`
- Keep same localStorage key (`'2048-leaderboard'`) to preserve existing scores across the change, OR clear gracefully (existing entries are sorted by score, not time — easiest to clear and start fresh; no user data loss because the game is purely local/recreational)

**Trade-off — localStorage key migration**: Keep existing key with a schema version flag vs. clear on first read vs. ignore mismatch and start fresh.
- **Decision**: Clear existing data silently on schema mismatch. The stored format changes (from ranked/sorted to chronological), re-reading old entries in wrong order would be confusing. Recreational data loss is acceptable.

**Layout**: `Game.tsx` currently uses a centered `flex-column`. New layout wraps the entire game column + sidebar in a `flex-row` with `gap`, centered on the page. Sidebar is fixed width `220px`. Below `640px` viewport, the row becomes a column (media query via inline style + `window.innerWidth` check is fragile — use a CSS class instead... but project uses inline styles only).

- **Trade-off — responsive layout**: Pure inline styles can't use media queries. Options: (a) use a `<style>` tag injected in `index.css`, (b) use a JS resize listener + state, (c) use a CSS class in `index.css`.
- **Decision**: Add a single responsive rule to `index.css` (already has global styles). A `.score-history-layout` class with a `@media` query keeps all responsive logic in one place without adding JS overhead.

**Integration**: `Game.tsx` already imports and calls `addLeaderboardEntry` / `getLeaderboard`. Update those imports to the new utility. Remove all popup/button state and JSX.

---

## 3. Tasks

### Phase 1: Data Layer (~1.25h)

1. **Update type definitions in `game.ts`** (0.25h)
   - Rename `LeaderboardEntry` → `ScoreHistoryEntry`, drop `rank`, keep `{ score: number; date: string }`
   - Deps: None | Risk: Low (type change will cause compile errors that guide all required updates)

2. **Rewrite `leaderboard.ts` → `scoreHistory.ts`** (0.5h)
   - `getScoreHistory(): ScoreHistoryEntry[]` — reads localStorage, returns reverse-chrono (newest first), gracefully handles parse errors and schema mismatch (clears corrupt data)
   - `addScoreHistoryEntry(score: number): ScoreHistoryEntry[]` — prepends new entry, caps at 20
   - Deps: Task 1 | Risk: Low

3. **Update/replace `leaderboard.test.ts` → `scoreHistory.test.ts`** (0.5h)
   - Cover: empty state, corrupt data, schema mismatch (old ranked format), add entry, cap at 20, order is newest-first
   - Deps: Task 2 | Risk: Low

### Phase 2: New Component (~1.5h)

4. **Create `ScoreHistorySidebar.tsx`** (1h)
   - Props: `{ entries: ScoreHistoryEntry[] }`
   - Renders a fixed-width `220px` panel with dark stone theme (match existing palette: `#2a2316` bg, `#c8b86a` title, `#3a3220` border, Courier New font)
   - Shows "no games yet" empty state
   - Shows entries as a scrollable list (max-height with `overflow-y: auto`): score + date per row
   - No interactivity needed (read-only)
   - Deps: Task 1 | Risk: Low

5. **Write `ScoreHistorySidebar.test.tsx`** (0.5h)
   - Tests: renders nothing-yet state, renders entries list, shows correct score/date values, handles 20 entries without crashing
   - Pattern: match `LeaderboardPopup.test.tsx` style (`render`, `screen`, `fireEvent`)
   - Deps: Task 4 | Risk: Low

### Phase 3: Layout & Integration (~1.25h)

6. **Add responsive layout class to `index.css`** (0.25h)
   - `.score-history-layout` — `display: flex; flex-direction: row; gap: 20px; align-items: flex-start`
   - `@media (max-width: 640px)` — `flex-direction: column; align-items: center`
   - Deps: None | Risk: Low

7. **Update `Game.tsx`** (0.75h)
   - Remove: `leaderboardOpen` state, `openLeaderboard`/`closeLeaderboard` callbacks, `setLeaderboard` state, `<LeaderboardButton>` and `<LeaderboardPopup>` JSX
   - Add: import `ScoreHistorySidebar`, import `getScoreHistory`/`addScoreHistoryEntry` from new utility
   - Change: wrap existing game column + `<ScoreHistorySidebar>` in a `<div className="score-history-layout">`
   - Update `useEffect` for score saving to use `addScoreHistoryEntry`
   - Deps: Tasks 2, 4, 6 | Risk: Medium — most changes in one file; game-over save logic must still work correctly

8. **Remove old files** (0.25h)
   - Delete `LeaderboardButton.tsx`, `LeaderboardButton.test.tsx`, `LeaderboardPopup.tsx`, `LeaderboardPopup.test.tsx`, `leaderboard.ts`, `leaderboard.test.ts`
   - Update `components/index.ts` barrel — remove old exports, add `ScoreHistorySidebar`
   - Deps: Task 7 complete | Risk: Low (compile errors will surface any missed references)

### Phase 4: Quality (~0.25h)

9. **Run typecheck + lint + tests** (0.25h)
   - `npm run typecheck` — must pass
   - `npm run lint` — must pass
   - `npx vitest run src/utils/scoreHistory.test.ts` then `npx vitest run src/components/ScoreHistorySidebar.test.tsx`
   - Deps: All prior tasks | Risk: Low

**Total**: ~4.5h

---

## 4. Quality Strategy

**Tests to write**:
- `src/utils/scoreHistory.test.ts` — unit tests for `getScoreHistory` and `addScoreHistoryEntry` (edge cases: empty, corrupt JSON, old schema format, cap at 20, reverse-chrono order)
- `src/components/ScoreHistorySidebar.test.tsx` — component tests: empty state, list render, entry count

**Tests to delete**: `leaderboard.test.ts`, `LeaderboardButton.test.tsx`, `LeaderboardPopup.test.tsx`

**Validation**:
- Sidebar visible beside board without requiring any button click
- Game over → new entry appears in sidebar immediately
- New game → previous entry still visible in sidebar
- 21+ games → oldest entry dropped (cap at 20)

---

## 5. Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Game-over save logic broken during `Game.tsx` refactor | M | Keep the `useEffect` logic identical, only change the utility import/function names |
| Inline-style layout breaks on narrow screens | M | CSS class + media query in `index.css` handles this cleanly |
| TypeScript rename cascade missed somewhere | L | Type errors at compile time will surface all callsites |

**Assumptions**:
- Score history entries per session: ≤ 20 is sufficient (recreational game, no persistent account)
- No animation needed for new entries appearing in sidebar
- Sidebar is read-only; no delete/clear functionality needed

**Out of scope**:
- Per-game statistics (max tile reached, number of moves)
- Export / share scores
- Clear history button
