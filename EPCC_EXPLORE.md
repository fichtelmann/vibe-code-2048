# Exploration: 2048 React Game

**Date**: 2026-06-08 | **Scope**: Medium | **Status**: ✅ Complete

## 1. Foundation (What exists)

**Tech stack**: React 19, TypeScript ~6.0 (strict), Vite 8, Vitest 4 + jsdom, @testing-library/react 16, ESLint 10

**Architecture**: React SPA with a single-concern hook (`useGame`) managing all game state, pure utility functions for game logic, and presentational components.

**Entry points**:
- `index.html` → `src/main.tsx` → `src/App.tsx` → `src/components/Game.tsx`
- `App.tsx` is a thin wrapper that renders `<Game />`

**Key directories**:
- `src/components/` — 6 components: `Game`, `Board`, `Tile`, `ScoreBox`, `LeaderboardButton`, `LeaderboardPopup`
- `src/hooks/` — `useGame.ts` (single hook, owns all game state)
- `src/utils/` — `gameLogic.ts`, `leaderboard.ts` (pure functions, fully tested)
- `src/types/` — `game.ts` (shared types: `Board`, `AnimatedTile`, `LeaderboardEntry`, `Direction`, `GameState`)

**CLAUDE.md requirements**:
- TypeScript strict mode — mandatory
- Airbnb style guide + Prettier formatting
- Destructured imports: `import { useState } from 'react'`
- Arrow functions for components and utilities
- Error handling in all async functions
- Run `typecheck` after code changes
- Write unit tests for ALL new components and utilities
- Update documentation when adding new features
- Dev server: port 3000, allow `https://*.cloudfront.net/` (already configured in `vite.config.ts`)

## 2. Patterns (How it's built)

**Architectural patterns**:

- **Custom hook owns state**: `useGame` (`src/hooks/useGame.ts:34`) returns `{ state, handleMove, newGame, continueGame }`. All game logic (keyboard events, score persistence, win/game-over detection) lives here. Components receive callbacks, never mutate state directly.

- **Pure utility functions**: `gameLogic.ts` exports stateless functions (`createEmptyBoard`, `addRandomTile`, `move`, `computeAnimatedMove`, `hasWon`, `isGameOver`). Only exception: module-level mutable `nextId` counter for tile IDs.

- **Animated tile model**: Game state tracks `AnimatedTile[]` (with `id`, `isNew`, `isMerged` flags) rather than a raw board matrix, enabling CSS animations per tile without React key recycling.

- **Inline styles**: All components use inline style objects with a shared `MONO` constant (`fontFamily: '"Courier New"...'`). No CSS framework. `App.css` is leftover Vite scaffolding (unused in the game).

- **Barrel export**: `src/components/index.ts` re-exports all 6 components.

**Testing patterns**:
- Framework: Vitest + `@testing-library/react` (jsdom), globals enabled
- Setup: `src/test-setup.ts` imports `@testing-library/jest-dom`
- `describe/it/expect` pattern throughout; `vi.fn()` for mocks
- `beforeEach(() => localStorage.clear())` in leaderboard tests
- Component tests use `render`, `screen`, `fireEvent` — no `userEvent` async pattern yet

**Error handling**:
- `getLeaderboard` wraps `JSON.parse` in try/catch returning `[]` on failure
- `addLeaderboardEntry` wraps `localStorage.setItem` in try/catch (silently skips)
- No async functions in the codebase currently

## 3. Constraints (What limits decisions)

**Technical**:
- Board is hardcoded 4×4 (`const SIZE = 4` in `gameLogic.ts:3` and `Board.tsx:8`)
- Tile dimensions are hardcoded constants in `Board.tsx`: `CELL=96`, `GAP=10`, `PADDING=14`
- `nextId` in `gameLogic.ts:94` is module-level state — resets only on page reload, not `newGame`
- localStorage keys: `'2048-best-score'`, `'2048-leaderboard'` (max 10 entries)

**Quality**:
- TypeScript strict mode — no implicit `any`, all types must be explicit
- ESLint with `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`
- Must write unit tests for all new components/utilities (per CLAUDE.md)
- Run `npm run typecheck` after every code change

**Security**: No backend; no auth; localStorage only. No input validation risks beyond game moves.

**Operational**:
- Dev: `npm run dev` (port 3000)
- Build: `tsc -b && vite build`
- Test: `vitest run` (single run, not watch)
- Lint: `eslint .`
- Typecheck: `tsc --noEmit`

## 4. Reusability (What to leverage)

**Test coverage gaps** — files with NO tests:
- `src/components/Board.tsx` — no test
- `src/components/Tile.tsx` — no test
- `src/components/ScoreBox.tsx` — no test
- `src/components/Game.tsx` — no test (complex: keyboard, touch, overlay logic)
- `src/hooks/useGame.ts` — no test
- `src/App.tsx` — no test

**Covered**:
- `src/utils/gameLogic.ts` — comprehensive (createEmptyBoard, addRandomTile, initBoard, move × 6 cases, hasWon, isGameOver)
- `src/utils/leaderboard.ts` — comprehensive (getLeaderboard × 3, addLeaderboardEntry × 4)
- `src/components/LeaderboardButton.tsx` — 2 tests
- `src/components/LeaderboardPopup.tsx` — 6 tests

**Reusable patterns**:
- `LeaderboardButton.test.tsx` and `LeaderboardPopup.test.tsx` show the exact test style to follow for new component tests
- `leaderboard.test.ts:5` shows the `beforeEach(() => localStorage.clear())` pattern for localStorage-dependent tests

## 5. Handoff (What's next)

**For PLAN**:
- `nextId` module-level counter is a subtle bug risk: multiple `computeAnimatedMove` calls accumulate IDs across game restarts — note if addressing animation correctness
- `App.css` is entirely dead code (Vite scaffolding); safe to delete or ignore
- No router, no context API, no state management library — keep it that way

**For CODE**:
- Test runner: `npm run test` (single run) — prefer `npx vitest run src/path/to/file.test.ts` for single-file runs per CLAUDE.md
- Always arrow functions: `export const MyComponent = () => ...`
- Destructure imports: `import { useState, useCallback } from 'react'`
- Match inline style pattern — no external CSS classes for game components
- Use `vi.fn()` for mocks, `fireEvent` for interactions in component tests

**For COMMIT**:
- `npm run typecheck` must pass
- `npm run lint` must pass
- New components/utilities require unit tests
- Update documentation if adding features

**Gaps**: No vitest coverage configuration — no enforced coverage threshold.
