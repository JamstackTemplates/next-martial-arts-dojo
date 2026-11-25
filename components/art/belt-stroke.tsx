// One belt as a single horizontal brush stroke in its colour, with a small knot and a dry-brush tail.
// White keeps an ink edge on paper and black a pale edge at night (tokens in app/tailwind.input.css).
import type { BeltSwatch } from '../../content/belts';
import { blob, brush } from '../../lib/brush';

export function BeltStroke({ swatch, seed = 1, className = '', knotAt = 0.68 }: { swatch: BeltSwatch; seed?: number; className?: string; knotAt?: number }) {
  const body = brush([[6, 22], [90, 19 - (seed % 3)], [200, 20], [292, 23]], {
    width: 17, seed, pressIn: 0.05, liftOff: 0.28, headWidth: 1.25, tailWidth: 0.35, tremor: 0.12,
  });
  const tail = brush([[210, 21], [270, 22], [314, 24]], { width: 10, seed: seed + 7, pressIn: 0.2, liftOff: 0.7, headWidth: 0.8, tailWidth: 0.04 });
  const kx = 6 + 286 * knotAt;
  const knot = blob(kx, 21, 7.5, 8.5, seed + 3, 0.1, 8);
  // Short tails, splayed wide, so the knot reads as a knot and not a little figure.
  const ends = brush([[kx - 3, 25], [kx - 14, 31], [kx - 24, 35]], { width: 6.5, seed: seed + 4, liftOff: 0.35, tailWidth: 0.55 })
    + brush([[kx + 3, 25], [kx + 15, 32], [kx + 27, 34]], { width: 6.5, seed: seed + 5, liftOff: 0.35, tailWidth: 0.55 });
  return (
    <svg viewBox="0 0 320 52" className={`belt-${swatch} ${className}`} aria-hidden="true" overflow="visible">
      <g filter="url(#ink-edge)">
        <path d={body} className="belt-fill" />
        <path d={body} className="belt-edge" />
      </g>
      <path d={tail} className="belt-fill" filter="url(#ink-dry)" />
      <path d={ends} className="belt-fill" />
      <path d={ends} className="belt-edge" />
      <path d={knot} className="belt-fill" />
      <path d={knot} fill="none" stroke="var(--ink-art)" strokeOpacity=".3" strokeWidth="1" />
    </svg>
  );
}
