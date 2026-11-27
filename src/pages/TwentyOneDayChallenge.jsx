// /21-days-weight-loss-challenge/ — landing page (no site header, like the live page).
import * as base from '../data/challenge21.js';
import { applyChallenge } from '../data/cms-apply.js';
import { configureCountdown } from '../components/interactive.jsx';
import { Footer, WhatsAppFab } from '../components/Layout.jsx';
import { Transformations, Coach } from '../components/Sections.jsx';
import {
  C21Bar, C21Hero, C21Ribbon, C21Fails, C21Transforms, C21Videos, C21Inside, C21Steps, C21Join, C21Faq, C21Final,
} from '../components/LandingSections.jsx';

export const meta = base.meta;
export const getMeta = (cms) => applyChallenge(base, cms).meta;

export default function TwentyOneDayChallenge({ cms }) {
  const d = applyChallenge(base, cms);
  configureCountdown(d.countdown);
  return (
    <div className="c21">
      <a className="skip" href="#content">Skip to content</a>
      {d.offerOn && <C21Bar items={d.bar} />}
      <main id="content">
        <C21Hero d={d.hero} plan={d.plan} />
        <C21Ribbon items={d.ribbon} />
        <C21Fails d={d.fails} />
        <C21Transforms d={d.transforms} />
        <div className="c21-tf"><Transformations d={d.transformations} /></div>
        <C21Videos d={d.videos} />
        <C21Inside d={d.inside} plan={d.plan} />
        <C21Steps d={d.steps} />
        <C21Join d={d.join} plan={d.plan} offerOn={d.offerOn} />
        <div className="sec--mint"><Coach d={d.coach} /></div>
        <C21Faq d={d.faq} />
        <C21Final d={d.final} plan={d.plan} />
      </main>
      <Footer links={d.footerLinks} />
      <WhatsAppFab />
    </div>
  );
}
