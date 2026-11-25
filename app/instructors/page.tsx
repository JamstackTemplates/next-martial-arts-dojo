import type { Metadata } from 'next';
import { InstructorList, Teach } from '../../components/inner-sections';
import { PageHead } from '../../components/page-head';
import { Cta, SectionHeading } from '../../components/section';
import { absoluteUrl } from '../../lib/paths';

export const metadata: Metadata = {
  title: 'Instructors',
  description: 'Meet the four instructors at Still Mountain Dojo in Boulder, from founder Daniel Ishikawa (5th dan) to Little Pines lead Priya Natarajan.',
  alternates: { canonical: absoluteUrl('/instructors/') },
};

export default function InstructorsPage() {
  return (
    <>
      <PageHead kanji="師" reading="Shi, the teacher" art="kasure">
        <PageHead.Title>The people who hold the class</PageHead.Title>
        <PageHead.Intro>
          <p>Every instructor trained here or was invited here, and every one still trains twice a week as a student.</p>
        </PageHead.Intro>
      </PageHead>

      <InstructorList />

      <Teach>
        <SectionHeading id="teach-heading">How we teach</SectionHeading>
        <Teach.Steps>
          <Teach.Step title="Warm up" minutes="First 10 minutes">Joints first, then the heart rate. Nobody stretches cold.</Teach.Step>
          <Teach.Step title="Technique" minutes="Then 20 minutes">One idea at a time, slowly, until it is right. Then a little faster.</Teach.Step>
          <Teach.Step title="Partner work" minutes="Then 20 minutes">Pads, drills or kata applications. Always controlled, always bowing in and out.</Teach.Step>
          <Teach.Step title="Quiet sitting" minutes="Last 5 minutes">Kneeling, eyes closed, breath slow. Then the precepts, and bow out.</Teach.Step>
        </Teach.Steps>
      </Teach>

      <Cta>
        <div>
          <Cta.Heading>Train with them for a class</Cta.Heading>
          <Cta.Text>Ask for a free trial class and say who you would like to train with. We reply to confirm a time.</Cta.Text>
        </div>
        <Cta.Action>Request a free trial class</Cta.Action>
      </Cta>
    </>
  );
}
