import PolicyLayout from '../components/PolicyLayout.jsx';

export const meta = {
  title: 'Refund Policy - yogacharyaravinder.com',
  description: 'Refund policy for Satya Sanatan Yog Trust programs, including the 21-Day Fat Loss Challenge.',
  ogImage: '/media/2026/03/Frame-2147224036.webp',
  fonts: ['montserrat'],
};

export default function RefundPolicy() {
  return (
    <PolicyLayout title="Refund Policy" active="refund">
      <p>
        All payments made for Satya Sanatan Yog Trust programs, including the 21-Day Fat Loss Challenge, are non-refundable. By registering,
        you acknowledge and agree to the following:
      </p>
      <ul>
        <li>Once the payment is successfully processed, no refund will be issued, regardless of attendance, personal circumstances, or scheduling conflicts.</li>
        <li>Fees paid to reserve a seat are non-transferable and cannot be adjusted to future programs.</li>
        <li>This policy is in place due to limited seat availability, program logistics, and access to exclusive content prepared in advance.</li>
      </ul>
      <p>Please ensure you are fully committed before completing your payment.</p>
      <p>We appreciate your understanding and cooperation.</p>
    </PolicyLayout>
  );
}
