// All dojo content in one object, validated once at build time (see app/layout.tsx and lib/validate.ts).
import { belts } from './belts.ts';
import { business } from './business.ts';
import { fees } from './fees.ts';
import { instructors } from './instructors.ts';
import { precepts } from './precepts.ts';
import { programs } from './programs.ts';
import { sessions } from './timetable.ts';
import type { DojoContent } from '../lib/validate.ts';

export const dojo: DojoContent = { business, programs, fees, belts, instructors, sessions, precepts };
