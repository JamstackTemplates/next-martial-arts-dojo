// Content validation with item-specific failures. Runs in the tests and at build time (app/layout.tsx),
// so a typo in content/ stops the build with a message that names the item to fix.
import type { Business } from '../content/business.ts';
import type { Belt } from '../content/belts.ts';
import type { Fees } from '../content/fees.ts';
import type { Instructor } from '../content/instructors.ts';
import type { Program } from '../content/programs.ts';
import { CLASS_DAYS, type Session } from '../content/timetable.ts';
import { DAYS, validateHours } from './hours.ts';
import { isClock, toMinutes } from './schedule.ts';

export interface DojoContent {
  business: Business;
  programs: readonly Program[];
  fees: Fees;
  belts: readonly Belt[];
  instructors: readonly Instructor[];
  sessions: readonly Session[];
  precepts: readonly string[];
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const AVAILABILITY = ['open', 'waitlist', 'full'];
const LEVELS = ['all', 'beginners', 'coloured', 'advanced'];
const SWATCHES = ['white', 'yellow', 'orange', 'green', 'blue', 'purple', 'brown', 'black'];
const STANCES = ['kiba-dachi', 'zenkutsu-dachi', 'kokutsu-dachi', 'seiza'];

function fail(message: string): never {
  throw new Error(message);
}

function uniqueIds(kind: string, items: readonly { id: string }[]) {
  const seen = new Set<string>();
  for (const item of items) {
    if (!SLUG.test(item.id)) fail(`${kind} \`${item.id}\`: id must be lowercase letters, numbers and hyphens`);
    if (seen.has(item.id)) fail(`${kind} \`${item.id}\`: duplicate id`);
    seen.add(item.id);
  }
}

const text = (value: unknown) => typeof value === 'string' && value.trim().length > 0;

export function validatePrograms(programs: readonly Program[]) {
  if (!programs.length) fail('programs: add at least one programme');
  uniqueIds('program', programs);
  let previousMax: number | null = -1;
  for (const p of programs) {
    const label = `program \`${p.id}\``;
    if (!text(p.name) || !text(p.summary)) fail(`${label}: name and summary are required`);
    if (!Number.isInteger(p.ages.min) || p.ages.min < 3) fail(`${label}: ages.min must be a whole number of at least 3`);
    if (p.ages.max !== null && (!Number.isInteger(p.ages.max) || p.ages.max < p.ages.min)) fail(`${label}: ages.max must be null or at least ages.min`);
    if (previousMax === null || p.ages.min <= previousMax) fail(`${label}: ages overlap the previous programme or are out of order`);
    previousMax = p.ages.max;
    if (!Number.isInteger(p.monthlyPrice) || p.monthlyPrice <= 0 || p.monthlyPrice >= 500) fail(`${label}: monthlyPrice must be whole dollars between 1 and 499`);
    if (!Number.isInteger(p.minutes) || p.minutes < 20 || p.minutes > 180) fail(`${label}: minutes must be between 20 and 180`);
    if (p.classesPerWeek !== 'unlimited' && (!Number.isInteger(p.classesPerWeek) || p.classesPerWeek < 1 || p.classesPerWeek > 7)) fail(`${label}: classesPerWeek must be 1–7 or 'unlimited'`);
    if (!AVAILABILITY.includes(p.availability)) fail(`${label}: availability must be open, waitlist or full`);
    if (!text(p.photo) || !p.photo.startsWith('/')) fail(`${label}: photo must be a root-relative path`);
    if (!text(p.photoAlt)) fail(`${label}: photoAlt is required`);
    if (p.focus.length < 3 || p.focus.length > 5 || !p.focus.every(text)) fail(`${label}: focus needs 3–5 non-empty points`);
    if (!p.classOutline.length || !p.classOutline.every(text)) fail(`${label}: classOutline needs at least one step`);
  }
}

export function validateFees(fees: Fees) {
  for (const [key, value] of Object.entries(fees)) {
    if (!Number.isInteger(value) || value < 0 || value >= 1000) fail(`fees.${key}: must be whole dollars from 0 to 999`);
  }
}

export function validateBelts(belts: readonly Belt[]) {
  if (belts.length < 2) fail('belts: add the entry rank and at least one more');
  uniqueIds('belt', belts);
  let previous = -1;
  belts.forEach((b, index) => {
    const label = `belt \`${b.id}\``;
    if (!SWATCHES.includes(b.swatch)) fail(`${label}: swatch must be one of ${SWATCHES.join(', ')}`);
    if (!text(b.belt) || !text(b.rank)) fail(`${label}: belt and rank are required`);
    if (index === 0 && (b.minMonths !== 0 || b.minClasses !== 0)) fail(`${label}: the entry rank needs minMonths and minClasses of 0`);
    if (index > 0 && (!text(b.kata) || b.minClasses < 1)) fail(`${label}: kata and minClasses are required after the entry rank`);
    if (!Number.isInteger(b.minMonths) || b.minMonths < previous) fail(`${label}: minMonths must not be less than the rank before`);
    previous = b.minMonths;
    if (!Number.isInteger(b.juniorStripes) || b.juniorStripes < 0 || b.juniorStripes > 5) fail(`${label}: juniorStripes must be 0–5`);
    if (b.learn.length < 2 || b.learn.length > 3 || !b.learn.every(text)) fail(`${label}: learn needs 2–3 points`);
  });
}

export function validateInstructors(instructors: readonly Instructor[], programs: readonly Program[]) {
  if (!instructors.length) fail('instructors: add at least one instructor');
  uniqueIds('instructor', instructors);
  const programIds = new Set(programs.map(p => p.id));
  const year = new Date().getFullYear();
  for (const i of instructors) {
    const label = `instructor \`${i.id}\``;
    for (const key of ['name', 'rank', 'role', 'bio', 'saying'] as const) if (!text(i[key])) fail(`${label}: ${key} is required`);
    if (!Number.isInteger(i.teachingSince) || i.teachingSince < 1950 || i.teachingSince > year) fail(`${label}: teachingSince must be a year`);
    if (!STANCES.includes(i.stance)) fail(`${label}: stance must be one of ${STANCES.join(', ')}`);
    if (!text(i.photo) || !i.photo.startsWith('/')) fail(`${label}: photo must be a root-relative path`);
    if (!text(i.photoAlt)) fail(`${label}: photoAlt is required`);
    for (const id of i.programIds) if (!programIds.has(id)) fail(`${label}: programId \`${id}\` not found`);
  }
}

export function validateSessions(sessions: readonly Session[], programs: readonly Program[], instructors: readonly Instructor[], hours: Business['hours']) {
  uniqueIds('timetable', sessions);
  validateHours(hours);
  const programIds = new Set(programs.map(p => p.id));
  const instructorIds = new Set(instructors.map(i => i.id));
  for (const s of sessions) {
    const label = `timetable \`${s.id}\``;
    if (!(CLASS_DAYS as readonly string[]).includes(s.day)) fail(`${label}: day must be one of ${CLASS_DAYS.join(', ')}`);
    if (!isClock(s.start) || !isClock(s.end)) fail(`${label}: start and end must be 24-hour HH:MM`);
    if (toMinutes(s.start) >= toMinutes(s.end)) fail(`${label}: start must be before end (classes cannot cross midnight)`);
    if (!s.id.startsWith(`${s.day}-${s.start.replace(':', '')}-`)) fail(`${label}: id must start with \`${s.day}-${s.start.replace(':', '')}-\``);
    if (!text(s.title)) fail(`${label}: title is required`);
    if (!LEVELS.includes(s.level)) fail(`${label}: level must be one of ${LEVELS.join(', ')}`);
    if (!s.programIds.length) fail(`${label}: list at least one programId`);
    for (const id of s.programIds) if (!programIds.has(id)) fail(`${label}: programId \`${id}\` not found`);
    if (!instructorIds.has(s.instructorId)) fail(`${label}: instructorId \`${s.instructorId}\` not found`);
    const dayName = DAYS[CLASS_DAYS.indexOf(s.day)];
    const open = hours.find(h => h.day === dayName);
    if (!open?.opens || !open.closes || toMinutes(s.start) < toMinutes(open.opens) || toMinutes(s.end) > toMinutes(open.closes)) {
      fail(`${label}: falls outside ${dayName}'s open hours in content/business.ts`);
    }
  }
  for (const day of CLASS_DAYS) {
    const today = sessions.filter(s => s.day === day).sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
    for (let i = 1; i < today.length; i++) {
      if (toMinutes(today[i].start) < toMinutes(today[i - 1].end)) fail(`timetable \`${today[i].id}\`: overlaps \`${today[i - 1].id}\` on the main mat`);
    }
  }
  for (const p of programs) if (!sessions.some(s => s.programIds.includes(p.id))) fail(`program \`${p.id}\`: has no sessions in the timetable`);
}

export function validateContent(content: DojoContent) {
  const { business } = content;
  for (const key of ['name', 'tagline', 'introduction', 'email', 'sealMark'] as const) if (!text(business[key])) fail(`business.${key}: required`);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(business.email)) fail('business.email: a valid public email is required');
  if (!business.enquiries.usefulToInclude.length || !business.enquiries.usefulToInclude.every(text)) fail('business.enquiries.usefulToInclude: add message suggestions');
  validatePrograms(content.programs);
  validateFees(content.fees);
  validateBelts(content.belts);
  validateInstructors(content.instructors, content.programs);
  validateSessions(content.sessions, content.programs, content.instructors, business.hours);
  if (content.precepts.length !== 5 || !content.precepts.every(text)) fail('precepts: the dojo kun has five lines');
}
