// Shared ink artwork: SVG filters, ensō, dry-brush dividers, seals, header rules and wash backdrops.
// All shapes are generated at build time by lib/brush.ts and coloured by theme tokens (.ink, .mist-*, .seal-fill).
import { arc, blob, brush, ridge, rng, type Pt } from '../../lib/brush';

/**
 * Filters referenced by the artwork. Rendered once per page (app/layout.tsx).
 * - ink-edge: a slight bleed so strokes have feathered, absorbent-paper edges.
 * - ink-dry: dry-brush (kasure) gaps streaking along a stroke.
 * - mist-soft: soft wash edges for drifting mist.
 * - seal-stamp: a stamped seal with uneven ink pickup.
 */
export function InkDefs() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <defs>
        <filter id="ink-edge" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="2" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="ink-dry" x="-10%" y="-30%" width="120%" height="160%">
          <feTurbulence type="fractalNoise" baseFrequency="0.01 0.3" numOctaves="2" seed="7" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -5 0 0 0 3.55" result="m" />
          <feComposite in="SourceGraphic" in2="m" operator="in" result="dry" />
          <feDisplacementMap in="dry" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="mist-soft" x="-20%" y="-60%" width="140%" height="220%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id="seal-stamp" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.45" numOctaves="2" seed="11" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -4 0 0 0 3.2" result="m" />
          <feComposite in="SourceGraphic" in2="m" operator="in" result="speckled" />
          <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="1" seed="5" result="w" />
          <feDisplacementMap in="speckled" in2="w" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}

type ArtProps = { className?: string };

/** An open brush circle. `gap` is the open arc in degrees. */
export function Enso({ className = '', seed = 4, gap = 34, title }: ArtProps & { seed?: number; gap?: number; title?: string }) {
  const start = -112;
  const body = brush(arc(100, 100, 78, start, start + 360 - gap, 18, 0.025, seed), {
    width: 21, seed, pressIn: 0.05, liftOff: 0.42, headWidth: 1.25, tailWidth: 0.18, tremor: 0.12,
  });
  const tail = brush(arc(100, 100, 79, start + 230, start + 360 - gap + 4, 8, 0.02, seed + 1), {
    width: 12, seed: seed + 2, pressIn: 0.2, liftOff: 0.6, headWidth: 0.6, tailWidth: 0.05,
  });
  return (
    <svg viewBox="0 0 200 200" className={className} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <path d={body} className="ink" filter="url(#ink-edge)" />
      <path d={tail} className="ink" filter="url(#ink-dry)" opacity=".85" />
    </svg>
  );
}

/** A long horizontal dry-brush stroke that thins to a hair. Three variants so neighbours differ. */
export function Kasure({ className = '', variant = 1 }: ArtProps & { variant?: 1 | 2 | 3 }) {
  const shapes: Record<1 | 2 | 3, { pts: Pt[]; width: number; liftOff: number }> = {
    1: { pts: [[6, 16], [260, 12], [620, 13], [994, 18]], width: 15, liftOff: 0.55 },
    2: { pts: [[994, 14], [700, 11], [300, 15], [8, 12]], width: 12, liftOff: 0.6 },
    3: { pts: [[30, 18], [400, 10], [760, 14], [980, 9]], width: 18, liftOff: 0.4 },
  };
  const s = shapes[variant];
  const d = brush(s.pts, { width: s.width, seed: variant * 13, pressIn: 0.04, liftOff: s.liftOff, headWidth: 1.2, tailWidth: 0.04, tremor: 0.18 });
  return (
    <svg viewBox="0 0 1000 28" preserveAspectRatio="none" className={`block h-5 w-full ${className}`} aria-hidden="true">
      <path d={d} className="ink" filter="url(#ink-dry)" />
    </svg>
  );
}

/** A square cinnabar seal (hanko) with carved characters: vertical kanji or a short English stamp. */
export function Seal({ text, className = '', label, english = false, seed = 9 }: ArtProps & {
  text: string;
  /** Accessible name; omit for a decorative seal. */
  label?: string;
  /** English stamps set the words in lines across the seal instead of a vertical column. */
  english?: boolean;
  seed?: number;
}) {
  const random = rng(seed);
  const j = () => (random() * 2 - 1) * 1.6;
  const outline = `M${4 + j()} ${5 + j()}L${96 + j()} ${4 + j()}L${95 + j()} ${96 + j()}L${5 + j()} ${95 + j()}Z`;
  const chars = [...text];
  const words = text.split(' ');
  return (
    <svg viewBox="0 0 100 100" className={className} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <g filter="url(#seal-stamp)">
        <path d={outline} className="seal-fill" />
        <path d="M13 13H87V87H13Z" fill="none" stroke="var(--on-seal)" strokeWidth="2.4" opacity=".9" />
        {english
          ? words.map((word, i) => (
              <text key={word + i} x="50" y={50 + (i - (words.length - 1) / 2) * 24 + 8} textAnchor="middle"
                fontFamily="var(--font-display)" fontWeight="800" fontSize={word.length > 5 ? 17 : 22} fill="var(--on-seal)">{word}</text>
            ))
          : chars.map((char, i) => (
              <text key={char + i} x="50" y={chars.length === 1 ? 68 : 45 + i * 33} textAnchor="middle"
                fontFamily="var(--font-display)" fontWeight="800" fontSize={chars.length === 1 ? 56 : 33} fill="var(--on-seal)">{char}</text>
            ))}
      </g>
    </svg>
  );
}

/** Soft, brushy edge for a wash band. Place at the top (or flipped at the bottom) of a `bg-wash` section. */
export function WashEdge({ flip = false, seed = 21, className = '' }: ArtProps & { flip?: boolean; seed?: number }) {
  const random = rng(seed);
  const pts: string[] = [];
  for (let x = 0; x <= 1440; x += 40) pts.push(`${x} ${28 + Math.sin(x / 170 + seed) * 9 + (random() * 2 - 1) * 5}`);
  return (
    <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className={`block h-6 w-full sm:h-10 ${flip ? 'rotate-180' : ''} ${className}`} aria-hidden="true">
      <path d={`M0 48L${pts.join('L')}L1440 48Z`} style={{ fill: 'var(--wash)' }} filter="url(#ink-edge)" />
    </svg>
  );
}

/** A low mountain ridge in wash, used along the top of the footer. */
export function FooterRidge({ className = '' }: ArtProps) {
  const ridgeA = 'M0 120L0 78L120 64L210 30L260 52L360 18L430 56L520 40L600 70L700 34L790 60L880 26L960 58L1060 44L1150 72L1250 36L1340 60L1440 48L1440 120Z';
  const ridgeB = 'M0 120L0 96L140 86L260 70L380 88L520 66L640 90L760 74L900 92L1020 70L1160 90L1300 76L1440 88L1440 120Z';
  return (
    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className={`block h-16 w-full sm:h-24 ${className}`} aria-hidden="true">
      <path d={ridgeA} className="mist-2" filter="url(#ink-edge)" />
      <path d={ridgeB} style={{ fill: 'var(--wash)' }} filter="url(#ink-edge)" />
    </svg>
  );
}

/**
 * Architectural Zen header bottom border: a double-rule shoji sill with tapered sumi-e brush lines
 * flanking a small traditional cinnabar hishi (diamond) crest and crisp corner end-ticks.
 */
export function HeaderRule({ className = '' }: ArtProps) {
  const leftStroke = brush([[4, 6.5], [180, 5.2], [380, 5.8], [592, 6.2]], {
    width: 3.4, seed: 81, pressIn: 0.14, liftOff: 0.42, headWidth: 0.12, tailWidth: 0.16, tremor: 0.14, detail: 12,
  });
  const rightStroke = brush([[4, 6.2], [210, 5.6], [420, 5.2], [592, 6.5]], {
    width: 3.4, seed: 89, pressIn: 0.42, liftOff: 0.14, headWidth: 0.16, tailWidth: 0.12, tremor: 0.14, detail: 12,
  });
  return (
    <div className={`wrap ${className}`} aria-hidden="true">
      <div className="zen-rule-fade" />
      <div className="mt-[3px] flex items-center gap-3">
        <span className="h-1.5 w-px shrink-0 bg-line" />
        <svg viewBox="0 0 600 12" preserveAspectRatio="none" className="block h-2.5 min-w-0 flex-1 opacity-55">
          <path d={leftStroke} className="ink" filter="url(#ink-dry)" />
        </svg>
        <svg viewBox="0 0 24 12" className="h-2.5 w-5 shrink-0">
          <path d="M12 1.2L17.2 6 12 10.8 6.8 6Z" fill="none" stroke="var(--line)" strokeWidth="1.2" />
          <path d="M12 3.4L14.6 6 12 8.6 9.4 6Z" className="seal-fill" />
          <circle cx="2" cy="6" r="1.1" fill="var(--line)" />
          <circle cx="22" cy="6" r="1.1" fill="var(--line)" />
        </svg>
        <svg viewBox="0 0 600 12" preserveAspectRatio="none" className="block h-2.5 min-w-0 flex-1 opacity-55">
          <path d={rightStroke} className="ink" filter="url(#ink-dry)" />
        </svg>
        <span className="h-1.5 w-px shrink-0 bg-line" />
      </div>
    </div>
  );
}

/**
 * Soft sumi-e mountain and drifting mist backdrop for the hero and opening bands.
 * Uses only the site's mist tokens so it stays whisper-quiet behind typography in both themes.
 */
export function MountainBackdrop({ className = '' }: ArtProps) {
  const farRange = ridge(
    [[0, 210], [130, 152], [270, 174], [430, 102], [580, 150], [740, 88], [910, 146], [1080, 112], [1260, 158], [1440, 134]],
    320, 91, 3,
  );
  const nearRange = ridge(
    [[0, 260], [190, 206], [350, 232], [540, 172], [720, 218], [890, 168], [1070, 212], [1280, 186], [1440, 224]],
    320, 97, 2.5,
  );
  const sunArc = brush(arc(1180, 92, 54, -75, 245, 16, 0.02, 103), {
    width: 3.5, seed: 103, liftOff: 0.55, headWidth: 1.1, tailWidth: 0.08,
  });
  return (
    <svg
      viewBox="0 0 1440 320"
      preserveAspectRatio="xMidYMax slice"
      className={`zen-bg-art pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <path d={sunArc} className="ink" opacity=".16" filter="url(#ink-dry)" />
      <path d={farRange} className="mist-1" opacity=".6" filter="url(#ink-edge)" />
      <g className="mist-drift">
        <path d={blob(460, 195, 360, 34, 107, 0.18, 10)} className="paper" opacity=".68" filter="url(#mist-soft)" />
      </g>
      <path d={nearRange} className="mist-2" opacity=".36" filter="url(#ink-edge)" />
      <g className="mist-drift" style={{ animationDuration: '34s', animationDirection: 'alternate-reverse' }}>
        <path d={blob(980, 242, 420, 38, 113, 0.2, 11)} className="paper" opacity=".76" filter="url(#mist-soft)" />
      </g>
    </svg>
  );
}

/**
 * A quiet sumi-e pine bough entering from a corner edge, used as a subtle scroll-margin watermark.
 */
export function PineBough({ className = '', flip = false, seed = 67 }: ArtProps & { flip?: boolean; seed?: number }) {
  const random = rng(seed);
  const mainBranch = brush([[0, 62], [86, 78], [182, 112], [278, 134], [344, 142]], {
    width: 10, seed, pressIn: 0.04, liftOff: 0.58, headWidth: 1.15, tailWidth: 0.12, tremor: 0.18,
  });
  const twigA = brush([[104, 82], [150, 56], [202, 44]], {
    width: 5, seed: seed + 1, liftOff: 0.62, tailWidth: 0.1,
  });
  const twigB = brush([[188, 114], [228, 152], [272, 174]], {
    width: 4.5, seed: seed + 2, liftOff: 0.62, tailWidth: 0.1,
  });
  const clusters: [number, number, number][] = [
    [202, 44, 34],
    [152, 60, 26],
    [280, 134, 38],
    [338, 142, 28],
    [268, 172, 30],
  ];
  const needles: string[] = [];
  clusters.forEach(([cx, cy, r], cIdx) => {
    const count = 16;
    for (let i = 0; i < count; i++) {
      const angle = Math.PI * (1.02 + 0.96 * (i / (count - 1))) + (random() - 0.5) * 0.22;
      const len = r * (0.72 + random() * 0.48);
      const sx = cx + (random() - 0.5) * r * 0.35;
      const sy = cy + (random() - 0.5) * r * 0.16;
      needles.push(brush([[sx, sy], [sx + Math.cos(angle) * len, sy + Math.sin(angle) * len * 0.58]], {
        width: 2.2, seed: seed + cIdx * 20 + i, pressIn: 0.1, liftOff: 0.7, headWidth: 0.85, tailWidth: 0.04, detail: 5,
      }));
    }
  });
  return (
    <svg
      viewBox="0 0 380 220"
      className={`zen-bg-art pointer-events-none select-none ${flip ? '-scale-x-100' : ''} ${className}`}
      aria-hidden="true"
    >
      {clusters.map(([cx, cy, r], i) => (
        <path key={i} d={blob(cx, cy - r * 0.12, r * 0.9, r * 0.42, seed + i * 7, 0.2, 9, 0.4)} className="mist-3" opacity=".45" filter="url(#ink-edge)" />
      ))}
      <path d={mainBranch} className="ink" filter="url(#ink-edge)" />
      <path d={twigA} className="ink" />
      <path d={twigB} className="ink" />
      <path d={needles.join('')} className="ink" />
    </svg>
  );
}

/**
 * A windswept sumi-e Japanese bonsai tree in a low ceramic tray.
 * Built from curved brush strokes and layered pine-needle pads for calm Zen backdrops.
 */
export function BonsaiTree({ className = '', flip = false, seed = 131 }: ArtProps & { flip?: boolean; seed?: number }) {
  const random = rng(seed);
  const trunk = brush([[164, 260], [148, 224], [178, 184], [202, 146], [170, 108], [186, 78]], {
    width: 19, seed, pressIn: 0.04, liftOff: 0.45, headWidth: 1.25, tailWidth: 0.24, tremor: 0.2,
  });
  const branchLeft = brush([[168, 198], [122, 188], [76, 178]], {
    width: 9, seed: seed + 1, liftOff: 0.62, tailWidth: 0.14, tremor: 0.18,
  });
  const branchRight = brush([[190, 162], [242, 152], [292, 166]], {
    width: 9.5, seed: seed + 2, liftOff: 0.6, tailWidth: 0.14, tremor: 0.18,
  });
  const branchUpperLeft = brush([[178, 124], [130, 114], [94, 116]], {
    width: 7, seed: seed + 3, liftOff: 0.65, tailWidth: 0.12,
  });
  const branchUpperRight = brush([[180, 94], [224, 90], [254, 98]], {
    width: 6.5, seed: seed + 4, liftOff: 0.65, tailWidth: 0.12,
  });
  const ground = brush([[44, 302], [180, 299], [316, 303]], {
    width: 4.5, seed: seed + 5, pressIn: 0.15, liftOff: 0.45, headWidth: 0.12, tailWidth: 0.1,
  });
  const rim = brush([[84, 263], [172, 261], [260, 263]], {
    width: 5.5, seed: seed + 6, pressIn: 0.08, liftOff: 0.12, headWidth: 0.7, tailWidth: 0.7,
  });
  const pads: [number, number, number][] = [
    [186, 72, 42],
    [98, 112, 36],
    [252, 96, 34],
    [76, 172, 42],
    [290, 162, 44],
    [134, 152, 28],
    [224, 134, 30],
  ];
  const needles: string[] = [];
  pads.forEach(([cx, cy, r], pIdx) => {
    const count = 18;
    for (let i = 0; i < count; i++) {
      const angle = Math.PI * (1.06 + 0.88 * (i / (count - 1))) + (random() - 0.5) * 0.2;
      const len = r * (0.68 + random() * 0.46);
      const sx = cx + (random() - 0.5) * r * 0.55;
      const sy = cy + (random() - 0.5) * r * 0.14;
      needles.push(brush([[sx, sy], [sx + Math.cos(angle) * len, sy + Math.sin(angle) * len * 0.52]], {
        width: 2.1, seed: seed + pIdx * 24 + i, pressIn: 0.1, liftOff: 0.72, headWidth: 0.85, tailWidth: 0.04, detail: 5,
      }));
    }
  });
  return (
    <svg
      viewBox="0 0 360 320"
      className={`zen-bg-art pointer-events-none select-none ${flip ? '-scale-x-100' : ''} ${className}`}
      aria-hidden="true"
    >
      {/* Ceramic bonsai tray and soil mound */}
      <path d={blob(172, 258, 66, 12, seed + 8, 0.16, 10, 0.5)} className="mist-3" opacity=".65" filter="url(#ink-edge)" />
      <path d="M96 266L248 266L236 293L108 293Z" className="mist-3" opacity=".82" filter="url(#ink-edge)" />
      <path d="M114 293L128 293L125 299L116 299ZM216 293L230 293L228 299L219 299Z" className="ink" opacity=".7" />
      <path d={rim} className="ink" opacity=".75" filter="url(#ink-edge)" />
      <path d={ground} className="ink" opacity=".45" filter="url(#ink-dry)" />
      {/* Trunk, boughs, wash pads and fine pine needles */}
      <path d={trunk} className="ink" filter="url(#ink-edge)" />
      <path d={branchLeft} className="ink" />
      <path d={branchRight} className="ink" />
      <path d={branchUpperLeft} className="ink" />
      <path d={branchUpperRight} className="ink" />
      {pads.map(([cx, cy, r], i) => (
        <path key={i} d={blob(cx, cy - r * 0.1, r * 0.96, r * 0.4, seed + 20 + i * 5, 0.18, 10, 0.5)} className="mist-3" opacity=".55" filter="url(#ink-edge)" />
      ))}
      <path d={needles.join('')} className="ink" />
    </svg>
  );
}

/**
 * A serene three-tiered Japanese pagoda temple emerging from mountain mist.
 * Sweeping curved eaves (sori), slender spire (sōrin) and colonnade base in layered ink wash.
 */
export function JapaneseTemple({ className = '', flip = false, seed = 151 }: ArtProps & { flip?: boolean; seed?: number }) {
  const spire = brush([[210, 22], [210, 74]], { width: 4, seed, pressIn: 0.1, liftOff: 0.05, headWidth: 0.35, tailWidth: 1.1 });
  const eave1 = brush([[142, 106], [176, 98], [210, 72], [244, 98], [278, 106]], { width: 7, seed: seed + 1, pressIn: 0.12, liftOff: 0.12, headWidth: 0.3, tailWidth: 0.3 });
  const eave2 = brush([[114, 174], [160, 162], [210, 134], [260, 162], [306, 174]], { width: 8, seed: seed + 2, pressIn: 0.12, liftOff: 0.12, headWidth: 0.3, tailWidth: 0.3 });
  const eave3 = brush([[84, 246], [144, 232], [210, 200], [276, 232], [336, 246]], { width: 9, seed: seed + 3, pressIn: 0.12, liftOff: 0.12, headWidth: 0.3, tailWidth: 0.3 });
  const terrace = brush([[66, 304], [210, 301], [354, 304]], { width: 6, seed: seed + 4, pressIn: 0.12, liftOff: 0.25, headWidth: 0.2, tailWidth: 0.18 });
  const hillBack = ridge([[0, 290], [64, 248], [136, 266], [230, 228], [320, 256], [420, 236]], 340, seed + 5, 2.5);
  return (
    <svg
      viewBox="0 0 420 340"
      className={`zen-bg-art pointer-events-none select-none ${flip ? '-scale-x-100' : ''} ${className}`}
      aria-hidden="true"
    >
      {/* Distant hill & misty glow */}
      <path d={hillBack} className="mist-2" opacity=".55" filter="url(#ink-edge)" />
      {/* Spire (sōrin) and rings */}
      <path d={spire} className="ink" />
      <path d="M204 42H216M203 50H217M204 58H216" stroke="var(--ink-art)" strokeWidth="2.2" strokeLinecap="round" opacity=".8" />
      {/* Tier 1: roof & upper chamber */}
      <path d="M210 72Q182 95 142 106Q178 109 210 106Q242 109 278 106Q238 95 210 72Z" className="ink" opacity=".82" filter="url(#ink-edge)" />
      <path d={eave1} className="ink" />
      <rect x="178" y="106" width="64" height="32" className="mist-3" opacity=".8" />
      <path d="M188 106V138M210 106V138M232 106V138" stroke="var(--ink-art)" strokeWidth="2.2" opacity=".55" />
      {/* Tier 2: roof & middle chamber */}
      <path d="M210 134Q170 160 114 174Q164 178 210 174Q256 178 306 174Q250 160 210 134Z" className="ink" opacity=".85" filter="url(#ink-edge)" />
      <path d={eave2} className="ink" />
      <rect x="160" y="174" width="100" height="36" className="mist-3" opacity=".8" />
      <path d="M174 174V210M198 174V210M222 174V210M246 174V210" stroke="var(--ink-art)" strokeWidth="2.4" opacity=".55" />
      {/* Tier 3: broad lower roof & colonnade */}
      <path d="M210 200Q158 230 84 246Q150 251 210 246Q270 251 336 246Q262 230 210 200Z" className="ink" opacity=".88" filter="url(#ink-edge)" />
      <path d={eave3} className="ink" />
      <rect x="136" y="246" width="148" height="54" className="mist-3" opacity=".72" />
      <path d="M150 246V300M178 246V300M210 246V300M242 246V300M270 246V300" stroke="var(--ink-art)" strokeWidth="2.8" opacity=".6" />
      {/* Stone terrace and soft mist veil */}
      <path d={terrace} className="ink" opacity=".7" filter="url(#ink-dry)" />
      <path d={blob(210, 308, 170, 24, seed + 9, 0.2, 10)} className="paper" opacity=".52" filter="url(#mist-soft)" />
    </svg>
  );
}

/**
 * A traditional Japanese stone garden lantern (tōrō) in sumi-e ink wash.
 */
export function StoneLantern({ className = '', seed = 173 }: ArtProps & { seed?: number }) {
  const cap = brush([[34, 86], [62, 76], [90, 56], [118, 76], [146, 86]], {
    width: 7, seed, pressIn: 0.15, liftOff: 0.15, headWidth: 0.35, tailWidth: 0.35,
  });
  const baseLine = brush([[34, 242], [90, 240], [146, 243]], {
    width: 4.5, seed: seed + 1, pressIn: 0.15, liftOff: 0.35, headWidth: 0.15, tailWidth: 0.12,
  });
  return (
    <svg viewBox="0 0 180 260" className={`zen-bg-art pointer-events-none select-none ${className}`} aria-hidden="true">
      {/* Finial (hōju) and flared umbrella roof (kasa) */}
      <path d="M90 36C95 44 96 51 90 56C84 51 85 44 90 36Z" className="ink" opacity=".82" />
      <path d="M90 56Q66 74 34 86Q64 90 90 88Q116 90 146 86Q114 74 90 56Z" className="ink" opacity=".82" filter="url(#ink-edge)" />
      <path d={cap} className="ink" />
      {/* Firebox (hibukuro) with soft glowing window */}
      <rect x="64" y="88" width="52" height="40" className="mist-3" opacity=".85" filter="url(#ink-edge)" />
      <rect x="76" y="96" width="28" height="24" rx="2" className="paper" opacity=".75" />
      <path d="M64 88V128M116 88V128" stroke="var(--ink-art)" strokeWidth="2.8" opacity=".65" />
      {/* Pedestal (chūdai), pillar (sao), and stone base (kiso) */}
      <path d="M54 128L126 128L116 142L64 142Z" className="ink" opacity=".78" filter="url(#ink-edge)" />
      <path d="M77 142L103 142L107 216L73 216Z" className="mist-3" opacity=".85" filter="url(#ink-edge)" />
      <path d="M56 216L124 216L134 238L46 238Z" className="ink" opacity=".75" filter="url(#ink-edge)" />
      <path d={baseLine} className="ink" opacity=".45" filter="url(#ink-dry)" />
    </svg>
  );
}

/**
 * Slender sumi-e bamboo stalks with segmented nodes and fluttering ink leaves.
 */
export function BambooGrove({ className = '', flip = false, seed = 191 }: ArtProps & { flip?: boolean; seed?: number }) {
  const stalks: { pts: Pt[]; width: number; nodes: Pt[] }[] = [
    { pts: [[64, 354], [70, 260], [78, 168], [88, 66], [96, 12]], width: 9, nodes: [[69, 272], [75, 196], [82, 120], [90, 52]] },
    { pts: [[118, 354], [116, 250], [112, 146], [106, 36]], width: 7, nodes: [[117, 268], [114, 186], [110, 106]] },
    { pts: [[164, 354], [174, 264], [188, 172], [204, 86]], width: 6, nodes: [[172, 278], [182, 206], [194, 134]] },
  ];
  const leaves: Pt[][] = [
    [[82, 120], [116, 102], [148, 96]],
    [[82, 120], [118, 118], [150, 126]],
    [[82, 120], [52, 108], [26, 114]],
    [[110, 106], [142, 84], [172, 74]],
    [[110, 106], [82, 86], [56, 76]],
    [[182, 206], [216, 188], [244, 184]],
    [[182, 206], [212, 206], [238, 218]],
    [[194, 134], [224, 114], [248, 108]],
    [[75, 196], [46, 184], [20, 190]],
    [[75, 196], [48, 204], [26, 220]],
  ];
  return (
    <svg
      viewBox="0 0 260 360"
      className={`zen-bg-art pointer-events-none select-none ${flip ? '-scale-x-100' : ''} ${className}`}
      aria-hidden="true"
    >
      {stalks.map((s, i) => (
        <g key={i}>
          <path d={brush(s.pts, { width: s.width, seed: seed + i * 3, pressIn: 0.04, liftOff: 0.25, headWidth: 1.05, tailWidth: 0.55, tremor: 0.04 })} className="ink" opacity={i === 0 ? '.8' : '.62'} filter="url(#ink-edge)" />
          {s.nodes.map(([nx, ny], j) => (
            <path key={j} d={`M${nx - s.width * 0.72} ${ny}Q${nx} ${ny + 2.4} ${nx + s.width * 0.72} ${ny}`} fill="none" stroke="var(--ink-art)" strokeWidth="2.4" strokeLinecap="round" opacity=".9" />
          ))}
        </g>
      ))}
      {leaves.map((pts, i) => (
        <path key={i} d={brush(pts, { width: 7.5, seed: seed + 30 + i, pressIn: 0.22, liftOff: 0.65, headWidth: 0.15, tailWidth: 0.03, tremor: 0.08 })} className="ink" opacity={i % 2 === 0 ? '.78' : '.58'} />
      ))}
    </svg>
  );
}
