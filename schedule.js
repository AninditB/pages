// Set this to your Cal.com event link (e.g. 'your-username/intro-call') to go live.
const CAL_LINK = '';

function loadCalEmbed(calLink) {
  (function (C, A, L) {
    let p = function (a, ar) { a.q.push(ar); };
    let d = C.document;
    C.Cal = C.Cal || function () {
      let cal = C.Cal;
      let ar = arguments;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        d.head.appendChild(d.createElement('script')).src = A;
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api = function () { p(api, arguments); };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === 'string') {
          cal.ns[namespace] = cal.ns[namespace] || api;
          p(cal.ns[namespace], ar);
          p(cal, ['initNamespace', namespace]);
        } else {
          p(cal, ar);
        }
        return;
      }
      p(cal, ar);
    };
  })(window, 'https://app.cal.com/embed/embed.js', 'init');

  window.Cal('init', { origin: 'https://cal.com' });
  window.Cal('inline', {
    elementOrSelector: '#cal-embed',
    calLink,
    config: { layout: 'month_view', theme: 'auto' }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('theme-toggle');
  const isDark = localStorage.getItem('theme') === 'dark';

  if (isDark) {
    document.body.classList.add('dark-mode');
    toggle.checked = true;
  }

  toggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode', toggle.checked);
    localStorage.setItem('theme', toggle.checked ? 'dark' : 'light');
  });

  if (CAL_LINK) {
    loadCalEmbed(CAL_LINK);
  } else {
    document.getElementById('cal-embed').innerHTML = `
      <div class="schedule-placeholder">
        <div class="schedule-placeholder-badge">Coming soon</div>
        <h3>Scheduling isn't live yet</h3>
        <p>Direct booking will be available here shortly. In the meantime, reach out by email below and I'll follow up to find a time.</p>
      </div>`;
  }
});

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('nav-toggle');
  const panel = document.getElementById('mobile-nav');
  if (!toggle || !panel) return;

  function openMenu() {
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    panel.querySelector('a')?.focus();
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('click', onOutsideClick);
  }
  function closeMenu({ restoreFocus = true } = {}) {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.removeEventListener('keydown', onKeydown);
    document.removeEventListener('click', onOutsideClick);
    if (restoreFocus) toggle.focus();
  }
  function onKeydown(e) {
    if (e.key === 'Escape') { closeMenu(); return; }
    if (e.key !== 'Tab') return;
    const focusable = panel.querySelectorAll('a[href]');
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function onOutsideClick(e) {
    if (!panel.contains(e.target) && e.target !== toggle) closeMenu({ restoreFocus: false });
  }

  toggle.addEventListener('click', () => panel.hidden ? openMenu() : closeMenu());
  panel.addEventListener('click', (e) => { if (e.target.tagName === 'A') closeMenu({ restoreFocus: false }); });
});
