// "Still Mountain at dawn": the hero scene. Three wash layers of the Flatirons' leaning slabs with
// drifting mist, a wind-shaped pine on a rock, and a karateka in horse stance on one long floor stroke.
import { arc, blob, brush, ridge, type Pt } from '../../lib/brush';
import { FigureInk } from './figure';
import { Pine } from './pine';
import { Seal } from './ink';

/** A leaning Flatiron slab: steep west face on the left, long east slope, strata strokes across it. */
function Slab({ apex, left, right, base, layer, seed }: { apex: Pt; left: number; right: number; base: number; layer: 'mist-1' | 'mist-2' | 'mist-3'; seed: number }) {
  const face: Pt[] = [[left, base], [apex[0] - (apex[0] - left) * 0.55, apex[1] + (base - apex[1]) * 0.38], apex];
  const slope: Pt[] = [apex, [apex[0] + (right - apex[0]) * 0.4, apex[1] + (base - apex[1]) * 0.36], [right, base]];
  const outline = ridge([...face, ...slope.slice(1)], base + 2, seed, 2.5);
  const edge = brush(face.slice().reverse(), { width: 7, seed, pressIn: 0.05, liftOff: 0.65, headWidth: 1.2, tailWidth: 0.05, tremor: 0.25 });
  const strata = [0.3, 0.52, 0.72].map((f, i) => {
    const y = apex[1] + (base - apex[1]) * f;
    const x0 = apex[0] - (apex[0] - left) * f * 0.92 + 8;
    const x1 = apex[0] + (right - apex[0]) * f * 0.75;
    return brush([[x0, y + 6], [(x0 + x1) / 2, y - 2], [x1, y - 10]], { width: 3.2, seed: seed + i, liftOff: 0.7, tailWidth: 0.05, tremor: 0.3 });
  });
  return (
    <g>
      <path d={outline} className={layer} filter="url(#ink-edge)" />
      <path d={edge} className="ink" opacity={layer === 'mist-1' ? 0.25 : layer === 'mist-2' ? 0.42 : 0.62} filter="url(#ink-edge)" />
      <path d={strata.join('')} className="ink" opacity={layer === 'mist-1' ? 0.1 : 0.18} filter="url(#ink-edge)" />
    </g>
  );
}

export function StillMountain({ className = '', animate = true, align = 'xMidYMax meet' }: { className?: string; animate?: boolean; align?: string }) {
  const sun = brush(arc(640, 170, 74, -80, 250, 16, 0.02, 2), { width: 4, seed: 2, liftOff: 0.6, tailWidth: 0.1, headWidth: 1.2 });
  const far = ridge([[0, 390], [80, 330], [170, 352], [250, 280], [330, 318], [420, 250], [520, 300], [610, 262], [700, 318], [800, 286], [880, 330], [960, 300]], 720, 3, 3);
  const rock = blob(770, 640, 190, 62, 19, 0.16, 12, 0.6);
  const rockEdge = brush([[586, 652], [640, 606], [720, 586], [820, 584], [900, 604], [956, 636]], { width: 9, seed: 23, liftOff: 0.5, headWidth: 1.3, tailWidth: 0.1, tremor: 0.25 });
  const floor = brush([[24, 684], [300, 678], [620, 682], [944, 676]], { width: 15, seed: 29, pressIn: 0.03, liftOff: 0.45, headWidth: 1.4, tailWidth: 0.06, tremor: 0.2 });
  const floorDry = brush([[60, 700], [380, 697], [700, 701]], { width: 5, seed: 31, liftOff: 0.6, tailWidth: 0.05 });
  return (
    <svg viewBox="0 0 960 720" className={className} role="img" aria-label="Ink drawing: a karateka in horse stance on the training floor, a pine on a rock, and the Flatirons in morning mist" preserveAspectRatio={align}>
      <path d={sun} className="ink" opacity=".22" filter="url(#ink-dry)" />
      <path d={far} className="mist-1" filter="url(#ink-edge)" />
      <g className={animate ? 'mist-drift' : undefined}>
        <path d={blob(300, 400, 380, 38, 37, 0.2, 10)} className="paper" opacity=".7" filter="url(#mist-soft)" />
      </g>
      <Slab apex={[300, 236]} left={150} right={560} base={720} layer="mist-2" seed={41} />
      <Slab apex={[486, 286]} left={360} right={760} base={720} layer="mist-2" seed={43} />
      <Slab apex={[660, 340]} left={560} right={960} base={720} layer="mist-3" seed={47} />
      <Slab apex={[150, 382]} left={0} right={420} base={720} layer="mist-3" seed={49} />
      <g className={animate ? 'mist-drift' : undefined} style={{ animationDuration: '34s', animationDirection: 'alternate-reverse' }}>
        <path d={blob(480, 548, 520, 46, 53, 0.18, 12)} className="paper" opacity=".88" filter="url(#mist-soft)" />
        <path d={blob(140, 600, 220, 26, 57, 0.2, 9)} className="paper" opacity=".7" filter="url(#mist-soft)" />
      </g>
      <path d={rock} className="mist-3" filter="url(#ink-edge)" />
      <path d={rockEdge} className="ink" filter="url(#ink-edge)" />
      <g transform="translate(640 380) scale(0.92)">
        <Pine stage="mountain-pine" sway={animate} />
      </g>
      <path d={floor} className={`ink ${animate ? 'brush-in' : ''}`} filter="url(#ink-edge)" />
      <path d={floorDry} className={`ink ${animate ? 'brush-in' : ''}`} style={{ ['--delay' as string]: '.25s' }} opacity=".6" filter="url(#ink-dry)" />
      <g className={animate ? 'ink-rise' : undefined} style={{ ['--delay' as string]: '.5s' }}>
        <FigureInk stance="kiba-dachi" x={330} y={674} scale={1.02} seed={7} />
      </g>
      <g transform="translate(872 600)">
        <svg width="58" height="58" viewBox="0 0 100 100" overflow="visible"><Seal text="静山" /></svg>
      </g>
    </svg>
  );
}
