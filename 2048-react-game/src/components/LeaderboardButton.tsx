interface LeaderboardButtonProps {
  /** Called when the button is clicked */
  onClick: () => void;
}

/**
 * Fixed button at the bottom of the page that opens the leaderboard popup.
 */
export function LeaderboardButton({ onClick }: LeaderboardButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Open leaderboard"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'linear-gradient(160deg, #2a2316, #1a1a0e)',
        color: '#c8b86a',
        border: '2px solid #3a3220',
        borderRadius: '6px',
        padding: '11px 28px',
        fontSize: '0.9rem',
        fontWeight: '900',
        fontFamily: '"Courier New", Courier, monospace',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        boxShadow: '0 4px 18px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,200,0.06)',
        textShadow: '0 0 8px rgba(200,180,100,0.4)',
        zIndex: 50,
      }}
    >
      Leaderboard
    </button>
  );
}
