// /yoga-classes-for-weight-loss/ — SEO landing page with the main site header.
import * as base from '../data/weightLoss.js';
import { applyWeightLoss } from '../data/cms-apply.js';
import SiteHeader from '../components/SiteHeader.jsx';
import { Footer, WhatsAppFab } from '../components/Layout.jsx';
import { PlanLadder, Reels, Trust } from '../components/Sections.jsx';
import {
  WlHero, WlProblem, WlSplit, WlConcerns, WlScience, WlTable, WlProcess, WlAbout, WlStories, WlReviews, WlBlog, WlFaq,
} from '../components/LandingSections.jsx';

export const meta = base.meta;
export const getMeta = (cms) => applyWeightLoss(base, cms).meta;

const LINKS = [
  ['Join Classes', '#pricing'], ['5-Day Trial', '/discount-pricing/#trial'], ['Class Schedule', '/#classes'],
  ['About Instructor', '#about'], ['FAQ', '#faq'],
];

export default function WeightLossClasses({ cms }) {
  const d = applyWeightLoss(base, cms);
  return (
    <div className="wl">
      <a className="skip" href="#content">Skip to content</a>
      <SiteHeader />
      <main id="content">
        <WlHero d={d.hero} />
        <WlProblem d={d.problem} />
        <WlSplit d={d.need} />
        <WlConcerns d={d.concerns} />
        <WlScience d={d.science} />
        <div id="videos"><Reels d={d.reels} /></div>
        <WlTable d={d.classTypes} />
        <WlProcess d={d.process} />
        <div className="wl-pricing"><PlanLadder d={{ ...d.pricing, eyebrow: 'PRICING', recorded: null }} /></div>
        <WlSplit d={d.whyUs} tone="mint" />
        <WlAbout d={d.about} />
        <WlStories d={d.stories} />
        <Trust d={d.trust} />
        <WlReviews d={d.reviews} />
        <WlBlog d={d.blog} posts={cms?.posts} />
        <WlFaq d={d.faq} />
      </main>
      <Footer links={LINKS} />
      <WhatsAppFab />
    </div>
  );
}
