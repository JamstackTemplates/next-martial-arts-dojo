// Deterministic ink-brush geometry for the site's SVG artwork. Runs at build time in server components,
// so every stroke is a static filled path: a centre line swept by a brush whose width presses in,
// swells and lifts off, with a seeded tremor so no two strokes are identical but every build is the same.

export type Pt = readonly [number, number];

/** Small seeded PRNG (mulberry32). */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;

/** Catmull-Rom spline through the control points, sampled evenly per segment. */
export function spline(points: readonly Pt[], perSegment = 16): Pt[] {
  if (points.length < 3) {
    const [a, b] = points;
    return Array.from({ length: perSegment + 1 }, (_, i) => {
      const t = i / perSegment;
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t] as Pt;
    });
  }
  const out: Pt[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)], p1 = points[i], p2 = points[i + 1], p3 = points[Math.min(points.length - 1, i + 2)];
    for (let s = 0; s < perSegment; s++) {
      const t = s / perSegment, t2 = t * t, t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(points[points.length - 1]);
  return out;
}

export interface BrushOptions {
  /** Full width at the fullest point. */
  width: number;
  seed?: number;
  /** Fraction of the length spent pressing the brush down. */
  pressIn?: number;
  /** Fraction of the length spent lifting off. Long lift-offs give a hair-thin tail. */
  liftOff?: number;
  /** Width left at the very end, as a fraction (0 = a point, 0.4 = a blunt, dry end). */
  tailWidth?: number;
  /** Width at the very start, as a fraction. A loaded brush lands as a blob (e.g. 1.15). */
  headWidth?: number;
  /** Tremor in the width, as a fraction of width. */
  tremor?: number;
  /** Samples per control-point segment. */
  detail?: number;
}

/** A tapering brush stroke along the control points, as an SVG path `d`. */
export function brush(points: readonly Pt[], options: BrushOptions): string {
  const { width, seed = 1, pressIn = 0.12, liftOff = 0.35, tailWidth = 0.05, headWidth = 0.7, tremor = 0.08, detail = 16 } = options;
  const random = rng(seed);
  const line = spline(points, detail);
  const n = line.length;
  // Cumulative length, so the profile follows distance rather than sample index.
  const lengths = [0];
  for (let i = 1; i < n; i++) lengths.push(lengths[i - 1] + Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]));
  const total = lengths[n - 1] || 1;
  // Low-frequency tremor: a few random knots, interpolated.
  const knots = Array.from({ length: 7 }, () => 1 + (random() * 2 - 1) * tremor);
  const wobble = (t: number) => {
    const x = t * (knots.length - 1), i = Math.min(knots.length - 2, Math.floor(x)), f = x - i;
    return knots[i] * (1 - f) + knots[i + 1] * f;
  };
  const profile = (t: number) => {
    let w = 1;
    if (t < pressIn) w = headWidth + (1 - headWidth) * Math.sin((t / pressIn) * Math.PI / 2);
    if (t > 1 - liftOff) {
      const u = Math.min(1, Math.max(0, (t - (1 - liftOff)) / liftOff));
      w = Math.min(w, tailWidth + (1 - tailWidth) * Math.max(0, Math.cos(u * Math.PI / 2)) ** 1.4);
    }
    return Math.max(0.2, (width / 2) * w * wobble(t));
  };
  const left: string[] = [], right: string[] = [];
  for (let i = 0; i < n; i++) {
    const a = line[Math.max(0, i - 1)], b = line[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    dx /= len; dy /= len;
    const half = profile(lengths[i] / total);
    const [x, y] = line[i];
    left.push(`${r1(x - dy * half)} ${r1(y + dx * half)}`);
    right.push(`${r1(x + dy * half)} ${r1(y - dx * half)}`);
  }
  return `M${left.join('L')}L${right.reverse().join('L')}Z`;
}

/** Points along an arc (degrees, clockwise from 3 o'clock), with an optional radius drift. */
export function arc(cx: number, cy: number, radius: number, fromDeg: number, toDeg: number, steps = 12, drift = 0, seed = 3): Pt[] {
  const random = rng(seed);
  return Array.from({ length: steps + 1 }, (_, i) => {
    const angle = ((fromDeg + (toDeg - fromDeg) * (i / steps)) * Math.PI) / 180;
    const r = radius * (1 + (random() * 2 - 1) * drift);
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r] as Pt;
  });
}

/** An irregular closed blob (pine needle pads, rocks, ink dabs) as a smooth path `d`. */
export function blob(cx: number, cy: number, rx: number, ry: number, seed = 5, roughness = 0.18, lobes = 11, flatBottom = 0): string {
  const random = rng(seed);
  const pts: Pt[] = Array.from({ length: lobes }, (_, i) => {
    const angle = (i / lobes) * Math.PI * 2;
    const k = 1 + (random() * 2 - 1) * roughness;
    let y = Math.sin(angle) * ry * k;
    if (flatBottom && y > 0) y *= 1 - flatBottom;
    return [cx + Math.cos(angle) * rx * k, cy + y] as Pt;
  });
  // Closed spline: wrap the neighbours around, then drop the duplicated ends.
  const wrapped = [pts[lobes - 1], ...pts, pts[0], pts[1]];
  const loop = spline(wrapped, 6).slice(6, 6 + lobes * 6);
  return `M${loop.map(([x, y]) => `${r1(x)} ${r1(y)}`).join('L')}Z`;
}

/** A ridge line for wash mountains: polygon from a list of [x, y] peaks down to a baseline. */
export function ridge(peaks: readonly Pt[], baseline: number, seed = 7, jitter = 4): string {
  const random = rng(seed);
  const line = spline(peaks, 10).map(([x, y]) => [x, y + (random() * 2 - 1) * jitter] as Pt);
  const first = line[0], last = line[line.length - 1];
  return `M${r1(first[0])} ${baseline}L${line.map(([x, y]) => `${r1(x)} ${r1(y)}`).join('L')}L${r1(last[0])} ${baseline}Z`;
}
