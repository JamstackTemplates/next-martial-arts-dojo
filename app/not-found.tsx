import type { Metadata } from 'next';
import { SteppedOff } from '../components/art/misc';
import { SiteLink } from '../components/site-link';

export const metadata: Metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <section className="wrap grid items-center gap-10 pt-12 pb-20 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <p className="font-mono text-muted">404</p>
        <h1 className="mt-3 text-[clamp(2.8rem,7vw,5.5rem)]">You’ve stepped off the mat.</h1>
        <p className="measure mt-5 text-[1.15rem] text-muted">This page isn’t here, or it has moved. Bow back in and try again from one of these.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <SiteLink href="/" className="button">Bow back in</SiteLink>
          <SiteLink href="/timetable/" className="button button-ghost">Timetable</SiteLink>
          <SiteLink href="/contact/" className="button button-ghost">Contact</SiteLink>
        </div>
      </div>
      <SteppedOff className="w-full" />
    </section>
  );
}
