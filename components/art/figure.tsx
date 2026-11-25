// Brush-drawn karateka, a few strokes each. Local coordinates: feet on y = 0, about 210 units tall,
// facing right. Used in the hero (kiba-dachi) and on the instructor scrolls (one stance each).
import type { Stance } from '../../content/instructors';
import { blob, brush, type Pt } from '../../lib/brush';

type Limb = { pts: Pt[]; width: number; taper?: number };

const POSES: Record<Stance, { head: Pt; torso: Pt[]; belt: [Pt, Pt]; limbs: Limb[] }> = {
  // Horse stance, front-on, with a side punch: the hero figure.
  'kiba-dachi': {
    head: [2, -196],
    torso: [[0, -176], [2, -142], [0, -108]],
    belt: [[-20, -126], [20, -125]],
    limbs: [
      { pts: [[-12, -106], [-46, -84], [-58, -48], [-64, -2]], width: 24 },
      { pts: [[12, -106], [46, -84], [58, -48], [64, -2]], width: 24 },
      { pts: [[16, -170], [60, -170], [106, -171]], width: 15, taper: 0.25 },
      { pts: [[-16, -168], [-36, -146], [-30, -124], [-16, -118]], width: 15, taper: 0.3 },
      { pts: [[-72, -1], [-56, -2]], width: 9 },
      { pts: [[56, -2], [74, -1]], width: 9 },
    ],
  },
  // Front stance with a straight punch.
  'zenkutsu-dachi': {
    head: [12, -196],
    torso: [[8, -176], [6, -142], [0, -106]],
    belt: [[-17, -124], [19, -122]],
    limbs: [
      { pts: [[6, -104], [40, -72], [52, -34], [54, -2]], width: 23 },
      { pts: [[-6, -104], [-40, -60], [-86, -4]], width: 21 },
      { pts: [[18, -170], [64, -168], [108, -166]], width: 15, taper: 0.25 },
      { pts: [[0, -168], [-26, -146], [-22, -124], [-6, -116]], width: 15, taper: 0.3 },
      { pts: [[46, -2], [70, -1]], width: 9 },
      { pts: [[-96, -1], [-80, -4]], width: 8 },
    ],
  },
  // Back stance with a knife-hand block.
  'kokutsu-dachi': {
    head: [-2, -194],
    torso: [[-4, -174], [-4, -140], [-6, -104]],
    belt: [[-22, -122], [12, -122]],
    limbs: [
      { pts: [[-12, -102], [-38, -66], [-46, -30], [-52, -2]], width: 24 },
      { pts: [[4, -102], [38, -66], [62, -2]], width: 18 },
      { pts: [[4, -166], [36, -148], [56, -172]], width: 14, taper: 0.3 },
      { pts: [[-12, -164], [-26, -142], [-2, -132], [12, -134]], width: 14, taper: 0.3 },
      { pts: [[-62, -1], [-42, -2]], width: 9 },
      { pts: [[58, -2], [74, -1]], width: 7 },
    ],
  },
  // Kneeling, hands resting on the thighs.
  seiza: {
    head: [2, -134],
    torso: [[0, -116], [-2, -84], [-8, -48]],
    belt: [[-26, -52], [12, -52]],
    limbs: [
      { pts: [[-12, -40], [20, -36], [50, -28]], width: 26 },
      { pts: [[48, -10], [10, -8], [-34, -6]], width: 20 },
      { pts: [[8, -110], [20, -82], [36, -52]], width: 14, taper: 0.3 },
      { pts: [[-12, -108], [-4, -80], [22, -48]], width: 13, taper: 0.3 },
    ],
  },
};

/** An ink figure as an SVG <g>, placed with its feet at (x, y). */
export function FigureInk({ stance, x = 0, y = 0, scale = 1, seed = 1 }: { stance: Stance; x?: number; y?: number; scale?: number; seed?: number }) {
  const pose = POSES[stance];
  const torso = brush(pose.torso, { width: 40, seed, pressIn: 0.08, liftOff: 0.25, headWidth: 0.85, tailWidth: 0.75, tremor: 0.1 });
  const limbs = pose.limbs.map((limb, i) => brush(limb.pts, {
    width: limb.width, seed: seed + i + 2, pressIn: 0.06, liftOff: 0.35, headWidth: 1, tailWidth: limb.taper ?? 0.55, tremor: 0.12,
  }));
  const [b0, b1] = pose.belt;
  const belt = brush([b0, [(b0[0] + b1[0]) / 2, b0[1] + 1.5], b1], { width: 4.5, seed: seed + 20, pressIn: 0.05, liftOff: 0.1, headWidth: 1, tailWidth: 0.9 });
  const knotX = (b0[0] + b1[0]) / 2 + 3;
  const tails = brush([[knotX, b0[1] + 2], [knotX + 4, b0[1] + 10], [knotX + 3, b0[1] + 17]], { width: 3.4, seed: seed + 21, liftOff: 0.5, tailWidth: 0.4 });
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="ink" filter="url(#ink-edge)">
        <path d={blob(pose.head[0], pose.head[1], 14, 16, seed + 30, 0.08, 9)} />
        <path d={torso} />
        {limbs.map(d => <path key={d.slice(0, 24)} d={d} />)}
      </g>
      <path d={belt} className="paper" />
      <path d={tails} className="paper" />
    </g>
  );
}

/** Standalone figure, for the instructor scrolls. */
export function Figure({ stance, className = '', seed = 1 }: { stance: Stance; className?: string; seed?: number }) {
  return (
    <svg viewBox="-120 -225 240 240" className={className} aria-hidden="true" overflow="visible">
      <path d={brush([[-96, 4], [0, 2], [96, 5]], { width: 5, seed: seed + 40, liftOff: 0.6, tailWidth: 0.05 })} className="ink" filter="url(#ink-dry)" opacity=".7" />
      <FigureInk stance={stance} seed={seed} />
    </svg>
  );
}
