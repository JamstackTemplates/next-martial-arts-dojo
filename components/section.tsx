import type { ReactNode } from 'react';
import { SiteLink } from './site-link';
import { Enso } from './art/ink';
import { Icon } from './art/misc';

type Children = { children: ReactNode };

/** A section's kanji numeral beside a short plain label. The numeral marks the order of the home page sections. */
export function SectionMark({ numeral, children, className = '' }: Children & { numeral?: string; className?: string }) {
  return (
    <p className={`flex items-baseline gap-3 text-muted ${className}`}>
      {numeral ? <span lang="ja" aria-hidden="true" className="font-display text-[2.4rem] leading-none text-ink">{numeral}</span> : null}
      <span className="text-[.98rem] font-medium">{children}</span>
    </p>
  );
}

export function SectionHeading({ children, className = '', id }: Children & { className?: string; id?: string }) {
  return <h2 id={id} className={`mt-3 max-w-[20ch] text-[clamp(2.1rem,4.6vw,3.6rem)] ${className}`}>{children}</h2>;
}

export function Lede({ children, className = '' }: Children & { className?: string }) {
  return <div className={`measure mt-5 text-[1.08rem] leading-relaxed text-muted [&>p+p]:mt-3 ${className}`}>{children}</div>;
}

/** A plain text link with a brush arrow, for "see more" moves between pages. */
export function MoreLink({ href, children, className = '' }: Children & { href: string; className?: string }) {
  return (
    <SiteLink href={href} className={`group inline-flex items-center gap-2 font-semibold text-primary-ink underline decoration-1 underline-offset-[.3em] hover:decoration-2 ${className}`}>
      {children}
      <Icon name="arrow" className="size-5 transition-transform group-hover:translate-x-1" />
    </SiteLink>
  );
}

/** The closing trial-class invitation used at the foot of inner pages. */
function TrialCta({ children }: Children) {
  return (
    <section className="wrap section-pad">
      <div className="grid items-center gap-10 border-t-2 border-ink pt-12 md:grid-cols-[1fr_auto]">{children}</div>
    </section>
  );
}
function CtaHeading({ children }: Children) {
  return <h2 className="max-w-[18ch] text-[clamp(2rem,4.4vw,3.4rem)]">{children}</h2>;
}
function CtaText({ children }: Children) {
  return <p className="measure mt-4 text-[1.08rem] text-muted">{children}</p>;
}
function CtaAction({ children }: Children) {
  return (
    <div className="relative grid size-56 place-items-center justify-self-start md:justify-self-end">
      <Enso className="absolute inset-0 size-full opacity-90" seed={17} />
      <SiteLink href="/contact/" className="button relative max-w-[11rem] text-center">{children}</SiteLink>
    </div>
  );
}
export const Cta = Object.assign(TrialCta, { Heading: CtaHeading, Text: CtaText, Action: CtaAction });
