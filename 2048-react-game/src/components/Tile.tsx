import type { AnimatedTile } from '../types/game';

interface TileProps {
  tile: AnimatedTile;
  cellSize: number;
  gap: number;
}

/* Stone slab palette — earthy mossy tones that glow hotter as values rise */
const tileStyles: Record<number, { bg: string; border: string; text: string; shadow: string }> = {
  2:    { bg: '#2e2a1f', border: '#4a4232', text: '#9b8f72', shadow: 'inset 0 2px 4px rgba(255,255,220,0.06), inset 0 -2px 4px rgba(0,0,0,0.5)' },
  4:    { bg: '#33301f', border: '#524628', text: '#b0a06a', shadow: 'inset 0 2px 4px rgba(255,255,200,0.08), inset 0 -2px 4px rgba(0,0,0,0.5)' },
  8:    { bg: '#1a2e10', border: '#2f5018', text: '#6ecf4a', shadow: 'inset 0 2px 5px rgba(100,220,60,0.12), inset 0 -2px 4px rgba(0,0,0,0.6), 0 0 8px rgba(80,200,40,0.25)' },
  16:   { bg: '#163310', border: '#285c1a', text: '#7ee055', shadow: 'inset 0 2px 5px rgba(120,230,70,0.14), inset 0 -2px 4px rgba(0,0,0,0.6), 0 0 12px rgba(90,210,50,0.3)' },
  32:   { bg: '#1a3318', border: '#336630', text: '#88ee60', shadow: 'inset 0 2px 6px rgba(130,240,80,0.16), inset 0 -3px 5px rgba(0,0,0,0.65), 0 0 16px rgba(100,220,60,0.35)' },
  64:   { bg: '#1e3a14', border: '#3d7028', text: '#95f065', shadow: 'inset 0 3px 6px rgba(140,250,90,0.18), inset 0 -3px 6px rgba(0,0,0,0.7), 0 0 22px rgba(110,230,65,0.45)' },
  128:  { bg: '#24260a', border: '#4f5410', text: '#d4e030', shadow: 'inset 0 3px 7px rgba(220,240,40,0.2), inset 0 -3px 6px rgba(0,0,0,0.7), 0 0 26px rgba(200,220,30,0.5)' },
  256:  { bg: '#2a200a', border: '#5c4010', text: '#e8a020', shadow: 'inset 0 3px 7px rgba(240,180,30,0.22), inset 0 -3px 6px rgba(0,0,0,0.7), 0 0 30px rgba(220,160,20,0.55)' },
  512:  { bg: '#2e1a08', border: '#663214', text: '#f07818', shadow: 'inset 0 3px 8px rgba(250,150,20,0.25), inset 0 -4px 7px rgba(0,0,0,0.75), 0 0 36px rgba(240,120,15,0.6)' },
  1024: { bg: '#320e06', border: '#7a2010', text: '#f84c10', shadow: 'inset 0 4px 8px rgba(255,110,20,0.28), inset 0 -4px 8px rgba(0,0,0,0.8), 0 0 44px rgba(250,80,10,0.7)' },
  2048: { bg: '#360606', border: '#941010', text: '#ffdd00', shadow: 'inset 0 4px 10px rgba(255,220,0,0.35), inset 0 -4px 8px rgba(0,0,0,0.85), 0 0 60px rgba(255,180,0,0.8), 0 0 100px rgba(255,100,0,0.4)' },
};

const fallback = { bg: '#3a0a0a', border: '#8b1a14', text: '#ffcc00', shadow: '0 0 70px rgba(255,160,0,0.85)' };

export function Tile({ tile, cellSize, gap }: TileProps) {
  const { value, row, col, isNew, isMerged } = tile;
  const s = tileStyles[value] ?? fallback;
  const fontSize = value >= 1000 ? '1.35rem' : value >= 100 ? '1.75rem' : '2.1rem';

  const x = col * (cellSize + gap);
  const y = row * (cellSize + gap);

  const innerAnimation = isMerged
    ? 'tile-merge 0.32s cubic-bezier(0.36,0.07,0.19,0.97)'
    : isNew
    ? 'tile-appear 0.22s cubic-bezier(0.25,0.46,0.45,0.94)'
    : undefined;

  return (
    <div
      style={{
        position: 'absolute',
        width: cellSize,
        height: cellSize,
        transform: `translate(${x}px, ${y}px)`,
        transition: 'transform 0.11s ease-in-out',
        zIndex: isMerged ? 2 : 1,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '5px',
          background: `
            radial-gradient(ellipse 70% 45% at 38% 28%, rgba(255,255,240,0.07) 0%, transparent 65%),
            ${s.bg}
          `,
          border: `2px solid ${s.border}`,
          boxShadow: s.shadow,
          color: s.text,
          fontSize,
          fontWeight: '900',
          fontFamily: '"Courier New", Courier, monospace',
          letterSpacing: '-0.03em',
          userSelect: 'none',
          textShadow: `0 1px 2px rgba(0,0,0,0.8), 0 0 12px ${s.text}88`,
          /* Subtle crack overlay using repeating gradient */
          backgroundImage: `
            repeating-linear-gradient(73deg, transparent 0px, transparent 28px, rgba(0,0,0,0.07) 28px, rgba(0,0,0,0.07) 29px),
            repeating-linear-gradient(15deg, transparent 0px, transparent 20px, rgba(0,0,0,0.04) 20px, rgba(0,0,0,0.04) 21px),
            radial-gradient(ellipse 70% 45% at 38% 28%, rgba(255,255,240,0.07) 0%, transparent 65%),
            linear-gradient(to bottom right, ${s.border}55, ${s.bg} 40%, ${s.bg})
          `,
          animation: innerAnimation,
        }}
      >
        {value}
      </div>
    </div>
  );
}
