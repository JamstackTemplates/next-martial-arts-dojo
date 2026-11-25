import { business, type Business } from '../content/business.ts';
import { programs as allPrograms, type Program } from '../content/programs.ts';
import { absoluteUrl } from './paths.ts';
import { site } from './site.ts';

/** schema.org SportsActivityLocation for the dojo, derived entirely from content/. */
export function businessStructuredData(b: Business = business, programs: readonly Program[] = allPrograms) {
  const url = absoluteUrl('/');
  const prices = programs.map(p => p.monthlyPrice);
  const open = b.hours.filter(h => h.opens && h.closes);
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: b.name,
    description: b.introduction,
    email: b.email,
    ...(b.phone ? { telephone: b.phone } : {}),
    ...(url ? { url, image: `${site.url}/og.png` } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: b.address.street,
      addressLocality: b.address.locality,
      addressRegion: b.address.region,
      postalCode: b.address.postalCode,
      addressCountry: b.address.country,
    },
    openingHoursSpecification: open.map(h => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${h.day}`,
      opens: h.opens,
      closes: h.closes,
    })),
    ...(prices.length ? { priceRange: `$${Math.min(...prices)}–$${Math.max(...prices)} per month` } : {}),
  };
}

/** Prevent content containing a closing script tag from escaping JSON-LD. */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
