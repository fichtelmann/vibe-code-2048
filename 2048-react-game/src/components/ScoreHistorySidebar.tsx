import type { ScoreHistoryEntry } from '../types/game';

interface ScoreHistorySidebarProps {
  entries: ScoreHistoryEntry[];
}

const MONO: React.CSSProperties = { fontFamily: '"Courier New", Courier, monospace' };

export const ScoreHistorySidebar = ({ entries }: ScoreHistorySidebarProps) => (
  <div
    style={{
      ...MONO,
      width: '220px',
      flexShrink: 0,
      background: 'linear-gradient(160deg, #2a2316 0%, #1a1a10 60%, #121610 100%)',
      border: '2px solid #3a3220',
      borderRadius: '10px',
      padding: '20px 16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,200,0.05)',
    }}
  >
    <h2
      style={{
        ...MONO,
        margin: '0 0 16px 0',
        fontSize: '0.85rem',
        fontWeight: '900',
        color: '#c8b86a',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        textShadow: '0 0 10px rgba(200,180,100,0.4)',
      }}
    >
      Score History
    </h2>

    {entries.length === 0 ? (
      <p
        style={{
          ...MONO,
          margin: 0,
          color: '#4a5a28',
          fontSize: '0.78rem',
          lineHeight: '1.5',
          letterSpacing: '0.03em',
        }}
      >
        No games yet.
        <br />
        Play to see your history!
      </p>
    ) : (
      <div
        style={{
          maxHeight: '400px',
          overflowY: 'auto',
        }}
      >
        {entries.map((entry, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              padding: '7px 0',
              borderBottom: '1px solid #1e1e10',
            }}
          >
            <span
              style={{
                ...MONO,
                color: '#c8b86a',
                fontWeight: '900',
                fontSize: '1rem',
                textShadow: '0 0 6px rgba(200,180,100,0.3)',
              }}
            >
              {entry.score.toLocaleString()}
            </span>
            <span
              style={{
                ...MONO,
                color: '#4a5a28',
                fontSize: '0.72rem',
                marginLeft: '8px',
              }}
            >
              {entry.date}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
);
