import type { ReactNode } from 'react';
import { fees, dollars } from '../content/fees';
import { instructors, type Instructor } from '../content/instructors';
import { availabilityLabel, formatAges, programById, programs, type Program } from '../content/programs';
import { dayLabel, sessions } from '../content/timetable';
import { classLength, formatTime, sessionsFor } from '../lib/schedule';
import { asset } from '../lib/paths';
import { BambooGrove, BonsaiTree, Kasure, Seal, StoneLantern, WashEdge } from './art/ink';
import { SiteLink } from './site-link';

type Children = { children: ReactNode };

const sealText = { open: 'Open', waitlist: 'Wait list', full: 'Full' } as const;

/* ── Programs ─────────────────────────────────────────────────────────────────────────────── */

/** One programme, art and text alternating sides. Everything here comes from content/programs.ts and the timetable. */
function ProgramBlock({ program, index }: { program: Program; index: number }) {
  const weekly = sessionsFor(program.id, sessions);
  const flip = index % 2 === 1;
  return (
    <section id={program.id} aria-labelledby={`${program.id}-heading`} className="scroll-mt-6 border-t border-line py-[clamp(3.5rem,7vw,6rem)] first:border-t-0">
      <div className="wrap grid items-start gap-x-16 gap-y-8 lg:grid-cols-[.95fr_1.35fr]">
        <div className={`relative ${flip ? 'lg:order-last' : ''}`}>
          <div className="photo-mount relative">
            <div className="photo-frame aspect-[4/3]">
              <img
                src={asset(program.photo)}
                alt={program.photoAlt}
                loading="lazy"
                decoding="async"
              />
            </div>
            {program.availability !== 'open' ? (
              <Seal text={sealText[program.availability]} english seed={index + 4} className="absolute -top-4 -right-3 size-18 rotate-6 drop-shadow-sm" />
            ) : null}
          </div>
          <div className="mt-5 flex items-baseline justify-between border-t border-line pt-3">
            <p className="font-mono text-[clamp(2.5rem,5vw,3.8rem)] leading-none tracking-tighter tabular-nums">{formatAges(program.ages)}</p>
            <p className="font-mono text-sm uppercase tracking-[.06em] text-muted">years old</p>
          </div>
        </div>
        <div>
          <h2 id={`${program.id}-heading`} className="text-[clamp(2.4rem,5vw,3.8rem)]">{program.name}</h2>
          <p className="measure mt-3 text-[1.18rem] leading-snug">{program.summary}</p>
          <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-y-2 border-ink py-5 sm:grid-cols-4">
            <div><dt className="text-sm text-muted">Each month</dt><dd className="font-mono text-2xl tabular-nums">${program.monthlyPrice}</dd></div>
            <div><dt className="text-sm text-muted">Classes</dt><dd className="font-mono text-2xl">{program.classesPerWeek === 'unlimited' ? 'Unlimited' : `${program.classesPerWeek}/week`}</dd></div>
            <div><dt className="text-sm text-muted">Length</dt><dd className="font-mono text-2xl tabular-nums">{classLength(program.id, sessions, program.minutes)} min</dd></div>
            <div><dt className="text-sm text-muted">Places</dt><dd className={`font-semibold leading-tight ${program.availability === 'open' ? '' : 'text-seal-ink'}`}>{availabilityLabel[program.availability]}</dd></div>
          </dl>
          <div className="mt-8 grid gap-10 sm:grid-cols-2">
            <div>
              <h3 className="font-display text-xl">What they work on</h3>
              <ul className="mt-3 grid gap-2">
                {program.focus.map(item => <li key={item} className="flex gap-3"><span aria-hidden="true" className="mt-[.72em] h-[3px] w-4 shrink-0 -rotate-6 rounded-full bg-ink" />{item}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-xl">A typical class</h3>
              <ol className="mt-3 grid gap-2">
                {program.classOutline.map((step, i) => (
                  <li key={step} className="grid grid-cols-[1.6rem_1fr] gap-2"><span className="font-mono text-muted tabular-nums">{i + 1}.</span>{step}</li>
                ))}
              </ol>
            </div>
          </div>
          <h3 className="mt-9 font-display text-xl">When it runs</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {weekly.map(s => (
              <li key={s.id} className="rounded-ui border border-line bg-surface px-3 py-1.5 font-mono text-[.85rem] tabular-nums">
                {dayLabel[s.day].slice(0, 3)} {formatTime(s.start)}{s.programIds.length > 1 ? <span className="font-sans text-muted"> ({s.title.toLowerCase()})</span> : null}
              </li>
            ))}
          </ul>
          <SiteLink href={`/timetable/#${program.id}`} className="mt-4 inline-block font-semibold text-primary-ink underline">See {program.name} on the timetable</SiteLink>
        </div>
      </div>
    </section>
  );
}

export function ProgramList() {
  return <div>{programs.map((program, index) => <ProgramBlock key={program.id} program={program} index={index} />)}</div>;
}

/** Fees as a single scroll-mounted ledger with dotted leaders. */
function FeesRoot({ children, labelledBy = 'fees-heading' }: Children & { labelledBy?: string }) {
  return <section className="wrap section-pad grid items-start gap-x-16 gap-y-10 lg:grid-cols-[1fr_1.1fr]" aria-labelledby={labelledBy}>{children}</section>;
}
function FeesLedger() {
  const rows: [string, string][] = [
    ...programs.map(p => [`${p.name}, each month`, `$${p.monthlyPrice}`] as [string, string]),
    ['Trial class', dollars(fees.trialClass)],
    ['Joining fee', dollars(fees.registration, 'None')],
    ['Uniform (white gi and belt)', dollars(fees.uniform)],
    ['Colour belt grading', dollars(fees.colourGrading)],
    ['Black belt grading', dollars(fees.blackBeltGrading)],
    ['Each extra family member', `−$${fees.familyDiscountPerMonth}/mo`],
  ];
  return (
    <div className="mount p-6 sm:p-9">
      <table className="w-full border-collapse">
        <caption className="sr-only">Fees in US dollars</caption>
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label} className="align-baseline">
              <th scope="row" className="py-2 pr-2 text-left font-medium">
                <span className="flex items-baseline gap-2">{label}<span aria-hidden="true" className="min-w-6 flex-1 border-b-2 border-dotted border-line" /></span>
              </th>
              <td className="w-px py-2 text-right font-mono text-[1.05rem] whitespace-nowrap tabular-nums">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export const Fees = Object.assign(FeesRoot, { Ledger: FeesLedger });

/** Questions parents ask: a two-column definition list on a wash band. */
function FaqRoot({ children }: Children) {
  return (
    <section aria-labelledby="faq-heading">
      <WashEdge seed={41} />
      <div className="relative overflow-hidden bg-wash py-[clamp(3.5rem,7vw,6rem)]">
        <BambooGrove seed={191} className="absolute -bottom-4 -left-8 hidden w-48 opacity-[.085] lg:block" />
        <StoneLantern seed={179} className="absolute right-6 -bottom-4 hidden w-32 opacity-[.08] lg:block" />
        <div className="wrap relative z-10">{children}</div>
      </div>
      <WashEdge flip seed={43} />
    </section>
  );
}
function FaqList({ children }: Children) {
  return <dl className="mt-10 grid gap-x-16 gap-y-9 md:grid-cols-2">{children}</dl>;
}
function FaqItem({ question, children }: Children & { question: string }) {
  return (
    <div className="border-t-2 border-ink pt-4">
      <dt className="font-display text-[1.4rem] leading-snug">{question}</dt>
      <dd className="mt-2 text-muted">{children}</dd>
    </div>
  );
}
export const Faq = Object.assign(FaqRoot, { List: FaqList, Item: FaqItem });

/* ── Belts ────────────────────────────────────────────────────────────────────────────────── */

/** Four grading steps along a single kasure stroke. */
function GradingRoot({ children }: Children) {
  return <section className="wrap section-pad" aria-labelledby="grading-heading">{children}</section>;
}
function GradingSteps({ children }: Children) {
  return (
    <div className="relative mt-12">
      <Kasure variant={1} className="absolute top-[1.35rem] hidden md:block" />
      <ol className="relative grid gap-8 md:grid-cols-4 md:gap-6">{children}</ol>
    </div>
  );
}
function GradingStep({ n, title, children }: Children & { n: number; title: string }) {
  return (
    <li className="grid grid-cols-[3.2rem_1fr] gap-4 md:block">
      <span className="grid size-11 place-items-center rounded-full bg-ink font-mono text-lg font-semibold text-bg">{n}</span>
      <div>
        <h3 className="text-[1.45rem] md:mt-5">{title}</h3>
        <p className="mt-2 text-muted">{children}</p>
      </div>
    </li>
  );
}
export const Grading = Object.assign(GradingRoot, { Steps: GradingSteps, Step: GradingStep });

/* ── Instructors ──────────────────────────────────────────────────────────────────────────── */

/** One instructor as a tall hanging scroll, figure and text alternating sides. */
function InstructorScroll({ person, index }: { person: Instructor; index: number }) {
  const flip = index % 2 === 1;
  return (
    <section id={person.id} aria-labelledby={`${person.id}-heading`} className="scroll-mt-6 py-[clamp(2.5rem,5vw,4rem)]">
      <div className={`wrap grid items-center gap-x-16 gap-y-8 md:grid-cols-[minmax(0,20rem)_1fr] ${flip ? 'md:grid-cols-[1fr_minmax(0,20rem)]' : ''}`}>
        <div className={`mx-auto w-full max-w-[19rem] ${flip ? 'md:order-last' : ''}`}>
          <div aria-hidden="true" className="relative z-10 mx-auto mb-2 h-2.5 w-[112%] -translate-x-[5.4%] rounded-full bg-ink" />
          <div className="mount relative p-3.5">
            <div className="photo-frame aspect-[3/4]">
              <img
                src={asset(person.photo)}
                alt={person.photoAlt}
                loading="lazy"
                decoding="async"
                className="object-top"
              />
            </div>
            <Seal text={person.name.split(' ').map(word => word[0]).join('')} english seed={index + 20} className="absolute right-5 bottom-5 size-11 drop-shadow-sm" />
          </div>
          <div aria-hidden="true" className="relative z-10 mx-auto mt-2 h-2.5 w-[112%] -translate-x-[5.4%] rounded-full bg-ink" />
        </div>
        <div>
          <p className="font-mono text-muted">{person.rank}</p>
          <h2 id={`${person.id}-heading`} className="mt-1 text-[clamp(2.3rem,4.6vw,3.6rem)]">{person.name}</h2>
          <p className="mt-2 text-[1.1rem] font-medium">{person.role}</p>
          <p className="measure mt-5 leading-relaxed text-muted">{person.bio}</p>
          <blockquote className="mt-7 border-l-4 border-seal pl-5 font-display text-[clamp(1.5rem,2.6vw,2rem)] leading-snug">“{person.saying}”</blockquote>
          <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
            <div><dt className="text-sm text-muted">Teaching since</dt><dd className="font-mono text-xl tabular-nums">{person.teachingSince}</dd></div>
            <div>
              <dt className="text-sm text-muted">Teaches</dt>
              <dd className="flex flex-wrap gap-x-3">
                {person.programIds.map(id => (
                  <SiteLink key={id} href={`/programs/#${id}`} className="font-semibold text-primary-ink underline">{programById(id)?.name}</SiteLink>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
export function InstructorList() {
  return <div>{instructors.map((person, index) => <InstructorScroll key={person.id} person={person} index={index} />)}</div>;
}

/** "How we teach": four parts of every class along one brush stroke. */
function TeachRoot({ children }: Children) {
  return (
    <section aria-labelledby="teach-heading">
      <WashEdge seed={51} />
      <div className="relative overflow-hidden bg-wash py-[clamp(3.5rem,7vw,6rem)]">
        <BonsaiTree flip seed={143} className="absolute -right-10 -bottom-6 hidden w-76 opacity-[.09] lg:block" />
        <div className="wrap relative z-10">{children}</div>
      </div>
      <WashEdge flip seed={53} />
    </section>
  );
}
function TeachSteps({ children }: Children) {
  return (
    <div className="relative mt-12">
      <Kasure variant={3} className="absolute top-3 hidden md:block" />
      <ol className="relative grid gap-8 md:grid-cols-4">{children}</ol>
    </div>
  );
}
function TeachStep({ title, minutes, children }: Children & { title: string; minutes: string }) {
  return (
    <li className="md:pt-12">
      <p className="font-mono text-sm text-muted">{minutes}</p>
      <h3 className="mt-1 text-[1.45rem]">{title}</h3>
      <p className="mt-2 text-muted">{children}</p>
    </li>
  );
}
export const Teach = Object.assign(TeachRoot, { Steps: TeachSteps, Step: TeachStep });

export { formatAges };
