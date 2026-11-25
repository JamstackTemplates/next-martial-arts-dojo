import type { Metadata } from 'next';
import { BeltStroke } from '../../components/art/belt-stroke';
import { BeltExplorer } from '../../components/belt-explorer';
import { Fees, Grading } from '../../components/inner-sections';
import { PageHead } from '../../components/page-head';
import { Cta, Lede, SectionHeading } from '../../components/section';
import { belts } from '../../content/belts';
import { fees } from '../../content/fees';
import { absoluteUrl } from '../../lib/paths';

export const metadata: Metadata = {
  title: 'Belts and grading',
  description: 'The eight belts from white to black at Still Mountain Dojo: minimum time and classes for each rank, junior stripes, kata and grading fees.',
  alternates: { canonical: absoluteUrl('/belts/') },
};

export default function BeltsPage() {
  return (
    <>
      <PageHead kanji="帯" reading="Obi, the belt" art="kasure">
        <PageHead.Title>Eight belts, from white to black</PageHead.Title>
        <PageHead.Intro>
          <p>A belt marks time spent and habits formed, not a fight won. Choose a rank on the ladder to see what it asks of you.</p>
        </PageHead.Intro>
      </PageHead>

      <section className="wrap pb-[clamp(3rem,6vw,5rem)]" aria-label="The belt ladder">
        <BeltExplorer belts={belts} />
      </section>

      <Grading>
        <SectionHeading id="grading-heading">How grading works</SectionHeading>
        <Lede><p>Gradings run four times a year, on a Saturday afternoon after the adult class. Nobody grades without an invitation, and nobody is invited before they are ready.</p></Lede>
        <Grading.Steps>
          <Grading.Step n={1} title="Train the minimum">Each rank has a minimum time at your current belt and a minimum number of classes.</Grading.Step>
          <Grading.Step n={2} title="Receive an invitation">Your instructor tells you when your basics, kata and partner work are ready.</Grading.Step>
          <Grading.Step n={3} title="Grade in front of the class">Basics, your kata and partner work, in front of two black belts and your fellow students.</Grading.Step>
          <Grading.Step n={4} title="Tie the new belt">You are presented the belt at the end of the next class, after the precepts.</Grading.Step>
        </Grading.Steps>
      </Grading>

      <Fees labelledBy="stripes-heading">
        <div>
          <SectionHeading id="stripes-heading">Junior stripes</SectionHeading>
          <Lede>
            <p>Between belts, juniors earn three stripes of tape on the end of their belt: one for basics, one for kata and one for attitude. Three stripes and the minimum time mean they are ready to be considered for grading.</p>
            <p>Teens and adults grade without stripes.</p>
          </Lede>
        </div>
        <div className="mount p-6 sm:p-9">
          <h3 className="font-display text-2xl">Grading fees</h3>
          <dl className="mt-4 grid gap-3">
            <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3"><dt>Each colour belt</dt><dd className="font-mono text-xl tabular-nums">${fees.colourGrading}</dd></div>
            <div className="flex items-baseline justify-between gap-4"><dt>Black belt (shodan)</dt><dd className="font-mono text-xl tabular-nums">${fees.blackBeltGrading}</dd></div>
          </dl>
          <p className="mt-5 text-sm text-muted">The fee includes the new belt. Black belts are embroidered with the student’s name and the seal of the dojo.</p>
        </div>
      </Fees>

      <section className="wrap section-pad text-center" aria-labelledby="beginning-heading">
        <h2 id="beginning-heading" className="mx-auto max-w-[14ch] text-[clamp(2.8rem,8vw,6.5rem)] leading-[1]">A black belt is a beginning</h2>
        <BeltStroke swatch="black" seed={11} className="mx-auto mt-8 h-16 w-[min(30rem,90%)]" />
        <p className="measure mx-auto mt-6 text-[1.1rem] text-muted">Shodan means “first step”. At Still Mountain, every black belt teaches a beginner class before the year is out.</p>
      </section>

      <Cta>
        <div>
          <Cta.Heading>Every black belt began in white</Cta.Heading>
          <Cta.Text>Your first class is free. We reply to your enquiry to suggest a class and confirm a time.</Cta.Text>
        </div>
        <Cta.Action>Request a free trial class</Cta.Action>
      </Cta>
    </>
  );
}
