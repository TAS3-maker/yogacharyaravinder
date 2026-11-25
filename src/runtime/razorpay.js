// Razorpay Payment Buttons: same buttons as the original site, but nothing loads until the visitor
// shows intent (hover / touch / focus on a plan button), so PageSpeed is unaffected.
// Inlined into every page by scripts/prerender.mjs (the plan map below is filled in from SITE.razorpay).
(function (w, d) {
  var PLANS = __PLANS__;
  var SRC = 'https://checkout.razorpay.com/v1/payment-button.js';

  // Hidden <div id="plan-container"><form id="plan-form"><script data-payment_button_id></form></div>,
  // exactly the markup the live site's script builds.
  function mount(plan) {
    var id = plan + '-container';
    var wrap = d.getElementById(id);
    if (wrap) return wrap.querySelector('form');
    wrap = d.createElement('div');
    wrap.id = id;
    wrap.setAttribute('aria-hidden', 'true');
    wrap.style.cssText = 'position:absolute;left:-9999px;top:0;width:1px;height:1px;overflow:hidden';
    var form = d.createElement('form');
    form.id = plan + '-form';
    var s = d.createElement('script');
    s.src = SRC;
    s.async = true;
    s.setAttribute('data-payment_button_id', PLANS[plan]);
    form.appendChild(s);
    wrap.appendChild(form);
    d.body.appendChild(wrap);
    return form;
  }

  function planOf(el) {
    var b = el && el.closest && el.closest('[data-pay]');
    var p = b && b.getAttribute('data-pay');
    return p && PLANS[p] ? { btn: b, plan: p } : null;
  }

  function warm(e) {
    var t = planOf(e.target);
    if (t) mount(t.plan);
  }
  d.addEventListener('pointerover', warm, { passive: true });
  d.addEventListener('touchstart', warm, { passive: true });
  d.addEventListener('focusin', warm);

  d.addEventListener('click', function (e) {
    var t = planOf(e.target);
    if (!t) return;
    e.preventDefault();
    var form = mount(t.plan);
    var btn = t.btn;
    btn.setAttribute('aria-busy', 'true');
    var tries = 0;
    var iv = setInterval(function () {
      var rz = form.querySelector('.razorpay-payment-button a, .razorpay-payment-button button');
      if (rz) {
        clearInterval(iv);
        btn.removeAttribute('aria-busy');
        rz.click();
        return;
      }
      if (++tries > 80) {
        // Razorpay didn't load (blocked / offline): fall back to the button's own link (WhatsApp)
        clearInterval(iv);
        btn.removeAttribute('aria-busy');
        var href = btn.getAttribute('href');
        if (href && href.charAt(0) !== '#') w.open(href, '_blank', 'noopener');
      }
    }, 100);
  });
})(window, document);
