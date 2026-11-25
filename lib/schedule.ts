// Timetable helpers. Pure functions: the browser supplies the clock; static output never computes "now".
import { CLASS_DAYS, dayLabel, type ClassDay, type Session } from '../content/timetable.ts';

/** Monday-first week, matching lib/hours.ts. */
export const WEEK = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
export type WeekDay = typeof WEEK[number];

const clock = /^([01]\d|2[0-3]):[0-5]\d$/;
export const isClock = (value: string) => clock.test(value);
export const toMinutes = (value: string) => Number(value.slice(0, 2)) * 60 + Number(value.slice(3));

/** "16:30" → "4:30 pm"; "09:00" → "9 am". */
export function formatTime(value: string): string {
  const total = toMinutes(value);
  const hour = Math.floor(total / 60);
  const minute = total % 60;
  const suffix = hour < 12 ? 'am' : 'pm';
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return minute === 0 ? `${twelve} ${suffix}` : `${twelve}:${String(minute).padStart(2, '0')} ${suffix}`;
}

export function sessionsOn(day: WeekDay, list: readonly Session[]): Session[] {
  return list.filter(session => session.day === day).sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
}

/** Sessions that include a programme, in week order. 'all' returns everything. */
export function sessionsFor(programId: string, list: readonly Session[]): Session[] {
  const chosen = programId === 'all' ? list : list.filter(session => session.programIds.includes(programId));
  return [...chosen].sort((a, b) =>
    CLASS_DAYS.indexOf(a.day) - CLASS_DAYS.indexOf(b.day) || toMinutes(a.start) - toMinutes(b.start));
}

/** Reads a timetable filter from a URL hash such as "#teens"; unknown values fall back to 'all'. */
export function filterFromHash(hash: string, programIds: readonly string[]): string {
  const value = decodeURIComponent(hash.replace(/^#/, '')).trim();
  return programIds.includes(value) ? value : 'all';
}

/** Day and minute of the week in the business zone, or null when the zone is unset or invalid. */
export function zonedNow(timeZone: string, now: Date): { day: WeekDay; minutes: number } | null {
  if (!timeZone) return null;
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(now);
  } catch {
    return null;
  }
  const part = (type: string) => parts.find(entry => entry.type === type)?.value ?? '';
  const day = part('weekday').toLowerCase().slice(0, 3) as WeekDay;
  if (!WEEK.includes(day)) return null;
  return { day, minutes: Number(part('hour')) * 60 + Number(part('minute')) };
}

export type MatStatus =
  | { kind: 'unknown' }
  /** A class is running: start inclusive, end exclusive. */
  | { kind: 'on'; session: Session }
  /** A later class today. */
  | { kind: 'next'; session: Session }
  /** Classes ran today, or none were scheduled; the next one is on a later day. */
  | { kind: 'done' | 'rest'; session: Session; day: WeekDay };

export function matStatus(list: readonly Session[], timeZone: string, now: Date): MatStatus {
  const here = zonedNow(timeZone, now);
  if (!here || list.length === 0) return { kind: 'unknown' };
  const today = sessionsOn(here.day, list);
  const running = today.find(s => here.minutes >= toMinutes(s.start) && here.minutes < toMinutes(s.end));
  if (running) return { kind: 'on', session: running };
  const later = today.find(s => toMinutes(s.start) > here.minutes);
  if (later) return { kind: 'next', session: later };
  const index = WEEK.indexOf(here.day);
  for (let offset = 1; offset <= 7; offset++) {
    const day = WEEK[(index + offset) % 7];
    const first = sessionsOn(day, list)[0];
    if (first) return { kind: today.length ? 'done' : 'rest', session: first, day };
  }
  return { kind: 'unknown' };
}

/** Neutral copy for static HTML, no-JS visitors and an unknown zone. */
export const NEUTRAL_STATUS = 'Classes run Monday to Saturday. See the timetable.';

export function matStatusLabel(status: MatStatus): string {
  switch (status.kind) {
    case 'on': return `On the mat now: ${status.session.title} until ${formatTime(status.session.end)}`;
    case 'next': return `Next: ${status.session.title} at ${formatTime(status.session.start)}`;
    case 'done': return `No more classes today; next is ${dayLabel[status.day]} ${formatTime(status.session.start)} (${status.session.title})`;
    case 'rest': return `Rest day. Next class: ${dayLabel[status.day]} ${formatTime(status.session.start)} (${status.session.title})`;
    default: return NEUTRAL_STATUS;
  }
}

/** Today and the following day in the business zone, for the home page's "this week" strip. */
export function todayAndTomorrow(timeZone: string, now: Date): [WeekDay, WeekDay] | null {
  const here = zonedNow(timeZone, now);
  if (!here) return null;
  return [here.day, WEEK[(WEEK.indexOf(here.day) + 1) % 7]];
}

export const weekDayLabel = (day: WeekDay) => dayLabel[day as ClassDay | 'sun'];

/** A programme's class length from the timetable: "60", or "60–90" when sessions differ. */
export function classLength(programId: string, list: readonly Session[], fallback: number): string {
  const lengths = sessionsFor(programId, list).map(s => toMinutes(s.end) - toMinutes(s.start));
  if (!lengths.length) return String(fallback);
  const min = Math.min(...lengths), max = Math.max(...lengths);
  return min === max ? String(min) : `${min}–${max}`;
}
