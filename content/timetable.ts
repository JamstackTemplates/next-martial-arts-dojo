// The weekly class timetable. The owner edits this file most often.
// All classes use the one main mat, so sessions on the same day must not overlap, and every session must
// fall inside that day's open hours in content/business.ts. Times are local 24-hour HH:MM, same day only.

export const CLASS_DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
export type ClassDay = typeof CLASS_DAYS[number];
export type Level = 'all' | 'beginners' | 'coloured' | 'advanced';

export interface Session {
  /** `<day>-<HHMM start>-<slug>`, e.g. `tue-1915-kumite`. Must match `day` and `start`. */
  id: string;
  day: ClassDay;
  start: string;
  end: string;
  title: string;
  /** One or more IDs from content/programs.ts; the session shows under each in the filter. */
  programIds: string[];
  level: Level;
  /** ID from content/instructors.ts. */
  instructorId: string;
}

export const sessions: Session[] = [
  { id: 'mon-1545-little-pines', day: 'mon', start: '15:45', end: '16:25', title: 'Little Pines', programIds: ['little-pines'], level: 'all', instructorId: 'priya-natarajan' },
  { id: 'mon-1630-juniors', day: 'mon', start: '16:30', end: '17:30', title: 'Juniors', programIds: ['juniors'], level: 'all', instructorId: 'rosa-lindqvist' },
  { id: 'mon-1740-teens', day: 'mon', start: '17:40', end: '18:40', title: 'Teens', programIds: ['teens'], level: 'all', instructorId: 'rosa-lindqvist' },
  { id: 'mon-1900-adults', day: 'mon', start: '19:00', end: '20:30', title: 'Adults: all ranks', programIds: ['adults'], level: 'all', instructorId: 'daniel-ishikawa' },

  { id: 'tue-1630-juniors', day: 'tue', start: '16:30', end: '17:30', title: 'Juniors', programIds: ['juniors'], level: 'all', instructorId: 'priya-natarajan' },
  { id: 'tue-1800-fundamentals', day: 'tue', start: '18:00', end: '19:00', title: 'Adults: fundamentals', programIds: ['adults'], level: 'beginners', instructorId: 'marcus-bell' },
  { id: 'tue-1915-kumite', day: 'tue', start: '19:15', end: '20:30', title: 'Adults: kumite', programIds: ['adults', 'teens'], level: 'coloured', instructorId: 'marcus-bell' },

  { id: 'wed-1545-little-pines', day: 'wed', start: '15:45', end: '16:25', title: 'Little Pines', programIds: ['little-pines'], level: 'all', instructorId: 'priya-natarajan' },
  { id: 'wed-1630-juniors', day: 'wed', start: '16:30', end: '17:30', title: 'Juniors', programIds: ['juniors'], level: 'all', instructorId: 'rosa-lindqvist' },
  { id: 'wed-1740-teens', day: 'wed', start: '17:40', end: '18:40', title: 'Teens', programIds: ['teens'], level: 'all', instructorId: 'rosa-lindqvist' },
  { id: 'wed-1900-kata', day: 'wed', start: '19:00', end: '20:30', title: 'Adults: kata', programIds: ['adults'], level: 'all', instructorId: 'daniel-ishikawa' },

  { id: 'thu-1630-juniors', day: 'thu', start: '16:30', end: '17:30', title: 'Juniors', programIds: ['juniors'], level: 'all', instructorId: 'rosa-lindqvist' },
  { id: 'thu-1740-conditioning', day: 'thu', start: '17:40', end: '18:40', title: 'Teens: conditioning', programIds: ['teens'], level: 'all', instructorId: 'marcus-bell' },
  { id: 'thu-1900-adults', day: 'thu', start: '19:00', end: '20:30', title: 'Adults: all ranks', programIds: ['adults'], level: 'all', instructorId: 'marcus-bell' },

  { id: 'fri-1545-little-pines', day: 'fri', start: '15:45', end: '16:25', title: 'Little Pines', programIds: ['little-pines'], level: 'all', instructorId: 'priya-natarajan' },
  { id: 'fri-1630-juniors', day: 'fri', start: '16:30', end: '17:30', title: 'Juniors', programIds: ['juniors'], level: 'all', instructorId: 'rosa-lindqvist' },
  { id: 'fri-1800-advanced', day: 'fri', start: '18:00', end: '19:30', title: 'Brown and black belts', programIds: ['adults', 'teens'], level: 'advanced', instructorId: 'daniel-ishikawa' },

  { id: 'sat-0830-little-pines', day: 'sat', start: '08:30', end: '09:10', title: 'Little Pines', programIds: ['little-pines'], level: 'all', instructorId: 'priya-natarajan' },
  { id: 'sat-0915-juniors', day: 'sat', start: '09:15', end: '10:15', title: 'Juniors', programIds: ['juniors'], level: 'all', instructorId: 'rosa-lindqvist' },
  { id: 'sat-1030-family', day: 'sat', start: '10:30', end: '11:30', title: 'Family class', programIds: ['little-pines', 'juniors', 'adults'], level: 'all', instructorId: 'priya-natarajan' },
  { id: 'sat-1145-adults', day: 'sat', start: '11:45', end: '13:00', title: 'Adults: all ranks', programIds: ['adults'], level: 'all', instructorId: 'daniel-ishikawa' },
];

export const levelLabel: Record<Level, string> = {
  all: 'All ranks welcome',
  beginners: 'Beginners and white belts',
  coloured: 'Coloured belts',
  advanced: 'Brown and black belts',
};

export const dayLabel: Record<ClassDay | 'sun', string> = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
};
