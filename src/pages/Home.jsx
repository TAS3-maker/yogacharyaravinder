import * as base from '../data/home.js';
import { applyHome } from '../data/cms-apply.js';
import SiteHeader from '../components/SiteHeader.jsx';
import { Footer, WhatsAppFab, Btn } from '../components/Layout.jsx';
import {
  Hero, Stories, PlanLadder, Trial, Schedule, Problems, Pillars,
  Trust, Reels, Coach, Transformations, Testimonials, FaqSection, FinalCta,
} from '../components/Sections.jsx';

export const meta = base.meta;
export const getMeta = (cms) => applyHome(base, cms).meta;

export default function Home({ cms }) {
  const d = applyHome(base, cms);
  return (
    <>
      <a className="skip" href="#content">Skip to content</a>
      <SiteHeader local />
      <main id="content">
        <Hero d={d.hero} />
        <Stories d={d.stories} />
        <PlanLadder d={d.pricing} />
        <Trial d={d.trial} />
        <Schedule d={d.schedule} />
        <Problems d={d.problems} />
        <Pillars d={d.pillars} />
        <Trust d={d.trust} />
        <Reels d={d.reels} />
        <Coach d={d.coach} />
        <Transformations d={d.transformations} />
        <Testimonials d={d.testimonials} />
        <FaqSection d={d.faq} />
        <FinalCta d={d.finalCta} />
      </main>
      <Footer credit />
      <div className="mbar">
        {d.mobileBar.map((b) => <Btn key={b.label} href={b.href} variant={b.variant} shine={b.variant === 'primary'}>{b.label}</Btn>)}
      </div>
      <WhatsAppFab />
    </>
  );
}
