import PolicyLayout from '../components/PolicyLayout.jsx';

export const meta = {
  title: 'Privacy Policy - yogacharyaravinder.com',
  description: 'Privacy policy of Satya Sanatan Yog Trust (Yogacharya Ravinder): what details we collect, how we use them, and our third-party disclaimer.',
  ogImage: '/media/2026/03/Frame-2147224036.webp',
  fonts: ['montserrat'],
};

export default function PrivacyPolicy() {
  return (
    <PolicyLayout title="Privacy Policy" active="privacy">
      <h2>Your Privacy Matters:</h2>
      <p>
        At <strong>Satya Sanatan Yog Trust</strong>, we respect your privacy. We collect basic details (name, email, phone) only to provide
        you with updates or services related to our programs.
      </p>
      <ul className="tight">
        <li>We <strong>do</strong> not share or sell your data to third parties.</li>
        <li>Information shared via forms, email, or phone is used only to respond to your queries or deliver our services.</li>
      </ul>
      <h2>Third-Party Disclaimer:</h2>
      <p>We are not responsible for any third-party platforms, offers, or content, including YouTube links used for live sessions.</p>
      <h2>Website Usage:</h2>
      <p>We may use general browsing data to improve site performance. No personal data is shared externally.</p>
      <h2>Policy Changes:</h2>
      <p>This policy may be updated without prior notice.</p>
    </PolicyLayout>
  );
}
