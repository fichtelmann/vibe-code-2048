import { useCallback, useEffect, useRef, useState } from 'react';
import { useGame } from '../hooks/useGame';
import type { Direction, ScoreHistoryEntry } from '../types/game';
import { addScoreHistoryEntry, getScoreHistory } from '../utils/scoreHistory';
import { Board } from './Board';
import { ScoreHistorySidebar } from './ScoreHistorySidebar';
import { ScoreBox } from './ScoreBox';

const MONO: React.CSSProperties = { fontFamily: '"Courier New", Courier, monospace' };

export function Game() {
  const { state, handleMove, newGame, continueGame } = useGame();
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [swiping, setSwiping] = useState(false);
  const [history, setHistory] = useState<ScoreHistoryEntry[]>(() => getScoreHistory());
  const scoreSaved = useRef(false);

  useEffect(() => {
    if (state.gameOver && !scoreSaved.current && state.score > 0) {
      scoreSaved.current = true;
      setHistory(addScoreHistoryEntry(state.score));
    }
    if (!state.gameOver) scoreSaved.current = false;
  }, [state.gameOver, state.score]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
    setSwiping(false);
  }, []);

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStart.current.x;
      const dy = t.clientY - touchStart.current.y;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      if (Math.max(absDx, absDy) < 20) return;
      const dir: Direction = absDx > absDy ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
      setSwiping(true);
      handleMove(dir);
      touchStart.current = null;
    },
    [handleMove]
  );

  const showWinOverlay = state.won && !state.continueAfterWin;
  const showGameOverOverlay = state.gameOver;

  return (
    <div
      style={{
        ...MONO,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        paddingBottom: '32px',
      }}
    >
      <div className="score-history-layout">
        {/* Game column */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '444px', marginBottom: '14px' }}>
            <h1 style={{
              margin: 0,
              fontSize: '3.2rem',
              fontWeight: '900',
              color: '#c8b86a',
              textShadow: '0 0 20px rgba(200,180,100,0.5), 0 2px 4px rgba(0,0,0,0.8)',
              letterSpacing: '-0.02em',
              ...MONO,
            }}>
              2048
            </h1>
            <div style={{ display: 'flex', gap: '8px' }}>
              <ScoreBox label="Score" value={state.score} />
              <ScoreBox label="Best" value={state.bestScore} />
            </div>
          </div>

          {/* Subtitle + new game */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '444px', marginBottom: '12px' }}>
            <p style={{ margin: 0, color: '#4a6030', fontSize: '0.82rem', letterSpacing: '0.03em' }}>
              Crush stones to reach <strong style={{ color: '#7ab040' }}>2048</strong>
            </p>
            <button
              onClick={newGame}
              style={{
                background: 'linear-gradient(160deg, #2a2316, #1a1a0e)',
                color: '#c8b86a',
                border: '2px solid #3a3220',
                borderRadius: '5px',
                padding: '7px 16px',
                fontSize: '0.8rem',
                fontWeight: '900',
                cursor: 'pointer',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                boxShadow: '0 3px 10px rgba(0,0,0,0.5)',
                ...MONO,
              }}
            >
              New Game
            </button>
          </div>

          {/* Board */}
          <div
            style={{ position: 'relative', touchAction: 'none' }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <Board tiles={state.tiles} />

            {showWinOverlay && (
              <Overlay color="rgba(20,30,8,0.88)">
                <OverlayMessage title="YOU WIN!" subtitle="Keep crushing?" accent="#7ee055">
                  <OverlayBtn onClick={continueGame} variant="green">Keep Going</OverlayBtn>
                  <OverlayBtn onClick={newGame} variant="stone">New Game</OverlayBtn>
                </OverlayMessage>
              </Overlay>
            )}

            {showGameOverOverlay && (
              <Overlay color="rgba(10,8,4,0.88)">
                <OverlayMessage title="GAME OVER" subtitle={`Final score: ${state.score}`} accent="#c8b86a">
                  <OverlayBtn onClick={newGame} variant="stone">Try Again</OverlayBtn>
                </OverlayMessage>
              </Overlay>
            )}
          </div>

          <p style={{ color: '#2a3a18', fontSize: '0.75rem', marginTop: '14px', letterSpacing: '0.05em' }}>
            {swiping ? 'SWIPE OR ARROW KEYS' : 'ARROWS · WASD · SWIPE'}
          </p>
        </div>

        {/* Score history sidebar */}
        <ScoreHistorySidebar entries={history} />
      </div>
    </div>
  );
}

function Overlay({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, borderRadius: '10px',
      backgroundColor: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 10,
      backdropFilter: 'blur(2px)',
    }}>
      {children}
    </div>
  );
}

function OverlayMessage({ title, subtitle, accent, children }: { title: string; subtitle: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ textAlign: 'center', ...MONO }}>
      <div style={{ fontSize: '2.2rem', fontWeight: '900', color: accent, textShadow: `0 0 24px ${accent}88`, letterSpacing: '0.05em', marginBottom: '6px' }}>{title}</div>
      <div style={{ fontSize: '0.9rem', color: '#4a6030', marginBottom: '20px', letterSpacing: '0.05em' }}>{subtitle}</div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>{children}</div>
    </div>
  );
}

function OverlayBtn({ onClick, children, variant }: { onClick: () => void; children: React.ReactNode; variant: 'green' | 'stone' | 'amber' }) {
  const colors = {
    green: { color: '#7ee055', border: '#3a6020', glow: '#7ee055' },
    stone: { color: '#c8b86a', border: '#3a3220', glow: '#c8b86a' },
    amber: { color: '#f07818', border: '#5a3010', glow: '#f07818' },
  }[variant];

  return (
    <button
      onClick={onClick}
      style={{
        background: 'linear-gradient(160deg, #2a2316, #1a1a0e)',
        color: colors.color,
        border: `2px solid ${colors.border}`,
        borderRadius: '5px',
        padding: '10px 20px',
        fontSize: '0.85rem',
        fontWeight: '900',
        cursor: 'pointer',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        boxShadow: `0 3px 14px rgba(0,0,0,0.6), 0 0 10px ${colors.glow}22`,
        textShadow: `0 0 8px ${colors.glow}66`,
        ...MONO,
      }}
    >
      {children}
    </button>
  );
}
