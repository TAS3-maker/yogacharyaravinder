import * as d from '../data/discountPricing.js';
import { OfferBar, Footer, StickyOffer, WhatsAppFab } from '../components/Layout.jsx';
import {
  Hero, Stories, Pricing, Trial, Schedule, Problems, OfferCountdown, Pillars,
  Trust, Reels, Coach, Transformations, Testimonials, FaqSection, FinalCta,
} from '../components/Sections.jsx';

export const meta = d.meta;

export default function DiscountPricing() {
  return (
    <>
      <a className="skip" href="#content">Skip to content</a>
      <OfferBar items={d.offerBar} />
      <main id="content">
        <Hero d={d.hero} />
        <Stories d={d.stories} />
        <Pricing d={d.pricing} />
        <Trial d={d.trial} />
        <Schedule d={d.schedule} />
        <Problems d={d.problems} />
        <OfferCountdown d={d.countdown1} />
        <Pillars d={d.pillars} />
        <Trust d={d.trust} />
        <Reels d={d.reels} />
        <OfferCountdown d={d.countdown2} />
        <Coach d={d.coach} />
        <Transformations d={d.transformations} />
        <Testimonials d={d.testimonials} />
        <FaqSection d={d.faq} />
        <FinalCta d={d.finalCta} />
      </main>
      <Footer />
      <StickyOffer {...d.sticky} />
      <WhatsAppFab />
    </>
  );
}
