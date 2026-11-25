import type { Metadata } from 'next';
import { LevelMark } from '../../components/art/misc';
import { BambooGrove, WashEdge } from '../../components/art/ink';
import { MatStatusLine } from '../../components/mat-status';
import { PageHead } from '../../components/page-head';
import { Cta } from '../../components/section';
import { TimeZoneNote } from '../../components/time-zone-note';
import { TimetableView } from '../../components/timetable-view';
import { programs } from '../../content/programs';
import { levelLabel, sessions } from '../../content/timetable';
import { absoluteUrl } from '../../lib/paths';

export const metadata: Metadata = {
  title: 'Timetable',
  description: 'The weekly karate timetable at Still Mountain Dojo, Boulder: classes Monday to Saturday for Little Pines, Juniors, Teens and Adults.',
  alternates: { canonical: absoluteUrl('/timetable/') },
};

export default function TimetablePage() {
  return (
    <>
      <PageHead kanji="時" reading="Toki, the hour">
        <PageHead.Title>The week on the mat</PageHead.Title>
        <PageHead.Intro>
          <p>Six days of classes on one mat. Choose a programme to see only its classes.</p>
        </PageHead.Intro>
        <PageHead.Extra>
          <MatStatusLine sessions={sessions} className="text-[1.1rem] font-semibold" />
        </PageHead.Extra>
      </PageHead>

      <section className="wrap pb-16" aria-label="Weekly timetable">
        <TimetableView sessions={sessions} programs={programs.map(({ id, name }) => ({ id, name }))} />
        <TimeZoneNote />
      </section>

      <section aria-labelledby="key-heading">
        <WashEdge seed={61} />
        <div className="relative overflow-hidden bg-wash py-12">
          <BambooGrove flip seed={197} className="absolute -right-6 -bottom-4 hidden w-44 opacity-[.085] lg:block" />
          <div className="wrap relative z-10 grid gap-10 md:grid-cols-[1fr_1fr]">
            <div>
              <h2 id="key-heading" className="text-3xl">Who each class is for</h2>
              <ul className="mt-5 grid gap-3">
                {(['all', 'beginners', 'coloured', 'advanced'] as const).map(level => (
                  <li key={level} className="flex items-center gap-3"><LevelMark level={level} className="size-6 shrink-0" />{levelLabel[level]}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl">Holidays and changes</h2>
              <p className="mt-5 text-muted">The dojo closes on US federal holidays. Any change to a class is posted here first, and members hear by email the same day.</p>
            </div>
          </div>
        </div>
        <WashEdge flip seed={63} />
      </section>

      <Cta>
        <div>
          <Cta.Heading>Found a class that fits?</Cta.Heading>
          <Cta.Text>Tell us which one and who would train. We reply to confirm a time for your free first class.</Cta.Text>
        </div>
        <Cta.Action>Request a free trial class</Cta.Action>
      </Cta>
    </>
  );
}
