import type { ReactNode } from 'react';
import { business, formattedAddress } from '../content/business';
import { sessions } from '../content/timetable';
import { asset } from '../lib/paths';
import { MountainBackdrop, PineBough, Seal } from './art/ink';
import { Icon } from './art/misc';
import { MatStatusLine } from './mat-status';
import { SiteLink } from './site-link';

type Children = { children: ReactNode };

/**
 * Home hero: editorial 12-column split. Strong typographic lockup and primary actions on the left;
 * scroll-mounted photograph of the upstairs Walnut Street training hall facing the Flatirons on the right.
 */
function HeroRoot({ children }: Children) {
  return (
    <section className="zen-wash-glow relative overflow-hidden" aria-labelledby="hero-heading">
      <MountainBackdrop className="absolute inset-x-0 bottom-0 h-[56%] w-full opacity-85" />
      <PineBough flip seed={71} className="absolute -top-4 -right-10 hidden w-72 opacity-[.075] xl:block" />
      <div className="wrap relative z-10 grid items-center gap-x-12 gap-y-7 pt-6 pb-12 lg:min-h-[min(45rem,calc(100svh-5.75rem))] lg:grid-cols-12 lg:gap-y-10 lg:py-12">
        <div className="lg:col-span-5">
          <p className="mb-3 flex items-center gap-2.5 font-mono text-[.78rem] tracking-[.06em] uppercase text-muted sm:mb-4 sm:text-[.82rem]">
            <span aria-hidden="true" className="inline-block h-px w-5 shrink-0 bg-seal sm:w-6" />
            <span>Boulder, CO · Traditional Karate</span>
          </p>
          {children}
        </div>
        <figure className="relative lg:col-span-7">
          <div className="photo-mount relative">
            <div className="photo-frame aspect-[4/3] sm:aspect-[16/11]">
              <img
                src={asset('/images/hero-dojo.jpg')}
                alt="A karateka in a white cotton karategi and black belt holding a grounded horse stance on sunlit wooden floorboards inside Still Mountain Dojo, with Boulder's pine foothills and Flatirons visible through tall cedar-framed windows"
                fetchPriority="high"
                decoding="async"
                className="object-center"
              />
            </div>
            <Seal
              text={business.sealMark}
              className="pointer-events-none absolute -right-2 -bottom-3 size-14 drop-shadow-sm sm:right-4 sm:bottom-4 sm:size-16"
            />
          </div>
          <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[.78rem] text-muted">
            <span>Upstairs training hall, 2045 Walnut Street</span>
            <span lang="ja" className="tracking-[.18em]">静山道場</span>
          </figcaption>
        </figure>
      </div>
      <div className="zen-rule-fade relative z-10" aria-hidden="true" />
    </section>
  );
}

function Heading({ children }: Children) {
  return <h1 id="hero-heading" className="ink-rise text-[clamp(2.75rem,5.2vw,4.65rem)] leading-[1.01] tracking-[-.022em]">{children}</h1>;
}

function Introduction({ children }: Children) {
  return <p className="ink-rise mt-5 max-w-[34ch] text-[clamp(1.06rem,1.45vw,1.22rem)] leading-relaxed text-muted" style={{ ['--delay' as string]: '.08s' }}>{children}</p>;
}

function Actions({ children }: Children) {
  return <div className="ink-rise mt-6 flex flex-wrap items-center gap-3 sm:mt-7" style={{ ['--delay' as string]: '.14s' }}>{children}</div>;
}

function Primary({ children }: Children) {
  return <SiteLink href="/contact/" className="button w-full px-6 sm:w-auto">{children}</SiteLink>;
}

function Secondary({ children }: Children) {
  return <SiteLink href="/timetable/" className="button button-ghost w-full sm:w-auto">{children}</SiteLink>;
}

/** Live "on the mat" line plus the address; both read from content. */
function Details() {
  return (
    <div className="mt-6 grid gap-2 border-t border-line pt-4 text-[.95rem] sm:mt-8">
      <MatStatusLine sessions={sessions} className="font-medium" />
      <p className="flex items-start gap-3 text-muted">
        <Icon name="pin" className="mt-0.5 size-4 shrink-0" />
        <span>{formattedAddress()}</span>
      </p>
    </div>
  );
}

export const Hero = Object.assign(HeroRoot, { Heading, Introduction, Actions, Primary, Secondary, Details });
