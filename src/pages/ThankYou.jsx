// /thank-you/ — shown after a Razorpay payment (Razorpay → Payment Buttons → redirect URL).
// Shows checkout details from these sources, in order:
//   1. ?razorpay_payment_id=pay_…  → /api/razorpay-payment reads the payment from Razorpay (amount paid, first name)
//   2. ?data-plan=1-Month&data-price=1499 → display values from the redirect URL
//   3. ?plan=<button key> or the last plan button clicked on this browser → catalog details
// Anything unknown is left out, so the page never shows "Rs.0" or empty quotes.
import { useEffect, useState } from 'react';
import SiteHeader from '../components/SiteHeader.jsx';
import { Footer, WhatsAppFab } from '../components/Layout.jsx';
import { inr } from '../data/cms-apply.js';

export const meta = {
  title: 'Thank You - yogacharyaravinder.com',
  description: 'Thank you for joining live online yoga classes with Yogacharya Ravinder.',
  fonts: ['montserrat'],
};

const LINKS = [
  ['Join Classes', '/#pricing'], ['5-Day Trial', '/#trial'], ['Class Schedule', '/#classes'],
  ['About Instructor', '/#about'], ['FAQ', '/#faq'],
];

function lastPlan() {
  for (const store of ['sessionStorage', 'localStorage']) {
    try {
      const v = JSON.parse(window[store].getItem('yr_last_plan') || 'null');
      if (v?.plan && Date.now() - v.t < 6 * 3600 * 1000) return v.plan;
    } catch {}
  }
  return null;
}

export default function ThankYou({ cms }) {
  const catalog = cms?.catalog || {}; // every plan's name + price, embedded at build time (and refreshed from /admin)
  // Filled after hydration (the prerendered HTML stays generic for every visitor)
  const [checkout, setCheckout] = useState(null);
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const price = q.get('data-price')?.trim() || '';
    const amount = Number(price);
    const name = q.get('data-plan')?.trim() || '';
    const key = q.get('plan')?.trim() || '';
    const id = q.get('razorpay_payment_id') || '';
    const hasPaymentId = /^pay_[A-Za-z0-9]{6,30}$/.test(id);
    const displayAmount = /^\d+(\.\d{1,2})?$/.test(price) && Number.isFinite(amount) && amount > 0 ? amount : null;
    if (!key && !name && displayAmount === null && !hasPaymentId) return;

    setCheckout({
      key: key || lastPlan() || '',
      name,
      amount: displayAmount,
    });
    if (hasPaymentId) {
      fetch('/api/razorpay-payment?id=' + encodeURIComponent(id))
        .then((r) => (r.ok ? r.json() : null))
        .then((p) => p && setPayment({ ...p, id }))
        .catch(() => {});
    }
  }, []);

  // Recomputed when fresh prices arrive from /admin (main.jsx re-renders with new `cms`)
  const plan = checkout?.key ? catalog[checkout.key] : null;
  const info = checkout ? {
    name: checkout.name || plan?.name || '',
    amount: payment?.amount ?? checkout.amount ?? plan?.price ?? null,
    firstName: payment?.firstName || '',
    id: payment?.id || '',
  } : null;

  // Purchase event for GTM (once per payment / plan per session)
  const trackedAmount = payment?.amount ?? plan?.price;
  const trackedName = plan?.name || (payment ? checkout?.name : '') || 'Yoga plan';
  const paymentId = payment?.id;
  useEffect(() => {
    if (!trackedAmount) return;
    const txn = paymentId || `tyk_${trackedName}_${new Date().toDateString()}`;
    try { if (sessionStorage.getItem('yr_tracked_' + txn)) return; sessionStorage.setItem('yr_tracked_' + txn, '1'); } catch {}
    (window.dataLayer = window.dataLayer || []).push({
      event: 'purchase',
      ecommerce: { transaction_id: txn, value: trackedAmount, currency: 'INR', items: [{ item_name: trackedName, price: trackedAmount, quantity: 1 }] },
    });
  }, [trackedAmount, trackedName, paymentId]);

  return (
    <>
      <a className="skip" href="#content">Skip to content</a>
      <SiteHeader />
      <main id="content">
        <section className="pbanner">
          <div className="wrap"><h1>Thank You{info?.firstName ? `, ${info.firstName}` : ''}! Your Journey <span className="pbanner__w">Begins Now.</span></h1></div>
        </section>
        <article className="wrap tyk">
          <p className="tyk__lead">You’re officially enrolled{info?.name ? <> in our “{info.name}”</> : ''}</p>
          <p>
            {info?.amount
              ? <>Your payment of <b>{inr(info.amount)}</b> has been received successfully, and your spot is confirmed.</>
              : <>Your payment has been received successfully, and your spot is confirmed.</>}
          </p>
          <p>Take a moment to breathe deeply — you’ve just taken a beautiful step toward a healthier, more balanced life.</p>
          {info?.id && <p className="tyk__ref">Payment ID: {info.id}</p>}
        </article>
      </main>
      <Footer links={LINKS} credit />
      <WhatsAppFab />
    </>
  );
}
