// Programmes by age. The owner edits `availability` and `monthlyPrice` most often.
// Weekly class times come from content/timetable.ts (each session lists its programIds).

export type Availability = 'open' | 'waitlist' | 'full';
/** Which pine drawing marks the programme, from a sprout to a broad mountain pine. */
export type GrowthStage = 'sprout' | 'sapling' | 'young-pine' | 'mountain-pine';

export interface Program {
  /** Stable, URL-safe ID. Used in anchors (/programs/#juniors), the timetable filter and references. */
  id: string;
  name: string;
  /** Inclusive age range in years; `max: null` means no upper limit. Ranges must not overlap. */
  ages: { min: number; max: number | null };
  /** Typical class length in minutes. The timetable's own start/end times are the source of truth. */
  minutes: number;
  /** Classes included each week, or 'unlimited'. */
  classesPerWeek: number | 'unlimited';
  /** Monthly membership in whole US dollars. */
  monthlyPrice: number;
  /** open: taking new students · waitlist: enquire to join the list · full: not taking enquiries for now. */
  availability: Availability;
  growthStage: GrowthStage;
  /** Editorial photograph in public/images/. */
  photo: string;
  /** Concise accessible description of the photograph. */
  photoAlt: string;
  summary: string;
  /** 3–5 short points. */
  focus: string[];
  /** What a typical class looks like, in order. */
  classOutline: string[];
}

export const programs: Program[] = [
  {
    id: 'little-pines',
    name: 'Little Pines',
    ages: { min: 4, max: 6 },
    minutes: 40,
    classesPerWeek: 2,
    monthlyPrice: 115,
    availability: 'waitlist',
    growthStage: 'sprout',
    photo: '/images/program-little-pines.jpg',
    photoAlt: 'Three young Little Pines students in white karate uniforms balancing on one foot on wooden floorboards while an instructor guides them',
    summary: 'Balance, listening and big movements, taught through games with a purpose.',
    focus: ['Standing still on cue', 'Falling safely', 'Left and right, high and low', 'Taking turns and waiting well'],
    classOutline: ['Bow in and three still breaths', 'Animal warm-up', 'One new technique, practised as a game', 'Pad work with a partner', 'Bow out and a sticker for the belt chart'],
  },
  {
    id: 'juniors',
    name: 'Juniors',
    ages: { min: 7, max: 12 },
    minutes: 60,
    classesPerWeek: 2,
    monthlyPrice: 135,
    availability: 'open',
    growthStage: 'sapling',
    photo: '/images/program-juniors.jpg',
    photoAlt: 'Four Juniors students in white karategi with yellow, orange and green belts holding a synchronized kata stance in sunlit training hall',
    summary: 'Clean basics, first kata and controlled partner drills, with a stripe on the belt for every milestone.',
    focus: ['Stances, blocks and straight punches', 'First kata, learned move by move', 'Light-contact drills with pads', 'Speaking up with a clear kiai'],
    classOutline: ['Bow in and warm-up', 'Basics across the floor', 'Kata in small groups', 'Partner drill with pads', 'Stretch, precepts and bow out'],
  },
  {
    id: 'teens',
    name: 'Teens',
    ages: { min: 13, max: 17 },
    minutes: 60,
    classesPerWeek: 3,
    monthlyPrice: 140,
    availability: 'open',
    growthStage: 'young-pine',
    photo: '/images/program-teens.jpg',
    photoAlt: 'Two teenage karate students in green and blue belts practising controlled pad work and blocks in natural window light',
    summary: 'Real conditioning, kata with intent and supervised sparring for students who want to be challenged.',
    focus: ['Strength and conditioning for growing bodies', 'Kata and what each move is for', 'Controlled kumite with protective gear', 'Assisting in junior classes from green belt'],
    classOutline: ['Bow in and conditioning circuit', 'Combinations on the move', 'Kata and its applications', 'Supervised kumite rounds', 'Cool-down and bow out'],
  },
  {
    id: 'adults',
    name: 'Adults',
    ages: { min: 18, max: null },
    minutes: 90,
    classesPerWeek: 'unlimited',
    monthlyPrice: 150,
    availability: 'open',
    growthStage: 'mountain-pine',
    photo: '/images/program-adults.jpg',
    photoAlt: 'Adult karate students of varying ages and ranks practising kata together on the sunlit wooden dojo floor facing mountain pines',
    summary: 'Every adult class welcomes beginners. Train two nights or six; the fee is the same.',
    focus: ['Technique, taught slowly and precisely', 'Kata as moving meditation', 'Partner drills at your own intensity', 'Mobility for desk-bound joints', 'Sparring only if and when you choose'],
    classOutline: ['Bow in and a minute of quiet sitting', 'Joint mobility and warm-up', 'Basics and combinations', 'Kata or partner work', 'Stretch, precepts and bow out'],
  },
];

export function programById(id: string): Program | undefined {
  return programs.find(program => program.id === id);
}

export function formatAges({ min, max }: Program['ages']): string {
  return max === null ? `${min}+` : `${min}–${max}`;
}

export const availabilityLabel: Record<Availability, string> = {
  open: 'Taking new students',
  waitlist: 'Waitlist: enquire to join',
  full: 'Full for now',
};
