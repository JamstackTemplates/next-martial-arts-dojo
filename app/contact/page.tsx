import type { Metadata } from 'next';
import { JapaneseTemple, Seal, WashEdge } from '../../components/art/ink';
import { Icon } from '../../components/art/misc';
import { CopyEmail } from '../../components/copy-email';
import { MapMount, VisitDetails } from '../../components/home-sections';
import { JamstacksSupportForm } from '../../components/jamstacks-support-form';
import { PageHead } from '../../components/page-head';
import { business } from '../../content/business';
import { absoluteUrl } from '../../lib/paths';
import { site } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Contact and free trial class',
  description: 'Ask Still Mountain Dojo for a free trial karate class, or send a question. We reply to suggest a class and confirm a time.',
  alternates: { canonical: absoluteUrl('/contact/') },
};

export default function ContactPage() {
  const hosted = Boolean(site.jamstacksSite && site.jamstacksEmbedUrl);
  const tel = business.phone.replace(/[^\d+]/g, '');
  return (
    <>
      <PageHead kanji="礼" reading="Rei, the bow">
        <PageHead.Title>{business.enquiries.title}</PageHead.Title>
        <PageHead.Intro><p>{business.enquiries.introduction}</p></PageHead.Intro>
      </PageHead>

      <div className="wrap grid items-start gap-x-16 gap-y-12 pb-20 lg:grid-cols-[1.15fr_1fr]">
        <section aria-labelledby="form-heading" className="mount p-5 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h2 id="form-heading" className="text-[1.9rem]">{hosted ? 'Send an enquiry' : 'Write to us directly'}</h2>
            <Seal text={business.sealMark} className="size-12 shrink-0" />
          </div>
          {hosted ? (
            <>
              <p className="mt-2 mb-6 text-muted">Your name, email and a message. Use the message for the details on the right.</p>
              <JamstacksSupportForm siteId={site.jamstacksSite} embedUrl={site.jamstacksEmbedUrl} email={business.email} />
            </>
          ) : (
            <div className="mt-4 grid gap-4">
              <p className="text-muted">The enquiry form is not connected on this site yet. Email us instead; the same person reads it.</p>
              <a className="font-display text-[clamp(1.3rem,3.4vw,1.8rem)] wrap-anywhere text-primary-ink underline" href={`mailto:${business.email}`}>{business.email}</a>
            </div>
          )}
        </section>

        <aside aria-label="Other ways to reach us" className="grid content-start gap-9">
          <div>
            <h2 className="text-2xl">Email or call</h2>
            <p className="mt-3 flex items-center gap-3 text-[1.2rem]"><Icon name="mail" className="size-5 shrink-0" /><a className="wrap-anywhere text-primary-ink underline" href={`mailto:${business.email}`}>{business.email}</a></p>
            <div className="mt-3 flex flex-wrap items-center gap-3 pl-8"><CopyEmail email={business.email} /></div>
            {business.phone ? <p className="mt-3 flex items-center gap-3 text-[1.2rem]"><Icon name="phone" className="size-5 shrink-0" /><a className="text-primary-ink underline" href={`tel:${tel}`}>{business.phone}</a></p> : null}
            <p className="mt-2 pl-8 text-sm text-muted">Phones are answered when the doors are open; outside those hours, leave a message.</p>
          </div>
          <div>
            <h2 className="text-2xl">Useful to include in your message</h2>
            <ul className="mt-4 grid gap-2.5">
              {business.enquiries.usefulToInclude.map(tip => (
                <li key={tip} className="flex gap-3"><span aria-hidden="true" className="mt-[.72em] h-[3px] w-4 shrink-0 -rotate-6 rounded-full bg-ink" />{tip}</li>
              ))}
            </ul>
          </div>
          <p className="border-l-4 border-seal pl-4 text-muted">A trial class, a waitlist place or a private lesson is arranged only when we write back to confirm it.</p>
        </aside>
      </div>

      <section aria-labelledby="visit-heading">
        <WashEdge seed={71} />
        <div className="relative overflow-hidden bg-wash py-[clamp(3rem,6vw,5rem)]">
          <JapaneseTemple seed={163} className="absolute -bottom-6 -left-14 hidden w-80 opacity-[.085] xl:block" />
          <div className="wrap relative z-10 grid items-start gap-x-16 gap-y-12 lg:grid-cols-[1fr_1.25fr]">
            <div>
              <h2 id="visit-heading" className="text-[clamp(2rem,4vw,3rem)]">Visit the dojo</h2>
              <VisitDetails />
            </div>
            <MapMount />
          </div>
        </div>
      </section>
    </>
  );
}
