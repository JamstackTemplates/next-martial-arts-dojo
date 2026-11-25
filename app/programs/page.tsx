import type { Metadata } from 'next';
import { Faq, Fees, ProgramList } from '../../components/inner-sections';
import { PageHead } from '../../components/page-head';
import { Cta, Lede, SectionHeading } from '../../components/section';
import { fees } from '../../content/fees';
import { absoluteUrl } from '../../lib/paths';

export const metadata: Metadata = {
  title: 'Programs by age',
  description: 'Karate for Little Pines (4–6), Juniors (7–12), Teens (13–17) and Adults in Boulder: what each class works on, when it runs and what it costs.',
  alternates: { canonical: absoluteUrl('/programs/') },
};

export default function ProgramsPage() {
  return (
    <>
      <PageHead kanji="道" reading="Dō, the way">
        <PageHead.Title>Four programmes, grown by age</PageHead.Title>
        <PageHead.Intro>
          <p>Children train with children their own age; adults train together whatever their rank. Every programme follows the same belt path and the same precepts.</p>
        </PageHead.Intro>
      </PageHead>

      <ProgramList />

      <Fees>
        <div>
          <SectionHeading id="fees-heading">Fees at a glance</SectionHeading>
          <Lede>
            <p>Monthly fees cover every class in your programme. There is no contract: give us a month’s notice to stop.</p>
            <p>The trial class is free and needs no uniform. Families with more than one member training take ${fees.familyDiscountPerMonth} off each extra membership.</p>
          </Lede>
        </div>
        <Fees.Ledger />
      </Fees>

      <Faq>
        <SectionHeading id="faq-heading">What parents ask</SectionHeading>
        <Faq.List>
          <Faq.Item question="Can I watch my child’s class?">Yes. There is a bench along the back wall. We only ask that phones stay silent and siblings stay off the mat.</Faq.Item>
          <Faq.Item question="What if we miss a class?">Make it up at any other class in the same programme that week. Saturday’s family class counts for everyone.</Faq.Item>
          <Faq.Item question="Is it safe?">Juniors use pads, not each other, for contact. Teens spar only with gloves, guards and an instructor watching every round.</Faq.Item>
          <Faq.Item question="When is a child ready to start?">When they can follow a two-step instruction and stand apart from you for 40 minutes. For most, that is around four.</Faq.Item>
        </Faq.List>
      </Faq>

      <Cta>
        <div>
          <Cta.Heading>Try a class before you choose</Cta.Heading>
          <Cta.Text>Tell us the age and the days that suit you. We reply to suggest a class and confirm a time.</Cta.Text>
        </div>
        <Cta.Action>Request a free trial class</Cta.Action>
      </Cta>
    </>
  );
}
