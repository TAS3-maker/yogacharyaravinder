// Loaded by index.html on both static and hydrated pages.
(function (w) {
  const track = (event, ...args) => w.fbq?.('trackSingle', '2340960359692317', event, ...args);

  w.metaPixel = {
    contact: () => track('Contact'),
    initiateCheckout: () => track('InitiateCheckout'),
    purchase(value) {
      if (w.history.state?.metaPurchaseTracked) return;
      w.history.replaceState({ ...w.history.state, metaPurchaseTracked: true }, '');
      track('Purchase', { value, currency: 'INR' });
    },
  };

  w.addEventListener('click', (event) => {
    if (event.defaultPrevented) return;
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const url = new URL(link.href);
    if (url.protocol === 'tel:' || url.protocol === 'whatsapp:' ||
        ['wa.me', 'api.whatsapp.com', 'web.whatsapp.com', 'www.whatsapp.com', 'whatsapp.com'].includes(url.hostname)) {
      w.metaPixel.contact();
    }
  });
})(window);
