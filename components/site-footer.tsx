import { business, formattedAddress } from '../content/business';
import { precepts } from '../content/precepts';
import { BonsaiTree, FooterRidge, JapaneseTemple, Seal, StoneLantern } from './art/ink';
import { HoursTable } from './hours-table';
import { NAV } from './site-header';
import { SiteLink } from './site-link';

export function SiteFooter() {
  const tel = business.phone.replace(/[^\d+]/g, '');
  return (
    <footer className="mt-24 text-[.95rem]">
      <FooterRidge />
      <div className="relative overflow-hidden bg-wash pb-10">
        <BonsaiTree seed={137} className="absolute -bottom-6 -left-14 hidden w-72 opacity-[.09] lg:block xl:w-84" />
        <StoneLantern seed={173} className="absolute right-[22%] bottom-2 hidden w-28 opacity-[.075] xl:block" />
        <JapaneseTemple seed={157} className="absolute -right-10 -bottom-6 hidden w-80 opacity-[.095] md:block xl:w-96" />
        <div className="wrap relative z-10 grid gap-10 pt-6 md:grid-cols-[1.2fr_1fr_.7fr]">
          <div>
            <div className="flex items-center gap-3">
              <Seal text={business.sealMark} className="size-12" />
              <p className="font-display text-2xl font-extrabold leading-tight">{business.name}</p>
            </div>
            <address className="mt-5 not-italic leading-relaxed">
              {formattedAddress()}<br />
              {business.phone ? <><a href={`tel:${tel}`} className="no-underline hover:underline">{business.phone}</a><br /></> : null}
              <a href={`mailto:${business.email}`} className="wrap-anywhere">{business.email}</a>
            </address>
          </div>
          <div>
            <h2 className="font-display text-lg">When the doors are open</h2>
            <HoursTable hours={business.hours} className="mt-3" />
          </div>
          <nav aria-label="Footer">
            <h2 className="font-display text-lg">Find your way</h2>
            <ul className="mt-3 grid gap-1.5">
              <li><SiteLink href="/" className="no-underline hover:underline">Home</SiteLink></li>
              {NAV.map(item => <li key={item.href}><SiteLink href={item.href} className="no-underline hover:underline">{item.label}</SiteLink></li>)}
            </ul>
          </nav>
        </div>
        <div className="wrap relative z-10 mt-12 border-t border-line pt-6">
          <p className="font-display text-[.98rem] leading-relaxed text-muted">
            {precepts.map((line, i) => <span key={line} className="mr-4 inline-block">{['一', '二', '三', '四', '五'][i]} {line}</span>)}
          </p>
          <p className="mt-5 text-sm text-muted">
            A sample website for the Jamstacks gallery; the dojo and its people are fictitious. Made with <a className="underline" href="https://jamstacks.net">jamstacks.net</a>.
          </p>
        </div>
      </div>
    </footer>
  );
}
