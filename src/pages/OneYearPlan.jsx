// /one-year-yoga-plan/ — landing page for the 1 Year Yoga Membership (no site header, like the live page).
import * as base from '../data/oneYear.js';
import { applyOneYear } from '../data/cms-apply.js';
import { configureCountdown } from '../components/interactive.jsx';
import { OfferBar, Footer, WhatsAppFab } from '../components/Layout.jsx';
import {
  Hero, Problems, OfferCountdown, Pillars, Trust, Reels, Schedule, Coach, Transformations, Testimonials, FaqSection, FinalCta,
} from '../components/Sections.jsx';
import { YearPlan, VideoRow } from '../components/LandingSections.jsx';

export const meta = base.meta;
export const getMeta = (cms) => applyOneYear(base, cms).meta;

export default function OneYearPlan({ cms }) {
  const d = applyOneYear(base, cms);
  configureCountdown(d.countdownCfg);
  return (
    <div className="oy">
      <a className="skip" href="#content">Skip to content</a>
      {d.offerOn && <OfferBar items={d.offerBar} />}
      <main id="content">
        <Hero d={d.hero} />
        {d.offerOn && <OfferCountdown d={d.countdown} />}
        <Problems d={d.problems} />
        <Pillars d={d.pillars} />
        <Trust d={d.trust} />
        <Reels d={d.reels} />
        <YearPlan d={d.pricing} plan={d.plan} />
        {d.offerOn && <OfferCountdown d={d.countdown} />}
        <Schedule d={d.schedule} />
        <Coach d={d.coach} />
        <Transformations d={d.transformations} />
        <VideoRow d={d.videos} />
        <Testimonials d={d.testimonials} />
        <FaqSection d={d.faq} />
        <FinalCta d={d.finalCta} />
      </main>
      <Footer links={d.footerLinks} />
      <WhatsAppFab />
    </div>
  );
}
