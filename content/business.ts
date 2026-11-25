// Still Mountain Dojo: shared business details. This is a fictitious sample for the Jamstacks gallery;
// replace every value with the owner's real details. Page-specific copy lives in app/**/page.tsx.
import type { OpeningHours } from '../lib/hours.ts';

export interface Business {
  /** Public display name; also update site.config.json's name when renaming. */
  name: string;
  /** Two characters drawn on the cinnabar seal (静山 = "still mountain"). */
  sealMark: string;
  /** Short headline, used in metadata and the social image. */
  tagline: string;
  /** Plain-text introduction used for fallback metadata and structured data. */
  introduction: string;
  /** Public contact address, never a private notification destination. */
  email: string;
  /** Public number; blank hides it. */
  phone: string;
  /** Postal address of the training hall. */
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    country: string;
  };
  /** Short directions shown beside the map: landmarks, parking, access. */
  directions: string[];
  /**
   * When the doors are open: 15 minutes before the first class until 15 minutes after the last.
   * Same-day intervals only (overnight is not supported). Keep it covering every class in
   * content/timetable.ts; the content tests check this.
   */
  hours: OpeningHours[];
  /** Contact copy; the hosted form supports name, email and message only. */
  enquiries: {
    /** Contact page heading. */
    title: string;
    /** No booking, payment or delivery promises: a trial class is requested, then confirmed by reply. */
    introduction: string;
    /** Suggestions for the message, not additional form inputs. */
    usefulToInclude: string[];
  };
}

export const business: Business = {
  name: 'Still Mountain Dojo',
  sealMark: '静山',
  tagline: 'Stand still. Then move with purpose.',
  introduction:
    'Traditional karate in downtown Boulder for children from 4, teens and adults. Classes by age, a clear belt path and a free first class.',
  email: 'bow-in@stillmountaindojo.com',
  phone: '(303) 555-0148',
  address: {
    street: '2045 Walnut Street',
    locality: 'Boulder',
    region: 'CO',
    postalCode: '80302',
    country: 'US',
  },
  directions: [
    'Two blocks south of the Pearl Street Mall, between 20th and 21st.',
    'Street parking on Walnut and a bike rack by the front door.',
    'The training hall is upstairs. There is a lift beside the stairs.',
  ],
  hours: [
    { day: 'Monday', opens: '15:30', closes: '20:45' },
    { day: 'Tuesday', opens: '16:15', closes: '20:45' },
    { day: 'Wednesday', opens: '15:30', closes: '20:45' },
    { day: 'Thursday', opens: '16:15', closes: '20:45' },
    { day: 'Friday', opens: '15:30', closes: '19:45' },
    { day: 'Saturday', opens: '08:15', closes: '13:15' },
    { day: 'Sunday' },
  ],
  enquiries: {
    title: 'Ask for a free trial class',
    introduction:
      'Tell us who would like to train and we will reply to suggest a class and confirm a time. Nothing is booked until we have written back.',
    usefulToInclude: [
      'Who would train, and their age',
      'Which programme or days suit you',
      'Any previous martial arts, and the rank you reached',
      'Anything the instructor should know: injuries, needs, or how your child feels about new groups',
      'A phone number, if you would rather we call',
    ],
  },
};

/** One-line postal address for maps and display. */
export function formattedAddress(b: Business = business): string {
  const { street, locality, region, postalCode } = b.address;
  return `${street}, ${locality}, ${region} ${postalCode}`;
}
