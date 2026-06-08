interface ScoreBoxProps {
  label: string;
  value: number;
}

export function ScoreBox({ label, value }: ScoreBoxProps) {
  return (
    <div
      style={{
        background: 'linear-gradient(160deg, #2a2316, #1a1a0e)',
        border: '2px solid #3a3220',
        borderRadius: '6px',
        padding: '8px 18px',
        textAlign: 'center',
        minWidth: '84px',
        boxShadow: 'inset 0 1px 0 rgba(255,255,200,0.05), 0 4px 12px rgba(0,0,0,0.5)',
      }}
    >
      <div style={{
        color: '#6b7a3a',
        fontSize: '0.65rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontFamily: '"Courier New", Courier, monospace',
      }}>
        {label}
      </div>
      <div style={{
        color: '#c8b86a',
        fontSize: '1.3rem',
        fontWeight: '900',
        fontFamily: '"Courier New", Courier, monospace',
        textShadow: '0 0 8px rgba(200,180,100,0.4)',
      }}>
        {value}
      </div>
    </div>
  );
}
