// Section art: the folded gi still life, the 404 scene, the mountain flank behind the belt ladder,
// and small brush icons.
import { arc, blob, brush, rng, type Pt } from '../../lib/brush';
import { Enso } from './ink';

/** A folded white gi with a knotted belt on top, for "Your first class". */
export function GiStillLife({ className = '' }: { className?: string }) {
  const s = (pts: Pt[], width: number, seed: number, liftOff = 0.4) => brush(pts, { width, seed, liftOff, tailWidth: 0.2, tremor: 0.15 });
  const outline = [
    s([[40, 120], [160, 112], [292, 118]], 6, 1),
    s([[292, 118], [298, 160], [294, 206]], 6, 2),
    s([[294, 206], [170, 212], [36, 204]], 7, 3),
    s([[36, 204], [34, 160], [40, 120]], 5, 4),
    s([[44, 150], [170, 146], [290, 152]], 3.5, 5, 0.6),
  ];
  const lapels = [s([[120, 114], [150, 150], [176, 112]], 4.5, 6), s([[134, 114], [150, 136], [164, 113]], 3, 7)];
  const belt = brush([[18, 168], [140, 162], [312, 170]], { width: 13, seed: 8, pressIn: 0.03, liftOff: 0.15, headWidth: 1, tailWidth: 0.8 });
  const knot = blob(206, 165, 13, 14, 9, 0.12, 8);
  const ends = brush([[202, 172], [190, 196], [180, 226]], { width: 9, seed: 10, liftOff: 0.3, tailWidth: 0.7 })
    + brush([[212, 172], [228, 194], [246, 222]], { width: 9, seed: 11, liftOff: 0.3, tailWidth: 0.7 });
  const shadow = brush([[24, 222], [180, 226], [330, 220]], { width: 8, seed: 12, liftOff: 0.6, tailWidth: 0.05 });
  return (
    <svg viewBox="0 0 340 240" className={className} aria-hidden="true">
      <path d={blob(166, 162, 132, 48, 13, 0.06, 10)} className="paper" />
      <g className="ink" filter="url(#ink-edge)">
        {outline.map(d => <path key={d.slice(0, 20)} d={d} />)}
        {lapels.map(d => <path key={d.slice(0, 20)} d={d} />)}
        <path d={belt} />
        <path d={knot} />
        <path d={ends} />
      </g>
      <path d={shadow} className="ink" opacity=".35" filter="url(#ink-dry)" />
    </svg>
  );
}

/** 404: an unfinished ensō trailing off the scroll, and footprints leading out of frame. */
export function SteppedOff({ className = '' }: { className?: string }) {
  const open = brush(arc(260, 220, 150, 150, 350, 14, 0.02, 4), { width: 34, seed: 4, pressIn: 0.05, liftOff: 0.3, headWidth: 1.3, tailWidth: 0.5 });
  const trail = brush([[408, 196], [520, 178], [640, 186], [760, 170]], { width: 16, seed: 5, pressIn: 0.05, liftOff: 0.8, headWidth: 1, tailWidth: 0.02, tremor: 0.25 });
  const random = rng(14);
  const prints: string[] = [];
  for (let i = 0; i < 7; i++) {
    const x = 340 + i * 62, y = 360 + (i % 2 ? -18 : 14) - i * 4;
    const angle = -10 + (random() - 0.5) * 10;
    prints.push(`<g transform="translate(${x} ${y}) rotate(${angle})" opacity="${(1 - i * 0.11).toFixed(2)}">`);
    prints.push(`<path d="${blob(0, 0, 13, 7, 30 + i, 0.15, 8)}"/>`);
    prints.push(`<path d="${blob(13, -1, 5, 5.5, 40 + i, 0.1, 7)}"/>`);
    prints.push('</g>');
  }
  return (
    <svg viewBox="0 0 800 440" className={className} aria-hidden="true">
      <path d={open} className="ink" filter="url(#ink-edge)" />
      <path d={trail} className="ink" filter="url(#ink-dry)" />
      <g className="ink" dangerouslySetInnerHTML={{ __html: prints.join('') }} />
    </svg>
  );
}

/** The mountain flank the belt ladder climbs, with an ensō at the summit. */
export function LadderFlank({ className = '' }: { className?: string }) {
  const flank = 'M0 640L0 600L120 560L230 470L330 380L410 270L470 190L520 150L560 160L560 640Z';
  const edge = brush([[20, 604], [140, 552], [250, 452], [350, 360], [430, 250], [500, 166], [540, 146]], { width: 8, seed: 3, pressIn: 0.03, liftOff: 0.5, headWidth: 1.2, tailWidth: 0.08, tremor: 0.2 });
  return (
    <svg viewBox="0 0 560 640" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path d={flank} className="mist-1" filter="url(#ink-edge)" />
      <path d={edge} className="ink" opacity=".5" filter="url(#ink-dry)" />
    </svg>
  );
}

export { Enso };

type IconName = 'clock' | 'calendar' | 'pin' | 'phone' | 'mail' | 'arrow';

/** Small brush icons, drawn in currentColor. */
export function Icon({ name, className = 'size-5' }: { name: IconName; className?: string }) {
  const paths: Record<IconName, string> = {
    clock: 'M12 3.5c4.8-.2 8.6 3.6 8.5 8.6-.1 4.6-3.9 8.3-8.6 8.4-4.8 0-8.4-3.8-8.4-8.5 0-4.6 3.8-8.4 8.5-8.5M12 7.2v5.2l3.4 2.2',
    calendar: 'M4.2 6.6c5.2-.4 10.4-.4 15.6 0 .3 4.4.3 8.8 0 13.2-5.2.4-10.4.4-15.6 0-.3-4.4-.3-8.8 0-13.2M4.4 10.6h15.2M8.4 3.8v4M15.6 3.8v4',
    pin: 'M12 21c-3.6-4.2-6.4-7.6-6.4-11 0-3.6 2.8-6.4 6.4-6.4s6.4 2.8 6.4 6.4c0 3.4-2.8 6.8-6.4 11ZM12 12.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8',
    phone: 'M6.4 3.6 9 3.4l1.6 4.2-2.2 1.6c1 2.4 3 4.4 5.4 5.4l1.6-2.2 4.2 1.6-.2 2.6c-.2 1.6-1.6 2.8-3.2 2.6C9.4 18.4 5.6 14.6 4.8 7c-.2-1.6 1-3.2 1.6-3.4',
    mail: 'M3.6 6.4c5.6-.4 11.2-.4 16.8 0 .3 3.8.3 7.6 0 11.4-5.6.4-11.2.4-16.8 0-.3-3.8-.3-7.6 0-11.4M4 7l8 6.4L20 7',
    arrow: 'M4 12.2c5-.3 10.2-.3 15.4 0M14.4 7.4l5 4.8-5 4.6',
  };
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name]} />
    </svg>
  );
}

/** Level marks for the timetable: one, two or three ink dots, or a filled ensō for brown and black belts. */
export function LevelMark({ level, className = 'size-5' }: { level: 'all' | 'beginners' | 'coloured' | 'advanced'; className?: string }) {
  if (level === 'advanced') {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path d={brush(arc(12, 12, 7.5, -110, 220, 10, 0.02, 3), { width: 3.6, seed: 3, liftOff: 0.4, headWidth: 1.2, tailWidth: 0.2, detail: 6 })} fill="currentColor" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
    );
  }
  const dots = level === 'all' ? [12] : level === 'beginners' ? [8, 16] : [5, 12, 19];
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {dots.map((x, i) => <path key={x} d={blob(x, 12, 2.6, 2.9, 60 + i, 0.12, 7)} fill="currentColor" />)}
    </svg>
  );
}
