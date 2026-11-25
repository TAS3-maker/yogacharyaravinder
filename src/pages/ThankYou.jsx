// /thank-you/ — shown after a Razorpay payment (set it as the redirect URL in Razorpay → Payment Buttons).
// Edit the text below freely.
import PolicyLayout from '../components/PolicyLayout.jsx';
import { wa } from '../site.config.js';

export const meta = {
  title: 'Thank You - yogacharyaravinder.com',
  description: 'Thank you for joining live online yoga classes with Yogacharya Ravinder.',
  fonts: ['montserrat'],
};

export default function ThankYou() {
  return (
    <PolicyLayout title="Thank You!">
      <p><strong>Your payment was successful and your spot is confirmed.</strong> 🙏</p>
      <p>Our team will contact you on WhatsApp shortly with your class timings, joining link and next steps.</p>
      <p>Haven't heard from us within a few hours, or have a question? Message us directly:</p>
      <p>
        <a className="btn btn--primary" href={wa("Hi, I just completed my payment for the yoga classes")} target="_blank" rel="noopener">
          Message us on WhatsApp
        </a>
      </p>
    </PolicyLayout>
  );
}
