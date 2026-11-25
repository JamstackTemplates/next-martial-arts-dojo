// Four pines sharing one ground line (y = 226 in a 240 × 240 box): a sprout, a sapling, a young pine
// and a broad, wind-shaped mountain pine. Each marks a programme, so the age groups read as growth.
import type { GrowthStage } from '../../content/programs';
import { blob, brush, rng, type Pt } from '../../lib/brush';

/** A fan of needle strokes radiating upward from a branch tip, over a soft wash mass. */
function NeedlePad({ cx, cy, r, seed, dense = 1 }: { cx: number; cy: number; r: number; seed: number; dense?: number }) {
  const random = rng(seed);
  const count = Math.round(20 * dense + r / 2);
  const needles: string[] = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.PI * (1.08 + 0.84 * (i / (count - 1))) + (random() - 0.5) * 0.2;
    const length = r * (0.8 + random() * 0.5);
    const start: Pt = [cx + (random() - 0.5) * r * 0.5, cy + random() * r * 0.12];
    const end: Pt = [start[0] + Math.cos(angle) * length, start[1] + Math.sin(angle) * length * 0.55];
    needles.push(brush([start, end], { width: Math.max(1.6, r / 9), seed: seed + i, pressIn: 0.1, liftOff: 0.7, headWidth: 0.9, tailWidth: 0.02, detail: 6 }));
  }
  return (
    <g>
      <path d={blob(cx, cy - r * 0.18, r * 0.95, r * 0.42, seed, 0.2, 9, 0.5)} className="mist-3" opacity=".55" filter="url(#ink-edge)" />
      <path d={needles.join('')} className="ink" />
    </g>
  );
}

function trunk(points: Pt[], width: number, seed: number) {
  return brush(points, { width, seed, pressIn: 0.02, liftOff: 0.55, headWidth: 1.15, tailWidth: 0.25, tremor: 0.2 });
}

function Ground({ seed, from = 60, to = 180 }: { seed: number; from?: number; to?: number }) {
  return <path d={brush([[from, 227], [(from + to) / 2, 225], [to, 228]], { width: 5, seed, pressIn: 0.1, liftOff: 0.5, tailWidth: 0.1 })} className="ink" filter="url(#ink-dry)" opacity=".8" />;
}

export function Pine({ stage, className = '', sway = false }: { stage: GrowthStage; className?: string; sway?: boolean }) {
  let art;
  if (stage === 'sprout') {
    art = <>
      <path d={trunk([[120, 226], [118, 205], [122, 186]], 5, 3)} className="ink" />
      <NeedlePad cx={121} cy={186} r={16} seed={31} dense={0.8} />
      <NeedlePad cx={113} cy={205} r={10} seed={33} dense={0.6} />
      <Ground seed={4} from={88} to={152} />
    </>;
  } else if (stage === 'sapling') {
    art = <>
      <path d={trunk([[120, 226], [116, 180], [124, 140], [120, 112]], 8, 5)} className="ink" />
      <path d={brush([[118, 176], [100, 170], [84, 160]], { width: 4, seed: 6, liftOff: 0.6 })} className="ink" />
      <path d={brush([[123, 150], [140, 144], [154, 136]], { width: 4, seed: 7, liftOff: 0.6 })} className="ink" />
      <NeedlePad cx={120} cy={112} r={24} seed={41} />
      <NeedlePad cx={84} cy={160} r={18} seed={43} />
      <NeedlePad cx={155} cy={136} r={18} seed={45} />
      <Ground seed={8} from={78} to={162} />
    </>;
  } else if (stage === 'young-pine') {
    art = <>
      <path d={trunk([[118, 226], [112, 180], [122, 130], [114, 84], [120, 56]], 12, 9)} className="ink" />
      <path d={brush([[114, 184], [90, 178], [64, 168]], { width: 6, seed: 10, liftOff: 0.6 })} className="ink" />
      <path d={brush([[120, 140], [150, 132], [176, 120]], { width: 6, seed: 11, liftOff: 0.6 })} className="ink" />
      <path d={brush([[116, 98], [92, 92], [76, 82]], { width: 5, seed: 12, liftOff: 0.6 })} className="ink" />
      <NeedlePad cx={120} cy={56} r={26} seed={51} />
      <NeedlePad cx={76} cy={82} r={22} seed={53} />
      <NeedlePad cx={176} cy={120} r={28} seed={55} />
      <NeedlePad cx={64} cy={168} r={26} seed={57} />
      <NeedlePad cx={138} cy={96} r={18} seed={59} dense={0.7} />
      <Ground seed={12} from={62} to={176} />
    </>;
  } else {
    art = <>
      <path d={trunk([[104, 228], [114, 190], [100, 150], [118, 112], [142, 88], [170, 74]], 18, 13)} className="ink" filter="url(#ink-edge)" />
      <path d={brush([[106, 160], [76, 150], [44, 150], [22, 140]], { width: 8, seed: 14, liftOff: 0.6, tremor: 0.2 })} className="ink" />
      <path d={brush([[116, 116], [90, 100], [62, 96]], { width: 7, seed: 15, liftOff: 0.6 })} className="ink" />
      <path d={brush([[140, 90], [170, 96], [206, 92], [226, 100]], { width: 7, seed: 16, liftOff: 0.6 })} className="ink" />
      <path d={brush([[112, 196], [140, 186], [168, 186]], { width: 6, seed: 17, liftOff: 0.6 })} className="ink" />
      <NeedlePad cx={28} cy={140} r={30} seed={61} />
      <NeedlePad cx={64} cy={98} r={30} seed={63} />
      <NeedlePad cx={170} cy={72} r={36} seed={65} />
      <NeedlePad cx={222} cy={100} r={26} seed={67} />
      <NeedlePad cx={120} cy={56} r={22} seed={69} dense={0.7} />
      <NeedlePad cx={168} cy={186} r={22} seed={71} dense={0.8} />
      <Ground seed={16} from={40} to={200} />
    </>;
  }
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden="true" overflow="visible">
      <g className={sway ? 'pine-sway' : undefined}>{art}</g>
    </svg>
  );
}
