// The belt path, in order from the entry rank to black belt.
export type BeltSwatch = 'white' | 'yellow' | 'orange' | 'green' | 'blue' | 'purple' | 'brown' | 'black';

export interface Belt {
  /** Stable, URL-safe ID (also the anchor on /belts/). */
  id: string;
  /** Colour name as students say it. */
  belt: string;
  /** Rank label, e.g. "9th kyu" or "Shodan". */
  rank: string;
  /** Colour token key; the colours themselves live in app/tailwind.input.css (--belt-*). */
  swatch: BeltSwatch;
  /** Minimum months at the previous rank before an invitation to grade. 0 for the entry rank. */
  minMonths: number;
  /** Minimum classes attended since the last grading. 0 for the entry rank. */
  minClasses: number;
  /** Stripes juniors earn on the previous belt before grading for this one; 0 when not used. */
  juniorStripes: number;
  /** 2–3 things learned at this rank. */
  learn: string[];
  /** Kata introduced at this rank, or '' for the entry rank. */
  kata: string;
}

export const belts: Belt[] = [
  {
    id: 'white', belt: 'White', rank: '10th kyu', swatch: 'white', minMonths: 0, minClasses: 0, juniorStripes: 0,
    learn: ['How to bow, stand and fall', 'The names of the stances', 'Counting to ten in Japanese'], kata: '',
  },
  {
    id: 'yellow', belt: 'Yellow', rank: '9th kyu', swatch: 'yellow', minMonths: 3, minClasses: 24, juniorStripes: 3,
    learn: ['Front stance, low block, straight punch', 'Front kick with control', 'Bowing in and out of partner work'], kata: 'Taikyoku Shodan',
  },
  {
    id: 'orange', belt: 'Orange', rank: '8th kyu', swatch: 'orange', minMonths: 3, minClasses: 24, juniorStripes: 3,
    learn: ['Back stance and knife-hand block', 'Rising block and reverse punch', 'Turning on the spot without losing balance'], kata: 'Heian Shodan',
  },
  {
    id: 'green', belt: 'Green', rank: '7th kyu', swatch: 'green', minMonths: 4, minClasses: 32, juniorStripes: 3,
    learn: ['Combinations on the move', 'First kumite drill: five-step sparring', 'Roundhouse kick'], kata: 'Heian Nidan',
  },
  {
    id: 'blue', belt: 'Blue', rank: '6th kyu', swatch: 'blue', minMonths: 4, minClasses: 32, juniorStripes: 3,
    learn: ['Three-step sparring with a partner', 'Side kick and back kick', 'Breathing with each technique'], kata: 'Heian Sandan',
  },
  {
    id: 'purple', belt: 'Purple', rank: '5th kyu', swatch: 'purple', minMonths: 6, minClasses: 48, juniorStripes: 3,
    learn: ['One-step sparring at full speed with control', 'Kata applications with a partner', 'Leading the warm-up'], kata: 'Heian Yondan',
  },
  {
    id: 'brown', belt: 'Brown', rank: '3rd–1st kyu', swatch: 'brown', minMonths: 6, minClasses: 48, juniorStripes: 0,
    learn: ['Free sparring with judgement and restraint', 'Correcting a junior student kindly', 'Three gradings, each six months apart'], kata: 'Heian Godan, Tekki Shodan',
  },
  {
    id: 'black', belt: 'Black', rank: 'Shodan', swatch: 'black', minMonths: 12, minClasses: 96, juniorStripes: 0,
    learn: ['Teach a beginner class under supervision', 'Perform a chosen kata and explain it', 'Begin again, with better questions'], kata: 'Bassai Dai',
  },
];

/** Total minimum months from white belt to black, for steady training. */
export function minimumMonthsToBlack(list: readonly Belt[] = belts): number {
  // Brown belt is three gradings (3rd, 2nd and 1st kyu), each with the same minimum.
  return list.reduce((sum, belt) => sum + belt.minMonths * (belt.id === 'brown' ? 3 : 1), 0);
}
