// Layout for Privacy / Refund policy pages: site header, green leaf banner, Montserrat body, footer.
import SiteHeader from './SiteHeader.jsx';
import { Footer, WhatsAppFab } from './Layout.jsx';

const LINKS = [
  ['Join Classes', '/#pricing'], ['5-Day Trial', '/#trial'], ['Class Schedule', '/#classes'],
  ['About Instructor', '/#about'], ['FAQ', '/#faq'],
];

export default function PolicyLayout({ title, active, children }) {
  return (
    <>
      <a className="skip" href="#content">Skip to content</a>
      <SiteHeader />
      <main id="content">
        <section className="pbanner">
          <div className="wrap"><h1>{title}</h1></div>
        </section>
        <article className="wrap policy">{children}</article>
      </main>
      <Footer links={LINKS} credit active={active} />
      <WhatsAppFab />
    </>
  );
}
