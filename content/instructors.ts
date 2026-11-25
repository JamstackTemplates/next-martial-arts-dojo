// The teaching team, in the order shown on the site.
/** Which ink figure is drawn for the instructor. */
export type Stance = 'kiba-dachi' | 'zenkutsu-dachi' | 'kokutsu-dachi' | 'seiza';

export interface Instructor {
  /** Stable, URL-safe ID (also the anchor on /instructors/ and referenced by the timetable). */
  id: string;
  name: string;
  /** Dan rank, e.g. "Godan (5th dan)". */
  rank: string;
  role: string;
  /** Year they began teaching. */
  teachingSince: number;
  /** IDs from content/programs.ts. */
  programIds: string[];
  /** 2–3 sentences. */
  bio: string;
  /** One line, shown in display type. */
  saying: string;
  stance: Stance;
  /** Portrait photograph in public/images/. */
  photo: string;
  /** Concise accessible description of the portrait. */
  photoAlt: string;
}

export const instructors: Instructor[] = [
  {
    id: 'daniel-ishikawa',
    name: 'Daniel Ishikawa',
    rank: 'Godan (5th dan)',
    role: 'Founder and chief instructor',
    teachingSince: 2004,
    programIds: ['adults', 'teens'],
    bio: 'Daniel began karate at nine in Sacramento and opened Still Mountain in 2011 after a decade teaching at university clubs. He teaches the adult kata class and the brown and black belt session on Fridays.',
    saying: 'Slow is how you learn fast.',
    stance: 'kiba-dachi',
    photo: '/images/instructor-daniel.jpg',
    photoAlt: 'Daniel Ishikawa, founder and chief instructor, standing in white karategi and worn black belt inside the timber dojo',
  },
  {
    id: 'rosa-lindqvist',
    name: 'Rosa Lindqvist',
    rank: 'Sandan (3rd dan)',
    role: 'Head of junior and teen programmes',
    teachingSince: 2012,
    programIds: ['juniors', 'teens'],
    bio: 'Rosa competed in kata for eight years before turning to teaching. She runs most junior and teen classes, and the stripe charts on the wall are hers.',
    saying: 'Loud kiai, quiet mind.',
    stance: 'zenkutsu-dachi',
    photo: '/images/instructor-rosa.jpg',
    photoAlt: 'Rosa Lindqvist, head of junior and teen programmes, in white karategi and black belt beside sunlit cedar windows',
  },
  {
    id: 'marcus-bell',
    name: 'Marcus Bell',
    rank: 'Nidan (2nd dan)',
    role: 'Adults, conditioning and kumite',
    teachingSince: 2016,
    programIds: ['adults', 'teens'],
    bio: 'Marcus is a physical therapist by day, which shows in his warm-ups. He teaches the adult fundamentals and kumite classes and the Thursday teen conditioning class.',
    saying: 'Control is the hardest technique.',
    stance: 'kokutsu-dachi',
    photo: '/images/instructor-marcus.jpg',
    photoAlt: 'Marcus Bell, adult fundamentals and kumite instructor, in white karategi and black belt in the sunlit dojo',
  },
  {
    id: 'priya-natarajan',
    name: 'Priya Natarajan',
    rank: 'Shodan (1st dan)',
    role: 'Little Pines lead; former kindergarten teacher',
    teachingSince: 2019,
    programIds: ['little-pines', 'juniors'],
    bio: 'Priya taught kindergarten for eleven years and earned her black belt here in 2019. She leads every Little Pines class and the Saturday family class.',
    saying: 'Everyone can stand still for three breaths.',
    stance: 'seiza',
    photo: '/images/instructor-priya.jpg',
    photoAlt: 'Priya Natarajan, Little Pines lead instructor, smiling warmly in white karategi and black belt in the wooden dojo',
  },
];

export function instructorById(id: string): Instructor | undefined {
  return instructors.find(instructor => instructor.id === id);
}

/** Combined years of teaching, counted at build time. */
export function teachingYears(list: readonly Instructor[] = instructors, year = new Date().getFullYear()): number {
  return list.reduce((sum, person) => sum + Math.max(0, year - person.teachingSince), 0);
}
