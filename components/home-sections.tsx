import type { ReactNode } from 'react';
import { belts } from '../content/belts';
import { business, formattedAddress } from '../content/business';
import { instructors } from '../content/instructors';
import { precepts } from '../content/precepts';
import { availabilityLabel, formatAges, programs } from '../content/programs';
import { sessions } from '../content/timetable';
import { mapDirectionsUrl } from '../lib/maps';
import { asset } from '../lib/paths';
import { classLength } from '../lib/schedule';
import { BonsaiTree, Enso, JapaneseTemple, PineBough, Seal, WashEdge } from './art/ink';
import { Icon } from './art/misc';
import { BeltLadder } from './belt-ladder';
import { GoogleMap } from './google-map';
import { HoursTable } from './hours-table';
import { OnTheMat } from './on-the-mat';
import { OpenBadge } from './open-badge';
import { SiteLink } from './site-link';
import { TimeZoneNote } from './time-zone-note';

type Children = { children: ReactNode };

const seal = { open: 'Open', waitlist: 'Wait list', full: 'Full' } as const;
// The seal is decorative: the availability is also written out below each programme.

/* ── 一 Programs by age: four documentary dojo scenes with crisp age & fee details ─────────── */

function GroveRoot({ children }: Children) {
  return (
    <section className="section-pad relative overflow-hidden" aria-labelledby="grove-heading">
      <PineBough seed={73} className="absolute -top-4 -left-12 hidden w-72 opacity-[.07] xl:block" />
      <div className="wrap relative z-10">{children}</div>
    </section>
  );
}
function GroveIntro({ children }: Children) {
  return <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">{children}</div>;
}
/** The four programmes, from content/programs.ts. */
function GroveRow() {
  return (
    <div className="relative mt-12">
      <ol className="snap-row -mx-5 flex gap-5 overflow-x-auto px-5 pb-6 md:mx-0 md:grid md:grid-cols-2 md:gap-7 md:overflow-visible md:px-0 lg:grid-cols-4 lg:gap-6">
        {programs.map(program => (
          <li key={program.id} className="w-[78%] shrink-0 sm:w-[48%] md:w-auto">
            <SiteLink href={`/programs/#${program.id}`} className="group block no-underline">
              <div className="photo-mount relative">
                <div className="photo-frame aspect-[4/3]">
                  <img
                    src={asset(program.photo)}
                    alt={program.photoAlt}
                    loading="lazy"
                    decoding="async"
                    className="group-hover:scale-[1.035]"
                  />
                </div>
                {program.availability !== 'open' ? (
                  <Seal text={seal[program.availability]} english seed={program.id.length} className="absolute -top-3 -right-2 size-14 rotate-3 drop-shadow-sm" />
                ) : null}
              </div>
              <div className="mt-5 border-t-2 border-ink pt-4">
                <p className="flex items-baseline gap-2">
                  <span className="font-mono text-[2.25rem] leading-none tracking-tight tabular-nums">{formatAges(program.ages)}</span>
                  <span className="font-mono text-[.78rem] uppercase tracking-[.06em] text-muted">years</span>
                </p>
                <h3 className="mt-2 text-2xl group-hover:underline group-hover:decoration-2">{program.name}</h3>
                <p className="mt-2 text-[.94rem] leading-snug text-muted">
                  {classLength(program.id, sessions, program.minutes)} min classes, {program.classesPerWeek === 'unlimited' ? 'as many as you like' : `${program.classesPerWeek} a week`}
                </p>
                <p className="mt-1.5 font-mono text-[.95rem] tabular-nums">${program.monthlyPrice} a month</p>
                {program.availability !== 'open' ? <p className="mt-1 text-[.88rem] font-semibold text-seal-ink">{availabilityLabel[program.availability]}</p> : null}
              </div>
            </SiteLink>
          </li>
        ))}
      </ol>
    </div>
  );
}
export const Grove = Object.assign(GroveRoot, { Intro: GroveIntro, Row: GroveRow });

/* ── 二 The dojo precepts: a hanging scroll on a full-bleed wash band ───────────────────────── */

function PreceptsRoot({ children }: Children) {
  return (
    <section aria-labelledby="precepts-heading" className="relative">
      <WashEdge />
      <div className="zen-wash-glow relative overflow-hidden bg-wash py-[clamp(4rem,8vw,7rem)]">
        <BonsaiTree seed={131} className="absolute -bottom-4 -left-10 hidden w-80 opacity-[.11] md:block xl:w-96" />
        <JapaneseTemple seed={151} className="absolute -right-12 -bottom-6 hidden w-88 opacity-[.1] lg:block xl:w-[26rem]" />
        <div className="wrap relative z-10 grid items-center gap-12 md:grid-cols-[1fr_auto_1fr]">{children}</div>
      </div>
      <WashEdge flip seed={33} />
    </section>
  );
}
function PreceptsIntro({ children }: Children) {
  return <div className="md:text-right">{children}</div>;
}
/** The scroll: rods top and bottom, the five lines, a seal. */
function PreceptsScroll() {
  const numerals = ['一', '二', '三', '四', '五'];
  return (
    <div className="mx-auto w-full max-w-[24rem]">
      <div aria-hidden="true" className="mx-auto h-3 w-[112%] -translate-x-[5.4%] rounded-full bg-ink" />
      <div className="mount mx-auto px-7 pt-9 pb-8">
        <ol className="grid gap-5">
          {precepts.map((line, i) => (
            <li key={line} className="grid grid-cols-[2.4rem_1fr] items-baseline gap-3">
              <span lang="ja" aria-hidden="true" className="font-display text-[1.9rem] leading-none">{numerals[i]}</span>
              <span className="font-display text-[1.35rem] leading-snug">{line}</span>
            </li>
          ))}
        </ol>
        <Seal text={business.sealMark} className="mt-8 ml-auto size-12" />
      </div>
      <div aria-hidden="true" className="mx-auto h-3 w-[112%] -translate-x-[5.4%] rounded-full bg-ink" />
    </div>
  );
}
function PreceptsAside({ children }: Children) {
  return <div className="text-muted md:max-w-[18rem]">{children}</div>;
}
export const Precepts = Object.assign(PreceptsRoot, { Intro: PreceptsIntro, Scroll: PreceptsScroll, Aside: PreceptsAside });

/* ── 三 The belt path: the compact ladder up a mountain flank ──────────────────────────────── */

function BeltPathRoot({ children }: Children) {
  return (
    <section className="wrap section-pad grid items-center gap-x-16 gap-y-10 md:grid-cols-[1.1fr_1fr]" aria-labelledby="belts-heading">
      <BeltLadder belts={belts} compact className="order-last w-full max-w-lg md:order-first" />
      <div>{children}</div>
    </section>
  );
}
export const BeltPath = BeltPathRoot;

/* ── 四 This week on the mat: today and tomorrow on practice paper ────────────────────────── */

function MatWeekRoot({ children }: Children) {
  return (
    <section className="practice-grid border-y border-line section-pad" aria-labelledby="mat-heading">
      <div className="wrap grid gap-x-16 gap-y-10 lg:grid-cols-[.8fr_2fr]">{children}</div>
    </section>
  );
}
function MatWeekClasses() {
  return <div className="mount p-5 sm:p-8"><OnTheMat sessions={sessions} /></div>;
}
export const MatWeek = Object.assign(MatWeekRoot, { Classes: MatWeekClasses });

/* ── 五 Instructors: four editorial portraits in staggered scroll mounts ───────────────────── */

const drops = ['md:mt-0', 'md:mt-10', 'md:mt-4', 'md:mt-14'];
function TeachersRoot({ children }: Children) {
  return <section className="wrap section-pad" aria-labelledby="teachers-heading">{children}</section>;
}
function TeachersScrolls() {
  return (
    <div className="mt-12">
      <ul className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {instructors.map((person, i) => (
          <li key={person.id} className={drops[i]}>
            <SiteLink href={`/instructors/#${person.id}`} className="group block no-underline">
              <div className="photo-mount">
                <div className="photo-frame aspect-[3/4]">
                  <img
                    src={asset(person.photo)}
                    alt={person.photoAlt}
                    loading="lazy"
                    decoding="async"
                    className="object-top group-hover:scale-[1.03]"
                  />
                </div>
              </div>
              <div className="mt-4 border-t border-line pt-3.5">
                <p className="font-mono text-[.78rem] uppercase tracking-[.04em] text-muted">{person.rank}</p>
                <h3 className="mt-1 text-[1.45rem] group-hover:underline group-hover:decoration-2">{person.name}</h3>
                <p className="mt-2 font-display text-[1.04rem] leading-snug text-muted">“{person.saying}”</p>
              </div>
            </SiteLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
export const Teachers = Object.assign(TeachersRoot, { Scrolls: TeachersScrolls });

/* ── 六 Your first class: three steps paired with the folded-gi still life ─────────────────── */

function FirstClassRoot({ children }: Children) {
  return (
    <section className="zen-wash-glow section-pad relative overflow-hidden" aria-labelledby="first-heading">
      <div className="zen-rule-fade absolute inset-x-0 top-0" aria-hidden="true" />
      <Enso className="zen-bg-art pointer-events-none absolute -right-24 -bottom-24 hidden size-80 opacity-[.055] lg:block" seed={41} />
      <div className="wrap relative z-10 grid items-center gap-x-16 gap-y-12 lg:grid-cols-[1.15fr_.85fr]">
        <div>{children}</div>
        <figure className="mx-auto w-full max-w-md lg:max-w-none">
          <div className="photo-mount">
            <div className="photo-frame aspect-[4/3]">
              <img
                src={asset('/images/folded-gi.jpg')}
                alt="A neatly folded heavyweight white cotton karategi and white beginner belt resting on a cedar bench beside sunlit maple dojo floorboards"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          <figcaption className="mt-3 font-mono text-[.78rem] text-muted">
            No uniform needed for your first class — we lend you a belt.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
function Steps({ children }: Children) {
  return <ol className="mt-10 grid gap-8">{children}</ol>;
}
function Step({ n, title, children }: Children & { n: 1 | 2 | 3; title: string }) {
  return (
    <li className="grid grid-cols-[3.5rem_1fr] items-start gap-4 border-t border-line pt-6 first:border-t-0 first:pt-0">
      <span lang="ja" aria-hidden="true" className="font-display text-[3.2rem] leading-[.85] text-ink">{['一', '二', '三'][n - 1]}</span>
      <div>
        <h3 className="text-[1.45rem]">{title}</h3>
        <p className="mt-1.5 max-w-[36ch] text-muted">{children}</p>
      </div>
    </li>
  );
}
export const FirstClass = Object.assign(FirstClassRoot, { Steps, Step });

/* ── 七 Find the dojo: address, hours and the map in a scroll mount ───────────────────────── */

function FindRoot({ children }: Children) {
  return (
    <section className="wrap section-pad grid items-start gap-x-16 gap-y-12 border-t border-line/70 lg:grid-cols-[1fr_1.25fr]" aria-labelledby="find-heading">
      <div>{children}</div>
      <MapMount />
    </section>
  );
}
export function MapMount() {
  return (
    <div className="mount relative p-2.5">
      <GoogleMap address={`${business.name}, ${formattedAddress()}`} title={`Map showing ${business.name} at ${formattedAddress()}`} />
    </div>
  );
}
/** Address, directions, open hours and the live open badge, all from content/business.ts. */
export function VisitDetails() {
  return (
    <div className="mt-8 grid gap-8">
      <address className="not-italic">
        <p className="flex items-start gap-3 text-[1.2rem] font-semibold"><Icon name="pin" className="mt-1 size-5 shrink-0" />{formattedAddress()}</p>
        <ul className="mt-3 grid gap-1.5 pl-8 text-muted">{business.directions.map(line => <li key={line}>{line}</li>)}</ul>
        <a href={mapDirectionsUrl(`${business.address.street}, ${business.address.locality}, ${business.address.region} ${business.address.postalCode}`)} className="mt-3 ml-8 inline-block font-semibold text-primary-ink underline">Directions in Google Maps</a>
      </address>
      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="font-display text-xl">When the doors are open</h3>
          <p className="flex items-center gap-2 font-mono text-[.85rem]"><Icon name="clock" className="size-4" /><OpenBadge hours={business.hours} /></p>
        </div>
        <HoursTable hours={business.hours} className="mt-3 max-w-md" />
        <TimeZoneNote />
        <p className="mt-3 text-[.95rem] font-semibold text-seal-ink">Doors open 15 minutes before the first class.</p>
      </div>
    </div>
  );
}
export const Find = Object.assign(FindRoot, { Details: VisitDetails });
