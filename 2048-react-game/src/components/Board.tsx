import type { AnimatedTile } from '../types/game';
import { Tile } from './Tile';

interface BoardProps {
  tiles: AnimatedTile[];
}

const PADDING = 14;
const GAP = 10;
const CELL = 96;
const SIZE = 4;
const BOARD_INNER = SIZE * CELL + (SIZE - 1) * GAP;
const BOARD_SIZE = BOARD_INNER + PADDING * 2;

export function Board({ tiles }: BoardProps) {
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '10px',
        padding: PADDING,
        width: BOARD_SIZE,
        height: BOARD_SIZE,
        maxWidth: '100%',
        /* Layered stone slab look */
        background: `
          repeating-linear-gradient(
            88deg,
            transparent 0px, transparent 44px,
            rgba(0,0,0,0.12) 44px, rgba(0,0,0,0.12) 46px
          ),
          repeating-linear-gradient(
            2deg,
            transparent 0px, transparent 44px,
            rgba(0,0,0,0.10) 44px, rgba(0,0,0,0.10) 46px
          ),
          linear-gradient(160deg, #2a2316 0%, #1a1a10 45%, #121610 100%)
        `,
        border: '3px solid #3a3220',
        boxShadow: `
          0 0 0 1px #1a1508,
          0 8px 32px rgba(0,0,0,0.8),
          inset 0 1px 0 rgba(255,255,200,0.06),
          inset 0 -2px 4px rgba(0,0,0,0.6)
        `,
        boxSizing: 'content-box',
      }}
    >
      {/* Ghost slots — moss-covered recessed stone */}
      {Array.from({ length: SIZE * SIZE }, (_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: CELL,
            height: CELL,
            borderRadius: '5px',
            left: PADDING + (i % SIZE) * (CELL + GAP),
            top: PADDING + Math.floor(i / SIZE) * (CELL + GAP),
            background: `
              radial-gradient(ellipse 60% 40% at 50% 30%, rgba(20,40,10,0.3) 0%, transparent 70%),
              linear-gradient(to bottom, #0e150a, #111408)
            `,
            border: '1px solid #1e2012',
            boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.7), inset 0 0 12px rgba(0,0,0,0.4)',
          }}
        />
      ))}

      {/* Animated tiles */}
      <div style={{ position: 'absolute', top: PADDING, left: PADDING }}>
        {tiles.map((tile) => (
          <Tile key={tile.id} tile={tile} cellSize={CELL} gap={GAP} />
        ))}
      </div>
    </div>
  );
}
