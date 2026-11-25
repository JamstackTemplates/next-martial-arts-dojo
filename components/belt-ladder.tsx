import type { ReactNode } from 'react';
import type { Belt } from '../content/belts';
import { BeltStroke } from './art/belt-stroke';
import { Enso } from './art/ink';

/**
 * The signature element: eight belt strokes resting on the flank of an ink mountain, white at the
 * foot and black at the summit, with an ensō over the peak. Rows have a fixed height so the slope
 * can be drawn through the left end of every stroke. `renderItem` lets the Belts page make each
 * stroke a control; by default each rank is plain text.
 */
export function BeltLadder({ belts, compact = false, renderItem, className = '' }: {
  belts: readonly Belt[];
  compact?: boolean;
  renderItem?: (belt: Belt, index: number, stroke: ReactNode) => ReactNode;
  className?: string;
}) {
  const row = compact ? 50 : 62;      // px per rank
  const top = compact ? 150 : 180;    // room for the peak and ensō
  const bottom = 18;
  const step = 5;                     // % of width each rank climbs
  const n = belts.length;
  const height = top + n * row + bottom;
  // The slope passes just under the left end of each stroke.
  const slope = belts.map((_, i) => [i * step + 1, height - bottom - row * i - row * 0.22] as const);
  const peak = [slope[n - 1][0] + 9, top - 40] as const;
  const fill = `M0 ${height}L0 ${height - bottom + 4}${slope.map(([x, y]) => `L${x} ${y}`).join('')}L${peak[0]} ${peak[1]}L${peak[0] + 10} ${peak[1] + 12}L100 ${top + row * 2.2}L100 ${height}Z`;
  const edge = `M0 ${height - bottom + 4}${slope.map(([x, y]) => `L${x} ${y}`).join('')}L${peak[0]} ${peak[1]}`;
  const enso = compact ? 96 : 124;
  return (
    <div className={`relative ${className}`} style={{ height }}>
      <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden="true">
        <path d={fill} className="mist-1" />
        <path d={edge} fill="none" stroke="var(--ink-art)" strokeOpacity=".5" strokeWidth="2.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <div aria-hidden="true" className="absolute" style={{ width: enso, height: enso, left: `calc(${peak[0]}% - ${enso / 2}px)`, top: Math.max(0, peak[1] - enso * 0.78) }}>
        <Enso className="size-full" seed={8} />
      </div>
      <ol className="absolute inset-x-0 flex flex-col-reverse" style={{ bottom, top }} aria-label="Belt ranks from white to black">
        {belts.map((belt, index) => {
          const stroke = <BeltStroke swatch={belt.swatch} seed={index * 7 + 3} className={compact ? 'h-7 w-[7.5rem] sm:w-[12.5rem]' : 'h-9 w-[8rem] sm:w-[14rem]'} />;
          return (
            <li key={belt.id} className="flex items-center" style={{ height: row, paddingLeft: `${index * step}%` }}>
              {renderItem ? renderItem(belt, index, stroke) : (
                <span className="flex items-center gap-3">
                  {stroke}
                  <span className="leading-tight">
                    <span className="block font-semibold">{belt.belt}</span>
                    <span className="block font-mono text-[.8rem] text-muted">{belt.rank}</span>
                  </span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
