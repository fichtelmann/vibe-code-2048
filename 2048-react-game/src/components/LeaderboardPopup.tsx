import { useEffect, useRef } from 'react';
import type { LeaderboardEntry } from '../types/game';

interface LeaderboardPopupProps {
  /** Whether the popup is visible */
  isOpen: boolean;
  /** Leaderboard entries sorted by rank */
  entries: LeaderboardEntry[];
  /** Called when the user closes the popup */
  onClose: () => void;
}

/**
 * Modal popup that displays the top-10 leaderboard scores.
 * Closes on Escape key or backdrop click.
 */
export function LeaderboardPopup({ isOpen, entries, onClose }: LeaderboardPopupProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const mono: React.CSSProperties = { fontFamily: '"Courier New", Courier, monospace' };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Leaderboard"
      style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)' }}
      />

      {/* Panel */}
      <div
        ref={dialogRef}
        style={{
          position: 'relative',
          background: 'linear-gradient(160deg, #2a2316 0%, #1a1a10 60%, #121610 100%)',
          border: '2px solid #3a3220',
          borderRadius: '10px',
          padding: '28px 32px',
          width: '100%',
          maxWidth: '380px',
          boxShadow: '0 24px 70px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,200,0.05)',
          ...mono,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '900', color: '#c8b86a', textShadow: '0 0 12px rgba(200,180,100,0.4)', ...mono }}>
            LEADERBOARD
          </h2>
          <button
            onClick={onClose}
            aria-label="Close leaderboard"
            style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#6b7a3a', lineHeight: 1, padding: '4px', ...mono }}
          >
            ✕
          </button>
        </div>

        {entries.length === 0 ? (
          <p style={{ color: '#4a5a28', textAlign: 'center', margin: '24px 0', fontSize: '0.9rem', ...mono }}>
            No scores yet.<br />Play a game to get on the board!
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #3a3220' }}>
                {['#', 'Score', 'Date'].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: h === '#' ? 'center' : 'right',
                      padding: '4px 8px 10px',
                      color: '#4a5a28',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      ...mono,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.rank} style={{ borderBottom: '1px solid #1e1e10' }}>
                  <td style={{ textAlign: 'center', padding: '10px 8px', fontSize: '1.1rem', ...mono }}>
                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : (
                      <span style={{ color: '#4a5a28' }}>{entry.rank}</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right', padding: '10px 8px', fontWeight: '900', color: '#c8b86a', fontSize: '1.05rem', textShadow: '0 0 6px rgba(200,180,100,0.3)', ...mono }}>
                    {entry.score.toLocaleString()}
                  </td>
                  <td style={{ textAlign: 'right', padding: '10px 8px', color: '#4a5a28', fontSize: '0.82rem', ...mono }}>
                    {entry.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
