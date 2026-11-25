import type { Metadata } from 'next';
import { Hero } from '../components/hero';
import { BeltPath, Find, FirstClass, Grove, MatWeek, Precepts, Teachers } from '../components/home-sections';
import { Lede, MoreLink, SectionHeading, SectionMark } from '../components/section';
import { minimumMonthsToBlack } from '../content/belts';
import { teachingYears } from '../content/instructors';
import { absoluteUrl } from '../lib/paths';
import { businessStructuredData, jsonLd } from '../lib/structured-data';

export const metadata: Metadata = { alternates: { canonical: absoluteUrl('/') } };

export default function HomePage() {
  return (
    <>
      <Hero>
        <Hero.Heading>Stand still. Then move with purpose.</Hero.Heading>
        <Hero.Introduction>Traditional karate for ages 4 to 74 in downtown Boulder. Your first class is free.</Hero.Introduction>
        <Hero.Actions>
          <Hero.Primary>Request a free trial class</Hero.Primary>
          <Hero.Secondary>See the timetable</Hero.Secondary>
        </Hero.Actions>
        <Hero.Details />
      </Hero>

      <Grove>
        <Grove.Intro>
          <div>
            <SectionMark numeral="一">Programs by age</SectionMark>
            <SectionHeading id="grove-heading">A class for every age, from four years old up</SectionHeading>
          </div>
          <MoreLink href="/programs/">Compare the programmes</MoreLink>
        </Grove.Intro>
        <Grove.Row />
      </Grove>

      <Precepts>
        <Precepts.Intro>
          <SectionMark numeral="二" className="md:justify-end">The dojo precepts</SectionMark>
          <h2 id="precepts-heading" className="mt-3 text-[clamp(2rem,4vw,3rem)] md:ml-auto md:max-w-[12ch]">Five lines, read aloud after every class</h2>
        </Precepts.Intro>
        <Precepts.Scroll />
        <Precepts.Aside>
          <p>Students kneel in a line, eyes forward, and the senior student reads each precept. The class repeats it together.</p>
          <p className="mt-3">Children learn them by heart within a month. Adults tend to take longer to mean them.</p>
        </Precepts.Aside>
      </Precepts>

      <BeltPath>
        <SectionMark numeral="三">The belt path</SectionMark>
        <SectionHeading id="belts-heading">Eight belts, one mountain</SectionHeading>
        <Lede>
          <p>
            Every student starts in white. Each belt has a minimum time and number of classes, then an
            invitation to grade. Training steadily, black belt takes at least {Math.round(minimumMonthsToBlack() / 12)} years.
            Most adults take five, and nobody is in a hurry.
          </p>
        </Lede>
        <MoreLink href="/belts/" className="mt-7">How grading works</MoreLink>
      </BeltPath>

      <MatWeek>
        <div>
          <SectionMark numeral="四">This week on the mat</SectionMark>
          <SectionHeading id="mat-heading">Classes run six days a week</SectionHeading>
          <Lede><p>Little Pines and Juniors train after school. Teens follow, adults in the evening, and Saturday morning is for everyone.</p></Lede>
          <MoreLink href="/timetable/" className="mt-7">See the full timetable</MoreLink>
        </div>
        <MatWeek.Classes />
      </MatWeek>

      <Teachers>
        <SectionMark numeral="五">Instructors</SectionMark>
        <SectionHeading id="teachers-heading">Four teachers, {teachingYears()} years of teaching between them</SectionHeading>
        <Teachers.Scrolls />
        <MoreLink href="/instructors/" className="mt-12">Meet the instructors</MoreLink>
      </Teachers>

      <FirstClass>
        <SectionMark numeral="六">Your first class</SectionMark>
        <SectionHeading id="first-heading">No uniform, no experience, no commitment</SectionHeading>
        <FirstClass.Steps>
          <FirstClass.Step n={1} title="Send an enquiry">Tell us who would train and which days suit. We reply to suggest a class and confirm a time.</FirstClass.Step>
          <FirstClass.Step n={2} title="Arrive 15 minutes early">Wear loose clothes you can kick in. You train barefoot; we lend you a belt.</FirstClass.Step>
          <FirstClass.Step n={3} title="Train, watch, then decide">Parents are welcome to watch from the bench. Take a week to think about it.</FirstClass.Step>
        </FirstClass.Steps>
      </FirstClass>

      <Find>
        <SectionMark numeral="七">Find the dojo</SectionMark>
        <SectionHeading id="find-heading">Upstairs on Walnut Street, facing the Flatirons</SectionHeading>
        <Find.Details />
      </Find>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(businessStructuredData()) }} />
    </>
  );
}
