import * as base from '../data/discountPricing.js';
import { applyDiscount } from '../data/cms-apply.js';
import { configureCountdown } from '../components/interactive.jsx';
import { OfferBar, Footer, StickyOffer, WhatsAppFab } from '../components/Layout.jsx';
import {
  Hero, Stories, Pricing, Trial, Schedule, Problems, OfferCountdown, Pillars,
  Trust, Reels, Coach, Transformations, Testimonials, FaqSection, FinalCta,
} from '../components/Sections.jsx';

export const meta = base.meta;
// SEO title/description from /admin → Landing pages (used when the page is prerendered)
export const getMeta = (cms) => applyDiscount(base, cms).meta;

export default function DiscountPricing({ cms }) {
  const d = applyDiscount(base, cms);
  configureCountdown(d.countdown);
  return (
    <>
      <a className="skip" href="#content">Skip to content</a>
      {d.offerOn && <OfferBar items={d.offerBar} />}
      <main id="content">
        <Hero d={d.hero} />
        <Stories d={d.stories} />
        <Pricing d={d.pricing} />
        <Trial d={d.trial} />
        <Schedule d={d.schedule} />
        <Problems d={d.problems} />
        {d.offerOn && <OfferCountdown d={d.countdown1} />}
        <Pillars d={d.pillars} />
        <Trust d={d.trust} />
        <Reels d={d.reels} />
        {d.offerOn && <OfferCountdown d={d.countdown2} />}
        <Coach d={d.coach} />
        <Transformations d={d.transformations} />
        <Testimonials d={d.testimonials} />
        <FaqSection d={d.faq} />
        <FinalCta d={d.finalCta} />
      </main>
      <Footer />
      {d.offerOn && <StickyOffer {...d.sticky} />}
      <WhatsAppFab />
    </>
  );
}
